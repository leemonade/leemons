import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Text, Link, Img, Section, Row, Column } from '@react-email/components';
import EmailLayout from '@leemons/emails/src/emails/EmailLayout.jsx';

const messages = {
  en: {
    title: 'Hello, teacher!',
    infoText:
      'Now that you have activated your account, we will accompany you in your first steps through Leemons so that you discover the fantastic tools we have developed for you.',
    actionText: 'Start by accessing your campus:',
    buttonText: 'Go to Leemons',
    alternativeActionText:
      'If the previous button does not work, copy and paste the following link into your browser:',
    supportText: 'Have you had any issues?',
    supportContactText: 'Contact our incredible team.',
    supportButtonText: 'Support Center',
    step01Title: '1. Explore the teacher dashboard and customize your profile',
    step01Description:
      '<p>When you access the platform you will find a somewhat empty dashboard, you will have to fill it!.</p><p>But first, let us tell you what you can find: at the top, the subjects you teach will appear. By clicking on them you will enter each of the classes and you will be able to connect with the students, finding in the future detailed information about their tasks and progress.</p>',
    step01Description02:
      'When creating your account, the administrator includes all your information. You can consult it by choosing the "Account Information" option in your profile menu (bottom left area of the screen).',
    step01Description03:
      'From here you can consult the information for the different profiles you have on the platform. If you wish, you can modify your avatar photo by clicking on it.',
    step02Title: '2. Get to know the library and upload some resources',
    step02Description:
      "<p>The management of knowledge and the effective organization of the contents and activities that are part of the teachers' classes is key.</p><p>At Leemons we know this and have built a content library unlike any other, with a tagging tool adapted to the needs of a regulated curricular model (subjects and courses) as well as the flexibility of more open educational models or teaching programs.</p><p>The Leemons library looks different for students and teachers.</p>",
    step02Description02:
      '<p>Teachers not only store content and resources in the library, but they can also use Leemons tools to create activities: tasks, question banks and quizzes, surveys, modules...</p><p>The easiest way to start exploring the library is to upload some files.</p>',
    step02Description03:
      'To upload a resource, go to the library section corresponding to the type of element you want to create, in this case Resource, and click on the "New resource" option. It can also be done from any section by accessing the New button in the top left area.',
    step02More: 'Learn more...',
    step03Title: '3. Create a bookmark and a document',
    step03Description:
      '<p>One of the main headaches of digital teaching is <strong>knowing where all the resources we need to use daily are located</strong>. Bookmarks allow linking external content to Leemons and organizing them in a simple and accessible way.</p><p>The Bookmarks tool allows you to save links to websites, tag them, organize them by subjects, and share them with other colleagues, students, or teachers.</p>',
    step03Description02:
      '<p>Leemons has its own HTML 5 document creation tool which, connected to the library, allows designing content quickly and easily.</p><p>To create a new document, just click on the New document option of the corresponding library section or press the New button in the top left corner and choose "Document" from the dropdown menu.</p><p>Leemons will open a new blank file where you can start writing and formatting your content.</p>',
    step03More:
      'You can now start using Leemons. If you want to learn more about how to create content and activities, we recommend these articles from Leemons Academy:',
    nextStepTitle: 'We continue accompanying you',
    nextStepDescription:
      'Tomorrow we will send you a new email to talk to you about Tasks, <strong>a tool for designing assessable activities</strong> that will make your life much easier.',
    learnMore: "If you don't want to wait...",
    stepByStepHelp: 'Find the help you need, step by step at:',
    leemonsAcademyButton: 'Leemons Academy',
    featureLibraryTitle: 'The Library',
    featureLibraryDescription:
      'We have built a content library like no other, with a tagging tool adapted to your subjects and courses. To save your multimedia resources, content, activities, exams, surveys in the cloud and reuse them whenever you need.',
    featureBookmarkTitle: 'Bookmarks',
    featureBookmarkDescription:
      'A recurring problem for teachers and students is having resources organized in one place. Leemons bookmarks are the answer to save, locate, and reuse, and it can be shared with other users to always be coordinated.',
    featureMediaTitle: 'Multimedia Resources',
    featureMediaDescription:
      'Resources are all those materials and content you want to use in your classes: videos, audios, images, PDF files, the images you use for the templates of the worksheets or the icons of your topics. All of this is stored in the cloud so you can use it whenever you want.',
    featureDocumentTitle: 'Create Documents',
    featureDocumentDescription:
      'A list of irregular verbs, the steps to carry out an experiment, a reflection on Sense and Sensibility, some calculation exercises, second-degree equations, a sales manual... now you can easily create them without leaving the platform with the Content Creator.',
  },
  es: {
    title: '¡Hola, profe!',
    infoText:
      'Ahora que ya has activado tu cuenta, vamos a acompañarte en tus primeros pasos por Leemons para que descubras las fantásticas herramientas que hemos desarrollado para ti.',
    actionText: 'Comienza accediendo a tu campus:',
    buttonText: 'Ir a Leemons',
    alternativeActionText:
      'Si el botón anterior no funciona, copia y pega el siguiente enlace en tu navegador:',
    supportText: '¿Has tenido algún problema?',
    supportContactText: 'Contacta con nuestro increíble equipo.',
    supportButtonText: 'Centro de soporte',
    step01Title: '1. Explora el dashboard de profe y personaliza tu perfil',
    step01Description:
      '<p>Cuando accedas a la plataforma encontrarás un panel de mando algo vacío, ¡tendrás que rellenarlo!.</p><p>Pero, primero, te contamos qué puedes encontrar: en la zona superior aparecerán las asignaturas en las que impartes clase. Pulsando sobre ellas entrarás a cada una de las clases y podrás conectar con los alumnos, encontrando en el futuro información en detalle sobre sus tareas y progreso.</p>',
    step01Description02:
      'A la hora de crear tu cuenta, el administrador incluye toda tu información. Puedes consultarla escogiendo la opción "Información de la cuenta" en tu menú de perfil (zona inferior izquierda de la pantalla).',
    step01Description03:
      'Desde aquí puedes consultar la información para los distintos perfiles que tienes en la plataforma. Si lo deseas puedes modificar tu foto de avatar pulsando sobre ella.',
    step02Title: '2. Conoce la la biblioteca y sube algunos recursos',
    step02Description:
      '<p>La gestión del conocimiento y la organización eficaz de los contenidos y actividades que forman parte de las clases de los profesores es clave.</p><p>En Leemons lo sabemos y hemos construido una biblioteca de contenidos diferente a cualquier otra, con una herramienta de etiquetado adaptada tanto a las necesidades de un modelo curricular reglado (asignaturas y cursos) como a la flexibilidad de modelos educativos o programas docentes más abiertos.</p><p>La biblioteca Leemons tiene un aspecto diferente para estudiantes y profesores.</p>',
    step02Description02:
      '<p>Los profesores no sólo almacenan contenidos y recursos en la biblioteca, sino que también pueden utilizar las herramientas de Leemons para crear actividades: tareas, bancos de preguntas y cuestionarios, encuestas, módulos...</p><p>La forma más fácil de empezar a explorar la biblioteca es subir algunos archivos.</p>',
    step02Description03:
      'Para cargar un recurso, acceda a la sección de la biblioteca correspondiente al tipo de elemento que desea crear, en este caso Recurso y pulsa sobre la opción "Nuevo recurso". También se puede hacer desde cualquier sección accediendo al botón Nuevo de la zona superior izquierda.',
    step02More: 'Saber más...',
    step03Title: '3. Crea un marcador y un documento',
    step03Description:
      '<p>Uno de los principales quebraderos de cabeza de la enseñanza digital es <strong>saber dónde se encuentran todos los recursos que necesitamos utilizar a diario</strong>. Los marcadores permiten enlazar contenidos externos a Leemons y organizarlos de forma sencilla y accesible.</p><p>La herramienta Marcadores permite guardar enlaces a sitios web, etiquetarlos, organizarlos por materias y compartirlos con otros compañeros, alumnos o profesores.</p>',
    step03Description02:
      '<p>Leemons cuenta con su propia herramienta de creación de documentos en formato HTML 5 que, conectada a la biblioteca, permite diseñar contenidos de forma rápida y sencilla.</p><p>Para crear un nuevo documento, basta con hacer clic en la opción Nuevo documento de la sección correspondiente de la biblioteca o pulsar el botón Nuevo de la esquina superior izquierda y elegir "Documento" en el menú desplegable.</p><p>Leemons abrirá un nuevo archivo en blanco donde podrás empezar a escribir y dar formato a tu contenido.</p>',
    step03More:
      'Ya puedes empezar a utilizar Leemons. Si quieres aprender más sobre cómo crear contenidos y actividades, te recomendamos estos artículos de Leemons Academy:',
    nextStepTitle: 'Seguimos acompañándote',
    nextStepDescription:
      'Mañana te enviaremos un nuevo correo para hablarte de Tareas, <strong>una herramienta de diseño de actividades evaluables</strong> que te va a hacer la vida mucho más fácil.',
    learnMore: 'Si no quieres esperar...',
    stepByStepHelp: 'Encuentra la ayuda que necesitas, paso a paso en:',
    leemonsAcademyButton: 'Leemons Academy',
    featureLibraryTitle: 'La Biblioteca',
    featureLibraryDescription:
      'Hemos construido una biblioteca de contenidos como ninguna otra, con una herramienta de etiquetado adaptada a tus asignaturas y cursos. Para guardar en la nube tus recursos multimedia, contenidos, actividades, exámenes, encuestas y reutilizarlos cuando lo necesites.',
    featureBookmarkTitle: 'Marcapáginas',
    featureBookmarkDescription:
      'Es un problema recurrente para profes y alumnos es tener los recursos organizados en un solo sitio. Los marcapáginas de Leemons son la respuesta para guardar, localizar y reutilizar, y se puede compartir con otros usuarios para estar siempre coordinados.',
    featureMediaTitle: 'Recursos multimedia',
    featureMediaDescription:
      'Los recursos son todos aquellos materiales y contenidos que quieras utilizar en tus clases: vídeos, audios, imágenes, archivos PDF, las imágenes que utilizas para las plantillas de las fichas o los iconos de tus temas. Todo ello se almacena en la nube para que puedas utilizarlo siempre que quieras.',
    featureDocumentTitle: 'Crear Documentos',
    featureDocumentDescription:
      'Una lista de verbos irregulares, los pasos para realizar un experimento, una reflexión sobre Sentido y sensibilidad, unos ejercicios de cálculo, ecuaciones de segundo grado, un manual de ventas... ahora puedes crearlos fácilmente y  sin salir de la plataforma con el Creador de contenidos.',
  },
};

