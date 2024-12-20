import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { Stack, Text, Box } from '@bubbles-ui/components';
import { trimEnd } from 'lodash';
import PropTypes from 'prop-types';

export default function TotalWeightRenderer({ lockable }) {
  const form = useFormContext();
  const values = useWatch({
    control: form.control,
  });

  const totalWeight = useMemo(() => {
    const weight = Object.values(values.weights ?? {}).reduce(
      (acc, value) => acc + value.weight,
      0
    );

    if (Number.isNaN(Number(weight))) {
      return 0;
    }

    const value = Number(weight.toFixed(4));

    if (value === 0.9999) {
      return 1;
    }

    return value;
  }, [values]);

  if (totalWeight > 1 && values.weightExceed !== 1) {
    form.setValue('weightExceed', 1);
  } else if (totalWeight < 1 && values.weightExceed !== -1) {
    form.setValue('weightExceed', -1);
  } else if (totalWeight === 1.0 && values.weightExceed !== 0) {
    form.setValue('weightExceed', 0);
  }

  return (
    <Stack spacing={2} alignItems="center">
      {!!lockable && <Box sx={{ width: 18 }} />}
      <Box
        sx={{
          width: 85,
          height: 40,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text color={totalWeight !== 1 && 'error'}>
          {trimEnd(trimEnd((totalWeight * 100).toFixed(2), '0'), '.')}%
        </Text>
      </Box>
    </Stack>
  );
}

TotalWeightRenderer.propTypes = {
  lockable: PropTypes.bool,
};
