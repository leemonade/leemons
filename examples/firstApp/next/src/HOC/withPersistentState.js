import React from 'react';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

class State extends React.Component {
  /*
   * The persisted state is an static variable
   * which stores the state values given by the WrappedComponent
   */
  static State = {};

  constructor(props, namespace, defaultValue) {
    super(props);

    /*
     * The namespace is the key where the state for this
     * caller is stored, allowing the user to share the
     * states between different components
     *
     * WARNING: When updating the State of a namespace, only
     * the updater' component will be updated.
     */
    this.namespace = namespace;

    /*
     * Check if the stored state is deleted for this caller
     * but will let the other callers on the same namespace
     * to keep using the state (although it will remove the
     * current value)
     */
    this.deleted = false;

    // State initialization for a given namespace
    if (!State.State.hasOwnProperty(this.namespace)) {
      State.State[this.namespace] = defaultValue;
    }
    this.state = State.State[this.namespace];
  }

  /*
   * React's setState encapsultation for changing
   * the persistent state on any setState.
   */
  setStateOverload(newValue, callback = () => {}) {
    if (!this.deleted) {
      this.setState(newValue, () => {
        State.State[this.namespace] = this.state;
        callback();
      });
    }
  }

  /*
   * Frees the persistent state and invalidates the
   * React' state (the last one can't be removed)
   */
  freeState() {
    this.setState({});
    this.deleted = true;
    delete State.State[this.namespace];
  }
}

/*
 * Exports you Component with a State and SetState preserved between pages
 * but no between reloads
 */
export function withPersistentState(
  Component,
  namespace = getDisplayName(Component),
  defaultValue = {},
  deletedValue = defaultValue
) {
  class withPersistentState extends State {
    constructor(props) {
      super(props, namespace, defaultValue);
    }
    render() {
      return (
        <Component
          {...this.props}
          persistentState={[
            // state
            this.deleted ? deletedValue : this.state,
            // setState
            this.setStateOverload.bind(this),
            // freeState
            this.freeState.bind(this),
          ]}
        />
      );
    }
  }
  // Change displayName for React Dev Tools
  withPersistentState.displayName = `WithPersistentState[${namespace}](${getDisplayName(
    Component
  )})`;

  return withPersistentState;
}

export default withPersistentState;
