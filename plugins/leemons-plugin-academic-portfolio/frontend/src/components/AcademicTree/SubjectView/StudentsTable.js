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

        valueRender: (avatar) => <Avatar image={avatar} />,
      },
      {
        Header: 'Apellidos 🔫',
        accessor: 'surnames',
      },
      {
        Header: 'Nombre 🔫',
        accessor: 'name',
      },
      {
        Header: 'Email 🔫',
        accessor: 'email',
      },
      {
        Header: 'Fecha de Nacimiento 🔫',
        accessor: 'birthdate',

        valueRender: (birthdate) => <LocaleDate date={birthdate} />,
      },
      {
        Header: ' ',
        accessor: 'actions',
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
