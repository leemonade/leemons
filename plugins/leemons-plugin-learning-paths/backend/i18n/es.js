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
      buttons: {
        save: 'Guardar borrador',
      },
    },
    tabs: {
      basicData: 'Datos básicos',
      structure: 'Itinerario de aprendizaje',
      resources: 'Recursos',
    },
    buttons: {
      next: 'Siguiente',
      previous: 'Anterior',
      saveDraft: 'Guardar borrador',
      publishOptions: 'Opciones de publicación',
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
          new: 'Nueva actividad',
        },
        emptyState: {
          title: 'Listado de actividades',
          description:
            'Selecciona actividades de tu biblioteca para crear un itinerario personalizado.',
        },
        moduleComposer: {
          title: 'Listado de actividades',
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
      share: 'Permisos',
    },
    duplicate: {
      title: 'Duplicar módulo',
      message: '¿Seguro que quiere duplicar el módulo {{name}}?',
      success: 'El módulo {{name}} ha sido duplicado',
      error: 'El módulo {{name}} no ha podido ser duplicado',
    },
    delete: {
      title: 'Eliminar módulo',
      message: '¿Seguro que quiere eliminar el módulo {{name}}?',
      success: 'El módulo {{name}} ha sido eliminado',
      error: 'El módulo {{name}} no ha podido ser eliminado',
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
    students: 'Alumnos',
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
};
