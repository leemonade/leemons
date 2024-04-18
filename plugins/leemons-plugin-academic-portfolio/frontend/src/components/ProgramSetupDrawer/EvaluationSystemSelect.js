import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Select } from '@bubbles-ui/components';
import useCenterEvaluationSystems from '@grades/hooks/queries/useCenterEvaluationSystems';
import { noop } from 'lodash';

const EvaluationSystemsSelect = ({ centerId, setLoadingEvaluationSystems = noop, ...props }) => {
  const { data: evaluationSystemsQuery, isLoading } = useCenterEvaluationSystems({
    center: centerId,
    options: { enabled: centerId?.length > 0 },
  });

  useEffect(() => {
    setLoadingEvaluationSystems(isLoading);
  }, [isLoading, setLoadingEvaluationSystems]);

  const selectData = useMemo(() => {
    if (evaluationSystemsQuery?.length) {
      return evaluationSystemsQuery?.map((item) => ({ label: item.name, value: item.id }));
    }
    return [];
  }, [evaluationSystemsQuery]);

  return <Select data={selectData} {...props} />;
};
EvaluationSystemsSelect.propTypes = {
  centerId: PropTypes.string.isRequired,
  setLoadingEvaluationSystems: PropTypes.func,
};

export default EvaluationSystemsSelect;
