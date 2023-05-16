import {
  Box,
  Button,
  ContextContainer,
  InputWrapper,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { DeleteBinIcon } from '@bubbles-ui/icons/outline';
import { isValidHttpUrl, useStore } from '@common';
import ImagePicker from '@leebrary/components/ImagePicker';
import { ScheduleInput } from '@timetable/components';
import { filter, find, map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

const TreeClassroomDetail = ({
  messagesAddUsers,
  classe,
  program,
  messages,
  onSave,
  saving,
  removing,
  onRemoveClass,
  center,
  addClassUsers,
  removeUserFromClass,
  item,
  createMode,
  teacherSelect,
}) => {
  const [store, render] = useStore({ students: [], tempGroups: [] });
  const selects = React.useMemo(
    () => ({
      knowledges: map(program.knowledges, ({ name, id }) => ({
        label: name,
        value: id,
      })),
      groups: map(program.groups, ({ name, id }) => ({
        label: name,
        value: id,
      })).concat(store.tempGroups),

      substages: map(program.substages, ({ name, abbreviation, id }) => ({
        label: `${name}${abbreviation ? ` [${abbreviation}]` : ''}`,
        value: id,
      })),
    }),
    [program, store.tempGroups]
  );

  function classForForm() {
    const teacher = find(classe?.teachers, { type: 'main-teacher' });
    const associateTeachers = filter(classe?.teachers, { type: 'associate-teacher' });
    return {
      id: classe?.id,
      course: program.moreThanOneAcademicYear ? map(classe?.courses, 'id') : classe?.courses?.id,
      knowledge: classe?.knowledges?.id,
      substage: map(classe?.substages, 'id'),
      group: classe?.groups?.id,
      color: classe?.color,
      seats: classe?.seats,
      address: classe?.address,
      virtualUrl: classe?.virtualUrl,
      schedule: classe?.schedule ? { days: classe.schedule } : { days: [] },
      teacher: teacher ? teacher.teacher : null,
      associateTeachers: associateTeachers ? map(associateTeachers, 'teacher') : null,
    };
  }

  function onCreateGroup(event) {
    store.tempGroups = [
      ...store.tempGroups,
      {
        label: event,
        value: event,
      },
    ];
    render();
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: classForForm() });

  React.useEffect(() => {
    reset(classForForm());
  }, [classe]);

  function beforeSave(data) {
    const tempGroupsValues = map(store.tempGroups, 'value');
    const isNewGroup = tempGroupsValues.indexOf(data.group) >= 0;
    onSave({ ...data, isNewGroup });
  }

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <form onSubmit={handleSubmit(beforeSave)} autoComplete="off">
        <ContextContainer direction="column" fullWidth>
          <Title order={4}>{messages.title}</Title>

          <Stack spacing={4} fullWidth>
            {!program.useOneStudentGroup && (
              <Box>
                <Controller
                  control={control}
                  name="group"
                  rules={{
                    pattern: {
                      message: (program.maxGroupAbbreviationIsOnlyNumbers
                        ? messages.groupNumbers
                        : messages.groupAny
                      ).replace('{max}', program.maxGroupAbbreviation),
                      value: new RegExp(
                        `^(${program.maxGroupAbbreviationIsOnlyNumbers ? '[0-9]' : `\\S`}{${
                          program.maxGroupAbbreviation
                        }}|.{36})$`,
                        'g'
                      ),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      data={selects.groups}
                      label={messages.groupLabel}
                      searchable
                      onCreate={onCreateGroup}
                      creatable={true}
                      error={errors.group}
                      getCreateLabel={(value) => `+ ${value}`}
                      {...field}
                    />
                  )}
                />
              </Box>
            )}
            <Box>
              <Controller
                control={control}
                name="seats"
                render={({ field }) => <NumberInput label={messages.seatsLabel} {...field} />}
              />
            </Box>
          </Stack>

          {program.haveKnowledge || program.haveSubstagesPerCourse ? (
            <Stack spacing={4} fullWidth>
              {program.haveKnowledge ? (
                <Box>
                  <Controller
                    control={control}
                    name="knowledge"
                    render={({ field }) => (
                      <Select
                        data={selects.knowledges}
                        label={messages.knowledgeLabel}
                        {...field}
                      />
                    )}
                  />
                </Box>
              ) : null}
              {program.haveSubstagesPerCourse ? (
                <Box>
                  <Controller
                    control={control}
                    name="substage"
                    render={({ field }) => (
                      <MultiSelect
                        data={selects.substages}
                        label={messages.substageLabel}
                        {...field}
                      />
                    )}
                  />
                </Box>
              ) : null}
            </Stack>
          ) : null}

          <Stack spacing={4} fullWidth>
            <Box>
              <Controller
                control={control}
                name="teacher"
                render={({ field }) =>
                  React.cloneElement(teacherSelect, { label: messages.teacherLabel, ...field })
                }
              />
            </Box>
          </Stack>

          <Box>
            <Controller
              control={control}
              name="associateTeachers"
              render={({ field }) =>
                React.cloneElement(teacherSelect, {
                  label: messages.associateTeachersLabel,
                  maxSelectedValues: 999,
                  ...field,
                })
              }
            />
          </Box>

          <Box>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <InputWrapper label={messages.imageLabel}>
                  <ImagePicker {...field} />
                </InputWrapper>
              )}
            />
          </Box>

          <Stack spacing={4} fullWidth>
            <Box>
              <Controller
                control={control}
                rules={{
                  validate: (value) => {
                    if (value) {
                      return isValidHttpUrl(value) ? true : messages.notValidUrl;
                    }
                    return true;
                  },
                }}
                name="virtualUrl"
                render={({ field }) => (
                  <TextInput
                    label={messages.virtualUrlLabel}
                    {...field}
                    error={errors.virtualUrl}
                  />
                )}
              />
            </Box>
            <Box>
              <Controller
                control={control}
                name="address"
                render={({ field }) => <TextInput label={messages.addressLabel} {...field} />}
              />
            </Box>
          </Stack>

          <Box>
            <Controller
              control={control}
              name="schedule"
              render={({ field }) => <ScheduleInput label={messages.scheduleLabel} {...field} />}
            />
          </Box>

          <Stack fullWidth justifyContent="space-between">
            <Button
              leftIcon={createMode ? null : <DeleteBinIcon />}
              variant="outline"
              loading={removing}
              onClick={() => onRemoveClass(classe?.id)}
            >
              {createMode ? messages.cancelClassroomButton : messages.removeClassroom}
            </Button>
            <Button loading={saving} type="submit">
              {messages.saveChanges}
            </Button>
          </Stack>
        </ContextContainer>
      </form>
    </Box>
  );
};

TreeClassroomDetail.propTypes = {
  classe: PropTypes.object,
  messages: PropTypes.object,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
  program: PropTypes.object,
  center: PropTypes.string,
  teacherSelect: PropTypes.any,
  item: PropTypes.object,
  addClassUsers: PropTypes.func,
  messagesAddUsers: PropTypes.object,
  removeUserFromClass: PropTypes.func,
  removing: PropTypes.bool,
  onRemoveClass: PropTypes.func,
  createMode: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeClassroomDetail };
