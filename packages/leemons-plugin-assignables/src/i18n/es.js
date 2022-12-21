module.exports = {
  userNavigator: {
    student: 'Estudiante',
    multiSubject: 'Multi-asignatura',
  },
  assignment_form: {
    labels: {
      isAllDay: 'Mostrar como evento diario',
      classroomToAssign: 'Seleccionar clase para asignar',
      studentToAssign: 'Seleccionar estudiante para asignar',
      mode: 'Modo',
      startDate: 'Fecha de inicio',
      deadline: 'Fecha límite',
      visualizationDateToogle: 'Hacer visible con antelación',
      visualizationDate: 'Fecha de visualización',
      limitedExecutionToogle: 'Tiempo máximo de ejecución',
      limitedExecution: 'Tiempo máximo de ejecución',
      alwaysOpenToogle:
        'Esta actividad está siempre disponible y puede realizarse en cualquier momento.',
      closeDateToogle: 'Fecha límite para correcciones del profesor',
      closeDate: 'Fecha límite para corregir',
      messageToStudentsToogle: 'Notificar a los estudiantes',
      messageToStudents: 'Mensaje para los estudiantes',
      showCurriculumToogle: 'Mostrar curriculum',
      content: 'Contenidos',
      objectives: 'Objetivos personalizados',
      assessmentCriteria: 'Criterios de evaluación',
      submit: 'Asignar',
      add: 'Añadir',
      assignTo: {
        class: 'Clase',
        customGroups: 'Grupos personalizados',
        session: 'Sesión',
      },
      relations: {
        toggle: 'Establecer relación con otra actividad',
        before: 'Actividad anterior',
        required: 'Dependencia obligatoria',
      },
      selectStudentsTitle: '¿Quién realizará la actividad?',
      excludeStudents: 'Excluir estudiantes',
      showResults: 'Ocultar informe de resultados',
      showCorrectAnswers: 'Ocultar soluciones a los estudiantes al terminar',
      addNewClassStudents: 'Asignar automáticamente a nuevos estudiantes matriculados',
      clearStudents: 'Borrar estudiantes',
      subjects: {
        nonCalificableTitle:
          'Selecciona al menos una de tus asignaturas para ver los grupos disponibles',
        calificableTitle: 'Asignaturas que se evaluarán en esta actividad',
        subtitle: 'NOTA: Al menos una de ellas',
      },
      unableToAssignStudentsMessage:
        'Los alumnos que no estén matriculados en todas las asignaturas seleccionadas no serán asignados',
      matchingStudents: 'Estudiantes coincidentes',
      groupName: 'Nombre del grupo',
      students: 'Estudiantes',
      noStudentsToAssign:
        'No hay estudiantes matriculados en las asignaturas seleccionadas, por favor seleccione otra combinación',
      showToStudents: 'Ocultar nombre del grupo a los estudiantes',
      required: 'Campo requerido',
    },
    placeholders: {
      date: 'dd/mm/aaaa',
      time: 'hh:mm',
      units: 'unidad',
    },
    descriptions: {
      messageToStudents:
        'Enviar un mensaje de notificación para hacer la actividad. Puede añadirse un texto personalizado',
      visualizationDate:
        'NOTA: La actividad estará disponible para su consulta, pero no podrá ser completada hasta la fecha de inicio.',
      closeDateToogle: 'NOTA: Después de esta fecha, no se pueden hacer correcciones',
      limitedExecution:
        'NOTA: Es el intervalo de tiempo que transcurre desde la visualización del resumen de la actividad hasta la presentación del entregable.',
      isAllDay:
        'NOTA: Los alumnos tendrán hasta las 23:59h para entregar, pero verán la fecha límite como un evento diario en su calendario.',
    },
    assignTo: {
      student: 'Estudiante',
      class: 'Clase',
    },
    modes: {
      individual: 'Individual',
      pairs: 'Por parejas',
      groups: 'Equipos',
    },
    timeUnits: {
      hours: 'Horas',
      minutes: 'Minutos',
      days: 'Días',
    },
    gradeVariations: {
      title: 'Tipo de actividad',
      calificable: {
        label: 'Calificable',
        description:
          'La puntuación será tenida en cuenta para la nota final, se admiten comentarios',
      },
      punctuationEvaluable: {
        label: 'Evaluable con puntuación',
        description:
          'Se pide una puntuación pero no será tenida en cuenta para la nota final, se admiten comentarios',
      },
      evaluable: {
        label: 'Evaluable sin puntuación',
        description: 'Solo se devuelven comentarios',
      },
      notEvaluable: {
        label: 'No evaluable',
        description: 'El alumno no recibe ninguna retro-alimentación',
      },
    },
  },
  activity_deadline_header: {
    noDeadline: 'Sin fecha límite',
    deadline: 'Fecha límite',
    deadlineExtraTime: 'Añadir tiempo extra',
    closeTask: 'Cerrar actividad',
    archiveTask: 'Archivar actividad',
    save: 'Guardar',
    cancel: 'Cancelar',
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
  },
  pagination: {
    show: 'Mostrar',
    goTo: 'Ir a',
  },
  assetListFilters: {
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
