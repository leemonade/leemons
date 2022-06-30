/* eslint-disable no-param-reassign */
import { map } from 'lodash';
import { addCustomName, getCustomNamesRange } from '../addCustomName';
import arrayToContent from '../arrayToContent';

/**
 *
 * @param {{
 * ws: import("exceljs").Worksheet
 * }} param0
 */
export default function writeHeader({ ws, activities, labels, initialPosition }) {
  const parsedactivities = activities.map((activity) => ({
    type: activity.role,
    evaluation: activity?.type === 'calificable' ? labels.calificable : labels.noCalificable,
    name: activity.name,
    deadline: new Date(activity.deadline),
    weight: activity.weight,
  }));

  const contentArray = [
    [labels.type, ...map(parsedactivities, 'type'), ''],
    [labels.evaluation, ...map(parsedactivities, 'evaluation'), ''],
    [labels.activity, ...map(parsedactivities, 'name'), ''],
    [labels.deadline, ...map(parsedactivities, 'deadline'), ''],
    [labels.weight, ...map(parsedactivities, 'weight')],
  ];

  contentArray[contentArray.length - 1].push(labels.avg.toLocaleUpperCase());

  const getStyle = (cell, { relCol: col, relRow: row }) => {
    const border = {};

    if (row === contentArray.length - 1) {
      border.bottom = { style: 'medium', color: { argb: '3C84C6' } };
    }
    if (col === 0) {
      border.right = { style: 'medium', color: { argb: '3C84C6' } };
    }

    if (col > 0) {
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
    } else {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'right',
      };
    }

    if (
      col === 0 ||
      row === 2 ||
      (row === contentArray.length - 1 && col === contentArray[row].length - 1)
    ) {
      cell.font = {
        bold: true,
      };
    }

    if (row === 0 && col > 0 && col < contentArray[row].length - 1) {
      addCustomName({ name: 'roles', cell });
    } else if (row === 1 && col > 0 && col < contentArray[row].length - 1) {
      addCustomName({ name: 'types', cell });
      cell.dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: [`"${labels.calificable}, ${labels.noCalificable}"`],
        showErrorMessage: true,
      };
    } else if (row === 2 && col > 0 && col < contentArray[row].length - 1) {
      addCustomName({ name: 'activities', cell });
    } else if (row === 3 && col > 0 && col < contentArray[row].length - 1) {
      addCustomName({ name: 'deadlines', cell });
    } else if (row === 4 && col > 0 && col < contentArray[row].length - 1) {
      addCustomName({ name: 'weights', cell });
      cell.numFmt = '0.00%';
    }

    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F1F9FE' },
    };

    cell.border = border;
  };

  arrayToContent({
    ws,
    array: contentArray,
    initialPosition,
    getStyle,
  });

  ws.addConditionalFormatting({
    ref: getCustomNamesRange('types'),
    rules: [
      {
        type: 'cells',
        formulae: [`${getCustomNamesRange('types').split(':')[0]} = "${labels.calificable}"`],
        style: {
          font: {
            color: {
              argb: 'A9AAAD',
            },
          },
        },
      },
      {
        type: 'expression',
        formulae: [`${getCustomNamesRange('types').split(':')[0]} <> "${labels.calificable}"`],
        style: {
          font: {
            color: {
              argb: 'C53929',
            },
          },
        },
      },
    ],
  });
}
