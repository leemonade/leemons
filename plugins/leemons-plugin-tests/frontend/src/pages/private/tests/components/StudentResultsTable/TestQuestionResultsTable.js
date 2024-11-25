import { Table } from '@bubbles-ui/components';

import useCommonTableData from './useCommonTableData';

export default function TestsQuestionResultsTable(props) {
  const { headers, data } = useCommonTableData(props);

  return <Table columns={headers} data={data} />;
}
