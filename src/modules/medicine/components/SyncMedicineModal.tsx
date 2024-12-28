import { Close, ContentPaste } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

export type SyncMedicineModalProps = {
  link: string;
  lastSync: string;
  isOpen: boolean;
  onClose: () => void;
  onSync: (link: string) => Promise<void>;
};

export function SyncMedicineModal({
  isOpen,
  onClose,
  link,
  lastSync,
  onSync,
}: SyncMedicineModalProps) {
  const [sheetURL, setSheetURL] = useState(link);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSheetURL(link);
  }, [link]);

  const syncMedicine = async (sheetURL: string) => {
    setIsLoading(true);
    await onSync(sheetURL);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            ซิงค์ข้อมูลยา
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
                  endAdornment: isLoading ? (
                    <div className="ml-2 mt-2 cursor-pointer">
                      <CircularProgress color="primary" size={24} />
                    </div>
                  ) : (
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
        </div>
      </DialogContent>

      <Divider />
      <DialogActions>
        <div className="flex items-center justify-end gap-4 w-full py-2 px-4">
          <Button
            variant="outlined"
            color="error"
            onClick={onClose}
            disabled={isLoading}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => syncMedicine(sheetURL)}
            disabled={isLoading}
          >
            {isLoading && (
              <CircularProgress size={16} className="mr-2 !text-white" />
            )}
            ยืนยัน
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
