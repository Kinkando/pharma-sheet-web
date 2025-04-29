import { MedicineBrandView } from '@/core/@types';
import { Delete, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export type MedicineCardProps = {
  medicine: MedicineBrandView;
  selectMedicine: (
    medicine: MedicineBrandView,
    mode: 'view' | 'edit' | 'delete',
  ) => void;
};

export function MedicineCard({ medicine, selectMedicine }: MedicineCardProps) {
  return (
    <div
      className="w-full px-4 py-2 rounded-lg cursor-pointer border border-gray-300 hover:bg-gray-100 ease-in duration-150 transition-colors"
      onClick={() => selectMedicine(medicine, 'view')}
    >
      <p className="text-sm">
        Medication ID: <b className="">{medicine.medicationID}</b>
      </p>
      <p className="text-sm">
        ชื่อสามัญทางยา: <b className="">{medicine.medicalName}</b>
      </p>
      <div className="flex items-center justify-end">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            selectMedicine(medicine, 'delete');
          }}
        >
          <Delete />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            selectMedicine(medicine, 'edit');
          }}
        >
          <Edit />
        </IconButton>
      </div>
    </div>
  );
}
