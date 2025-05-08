import { MedicineBrand, resolveWarehouseName } from '@/core/@types';
import { Delete, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export type MedicineCardProps = {
  medicine: MedicineBrand;
  selectMedicine: (
    medicine: MedicineBrand,
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
      <p className="text-sm">
        Tradename ID: <b className="">{medicine.tradeID}</b>
      </p>
      <p className="text-sm">
        ชื่อการค้า: <b className="">{medicine.tradeName || '-'}</b>
      </p>
      {medicine.blisterDates && (
        <div className="text-sm">
          วันที่เปลี่ยนแผงยา:
          {medicine.blisterDates.map(({ warehouseID, warehouseName, date }) => (
            <div key={warehouseID} className="font-bold">
              {resolveWarehouseName({
                warehouseID,
                warehouseName: warehouseName || warehouseID,
              })}
              {': '}
              <span className="text-blue-500">{date}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-end">
        {medicine.tradeID !== '-' && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              selectMedicine(medicine, 'delete');
            }}
          >
            <Delete />
          </IconButton>
        )}
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
