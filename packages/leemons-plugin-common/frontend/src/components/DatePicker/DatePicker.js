import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker as BubblesDatePicker } from '@bubbles-ui/components';
import { useLocale } from '@common';

// eslint-disable-next-line import/prefer-default-export
export const DatePicker = ({ locale, ...props }) => {
  const leemonsLocale = useLocale();
  return <BubblesDatePicker {...props} locale={leemonsLocale} />;
};

DatePicker.propTypes = {
  locale: PropTypes.string,
};
