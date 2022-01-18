import React from 'react';
import styles from './Button.module.scss';

export default function index() {
  return (
    <>
      <p className="green">Green</p>
      <p className={styles.green}>Green</p>
    </>
  );
}
