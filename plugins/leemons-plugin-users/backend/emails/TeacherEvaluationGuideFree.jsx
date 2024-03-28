import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Text, Link, Img, Section, Row, Column } from '@react-email/components';
import EmailLayout from '@leemons/emails/src/emails/EmailLayout.jsx';

const messages = {
  en: {
    title: 'Here we come with more wood!',
    infoText:
      'Now that you master the creation of activities, the next step is to show you how you can evaluate your students using the tests tool.',
    actionText: 'Start by accessing your campus:',
    buttonText: 'Go to Leemons',
    alternativeActionText:
      'If the previous button does not work, copy and paste the following link into your browser:',
    supportText: 'Have you had any problems?',
    supportContactText: 'Contact our amazing team.',
    supportButtonText: 'Support Center',
    step01Title: '1. Create a question bank',
    step01Description:
      '<p>In the free version of Leemons you have multiple-choice questions, with images and map format. Also, you can add hints to the questions to provide scaffolding to students with learning difficulties or other diversities.</p><p><span><strong style="color: #FF5470">Important</strong></span>: A question bank is not assignable to a student, it works as a first step to create a test.</p><p>To create a new question bank click on New QB in the corresponding section of the library or click on the New menu in any other section and choose the same option.</p>',
    step01Description02:
      '<p>In the creation window, we will find two sections: basic and questions. In this first step, we will give the question bank a title, a cover image, and a description. We must also tag it with the subjects to which its content corresponds.</p><p>Next, we can start creating questions.</p>',
    qtype01Title: 'Single-choice questions',
    qtype01Description:
      'Also known as multiple-choice. It presents several options for the student to choose one as the correct answer to the question.',
    qtype02Title: 'Answers with images',
    qtype02Description:
      'If you activate the Images option in the Answers group, the answer fields will allow you to search for a photo in the library for each answer and include alternative text.',
    qtype03Title: 'Map questions',
    qtype03Description:
      'For this type of questions, we will upload an image that functions as a map, on the map some numbers will be placed and the student will have to correctly relate them to a series of options.',
    step01Description03:
      '<p>When saving, the system will navigate to the list of questions created so far. To include a new question, click on Add new question.</p><p>To finish the question bank, you must click on "Publish"</p>',
    step02Title: '2. Create a test',
    step02Description:
      '<p>Click on New test in the corresponding section of the library or in the New menu of any other section.</p><p>At this point, we complete the information on the cover, and choose the subject (this will be important since only question banks of the same subject can be used).</p>',
    step02Description02:
      '<p>It is necessary to choose a question bank in order to add questions to the exam. If no Question Bank appears at this step, you must go back and check that the subject is correctly configured.</p>',
    step02Description03:
      '<p>In the next step, you must specify the number of questions for the test and, if you wish, filter to locate the questions that interest you: type (map, multiple-choice, or both), categories, and level.</p><p>The system returns a random set of questions that respond to the search, select the ones you are interested in and finally publish the test.</p>',
    step02More: 'Learn more...',
    step03Title: '3. Assign a test',
    step03Description:
      '<p>The assignment window allows us to choose the group of students. A test can be assigned to an entire class (from which we can exclude students if necessary), to a group of students (to which we can give a name) or to a specific student.</p>',
    step03Description02:
      '<p>You can set the test without a time limit so that students can take it whenever they want or set a time limit, after which students will not be able to submit the test. It is also possible to set a time limit after which the test will close.</p>',
    step03More:
      'If you want to expand information about the operation of question banks, visit the following article:',
    step04Title: '4. Execution and evaluation',
    step04Description:
      '<p>If we have chosen the option "Notify students", they will receive an email in their inbox. Otherwise, students can view the test in their featured section of the Program and/or Subject control panel.</p>',
    step04Description02:
      "<p>When taking the test, the questions will appear in sequence and the student can navigate between them to review them. If the test is timed, it will be visible at the top of the screen</p><p>Once completed and submitted, the score obtained will be immediately visible and will also appear in the My evaluations section of the student's control panel.</p>",
    learnMore: 'We continue to accompany you',
    stepByStepHelp: 'Leemons has many more tools and possibilities. To discover them all, visit:',
    leemonsAcademyButton: 'Leemons Academy',
    post00Title: 'Question Banks',
    post00Description:
      'Question banks are the most effective and convenient way to store and manage a large number of questions on a specific topic classified by difficulty and subject, and to use them to create multiple tests.',
    post01Title: 'Test 1 - Create and Assign',
    post01Description:
      "Tests are the most convenient way to assess a student's knowledge. With Leemons, teachers can create endless tests from a question bank, varying the level of difficulty and the categories of topics to validate.",
    post02Title: 'Test 2 - Execution and Evaluation',
    post02Description:
      'Now that you have assigned the test, we will show you how the student takes the test and reviews it once completed to continue learning. You will also learn about all the evaluation and feedback options.',
  },
  es: {
    title: 'Aquí venimos con ¡más madera!',
    infoText:
      'Ahora que ya dominas la creación de actividades, el siguiente paso es mostrarte cómo puedes evaluar a tus estudiantes utilizando la herramienta de tests.',
    actionText: 'Comienza accediendo a tu campus:',
    buttonText: 'Ir a Leemons',
    alternativeActionText:
      'Si el botón anterior no funciona, copia y pega el siguiente enlace en tu navegador:',
    supportText: '¿Has tenido algún problema?',
    supportContactText: 'Contacta con nuestro increíble equipo.',
    supportButtonText: 'Centro de soporte',
    step01Title: '1. Crear un banco de preguntas',
    step01Description:
      '<p>En la versión gratuita de Leemons tienes preguntas de opción múltiple, con imágenes y formato de mapa. Además, puedes añadir pistas a las preguntas para añadir andamiaje a alumnos con dificultades de aprendizaje u otras diversidades.</p><p><span><strong style="color: #FF5470">Importante</strong></span>: Un banco de preguntas no es asignable a un alumno, funciona como un primer paso para crear un test.</p><p>Para crear un nuevo banco de preguntas haz clic en Nuevo QB en la sección correspondiente de la biblioteca o pulsa en el menú Nuevo en cualquier otra sección y elige la misma opción.</p>',
    step01Description02:
      '<p>En la ventana de creación encontraremos dos secciones: básica y preguntas. En este primer paso, daremos al banco de preguntas un título, una imagen de portada y una descripción. También debemos etiquetarlo con las asignaturas a las que corresponde su contenido.</p><p>A continuación, podremos empezar a crear preguntas.</p>',
    qtype01Title: 'Preguntas monorespuesta',
    qtype01Description:
      'También conocidas como de opción múltiple. Presenta varias opciones para que el alumno elija una como respuesta correcta a la pregunta.',
    qtype02Title: 'Respuestas con imágenes',
    qtype02Description:
      'Si activas la opción Imágenes en el grupo Respuestas, los campos de respuesta te permitirán buscar una foto en la biblioteca para cada respuesta e incluir un texto alternativo.',
    qtype03Title: 'Preguntas tipo Mapa',
    qtype03Description:
      'Para este tipo de preguntas, subiremos una imagen que funcione como mapa, en el mapa se colocarán unos números y el alumno tendrá que relacionarlos correctamente con una serie de opciones.',
    step01Description03:
      '<p>Al guardar, el sistema navegará a la lista de preguntas creadas hasta el momento. Para incluir una nueva pregunta, haga clic en Añadir nueva pregunta.</p><p>Para finalizar el banco de preguntas, deberás pulsar “Publicar”</p>',
    step02Title: '2. Crear un test',
    step02Description:
      '<p>Pulsa Nuevo test en la sección correspondiente de la biblioteca o en el menú Nuevo de cualquier otra sección.</p><p>En este punto completamos la información de la portada, y elegimos la asignatura (esto será importante ya que sólo se pueden utilizar bancos de preguntas de la misma asignatura).</p>',
    step02Description02:
      '<p>Es necesario elegir un banco de preguntas para poder añadir preguntas al examen. Si en este paso no aparece ningún Banco de preguntas, deberás volver atrás y comprobar que la asignatura está correctamente configurada.</p>',
    step02Description03:
      '<p>En el siguiente paso, deberás especificar el número de preguntas para el test y, si lo deseas, filtrar para localizar las preguntas que te interesan: tipo (mapa, opción múltiple o ambas), categorías y nivel.</p><p>El sistema devuelve un conjunto aleatorio de preguntas que responden a la búsqueda, selecciona las que te interesan y finalmente publica el test.</p>',
    step02More: 'Saber más...',
    step03Title: '3. Asignar un test',
    step03Description:
      '<p>La ventana de asignación nos permite elegir el grupo de alumnos. Una prueba puede asignarse a toda una clase (de la que podemos excluir alumnos si es necesario), a un grupo de alumnos (al que podemos dar un nombre) o a un alumno concreto.</p>',
    step03Description02:
      '<p>Puedes establecer el test sin límite de tiempo para que los alumnos puedan realizarlo cuando quieran o dar un límite de tiempo, después del cual los alumnos no podrán enviar el test. También aquí es posible establecer un límite de tiempo tras el cual se cerrará la prueba.</p>',
    step03More:
      'Si quieres ampliar información sobre el funcionamiento de los Bancos de preguntas, visita el siguiente artículo:',
    step04Title: '4. Ejecución y evaluación',
    step04Description:
      '<p>Si hemos elegido la opción "Notificar a los estudiantes", estos recibirán un correo electrónico en su buzón. De lo contrario, los estudiantes podrán ver la prueba en su sección destacada del panel de control de Programa y/o Asignatura.</p>',
    step04Description02:
      '<p>A la hora de resolver el test, las preguntas aparecerán en secuencia y el alumno podrá navegar entre ellas para repasarlas. Si la prueba es cronometrada, será visible en la zona superior de la pantalla</p><p>Una vez finalizado y entregado, la puntuación obtenida será visible inmediatamente y también aparecerá en la sección Mis evaluaciones del panel de control del alumno.</p>',
    learnMore: 'Seguimos acompañándote',
    stepByStepHelp:
      'Leemons cuenta con muchas más herramientas y posibilidades. Para conocerlas todas, visita:',
    leemonsAcademyButton: 'Leemons Academy',
    post00Title: 'Bancos de preguntas',
    post00Description:
      'Los bancos de preguntas son la forma más eficaz y cómoda de almacenar y gestionar un gran número de preguntas sobre un tema concreto clasificadas por dificultad y materia y poder utilizarlas para crear múltiples test.',
    post01Title: 'Test 1 - Crear y asignar',
    post01Description:
      'Los tests son la forma más cómoda de evaluar los conocimientos de un alumno. Con Leemons, los profesores pueden crear infinitos tests a partir de un banco de preguntas, variando el nivel de dificultad y las categorías de temas a validar.',
    post02Title: 'Test 2 - Ejecución y evaluación',
    post02Description:
      'Ahora que has asignado el test, vamos a mostarte cómo ejecuta el alumno la prueba y la revisa una vez finalizada para seguir aprendiendo. Conocerás también todas las opciones de evaluación y feedback.',
  },
};

