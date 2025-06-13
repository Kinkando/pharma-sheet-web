import { DelaySearchBox } from '@/components/ui';
import { Warehouse } from '@/core/@types';
import { Add, Download } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Suspense } from 'react';

export type ToolbarProps = {
  warehouses: Warehouse[];
  setSearch: (search: string) => void;
  onAddWarehouse: () => void;
  onExportMedicineSheet: () => void;
};

export function Toolbar({
  warehouses,
  setSearch,
  onAddWarehouse,
  onExportMedicineSheet,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <Suspense fallback={null}>
        <DelaySearchBox onSearch={setSearch} />
      </Suspense>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        onClick={onExportMedicineSheet}
        disabled={!warehouses}
        className="w-fit whitespace-nowrap h-14"
      >
        <Download />
        <span className="hidden lg:block">ดาวน์โหลด</span>
      </Button>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={onAddWarehouse}
        className="w-fit whitespace-nowrap h-14"
      >
        <Add />
        <span className="hidden lg:block">เพิ่มศูนย์</span>
      </Button>
    </div>
  );
}
