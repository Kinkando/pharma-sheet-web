import { Fragment, RefObject, useRef } from 'react';
import { Close } from '@mui/icons-material';
import { Divider, IconButton } from '@mui/material';
import { WarehouseRole } from '@/core/@types';
import { useClickOutside } from '@/core/hooks';

const roles = [
  {
    value: WarehouseRole.VIEWER,
    description: 'Can read medicines only',
  },
  {
    value: WarehouseRole.EDITOR,
    description: 'Can read and write medicine and warehouse locker',
  },
  {
    value: WarehouseRole.ADMIN,
    description: 'Can read, write all resources and manage user in warehouse',
  },
];

export type RoleMenuProps = {
  butttonRef: RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  onClose: () => void;
  role: WarehouseRole;
  disabled?: boolean;
  onClick: (role: WarehouseRole) => void;
};

export function RoleMenu({
  butttonRef,
  isOpen,
  onClose,
  role,
  disabled,
  onClick,
}: RoleMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, butttonRef, onClose, [ref, isOpen]);
  return (
    <div
      className={
        isOpen
          ? 'absolute z-20 left-0 top-10 bg-white text-black shadow-[2px_5px_15px_0px_rgba(204,204,204,1)] rounded-lg py-2 border'
          : 'hidden'
      }
      ref={ref}
    >
      <div className="w-56 overflow-hidden max-w-[400px]">
        <div className="px-4 py-2 flex items-center justify-between gap-4 w-full">
          <p>Choose Role</p>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <Divider />
        <div className="flex flex-col text-black">
          {roles.map((item) => (
            <Fragment key={item.value}>
              <div
                className={
                  'px-4 py-2 hover:bg-gray-100 cursor-pointer ease-in duration-150 transition-colors' +
                  (item.value === role ? ' !bg-gray-200' : '') +
                  (disabled ? ' !cursor-not-allowed' : '')
                }
                onClick={
                  role !== item.value && !disabled
                    ? () => onClick(item.value)
                    : undefined
                }
              >
                <p className="font-bold text-sm">{item.value}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <Divider />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
