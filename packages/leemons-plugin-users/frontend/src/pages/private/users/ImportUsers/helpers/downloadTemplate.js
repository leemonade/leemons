/* eslint-disable no-param-reassign */
import { Workbook } from 'exceljs';
import _ from 'lodash';

function arrayToContent({ ws, array, getStyle }) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      const cell = ws.getCell(i + 1, j + 1);
      cell.value = array[i][j];

      if (typeof getStyle === 'function') {
        getStyle(cell, {
          col: j,
          row: i,
          relCol: j,
          relRow: i,
        });
      }
    }
  }
}

export function getTemplateIndexs({ extraFields }) {
  return [
    'email',
    'name',
    'surnames',
    'secondSurname',
    'birthdate',
    'gender',
    'tags',
    ..._.map(extraFields, 'value'),
  ];
}

export function getTemplateIndexsLabels(t, { extraFields }) {
  return [
    t('workbook.email'),
    t('workbook.name'),
    t('workbook.surnames'),
    t('workbook.secondSurname'),
    t('workbook.birthdate'),
    t('workbook.gender'),
    t('workbook.tags'),
    ..._.map(extraFields, 'label'),
  ];
}

export async function downloadTemplate({ t, extraFields }) {
  const wb = new Workbook();
  const ws = wb.addWorksheet('template', { properties: { defaultColWidth: 18 } });

  wb.creator = 'Leemons EdTech Solutions';
  wb.title = t('workbook.title') || 'Leemons users template';

  // --- Logic ---
  const array = [
    getTemplateIndexs({ extraFields }),
    getTemplateIndexsLabels(t, { extraFields }),
    [
      'email@leemons.io',
      'Leemons',
      'leemonade',
      'leemonade',
      new Date(),
      'male or female',
      'tag1,tag2,tag3',
    ],
  ];
  arrayToContent({
    ws,
    array,
    getStyle: (cell, { row, col }) => {
      if (row === 0) {
        cell.font = {
          color: {
            argb: 'ffd4d4d4',
          },
        };
      }
      if (row === 1) {
        cell.border = {
          bottom: { style: 'medium', color: { argb: '3C84C6' } },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F1F9FE' },
        };
      }
    },
  });

  // --- Download ---
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = t('workbook.downloadName');
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default downloadTemplate;
