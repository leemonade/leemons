import { useMemo } from 'react';

import { Table } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import useCommonTableData from './useCommonTableData';

export default function OpenQuestionsTable({
  questions,
  styles,
  t,
  questionResponses,
  levels,
  cx,
}) {
  const { headers: commonTableHeaders, data: commonTableData } = useCommonTableData({
    questions,
    styles,
    t,
    questionResponses,
    levels,
    cx,
  });

  const tableHeaders = useMemo(() => [...commonTableHeaders], [commonTableHeaders]);

  const tableData = useMemo(() => {
    if (questions && commonTableData) return [...commonTableData];
    return [];
  }, [questions, commonTableData]);

  return <Table headers={tableHeaders} data={tableData} />;
}

OpenQuestionsTable.propTypes = {
  questions: PropTypes.array,
  styles: PropTypes.object,
  t: PropTypes.func,
  questionResponses: PropTypes.array,
  levels: PropTypes.array,
  cx: PropTypes.func,
};
