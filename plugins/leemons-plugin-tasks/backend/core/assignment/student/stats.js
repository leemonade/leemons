const { userInstances } = require('../../table');

const STATS_COLUMNS = ['open', 'ongoing', 'completed'];
const DEFAULT_COLUMNS = STATS_COLUMNS;

function getEquivalentColum(column) {
  switch (column) {
    case 'open':
      return 'opened';
    case 'ongoing':
      return 'start';
    case 'completed':
      return 'end';
    default:
      return column;
  }
}

async function getStats(instance, { columns = DEFAULT_COLUMNS, transacting } = {}) {
  try {
    const statsColumns =
      columns === '*' ? STATS_COLUMNS : STATS_COLUMNS.filter((column) => columns.includes(column));

    if (!statsColumns.length) {
      return {};
    }

    const stats = await Promise.all(
      statsColumns.map(async (column) => ({
        column,
        count: await userInstances.count(
          {
            instance,
            [`${getEquivalentColum(column)}_$null`]: false,
          },
          { transacting }
        ),
      }))
    );

    return stats.reduce((o, s) => ({ ...o, [s.column]: s.count }), {});
  } catch (e) {
    throw new Error(`Failed to get user stats for instance ${instance.id}: ${e.message}`);
  }
}

module.exports = {
  getStats,
  STATS_COLUMNS,
  DEFAULT_COLUMNS,
};
