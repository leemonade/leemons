import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { HorizontalStepper, Box } from '@bubbles-ui/components';
import { LayoutContext } from '@layout/context/layout';

function Setup({ steps, onNext, onPrev, onFinish, ...props }) {
  const [active, setActive] = useState(0);
  const { scrollTo } = useContext(LayoutContext);

  // ·······························································
  // HANDLERS

  const handleOnNext = () => {
    if (active < steps.length - 1) {
      setActive(active + 1);
      if (isFunction(onNext)) onNext();
    } else if (isFunction(onFinish)) {
      onFinish();
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
    <>
      <HorizontalStepper {...props} currentStep={active} data={steps} />
      <Box pt={40}>
        {
          steps.map((item) =>
            React.cloneElement(item.content, {
              ...item.content.props,
              onNext: handleOnNext,
              onPrevious: handleOnPrev,
            })
          )[active]
        }
      </Box>
    </>
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
