import { RotationDateHistoryGroup } from '@/core/@types';
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
  data: RotationDateHistoryGroup;
  isOpen: boolean;
  onClose: () => void;
};

export function ViewMedicineModal({
  data,
  isOpen,
  onClose,
}: ViewMedicineModalProps) {
  const list = useMemo(
    () => [
      {
        label: 'House ID',
        value: `${data.warehouseID}-${data.medicationID}`,
      },
      {
        label: 'Medication ID',
        value: data.medicationID,
      },
      {
        label: 'ชื่อสามัญทางยา',
        value: data.medicalName,
      },
      {
        label: 'Tradename ID',
        value: data.tradeID || '-',
      },
      {
        label: 'ชื่อการค้า',
        value: data.tradeName || '-',
      },
      {
        label: 'วันที่เปลี่ยนแผงยา',
        value: data.histories[data.histories.length - 1].date,
      },
      {
        label: 'ประวัติวันที่เปลี่ยนแผงยา',
        type: 'list',
        values: data.histories.map(({ date }) => date),
      },
    ],
    [data],
  );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            ข้อมูลวันที่เปลี่ยนแผงยา
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
              {item.type === 'list' ? (
                <ul className="list-disc pl-5">
                  {item.values.map((value, index) => (
                    <li key={index} className="text-md font-semibold">
                      {value}
                    </li>
                  ))}
                </ul>
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
