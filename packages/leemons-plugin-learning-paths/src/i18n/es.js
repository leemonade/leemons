module.exports = {
  libraryPage: {
    header: {
      title: 'Librería de módulos',
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
    },
    buttons: {
      next: 'Siguiente',
      previous: 'Anterior',
      publishOptions: 'Opciones de publicación',
      publish: 'Publicar',
      publishAndAssign: 'Publicar y asignar',
      publishAndShare: 'Publicar y compartir',

      tooltips: {
        disabledNotResources: 'Añade dos o más recursos para publicar',
      },
    },
    steps: {
      basicData: {
        errors: {
          tagline: {
            required: 'Subtítulo es necesario',
          },
          program: {
            required: 'Programa es necesario',
          },
          subject: {
            required: 'Al menos una asignatura es necesaria',
          },
        },
      },
      structureData: {
        alerts: {
          error: {
            nonAssignableAsset: 'El recurso seleccionado no es una actividad asignable',
          },
        },
        buttons: {
          new: 'Nuevo recurso',
        },
        emptyState: {
          title: '¡Empecemos a crear!',
          description:
            'Añade recursos a la librería y ordénalos según desees que le aparezcan al estudiante.',
        },
        moduleComposer: {
          columns: {
            resource: 'Recurso',
            type: 'Tipo',
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
  },
  libraryCard: {
    menuItems: {
      edit: 'Editar',
      assign: 'Asignar',
      duplicate: 'Duplicar',
      delete: 'Eliminar',
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
};
