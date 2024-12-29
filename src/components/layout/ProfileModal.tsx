import { useEffect, useRef, useState } from 'react';
import { Close, Upload } from '@mui/icons-material';
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
import { User } from '@/core/@types';
import { useProfile } from '@/core/hooks';
import { UserAvatar } from '@/components/ui';

export type ProfileModalProps = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
};

export function ProfileModal({ user, isOpen, onClose }: ProfileModalProps) {
  const { isLoading, onUpdateProfile } = useProfile();
  const [displayName, setDisplayName] = useState(user.displayName ?? '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageURL, setImageURL] = useState(user.imageURL);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      setImageURL(user.imageURL);
      setDisplayName(user.displayName);
      setProfileImage(null);
    }
  }, [user.imageURL, user.displayName, isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const imageURL = URL.createObjectURL(file);
    setImageURL(imageURL);
    setProfileImage(file);
    e.target.value = '';
  };

  const onReset = () => {
    setDisplayName(user.displayName);
    setImageURL(user.imageURL);
    setProfileImage(null);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between gap-4 overflow-hidden w-full">
          <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
            ข้อมูลส่วนตัว
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
          <div className="flex items-center justify-center w-full">
            <div className="w-fit relative">
              <UserAvatar
                size="extra-large"
                imageURL={imageURL}
                email={user.email}
              />
              <div className="absolute bottom-0 right-0 rounded-full bg-white border-black shadow-lg">
                <IconButton onClick={() => fileInputRef.current?.click()}>
                  <Upload />
                </IconButton>
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple={false}
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="email">อีเมล</label>
            <TextField
              placeholder="กรุณาใส่อีเมลของคุณ"
              value={user.email}
              disabled
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">ชื่อเล่น</label>
            <TextField
              placeholder="กรุณาใส่ชื่อเล่นของคุณ"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                onUpdateProfile(displayName, profileImage, onClose)
              }
              disabled={isLoading}
            />
          </div>
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
            onClick={() => onUpdateProfile(displayName, profileImage, onClose)}
            disabled={isLoading}
          >
            {isLoading && (
              <CircularProgress size={16} className="mr-2 !text-white" />
            )}
            แก้ไข
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
