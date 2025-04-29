import { DelaySearchBox, Image, LoadingCircular } from '@/components/ui';
import { sortOptions, Toolbar } from './Toolbar';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useValidState } from '@/core/hooks';
import { MedicineBrandView, OrderSequence } from '@/core/@types';
import { useSearchParams } from 'next/navigation';
import { useMedicine } from '@/modules/medicine/hooks/medicine';
import { MedicineCard } from './MedicineCard';
import { DeleteMedicineModal } from './DeleteMedicineModal';
import { AddMedicineModal } from './AddMedicineModal';
import { ViewMedicineModal } from './ViewMedicineModal';
import { EditMedicineModal } from './EditMedicineModal';

export default function Medicines() {
  const searchParam = useSearchParams();
  const [search, setSearch] = useState(searchParam.get('search') || '');
  const [openModal, setOpenModal] = useState<
    'closed' | 'view' | 'edit' | 'delete' | 'create'
  >('closed');

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

  const [selectedMedicine, setSelectedMedicine] = useState<MedicineBrandView>();

  const {
    isFetching,
    medicineWithBrands,
    fetchMedicineWithBrands,
    addMedicine,
    editMedicine,
    removeMedicine,
  } = useMedicine();

  const fetchData = useCallback(
    async (loading = true) => {
      await fetchMedicineWithBrands(
        {
          limit: 999,
          page: 1,
          search: search.trim() || undefined,
          sort: `${sortBy} ${order}`,
        },
        loading,
      );
    },
    [search, sortBy, order],
  );

  useEffect(() => {
    fetchData();
  }, [search, sortBy, order]);

  const createMedicine = async (medicationID: string, medicalName: string) => {
    await addMedicine(medicationID, medicalName);
    await fetchData(false);
  };

  const updateMedicine = async (medicationID: string, medicalName: string) => {
    await editMedicine(medicationID, medicalName);
    setSelectedMedicine(undefined);
    await fetchData(false);
  };

  const deleteMedicine = async (medicationID: string) => {
    await removeMedicine(medicationID);
    setSelectedMedicine(undefined);
    await fetchData(false);
  };

  return (
    <main className="h-full relative">
      <LoadingCircular isLoading={isFetching} blur />

      <main className="space-y-4 lg:p-6 p-4">
        <Toolbar
          order={order}
          sortBy={sortBy}
          onAddMedicine={() => setOpenModal('create')}
          onSortChange={(sortBy, order) => {
            setSortBy(sortBy);
            setOrder(order);
          }}
        />

        <Suspense fallback={null}>
          <DelaySearchBox onSearch={setSearch} />
        </Suspense>

        {!medicineWithBrands.length && !isFetching && (
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
          medicineWithBrands.map((medicine) => (
            <MedicineCard
              key={medicine.medicationID}
              medicine={medicine}
              selectMedicine={(medicine, mode) => {
                setSelectedMedicine(medicine);
                setOpenModal(mode);
              }}
            />
          ))}
      </main>

      <AddMedicineModal
        isOpen={openModal === 'create'}
        onClose={() => setOpenModal('closed')}
        onCreate={createMedicine}
      />

      {selectedMedicine && (
        <>
          <ViewMedicineModal
            isOpen={openModal === 'view'}
            onClose={() => setOpenModal('closed')}
            medicine={selectedMedicine}
          />
          <EditMedicineModal
            isOpen={openModal === 'edit'}
            onClose={() => setOpenModal('closed')}
            medicine={selectedMedicine}
            onEdit={updateMedicine}
          />
          <DeleteMedicineModal
            isOpen={openModal === 'delete'}
            onClose={() => setOpenModal('closed')}
            medicine={selectedMedicine}
            onDelete={async () =>
              await deleteMedicine(selectedMedicine.medicationID)
            }
          />
        </>
      )}
    </main>
  );
}
