const { actions } = require('react-table');

module.exports = {
  common: {
    save: 'Guardar',
    view: 'Ver',
    edit: 'Editar',
  },
  welcome_page: {
    page_title: 'Bienvenido a Clases',
    page_info: `<p>Aquí podrás replicar la estructura organizativa del centro educativo.</p>
      <p>El primer paso es crear el <strong>Árbol</strong>. Este árbol se utiliza para representar la estructura básica de la organización.</p>
      <p>Por ejemplo, si tienes un colegio con programas educativos (primaria y secundaria) que tiene cursos (primero, segundo, tercero...) y en cada uno de ellos se divide a los alumnos en grupos que comparten clase (grupo A, grupo B, ...), será necesario que el sistema conozca esta lógica. Sólo tendrás que crear el árbol una vez (pero podrás añadir nuevos niveles posteriormente).</p>
      <p>Luego, en la sección <strong>Organización</strong> podrás definir el conjunto de datos (información concreta) para cada nivel y los permisos que deseas asignar. Por último, en la sección de <strong>Clases admin</strong> podrás asignar alumnos, tutores y definir los datos previstos en el paso anterior. Estas secciones sólo estarán disponibles una vez que hayas creado el árbol.</p>
      <p>Puedes empezar descargando nuestro archivo de estructura básica y editándolo en tu aplicación de hoja de cálculo favorita o crear el árbol de niveles manualmente desde Leemons.</p>`,
    hide_info_label:
      'Ok, entendido. Cuando la configuración esté completa, no mostrar más esta información.',
    bulk_load: {
      title: 'Carga masiva',
      description:
        'Descarga el archivo básico y súbelo una vez completado (si necesitas más ayuda, puedes ver esta guía básica sobre el funcionamiento de nuestro sistema de estructuras).',
      btn: 'Cargar',
    },
    manual_load: {
      title: 'Creación manual',
      description:
        'Define tu propia estructura utilizando nuestro editor visual (aquí tiene algunos ejemplos de estructuras básicas que puede utilizar como plantilla).',
      btn: 'Crear árbol',
    },
  },
  tree_page: {
    page_title: 'Árbol',
    page_info: {
      pre: 'Usa el botón',
      post:
        'para crear un nuevo nivel, y a continuación, usa el área de configuración para definir el nuevo nivel.',
    },
  },
  template: {
    title: '¿Cargar plantilla para ahorrar tiempo?',
    description:
      'Elige el tipo de plantilla y haz click en cargar árbol, más tarde podrás modificar los datasets de cada nivel de acuerdo a las necesidades de tu organización',
    country_select: 'Elegir un país',
    template_select: 'Elegir una plantilla',
    btn: 'Previsualizar plantilla',
    hide_info: {
      description: 'Prefiero hacerlo manualmente.',
      btn: `No volver a mostrar`,
    },
  },
  translationsDrawer: {
    title: 'Traducciones',
    actions: {
      save: 'Guardar',
      cancel: 'Cancelar',
    },
  },
  tree: {
    new: {
      prefix: { levelSchema: 'Añadir nivel', level: 'Añadir' },
    },
    class_level: 'Nivel de clase',
  },
  editor: {
    form: {
      name: {
        placeholder: 'Nombre del nivel',
      },
      isClass: {
        label: 'Nivel de clase',
        tooltip: 'Nivel mínimo de asignación de estudiantes',
      },
      save: 'Guardar nivel',
    },
    translations: {
      label: 'Traducciones',
      tooltip: 'El contenido no traducido aparecerá en el idioma por defecto',
    },
    tabs: {
      dataset: {
        label: 'Más datos',
      },
      permissions: {
        label: 'Permisos',
      },
    },
  },
  class_list: {
    page_title: 'Administración de clases',
    page_info:
      'Aquí puedes encontrar y administrar la estructura de niveles de tu Universidad y asignar estudiantes a clases.',
    details: {
      type_program: 'programas',
      type_courses: 'cursos',
      type_groups: 'grupos',
    },
    class_table: {
      th_tutor: 'Tutor',
      th_students: 'Alumnos',
      th_actions: 'Aciones',
      btn_edit: 'Editar',
      btn_expand: 'Expandir',
      btn_view: 'Ver',
    },

    view_panel: {
      summary: {
        btn_edit: 'Editar',
        btn_expand: 'Expandir',
        counter: 'Alumnos',
      },
      table: {
        th_name: 'Nombre de Pila',
        th_surename: 'Primer Apellido',
        th_email: 'Dirección E-mail',
        th_birthday: 'cumpleaños',
      },
    },
  },
};
