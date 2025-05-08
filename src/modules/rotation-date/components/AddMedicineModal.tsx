import { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  AddBlisterDateRequest,
  MedicineView,
  RotationDateHistoryGroup,
} from '@/core/@types';
import { DatePicker } from '@mui/x-date-pickers';
import { PickerValue } from '@mui/x-date-pickers/internals';

type FormData = RotationDateHistoryGroup & { date: string };

const initMedicineBlisterDate: FormData = {
  medicationID: '',
  medicalName: '',
  warehouseID: '',
  warehouseName: '',
  brandID: '',
  tradeID: '',
  tradeName: '',
  date: '',
  histories: [],
};

export type AddMedicineModalProps = {
  warehouseID: string;
  warehouseName: string;
  medicines: MedicineView[];
  isOpen: boolean;
  onClose: () => void;
  onCreate: (req: AddBlisterDateRequest) => Promise<void>;
};

export function AddMedicineModal({
  warehouseID,
  warehouseName,
  medicines,
  isOpen,
  onClose,
  onCreate,
}: AddMedicineModalProps) {
  const [medicineBlisterDate, setMedicineBlisterDate] = useState<FormData>(
    initMedicineBlisterDate,
  );
  const [isLoading, setIsLoading] = useState(false);

  const addMedicineBlisterDate = useCallback(async () => {
    if (
      !medicineBlisterDate.date ||
      !medicineBlisterDate.medicationID ||
      !medicineBlisterDate.warehouseID
    ) {
      return;
    }
    setIsLoading(true);
    try {
      await onCreate({
        medicationID: medicineBlisterDate.medicationID,
        warehouseID: medicineBlisterDate.warehouseID,
        date: medicineBlisterDate.date,
        brandID: medicineBlisterDate.brandID || undefined,
      });
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [onClose, onCreate, medicineBlisterDate]);

  useEffect(() => {
    if (isOpen) {
      setMedicineBlisterDate({
        ...initMedicineBlisterDate,
        warehouseID,
        warehouseName,
      });
    }
  }, [isOpen, warehouseID, warehouseName]);

  const setForm = (key: keyof FormData, value: string) => {
    setMedicineBlisterDate((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formList = useMemo(() => {
    const selectMedication = (e: SelectChangeEvent<string | number>) => {
      setForm('medicationID', e.target.value as string);
      setForm('tradeID', '');
    };
    const selectTrade = (e: SelectChangeEvent<string | number>) => {
      setForm('tradeID', e.target.value as string);
      setForm(
        'brandID',
        medicines
          .find(
            ({ medicationID }) =>
              medicineBlisterDate.medicationID === medicationID,
          )
          ?.brands.find((item) => item.tradeID === e.target.value)?.id ?? '',
      );
    };
    const tradeList = medicines.find(
      ({ medicationID }) => medicineBlisterDate.medicationID === medicationID,
    )?.brands;
    return [
      {
        label: 'House ID',
        value: medicineBlisterDate.medicationID
          ? `${medicineBlisterDate.warehouseID}-${medicineBlisterDate.medicationID}`
          : '',
        disabled: true,
        type: 'text',
      },
      {
        label: 'Medication ID',
        value: medicineBlisterDate.medicationID,
        onSelect: selectMedication,
        emptyText: 'กรุณาเลือก Medication ID',
        values: medicines.map((item) => ({
          value: item.medicationID,
          text: item.medicationID,
        })),
        type: 'select',
      },
      {
        label: 'ชื่อสามัญทางยา',
        value: medicineBlisterDate.medicationID,
        onSelect: selectMedication,
        emptyText: 'กรุณาเลือกชื่อสามัญทางยา',
        values: medicines.map((item) => ({
          value: item.medicationID,
          text: item.medicalName,
        })),
        type: 'select',
      },
      {
        label: 'Tradename ID',
        value: medicineBlisterDate.tradeID,
        onSelect: selectTrade,
        emptyText: 'กรุณาเลือก Tradename ID',
        values: tradeList?.map((item) => ({
          value: item.tradeID,
          text: item.tradeID,
        })),
        allowedEmpty: true,
        type: 'select',
      },
      {
        label: 'ชื่อการค้า',
        value: medicineBlisterDate.tradeID,
        onSelect: selectTrade,
        emptyText: 'กรุณาเลือกชื่อการค้า',
        values: tradeList?.map((item) => ({
          value: item.tradeID,
          text: item.tradeName || '-',
        })),
        allowedEmpty: true,
        type: 'select',
      },
      {
        label: 'วันที่เปลี่ยนแผงยา',
        value: medicineBlisterDate.date,
        onChange: (value: PickerValue) =>
          setForm('date', value?.format('YYYY-MM-DD').toString() ?? ''),
        type: 'date',
      },
    ];
  }, [medicineBlisterDate, medicines]);

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            เพิ่มข้อมูลวันที่เปลี่ยนแผงยา
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
                  <MenuItem value="" disabled={!item.allowedEmpty}>
                    <span className="text-gray-400">{item.emptyText}</span>
                  </MenuItem>
                  {item.values?.map(({ text, value }) => (
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
                  disabled={item.disabled}
                  className="w-full"
                  size="small"
                />
              )}
              {item.type === 'date' && (
                <DatePicker
                  className="w-full"
                  format="DD/MM/YYYY"
                  onChange={item.onChange}
                  slotProps={{
                    textField: {
                      size: 'small',
                      placeholder: item.label,
                      className: 'w-full',
                    },
                  }}
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
          onClick={addMedicineBlisterDate}
          disabled={
            isLoading ||
            !medicineBlisterDate.date ||
            !medicineBlisterDate.medicationID ||
            !medicineBlisterDate.warehouseID
          }
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
