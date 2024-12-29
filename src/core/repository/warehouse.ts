import { HttpStatusCode } from 'axios';
import {
  CreateWarehouseUser,
  Data,
  DeleteWarehouseUser,
  FilterWarehouseDetail,
  FilterWarehouseUser,
  SyncMedicineMetadata,
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

export async function getWarehouseUsers(
  warehouseID: string,
  filter: FilterWarehouseUser,
) {
  const { data, status, error } = await client<Data<WarehouseUser>>({
    url: `/warehouse/${warehouseID}/user`,
    method: 'GET',
    params: filter,
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}

export async function createWarehouse(warehouseName: string) {
  return await client<{ warehouseID: string }>({
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
  return await client<{ lockerID: string }>({
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

export async function joinWarehouse(warehouseID: string) {
  return await client({
    url: `/warehouse/${warehouseID}/user/join`,
    method: 'POST',
  });
}

export async function leaveWarehouse(warehouseID: string) {
  return await client({
    url: `/warehouse/${warehouseID}/user/leave`,
    method: 'POST',
  });
}

export async function approveUser(warehouseID: string, userID: string) {
  return await client({
    url: `/warehouse/${warehouseID}/user/${userID}/approve`,
    method: 'PATCH',
  });
}

export async function rejectUser(warehouseID: string, userID: string) {
  return await client({
    url: `/warehouse/${warehouseID}/user/${userID}/reject`,
    method: 'PATCH',
  });
}

export async function getSyncMedicineMetadata(
  warehouseID: string,
  url: string,
) {
  return await client<SyncMedicineMetadata>({
    url: `/warehouse/${warehouseID}/sync/medicine`,
    method: 'GET',
    params: { url },
  });
}

export async function syncMedicine(warehouseID: string, url: string) {
  return await client({
    url: `/warehouse/${warehouseID}/sync/medicine`,
    method: 'PUT',
    data: { url },
  });
}
