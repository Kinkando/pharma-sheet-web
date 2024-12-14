import { HttpStatusCode } from 'axios';
import { Data, FilterMedicine, Medicine } from '@/core/@types';
import { client } from '@/core/lib';

export async function getMedicines(filter: FilterMedicine) {
  const { data, status, error } = await client<Data<Medicine>>({
    url: '/medicine',
    method: 'GET',
    params: filter,
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}