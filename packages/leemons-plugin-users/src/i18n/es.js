module.exports = {
  user_data_page: {
    page_title: 'Datos del usuario',
    page_description:
      'En esta sección puede configurar los campos del conjunto de datos de sus usuarios. Los datos de identificación son obligatorios para el funcionamiento de la plataforma y obligatorios para todos los usuarios de cualquier perfil. Los campos comunes son los que comparten todos los usuarios, pueden ser obligatorios u opcionales (son útiles para ahorrar tiempo a la hora de definir campos comunes a todos los usuarios de la plataforma como un nombre o un apellido). <br/> Por último, los perfiles tienen sus propios conjuntos de datos que puedes consultar en la sección de perfiles.',
    tabs: {
      login_data: 'Login',
      basic_data: 'Basicos',
      user_dataset: 'Dataset',
    },
    login: {
      description:
        'Campos obligatorios para crear cuentas de usuario (no se pueden editar o eliminar)',
    },
    basic: {
      description: 'Configuración de campos generales para sus usuarios',
    },
    dataset: {
      description: 'Configuración de campos generales para sus usuarios',
      filter_by_center: 'Filtrar por centro',
      add_field: 'Añadir campo',
    },
  },
  welcome_page: {
    page_title: 'Bienvenido a la administración de usuarios',
    page_description:
      'Aquí le recomendamos los primeros pasos para configurar correctamente su administración de usuarios.',
  },
  hero_bg: {
    text:
      '"¡No sé el significado de la mitad de esas largas palabras y, además, no creo que tú tampoco lo sepas!"',
    author: 'Alice in Wonderland <br/> Lewis Carrol',
  },
  list_profiles: {
    page_title: 'Perfiles',
    page_description:
      'Utilice los perfiles de usuario para gestionar los permisos de las aplicaciones. Cada vez que instale un nuevo leemon le pediremos que defina los permisos para cada perfil existente.',
    name: 'Nombre',
    overview: 'Resumen',
    actions: 'Acciones',
    view: 'Ver',
  },
  detail_profile: {
    profile_name: 'Nombre del perfil',
    description: 'Descripción del perfil',
  },
  login: {
    title: 'Acceda a su cuenta',
    email: 'Email',
    password: 'Contraseña',
    remember_password: 'No recuerdo mi contraseña',
    log_in: 'Entrar',
    not_registered: 'No estoy registrado',
    form_error: 'Email or password does not match',
  },
  selectProfile: {
    title: 'Hola {name}',
    number_of_profiles:
      'Tienes {profiles} perfiles en leemons, por favor selecciona con el que quieres acceder',
    use_always_profile: 'Utilizar siempre este perfil para acceder rápidamente',
    change_easy:
      'Puede cambiar fácilmente su perfil haciendo clic en su avatar en la barra lateral de la aplicación',
    log_in: 'Entrar',
  },
};
