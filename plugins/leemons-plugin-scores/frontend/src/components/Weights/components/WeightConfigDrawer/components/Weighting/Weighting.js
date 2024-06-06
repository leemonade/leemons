import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { ContextContainer, LoadingOverlay } from '@bubbles-ui/components';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useWeights from '@scores/requests/hooks/queries/useWeights';
import WeightTable from '../WeightTable/WeightTable';
import useRolesData from './hooks/useRolesData';
import useModulesData from './hooks/useModulesData';

export default function Weighting({ class: klass }) {
  const [t] = useTranslateLoader(prefixPN('weightingDrawer'));
  const { control } = useFormContext();

  const { data: typesData, isLoading: typesLoading } = useRolesData({ class: klass });
  const { data: modulesData, isLoading: modulesLoading } = useModulesData({ class: klass });
  const { data: weights, isLoading: weightsLoading } = useWeights({
    classId: klass,
    enabled: !!klass,
  });

  const type = useWatch({ control, name: 'type' });

  const data = useMemo(
    () => ({
      weights: type === 'modules' ? modulesData : typesData,
      applySameValue: weights?.type === type ? weights?.applySameValue : undefined,
    }),
    [type, typesData, modulesData, weights]
  );

  if (type === 'averages') {
    return null;
  }
  if (typesLoading || modulesLoading || weightsLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <ContextContainer title={t('weighting')}>
      <Controller
        name="weights"
        control={control}
        render={({ field }) => (
          <WeightTable
            lockable
            data={data}
            onChange={field.onChange}
            type={type}
            key={`${type}-${klass}`}
          />
        )}
      />
    </ContextContainer>
  );
}

Weighting.propTypes = {
  class: PropTypes.string.isRequired,
};
