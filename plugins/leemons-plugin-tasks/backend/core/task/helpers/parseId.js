const { tasksVersioning } = require('../../table');

module.exports = async function parseId(id, version, { transacting } = {}) {
  try {
    if (version) {
      return { id, version, fullId: `${id}@${version}` };
    }
    const [_id, _version] = id.split('@');

    let __version = _version;

    if (__version === 'current' || !__version) {
      try {
        const [taskInfo] = await tasksVersioning.find({ id: _id }, { transacting });
        __version = taskInfo.current;
      } catch (e) {
        throw new Error(`Task ${_id} not found`);
      }
    }

    return { id: _id, version: __version, fullId: `${_id}@${__version}` };
  } catch (e) {
    throw new Error(`Error parsing id: ${e.message}`);
  }
};
