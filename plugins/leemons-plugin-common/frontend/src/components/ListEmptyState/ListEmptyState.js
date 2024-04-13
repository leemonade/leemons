import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
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
      maxWidth: 400,
      textAlign: 'center',
      ...globalTheme.content.typo.body['md--bold'],
      color: globalTheme.content.color.text.default,
    },
    container: {
      border: `2px dashed ${globalTheme.border.color.line.subtle}`,
      width: '50%',
      minWidth: 300,
      maxWidth: 450,
      marginTop: 10,
    },
  };
});

export function ListEmptyState({ title, description, buttonLabel, onClick = noop }) {
  const { classes } = useEmptyStateStyles();

  return (
    <ContextContainer title={title}>
      <Box className={classes.container}>
        <ContextContainer padded alignItems="center">
          <Box style={{ textAlign: 'center', width: '80%' }}>
            <Text className={classes.description}>{description}</Text>
          </Box>
          <Box>
            <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onClick}>
              {buttonLabel}
            </Button>
          </Box>
        </ContextContainer>
      </Box>
    </ContextContainer>
  );
}

ListEmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
