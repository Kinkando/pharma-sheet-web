import { useEffect, useMemo, useState } from 'react';
import { SyncMedicineMetadata } from '@/core/@types';
import { Close, ContentPaste } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import { LoadingScreen } from '@/components/ui';

const label = {
  id: 'sync-medicine-tab',
  'aria-controls': 'sync-medicine-tabpanel',
};

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

  const [currentTab, setCurrentTab] = useState(0);
  const handleChange = (_: React.SyntheticEvent, newTab: number) =>
    setCurrentTab(newTab);

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

  const tabs = useMemo(
    () => [
      {
        id: 'medicine',
        label: 'ข้อมูลยา',
        value: metadata?.medication,
      },
      {
        id: 'brand',
        label: 'ชื่อการค้า/รูปภาพยา',
        value: metadata?.brand,
      },
      {
        id: 'history',
        label: 'วันที่เปลี่ยนแผงยา',
        value: metadata?.blisterDate,
      },
      {
        id: 'house',
        label: 'บ้านเลขที่ยา',
        value: metadata?.house,
      },
    ],
    [metadata],
  );

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
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs
                        value={currentTab}
                        onChange={handleChange}
                        aria-label="sync medicine tabs"
                      >
                        {tabs.map((tab, index) => (
                          <Tab
                            key={tab.id}
                            id={`${label.id}-${index}`}
                            aria-controls={`${label['aria-controls']}-${index}`}
                            label={tab.label}
                            className="!normal-case"
                          />
                        ))}
                      </Tabs>
                    </Box>

                    {tabs.map(({ id, value }, index) => (
                      <div
                        key={id}
                        role="tabpanel"
                        hidden={currentTab !== index}
                        id={`${id}-${index}`}
                        aria-labelledby={`${id}-${index}`}
                      >
                        {currentTab === index && (
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
                                {value?.sheetName}
                              </span>
                            </div>
                            <div>
                              <label>จำนวนยาทั้งหมด: </label>
                              <span className="font-bold text-black">
                                {value?.totalMedicine}
                              </span>
                            </div>
                            <div>
                              <label>จำนวนยาที่มีข้อมูล: </label>
                              <span className="font-bold text-black">
                                {value?.totalSkippedMedicine}
                              </span>
                            </div>
                            <div>
                              <label>จำนวนยาที่ไม่มีข้อมูล: </label>
                              <span className="font-bold text-black">
                                {value?.totalNewMedicine}
                              </span>
                            </div>
                            <div>
                              <label>จำนวนยาที่มีการแก้ไข: </label>
                              <span className="font-bold text-black">
                                {value?.totalUpdatedMedicine}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </Box>
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
