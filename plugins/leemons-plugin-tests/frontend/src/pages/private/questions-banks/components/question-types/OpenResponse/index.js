import { useEffect, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Switch, ContextContainer, Stack, NumberInput, Box } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import OpenResponseStyles from './OpenResponse.styles';

export default function OpenResponse({ form: _form, t }) {
  const { classes } = OpenResponseStyles();
  const form = useFormContext() || _form;
  const [limitCharachters, setLimitCharachters] = useState(false);

  const [openResponseProperties] = useWatch({
    control: form.control,
    name: ['openResponseProperties'],
  });

  useEffect(() => {
    if (openResponseProperties?.minCharacters || openResponseProperties?.maxCharacters) {
      setLimitCharachters(true);
    }
  }, [openResponseProperties]);

  // RENDER ································································································|

  return (
    <ContextContainer>
      <ContextContainer title={`${t('responseLabel')}`} spacing={0}>
        <Stack spacing={2} direction="column">
          <Switch
            checked={limitCharachters}
            label={t('questionLabels.limitCharactersLabel')}
            onChange={(value) => setLimitCharachters(value)}
          />
          {limitCharachters && (
            <Stack spacing={5} className={classes.inputBox}>
              <Box className={classes.numberInput}>
                <Controller
                  control={form.control}
                  name="openResponseProperties.minCharacters"
                  render={({ field }) => {
                    return (
                      <NumberInput
                        {...field}
                        min={1}
                        placeholder={t('questionLabels.minCharactersPlaceHolder')}
                        customDesign
                      />
                    );
                  }}
                />
              </Box>

              <Box className={classes.numberInput}>
                <Controller
                  control={form.control}
                  name="openResponseProperties.maxCharacters"
                  render={({ field }) => {
                    return (
                      <NumberInput
                        {...field}
                        min={1}
                        placeholder={t('questionLabels.maxCharactersPlaceHolder')}
                        customDesign
                      />
                    );
                  }}
                />
              </Box>
            </Stack>
          )}
        </Stack>
      </ContextContainer>
      <Controller
        control={form.control}
        name="hasHelp"
        render={({ field }) => (
          <Switch
            {...field}
            checked={field.value}
            label={t('hasCluesLabel')}
            description={t('cluesSwitchDescription')}
          />
        )}
      />
    </ContextContainer>
  );
}

OpenResponse.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export { OpenResponse };
