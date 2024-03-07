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

/**
 *
 * @param {import "exceljs".Workbook} wb
 */
export default async function getFile(wb, format = 'xlsx') {
  if (format === 'xlsx') {
    const buffer = await wb.xlsx.writeBuffer();

    downloadFile(buffer, `${wb.title}.xlsx`);
  } else if (format === 'csv') {
    const matrix = [];
    const notebookSheet = wb.worksheets[0];
    notebookSheet.eachRow((row, rowNumber) => {
      const matrixRow = [];
      row.eachCell((cell, colNumber) => {
        if (cell.value.result !== undefined) {
          matrixRow[colNumber] = cell.value.result;
        } else {
          matrixRow[colNumber] = cell.value;
        }
      });
      matrix[rowNumber] = matrixRow;
    });

    const buffer = matrix
      .map((matrixRow) => {
        if (!matrixRow) {
          return '';
        }
        return matrixRow.map((v) => v || '').join(',');
      })
      .join('\n');

    downloadFile(buffer, `${wb.title}.csv`);
  }
}
