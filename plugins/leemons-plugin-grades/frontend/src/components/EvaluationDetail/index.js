import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Box, Button, ContextContainer, Paragraph, Title } from '@bubbles-ui/components';
import { find } from 'lodash';
import { EvaluationDetailStyles } from './styles';
import { Name } from './components/Name';
import { Type } from './components/Type';
import { IsPercentage } from './components/IsPercentage';
import { Scales } from './components/Scales';
import { MinScaleToPromote } from './components/MinScaleToPromote';
import { OtherTags } from './components/OtherTags';

export const EVALUATION_DETAIL_FORM_MESSAGES = {
  nameLabel: 'Name',
  saveButtonLabel: 'Save',
  typeLabel: 'Choose type of grade scale:',
  percentagesLabel: 'Using percentages instead of numbers',
  scalesNumberLabel: 'Number',
  scalesDescriptionLabel: 'Description',
  scalesPercentageLabel: '% Percentage',
  scalesNumericalEquivalentLabel: 'Numerical equivalent',
  scalesLetterLabel: 'Letter',
  minScaleToPromoteLabel: 'Minimum value to pass/promote',
  minScaleToPromotePlaceholder: 'Select value...',
  otherTagsLabel: 'Other tags',
  otherTagsDescription:
    'If you need to use other tags to classify special conditions for some subjects, you can freely create them here.',
  otherTagsRelationScaleLabel: 'Co-relation with some scale value',
  tableAdd: 'Add',
  tableRemove: 'Remove',
  tableEdit: 'Edit',
  tableAccept: 'Accept',
  tableCancel: 'Cancel',
};

export const EVALUATION_DETAIL_FORM_ERROR_MESSAGES = {
  nameRequired: 'Field required',
  typeRequired: 'Field required',
  minScaleToPromoteRequired: 'Field required',
  errorCode6003: 'Cannot delete grade scale because it is used in grade tags',
};

const EvaluationDetail = ({
  messages,
  errorMessages,
  selectData,
  defaultValues,
  onSubmit,
  onBeforeRemoveScale,
  onBeforeRemoveTag,
  isSaving,
}) => {
  const { classes, cx } = EvaluationDetailStyles({});

  const form = useForm({ defaultValues });
  const {
    reset,
    watch,
    unregister,
    resetField,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    reset({ ...defaultValues });
  }, [defaultValues]);

  useEffect(() => {
    const subscription = watch(({ type }, { name }) => {
      if (name === 'type') {
        resetField('scales');
        if (type !== 'numeric') {
          unregister('isPercentage');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const type = find(selectData.type, { value: watch('type') });

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <ContextContainer>
        <Box>
          <Name messages={messages} errorMessages={errorMessages} form={form} />
        </Box>
        <Box>
          <Type
            messages={messages}
            errorMessages={errorMessages}
            selectData={selectData}
            form={form}
          />
        </Box>
        {type ? (
          <>
            <Box>
              <Title order={5}>{type.label}</Title>
            </Box>
            {type.value === 'numeric' ? (
              <Box>
                <IsPercentage messages={messages} errorMessages={errorMessages} form={form} />
              </Box>
            ) : null}
            <Box>
              <Scales
                messages={messages}
                errorMessages={errorMessages}
                selectData={selectData}
                onBeforeRemove={onBeforeRemoveScale}
                form={form}
              />
            </Box>
          </>
        ) : null}

        <Box>
          <MinScaleToPromote messages={messages} errorMessages={errorMessages} form={form} />
        </Box>

        <Box>
          <Title order={5}>{messages.otherTagsLabel}</Title>
          <Paragraph>{messages.otherTagsDescription}</Paragraph>
        </Box>

        <Box>
          <OtherTags
            messages={messages}
            errorMessages={errorMessages}
            form={form}
            onBeforeRemove={onBeforeRemoveTag}
          />
        </Box>

        <Box>
          <Button type="submit" loading={isSaving}>
            {messages.saveButtonLabel}
          </Button>
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
  onBeforeRemoveScale: PropTypes.func,
  onBeforeRemoveTag: PropTypes.func,
  isSaving: PropTypes.bool,
};

export { EvaluationDetail };
