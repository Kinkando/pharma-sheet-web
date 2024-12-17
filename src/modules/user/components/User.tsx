'use client';

import { useCallback, useState, useContext, useEffect } from 'react';
import { MenuItem, Select } from '@mui/material';
import {
  Warehouse,
  Warehouse as WarehouseModel,
  WarehouseRole,
} from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { getWarehouses } from '@/core/repository';
import { UserManagementTab } from './UserManagementTab';
import { LoadingScreen } from '@/components/ui';

export default function User() {
  const [warehouse, setWarehouse] = useState<WarehouseModel>({
    warehouseID: '',
    warehouseName: '',
    role: WarehouseRole.VIEWER,
    lockers: [],
  });
  const { user } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const data = await getWarehouses();
      setWarehouses(data ?? []);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    }
  };

  const changeWarehouse = useCallback(
    (warehouseID: string) => {
      const item = warehouses.find(
        (warehouse) => warehouse.warehouseID === warehouseID,
      );
      if (item) {
        setWarehouse({ ...item });
      }
    },
    [warehouses],
  );

  return (
    <>
      <LoadingScreen isLoading={isLoading} />

      <main className="space-y-4 lg:p-6 p-4">
        <Select
          value={warehouse.warehouseID}
          displayEmpty
          onChange={(e) => changeWarehouse(e.target.value)}
          className="w-full"
        >
          <MenuItem value="" disabled>
            <p className="w-full">กรุณาเลือกศูนย์สุขภาพชุมชน</p>
          </MenuItem>
          {warehouses.map((warehouse) => (
            <MenuItem key={warehouse.warehouseID} value={warehouse.warehouseID}>
              {warehouse.warehouseName}
            </MenuItem>
          ))}
        </Select>

        {user && warehouse.warehouseID && (
          <UserManagementTab
            user={user}
            warehouse={warehouse}
            onLoading={setIsLoading}
          />
        )}
      </main>
    </>
  );
}
