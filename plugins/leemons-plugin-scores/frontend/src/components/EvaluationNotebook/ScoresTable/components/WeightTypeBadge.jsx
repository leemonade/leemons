import React from 'react';
import PropTypes from 'prop-types';

import { Badge, Stack, Text } from '@bubbles-ui/components';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useWeights from '@scores/requests/hooks/queries/useWeights';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';

export default function WeightTypeBadge({ class: klass, includePlaceholder }) {
  const { data: weights, isLoading } = useWeights({ classId: klass?.id });
  const [t] = useTranslateLoader(prefixPN('weightingTypes'));
  const [t2] = useTranslateLoader(prefixPN('weightingDrawer'));
  const rolesLocalizations = useRolesLocalizations(['task', 'tests']);

  if (isLoading) {
    return null;
  }

  if (weights?.type === 'modules') {
    return (
      <Stack alignItems="baseline" spacing={2}>
        {includePlaceholder ? <Text closable={false}>{t2('weighting')}</Text> : null}
        <Badge closable={false}>{t('modules')}</Badge>
      </Stack>
    );
  }

  if (weights?.type === 'roles') {
    return (
      <Badge closable={false}>
        {weights.weights
          .map(
            ({ weight, id }) =>
              `${parseFloat((weight * 100).toFixed(2))}% ${rolesLocalizations[id]?.plural}`
          )
          .join(' - ')}
      </Badge>
    );
  }

  return (
    <Stack alignItems="baseline" spacing={2}>
      <Text closable={false}>{t2('weighting')}</Text>

      <Badge closable={false}>{t('averages')}</Badge>
    </Stack>
  );
}

WeightTypeBadge.propTypes = {
  class: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  includePlaceholder: PropTypes.bool,
};
