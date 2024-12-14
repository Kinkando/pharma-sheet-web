import { Severity } from '@/core/@types';
import { Close } from '@mui/icons-material';
import { Slide, Alert as AlertMaterial, IconButton, Fade } from '@mui/material';
import { useEffect, useState } from 'react';

export type AlertProps = {
  isOpen?: boolean;
  onDismiss: (alert: boolean) => void;
  severity: Severity;
  message: string;
};

export function Alert({ isOpen, onDismiss, severity, message }: AlertProps) {
  const [_message, _setMessage] = useState('');
  const [_severity, _setSeverity] = useState<Severity>('info');

  useEffect(() => {
    if (isOpen) {
      let timeout = 2;
      _setSeverity(severity);
      _setMessage(message);
      const interval = setInterval(() => {
        if (timeout > 0) {
          timeout--;
        } else {
          clearInterval(interval);
          onDismiss(false);
        }
      }, 1000);
    }
  }, [isOpen]);

  return (
    <div className="fixed top-6 left-0 right-0 w-fit m-auto flex flex-col justify-start items-center z-[9999]">
      <Slide
        direction="down"
        in={isOpen}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        <div>
          <Fade in={isOpen} timeout={1000}>
            <AlertMaterial
              className="mx-4 shadow-lg"
              severity={_severity}
              elevation={8}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => onDismiss(false)}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
            >
              {_message}
            </AlertMaterial>
          </Fade>
        </div>
      </Slide>
    </div>
  );
}
