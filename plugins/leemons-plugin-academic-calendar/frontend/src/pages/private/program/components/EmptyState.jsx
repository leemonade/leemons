import React from 'react';
import PropTypes from 'prop-types';

import { Button, Box, Text, createStyles } from '@bubbles-ui/components';
import { OpenIcon } from '@bubbles-ui/icons/outline';
import { Link } from 'react-router-dom';

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
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      paddingTop: 24,
      gap: 24,
    },
    button: {
      padding: 8,
    },
  };
});

export function EmptyState({ t }) {
  const { classes } = useEmptyStateStyles();

  return (
    <Box className={classes.container}>
      <Box style={{ textAlign: 'center', width: '80%' }}>
        <Text className={classes.description}>{t('emptyDescription')}</Text>
      </Box>
      <Link to="/private/academic-portfolio/programs/">
        <Box className={classes.button}>
          <Button variant="link" leftIcon={<OpenIcon />}>
            {t('emptyButton')}
          </Button>
        </Box>
      </Link>
    </Box>
  );
}

EmptyState.propTypes = {
  t: PropTypes.any,
};
