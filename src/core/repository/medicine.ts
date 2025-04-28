import { HttpStatusCode } from 'axios';
import {
  AddBlisterDateRequest,
  CreateMedicineBrandRequest,
  CreateMedicineHouseRequest,
  Data,
  FilterMedicine,
  Medicine,
  UpdateMedicineBrandRequest,
  UpdateMedicineHouseRequest,
} from '@/core/@types';
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

export async function createMedicineHouse(req: CreateMedicineHouseRequest) {
  return await client<{ id: string }>({
    url: '/house',
    method: 'POST',
    data: req,
  });
}

export async function updateMedicineHouse(
  id: string,
  req: UpdateMedicineHouseRequest,
) {
  const { status, error } = await client<{ id: string }>({
    url: `/house/${id}`,
    method: 'PUT',
    data: req,
  });
  if (status !== HttpStatusCode.NoContent) {
    throw Error(error);
  }
}

export async function deleteMedicineHouse(id: string) {
  const { status, error } = await client({
    url: `/house/${id}`,
    method: 'DELETE',
  });
  if (status !== HttpStatusCode.NoContent) {
    throw Error(error);
  }
}

export async function createMedicineBrand(req: CreateMedicineBrandRequest) {
  const formData = new FormData();
  formData.append('medicationID', req.medicationID);
  formData.append('tradeID', req.tradeID);
  if (req.tradeName) {
    formData.append('tradeName', req.tradeName);
  }
  if (req.blisterImageFile) {
    formData.append('blisterImageFile', req.blisterImageFile);
  }
  if (req.tabletImageFile) {
    formData.append('tabletImageFile', req.tabletImageFile);
  }
  if (req.boxImageFile) {
    formData.append('boxImageFile', req.boxImageFile);
  }
  return await client<{ id: string }>({
    url: '/brand',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function updateMedicineBrand(
  brandID: string,
  req: UpdateMedicineBrandRequest,
) {
  const formData = new FormData();
  if (req.tradeName) {
    formData.append('tradeName', req.tradeName);
  }
  if (req.blisterImageFile) {
    formData.append('blisterImageFile', req.blisterImageFile);
  }
  if (req.tabletImageFile) {
    formData.append('tabletImageFile', req.tabletImageFile);
  }
  if (req.boxImageFile) {
    formData.append('boxImageFile', req.boxImageFile);
  }
  if (req.deleteBlisterImage) {
    formData.append('deleteBlisterImage', `${req.deleteBlisterImage}`);
  }
  if (req.deleteTabletImage) {
    formData.append('deleteTabletImage', `${req.deleteTabletImage}`);
  }
  if (req.deleteBoxImage) {
    formData.append('deleteBoxImage', `${req.deleteBoxImage}`);
  }
  const { status, error } = await client({
    url: `/brand/${brandID}`,
    method: 'PUT',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (status !== HttpStatusCode.NoContent) {
    throw Error(error);
  }
}

export async function deleteMedicineBrand(brandID: string) {
  const { status, error } = await client({
    url: `/brand/${brandID}`,
    method: 'DELETE',
  });
  if (status !== HttpStatusCode.NoContent) {
    throw Error(error);
  }
}

export async function addBlisterDate(req: AddBlisterDateRequest) {
  return await client<{ id: string }>({
    url: '/history',
    method: 'POST',
    data: req,
  });
}

export async function deleteBlisterDate(historyID: string) {
  const { status, error } = await client({
    url: `/history/${historyID}`,
    method: 'DELETE',
  });
  if (status !== HttpStatusCode.NoContent) {
    throw Error(error);
  }
}
