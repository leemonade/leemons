import React from 'react';
import PropTypes from 'prop-types';
import { useStore } from '@common';
import { Select } from '@bubbles-ui/components';
import { map, orderBy } from 'lodash';
import { getGradeRequest } from '../../request';
import { getScaleLabel } from '../../helpers/getScaleLabel';

const EvaluationNotesSelect = ({ evaluation, valueKey = 'number', ...props }) => {
  const [store, render] = useStore({ notes: [] });

  async function init() {
    if (evaluation) {
      const { grade } = await getGradeRequest(evaluation);

      store.notes = [];
      if (grade) {
        const scales = orderBy(grade.scales, ['number'], ['asc']);
        store.notes = map(scales, (item) => ({
          value: item[valueKey],
          label: getScaleLabel(item),
        }));
      }

      render();
    }
  }

  React.useEffect(() => {
    init();
  }, [evaluation]);

  return <Select data={store.notes} {...props} />;
};

EvaluationNotesSelect.propTypes = {
  evaluation: PropTypes.string,
  valueKey: PropTypes.string,
};

export { EvaluationNotesSelect };
