import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, ContextContainer, TextInput, Title } from '@bubbles-ui/components';

const TreeGroupDetail = ({ group, program, messages, onSave, saving }) => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: group });

  React.useEffect(() => {
    reset(group);
  }, [group]);

  return (
    <Box>
      <form onSubmit={handleSubmit(onSave)}>
        <ContextContainer direction="column" fullWidth>
          <Title order={4}>{messages.title}</Title>
          <Box>
            <Controller
              name="abbreviation"
              control={control}
              rules={{
                pattern: {
                  message: (program.maxGroupAbbreviationIsOnlyNumbers
                    ? messages.groupNumbers
                    : messages.groupAny
                  ).replace('{max}', program.maxGroupAbbreviation),
                  value: new RegExp(
                    `^[${program.maxGroupAbbreviationIsOnlyNumbers ? '0-9' : `\S`}]{${
                      program.maxGroupAbbreviation
                    }}$`,
                    'g'
                  ),
                },
              }}
              render={({ field }) => (
                <TextInput
                  label={messages.abbreviationLabel}
                  help={messages.abbreviationHelper}
                  error={errors.abbreviation}
                  {...field}
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput label={messages.aliasLabel} help={messages.aliasHelper} {...field} />
              )}
            />
          </Box>

          <Box>
            <Button loading={saving} type="submit">
              {messages.save}
            </Button>
          </Box>
        </ContextContainer>
      </form>
    </Box>
  );
};

TreeGroupDetail.propTypes = {
  group: PropTypes.object,
  program: PropTypes.object,
  messages: PropTypes.object,
  onSave: PropTypes.func,
  onGoProgram: PropTypes.func,
  saving: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeGroupDetail };
