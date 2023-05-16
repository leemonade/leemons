import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { Box, Transition, Paper, Select, Group, Button } from '@bubbles-ui/components';

const scaleY = {
  in: { opacity: 1, transform: 'scaleY(1)' },
  out: { opacity: 0, transform: 'scaleY(0)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity',
};

function BranchBlockCodeAutocomposedSelectField({
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
              <Controller
                name="nodeLevel"
                control={control}
                rules={{
                  required: errorMessages.codeNodeLevelRequired,
                }}
                render={({ field }) => (
                  <Select
                    required
                    error={errors.nodeLevel}
                    data={selectData.parentNodeLevels || []}
                    {...field}
                  />
                )}
              />
            </Box>

            {formData.nodeLevel ? (
              <Box mt={16}>
                <Controller
                  name="nodeLevelField"
                  control={control}
                  rules={{
                    required: errorMessages.codeNodeLevelFieldRequired,
                  }}
                  render={({ field }) => (
                    <Select
                      required
                      error={errors.nodeLevelField}
                      data={selectData.nodeLevelsFields[formData.nodeLevel] || []}
                      {...field}
                    />
                  )}
                />
              </Box>
            ) : null}
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

BranchBlockCodeAutocomposedSelectField.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  defaultValues: PropTypes.object,
  selectData: PropTypes.object,
  opened: PropTypes.bool,
  setOpened: PropTypes.func,
  onSubmit: PropTypes.func,
  onSave: PropTypes.func,
};

export default BranchBlockCodeAutocomposedSelectField;
