async function getProgram({ program, ctx }) {
  const item = await ctx.tx.db.Config.findOne({ type: 'program', typeId: program }).lean();
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
