import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ScheduleInput } from '@timetable/components';
import { Box, ColorInput, NumberInput, Select, TableInput, Title } from '@bubbles-ui/components';
import { map } from 'lodash';

function SubjectsTable({ messages, program, tableLabels, onAdd = () => {} }) {
  const selects = useMemo(
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
      subjectTypes: map(program.subjectTypes, ({ name, id }) => ({
        label: name,
        value: id,
      })),
      substages: map(program.substages, ({ name, abbreviation, id }) => ({
        label: `${name}${abbreviation ? ` [${abbreviation}]` : ''}`,
        value: id,
      })),
      subjects: map(program.subjects, ({ name, id }) => ({ label: name, value: id })),
    }),
    [program]
  );

  const columns = [];

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
    Header: messages.subject,
    accessor: 'subject',
    input: {
      node: <Select data={selects.subjects} required />,
      rules: { required: messages.subjectRequired },
    },
    valueRender: (value) => <>{value?.name}</>,
  });

  columns.push({
    Header: messages.knowledge,
    accessor: 'knowledges',
    input: {
      node: <Select data={selects.knowledges} required />,
      rules: { required: messages.knowledgeRequired },
    },
    valueRender: (value) => <>{value?.name}</>,
  });

  columns.push({
    Header: messages.subjectType,
    accessor: 'subjectType',
    input: {
      node: <Select data={selects.subjectTypes} required />,
      rules: { required: messages.subjectTypeRequired },
    },
    valueRender: (value) => <>{value?.name}</>,
  });

  columns.push({
    Header: messages.credits,
    accessor: 'credits',
    input: {
      node: <NumberInput data={selects.subjectTypes} required />,
      rules: { required: messages.subjectTypeRequired },
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

  columns.push({
    Header: messages.group,
    accessor: 'group',
    input: {
      node: <Select data={selects.groups} />,
    },
    valueRender: (value) => <>{value?.name}</>,
  });

  columns.push({
    Header: messages.substage,
    accessor: 'substages',
    input: {
      node: <Select data={selects.substages} />,
    },
    valueRender: (value) => <>{value?.name}</>,
  });

  columns.push({
    Header: messages.seats,
    accessor: 'seats',
    input: {
      node: <NumberInput />,
    },
  });

  columns.push({
    Header: messages.schedule,
    accessor: 'schedule',
    input: {
      node: <ScheduleInput label={false} />,
    },
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
