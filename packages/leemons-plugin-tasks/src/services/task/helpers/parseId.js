const { tasksVersioning } = require('../../table');

module.exports = async function parseId(id, version) {
  if (version) {
    return { id, version, fullId: `${id}@${version}` };
  }
  const [_id, _version] = id.split('@');

  let __version = _version;

  if (__version === 'current' || !__version) {
    const [taskInfo] = await tasksVersioning.find({ id: _id });
    __version = taskInfo.current;
  }

  return { id: _id, version: __version, fullId: `${_id}@${__version}` };
};
