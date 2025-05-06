import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AddBlisterDateRequest,
  DeleteBlisterDateRequest,
  FilterMedicineHouse,
  FilterRotationDateHistory,
  MedicineView,
  OrderSequence,
  RotationDateHistoryGroup,
  Warehouse,
} from '@/core/@types';
import { GlobalContext } from '@/core/context';
import {
  addBlisterDate,
  deleteBlisterDate,
  getMedicineWithBrands,
  getRotationDateHistory,
  getWarehouses,
} from '@/core/repository';
import { AxiosError, HttpStatusCode, isCancel } from 'axios';

export function useRotationDate(warehouseID: string | null) {
  const { alert } = useContext(GlobalContext);

  const [isFetching, setIsFetching] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [warehouse, setWarehouse] = useState<Warehouse>();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [medicines, setMedicines] = useState<MedicineView[]>([]);
  const [histories, setHistories] = useState<RotationDateHistoryGroup[]>([]);
  const { replace } = useRouter();

  useEffect(() => {
    fetchWarehouses();
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const { data } = await getMedicineWithBrands({
        limit: 9999,
        page: 1,
      });
      setMedicines(data ?? []);
    } catch (error) {
      if (error instanceof AxiosError) {
        alert({ message: `${error?.response?.data}`, severity: 'error' });
      } else {
        alert({ message: `${error}`, severity: 'error' });
      }
    }
  };

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
      } finally {
        setIsMounted(true);
      }
    },
    [warehouseID],
  );

  const fetchHistory = async (filter: FilterRotationDateHistory) => {
    setIsFetching(true);
    try {
      filter.search = filter.search?.trim() || undefined;
      replaceQueryParams(filter);
      const { data } = await getRotationDateHistory(filter);
      setHistories(data ?? []);
    } catch (error) {
      if (isCancel(error)) {
        return;
      }
      if (error instanceof AxiosError) {
        alert({ message: `${error?.response?.data}`, severity: 'error' });
      } else {
        alert({ message: `${error}`, severity: 'error' });
      }
    } finally {
      setIsFetching(false);
    }
  };

  const addHistory = async (req: AddBlisterDateRequest) => {
    try {
      const { status, error } = await addBlisterDate(req);
      if (status === HttpStatusCode.Conflict) {
        throw new Error('วันที่เปลี่ยนแผงยานี้มีอยู่ในระบบแล้ว');
      }
      if (status !== HttpStatusCode.Ok) {
        throw error;
      }
      alert({
        message: 'เพิ่มข้อมูลวันที่เปลี่ยนแผงยาสำเร็จ',
        severity: 'success',
      });
    } catch (error) {
      let err = `${error}`.replaceAll('Error: ', '');
      try {
        if (JSON.parse(err)?.error) {
          err = `${JSON.parse(err).error}`;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}
      alert({ message: err, severity: 'error' });
      throw error;
    }
  };

  const deleteHistory = async (req: DeleteBlisterDateRequest) => {
    try {
      const { status, error } = await deleteBlisterDate(req);
      if (error) {
        throw error;
      }
      if (status === HttpStatusCode.Locked) {
        throw new Error(
          'ไม่สามารถลบข้อมูลวันที่เปลี่ยนแผงยาได้ เนื่องจากมีการใช้งานอยู่ในระบบ',
        );
      }
      if (status !== HttpStatusCode.NoContent) {
        throw new Error('ไม่สามารถลบข้อมูลวันที่เปลี่ยนแผงยาได้');
      }
      alert({
        message: 'ลบข้อมูลวันที่เปลี่ยนแผงยาสำเร็จ',
        severity: 'success',
      });
    } catch (error) {
      let err = `${error}`.replaceAll('Error: ', '');
      try {
        if (JSON.parse(err)?.error) {
          err = `${JSON.parse(err).error}`;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}
      alert({ message: err, severity: 'error' });
      throw error;
    }
  };

  const replaceQueryParams = async ({
    warehouseID,
    search,
    sort,
  }: FilterMedicineHouse) => {
    const params = new URLSearchParams(location.search);
    params.set('warehouseID', warehouseID);
    if (search) {
      params.set('search', search);
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
    isMounted,
    isFetching,
    warehouses,
    medicines,
    warehouse,
    setWarehouse,
    histories,
    fetchHistory,
    addHistory,
    deleteHistory,
  };
}
