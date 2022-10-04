/* eslint-disable import/prefer-default-export */
import { htmlToText } from '@common';
import { Workbook } from 'exceljs';
import { isArray, isObject } from 'lodash';

function downloadURL(url, name) {
  const link = document.createElement('a');
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadFile(data, name) {
  const blob = new Blob([data], {
    type: name.endsWith('.xlsx')
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : '.csv',
  });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, name);
}

export const createDatasheet = async (title, questions, responsesData, format) => {
  const wb = new Workbook();

  wb.creator = 'Leemons EdTech Solutions';
  wb.title = title;

  const workSheet = wb.addWorksheet('Feedback responses');
  workSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  questions.forEach((question, index) => {
    const column = workSheet.getColumn(index + 1);
    const questionHeader = htmlToText(question.question);
    column.width = 50;

    const questionResponses = responsesData[question.id].value;
    if (isArray(questionResponses)) {
      column.values = [questionHeader, ...questionResponses];
    } else if (isObject(questionResponses)) {
      column.values = [questionHeader, ...Object.values(questionResponses)];
    }
  });

  if (format === 'xls') {
    const buffer = await wb.xlsx.writeBuffer();
    downloadFile(buffer, `${wb.title}.xls`);
  } else if (format === 'csv') {
    const buffer = await wb.csv.writeBuffer();
    downloadFile(buffer, `${wb.title}.csv`);
  }
};
