import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  ActionButton,
  Avatar,
  Box,
  Button,
  ColorInput,
  ContextContainer,
  MultiSelect,
  NumberInput,
  Select,
  Table,
  Title,
} from '@bubbles-ui/components';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import getUserFullName from '@users/helpers/getUserFullName';
import { ScheduleInput } from '@timetable/components';
import { LocaleDate, useStore } from '@common';
import { find, findIndex, map } from 'lodash';
import { getUserAgentsInfoRequest } from '@users/request';
import { addErrorAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { removeStudentFromClassRequest } from '../../request';

const TreeClassroomDetail = ({
  messagesAddUsers,
  classe,
  program,
  messages,
  onSave,
  saving,
  teacherSelect,
}) => {
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [store, render] = useStore({ students: [] });
  const selects = React.useMemo(
    () => ({
      courses: map(program.courses, ({ name, index, id }) => ({
        label: `${name ? `${name} (${index}º)` : `${index}º`}`,
        value: id,
      })),
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
    return {
      id: classe?.id,
      course: program.moreThanOneAcademicYear ? map(classe?.courses, 'id') : classe?.courses?.id,
      knowledge: classe?.knowledges?.id,
      substage: classe?.substages?.id,
      group: classe?.groups?.id,
      color: classe?.color,
      seats: classe?.seats,
      schedule: classe?.schedule ? { days: classe.schedule } : { days: [] },
      teacher: teacher ? teacher.teacher : null,
    };
  }

  async function removeUserAgent(userAgentId) {
    try {
      await removeStudentFromClassRequest(classe.id, userAgentId);
      const index = findIndex(store.students, { id: userAgentId });
      if (index !== -1) store.students.splice(index, 1);
      render();
    } catch (error) {
      addErrorAlert(getErrorMessage(error));
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
    getClassStudents();
  }, [classe.students]);

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

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <form onSubmit={handleSubmit(onSave)}>
        <ContextContainer direction="column" fullWidth>
          <Title order={4}>{messages.title}</Title>
          {program.maxNumberOfCourses > 0 ? (
            <Box>
              <Controller
                control={control}
                name="course"
                render={({ field }) => {
                  if (program.moreThanOneAcademicYear) {
                    return (
                      <MultiSelect data={selects.courses} label={messages.courseLabel} {...field} />
                    );
                  }
                  return <Select data={selects.courses} label={messages.courseLabel} {...field} />;
                }}
              />
            </Box>
          ) : null}

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
              name="color"
              render={({ field }) => <ColorInput label={messages.colorLabel} {...field} />}
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

          {store.students.length ? <Table columns={tableHeaders} data={store.students} /> : null}

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

TreeClassroomDetail.propTypes = {
  classe: PropTypes.object,
  messages: PropTypes.object,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
  program: PropTypes.object,
  teacherSelect: PropTypes.any,
  messagesAddUsers: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export { TreeClassroomDetail };
