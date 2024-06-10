const { styleCell, booleanToYesNoAnswer } = require('./helpers');

const getScalesString = (scales, systemType) => {
  const result = scales.map((scale) => {
    if (systemType === 'numeric') {
      // For numeric types, include only number and description (if present)
      return [scale.number, scale.description]
        .filter((part) => part !== undefined && part !== null && part !== '')
        .join('|');
    }
    // For non-numeric types, include letter, number, and optional description
    return [scale.letter, scale.number, scale.description]
      .filter((part) => part !== undefined && part !== null && part !== '')
      .join('|');
  });

  return result.join(',\n');
};

async function createEvaluationsSheet({ workbook, centers, ctx }) {
  const worksheet = workbook.addWorksheet('ar_evaluations');
  worksheet.columns = [
    { header: 'root', key: 'root', width: 30 },
    { header: 'name', key: 'name', width: 30 },
    { header: 'center', key: 'center', width: 30 },
    { header: 'type', key: 'type', width: 30 },
    { header: 'isPercentage', key: 'isPercentage', width: 30 },
    { header: 'scales', key: 'scales', width: 30 },
    { header: 'minScaleToPromote', key: 'minScaleToPromote', width: 30 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'Root',
    name: 'Name',
    center: 'Center',
    type: 'Type',
    isPercentage: 'Is it Percentage?',
    scales: 'Scales',
    minScaleToPromote: 'Min Scale to Promote',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const evaluationSystemsDataPromises = centers.map((center) =>
    ctx
      .call('grades.grades.listGradesRest', {
        page: 0,
        size: 9999,
        center: center.id,
      })
      .then((response) => response.data.items)
  );

  const evaluationSystemsData = await Promise.all(evaluationSystemsDataPromises);
  const allEvaluationSystems = evaluationSystemsData.flat();

  const evaluationSystems = [];

  let wrapCount = 0;
  allEvaluationSystems.forEach((system, i) => {
    if (i > 0 && i % 26 === 0) wrapCount++;
    const suffix = wrapCount > 0 ? wrapCount : '';
    const bulkId = `grade${String.fromCharCode(65 + (i % 26))}${suffix}`;
    worksheet.addRow({
      root: bulkId,
      name: system.name,
      center: centers.find((center) => center.id === system.center).bulkId,
      type: system.type,
      isPercentage: booleanToYesNoAnswer(system.isPercentage),
      scales: getScalesString(system.scales),
      minScaleToPromote: system.scales.find((scale) => scale.id === system.minScaleToPromote)
        .number,
    });
    evaluationSystems.push({ id: system.id, bulkId });
  });
  return evaluationSystems;
}

module.exports = { createEvaluationsSheet };
