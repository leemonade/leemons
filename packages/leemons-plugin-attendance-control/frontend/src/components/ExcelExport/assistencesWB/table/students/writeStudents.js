/* eslint-disable no-param-reassign */

import { arrayToContent } from '../../../helpers';
import addConditionalFormatting from './addConditionalFormatting';
import getStyle from './getStyle';

function getStudentRows({ tableData, labels }) {
  return tableData.value.map((student) => {
    const activities = tableData.activities.map((activity) => {
      const studentActivity = student.activities.find((sa) => sa.id === activity.id);

      // const scale = tableData.grades.find(
      //   (grade) => grade.number === studentActivity?.score
      // );

      return {
        activity,
        studentActivity,
        // scale,
        grade: studentActivity?.score,
      };
    });

    const customScoreScale = tableData.grades.find((grade) => grade.number === student.customScore);

    const calculatedScore = activities.reduce((avg, activity) => {
      if (
        activity.activity?.weight &&
        activity.grade &&
        activity.activity?.type === 'calificable'
      ) {
        return avg + activity.grade * activity.activity.weight;
      }
      return avg;
      // TODO: Use min grade as initial score
    }, 0);

    return [
      student.surname,
      student.name,
      ...activities.map((activity) => {
        if (!activity.studentActivity?.isSubmitted) {
          return labels.notSubmitted;
        }
        // TODO: Use letter scales
        return activity.grade ?? '-';
        // activity.scale
        //   ? activity.scale.letter || activity.scale.number
        // : '-';
      }),
      calculatedScore,
      customScoreScale ? customScoreScale?.number : calculatedScore,
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
