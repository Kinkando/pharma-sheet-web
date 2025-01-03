import axios from 'axios';
import { config } from '@/config';
import { JWT } from '@/core/@types';

const instance = axios.create({
  baseURL: config.apiHost,
  timeout: 1000 * 30,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function verifyToken(idToken: string) {
  const { data } = await instance.request<JWT>({
    url: '/auth/token/verify',
    method: 'POST',
    data: { idToken },
    headers: {
      'X-Api-Key': config.apiKey,
    },
  });
  return data;
}

export async function refreshToken(refreshToken: string) {
  const { data } = await instance.request<JWT>({
    url: '/auth/token/refresh',
    method: 'POST',
    data: { refreshToken },
    headers: {
      'X-Api-Key': config.apiKey,
    },
  });
  return data;
}

export async function revokeToken() {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return;
    }
    await instance.request({
      url: '/auth/token/revoke',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
}
