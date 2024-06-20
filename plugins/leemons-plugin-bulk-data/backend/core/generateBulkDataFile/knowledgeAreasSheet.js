const { styleCell } = require('./helpers');

async function createKnowledgeAreasSheet({ workbook, centers, ctx }) {
  const worksheet = workbook.addWorksheet('ap_knowledgeAreas');
  worksheet.columns = [
    { header: 'root', key: 'root', width: 30 },
    { header: 'name', key: 'name', width: 30 },
    { header: 'abbreviation', key: 'abbreviation', width: 30 },
    { header: 'center', key: 'center', width: 30 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'Root',
    name: 'Name',
    abbreviation: 'Acronym',
    center: 'Center',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const knowledgeAreasDataPromises = centers.map((center) =>
    ctx
      .call('academic-portfolio.knowledges.listKnowledgeRest', {
        page: 0,
        size: 9999,
        center: center.id,
      })
      .then((response) => response.data.items)
  );

  const knowledgeAreasData = await Promise.all(knowledgeAreasDataPromises);
  const allKnowledgeAreas = knowledgeAreasData.flat();

  const knowledgeAreas = [];

  allKnowledgeAreas.forEach((knowledgeArea, i) => {
    const paddedIndex = (i + 1).toString().padStart(2, '0');
    const bulkId = `karea${paddedIndex}`;
    worksheet.addRow({
      root: bulkId,
      name: knowledgeArea.name,
      center: centers.find((center) => center.id === knowledgeArea.center).bulkId,
      abbreviation: knowledgeArea.abbreviation,
    });
    knowledgeAreas.push({ id: knowledgeArea.id, bulkId });
  });
  return knowledgeAreas;
}

module.exports = { createKnowledgeAreasSheet };
