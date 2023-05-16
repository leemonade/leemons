import * as _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';

import hooks from 'leemons-hooks';
import { notify } from './utils/helpers';
import { dateCellSelection, getSlotAtX, pointInBox } from './utils/selection';
import Selection, { getBoundsForNode, isEvent } from './Selection';

class BackgroundCells extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selecting: false,
    };
  }

  componentDidMount() {
    this.props.selectable && this._selectable();
  }

  componentWillUnmount() {
    this._teardownSelectable();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.selectable && !this.props.selectable) this._selectable();
    if (!nextProps.selectable && this.props.selectable) this._teardownSelectable();
    return true;
  }

  onClickDate(date) {
    hooks.fireEvent('big-calendar:dayClick', date);
  }

  backgroundEventClick(event, e) {
    e.stopPropagation();
    e.preventDefault();
    hooks.fireEvent('big-calendar:backgroundEventClick', event);
  }

  render() {
    const {
      range,
      getNow,
      getters,
      date: currentDate,
      components: { dateCellWrapper: Wrapper },
      localizer,
      events,
      accessors,
    } = this.props;

    const { selecting, startIdx, endIdx } = this.state;
    const current = getNow();

    const getDaysBetweenDates = function (startDate, endDate) {
      const now = moment(startDate).clone();
      const dates = [];

      while (now.isSameOrBefore(endDate)) {
        dates.push(now.format('YYYY/MM/DD'));
        now.add(1, 'days');
      }
      return dates;
    };


    const eventsByDay = {};

    _.forEach(events, (event) => {
      const end = accessors.end(event);
      const start = accessors.start(event);
      const days = getDaysBetweenDates(start, end);
      _.forEach(days, (day) => {
        if (!_.isArray(eventsByDay[day])) eventsByDay[day] = [];
        eventsByDay[day].push(event);
      });
    });

    return (
      <div className="rbc-row-bg" ref={(r) => (this.container = r)}>
        {range.map((date, index) => {
          const selected = selecting && index >= startIdx && index <= endIdx;
          let { className, style } = getters.dayProp(date);

          if (!_.isObject(style)) {
            style = {};
          }
          style.position = 'relative';

          const eventsForDay = eventsByDay[moment(date).format('YYYY/MM/DD')];

          return (
            <Wrapper key={index} value={date} range={range}>
              <div
                style={style}
                className={clsx(
                  'rbc-day-bg',
                  className,
                  selected && 'rbc-selected-cell',
                  localizer.isSameDate(date, current) && 'rbc-today',
                  currentDate && localizer.neq(currentDate, date, 'month') && 'rbc-off-range-bg'
                )}
                onClick={() => this.onClickDate(date)}
              >
                {eventsForDay ? (
                  <div
                    onClick={(e) => this.backgroundEventClick(eventsForDay[0], e)}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                      padding: '4px',
                      backgroundColor: eventsForDay[0].backgroundColor,
                    }}
                  >
                    {eventsForDay[0].title}
                  </div>
                ) : null}
              </div>
            </Wrapper>
          );
        })}
      </div>
    );
  }

  _selectable() {
    const node = this.container;
    const selector = (this._selector = new Selection(this.props.container, {
      longPressThreshold: this.props.longPressThreshold,
    }));

    const selectorClicksHandler = (point, actionType) => {
      if (!isEvent(this.container, point)) {
        const rowBox = getBoundsForNode(node);
        const { range, rtl } = this.props;

        if (pointInBox(rowBox, point)) {
          const currentCell = getSlotAtX(rowBox, point.x, rtl, range.length);

          this._selectSlot({
            startIdx: currentCell,
            endIdx: currentCell,
            action: actionType,
            box: point,
          });
        }
      }

      this._initial = {};
      this.setState({ selecting: false });
    };

    selector.on('selecting', (box) => {
      const { range, rtl } = this.props;

      let startIdx = -1;
      let endIdx = -1;

      if (!this.state.selecting) {
        notify(this.props.onSelectStart, [box]);
        this._initial = { x: box.x, y: box.y };
      }
      if (selector.isSelected(node)) {
        const nodeBox = getBoundsForNode(node);
        ({ startIdx, endIdx } = dateCellSelection(this._initial, nodeBox, box, range.length, rtl));
      }

      this.setState({
        selecting: true,
        startIdx,
        endIdx,
      });
    });

    selector.on('beforeSelect', (box) => {
      if (this.props.selectable !== 'ignoreEvents') return;

      return !isEvent(this.container, box);
    });

    selector.on('click', (point) => selectorClicksHandler(point, 'click'));

    selector.on('doubleClick', (point) => selectorClicksHandler(point, 'doubleClick'));

    selector.on('select', (bounds) => {
      this._selectSlot({ ...this.state, action: 'select', bounds });
      this._initial = {};
      this.setState({ selecting: false });
      notify(this.props.onSelectEnd, [this.state]);
    });
  }

  _teardownSelectable() {
    if (!this._selector) return;
    this._selector.teardown();
    this._selector = null;
  }

  _selectSlot({ endIdx, startIdx, action, bounds, box }) {
    if (endIdx !== -1 && startIdx !== -1)
      this.props.onSelectSlot &&
        this.props.onSelectSlot({
          start: startIdx,
          end: endIdx,
          action,
          bounds,
          box,
          resourceId: this.props.resourceId,
        });
  }
}

BackgroundCells.propTypes = {
  date: PropTypes.instanceOf(Date),
  getNow: PropTypes.func.isRequired,

  getters: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,

  container: PropTypes.func,
  dayPropGetter: PropTypes.func,
  selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
  longPressThreshold: PropTypes.number,

  onSelectSlot: PropTypes.func.isRequired,
  onSelectEnd: PropTypes.func,
  onSelectStart: PropTypes.func,

  range: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  rtl: PropTypes.bool,
  type: PropTypes.string,
  resourceId: PropTypes.any,

  localizer: PropTypes.any,
};

export default BackgroundCells;
