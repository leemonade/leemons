module.exports = {
  tableInput: {
    add: 'Añadir',
    remove: 'Eliminar',
    edit: 'Editar',
    accept: 'Aceptar',
    cancel: 'Cancelar',
    required: 'Campo requerido',
    actions: 'Acciones',
  },
  methodology: {
    directInstruction: 'Instrucción directa',
    flippedClassroom: 'Aula invertida',
    projectBasedLearning: 'Aprendizaje basado en proyectos',
    inquiryBasedLearning: 'Aprendizaje basado en investigación',
    expeditionaryLearning: 'Aprendizaje de campo',
    cooperativeLearning: 'Aprendizaje cooperativo',
    personalizedLearning: 'Aprendizaje personalizado',
    gameBasedLearning: 'Aprendizaje basado en juegos',
    kinestheticLearning: 'Aprendizaje kinestésico',
    differentiatedInstruction: 'Instrucción diferenciada',
    other: 'Otro',
  },
  welcome_page: {
    page_title: 'Tareas',
    page_description:
      'El módulo de tareas permite crear nuevas actividades, asignarlas a grupos de estudiantes o individuos, controlar su estado en todo momento y evaluarlas una vez completadas.',
    hide_info_label: '¡Entendido!. No mostrar más, una vez finalizada la configuración.',
    step_profiles: {
      title: 'Conectar perfiles',
      description:
        'Es necesario conectar los perfiles de la aplicación Tareas con los existentes en el sistema (solo será necesario indicar esta información una vez).',
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
      description:
        'Listado de tareas finalizadas y cerradas con acceso a sus evaluaciones y los comentarios de los estudiantes.',
      btn: 'Ver histórico de tareas',
    },
  },
  library_page: {
    page_title: 'Biblioteca de tareas',
    published: 'Publicado',
    draft: 'Borrador',
  },
  task_setup_page: {
    title: 'Nueva tarea',
    subTitle: 'Título de la tarea',
    edit_title: 'Editar tarea',
    cancel: 'Cancelar',
    common: {
      select_center: 'Seleccionar centro',
      create_done: 'Tarea creada con éxito',
      update_done: 'Tarea actualizada con éxito',
      publish_done: 'Tarea publicada con éxito',
      no_id_error: 'No se ha provisto el id de la tarea',
      save: 'Guardar borrador',
      publish: 'Publicar',
      finish: 'Finalizar',
    },
    setup: {
      basicData: {
        step_label: 'Datos básicos',
        labels: {
          name: 'Nombre',
          tagline: 'Subtítulo',
          description: 'Descripción',
          buttonNext: 'Siguiente',
        },
        placeholders: {
          name: 'Nombre',
          tagline: 'Subtítulo',
          description: '¿De qué trata esta tarea?',
        },
        errorMessages: {
          name: {
            required: 'Campo necesario',
          },
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
          showOtherSubjects: 'Añadir otras asignaturas en las que colaboro',
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
          program: {
            required: 'Campo necesario',
          },
          course: {
            required: 'Campo necesario',
          },
          subject: {
            required: 'Campo necesario',
          },
          level: {
            required: 'Campo necesario',
          },
        },
      },
      contentData: {
        step_label: 'Contenido',
        labels: {
          title: 'Contenido',
          subjects: 'Curriculum por asignatura',
          methodology: 'Metodología',
          statement: 'Enunciado',
          development: 'Añadir desarrollo',
          statementAndDevelopmentTitle: 'Enunciado y desarrollo',
          supportImage: 'Imagen de apoyo',

          content: 'Contenidos',
          evaluation: 'Evaluación',
          other: 'Otros',
          addCustomObjectives: 'Añadir objetivos personalizados',
          addInstructions: 'Añadir instrucciones',
          addResources: 'Añadir recursos',
          enableCurriculum: 'Habilitar Curriculum',
          buttonNext: 'Siguiente',
          buttonPrev: 'Anterior',
          submission: {
            gradable: 'Esta tarea es calificable',
            title: 'Entregables',
            checkDescription:
              'Esta tarea require la entrega de algún tipo de archivo, documento o enlace',
            type: 'Tipo de entrega',
            types: {
              file: 'Archivo',
              link: 'Enlace',
            },
            description: 'Descripción',
            FileType: {
              multiFile: 'Permitir varios archivos',
              format: 'Formato de archivo',
              formatPlaceholder: 'Escribir extensión y añadir (pdf, xls, doc...)',
              maxSize: 'Tamaño máximo',
              required: 'Campo necesario',
            },
          },
        },
        errorMessages: {
          statement: {
            required: 'Campo necesario',
          },
        },
      },
      instructionData: {
        step_label: 'Recursos e instrucciones',
        labels: {
          title: 'Instrucciones',
          forTeacher: 'Instrucciones para Profesores',
          forStudent: 'Instructions para Estudiantes',
          recommendedDuration: 'Duración recomendada',
          buttonPublish: 'Solo publicar',
          buttonPublishAndAssign: 'Publicar y asignar',
          buttonPrev: 'Anterior',
          attachmentsTitle: 'Recursos',
          searchFromLibrary: 'Buscar en la biblioteca',
          searchFromLibraryDocsAndMedia: 'Añadir documentos y multimedia',
          addResource: 'Añadir recurso',
          resourceLastUpdate: 'Última actualización',
        },
        placeholders: {
          forTeacher:
            'Ayuda a otros profesores a abordar este ejercicio con unas sencillas instrucciones.',
          forStudent: 'Información extra para ayudar al alumno a realizar mejor el ejercicio.',
        },
      },
      evaluationData: {
        step_label: 'Evaluación',
        labels: {
          title: 'Evaluación',
          buttonNext: 'Siguiente',
          buttonPrev: 'Anterior',
          buttonPublish: 'Publicar',
          buttonPublishAndAssign: 'Publicar y asignar',
          curriculum: 'Curriculum',
          objectives: 'Objetivos personalizados',
          add: 'Añadir objetivo',
          numberHeader: 'Nº',
          objectiveHeader: 'Objetivo',
          assessmentCriteria: 'Criterios de evaluación',
          subjects: 'Subjects',
          inputLabel: 'Introducir objetivo personalizado',
          inputPlaceholder: 'Objetivo...',
          actions: 'Acciones',
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
    action: 'Asignar tarea',
  },
  assignment_form: {
    labels: {
      classroomToAssign: 'Asignar a una clase',
      studentToAssign: 'Asignar a un estudiante',
      mode: 'Modo',
      startDate: 'Fecha de inicio',
      deadline: 'Fecha límite',
      visualizationDateToogle: 'Visible con antelación',
      visualizationDate: 'Fecha de visualización',
      limitedExecutionToogle: 'Tiempo limitado',
      limitedExecution: 'Tiempo de ejecución',
      alwaysOpenToogle:
        'Esta tarea siempre está disponible y puede realizarse en cualquier momento',
      closeDateToogle: 'Fecha límite para la evaluación del profesor',
      closeDate: 'Fecha límite',
      messageToStudentsToogle: 'Añadir un mensaje para los estudiantes',
      messageToStudents: 'Mensaje para los estudiantes',
      showCurriculumToogle: 'Mostrar el curriculum',
      content: 'Contenido',
      objectives: 'Objetivos',
      assessmentCriteria: 'Criterios de evaluación',
      submit: 'Asignar',
      add: 'Añadir',
      assignTo: {
        class: 'Clase',
        customGroups: 'Grupos personalizados',
        session: 'Sesión',
      },
      selectStudentsTitle: '¿Quién va a realizar la tarea?',
      excludeStudents: 'Excluir estudiantes',
      subjects: {
        title: 'Asignaturas que se asignarán a la tarea',
        subtitle: 'NOTA: Mínimo una asignatura',
      },
      unableToAssignStudentsMessage:
        'Los estudiantes que no estén inscrito en todas las asignaturas seleccionadas no se asignarán a la tarea.',
      matchingStudents: 'Estudiantes que coinciden',
      groupName: 'Nombre del grupo',
      students: 'Estudiantes',
      noStudentsToAssign:
        'No hay estudiantes inscritos en todas las asignaturas seleccionadas, elige otra combinación',
    },
    placeholders: {
      date: 'dd/mm/aaaa',
      time: 'hh:mm',
      units: 'unidades',
    },
    descriptions: {
      messageToStudents:
        'Mensaje predeterminado para la tarea (es posible cambiarlo individualmente en cada asignación).',
      visualizationDate:
        'NOTA: La nota estará disponible para visualización, pero no podrá comenzarse hasta la fecha de inicio.',
      closeDateToogle: 'NOTA: Después de esta fecha, la tarea no podrá ser evaluada.',
      limitedExecution:
        'NOTA: Este es el tiempo desde la revisión del resumen de la tarea hasta la entrega de la misma.',
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
  cardMenu: {
    view: 'Ver',
    edit: 'Editar',
    assign: 'Asignar',
    delete: 'Eliminar',
    duplicate: 'Duplicar',
    pin: 'Marcar como favorito',
    unpin: 'Quitar de favorito',
    share: 'Compartir',
  },
  variant: 'Tarea',
  expressVariant: 'Tarea express',
  deliverables: 'Entregables',
  yes: 'Si',
  no: 'No',
  statementTitle: 'Enunciado',
  viewMore: 'Ver más',
  viewLess: 'Ver menos',
  task_realization: {
    steps: {
      introduction: 'Introducción',
      development: 'Desarrollo',
      submission: 'Entrega',
    },
    introduction_step: {
      statement: 'Enunciado',
      resources: 'Recursos',

      not_opened: {
        title: 'Actividad no disponible',
        description: 'Esta actividad estará disponible el día {date} a las {time}.',
      },
    },
    development_step: {
      instructions: 'Instrucciones',
      development: 'Desarrollo',
    },
    buttons: {
      previous: 'Anterior',
      next: 'Siguiente',
      finish: 'Finalizar',
      submit: 'Entregar',
      save: 'Guardar',
      nextActivity: 'Siguiente actividad',
      goToModule: 'Dashboard del módulo',
    },
    submission_step: {
      instructions: 'Instrucciones',

      notfinished_title: 'Actividad no finalizada',
      notfinished_message:
        'Recuerda que para entregar la tarea debes pulsar el botón entregar en la parte inferior.',
    },
    submission_file: {
      title: 'Formato y tamaño admitido',
      format: 'Formato',
      size: 'Tamaño',
      upload_title: 'Click para buscar un archivo nuevo',
      upload_subtitle: 'o arrastrar aquí desde el ordenador',
      errorAlert: `Error al subir archivo {fileName}: {error}`,
    },
    submission_link: {
      title: 'Enlace',
      label: 'Enlace',
      placeholder: 'Añadir el enlace...',
    },

    confirmation_modal: {
      title: 'Tarea finalizada',
      description: 'Tu tarea ha sido enviada con éxito',
      action: 'Actividades pendientes',
      goToModule: 'Dashboard del módulo',
      nextActivity: 'Siguiente actividad',
    },
    timeout_modal: {
      title: 'El tiempo establecido para completar esta actividad ha finalizado.',
      description:
        'Si has guardado algún archivo previamente, ha sido enviado automáticamente, en caso contrario, no se ha efectuado ninguna entrega.\nPuedes revisar la entrega pulsando en "Revisar entrega"',
      action: 'Revisar entrega',
      nextActivity: 'Siguiente actividad',
    },
    activityContainer: {
      deadline: {
        label: 'Entrega',
      },
    },

    sidebar: {
      resources: 'Recursos',
      team: 'Tu equipo',
    },
    statement_step: {
      statement: 'Enunciado',
      presentation: 'Presentación',
      curriculum: {
        title: 'Curriculum',
        content: 'Contenido',
        objectives: 'Objetivos personalizados',
        assessmentCriteria: 'Criterios de evaluación',
      },
    },

    limitedTimeAlert: {
      beforeStart: 'Antes de empezar',
      noTimeLimit: 'Sin límite de tiempo',
      withoutPause: 'Sin pausa',
      howItWorks: '¿Cómo funciona?',
      limitedTimeTitle: 'Tiempo limitado',
      limitedTime:
        'Una vez comenzado tienes {{time}} para finalizar esta tarea, deberás hacer la entrega antes de que este tiempo termine.',
      pauseTitle: 'La tarea no se puede pausar',
      pause:
        'Si sales de la aplicación con la tarea en proceso, esta se dará por finalizada y se enviará automáticamente la última entrega guardada antes del momento de la interrupción. Si se produce algún error en el sistema y te expulsa de la tarea, podrás notificarlo y en caso de que tu error sea comprobado podrás volver a realizarla.',
      closedTaskFirstLine: 'Esta actividad está en modo "solo consulta".',
      closedTaskSecondLine: 'La fecha de inicio para poder realizar esta actividad es: {{time}}',
    },
  },
  task_correction: {
    student: {
      submitted_alert: {
        title: 'Tarea entregada con éxito',
        message: 'Aquí tienes más información sobre tu tarea.',
      },
      pending_evaluation_alert: {
        title: 'Pendiente de evaluación',
        message: 'En cuanto sea evaluada recibirás una notificación.',
      },

      submission: 'Entregable',
      activity_summary: 'Resumen de la actividad',
      statement: 'Enunciado',
      curriculum: 'Currículum',
      development: 'Desarrollo',
    },
    teacher: {
      evaluation: 'Evaluación',
      student: 'Estudiante',
      submission: 'Entregable',
      score_label: 'Puntuación',
      score_placeholder: 'Selecciona la puntuación',
      add_feedback: 'Dar feedback cualitativo al estudiante sobre su desempeño en esta actividad',
      comunica: 'Hablar con el estudiante',
      publish: 'Guardar y enviar feedback',
      publish_success: 'Evaluación enviada al estudiante',
    },

    chatDescription: '¿Quieres hacer alguna consulta sobre esta evaluación?',
    chatTeacherDescription: '¿Quieres escribir alguna observación?',
    chatButtonStudent: 'Escribe a tu alumno',
    chatButtonTeacher: 'Escribe a tu profesor',
    punctuation: 'Puntuación',
    minToPromote: 'Min. para aprobar',
    feedbackForStudent: 'Feedback para el estudiante',
    optional: 'Opcional',
    submission: {
      title: 'Entrega',
      types: {
        notFound: {
          notFound: 'No se ha encontrado el tipo de entregable',
        },
        file: {
          noSubmission: 'No se ha entregado ningún archivo',
        },
      },
    },
    types: {
      calificable: 'Calificable',
      evaluable: 'Evaluable con puntuación',
      noPunctuationEvaluable: 'Evaluable sin puntuación',
    },
    contactTeacher: {
      title: '¿Quieres hacer alguna consulta sobre esta evaluación?',
      button: 'Escribe a tu profesor',
    },
    save: 'Guardar cambios',
    saveAndSend: 'Guardar y enviar',
    saveMessage: 'Cambios guardados con éxito',
    saveAndSendMessage: 'Cambios guardados y enviados al estudiante con éxito',
    saveError: 'No se han podido guardar los cambios: {{error}}',
    subjectNotCorrectedYet: 'Esta actividad todavía no ha sido corregida',
  },
};
