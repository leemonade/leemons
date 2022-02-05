import React from 'react';
import PropTypes from 'prop-types';
import { Box, NumberInput, Switch, TableInput, TextInput, Title } from '@bubbles-ui/components';

function SwitchInput({ label, value, ...props }) {
  return <Switch {...props} checked={!!value} label={label} />;
}

SwitchInput.propTypes = {
  value: PropTypes.bool,
  label: PropTypes.string,
};

function SubjectTypesTable({ messages, program, tableLabels, onAdd = () => {} }) {
  const columns = [
    {
      Header: messages.name,
      accessor: 'name',
      input: {
        node: <TextInput required />,
        rules: { required: messages.nameRequired },
      },
    },
    {
      Header: messages.creditsCourse,
      accessor: 'credits_course',
      input: {
        node: <NumberInput />,
      },
    },
    {
      Header: messages.creditsProgram,
      accessor: 'credits_program',
      input: {
        node: <NumberInput />,
      },
    },
    {
      Header: messages.groupVisibility,
      accessor: 'groupVisibility',
      input: {
        node: <SwitchInput label={messages.groupVisibilityLabel} />,
      },
      valueRender: (value) => (
        <SwitchInput label={messages.groupVisibilityLabel} checked={!!value} />
      ),
    },
  ];

  function onChange(items) {
    onAdd(items[items.length - 1]);
  }

  return (
    <Box>
      <Title order={4}>{messages.title}</Title>
      <TableInput
        data={program.subjectTypes}
        onChange={onChange}
        columns={columns}
        sortable={false}
        removable={false}
        labels={tableLabels}
      />
    </Box>
  );
}

SubjectTypesTable.propTypes = {
  messages: PropTypes.object,
  onAdd: PropTypes.func,
  program: PropTypes.any,
  tableLabels: PropTypes.object,
};

export { SubjectTypesTable };
