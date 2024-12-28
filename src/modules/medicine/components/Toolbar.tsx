import { Add, Sync } from '@mui/icons-material';
import { Button } from '@mui/material';
import { SortDropdown } from '@/components/ui';
import {
  OrderOption,
  OrderSequence,
  SortOption,
  Warehouse,
  WarehouseRole,
} from '@/core/@types';

export const sortOptions: SortOption[] = [
  { value: 'description', label: 'ชื่อสามัญทางยา' },
  { value: 'medicalName', label: 'ชื่อการค้า' },
  { value: 'address', label: 'บ้านเลขที่ยา' },
  { value: 'label', label: 'Label ตะกร้า' },
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
};

export function Toolbar({
  warehouse,
  sortBy,
  order,
  onAddMedicine,
  onSyncMedicine,
  onSortChange,
}: ToolbarProps) {
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
            color="warning"
            size="large"
            disabled={warehouse.role === WarehouseRole.VIEWER}
            onClick={onSyncMedicine}
            className="w-fit whitespace-nowrap max-[440px]:w-full"
          >
            <Sync />
            ซิงค์ข้อมูล
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
            เพิ่มข้อมูล
          </Button>
        </div>
      </div>
    </div>
  );
}
