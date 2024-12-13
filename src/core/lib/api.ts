import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  HttpStatusCode,
} from 'axios';
import config from '@/config/config';
import { APIResponse } from '@/core/@types/api';
import { refreshToken } from '@/core/repository/authen';

const axiosController: Controller = {};

interface Controller {
  [id: string]: AbortController;
}

interface AxiosRequestCustomConfig extends AxiosRequestConfig {
  signalID?: string;
  _isRefreshing?: boolean;
}

const instance = axios.create({
  baseURL: config.apiHost,
  timeout: 1000 * 30,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  async (config) => {
    if (!config.headers) {
      config.headers = {
        'Content-Type': 'application/json',
      } as AxiosRequestHeaders;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error(error);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = { ...error.config } as AxiosRequestCustomConfig;
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      if (config._isRefreshing) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(error);
      }
      config._isRefreshing = true;

      const token = localStorage.getItem('refreshToken');
      if (!token) {
        return Promise.reject(error);
      }
      const jwt = await refreshToken(token);
      localStorage.setItem('accessToken', jwt.accessToken);
      localStorage.setItem('refreshToken', jwt.refreshToken);
      return instance.request(config);
    }

    return Promise.reject(error);
  },
);

export default async function client<T>(
  config: AxiosRequestCustomConfig,
): Promise<APIResponse<T>> {
  const controller = new AbortController();
  if (!config.signal) {
    config.signal = controller.signal;
  }

  try {
    if (config?.signalID) {
      if (axiosController[config.signalID]) {
        axiosController[config.signalID].abort();
      }
      axiosController[config.signalID] = controller;
    }

    try {
      return await instance.request<T>({ ...config });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return {
          ...error.response,
          error: JSON.stringify(error.response.data),
        };
      }
      return Promise.reject(error);
    }
  } catch (error) {
    if (!axios.isCancel(error)) {
      const err = error as AxiosError<{ error: string }>;
      return Promise.reject(err);
    }
    return Promise.reject(error);
  }
}
