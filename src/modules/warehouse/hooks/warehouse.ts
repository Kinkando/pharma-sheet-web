import { useRouter } from 'next/navigation';
import { useCallback, useContext, useState } from 'react';
import { WarehouseDetail, WarehouseGroup } from '@/core/@types';
import { GlobalContext } from '@/core/context';
import {
  cancelJoinWarehouse,
  getWarehouseDetails,
  joinWarehouse,
} from '@/core/repository';

export function useWarehouse() {
  const { alert } = useContext(GlobalContext);
  const { replace } = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [warehouseDetails, setWarehouseDetails] = useState<WarehouseDetail[]>(
    [],
  );

  const fetchWarehouseDetails = useCallback(
    async (group: WarehouseGroup, search: string) => {
      try {
        repalceQueryParams(group, search);
        setIsLoading(true);
        const { data } = await getWarehouseDetails({
          limit: 999,
          page: 1,
          search: search.trim() || undefined,
          group,
        });
        setWarehouseDetails(data || []);
      } catch (error) {
        alert({ message: `${error}`, severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const join = useCallback(
    async (warehouseID: string, group: WarehouseGroup, search: string) => {
      try {
        setIsLoading(true);
        await joinWarehouse(warehouseID);
        await fetchWarehouseDetails(group, search);
      } catch (error) {
        alert({ message: `${error}`, severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const cancelJoin = useCallback(
    async (warehouseID: string, group: WarehouseGroup, search: string) => {
      try {
        setIsLoading(true);
        await cancelJoinWarehouse(warehouseID);
        await fetchWarehouseDetails(group, search);
      } catch (error) {
        alert({ message: `${error}`, severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const repalceQueryParams = (group: WarehouseGroup, search: string) => {
    const params = new URLSearchParams();
    if (search?.trim()) {
      params.set('search', search.trim());
    }
    params.set(
      'group',
      group === WarehouseGroup.OTHER_WAREHOUSE_PENDING ? 'pending' : 'join',
    );
    replace(`/warehouse?${params.toString()}`);
  };

  return {
    warehouseDetails,
    fetchWarehouseDetails,
    isLoading,
    join,
    cancelJoin,
  };
}
