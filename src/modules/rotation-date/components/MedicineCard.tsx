import { RotationDateHistoryGroup } from '@/core/@types';
import { Delete, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export type MedicineCardProps = {
  warehouseID: string;
  data: RotationDateHistoryGroup;
  editable?: boolean;
  deletable?: boolean;
  selectItem: (
    data: RotationDateHistoryGroup,
    mode: 'view' | 'edit' | 'delete',
  ) => void;
};

export function MedicineCard({
  warehouseID,
  data,
  editable,
  deletable,
  selectItem,
}: MedicineCardProps) {
  return (
    <div
      className="w-full px-4 py-2 rounded-lg cursor-pointer border border-gray-300 hover:bg-gray-100 ease-in duration-150 transition-colors"
      onClick={() => selectItem(data, 'view')}
    >
      <p className="text-sm">
        House ID:{' '}
        <b className="">
          {warehouseID}-{data.medicationID}
        </b>
      </p>
      <p className="text-sm">
        Medication ID: <b className="">{data.medicationID}</b>
      </p>
      <p className="text-sm">
        ชื่อสามัญทางยา: <b className="">{data.medicalName}</b>
      </p>
      <p className="text-sm">
        Tradename ID: <b className="">{data.tradeID || '-'}</b>
      </p>
      <p className="text-sm">
        ชื่อการค้า: <b className="">{data.tradeName || '-'}</b>
      </p>
      {data.histories && (
        <p className="text-sm">
          วันที่เปลี่ยนแผงยา:{' '}
          <b className="">{data.histories[data.histories.length - 1].date}</b>
        </p>
      )}
      {(deletable || editable) && (
        <div className="flex items-center justify-end">
          {deletable && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                selectItem(data, 'delete');
              }}
            >
              <Delete />
            </IconButton>
          )}
          {editable && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                selectItem(data, 'edit');
              }}
            >
              <Edit />
            </IconButton>
          )}
        </div>
      )}
    </div>
  );
}
