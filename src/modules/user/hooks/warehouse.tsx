import { useContext, useEffect, useState } from 'react';
import {
  CreateWarehouseUser,
  DeleteWarehouseUser,
  UpdateWarehouseUser,
  Warehouse,
  WarehouseUser,
} from '@/core/@types';
import { GlobalContext } from '@/core/context';
import {
  createWarehouseUser,
  deleteWarehouseUser,
  getWarehouses,
  getWarehouseUsers,
  updateWarehouseUser,
} from '@/core/repository';
import { HttpStatusCode } from 'axios';

export function useWarehouse(warehouseID: string) {
  const { alert } = useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [warehouseUsers, setWarehouseUsers] = useState<WarehouseUser[]>([]);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (warehouseID) {
      fetchWarehouseUsers(warehouseID);
    }
  }, [warehouseID]);

  const fetchWarehouses = async () => {
    try {
      const data = await getWarehouses();
      setWarehouses(data ?? []);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    }
  };

  const fetchWarehouseUsers = async (warehouseID: string) => {
    setIsLoading(true);
    try {
      const data = await getWarehouseUsers(warehouseID);
      setWarehouseUsers(data ?? []);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const addWarehouseUser = async (req: CreateWarehouseUser) => {
    setIsLoading(true);
    try {
      const { status } = await createWarehouseUser(req);
      if (status !== HttpStatusCode.NoContent) {
        throw Error(
          'This user is already in this warehouse, please try again!',
        );
      }
      await fetchWarehouseUsers(req.warehouseID);
      setIsLoading(false);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
      setIsLoading(false);
      throw error;
    }
  };

  const editWarehouseUser = async (req: UpdateWarehouseUser) => {
    setIsLoading(true);
    try {
      const { status } = await updateWarehouseUser(req);
      if (status !== HttpStatusCode.NoContent) {
        throw Error('Edit role to user failed, please try again!');
      }
      await fetchWarehouseUsers(req.warehouseID);
      setIsLoading(false);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
      setIsLoading(false);
      throw error;
    }
  };

  const removeWarehouseUser = async (req: DeleteWarehouseUser) => {
    setIsLoading(true);
    try {
      const { status } = await deleteWarehouseUser(req);
      if (status !== HttpStatusCode.NoContent) {
        throw Error('Remove user failed, please try again!');
      }
      await fetchWarehouseUsers(req.warehouseID);
      setIsLoading(false);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
      setIsLoading(false);
      throw error;
    }
  };

  return {
    isLoading,
    warehouses,
    warehouseUsers,
    addWarehouseUser,
    editWarehouseUser,
    removeWarehouseUser,
  };
}