const TeacherEvaluationGuide = ({ locale = 'en', loginUrl = '{{it.loginUrl}}' }) => {
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
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher01_560c134dcb.png"
        />
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step01Description02,
          }}
        ></Text>
      </Container>
      <Container className="text-center text-[14px] leading-5">
        <Text className="text-[16px] font-bold">{messages[locale].qtype01Title}</Text>
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].qtype01Description,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher02_62f3124a62.png"
        />
      </Container>
      <Container className="text-center text-[14px] leading-5 mt-2">
        <Text className="text-[16px] font-bold">{messages[locale].qtype02Title}</Text>
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].qtype02Description,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher03_08eb33a58e.png"
        />
      </Container>
      <Container className="text-center text-[14px] leading-5 mt-2">
        <Text className="text-[16px] font-bold">{messages[locale].qtype03Title}</Text>
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].qtype03Description,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher04_e834fb2aaf.png"
        />
      </Container>
      <Container className="text-[14px] leading-5 text-center">
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step01Description03,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher05_ef772054cb.png"
        />
      </Container>
      <Container className="text-center mt-6">
        <Text className="text-[20px] font-bold">{messages[locale].step02More}</Text>
        <Text className="text-[14px] leading-5">{messages[locale].step03More}</Text>
        <Section>
          <Row>
            <Column className="align-top bg-white border border-solid border-gray-200">
              <Link
                className="text-[#343A3F]"
                href="https://www.leemons.io/academy-post/questions-banks"
              >
                <Img
                  className="w-[250px] mx-auto"
                  src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/post00_c80b42bac7.png"
                />
                <Container className="text-left p-4 pt-0">
                  <Text className="text-[18px] leading-5 font-bold">
                    {messages[locale].post00Title}
                  </Text>
                  <Text className="text-[14px] leading-5">
                    {messages[locale].post00Description}
                  </Text>
                </Container>
              </Link>
            </Column>
          </Row>
        </Section>
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
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher06_eeeb18650d.png"
        />
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step02Description02,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher07_6ca91a12fd.png"
        />
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step02Description03,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher08_705f00898e.png"
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
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher09_e4ce0859dd.png"
        />
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step03Description02,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher10_99fbbeafb4.png"
        />
      </Container>
      <Container className="text-center text-[14px] leading-5 mt-8">
        <Text className="text-[20px] font-bold">{messages[locale].step04Title}</Text>
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step04Description,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher11_4334906e1c.png"
        />
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step04Description02,
          }}
        ></Text>
      </Container>
      <Container className="text-center mt-2">
        <Text className="text-[20px] font-bold">{messages[locale].step02More}</Text>
        <Text className="text-[14px] leading-5">{messages[locale].step03More}</Text>
        <Section>
          <Row>
            <Column className="w-[48%] align-top text-left bg-white border border-solid border-gray-200">
              <Link
                className="text-[#343A3F]"
                href="https://www.leemons.io/academy-post/test-quizzes-1-create-and-assign"
              >
                <Img
                  className="w-full"
                  src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/post01_a7f1caa13d.png"
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
                href="https://www.leemons.io/academy-post/test-quizzes-2-execution-and-evaluation"
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
      <Container className="text-center mt-6">
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

TeacherEvaluationGuide.propTypes = {
  locale: PropTypes.string,
  loginUrl: PropTypes.string,
};

export { TeacherEvaluationGuide };
export default TeacherEvaluationGuide;
