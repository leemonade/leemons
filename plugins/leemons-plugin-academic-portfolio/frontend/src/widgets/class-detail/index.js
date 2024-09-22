import React from 'react';

import {
  Avatar,
  Box,
  ContextContainer,
  Table,
  Title,
  Stack,
  ActionButton,
} from '@bubbles-ui/components';
import { ViewOnIcon, PluginComunicaIcon } from '@bubbles-ui/icons/outline';
import { LocaleDate } from '@common';
import { useComunica } from '@comunica/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { USER_DETAIL_VIEWS } from '@users/components/UserDetail';
import { UserDetailDrawer } from '@users/components/UserDetailDrawer';
import getUserFullName from '@users/helpers/getUserFullName';
import { getSessionCenter, getSessionProfile } from '@users/session';
import { forEach } from 'lodash';
import PropTypes from 'prop-types';

import prefixPN from '@academic-portfolio/helpers/prefixPN';

function getViewMode(profile) {
  if (profile?.sysName === 'teacher') return USER_DETAIL_VIEWS.TEACHER;
  if (profile?.sysName === 'admin') return USER_DETAIL_VIEWS.ADMIN;
  return USER_DETAIL_VIEWS.STUDENT;
}

function ClassDetailWidget({ classe }) {
  const [t] = useTranslateLoader(prefixPN('classDetailWidget'));
  const center = getSessionCenter();
  const profile = getSessionProfile();

  const [openedUser, setOpenedUser] = React.useState();
  const [openedUserType, setOpenedUserType] = React.useState();

  const { openUserRoom } = useComunica();

  function handleOnClickRow(userId, sysName) {
    setOpenedUser(userId);
    setOpenedUserType(sysName);
  }

  function handleOnCloseUser() {
    setOpenedUser(null);
    setOpenedUserType(null);
  }

  // ····················································
  // RENDER

  const tableHeaders = [
    {
      Header: ' ',
      accessor: 'avatar',
      style: {
        width: 80,
      },
    },
    {
      Header: t('surnameHeader'),
      accessor: 'surnames',
      className: 'text-left',
    },
    {
      Header: t('nameHeader'),
      accessor: 'name',
      className: 'text-left',
    },
    /*
    {
      Header: t('birthdayHeader'),
      accessor: 'birthdate',
      className: 'text-left',
    },
    */
    {
      Header: t('emailHeader'),
      accessor: 'email',
      className: 'text-left',
    },
    {
      Header: '',
      accessor: 'actions',
      style: {
        width: 20,
      },
    },
  ];

  const data = React.useMemo(() => {
    const teachers = [];
    const students = [];
    forEach(classe.teachers, (teacher) => {
      teachers.push({
        userAgentId: teacher.teacher.id,
        ...teacher.teacher.user,
        type: teacher.type,

        avatar: (
          <Avatar
            image={teacher.teacher.user.avatar}
            fullName={getUserFullName(teacher.teacher.user)}
          />
        ),
        birthdate: <LocaleDate date={teacher.teacher.user.birthdate} />,
        actions: (
          <Stack>
            <ActionButton
              icon={<ViewOnIcon width={18} height={18} />}
              onClick={() => {
                handleOnClickRow(teacher.teacher.user.id, 'teacher');
              }}
            />
          </Stack>
        ),
      });
    });
    forEach(classe.students, (student) => {
      students.push({
        userAgentId: student.id,
        ...student.user,
        avatar: <Avatar image={student.user.avatar} fullName={getUserFullName(student.user)} />,
        birthdate: <LocaleDate date={student.user.birthdate} />,
        actions: (
          <Stack>
            <ActionButton
              icon={<ViewOnIcon width={18} height={18} />}
              onClick={() => {
                handleOnClickRow(student.user.id, 'student');
              }}
            />

            <ActionButton
              icon={<PluginComunicaIcon width={18} height={18} />}
              onClick={() => {
                openUserRoom(student.id);
              }}
            />
          </Stack>
        ),
      });
    });

    return { teachers, students };
  }, [classe]);

  return (
    <>
      <ContextContainer>
        <UserDetailDrawer
          opened={!!openedUser}
          center={center}
          userId={openedUser}
          onClose={handleOnCloseUser}
          sysProfileFilter={openedUserType}
          viewMode={getViewMode(profile)}
        />
        <Box>
          <Title order={4}>{t('teachers')}</Title>
          <Box
            sx={(theme) => ({
              marginTop: theme.spacing[4],
              padding: theme.spacing[6],
              backgroundColor: 'white',
              borderRadius: 4,
            })}
          >
            <Table columns={tableHeaders} data={data.teachers} />
          </Box>
        </Box>
        <Box>
          <Title order={4}>{t('students')}</Title>
          <Box
            sx={(theme) => ({
              marginTop: theme.spacing[4],
              padding: theme.spacing[6],
              backgroundColor: 'white',
              borderRadius: 4,
            })}
          >
            <Table columns={tableHeaders} data={data.students} />
          </Box>
        </Box>
      </ContextContainer>
    </>
  );
}

ClassDetailWidget.propTypes = {
  classe: PropTypes.object.isRequired,
};

export default ClassDetailWidget;
