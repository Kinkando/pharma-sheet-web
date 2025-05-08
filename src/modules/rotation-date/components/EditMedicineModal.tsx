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
  TextField,
} from '@mui/material';
import { RotationDateHistoryGroup } from '@/core/@types';
import { DatePicker } from '@mui/x-date-pickers';
import { PickerValue } from '@mui/x-date-pickers/internals';

export type EditMedicineModalProps = {
  medicine: RotationDateHistoryGroup;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    selectedItem: RotationDateHistoryGroup,
    addRotationDates: string[],
    deleteHistoryIDs: string[],
  ) => Promise<void>;
};

export function EditMedicineModal({
  medicine,
  isOpen,
  onClose,
  onSubmit,
}: EditMedicineModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState<PickerValue>(null);
  const [addRotationDates, setAddRotationDates] = useState<string[]>([]);
  const [deleteHistoryIDs, setDeleteHistoryIDs] = useState<string[]>([]);

  const addDate = (value: PickerValue) => {
    const date = value?.format('YYYY-MM-DD') ?? '';
    if (date) {
      setAddRotationDates((prev) => [...prev, date]);
      setDate(null);
    }
  };

  const submit = useCallback(async () => {
    if (!addRotationDates.length && !deleteHistoryIDs.length) {
      return;
    }
    setIsLoading(true);
    try {
      await onSubmit(medicine, addRotationDates, deleteHistoryIDs);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [onClose, onSubmit, medicine, addRotationDates, deleteHistoryIDs]);

  const reset = () => {
    setAddRotationDates([]);
    setDeleteHistoryIDs([]);
    setDate(null);
  };

  const historyDates = useMemo(
    () =>
      [
        ...medicine.histories.filter(
          ({ id }) => !deleteHistoryIDs.includes(id),
        ),
        ...addRotationDates.map((date) => ({
          id: date,
          date: date.split('-').reverse().join('/'),
        })),
      ].sort(({ date: a }, { date: b }) => {
        const dateAText = a.split('/').reverse().join('/');
        const dateBText = b.split('/').reverse().join('/');
        const dateA = new Date(dateAText).getTime();
        const dateB = new Date(dateBText).getTime();
        return dateA - dateB;
      }),
    [medicine.histories, addRotationDates, deleteHistoryIDs],
  );

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, medicine]);

  const formList = useMemo(
    () => [
      {
        label: 'House ID',
        value: `${medicine.warehouseID}-${medicine.medicationID}`,
      },
      {
        label: 'Medication ID',
        value: medicine.medicationID,
      },
      {
        label: 'ชื่อสามัญทางยา',
        value: medicine.medicalName,
      },
      {
        label: 'Tradename ID',
        value: medicine.tradeID || '-',
      },
      {
        label: 'ชื่อการค้า',
        value: medicine.tradeName || '-',
      },
    ],
    [medicine],
  );

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            แก้ไขข้อมูลวันที่เปลี่ยนแผงยา
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
              <p className="text-md font-semibold">{item.value}</p>
            </div>
          ))}

          <Divider />

          <p className="text-sm">วันที่เปลี่ยนแผงยา</p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                value={date}
                onChange={setDate}
                slotProps={{
                  textField: {
                    size: 'small',
                    placeholder: 'กรุณาเลือกวันที่',
                    className: 'w-full',
                  },
                }}
              />
              <Button
                variant="contained"
                color="success"
                size="small"
                className="h-10"
                onClick={() => addDate(date)}
                disabled={
                  !date ||
                  historyDates.some(
                    ({ date: d }) => d === date.format('DD/MM/YYYY'),
                  )
                }
              >
                เพิ่ม
              </Button>
            </div>
          </div>

          {historyDates.map(({ id, date }) => (
            <div key={id} className="flex items-center gap-4">
              <TextField
                className="w-full"
                size="small"
                value={date}
                disabled
              />
              <Button
                variant="contained"
                color="error"
                size="small"
                className="h-10"
                onClick={() => setDeleteHistoryIDs((prev) => [...prev, id])}
              >
                <div className="overflow-hidden text-ellipsis max-w-16 w-full">
                  ลบ
                </div>
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>

      <Divider />
      <DialogActions>
        <Button
          variant="contained"
          color="warning"
          onClick={reset}
          disabled={isLoading}
        >
          รีเซ็ต
        </Button>
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
          onClick={submit}
          disabled={
            isLoading || (!addRotationDates.length && !deleteHistoryIDs.length)
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
