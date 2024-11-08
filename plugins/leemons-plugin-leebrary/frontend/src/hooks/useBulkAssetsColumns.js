import { useMemo } from 'react';

import { SubjectItemDisplay } from '@academic-portfolio/components';
import {
  Box,
  Checkbox,
  Stack,
  Text,
  TextClamp,
  FileIcon,
  FileItemDisplay,
  AvatarsGroup,
} from '@bubbles-ui/components';
import { ChipsContainer } from '@common/components';

import formatFileName from '@leebrary/helpers/formatFilename';
import getResourceTypeDisplay from '@leebrary/helpers/getResourceTypeDisplay';

function useBulkAssetsColumns({ selectedAssets, onSelectAll, onSelectRow, assets }) {
  return useMemo(() => {
    return [
      {
        Header: (
          <Box>
            <Checkbox
              checked={selectedAssets.length === assets.length}
              indeterminate={selectedAssets.length > 0 && selectedAssets.length < assets.length}
              onChange={(e) => onSelectAll(e)}
            />
          </Box>
        ),
        accessor: 'check',
        Cell: ({ row }) => (
          <Box>
            <Checkbox
              checked={selectedAssets.includes(row.original.id)}
              onChange={(e) => onSelectRow(row.original.id, e)}
            />
          </Box>
        ),
        className: 'text-left',
        style: { width: 24 },
      },
      {
        Header: 'Tipo',
        accessor: 'type',
        Cell: ({ row }) => {
          const { original } = row;
          const { isFile, displayLabel, fileType } = getResourceTypeDisplay(original);
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
        Header: 'Archivo',
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
        Header: 'Nombre',
        accessor: 'isCover',
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
        Header: 'Asignatura',
        accessor: 'subjects',
        Cell: ({ value }) => {
          if (value) {
            return <SubjectItemDisplay subjectsIds={value.map((subject) => subject.subject)} />;
          }
          return <Text size="xs">-</Text>;
        },
      },
      {
        Header: 'Tags',
        accessor: 'tags',
        Cell: ({ value }) => {
          return value.length > 0 ? (
            <ChipsContainer items={value} chipsToShow={2} />
          ) : (
            <Text size="xs">-</Text>
          );
        },
      },
      {
        Header: 'Compartido con',
        accessor: 'canAccess',
        Cell: ({ value }) => {
          return (
            <AvatarsGroup
              size="sm"
              data={value}
              moreThanUsersAsMulti={2}
              customAvatarMargin={14}
              limit={2}
              zIndexInverted
            />
          );
        },
        align: 'right',
        style: {
          textAlign: 'right',
        },
        cellStyle: {
          justifyContent: 'flex-end',
        },
      },
    ];
  }, [selectedAssets, onSelectAll, onSelectRow, assets]);
}

export default useBulkAssetsColumns;
