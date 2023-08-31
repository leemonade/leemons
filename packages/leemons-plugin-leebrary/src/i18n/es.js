module.exports = {
  tableInput: {
    add: 'Añadir',
    remove: 'Eliminar',
    edit: 'Editar',
    accept: 'Aceptar',
    cancel: 'Cancelar',
  },
  home: {
    navbar: {
      title: 'Biblioteca',
      subjects: 'Asignaturas',
      sharedWithMe: 'Compartido conmigo',
      quickAccess: 'Destacados',
      uploadButton: 'Subir o crear',
      createNewTitle: 'Crear nuevo',
      uploadTitle: 'Subir archivo',
      fileUploadTitle: 'Click para buscar un archivo',
      fileUploadSubtitle: 'o arrastrar aquí desde el ordenador',
    },
  },
  assetSetup: {
    header: {
      back: 'Volver',
      close: 'Cerrar',
      title: 'Biblioteca',
    },
    basicData: {
      header: {
        stepLabel: 'Datos básicos',
        titleNew: 'Nuevo recurso',
        titleEdit: 'Editar recurso',
        back: 'Volver',
      },
      bookmark: {
        title: 'Nuevo marcador',
      },
      labels: {
        title: 'Subir archivo',
        featuredImage: 'Imagen destacada',
        tags: 'Tags',
        addTag: 'Añadir tag',
        changeImage: 'Cambiar imagen',
        uploadButton: 'Subir imagen',
        browseFile: 'Click para buscar un archivo',
        advancedConfig: 'Configuración avanzada',
        program: 'Programa',
        subjects: 'Asignaturas',
        dropFile: 'o arrastrar aquí desde el ordenador',
        search: 'Buscar en la biblioteca',
        submitForm: 'Añadir a la biblioteca',
        submitChanges: 'Guardar cambios',
        name: 'Nombre',
        tagline: 'Subtítulo',
        description: 'Descripción',
        createdSuccess: 'Recurso creado con éxito',
        updatedSuccess: 'Recurso actualizado con éxito',
        url: 'URL (enlace web)',
        checkUrl: 'Comprobar url',
        color: 'Color',
        wordCounter: {
          single: 'Palabra',
          plural: 'Palabras',
        },
        preview: 'Vista previa',
        subjectSelects: {
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
      },
      descriptions: {
        featuredImage: 'Cambiar la imagen por defecto de la página web',
      },
      placeholders: {
        tagsInput: 'Escribir etiqueta',
        name: 'Nombre del recurso',
        tagline: 'Subtítulo',
        tags: 'Etiquetas',
        description: 'Descripción del recurso',
        color: 'Seleccionar color',
        url: 'Enlace web',
      },
      errorMessages: {
        name: {
          required: 'Nombre es necesario',
        },
        file: {
          required: 'Archivo es necesario',
          rejected: 'Archivo no permitido',
        },
        tags: {
          required: 'Escribir etiqueta',
        },
        url: {
          required: 'URL es necesaria',
        },
        program: {
          required: 'Programa es necesario',
        },
        subject: {
          required: 'Asignatura es necesario',
        },
      },
    },
    permissionsData: {
      header: {
        stepLabel: 'Permisos',
        shareTitle: 'Compartir recurso',
        close: 'Cerrar',
      },
      labels: {
        allCenters: 'Todos los centros',
        shareTypePublic: 'Público',
        shareTypeCenters: 'Por centros',
        shareTypeProfiles: 'Por perfiles',
        shareTypePrograms: 'Por programa',
        shareTypeClasses: 'Por clases',
        shareTypeUsers: 'Por usuarios',
        shareTab: 'Compartir',
        sharedTab: 'Compartido con...',
        title: 'Permisos del recurso',
        addProfiles: 'Añadir perfiles',
        addProfilesDescription:
          'Los usuarios con los perfiles indicados verán este recurso en su carpeta compartida, los estudiantes lo verán en su carpeta de asignatura correspondiente o en su carpeta compartida si no tiene etiquetas de asignatura asignada.',
        addProfilesEdit: 'Perfiles',
        addClasses: 'Añadir classes',
        addClassesDescription:
          'Los usuarios de las clases verán este recurso en su carpeta compartida, los estudiantes lo verán en su carpeta de asignatura correspondiente o en su carpeta compartida si no tiene etiquetas de asignatura asignada.',
        addPrograms: 'Añadir programas',
        addProgramsDescription:
          'Los usuarios de los programas verán este recurso en su carpeta compartida, los estudiantes lo verán en su carpeta de asignatura correspondiente o en su carpeta compartida si no tiene etiquetas de asignatura asignada.',
        addProgramsEdit: 'Programas',
        profilesPerProgram: 'Añadir perfiles por programa',
        addUsers: 'Añadir usuarios individuales',
        addUsersDescription:
          'Los docentes verán este recurso en su carpeta compartida, los estudiantes lo verán en su carpeta de asignatura correspondiente o en su carpeta compartida si no tiene etiquetas de asignatura asignada.',
        programs: 'Programas educativos',
        program: 'Programa',
        profilesPerCenter: 'Añadir perfiles por centro',
        programsPerCenter: 'Añadir programas por centro',
        addCentersEdit: 'Centros',
        addCenters: 'Añadir centros',
        addCenterEditAll:
          'Por seguridad no se puede configurar que para todos los centros tengan permiso de editar',
        addCenterAsPublic:
          'Has añadido el equivalente a publico, si guardas si borraran todos los permisos de lectura actuales y se pondra publico para todos',
        addCentersDescription:
          'Todos los perfiles del centro seleccionado verán este recurso en sus carpetas de asignatura correspondiente.',
        isPublic: 'Este recurso es público',
        saveButton: 'Guardar permisos',
        shareButton: 'Compartir',
        addUserButton: 'Añadir',
        editUserButton: 'Editar',
        removeUserButton: 'Eliminar',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar',
        permissionsSuccess: 'Permisos establecidos con éxito',
        shareSuccess: 'Recurso compartido con éxito',
        shareCenters: 'Buscar centros',
        sharePrograms: 'Programas',
        shareProfiles: 'Perfiles',
        sharePermissions: 'Permisos',
        shareClasses: 'Buscar clase',
        editAddUsers: 'Usuarios individuales',
      },
      placeholders: {
        userInput: 'Escribir nombre',
        userRole: 'Seleccionar rol',
      },
      errorMessages: {
        user: {
          required: 'Usuario es necesario',
        },
        userRole: {
          required: 'Rol es necesario',
        },
        share: {
          required: 'Sin permisos para compartir el recurso',
        },
      },
    },
    roleLabels: {
      viewer: 'Lectura',
      commentor: 'Comentario',
      editor: 'Editor',
      assigner: 'Asignador',
      owner: 'Propietario',
      public: 'Público',
    },
  },
  list: {
    show: 'Mostrar',
    goTo: 'Ir a',
    tableLabels: {
      name: 'Nombre',
      owner: 'Propietario/a',
      updated: 'Última modificación',
    },
    labels: {
      search: 'Buscar',
      searchPlaceholder: 'Buscar recursos',
      type: 'Tipo',
      duplicateSuccess: 'Recurso duplicado con éxito',
      removeSuccess: 'Recurso eliminado con éxito',
      pinnedSuccess: 'Recurso anclado con éxito',
      unpinnedSuccess: 'Recurso desanclado con éxito',
      listEmpty: 'No hay ningún recurso disponible',
      listEmptyDescription:
        'Gracias a las Biblioteca de Leemons, los docentes pueden gestionar tareas, tests, sesiones... y tanto docentes como estudiantes crear y compartir archivos multi-media y guardar sus páginas web favoritas.',
      searchListEmpty: 'No hay ningún recurso disponible con tus criterios de búsqueda',
      searchListEmptyDescription:
        'Prueba a buscar por palabras clave (tags) o a escribir un término más genérico y luego utiliza los filtros para refinar tu búsqueda.',
      copy: 'Copiar',
      copied: 'Copiado',
      privated: 'Privado',
      sharedWith: 'Compartido',
      sharedViewAll: 'Ver todos',
      sharedWithEverybody: 'Compartido con todos',
      showPublic: 'Mostrar recursos públicos',
      resourceTypes: 'Tipos de recursos',
      allResourceTypes: 'Todos los tipos',
    },
    cardToolbar: {
      edit: 'Editar',
      duplicate: 'Duplicar',
      download: 'Descargar',
      delete: 'Eliminar',
      share: 'Compartir',
      assign: 'Asignar',
      pin: 'Pinear',
      unpin: 'Despinear',
      toggle: 'Cerrar',
      open: 'Abrir',
      covertToTask: 'Convertir a tarea',
    },
  },
  pickerDrawer: {
    header: {
      title: 'Biblioteca',
    },
    tabs: {
      library: 'Biblioteca',
      new: 'Nuevo recurso',
    },
    filters: {
      search: {
        label: 'Buscar',
        placeholder: 'Buscar recursos',
      },
      resources: {
        label: 'Categorías',
        placeholder: 'Seleccionar categoría',
      },
    },
  },
  admin: {
    card: {
      title: 'Proveedores de biblioteca',
      description: 'Configura tus proveedores para la gestion de la biblioteca',
    },
    setup: {
      chooseProvider: 'Selecciona un proveedor',
    },
  },
  uploadFileModal: {
    title: 'Subiendo archivo',
    fileOf: 'Subiendo archivo {currentFile} de {totalFiles} - {currentFilePercentageCompleted}%',
    init: 'Iniciando subida',
    unzip: 'Preparando zip para la subida',
  },
  assetsList: {
    published: 'Publicados',
    draft: 'Borradores',
  },
};
