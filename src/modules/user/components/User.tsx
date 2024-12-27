'use client';

import { useCallback, useState, useContext, useEffect } from 'react';
import { Box, MenuItem, Select, Tab, Tabs } from '@mui/material';
import { LoadingScreen } from '@/components/ui';
import {
  User as UserModel,
  Warehouse,
  Warehouse as WarehouseModel,
  WarehouseRole,
} from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { getWarehouses } from '@/core/repository';
import { UserManagementTab } from './UserManagementTab';
import { JoinRequestTab } from './JoinRequestTab';

export type UserTabProps = {
  warehouse: Warehouse;
  user: UserModel;
  onLoading: (isLoading: boolean) => void;
};

const label = {
  id: 'user-tab',
  'aria-controls': 'user-tabpanel',
};

const tabs = [
  {
    label: 'สมาชิก',
    component: (props: UserTabProps) => <UserManagementTab {...props} />,
  },
  {
    label: 'คำขอเข้าร่วม',
    component: (props: UserTabProps) => <JoinRequestTab {...props} />,
  },
];

export default function User() {
  const [warehouse, setWarehouse] = useState<WarehouseModel>({
    warehouseID: '',
    warehouseName: '',
    role: WarehouseRole.VIEWER,
    lockers: [],
  });
  const { user, alert } = useContext(GlobalContext);
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

  const [currentTab, setCurrentTab] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newTab: number) =>
    setCurrentTab(newTab);

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

        {warehouse.warehouseID && (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={currentTab}
                onChange={handleChange}
                aria-label="user tabs"
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={tab.label}
                    id={`${label.id}-${index}`}
                    aria-controls={`${label['aria-controls']}-${index}`}
                    label={tab.label}
                    className="!normal-case"
                  />
                ))}
              </Tabs>
            </Box>

            {user &&
              tabs.map((tab, index) => (
                <div
                  key={tab.label}
                  role="tabpanel"
                  hidden={currentTab !== index}
                  id={`${label['aria-controls']}-${index}`}
                  aria-labelledby={`${label.id}-${index}`}
                  className="space-y-4 py-4"
                >
                  {index === currentTab &&
                    tab.component({ user, warehouse, onLoading: setIsLoading })}
                </div>
              ))}
          </Box>
        )}
      </main>
    </>
  );
}
