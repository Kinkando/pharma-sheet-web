import { PaginationRequest } from './pagination';

export interface Medicine {
  medicationID: string;
  medicalName: string;
}

export interface MedicineHouse {
  id: string;
  medicationID: string;
  medicalName: string;
  locker: string;
  floor: number;
  no: number;
  label?: string;
}

export interface MedicineBrandView {
  medicationID: string;
  medicalName: string;
  brands: MedicineBrand[];
}

export interface MedicineView {
  medicationID: string;
  medicalName: string;
  brands: MedicineBrand[];
  houses: MedicineHouseView[];
  blisterDateHistories: MedicineBlisterDateHistoryView[];
}

export interface MedicineBrand {
  id: string;
  medicationID: string;
  tradeID: string;
  tradeName?: string;
  blisterImageURL?: string;
  tabletImageURL?: string;
  boxImageURL?: string;
}

export interface MedicineHouseView {
  warehouseID: string;
  warehouseName: string;
  addresses: MedicineHouseDetailView[];
}

export interface MedicineHouseDetailView {
  id: string;
  locker: string;
  floor: number;
  no: number;
  label?: string;
}

export interface MedicineBlisterDateHistoryView {
  warehouseID: string;
  warehouseName: string;
  brands: MedicineBrandBlisterDateHistory[];
}

export interface MedicineBrandBlisterDateHistory {
  tradeID?: string;
  tradeName?: string;
  blisterChanges: MedicineBrandBlisterDateDetailHistory[];
}

export interface MedicineBrandBlisterDateDetailHistory {
  id: string;
  date: string;
}

export interface FilterMedicine extends PaginationRequest {
  warehouseID?: string;
}

export interface FilterMedicineHouse extends PaginationRequest {
  warehouseID: string;
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
