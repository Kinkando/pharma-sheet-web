'use client';

import { HttpStatusCode } from 'axios';
import { Image } from '@/components/ui';
import { useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';
import { MenuItem, Select } from '@mui/material';
import { DelaySearchBox } from '@/components/ui';
import { Medicine, OrderSequence, WarehouseRole } from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { useValidState } from '@/core/hooks';
import { useMedicine } from '@/modules/medicine/hooks/medicine';
import {
  createMedicine,
  deleteMedicine,
  updateMedicine,
} from '@/core/repository';
import { DeleteMedicineModal } from './DeleteMedicineModal';
import { MedicineCard } from './MedicineCard';
import { MedicineModal } from './MedicineModal';
import { ViewMedicineModal } from './ViewMedicineModal';
import { sortOptions, Toolbar } from './Toolbar';
import { SyncMedicineModal } from './SyncMedicineModal';

export default function Medicines() {
  const { alert } = useContext(GlobalContext);
  const searchParam = useSearchParams();
  const [search, setSearch] = useState(searchParam.get('search') || '');
  const {
    warehouses,
    fetchWarehouses,
    medicines,
    fetchMedicine,
    warehouse,
    setWarehouse,
    syncMedicineMetadata,
    setSyncMedicineMetadata,
    fetchSyncMedicineMetadata,
    syncGoogleSheet,
  } = useMedicine(searchParam.get('warehouseID'));
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine>();
  const [openModal, setOpenModal] = useState<
    'closed' | 'view' | 'edit' | 'delete' | 'create' | 'sync'
  >('closed');

  const [sortBy, setSortBy] = useValidState<string>(
    searchParam.get('sortBy'),
    'description',
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
      const warehouse = warehouses.find(
        (warehouse) => warehouse.warehouseID === warehouseID,
      );
      if (warehouse) {
        setWarehouse(warehouse);
      }
    },
    [setWarehouse, warehouses],
  );

  useEffect(() => {
    if (warehouse?.warehouseID && warehouses.length) {
      fetchData();
    }
  }, [
    warehouses,
    warehouse?.lockers,
    warehouse?.role,
    warehouse?.warehouseID,
    warehouse?.warehouseName,
    search,
    sortBy,
    order,
  ]);

  const fetchData = useCallback(async () => {
    if (!warehouse) {
      return;
    }
    await fetchMedicine({
      limit: 999,
      page: 1,
      warehouseID: warehouse.warehouseID,
      search: search.trim() || undefined,
      sort: `${sortBy} ${order}`,
    });
    setSyncMedicineMetadata(undefined);
  }, [warehouse, search, sortBy, order]);

  const removeMedicine = async (medicineID: string) => {
    try {
      await deleteMedicine(medicineID);
      setSelectedMedicine(undefined);
      await fetchData();
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    }
  };

  const addMedicine = async (
    warehouseID: string,
    medicine: Medicine,
    file?: File,
  ) => {
    try {
      const { status, error } = await createMedicine(
        warehouseID,
        medicine,
        file,
      );
      if (status !== HttpStatusCode.Ok) {
        throw error;
      }
      await fetchData();
    } catch (error) {
      let err = `${error}`;
      if (JSON.parse(err)?.error) {
        err = `${JSON.parse(err).error}`;
      }
      alert({ message: err, severity: 'error' });
      throw error;
    }
  };

  const editMedicine = useCallback(
    async (medicineID: string, medicine: Medicine, file?: File) => {
      try {
        const { status, error } = await updateMedicine(
          medicineID,
          medicine,
          file,
          !!selectedMedicine?.imageURL && !file,
        );
        if (status !== HttpStatusCode.NoContent) {
          throw error;
        }
        await fetchData();
      } catch (error) {
        let err = `${error}`;
        if (JSON.parse(err)?.error) {
          err = `${JSON.parse(err).error}`;
        }
        alert({ message: err, severity: 'error' });
        throw error;
      }
    },
    [selectedMedicine],
  );

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
    <>
      <main className="space-y-4 lg:p-6 p-4">
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
              {warehouse.warehouseName}
            </MenuItem>
          ))}
        </Select>

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

        {warehouse?.warehouseID && <DelaySearchBox onSearch={setSearch} />}

        {warehouse?.warehouseID && !medicines.length && (
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

        {warehouse?.warehouseID &&
          medicines.map((medicine) => (
            <MedicineCard
              key={medicine.medicineID}
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

      {warehouse && (
        <MedicineModal
          lockers={warehouse.lockers}
          isOpen={openModal === 'create'}
          onClose={() => setOpenModal('closed')}
          onSubmit={async (medicine, file) =>
            await addMedicine(warehouse.warehouseID, medicine, file)
          }
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
            isOpen={openModal === 'view'}
            onClose={() => setOpenModal('closed')}
            medicine={selectedMedicine}
          />
          <MedicineModal
            medicine={selectedMedicine}
            lockers={warehouse.lockers}
            isOpen={openModal === 'edit'}
            onClose={() => setOpenModal('closed')}
            onSubmit={async (medicine, file) =>
              await editMedicine(medicine.medicineID, medicine, file)
            }
          />
          <DeleteMedicineModal
            isOpen={openModal === 'delete'}
            onClose={() => setOpenModal('closed')}
            medicine={selectedMedicine}
            onDelete={async () =>
              await removeMedicine(selectedMedicine.medicineID)
            }
          />
        </>
      )}
    </>
  );
}
