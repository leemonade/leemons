module.exports = {
  welcome_page: {
    page_title: 'Tareas',
    page_description:
      'Gracias al módulo de tareas puedes crear nuevas tareas, asignarlas a grupos de estudiantes o individuos, controlar su estado actual e iniciar evaluaciones de las tareas completadas.',
    hide_info_label: `Ok, ya lo tengo. Cuando la configuración esté completa, no muestres más esta información`,
    step_profiles: {
      title: 'Vincular perfiles',
      description: 'Identifica que perfiles coinciden con los profesores y estudiantes',
      btn: 'Vincular perfiles',
    },
    step_library: {
      title: 'Biblioteca de tareas',
      description:
        'Crea nuevas tareas y asignarlas o revisa las creadas en la biblioteca de tareas.',
      btn: 'Crear tarea',
    },
    step_ongoing: {
      title: 'Tareas en curso',
      description:
        'Revisa las tareas en curso y controla su estado. También puede iniciar la corrección de las tareas completadas.',
      btn: 'Ver tareas en curso',
    },
    step_history: {
      title: 'Historial',
      description: `Ver tareas completadas, sus evaluaciones y los comentarios del estudiante.`,
      btn: 'Ver historial de tareas',
    },
  },
  library_page: {
    page_title: 'Biblioteca de Tareas',
  },
  task_setup_page: {
    title: 'Crear nueva tarea',
    edit_title: 'Editar tarea',
    common: {
      select_center: 'Seleccionar centro',
      create_done: 'Tarea creada',
      update_done: 'Tarea actualizada',
    },
    setup: {
      title: 'Crear nueva tarea',
      editTitle: 'Editar tarea',
      configData: {
        step_label: 'Config',
        labels: {
          title: 'Config',
          tagline: 'Tagline',
          name: 'Nombre',
          program: 'Programa',
          course: 'Curso',
          subjects: 'Asignaturas',
          subject: 'Asignatura',
          level: 'Nivel',
          summary: 'Resumen',
          tags: 'Etiquetas',
          buttonNext: 'Siguiente',
        },
        placeholders: {
          name: 'Nombre de la tarea',
          tagline: '...',
          program: 'Seleccionar...',
          course: 'Seleccionar...',
          subject: 'Seleccionar...',
          addSubject: 'Añadir materia',
          level: 'Seleccionar...',
          summary: '¿De qué trata esta tarea?',
          tags: 'Escribe una etiqueta',
        },
        errorMessages: {
          tagline: { required: 'Campo requerido' },
          program: { required: 'Campo requerido' },
          course: { required: 'Campo requerido' },
          subject: { required: 'Campo requerido' },
          level: { required: 'Campo requerido' },
          summary: { required: 'Campo requerido' },
          tags: { required: 'Campo requerido' },
        },
      },
      designData: {
        step_label: 'Diseño',
        labels: {
          title: 'Diseño',
          color: 'Color',
          cover: 'Imagen de portada',
          buttonNext: 'Siguiente',
          buttonPrev: 'Anterior',
        },
        placeholders: {
          color: 'Selecciona un color',
          cover: 'Subir o seleccionar de la Biblioteca',
        },
        errorMessages: {
          color: { required: 'Campo requerido' },
          cover: { required: 'Campo requerido' },
        },
      },
      contentData: {
        step_label: 'Contenido',
        labels: {
          title: 'Contenido',
          methodology: 'Metodología',
          recommendedDuration: 'Duración recomendada',
          buttonNext: 'Siguiente',
          buttonPrev: 'Anterior',
        },
        errorMessages: {
          methodology: { required: 'Campo requerido' },
          recommendedDuration: { required: 'Campo requerido' },
        },
      },
      instructionData: {
        step_label: 'Instrucciones',
        labels: {
          title: 'Instrucciones',
          forTeacher: 'Instrucciones para Profesores',
          forStudent: 'Instructions para Estudiantes',
          buttonPublish: 'Solo publicar',
          buttonNext: 'Publicar y asignar',
          buttonPrev: 'Anterior',
        },
        placeholders: {
          forTeacher:
            'Ayuda a otros profesores a abordar este ejercicio con unas sencillas instrucciones.',
          forStudent:
            'Aquí puedes incluir información extra para ayudar al alumno a realizar mejor el ejercicio.',
        },
        errorMessages: {
          forTeacher: { required: 'Campo requerido' },
          forStudent: { required: 'Campo requerido' },
        },
      },
      publishData: {
        step_label: 'Publicar',
        labels: {
          title: 'Publicar y asignar',
          description:
            'Ahora puedes guardar esta actividad en tu biblioteca para utilizarla cuando quieras o, en el mismo paso, asignarla a tus alumnos para que la realicen.',
          assign: 'Assign later to students',
          buttonNext: 'Publicar tarea',
          buttonPrev: 'Anterior',
        },
      },
    },
  },
  assignment_form: {
    labels: {
      assignTo: 'Asignar a',
      classroomToAssign: 'Asignar a la clase',
      studentToAssign: 'Asignar al estudiante',
      mode: 'Modo',
      startDate: 'Fecha de inicio',
      deadline: 'Fecha límite',
      visualizationDate: 'Visible con antelación',
      limitedExecution: 'Tiempo limitado',
      messageToStudents: 'Mensaje para los estudiantes',
      submit: 'Asignar',
    },
    placeholders: {
      date: 'dd/mm/aaaa',
      time: 'hh:mm',
      units: 'unidades',
    },
    descriptions: {
      messageToStudents:
        'Si asignas esta tarea a otros grupos en este paso, este mensaje será el mensaje predeterminado para todas las tareas (aunque puedes cambiarlo individualmente si lo deseas).',
    },
    assignTo: {
      student: 'Estudiante',
      class: 'Clase',
    },
    modes: {
      individual: 'Individual',
      pairs: 'En parejas',
      groups: 'Equipos',
    },
    timeUnits: {
      hours: 'horas',
      minutes: 'minutos',
      days: 'días',
    },
  },
  profiles_page: {
    page_title: 'Tareas - Configuración de perfiles',
    page_description:
      'En primer lugar, debemos vincular los perfiles del sistema con los perfiles personalizados que has creado en la plataforma. (Por favor, lee atentamente las características de cada perfil. Una vez vinculados los perfiles, no se puede deshacer)',
    save: 'Guardar',
    profileSaved: 'Perfiles guardados',
    profiles: 'Perfiles',
    teacher: 'Profesor',
    teacherDescription: 'Responsable de la creación y asignación de tareas',
    teacherRequired: 'Campo requerido',
    student: 'Estudiante',
    studentDescription: 'Se le asignarán las tareas y será responsable de ejecutarlas',
    studentRequired: 'Campo requerido',
  },
};
