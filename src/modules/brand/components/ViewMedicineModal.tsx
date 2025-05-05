import { Image } from '@/components/ui';
import { MedicineBrand } from '@/core/@types';
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
  medicine: MedicineBrand;
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
        value: medicine.medicalName || '-',
      },
      {
        label: 'Trade ID',
        value: medicine.tradeID,
      },
      {
        label: 'ชื่อการค้า',
        value: medicine.tradeName || '-',
      },
      {
        label: 'แผงยา',
        value: medicine.blisterImageURL ?? '',
        type: 'image',
      },
      {
        label: 'เม็ดยา',
        value: medicine.tabletImageURL ?? '',
        type: 'image',
      },
      {
        label: 'กล่องยา',
        value: medicine.boxImageURL ?? '',
        type: 'image',
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
          {list
            .filter(({ value, type }) => !type || !!value)
            .map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-sm">{item.label}</p>
                {item.type === 'image' ? (
                  <Image
                    alt={`Medicine Brand Image ${item.label}`}
                    className="rounded-md"
                    src={item.value}
                    loader={() => item.value!}
                    width={400}
                    height={400}
                    unoptimized
                    useLoader
                    loaderSize={400}
                    responsiveSize={510}
                    style={{ height: 400 }}
                  />
                ) : (
                  <p className="text-md font-semibold">{item.value}</p>
                )}
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
