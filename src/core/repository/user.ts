import { HttpStatusCode } from 'axios';
import { User } from '@/core/@types';
import { client } from '@/core/lib';

export async function getUser() {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return;
  }
  const { data, status, error } = await client<User>({
    url: '/user',
    method: 'GET',
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}
