import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { Box, Transition, Paper, Select, Group, Button, Input } from '@bubbles-ui/components';

const scaleY = {
  in: { opacity: 1, transform: 'scaleY(1)' },
  out: { opacity: 0, transform: 'scaleY(0)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity',
};

function BranchBlockGroupColumn({
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
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [opened]);

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
              <Controller
                name="name"
                control={control}
                rules={{
                  required: errorMessages.groupColumnNameRequired,
                }}
                render={({ field }) => <Input required error={errors.name} {...field} />}
              />
            </Box>

            <Box mt={16}>
              <Controller
                name="type"
                control={control}
                rules={{
                  required: errorMessages.groupColumnTypeRequired,
                }}
                render={({ field }) => (
                  <Select
                    required
                    label={messages.groupColumnTypeLabel}
                    error={errors.type}
                    data={selectData.groupTypeOfContents}
                    {...field}
                  />
                )}
              />
            </Box>

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

BranchBlockGroupColumn.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  defaultValues: PropTypes.object,
  selectData: PropTypes.object,
  opened: PropTypes.bool,
  setOpened: PropTypes.func,
  onSubmit: PropTypes.func,
  onSave: PropTypes.func,
};

export default BranchBlockGroupColumn;
