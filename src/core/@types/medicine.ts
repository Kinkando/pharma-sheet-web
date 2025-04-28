export interface Medicine {
  medicineID: string;
  lockerID: string;
  lockerName: string;
  floor: number;
  no: number;
  address: string;
  description: string;
  medicalName: string;
  label: string;
  imageURL?: string;
}

export interface FilterMedicine {
  limit: number;
  page: number;
  warehouseID?: string;
  search?: string;
  sort?: string;
}

export interface CreateMedicineHouseRequest {
  medicationID: string;
  warehouseID: string;
  locker: string;
  floor: number;
  no: number;
  label?: string;
}

export interface UpdateMedicineHouseRequest {
  locker: string;
  floor: number;
  no: number;
  label?: string;
}

export interface CreateMedicineBrandRequest {
  medicationID: string;
  tradeID: string;
  tradeName?: string;
  blisterImageFile?: File;
  tabletImageFile?: File;
  boxImageFile?: File;
}

export interface UpdateMedicineBrandRequest {
  tradeName?: string;
  blisterImageFile?: File;
  tabletImageFile?: File;
  boxImageFile?: File;
  deleteBlisterImage?: boolean;
  deleteTabletImage?: boolean;
  deleteBoxImage?: boolean;
}

export interface AddBlisterDateRequest {
  medicationID: string;
  warehouseID: string;
  brandID?: string;
  date: string;
}
