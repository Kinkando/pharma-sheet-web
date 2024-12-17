import { Fragment, useEffect, useState } from 'react';
import { Button, Divider } from '@mui/material';
import { WarehouseRole, WarehouseUser } from '@/core/@types';
import { useUserManagement } from '@/modules/user/hooks/userManagement';
import { AddUserModal } from './AddUserModal';
import { DeleteUserModal } from './DeleteUserModal';
import { UserCard } from './UserCard';
import { UserTabProps } from './User';

export function UserManagementTab({
  warehouse,
  user,
  onLoading,
}: UserTabProps) {
  const {
    isLoading,
    warehouseUsers,
    addWarehouseUser,
    editWarehouseUser,
    removeWarehouseUser,
  } = useUserManagement(warehouse.warehouseID);

  useEffect(() => {
    onLoading(isLoading);
  }, [isLoading, onLoading]);

  const [openModal, setOpenModal] = useState<'closed' | 'add' | 'delete'>(
    'closed',
  );
  const [selectedWarehouseUser, setSelectedWarehouseUser] =
    useState<WarehouseUser>();

  const selectUser = (warehouseUser: WarehouseUser, event: 'delete') => {
    setSelectedWarehouseUser({ ...warehouseUser });
    setOpenModal(event);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="contained"
          color="success"
          disabled={warehouse.role !== WarehouseRole.ADMIN}
          onClick={() => setOpenModal('add')}
        >
          เพิ่มสมาชิก
        </Button>
      </div>

      <div>
        <Divider />
        {warehouseUsers.map((warehouseUser) => (
          <Fragment key={warehouseUser.userID}>
            <UserCard
              user={warehouseUser}
              editable={
                warehouse.role === WarehouseRole.ADMIN &&
                warehouseUser.userID !== user?.userID
              }
              deletable={
                warehouse.role === WarehouseRole.ADMIN &&
                warehouseUser.userID !== user?.userID
              }
              onDelete={() => selectUser(warehouseUser, 'delete')}
              onEdit={(warehouseUser) =>
                editWarehouseUser({
                  userID: warehouseUser.userID,
                  role: warehouseUser.role,
                  warehouseID: warehouse.warehouseID,
                })
              }
            />
            <Divider />
          </Fragment>
        ))}
      </div>

      <AddUserModal
        isOpen={openModal === 'add'}
        onClose={() => setOpenModal('closed')}
        onCreate={async (email, role) =>
          await addWarehouseUser({
            warehouseID: warehouse.warehouseID,
            email,
            role,
          })
        }
      />

      {selectedWarehouseUser && (
        <DeleteUserModal
          isOpen={openModal === 'delete'}
          onClose={() => setOpenModal('closed')}
          onDelete={async () =>
            await removeWarehouseUser({
              userID: selectedWarehouseUser.userID,
              warehouseID: warehouse.warehouseID,
            })
          }
          warehouseUser={selectedWarehouseUser}
        />
      )}
    </>
  );
}
