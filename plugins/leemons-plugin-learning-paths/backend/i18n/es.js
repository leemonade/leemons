module.exports = {
  libraryPage: {
    header: {
      title: 'Biblioteca de módulos',
      buttons: {
        new: 'Nuevo',
      },
    },
    tabs: {
      published: 'Publicados',
      draft: 'Borradores',
    },
  },
  moduleSetup: {
    header: {
      title: 'Nuevo módulo',
      editTitle: 'Editar módulo',
      subtitlePlaceholder: 'Título del módulo',
      cancel: 'Cancelar',
      buttons: {
        save: 'Guardar borrador',
      },
    },
    tabs: {
      basicData: 'Datos básicos',
      structure: 'Contenido',
      resources: 'Recursos',
    },
    buttons: {
      next: 'Siguiente',
      previous: 'Anterior',
      saveDraft: 'Guardar borrador',
      finish: 'Finalizar',
      publish: 'Publicar',
      publishAndAssign: 'Publicar y asignar',
      publishAndShare: 'Publicar y compartir',

      tooltips: {
        disabledNotActivities: 'Añade dos o más actividades para continuar',
      },
    },
    steps: {
      basicData: {
        errors: {
          program: {
            required: 'Programa es necesario',
          },
          subject: {
            required: 'Al menos una asignatura es necesaria',
          },
        },
      },
      resourcesData: {
        buttons: {
          new: 'Nuevo recurso',
        },
        emptyState: {
          title: 'Recursos adicionales de aprendizaje',
          description:
            'Puedes seleccionar recursos adicionales para profundizar en la materia (opcional)',
        },
        moduleComposer: {
          title: 'Recursos adicionales de aprendizaje',
          columns: {
            resource: 'Recurso',
            actions: 'Acciones',
          },
          lastUpdate: 'Última actualización',
        },
      },
      structureData: {
        alerts: {
          error: {
            nonAssignableAsset: 'El recurso seleccionado no es una actividad asignable',
          },
        },
        buttons: {
          new: 'Añadir actividad',
        },
        emptyState: {
          title: 'Listado',
          description:
            'Selecciona actividades de tu biblioteca para crear un itinerario personalizado.',
        },
        moduleComposer: {
          title: 'Listado',
          columns: {
            resource: 'Actividad',
            type: 'Tipo',
            time: 'Tiempo',
            actions: 'Acciones',
          },
          lastUpdate: 'Última actualización',
          types: {
            optional: 'Opcional',
            recommended: 'Recomendable',
            mandatory: 'Obligatorio',
            blocking: 'Bloqueante',
          },
        },
      },
    },
    alert: {
      saveSuccess: 'Guardado correctamente',
      saveError: 'No ha sido posible guardar',
      publishSuccess: 'Guardado y publicado correctamente',
      publishError: 'No ha sido posible guardar y publicar',
    },
  },
  libraryCard: {
    menuItems: {
      toggle: 'Cerrar',
      open: 'Abrir',
      view: 'Ver',
      edit: 'Editar',
      assign: 'Asignar',
      duplicate: 'Duplicar',
      delete: 'Eliminar',
      share: 'Compartir',
      pin: 'Marcar como favorito',
      unpin: 'Desmarcar como favorito',
      cannotAssignModal: {
        title: 'Directrices de asignación',
        descriptionWhenNotOwner:
          'Debes ser profesor de alguna de las asignaturas asociadas al módulo o su propietario para poder asignarlo.',
        descriptionWhenOwner:
          'Eres propietario de este módulo pero no eres profesor de ninguna de las asignaturas asociadas. Por favor, edita el módulo para actualizar o eliminar las asignaturas asociadas si deseas asignarlo.',
        edit: 'Editar módulo',
        accept: 'Aceptar',
      },
    },
    alerts: {
      duplicate: {
        success: 'Recurso duplicado con éxito',
        error: 'No se ha podido duplicar el recurso',
      },
      delete: {
        success: 'Recurso eliminado con éxito',
        error: 'No se ha podido eliminar el recurso',
      },
    },
  },
  assignation: {
    steps: {
      assignmentForm: {
        action: 'Asignar como módulo',
      },
      setup: {
        action: 'Configuración',
      },
    },
    buttons: {
      previous: 'Anterior',
      next: 'Siguiente',
      assign: 'Asignar',
    },
    alert: {
      failedToAssign: 'Ha ocurrido un error mientras se asignaba',
    },
  },
  dashboard: {
    activities: 'Actividades',
    buttons: {
      review: 'Revisar',
      start: 'Empezar',
      continue: 'Continuar',
      preview: 'Visualizar',
      viewEvaluation: 'Ver evaluación',
      notAvailable: 'No disponible',
      forEvaluate: 'Para evaluar',
      viewProgress: 'Ver progreso',
      viewReport: 'Ver informe',
    },
    resources: 'Recursos',
    students: 'Estudiantes',
    progress: 'Progreso',
    allStudentsEvaluated: 'Todos los alumnos evaluados',
    studentProgressTitle: 'Notas del módulo',
    teacherProgressTitle: 'Notas medias del módulo',
  },
  modulesTab: {
    tabName: 'Temario',
  },
  moduleDrawer: {
    module: 'Módulo',
    activities: 'Actividades',
    name: 'Nombre',
    Type: 'Tipo',
  },
  moduleCardBadge: {
    options: {
      nonEvaluable: 'No evaluable',
      calificable: 'Calificable',
      punctuable: 'Puntuable',
      feedbackOnly: 'Solo comentarios',
      feedback: 'Feedback',
      feedbackAvailable: 'Feedback disponible',
    },
  },
  gradeState: {
    evaluated: 'Evaluada',
    delivered: 'Entregada',
  },
  moduleJourney: {
    introduction: 'Introducción',
    resources: 'Recursos',
  },
  emptyState: {
    description: 'No hay ningún módulo asignado',
  },
};
