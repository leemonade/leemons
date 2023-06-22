/* eslint-disable no-nested-ternary */
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { Avatar, Box, ContextContainer, Table, Title } from '@bubbles-ui/components';
import { LocaleDate } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import UserDetailModal from '@users/components/UserDetailModal';
import getUserFullName from '@users/helpers/getUserFullName';
import { forEach } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

function ClassDetailWidget({ classe }) {
  const [t] = useTranslateLoader(prefixPN('classDetailWidget'));

  const tableHeaders = [
    {
      Header: ' ',
      accessor: 'avatar',
      className: 'text-left',
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
    {
      Header: t('birthdayHeader'),
      accessor: 'birthdate',
      className: 'text-left',
    },
    {
      Header: t('emailHeader'),
      accessor: 'email',
      className: 'text-left',
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
      });
    });
    forEach(classe.students, (student) => {
      students.push({
        userAgentId: student.id,
        ...student.user,
        avatar: <Avatar image={student.user.avatar} fullName={getUserFullName(student.user)} />,
        birthdate: <LocaleDate date={student.user.birthdate} />,
      });
    });

    return { teachers, students };
  }, [classe]);

  const [openedStudent, setOpenedStudent] = React.useState();

  function onClickRow(row) {
    setOpenedStudent(row.original.userAgentId);
  }

  function closeStudent() {
    setOpenedStudent(null);
  }

  return (
    <ContextContainer>
      <UserDetailModal opened={!!openedStudent} userAgent={openedStudent} onClose={closeStudent} />
      <Box>
        <Title order={4}>{t('teachers')}</Title>
        <Table
          onClickRow={onClickRow}
          styleRow={{ cursor: 'pointer' }}
          columns={tableHeaders}
          data={data.teachers}
        />
      </Box>
      <Box>
        <Title order={4}>{t('students')}</Title>
        <Table
          onClickRow={onClickRow}
          styleRow={{ cursor: 'pointer' }}
          columns={tableHeaders}
          data={data.students}
        />
      </Box>
    </ContextContainer>
  );
}

ClassDetailWidget.propTypes = {
  classe: PropTypes.object.isRequired,
};

export default ClassDetailWidget;
