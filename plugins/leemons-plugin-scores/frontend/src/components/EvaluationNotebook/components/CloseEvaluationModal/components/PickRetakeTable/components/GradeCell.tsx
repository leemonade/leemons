import { createStyles, Text } from '@bubbles-ui/components';
import { isNil, isNumber } from 'lodash';

import { useRetakePicker } from '@scores/stores/retakePickerStore';

const useStyles = createStyles(
  (_, { isSelected, isClickable }: { isSelected: boolean; isClickable: boolean }) => ({
    cell: {
      boxShadow: '0px 1px 0px 0px #F2F2F2',
      verticalAlign: 'middle',
      textAlign: 'center',
      border: isSelected ? '2px solid #B1E400' : 'none',
      cursor: isClickable ? 'pointer' : 'default',
    },
  })
);

interface Props {
  grade: number | null;
  id: string | null;
  order: number;
  selectedRetake: string;
  studentId: string;
}

export function GradeCell({ grade, selectedRetake: _selectedRetake, id, order, studentId }: Props) {
  const pickRetake = useRetakePicker((s) => s.pickRetake);
  const selectedRetake =
    useRetakePicker((s) => s.students?.[studentId]?.selectedRetake ?? null) ?? _selectedRetake;

  const isSelected =
    selectedRetake && !isNil(order)
      ? selectedRetake === id || selectedRetake === `${order}`
      : false;
  const hasGrade = isNumber(grade);
  const isClickable = hasGrade;

  const { classes } = useStyles({ isSelected, isClickable });

  return (
    <td
      className={classes.cell}
      onClick={isClickable ? () => pickRetake(studentId, id, order) : undefined}
    >
      <Text>{hasGrade ? grade : '-'}</Text>
    </td>
  );
}
