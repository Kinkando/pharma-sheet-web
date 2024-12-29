'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useState, useContext, useEffect } from 'react';
import { Box, MenuItem, Select, Tab, Tabs } from '@mui/material';
import { LoadingCircular } from '@/components/ui';
import {
  GetWarehouseUsersResponse,
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
  onFetchUsers: (result: GetWarehouseUsersResponse) => void;
};

const label = {
  id: 'user-tab',
  'aria-controls': 'user-tabpanel',
};

const tabs = [
  {
    id: 'member',
    label: ({ totalApproved }: GetWarehouseUsersResponse) =>
      'สมาชิก' + (totalApproved ? ` (${totalApproved})` : ''),
    component: (props: UserTabProps) => <UserManagementTab {...props} />,
  },
  {
    id: 'join-request',
    label: ({ totalPending }: GetWarehouseUsersResponse) =>
      'คำขอเข้าร่วม' + (totalPending ? ` (${totalPending})` : ''),
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
  const [result, setResult] = useState<GetWarehouseUsersResponse>({
    data: [],
    metadata: {
      limit: 0,
      offset: 0,
      totalItem: 0,
      totalPage: 0,
      currentPage: 0,
    },
    totalApproved: 0,
    totalPending: 0,
  });

  const searchParam = useSearchParams();
  const warehouseID = searchParam.get('warehouseID');

  const [currentTab, setCurrentTab] = useState(
    searchParam.get('tab') === 'join-request' ? 1 : 0,
  );
  const handleChange = (_: React.SyntheticEvent, newTab: number) =>
    setCurrentTab(newTab);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = useCallback(async () => {
    try {
      const data = await getWarehouses();
      setWarehouses(data ?? []);
      if (warehouseID) {
        changeWarehouse(warehouseID, data);
      }
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    }
  }, [warehouseID]);

  const changeWarehouse = useCallback(
    (warehouseID: string, _warehouses?: Warehouse[]) => {
      const item = (_warehouses || warehouses).find(
        (warehouse) => warehouse.warehouseID === warehouseID,
      );
      if (item) {
        setWarehouse({ ...item });
      }
    },
    [warehouses, currentTab],
  );

  return (
    <main className="h-full relative">
      <LoadingCircular isLoading={isLoading} blur />

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
                    key={tab.id}
                    id={`${label.id}-${index}`}
                    aria-controls={`${label['aria-controls']}-${index}`}
                    label={tab.label(result)}
                    className="!normal-case"
                  />
                ))}
              </Tabs>
            </Box>

            {user &&
              tabs.map((tab, index) => (
                <div
                  key={tab.id}
                  role="tabpanel"
                  hidden={currentTab !== index}
                  id={`${label['aria-controls']}-${index}`}
                  aria-labelledby={`${label.id}-${index}`}
                  className="space-y-4 py-4"
                >
                  {index === currentTab &&
                    tab.component({
                      user,
                      warehouse,
                      onLoading: setIsLoading,
                      onFetchUsers: setResult,
                    })}
                </div>
              ))}
          </Box>
        )}
      </main>
    </main>
  );
}
