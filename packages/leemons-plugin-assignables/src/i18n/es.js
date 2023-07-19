module.exports = {
  userNavigator: {
    student: 'Estudiante',
    multiSubject: 'Multi-asignatura',
  },
  assignmentForm: {
    subjects: {
      title: 'Asignaturas incluidas',
      subjectInput: {
        label: 'Asignaturas',
        placeholder: 'Escribe las asignaturas',
        error: 'Selecciona al menos una asignatura',
      },
    },
    groups: {
      title: '¿Quién lo realizará?',
      options: {
        class: 'Clase existente',
        customGroup: 'Grupo personalizado',
      },
      noStudentsError:
        'No se encuentran estudiantes para las asignaturas seleccionadas. Añade o quita asignaturas para continuar.',
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
        hideCustomName: 'Ocultar el nombre del grupo a los estudiantes',
      },
    },
    dates: {
      title: '¿Cuándo se realizará?',
      optionsInput: {
        label: 'Plazo de tiempo',
        options: {
          alwaysAvailable: 'Cualquier momento',
          fixed: 'Con plazo de tiempo',
          session: 'Sesión en directo',
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
          placeholder: 'Introduce la fecha',
          error: 'Selecciona una fecha de inicio',
        },
        deadline: {
          label: 'Fecha de fin',
          placeholder: 'Introduce la fecha',
          error: 'Selecciona una fecha de fin',
        },
        bothDatesError: 'Selecciona una fecha de inicio y fin',
      },
    },
    instructions: {
      title: 'Enunciado o instrucciones',
      description: 'Indicaciones sobre cómo consumir el recurso (opcional)',
      editor: {
        placeholder: 'Escribe el enunciado',
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
      notifyStudents: 'Notificar a los estudiantes',
      messageForStudents: 'Mensaje para los estudiantes',
      hideResponses: 'Ocultar las respuestas de la actividad una vez finalizada.',
      hideReport: 'Ocultar el informe de resultados.',
    },
    buttons: {
      assign: 'Asignar',
      save: 'Guardar', // Used on modules assignation drawer
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
        status: 'Estado',
        completed: 'Completada',
        avg: 'Tiempo medio',
        score: 'Puntuación',
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
  },
  studentsList: {
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
        status: 'Estado',
        completed: 'Completada',
        avgTime: 'Tiempo medio',
        score: 'Puntuación',
        unreadMessages: 'Mensajes',
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
      activity: 'Actividad/Módulo',
      subject: 'Asignatura, grupo y estudiantes',
      students: 'Estudiantes',
      start: 'Inicio',
      deadline: 'Fin',
      status: 'Estado',
      completions: 'Finalizado',
      evaluated: 'Evaluado',
      messages: 'Mensajes',
    },
    student: {
      activity: 'Actividad/Módulo',
      subject: 'Asignatura y grupo',
      start: 'Inicio',
      deadline: 'Fin',
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
    history: 'Histórico {{count}}',
    search: 'Buscar actividades en curso',
    subject: 'Asignatura',
    status: 'Estado',
    progress: 'Progreso',
    type: 'Tipo',
    sort: 'Orden',
    seeAll: 'Ver todas',
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
    assigment: {
      subject: 'Asignatura',
      submission: 'Entregadas',
      avgTime: 'Tiempo medio',
      grade: 'Puntuación',
      score: 'Respuestas correctas',
      activityType: 'Tipo de actividad',
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
};
