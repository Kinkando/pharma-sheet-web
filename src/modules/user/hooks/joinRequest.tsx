import { HttpStatusCode } from 'axios';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import {
  GetWarehouseUsersResponse,
  WarehouseUser,
  WarehouseUserStatus,
} from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { approveUser, getWarehouseUsers, rejectUser } from '@/core/repository';

export function useJoinRequest(
  warehouseID: string,
  onFetchUsers: (result: GetWarehouseUsersResponse) => void,
) {
  const { alert } = useContext(GlobalContext);
  const { replace } = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [warehouseUsers, setWarehouseUsers] = useState<WarehouseUser[]>([]);

  useEffect(() => {
    fetchWarehouseUsers(warehouseID);
  }, [warehouseID]);

  const fetchWarehouseUsers = async (warehouseID: string) => {
    setIsLoading(true);
    try {
      repalceQueryParams();
      const result = await getWarehouseUsers(warehouseID, {
        page: 1,
        limit: 999,
        status: WarehouseUserStatus.PENDING,
      });
      setWarehouseUsers(result.data ?? []);
      onFetchUsers(result);
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

  const repalceQueryParams = () => {
    const params = new URLSearchParams();
    params.set('warehouseID', warehouseID);
    params.set('tab', 'join-request');
    replace(`/user?${params.toString()}`);
  };

  return {
    isLoading,
    warehouseUsers,
    approve,
    reject,
  };
}
