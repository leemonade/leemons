import React from 'react';
import styles from './Text.module.scss';

export default function index({ children, bold = false }) {
  return (
    <p className={`${styles.text} ${bold ? `${styles.bold}` : ''}`}>
      {children}
    </p>
  );
}
