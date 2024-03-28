import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Text, Link, Img, Section, Row, Column } from '@react-email/components';
import EmailLayout from '@leemons/emails/src/emails/EmailLayout.jsx';

const messages = {
  en: {
    title: 'Hello, again!',
    infoText:
      'Today we come to tell you how to work with tasks in Leemons, a way to create activities for your students to solve individually or in groups and demonstrate their knowledge by submitting a work for you to evaluate.',
    actionText: 'Start by accessing your campus:',
    buttonText: 'Go to Leemons',
    alternativeActionText:
      'If the previous button does not work, copy and paste the following link into your browser:',
    supportText: 'Have you had any issues?',
    supportContactText: 'Contact our amazing team.',
    supportButtonText: 'Support Center',
    step01Title: '1. Create a task',
    step01Description:
      '<p><strong>Only the teacher profile can create content on the platform</strong> and assign activities to students.</p><p>Click on New task in the corresponding section of the library or in the New menu of any other section.</p><p>In the task creation window, we will find three sections: basic, content, and evaluation. Throughout the process and depending on the options we activate, new steps may appear.</p>',
    step01Description02:
      'Normally the goal will be for students to submit something (an essay, a work, a video, an image...), by activating this option you can enter information about the type of submission (file or link), file format, maximum weight and include a description of the deliverable.',
    step02Title: '2. Assign a task to your students with a due date',
    step02Description:
      '<p>To launch the task to the students, we press the first button in the top row "Assign" in the task detail of the Library.</p>',
    step02Description02:
      '<p>The first step is to choose the subject and the group of students. A task can be assigned to an entire class (from which we can exclude students if necessary), to a group of students (to which we can give a name) or to a specific student.</p>',
    step02Description03:
      '<p>You can set the task without a deadline so that students can complete it whenever they want or give a time limit, after which students will no longer be able to submit the task.</p><p>From the assignment, as a teacher, you will be able to find the task in the Ongoing section of the platform along with other activities you have previously assigned. Clicking on the task row will allow you to see execution statistics, individual deliverables, and other progress data.</p>',
    step02More: 'Learn more...',
    step03Title: '3. Task submission and evaluation',
    step03Description:
      "<p>Now that you have created a task and the students have received it, let's see how they solve it and what the evaluation and feedback process is like.</p><p>Within the task lifecycle, once students receive the task, they can proceed to execute it, making a submission.</p>",
    step03Description02:
      '<p>When you access your general or subject panel, you will find a card indicating student submissions.</p><p>On this card, you can also find out if there is any open conversation from the students (chat icon at the bottom right of the card).</p>',
    step03Description03:
      '<p>On the correction screen, you will have access to the submissions made by the students.</p><p>In addition to the numerical evaluation (or with letters according to the evaluation mode chosen in the platform installation), you can activate the option "Add feedback to the student..." to give a qualitative evaluation. If necessary, it is also possible to open a chat with the student to talk live.</p>',
    step03Description04:
      '<p>Click on "Save and send feedback" to close the evaluation of this student and send their grade.</p><p>At Leemons, we don\'t want any student to be left behind, so when teachers send a grade, students receive a card on their general and subject dashboards with the evaluation information.</p><p>They just have to click on it to see detailed information, such as the grade and the teacher\'s qualitative evaluation.</p>',
    step03More:
      'To deeply understand all the power of the task tool and its different configuration options, visit the following articles from Leemons Academy:',
    nextStepTitle: 'We continue to accompany you',
    nextStepDescription:
      "In a few days, we will send you a new email to talk to you about <strong>question banks and tests</strong>, another tool that will save you a lot of time when evaluating your students' knowledge.",
    learnMore: "If you don't want to wait...",
    stepByStepHelp: 'Find the help you need, step by step at:',
    leemonsAcademyButton: 'Leemons Academy',
    post01Title: 'Tasks (assignments) 1 - Create and assign',
    post01Description:
      'A task is a generally evaluable or gradable activity that requires the presentation of learning evidence by the student (for example, an essay, a video, a photo of a work).',
    post02Title: 'Tasks 2 - Execution and evaluation',
    post02Description:
      'Within the lifecycle of the task, once the students receive the task, they can proceed to execute it, making a submission. Thus, the teacher can evaluate the work done once the submission date is closed.',
  },
  es: {
    title: '¡Hola, de nuevo!',
    infoText:
      'Hoy venimos a contarte cómo trabajar con las tareas en Leemons, una forma de crear actividades para que tus alumnos las resuelvan individualmente o en grupo y demuestren su conocimiento entregando un trabajo para que puedas evaluarlo.',
    actionText: 'Comienza accediendo a tu campus:',
    buttonText: 'Ir a Leemons',
    alternativeActionText:
      'Si el botón anterior no funciona, copia y pega el siguiente enlace en tu navegador:',
    supportText: '¿Has tenido algún problema?',
    supportContactText: 'Contacta con nuestro increíble equipo.',
    supportButtonText: 'Centro de soporte',
    step01Title: '1. Crear una tarea',
    step01Description:
      '<p><strong>Sólo el perfil profesor puede crear contenido en la plataforma</strong> y asignar actividades a las y los estudiantes.</p><p>Haz clic en Nueva tarea en la sección correspondiente de la biblioteca o en el menú Nuevo de cualquier otra sección.</p><p>En la ventana de creación de tareas encontraremos tres apartados: básico, contenido y evaluación. A lo largo del proceso y dependiendo de las opciones que activemos, pueden aparecer nuevos pasos.</p>',
    step01Description02:
      'Normalmente el objetivo será que los alumnos envíen algo (un ensayo, un trabajo, un vídeo, una imagen...), activando esta opción podrá introducir información sobre el tipo de envío (archivo o enlace), formato del archivo, peso máximo e incluir una descripción del entregable.',
    step02Title: '2. Asignar una tarea a tus alumnos y alumnas con una fecha de entrega',
    step02Description:
      '<p>Para lanzar la tarea a los alumnos, pulsamos sobre el primer botón de la fila superior "Asignar" en el detalle de tarea de la Biblioteca.</p>',
    step02Description02:
      '<p>El primer paso es elegir la asignatura y el grupo de alumnos. Una tarea se puede asignar a toda una clase (de la que podemos excluir alumnos si es necesario), a un grupo de alumnos (al que podemos dar un nombre) o a un alumno en concreto.</p>',
    step02Description03:
      '<p>Podrás establecer la tarea sin fecha límite para que los estudiantes la completen cuando quieran o dar un límite de tiempo, después del cual los estudiantes ya no podrán enviar la tarea.</p><p>A partir de la asignación, como profesor podrás encontrar la tarea en la sección En curso (ongoing) de la plataforma junto con otras actividades que hayas asignado previamente. Pulsando sobre la fila de la tarea podrás ver las estadísticas de ejecución, los entregables individuales y otros datos de progreso.</p>',
    step02More: 'Saber más...',
    step03Title: '3. Entrega de tareas y evaluación',
    step03Description:
      '<p>Ahora que has creado una tarea y los estudiantes la han recibido, veamos cómo la resuelven y cuál es el proceso de evaluación y feedback.</p><p>Dentro del ciclo de vida de la tarea, una vez que los alumnos reciben la tarea, pueden proceder a ejecutarla, realizando un envío.</p>',
    step03Description02:
      '<p>Cuando accedas a tu panel general o de asignatura, encontrarás una tarjeta que indica los envíos de alumnos.</p><p>En esta tarjeta también podrás saber si hay alguna conversación abierta por parte de los alumnos (icono de chat en la parte inferior derecha de la tarjeta).</p>',
    step03Description03:
      '<p>En la pantalla de corrección, tendrás acceso a las entregas realizadas por los alumnos.</p><p>Además de la evaluación numérica (o con letras según el modo de evaluación elegido en la instalación de la plataforma), puedes activar la opción "Añadir feedback al alumno..." para dar una evaluación cualitativa. Si es necesario, también es posible abrir un chat con el alumno para hablar en directo.</p>',
    step03Description04:
      '<p>Haz clic en "Guardar y enviar feedback" para cerrar la evaluación de este alumno y enviarle su nota.</p><p>En Leemons no queremos que ningún estudiante se quede atrás, así que cuando los profesores envían una calificación, los alumnos reciben una tarjeta en sus tableros general y de asignaturas con la información de la evaluación.</p><p>Solo tendrán que hacer clic en ella para ver información detallada, como la nota y la evaluación cualitativa del profesor.</p>',
    step03More:
      'Para conocer en profundidad toda la potencia de la herramienta de tareas y sus distintas opciones de configuración, visita los siguientes artículos de Leemons Academy:',
    nextStepTitle: 'Seguimos acompañándote',
    nextStepDescription:
      'En unos días te enviaremos un nuevo correo para hablarte de los <strong>bancos de preguntas y los test</strong>, otra herramienta que te ahorrará un montón de tiempo a la hora de evaluar el conocimiento de tus estudiantes.',
    learnMore: 'Si no quieres esperar...',
    stepByStepHelp: 'Encuentra la ayuda que necesitas, paso a paso en:',
    leemonsAcademyButton: 'Leemons Academy',
    post01Title: 'Tareas (asignaciones) 1 - Crear y asignar',
    post01Description:
      'Una tarea es una actividad generalmente evaluable o calificable que requiere la presentación de pruebas de aprendizaje por parte del alumno (por ejemplo, un ensayo, un vídeo, una foto de un trabajo).',
    post02Title: 'Tareas 2 - Ejecución y evaluación',
    post02Description:
      'Dentro del ciclo de vida de la tarea, una vez que los alumnos reciben la tarea, pueden proceder a ejecutarla, realizando un envío. Asi, el profesor podrá evaluar el trabajo realizado una vez  cerrada la fecha de entrega.',
  },
};

