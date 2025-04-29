import { MedicineBrandView } from '@/core/@types';
import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from '@mui/material';
import { useMemo } from 'react';

export type ViewMedicineModalProps = {
  medicine: MedicineBrandView;
  isOpen: boolean;
  onClose: () => void;
};

export function ViewMedicineModal({
  medicine,
  isOpen,
  onClose,
}: ViewMedicineModalProps) {
  const list = useMemo(
    () => [
      {
        label: 'Medication ID',
        value: medicine.medicationID,
      },
      {
        label: 'ชื่อสามัญทางยา',
        value: medicine.medicalName,
      },
    ],
    [medicine],
  );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            ข้อมูลยา
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
        <div className="space-y-3">
          {list.map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="text-sm">{item.label}</p>
              <p className="text-md font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
