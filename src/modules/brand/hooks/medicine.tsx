import {
  CreateMedicineBrandRequest,
  Medicine,
  MedicineBrand,
  OrderSequence,
  PaginationRequest,
  UpdateMedicineBrandRequest,
} from '@/core/@types';
import { GlobalContext } from '@/core/context';
import {
  createMedicineBrand,
  deleteMedicineBrand,
  getAllMedicines,
  getMedicineBrands,
  updateMedicineBrand,
} from '@/core/repository';
import { AxiosError, HttpStatusCode, isCancel } from 'axios';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export function useMedicine() {
  const { alert } = useContext(GlobalContext);

  const [isFetching, setIsFetching] = useState(true);
  const [medicineBrands, setMedicineBrands] = useState<MedicineBrand[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const { replace } = useRouter();

  useEffect(() => {
    fetchMedicinesMaster();
  }, []);

  const fetchMedicinesMaster = async () => {
    try {
      const data = await getAllMedicines();
      setMedicines(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        alert({ message: `${error?.response?.data}`, severity: 'error' });
      } else {
        alert({ message: `${error}`, severity: 'error' });
      }
    }
  };

  const fetchMedicineBrands = async (
    filter: PaginationRequest,
    loading?: boolean,
  ) => {
    if (loading) {
      setIsFetching(true);
    }
    try {
      filter.search = filter.search?.trim() || undefined;
      replaceQueryParams(filter);
      const { data } = await getMedicineBrands(filter);
      setMedicineBrands(data ?? []);
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
      if (loading) {
        setIsFetching(false);
      }
    }
  };

  const addMedicineBrand = async (req: CreateMedicineBrandRequest) => {
    try {
      const { status, error } = await createMedicineBrand(req);
      if (status === HttpStatusCode.Conflict) {
        throw new Error('Trade ID นี้มีอยู่ในระบบแล้ว');
      }
      if (status !== HttpStatusCode.Ok) {
        throw error;
      }
      alert({ message: 'เพิ่มข้อมูลการค้าสำเร็จ', severity: 'success' });
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

  const editMedicineBrand = async (
    brandID: string,
    req: UpdateMedicineBrandRequest,
  ) => {
    try {
      await updateMedicineBrand(brandID, req);
      alert({ message: 'แก้ไขข้อมูลการค้าสำเร็จ', severity: 'success' });
    } catch (error) {
      let err = `${error}`;
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

  const removeMedicineBrand = async (brandID: string) => {
    try {
      await deleteMedicineBrand(brandID);
      alert({ message: 'ลบข้อมูลการค้าสำเร็จ', severity: 'success' });
    } catch (error) {
      let err = `${error}`;
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

  const replaceQueryParams = async ({ search, sort }: PaginationRequest) => {
    const params = new URLSearchParams(location.search);
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
    isFetching,
    medicines,
    medicineBrands,
    fetchMedicineBrands,
    addMedicineBrand,
    editMedicineBrand,
    removeMedicineBrand,
  };
}
