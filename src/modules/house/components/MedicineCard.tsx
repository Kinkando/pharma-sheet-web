import { MedicineHouse } from '@/core/@types';
import { Delete, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export type MedicineCardProps = {
  warehouseID: string;
  medicine: MedicineHouse;
  editable?: boolean;
  deletable?: boolean;
  selectMedicine: (
    medicine: MedicineHouse,
    mode: 'view' | 'edit' | 'delete',
  ) => void;
};

export function MedicineCard({
  warehouseID,
  medicine,
  editable,
  deletable,
  selectMedicine,
}: MedicineCardProps) {
  return (
    <div
      className="w-full px-4 py-2 rounded-lg cursor-pointer border border-gray-300 hover:bg-gray-100 ease-in duration-150 transition-colors"
      onClick={() => selectMedicine(medicine, 'view')}
    >
      <p className="text-sm">
        House ID:{' '}
        <b className="">
          {warehouseID}-{medicine.medicationID}
        </b>
      </p>
      <p className="text-sm">
        Medication ID: <b className="">{medicine.medicationID}</b>
      </p>
      <p className="text-sm">
        บ้านเลขที่ยา:{' '}
        <b className="">{`${medicine.locker}-${medicine.floor}-${medicine.no}`}</b>
      </p>
      <p className="text-sm">
        ชื่อสามัญทางยา: <b className="">{medicine.medicalName}</b>
      </p>
      <p className="text-sm">
        Label ตะกร้า: <b className="">{medicine.label || '-'}</b>
      </p>
      {(deletable || editable) && (
        <div className="flex items-center justify-end">
          {deletable && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                selectMedicine(medicine, 'delete');
              }}
            >
              <Delete />
            </IconButton>
          )}
          {editable && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                selectMedicine(medicine, 'edit');
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
