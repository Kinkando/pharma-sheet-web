import { MedicineHouse } from '@/core/@types';
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

export type DeleteMedicineModalProps = {
  medicine: MedicineHouse;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
};

export function DeleteMedicineModal({
  medicine,
  isOpen,
  onClose,
  onDelete,
}: DeleteMedicineModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMedicine = async () => {
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
    onClose();
  };
  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            ลบข้อมูลยา
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
        คุณต้องการลบข้อมูลยา
        <span className="text-red-500">
          {` [${medicine.medicationID}]`} {medicine.medicalName}
        </span>
        ?
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
          onClick={deleteMedicine}
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
