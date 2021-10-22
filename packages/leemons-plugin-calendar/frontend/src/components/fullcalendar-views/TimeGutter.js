import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import * as TimeSlotUtils from './utils/TimeSlots';
import TimeSlotGroup from './TimeSlotGroup';

export default class TimeGutter extends Component {
  constructor(...args) {
    super(...args);

    const { min, max, timeslots, step, localizer } = this.props;
    this.slotMetrics = TimeSlotUtils.getSlotMetrics({
      min,
      max,
      timeslots,
      step,
      localizer,
    });
  }

  shouldComponentUpdate(nextProps) {
    this.slotMetrics = this.slotMetrics.update(nextProps);
    return true;
  }

  renderSlot = (value, idx) => {
    if (idx !== 0) return null;
    const { localizer, getNow } = this.props;

    const isNow = this.slotMetrics.dateIsInGroup(getNow(), idx);
    return (
      <span className={clsx('rbc-label', isNow && 'rbc-now')}>
        {localizer.format(value, 'timeGutterFormat')}
      </span>
    );
  };

  render() {
    const { resource, components, getters, gref } = this.props;

    return (
      <div className="rbc-time-gutter rbc-time-column" ref={gref}>
        {this.slotMetrics.groups.map((grp, idx) => (
          <TimeSlotGroup
            key={idx}
            group={grp}
            resource={resource}
            components={components}
            renderSlot={this.renderSlot}
            getters={getters}
          />
        ))}
      </div>
    );
  }
}

TimeGutter.propTypes = {
  min: PropTypes.instanceOf(Date).isRequired,
  max: PropTypes.instanceOf(Date).isRequired,
  timeslots: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  getNow: PropTypes.func.isRequired,
  components: PropTypes.object.isRequired,
  getters: PropTypes.object,
  gref: PropTypes.func,

  localizer: PropTypes.object.isRequired,
  resource: PropTypes.string,
};
