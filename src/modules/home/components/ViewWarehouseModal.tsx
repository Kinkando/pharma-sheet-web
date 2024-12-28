import { WarehouseDetail } from '@/core/@types';
import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from '@mui/material';

export type ViewWarehouseModalProps = {
  warehouseDetail: WarehouseDetail;
  isOpen: boolean;
  onClose: () => void;
};

export function ViewWarehouseModal({
  warehouseDetail,
  isOpen,
  onClose,
}: ViewWarehouseModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            ข้อมูลศูนย์สุขภาพชุมชน
          </div>
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
            className="w-fit"
          >
            <Close fontSize="inherit" color="error" />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <div className="space-y-2">
          <p className="font-bold">{warehouseDetail.warehouseName}</p>
          <ul>
            {warehouseDetail.lockerDetails?.map((locker) => (
              <li key={locker.lockerID}>
                <span>
                  - ตู้ <span>{locker.lockerName}</span>{' '}
                  {`(${locker.totalMedicine})`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
