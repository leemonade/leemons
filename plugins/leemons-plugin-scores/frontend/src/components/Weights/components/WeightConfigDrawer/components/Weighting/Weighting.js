import { useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { ContextContainer, LoadingOverlay } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import WeightTable from '../WeightTable/WeightTable';

import useActivitiesData from './hooks/useActivitiesData';
import useModulesData from './hooks/useModulesData';
import useRolesData from './hooks/useRolesData';

import { prefixPN } from '@scores/helpers';
import useWeights from '@scores/requests/hooks/queries/useWeights';

export default function Weighting({ class: klass }) {
  const classId = klass?.id;
  const [t] = useTranslateLoader(prefixPN('weightingDrawer'));
  const { control } = useFormContext();

  const { data: typesData, isLoading: typesLoading } = useRolesData({ class: classId });
  const { data: modulesData, isLoading: modulesLoading } = useModulesData({ class: classId });
  const { data: activitiesData, isLoading: activitiesLoading } = useActivitiesData({
    class: klass,
  });

  const { data: weights, isLoading: weightsLoading } = useWeights({
    classId,
    enabled: !!classId,
  });

  const type = useWatch({ control, name: 'type' });

  const data = useMemo(
    () => {
      let weightsData = [];

      if (type === 'modules') {
        weightsData = modulesData;
      } else if (type === 'roles') {
        weightsData = typesData;
      } else if (type === 'activities') {
        weightsData = activitiesData;
      }

      return {
        weights: weightsData,
        applySameValue: weights?.type === type ? weights?.applySameValue : undefined,
      };
    },
    [type, typesData, modulesData, activitiesData, weights]
  );

  if (type === 'averages') {
    return null;
  }
  if (typesLoading || modulesLoading || activitiesLoading || weightsLoading) {
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
            key={`${type}-${classId}`}
          />
        )}
      />
    </ContextContainer>
  );
}

Weighting.propTypes = {
  class: PropTypes.string.isRequired,
};
