import React from 'react';
import {
  ADD_CURRICULUM_FORM_ERROR_MESSAGES,
  ADD_CURRICULUM_FORM_MESSAGES,
  AddCurriculumForm,
} from './AddCurriculumForm';

export default {
  title: 'Leemons/Curriculum/AddCurriculumForm',
  parameters: {
    component: AddCurriculumForm,
  },
  argTypes: {
    // myBooleanProp: { control: { type: 'boolean' } },
    // mySelectProp: { options: ['Hello', 'World'], control: { type: 'select' } },
    onSubmit: { action: 'Form submitted' },
  },
};

const Template = ({ children, ...props }) => {
  return <AddCurriculumForm {...props}>{children}</AddCurriculumForm>;
};

export const Playground = Template.bind({});

Playground.args = {
  recoverUrl: '#',
  isLoading: false,
  formError: '',
  messages: ADD_CURRICULUM_FORM_MESSAGES,
  errorMessages: ADD_CURRICULUM_FORM_ERROR_MESSAGES,
  selectData: {
    country: [
      { value: 1, label: 'España' },
      { value: 2, label: 'Francia' },
      { value: 3, label: 'Italia' },
    ],
    language: [
      { value: 1, label: 'ES' },
      { value: 2, label: 'EN' },
      { value: 3, label: 'FR' },
    ],
    center: [
      { value: 1, label: 'Centro 1' },
      { value: 2, label: 'Centro 2' },
      { value: 3, label: 'Centro 3' },
    ],
    program: [
      { value: 1, label: 'Programa 1' },
      { value: 2, label: 'Programa 2' },
      { value: 3, label: 'Programa 3' },
    ],
  },
};
