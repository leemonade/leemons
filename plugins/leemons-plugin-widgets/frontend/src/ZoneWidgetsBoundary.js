import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, Stack, Text } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@common/helpers/prefixPN';

const useStyles = createStyles((theme) => ({
  root: {
    padding: '70px 56px',
    backgroundColor: theme.other.global.background.color.surface.muted,
    borderRadius: theme.other.global.border.radius.md,
  },
  text: {
    ...theme.other.cardAssignments.content.typo.md,
    color: '#5D6A6C',
  },
}));

function ErrorBoundaryMessage({ className }) {
  const [t] = useTranslateLoader(prefixPN('errorBoundaryMessage'));
  const { classes } = useStyles();

  return (
    <Box className={className} fullWidth>
      <Box className={classes.root} fullWidth>
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={2}
          fullWidth
          fullHeight
          direction="column"
        >
          <Text className={classes.text}>{t()}</Text>
        </Stack>
      </Box>
    </Box>
  );
}

ErrorBoundaryMessage.propTypes = {
  className: PropTypes.string,
};

export default class ZoneWidgetsBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryMessage className={this.props.errorClassName} />;
    }

    return this.props.children;
  }
}

ZoneWidgetsBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  errorClassName: PropTypes.string,
};