const TeacherAssigmentsGuide = ({ locale = 'en', loginUrl = '{{it.loginUrl}}' }) => {
  const previewText = `[Leemons] ${messages[locale].title}`;
  return (
    <EmailLayout preview={previewText} title={messages[locale].title} locale={locale}>
      <Container className="text-center">
        <Text className="text-[14px] leading-5">{messages[locale].infoText}</Text>
      </Container>

      <Container className="bg-white text-center px-4 pb-4 rounded-lg">
        <Text className="text-[14px] leading-5">{messages[locale].actionText}</Text>
        <Button
          href={loginUrl}
          className="bg-[#B4E600] py-3 px-4 my-1 rounded text-black text-[14px] no-underline text-center"
        >
          {messages[locale].buttonText}
        </Button>
        <Text className="text-[14px] leading-5">{messages[locale].alternativeActionText}</Text>
        <Link href={loginUrl} className="text-[14px] leading-5 underline break-all">
          {loginUrl}
        </Link>
      </Container>
      <Container className="text-[14px] leading-5 text-center mt-8">
        <Text className="text-[20px] font-bold">{messages[locale].step01Title}</Text>
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step01Description,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher01_e31079508e.png"
        />
        <Text className="text-[14px] leading-5">{messages[locale].step01Description02}</Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher02_26d44b014b.png"
        />
      </Container>
      <Container className="text-center text-[14px] leading-5 mt-8">
        <Text className="text-[20px] font-bold">{messages[locale].step02Title}</Text>
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step02Description,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher03_f62fb532a7.png"
        />
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step02Description02,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher04_0e53009529.png"
        />
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step02Description03,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher05_ee142b99d0.png"
        />
      </Container>
      <Container className="text-center text-[14px] leading-5 mt-8">
        <Text className="text-[20px] font-bold">{messages[locale].step03Title}</Text>
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step03Description,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher06_a016159535.png"
        />
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step03Description02,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher07_2b82530eb0.png"
        />
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step03Description03,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher08_237852e604.png"
        />
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step03Description04,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher09_0e91891a43.png"
        />
      </Container>
      <Container className="text-center mt-8">
        <Text className="text-[20px] font-bold">{messages[locale].step02More}</Text>
        <Text className="text-[14px] leading-5">{messages[locale].step03More}</Text>
        <Section>
          <Row>
            <Column className="w-[48%] align-top text-left bg-white border border-solid border-gray-200">
              <Link
                className="text-[#343A3F]"
                href="https://www.leemons.io/academy-post/tasks-assignments-1-create-and-assign"
              >
                <Img
                  className="w-full"
                  src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/blog_tasks_creation_77bd12087e.png"
                />
                <Container className="p-4">
                  <Text className="text-[18px] leading-5 font-bold">
                    {messages[locale].post01Title}
                  </Text>
                  <Text className="text-[14px] leading-5">
                    {messages[locale].post01Description}
                  </Text>
                </Container>
              </Link>
            </Column>
            <Column className="w-[4%]" />
            <Column className="w-[48%] align-top text-left bg-white border border-solid border-gray-200">
              <Link
                className="text-[#343A3F]"
                href="https://www.leemons.io/academy-post/tasks-assignments-2-execution-and-evaluation"
              >
                <Img
                  className="w-full"
                  src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/blog_tasks_execution_c2ce6e04b8.png"
                />
                <Container className="p-4">
                  <Text className="text-[18px] leading-5 font-bold">
                    {messages[locale].post02Title}
                  </Text>
                  <Text className="text-[14px] leading-5">
                    {messages[locale].post02Description}
                  </Text>
                </Container>
              </Link>
            </Column>
          </Row>
        </Section>
      </Container>
      <Container className="text-center text-[14px] leading-5 mt-6">
        <Text className="text-[20px] font-bold">{messages[locale].nextStepTitle}</Text>
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].nextStepDescription,
          }}
        ></Text>
      </Container>
      <Container className="text-center mt-2">
        <Text className="text-[20px] font-bold">{messages[locale].learnMore}</Text>
        <Text className="text-[14px] leading-5">{messages[locale].stepByStepHelp}</Text>
        <Button
          href="https://www.leemons.io/leemons-academy"
          className="bg-[#B4E600] py-3 px-4 my-1 rounded text-black text-[14px] no-underline text-center"
        >
          {messages[locale].leemonsAcademyButton}
        </Button>
      </Container>
      <Container className="text-center mt-6">
        <Text className="text-[20px] font-bold">{messages[locale].supportText}</Text>
        <Text className="text-[14px] leading-5">{messages[locale].supportContactText}</Text>
        <Button
          href="https://leemonssupport.zendesk.com"
          className="py-3 px-4 mb-6 rounded text-black text-[14px] no-underline text-center border border-solid border-black"
        >
          {messages[locale].supportButtonText}
        </Button>
      </Container>
    </EmailLayout>
  );
};

TeacherAssigmentsGuide.propTypes = {
  locale: PropTypes.string,
  loginUrl: PropTypes.string,
};

export { TeacherAssigmentsGuide };
export default TeacherAssigmentsGuide;
