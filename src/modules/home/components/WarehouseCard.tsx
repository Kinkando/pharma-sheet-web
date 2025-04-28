import { useRouter } from 'next/navigation';
import { resolveWarehouseName, WarehouseDetail } from '@/core/@types';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export type WarehouseCardProps = {
  warehouseDetail: WarehouseDetail;
  editable?: boolean;
  deletable?: boolean;
  onView: (warehouseDetail: WarehouseDetail) => void;
  onEdit: (warehouseDetail: WarehouseDetail) => void;
  onDelete: (warehouseDetail: WarehouseDetail) => void;
};

export function WarehouseCard({
  warehouseDetail,
  onView,
  editable,
  deletable,
  onEdit,
  onDelete,
}: WarehouseCardProps) {
  const { push } = useRouter();
  return (
    <div
      className="rounded-lg bg-white text-black px-4 py-2 border cursor-pointer hover:bg-gray-50 ease-in duration-75 transition-colors min-h-40 flex flex-col justify-between"
      onClick={() =>
        push(`/medicine?warehouseID=${warehouseDetail.warehouseID}`)
      }
    >
      <h1 className="font-bold line-clamp-3 text-lg mb-1">
        {resolveWarehouseName(warehouseDetail)}
      </h1>
      <div className="flex items-center justify-between">
        <section className="space-y-2">
          <div className="flex items-center gap-4">
            <span>
              จำนวนยา: <span>{warehouseDetail.totalMedicine}</span>
            </span>
          </div>
        </section>

        {(deletable || editable) && (
          <div className="flex items-center justify-end">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onView(warehouseDetail);
              }}
            >
              <Visibility />
            </IconButton>

            {deletable && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(warehouseDetail);
                }}
              >
                <Delete />
              </IconButton>
            )}

            {editable && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(warehouseDetail);
                }}
              >
                <Edit />
              </IconButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
