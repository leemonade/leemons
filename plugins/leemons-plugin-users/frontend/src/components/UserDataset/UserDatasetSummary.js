import React from 'react';
import PropTypes from 'prop-types';
import { UserDatasetDrawer } from './UserDatasetDrawer';
import { UserDatasets } from './UserDatasets';

function UserDatasetSummary({ userAgentIds, openEditDrawer, preferEditMode }) {
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

  if (!userAgentIds?.length) {
    return null;
  }

  return (
    <>
      <UserDatasets
        ref={userDatasetsRef}
        userAgentIds={userAgentIds}
        onEdit={handleOnOpen}
        onCanEdit={setCanEdit}
        openEditDrawer={showEditDrawer}
      />
      {canEdit && !preferEditMode && (
        <UserDatasetDrawer isOpen={showEditDrawer} onClose={handleOnClose} />
      )}
    </>
  );
}

UserDatasetSummary.propTypes = {
  userAgentIds: PropTypes.array,
  openEditDrawer: PropTypes.bool,
  preferEditMode: PropTypes.bool,
};

export { UserDatasetSummary };
