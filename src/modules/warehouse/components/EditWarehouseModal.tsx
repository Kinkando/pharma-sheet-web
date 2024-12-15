import { LockerDetail, WarehouseDetail } from '@/core/@types';
import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

export type EditWarehouseModalProps = {
  warehouseDetail: WarehouseDetail;
  isOpen: boolean;
  onClose: () => void;
  onEditWarehouse: (warehouseID: string, warehouseName: string) => void;
  onAddLocker: (warehouseID: string, lockerName: string) => Promise<void>;
  onEditLocker: (
    warehouseID: string,
    lockerID: string,
    lockerName: string,
  ) => void;
  onDeleteLocker: (warehouseID: string, lockerID: string) => void;
};

export function EditWarehouseModal({
  warehouseDetail,
  isOpen,
  onClose,
  onEditWarehouse,
  onAddLocker,
  onEditLocker,
  onDeleteLocker,
}: EditWarehouseModalProps) {
  const [warehouseName, setWarehouseName] = useState('');
  const [lockerName, setLockerName] = useState('');

  const [lockers, setLockers] = useState<LockerDetail[]>([]);

  useEffect(() => {
    if (isOpen) {
      setWarehouseName(warehouseDetail.warehouseName);
      setLockers([...warehouseDetail.lockerDetails]);
    }
  }, [isOpen, warehouseDetail]);

  const addLocker = async (warehouseID: string, lockerName: string) => {
    await onAddLocker(warehouseID, lockerName);
    setLockerName('');
  };

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            แก้ไขข้อมูลศูนย์สุขภาพชุมชน
          </div>
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
            className="w-fit"
          >
            <Close fontSize="inherit" color="error" />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <div className="space-y-2 !-mx-6 !-my-5">
          <div className="flex flex-col gap-1 px-6 py-5">
            <label htmlFor="warehouse-name">ชื่อศูนย์สุขภาพชุมชน</label>
            <div className="flex items-center gap-2">
              <TextField
                className="w-full"
                placeholder="กรุณาใส่ชื่อศูนย์สุขภาพชุมชน"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  warehouseName &&
                  onEditWarehouse(warehouseDetail.warehouseID, warehouseName)
                }
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  onEditWarehouse(warehouseDetail.warehouseID, warehouseName)
                }
                className="h-14"
              >
                บันทึก
              </Button>
            </div>
          </div>

          <Divider />
          <div className="flex flex-col gap-1 px-6 py-5">
            <label htmlFor="locker-name">ตู้</label>
            <div className="flex items-center gap-2">
              <TextField
                className="w-full"
                placeholder="กรุณาใส่ชื่อตู้"
                value={lockerName}
                onChange={(e) => setLockerName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  lockerName &&
                  addLocker(warehouseDetail.warehouseID, lockerName)
                }
              />
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  addLocker(warehouseDetail.warehouseID, lockerName)
                }
                className="h-14"
              >
                เพิ่ม
              </Button>
            </div>
          </div>

          {lockers && (
            <div className="px-6 pb-6 space-y-2 !-mt-3">
              {lockers?.map((locker, index) => (
                <div key={locker.lockerID} className="flex items-center gap-2">
                  <TextField
                    className="w-full"
                    placeholder="กรุณาใส่ชื่อตู้"
                    value={locker.lockerName}
                    onChange={(e) =>
                      setLockers((lockers) =>
                        lockers.map((locker, idx) =>
                          idx === index
                            ? { ...locker, lockerName: e.target.value }
                            : locker,
                        ),
                      )
                    }
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      locker.lockerName &&
                      onEditLocker(
                        warehouseDetail.warehouseID,
                        locker.lockerID,
                        locker.lockerName,
                      )
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      onEditLocker(
                        warehouseDetail.warehouseID,
                        locker.lockerID,
                        locker.lockerName,
                      )
                    }
                    disabled={!locker.lockerName}
                    className="h-14"
                  >
                    แก้ไข
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      onDeleteLocker(
                        warehouseDetail.warehouseID,
                        locker.lockerID,
                      )
                    }
                    className="h-14 line-clamp-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-16 w-full"
                  >
                    <div className="overflow-hidden text-ellipsis max-w-16 w-full">
                      ลบ {locker.totalMedicine}
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
