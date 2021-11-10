const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/localeData'));

module.exports = dayjs().locale('en').localeData().weekdays();
