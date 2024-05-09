import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Switch, Text } from '@bubbles-ui/components';
import { noop } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN as scoresPrefixPN } from '@scores/helpers';
import prefixPN from '@assignables/helpers/prefixPN';
import useHeaderWithFiltersStyles from './HeaderWithFilters.styles';

export default function HeaderWithFilter({ onChange = noop, weights }) {
  const { classes } = useHeaderWithFiltersStyles();

  const [t] = useTranslateLoader(prefixPN('evaluationTable'));
  const [typesT] = useTranslateLoader(scoresPrefixPN('weightingTypes'));

  return (
    <Stack justifyContent="space-between" alignItems="end">
      <Stack direction="column" spacing={2}>
        <Text className={classes.typeText}>
          {t('weighting')}: {typesT(weights?.type ?? 'averages')}
        </Text>
        {weights?.explanation && (
          <Text className={classes.descriptionText}>{weights.explanation}</Text>
        )}
      </Stack>
      <Switch
        label={t('seeNonGradable')}
        onChange={(value) => onChange({ showNonEvaluable: value })}
      />
    </Stack>
  );
}

HeaderWithFilter.propTypes = {
  onChange: PropTypes.func,
  weights: PropTypes.shape({
    type: PropTypes.string,
    explanation: PropTypes.string,
  }),
};
