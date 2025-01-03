'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DelaySearchBox } from '@/components/ui';
import { Box, Tab, Tabs } from '@mui/material';
import { WarehouseDetail, WarehouseGroup } from '@/core/@types';
import { WarehouseCard } from './WarehouseCard';
import { useWarehouse } from '@/modules/warehouse/hooks/warehouse';
import { WarehouseModal } from './WarehouseModal';
import { LoadingCircular } from '@/components/ui/LoadingCircular';
import { Image } from '@/components/ui';

export type WarehouseTabProps = {
  search: string;
};

const label = {
  id: 'warehouse-tab',
  'aria-controls': 'warehouse-tabpanel',
};

const tabs = [
  {
    id: 'join',
    label: 'ขอเข้าร่วม',
    group: WarehouseGroup.OTHER_WAREHOUSE,
  },
  {
    id: 'pending',
    label: 'รอการอนุมัติ',
    group: WarehouseGroup.OTHER_WAREHOUSE_PENDING,
  },
];

export default function Warehouse() {
  const searchParam = useSearchParams();
  const [search, setSearch] = useState(searchParam.get('search') ?? '');

  const [currentTab, setCurrentTab] = useState(
    searchParam.get('group') === 'pending' ? 1 : 0,
  );
  const handleChange = (_: React.SyntheticEvent, newTab: number) =>
    setCurrentTab(newTab);

  const group = useMemo(
    () =>
      currentTab === 0
        ? WarehouseGroup.OTHER_WAREHOUSE
        : WarehouseGroup.OTHER_WAREHOUSE_PENDING,
    [currentTab],
  );
  const {
    warehouseDetails,
    isLoading,
    join,
    cancelJoin,
    fetchWarehouseDetails,
  } = useWarehouse();
  const [selectedWarehouseDetail, setSelectedWarehouseDetail] =
    useState<WarehouseDetail>();

  useEffect(() => {
    fetchWarehouseDetails(group, search);
  }, [search, group]);

  return (
    <main className="h-full relative">
      <LoadingCircular isLoading={isLoading} blur />

      <main className="space-y-4 lg:p-6 p-4">
        <DelaySearchBox onSearch={setSearch} />

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
                  label={tab.label}
                  className="!normal-case"
                />
              ))}
            </Tabs>
          </Box>

          {!warehouseDetails.length && (
            <div className="w-full flex flex-col items-center justify-center my-2">
              <Image
                src="/images/empty.png"
                width={200}
                height={200}
                alt="Empty Box"
                unoptimized
              />
              <p>ไม่พบข้อมูลศูนย์สุขภาพชุมชน</p>
            </div>
          )}

          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              role="tabpanel"
              hidden={currentTab !== index}
              id={`${label['aria-controls']}-${index}`}
              aria-labelledby={`${label.id}-${index}`}
              className="space-y-4 py-4"
            >
              {index === currentTab && (
                <div className="grid grid-cols-[repeat(auto-fill,_minmax(15rem,_1fr))] gap-4">
                  {warehouseDetails.map((warehouseDetail) => (
                    <WarehouseCard
                      key={warehouseDetail.warehouseID}
                      warehouseDetail={warehouseDetail}
                      onClick={setSelectedWarehouseDetail}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </Box>
      </main>

      {selectedWarehouseDetail && (
        <WarehouseModal
          isOpen
          onClose={() => setSelectedWarehouseDetail(undefined)}
          warehouseDetail={selectedWarehouseDetail}
          group={group}
          onJoin={() =>
            join(selectedWarehouseDetail.warehouseID, group, search)
          }
          onCancelJoin={() =>
            cancelJoin(selectedWarehouseDetail.warehouseID, group, search)
          }
        />
      )}
    </main>
  );
}
