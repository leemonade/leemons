import { ChevronRightIcon, ChevronLeftIcon } from '@bubbles-ui/icons/outline';
import { PluginComunicaIcon } from '@bubbles-ui/icons/solid';
import {
  Box,
  Text,
  Button,
  Title,
  FileItemDisplay,
  ScoreFeedback,
  ContextContainer,
  Paragraph,
  UserDisplayItem,
} from '@bubbles-ui/components';

const pageWithResources = (classes, nextStep) => {
  const renderFileItems = () => {
    const items = mock.fileItems.map((fileItem, index) => (
      <Box key={index} className={classes.itemDisplayContainer}>
        <FileItemDisplay {...fileItem} />
      </Box>
    ));
    return items;
  };

  return (
    <>
      <Box className={classes.loremIpsum}>
        <Title order={2}>Lorem ipsum</Title>
        <Text color="primary" role="productive" strong className={classes.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
        <Title order={4}>Lorem</Title>
        <Text color="primary" role="productive" className={classes.mainText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </Text>
        <Title order={4}>Lorem</Title>
        <Text color="primary" role="productive" className={classes.mainText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </Text>
        <Title order={4}>Lorem ipsum lorem</Title>
        <Text color="primary" role="productive" className={classes.mainText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </Text>
        <Box className={classes.continueButton}>
          <Button
            position="left"
            rightIcon={<ChevronRightIcon />}
            style={{ width: 338 }}
            rounded
            compact
            onClick={nextStep}
          >
            Continuar
          </Button>
        </Box>
      </Box>
      <Box className={classes.resources}>
        <Text role="productive" color="soft" transform="uppercase">
          Recursos
        </Text>
        <Box className={classes.fileItemList}>{renderFileItems()}</Box>
      </Box>
    </>
  );
};

const pageWithoutResources = (classes, nextStep, prevStep) => (
  <Box className={classes.loremIpsum}>
    <Title order={2}>Lorem ipsum</Title>
    <Text color="primary" role="productive" strong className={classes.subtitle}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </Text>
    <Title order={4}>Lorem</Title>
    <Text color="primary" role="productive" className={classes.mainText}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua.
    </Text>
    <Title order={4}>Lorem</Title>
    <Text color="primary" role="productive" className={classes.mainText}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua.
    </Text>
    <Title order={4}>Lorem ipsum lorem</Title>
    <Text color="primary" role="productive" className={classes.mainText}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua.
    </Text>
    <Box className={classes.continueButton}>
      <Button
        position="right"
        variant="outline"
        leftIcon={<ChevronLeftIcon />}
        style={{ width: 338 }}
        rounded
        compact
        onClick={prevStep}
      >
        Anterior
      </Button>
      <Button
        position="left"
        rightIcon={<ChevronRightIcon />}
        style={{ width: 338 }}
        rounded
        compact
        onClick={nextStep}
      >
        Continuar
      </Button>
    </Box>
  </Box>
);

const pagePreDoing = (classes, nextStep) => (
  <Box className={classes.preDoing}>
    <Title>Tarea Previa</Title>
    <Title className={classes.preDoingSubtitle}>
      ¿Cuánto sabes sobre el conflicto con los moriscos?
    </Title>
    <Box>
      <Text color="primary" role="productive" className={classes.preDoingText}>
        A continuación, te presentamos un test que te ayudará a saber cómo de preparado estás para
        afrontar este ejercicio.
      </Text>
    </Box>
    <Box>
      <Text color="primary" role="productive" className={classes.preDoingText}>
        Esta parte de la tarea es individual.
      </Text>
    </Box>
    <Box>
      <Text color="primary" role="productive" className={classes.preDoingText}>
        Tienes 5 minutos para contestar al test de 3 preguntas
      </Text>
    </Box>
    <Box className={classes.preDoingButton}>
      <Button
        position="left"
        rightIcon={<ChevronRightIcon />}
        style={{ width: 338 }}
        rounded
        compact
        onClick={nextStep}
      >
        Hacer el test
      </Button>
    </Box>
  </Box>
);

const pageCalification = (classes, nextStep) => (
  <Box className={classes.calification}>
    <Title>Calificación</Title>
    <Box className={classes.scoreFeedbackContainer}>
      <ScoreFeedback {...mock.calificationScoreFeedback}>
        <Box className={classes.scoreFeedback}>
          <Text size="md" role="productive" stronger>
            Comentarios
          </Text>
          <ContextContainer>
            <Paragraph size="md" color="primary">
              ¡Enhorabuena! Has hecho un gran trabajo con el video de explicación de tu cuadro.
              Demuestras un conocimiento excelente no solo sobre la obra sino también sobre su
              contextos histórico, me gusta como la has enmarcado en el estilo pictórico del
              movimiento al que pertenece el artista así como la enumeración que haces de las
              características del movimiento y su relación son el momento en que fue creada.
            </Paragraph>
            <Paragraph size="md" color="primary">
              Una recomendación para subir nota en la siguiente ocasión: prepara el discurso y hazlo
              tuyo, utilizando tus propias palabras, en tu grabación se percibe como hay partes del
              discurso que lees y ello hace que pierdas el ritmo.
            </Paragraph>
            <Paragraph size="md" color="primary">
              Sigue así.
            </Paragraph>
          </ContextContainer>
        </Box>
      </ScoreFeedback>
    </Box>
    <Box className={classes.calificationFooter}>
      <Title order={4}>¿Quieres hacer alguna consulta sobre esta evaluaciónn</Title>
      <UserDisplayItem {...mock.userDisplayItem} />
      <Button rounded onClick={nextStep} rightIcon={<PluginComunicaIcon />}>
        Escribe a tu profesor
      </Button>
    </Box>
  </Box>
);

export const mock = {
  pages: [
    pageWithResources,
    pageWithoutResources,
    pageWithoutResources,
    pageWithoutResources,
    pagePreDoing,
    pageWithoutResources,
    pageWithoutResources,
    pageWithoutResources,
    pageWithoutResources,
    pageWithoutResources,
    pageWithoutResources,
    pageCalification,
  ],
  headerBackground: {
    styles: {
      position: 'absolute',
      zIndex: -1,
    },
    image:
      'https://s3-alpha-sig.figma.com/img/9845/7ff2/9522c3f9e01cf33153ab13d4c28b6e6f?Expires=1652659200&Signature=QQnVH1PcB6LK5miPkoeC8bhoA8lngTokFivDa9~FmwvWZIrtF5sS75pMxml4K9r-Hf3A0SYLn5atrI6Mklv3gY-gH6c2fiOtpJm2ZN1umBN2W0CAwQOJAB202ACfKh-stLQs-YKONAHH1TF72jgst~wSIsdfItFvFIVQyogcMSEnj8HY~F-6X0Gmfnn0UHgi1fNpv0J9rtHYa4wsHIw7~mhOQK~biDJ~8cxtAoIoNO3FfF~GM0f7HpUV-6Sfb4fyhpKpU~R0dKE0pmeZoGQ6nwoHWgnSfSr4OtUo1X0k0VZBFQZSkt3scqcFqEa9JBtecx~AOlIiSOzuPkfuix-X~A__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA',
    backgroundPosition: 'center',
  },
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
