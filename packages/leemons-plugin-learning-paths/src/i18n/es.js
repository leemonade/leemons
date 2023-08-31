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
      buttons: {
        save: 'Guardar borrador',
      },
    },
    tabs: {
      basicData: 'Datos básicos',
      structure: 'Estructura',
      resources: 'Recursos',
    },
    buttons: {
      next: 'Siguiente',
      previous: 'Anterior',
      publishOptions: 'Opciones de publicación',
      publish: 'Publicar',
      publishAndAssign: 'Publicar y asignar',
      publishAndShare: 'Publicar y compartir',

      tooltips: {
        disabledNotResources: 'Añade dos o más actividades para publicar',
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
          title: '¡Empecemos a crear!',
          description:
            'Añade recursos de la biblioteca y ordénalos según desees que le aparezcan al estudiante.',
        },
        moduleComposer: {
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
          title: '¡Empecemos a crear!',
          description:
            'Añade actividades a la biblioteca y ordénalas según desees que le aparezcan al estudiante.',
        },
        moduleComposer: {
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
      start: 'Comenzar',
      continue: 'Continuar',
      preview: 'Visualizar',
    },
    resources: 'Recursos',
  },
  modulesTab: {
    tabName: 'Temario',
  },
};
