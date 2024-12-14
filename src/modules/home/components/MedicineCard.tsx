import { Medicine } from '@/core/@types';
import { Delete, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export type MedicineCardProps = {
  medicine: Medicine;
  editable?: boolean;
  deletable?: boolean;
  selectMedicine: (
    medicine: Medicine,
    mode: 'view' | 'edit' | 'delete',
  ) => void;
};

export function MedicineCard({
  medicine,
  editable,
  deletable,
  selectMedicine,
}: MedicineCardProps) {
  return (
    <div
      className="w-full px-4 py-2 rounded-lg cursor-pointer border border-gray-300"
      onClick={() => selectMedicine(medicine, 'view')}
    >
      <h2 className="font-bold line-clamp-1">{medicine.description}</h2>
      <p className="">{medicine.address}</p>
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
    </div>
  );
}
