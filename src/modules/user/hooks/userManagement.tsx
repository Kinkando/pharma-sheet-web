import { HttpStatusCode } from 'axios';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import {
  CreateWarehouseUser,
  DeleteWarehouseUser,
  GetWarehouseUsersResponse,
  UpdateWarehouseUser,
  WarehouseUser,
  WarehouseUserStatus,
} from '@/core/@types';
import { GlobalContext } from '@/core/context';
import {
  createWarehouseUser,
  deleteWarehouseUser,
  getWarehouseUsers,
  leaveWarehouse,
  updateWarehouseUser,
} from '@/core/repository';

export function useUserManagement(
  warehouseID: string,
  onFetchUsers: (result: GetWarehouseUsersResponse) => void,
) {
  const { alert } = useContext(GlobalContext);
  const { push, replace } = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [warehouseUsers, setWarehouseUsers] = useState<WarehouseUser[]>([]);

  useEffect(() => {
    if (warehouseID) {
      fetchWarehouseUsers(warehouseID);
    }
  }, [warehouseID]);

  const fetchWarehouseUsers = async (warehouseID: string) => {
    setIsLoading(true);
    try {
      replaceQueryParams();
      const result = await getWarehouseUsers(warehouseID, {
        page: 1,
        limit: 999,
        status: WarehouseUserStatus.APPROVED,
      });
      setWarehouseUsers(result.data ?? []);
      onFetchUsers(result);
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

  const leaveWarehouseUser = async (warehouseID: string) => {
    setIsLoading(true);
    try {
      const { status } = await leaveWarehouse(warehouseID);
      if (status !== HttpStatusCode.NoContent) {
        throw Error('Leave warehouse failed, please try again!');
      }
      push(`/`);
      setIsLoading(false);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
      setIsLoading(false);
      throw error;
    }
  };

  const replaceQueryParams = () => {
    const params = new URLSearchParams(location.search);
    params.set('warehouseID', warehouseID);
    params.set('tab', 'member');
    replace(`/user?${params.toString()}`);
  };

  return {
    isLoading,
    warehouseUsers,
    addWarehouseUser,
    editWarehouseUser,
    removeWarehouseUser,
    leaveWarehouseUser,
  };
}
