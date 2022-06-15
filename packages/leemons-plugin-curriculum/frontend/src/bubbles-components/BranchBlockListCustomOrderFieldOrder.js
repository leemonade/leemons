import React from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Paper,
  Select,
  Transition,
} from '@bubbles-ui/components';

const scaleY = {
  in: { opacity: 1, transform: 'scaleY(1)' },
  out: { opacity: 0, transform: 'scaleY(0)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity',
};

export function getExampleTextForListOrderedConfig(config) {
  if (config && config.numberingStyle) {
    if (config.numberingStyle === 'style-1') {
      if (config.numberingDigits) {
        return `${'1'.padStart(config.numberingDigits, '0')},${'2'.padStart(
          config.numberingDigits,
          '0'
        )}`;
      }
      return '1,2';
    }
    if (config.numberingStyle === 'style-1') {
      return 'A,B';
    }
  }
  return null;
}

function BranchBlockListCustomOrderFieldOrder({
  messages,
  errorMessages,
  defaultValues,
  selectData,
  opened,
  setOpened,
  onSave = () => {},
}) {
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const formData = watch();

  return (
    <Transition mounted={opened} transition={scaleY} duration={200} timingFunction="ease">
      {(styles) => (
        <Paper
          shadow="md"
          style={{
            ...styles,
            zIndex: 10,
            position: 'absolute',
            top: '100%',
            left: 0,
            width: 300,
          }}
        >
          <Box m={16}>
            <Box>
              aaaa
              <Controller
                name="numberingStyle"
                control={control}
                rules={{
                  required: errorMessages.listNumberingStyleRequired,
                }}
                render={({ field }) => (
                  <Select
                    required
                    error={errors.numberingStyle}
                    data={
                      selectData.listOrdered
                        ? filter(
                            selectData.listOrdered,
                            ({ value }) => ['style-1', 'style-2'].indexOf(value) >= 0
                          )
                        : []
                    }
                    {...field}
                  />
                )}
              />
            </Box>

            {formData.numberingStyle === 'style-1' ? (
              <Group>
                <Box mt={16}>
                  <Controller
                    name="numberingDigits"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        label={messages.listNumberingDigitsLabel}
                        error={errors.numberingDigits?.message}
                        {...field}
                      />
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    name="numberingContinueFromPrevious"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox label={messages.listNumberingContinueFromPrevious} {...field} />
                    )}
                  />
                </Box>
              </Group>
            ) : null}

            <Box mt={16}>{getExampleTextForListOrderedConfig(watch())}</Box>

            <Box mt={16}>
              <Group>
                <Button
                  rounded
                  size="xs"
                  loaderPosition="right"
                  type="button"
                  onClick={() => setOpened(false)}
                >
                  {messages.cancelCodeAutoComposedField}
                </Button>
                <Button
                  rounded
                  size="xs"
                  loaderPosition="right"
                  type="button"
                  onClick={handleSubmit((d) => {
                    onSave(d);
                    setOpened(false);
                  })}
                >
                  {messages.saveCodeAutoComposedField}
                </Button>
              </Group>
            </Box>
          </Box>
        </Paper>
      )}
    </Transition>
  );
}

BranchBlockListCustomOrderFieldOrder.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  defaultValues: PropTypes.object,
  selectData: PropTypes.object,
  opened: PropTypes.bool,
  setOpened: PropTypes.func,
  onSubmit: PropTypes.func,
  onSave: PropTypes.func,
};

export default BranchBlockListCustomOrderFieldOrder;
