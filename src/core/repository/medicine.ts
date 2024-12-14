import { HttpStatusCode } from 'axios';
import { Data, FilterMedicine, Medicine } from '@/core/@types';
import { client } from '@/core/lib';

export async function getMedicines(filter: FilterMedicine) {
  const { data, status, error } = await client<Data<Medicine>>({
    url: '/medicine',
    method: 'GET',
    params: filter,
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}

export async function createMedicine(
  warehouseID: string,
  medicine: Medicine,
  file?: File,
) {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  formData.append('warehouseID', warehouseID);
  formData.append('lockerID', medicine.lockerID);
  formData.append('floor', medicine.floor.toString());
  formData.append('no', medicine.no.toString());
  formData.append('address', medicine.address);
  formData.append('description', medicine.description);
  formData.append('medicalName', medicine.medicalName);
  formData.append('label', medicine.label);

  return await client<{ medicineID: string }>({
    url: `/medicine`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function updateMedicine(
  medicineID: string,
  medicine: Medicine,
  file?: File,
  deleteImage?: boolean,
) {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  formData.append('medicineID', medicineID);
  formData.append('lockerID', medicine.lockerID);
  formData.append('floor', medicine.floor.toString());
  formData.append('no', medicine.no.toString());
  formData.append('address', medicine.address);
  formData.append('description', medicine.description);
  formData.append('medicalName', medicine.medicalName);
  formData.append('label', medicine.label);
  if (deleteImage) {
    formData.append('deleteImage', `${deleteImage}`);
  }

  return await client({
    url: `/medicine/${medicine.medicineID}`,
    method: 'PATCH',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function deleteMedicine(medicineID: string) {
  const { status, error } = await client({
    url: `/medicine/${medicineID}`,
    method: 'DELETE',
  });
  if (status !== HttpStatusCode.NoContent) {
    throw Error(error);
  }
}
