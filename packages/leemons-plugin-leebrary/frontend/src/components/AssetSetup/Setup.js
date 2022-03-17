import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { Stepper } from '@bubbles-ui/components';
import { LayoutContext } from '@layout/context/layout';

function Setup({ steps, onNext, onPrev, onFinish, ...props }) {
  const [active, setActive] = useState(0);
  const [callOnSave, setCallOnSave] = useState(false);
  const { scrollTo } = useContext(LayoutContext);

  useEffect(() => {
    if (callOnSave) {
      if (isFunction(onFinish)) onFinish();
      setCallOnSave(false);
    }
  }, [callOnSave]);

  // ·······························································
  // HANDLERS

  const handleOnNext = () => {
    if (active < steps.length - 1) {
      setActive(active + 1);
      if (isFunction(onNext)) onNext();
    } else {
      setCallOnSave(true);
    }
    scrollTo({ top: 0 });
  };

  const handleOnPrev = () => {
    if (active > 0) {
      setActive(active - 1);
      if (isFunction(onPrev)) onPrev();
      scrollTo({ top: 0 });
    }
  };

  // ----------------------------------------------------------------
  // COMPONENT

  return (
    <Stepper {...props} active={active} data={steps} onNext={handleOnNext} onPrev={handleOnPrev} />
  );
}

Setup.defaultProps = {};
Setup.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      description: PropTypes.string,
      content: PropTypes.node,
    })
  ),
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onFinish: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { Setup };
