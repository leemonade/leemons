import { Table } from '@bubbles-ui/components';
import propTypes from 'prop-types';

const AssetsTable = ({ data, columns }) => {
  return <Table columns={columns} data={data} />;
};

AssetsTable.propTypes = {
  data: propTypes.array,
  columns: propTypes.array.isRequired,
};

export { AssetsTable };
