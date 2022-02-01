module.exports = {
  welcome_page: {
    page_title: 'Tareas',
    page_description:
      'Gracias al módulo de tareas puedes crear nuevas tareas, asignarlas a grupos de estudiantes o individuos, controlar su estado actual e iniciar evaluaciones de las tareas completadas.',
    hide_info_label: `Ok, ya lo tengo. Cuando la configuración esté completa, no muestres más esta información`,
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
          buttonNext: 'Siguiente',
        },
        descriptions: {
          tagline: '...',
        },
        placeholders: {
          tagline: '...',
        },
        helps: {
          tagline: '...',
        },
        errorMessages: {
          tagline: { required: 'Campo requerido' },
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
          buttonNext: 'Siguiente',
          buttonPrev: 'Anterior',
        },
        helps: {
          methodology: '...',
        },
        errorMessages: {
          methodology: { required: 'Campo requerido' },
        },
      },
      instructionData: {
        step_label: 'Instrucciones',
        labels: {
          title: 'Instrucciones',
          forTeacher: 'Instrucciones para Profesores',
          forStudent: 'Instructions para Estudiantes',
          buttonNext: 'Siguiente',
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
};
