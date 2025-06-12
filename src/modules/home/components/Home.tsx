'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWarehouseDetail } from '@/modules/home/hooks/warehouseDetail';
import { WarehouseCard } from './WarehouseCard';
import { LoadingScreen } from '@/components/ui';
import { WarehouseDetail, WarehouseRole } from '@/core/@types';
import { ViewWarehouseModal } from './ViewWarehouseModal';
import { DeleteWarehouseModal } from './DeleteWarehouseModal';
import { AddWarehouseModal } from './AddWarehouseModal';
import { EditWarehouseModal } from './EditWarehouseModal';
import { Toolbar } from './Toolbar';
import { exportMedicine } from '@/core/repository';
import { ExportSheetModal } from './ExportSheetModal';

export default function Home() {
  const searchParam = useSearchParams();
  const [search, setSearch] = useState(searchParam.get('search') || '');
  const {
    isLoading,
    warehouseDetails,
    addWarehouse,
    editWarehouse,
    removeWarehouse,
    replaceQueryParams,
  } = useWarehouseDetail(search);
  const [selectedWarehouseDetail, setSelectedWarehouseDetail] =
    useState<WarehouseDetail>();

  useEffect(() => {
    replaceQueryParams(search);
  }, [search]);

  const [openModal, setOpenModal] = useState<
    'closed' | 'add' | 'edit' | 'remove' | 'view' | 'export'
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

  const downloadFile = async (warehouseIDs: string[]) => {
    try {
      const url = await exportMedicine(warehouseIDs);
      const a = document.createElement('a');
      a.href = url;
      a.download = `บ้านเลขที่ยา.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      alert({
        message: `${error}`.replaceAll('Error: ', ''),
        severity: 'error',
      });
    }
  };

  return (
    <>
      <LoadingScreen isLoading={isLoading} />

      <main className="space-y-4 lg:p-6 p-4">
        <Toolbar
          warehouses={warehouseDetails || []}
          setSearch={setSearch}
          onAddWarehouse={() => setOpenModal('add')}
          onExportMedicineSheet={() => setOpenModal('export')}
        />

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

        <ExportSheetModal
          warehouseDetails={warehouseDetails || []}
          isOpen={openModal === 'export'}
          onClose={() => setOpenModal('closed')}
          onExport={downloadFile}
        />

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
