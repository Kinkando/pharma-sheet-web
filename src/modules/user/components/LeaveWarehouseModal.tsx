import { User, Warehouse, WarehouseRole, WarehouseUser } from '@/core/@types';
import { Close } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from '@mui/material';
import { useState } from 'react';

export type LeaveWarehouseModalProps = {
  user: User;
  warehouse: Warehouse;
  warehouseUsers: WarehouseUser[];
  isOpen: boolean;
  onClose: () => void;
  onLeave: () => Promise<void>;
};

export function LeaveWarehouseModal({
  user,
  warehouse,
  warehouseUsers,
  isOpen,
  onClose,
  onLeave,
}: LeaveWarehouseModalProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const deleteUser = async () => {
    setIsLeaving(true);
    try {
      await onLeave();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    } finally {
      setIsLeaving(false);
    }
  };
  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            ออกจากศูนย์สุขภาพชุมชน
          </div>
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
            disabled={isLeaving}
            className="w-fit"
          >
            <Close fontSize="inherit" color="error" />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
        คุณต้องการออกจาก{' '}
        <span className="text-red-500">{warehouse.warehouseName}</span>?
        {warehouseUsers.filter(
          (warehouseUser) =>
            warehouseUser.userID !== user.userID &&
            warehouseUser.role === WarehouseRole.ADMIN,
        ).length === 0 && (
          <p>
            หากคุณออกจากศูนย์สุขภาพชุมชน{' '}
            <span className="text-red-500">ศูนย์จะปิดตัวลง</span>
          </p>
        )}
      </DialogContent>

      <Divider />
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
          disabled={isLeaving}
        >
          ยกเลิก
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={deleteUser}
          disabled={isLeaving}
        >
          {isLeaving && (
            <CircularProgress size={16} className="mr-2 !text-white" />
          )}
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  );
}
