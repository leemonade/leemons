import React, { useMemo } from 'react';

import { Table, Stack, ActionButton, LoadingOverlay } from '@bubbles-ui/components';
import { ArchiveIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { useProgramDetail } from '@academic-portfolio/hooks';

const ProgramsDetailTable = ({
  programsIds,
  labels,
  onEdit,
  onArchive,
  isShowingArchivedPrograms,
  onDuplicate,
}) => {
  const programsQueries = useProgramDetail(
    programsIds,
    { enabled: programsIds?.length > 0, refetchOnWindowFocus: false },
    false,
    isShowingArchivedPrograms,
    true
  );

  const tableColumns = useMemo(
    () => [
      {
        Header: labels?.program,
        accessor: 'name',
      },
      {
        Header: labels?.cycles,
        accessor: 'cycles',
      },
      {
        Header: labels?.substages,
        accessor: 'substages',
      },
      {
        Header: labels?.subjects,
        accessor: 'subjects',
      },
      {
        Header: labels?.students,
        accessor: 'students',
      },
      {
        Header: labels?.actions,
        accessor: 'actions',
        style: { width: 100, textAlign: 'center' },
      },
    ],
    [labels]
  );

  const isLoading = useMemo(() => {
    if (!programsQueries?.length) return false;
    return programsQueries.some((item) => item.isLoading);
  }, [programsQueries]);

  const programsData = useMemo(() => {
    if (programsQueries?.length) {
      return programsQueries.map(({ data: program }) => ({
        name: program?.name,
        cycles: program?.cycles?.length,
        substages: program?.substages?.length,
        subjects: program?.subjects?.length,
        students: program?.students?.length,
        actions: (
          <Stack justifyContent="end" fullWidth>
            {!isShowingArchivedPrograms && (
              <ActionButton
                tooltip={labels?.edit}
                onClick={() => onEdit(program)}
                icon={<EditWriteIcon width={18} height={18} />}
              />
            )}
            {!isShowingArchivedPrograms && (
              <ActionButton
                tooltip={labels?.duplicate}
                onClick={() => onDuplicate(program)}
                icon={<DuplicateIcon width={18} height={18} />}
              />
            )}
            {!isShowingArchivedPrograms && (
              <ActionButton
                tooltip={isShowingArchivedPrograms ? labels?.restore : labels?.archive}
                icon={<ArchiveIcon width={18} height={18} onClick={() => onArchive(program)} />}
              />
            )}
          </Stack>
        ),
      }));
    }
    return [];
  }, [programsQueries, isShowingArchivedPrograms, labels]);

  if (isLoading || isEmpty(labels)) return <LoadingOverlay visible={isLoading} />;
  return (
    <Table
      columns={isShowingArchivedPrograms ? tableColumns.slice(0, -1) : tableColumns}
      data={programsData}
    />
  );
};

ProgramsDetailTable.propTypes = {
  programsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  labels: PropTypes.object,
  onEdit: PropTypes.func,
  onArchive: PropTypes.func,
  onDuplicate: PropTypes.func,
  isShowingArchivedPrograms: PropTypes.bool,
};

export default ProgramsDetailTable;
