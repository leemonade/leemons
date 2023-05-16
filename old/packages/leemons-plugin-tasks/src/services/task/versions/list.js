const { tasksVersions } = require('../../table');

module.exports = async function listVersions(
  { status } = {},
  page = 0,
  size = 10,
  { transacting }
) {
  const query = {};

  if (status) {
    query.status = status;
  }

  // EN: Get the unique tasks that match the query
  // ES: Obtener las tareas únicas que coincidan con la consulta
  const pagination = await global.utils.paginate(tasksVersions, page, size, query, {
    columns: ['task'],
    transacting,
  });

  const tasks = pagination.items.map(({ task }) => task);

  let versions = await Promise.all(
    tasks.map(
      async (task) =>
        (
          await tasksVersions.find(
            { ...query, task, $sort: 'major:DESC,minor:DESC,patch:DESC', $limit: 1 },
            { transacting }
          )
        )[0]
    )
  );

  versions = versions.map((task) => ({
    ...task,
    version: `${task.major}.${task.minor}.${task.patch}`,
  }));

  return {
    ...pagination,
    items: versions,
  };
};
