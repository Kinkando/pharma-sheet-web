import { Data, PaginationRequest } from './pagination';

export enum WarehouseRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export enum WarehouseUserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export enum WarehouseGroup {
  MY_WAREHOUSE = 'MY_WAREHOUSE',
  OTHER_WAREHOUSE = 'OTHER_WAREHOUSE',
  OTHER_WAREHOUSE_PENDING = 'OTHER_WAREHOUSE_PENDING',
}

export interface Warehouse {
  warehouseID: string;
  warehouseName: string;
  role: WarehouseRole;
  sheetURL?: string;
  medicineSheetName?: string;
  medicineHouseSheetName?: string;
  medicineBrandSheetName?: string;
  medicineBlisterDateHistorySheetName?: string;
  latestSyncedAt?: Date;
}

export interface FilterWarehouseDetail extends PaginationRequest {
  group?: WarehouseGroup;
}

export interface FilterWarehouseUser extends PaginationRequest {
  role?: WarehouseRole;
  status?: WarehouseUserStatus;
}

export interface WarehouseDetail {
  warehouseID: string;
  warehouseName: string;
  role: WarehouseRole;
  totalMedicine: number;
  users: WarehouseUser[];
}

export interface WarehouseUser {
  userID: string;
  email: string;
  imageURL?: string;
  displayName?: string;
  role: WarehouseRole;
}

export type GetWarehouseUsersResponse = Data<WarehouseUser> & {
  totalApproved: number;
  totalPending: number;
};

export interface CreateWarehouseUser {
  warehouseID: string;
  email: string;
  role: WarehouseRole;
}

export interface UpdateWarehouseUser {
  warehouseID: string;
  userID: string;
  role: WarehouseRole;
}

export interface DeleteWarehouseUser {
  warehouseID: string;
  userID: string;
}

export interface SyncMedicineMetadata {
  title: string;
  medication: MedicineSheetMetadata;
  house: MedicineSheetMetadata;
  brand: MedicineSheetMetadata;
  blisterDate: MedicineSheetMetadata;
}

export interface MedicineSheetMetadata {
  sheetName: string;
  totalMedicine: number;
  totalNewMedicine: number;
  totalUpdatedMedicine: number;
  totalSkippedMedicine: number;
}

export function resolveWarehouseName({
  warehouseID,
  warehouseName,
}: {
  warehouseID: string;
  warehouseName: string;
}): string {
  if (warehouseID === warehouseName) {
    return warehouseID;
  }
  return `${warehouseName} [${warehouseID}]`;
}
