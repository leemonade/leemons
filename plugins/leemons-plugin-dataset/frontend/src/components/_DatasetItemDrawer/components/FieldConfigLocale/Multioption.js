import React, { useContext } from 'react';
import { Box } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../context/DatasetItemDrawerContext';
import { SelectPlaceholder } from './common/SelectPlaceholder';
import { TranslateOptions } from './common/TranslateOptions';

const Multioption = () => {
  const {
    contextRef: { messages },
    form: { watch },
  } = useContext(DatasetItemDrawerContext);

  const uiType = watch('config.uiType');

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      {uiType === 'dropdown' ? (
        <SelectPlaceholder label={messages.localeMultioptionSelectPlaceholderLabel} />
      ) : null}
      <TranslateOptions />
    </Box>
  );
};

export { Multioption };
