import { resolveWarehouseName, WarehouseDetail } from '@/core/@types';

export type WarehouseCardProps = {
  warehouseDetail: WarehouseDetail;
  onClick: (warehouseDetail: WarehouseDetail) => void;
};

export function WarehouseCard({
  warehouseDetail,
  onClick,
}: WarehouseCardProps) {
  return (
    <div
      className="rounded-lg bg-white text-black px-4 py-2 border cursor-pointer hover:bg-gray-50 ease-in duration-75 transition-colors min-h-40 flex flex-col justify-between"
      onClick={() => onClick(warehouseDetail)}
    >
      <h1 className="font-bold line-clamp-3 text-lg mb-1">
        {resolveWarehouseName(warehouseDetail)}
      </h1>
      <div className="flex items-end justify-between">
        <section className="space-y-2">
          <div className="flex items-center gap-4">
            <span>
              จำนวนสมาชิก: <span>{warehouseDetail.users.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              จำนวนยา: <span>{warehouseDetail.totalMedicine}</span>
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
