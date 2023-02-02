const { table } = require('../tables');

async function getProgram(program, { transacting } = {}) {
  const item = await table.config.findOne({ type: 'program', typeId: program }, { transacting });
  let config = {
    enableSubjectsRoom: true,
    teachersCanDisableSubjectsRooms: true,
    teachersCanMuteStudents: true,
    onlyTeachersCanWriteInSubjectsRooms: false,
  };
  if (item) {
    config = JSON.parse(item.config);
  }
  return config;
}

module.exports = { getProgram };
