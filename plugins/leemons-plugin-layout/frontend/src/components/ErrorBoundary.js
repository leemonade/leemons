import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Stack, Title } from '@bubbles-ui/components';

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
      return (
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={2}
          fullWidth
          fullHeight
          direction="column"
        >
          <Title>Ups, hemos derramado la limonada 😅</Title>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </Stack>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
