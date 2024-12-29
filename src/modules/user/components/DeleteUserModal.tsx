import { WarehouseUser } from '@/core/@types';
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

export type DeleteUserModalProps = {
  warehouseUser: WarehouseUser;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
};

export function DeleteUserModal({
  warehouseUser,
  isOpen,
  onClose,
  onDelete,
}: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteUser = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            ลบผู้ใช้งาน
          </div>
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
            disabled={isDeleting}
            className="w-fit"
          >
            <Close fontSize="inherit" color="error" />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
        คุณต้องการลบผู้ใช้งาน{' '}
        <span className="text-red-500">{warehouseUser.email}</span>?
      </DialogContent>

      <Divider />
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
          disabled={isDeleting}
        >
          ยกเลิก
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={deleteUser}
          disabled={isDeleting}
        >
          {isDeleting && (
            <CircularProgress size={16} className="mr-2 !text-white" />
          )}
          ลบ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
