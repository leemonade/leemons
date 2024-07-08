import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, Title } from '@bubbles-ui/components';
import { TranslatorTabs } from '@bubbles-ui/leemons';
import { DatasetItemDrawerContext } from '../../context/DatasetItemDrawerContext';
import { FieldConfigLocaleContext } from './context/FieldConfigLocale';
import { Label } from './common/Label';
import { Description } from './common/Description';
import { Help } from './common/Help';
import { Multioption } from './Multioption';
import { Boolean } from './Boolean';
import { Select } from './Select';

const CONFIG_FIELD_TYPES = {
  text_field: null,
  rich_text: null,
  number: null,
  date: null,
  email: null,
  phone: null,
  link: null,
  multioption: <Multioption />,
  boolean: <Boolean />,
  select: <Select />,
  user: null,
  default: null,
};

const FieldConfigLocaleItem = ({ localeConfig }) => {
  const {
    form: { watch },
  } = useContext(DatasetItemDrawerContext);

  const fieldType = watch('config.type');

  return (
    <FieldConfigLocaleContext.Provider value={localeConfig}>
      <Label />
      <Description />
      <Help />
      {CONFIG_FIELD_TYPES[fieldType] ?? CONFIG_FIELD_TYPES.default}
    </FieldConfigLocaleContext.Provider>
  );
};

FieldConfigLocaleItem.propTypes = {
  localeConfig: PropTypes.object,
};

const FieldConfigLocale = () => {
  const { contextRef, render } = useContext(DatasetItemDrawerContext);

  const { messages, locales, defaultLocale } = contextRef;

  function onLocaleChange({ currentLocale: { code } }) {
    contextRef.selectedLocale = code;
    render();
  }

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[5] })}>
      <Title order={4}>{messages.fieldConfigLocaleTitle}</Title>
      <TranslatorTabs
        locales={locales}
        defaultLocale={defaultLocale}
        onLocaleChange={onLocaleChange}
      >
        <FieldConfigLocaleItem />
      </TranslatorTabs>
    </Box>
  );
};

export { FieldConfigLocale };
