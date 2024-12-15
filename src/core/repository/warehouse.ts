import { HttpStatusCode } from 'axios';
import {
  CreateWarehouseUser,
  Data,
  DeleteWarehouseUser,
  FilterWarehouseDetail,
  UpdateWarehouseUser,
  Warehouse,
  WarehouseDetail,
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

export async function getWarehouseDetails(filter: FilterWarehouseDetail) {
  const { data, status, error } = await client<Data<WarehouseDetail>>({
    url: `/warehouse/detail`,
    method: 'GET',
    params: filter,
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

export async function createWarehouse(warehouseName: string) {
  return await client({
    url: `/warehouse`,
    method: 'POST',
    data: { warehouseName },
  });
}

export async function updateWarehouse(
  warehouseID: string,
  warehouseName: string,
) {
  return await client({
    url: `/warehouse/${warehouseID}`,
    method: 'PATCH',
    data: { warehouseName },
  });
}

export async function deleteWarehouse(warehouseID: string) {
  return await client({
    url: `/warehouse/${warehouseID}`,
    method: 'DELETE',
  });
}

export async function createWarehouseLocker(
  warehouseID: string,
  lockerName: string,
) {
  return await client({
    url: `/warehouse/${warehouseID}/locker`,
    method: 'POST',
    data: { lockerName },
  });
}

export async function updateWarehouseLocker(
  warehouseID: string,
  lockerID: string,
  lockerName: string,
) {
  return await client({
    url: `/warehouse/${warehouseID}/locker/${lockerID}`,
    method: 'PATCH',
    data: { lockerName },
  });
}

export async function deleteWarehouseLocker(
  warehouseID: string,
  lockerID: string,
) {
  return await client({
    url: `/warehouse/${warehouseID}/locker/${lockerID}`,
    method: 'DELETE',
  });
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
