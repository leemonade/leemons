import React from 'react';
import styles from '../../styles/Home.module.css';
import withPersistentState from 'src/HOC/withPersistentState';

function Counter({ persistentState: [state, setState, deleteState], id }) {
  return (
    <div className={styles.counter}>
      <p>
        Value counter {id}: <span style={{color: 'green'}}>{state.value}</span>
      </p>
      <button onClick={() => setState({ value: state.value + 1 })}>Increment Counter</button>
      <button onClick={() => deleteState()}>Delete Counter</button>
    </div>
  );
}

export default withPersistentState(Counter, 'counter', { value: 0 }, { value: 'deleted' });
