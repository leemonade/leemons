import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ContextContainer,
  NumberInput,
  Paragraph,
  Stack,
  Switch,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { SelectUsersForAddToClasses } from './SelectUsersForAddToClasses';

const TreeSubjectTypeDetail = ({
  item,
  center,
  messagesAddUsers,
  subjectType,
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
  } = useForm({ defaultValues: subjectType });

  React.useEffect(() => {
    reset(subjectType);
  }, [subjectType]);

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
          <Title order={4}>{subjectType ? messages.title : messages.titleNew}</Title>
          <Box>
            <Controller
              control={control}
              name="name"
              rules={{ required: messages.nameRequired }}
              render={({ field }) => <TextInput required label={messages.nameLabel} {...field} />}
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
          <Box>
            <Controller
              control={control}
              name="groupVisibility"
              render={({ field }) => (
                <Switch {...field} label={messages.nested} checked={!!field.value} />
              )}
            />
          </Box>

          {!subjectType ? (
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

          {subjectType ? (
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

TreeSubjectTypeDetail.propTypes = {
  subjectType: PropTypes.object,
  messages: PropTypes.object,
  onSave: PropTypes.func,
  onGoProgram: PropTypes.func,
  saving: PropTypes.bool,
  selectSubjectsNode: PropTypes.any,
  item: PropTypes.object,
  center: PropTypes.string,
  managersSelect: PropTypes.any,
  messagesAddUsers: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeSubjectTypeDetail };
