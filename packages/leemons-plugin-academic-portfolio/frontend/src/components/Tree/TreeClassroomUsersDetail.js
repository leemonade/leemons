import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Avatar,
  Box,
  Button,
  ContextContainer,
  Pager,
  Paragraph,
  Stack,
  Table,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import {SearchIcon} from '@bubbles-ui/icons/outline';
import {DeleteBinIcon} from '@bubbles-ui/icons/solid';
import getUserFullName from '@users/helpers/getUserFullName';
import {LocaleDate, useStore} from '@common';
import {filter, map, sortBy} from 'lodash';
import {getUserAgentsInfoRequest} from '@users/request';
import {SelectUsersForAddToClasses} from './SelectUsersForAddToClasses';

const TreeClassroomUsersDetail = ({
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
  const [store, render] = useStore({pagination: {size: 10}, students: [], studentsToAdd: []});

  function removeUserAgent(userAgentId) {
    removeUserFromClass(userAgentId, classe.id)
      .then(() => {
      })
      .catch(() => {
      });
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
    const init = store.pagination.page * store.pagination.size;
    const end = init + store.pagination.size;
    store.pagination.totalPages = Math.ceil(store.studentsFiltered.length / store.pagination.size);
    store.studentsFiltered = store.studentsFiltered.slice(init, end);
  }

  async function getClassStudents() {
    const {userAgents} = await getUserAgentsInfoRequest(classe.students, {
      withCenter: true,
      withProfile: true,
    });
    store.students = sortBy(map(userAgents, (userAgent) => ({
      ...userAgent,
      user: {
        ...userAgent.user,
        avatar: <Avatar image={userAgent.user.avatar} fullName={getUserFullName(userAgent.user)}/>,
        birthdate: <LocaleDate date={userAgent.user.birthdate}/>,
      },
      actions: (
        <Box style={{textAlign: 'right', width: '100%'}}>
          <ActionButton
            onClick={() => removeUserAgent(userAgent.id)}
            tooltip={messages.removeUser}
            icon={<DeleteBinIcon/>}
          />
        </Box>
      ),
    })), ['user.surnames', 'user.name', 'user.email']);
    store.pagination.page = 0;
    store.pagination.totalPages = Math.ceil(store.students.length / store.pagination.size);
    store.studentsFilter = '';
    filterStudents();
    render();
  }

  React.useEffect(() => {
    if (classe) getClassStudents();
  }, [classe?.students]);

  const tableColumns = [
    {
      Header: ' ',
      accessor: 'user.avatar',
      className: 'text-left',
    },
    {
      Header: messagesAddUsers.surnameHeader,
      accessor: 'user.surnames',
      className: 'text-left',
    },
    {
      Header: messagesAddUsers.nameHeader,
      accessor: 'user.name',
      className: 'text-left',
    },
    {
      Header: messagesAddUsers.emailHeader,
      accessor: 'user.email',
      className: 'text-left',
      valueRender: (value) => (
            <Box style={{ wordWrap: 'break-word'}}>
              {value}
            </Box>
          ),
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
    store.pagination.page = 0;
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

  function onPageChange(page) {
    store.pagination.page = page;
    filterStudents();
    render();
  }

  async function saveNewStudents() {
    addClassUsers(store.studentsToAdd, classe.id)
      .then(() => {
        toggleAddStudents();
        store.reset = true;
        render();
        setTimeout(() => {
          store.reset = false;
          render();
        }, 50);
      })
      .catch(() => {
      });
  }

  return (
    <Box sx={(theme) => ({marginTop: theme.spacing[4]})}>
      <ContextContainer fullWidth>
        <ContextContainer>
          <Title order={4}>{messages.enrollStudents}</Title>
          {!store.reset ? (
            <SelectUsersForAddToClasses
              showMessages={false}
              radioMode={true}
              onChange={onChangeAddUsers}
              disableSave={onDisableSave}
              center={center}
              messages={messagesAddUsers}
              tree={item}
            />
          ) : null}

          <Stack fullWidth alignItems="end" justifyContent="end">
            <Button
              variant="outline"
              disabled={!store.studentsToAdd.length || store.disabledSave}
              loading={saving}
              onClick={saveNewStudents}
            >
              {messages.enrollStudents}
            </Button>
          </Stack>
        </ContextContainer>
        {store.students.length ? (
          <ContextContainer>
            <Title order={4}>{messages.currentlyEnrolled} ({store.students?.length})</Title>
            <TextInput
              rightSection={<SearchIcon/>}
              value={store.studentsFilter}
              onChange={studentsFilterChange}
            />
            <Table columns={tableColumns} data={store.studentsFiltered}/>
            <Stack fullWidth justifyContent="center">
              <Pager
                page={store.pagination?.page || 0}
                totalPages={store.pagination?.totalPages || 0}
                withSize={false}
                onChange={(val) => onPageChange(val - 1)}
                labels={{
                  show: messages.show,
                  goTo: messages.goTo,
                }}
              />
            </Stack>
          </ContextContainer>
        ) : (
          <Stack fullWidth alignItems="center" justifyContent="space-between">
            <Paragraph>{messages.noStudentsYet}</Paragraph>
            <Button onClick={toggleAddStudents}>{messages.addStudents}</Button>
          </Stack>
        )}
      </ContextContainer>
    </Box>
  );
};

TreeClassroomUsersDetail.propTypes = {
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
export {TreeClassroomUsersDetail};
