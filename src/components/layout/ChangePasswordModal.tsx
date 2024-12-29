import { useEffect, useMemo, useState } from 'react';
import { Close, Visibility, VisibilityOff } from '@mui/icons-material';
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
import { useProfile } from '@/core/hooks';

export type ChangePasswordModalProps = {
  email: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ChangePasswordModal({
  email,
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const { isLoading, onChangePassword } = useProfile();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isShowOldPassword, setIsShowOldPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmNewPassword, setIsShowConfirmNewPassword] =
    useState(false);

  useEffect(() => {
    if (isOpen) {
      onReset();
    }
  }, [isOpen]);

  const onReset = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const disabled = useMemo(() => {
    return (
      isLoading ||
      !oldPassword ||
      !newPassword ||
      !confirmNewPassword ||
      newPassword !== confirmNewPassword
    );
  }, [isLoading, oldPassword, newPassword, confirmNewPassword]);

  const inputs = [
    {
      label: 'รหัสผ่านเดิม',
      placeholder: 'กรุณาใส่รหัสผ่านเดิมของคุณ',
      value: oldPassword,
      onChange: setOldPassword,
      isShow: isShowOldPassword,
      setIsShow: setIsShowOldPassword,
    },
    {
      label: 'รหัสผ่านใหม่',
      placeholder: 'กรุณาใส่รหัสผ่านใหม่ของคุณ',
      value: newPassword,
      onChange: setNewPassword,
      isShow: isShowNewPassword,
      setIsShow: setIsShowNewPassword,
    },
    {
      label: 'ยืนยันรหัสผ่านใหม่',
      placeholder: 'กรุณาใส่รหัสผ่านใหม่อีกครั้ง',
      value: confirmNewPassword,
      onChange: setConfirmNewPassword,
      isShow: isShowConfirmNewPassword,
      setIsShow: setIsShowConfirmNewPassword,
    },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            เปลี่ยนรหัสผ่าน
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
          {inputs.map((input) => (
            <div key={input.label} className="flex flex-col gap-1">
              <label htmlFor="email">{input.label}</label>
              <TextField
                placeholder="กรุณาใส่รหัสผ่านเดิมของคุณ"
                value={input.value}
                onChange={(e) => input.onChange(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  !disabled &&
                  onChangePassword(email, oldPassword, newPassword, onClose)
                }
                disabled={isLoading}
                slotProps={{
                  input: {
                    endAdornment: input.isShow ? (
                      <Visibility
                        className="cursor-pointer"
                        onClick={() => input.setIsShow(false)}
                      />
                    ) : (
                      <VisibilityOff
                        className="cursor-pointer"
                        onClick={() => input.setIsShow(true)}
                      />
                    ),
                  },
                }}
              />
            </div>
          ))}
        </div>
      </DialogContent>

      <Divider />
      <DialogActions>
        <div className="p-2 space-x-4">
          <Button
            variant="outlined"
            color="info"
            onClick={onReset}
            disabled={isLoading}
          >
            รีเซ็ต
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() =>
              onChangePassword(email, oldPassword, newPassword, onClose)
            }
            disabled={disabled}
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
