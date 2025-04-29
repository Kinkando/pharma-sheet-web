import {
  CreateMedicineBrandRequest,
  MedicineBrandView,
  OrderSequence,
  PaginationRequest,
  UpdateMedicineBrandRequest,
} from '@/core/@types';
import { GlobalContext } from '@/core/context';
import {
  createMedicine,
  createMedicineBrand,
  deleteMedicine,
  deleteMedicineBrand,
  getMedicineWithBrands,
  updateMedicine,
  updateMedicineBrand,
} from '@/core/repository';
import { AxiosError, HttpStatusCode, isCancel } from 'axios';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

export function useMedicine() {
  const { alert } = useContext(GlobalContext);

  const [isFetching, setIsFetching] = useState(true);
  const [medicineWithBrands, setMedicineWithBrands] = useState<
    MedicineBrandView[]
  >([]);

  const { replace } = useRouter();

  const fetchMedicineWithBrands = async (
    filter: PaginationRequest,
    loading?: boolean,
  ) => {
    if (loading) {
      setIsFetching(true);
    }
    try {
      filter.search = filter.search?.trim() || undefined;
      replaceQueryParams(filter);
      const { data } = await getMedicineWithBrands(filter);
      setMedicineWithBrands(data ?? []);
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

  const addMedicine = async (medicationID: string, medicalName: string) => {
    try {
      const { status, error } = await createMedicine(medicationID, medicalName);
      if (status === HttpStatusCode.Conflict) {
        throw new Error('Medication ID นี้มีอยู่ในระบบแล้ว');
      }
      if (status !== HttpStatusCode.Ok) {
        throw error;
      }
      alert({ message: 'เพิ่มข้อมูลยาสำเร็จ', severity: 'success' });
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

  const editMedicine = async (medicationID: string, medicalName: string) => {
    try {
      await updateMedicine(medicationID, medicalName);
      alert({ message: 'แก้ไขข้อมูลยาสำเร็จ', severity: 'success' });
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

  const removeMedicine = async (medicationID: string) => {
    try {
      const { status } = await deleteMedicine(medicationID);
      if (status === HttpStatusCode.Locked) {
        throw new Error(
          'ไม่สามารถลบข้อมูลยาได้ เนื่องจากมีการใช้งานอยู่ในระบบ',
        );
      }
      if (status !== HttpStatusCode.NoContent) {
        throw new Error('ไม่สามารถลบข้อมูลยาได้');
      }
      alert({ message: 'ลบข้อมูลยาสำเร็จ', severity: 'success' });
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
    medicineWithBrands,
    fetchMedicineWithBrands,
    addMedicine,
    editMedicine,
    removeMedicine,
    addMedicineBrand,
    editMedicineBrand,
    removeMedicineBrand,
  };
}
