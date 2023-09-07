import React, { useContext, useEffect } from 'react';
import { Box, Divider } from '@bubbles-ui/components';
import DatasetItemDrawerContext from '../../context/DatasetItemDrawerContext';
import { Options } from './common/Options';
import { ShowAs } from './common/ShowAs';
import { MinMax } from './common/MinMax';

const MultioptionField = () => {
  const {
    contextRef: { messages, errorMessages, selectOptions, classes },
    form: { watch, unregister },
  } = useContext(DatasetItemDrawerContext);

  const uiType = watch('config.uiType');

  useEffect(() => {
    const subscription = watch(({ config: { uiType } }, { name }) => {
      if (name === 'config.uiType' && uiType === 'radio') {
        unregister('config.minItems');
        unregister('config.maxItems');
      }
    });
    return () => subscription.unsubscribe();
  }, [uiType]);

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <ShowAs
        label={messages.multioptionShowAsLabel}
        required={errorMessages.multioptionShowAsRequired}
        data={selectOptions.fieldMultioptionShowAs}
        placeholder={messages.fieldMultioptionShowAsPlaceholder}
      />
      {uiType && uiType !== 'radio' ? (
        <MinMax
          label={messages.fieldMultioptionLimitsLabel}
          minLabel={messages.fieldMultioptionLimitsMinLabel}
          maxLabel={messages.fieldMultioptionLimitsMaxLabel}
          min="config.minItems"
          max="config.maxItems"
        />
      ) : null}

      <Box className={classes.divider}>
        <Divider />
      </Box>
      <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
        <Options
          label={messages.fieldMultioptionOptionsLabel}
          addOptionLabel={messages.fieldMultioptionAddOptionsLabel}
        />
      </Box>
    </Box>
  );
};

export { MultioptionField };
