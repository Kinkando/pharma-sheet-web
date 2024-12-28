import { WarehouseDetail } from '@/core/@types';
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

export type DeleteWarehouseModalProps = {
  warehouseDetail: WarehouseDetail;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (warehouseDetail: WarehouseDetail) => Promise<void>;
};

export function DeleteWarehouseModal({
  warehouseDetail,
  isOpen,
  onClose,
  onDelete,
}: DeleteWarehouseModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteWarehouse = async (warehouseDetail: WarehouseDetail) => {
    setIsDeleting(true);
    try {
      await onDelete(warehouseDetail);
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
            Delete Warehouse
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
        Are you sure to delete warehouse{' '}
        <span className="text-red-500">{warehouseDetail.warehouseName}</span>?
      </DialogContent>

      <Divider />
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => deleteWarehouse(warehouseDetail)}
          disabled={isDeleting}
        >
          {isDeleting && (
            <CircularProgress size={16} className="mr-2 !text-white" />
          )}
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
