'use client';

import { HttpStatusCode } from 'axios';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  CircularProgress,
  Fab,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Add, Close, Search } from '@mui/icons-material';
import { Medicine, WarehouseRole } from '@/core/@types';
import { useDebounceSearchTerm } from '@/core/hooks';
import { GlobalContext } from '@/core/context';
import { useMedicine } from '@/modules/home/hooks/medicine';
import {
  createMedicine,
  deleteMedicine,
  updateMedicine,
} from '@/core/repository';
import { DeleteMedicineModal } from './DeleteMedicineModal';
import { MedicineModal } from './MedicineModal';
import { MedicineCard } from './MedicineCard';
import { ViewMedicineModal } from './ViewMedicineModal';

export default function Home() {
  const { alert } = useContext(GlobalContext);
  const searchParam = useSearchParams();
  const [search, setSearch] = useState(searchParam.get('search') || '');
  const { debouncedSearchTerm, setDebouncedSearchTerm } = useDebounceSearchTerm(
    search,
    searchParam.get('search') ?? '',
  );
  const { warehouses, medicines, fetchMedicine, warehouse, setWarehouse } =
    useMedicine(searchParam.get('warehouseID'));
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine>();
  const [openModal, setOpenModal] = useState<
    'closed' | 'view' | 'edit' | 'delete' | 'create'
  >('closed');

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
  }, [warehouses, warehouse, debouncedSearchTerm]);

  const fetchData = useCallback(async () => {
    if (!warehouse) {
      return;
    }
    await fetchMedicine({
      limit: 999,
      page: 1,
      warehouseID: warehouse.warehouseID,
      search: debouncedSearchTerm,
    });
  }, [warehouse, debouncedSearchTerm]);

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
            <p className="w-full">กรุณาเลือกศูนย์ยา</p>
          </MenuItem>
          {warehouses.map((warehouse) => (
            <MenuItem key={warehouse.warehouseID} value={warehouse.warehouseID}>
              {warehouse.warehouseName}
            </MenuItem>
          ))}
        </Select>

        {warehouse?.warehouseID && (
          <TextField
            placeholder="Search"
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setDebouncedSearchTerm(search);
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <div
                    className="mr-2 cursor-pointer"
                    onClick={() => setDebouncedSearchTerm(search)}
                  >
                    <Search />
                  </div>
                ),
                endAdornment:
                  search !== debouncedSearchTerm ? (
                    <div className="ml-2 mt-2 cursor-pointer">
                      <CircularProgress color="primary" size={24} />
                    </div>
                  ) : search ? (
                    <div className="ml-2 cursor-pointer">
                      <Close
                        onClick={() => {
                          setSearch('');
                          setDebouncedSearchTerm('');
                        }}
                      />
                    </div>
                  ) : undefined,
              },
            }}
          />
        )}

        {warehouse?.warehouseID && !medicines.length && (
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src="/images/empty.png"
              width={200}
              height={200}
              alt="Empty Box"
              unoptimized
            />
            <p>Medicine not found</p>
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

      <div className="absolute bottom-4 lg:bottom-10 right-4 lg:right-10">
        <Fab
          color="primary"
          aria-label="add"
          size="small"
          onClick={() => setOpenModal('create')}
        >
          <Add />
        </Fab>
      </div>

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
