import React from 'react';
import PropTypes from 'prop-types';
import { useStore } from '@common';
import { Select } from '@bubbles-ui/components';
import { map } from 'lodash';
import { getGradeRequest } from '../../request';

const EvaluationNotesSelect = ({ evaluation, valueKey = 'number', ...props }) => {
  const [store, render] = useStore({ notes: [] });

  async function init() {
    if (evaluation) {
      const { grade } = await getGradeRequest(evaluation);

      store.notes = [];
      if (grade) {
        store.notes = map(grade.scales, (item) => ({
          value: item[valueKey],
          label: item.letter
            ? `${item.number} [${item.letter}] ${item.description ? `(${item.description})` : ''}`
            : `${item.number} ${item.description ? `(${item.description})` : ''}`,
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
