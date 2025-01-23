import { createStyles, Text } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isNumber } from 'lodash';

import { GradedRetake } from '../../../types';

import { prefixPN } from '@scores/helpers';
import { useRetakePicker } from '@scores/stores/retakePickerStore';

const useStyles = createStyles(() => ({
  cell: {
    boxShadow: '0px 1px 0px 0px #F2F2F2',
    verticalAlign: 'middle',
    textAlign: 'center',
    padding: '0 32px',
  },
}));

interface Props {
  retakeId: string | null;
  retakes: Record<string, GradedRetake>;
  studentId: string;
}

export function FinalGradeCell({ retakeId: _retakeId, retakes, studentId }: Props) {
  const retakeId =
    useRetakePicker((s) => s.students?.[studentId]?.selectedRetake ?? null) ?? _retakeId;
  const { classes } = useStyles();
  const [t] = useTranslateLoader(prefixPN('pickRetakeTable'));

  const retakeGrade = retakes[retakeId]?.grade;
  const retakeIndex = retakes[retakeId]?.order ?? 0;

  return (
    <td className={classes.cell}>
      <Text>
        {isNumber(retakeGrade)
          ? `${retakeGrade} (${t('table.retake').toLowerCase()} ${retakeIndex + 1})`
          : '-'}
      </Text>
    </td>
  );
}
