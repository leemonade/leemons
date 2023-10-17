import React from 'react';
import PropTypes from 'prop-types';
import { useStore } from '@common';
import { map } from 'lodash';
import { Select } from '@bubbles-ui/components';
import { listGradesRequest } from '../../request';

const EvaluationsSelect = ({ center, ...props }) => {
  const [store, render] = useStore({ evaluations: [] });

  async function init() {
    const {
      data: { items },
    } = await listGradesRequest({ page: 0, size: 9999, center });

    store.evaluations = map(items, (item) => ({
      value: item.id,
      label: item.name,
    }));
    render();
  }

  React.useEffect(() => {
    init();
  }, [center]);

  return <Select data={store.evaluations} {...props} />;
};

EvaluationsSelect.propTypes = {
  center: PropTypes.string,
};

export { EvaluationsSelect };
