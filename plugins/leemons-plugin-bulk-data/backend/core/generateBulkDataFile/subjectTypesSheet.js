const { styleCell } = require('./helpers');

async function createSubjectTypesSheet({ workbook, centers, ctx }) {
  const worksheet = workbook.addWorksheet('ap_subject_types');
  worksheet.columns = [
    { header: 'root', key: 'root', width: 30 },
    { header: 'name', key: 'name', width: 30 },
    { header: 'center', key: 'center', width: 30 },
    { header: 'description', key: 'description', width: 30 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'Root',
    name: 'Name',
    center: 'Center',
    description: 'Description',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const subjectTypesDataPromises = centers.map((center) =>
    ctx
      .call('academic-portfolio.subjectType.listSubjectTypeRest', {
        page: 0,
        size: 9999,
        center: center.id,
      })
      .then((response) => response.data.items)
  );

  const subjectTypesData = await Promise.all(subjectTypesDataPromises);
  const allSubjectTypes = subjectTypesData.flat();

  const subjectTypes = [];

  allSubjectTypes.forEach((subjectType, i) => {
    const paddedIndex = (i + 1).toString().padStart(2, '0');
    const bulkId = `type${paddedIndex}`;
    worksheet.addRow({
      root: bulkId,
      name: subjectType.name,
      center: centers.find((center) => center.id === subjectType.center).bulkId,
      description: subjectType.description,
    });
    subjectTypes.push({ id: subjectType.id, bulkId });
  });
  return subjectTypes;
}

module.exports = { createSubjectTypesSheet };
