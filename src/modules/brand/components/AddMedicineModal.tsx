import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  CreateMedicineBrandRequest,
  Medicine,
  MedicineBrand,
  MedicineBrandFile,
} from '@/core/@types';
import { DropFile, Image } from '@/components/ui';

const initMedicineBrand: MedicineBrand = {
  id: '',
  medicationID: '',
  medicalName: '',
  tradeID: '',
  tradeName: '',
};

const initFile: MedicineBrandFile = {
  blisterImage: {
    file: null,
    imageURL: '',
  },
  tabletImage: {
    file: null,
    imageURL: '',
  },
  boxImage: {
    file: null,
    imageURL: '',
  },
};

export type AddMedicineModalProps = {
  medicines: Medicine[];
  isOpen: boolean;
  onClose: () => void;
  onCreate: (req: CreateMedicineBrandRequest) => Promise<void>;
};

export function AddMedicineModal({
  medicines,
  isOpen,
  onClose,
  onCreate,
}: AddMedicineModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [medicineBrand, setMedicineBrand] = useState<MedicineBrand>({
    ...initMedicineBrand,
  });

  const [file, setFile] = useState<MedicineBrandFile>({ ...initFile });

  const setForm = (key: keyof MedicineBrand, value: string) => {
    setMedicineBrand((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addFile = (key: keyof MedicineBrandFile, file: FileList) => {
    if (file.length !== 1) {
      return;
    }
    const item = file.item(0);
    if (!item) {
      return;
    }
    setFile((prev) => ({
      ...prev,
      [key]: {
        file: item,
        imageURL: URL.createObjectURL(item),
      },
    }));
  };

  const removeFile = (key: keyof MedicineBrandFile) => {
    setFile((prev) => ({
      ...prev,
      [key]: {
        file: null,
        imageURL: '',
      },
    }));
  };

  const isInvalid = useMemo(
    () =>
      !medicineBrand.medicationID ||
      !medicineBrand.tradeID ||
      medicineBrand.tradeID === '-' ||
      (!medicineBrand.tradeName?.trim() &&
        !file.blisterImage.file &&
        !file.boxImage.file &&
        !file.tabletImage.file),
    [medicineBrand, file],
  );

  const addMedicine = useCallback(async () => {
    if (isInvalid) {
      return;
    }
    setIsLoading(true);
    try {
      await onCreate({
        ...medicineBrand,
        blisterImageFile: file.blisterImage.file ?? undefined,
        boxImageFile: file.boxImage.file ?? undefined,
        tabletImageFile: file.tabletImage.file ?? undefined,
      });
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [isInvalid, onCreate, medicineBrand, file, onClose]);

  useEffect(() => {
    if (isOpen) {
      setMedicineBrand({ ...initMedicineBrand });
      setFile({ ...initFile });
    }
  }, [isOpen]);

  const formList = useMemo(
    () => [
      {
        label: 'Medication ID',
        value: medicineBrand.medicationID,
        onSelect: (e: SelectChangeEvent<string | number>) =>
          setForm('medicationID', e.target.value as string),
        emptyText: 'กรุณาเลือก Medication ID',
        values: medicines.map((item) => ({
          value: item.medicationID,
          text: item.medicationID,
        })),
        type: 'select',
      },
      {
        label: 'ชื่อสามัญทางยา',
        value: medicineBrand.medicationID,
        onSelect: (e: SelectChangeEvent<string | number>) =>
          setForm('medicationID', e.target.value as string),
        emptyText: 'กรุณาเลือกชื่อสามัญทางยา',
        values: medicines.map((item) => ({
          value: item.medicationID,
          text: item.medicalName,
        })),
        type: 'select',
      },
      {
        label: 'Tradename ID',
        value: medicineBrand.tradeID,
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          setForm('tradeID', e.target.value),
        type: 'text',
      },
      {
        label: 'ชื่อการค้า',
        value: medicineBrand.tradeName,
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          setForm('tradeName', e.target.value),
        type: 'text',
      },
      {
        label: 'แผงยา',
        value: file.blisterImage.imageURL,
        key: 'blisterImage' as keyof MedicineBrandFile,
        type: 'file',
      },
      {
        label: 'เม็ดยา',
        value: file.tabletImage.imageURL,
        key: 'tabletImage' as keyof MedicineBrandFile,
        type: 'file',
      },
      {
        label: 'กล่องยา',
        value: file.boxImage.imageURL,
        key: 'boxImage' as keyof MedicineBrandFile,
        type: 'file',
      },
    ],
    [medicineBrand, medicines, file],
  );

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            เพิ่มข้อมูลการค้า
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
        <div className="space-y-4">
          {formList.map((item) => (
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
              {item.type === 'text' && (
                <TextField
                  type={item.type}
                  placeholder={item.label}
                  value={item.value}
                  onChange={item.onChange}
                  className="w-full"
                  size="small"
                />
              )}
              {item.type === 'file' && item.key && (
                <>
                  {!item.value && (
                    <DropFile
                      id={item.key}
                      onSelect={(e) => addFile(item.key, e)}
                      disabled={isLoading}
                    />
                  )}
                  {item.value && (
                    <div className="relative">
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
                      <div className="absolute right-2 top-2 bg-red-500 rounded-full">
                        <IconButton
                          onClick={() => removeFile(item.key)}
                          disabled={isLoading}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </>
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
          onClick={addMedicine}
          disabled={isLoading || isInvalid}
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
