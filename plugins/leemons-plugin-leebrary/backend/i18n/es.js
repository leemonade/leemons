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
      sharedWithMe: 'Compartidos conmigo',
      quickAccess: 'Favoritos',
      recent: 'Recientes',
      uploadButton: 'Nuevo',
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
      cancel: 'Cancelar',
    },
    basicData: {
      header: {
        stepLabel: 'Datos básicos',
        titleNew: 'Nuevo recurso',
        titleEdit: 'Editar recurso',
        back: 'Volver',
        presentation: 'Presentación',
        subTitle: 'Título del recurso',
      },
      footer: {
        finish: 'Finalizar',
        publish: 'Publicar',
      },
      bookmark: {
        titleNew: 'Nuevo marcador',
        titleEdit: 'Editar marcador',
        subTitle: 'Título del marcador',
      },
      labels: {
        content: 'Contenido',
        presentation: 'Presentación',
        other: 'Otros',
        title: 'Subir archivo',
        featuredImage: 'Imagen destacada',
        course: 'Curso',
        programAndSubjects: 'Programa y asignaturas',
        selectPlaceholder: 'Seleccionar...',
        tags: 'Etiquetas',
        addTag: 'Añadir',
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
        name: 'Título',
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
            title: 'Programas y Asignaturas',
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
            addSubject: 'Añadir',
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
        tagsInput: 'Escribe aquí las etiquetas y pulsa intro',
        name: 'Título del recurso',
        bookmarkName: 'Título del marcador',
        tagline: 'Subtítulo',
        tags: 'Etiquetas',
        description: 'Descripción del recurso',
        color: 'Seleccionar color',
        url: 'Enlace web',
      },
      errorMessages: {
        name: {
          required: 'Título es necesario',
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
        libraryItem: 'Item de biblioteca',
        permissionsHeader: 'Configuración de permisos',
        groupUserHeader: 'Grupo/Usuario',
        actionsHeader: 'Acciones',
      },
      labels: {
        currentUsers: 'Usuarios actuales',
        addUsersTab: 'Añadir usuarios',
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
        updateButton: 'Actualizar',
        saveFooterButton: 'Guardar',
        permissionsSuccess: 'Permisos establecidos con éxito',
        shareSuccess: 'Recurso compartido con éxito',
        shareCenters: 'Buscar centros',
        sharePrograms: 'Programas',
        shareProfiles: 'Perfiles',
        sharePermissions: 'Permisos',
        shareClasses: 'Buscar clase',
        editAddUsers: 'Usuarios individuales',
        addUserAlert:
          'Los docentes verán este recurso en su carpeta compartida, los estudiantes lo verán en su carpeta de asignatura correspondiente o en su carpeta compartida sino tiene etiquetas de asignatura asignada.',
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
    cancelModal: {
      title: 'Cancelar contenido',
      description: '¿Quieres cancelar este contenido?',
      confirm: 'Confirmar',
      cancel: 'Atrás',
    },
    common: {
      labels: {
        processingImage: 'Procesando imagen',
      },
    },
  },
  list: {
    show: 'Mostrar',
    goTo: 'Ir a',
    permissions: 'Permisos',
    editPermissions: 'Editar permisos',
    owner: 'Propietario',
    viewer: 'Lectura',
    editor: 'Editor',
    assigner: 'Asignador',
    new: 'Nuevo {label}',
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

      searchListEmpty: 'No hay ningún ítem disponible con tus criterios de búsqueda',
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
      assetStatus: 'Estado',
      assetStatusPublished: 'Publicado',
      assetStatusDraft: 'Borrador',
      assetStatusAll: 'Todos los estados',
      detail: 'Detalle',
      permissions: 'Permisos',
      instructions: 'Instrucciones',
      emptyInstructions: 'Este recurso no tiene instrucciones para los docentes todavía.',
    },
    cardToolbar: {
      edit: 'Editar',
      duplicate: 'Duplicar',
      download: 'Descargar',
      delete: 'Eliminar',
      share: 'Permisos',
      assign: 'Asignar',
      pin: 'Marcar como favorito',
      unpin: 'Quitar de favorito',
      toggle: 'Cerrar',
      open: 'Abrir',
      covertToTask: 'Asignar',
    },

    emptyStates: {
      title: 'Aún no hay {category}',
      'media-files': {
        descriptionCTA: 'Crea un {singularCategory}.',
        helpCTA: 'Cómo crear un {singularCategory}.',
        description:
          'Comienza a cargar tus archivos multimedia (imágenes, PDFs, audios, videos...) pulsando {CTA}',
        help: 'Y si necesitas ayuda, accede a {CTA}',
      },
      bookmarks: {
        descriptionCTA: 'Crea un {singularCategory}.',
        helpCTA: 'Cómo crear un {singularCategory}.',
        description:
          'Un marcador es un acceso directo a una página web que te interesa tener a mano. Crea tu primer marcador copiando la dirección web del sitio y pulsando {CTA}',
        help: 'Y si necesitas ayuda, accede a {CTA}',
      },
      pins: {
        helpCTA: 'Cómo gestionar favoritos.',
        description:
          'Pulsa en el icono corazón en la tarjeta de cualquier elemento de la biblioteca para destacarlo en esta sección y tenerlo a mano.',
        help: 'Y si necesitas ayuda, accede a {CTA}',
      },
      'leebrary-shared': {
        descriptionCTA: 'Nuevo',
        description:
          'Cuando otro usuario comparta contigo un contenido, recurso o actividad aparecerá destacado en esta sección. Aún no te han compartido nada pero puedes empezar creando tus propios materiales pulsando en el botón {CTA} en la zona superior izquierda.',
      },
      'leebrary-recent': {
        descriptionCTA: 'Nuevo',
        description:
          'Podrás encontrar aquí los últimos elementos de la biblioteca. Comienza pulsando en el botón {CTA} en la zona superior izquierda para subir un recurso, crear un marcador o una tarea o redactar un contenido y aparecerán en esta sección.',
      },
      'leebrary-subject': {
        title: 'Aún no hay contenido de tus asignaturas',
        description:
          'Cuando tus profesores compartan recursos de clase contigo aparecerán en estas carpetas. También puedes almacenar tu contenido en esta carpeta etiquetándolos con una asignatura.',
        help: 'Y si necesitas ayuda accede a {CTA}',
        helpCTA: 'Cómo etiquetar contenidos',
      },
      'assignables.content-creator': {
        descriptionCTA: 'Crea un {singularCategory}.',
        helpCTA: 'Cómo crear {pluralCategory}.',
        description:
          'En Leemons puedes crear tus propios documentos con contenido para los estudiantes. Crea tu primer documento pulsando {CTA}',
        help: 'Y si necesitas ayuda, accede a {CTA}',
      },
      'assignables.task': {
        descriptionCTA: 'Crea una {singularCategory}.',
        helpCTA: 'Cómo crear {pluralCategory}.',
        description:
          'Las tareas son actividades que puedes asignar tus estudiantes para que apliquen lo que han aprendido de forma práctica o demuestren sus conocimientos. Crea tu primera tarea pulsando {CTA}',
        help: 'Y si necesitas ayuda, accede a {CTA}',
      },
      'tests-questions-banks': {
        descriptionCTA: 'Crea un {singularCategory}.',
        helpCTA: 'Cómo crear {pluralCategory}.',
        description:
          'Los bancos de preguntas son la base para crear test de evaluación, puedes agrupar tus materiales por temas en diferentes bancos donde clasificarlas por categorías y dificultad. Crea tu primer banco pulsando {CTA}',
        help: 'Y si quieres saber como funcionan en detalle, accede a {CTA}',
      },
      'assignables.tests': {
        descriptionCTA: 'Crea un {singularCategory}.',
        helpCTA: 'Cómo crear {singularCategory}.',
        description:
          'Un test es un conjunto de cuestiones seleccionadas dentro de un banco de preguntas y sirven para evaluar el conocimiento. Crea tu primer test pulsando {CTA}',
        help: 'Y si quieres saber como funcionan en detalle, accede a {CTA}',
      },
      'assignables.feedback': {
        descriptionCTA: 'Crea una {singularCategory}.',
        helpCTA: 'Cómo crear {pluralCategory}.',
        description:
          'Con las encuestas podrás conocer el grado de satisfacción de tus estudiantes, solicitar feedback sobre contenido, tareas, etc... y visualizar los resultados en un informe super útil. Crea tu primera encuesta pulsando {CTA}',
        help: 'Y si quieres saber como funcionan en detalle, accede a {CTA}',
      },
      'assignables.learningpaths.module': {
        descriptionCTA: 'Crea un {singularCategory}.',
        helpCTA: 'Cómo crear {pluralCategory}.',
        description:
          'Un módulo es una situación de aprendizaje que tiene varias etapas (un contenido, un test, una tarea...) y que deben realizarse de forma consecutiva. Para crear un módulo deberás subir o crear antes los contenidos y actividades que lo componen. Empieza ya pulsando {CTA}',
        help: 'Y si quieres saber como funcionan en detalle, accede a {CTA}',
      },
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
      mediaType: {
        label: 'Tipos de recurso',
        placeholder: 'Seleccionar tipo',
        allTypes: 'Todos los tipos',
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
    finalize: 'Finalizando subida',
    processingImage: 'Procesando imagen',
    finalizing: 'Finalizando...',
  },
  assetsList: {
    published: 'Publicados',
    draft: 'Borradores',
    isDraft: 'Borrador',
    size: 'Tamaño',
    dimensions: 'Dimensiones',
    format: 'Formato',
    duration: 'Duración',
    lastUpdate: 'Última actualización',
  },
  pdfPlayer: {
    pageLabel: 'Página',
    paginatorLabel: '/',
    schemaLabel: 'Esquema',
  },
};
