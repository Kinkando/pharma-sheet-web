'use client';

import { useEffect, useState } from 'react';
import { CircularProgress, MenuItem, Select, TextField } from '@mui/material';
import { useMedicine } from '@/modules/home/hooks/medicine';
import { useDebounceSearchTerm } from '@/core/hooks/debouncedSearchTerm';
import { Close, Search } from '@mui/icons-material';
import Image from 'next/image';
import { MedicineCard } from './MedicineCard';

export default function Home() {
  const [selectedWarehouseID, setSelectedWarehouseID] = useState<string>('');
  const [search, setSearch] = useState('');
  const { debouncedSearchTerm } = useDebounceSearchTerm(search);
  const { warehouses, medicines, fetchMedicine } = useMedicine();

  useEffect(() => {
    if (selectedWarehouseID) {
      fetchMedicine({
        limit: 999,
        page: 1,
        warehouseID: selectedWarehouseID,
        search: debouncedSearchTerm,
      });
    }
  }, [selectedWarehouseID, debouncedSearchTerm]);

  return (
    <>
      <main className="space-y-4 h-full">
        <Select
          value={selectedWarehouseID}
          displayEmpty
          onChange={(e) => setSelectedWarehouseID(e.target.value)}
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

        <TextField
          placeholder="Search"
          className="w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={!selectedWarehouseID}
          slotProps={{
            input: {
              startAdornment: (
                <div className="mr-2">
                  <Search />
                </div>
              ),
              endAdornment:
                search !== debouncedSearchTerm ? (
                  <div className="ml-2 cursor-pointer">
                    <CircularProgress color="primary" size={24} />
                  </div>
                ) : search ? (
                  <div className="ml-2 cursor-pointer">
                    <Close onClick={() => setSearch('')} />
                  </div>
                ) : undefined,
            },
          }}
        />

        {selectedWarehouseID && !medicines.length && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Image
              src="/images/empty.png"
              width={200}
              height={200}
              alt="Empty Box"
            />
            <p>Medicine not found</p>
          </div>
        )}

        {medicines.map((medicine) => (
          <MedicineCard key={medicine.medicineID} medicine={medicine} />
        ))}
      </main>
    </>
  );
}
