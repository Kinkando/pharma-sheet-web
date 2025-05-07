import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreateMedicineHouseRequest,
  FilterMedicineHouse,
  Medicine,
  MedicineHouse,
  OrderSequence,
  SyncMedicineMetadata,
  Warehouse,
} from '@/core/@types';
import { GlobalContext } from '@/core/context';
import {
  createMedicineHouse,
  getAllMedicines,
  getMedicineHouses,
  getSyncMedicineMetadata,
  getWarehouses,
  syncMedicine,
} from '@/core/repository';
import { AxiosError, HttpStatusCode, isCancel } from 'axios';

export function useMedicine(warehouseID: string | null) {
  const { alert } = useContext(GlobalContext);

  const [isFetching, setIsFetching] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [warehouse, setWarehouse] = useState<Warehouse>();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [medicines, setMedicines] = useState<MedicineHouse[]>([]);
  const [medicinesMaster, setMedicinesMaster] = useState<Medicine[]>([]);
  const [syncMedicineMetadata, setSyncMedicineMetadata] =
    useState<SyncMedicineMetadata>();
  const { replace } = useRouter();

  useEffect(() => {
    fetchWarehouses();
    fetchMedicinesMaster();
  }, []);

  const fetchMedicinesMaster = async () => {
    try {
      const data = await getAllMedicines();
      setMedicinesMaster(data ?? []);
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

  const fetchMedicine = async (filter: FilterMedicineHouse) => {
    setIsFetching(true);
    try {
      filter.search = filter.search?.trim() || undefined;
      replaceQueryParams(filter);
      const { data } = await getMedicineHouses(filter);
      setMedicines(data ?? []);
      setIsFetching(false);
    } catch (error) {
      if (isCancel(error)) {
        return;
      }
      if (error instanceof AxiosError) {
        alert({ message: `${error?.response?.data}`, severity: 'error' });
      } else {
        alert({ message: `${error}`, severity: 'error' });
      }
    }
  };

  const addMedicine = async (req: CreateMedicineHouseRequest) => {
    try {
      const { status, error } = await createMedicineHouse(req);
      if (status === HttpStatusCode.Conflict) {
        throw new Error('บ้านเลขที่ยานี้มีอยู่ในระบบแล้ว');
      }
      if (status !== HttpStatusCode.Ok) {
        throw error;
      }
      alert({ message: 'เพิ่มข้อมูลบ้านเลขที่ยาสำเร็จ', severity: 'success' });
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

  const fetchSyncMedicineMetadata = async (
    warehouseID: string,
    url: string,
  ) => {
    try {
      const { data, status } = await getSyncMedicineMetadata(warehouseID, url);
      switch (status) {
        case HttpStatusCode.NotFound:
          throw new Error('ไม่พบข้อมูลใน Google Sheet');
        case HttpStatusCode.BadRequest:
          throw new Error(
            'ลิงก์ไม่ถูกต้อง กรุณาเปลี่ยนลิงก์แล้วลองใหม่อีกครั้ง',
          );
        case HttpStatusCode.InternalServerError:
          throw new Error('เกิดข้อผิดพลาดในการซิงค์ข้อมูล');
        case HttpStatusCode.Conflict:
          throw new Error('ลิงก์นี้มีผู้ใช้งานแล้ว');
      }
      setSyncMedicineMetadata(data);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    }
  };

  const syncGoogleSheet = async (warehouseID: string, link: string) => {
    try {
      const { status } = await syncMedicine(warehouseID, link);
      switch (status) {
        case HttpStatusCode.NotFound:
          throw new Error('ไม่พบข้อมูลใน Google Sheet');
        case HttpStatusCode.BadRequest:
          throw new Error(
            'ลิงก์ไม่ถูกต้อง กรุณาเปลี่ยนลิงก์แล้วลองใหม่อีกครั้ง',
          );
        case HttpStatusCode.InternalServerError:
          throw new Error('เกิดข้อผิดพลาดในการซิงค์ข้อมูล');
        case HttpStatusCode.Conflict:
          throw new Error('ลิงก์นี้มีผู้ใช้งานแล้ว');
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
    fetchWarehouses,
    medicines,
    medicinesMaster,
    fetchMedicine,
    addMedicine,
    warehouse,
    setWarehouse,
    syncMedicineMetadata,
    setSyncMedicineMetadata,
    fetchSyncMedicineMetadata,
    syncGoogleSheet,
  };
}
