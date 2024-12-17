import { Fragment, useEffect } from 'react';
import { useJoinRequest } from '../hooks/joinRequest';
import { JoinRequestCard } from './JoinRequestCard';
import { UserTabProps } from './User';
import { WarehouseRole } from '@/core/@types';
import { Divider } from '@mui/material';

export function JoinRequestTab({ warehouse, onLoading }: UserTabProps) {
  const { isLoading, approve, reject, warehouseUsers } = useJoinRequest(
    warehouse.warehouseID,
  );

  useEffect(() => {
    onLoading(isLoading);
  }, [isLoading, onLoading]);

  return (
    <div>
      {warehouseUsers?.length > 0 && <Divider />}

      {warehouseUsers.map((warehouseUser) => (
        <Fragment key={warehouseUser.userID}>
          <JoinRequestCard
            user={warehouseUser}
            onApprove={() =>
              approve(warehouse.warehouseID, warehouseUser.userID)
            }
            onReject={() => reject(warehouse.warehouseID, warehouseUser.userID)}
            approvable={warehouse.role === WarehouseRole.ADMIN}
            rejectable={warehouse.role === WarehouseRole.ADMIN}
          />
          <Divider />
        </Fragment>
      ))}
    </div>
  );
}
