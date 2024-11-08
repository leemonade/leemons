import { Stack, Table, createStyles } from '@bubbles-ui/components';
import propTypes from 'prop-types';

import useBulkUploadColumns from '@leebrary/hooks/useBulkUploadColumns';

const useProgressStyles = createStyles((theme) => {
  const progressColor = '#B1E400';
  return {
    bar: {
      background: progressColor,
      height: 8,
    },

    label: {
      color: theme.other.global.content.color.text.dark,
    },
  };
});
const BulkUploadTable = ({ data, uploadStatus, t, onRemoveFile }) => {
  const { classes } = useProgressStyles();
  const columns = useBulkUploadColumns({ t, uploadStatus, onRemoveFile, classes });
  return (
    <Stack direction="column" spacing={4}>
      <Table columns={columns} data={data} />
    </Stack>
  );
};

BulkUploadTable.propTypes = {
  data: propTypes.arrayOf(propTypes.object),
  uploadStatus: propTypes.object,
  t: propTypes.func,
  onRemoveFile: propTypes.func,
};

export default BulkUploadTable;
