import { useCallback, useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
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

export type AddMedicineModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (medicationID: string, medicalName: string) => Promise<void>;
};

export function AddMedicineModal({
  isOpen,
  onClose,
  onCreate,
}: AddMedicineModalProps) {
  const [medicationID, setMedicationID] = useState('');
  const [medicalName, setMedicalName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addMedicine = useCallback(async () => {
    if (!medicationID || !medicationID) {
      return;
    }
    setIsLoading(true);
    try {
      await onCreate(medicationID, medicalName);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [onClose, onCreate, medicationID, medicalName]);

  useEffect(() => {
    if (isOpen) {
      setMedicationID('');
      setMedicalName('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            เพิ่มข้อมูลยา
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
        <div className="space-y-4">
          <TextField
            type="text"
            label="Medication ID"
            placeholder="กรุณากรอก Medication ID"
            value={medicationID}
            onChange={(e) => setMedicationID(e.target.value)}
            disabled={isLoading}
            size="small"
            className="w-full"
          />
          <TextField
            type="text"
            label="ชื่อสามัญทางยา"
            placeholder="กรุณากรอกชื่อสามัญทางยา"
            value={medicalName}
            onChange={(e) => setMedicalName(e.target.value)}
            disabled={isLoading}
            size="small"
            className="w-full"
          />
        </div>
      </DialogContent>

      <Divider />
      <DialogActions>
        <Button
          variant="outlined"
          color="success"
          onClick={onClose}
          disabled={isLoading}
        >
          ยกเลิก
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={addMedicine}
          disabled={isLoading || !medicationID || !medicalName}
        >
          {isLoading && (
            <CircularProgress size={16} className="mr-2 !text-white" />
          )}
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  );
}
