import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Text, NumberInput, Box, useTheme } from '@bubbles-ui/components';
import { UnlockIcon, LockIcon, AlertWarningTriangleIcon } from '@bubbles-ui/icons/solid';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { trimEnd } from 'lodash';

function useIsNew({ isNew, id }) {
  const form = useFormContext();
  const weight = useWatch({ name: `weights.${id}.weight`, control: form.control });

  const { touchedFields } = form.formState;
  const isTouched = touchedFields?.weights?.[id]?.weight;

  return isNew && !isTouched && !weight;
}

export default function WeightRenderer({
  row: {
    original: { id, isNew: _isNew },
  },
  lockable,
}) {
  const theme = useTheme();

  const form = useFormContext();
  const isLocked = useWatch({ name: `weights.${id}.isLocked`, control: form.control });

  const isNew = useIsNew({ isNew: _isNew, id });

  return (
    <Stack spacing={2} alignItems="center">
      <Box sx={{ width: 18 }}>
        {!!isNew && (
          <AlertWarningTriangleIcon
            color={theme.other.banner.content.color.error}
            width={18}
            height={18}
          />
        )}
      </Box>
      <Box sx={{ width: 18 }}>
        {lockable && (
          <Controller
            name={`weights.${id}.isLocked`}
            control={form.control}
            render={({ field: { onChange } }) =>
              isLocked ? (
                <LockIcon
                  width={18}
                  height={18}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onChange(false)}
                />
              ) : (
                <UnlockIcon
                  width={18}
                  height={18}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onChange(true)}
                />
              )
            }
          />
        )}
      </Box>
      <Controller
        name={`weights.${id}.weight`}
        control={form.control}
        render={({ field }) =>
          isLocked ? (
            <Box
              sx={{
                width: 85,
                height: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>
                {(field.value * 100).toFixed(
                  trimEnd((field.value * 100).toString().split('.')[1] || '', '0').length
                )}
                %
              </Text>
            </Box>
          ) : (
            <NumberInput
              {...field}
              hideControls
              max={100}
              min={0}
              rightIcon="%"
              formatter={(userInput) => {
                let _value = userInput;
                const precision = trimEnd(_value.toString().split('.')[1] || '', '0').length;

                if (_value.endsWith('.')) {
                  return `% ${_value}`;
                }

                if (_value.startsWith('0') && !_value.startsWith('0.')) {
                  _value = _value.replace('^0', '');
                }

                return `% ${(_value * 1 || 0).toFixed(precision)}`;
              }}
              parser={(_value) => _value.replace(/[% ]/g, '').replace(/,/g, '.').trim()}
              precision={2}
              styles={{
                input: {
                  paddingRight: '8px !important',
                  textAlign: 'center',
                  width: '100%',
                },
              }}
              sx={{ width: 85 }}
              value={(field.value ?? 0) * 100}
              onChange={(_value) => field.onChange(Number(((_value ?? 0) / 100).toFixed(4)))}
            />
          )
        }
      />
    </Stack>
  );
}

WeightRenderer.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string.isRequired,
      isNew: PropTypes.bool.isRequired,
    }),
  }).isRequired,
  lockable: PropTypes.bool.isRequired,
};
