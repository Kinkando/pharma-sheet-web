import { DropFile } from '@/components/ui';
import { Locker, Medicine } from '@/core/@types';
import { Close, Delete } from '@mui/icons-material';
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
import Image from 'next/image';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

const initMedicine: Medicine = {
  address: '',
  description: '',
  floor: 0,
  label: '',
  lockerID: '',
  lockerName: '',
  medicalName: '',
  medicineID: '',
  no: 0,
};

export type MedicineModalProps = {
  medicine?: Medicine;
  lockers: Locker[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medicine: Medicine, file?: File) => Promise<void>;
};

export function MedicineModal({
  medicine: medicineInput,
  lockers,
  isOpen,
  onClose,
  onSubmit,
}: MedicineModalProps) {
  const [medicine, setMedicine] = useState<Medicine>({ ...initMedicine });

  const [file, setFile] = useState<File | null>(null);
  const addFile = (file: FileList) => {
    if (file.length === 1) {
      setMedicine((medicine) => ({
        ...medicine,
        imageURL: URL.createObjectURL(file.item(0)!),
      }));
      setFile(file.item(0));
    }
  };
  const removeFile = () => {
    setMedicine((medicine) => ({
      ...medicine,
      imageURL: undefined,
    }));
    setFile(null);
  };

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setMedicine(medicineInput ? { ...medicineInput } : { ...initMedicine });
    }
  }, [isOpen, medicineInput]);

  const [isLoading, setIsLoading] = useState(false);
  const createMedicine = async (medicine: Medicine, file?: File) => {
    setIsLoading(true);
    try {
      await onSubmit(medicine, file);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = useMemo(() => {
    return [
      !!medicine.address,
      !!medicine.description.trim(),
      medicine.floor >= 0,
      medicine.no >= 0,
      !!medicine.label,
      !!medicine.lockerID,
      !!medicine.medicalName,
    ].every((pass) => pass);
  }, [medicine]);

  const setText = (key: string) => {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setMedicine((value) => ({ ...value, [key]: e.target.value }));
  };

  useEffect(() => {
    let address = '';
    if (medicine.floor >= 0 && medicine.no >= 0 && medicine.lockerID) {
      address = `${lockers.find((locker) => locker.lockerID === medicine.lockerID)!.lockerName}-${medicine.floor}-${medicine.no}`;
    }
    setMedicine((value) => ({ ...value, address }));
  }, [medicine.floor, medicine.lockerID, medicine.no]);

  const list = useMemo(
    () => [
      {
        label: 'ตู้',
        value: medicine.lockerID,
        onSelect: (e: SelectChangeEvent<string | number>) =>
          setMedicine((value) => ({
            ...value,
            lockerID: e.target.value.toString(),
          })),
        type: 'select',
      },
      {
        label: 'ชั้น',
        value: medicine.floor,
        onChange: setText('floor'),
        type: 'number',
      },
      {
        label: 'ลำดับที่',
        value: medicine.no,
        onChange: setText('no'),
        type: 'number',
      },
      {
        label: 'บ้านเลขที่ยา',
        value: medicine.address,
        onChange: setText('address'),
        type: 'text',
        disabled: true,
      },
      {
        label: 'ชื่อสามัญทางยา',
        value: medicine.description,
        onChange: setText('description'),
        type: 'text',
      },
      {
        label: 'ชื่อการค้า',
        value: medicine.medicalName,
        onChange: setText('medicalName'),
        type: 'text',
      },
      {
        label: 'Label ตะกร้า',
        value: medicine.label,
        onChange: setText('label'),
        type: 'text',
      },
    ],
    [medicine],
  );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            {medicine.medicineID ? 'Edit' : 'Create'} Medicine
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
                    กรุณาเลือกตู้
                  </MenuItem>
                  {lockers.map((locker) => (
                    <MenuItem key={locker.lockerID} value={locker.lockerID}>
                      {locker.lockerName}
                    </MenuItem>
                  ))}
                </Select>
              )}
              {item.type !== 'select' && item.onChange && (
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

          <div className="space-y-1">
            <p className="text-sm">ภาพประกอบ</p>
            {!medicine.imageURL && (
              <DropFile onSelect={addFile} disabled={isLoading} />
            )}
            {medicine.imageURL && (
              <div className="relative">
                <Image
                  alt="Medicine Image"
                  className="rounded-md"
                  src={medicine.imageURL}
                  loader={() => medicine.imageURL!}
                  width={400}
                  height={400}
                  unoptimized
                />
                <div className="absolute right-2 top-2 bg-red-500 rounded-full">
                  <IconButton onClick={removeFile} disabled={isLoading}>
                    <Delete fontSize="small" />
                  </IconButton>
                </div>
              </div>
            )}
          </div>
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
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => createMedicine(medicine, file ?? undefined)}
          disabled={isLoading || !isValid}
        >
          {isLoading && (
            <CircularProgress size={16} className="mr-2 !text-white" />
          )}
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
