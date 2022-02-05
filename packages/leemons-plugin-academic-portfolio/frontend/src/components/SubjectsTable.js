import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, ColorInput, Select, TableInput, Title } from '@bubbles-ui/components';
import { map } from 'lodash';

function SubjectsTable({ messages, program, tableLabels, onAdd = () => {} }) {
  const selects = useMemo(
    () => ({
      courses: map(program.courses, ({ name, index, id }) => ({
        label: `${name ? `${name} (${index}º)` : `${index}º`}`,
        value: id,
      })),
      subjects: map(program.subjects, ({ name, id }) => ({ label: name, value: id })),
    }),
    [program]
  );

  const columns = [];

  columns.push({
    Header: messages.subject,
    accessor: 'subject',
    input: {
      node: <Select data={selects.subjects} required />,
      rules: { required: messages.subjectRequired },
    },
    valueRender: (value) => <>{value?.name}</>,
  });

  columns.push({
    Header: messages.course,
    accessor: 'course',
    input: {
      node: <Select data={selects.courses} required />,
      rules: { required: messages.courseRequired },
    },
    valueRender: (value) => <>{value?.name}</>,
  });

  columns.push({
    Header: messages.color,
    accessor: 'color',
    input: {
      node: <ColorInput required />,
      rules: { required: messages.colorRequired },
    },
    valueRender: (val) => (
      <>
        <Box
          sx={(theme) => ({ marginRight: theme.spacing[2] })}
          style={{ background: val, width: '18px', height: '18px', borderRadius: '50%' }}
        />
        {val}
      </>
    ),
  });

  function onChange(items) {
    onAdd(items[items.length - 1]);
  }

  return (
    <Box>
      <Title order={4}>{messages.title}</Title>
      <TableInput
        data={program.classes}
        onChange={onChange}
        columns={columns}
        sortable={false}
        removable={false}
        labels={tableLabels}
      />
    </Box>
  );
}

SubjectsTable.propTypes = {
  messages: PropTypes.object,
  onAdd: PropTypes.func,
  program: PropTypes.any,
  tableLabels: PropTypes.object,
};

export { SubjectsTable };
