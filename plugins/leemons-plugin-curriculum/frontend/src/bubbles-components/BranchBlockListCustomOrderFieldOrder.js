import {
  Box,
  Button,
  ContextContainer,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  Transition,
} from '@bubbles-ui/components';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import { numberToEncodedLetter } from '@common';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

const scaleY = {
  in: { opacity: 1, transform: 'scaleY(1)' },
  out: { opacity: 0, transform: 'scaleY(0)' },
  common: { transformOrigin: 'bottom' },
  transitionProperty: 'transform, opacity',
};

export function getExampleTextForListOrderedConfig(config, init = 1) {
  if (config && config.numberingStyle) {
    if (config.numberingStyle === 'style-1') {
      if (config.numberingDigits) {
        return `${init.toString().padStart(config.numberingDigits, '0')},${(init + 1)
          .toString()
          .padStart(config.numberingDigits, '0')},${(init + 2)
          .toString()
          .padStart(config.numberingDigits, '0')}...`;
      }
      return '1,2,3...';
    }
    if (config.numberingStyle === 'style-2') {
      return `${numberToEncodedLetter(init)},${numberToEncodedLetter(
        init + 1
      )},${numberToEncodedLetter(init + 2)}...`;
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
  withPrevious = true,
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
            bottom: '100%',
            left: 0,
            width: 300,
          }}
        >
          <Box>
            <Stack
              sx={(theme) => ({ marginBottom: theme.spacing[6] })}
              fullWidth
              alignItems="center"
              justifyContent="space-between"
            >
              <Text size="md" strong color="primary">
                {messages.addNumeration}
              </Text>
              <RemoveIcon onClick={() => setOpened(false)} />
            </Stack>
            <ContextContainer>
              <Box>
                <Controller
                  name="numberingStyle"
                  control={control}
                  rules={{
                    required: errorMessages.listNumberingStyleRequired,
                  }}
                  render={({ field }) => (
                    <Select
                      required
                      label={messages.numerationLabel}
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
                {formData.numberingStyle === 'style-2' ? (
                  <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                    <Text role="productive">{getExampleTextForListOrderedConfig(watch())}</Text>
                  </Box>
                ) : null}
              </Box>

              {formData.numberingStyle === 'style-1' ? (
                <Box>
                  <Controller
                    name="numberingDigits"
                    control={control}
                    defaultValue={1}
                    shouldUnregister
                    render={({ field }) => (
                      <NumberInput
                        min={1}
                        label={messages.listNumberingDigitsLabel}
                        error={errors.numberingDigits?.message}
                        {...field}
                      />
                    )}
                  />
                  <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                    <Text role="productive">{getExampleTextForListOrderedConfig(watch())}</Text>
                  </Box>
                </Box>
              ) : null}

              <Box>
                <Button
                  fullWidth
                  onClick={handleSubmit((d) => {
                    onSave(d);
                    setOpened(false);
                  })}
                >
                  {messages.saveCodeAutoComposedField}
                </Button>
              </Box>
            </ContextContainer>
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
  withPrevious: PropTypes.bool,
};

export default BranchBlockListCustomOrderFieldOrder;
