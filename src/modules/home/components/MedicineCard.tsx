import { useRouter } from 'next/navigation';
import { Medicine } from '@/core/@types';
import { Delete, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export type MedicineCardProps = {
  medicine: Medicine;
  editable?: boolean;
  deletable?: boolean;
};

export function MedicineCard({
  medicine,
  editable,
  deletable,
}: MedicineCardProps) {
  const { push } = useRouter();
  return (
    <div
      className="w-full px-4 py-2 rounded-lg cursor-pointer border border-gray-300"
      onClick={() => push(`/medicine/${medicine.medicineID}`)}
    >
      <h2 className="font-bold line-clamp-1">{medicine.description}</h2>
      <p className="">{medicine.address}</p>
      <div className="flex items-center justify-end">
        {deletable && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Delete />
          </IconButton>
        )}
        {editable && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Edit />
          </IconButton>
        )}
      </div>
    </div>
  );
}
