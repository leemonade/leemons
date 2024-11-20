import { useMemo } from 'react';

import {
  Stack,
  FileIcon,
  Text,
  FileItemDisplay,
  TextClamp,
  Progress,
  IconButton,
} from '@bubbles-ui/components';
import { DeleteBinIcon } from '@bubbles-ui/icons/outline';

import formatFileSize from '@leebrary/helpers/formatFileSize';
import formatFileName from '@leebrary/helpers/formatFilename';
import getFileTypeDisplay from '@leebrary/helpers/getFileTypeDisplay';

function useBulkUploadColumns({ t, uploadStatus, onRemoveFile, classes }) {
  return useMemo(() => {
    return [
      {
        Header: t('table.headers.type'),
        accessor: 'type',
        Cell: ({ row }) => {
          const { original } = row;
          const { isFile, displayLabel, fileType } = getFileTypeDisplay(original);

          return (
            <Stack spacing={2} alignItems="center">
              {isFile ? (
                <FileIcon fileType={fileType} size={18} color={'#878D96'} />
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
                  {displayLabel}
                </Text>
              </TextClamp>
            </Stack>
          );
        },
        style: { width: 130 },
        cellStyle: { alignItems: 'center', height: 'auto' },
      },
      {
        Header: t('table.headers.file'),
        accessor: 'name',
        align: 'center',
        Cell: ({ value }) => {
          return (
            <TextClamp lines={1}>
              <Text size="xs">{value}</Text>
            </TextClamp>
          );
        },
        style: {
          width: 220,
        },
      },
      {
        Header: t('table.headers.name'),
        accessor: 'lastModified',
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <TextClamp lines={1}>
              <Text size="xs">{formatFileName(original?.name)}</Text>
            </TextClamp>
          );
        },
        style: {
          width: 220,
          justifyContent: 'center',
        },
      },
      {
        Header: t('table.headers.size'),
        accessor: 'size',
        Cell: ({ value }) => {
          return (
            <TextClamp lines={1}>
              <Text size="xs">{formatFileSize(value)}</Text>
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
                <Text size="xs">{t('table.queue')}</Text>
              </Stack>
            );
          }

          if (status.state === 'uploaded' || status.state === 'finalize') {
            return (
              <Stack fullWidth justify="end">
                <Text color="success" size="xs" strong>
                  {t('table.completed')}
                </Text>
              </Stack>
            );
          }

          if (status.state === 'error') {
            return (
              <Stack fullWidth justify="end">
                <Text color="error" size="xs" strong>
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
                  style={{ maxWidth: 232, minWidth: 100, height: 8 }}
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
      {
        Header: t('table.headers.actions') || 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => {
          const { original } = row;

          return (
            <Stack fullWidth justify="end">
              <IconButton
                color="secondary"
                variant="transparent"
                rounded
                icon={<DeleteBinIcon width={24} height={24} />}
                onClick={() => onRemoveFile(original.name)}
              />
            </Stack>
          );
        },
        style: {
          width: 100,
        },
      },
    ];
  }, [t, uploadStatus, onRemoveFile, classes]);
}

export default useBulkUploadColumns;
