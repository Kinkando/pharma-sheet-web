import { Medicine, MedicineHouse } from '@/core/@types';
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
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

const initMedicine: MedicineHouse = {
  floor: 0,
  locker: '',
  no: 0,
  label: '',
  medicalName: '',
  medicationID: '',
  id: '',
};

export type MedicineModalProps = {
  warehouseID: string;
  medicines: Medicine[];
  medicine?: MedicineHouse;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medicine: MedicineHouse) => Promise<void>;
};

export function MedicineModal({
  warehouseID,
  medicines,
  medicine: medicineInput,
  isOpen,
  onClose,
  onSubmit,
}: MedicineModalProps) {
  const [medicine, setMedicine] = useState<MedicineHouse>({ ...initMedicine });

  useEffect(() => {
    if (isOpen) {
      setMedicine(medicineInput ? { ...medicineInput } : { ...initMedicine });
    }
  }, [isOpen, medicineInput]);

  const [isLoading, setIsLoading] = useState(false);
  const createMedicine = async (medicine: MedicineHouse) => {
    setIsLoading(true);
    try {
      await onSubmit(medicine);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = useMemo(() => {
    return [
      !!medicine.locker,
      medicine.floor > 0,
      medicine.no > 0,
      // !!medicine.medicalName,
      // !!medicine.label,
    ].every((pass) => pass);
  }, [medicine]);

  const setText = (key: string, isNumber?: boolean) => {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let text = e.target.value;
      if (isNumber) {
        text = Math.abs(+e.target.value).toString();
      }
      setMedicine((value) => ({ ...value, [key]: text }));
    };
  };

  const address = useMemo(() => {
    if (medicine.floor > 0 && medicine.no > 0 && medicine.locker) {
      return `${medicine.locker}-${medicine.floor}-${medicine.no}`;
    }
    return '';
  }, [medicine.floor, medicine.locker, medicine.no]);

  const list = useMemo(
    () => [
      {
        label: 'House ID',
        value: medicine.medicationID
          ? `${warehouseID}-${medicine.medicationID}`
          : '',
        type: 'text',
        disabled: true,
      },
      {
        label: 'ตู้',
        value: medicine.locker,
        onChange: setText('locker'),
        type: 'text',
      },
      {
        label: 'ชั้น',
        value: medicine.floor,
        onChange: setText('floor', true),
        type: 'number',
      },
      {
        label: 'ลำดับที่',
        value: medicine.no,
        onChange: setText('no', true),
        type: 'number',
      },
      {
        label: 'บ้านเลขที่ยา',
        value: address,
        type: 'text',
        disabled: true,
      },
      {
        label: 'Medication ID',
        value: medicine.medicationID,
        onSelect: (e: SelectChangeEvent<string | number>) =>
          setMedicine((value) => ({
            ...value,
            medicationID: e.target.value as string,
          })),
        emptyText: 'กรุณาเลือก Medication ID',
        values: medicines.map((item) => ({
          value: item.medicationID,
          text: item.medicationID,
        })),
        type: 'select',
      },
      {
        label: 'ชื่อสามัญทางยา',
        value: medicine.medicationID,
        onSelect: (e: SelectChangeEvent<string | number>) =>
          setMedicine((value) => ({
            ...value,
            medicationID: e.target.value as string,
          })),
        emptyText: 'กรุณาเลือกชื่อสามัญทางยา',
        values: medicines.map((item) => ({
          value: item.medicationID,
          text: item.medicalName,
        })),
        type: 'select',
      },
      {
        label: 'Label ตะกร้า',
        value: medicine.label,
        onChange: setText('label'),
        type: 'text',
      },
    ],
    [address, medicine, medicines, warehouseID],
  );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            {medicine.medicationID ? 'แก้ไข' : 'เพิ่ม'}ข้อมูลยา
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
              {item.type === 'select' && item.onSelect && (
                <Select
                  value={item.value}
                  displayEmpty
                  onChange={item.onSelect}
                  className="w-full"
                  size="small"
                >
                  <MenuItem value="" disabled>
                    {item.emptyText}
                  </MenuItem>
                  {item.values.map(({ text, value }) => (
                    <MenuItem key={value} value={value}>
                      {text}
                    </MenuItem>
                  ))}
                </Select>
              )}
              {item.type !== 'select' && (
                <TextField
                  type={item.type}
                  placeholder={item.label}
                  value={item.value}
                  onChange={item.onChange}
                  className="w-full"
                  size="small"
                  disabled={item.disabled}
                />
              )}
            </div>
          ))}
        </div>
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
          onClick={() => createMedicine(medicine)}
          disabled={isLoading || !isValid}
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
