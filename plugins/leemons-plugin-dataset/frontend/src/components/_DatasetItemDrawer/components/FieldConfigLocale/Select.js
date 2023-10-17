import React, { useContext } from 'react';
import { Box } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../context/DatasetItemDrawerContext';
import { SelectPlaceholder } from './common/SelectPlaceholder';
import { TranslateOptions } from './common/TranslateOptions';

const Select = () => {
  const {
    contextRef: { messages },
  } = useContext(DatasetItemDrawerContext);

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <SelectPlaceholder label={messages.localeMultioptionSelectPlaceholderLabel} />
      <TranslateOptions />
    </Box>
  );
};

export { Select };
