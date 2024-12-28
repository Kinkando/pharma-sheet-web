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
  warehouseID: string;
  search?: string;
  sort?: string;
}
