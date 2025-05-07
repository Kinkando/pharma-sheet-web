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
  TextField,
} from '@mui/material';
import {
  MedicineBrand,
  MedicineBrandFile,
  UpdateMedicineBrandRequest,
} from '@/core/@types';
import { DropFile, Image } from '@/components/ui';

export type EditMedicineModalProps = {
  medicine: MedicineBrand;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (brandID: string, req: UpdateMedicineBrandRequest) => Promise<void>;
};

export function EditMedicineModal({
  medicine,
  isOpen,
  onClose,
  onEdit,
}: EditMedicineModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [medicineBrand, setMedicineBrand] = useState<MedicineBrand>({
    ...medicine,
  });

  const [file, setFile] = useState<MedicineBrandFile>({
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
  });

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
    const url = URL.createObjectURL(item);
    setFile((prev) => ({
      ...prev,
      [key]: {
        file: item,
        imageURL: url,
      },
    }));
    setMedicineBrand((prev) => ({
      ...prev,
      [key + 'URL']: url,
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
    setMedicineBrand((prev) => ({
      ...prev,
      [key + 'URL']: '',
    }));
  };

  const isInvalid = useMemo(
    () =>
      JSON.stringify({ ...medicine, tradeName: medicine.tradeName ?? '' }) ===
        JSON.stringify(medicineBrand) ||
      !medicineBrand.medicationID ||
      !medicineBrand.tradeID ||
      (!medicineBrand.tradeName?.trim() &&
        !medicineBrand.blisterImageURL &&
        !medicineBrand.boxImageURL &&
        !medicineBrand.tabletImageURL),
    [medicineBrand, medicine],
  );

  const editMedicine = useCallback(async () => {
    if (isInvalid) {
      return;
    }
    setIsLoading(true);
    try {
      await onEdit(medicine.id, {
        tradeName: medicineBrand.tradeName,
        blisterImageFile: file.blisterImage.file ?? undefined,
        tabletImageFile: file.tabletImage.file ?? undefined,
        boxImageFile: file.boxImage.file ?? undefined,
        deleteBlisterImage:
          !!medicine.blisterImageURL && !medicineBrand.blisterImageURL,
        deleteTabletImage:
          !!medicine.tabletImageURL && !medicineBrand.tabletImageURL,
        deleteBoxImage: !!medicine.boxImageURL && !medicineBrand.boxImageURL,
      });
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [isInvalid, onEdit, medicine, medicineBrand, file, onClose]);

  useEffect(() => {
    if (isOpen) {
      setMedicineBrand({ ...medicine, tradeName: medicine.tradeName ?? '' });
      setFile({
        blisterImage: {
          file: null,
          imageURL: medicine.blisterImageURL ?? '',
        },
        tabletImage: {
          file: null,
          imageURL: medicine.tabletImageURL ?? '',
        },
        boxImage: {
          file: null,
          imageURL: medicine.boxImageURL ?? '',
        },
      });
    }
  }, [isOpen, medicine]);

  const formList = useMemo(
    () => [
      {
        label: 'Medication ID',
        value: medicineBrand.medicationID,
        disabled: true,
        type: 'text',
      },
      {
        label: 'ชื่อสามัญทางยา',
        value: medicineBrand.medicalName ?? '-',
        disabled: true,
        type: 'text',
      },
      {
        label: 'Tradename ID',
        value: medicineBrand.tradeID,
        disabled: true,
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
    [medicineBrand, file],
  );

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            แก้ไขข้อมูลการค้า
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
              {item.type === 'text' && (
                <TextField
                  type={item.type}
                  placeholder={item.label}
                  value={item.value}
                  onChange={item.onChange}
                  disabled={item.disabled}
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
          onClick={editMedicine}
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
