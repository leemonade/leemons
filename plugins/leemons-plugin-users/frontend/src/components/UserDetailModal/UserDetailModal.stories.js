import React from 'react';
import { Box, Stack, Button } from '@bubbles-ui/components';
import { UserDetailModal } from './UserDetailModal';
import { USER_DETAIL_MODAL_DEFAULT_PROPS } from './UserDetailModal.constants';

export default {
  title: 'Leemons/Users/UserDetailModal',
  parameters: {
    component: UserDetailModal,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    onClose: { action: 'onClose' },
  },
};

const Template = ({ ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <UserDetailModal {...props} opened={isOpen} onClose={() => setIsOpen(false)} />
      <Stack fullWidth justifyContent="center">
        <Box>
          <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        </Box>
      </Stack>
    </>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  ...USER_DETAIL_MODAL_DEFAULT_PROPS,
  user: {
    name: 'Marcelina',
    surnames: 'Cartes Ramirez',
    avatar:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
    rol: 'Tutor',
    email: 'bill.sanders@example.com',
    number: '+31 56 764 893',
    gender: 'Mujer',
    birthday: new Date(),
  },
  labels: {
    personalInformation: 'Información personal',
    badges: 'Etiquetas',
    email: 'Email',
    name: 'Nombre',
    surnames: 'Apellidos',
    birthday: 'Fecha de nacimiento',
    gender: 'Género',
  },
  badges: ['ESO', 'Estudiante', 'Altas capacidades', 'Bilingue-alemán'],
};
