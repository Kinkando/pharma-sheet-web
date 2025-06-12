import { resolveWarehouseName, WarehouseDetail } from '@/core/@types';
import { Close } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
} from '@mui/material';
import { useState } from 'react';

export type ExportSheetModalProps = {
  warehouseDetails: WarehouseDetail[];
  isOpen: boolean;
  onClose: () => void;
  onExport: (warehouseIDs: string[]) => Promise<void>;
};

export function ExportSheetModal({
  warehouseDetails,
  isOpen,
  onClose,
  onExport,
}: ExportSheetModalProps) {
  const [isDownloading, setIsDeleting] = useState(false);
  const [selectedWarehouseIDs, setSelectedWarehouseIDs] = useState<string[]>(
    [],
  );
  const exportSheet = async (warehouseIDs: string[]) => {
    setIsDeleting(true);
    try {
      await onExport(warehouseIDs);
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
            ดาวน์โหลดไฟล์บ้านเลขที่ยา
          </div>
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
            disabled={isDownloading}
            className="w-fit"
          >
            <Close fontSize="inherit" color="error" />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <p>กรุณาเลือกศูนย์สุขภาพชุมชน</p>
        <FormGroup>
          {warehouseDetails.map((warehouse) => (
            <FormControlLabel
              key={warehouse.warehouseID}
              label={resolveWarehouseName(warehouse)}
              control={
                <Checkbox
                  checked={selectedWarehouseIDs.includes(warehouse.warehouseID)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setSelectedWarehouseIDs((prev) =>
                      isChecked
                        ? [...prev, warehouse.warehouseID]
                        : prev.filter((id) => id !== warehouse.warehouseID),
                    );
                  }}
                />
              }
            />
          ))}
        </FormGroup>
      </DialogContent>

      <Divider />
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={onClose}
          disabled={isDownloading}
        >
          ยกเลิก
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            selectedWarehouseIDs && exportSheet(selectedWarehouseIDs)
          }
          disabled={isDownloading || selectedWarehouseIDs.length === 0}
        >
          {isDownloading && (
            <CircularProgress size={16} className="mr-2 !text-white" />
          )}
          ดาวน์โหลด
        </Button>
      </DialogActions>
    </Dialog>
  );
}
