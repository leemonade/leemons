export const mock = {
  // headerBackground: {
  //   styles: {
  //     position: 'absolute',
  //     zIndex: -1,
  //   },
  //   image:
  //     'https://images.unsplash.com/photo-1652624770437-8a0272d1f732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1Mzk4NDY3NA&ixlib=rb-1.2.1&q=80&w=1080',
  //   backgroundPosition: 'center',
  // },
  taskHeader: {
    title: 'La historia detrás del cuadro que tiene más de dos lineas',
    subtitle: 'Geografía e historia - 3002',
    icon: 'https://icon-library.com/images/white-globe-icon/white-globe-icon-24.jpg',
    color: '#4F96FF',
    styles: {
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
  },
  taskDeadline: {
    label: 'Entrega',
    deadline: new Date('2022-05-22'),
    styles: {
      position: 'absolute',
      top: 8,
    },
  },
  verticalStepper: {
    data: [
      {
        label: 'Current',
        childSteps: [
          { label: 'Content' },
          { label: 'Objectives' },
          { label: 'Assesment criteria' },
        ],
      },
      {
        label: 'Tarea previa',
        status: 'OK',
      },
      {
        label: 'Enunciado',
      },
      {
        label: 'Desarrollo',
      },
      {
        label: 'Entregable',
        status: 'OK',
        onClick: () => {},
      },
      {
        label: 'Auto reflexión',
        status: 'OK',

        onClick: () => {},
      },
      {
        label: 'Feedback',
        status: 'OK',

        onClick: () => {},
      },
      { label: 'Calificación', status: 'OK' },
    ],
    calificationProps: {
      label: 'Aprobado',
      grade: 9,
      minimumGrade: 5,
    },
  },
  fileItems: [
    { filename: 'Cuadro_Embarque_Moriscos.jpg', url: 'https://www.leemons.io/es' },
    { filename: 'Cuadro_Embarque_Moriscos.jpg', url: 'https://www.leemons.io/es' },
    { filename: 'Cuadro_Embarque_Moriscos.jpg', url: 'https://www.leemons.io/es' },
  ],
  calificationScoreFeedback: {
    calification: {
      minimumGrade: 5,
      grade: 9,
    },
  },
  userDisplayItem: {
    name: 'Ana Maria',
    surnames: 'Lopez Vilchez',
    avatar:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
    rol: 'Profesor',
    center: '',
    email: 'bill.sanders@example.com',
  },
};
