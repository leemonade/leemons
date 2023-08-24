import React from 'react';
import { Box } from '@bubbles-ui/components';
import { LOGIN_PROFILE_SELECTOR_DEFAULT_PROPS, LoginProfileSelector } from './LoginProfileSelector';

export default {
  title: 'Leemons/Users/LoginProfileSelector',
  parameters: {
    component: LoginProfileSelector,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/SjAiYd128sqDIzjPRsyRDe/%F0%9F%8D%8B-App-Opensource?node-id=58%3A16666',
    },
  },
  argTypes: {
    onSubmit: { action: 'Form submitted' },
  },
};

const Template = ({ ...props }) => {
  return (
    <Box style={{ width: 560 }}>
      <LoginProfileSelector {...props} />
    </Box>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  ...LOGIN_PROFILE_SELECTOR_DEFAULT_PROPS,
  labels: {
    title: 'Hi, John Doe',
    description: 'You have two profiles on leemons, please select the one with you want to access',
    remember: 'Always use this profile for quick access',
    help: 'You can easily change later your profile by clicking on your avatar in the sidebar of the application',
    login: 'Log in',
    centerPlaceholder: 'Select a center',
  },
  errorMessages: {
    profile: {
      required: 'Please select a profile',
    },
  },
  centers: [
    {
      id: 'center1',
      name: 'Centro 1',
      profiles: [
        {
          id: 'teacher',
          name: 'Teacher',
          // icon: <SchoolTeacherMaleIcon height={32} width={32} />,
        },
        {
          id: 'mother',
          name: 'Mother',
          // icon: <SchoolTeacherMaleIcon height={32} width={32} />,
        },
      ],
    },
    {
      id: 'center2',
      name: 'Centro 2',
      profiles: [
        {
          id: 'teacher',
          name: 'Teacher',
          // icon: <SchoolTeacherMaleIcon height={32} width={32} />,
        },
      ],
    },
  ],
};
