export enum WarehouseRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export enum WarehouseUserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export interface Warehouse {
  warehouseID: string;
  warehouseName: string;
  role: WarehouseRole;
  lockers: Locker[];
}

export interface Locker {
  lockerID: string;
  lockerName: string;
}

export interface FilterWarehouseDetail {
  limit: number;
  page: number;
  search?: string;
}

export interface FilterWarehouseUser {
  limit: number;
  page: number;
  search?: string;
  role?: WarehouseRole;
  status?: WarehouseUserStatus;
}

export interface WarehouseDetail {
  warehouseID: string;
  warehouseName: string;
  role: WarehouseRole;
  lockerDetails: LockerDetail[];
  totalMedicine: number;
  totalLocker: number;
}

export interface LockerDetail {
  lockerID: string;
  lockerName: string;
  totalMedicine: number;
}

export interface WarehouseUser {
  userID: string;
  email: string;
  imageURL?: string;
  displayName?: string;
  role: WarehouseRole;
}

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
