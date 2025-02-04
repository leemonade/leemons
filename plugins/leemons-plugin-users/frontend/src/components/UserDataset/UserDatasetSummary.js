import React from 'react';

import { compact } from 'lodash';
import PropTypes from 'prop-types';

import { UserDatasetDrawer } from './UserDatasetDrawer';
import { UserDatasets } from './UserDatasets';

function UserDatasetSummary({
  userId,
  userAgentIds,
  openEditDrawer,
  preferEditMode,
  canHandleEdit = true,
}) {
  const [showEditDrawer, setShowEditDrawer] = React.useState(openEditDrawer);
  const [canEdit, setCanEdit] = React.useState(false);
  const userDatasetsRef = React.useRef(null);

  React.useEffect(() => {
    if (canEdit && openEditDrawer) {
      setShowEditDrawer(true);
    }
  }, [openEditDrawer, canEdit]);

  // ····················································
  // HANDLERS

  function handleOnOpen() {
    setShowEditDrawer(true);
  }

  function handleOnClose() {
    setShowEditDrawer(false);
  }

  if (!compact(userAgentIds ?? []).length) {
    return null;
  }

  return (
    <>
      <UserDatasets
        ref={userDatasetsRef}
        userId={userId}
        userAgentIds={userAgentIds}
        onEdit={handleOnOpen}
        onCanEdit={(val) => {
          if (canHandleEdit) {
            setCanEdit(val);
          }
        }}
        openEditDrawer={showEditDrawer}
        canHandleEdit={canHandleEdit}
      />
      {canEdit && !preferEditMode && (
        <UserDatasetDrawer
          userId={userId}
          userAgentIds={userAgentIds}
          isOpen={showEditDrawer}
          onClose={handleOnClose}
        />
      )}
    </>
  );
}

UserDatasetSummary.propTypes = {
  userId: PropTypes.string,
  userAgentIds: PropTypes.array,
  openEditDrawer: PropTypes.bool,
  preferEditMode: PropTypes.bool,
  canHandleEdit: PropTypes.bool,
};

export { UserDatasetSummary };
