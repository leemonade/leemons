import React from 'react';
import PropTypes from 'prop-types';
import { Box, ColorInput, NumberInput, TableInput, TextInput, Title } from '@bubbles-ui/components';
import { regex } from '@common';

function KnowledgeTable({ messages, program, tableLabels, onAdd = () => {} }) {
  const abbrRules = {
    required: messages.abbreviationRequired,
    maxLength: {
      value: program.maxKnowledgeAbbreviation,
      message: messages.maxLength.replace('{max}', program.maxKnowledgeAbbreviation),
    },
  };

  if (program.maxKnowledgeAbbreviationIsOnlyNumbers) {
    abbrRules.pattern = {
      value: regex.numbers,
      message: messages.onlyNumbers,
    };
  }

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
      Header: messages.abbreviation,
      accessor: 'abbreviation',
      input: {
        node: <TextInput required />,
        rules: {
          ...abbrRules,
        },
      },
    },
    {
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
  ];

  function onChange(items) {
    onAdd(items[items.length - 1]);
  }

  return (
    <Box>
      <Title order={4}>{messages.title}</Title>
      <TableInput
        data={program.knowledges}
        onChange={onChange}
        columns={columns}
        sortable={false}
        removable={false}
        labels={tableLabels}
      />
    </Box>
  );
}

KnowledgeTable.propTypes = {
  messages: PropTypes.object,
  onAdd: PropTypes.func,
  program: PropTypes.any,
  tableLabels: PropTypes.object,
};

export { KnowledgeTable };
