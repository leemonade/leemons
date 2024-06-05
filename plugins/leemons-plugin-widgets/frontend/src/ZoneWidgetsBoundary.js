import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Stack } from '@bubbles-ui/components';

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
      return (
        <ContextContainer title="Widget mojado">
          <Stack justifyContent="center" alignItems="center">
            <h1>Ups, hemos derramado la limonada sobre este widget y ahora no carga 😅</h1>
          </Stack>
        </ContextContainer>
      );
    }

    return this.props.children;
  }
}

ZoneWidgetsBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
