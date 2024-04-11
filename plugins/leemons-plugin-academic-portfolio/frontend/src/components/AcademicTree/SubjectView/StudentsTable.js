import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Table, Avatar, Stack } from '@bubbles-ui/components';

import { LocaleDate } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import prefixPN from '@academic-portfolio/helpers/prefixPN';

// Data should contain actions ;)
const StudentsTable = ({ data, showSearchBar, checkBoxColumn }) => {
  const [t] = useTranslateLoader(prefixPN('tree_page.studentsTable'));

  const tableColumns = useMemo(() => {
    let columns = [
      {
        Header: ' ',
        accessor: 'avatar',
        valueRender: (avatar) => <Avatar image={avatar} />,
      },
      {
        Header: t('surnames'),
        accessor: 'surnames',
      },
      {
        Header: t('name'),
        accessor: 'name',
      },
      {
        Header: t('email'),
        accessor: 'email',
      },
      {
        Header: t('birthdate'),
        accessor: 'birthdate',

        valueRender: (birthdate) => <LocaleDate date={birthdate} />,
      },
      {
        Header: ' ',
        accessor: 'actions',
      },
    ];
    if (!isEmpty(checkBoxColumn)) {
      columns = [checkBoxColumn, ...columns];
    }
    return columns;
  }, [checkBoxColumn, t]);

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
  checkBoxColumn: PropTypes.object,
};
