/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Box, Button, Col, ContextContainer, Grid } from '@bubbles-ui/components';
import { isString, map } from 'lodash';
import { EvaluationDetailStyles } from './styles';
import { Name } from './components/Name';
import { Program } from './components/Program';
import { Conditions } from './components/Conditions';
import { Subject } from './components/Subject';

export const PROMOTION_DETAIL_FORM_MESSAGES = {
  nameLabel: 'Promotion name',
  subjectLabel: 'Subject',
  saveButtonLabel: 'Save',
  programLabel: 'Program',
  programPlaceholder: 'Select one...',
  gradeLabel: 'System evaluation',
  gradePlaceholder: 'Select one...',
  subjectPlaceholder: 'Select one...',
};

export const PROMOTION_DETAIL_FORM_ERROR_MESSAGES = {
  nameRequired: 'Field required',
  programRequired: 'Field required',
  gradeRequired: 'Field required',
  subjectRequired: 'Field required',
  conditionErrorMessage: 'Please select a grade',
};

const PromotionDetail = ({
  messages,
  errorMessages,
  selectData,
  defaultValues,
  onSubmit,
  onChange,
  isSaving,
  isDependency,
}) => {
  const { classes, cx } = EvaluationDetailStyles({});

  const form = useForm({ defaultValues });
  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    reset({ ...defaultValues });
  }, [defaultValues]);

  function removeAllConditionsScaleTargets(_group) {
    function parseCondition(condition) {
      if (isString(condition.target)) {
        condition.target = null;
      }
      return condition;
    }

    function parseConditionGroup(group) {
      return {
        ...group,
        conditions: map(group.conditions, parseCondition),
      };
    }

    return parseConditionGroup(_group);
  }

  useEffect(() => {
    const subscription = watch((formData, event) => {
      onChange(formData, event);
      if (event.name === 'grade') {
        setValue('group', removeAllConditionsScaleTargets(formData.group));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <ContextContainer>
        <Box>
          <Name messages={messages} errorMessages={errorMessages} form={form} />
        </Box>

        <Box>
          <Grid columns={100} grow>
            <Col span={50}>
              <Program
                messages={messages}
                errorMessages={errorMessages}
                selectData={selectData}
                form={form}
              />
            </Col>
            {/*
            <Col span={50}>
              <Grades
                messages={messages}
                errorMessages={errorMessages}
                selectData={selectData}
                form={form}
              />
            </Col>
            */}
          </Grid>
        </Box>

        {isDependency ? (
          <Box>
            <Subject
              messages={messages}
              errorMessages={errorMessages}
              selectData={selectData}
              form={form}
            />
          </Box>
        ) : null}

        <Box>
          <Conditions
            messages={messages}
            errorMessages={errorMessages}
            selectData={selectData}
            form={form}
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

PromotionDetail.defaultProps = {
  messages: PROMOTION_DETAIL_FORM_MESSAGES,
  errorMessages: PROMOTION_DETAIL_FORM_ERROR_MESSAGES,
  onSubmit: () => {},
  onChange: () => {},
  selectData: {},
};

PromotionDetail.propTypes = {
  loading: PropTypes.bool,
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  onSubmit: PropTypes.func,
  defaultValues: PropTypes.object,
  selectData: PropTypes.object,
  onChange: PropTypes.func,
  isSaving: PropTypes.bool,
  isDependency: PropTypes.bool,
};

export { PromotionDetail };
