import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  Paragraph,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { SelectUsersForAddToClasses } from './SelectUsersForAddToClasses';

const TreeGroupDetail = ({
  duplicateMode,
  group,
  program,
  messages,
  messagesAddUsers,
  center,
  onSave,
  saving,
  item,
  selectSubjectsNode,
}) => {
  const [disableSave, setDisabledSave] = React.useState(false);

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: group });

  React.useEffect(() => {
    reset(group);
  }, [group]);

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
          <Title order={4}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {duplicateMode ? messages.duplicateTitle : group ? messages.title : messages.titleNew}
          </Title>
          <Alert closeable={false}>{messages.duplicateWarning}</Alert>
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

          {group ? (
            <SelectUsersForAddToClasses
              onChange={onChangeAddUsers}
              disableSave={onDisableSave}
              center={center}
              messages={messagesAddUsers}
              tree={item}
            />
          ) : null}

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
            <Button disabled={disableSave} loading={saving} type="submit">
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
  duplicateMode: PropTypes.bool,
  item: PropTypes.object,
  messagesAddUsers: PropTypes.object,
  center: PropTypes.string,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeGroupDetail };
