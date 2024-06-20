import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Box, createStyles } from '@bubbles-ui/components';
import { getDataForUserAgentDatasetsRequest } from '@users/request';
import { UserDataset } from './UserDataset';

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
function UserDatasets({ userAgentId, isEditMode }) {
  const [datasets, setDatasets] = React.useState([]);
  const { classes } = DatasetStyles({}, { name: 'UserDatasets' });

  async function fetchDatasets() {
    const { data } = await getDataForUserAgentDatasetsRequest(userAgentId);
    setDatasets(data);
  }

  React.useEffect(() => {
    if (userAgentId) {
      fetchDatasets();
    }
  }, [userAgentId]);

  if (!datasets?.length) {
    return null;
  }

  return (
    <ContextContainer title="Hola Datasets" className={classes.container}>
      {datasets.map((dataset) => (
        <Box key={dataset.locationName}>
          <UserDataset dataset={dataset.data} isEditMode={isEditMode} />
        </Box>
      ))}
    </ContextContainer>
  );
}

UserDatasets.propTypes = {
  userAgentId: PropTypes.string,
  isEditMode: PropTypes.bool,
};

export { UserDatasets };
