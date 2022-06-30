/* eslint-disable no-param-reassign */
import { addCustomName, getCustomNamesRange } from '../addCustomName';
import arrayToContent from '../arrayToContent';

/**
 *
 * @param {{
 * ws: import("exceljs").Worksheet,
 * }} param0
 */
export default function writeStudentsWithActivities({ ws, tableData, labels, initialPosition }) {
  const studentRows = tableData.value.map((student) => {
    const activities = tableData.activities.map((activity) => {
      const studentActivity = student.activities.find((sa) => sa.id === activity.id);

      const scale = tableData.grades.find((grade) => grade.number === studentActivity?.score);

      return {
        activity,
        studentActivity,
        scale,
        grade: scale?.number,
      };
    });
    return [
      'Not defined',
      '',
      student.surname,
      student.name,
      ...activities.map((activity) => {
        if (!activity.studentActivity?.isSubmitted) {
          return labels.notSubmitted;
        }
        return activity.scale ? activity.scale.letter || activity.scale.number : '-';
      }),
      activities.reduce((avg, activity) => {
        if (
          activity.activity?.weight &&
          activity.grade &&
          activity.activity?.type === 'calificable'
        ) {
          return avg + activity.grade * activity.activity.weight;
        }
        return avg;
        // TODO: Use min grade as initial score
      }, 0),
    ];
  });

  const contentArray = [[labels.group, '', labels.surname, labels.name], ...studentRows];

  const getStyle = (cell, { relRow: row, relCol: col, row: absoluteRow, col: absoluteCol }) => {
    const border = {};

    if (row === 0 && col <= 3) {
      cell.font = {
        bold: true,
      };
    }

    if (col === 3) {
      border.right = {
        style: 'medium',
        color: {
          argb: '3C84C6',
        },
      };
    }
    if (row === 0) {
      border.top = {
        style: 'medium',
        color: {
          argb: '3C84C6',
        },
      };
    }

    if (col > 3 && col !== tableData.activities.length + 4) {
      if (row === 1) {
        const upperCell = ws.getCell(absoluteRow - 1, absoluteCol);
        addCustomName({ name: 'scores', cell: upperCell });
      }
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      addCustomName({ name: 'scores', cell });
      addCustomName({ name: `scores_${row}`, cell });
    }

    if (col === tableData.activities.length + 4) {
      if (row === 1) {
        const upperCell = ws.getCell(absoluteRow - 1, absoluteCol);
        upperCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F1F9FE' },
        };
      }

      cell.value = {
        formula: `SUMPRODUCT(scores_${row};weights;types = "calificable")`,
        result: cell.value || '0',
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      addCustomName({ name: 'avgScores', cell });
    }

    cell.border = border;
  };

  arrayToContent({ ws, array: contentArray, initialPosition, getStyle });

  const scoresRules = [
    {
      type: 'expression',
      formulae: ['H$8<>"calificable"'],
      style: {
        fill: {
          type: 'pattern',
          bgColor: {
            argb: 'F2F3F2',
          },
        },
        font: {
          color: {
            argb: '000000',
          },
        },
      },
    },
    {
      type: 'cellIs',
      operator: 'lessThan',
      formulae: [5],
      style: {
        fill: {
          type: 'pattern',
          bgColor: {
            argb: 'FFFFFF',
          },
        },
        font: {
          color: {
            argb: 'CD0201',
          },
        },
      },
    },
    {
      type: 'cellIs',
      operator: 'equal',
      formulae: [5],
      style: {
        fill: {
          type: 'pattern',
          bgColor: {
            argb: 'FFFFFF',
          },
        },
        font: {
          color: {
            argb: '000000',
          },
        },
      },
    },
    {
      type: 'cellIs',
      operator: 'greaterThan',
      formulae: [5],
      style: {
        fill: {
          type: 'pattern',
          bgColor: {
            argb: 'FFFFFF',
          },
        },
        font: {
          color: {
            argb: '000000',
          },
        },
      },
    },
  ];

  ws.addConditionalFormatting({
    ref: getCustomNamesRange('scores'),
    rules: scoresRules,
  });

  const [, ...avgScoresRules] = scoresRules.map((rule) => ({
    ...rule,
    style: {
      ...rule.style,
      fill: {
        type: 'pattern',
        bgColor: {
          argb: 'F1F9FE',
        },
      },
    },
  }));

  ws.addConditionalFormatting({
    ref: getCustomNamesRange('avgScores'),
    rules: avgScoresRules,
  });

  avgScoresRules.forEach((rule) =>
    ws.addConditionalFormatting({
      ref: getCustomNamesRange('avgScores'),
      rules: [rule],
    })
  );
}
