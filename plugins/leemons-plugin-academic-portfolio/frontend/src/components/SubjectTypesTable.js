import { Box, NumberInput, Switch, TableInput, TextInput, Title } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const SwitchInput = forwardRef(({ label, value, ...props }, ref) => (
  <Switch {...props} ref={ref} checked={!!value} label={label} />
));

SwitchInput.displayName = '@academic-portfolio/components/SwitchInput';
SwitchInput.propTypes = {
  value: PropTypes.bool,
  label: PropTypes.string,
};

function SubjectTypesTable({
  messages,
  program,
  tableLabels,
  updateVisibility = () => {},
  onAdd = () => {},
}) {
  const columns = [];
  columns.push({
    Header: messages.name,
    accessor: 'name',
    input: {
      node: <TextInput required />,
      rules: { required: messages.nameRequired },
    },
  });
  if (program.credits) {
    columns.push({
      Header: messages.creditsCourse,
      accessor: 'credits_course',
      input: {
        node: <NumberInput />,
      },
    });
    columns.push({
      Header: messages.creditsProgram,
      accessor: 'credits_program',
      input: {
        node: <NumberInput />,
      },
    });
  }

  columns.push({
    Header: messages.groupVisibility,
    accessor: 'groupVisibility',
    input: {
      node: <SwitchInput label={messages.groupVisibilityLabel} />,
    },
    valueRender: (value, form) => (
      <SwitchInput
        label={messages.groupVisibilityLabel}
        value={!!value}
        onChange={(e) => updateVisibility({ id: form.id, groupVisibility: e })}
      />
    ),
  });

  function onChange(items) {
    const item = items[items.length - 1];
    onAdd({
      ...item,
      groupVisibility: !!item.groupVisibility,
    });
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
  updateVisibility: PropTypes.func,
  program: PropTypes.any,
  tableLabels: PropTypes.object,
};

export { SubjectTypesTable };
export default SubjectTypesTable;
