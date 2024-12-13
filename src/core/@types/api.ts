import type { AxiosResponse } from 'axios';

export interface APIResponse<T> extends AxiosResponse<T, T> {
  error?: string;
}
