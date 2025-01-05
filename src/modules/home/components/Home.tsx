'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWarehouseDetail } from '@/modules/home/hooks/warehouseDetail';
import { WarehouseCard } from './WarehouseCard';
import { DelaySearchBox, LoadingScreen } from '@/components/ui';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { WarehouseDetail, WarehouseRole } from '@/core/@types';
import { ViewWarehouseModal } from './ViewWarehouseModal';
import { DeleteWarehouseModal } from './DeleteWarehouseModal';
import { AddWarehouseModal } from './AddWarehouseModal';
import { EditWarehouseModal } from './EditWarehouseModal';

export default function Home() {
  const searchParam = useSearchParams();
  const [search, setSearch] = useState(searchParam.get('search') || '');
  const {
    isLoading,
    warehouseDetails,
    addWarehouse,
    editWarehouse,
    removeWarehouse,
    addLocker,
    editLocker,
    removeLocker,
    replaceQueryParams,
  } = useWarehouseDetail(search);
  const [selectedWarehouseDetail, setSelectedWarehouseDetail] =
    useState<WarehouseDetail>();

  useEffect(() => {
    replaceQueryParams(search);
  }, [search]);

  const [openModal, setOpenModal] = useState<
    'closed' | 'add' | 'edit' | 'remove' | 'view'
  >('closed');

  const setModal = (
    warehouseDetail: WarehouseDetail,
    event: 'view' | 'edit' | 'remove',
  ) => {
    setSelectedWarehouseDetail(warehouseDetail);
    setOpenModal(event);
  };

  useEffect(() => {
    if (selectedWarehouseDetail && warehouseDetails) {
      setSelectedWarehouseDetail(
        warehouseDetails.find(
          (warehouse) =>
            warehouse.warehouseID === selectedWarehouseDetail.warehouseID,
        ),
      );
    }
  }, [warehouseDetails, selectedWarehouseDetail]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />

      <main className="space-y-4 lg:p-6 p-4">
        <div className="flex items-center gap-2">
          <DelaySearchBox onSearch={setSearch} />
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setOpenModal('add')}
            className="w-fit whitespace-nowrap max-[440px]:w-full h-14"
          >
            <Add />
            เพิ่มศูนย์
          </Button>
        </div>

        {warehouseDetails && (
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(15rem,_1fr))] gap-4">
            {warehouseDetails.map((warehouseDetail) => (
              <WarehouseCard
                key={warehouseDetail.warehouseID}
                warehouseDetail={warehouseDetail}
                deletable={warehouseDetail.role === WarehouseRole.ADMIN}
                editable={warehouseDetail.role !== WarehouseRole.VIEWER}
                onView={(warehouseDetail) => setModal(warehouseDetail, 'view')}
                onDelete={(warehouseDetail) =>
                  setModal(warehouseDetail, 'remove')
                }
                onEdit={(warehouseDetail) => setModal(warehouseDetail, 'edit')}
              />
            ))}
          </div>
        )}

        <AddWarehouseModal
          isOpen={openModal === 'add'}
          onClose={() => setOpenModal('closed')}
          onCreate={addWarehouse}
        />

        {selectedWarehouseDetail && (
          <>
            <ViewWarehouseModal
              isOpen={openModal === 'view'}
              onClose={() => setOpenModal('closed')}
              warehouseDetail={selectedWarehouseDetail}
            />
            <EditWarehouseModal
              isOpen={openModal === 'edit'}
              onClose={() => setOpenModal('closed')}
              warehouseDetail={selectedWarehouseDetail}
              onEditWarehouse={editWarehouse}
              onAddLocker={addLocker}
              onEditLocker={editLocker}
              onDeleteLocker={removeLocker}
            />
            <DeleteWarehouseModal
              isOpen={openModal === 'remove'}
              onClose={() => setOpenModal('closed')}
              warehouseDetail={selectedWarehouseDetail}
              onDelete={async (warehouseDetail) =>
                await removeWarehouse(warehouseDetail.warehouseID)
              }
            />
          </>
        )}
      </main>
    </>
  );
}
