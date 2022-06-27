import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Stack, Stepper, Title } from '@bubbles-ui/components';

export default function ProgramSetup({
  labels,
  data,
  values,
  editable,
  onNext,
  onPrev,
  onSave,
  ...props
}) {
  const [sharedData, setSharedData] = useState(values);
  const [active, setActive] = useState(0);
  const [callOnSave, setCallOnSave] = useState(false);

  useEffect(() => {
    if (callOnSave) {
      const toSend = { ...sharedData };
      if (toSend.useCreditSystem) {
        toSend.credits = null;
        delete toSend.useCreditSystem;
      }
      onSave(toSend);
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
      onNext(formData);
    } else {
      setCallOnSave(true);
    }
  };

  const handleOnPrev = () => {
    if (active > 0) {
      setActive(active - 1);
      onPrev(sharedData);
    }
  };

  return (
    <Stack direction="column" spacing={7} fullWidth>
      <Stack justifyContent="space-between" fullWidth>
        <Title order={2}>{labels.title}</Title>
      </Stack>
      <Stepper
        {...props}
        active={active}
        data={data}
        onNext={handleOnNext}
        onPrev={handleOnPrev}
        sharedData={sharedData}
        setSharedData={setSharedData}
        editable={editable}
      />
    </Stack>
  );
}

ProgramSetup.propTypes = {
  labels: PropTypes.object,
  data: PropTypes.array,
  values: PropTypes.object,
  editable: PropTypes.bool,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onSave: PropTypes.func,
};

ProgramSetup.defaultProps = {
  onNext: () => {},
  onPrev: () => {},
  onSave: () => {},
};
