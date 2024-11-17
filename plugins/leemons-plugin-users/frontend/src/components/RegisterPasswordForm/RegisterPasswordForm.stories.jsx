import React from 'react';
import { Box } from '@bubbles-ui/components';
import { RegisterPasswordForm } from './RegisterPasswordForm';

export default {
  title: 'Leemons/Users/RegisterPasswordForm',
  parameters: {
    component: RegisterPasswordForm,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Mt7Ne7X1aHI7pqhXbaF85w/App-Opensource-Backup?node-id=550%3A34163',
    },
  },
  argTypes: {
    onSubmit: { action: 'Form submitted' },
  },
};

const Template = ({ ...props }) => {
  return (
    <Box style={{ width: 560 }}>
      <RegisterPasswordForm {...props} />
    </Box>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  recoverUrl: '#',
  loading: false,
  formError: '',
  labels: {
    title: 'Create your password',
    password: 'Password',
    repeatPassword: 'Repeat password',
    setPassword: 'Set password',
  },
  placeholders: {
    password: 'Your password',
    repeatPassword: 'Repeat your password',
  },
  errorMessages: {
    password: { required: 'Field required' },
    repeatPassword: { required: 'Field required' },
    passwordMatch: 'Passwords not match',
  },
};
