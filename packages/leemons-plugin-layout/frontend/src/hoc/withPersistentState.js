import React from 'react';
import { addAction, fireEvent } from 'leemons-hooks';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

class State extends React.Component {
  /*
   * The persisted state is an static variable
   * which stores the state values given by the WrappedComponent
   */
  static State = {};

  constructor(props, namespace, defaultValue, deletedValue) {
    super(props);

    /*
     * The namespace is the key where the state for this
     * caller is stored, allowing the user to share the
     * states between different components
     */
    this.namespace = namespace;

    this.deletedValue = deletedValue;

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

    /*
     * Create an action hook for the state update on the given namespace
     * then check if the updated state differs from the React State, if this
     * happens, update the state, allowing component syncronization.
     */
    addAction(`withPersistentState::stateUpdated-${this.namespace}`, () => {
      if (this.state !== State.State[this.namespace]) {
        this.setState(State.State[this.namespace]);
      }
    });

    /*
     * Create an action hook for the state deletion on the given namespace
     * returning the deletedValue of this component (not the one who deleted it)
     */
    addAction(`withPersistentState::stateDeleted-${this.namespace}`, () => {
      if (!this.deleted) {
        this.setState(this.deletedValue);
        this.deleted = true;
      }
    });
  }

  /*
   * React's setState encapsultation for changing
   * the persistent state on any setState.
   */
  setStateOverload(newValue, callback = () => {}) {
    if (!this.deleted) {
      this.setState(newValue, () => {
        State.State[this.namespace] = this.state;
        fireEvent(`withPersistentState::stateUpdated-${this.namespace}`);
        callback();
      });
    }
  }

  /*
   * Frees the persistent state and invalidates the
   * React' state (the last one can't be removed)
   */
  freeState() {
    this.deleted = true;
    delete State.State[this.namespace];
    this.setState(this.deletedValue);
    fireEvent(`withPersistentState::stateDeleted-${this.namespace}`);
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
      super(props, namespace, defaultValue, deletedValue);
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
