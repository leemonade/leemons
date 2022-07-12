import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  ActionButton,
  Avatar,
  Box,
  Button,
  ContextContainer,
  InputWrapper,
  NumberInput,
  Paragraph,
  Select,
  Stack,
  Table,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import ImagePicker from '@leebrary/components/ImagePicker';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import getUserFullName from '@users/helpers/getUserFullName';
import { ScheduleInput } from '@timetable/components';
import { isValidHttpUrl, LocaleDate, useStore } from '@common';
import { filter, find, map } from 'lodash';
import { getUserAgentsInfoRequest } from '@users/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { SelectUsersForAddToClasses } from './SelectUsersForAddToClasses';

const TreeClassroomDetail = ({
  messagesAddUsers,
  classe,
  program,
  messages,
  onSave,
  saving,
  center,
  addClassUsers,
  removeUserFromClass,
  item,
  teacherSelect,
}) => {
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [store, render] = useStore({ students: [] });
  const selects = React.useMemo(
    () => ({
      knowledges: map(program.knowledges, ({ name, id }) => ({
        label: name,
        value: id,
      })),
      groups: map(program.groups, ({ name, id }) => ({
        label: name,
        value: id,
      })),

      substages: map(program.substages, ({ name, abbreviation, id }) => ({
        label: `${name}${abbreviation ? ` [${abbreviation}]` : ''}`,
        value: id,
      })),
    }),
    [program]
  );

  function classForForm() {
    const teacher = find(classe?.teachers, { type: 'main-teacher' });
    const associateTeachers = filter(classe?.teachers, { type: 'associate-teacher' });
    return {
      id: classe?.id,
      course: program.moreThanOneAcademicYear ? map(classe?.courses, 'id') : classe?.courses?.id,
      knowledge: classe?.knowledges?.id,
      substage: classe?.substages?.id,
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

  function removeUserAgent(userAgentId) {
    removeUserFromClass(userAgentId, classe.id)
      .then(() => {})
      .catch(() => {});
  }

  function filterStudents() {
    if (store.studentsFilter) {
      store.studentsFiltered = filter(
        store.students,
        (student) =>
          student.user.name?.toLowerCase().includes(store.studentsFilter.toLowerCase()) ||
          student.user.surnames?.toLowerCase().includes(store.studentsFilter.toLowerCase()) ||
          student.user.secondSurname?.toLowerCase().includes(store.studentsFilter.toLowerCase()) ||
          student.user.email?.toLowerCase().includes(store.studentsFilter.toLowerCase())
      );
    } else {
      store.studentsFiltered = store.students;
    }
  }

  async function getClassStudents() {
    const { userAgents } = await getUserAgentsInfoRequest(classe.students, {
      withCenter: true,
      withProfile: true,
    });
    store.students = map(userAgents, (userAgent) => ({
      ...userAgent,
      user: {
        ...userAgent.user,
        avatar: <Avatar image={userAgent.user.avatar} fullName={getUserFullName(userAgent.user)} />,
        birthdate: <LocaleDate date={userAgent.user.birthdate} />,
      },
      actions: (
        <Box style={{ textAlign: 'right', width: '100%' }}>
          <ActionButton
            onClick={() => removeUserAgent(userAgent.id)}
            tooltip={messages.removeUser}
            icon={<RemoveIcon />}
          />
        </Box>
      ),
    }));
    store.studentsFilter = '';
    filterStudents();
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

  React.useEffect(() => {
    if (classe) getClassStudents();
  }, [classe?.students]);

  const tableHeaders = [
    {
      Header: ' ',
      accessor: 'user.avatar',
      className: 'text-left',
    },
    {
      Header: messagesAddUsers.emailHeader,
      accessor: 'user.email',
      className: 'text-left',
    },
    {
      Header: messagesAddUsers.nameHeader,
      accessor: 'user.name',
      className: 'text-left',
    },
    {
      Header: messagesAddUsers.surnameHeader,
      accessor: 'user.surnames',
      className: 'text-left',
    },
    {
      Header: messagesAddUsers.birthdayHeader,
      accessor: 'user.birthdate',
      className: 'text-left',
    },
    {
      Header: ' ',
      accessor: 'actions',
      className: 'text-left',
    },
  ];

  function studentsFilterChange(e) {
    store.studentsFilter = e;
    filterStudents();
    render();
  }

  function toggleAddStudents() {
    store.addStudents = !store.addStudents;
    store.studentsToAdd = [];
    store.disabledSave = false;
    render();
  }

  function onChangeAddUsers(e) {
    store.studentsToAdd = e;
  }

  function onDisableSave(e) {
    store.disabledSave = e;
    render();
  }

  async function saveNewStudents() {
    addClassUsers(store.studentsToAdd, classe.id)
      .then(() => toggleAddStudents())
      .catch(() => {});
  }

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <form onSubmit={handleSubmit(onSave)} autoComplete="off">
        <ContextContainer direction="column" fullWidth>
          <Title order={4}>{messages.title}</Title>

          <Box>
            <Controller
              control={control}
              name="group"
              render={({ field }) => (
                <Select data={selects.groups} label={messages.groupLabel} {...field} />
              )}
            />
          </Box>
          {program.haveSubstagesPerCourse ? (
            <Box>
              <Controller
                control={control}
                name="substage"
                render={({ field }) => (
                  <Select data={selects.substages} label={messages.substageLabel} {...field} />
                )}
              />
            </Box>
          ) : null}
          {program.haveKnowledge ? (
            <Box>
              <Controller
                control={control}
                name="knowledge"
                render={({ field }) => (
                  <Select data={selects.knowledges} label={messages.knowledgeLabel} {...field} />
                )}
              />
            </Box>
          ) : null}
          <Box>
            <Controller
              control={control}
              name="seats"
              render={({ field }) => <NumberInput label={messages.seatsLabel} {...field} />}
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
          <Box>
            <Controller
              control={control}
              name="address"
              render={({ field }) => <TextInput label={messages.addressLabel} {...field} />}
            />
          </Box>
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
                <TextInput label={messages.virtualUrlLabel} {...field} error={errors.virtualUrl} />
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="schedule"
              render={({ field }) => <ScheduleInput label={messages.scheduleLabel} {...field} />}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="teacher"
              render={({ field }) =>
                React.cloneElement(teacherSelect, { label: messages.teacherLabel, ...field })
              }
            />
          </Box>
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
          <InputWrapper label={messages.studentsLabel}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {store.addStudents ? (
              <ContextContainer>
                <Paragraph>{messages.addStudentsDescription}</Paragraph>
                <SelectUsersForAddToClasses
                  showMessages={false}
                  onChange={onChangeAddUsers}
                  disableSave={onDisableSave}
                  center={center}
                  messages={messagesAddUsers}
                  tree={item}
                />
                <ContextContainer direction="row" fullWidth justifyContent="end">
                  <Box>
                    <Button variant="link" loading={saving} onClick={toggleAddStudents}>
                      {messages.cancelAddStudents}
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      disabled={!store.studentsToAdd.length || store.disabledSave}
                      loading={saving}
                      onClick={saveNewStudents}
                    >
                      {messages.addStudents}
                    </Button>
                  </Box>
                </ContextContainer>
              </ContextContainer>
            ) : store.students.length ? (
              <ContextContainer>
                <Stack fullWidth alignItems="center" justifyContent="space-between">
                  <Box>
                    <TextInput value={store.studentsFilter} onChange={studentsFilterChange} />
                  </Box>
                  <Button onClick={toggleAddStudents}>{messages.addStudents}</Button>
                </Stack>
                <Table columns={tableHeaders} data={store.studentsFiltered} />
              </ContextContainer>
            ) : (
              <Stack fullWidth alignItems="center" justifyContent="space-between">
                <Paragraph>{messages.noStudentsYet}</Paragraph>
                <Button onClick={toggleAddStudents}>{messages.addStudents}</Button>
              </Stack>
            )}
          </InputWrapper>
          {!store.addStudents ? (
            <Stack justifyContent="end">
              <Button loading={saving} type="submit">
                {messages.save}
              </Button>
            </Stack>
          ) : null}
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
};

// eslint-disable-next-line import/prefer-default-export
export { TreeClassroomDetail };
