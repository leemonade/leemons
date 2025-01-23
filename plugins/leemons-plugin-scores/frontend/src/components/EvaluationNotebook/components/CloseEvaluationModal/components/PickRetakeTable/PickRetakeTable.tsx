import { useMemo } from 'react';

import { Box, ContextContainer, createStyles } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

import { Retake, StudentScores } from '../../types';

import { FinalGradeCell } from './components/FinalGradeCell';
import { GradeCell } from './components/GradeCell';
import { Header } from './components/Header';
import { StudentCell } from './components/StudentCell';

import { prefixPN } from '@scores/helpers';

type Props = {
  students: StudentScores[];
  retakes: Retake[];
};

const useStyles = createStyles(() => {
  return {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    headerCell: {
      boxShadow: '0px 1px 0px 0px #F2F2F2',
    },
  };
});

export function PickRetakeTable({ students, retakes }: Props) {
  const [t] = useTranslateLoader(prefixPN('pickRetakeTable'));
  const { classes } = useStyles(null, { name: 'PickRetakeTable' });

  const columnHelper = createColumnHelper<StudentScores>();

  const studentsCount = students.length;
  const studentsWithRetakeSelected = useMemo(() => {
    return students.filter((student) => student.final !== null).length;
  }, [students]);

  const table = useReactTable({
    data: students,
    columns: [
      columnHelper.accessor('student', {
        header: () => (
          <Header
            label={`${t('table.students')} (${studentsWithRetakeSelected}/${studentsCount})`}
            sx={{ paddingLeft: 16, paddingRight: 16 }}
          />
        ),
        cell: (info) => <StudentCell student={info.getValue()} />,
      }),
      ...retakes.map((retake) =>
        columnHelper.accessor(`retakes.${retake.id ?? retake.index}`, {
          header: () => <Header label={`${t('table.retake')} ${(retake.index ?? 0) + 1}`} center />,
          cell: (info) => (
            <GradeCell
              {...info.getValue()}
              selectedRetake={info.row.original.final}
              studentId={info.row.original.student.id}
            />
          ),
        })
      ),
      columnHelper.accessor('final', {
        header: () => <Header label={t('table.final')} center />,
        cell: (info) => (
          <FinalGradeCell
            retakeId={info.getValue()}
            retakes={info.row.original.retakes}
            studentId={info.row.original.student.id}
          />
        ),
      }),
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box>
      <ContextContainer title="PickRetakeTable">
        <table className={classes.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={classes.headerCell}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row
                  .getVisibleCells()
                  .map((cell) => flexRender(cell.column.columnDef.cell, cell.getContext()))}
              </tr>
            ))}
          </tbody>
        </table>
      </ContextContainer>
    </Box>
  );
}
