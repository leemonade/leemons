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
      minWidth: 450,
      padding: 16,
    },
  };
});

export function EmptyState({ onClick, Icon, title, description, actionLabel, noAction }) {
  const { classes } = useEmptyStateStyles();

  return (
    <ContextContainer title={title || ''}>
      <Box noFlex className={classes.container}>
        <ContextContainer padded alignItems="center">
          <Box style={{ textAlign: 'center', width: '80%' }}>
            <Text className={classes.description}>{description || ''}</Text>
          </Box>
          {!noAction && (
            <Box>
              <Button variant="link" leftIcon={Icon} onClick={onClick}>
                {actionLabel}
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
  noAction: PropTypes.bool,
  description: PropTypes.string,
  title: PropTypes.string,
  actionLabel: PropTypes.string,
  Icon: PropTypes.node,
};
