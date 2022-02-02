import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { NumberInput, TableInput, TextInput } from '@bubbles-ui/components';
import { find } from 'lodash';

const Scales = ({ messages, errorMessages, selectData, form, onBeforeRemove }) => {
  const { control, watch, getValues } = form;

  const type = find(selectData.type, { value: watch('type') });
  const isPercentage = watch('isPercentage');
  const tableConfig = {
    numberHeader: '',
    numberStep: null,
    numberPrecision: null,
    addLetterColumn: false,
  };
  if (type) {
    if (type.value === 'numeric') {
      tableConfig.numberHeader = !isPercentage
        ? messages.scalesNumberLabel
        : messages.scalesPercentageLabel;
      tableConfig.numberStep = isPercentage ? 0.05 : 0.0005;
      tableConfig.numberPrecision = isPercentage ? 2 : 4;
    }
    if (type.value === 'letter') {
      tableConfig.numberHeader = messages.scalesNumericalEquivalentLabel;
      tableConfig.numberStep = 0.0005;
      tableConfig.numberPrecision = 4;
      tableConfig.addLetterColumn = true;
    }
  }

  const tableInputConfig = {
    columns: [],
    labels: {
      add: messages.tableAdd,
      remove: messages.tableRemove,
      edit: messages.tableEdit,
      accept: messages.tableAccept,
      cancel: messages.tableCancel,
    },
  };

  if (tableConfig.addLetterColumn) {
    tableInputConfig.columns.push({
      Header: messages.scalesLetterLabel,
      accessor: 'letter',
      input: {
        node: <TextInput />,
        rules: { required: 'Required field', maxLength: 2 },
      },
    });
  }

  tableInputConfig.columns.push({
    Header: tableConfig.numberHeader,
    accessor: 'number',
    input: {
      node: <NumberInput step={tableConfig.numberStep} precision={tableConfig.numberPrecision} />,
      rules: { required: 'Required field', max: isPercentage ? 100 : undefined },
    },
  });

  tableInputConfig.columns.push({
    Header: messages.scalesDescriptionLabel,
    accessor: 'description',
    input: {
      node: <TextInput />,
      rules: { required: 'Required field' },
    },
  });

  function _onBeforeRemove(e) {
    return onBeforeRemove(e, getValues());
  }

  return (
    <Controller
      name="scales"
      control={control}
      rules={{
        required: errorMessages.typeRequired,
      }}
      render={({ field }) => (
        <TableInput
          editable
          {...field}
          data={field.value}
          onBeforeRemove={_onBeforeRemove}
          {...tableInputConfig}
        />
      )}
    />
  );
};

Scales.propTypes = {
  messages: PropTypes.object.isRequired,
  errorMessages: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  selectData: PropTypes.object.isRequired,
  onBeforeRemove: PropTypes.func,
};

export { Scales };
