import { LoginForm } from './LoginForm';
import { Box } from '@bubbles-ui/components';

export default {
  title: 'Leemons/Users/LoginForm',
  parameters: {
    component: LoginForm,
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
      <LoginForm {...props} />
    </Box>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  recoverUrl: '#',
  loading: false,
  formError: '',
  labels: {
    title: 'Login to your account',
    username: 'Email',
    password: 'Password',
    remember: "I can't remember my password",
    login: 'Log in',
    signup: 'I am not registered',
  },
  placeholders: {
    username: 'Your email',
    password: 'Your password',
  },
  errorMessages: {
    username: { required: 'Field required', invalidFormat: 'Invalid format' },
    password: { required: 'Field required' },
  },
};
