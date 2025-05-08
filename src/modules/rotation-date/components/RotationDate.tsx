import { DelaySearchBox, Image, LoadingCircular } from '@/components/ui';
import { sortOptions, Toolbar } from './Toolbar';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { MenuItem, Select } from '@mui/material';
import {
  AddBlisterDateRequest,
  DeleteBlisterDateRequest,
  OrderSequence,
  resolveWarehouseName,
  RotationDateHistoryGroup,
  WarehouseRole,
} from '@/core/@types';
import { useSearchParams } from 'next/navigation';
import { useRotationDate } from '../hooks/rotation-date';
import { useValidState } from '@/core/hooks';
import { MedicineCard } from './MedicineCard';
import { ViewMedicineModal } from './ViewMedicineModal';
import { DeleteMedicineModal } from './DeleteMedicineModal';
import { AddMedicineModal } from './AddMedicineModal';
import { EditMedicineModal } from './EditMedicineModal';

export default function RotationDate() {
  const searchParam = useSearchParams();
  const [search, setSearch] = useState(searchParam.get('search') || '');
  const [openModal, setOpenModal] = useState<
    'closed' | 'view' | 'delete' | 'create' | 'edit'
  >('closed');

  const [selectedItem, setSelectedItem] = useState<RotationDateHistoryGroup>();
  const {
    isMounted,
    isFetching,
    warehouses,
    medicines,
    warehouse,
    setWarehouse,
    histories,
    fetchHistory,
    addHistory,
    deleteHistory,
  } = useRotationDate(searchParam.get('warehouseID'));

  const [sortBy, setSortBy] = useValidState<string>(
    searchParam.get('sortBy'),
    'medicationID',
    ...sortOptions.map((option) => option.value),
  );
  const [order, setOrder] = useValidState<OrderSequence>(
    searchParam.get('order') as OrderSequence,
    'ASC',
    'ASC',
    'DESC',
  );

  const allowed = useMemo(
    () =>
      warehouse &&
      [WarehouseRole.ADMIN, WarehouseRole.EDITOR].includes(warehouse.role),
    [warehouse],
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

  const selectWarehouse = useCallback(
    (warehouseID: string) => {
      setWarehouse(
        warehouses.find((warehouse) => warehouse.warehouseID === warehouseID),
      );
    },
    [setWarehouse, warehouses],
  );

  const fetchData = useCallback(async () => {
    if (!warehouse) {
      return;
    }
    await fetchHistory({
      limit: 999,
      page: 1,
      warehouseID: warehouse.warehouseID,
      search: search.trim() || undefined,
      sort: `${sortBy} ${order}`,
    });
  }, [warehouse, search, sortBy, order]);

  const createHistory = async (req: AddBlisterDateRequest) => {
    await addHistory(req);
    await fetchData();
  };

  const removeHistory = async (req: DeleteBlisterDateRequest) => {
    await deleteHistory(req);
    setSelectedItem(undefined);
    await fetchData();
  };

  const editHistory = async (
    selectedItem: RotationDateHistoryGroup,
    addRotationDates: string[],
    deleteHistoryIDs: string[],
  ) => {
    if (
      selectedItem.histories.length === deleteHistoryIDs.length &&
      addRotationDates.length === 0
    ) {
      await deleteHistory({
        medicationID: selectedItem.medicationID,
        warehouseID: selectedItem.warehouseID,
        brandID: selectedItem.brandID,
      });
    } else {
      for (const historyID of deleteHistoryIDs) {
        await deleteHistory({ historyID });
      }
      for (const date of addRotationDates) {
        await addHistory({
          medicationID: selectedItem.medicationID,
          warehouseID: selectedItem.warehouseID,
          brandID: selectedItem.brandID,
          date,
        });
      }
    }
    setSelectedItem(undefined);
    await fetchData();
  };

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

        {!histories.length && !isFetching && (
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src="/images/empty.png"
              width={200}
              height={200}
              alt="Empty Box"
              unoptimized
            />
            <p>ไม่พบข้อมูลวันที่เปลี่ยนแผงยา</p>
          </div>
        )}

        {!isFetching &&
          warehouse?.warehouseID &&
          histories.map((history) => (
            <MedicineCard
              key={`${history.medicationID}-${history.warehouseID}-${history.brandID ?? ''}`}
              warehouseID={warehouse.warehouseID}
              data={history}
              editable={[WarehouseRole.ADMIN, WarehouseRole.EDITOR].includes(
                warehouse?.role,
              )}
              deletable={[WarehouseRole.ADMIN, WarehouseRole.EDITOR].includes(
                warehouse?.role,
              )}
              selectItem={(item, mode) => {
                setSelectedItem(item);
                setOpenModal(mode);
              }}
            />
          ))}
      </main>

      {warehouse && allowed && (
        <AddMedicineModal
          isOpen={openModal === 'create'}
          onClose={() => setOpenModal('closed')}
          onCreate={createHistory}
          warehouseID={warehouse.warehouseID}
          warehouseName={warehouse.warehouseName}
          medicines={medicines}
        />
      )}

      {selectedItem && warehouse && (
        <>
          <ViewMedicineModal
            isOpen={openModal === 'view'}
            onClose={() => setOpenModal('closed')}
            data={selectedItem}
          />
          {allowed && (
            <EditMedicineModal
              medicine={selectedItem}
              isOpen={openModal === 'edit'}
              onClose={() => setOpenModal('closed')}
              onSubmit={editHistory}
            />
          )}
          {allowed && (
            <DeleteMedicineModal
              data={selectedItem}
              isOpen={openModal === 'delete'}
              onClose={() => setOpenModal('closed')}
              onDelete={() => removeHistory(selectedItem)}
            />
          )}
        </>
      )}
    </main>
  );
}
