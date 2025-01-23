import { createStyles, Text } from '@bubbles-ui/components';
import { isNil, isNumber } from 'lodash';

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
}

export function GradeCell({ grade, selectedRetake, id, order }: Props) {
  const isSelected =
    selectedRetake && !isNil(order)
      ? selectedRetake === id || selectedRetake === `${order}`
      : false;
  const hasGrade = isNumber(grade);
  const isClickable = hasGrade;

  const { classes } = useStyles({ isSelected, isClickable });

  return (
    <td className={classes.cell}>
      <Text>{hasGrade ? grade : '-'}</Text>
    </td>
  );
}
