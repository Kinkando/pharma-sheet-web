import { HttpStatusCode } from 'axios';
import { Warehouse } from '@/core/@types/warehouse';
import client from '@/core/lib/api';

export async function getWarehouses() {
  const { data, status, error } = await client<Warehouse[]>({
    url: '/warehouse',
    method: 'GET',
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}
