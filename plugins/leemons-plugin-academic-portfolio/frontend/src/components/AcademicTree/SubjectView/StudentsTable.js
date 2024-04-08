import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table, Avatar, Stack } from '@bubbles-ui/components';
import { LocaleDate } from '@common';

// Data should contain actions ;)
const StudentsTable = ({ data, showSearchBar }) => {
  // translations here

  const tableColumns = useMemo(
    () => [
      {
        Header: ' ',
        accessor: 'avatar',
        className: 'text-left',
        valueRender: (avatar) => <Avatar image={avatar} />,
      },
      {
        Header: 'Apellidos 🔫',
        accessor: 'surnames',
        className: 'text-left',
      },
      {
        Header: 'Nombre 🔫',
        accessor: 'name',
        className: 'text-left',
      },
      {
        Header: 'Email 🔫',
        accessor: 'email',
        className: 'text-left',
      },
      {
        Header: 'Fecha de Nacimiento 🔫',
        accessor: 'birthdate',
        className: 'text-left',
        valueRender: (birthdate) => <LocaleDate date={birthdate} />,
      },
      {
        Header: ' ',
        accessor: 'actions',
        className: 'text-left',
      },
    ],
    [] // translations here
  );
  return (
    <Stack direction="column" spacing={4}>
      {showSearchBar && <div>SEARCH BAR HERE!!!!! .-- - -- - -- - - -- - -</div>}
      <Table columns={tableColumns} data={data} />
    </Stack>
  );
};

export default StudentsTable;

StudentsTable.propTypes = {
  data: PropTypes.array.isRequired,
  showSearchBar: PropTypes.bool,
};
