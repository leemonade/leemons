import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ColorInput,
  ContextContainer,
  NumberInput,
  Paragraph,
  Stack,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { SelectUsersForAddToClasses } from './SelectUsersForAddToClasses';

const TreeKnowledgeDetail = ({
  item,
  center,
  messagesAddUsers,
  knowledge,
  program,
  messages,
  onSave,
  saving,
  managersSelect,
  selectSubjectsNode,
}) => {
  const [disableSave, setDisabledSave] = React.useState(false);

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: knowledge });

  React.useEffect(() => {
    reset(knowledge);
  }, [knowledge]);

  const abbrRules = {
    required: messages.abbreviationRequired,
    maxLength: {
      value: program.maxKnowledgeAbbreviation,
      message: messages.maxLength.replace('{max}', program.maxKnowledgeAbbreviation),
    },
  };

  function onChangeAddUsers(e) {
    setValue('students', e);
  }

  function onDisableSave(e) {
    setDisabledSave(e);
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSave)} autoComplete="off">
        <ContextContainer direction="column" fullWidth>
          <Title order={4}>{knowledge ? messages.title : messages.titleNew}</Title>
          <Box>
            gatitos
            <Controller
              control={control}
              name="name"
              rules={{ required: messages.nameRequired }}
              render={({ field }) => (
                <TextInput {...field} label={messages.nameLabel} error={errors.name} required />
              )}
            />
          </Box>
          {managersSelect ? (
            <Box>
              <Controller
                control={control}
                name="managers"
                render={({ field }) =>
                  React.cloneElement(managersSelect, {
                    label: messagesAddUsers.managersLabel,
                    maxSelectedValues: 999,
                    ...field,
                  })
                }
              />
            </Box>
          ) : null}
          <Box>
            <Controller
              name="abbreviation"
              control={control}
              rules={abbrRules}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label={messages.abbreviationLabel}
                  help={messages.abbreviationHelper.replace(
                    '{max}',
                    program.maxKnowledgeAbbreviation
                  )}
                  error={errors.abbreviation}
                  required
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="color"
              control={control}
              rules={{
                required: messages.colorRequired,
              }}
              render={({ field }) => (
                <ColorInput {...field} label={messages.colorLabel} error={errors.color} required />
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="credits_course"
              render={({ field }) => <NumberInput label={messages.crCourse} {...field} />}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="credits_program"
              render={({ field }) => <NumberInput label={messages.crProgram} {...field} />}
            />
          </Box>

          {!knowledge ? (
            <>
              <Box>
                <Title order={4}>{messages.assignSubjects.title}</Title>
                <Paragraph>{messages.assignSubjects.description}</Paragraph>
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

          {knowledge ? (
            <SelectUsersForAddToClasses
              onChange={onChangeAddUsers}
              disableSave={onDisableSave}
              center={center}
              messages={messagesAddUsers}
              tree={item}
            />
          ) : null}

          <Stack fullWidth alignItems="end" justifyContent="end">
            <Box>
              <Button disabled={disableSave} loading={saving} type="submit">
                {messages.save}
              </Button>
            </Box>
          </Stack>
        </ContextContainer>
      </form>
    </Box>
  );
};

TreeKnowledgeDetail.propTypes = {
  knowledge: PropTypes.object,
  program: PropTypes.object,
  messages: PropTypes.object,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
  selectSubjectsNode: PropTypes.any,
  item: PropTypes.object,
  center: PropTypes.string,
  messagesAddUsers: PropTypes.object,
  managersSelect: PropTypes.any,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeKnowledgeDetail };
