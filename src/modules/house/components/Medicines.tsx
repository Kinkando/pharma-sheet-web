'use client';

import { Image, LoadingCircular } from '@/components/ui';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useContext, useEffect, useState } from 'react';
import { MenuItem, Select } from '@mui/material';
import { DelaySearchBox } from '@/components/ui';
import {
  MedicineHouse,
  OrderSequence,
  resolveWarehouseName,
  WarehouseRole,
} from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { useValidState } from '@/core/hooks';
import { useMedicine } from '@/modules/house/hooks/medicine';
import { deleteMedicineHouse, updateMedicineHouse } from '@/core/repository';
import { DeleteMedicineModal } from './DeleteMedicineModal';
import { MedicineCard } from './MedicineCard';
import { ViewMedicineModal } from './ViewMedicineModal';
import { sortOptions, Toolbar } from './Toolbar';
import { SyncMedicineModal } from './SyncMedicineModal';
import { MedicineModal } from './MedicineModal';
import { HttpStatusCode } from 'axios';

export default function Medicines() {
  const { alert } = useContext(GlobalContext);
  const searchParam = useSearchParams();
  const [search, setSearch] = useState(searchParam.get('search') || '');
  const {
    isMounted,
    isFetching,
    warehouses,
    fetchWarehouses,
    medicines,
    medicinesMaster,
    fetchMedicine,
    addMedicine,
    warehouse,
    setWarehouse,
    syncMedicineMetadata,
    setSyncMedicineMetadata,
    fetchSyncMedicineMetadata,
    syncGoogleSheet,
  } = useMedicine(searchParam.get('warehouseID'));
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineHouse>();
  const [openModal, setOpenModal] = useState<
    'closed' | 'view' | 'edit' | 'delete' | 'create' | 'sync'
  >('closed');

  const [sortBy, setSortBy] = useValidState<string>(
    searchParam.get('sortBy'),
    'medicalName',
    ...sortOptions.map((option) => option.value),
  );
  const [order, setOrder] = useValidState<OrderSequence>(
    searchParam.get('order') as OrderSequence,
    'ASC',
    'ASC',
    'DESC',
  );

  const selectWarehouse = useCallback(
    (warehouseID: string) => {
      setWarehouse(
        warehouses.find((warehouse) => warehouse.warehouseID === warehouseID),
      );
    },
    [setWarehouse, warehouses],
  );

  useEffect(() => {
    if (isMounted) {
      fetchData();
    }
  }, [
    warehouses,
    warehouse?.warehouseID,
    warehouse?.warehouseName,
    search,
    sortBy,
    order,
    isMounted,
  ]);

  const fetchData = useCallback(async () => {
    if (!warehouse) {
      return;
    }
    setSyncMedicineMetadata(undefined);
    await fetchMedicine({
      limit: 999,
      page: 1,
      warehouseID: warehouse.warehouseID,
      search: search.trim() || undefined,
      sort: `${sortBy} ${order}`,
    });
  }, [warehouse, search, sortBy, order]);

  const createMedicine = useCallback(
    async (req: MedicineHouse) => {
      if (warehouse) {
        await addMedicine({ ...req, warehouseID: warehouse?.warehouseID });
        await fetchData();
      }
    },
    [warehouse],
  );

  const editMedicine = useCallback(
    async (medicine: MedicineHouse) => {
      if (!selectedMedicine) {
        return;
      }
      try {
        const { status } = await updateMedicineHouse(medicine.id, medicine);
        if (status === HttpStatusCode.Conflict) {
          throw new Error(
            'ไม่สามารถแก้ไขข้อมูลยาได้ เนื่องจากมีบ้านเลขที่ซ้ำกัน',
          );
        }
        if (status !== HttpStatusCode.NoContent) {
          throw new Error('ไม่สามารถแก้ไขข้อมูลยาได้');
        }
        await fetchData();
        alert({
          message: 'แก้ไขข้อมูลบ้านเลขที่ยาสำเร็จ',
          severity: 'success',
        });
      } catch (error) {
        let err = `${error}`.replaceAll('Error: ', '');
        try {
          if (JSON.parse(err)?.error) {
            err = `${JSON.parse(err).error}`;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {}
        alert({ message: err, severity: 'error' });
        throw error;
      }
    },
    [selectedMedicine],
  );

  const removeMedicine = async (id: string) => {
    try {
      await deleteMedicineHouse(id);
      setSelectedMedicine(undefined);
      alert({ message: 'ลบข้อมูลบ้านเลขที่ยาสำเร็จ', severity: 'success' });
      await fetchData();
    } catch (error) {
      alert({
        message: `${error}`.replaceAll('Error: ', ''),
        severity: 'error',
      });
    }
  };

  const syncMedicine = useCallback(
    async (sheetURL: string) => {
      if (!warehouse) {
        return;
      }
      try {
        await syncGoogleSheet(warehouse.warehouseID, sheetURL);
        setWarehouse(
          (warehouse) =>
            warehouse && { ...warehouse, sheetURL, latestSyncedAt: new Date() },
        );
        await Promise.all([
          fetchWarehouses(warehouse.warehouseID),
          fetchData(),
        ]);
        setOpenModal('closed');

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setWarehouse((warehouse) => warehouse && { ...warehouse, sheetURL });
      }
    },
    [warehouse],
  );

  return (
    <main className="h-full relative">
      <LoadingCircular isLoading={isFetching} blur />

      <main className="space-y-4 lg:p-6 p-4">
        {warehouse?.warehouseID && (
          <Toolbar
            warehouse={warehouse}
            order={order}
            sortBy={sortBy}
            onSortChange={(sortBy, order) => {
              setSortBy(sortBy);
              setOrder(order);
            }}
            onAddMedicine={() => setOpenModal('create')}
            onSyncMedicine={() => setOpenModal('sync')}
          />
        )}

        {warehouse?.warehouseID && (
          <Suspense fallback={null}>
            <DelaySearchBox onSearch={setSearch} />
          </Suspense>
        )}

        <Select
          value={warehouse?.warehouseID ?? ''}
          displayEmpty
          onChange={(e) => selectWarehouse(e.target.value)}
          className="w-full"
        >
          <MenuItem value="" disabled>
            <p className="w-full">กรุณาเลือกศูนย์สุขภาพชุมชน</p>
          </MenuItem>
          {warehouses.map((warehouse) => (
            <MenuItem key={warehouse.warehouseID} value={warehouse.warehouseID}>
              {resolveWarehouseName(warehouse)}
            </MenuItem>
          ))}
        </Select>

        {!medicines.length && !isFetching && (
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src="/images/empty.png"
              width={200}
              height={200}
              alt="Empty Box"
              unoptimized
            />
            <p>ไม่พบข้อมูลยา</p>
          </div>
        )}

        {!isFetching &&
          warehouse?.warehouseID &&
          medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              warehouseID={warehouse.warehouseID}
              medicine={medicine}
              editable={[WarehouseRole.ADMIN, WarehouseRole.EDITOR].includes(
                warehouse?.role,
              )}
              deletable={[WarehouseRole.ADMIN, WarehouseRole.EDITOR].includes(
                warehouse?.role,
              )}
              selectMedicine={(medicine, mode) => {
                setSelectedMedicine(medicine);
                setOpenModal(mode);
              }}
            />
          ))}
      </main>

      {/* TODO: manage blister date history */}

      {warehouse && (
        <MedicineModal
          medicines={medicinesMaster}
          warehouseID={warehouse.warehouseID}
          isOpen={openModal === 'create'}
          onClose={() => setOpenModal('closed')}
          onSubmit={createMedicine}
        />
      )}

      {warehouse && (
        <SyncMedicineModal
          link={warehouse.sheetURL ?? ''}
          lastSync={warehouse.latestSyncedAt?.toLocaleString() ?? ''}
          metadata={syncMedicineMetadata}
          isOpen={openModal === 'sync'}
          onClose={() => setOpenModal('closed')}
          onModifiy={(url: string) =>
            fetchSyncMedicineMetadata(warehouse.warehouseID, url)
          }
          onSync={syncMedicine}
        />
      )}

      {selectedMedicine && warehouse && (
        <>
          <ViewMedicineModal
            warehouseID={warehouse.warehouseID}
            isOpen={openModal === 'view'}
            onClose={() => setOpenModal('closed')}
            medicine={selectedMedicine}
          />
          <MedicineModal
            medicines={medicinesMaster}
            warehouseID={warehouse.warehouseID}
            medicine={selectedMedicine}
            isOpen={openModal === 'edit'}
            onClose={() => setOpenModal('closed')}
            onSubmit={editMedicine}
          />
          <DeleteMedicineModal
            isOpen={openModal === 'delete'}
            onClose={() => setOpenModal('closed')}
            medicine={selectedMedicine}
            onDelete={async () => await removeMedicine(selectedMedicine.id)}
          />
        </>
      )}
    </main>
  );
}
