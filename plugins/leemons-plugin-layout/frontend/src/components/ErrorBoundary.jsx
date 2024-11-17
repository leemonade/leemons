import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stack, Title } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@common/helpers/prefixPN';

function ErrorBoundaryMessage() {
  const [t] = useTranslateLoader(prefixPN('errorBoundaryMessage'));

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={2}
      fullWidth
      fullHeight
      direction="column"
    >
      <Title
        sx={(theme) => ({
          ...theme.other.cardAssignments.content.typo.md,
          color: '#5D6A6C',
        })}
      >
        {t()}
      </Title>
    </Stack>
  );
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryMessage />;
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
