import { Add, Download, Sync } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { SortDropdown } from '@/components/ui';
import {
  OrderOption,
  OrderSequence,
  SortOption,
  Warehouse,
  WarehouseRole,
} from '@/core/@types';
import { useState } from 'react';

export const sortOptions: SortOption[] = [
  { value: 'medicalName', label: 'ชื่อสามัญทางยา' },
  { value: 'address', label: 'บ้านเลขที่ยา' },
];

export const orderOptions: OrderOption[] = [
  { label: () => 'เรียงลำดับจากน้อยไปมาก', value: 'ASC' },
  { label: () => 'เรียงลำดับจากมากไปน้อย', value: 'DESC' },
];

export type ToolbarProps = {
  warehouse: Warehouse;
  sortBy: string;
  order: OrderSequence;
  onSortChange: (sortBy: string, order: OrderSequence) => void;
  onAddMedicine: () => void;
  onSyncMedicine: () => void;
  onExportMedicine: () => Promise<void>;
};

export function Toolbar({
  warehouse,
  sortBy,
  order,
  onAddMedicine,
  onSyncMedicine,
  onSortChange,
  onExportMedicine,
}: ToolbarProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const download = async () => {
    setIsDownloading(true);
    try {
      await onExportMedicine();
    } catch (error) {
      console.error('Error downloading medicine:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <div className="relative">
      <SortDropdown
        options={sortOptions}
        orders={orderOptions}
        sortBy={sortBy}
        order={order}
        onChange={onSortChange}
        buttonProps={{
          className: 'w-fit !px-2 max-[440px]:w-full',
        }}
      />
      <div className="absolute right-0 top-0 max-[440px]:relative max-[440px]:mt-4">
        <div className="flex items-center gap-4">
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={download}
            disabled={isDownloading}
            className="w-fit whitespace-nowrap max-[440px]:w-full"
          >
            {isDownloading && <CircularProgress size={24} />}
            {!isDownloading && <Download />}
            <span className="hidden sm:block">ดาวน์โหลด</span>
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="large"
            disabled={warehouse.role === WarehouseRole.VIEWER}
            onClick={onSyncMedicine}
            className="w-fit whitespace-nowrap max-[440px]:w-full"
          >
            <Sync />
            <span className="hidden sm:block">ซิงค์ข้อมูล</span>
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={warehouse.role === WarehouseRole.VIEWER}
            onClick={onAddMedicine}
            className="w-fit whitespace-nowrap max-[440px]:w-full"
          >
            <Add />
            <span className="hidden sm:block">เพิ่มข้อมูล</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
