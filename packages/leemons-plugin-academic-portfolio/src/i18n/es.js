module.exports = {
  welcome_page: {
    page_title: 'Portafolio Académico',
    page_description:
      'El portafolio permite crear programas o etapas educativas y añadir asignaturas con curso, grupo, profesores... dentro de esta información, creamos un árbol visual para poder gestionar el portafolio, asignar alumnos, crear clusters, editar reglas y mucho más',
    hide_info_label: `Ok, ya lo tengo. Cuando la configuración esté completa, no muestres más esta información`,
    step_programs: {
      title: `Crear programas`,
      description:
        'Primaria, Secundaria, Bachillerato, Máster... define los programas y cursos que se ofrecen en tu organización',
      btn: 'Crear programas',
    },
    step_subjects: {
      title: 'Añadir asignaturas',
      description:
        'Con carga masiva o manualmente, crea tu portafolio de asignaturas relacionadas con un programa y curso específico.',
      btn: 'Añadir asignaturas',
    },
    step_tree: {
      title: 'Gestiona tu portafolio académico',
      description:
        'Define el tipo de árbol para tu sistema educativo específico y asiste a los estudiantes, crea grupos o edita la información',
      btn: 'Crea tu árbol',
    },
  },
  programs_page: {
    page_title: 'Programas de aprendizaje',
    page_description:
      'Primaria, Secundaria, Bachillerato, Máster... define los programas y cursos que se ofrecen en tu organización. Si no tiene etapas tradicionales, puede crear programas o cursos simples en su lugar',
    setup: {
      title: 'Configurar un nuevo programa',
      basic_data: {
        step_label: 'Datos básicos',
        labels: {
          title: 'Datos básicos',
          name: 'Nombre del programa',
          abbreviation: 'Abreviatura/acrónimo del programa:',
          creditSystem: 'No es necesario el sistema de créditos',
          credits: 'Total de créditos',
          oneStudentGroup: 'Este programa sólo tiene un grupo de estudiantes',
          groupsIDAbbrev: 'Abreviatura del ID del grupo',
          maxGroupAbbreviation: 'Longitud máxima de la abreviatura de los grupos:',
          maxGroupAbbreviationIsOnlyNumbers: 'Sólo números',
          buttonNext: 'Siguiente',
        },
        descriptions: {
          maxGroupAbbreviation:
            'Si necesita crear más de un grupo de estudiantes (aulas) por asignatura, esta configuración le permite definir el formato de ID alfanumérico.',
        },
        placeholders: {
          name: 'Mi impresionante programa',
          abbreviation: 'HIGSxxxx',
        },
        helps: {
          abbreviation: '(8 char. max)',
          maxGroupAbbreviation: '(i.e: G01, G02, G03...)',
        },
      },
      courses_data: {
        step_label: 'Cursos',
        labels: {
          title: 'Cursos',
          oneCourseOnly: 'Este programa tiene un solo curso',
          hideCoursesInTree:
            'Cursos ocultos en el árbol (no asignaturas anidadas detrás de los cursos)',
          moreThanOneAcademicYear: 'La misma asignatura puede ofrecerse en más de un año académico',
          maxNumberOfCourses: 'Número de cursos',
          courseCredits: 'Créditos por curso',
          courseSubstage: 'Subetapas del curso',
          haveSubstagesPerCourse: 'No hay substages por curso',
          substagesFrequency: 'Frecuencia',
          numberOfSubstages: 'Número de subestadios',
          subtagesNames: 'Nombre de los subestadios',
          useDefaultSubstagesName: 'Utilizar el nombre y la abreviatura por defecto',
          maxSubstageAbbreviation: 'Longitud máxima de la abreviatura',
          maxSubstageAbbreviationIsOnlyNumbers: 'Sólo números',
          buttonNext: 'Siguiente',
          buttonPrev: 'Anterior',
        },
        placeholders: {
          substagesFrequency: 'Seleccione la frecuencia...',
        },
      },
      subjects_data: {
        step_label: 'Asignaturas',
        labels: {
          title: 'Asignaturas',
          standardDuration: 'Duración estándar de las asignaturas',
          allSubjectsSameDuration:
            'Todas las asignaturas tienen la misma duración que la subsede de evaluación',
          numberOfSemesters: 'Número de semestres',
          periodName: 'Nombre del periodo',
          numOfPeriods: 'N. períodos',
          substagesFrequency: 'Frecuencia',
          knowledgeAreas: 'Abreviatura de las áreas de conocimiento',
          maxKnowledgeAbbreviation: 'Longitud máxima de la abreviatura de las áreas:',
          maxKnowledgeAbbreviationIsOnlyNumbers: 'Sólo números',
          subjectsIDConfig: 'Configuración del ID de los sujetos',
          subjectsFirstDigit: 'Primer dígito',
          subjectsDigits: 'Dígitos',
          buttonNext: 'Guardar programa',
          buttonPrev: 'Anterior',
          buttonAdd: 'Añadir',
          buttonRemove: 'Quitar',
        },
        helps: {
          maxKnowledgeAbbreviation: '(i.e: MKTG, MATH, HIST...)',
        },
      },
    },
  },
};
