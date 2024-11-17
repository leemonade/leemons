import React from 'react';

import { inRange } from './utils/eventLevels';
import MonthView from './Month';

let eventsForWeek = (evts, start, end, accessors, localizer) =>
  evts.filter((e) => inRange(e, start, end, accessors, localizer));

class DateMonthRangeView extends React.Component {
  constructor(...args) {
    super(...args);
  }

  componentDidMount() {
    let { dateMonthRange, onRangeChange } = this.props;
    onRangeChange({
      start: new Date(dateMonthRange.startYear, dateMonthRange.startMonth, 1, 0, 0, 0),
      end: new Date(dateMonthRange.endYear, dateMonthRange.endMonth + 1, 0, 23, 59, 59),
    });
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    let { dateMonthRange, localizer } = this.props;

    const years = [];
    if (dateMonthRange) {
      for (let i = dateMonthRange.startYear; i <= dateMonthRange.endYear; i++) {
        years.push(i);
      }
    }

    return (
      <div className="mt-4 grid grid-cols-3 gap-4">
        {years.map((year) => {
          const isStartYear = dateMonthRange.startYear === year;
          const isEndYear = dateMonthRange.endYear === year;
          let startMonth = 1;
          let endMonth = 12;
          if (isStartYear) startMonth = dateMonthRange.startMonth;
          if (isEndYear) endMonth = dateMonthRange.endMonth;
          const months = [];
          for (let i = startMonth; i <= endMonth; i++) {
            months.push(i);
          }
          return months.map((month) => {
            const date = new Date(year, month, 1);
            return (
              <div style={{ paddingBottom: '100%', position: 'relative' }} key={`${year}${month}`}>
                <div style={{ position: 'absolute', width: '95%', height: '95%' }}>
                  <div className="text-center pt-4">
                    {localizer.format(date, 'monthHeaderFormat')}
                  </div>
                  <MonthView {...this.props} date={date} onRangeChange={() => {}} />
                </div>
              </div>
            );
          });
        })}
      </div>
    );
  }
}

DateMonthRangeView.range = (date, { localizer, ...rest }) => {
  let start = localizer.firstVisibleDay(date, localizer);
  let end = localizer.lastVisibleDay(date, localizer);
  return { start, end };
};

DateMonthRangeView.navigate = (date) => {
  return date;
};

DateMonthRangeView.title = (date, { localizer }) => localizer.format(date, 'monthHeaderFormat');

export default DateMonthRangeView;
