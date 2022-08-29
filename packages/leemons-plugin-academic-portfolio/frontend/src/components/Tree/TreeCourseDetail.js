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
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { SelectUsersForAddToClasses } from './SelectUsersForAddToClasses';

const TreeCourseDetail = ({
  item,
  center,
  messagesAddUsers,
  course,
  messages,
  onSave,
  onGoProgram,
  managersSelect,
  saving,
}) => {
  const [disableSave, setDisabledSave] = React.useState(false);

  const { reset, control, setValue, handleSubmit } = useForm({ defaultValues: course });

  React.useEffect(() => {
    reset(course);
  }, [course]);

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
          <Title order={4}>{messages.title}</Title>
          <Box>
            <TextInput disabled label={messages.numberLabel} value={course.index.toString()} />
          </Box>
          <Box>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput label={messages.nameLabel} help={messages.nameHelper} {...field} />
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
              name="number"
              control={control}
              render={({ field }) => (
                <NumberInput defaultValue={0} min={0} label={messages.creditsLabel} {...field} />
              )}
            />
          </Box>
          <Box>
            <Paragraph>
              {messages.visitProgramDescription}&nbsp;
              <Button variant="link" onClick={onGoProgram}>
                {messages.visitProgramLabel}
              </Button>
            </Paragraph>
          </Box>

          {course ? (
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

TreeCourseDetail.propTypes = {
  course: PropTypes.object,
  messages: PropTypes.object,
  onSave: PropTypes.func,
  onGoProgram: PropTypes.func,
  saving: PropTypes.bool,
  item: PropTypes.object,
  center: PropTypes.string,
  managersSelect: PropTypes.any,
  messagesAddUsers: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeCourseDetail };
