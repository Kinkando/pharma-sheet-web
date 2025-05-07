import { MouseEventHandler, useCallback, useState } from 'react';
import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from '@mui/material';
import {
  resolveWarehouseName,
  WarehouseDetail,
  WarehouseGroup,
} from '@/core/@types';
import { UserAvatar } from '@/components/ui';

export type WarehouseModalProps = {
  group: WarehouseGroup;
  warehouseDetail: WarehouseDetail;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (warehouseID: string) => Promise<void>;
  onCancelJoin: (warehouseID: string) => Promise<void>;
};

export function WarehouseModal({
  group,
  warehouseDetail,
  isOpen,
  onClose,
  onJoin,
  onCancelJoin,
}: WarehouseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const onClick = useCallback(
    (
      callback: (warehouseID: string) => Promise<void>,
    ): MouseEventHandler<HTMLButtonElement> => {
      return async () => {
        setIsLoading(true);
        try {
          await callback(warehouseDetail.warehouseID);
          onClose();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      };
    },
    [warehouseDetail],
  );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            ข้อมูลศูนย์สุขภาพชุมชน
          </div>
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
            disabled={isLoading}
            className="w-fit"
          >
            <Close fontSize="inherit" color="error" />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />

      <DialogContent>
        <section className="space-y-2">
          <p className="font-bold">{resolveWarehouseName(warehouseDetail)}</p>
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
          <div className="py-4">
            <Divider />
          </div>

          <p className="font-bold underline">รายชื่อสมาชิก</p>
          {warehouseDetail.users.map((user) => (
            <div
              key={user.userID}
              className="flex items-center gap-4 w-full overflow-hidden"
            >
              <UserAvatar
                size="large"
                imageURL={user.imageURL}
                email={user.email}
              />

              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                <div className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                  {user.displayName}
                </div>
                <div className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                  {user.email}
                </div>
              </div>
            </div>
          ))}
        </section>
      </DialogContent>

      <Divider />
      <DialogActions>
        {group === WarehouseGroup.OTHER_WAREHOUSE && (
          <Button
            variant="contained"
            color="info"
            onClick={onClick(onJoin)}
            disabled={isLoading}
          >
            ขอเข้าร่วม
          </Button>
        )}
        {group === WarehouseGroup.OTHER_WAREHOUSE_PENDING && (
          <Button
            variant="contained"
            color="warning"
            onClick={onClick(onCancelJoin)}
            disabled={isLoading}
          >
            ยกเลิกคำขอเข้าร่วม
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
