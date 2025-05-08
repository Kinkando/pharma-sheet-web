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
import { Fragment, useMemo } from 'react';

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
        label: 'Tradename ID',
        value: medicine.tradeID,
      },
      {
        label: 'ชื่อการค้า',
        value: medicine.tradeName || '-',
      },
      {
        label: 'แผงยา',
        value: medicine.blisterImageURL ?? '',
        type: 'link',
      },
      {
        label: 'เม็ดยา',
        value: medicine.tabletImageURL ?? '',
        type: 'link',
      },
      {
        label: 'กล่องยา',
        value: medicine.boxImageURL ?? '',
        type: 'link',
      },
      {
        label: 'วันที่เปลี่ยนแผงยา',
        items: medicine.blisterDates?.map(
          ({ warehouseID, warehouseName, date }) => (
            <div
              key={warehouseID}
              className="font-bold flex items-center justify-between w-full"
            >
              <div>
                {warehouseName} {`(${warehouseID})`}
              </div>
              <div className="text-blue-500">{date}</div>
            </div>
          ),
        ),
        type: 'bullet',
      },
    ],
    [medicine],
  );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            ข้อมูลการค้า/รูปภาพยา
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
            .filter(({ value, items, type }) => !type || !!value || !!items)
            .map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-sm">{item.label}</p>
                {item.type === 'image' && item.value && (
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
                )}
                {item.type === 'link' && (
                  <a
                    href={item.value}
                    target="_blank"
                    className="underline text-blue-600"
                  >
                    ดูรูปภาพ
                  </a>
                )}
                {item.type === 'bullet' &&
                  item.items &&
                  item.items.map((subItem) => (
                    <Fragment key={item.label + '-' + subItem.key}>
                      {subItem}
                    </Fragment>
                  ))}
                {(!item.type || item.type === 'text') && (
                  <p className="text-md font-semibold">{item.value}</p>
                )}
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
