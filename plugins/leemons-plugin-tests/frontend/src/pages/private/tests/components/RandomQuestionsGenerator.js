import React from 'react';
import { Controller } from 'react-hook-form';
import { Box, NumberInput, Button } from '@bubbles-ui/components';
import { SynchronizeGenerateIcon } from '@bubbles-ui/icons/outline';
import propTypes from 'prop-types';

const RandomQuestionsGenerator = ({ form, nQuestions, generateQuestions, t, classes }) => (
  <Box className={classes.counterContainer} style={{ marginBottom: 16 }}>
    <Controller
      key={3}
      control={form.control}
      name="filters.nQuestions"
      rules={{
        required: t('nQuestionsRequired'),
        min: {
          value: 1,
          message: t('minOneQuestion'),
        },
      }}
      render={({ field }) => (
        <NumberInput
          {...field}
          label={t('randomQuestionsLabel')}
          placeholder={t('randomQuestionsPlaceholder')}
          min={1}
          max={nQuestions}
          value={field.value ?? nQuestions}
          onChange={(e) => field.onChange(e)}
          customDesign
        />
      )}
    />
    <Button
      variant="link"
      leftIcon={<SynchronizeGenerateIcon width={24} height={24} />}
      onClick={() => generateQuestions()}
    >
      {t('generate')}
    </Button>
  </Box>
);

RandomQuestionsGenerator.propTypes = {
  form: propTypes.object,
  nQuestions: propTypes.number,
  generateQuestions: propTypes.func,
  t: propTypes.func,
  classes: propTypes.object,
};

RandomQuestionsGenerator.defaultProps = {
  form: {},
  nQuestions: 0,
  generateQuestions: () => {},
  t: () => {},
  classes: {},
};

export { RandomQuestionsGenerator };
