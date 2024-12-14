import { Medicine } from '@/core/@types';
import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from '@mui/material';
import Image from 'next/image';
import { useMemo } from 'react';

export type ViewMedicineModalProps = {
  medicine: Medicine;
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
        label: 'ตู้',
        value: medicine.lockerName,
      },
      {
        label: 'ชั้น',
        value: medicine.floor,
      },
      {
        label: 'ลำดับที่',
        value: medicine.no,
      },
      {
        label: 'บ้านเลขที่ยา',
        value: medicine.address,
      },
      {
        label: 'รายการยา',
        value: medicine.description,
      },
      {
        label: 'ชื่อการค้า',
        value: medicine.medicalName,
      },
      {
        label: 'Label ตะกร้า',
        value: medicine.label,
      },
    ],
    [medicine],
  );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            View Medicine
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
          {medicine.imageURL && (
            <div className="space-y-1">
              <p className="text-sm">ภาพประกอบ</p>
              <Image
                alt="Medicine Image"
                className="rounded-md"
                src={medicine.imageURL}
                loader={() => medicine.imageURL!}
                width={400}
                height={400}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