const TeacherFirstStepsGuideFree = ({ locale = 'en', loginUrl = '{{it.loginUrl}}' }) => {
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
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher01_c9c0751a54.png"
        />
        <Text className="text-[14px] leading-5">{messages[locale].step01Description02}</Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher02_bba439b45a.png"
        />
        <Text className="text-[14px] leading-5">{messages[locale].step01Description03}</Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher03_06672a1edc.png"
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
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher04_434cc08e03.png"
        />
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step02Description02,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher05_4cea31a291.png"
        />
        <Text className="text-[14px] leading-5">{messages[locale].step02Description03}</Text>
      </Container>
      <Container className="text-center mt-4">
        <Text className="text-[20px] font-bold">{messages[locale].step02More}</Text>
        <Section>
          <Row>
            <Column className="w-[48%] align-top text-left bg-white border border-solid border-gray-200">
              <Link
                className="text-[#343A3F]"
                href="https://www.leemons.io/academy-post/the-amazing-leemons-library"
              >
                <Img
                  className="w-full"
                  src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/admin_feat_01_f7284219e5.jpg"
                />
                <Container className="p-4">
                  <Text className="text-[18px] leading-5 font-bold">
                    {messages[locale].featureLibraryTitle}
                  </Text>
                  <Text className="text-[14px] leading-5">
                    {messages[locale].featureLibraryDescription}
                  </Text>
                </Container>
              </Link>
            </Column>
            <Column className="w-[4%]" />
            <Column className="w-[48%] align-top text-left bg-white border border-solid border-gray-200">
              <Link
                className="text-[#343A3F]"
                href="https://www.leemons.io/academy-post/adding-resources"
              >
                <Img
                  className="w-full"
                  src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/media_files_4f0e63a89d.png"
                />
                <Container className="p-4">
                  <Text className="text-[18px] leading-5 font-bold">
                    {messages[locale].featureMediaTitle}
                  </Text>
                  <Text className="text-[14px] leading-5">
                    {messages[locale].featureMediaDescription}
                  </Text>
                </Container>
              </Link>
            </Column>
          </Row>
        </Section>
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
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher06_86ec9e86ad.png"
        />
        <Text
          dangerouslySetInnerHTML={{
            __html: messages[locale].step03Description02,
          }}
        ></Text>
        <Img
          className="w-full"
          src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/teacher07_53448698f5.png"
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
                href="https://www.leemons.io/academy-post/creating-bookmarks"
              >
                <Img
                  className="w-full"
                  src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/admin_feat_02_093cae1766.jpg"
                />
                <Container className="p-4">
                  <Text className="text-[18px] leading-5 font-bold">
                    {messages[locale].featureBookmarkTitle}
                  </Text>
                  <Text className="text-[14px] leading-5">
                    {messages[locale].featureBookmarkDescription}
                  </Text>
                </Container>
              </Link>
            </Column>
            <Column className="w-[4%]" />
            <Column className="w-[48%] align-top text-left bg-white border border-solid border-gray-200">
              <Link
                className="text-[#343A3F]"
                href="https://www.leemons.io/academy-post/content-creator"
              >
                <Img
                  className="w-full"
                  src="https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/document_155fcd8846.png"
                />
                <Container className="p-4">
                  <Text className="text-[18px] leading-5 font-bold">
                    {messages[locale].featureDocumentTitle}
                  </Text>
                  <Text className="text-[14px] leading-5">
                    {messages[locale].featureDocumentDescription}
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

TeacherFirstStepsGuideFree.propTypes = {
  locale: PropTypes.string,
  loginUrl: PropTypes.string,
};

export { TeacherFirstStepsGuideFree };
export default TeacherFirstStepsGuideFree;
