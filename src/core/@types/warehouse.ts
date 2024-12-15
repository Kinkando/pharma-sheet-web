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
