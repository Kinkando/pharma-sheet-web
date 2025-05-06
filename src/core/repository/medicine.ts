import { HttpStatusCode } from 'axios';
import {
  AddBlisterDateRequest,
  CreateMedicineBrandRequest,
  CreateMedicineHouseRequest,
  Data,
  DeleteBlisterDateRequest,
  FilterMedicine,
  FilterMedicineHouse,
  FilterRotationDateHistory,
  Medicine,
  MedicineBrand,
  MedicineHouse,
  MedicineView,
  PaginationRequest,
  RotationDateHistoryGroup,
  UpdateMedicineBrandRequest,
  UpdateMedicineHouseRequest,
} from '@/core/@types';
import { client } from '@/core/lib';

export async function getMedicines(filter: FilterMedicine) {
  const { data, status, error } = await client<Data<MedicineView>>({
    url: '/medicine',
    method: 'GET',
    params: filter,
    signalID: 'LIST_MEDICINE',
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}

export async function getAllMedicines() {
  const { data, status, error } = await client<Medicine[]>({
    url: '/medicine/master/all',
    method: 'GET',
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}

export async function getMedicinesPagination(filter: PaginationRequest) {
  const { data, status, error } = await client<Data<Medicine>>({
    url: '/medicine/master/pagination',
    method: 'GET',
    params: filter,
    signalID: 'GET_MEDICINE_MASTER',
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}

export async function getMedicineHouses(filter: FilterMedicineHouse) {
  const { data, status, error } = await client<Data<MedicineHouse>>({
    url: '/house',
    method: 'GET',
    params: filter,
    signalID: 'LIST_MEDICINE_HOUSE',
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}

export async function getMedicineBrands(filter: PaginationRequest) {
  const { data, status, error } = await client<Data<MedicineBrand>>({
    url: '/brand',
    method: 'GET',
    params: filter,
    signalID: 'LIST_MEDICINE_BRAND',
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}

export async function getMedicineWithBrands(filter: PaginationRequest) {
  const { data, status, error } = await client<Data<MedicineView>>({
    url: '/brand/group',
    method: 'GET',
    params: filter,
    signalID: 'LIST_MEDICINE_WITH_BRAND',
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}

export async function getRotationDateHistory(
  filter: FilterRotationDateHistory,
) {
  const { data, status, error } = await client<Data<RotationDateHistoryGroup>>({
    url: '/history',
    method: 'GET',
    params: filter,
    signalID: 'LIST_MEDICINE_ROTATION_DATE_HISTORY',
  });
  if (status === HttpStatusCode.Ok) {
    return data;
  }
  throw Error(error);
}

export async function createMedicine(
  medicationID: string,
  medicalName: string,
) {
  return await client<{ medicationID: string }>({
    url: `/medicine/${medicationID}`,
    method: 'POST',
    data: { medicalName },
  });
}

export async function updateMedicine(
  medicationID: string,
  medicalName: string,
) {
  const { status, error } = await client({
    url: `/medicine/${medicationID}`,
    method: 'PATCH',
    data: { medicalName },
  });
  if (status !== HttpStatusCode.NoContent) {
    throw Error(error);
  }
}

export async function deleteMedicine(medicationID: string) {
  return await client({
    url: `/medicine/${medicationID}`,
    method: 'DELETE',
  });
}

export async function createMedicineHouse(req: CreateMedicineHouseRequest) {
  req.floor = Number(req.floor);
  req.no = Number(req.no);
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
  req.floor = Number(req.floor);
  req.no = Number(req.no);
  return await client({
    url: `/house/${id}`,
    method: 'PUT',
    data: req,
  });
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
  return await client({
    url: `/brand/${brandID}`,
    method: 'DELETE',
  });
}

export async function addBlisterDate(req: AddBlisterDateRequest) {
  return await client<{ id: string }>({
    url: '/history',
    method: 'POST',
    data: req,
  });
}

export async function deleteBlisterDate({
  historyID,
  warehouseID,
  medicationID,
  brandID,
}: DeleteBlisterDateRequest) {
  let url = `/history`;
  if (historyID) {
    url += `/${historyID}`;
  }
  if (warehouseID) {
    url += `/warehouse/${warehouseID}`;
  }
  if (medicationID) {
    url += `/medicine/${medicationID}`;
  }
  if (brandID) {
    url += `/brand/${brandID}`;
  }
  return await client({
    url,
    method: 'DELETE',
  });
}
