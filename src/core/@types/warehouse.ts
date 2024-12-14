export enum WarehouseRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
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
