import { useMemo } from 'react';

import {
  Stack,
  Table,
  FileIcon,
  Text,
  FileItemDisplay,
  TextClamp,
  Progress,
  createStyles,
} from '@bubbles-ui/components';
import { capitalize } from 'lodash';
import propTypes from 'prop-types';

import formatFileSize from '@leebrary/helpers/formatFileSize';
import formatFileName from '@leebrary/helpers/formatFilename';
import prepareAssetType from '@leebrary/helpers/prepareAssetType';

const useProgressStyles = createStyles((theme) => {
  return {
    bar: {
      background: '#B1E400',
      height: 8,
    },

    label: {
      color: theme.other.global.content.color.text.dark,
    },
  };
});
const BulkUploadTable = ({ data, uploadStatus, t }) => {
  const { classes } = useProgressStyles();
  const columns = useMemo(() => {
    return [
      {
        Header: t('table.headers.type'),
        accessor: 'type',
        Cell: ({ row }) => {
          const { original } = row;
          const parseFileType = prepareAssetType(original?.type, false);
          const parseExtension = original?.path.split('.').pop();
          const isFile =
            parseFileType === 'audio' ||
            parseFileType === 'video' ||
            parseFileType === 'image' ||
            parseFileType === 'document';
          const fileLabel = isFile ? parseFileType : parseExtension;
          return (
            <Stack spacing={2} alignItems="center">
              {isFile ? (
                <FileIcon fileType={parseFileType} size={18} color={'#878D96'} />
              ) : (
                <FileItemDisplay
                  showFileName={false}
                  filename={original?.name}
                  size={18}
                  color={'#878D96'}
                />
              )}
              <TextClamp lines={1}>
                <Text color="soft" size="xs">
                  {isFile ? capitalize(fileLabel) : fileLabel.toUpperCase()}
                </Text>
              </TextClamp>
            </Stack>
          );
        },
        style: {
          width: 130,
        },
        cellStyle: {
          alignItems: 'center',
          height: 'auto',
        },
      },
      {
        Header: t('table.headers.file'),
        accessor: 'name',
        align: 'center',
        Cell: ({ value }) => {
          return (
            <TextClamp lines={1}>
              <Text color="soft" size="xs">
                {value}
              </Text>
            </TextClamp>
          );
        },
        style: {
          width: 260,
        },
      },
      {
        Header: t('table.headers.name'),
        accessor: 'lastModified',
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <TextClamp lines={1}>
              <Text color="soft" size="xs">
                {formatFileName(original?.name)}
              </Text>
            </TextClamp>
          );
        },
        style: {
          width: 260,
          justifyContent: 'center',
        },
      },
      {
        Header: t('table.headers.size'),
        accessor: 'size',
        Cell: ({ value }) => {
          return (
            <TextClamp lines={1}>
              <Text color="soft" size="xs">
                {formatFileSize(value)}
              </Text>
            </TextClamp>
          );
        },
        cellStyle: {
          maxWidth: 100,
          justifyContent: 'flex-start',
        },
        style: {
          maxWidth: 100,
        },
        thStyle: {
          maxWidth: 100,
          textAlign: 'right',
        },
      },
      {
        Header: t('table.headers.load'),
        accessor: 'upload',
        Cell: ({ row }) => {
          const { original } = row;
          const status = uploadStatus[original.name];

          if (!status) {
            return (
              <Stack fullWidth justify="end">
                <Text color="soft" size="xs">
                  {t('table.queue')}
                </Text>
              </Stack>
            );
          }

          if (status.state === 'completed') {
            return (
              <Stack fullWidth justify="end">
                <Text color="success" size="xs">
                  {t('table.completed')}
                </Text>
              </Stack>
            );
          }

          if (status.state === 'error') {
            return (
              <Stack fullWidth justify="end">
                <Text color="error" size="xs">
                  {t('table.error')}
                </Text>
              </Stack>
            );
          }

          if (status.state === 'uploading' || status.state === 'finalize') {
            const percentage = status.percentageCompleted || 0;
            return (
              <Stack spacing={4} justifyContent="flex-end">
                <Text>{`${Math.min(percentage?.toFixed(0), 100)}%`}</Text>
                <Progress
                  style={{ width: 232, height: 8 }}
                  classNames={classes}
                  size="xl"
                  radius="xl"
                  value={!percentage || isNaN(percentage) ? 0 : Math.min(percentage, 100)}
                />
              </Stack>
            );
          }
        },
        style: {
          width: 'auto',
          textAlign: 'right',
        },
        thStyle: {
          textAlign: 'right',
        },
        cellStyle: {
          textAlign: 'right',
          justifyContent: 'flex-end',
        },
      },
    ];
  }, [uploadStatus]);

  const cellPropTypes = {
    value: propTypes.any,
    row: propTypes.shape({
      original: propTypes.shape({
        type: propTypes.string,
        name: propTypes.string,
        path: propTypes.string,
        size: propTypes.number,
      }),
    }),
  };

  columns.forEach((column) => {
    if (column.Cell) {
      column.Cell.propTypes = cellPropTypes;
    }
  });

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
};

export default BulkUploadTable;
