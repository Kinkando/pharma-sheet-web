import { HttpStatusCode } from 'axios';
import {
  CreateWarehouseUser,
  DeleteWarehouseUser,
  UpdateWarehouseUser,
  Warehouse,
  WarehouseUser,
} from '@/core/@types';
import { client } from '@/core/lib';

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

export async function getWarehouseUsers(warehouseID: string) {
  const { data, status, error } = await client<WarehouseUser[]>({
    url: `/warehouse/${warehouseID}/user`,
    method: 'GET',
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}

export async function createWarehouseUser(req: CreateWarehouseUser) {
  return await client<WarehouseUser[]>({
    url: `/warehouse/${req.warehouseID}/user`,
    method: 'POST',
    data: {
      email: req.email,
      role: req.role,
    },
  });
}

export async function updateWarehouseUser(req: UpdateWarehouseUser) {
  return await client({
    url: `/warehouse/${req.warehouseID}/user/${req.userID}/${req.role}`,
    method: 'PUT',
  });
}

export async function deleteWarehouseUser(req: DeleteWarehouseUser) {
  return await client({
    url: `/warehouse/${req.warehouseID}/user/${req.userID}`,
    method: 'DELETE',
  });
}
