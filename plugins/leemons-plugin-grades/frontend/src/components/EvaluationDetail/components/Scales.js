import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { NumberInput, TableInput, TextInput } from '@bubbles-ui/components';
import { find, forEach } from 'lodash';

const Scales = ({ messages, errorMessages, selectData, form, onBeforeRemove }) => {
  const { control, watch, getValues, setValue } = form;

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

  function onChange(newData, event, field) {
    if (event.type === 'edit') {
      const oldN = event.oldItem.number;
      const newN = event.newItem.number;
      const minScaleToPromote = getValues('minScaleToPromote');
      const tags = getValues('tags');
      if (oldN.toString() === minScaleToPromote.toString()) setValue('minScaleToPromote', newN);
      if (tags) {
        forEach(tags, (tag) => {
          // eslint-disable-next-line no-param-reassign
          if (tag.scale.toString() === oldN.toString()) tag.scale = newN;
        });
        setValue('tags', tags);
      }
    }
    field.onChange(newData);
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
          onChange={(e1, e2) => onChange(e1, e2, field)}
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
