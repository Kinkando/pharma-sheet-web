import { useEffect, useState } from 'react';
import { SyncMedicineMetadata } from '@/core/@types';
import { Close, ContentPaste } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
} from '@mui/material';
import { LoadingScreen } from '@/components/ui';

export type SyncMedicineModalProps = {
  link: string;
  lastSync: string;
  metadata?: SyncMedicineMetadata;
  isOpen: boolean;
  onClose: () => void;
  onModifiy: (link: string) => Promise<void>;
  onSync: (link: string) => Promise<void>;
};

export function SyncMedicineModal({
  link,
  lastSync,
  metadata,
  isOpen,
  onClose,
  onModifiy,
  onSync,
}: SyncMedicineModalProps) {
  const [sheetURL, setSheetURL] = useState(link);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSheetURL(link);
  }, [link]);

  const getMedicineMetadata = async (sheetURL: string) => {
    setIsLoading(true);
    await onModifiy(sheetURL);
    setIsLoading(false);
  };

  const syncMedicine = async (sheetURL: string) => {
    setIsLoading(true);
    await onSync(sheetURL);
    setIsLoading(false);
  };

  const close = () => {
    onClose();
    setTimeout(() => setSheetURL(link), 300);
  };

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Dialog open={isOpen} onClose={close} maxWidth="md" fullWidth>
        <DialogTitle>
          <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
            <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
              ซิงค์ข้อมูลยา
            </div>
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={close}
              className="w-fit"
            >
              <Close fontSize="inherit" color="error" />
            </IconButton>
          </div>
        </DialogTitle>
        <Divider />

        <DialogContent>
          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="warehouse-name">ลิงก์ Google Sheet</label>
              <TextField
                placeholder="https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit?gid={sheet_id}"
                className="w-full"
                value={sheetURL}
                onChange={(e) => setSheetURL(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSync(sheetURL);
                  }
                }}
                disabled={isLoading}
                slotProps={{
                  input: {
                    endAdornment: (
                      <div className="ml-2 cursor-pointer">
                        <ContentPaste
                          onClick={() => {
                            navigator.clipboard.readText().then((text) => {
                              setSheetURL(text);
                            });
                          }}
                        />
                      </div>
                    ),
                  },
                }}
              />
            </div>
            {lastSync && (
              <div className="text-sm text-gray-500">
                ซิงค์ข้อมูลล่าสุดเมื่อ {lastSync}
              </div>
            )}
            {metadata && (
              <>
                <Divider />
                <div>
                  <label
                    htmlFor="medicine-metadata"
                    className="font-bold underline"
                  >
                    ข้อมูลยาที่พบใน Google Sheet
                  </label>
                  <div className="space-y-1 mt-2">
                    <div>
                      <label>ชื่อไฟล์: </label>
                      <span className="font-bold text-black">
                        {metadata.title}
                      </span>
                    </div>
                    <div>
                      <label>ชื่อชีท: </label>
                      <span className="font-bold text-black">
                        {metadata.sheetName}
                      </span>
                    </div>
                    <div>
                      <label>จำนวนยาทั้งหมด: </label>
                      <span className="font-bold text-black">
                        {metadata.totalMedicine}
                      </span>
                    </div>
                    <div>
                      <label>จำนวนยาที่มีข้อมูล: </label>
                      <span className="font-bold text-black">
                        {metadata.totalSkippedMedicine}
                      </span>
                    </div>
                    <div>
                      <label>จำนวนยาที่ไม่มีข้อมูล: </label>
                      <span className="font-bold text-black">
                        {metadata.totalNewMedicine}
                      </span>
                    </div>
                    <div>
                      <label>จำนวนยาที่มีการแก้ไข: </label>
                      <span className="font-bold text-black">
                        {metadata.totalUpdatedMedicine}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>

        <Divider />
        <DialogActions>
          <div className="flex items-center justify-end gap-4 w-full py-2 px-4">
            <Button
              variant="outlined"
              color="error"
              onClick={close}
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => getMedicineMetadata(sheetURL)}
              disabled={isLoading}
            >
              ตรวจสอบ
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => syncMedicine(sheetURL)}
              disabled={isLoading}
            >
              ยืนยัน
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
