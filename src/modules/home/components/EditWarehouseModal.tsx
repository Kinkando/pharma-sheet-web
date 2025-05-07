import { WarehouseDetail } from '@/core/@types';
import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

export type EditWarehouseModalProps = {
  warehouseDetail: WarehouseDetail;
  isOpen: boolean;
  onClose: () => void;
  onEditWarehouse: (
    warehouseID: string,
    warehouseName: string,
  ) => Promise<void>;
};

export function EditWarehouseModal({
  warehouseDetail,
  isOpen,
  onClose,
  onEditWarehouse,
}: EditWarehouseModalProps) {
  const [warehouseName, setWarehouseName] = useState('');
  useEffect(() => {
    if (isOpen) {
      setWarehouseName(warehouseDetail.warehouseName);
    }
  }, [isOpen, warehouseDetail]);

  const editWarehouse = async (warehouseID: string, warehouseName: string) => {
    await onEditWarehouse(warehouseID, warehouseName);
    onClose();
  };

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            แก้ไขข้อมูลศูนย์สุขภาพชุมชน
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
        <div className="space-y-4 !-mx-6 !-my-5">
          <div className="flex flex-col gap-1 px-6 pt-5">
            <label htmlFor="warehouse-name">ไอดีศูนย์สุขภาพชุมชน</label>
            <div className="flex items-center gap-2">
              <TextField
                className="w-full"
                placeholder="กรุณาใส่ชื่อศูนย์สุขภาพชุมชน"
                value={warehouseDetail.warehouseID}
                disabled
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 px-6 pb-5">
            <label htmlFor="warehouse-name">ชื่อศูนย์สุขภาพชุมชน</label>
            <div className="flex items-center gap-4">
              <TextField
                className="w-full"
                placeholder="กรุณาใส่ชื่อศูนย์สุขภาพชุมชน"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  warehouseName &&
                  editWarehouse(warehouseDetail.warehouseID, warehouseName)
                }
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  editWarehouse(warehouseDetail.warehouseID, warehouseName)
                }
                className="h-14"
              >
                บันทึก
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
