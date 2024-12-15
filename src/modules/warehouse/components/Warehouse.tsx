'use client';

import { useCallback, useState, Fragment, useContext } from 'react';
import { Button, Divider, MenuItem, Select } from '@mui/material';
import { useWarehouse } from '@/modules/warehouse/hooks/warehouse';
import {
  Warehouse as WarehouseModel,
  WarehouseRole,
  WarehouseUser,
} from '@/core/@types';
import { LoadingScreen } from '@/components/ui';
import { DeleteUserModal } from './DeleteUserModal';
import { AddUserModal } from './AddUserModal';
import { UserCard } from './UserCard';
import { GlobalContext } from '@/core/context';

export default function Warehouse() {
  const [warehouse, setWarehouse] = useState<WarehouseModel>({
    warehouseID: '',
    warehouseName: '',
    role: WarehouseRole.VIEWER,
    lockers: [],
  });

  const { user } = useContext(GlobalContext);

  const {
    isLoading,
    warehouses,
    warehouseUsers,
    addWarehouseUser,
    editWarehouseUser,
    removeWarehouseUser,
  } = useWarehouse(warehouse.warehouseID);

  const [openModal, setOpenModal] = useState<'closed' | 'add' | 'delete'>(
    'closed',
  );
  const [selectedWarehouseUser, setSelectedWarehouseUser] =
    useState<WarehouseUser>();

  const changeWarehouse = useCallback(
    (warehouseID: string) => {
      const item = warehouses.find(
        (warehouse) => warehouse.warehouseID === warehouseID,
      );
      if (item) {
        setWarehouse({ ...item });
      }
    },
    [warehouses],
  );

  const selectUser = (warehouseUser: WarehouseUser, event: 'delete') => {
    setSelectedWarehouseUser({ ...warehouseUser });
    setOpenModal(event);
  };

  return (
    <>
      <LoadingScreen isLoading={isLoading} />

      <main className="space-y-4 lg:p-6 p-4">
        <Select
          value={warehouse.warehouseID}
          displayEmpty
          onChange={(e) => changeWarehouse(e.target.value)}
          className="w-full"
        >
          <MenuItem value="" disabled>
            <p className="w-full">กรุณาเลือกศูนย์ยา</p>
          </MenuItem>
          {warehouses.map((warehouse) => (
            <MenuItem key={warehouse.warehouseID} value={warehouse.warehouseID}>
              {warehouse.warehouseName}
            </MenuItem>
          ))}
        </Select>

        {warehouse.warehouseID && (
          <div className="flex items-center justify-between gap-4">
            <h1>Manage Access</h1>
            <Button
              variant="contained"
              color="success"
              disabled={warehouse.role !== WarehouseRole.ADMIN}
              onClick={() => setOpenModal('add')}
            >
              Add people
            </Button>
          </div>
        )}

        {warehouse.warehouseID && (
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
        )}
      </main>

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
