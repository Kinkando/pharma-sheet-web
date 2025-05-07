import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { SortDropdown } from '@/components/ui';
import { OrderOption, OrderSequence, SortOption } from '@/core/@types';

export const sortOptions: SortOption[] = [
  { value: 'medicationID', label: 'Medication ID' },
  { value: 'medicalName', label: 'ชื่อสามัญทางยา' },
  { value: 'tradeID', label: 'Tradename ID' },
  { value: 'tradeName', label: 'ชื่อการค้า' },
];

export const orderOptions: OrderOption[] = [
  { label: () => 'เรียงลำดับจากน้อยไปมาก', value: 'ASC' },
  { label: () => 'เรียงลำดับจากมากไปน้อย', value: 'DESC' },
];

export type ToolbarProps = {
  sortBy: string;
  order: OrderSequence;
  onSortChange: (sortBy: string, order: OrderSequence) => void;
  onAddMedicine: () => void;
};

export function Toolbar({
  sortBy,
  order,
  onSortChange,
  onAddMedicine,
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
            color="primary"
            size="large"
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
