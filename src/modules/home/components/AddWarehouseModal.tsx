import { useCallback, useEffect, useState } from 'react';
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
  TextField,
} from '@mui/material';

export type AddWarehouseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (warehouseName: string) => Promise<void>;
};

export function AddWarehouseModal({
  isOpen,
  onClose,
  onCreate,
}: AddWarehouseModalProps) {
  const [warehouseName, setWarehouseName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addWarehouse = useCallback(async () => {
    if (!warehouseName) {
      return;
    }
    setIsLoading(true);
    try {
      await onCreate(warehouseName);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [onClose, onCreate, warehouseName]);

  useEffect(() => {
    if (isOpen) {
      setWarehouseName('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            เพิ่มข้อมูลศูนย์สุขภาพชุมชน
          </div>
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
            disabled={isLoading}
            className="w-fit"
          >
            <Close fontSize="inherit" color="error" />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />

      <DialogContent>
        <TextField
          type="text"
          placeholder="กรุณาใส่ชื่อศูนย์สุขภาพชุมชน"
          value={warehouseName}
          onChange={(e) => setWarehouseName(e.target.value)}
          disabled={isLoading}
          size="small"
          className="w-full"
        />
      </DialogContent>

      <Divider />
      <DialogActions>
        <Button
          variant="outlined"
          color="success"
          onClick={onClose}
          disabled={isLoading}
        >
          ยกเลิก
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={addWarehouse}
          disabled={isLoading || !warehouseName}
        >
          {isLoading && (
            <CircularProgress size={16} className="mr-2 !text-white" />
          )}
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  );
}
