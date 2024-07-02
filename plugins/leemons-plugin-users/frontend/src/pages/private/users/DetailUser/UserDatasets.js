import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Box, createStyles, ActionButton } from '@bubbles-ui/components';
import { EditIcon } from '@bubbles-ui/icons/solid';
import { getDataForUserAgentDatasetsRequest } from '@users/request';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { UserDataset } from './UserDataset';
import { UserDataDatasetDrawer } from '../../UserDataDatasetValues/UserDataDatasetDrawer';

const DatasetStyles = createStyles((theme) => ({
  container: {
    '& .mantine-InputWrapper-header label': {
      color: theme.colors.text01,
      fontWeight: 500,
    },
    '& .form-group.field .mantine-InputWrapper-root': {
      gap: '2px',
    },
    '& .form-group .section-content-wrapper': {
      gap: '8px',
    },
  },
}));

// Components that only the super admin or users with the permission to create users will have access to
function UserDatasets({ userAgentId }) {
  const [datasets, setDatasets] = React.useState([]);
  const [showEditDrawer, setShowEditDrawer] = React.useState(false);
  const [t] = useTranslateLoader(prefixPN('userDataDatasetPage'));
  const { classes } = DatasetStyles({}, { name: 'UserDatasets' });

  /**
   * The user can edit the datasets if at least one of them has at least one field that is not readonly.
   * Later, we will allow editing only the fields of the datasets that the user has permission to edit.
   * @returns {boolean}
   */
  const canEdit = React.useMemo(
    () =>
      datasets.some((dataset) =>
        Object.values(dataset.data.jsonUI).some((field) => !field['ui:readonly'])
      ),
    [datasets]
  );

  // ····················································
  // INIT DATA HANDLING

  async function fetchDatasets() {
    const { data } = await getDataForUserAgentDatasetsRequest(userAgentId);
    setDatasets(data);
  }

  React.useEffect(() => {
    if (userAgentId) {
      fetchDatasets();
    }
  }, [userAgentId]);

  // ····················································
  // HANDLERS

  function handleAddDataset() {
    setShowEditDrawer(true);
  }

  function handleOnClose() {
    setShowEditDrawer(false);
    fetchDatasets();
  }

  // ····················································
  // RENDER

  if (!datasets?.length) {
    return null;
  }

  return (
    <>
      <ContextContainer
        title={t('additionalInfo')}
        className={classes.container}
        titleRightZone={
          canEdit && (
            <ActionButton icon={<EditIcon width={18} height={18} />} onClick={handleAddDataset} />
          )
        }
      >
        {datasets.map((dataset) => (
          <Box key={dataset.locationName}>
            <UserDataset
              dataset={dataset.data}
              title={dataset.title}
              showTitle={datasets.length > 1}
            />
          </Box>
        ))}
      </ContextContainer>
      {canEdit && <UserDataDatasetDrawer isOpen={showEditDrawer} onClose={handleOnClose} />}
    </>
  );
}

UserDatasets.propTypes = {
  userAgentId: PropTypes.string,
};

export { UserDatasets };
