import React from 'react';
import PropTypes from 'prop-types';

const { Box, Title, Text, Divider, createStyles } = require('@bubbles-ui/components');

export const useContainerStyles = createStyles((theme, { hideDivider }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  titleSection: {
    marginBottom: theme.other.global.spacing.padding.xlg,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.gap.sm,
  },
  title: {
    ...theme.other.global.content.typo.heading.xsm,
    color: theme.other.global.content.color.text.default,
  },
  description: {
    ...theme.other.global.content.typo.body.md,
    color: theme.other.global.content.color.text.default,
  },
  content: {
    marginBottom: hideDivider ? 0 : theme.other.global.spacing.padding.lg,
    marginLeft: theme.other.global.spacing.padding.lg,
  },
}));

export function Container({
  title,
  description,
  children,
  hidden,
  hideDivider,
  hideSectionHeaders,
}) {
  const { classes } = useContainerStyles({ hideDivider });

  if (hidden) {
    return null;
  }

  return (
    <Box className={classes.root}>
      {!hideSectionHeaders && (
        <Box className={classes.titleSection}>
          <Title order={3} className={classes.title}>
            {title}
          </Title>
          {!!description?.length && <Text className={classes.description}>{description}</Text>}
        </Box>
      )}
      <Box className={classes.content}>{children}</Box>

      {!hideDivider && <Divider />}
    </Box>
  );
}

Container.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  hidden: PropTypes.bool,
  hideDivider: PropTypes.bool,
  hideSectionHeaders: PropTypes.bool,
};
