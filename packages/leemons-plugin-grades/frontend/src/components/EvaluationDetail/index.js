import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ContextContainer,
  NumberInput,
  RadioGroup,
  Switch,
  TableInput,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { find } from 'lodash';
import { EvaluationDetailStyles } from './styles';

export const EVALUATION_DETAIL_FORM_MESSAGES = {
  nameLabel: 'Name',
  saveButtonLabel: 'Save',
  typeLabel: 'Choose type of grade scale:',
  percentagesLabel: 'Using percentages instead of numbers',
  scalesNumberLabel: 'Number',
  scalesDescriptionLabel: 'Description',
  scalesPercentageLabel: '% Percentage',
  tableAdd: 'Add',
  tableRemove: 'Remove',
  tableEdit: 'Edit',
  tableAccept: 'Accept',
  tableCancel: 'Cancel',
};

export const EVALUATION_DETAIL_FORM_ERROR_MESSAGES = {
  nameRequired: 'Field required',
  typeRequired: 'Field required',
};

const EvaluationDetail = ({ messages, errorMessages, selectData, defaultValues, onSubmit }) => {
  const { classes, cx } = EvaluationDetailStyles({});

  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const type = find(selectData.type, { value: watch('type') });
  const isPercentage = watch('isPercentage');

  const tableInputConfig = {
    columns: [
      {
        Header:
          type && type.value === 'numeric' && !isPercentage
            ? messages.scalesNumberLabel
            : messages.scalesPercentageLabel,
        accessor: 'number',
        input: {
          node: (
            <NumberInput step={isPercentage ? 0.05 : 0.0005} precision={isPercentage ? 2 : 4} />
          ),
          rules: { required: 'Required field', max: isPercentage ? 100 : undefined },
        },
      },
      {
        Header: messages.scalesDescriptionLabel,
        accessor: 'name',
        input: {
          node: <TextInput />,
          rules: { required: 'Required field' },
        },
      },
    ],
    labels: {
      add: 'Add',
      remove: 'Remove',
      edit: 'Edit',
      accept: 'Accept',
      cancel: 'Cancel',
    },
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContextContainer>
        <Box>
          <Controller
            name="name"
            control={control}
            rules={{
              required: errorMessages.nameRequired,
            }}
            render={({ field }) => (
              <TextInput
                label={messages.nameLabel}
                placeholder={messages.namePlaceholder}
                error={errors.name}
                required
                {...field}
              />
            )}
          />
        </Box>
        <Box>
          <Controller
            name="type"
            control={control}
            rules={{
              required: errorMessages.typeRequired,
            }}
            render={({ field }) => (
              <RadioGroup
                label={messages.typeLabel}
                data={selectData.type}
                error={errors.type}
                required
                {...field}
              />
            )}
          />
        </Box>
        {type ? (
          <>
            <Box>
              <Title order={4}>{type.label}</Title>
            </Box>
            {type.value === 'numeric' ? (
              <Box>
                <Controller
                  name="isPercentage"
                  control={control}
                  rules={{
                    required: errorMessages.typeRequired,
                  }}
                  render={({ field }) => (
                    <Switch
                      label={messages.percentagesLabel}
                      error={errors.isPercentage}
                      required
                      {...field}
                    />
                  )}
                />
              </Box>
            ) : null}
            <Box>
              <Controller
                name="scales"
                control={control}
                rules={{
                  required: errorMessages.typeRequired,
                }}
                render={({ field }) => (
                  <TableInput editable {...field} data={field.value} {...tableInputConfig} />
                )}
              />
            </Box>
          </>
        ) : null}

        <Box>
          <Button>{messages.saveButtonLabel}</Button>
        </Box>
      </ContextContainer>
    </form>
  );
};

EvaluationDetail.defaultProps = {
  messages: EVALUATION_DETAIL_FORM_MESSAGES,
  errorMessages: EVALUATION_DETAIL_FORM_ERROR_MESSAGES,
  onSubmit: () => {},
  selectData: {
    type: [
      { label: 'Numeric', value: 'numeric' },
      { label: 'Letter', value: 'letter' },
    ],
  },
};

EvaluationDetail.propTypes = {
  loading: PropTypes.bool,
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  onSubmit: PropTypes.func,
  defaultValues: PropTypes.object,
  selectData: PropTypes.object,
};

export { EvaluationDetail };
