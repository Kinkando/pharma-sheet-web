import { Fragment, useEffect, useState } from 'react';
import { Divider, Fab } from '@mui/material';
import { WarehouseRole, WarehouseUser } from '@/core/@types';
import { useUserManagement } from '@/modules/user/hooks/userManagement';
import { AddUserModal } from './AddUserModal';
import { DeleteUserModal } from './DeleteUserModal';
import { UserManagementCard } from './UserManagementCard';
import { UserTabProps } from './User';
import { Add } from '@mui/icons-material';

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
      <div>
        <Divider />
        {warehouseUsers.map((warehouseUser) => (
          <Fragment key={warehouseUser.userID}>
            <UserManagementCard
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

      <div className="absolute bottom-4 lg:bottom-10 right-4 lg:right-10">
        <Fab
          color="primary"
          aria-label="add"
          size="small"
          disabled={warehouse.role !== WarehouseRole.ADMIN}
          onClick={() => setOpenModal('add')}
        >
          <Add />
        </Fab>
      </div>
    </>
  );
}
