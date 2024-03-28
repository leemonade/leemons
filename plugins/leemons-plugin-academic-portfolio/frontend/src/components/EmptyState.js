import React from 'react';
import PropTypes from 'prop-types';

import { ContextContainer, Button, Box, Text, createStyles } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';

export const useEmptyStateStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      color: globalTheme.border.color.primary.subtle,
      marginBottom: globalTheme.spacing.gap.xlg,
    },
    description: {
      maxWidth: 561,
      textAlign: 'center',
      ...globalTheme.content.typo.body['md--bold'],
      color: globalTheme.content.color.text.default,
    },
    container: {
      border: `2px dashed ${globalTheme.border.color.line.subtle}`,
      width: '50%',
      minWidth: 500,
      marginTop: 10,
    },
  };
});

export function EmptyState({ onClick, localizations = {}, archivedView }) {
  const { classes } = useEmptyStateStyles();

  return (
    <ContextContainer title={localizations?.emptyStates?.title || ''}>
      <Box className={classes.container}>
        <ContextContainer padded alignItems="center">
          <Box style={{ textAlign: 'center', width: '80%' }}>
            <Text className={classes.description}>
              {!archivedView && localizations?.emptyStates?.noProgramsCreated}
              {archivedView && localizations?.emptyStates?.noProgramsArchived}
            </Text>
          </Box>
          {!archivedView && (
            <Box>
              <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onClick}>
                {localizations?.labels?.addNewProgram}
              </Button>
            </Box>
          )}
        </ContextContainer>
      </Box>
    </ContextContainer>
  );
}

EmptyState.propTypes = {
  onClick: PropTypes.func,
  localizations: PropTypes.object,
  archivedView: PropTypes.bool,
};
