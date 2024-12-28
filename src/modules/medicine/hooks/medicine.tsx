import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FilterMedicine,
  Medicine,
  OrderSequence,
  Warehouse,
} from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { getMedicines, getWarehouses, syncMedicine } from '@/core/repository';
import { HttpStatusCode } from 'axios';

export function useMedicine(warehouseID: string | null) {
  const { alert } = useContext(GlobalContext);

  const [warehouse, setWarehouse] = useState<Warehouse>();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const { replace } = useRouter();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = useCallback(
    async (currentWarehouseID?: string) => {
      try {
        const data = await getWarehouses();
        setWarehouses(data ?? []);
        if (!data || !data.length) {
          return;
        }
        setWarehouse(
          warehouseID || currentWarehouseID
            ? (data.find((warehouse) =>
                currentWarehouseID
                  ? warehouse.warehouseID === currentWarehouseID
                  : warehouse.warehouseID === warehouseID,
              ) ?? data[0])
            : data[0],
        );
      } catch (error) {
        alert({ message: `${error}`, severity: 'error' });
      }
    },
    [warehouseID],
  );

  const fetchMedicine = async (filter: FilterMedicine) => {
    try {
      const { data } = await getMedicines(filter);
      setMedicines(data ?? []);
      replaceQueryParams(filter);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    }
  };

  const syncGoogleSheet = async (warehouseID: string, link: string) => {
    try {
      const { status } = await syncMedicine(warehouseID, link);
      if (status !== HttpStatusCode.NoContent) {
        throw new Error('ซิงค์ข้อมูลยาไม่สำเร็จ');
      }
      alert({ message: 'ซิงค์ข้อมูลยาสำเร็จ', severity: 'success' });
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
      throw error;
    }
  };

  const replaceQueryParams = async ({
    warehouseID,
    search,
    sort,
  }: FilterMedicine) => {
    const params = new URLSearchParams();
    params.set('warehouseID', warehouseID);
    if (search?.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }
    if (sort) {
      const [sortBy, order] = sort.split(' ');
      params.set('sortBy', sortBy);
      params.set('order', order as OrderSequence);
    }
    replace(`?${params.toString()}`);
  };

  return {
    warehouses,
    fetchWarehouses,
    medicines,
    fetchMedicine,
    warehouse,
    setWarehouse,
    syncGoogleSheet,
  };
}
