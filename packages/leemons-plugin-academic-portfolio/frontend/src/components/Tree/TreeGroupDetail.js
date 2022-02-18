import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, ContextContainer, Paragraph, TextInput, Title } from '@bubbles-ui/components';

const TreeGroupDetail = ({ group, program, messages, onSave, saving, selectSubjectsNode }) => {
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
          <Title order={4}>{group ? messages.title : messages.titleNew}</Title>
          <Box>
            <Controller
              name="abbreviation"
              control={control}
              rules={{
                required: (program.maxGroupAbbreviationIsOnlyNumbers
                  ? messages.groupNumbers
                  : messages.groupAny
                ).replace('{max}', program.maxGroupAbbreviation),
                pattern: {
                  message: (program.maxGroupAbbreviationIsOnlyNumbers
                    ? messages.groupNumbers
                    : messages.groupAny
                  ).replace('{max}', program.maxGroupAbbreviation),
                  value: new RegExp(
                    `^${program.maxGroupAbbreviationIsOnlyNumbers ? '[0-9]' : `\\S`}{${
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
                  required
                  {...field}
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="name"
              rules={{ required: messages.aliasRequired }}
              render={({ field }) => (
                <TextInput
                  required
                  label={messages.aliasLabel}
                  help={messages.aliasHelper}
                  error={errors.name}
                  {...field}
                />
              )}
            />
          </Box>

          {!group ? (
            <>
              <Box>
                <Title order={4}>{messages.assignSubjects.title}</Title>
                <Paragraph>{messages.assignSubjects.description1}</Paragraph>
                <Paragraph>
                  <strong>{messages.assignSubjects.notes}</strong>
                  {messages.assignSubjects.description2}
                </Paragraph>
              </Box>

              <Box>
                <Controller
                  control={control}
                  name="subjects"
                  render={({ field }) => React.cloneElement(selectSubjectsNode, { ...field })}
                />
              </Box>
            </>
          ) : null}

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
  selectSubjectsNode: PropTypes.any,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeGroupDetail };
