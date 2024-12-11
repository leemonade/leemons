module.exports = {
  scoresPage: {
    header: {
      admin: {
        title: 'Periodos de Evaluación',
        description:
          'Como administrador, puedes crear periodos de tiempo personalizados para facilitar la labor de evaluación de los profesores, por ejemplo, pre-definiendo los periodos de evaluación por programa y curso.',
      },
      teacher: {
        title: 'Cuaderno de Evaluación',
        description:
          'Bienvenido a tu cuaderno de evaluación. Como profesor puedes hacer búsquedas libres o utilizar los periodos pre-definidos por tu centro educativo para cada programa y curso.',
      },
    },
    filters: {
      title: 'Buscar periodo',
      class: {
        label: 'Clase',
        placeholder: 'Clase...',
      },
      period: {
        label: 'Periodo de evaluación',
        placeholder: 'Periodo de evaluación...',
        custom: 'Periodo personalizado',
        final: 'Evaluación final',
        fullCourse: 'Curso completo',
      },
      startDate: {
        label: 'Fecha inicio',
        placeholder: 'Fecha inicio...',
      },
      endDate: {
        label: 'Fecha fin',
        placeholder: 'Fecha fin...',
      },
    },
  },
  reviewPage: {
    header: {
      admin: {
        title: 'Notas finales',
        description:
          'Como administrador, puedes crear periodos de tiempo personalizados para facilitar la labor de evaluación de los profesores, por ejemplo, pre-definiendo los periodos de evaluación por programa y curso.',
      },
      teacher: {
        title: 'Notas finales',
        description:
          'Bienvenido a tu cuaderno de evaluación. Como profesor puedes hacer búsquedas libres o utilizar los periodos pre-definidos por tu centro educativo para cada programa y curso.',
      },
    },
    filters: {
      title: 'Buscar periodo',
      program: {
        label: 'Programa',
        placeholder: 'Seleccionar programa...',
      },
      course: {
        label: 'Curso',
        placeholder: 'Seleccionar curso...',
      },
      group: {
        label: 'Grupo',
        placeholder: 'Seleccionar grupos...',
        all: 'Todos los grupos',
      },
      period: {
        label: 'Periodo',
        placeholder: 'Seleccionar periodo...',
        all: 'Todos los periodos',
      },
    },
  },
  studentScoresPage: {
    header: {
      student: {
        title: 'Mis puntuaciones',
        description:
          'Bienvenido a tu cuaderno de evaluación. Como estudiante puedes hacer búsquedas libres o utilizar los periodos pre-definidos por tu centro educativo para cada programa y curso.',
      },
    },
    filters: {
      course: {
        label: 'Curso',
        placeholder: 'Curso...',
      },
      period: {
        label: 'Seleccionar periodo',
        placeholder: 'Periodo de evaluación...',
        custom: 'Periodo personalizado',
        final: 'Evaluación final',
      },
      startDate: {
        label: 'Inicio',
        placeholder: 'Seleccionar fecha de inicio',
      },
      endDate: {
        label: 'Fin',
        placeholder: 'Seleccionar fecha de fin',
      },
    },
  },
  periods: {
    alerts: {
      removeSuccess: 'Periodo "{{name}}" eliminado correctamente',
      removeError: 'Error eliminando el periodo "{{name}}": {{error}}',
      addSuccess: 'Periodo "{{name}}" añadido correctamente',
      addError: 'Error añadiendo el periodo "{{name}}": {{error}}',
    },
    periodForm: {
      startDate: 'Fecha inicio',
      endDate: 'Fecha fin',
      submit: 'Buscar',
      newPeriod: 'Nuevo periodo',
      addPeriod: 'Añadir periodo',
      shareWithTeachers: 'Compartir con profesores',
      saveButton: 'Guardar periodo',
      periodName: 'Nombre del periodo',
      customPeriod: 'Periodo personalizado',
      evaluations: 'Evaluaciones',
      class: {
        label: 'Clase',
        placeholder: 'Seleccionar una clase',
        error: 'La clase es requerida',
      },
      center: {
        label: 'Centro',
        placeholder: 'Selecciona un centro',
        error: 'El centro es requerido',
      },
      program: {
        label: 'Programa',
        placeholder: 'Selecciona un programa',
        error: 'El programa es requerido',
      },
      course: {
        label: 'Curso',
        placeholder: 'Selecciona un curso',
        error: 'El curso es requerido',
      },
      subject: {
        label: 'Asignatura',
        placeholder: 'Selecciona una asignatura',
        error: 'La asignatura es requerida',
      },
      group: {
        label: 'Grupo',
        placeholder: 'Selecciona un grupo',
        error: 'El grupo es requerido',
      },
    },
    adminDrawer: {
      title: 'Periodos de Evaluación',
      description:
        'Como administrador, puedes crear periodos de tiempo personalizados para facilitar la labor de evaluación de los profesores, por ejemplo, pre-definiendo los periodos de evaluación por programa y curso.',
      new: 'Nuevo periodo',
    },
    teacherDrawer: {
      title: 'Cuaderno de Evaluación',
      description:
        'Bienvenido a tu cuaderno de evaluación. Como profesor puedes hacer búsquedas libres o utilizar los periodos pre-definidos por tu centro educativo para cada programa y curso.',
      new: 'Establecer periodo',
    },
    periodFormErrorMessages: {
      startDate: 'La fecha de inicio es requerida',
      endDate: 'La fecha de fin es requerida',
      validateStartDate: 'La fecha de inicio debe ser anterior a la fecha de fin',
      validateEndDate: 'La fecha de fin debe ser posterior a la fecha de inicio',
      periodName: 'El nombre del periodo es requerido',
    },
    periodListFilters: {
      center: 'Centro',
      program: 'Programa',
      course: 'Curso',
      search: 'Buscar por nombre de periodo',

      centerPlaceholder: 'Selecciona un centro',
      programPlaceholder: 'Selecciona un programa',
      coursePlaceholder: 'Selecciona un curso',
    },
    periodListColumns: {
      name: 'Nombre',
      center: 'Centro',
      program: 'Programa',
      course: 'Curso',
      startDate: 'Fecha de inicio',
      endDate: 'Fecha de fin',
    },
  },
  periodTypes: {
    custom: 'Periodos personalizados',
    academicCalendar: 'Periodos del calendario académico',
  },
  notebook: {
    header: {
      export: 'Descargar',
    },
    noClassSelected: {
      title: 'Seleccionar clase y periodo',
      description:
        'Selecciona la clase o grupo y luego filtra por periodos de evaluación. También puedes exportar estos informes a excel o csv.',
    },
    noCourseSelected: {
      title: 'Seleccionar curso y periodo',
      description:
        'Selecciona el curso y luego filtra por periodos de evaluación. También puedes exportar estos informes a excel o csv.',
    },
    noResults: {
      title: 'Sin resultados',
      description: 'No hemos encontrado resultados para tu búsqueda.',
    },
    tabs: {
      activities: {
        title: 'Actividades evaluadas',
        unableToOpen: 'Error abriendo actividad, la actividad no se ha podido encontrar',
        filters: {
          filterBy: {
            activity: 'Actividad',
            student: 'Estudiante',
            placeholder: 'Filtrar por',
          },
          search: 'Buscar por {{filterBy.toLowerCase}}',
          nonCalificables: 'Ver no calificables',
          evaluationReport: {
            label: 'Enviar informe de evaluación',
            disabledTooltip: {
              invalidPeriod:
                'Los informes de evaluación solo están disponibles en los periodos del calendario académico',
              submittedPeriod: 'El informe de evaluación ya ha sido enviado',
            },
            modal: {
              title: 'Enviar informe',
              msg1: 'Una vez enviado el informe al revisor/administrador de tu organización, las notas de las actividades calificables no podrán modificarse, te aconsejamos revisar bien las puntuaciones antes de hacer el envío.',
              msg2: 'Recuerda que las notas personalizadas por evaluación, sustituyen a las notas calculadas y que estas solo podrán modificarse por un revisor/administrador una vez entregado el informe.',
              confirm: 'Enviar informe',
              cancel: 'Cancelar',
            },
          },
          finalReport: {
            label: 'Enviar informe final',
          },
        },
        scoresTable: {
          table: {
            students: 'Estudiantes',
            noActivity: 'No entregado',
            avgScore: 'Nota promedio',
            calculated: 'Calculada',
            custom: 'Personalizada',
            attendance: 'Asistencia',
          },
          updatedSuccess: 'Actualizada la nota de {{student}} en {{activity}} a un {{score}}',
          updatedError: 'Error actualizando la nota de {{student}} en {{activity}} a un {{score}}',
        },
        periodSubmission: {
          noData: 'Todavía no hay datos que enviar',
          noPeriod: 'El periodo debe ser un periodo del calendario académico',
          success: 'El periodo {{period}} ha sido reportado',
          error: 'El periodo {{period}} no puede ser reportado: {{error}}',
        },
      },
    },
    students: {
      averageScore: 'Nota media',
      subject: {
        label: 'Seleccionar asignatura',
        placeholder: 'Asignatura',
      },
      type: {
        label: 'Seleccionar tipo',
        placeholder: 'Tipo',
        clear: 'Borrar',
      },
      seeNonCalificable: 'Ver actividades no calificables',
      notDelivered: 'No entregado',
    },
  },
  finalNotebook: {
    filters: {
      filterBy: {
        student: 'Estudiante',
        subject: 'Asignatura',
        group: 'Grupo',
      },
      searchBy: 'Buscar por {{noun}}',
      hideFutureEvaluations: 'Ocultar evaluaciones futuras',
    },
    reviewerTable: {
      students: 'Estudiantes',
      noActivity: 'No entregada',
      avgScore: 'Nota media',
      gradingTasks: 'Calculada',
      customScore: 'Personalizada',
    },
    update: {
      success: 'Nota actualizada para {{student}} en {{subject}} a un {{score}}',
      fail: 'La nota no ha podido ser actualizada para {{student}} en {{subject}} a un {{score}}',
      course: 'el curso',
    },
  },
  excel: {
    period: {
      period: 'Periodo',
      startDate: 'Fecha de inicio',
      endDate: 'Fecha de fin',
      program: 'Programa',
      subject: 'Asignatura',
      course: 'Curso',
      group: 'Grupo',
    },
    table: {
      type: 'Tipo',
      evaluation: 'Evaluación',
      activity: 'Actividad',
      deadline: 'Fecha límite/cierre',
      calificable: 'calificable',
      noCalificable: 'no calificable',
      avg: 'Calculada',
      custom: 'Personalizada',
      notSubmitted: 'No entregado',
      group: 'Grupo',
      surname: 'Apellido',
      name: 'Nombre',
      weight: 'Porcentaje',
    },
    alerts: {
      error: 'Error descargando el boletín',
    },
  },
  weighting: {
    title: 'Reglas de ponderación',
    subjectsAndGroups: 'Asignaturas y grupos',

    table: {
      headers: {
        subject: 'Asignatura',
        group: 'Grupo',
        course: 'Curso',
        rules: 'Reglas',
        actions: 'Acciones',
      },
    },
  },
  weightingTypes: {
    averages: 'Media',
    roles: 'Tipo',
    modules: 'Módulos',
  },
  weightingDrawer: {
    rules: 'Reglas',
    type: 'Tipo',
    weighting: 'Ponderación',
    table: {
      applySameValue: 'Aplicar mismo valor',
      modules: 'Módulos',
      roles: 'Tipos',
      weight: 'Porcentaje',
      total: 'Total',
    },
    explanation: 'Explicación',
    cancel: 'Cancelar',
    save: 'Guardar',
  },
  weightingAlerts: {
    updateSuccess: 'Ponderación actualizada correctamente',
    updateError: 'Error actualizando la ponderación',
    exceedPercentageUpper:
      'El total de la ponderación no puede sumar más de 100%, revisa los valores de porcentaje.',
    exceedPercentageLower:
      'El total de la ponderación no puede ser menor de 100%, revisa los valores de porcentaje.',
    modulesTypeWarning: {
      title: 'Importante:',
      message:
        'la ponderación por módulos no incluirá en el calculo actividades asignadas individualmente (tareas, test...)',
    },
    noModulesWarning: {
      title: 'No hay módulos asignados todavía',
      message:
        'Puedes crear una regla de ponderación aplicando el mismo porcentaje automáticamente para todos los módulos que asignes. Ajusta la regla manualmente cuando quieras.',
    },
    newModulesWarning:
      'Se han añadido nuevos módulos a esta clase. Para incluirlos en la ponderación, modifica los porcentajes',
  },
  evaluationNotebook: {
    title: 'Cuaderno de evaluación',
    filters: {
      searchTypes: {
        student: 'Estudiante',
        activity: 'Actividad',
      },
      search: 'Buscar {type}...',
      showNonEvaluable: 'Ver no calificables',
      goToWeighting: 'Ponderación',
      add: 'Añadir',
      manualActivity: 'Actividad evaluable',
      manualActivityCreated: 'Actividad evaluable creada correctamente',
      manualActivityError: 'Error creando actividad evaluable',
    },
    scoresTable: {
      students: 'Estudiantes',
      noActivity: 'NE',
      submitted: 'Entregado',
      avgScore: 'Nota promedio',
      calculated: 'Calculada',
      custom: 'Docente',
      attendance: 'Asistencia',
    },
    newModule:
      'Se han añadido nuevos módulos a esta asignatura que no están ponderados. Para calcularlos correctamente, accede a sus Reglas de ponderación.',
    updatedSuccess: 'Actualizada la nota de {{student}} en {{activity}} a un {{score}}',
    updatedError: 'Error actualizando la nota de {{student}} en {{activity}} a un {{score}}',
    closedEvaluationSuccess: 'Se ha cerrado {period} correctamente',
    closedEvaluationError: 'Error cerrando {period}',
    unableToOpen: 'Error al abrir la actividad, la actividad no se ha podido encontrar',
    noEvaluationPage: 'Esta actividad no tiene una página para evaluar',

    emptyState: {
      noFilters: {
        title: 'Seleccionar clase y periodo',
        description:
          'Selecciona la clase y luego filtra por periodos de evaluación. También puedes exportar estos informes a excel o csv.',
      },
      noResults: {
        title: 'Sin resultados',
        description: 'No hemos encontrado resultados para tu búsqueda.',
      },
    },
    footer: {
      closeEvaluation: 'Cerrar evaluación',
    },
  },
  myScores: {
    title: 'Mis evaluaciones',
    filters: {
      course: 'Curso',
    },
    localFilters: {
      subject: 'Asignatura',
      search: 'Buscar por actividad...',
      seeNonEvaluable: 'Ver no calificables',
    },
    finalGrades: 'Notas finales',
    noEvaluable: 'No calificable',
    downloadReport: 'Descargar boletín',

    emptyStates: {
      noFilters: {
        title: 'Seleccionar curso y periodo',
        description: 'Selecciona el curso y luego filtra por periodos de evaluación.',
      },
      noResults: {
        title: 'Sin resultados',
        description: 'No hemos encontrado resultados para tu búsqueda.',
      },
    },
  },
  manualActivityDrawer: {
    title: 'Nueva actividad evaluable',
    config: 'Configuración',
    date: { label: 'Fecha', error: 'La fecha es obligatoria' },
    name: { label: 'Nombre', error: 'El nombre es obligatorio' },
    description: { label: 'Descripción' },
    cancel: 'Cancelar',
    save: 'Crear actividad',

    weightType: {
      title: 'Ponderación',
      weightingBy: 'Estás ponderando por',
      averages: 'esta actividad pasará a contabilizarse en la media.',
      modules: 'esta actividad aparecerá como Módulo.',
      roles: '¿en qué tipo quieres incluir esta actividad?',
    },
  },
};
