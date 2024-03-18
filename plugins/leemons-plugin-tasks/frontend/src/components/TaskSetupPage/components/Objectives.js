import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import {
  HtmlText,
  InputWrapper,
  TableInput,
  TextInput,
  Button,
  Box,
  Text,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import useTableInputLabels from '../../../helpers/useTableInputLabels';
import { ObjectivesStyles } from './Objectives.styles';

export default function Objectives({ form, name, label, labels, required }) {
  const tableInputLabels = useTableInputLabels();
  const localForm = useFormContext();
  const [newObjective, setNewObjective] = useState('');
  const { classes } = ObjectivesStyles();

  const {
    control,
    formState: { errors },
    setValue,
  } = form ?? localForm;
  const curriculumObjectives = form.watch(name);
  const curriculumObjectivesExists =
    Array.isArray(curriculumObjectives) && curriculumObjectives.length > 0;
  const objectivesWithId = curriculumObjectivesExists
    ? curriculumObjectives?.map((objective, index) => ({
        ...objective,
        id: index + 1,
      }))
    : [];

  const addNewObjective = () => {
    const updatedObjectives = [
      ...(curriculumObjectivesExists ? curriculumObjectives : []),
      {
        id: (Array.isArray(curriculumObjectives) ? curriculumObjectives.length : 0) + 1,
        objective: newObjective,
      },
    ];
    setValue(name, updatedObjectives);
    setNewObjective('');
  };

  const columns = useMemo(
    () => [
      {
        Header: labels?.numberHeader,
        accessor: 'id',
        valueRender: (value) => <Text>{value}</Text>,
        style: { width: 80, paddingLeft: 10 },
      },
      {
        Header: labels?.objectiveHeader,
        accessor: 'objective',
        input: {
          node: <TextInput />,
          rules: { required: true },
        },
        valueRender: (value) => <HtmlText>{value}</HtmlText>,
        style: { paddingLeft: 10 },
      },
    ],
    [labels]
  );

  return (
    <InputWrapper label={label}>
      <Box className={classes.root}>
        <Controller
          name={name}
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value, ...field } }) => (
            <TextInput
              {...field}
              value={newObjective ?? ''}
              label={labels.inputLabel}
              onChange={(e) => setNewObjective(e)}
              placeholder={labels.inputPlaceholder}
              sx={() => ({ width: 360 })}
            />
          )}
        />
        <Button
          variant="link"
          size="md"
          leftIcon={<AddCircleIcon />}
          disabled={newObjective.length === 0}
          onClick={addNewObjective}
          className={classes.button}
        >
          {tableInputLabels.add}
        </Button>
      </Box>
      <Controller
        control={control}
        name={name}
        rules={{ validate: (value) => !required || value?.length > 0 }}
        render={({ field }) => (
          <Box>
            <TableInput
              {...field}
              columns={columns}
              sortable={false}
              editable={false}
              isOneInput
              resetOnAdd
              canAdd={false}
              showHeaders={objectivesWithId?.length > 0}
              error={errors.objectives && tableInputLabels.required}
              data={objectivesWithId || []}
              labels={tableInputLabels}
              actionLabel
            />
          </Box>
        )}
      />
    </InputWrapper>
  );
}

Objectives.propTypes = {
  label: PropTypes.string.isRequired,
  labels: PropTypes.object,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  form: PropTypes.any,
};
