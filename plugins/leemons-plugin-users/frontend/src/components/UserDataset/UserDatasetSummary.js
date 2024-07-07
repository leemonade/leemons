import React from 'react';
import PropTypes from 'prop-types';
import { compact } from 'lodash';
import { UserDatasetDrawer } from './UserDatasetDrawer';
import { UserDatasets } from './UserDatasets';

function UserDatasetSummary({
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
          userAgentIds={userAgentIds}
          isOpen={showEditDrawer}
          onClose={handleOnClose}
        />
      )}
    </>
  );
}

UserDatasetSummary.propTypes = {
  userAgentIds: PropTypes.array,
  openEditDrawer: PropTypes.bool,
  preferEditMode: PropTypes.bool,
  canHandleEdit: PropTypes.bool,
};

export { UserDatasetSummary };
