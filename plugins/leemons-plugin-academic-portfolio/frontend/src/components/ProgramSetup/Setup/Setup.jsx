import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { Stack, Stepper, Box, HorizontalStepper, Title } from '@bubbles-ui/components';
import { SetupStyles } from './Setup.styles';

export const SETUP_DEFAULT_PROPS = {
  labels: {},
  values: {},
  editable: true,
};
export const SETUP_PROP_TYPES = {
  labels: PropTypes.object,
  data: PropTypes.arrayOf(
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

const Setup = ({ labels, data, values, editable, onNext, onPrev, onSave, ...props }) => {
  const [sharedData, setSharedData] = useState(values);
  const [active, setActive] = useState(0);
  const [callOnSave, setCallOnSave] = useState(false);

  const { classes, cx } = SetupStyles({}, { name: 'APSetup' });

  useEffect(() => {
    if (callOnSave) {
      const toSend = { ...sharedData };
      if (!toSend.useCreditSystem) {
        toSend.credits = null;
        delete toSend.useCreditSystem;
      }
      isFunction(onSave) && onSave(toSend);
      setCallOnSave(false);
    }
  }, [callOnSave]);

  useEffect(() => {
    if (JSON.stringify(sharedData) !== JSON.stringify(values)) {
      setSharedData(values);
    }
  }, [values]);

  const handleOnNext = (formData) => {
    if (active < data.length - 1) {
      setActive(active + 1);
      isFunction(onNext) && onNext(formData);
    } else {
      setCallOnSave(true);
    }
  };

  const handleOnPrev = () => {
    if (active > 0) {
      setActive(active - 1);
      isFunction(onPrev) && onPrev(sharedData);
    }
  };

  return (
    <Stack className={classes.root} direction="column" spacing={7} fullWidth>
      <Stack justifyContent="space-between" fullWidth>
        <Title order={2}>{labels.title}</Title>
      </Stack>
      <HorizontalStepper data={data} currentStep={active} />
      <Box>
        {
          data.map((item) =>
            React.cloneElement(item.content, {
              ...item.content.props,
              onNext: handleOnNext,
              onPrevious: handleOnPrev,
              setSharedData,
              sharedData,
              editable,
            })
          )[active]
        }
      </Box>
    </Stack>
  );
};

Setup.defaultProps = SETUP_DEFAULT_PROPS;
Setup.propTypes = SETUP_PROP_TYPES;

export { Setup };
