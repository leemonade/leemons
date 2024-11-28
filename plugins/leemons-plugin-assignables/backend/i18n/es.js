module.exports = {
  userNavigator: {
    student: 'Estudiante',
    multiSubject: 'Multi-asignatura',
  },
  assignmentForm: {
    steps: {
      assignation: 'Asignación',
      action: 'Asignar',
    },
    subjects: {
      placeholder: 'Seleccionar...',
      program: 'Programa',
      course: 'Curso',
      subject: 'Asignatura',
      title: 'Asignaturas',
      subjectInput: {
        label: 'Asignaturas',
        placeholder: 'Escribe las asignaturas',
        error: 'Selecciona al menos una asignatura',
      },
      add: 'Añadir',

      programChangeModal: {
        title: '¿Seguro que quieres cambiar de programa?',
        description: 'Esto borrará la selección de asignaturas',
      },
    },
    groups: {
      title: 'Estudiantes',
      subtitle: 'Selecciona el grupo de estudiantes',
      options: {
        class: 'Clase existente',
        customGroup: 'Grupo personalizado',
        singleStudent: 'Estudiante individual',
      },
      noStudentsError:
        'No se encuentran estudiantes para las asignaturas seleccionadas. Añade o quita asignaturas para continuar.',
      classSelectLabel: 'Tipo de selección',
      class: {
        studentsCount: 'estudiantes coincidentes',
        autoAssignStudents: 'Asignar automáticamente a nuevos estudiantes',
        excludeStudents: 'Excluir estudiantes específicos',
        error: 'Selecciona al menos un grupo',
        notAllStudentsAssigned: 'Algunos estudiantes no se incluirán en la actividad.',
        excludeStudentsInput: {
          label: 'Estudiantes',
          placeholder: 'Escribe los estudiantes excluidos',
        },
        total: 'Total',
        selectedStudents: 'Estudiantes incluidos',
        nonMatchingStudents: 'No coincidentes',
        excluded: 'Excluidos manualmente',
      },
      customGroup: {
        studentsInput: {
          label: 'Añadir participantes',
          placeholder: 'Escribe los estudiantes del grupo',
          error: 'Añade al menos un estudiante',
        },
        groupName: {
          label: 'Nombre del grupo',
          placeholder: 'Escribe el nombre',
          error: 'El nombre es necesario',
        },
        hideCustomName: 'Hacer visible para los estudiantes',
      },
      singleStudent: {
        studentInput: {
          label: 'Seleccionar estudiante',
          placeholder: 'Selecciona un estudiante',
        },
      },
    },
    dates: {
      title: 'Plazo de realización',
      optionsInput: {
        label: 'Plazo de tiempo',
        options: {
          alwaysAvailable: 'Cualquier momento',
          fixed: 'Con plazo de tiempo',
          session: 'Sesión de asignatura',
        },
      },
      hideFromCalendar: 'Ocultar del calendario hasta la fecha/hora de inicio',
      maxTime: 'Establecer un tiempo límite de ejecución.',
      maxTimeInput: {
        label: 'Tiempo de ejecución',
      },

      fixedType: {
        title: {
          fixed: 'Configurar plazo de tiempo',
          session: 'Configurar sesión en directo',
        },
        startDate: {
          label: 'Fecha de inicio',
          placeholder: 'Seleccionar fecha',
          error: 'Selecciona una fecha de inicio',
        },
        deadline: {
          label: 'Fecha de fin',
          placeholder: 'Seleccionar fecha',
          error: 'Selecciona una fecha de fin',
        },
        bothDatesError: 'Selecciona una fecha de inicio y fin',
      },
    },
    instructions: {
      title: 'Instrucciones',
      description: 'Instrucciones para la consulta del contenido',
      editor: {
        placeholder: 'Puedes especificar la mejor manera de consultar este contenido...',
      },
    },
    evaluation: {
      title: 'Evaluación',
      description:
        'Todos los tipos de evaluación tienen la posibilidad de incluir comentarios (menos el no evaluable)',
      typeInput: {
        label: 'Tipo',
        options: {
          nonEvaluable: 'No evaluable',
          calificable: 'Calificable',
          punctuable: 'Puntuable',
          feedbackOnly: 'Solo comentarios',
          feedback: 'Feedback',
          feedbackAvailable: 'Feedback disponible',
        },
      },
      showCurriculum: 'Mostrar curriculum',
    },
    others: {
      title: 'Otras opciones',
      teacherDeadline: 'Incluir una fecha límite de corrección para el docente',
      teacherDeadlineInput: {
        label: 'Fecha límite',
        placeholder: 'Introduce la fecha',
        error: 'Selecciona una fecha',
      },
      notifyStudents: 'Enviar correo electrónico a los estudiantes',
      createComunicaRooms: 'Crear una sala de chat para esta actividad',
      messageForStudents: 'Escribe el correo electrónico',
      notifyPlaceholder: 'Añadir aqui el texto del enunciado',
      hideResponses: 'Ocultar las respuestas de la actividad una vez finalizada.',
      hideReport: 'Ocultar el informe de resultados.',
    },
    buttons: {
      assign: 'Asignar',
      next: 'Siguiente',
      previous: 'Anterior',
      save: 'Guardar', // Used on modules assignation drawer
      cancel: 'Cancelar',
    },
    presentation: {
      title: 'Presentación',
      titleInput: {
        label: 'Título',
        placeholder: 'Escribe el título',
      },
      thumbnail: 'Imagen destacada',
    },
    preview: {
      title: 'Vista previa',
    },
  },
  activity_deadline_header: {
    noDeadline: 'Sin fecha límite',
    deadline: 'Entrega',
    deadlineExtraTime: 'Añadir tiempo',
    closeTask: 'Cerrar',
    archiveTask: 'Archivar',
    save: 'Guardar',
    cancel: 'Cancelar',
    period: 'Tipo de periodo',
    startDate: 'Fecha de inicio',
    startHour: 'Hora de inicio',
    endDate: 'Fecha de fin',
    endHour: 'Hora de fin',
    closedPeriod: 'Periodo cerrado',
    liveSession: 'Sesión en directo',
    openPeriod: 'Periodo abierto',
    liveSessionData: 'Fecha',
  },
  activity_dashboard: {
    progress: 'Progreso',
    evaluation: 'Evaluación',
    students: 'Estudiantes',
    califications: 'Puntuaciones',
    passed: 'Aprobado',
    close: 'Cerrar',
    opened: 'Abrir',
    archive: 'Archivar',
    unarchive: 'Desarchivar',
    delete: 'Eliminar',
    chatButton: 'Chat',
    closeAction: {
      verbs: {
        opening: 'Empezando',
        opened: 'Empezada',
        closing: 'Cerrando',
        closed: 'Cerrada',
      },
      messages: {
        success: 'Actividad {{verb}}',
        error: 'Error {{verb}} actividad: {{error}}',
      },
    },
    archiveAction: {
      verbs: {
        archiving: 'Archivando',
        archived: 'Archivada',
        unarchiving: 'Desarchivando',
        unarchived: 'Desarchivada',
      },
      messages: {
        success: 'Actividad {{verb}}',
        error: 'Error {{verb}} actividad: {{error}}',
      },
    },
    start: {
      messages: {
        success: 'Fecha de inicio de la actividad actualizada',
        error: 'Error al actualizar la fecha de inicio: {{error}}',
      },
    },
    deadline: {
      messages: {
        success: 'Fecha límite de la actividad actualizada',
        error: 'Error al actualizar la fecha límite: {{error}}',
      },
    },
    labels: {
      graphs: {
        status: 'Resumen de estado',
        grades: 'Resumen de puntuaciones',
      },
      studentList: {
        studentsCount: 'Estudiantes {{count}}',
        search: 'Buscar estudiante',
        student: 'Estudiante',
        progress: 'progreso',
        avg: 'Tiempo medio',
      },
    },
    archiveModal: {
      title: 'Existen alumnos sin evaluar',
      message1: 'Existe uno o varios estudiantes que no han sido evaluados.',
      message2:
        'Una vez archivada esta actividad, podrás incluir nuevas notas a través del Cuaderno de Evaluación',
      confirm: 'Archivar de todas formas',
      cancel: 'Cancelar',
    },
    deleteAction: {
      success: 'Actividad eliminada',
      error: 'Error al eliminar la actividad: {{error}}',
    },
    deleteModal: {
      title: '¿Estás seguro de querer eliminar esta actividad?',
      message1: 'Esta acción no se puede deshacer.',
      message2: 'Se eliminará toda la información relacionada con esta actividad.',
      confirm: 'Aceptar y eliminar',
      cancel: 'Cancelar',
    },
    closeModal: {
      title: 'Cerrar actividad',
      message1: '¿Estás seguro de querer cerrar la actividad?',
      message2:
        'Los estudiantes no podrán enviar nuevas respuestas una vez que la actividad esté cerrada.',
      confirm: 'Cerrar actividad',
      cancel: 'Cancelar',
    },
    closeActionAlerts: {
      success: 'Actividad cerrada',
      error: 'Error al cerrar la actividad: {{error}}',
    },
    archiveActionAlerts: {
      success: 'Actividad archivada correctamente',
      error: 'Error al archivar la actividad: {{error}}',
    },
  },
  studentsList: {
    title: 'Actividad en curso',
    labels: {
      students: 'Estudiantes',
      assignStudent: 'Asignar estudiante',
      bulkActions: {
        label: 'Acciones',
        SEND_REMINDER: 'Enviar recordatorio',
      },
      rememberModal: {
        title: 'Enviar recordatorio a estudiantes que:',
        notOpen: 'No han abierto la actividad',
        notEnd: 'No han finalizado la actividad',
        send: 'Enviar',
        sended: 'Recordatorio enviado',
      },
      studentListcolumns: {
        student: 'Estudiantes',
        progress: 'Progreso',
        avgTime: 'Tiempo medio',
        sendReminder: 'Enviar recordatorio',
      },
    },
    placeholders: {
      bulkActions: 'Selecciona una acción',
      searchStudent: 'Buscar estudiante',
    },
    descriptions: {
      searchStudent: 'Seleccionado',
    },
  },
  activity_status: {
    assigned: 'Programada',
    notOpened: 'Sin abrir',
    opened: 'Abierta',
    notStarted: 'No empezada',
    started: 'Empezada',
    closed: 'Cerrada',
    late: 'Tarde',
    evaluated: 'Evaluada',
    submitted: 'Entregada',
    ended: 'Finalizada',
    notSubmitted: 'No entregada',
    noLimit: 'Sin límite de tiempo',
    blocked: 'Bloqueada',
    archived: 'Archivada',
  },
  teacher_actions: {
    sendReminder: 'Enviar recordatorio',
    evaluate: 'Evaluar',
    review: 'Revisar',
    reminderSended: 'Recordatorio enviado',
  },
  student_actions: {
    continue: 'Continuar',
    start: 'Empezar',
    view: 'Ver',
    notSubmitted: 'No entregado',
    correction: 'Revisar',
    review: 'Revisar',
    disabled: {
      results: 'Los resultados han sido ocultados por tu profesor',
      previous: 'La actividad anterior debe completarse primero',
    },
  },
  levelsOfDifficulty: {
    beginner: 'Principiante',
    elementary: 'Elemental',
    lowerIntermediate: 'Intermedio bajo',
    intermediate: 'Intermedio',
    upperIntermediate: 'Intermedio alto',
    advanced: 'Avanzado',
  },
  assignment_list: {
    teacher: {
      activity: 'Actividad',
      subject: 'Grupo',
      students: 'Estudiantes',
      deadline: 'Fecha Fin',
      status: 'Estado',
      completions: 'Finalizada',
      evaluated: 'Evaluada',
      messages: 'Mensajes',
    },
    student: {
      activity: 'Actividad',
      subject: 'Grupo',
      deadline: 'Fecha Fin',
      status: 'Estado',
      progress: 'Progreso',
      messages: 'Mensajes',
    },
  },
  multiSubject: 'Multi-asignatura',
  customObjectives: 'Objetivos personalizados',
  activities_filters: {
    ongoing: 'En curso {{count}}',
    evaluated: 'Evaluadas {{count}}',
    history: 'Archivadas {{count}}',
    search: 'Buscar actividades en curso',
    subject: 'Asignatura',
    status: 'Estado',
    progress: 'Progreso',
    type: 'Tipo',
    sort: 'Orden',
    seeAll: 'Ver todas',
    seeAllActivities: 'Ver todas las actividades',
  },
  sortTypes: {
    assignation: 'Asignación',
    start: 'Fecha inicio',
    deadline: 'Fecha fin',
  },
  activities_list: {
    emptyState: 'No hay actividades aún',
    blocked: 'La actividad seleccionada está bloqueada',
    nonEvaluable: 'La actividad seleccionada no es evaluable y ya ha sido finalizada',
  },
  ongoing: {
    ongoing: 'Actividades en curso',
    history: 'Actividades pasadas',
    activities: 'Actividades',
    pendingActivities: 'Actividades para evaluar',
  },
  dates: {
    visualization: 'Visualización',
    start: 'Inicio',
    deadline: 'Entrega',
    close: 'Cierre',
    closed: 'Cerrada',
    teacherDeadline: 'Límite de corrección',
  },
  need_your_attention: {
    activitiesTitle: 'Actividades pendientes',
    evaluationsTitle: 'Evaluaciones pendientes',
    ownEvaluations: 'Mis evaluaciones',
    new: 'Nueva',
    activitiesEmptyState: 'No hay actividades pendientes',
    evaluationsEmptyState: 'No hay evaluaciones pendientes',
    seeAllActivities: 'Ver todas las actividades',
    seeAllEvaluations: 'Ver todas las evaluaciones',
    links: {
      academy: 'https://www.leemons.io/es/leemons-academy',
      library: 'https://www.leemons.io/es/academy-post/biblioteca-de-leemons',
    },
    assigment: {
      subject: 'Asignatura',
      submission: 'Entregadas',
      avgTime: 'Tiempo medio',
      grade: 'Puntuación',
      score: 'Respuestas correctas',
      activityType: 'Tipo de actividad',
    },
    deadline: {
      opened: 'Abierta',
      programmed: 'Programada',
      daysRemaining: 'Faltan {{count}} días',
      hoursRemaining: 'Faltan {{count}} horas',
      late: 'Tarde',
      noDeadline: 'Sin fecha límite',
    },
    status: {
      evaluated: 'Ver evaluación',
      submission: 'Entrega',
      evaluate: 'Para evaluar',
      evaluation: 'Evaluación',
      opened: 'Actividad abierta',
      start: 'Fecha inicio',
      assigned: 'Programada',
      late: 'Tarde',
      submitted: 'Entregada',
      startActivity: 'Empezar actividad',
    },
    emptyState: {
      title: '¡Lo tienes todo al día!',
      greetingWelcome: '¡Te damos la bienvenida, {{name}}!',
      noEvaluations: 'No hay evaluaciones pendientes',
      noActivities: 'No hay actividades pendientes',
    },
    welcome: {
      title: '¡Te damos la bienvenida!',
      teacher: {
        title: 'Aún no hay información para mostrar aquí',
        description1:
          'En este panel de control podrás encontrar muy pronto información sobre las actividades y tareas que has asignado a tus estudiantes, el calendario de planificación o tu gestor ágil de tareas.',
        description2: 'Mientras tanto y para empezar, te recomendamos las siguientes acciones:',
        helpCenter: {
          title: 'Visitar el centro de ayuda',
          description:
            'En Leemons Academy encontrarás información de utilidad para sacar todo el partido a la plataforma.',
          cta: 'Leemons Academy',
        },
        leebrary: {
          title: 'Subir recursos',
          description:
            'En la Biblioteca de Leemons  podrás subir contenidos y crear materiales y actividades para tus clases.',
          cta: 'Biblioteca de Leemons',
        },
        comunica: {
          title: 'Decir “Hola”',
          description:
            'Abajo tienes un globito verde, púlsalo para abrir Comunica, y saludar a tus estudiantes en el chat.',
        },
      },
      student: {
        title: 'Aún no hay información para mostrar aquí',
        description1:
          'En este panel de control podrás encontrar muy pronto información sobre las actividades y tareas que te han asignado tus profesores, tu calendario de entregas o tu gestor ágil de tareas.',
        description2: 'Mientras tanto y para empezar, te recomendamos las siguientes acciones:',
        helpCenter: {
          title: 'Completar tu perfil',
          description: 'Revisa la información de tu perfil y comprueba que todo está correcto.',
        },
        comunica: {
          title: 'Decir “Hola”',
          description:
            'Abajo tienes un globito verde, púlsalo para abrir Comunica, y saludar a tus compañeros y profesores en el chat.',
        },
      },
    },
  },
  pagination: {
    show: 'Mostrar',
    goTo: 'Ir a',
  },
  assetListFilters: {
    programLabel: 'Programa',
    subjectLabel: 'Asignatura',
    program: 'Programa...',
    subject: 'Asignatura...',
    allPrograms: 'Todos los programas',
    allSubjects: 'Todas las asignaturas',
    subectGroups: {
      mySubjects: 'Mis asignaturas',
      collaborations: 'Colaboraciones',
    },
  },

  evaluation: {
    timeoutAlert: {
      title: 'Tiempo máximo alcanzado',
      message:
        'El tiempo límite establecido para esta actividad ha sido alcanzado. La última entrega o preguntas respondidas han sido enviadas automáticamente.',
    },
    submitted_alert: {
      title: 'Actividad entregada con éxito',
      message: 'Aquí tienes más información sobre tu actividad.',
    },
    pending_evaluation_alert: {
      title: 'Pendiente de evaluación',
      message: 'En cuanto sea evaluada recibirás una notificación.',
    },
    not_submitted_alert: {
      title: 'Tarea no entregada',
    },
    finished_alert: {
      title: 'Actividad finalizada',
    },
    assignationHeaderButton: 'Ver asignación',
    goToModuleDashboard: 'Volver al dashboard',
  },

  evaluationFeedbackComponent: {
    contactTeacher: 'Hablar con mi profesor',
    contactStudent: 'Hablar con el estudiante',
    feedback: 'Feedback',
  },
  progress: {
    tabTitle: 'Progreso',
    dashboardTitle: {
      main: {
        student: 'Mi progreso',
        teacher: 'Notas medias del curso',
      },
      subject: {
        student: 'Notas de la asignatura',
        teacher: 'Notas medias en la asignatura',
      },
      module: {
        student: 'Notas del módulo',
        teacher: 'Notas medias del módulo',
      },
    },
    average: 'Media',
    pass: 'Aprobado',
    approved: 'Conocimiento adquirido',
    notApproved: 'Conocimiento por adquirir',
    inProgress: 'En progreso',
  },
  evaluationTable: {
    title: 'Evaluación',
    weighting: 'Ponderación',
    seeNonGradable: 'Ver no calificables',
    columns: {
      activity: 'Actividad',
      module: 'Módulo',
      activities: 'Actividades',
      weight: 'Ponderación',
      evaluation: 'Evaluación',
      feedback: 'Feedback cualitativo',
    },
  },
  activityNotStarted: {
    activityUnavailable: 'Actividad no disponible',
    back: 'Volver',
    next: 'Siguiente',
    finish: 'Finalizar',
    activityNotStarted:
      'Esta actividad aún no está disponible. Podrás acceder a ella y realizarla a partir del {date} a las {time}.',
    activityBlocked: 'Esta actividad está bloqueada por una actividad anterior del módulo.',
    willSendMail: 'Recibirás un email cuando se abra el plazo de ejecución.',
    checkBackLater: 'Por favor, vuelve más tarde para comenzar.',
  },
};
