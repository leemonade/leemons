import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isNil } from 'lodash';
import { Stepper } from '@bubbles-ui/components';

function Setup({ labels, steps, values, editable, onNext, onPrev, onSave, ...props }) {
  const [sharedData, setSharedData] = useState(values || {});
  const [active, setActive] = useState(0);
  const [callOnSave, setCallOnSave] = useState(false);

  useEffect(() => {
    if (callOnSave) {
      if (isFunction(onSave)) onSave(sharedData);
      setCallOnSave(false);
    }
  }, [callOnSave]);

  useEffect(() => {
    if (!isNil(values) && JSON.stringify(sharedData) !== JSON.stringify(values)) {
      setSharedData(values);
    }
  }, [values]);

  // ·······························································
  // HANDLERS

  const handleOnNext = () => {
    if (active < steps.length - 1) {
      setActive(active + 1);
      if (isFunction(onNext)) onNext(sharedData);
    } else {
      setCallOnSave(true);
    }
  };

  const handleOnPrev = () => {
    if (active > 0) {
      setActive(active - 1);
      if (isFunction(onPrev)) onPrev(sharedData);
    }
  };

  // ----------------------------------------------------------------
  // COMPONENT

  return (
    <Stepper
      {...props}
      active={active}
      data={steps}
      onNext={handleOnNext}
      onPrev={handleOnPrev}
      sharedData={sharedData}
      setSharedData={setSharedData}
      editable={editable}
    />
  );
}

Setup.defaultProps = {
  labels: {},
  values: {},
  editable: true,
};
Setup.propTypes = {
  labels: PropTypes.object,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      description: PropTypes.string,
      content: PropTypes.node,
    })
  ),
  values: PropTypes.object,
  editable: PropTypes.bool,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onSave: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { Setup };
