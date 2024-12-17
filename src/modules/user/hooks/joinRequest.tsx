import { WarehouseUser, WarehouseUserStatus } from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { approveUser, getWarehouseUsers, rejectUser } from '@/core/repository';
import { HttpStatusCode } from 'axios';
import { useContext, useEffect, useState } from 'react';

export function useJoinRequest(warehouseID: string) {
  const { alert } = useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState(false);
  const [warehouseUsers, setWarehouseUsers] = useState<WarehouseUser[]>([]);

  useEffect(() => {
    fetchWarehouseUsers(warehouseID);
  }, [warehouseID]);

  const fetchWarehouseUsers = async (warehouseID: string) => {
    setIsLoading(true);
    try {
      const { data } = await getWarehouseUsers(warehouseID, {
        page: 1,
        limit: 999,
        status: WarehouseUserStatus.PENDING,
      });
      setWarehouseUsers(data ?? []);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const approve = async (warehouseID: string, userID: string) => {
    setIsLoading(true);
    try {
      const { status } = await approveUser(warehouseID, userID);
      if (status !== HttpStatusCode.NoContent) {
        throw Error(
          'Unable to approve this user into warehouse, please try again!',
        );
      }
      await fetchWarehouseUsers(warehouseID);
      setIsLoading(false);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
      setIsLoading(false);
      throw error;
    }
  };

  const reject = async (warehouseID: string, userID: string) => {
    setIsLoading(true);
    try {
      const { status } = await rejectUser(warehouseID, userID);
      if (status !== HttpStatusCode.NoContent) {
        throw Error(
          'Unable to reject this user into warehouse, please try again!',
        );
      }
      await fetchWarehouseUsers(warehouseID);
      setIsLoading(false);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
      setIsLoading(false);
      throw error;
    }
  };

  return {
    isLoading,
    warehouseUsers,
    approve,
    reject,
  };
}
