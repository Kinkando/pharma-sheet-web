import { WarehouseDetail } from '@/core/@types';
import { GlobalContext } from '@/core/context';
import {
  createWarehouse,
  createWarehouseLocker,
  deleteWarehouse,
  deleteWarehouseLocker,
  getWarehouseDetails,
  updateWarehouse,
  updateWarehouseLocker,
} from '@/core/repository';
import { HttpStatusCode } from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';

export function useWarehouseDetail(search?: string) {
  const { alert } = useContext(GlobalContext);
  const [warehouseDetails, setWarehouseDetails] = useState<WarehouseDetail[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWarehouseDetails();
  }, [search]);

  const fetchWarehouseDetails = useCallback(async () => {
    try {
      const data = await getWarehouseDetails({ limit: 999, page: 1, search });
      setWarehouseDetails(data?.data ?? []);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    }
  }, [search]);

  const addWarehouse = useCallback(async (warehouseName: string) => {
    setIsLoading(true);
    try {
      const { status } = await createWarehouse(warehouseName);
      if (status !== HttpStatusCode.Ok) {
        throw Error('unable to add new warehouse');
      }
      await fetchWarehouseDetails();
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const editWarehouse = useCallback(
    async (warehouseID: string, warehouseName: string) => {
      setIsLoading(true);
      try {
        const { status } = await updateWarehouse(warehouseID, warehouseName);
        if (status !== HttpStatusCode.NoContent) {
          throw Error('unable to edit warehouse');
        }
        await fetchWarehouseDetails();
      } catch (error) {
        alert({ message: `${error}`, severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const removeWarehouse = useCallback(async (warehouseID: string) => {
    setIsLoading(true);
    try {
      const { status } = await deleteWarehouse(warehouseID);
      if (status !== HttpStatusCode.NoContent) {
        throw Error('unable to remove warehouse');
      }
      await fetchWarehouseDetails();
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addLocker = useCallback(
    async (warehouseID: string, lockerName: string) => {
      setIsLoading(true);
      try {
        const { status } = await createWarehouseLocker(warehouseID, lockerName);
        if (status !== HttpStatusCode.Ok) {
          throw Error('unable to add new locker');
        }
        await fetchWarehouseDetails();
      } catch (error) {
        alert({ message: `${error}`, severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const editLocker = useCallback(
    async (warehouseID: string, lockerID: string, lockerName: string) => {
      setIsLoading(true);
      try {
        const { status } = await updateWarehouseLocker(
          warehouseID,
          lockerID,
          lockerName,
        );
        if (status !== HttpStatusCode.NoContent) {
          throw Error('unable to edit locker');
        }
        await fetchWarehouseDetails();
      } catch (error) {
        alert({ message: `${error}`, severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const removeLocker = useCallback(
    async (warehouseID: string, lockerID: string) => {
      setIsLoading(true);
      try {
        const { status } = await deleteWarehouseLocker(warehouseID, lockerID);
        if (status !== HttpStatusCode.NoContent) {
          throw Error('unable to remove locker');
        }
        await fetchWarehouseDetails();
      } catch (error) {
        alert({ message: `${error}`, severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    warehouseDetails,
    addWarehouse,
    editWarehouse,
    removeWarehouse,
    addLocker,
    editLocker,
    removeLocker,
  };
}
