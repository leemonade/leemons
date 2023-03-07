import React from 'react';
import PropTypes from 'prop-types';
import { Box, Title, createStyles } from '@bubbles-ui/components';
import { LayoutHeader } from './Header';

export function useLayoutLocalizations() {
  return {
    assign: 'Asignar',
  };
}

export const useLayoutStyles = createStyles((theme, { onlyContent }) => {
  const sideMargins = {
    marginLeft: theme.other.global.spacing.padding['3xlg'],
    marginRight: theme.other.global.spacing.padding['3xlg'],
  };

  if (onlyContent) {
    return {
      content: {
        paddingLeft: theme.other.global.spacing.padding['3xlg'],
        paddingRight: theme.other.global.spacing.padding['3xlg'],
        paddingTop: theme.other.global.spacing.padding.lg,
        paddingBottom: theme.other.global.spacing.padding.lg,
        background: theme.other.global.background.color.surface.default,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.other.global.spacing.gap.xlg,
        maxWidth: theme.breakpoints.xl,
      },
      buttons: {
        padding: theme.other.global.spacing.padding.xlg,
        borderTop: `1px solid ${theme.other.global.border.color.line.muted}`,
        background: theme.other.global.background.color.surface.default,
      },
    };
  }
  return {
    root: {
      background: theme.other.global.background.color.surface.subtle,
      paddingBottom: theme.other.global.spacing.padding['3xlg'],
      minHeight: '100vh',
    },
    action: {
      ...sideMargins,
      ...theme.other.global.content.typo.heading.sm,
      color: theme.other.global.content.color.text.muted,

      paddingTop: theme.other.global.spacing.padding.lg,
      paddingBottom: theme.other.global.spacing.padding.lg,
    },
    content: {
      ...sideMargins,
      paddingLeft: theme.other.global.spacing.padding['3xlg'],
      paddingRight: theme.other.global.spacing.padding['3xlg'],
      paddingTop: theme.other.global.spacing.padding.lg,
      paddingBottom: theme.other.global.spacing.padding.lg,
      background: theme.other.global.background.color.surface.default,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.other.global.spacing.gap.xlg,
      maxWidth: theme.breakpoints.xl,
    },
    buttons: {
      ...sideMargins,
      padding: theme.other.global.spacing.padding.xlg,
      borderTop: `1px solid ${theme.other.global.border.color.line.muted}`,
      background: theme.other.global.background.color.surface.default,
      maxWidth: theme.breakpoints.xl,
    },
  };
});

export function Layout({ assignable, action, children, buttonsComponent, onlyContent }) {
  const localizations = useLayoutLocalizations();

  const assignableName = assignable?.asset?.name;

  const { classes } = useLayoutStyles({ onlyContent });

  return (
    <Box className={classes.root}>
      {!onlyContent && <LayoutHeader assign={localizations?.assign} name={assignableName} />}
      {!onlyContent && (
        <Title order={2} className={classes.action}>
          {action}
        </Title>
      )}
      <Box className={classes.content}>{children}</Box>
      {!!buttonsComponent && <Box className={classes.buttons}>{buttonsComponent}</Box>}
    </Box>
  );
}

Layout.propTypes = {
  assignable: PropTypes.shape({
    asset: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  action: PropTypes.string,
  children: PropTypes.node,
  buttonsComponent: PropTypes.node,
  onlyContent: PropTypes.bool,
};
