/* eslint-disable import/prefer-default-export */
import { htmlToText } from '@common';
import { getFeedbackResultsWithTime } from '@feedback/request/feedback';
import { Workbook } from 'exceljs';
import { groupBy, forEach } from 'lodash';

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

export const createDatasheet = async (title, questions, instanceId, format, labels) => {
  const wb = new Workbook();
  const feedbackResponsesWithTime = await getFeedbackResultsWithTime(instanceId);

  forEach(questions, (question) => {
    forEach(Object.values(feedbackResponsesWithTime), (value) => {
      // eslint-disable-next-line no-param-reassign
      value.responses[question.id].order = question.order;
    });
  });

  wb.creator = 'Leemons EdTech Solutions';
  wb.title = title;

  const workSheet = wb.addWorksheet('Feedback responses');
  workSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

  const firstCell = workSheet.getCell(1, 1);
  const firstColumn = workSheet.getColumn(1);
  firstCell.value = labels.timeMarkerLabel;
  firstColumn.width = 20;

  questions.forEach((question, index) => {
    const cell = workSheet.getCell(1, index + 2);
    const column = workSheet.getColumn(index + 2);
    cell.value = htmlToText(question.question);
    column.width = cell.value.toString().length > 14 ? cell.value.toString().length : 14;
  });

  const initialRow = 2;
  const initialCol = 1;

  const questionsById = groupBy(questions, 'id');

  Object.entries(feedbackResponsesWithTime)
    .sort(([aKey], [bKey]) => new Date(aKey) - new Date(bKey))
    .forEach(([key, value], index) => {
      const date = new Date(key);
      const timeMark = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      const contentArray = [timeMark];
      const valueResponses = Object.entries(value.responses).sort(
        ([, aValue], [, bValue]) => aValue.order - bValue.order
      );
      valueResponses.forEach(([questionKey, { value: questionValue }]) => {
        const {
          type,
          properties: { responses, withImages },
        } = questionsById[questionKey][0];
        const property = withImages ? 'imageDescription' : 'response';
        if (type === 'openResponse' || type === 'netPromoterScore')
          contentArray.push(questionValue.toString());
        else if (type === 'likertScale') contentArray.push(`${questionValue + 1}`);
        else if (type === 'singleResponse') {
          const responseValue =
            responses[questionValue].value[property] || `${labels.option} ${index + 1}`;
          contentArray.push(responseValue);
        } else if (type === 'multiResponse') {
          const sortedValues = questionValue.sort((a, b) => a - b);
          contentArray.push(
            sortedValues
              .map(
                (selectedValue, i) =>
                  responses[selectedValue].value[property] || `${labels.option} ${i + 1}`
              )
              .join(', ')
          );
        } else contentArray.push('');
      });
      contentArray.forEach((contentValue, contentIndex) => {
        const cell = workSheet.getCell(initialRow + index, initialCol + contentIndex);
        cell.value = contentValue;
      });
    });

  if (format === 'xls') {
    const buffer = await wb.xlsx.writeBuffer();
    downloadFile(buffer, `${wb.title}.xlsx`);
  } else if (format === 'csv') {
    const buffer = await wb.csv.writeBuffer();
    downloadFile(buffer, `${wb.title}.csv`);
  }
};
