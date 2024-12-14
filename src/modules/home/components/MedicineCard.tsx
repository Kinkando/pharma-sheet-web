import { Medicine } from '@/core/@types';
import { Delete, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export type MedicineCardProps = {
  medicine: Medicine;
};

export function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <div className="w-full px-4 py-2 rounded-lg cursor-pointer border border-gray-300">
      <h2 className="font-bold line-clamp-1">{medicine.description}</h2>
      <p className="">{medicine.address}</p>
      <div className="flex items-center justify-end">
        <IconButton>
          <Delete />
        </IconButton>
        <IconButton>
          <Edit />
        </IconButton>
      </div>
    </div>
  );
}
