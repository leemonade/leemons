module.exports = {
  calendar: {
    user_section: 'Mis calendarios',
  },
  user_data_page: {
    page_title: 'Datos del usuario',
    page_description:
      'En esta sección se configuran los campos del dataset de usuarios. Los datos de identificación son obligatorios para el funcionamiento de la plataforma y obligatorios para todos los usuarios de cualquier perfil. Los campos comunes son los que comparten todos los usuarios, pueden ser obligatorios u opcionales (son útiles para ahorrar tiempo a la hora de definir campos comunes a todos los usuarios de la plataforma como un nombre o un apellido). <br/> Por último, los perfiles tienen sus propios conjuntos de datos que pueden ser consultados en la sección de perfiles.',
    tabs: {
      system_data: 'Datos del sistema',
      common_fields: 'Campos comunes',
    },
    systemData: {
      save: 'Guardar',
      saveSuccess: 'Guardado con éxito',
      description1:
        'Campos obligatorios para crear cuentas de usuario (no se pueden editar o eliminar)',
      description2: 'Campos incluidos en el sistema Leemons que se pueden configurar',
      table: {
        name: 'Nombre',
        description: 'Descripción',
        type: 'Tipo',
        actions: 'Acciones',
        makeMandatory: 'Hacer obligatorio',
        disableField: 'Deshabilitar',
      },
      tableItems: {
        email: {
          name: 'Email',
          description: 'Identificador único',
          type: 'Email',
        },
        password: {
          name: 'Contraseña',
          description: '8 caracteres, 1 número, 1 mayúscula, 1 carácter especial',
          type: 'Password',
        },
        name: {
          name: 'Nombre',
          description: 'Cadena, 26 caracteres regulares (sin caracteres especiales)',
          type: 'String',
        },
        surname: {
          name: 'Apellido',
          description: 'Cadena, 26 caracteres regulares (sin caracteres especiales)',
          type: 'String',
        },
        birthday: {
          name: 'Fecha de nacimiento',
          description: 'dd/mm/yyyy',
          type: 'Date',
        },
        surname2: {
          name: '2do. Apellido',
          description: 'Cadena, 26 caracteres regulares (sin caracteres especiales)',
          type: 'String',
        },
        avatar: {
          name: 'Avatar',
          description: 'Formato: PNG, JPG, tamaño 400x400px, máximo 500kb)',
          type: 'Image',
        },
      },
    },
    basic: {
      description: 'Configuración de campos generales',
      table: {
        name: 'Nombre',
        description: 'Descripción',
        type: 'Tipo',
        actions: 'Acciones',
      },
      edit: 'Editar',
      delete: 'Borrar',
    },
    dataset: {
      description: 'Configuración de campos generales',
      filter_by_center: 'Filtrar por centro',
      add_field: 'Añadir campo',
      no_data_in_table: 'Aun no hay datos',
      deleted_done: 'Elemento del dataset borrado con éxito',
    },
    remove_modal: {
      title: '¿Eliminar el elemento?',
      message: 'Esta acción no puede deshacerse',
      cancel: 'No',
      action: 'Eliminar',
    },
  },
  welcome_page: {
    page_title: 'Administración de usuarios',
    page_description: 'Primeros pasos para configurar correctamente la administración de usuarios.',
  },
  hero_bg: {
    text: '"¡No sé el significado de la mitad de esas largas palabras y, además, no creo que tú tampoco lo sepas!"',
    author: 'Alice in Wonderland <br/> Lewis Carrol',
  },
  list_profiles: {
    page_title: 'Perfiles',
    page_description:
      'Los perfiles de usuario pemriten gestionar los permisos de las aplicaciones. Cada vez que se instala un nuevo plugin es necesario configurar los permisos para cada perfil existente.',
    name: 'Nombre',
    overview: 'Resumen',
    actions: 'Acciones',
    view: 'Ver',
  },
  detail_profile: {
    profile_name: 'Nombre del perfil',
    description: 'Descripción del perfil',
    leemon: 'Leemon',
    permissions_all: 'Todos',
    permissions: 'Permisos',
    select_permissions: 'Seleccione un Leemon para asignar permisos',
    dataset: 'Dataset',
    save_done: 'Perfil creado',
    update_done: 'Perfil actualizado',
    translations: 'Traducciones',
    translations_warning: 'Es necesario guardar el perfil para almacenar las traducciones',
    options_modal: {
      title: 'Traducción',
      description: 'Traducciones de la información del perfil a los idiomas del sistema',
      accept: 'Aceptar',
      cancel: 'Cancelar',
      profile_name: 'Nombre del perfil',
      profile_description: 'Descripción del perfil',
    },
    dataset_tab: {
      description: 'Campos adicionales para este perfil',
      filter_by_center: 'Filtrar por centro',
      add_field: 'Añadir campo',
      no_data_in_table: 'Aun no hay datos',
      deleted_done: 'Elemento del dataset borrado con éxito',
      table: {
        name: 'Nombre',
        description: 'Descripción',
        type: 'Tipo',
        actions: 'Acciones',
        edit: 'Editar',
        delete: 'Borrar',
      },
    },
    remove_modal: {
      title: '¿Quieres eliminar el elemento?',
      message: 'Esta acción no puede deshacerse',
      cancel: 'No',
      action: 'Eliminar',
    },
  },
  login: {
    title: 'Acceder a mi cuenta',
    email: 'Email',
    password: 'Contraseña',
    remember_password: 'No recuerdo mi contraseña',
    log_in: 'Entrar',
    not_registered: 'No estoy registrado',
    form_error: 'El email o la contraseña no son correctas',
  },
  registerPassword: {
    title: 'Crear mi contraseña',
    password: 'Contraseña',
    repeatPassword: 'Repetir contraseña',
    setPassword: 'Establecer contraseña',
    repeatPasswordPlaceholder: 'Repitir contraseña',
    passwordPlaceholder: 'Contraseña',
    passwordMatch: 'Las contraseñas no coinciden',
    tokenError:
      'El código para configurar la contraseña ha caducado o no es valido, contactar con el centro.',
    passwordSet: 'Contraseña establecida con éxito',
    checkList: {
      minLength: 'La contraseña tiene al menos {n} caracteres.',
      specialChar: 'La contraseña tiene caracteres especiales.',
      number: 'La contraseña tiene un número.',
      capital: 'La contraseña tiene una letra mayúscula.',
      match: 'Error al cifrar de nuevo la cartera. La contraseña no cambió.',
    },
  },
  recover: {
    title: 'He olvidado mi contraseña',
    description:
      'Introduzca la dirección de correo electrónico asociada a su cuenta y le enviaremos un enlace para restablecer su contraseña.',
    email: 'Email',
    resetPassword: 'Recuperar contraseña',
    returnLogin: 'Volver al login',
    emailSendTo: 'Te hemos enviado un email a: {email}',
    emailRequired: 'Email necesario',
    accountNotActive:
      'Tu cuenta aun no esta activa, te hemos mandado el email de activación desde el que podrás setear tu contraseña.',
  },
  reset: {
    title: 'Crear nueva contraseña',
    description: 'Introduce una nueva contraseña para acceder a leemons.',
    tokenNoValid: 'El token para resetear a caducado o no es valido',
    password: 'Contraseña',
    resetPassword: 'Restablecer contraseña',
    returnLogin: 'Volver al login',
    passwordRequired: 'Contraseña necesaria',
    passwordSet: 'Contraseña establecida con éxito',
  },
  selectProfile: {
    title: 'Hola, {name}',
    number_of_profiles:
      'Tienes {profiles} perfiles en Leemons, por favor selecciona con el que quieres acceder',
    several_centers:
      'Tienes varios centros y perfiles en Leemons, por favor selecciona cómo quieres acceder.',
    use_always_profile: 'Recordar esta configuración',
    change_easy: 'Siempre podrás cambiar de perfil o centro desde tu cuenta de usuario.',
    log_in: 'Entrar',
    choose_center: 'Seleccionar un centro',
    superAdmin: 'Super admin',
  },
  list_users: {
    import: 'Importar usuarios',
    new: 'Nuevo usuario',
    edit: 'Editar usuario',
    pageTitle: 'Listado de usuarios',
    centerLabel: 'Centro',
    stateLabel: 'Estado',
    profileLabel: 'Perfil',
    searchTitle: 'Buscar usuarios',
    searchLabel: 'Buscar',
    searchPlaceholder: 'Escribe nombre, email...',
    stateActive: 'Activos',
    stateDisabled: 'Desactivados',
    statePending: 'Contraseña pendiente',
    stateVerified: 'Verificado',
    nameHeader: 'Nombre',
    surnameHeader: 'Apellidos',
    emailHeader: 'Email',
    birthdayHeader: 'Fecha de nacimiento',
    phoneHeader: 'Teléfono',
    actionsHeader: 'Acciones',
    stateHeader: 'Estado',
    usersTab: 'Usuarios',
    clearFilter: 'Limpiar filtros',
    selectPlaceholder: 'Seleccionar...',
    view: 'Ver',
    viewAll: 'Ver todos...',
    show: 'Mostrar',
    goTo: 'Ir a',
    disableUsers: 'Desactivar perfiles',
    activateUsers: 'Activar perfiles',
    activateUserManually: 'Establecer contraseña',
    bulkActions: 'Acciones masivas',
    selectedUsers: '({n} usuarios seleccionados)',
    nUsers: '({n} usuarios encontrados)',
    active: 'Activo',
    disable: 'Inactivo',
    tagsHeader: 'Etiquetas',
    lastConnectionHeader: 'Última conexión',
    emptyState: 'No has creado ningún usuario para este centro.',
    noResults: 'No hay resultados para tu búsqueda.',
    enableUserSuccess: 'Se han activado {n} usuarios con éxito',
    disableUserSuccess: 'Se han desactivado {n} usuarios con éxito',
    enableSingleUserSuccess: 'Se ha activado {n} usuario con éxito',
    disableSingleUserSuccess: 'Se ha desactivado {n} usuario con éxito',
  },
  create_users: {
    pageTitle: 'Crear usuarios',
    profileLabel: 'Perfiles',
    profileRequired: 'Perfil es requerido',
    tagsHeader: 'Etiquetas',
    save: 'Guardar',
    create: 'Crear',
    usersAddedSuccessfully: 'Usuario guardado con éxito',
    enableProfileSuccess: 'Perfil {profile} activado correctamente',
    disableProfileSuccess: 'Perfil {profile} desactivado correctamente',
    impersonate: 'Impersonar usuario',
  },
  impersonate: {
    failedImpersonate: 'Error al impersonar usuario',
    title: 'Impersonar usuario',
    alert: {
      title: 'Importante',
      description:
        'Esta acción permite navegar por la plataforma en nombre del usuario. Debes tener ESPECIAL CUIDADO en las acciones que realizas (ya que no podrán deshacerse).',
    },
    message:
      'Si pulsas "Impersonar", cerraremos tu sesión de administrador y abriremos una nueva sesión como usuario {name}',
    cancel: 'Cancelar',
    confirm: 'Impersonar',
  },
  needDatasetDataModal: {
    title: 'Información requerida',
    description:
      'Debes completar algunos campos requeridos en tu perfil. Por favor, actualiza tu información para continuar.',
    goPageButton: 'Completar ahora',
  },
  userDataDatasetPage: {
    pageTitle: 'Datos de usuario',
    pageDescription: 'Añadir datos necesarios',
    save: 'Guardar',
    saveSuccess: 'Datos guardados con éxito',
    additionalInfo: 'Información adicional',
  },
  detailUser: {
    title: 'Mi Perfil',
    disableTitle: 'Desactivar usuario',
    disableDescription:
      'Este usuario ya no tendra acceso a la plataforma y no sera visible por sus compañeros ni profesores <br/><br/> Puedes volver a activar dicho usuario en cualquier momento.',
    disable: 'Confirmar',
    disableBtn: 'Desactivar',
    disableSucess: 'Usuario desactivado',
    active: 'Activar',
    activeSucess: 'Usuario activado',
    imageUpdated: 'Imagen actualizada',
    changeAvatar: 'Cambiar avatar',
    selectCenter: 'Seleccionar un centro',
    selectProfile: 'Seleccionar un perfil',
    noResults: 'No hay resultados con los criterios indicados',
    preferredGenderLabel: 'Pronombre de género preferido',
    personalInformationLabel: 'Información personal',
    recoveryLink: 'Enviar enlace de recuperación',
    sendActivationEmail: 'Enviar correo de activación',
    manualActivation: 'Activar de forma manual',
    provisionalPassword: 'Contraseña provisional',
    repeatPassword: 'Repite la contraseña',
    activeUser: 'Activar usuario',
    requiredPassword: 'Campo requerido',
    passwordNotMatch: 'Las contraseñas no coinciden',
    activatedUser: 'Usuario activado',
    activationEmailSent: 'Correo de activación enviado',
    recoveryEmailSent: 'Correo de recuperación enviado',
    otherInformationLabel: 'Otra información',
    tags: 'Tags',
    addTag: 'Añadir',
    edit: 'Editar',
    save: 'Guardar',
    cancel: 'Cancelar',
    saveSuccess: 'Datos guardados con éxito',
  },
  userDetailModal: {
    male: 'Hombre',
    female: 'Mujer',
    other: 'Otro',
    personalInformation: 'Información personal',
    badges: 'Etiquetas',
    email: 'Email',
    name: 'Nombre',
    surnames: 'Apellidos',
    birthday: 'Fecha de nacimiento',
    gender: 'Género',
    rol: 'Rol',
  },
  changeLanguage: {
    title: 'Configuración de idiomas',
    interface: 'Idioma de la interfaz',
    selectLocale: 'Seleccione un idioma',
    save: 'Guardar',
    cancel: 'Cancelar',
    success: 'Idioma cambiado',
    error: 'Error al cambiar el idioma: {error}',
  },
  importUsers: {
    title: 'Importar usuarios',
    description:
      'Puede importar usuarios de su organización por perfil, los nuevos usuarios heredarán los permisos del perfil seleccionado.',
    centerLabel: 'Centro',
    profileLabel: 'Perfil',
    uploadFile: 'Cargar el archivo para importar',
    uploadLabel: 'Archivo para importar',
    downloadTemplate: 'Descargar plantilla',
    updateExistingUsers: 'Actualizar usuarios existentes',
    workbook: {
      title: 'Plantilla de usuarios de Leemons',
      email: 'Email',
      name: 'Nombre',
      surnames: 'Primer apellido',
      secondSurname: 'Segundo apellido',
      birthdate: 'Fecha de nacimiento',
      gender: 'Genero',
      tags: 'Etiquetas',
    },
    browseFile: 'Click para buscar un archivo',
    dropFile: 'o arrastrar aquí desde el ordenador',
    cancel: 'Cancelar',
    rowStart: '¿En que fila empiezan los datos?',
    emailRequired: 'El email es necesario',
    emailInvalid: 'Formato de email no válido',
    birthdateRequired: 'La fecha de nacimiento es necesaria',
    birthdateInvalid: 'El formato de la fecha de nacimiento no es valido',
    genderRequired: 'El genero es necesario',
    genderInvalid: 'Genero invalido use male(hombre) o female(mujer)',
    save: 'Confirmar importación',
    colEmailRequired: 'La columna [Email] es obligatoria.',
    colNameRequired: 'La columna [Nombre] es obligatoria.',
    colBirthdateRequired: 'La columna [Fecha de nacimiento] es obligatoria.',
    colGenderRequired: 'La columna [Genero] es obligatoria.',
    colRequired: 'La columna [{name}] es obligatoria.',
    fieldsWithErrors: 'Hay campos con errores corrijelos antes de importar',
    usersAddedSuccessfully: 'Usuarios añadidos con éxito',
    backToUsers: 'Volver al listado de usuarios',
  },
  list_roles: {
    page_title: 'Roles',
    page_description: 'Los roles permiten gestionar los permisos.',
    name: 'Nombre',
    overview: 'Resumen',
    actions: 'Acciones',
    view: 'Ver',
  },
  detail_roles: {
    role_name: 'Nombre del rol',
    description: 'Descripción del rol',
    leemon: 'Leemon',
    permissions_all: 'Todos',
    permissions: 'Permisos',
    select_permissions: 'Seleccione un Leemon para asignar permisos',
    save_done: 'Rol creado',
    update_done: 'Rol actualizado',
    users: 'Usuarios',
    addUsers: 'Añade usuarios al rol',
    nameHeader: 'Nombre',
    surnameHeader: 'Apellidos',
    emailHeader: 'Email',
    birthdayHeader: 'Fecha de nacimiento',
    phoneHeader: 'Teléfono',
    actionsHeader: 'Acciones',
    profileHeader: 'Perfil',
    centerHeader: 'Centro',
  },
  disableUserModal: {
    title: 'Desactivar usuarios',
    description:
      'Se desactivarán los perfiles para {n} usuarios, en el centro {centerName}, y no serán visibles por sus compañeros ni profesores.',
    titleSingle: 'Desactivar usuario',
    descriptionSingle:
      'Se desactivarán los perfiles para este usuario, en el centro {centerName}, y no será visible por sus compañeros ni profesores.',
    titleProfile: 'Desactivar perfil',
    descriptionProfile:
      'El perfil {profileName} para este usuario, en el centro {centerName} será desactivado, y el usuario no será visible para sus compañeros ni profesores. Este perfil puede ser reactivado en cualquier momento.',
    selectProfiles: 'Selecciona los perfiles que quieres desactivar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
  },
  enableUserModal: {
    title: 'Activar usuarios',
    description:
      'Se reactivarán los perfiles para {n} usuarios, en el  centro {centerName}, y volverán a ser visibles por sus compañeros y profesores.',
    titleSingle: 'Activar usuario',
    descriptionSingle:
      'Se reactivarán los perfiles para este usuario, en el centro {centerName}, y volverá a ser visible por sus compañeros y profesores.',
    titleProfile: 'Reactivar perfil',
    descriptionProfile:
      'El perfil {profileName} para este usuario, en el centro {centerName} será reactivado, y el usuario será visible nuevamente por sus compañeros y profesores.',
    selectProfiles: 'Selecciona los perfiles que quieres reactivar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
  },
  userForm: {
    addTeacher: 'Añadir docente',
    editTeacher: 'Editar docente',
    addStudent: 'Añadir estudiante',
    editStudent: 'Editar estudiante',
    accessInfo: 'Acceso',
    personalInfo: 'Información personal',
    recoveryLink: 'Enviar enlace de recuperación',
    sendActivationEmail: 'Reenviar correo de activación',
    manualActivation: 'Establecer contraseña temporal',
    provisionalPassword: 'Contraseña temporal',
    repeatPassword: 'Confirma la contraseña',
    activeUser: 'Aceptar',
    requiredPassword: 'Campo requerido',
    passwordNotMatch: 'Las contraseñas no coinciden',
    activatedUser: 'Usuario activado',
    activationEmailSent: 'Correo de activación enviado',
    recoveryEmailSent: 'Correo de recuperación enviado',
    emailNotMatch: 'Los emails no coinciden',
    repeatEmail: 'Confirma el email',
    invalidEmail: 'Formato de email no válido',
    email: 'Email',
    emailRequired: 'El email es obligatorio',
    emailInvalid: 'El email no es válido',
    name: 'Nombre',
    nameRequired: 'El nombre es obligatorio',
    surname: 'Apellido',
    surnameRequired: 'Los apellidos son obligatorios',
    secondSurname: 'Segundo apellido',
    birthday: 'Fecha de nacimiento',
    birthdayRequired: 'La fecha de nacimiento es obligatoria',
    gender: 'Genero',
    genderRequired: 'El género es obligatorio',
    male: 'Hombre',
    female: 'Mujer',
    other: 'Otro',
    profilePicture: 'Foto de perfil',
    uploadImage: 'Subir imagen',
    changeImage: 'Cambiar imagen',
    delete: 'Borrar',
    cancel: 'Cancelar',
    accept: 'Aceptar',
  },
  bulkActionModal: {
    title: 'Operaciones masivas',
    bulkProgress: 'Procesando operación {current} de {total} - {completed}%',
    init: 'Iniciando operaciones',
    finalize: 'Finalizando operaciones',
    finalizing: 'Finalizando...',
  },
  user_detail: {
    title: {
      default: 'Detalle de usuario',
      student: 'Detalle de estudiante',
      teacher: 'Detalle de docente',
    },
    tagsTitle: 'Etiquetas',
    chatButton: 'Chat',
  },
};
