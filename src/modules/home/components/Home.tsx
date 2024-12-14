'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { CircularProgress, MenuItem, Select, TextField } from '@mui/material';
import { Close, Search } from '@mui/icons-material';
import { WarehouseRole } from '@/core/@types';
import { useDebounceSearchTerm } from '@/core/hooks';
import { useMedicine } from '@/modules/home/hooks/medicine';
import { MedicineCard } from './MedicineCard';

export default function Home() {
  const searchParam = useSearchParams();
  const [search, setSearch] = useState(searchParam.get('search') || '');
  const { debouncedSearchTerm, setDebouncedSearchTerm } = useDebounceSearchTerm(
    search,
    searchParam.get('search') ?? '',
  );
  const { warehouses, medicines, fetchMedicine, warehouse, setWarehouse } =
    useMedicine(searchParam.get('warehouseID'));

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
      fetchMedicine({
        limit: 999,
        page: 1,
        warehouseID: warehouse.warehouseID,
        search: debouncedSearchTerm,
      });
    }
  }, [warehouses, warehouse, debouncedSearchTerm]);

  return (
    <>
      <main className="space-y-4 h-full">
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
            />
          ))}
      </main>
    </>
  );
}
