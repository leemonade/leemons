import React from 'react';
import PropTypes from 'prop-types';
import { Select } from '@bubbles-ui/components';
import { LOCALES } from '../constants';

const LocalePicker = ({
  label,
  placeholder,
  value,
  onLoadData = () => {},
  onChange = () => {},
  onChangeData = () => {},
  ...props
}) => {
  const [locales, setLocales] = React.useState([]);

  // ·····················································
  // DAATA PROCESSING

  const loadLocales = async () => {
    // TODO: load locales from server
    const data = LOCALES;
    setLocales(data);
    onLoadData(data);
  };

  React.useEffect(() => {
    loadLocales();
  }, []);

  // ·····················································
  // HANDLERS

  const handleOnChange = (val) => {
    onChange(val);
    onChangeData(locales.find((item) => item.value === val));
  };

  // ·····················································
  // RENDER

  return (
    <Select
      {...props}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={handleOnChange}
      data={locales}
    />
  );
};

LocalePicker.defaultProps = {};
LocalePicker.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onChangeData: PropTypes.func,
  onLoadData: PropTypes.func,
};

export default LocalePicker;
