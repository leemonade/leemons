import React, { useContext } from 'react';
import { Box } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../context/DatasetItemDrawerContext';
import { MinMax } from './common/MinMax';

const RichTextField = () => {
  const {
    contextRef: { messages },
    form: {
      control,
      formState: { errors },
    },
  } = useContext(DatasetItemDrawerContext);

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <MinMax
        label={messages.fieldLengthLabel}
        minLabel={messages.fieldLengthMinLabel}
        maxLabel={messages.fieldLengthMaxLabel}
        min="config.minLength"
        max="config.maxLength"
      />
    </Box>
  );
};

export { RichTextField };
