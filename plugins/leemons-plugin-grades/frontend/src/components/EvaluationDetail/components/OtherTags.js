import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Select, TableInput, TextInput } from '@bubbles-ui/components';
import { map } from 'lodash';

const OtherTags = ({ messages, onBeforeRemove, form }) => {
  const { control, watch } = form;

  const scales = watch('scales');
  let data = [];
  if (scales) {
    data = map(scales, ({ number }) => ({
      label: number,
      value: number,
    }));
  }

  const tableInputConfig = {
    columns: [
      {
        Header: messages.scalesLetterLabel,
        accessor: 'letter',
        input: {
          node: <TextInput />,
          rules: { required: 'Required field', maxLength: 4 },
        },
      },
      {
        Header: messages.scalesDescriptionLabel,
        accessor: 'description',
        input: {
          node: <TextInput />,
          rules: { required: 'Required field' },
        },
      },
      {
        Header: messages.otherTagsRelationScaleLabel,
        accessor: 'scale',
        input: {
          node: <Select data={data} />,
          rules: { required: 'Required field' },
        },
      },
    ],
    labels: {
      add: messages.tableAdd,
      remove: messages.tableRemove,
      edit: messages.tableEdit,
      accept: messages.tableAccept,
      cancel: messages.tableCancel,
    },
  };

  return (
    <Controller
      name="tags"
      control={control}
      render={({ field }) => (
        <TableInput
          editable
          {...field}
          data={field.value}
          {...tableInputConfig}
          onBeforeRemove={onBeforeRemove}
        />
      )}
    />
  );
};

OtherTags.propTypes = {
  messages: PropTypes.object.isRequired,
  errorMessages: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  onBeforeRemove: PropTypes.func,
};

export { OtherTags };
