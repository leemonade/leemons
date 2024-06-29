const TurndownService = require('turndown');
const { styleCell } = require('../helpers');

const turndown = new TurndownService();

function createTaskSubjectSheet({ workbook, tasks, subjects }) {
  const worksheet = workbook.addWorksheet('ta_task_subjects');

  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'task', key: 'task', width: 20 },
    { header: 'subject', key: 'subject', width: 20 },
    { header: 'level', key: 'level', width: 20 },
    { header: 'objectives', key: 'objectives', width: 20 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'BulkID',
    task: 'TaskID',
    subject: 'SubjectID',
    level: 'Level',
    objectives: 'Custom Objectives',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  let relationCounter = 0;
  tasks.forEach(({ providerData, bulkId: taskBulkId }) => {
    if (!providerData.subjects?.length) return;
    const { subjects: taskSubjects } = providerData;
    taskSubjects.forEach((taskSubject) => {
      relationCounter++;
      const bulkId = `task_sb_${relationCounter.toString().padStart(2, '0')}`;
      const objectives = taskSubject.curriculum?.objectives;
      const objectivesMarkdown = [];
      objectives?.forEach((objective) => {
        objectivesMarkdown.push(turndown.turndown(objective ?? ''));
      });

      const subjectRelationObject = {
        root: bulkId,
        task: taskBulkId,
        subject: subjects.find((item) => item.id === taskSubject.subject)?.bulkId,
        level: taskSubject.level,
        objectives: objectivesMarkdown.join('\n'),
      };
      worksheet.addRow(subjectRelationObject);
    });
  });
}

module.exports = { createTaskSubjectSheet };
