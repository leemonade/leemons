/* eslint-disable no-param-reassign */

import { arrayToContent } from '../../../helpers';
import addConditionalFormatting from './addConditionalFormatting';
import getStyle from './getStyle';

function getStudentRows({ tableData }) {
  return tableData.students.map((student) => {
    const periodScores = [];

    const scores = tableData.classes.flatMap((klass) => {
      const grades = klass.periods.map(({ id: period }) => {
        const subject = student.subjects?.find((s) => s.id === klass.id);
        const periodScore = subject?.periodScores?.find((p) => p.id === period);

        if (period === 'final') {
          return periodScore?.score;
        }

        return periodScore?.score ?? '-';
      });

      const popped = grades.pop();

      const finalGrade =
        popped ?? Math.round(grades.reduce((sum, g) => sum + (g === '-' ? 0 : g)) / grades.length);

      periodScores.push(finalGrade);

      return [...grades, { value: finalGrade, isCustom: !!popped }].filter((g) => g !== undefined);
    });

    const avgScore = periodScores.reduce((sum, s) => sum + s) / periodScores.length;
    return [
      student.surname,
      student.name,
      ...scores,
      avgScore,
      student.customScore ?? Math.round(avgScore),
    ];
  });
}

/**
 *
 * @param {{
 * ws: import("exceljs").Worksheet,
 * }} param0
 */
export default function writeStudentsWithActivities({ ws, tableData, labels, initialPosition }) {
  const studentRows = getStudentRows({ tableData, labels });
  const contentArray = [[labels.surname, labels.name], ...studentRows];

  arrayToContent({
    ws,
    array: contentArray,
    initialPosition,
    getStyle: getStyle({ tableData, ws }),
  });

  addConditionalFormatting(ws);
}
