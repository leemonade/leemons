import { Controller, useWatch } from 'react-hook-form';

import { Text, ContextContainer, Switch, Stack, Checkbox } from '@bubbles-ui/components';
import propTypes from 'prop-types';

export default function ShortResponseRules({ control, classes, t }) {
  const [shortResponse] = useWatch({ control, name: ['questionFilters.shortResponse'] });

  return (
    <ContextContainer className={classes.questionConfigContainer} spacing={2}>
      <Text className={classes.questionConfigTitle}>
        {t('rulesByQuestionType.shortResponse.title')}
      </Text>
      <Controller
        control={control}
        name="questionFilters.shortResponse.activateTolerances"
        render={({ field }) => (
          <Switch
            label={t('rulesByQuestionType.shortResponse.activateTolerances')}
            checked={field.value}
            {...field}
          />
        )}
      />
      {shortResponse?.activateTolerances && (
        <Stack className={classes.questionConfig}>
          <Controller
            control={control}
            name="questionFilters.shortResponse.tolerateAccents"
            render={({ field }) => (
              <Checkbox
                label={t('rulesByQuestionType.shortResponse.tolerateAccents')}
                {...field}
                checked={field.value}
              />
            )}
          />
          <Controller
            control={control}
            name="questionFilters.shortResponse.tolerateCase"
            render={({ field }) => (
              <Checkbox
                label={t('rulesByQuestionType.shortResponse.tolerateCase')}
                {...field}
                checked={field.value}
              />
            )}
          />
          <Controller
            control={control}
            name="questionFilters.shortResponse.tolerateSpaces"
            render={({ field }) => (
              <Checkbox
                label={t('rulesByQuestionType.shortResponse.tolerateSpaces')}
                {...field}
                checked={field.value}
              />
            )}
          />
        </Stack>
      )}
    </ContextContainer>
  );
}

ShortResponseRules.propTypes = {
  control: propTypes.object,
  classes: propTypes.object,
  t: propTypes.func,
};
