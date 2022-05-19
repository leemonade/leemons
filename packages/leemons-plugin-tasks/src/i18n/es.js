module.exports = {
  welcome_page: {
    page_title: 'Tareas',
    page_description:
      'El módulo de tareas permite crear nuevas actividades, asignarlas a grupos de estudiantes o individuos, controlar su estado en todo momento y evaluarlas una vez completadas.',
    hide_info_label: `¡Entendido!. No mostrar más, una vez finalizada la configuración.`,
    step_profiles: {
      title: 'Conectar perfiles',
      description: 'Es necesario conectar los perfiles de la aplicación Tareas con los existentes en el sistema (solo será necesario indicar esta información una vez).',
      btn: 'Conectar perfiles',
    },
    step_library: {
      title: 'Biblioteca de tareas',
      description:
        'El listado de tareas permite encontrar actividades para asignarlas, editarlas o duplicarlas.',
      btn: 'Crear nueva tarea',
    },
    step_ongoing: {
      title: 'Tareas en curso',
      description:
        'El listado de tareas asignadas a los estudiantes muestra el estado de cada tarea en el ciclo de vida de su ejecución. Una vez finalizadas, también permite realizar la corrección de las mismas.',
      btn: 'Ver tareas en curso',
    },
    step_history: {
      title: 'Histórico',
      description: `Listado de tareas finalizadas y cerradas con acceso a sus evaluaciones y los comentarios de los estudiantes.`,
      btn: 'Ver histórico de tareas',
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
      create_done: 'Tarea creada con éxito',
      update_done: 'Tarea actualizada con éxito',
      publish_done: 'Tarea publicada con éxito',
    },
    setup: {
      title: 'Crear nueva tarea',
      editTitle: 'Editar tarea',
      basicData: {
        step_label: 'Datos básicos',
        labels: {
          name: 'Nombre',
          tagline: 'Subtítulo',
          description: 'Resumen',
          buttonNext: 'Siguiente',
        },
        placeholders: {
          name: 'Nombre',
          tagline: 'Subtítulo',
          description: '¿De qué trata esta tarea?',
        },
        errorMessages: {
          name: { required: 'Campo necesario' },
          tagline: { required: 'Campo necesario' },
          description: { required: 'Campo necesario' },
        },
      },
      configData: {
        step_label: 'Configuración',
        labels: {
          title: 'Configuración',
          center: 'Centro',
          program: 'Programa',
          course: 'Curso',
          subjects: 'Asignaturas',
          subject: 'Asignatura',
          level: 'Nivel',
          buttonNext: 'Siguiente',
          buttonPrev: 'Anterior',
          preTask: {
            toggler: 'Añadir una actividad previa',
            mandatory: 'Obligatoria para empezar la Tarea',
            condition: 'Condición',
            conditions: {
              take: 'Realizar sólo el Test',
              greater: 'Aprobar el Test con una nota igual o superior a',
            },
          },
        },
        placeholders: {
          center: 'Seleccionar...',
          program: 'Seleccionar...',
          course: 'Seleccionar...',
          subject: 'Seleccionar...',
          addSubject: 'Añadir asignatura',
          level: 'Seleccionar...',
        },
        errorMessages: {
          program: { required: 'Campo necesario' },
          course: { required: 'Campo necesario' },
          subject: { required: 'Campo necesario' },
          level: { required: 'Campo necesario' },
        },
      },
      contentData: {
        step_label: 'Contenido',
        labels: {
          title: 'Contenido',
          methodology: 'Metodología',
          recommendedDuration: 'Duración recomendada',
          statement: 'Enunciado',
          buttonNext: 'Siguiente',
          buttonPrev: 'Anterior',
        },
        errorMessages: {
          methodology: { required: 'Campo necesario' },
          recommendedDuration: { required: 'Campo necesario' },
          development: { required: 'Campo necesario' },
          statement: { required: 'Campo necesario' },
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
            'Información extra para ayudar al alumno a realizar mejor el ejercicio.',
        },
        errorMessages: {
          forTeacher: { required: 'Campo necesario' },
          forStudent: { required: 'Campo necesario' },
        },
      },
      publishData: {
        step_label: 'Publicar',
        labels: {
          title: 'Publicar y asignar',
          description:
            'Guardar esta actividad en la biblioteca para reutilizar o asignar a los alumnos para que la realicen.',
          assign: 'Asignar más tarde',
          buttonNext: 'Publicar tarea',
          buttonPrev: 'Anterior',
        },
      },
    },
  },
  assignment_page: {
    page_title: 'Asignar tarea',
  },
  assignment_form: {
    labels: {
      assignTo: 'Asignar a',
      classroomToAssign: 'Asignar a una clase',
      studentToAssign: 'Asignar a un estudiante',
      mode: 'Modo',
      startDate: 'Fecha de inicio',
      deadline: 'Fecha límite',
      visualizationDateToogle: 'Visible con antelación',
      visualizationDate: 'Fecha de visualización',
      limitedExecutionToogle: 'Tiempo limitado',
      limitedExecution: 'Tiempo de ejecución',
      messageToStudentsToogle: 'Añadir un mensaje para los estudiantes',
      messageToStudents: 'Mensaje para los estudiantes',
      submit: 'Asignar',
      add: 'Añadir',
    },
    placeholders: {
      date: 'dd/mm/aaaa',
      time: 'hh:mm',
      units: 'unidades',
    },
    descriptions: {
      messageToStudents:
        'Mensaje predeterminado para la tarea (es posible cambiarlo individualmente en cada asignación).',
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
    page_title: 'Tareas - Conectar perfiles',
    page_description:
      'Es necesario conectar los perfiles de la aplicación Tareas con los existentes en el sistema (solo será necesario indicar esta información una vez). Una vez conectados los perfiles, esta acción no se podrá deshacer.',
    save: 'Guardar',
    loadFromAP: 'Cargar perfiles desde el Portafolio',
    profileSaved: 'Perfiles guardados con éxito',
    profiles: 'Perfiles',
    teacher: 'Profesor',
    teacherDescription: 'Responsable de la creación y asignación de tareas',
    teacherRequired: 'Campo necesario',
    student: 'Estudiante',
    studentDescription: 'Se le asignarán las tareas y será responsable de ejecutarlas',
    studentRequired: 'Campo necesario',
  },
  ongoing_page: {
    page_title: 'Tareas en curso',
  },
  history_page: {
    page_title: 'Tareas finalizadas',
  },
  teacher_assignments: {
    table: {
      headers: {
        group: 'Grupo',
        task: 'Tarea',
        deadline: 'Fecha límite',
        students: 'Estudiantes',
        status: 'Estado',
        open: 'Abierta',
        ongoing: 'En curso',
        completed: 'Completada',
        actions: 'Acciones',
      },
    },
  },
  tabStudentTasks: {
    label: 'Tareas y actividades',
  },
};
