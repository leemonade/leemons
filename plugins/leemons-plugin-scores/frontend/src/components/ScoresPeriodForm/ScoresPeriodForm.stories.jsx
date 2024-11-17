import React from 'react';
import { ScoresPeriodForm } from './ScoresPeriodForm';
import { SCORES_PERIOD_FORM_DEFAULT_PROPS } from './ScoresPeriodForm.constants';

export default {
  title: 'leemons/Scores/ScoresPeriodForm',
  parameters: {
    component: ScoresPeriodForm,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    onSubmit: { action: 'onSubmit' },
    onSave: { action: 'onSave' },
    onChange: { action: 'onChange' },
  },
};

const Template = ({ ...props }) => {
  return <ScoresPeriodForm {...props} />;
};

export const Playground = Template.bind({});

Playground.args = {
  ...SCORES_PERIOD_FORM_DEFAULT_PROPS,
  fields: [
    {
      name: 'program',
      placeholder: 'Select program',
      data: ['Program 1', 'Program 2', 'Program 3'],
      required: 'Required field',
    },
    {
      name: 'course',
      placeholder: 'Select course',
      data: ['Course 1', 'Course 2', 'Course 3'],
      required: 'Required field',
    },
    {
      name: 'subject',
      placeholder: 'Select subject',
      data: ['Subject 1', 'Subject 2', 'Subject 3'],
    },
  ],
  periods: [
    {
      name: 'First period',
      startDate: new Date(2020, 0, 1),
      endDate: new Date(2020, 0, 31),
    },
    {
      name: 'Second period',
      startDate: new Date(2020, 1, 1),
      endDate: new Date(2020, 1, 28),
    },
    {
      name: 'Third period',
      startDate: new Date(2020, 2, 1),
      endDate: new Date(2020, 2, 31),
    },
  ],
  value: {
    program: 'Program 3',
    course: 'Course 2',
    subject: null,
    startDate: null,
    endDate: new Date(),
  },
  labels: {
    startDate: 'Start date',
    endDate: 'End date',
    submit: 'Search',
    newPeriod: 'New period',
    addPeriod: 'Add new period',
    shareWithTeachers: 'Share with teachers',
    saveButton: 'Save time period',
  },
  errorMessages: {
    startDate: 'Required start date',
    endDate: 'Required end date',
    validateStartDate: 'Start date is greater than end date',
    validateEndDate: 'End date is smaller than start date',
  },
};
