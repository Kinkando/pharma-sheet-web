import { WarehouseRole } from '@/core/@types';
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
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (email: string, role: WarehouseRole) => Promise<void>;
};

export function AddUserModal({ isOpen, onClose, onCreate }: AddUserModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<WarehouseRole>(WarehouseRole.VIEWER);
  const [isLoading, setIsDeleting] = useState(false);

  const isValid = useMemo(() => {
    // ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
    return (
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) && !!role
    );
  }, [email]);

  const addUser = useCallback(async () => {
    if (!isValid) {
      return;
    }
    setIsDeleting(true);
    try {
      await onCreate(email, role);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  }, [email, role, isValid]);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setRole(WarehouseRole.VIEWER);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            Add User
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
            type="email"
            placeholder="Please enter an email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            size="small"
            className="w-full"
          />
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value as WarehouseRole)}
            className="w-full"
            size="small"
          >
            <MenuItem value={WarehouseRole.VIEWER}>
              <p className="w-full">{WarehouseRole.VIEWER}</p>
            </MenuItem>
            <MenuItem value={WarehouseRole.EDITOR}>
              <p className="w-full">{WarehouseRole.EDITOR}</p>
            </MenuItem>
            <MenuItem value={WarehouseRole.ADMIN}>
              <p className="w-full">{WarehouseRole.ADMIN}</p>
            </MenuItem>
          </Select>
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
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={addUser}
          disabled={isLoading || !isValid}
        >
          {isLoading && (
            <CircularProgress size={16} className="mr-2 !text-white" />
          )}
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
