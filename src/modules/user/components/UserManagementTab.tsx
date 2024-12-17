import { Fragment, useEffect, useState } from 'react';
import { Button, Divider } from '@mui/material';
import { User, Warehouse, WarehouseRole, WarehouseUser } from '@/core/@types';
import { useWarehouse } from '@/modules/user/hooks/warehouse';
import { AddUserModal } from './AddUserModal';
import { DeleteUserModal } from './DeleteUserModal';
import { UserCard } from './UserCard';

export type UserManagementTabProps = {
  warehouse: Warehouse;
  user: User;
  onLoading: (isLoading: boolean) => void;
};

export function UserManagementTab({
  warehouse,
  user,
  onLoading,
}: UserManagementTabProps) {
  const {
    isLoading,
    warehouseUsers,
    addWarehouseUser,
    editWarehouseUser,
    removeWarehouseUser,
  } = useWarehouse(warehouse.warehouseID);

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
      <div className="flex items-center justify-between gap-4">
        <h1>Manage Access</h1>
        <Button
          variant="contained"
          color="success"
          disabled={warehouse.role !== WarehouseRole.ADMIN}
          onClick={() => setOpenModal('add')}
        >
          Add User
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
