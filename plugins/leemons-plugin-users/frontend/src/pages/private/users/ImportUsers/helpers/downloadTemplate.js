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

function getCellStyle(cell, { row, col }) {
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

export function getProfileDatasetSheetData({ t, profileDataset }) {
  if (!profileDataset?.compileJsonSchema?.properties) return [];
  const { properties } = profileDataset.compileJsonSchema;
  const { jsonUI } = profileDataset;
  const indexes = ['email'];
  const labels = [t('workbook.email')];
  const examples = ['email@leemons.io'];

  Object.keys(properties).forEach((key) => {
    const property = properties[key];
    const ui = jsonUI[key];
    if (!ui?.['ui:readonly'] && property?.frontConfig?.name) {
      indexes.push(key);
      labels.push(property?.title);
      examples.push(property?.enum ? property?.enum.join(' | ') : '');
    }
  });

  return { indexes, labels, examples };
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

export async function downloadTemplate({
  t,
  extraFields,
  profileDataset,
  skipProfileDataset,
  userList,
}) {
  const wb = new Workbook();
  const ws = wb.addWorksheet('template', { properties: { defaultColWidth: 18 } });

  wb.creator = 'Leemons EdTech Solutions';
  wb.title = t('workbook.title') || 'Leemons users template';

  let userRows = [];

  if (userList?.length > 0) {
    userRows = userList.map((user) => {
      const dataset = [];

      if (user.dataset && extraFields) {
        extraFields.forEach((field) => {
          const key = field.value.split('.').pop();
          dataset.push(user.dataset[key].value);
        });
      }

      return [
        user.email,
        user.name,
        user.surnames,
        user.secondSurname,
        new Date(user.birthdate),
        user.gender,
        (user.tags ?? []).join(','),
        ...dataset,
      ];
    });
  } else {
    userRows = [
      [
        'email@leemons.io',
        'Leemons',
        'leemonade',
        'leemonade',
        new Date(),
        'male | female | other',
        'tag1,tag2,tag3',
      ],
    ];
  }

  // --- Logic ---
  const array = [
    getTemplateIndexs({ extraFields }),
    getTemplateIndexsLabels(t, { extraFields }),
    ...userRows,
  ];

  arrayToContent({
    ws,
    array,
    getStyle: getCellStyle,
  });

  if (!skipProfileDataset && profileDataset) {
    const wsProfileDataset = wb.addWorksheet('dataset', { properties: { defaultColWidth: 18 } });

    const { indexes, labels, examples } = getProfileDatasetSheetData({
      t,
      profileDataset,
    });

    arrayToContent({
      ws: wsProfileDataset,
      array: [indexes, labels, examples],
      getStyle: getCellStyle,
    });
  }

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
