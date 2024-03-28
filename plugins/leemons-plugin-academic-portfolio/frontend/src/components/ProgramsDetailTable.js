import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { Table, Stack, ActionButton } from '@bubbles-ui/components';
import { ArchiveIcon, EditWriteIcon, RestoreIcon } from '@bubbles-ui/icons/solid';

import { DuplicateIcon } from '@leebrary/components/LibraryDetailToolbar/icons/DuplicateIcon';
import { useProgramDetail } from '@academic-portfolio/hooks';

const ProgramsDetailTable = ({
  programsIds,
  labels,
  onEdit,
  onArchive,
  isShowingArchivedPrograms,
}) => {
  const programsQueries = useProgramDetail(
    programsIds,
    { enabled: programsIds?.length > 0 },
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
            <ActionButton
              tooltip={labels?.edit}
              onClick={() => onEdit(program)}
              icon={<EditWriteIcon width={18} height={18} />}
            />
            <ActionButton
              tooltip={labels?.duplicate}
              icon={<DuplicateIcon width={18} height={18} />}
            />
            <ActionButton
              tooltip={isShowingArchivedPrograms ? labels?.restore : labels?.archive}
              icon={
                !isShowingArchivedPrograms ? (
                  <ArchiveIcon width={18} height={18} onClick={() => onArchive(program)} />
                ) : (
                  <RestoreIcon
                    width={18}
                    height={18}
                    onClick={() => console.log('restaurando ', program.name)}
                  />
                )
              }
            />
          </Stack>
        ),
      }));
    }
    return [];
  }, [programsQueries, labels]);

  if (isLoading || isEmpty(labels)) return null;
  return <Table columns={tableColumns} data={programsData} />;
};

ProgramsDetailTable.propTypes = {
  programsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  labels: PropTypes.object,
  onEdit: PropTypes.func,
  onArchive: PropTypes.func,
  isShowingArchivedPrograms: PropTypes.bool,
};

export default ProgramsDetailTable;
