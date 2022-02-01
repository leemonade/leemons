module.exports = {
  welcome_page: {
    page_title: 'Reglas académicas',
    page_description:
      '"Reglas Académicas" te permite crear reglas personalizadas para tus programas y cursos: máximo o mínimo de créditos básicos/electivos, materias obligatorias, cursos electivos... gracias a estas reglas podrás crear informes de notas y saber qué estudiantes serán promocionados',
    hide_info_label:
      'Ok, ya lo tengo. Cuando la configuración esté completa, no muestres más esta información',
    step_evaluations: {
      title: 'Sistemas de evaluación',
      description:
        'Tanto si necesita un sistema de evaluación basado en una escala numérica, como si está basado en letras o una mezcla de ambos, lo soportamos todo.',
      btn: 'Crear sistemas',
    },
    step_promotions: {
      title: 'Reglas de promoción',
      description:
        'Crea un conjunto de reglas de evaluación basadas en créditos o en asignaturas obligatorias y optativas. También puedes añadir reglas para áreas de conocimiento específicas',
      btn: 'Añadir reglas',
    },
    step_dependencies: {
      title: 'Dependencias',
      description:
        'Configurar las dependencias entre asignaturas, en base a su sistema de rendimiento o evaluación.',
      btn: 'Configurar dependencias',
    },
  },
  evaluationsPage: {
    pageTitle: 'Sistema de evaluación',
    pageDescription:
      'Con esta herramienta puedes crear diferentes tipos de sistemas de evaluación que luego puedes asignar a tus programas.',
    addGrade: 'Añadir nuevo sistema de evaluación',
    successSave: 'Guardado correctamente',
    selectCenter: 'Seleccionar centro',
    errorCode6002:
      'No se puede eliminar la escala de calificaciones porque se utiliza en las condiciones',
    errorCode6003:
      'No se puede eliminar la escala de calificaciones porque se utiliza en las etiquetas de calificación',
    errorCode6004: 'No se puede eliminar la escala de grados porque se utiliza en los grados',
    detail: {
      nameLabel: 'Nombre',
      saveButtonLabel: 'Guardar',
      typeLabel: 'Elegir tipo de escala de notas:',
      percentagesLabel: 'Usar porcentajes en lugar de números',
      scalesNumberLabel: 'Número',
      scalesDescriptionLabel: 'Descripción',
      scalesPercentageLabel: 'Porcentaje',
      scalesNumericalEquivalentLabel: 'Equivalente numérico',
      scalesLetterLabel: 'Letra',
      minScaleToPromoteLabel: 'Valor mínimo para aprobar/promover',
      minScaleToPromotePlaceholder: 'Seleccione el valor...',
      otherTagsLabel: 'Otras etiquetas',
      otherTagsDescription:
        'Si necesita utilizar otras etiquetas para clasificar condiciones especiales para algunos temas, puede crearlas libremente aquí.',
      otherTagsRelationScaleLabel: 'Co-relación con algún valor de escala',
      tableAdd: 'Añadir',
      tableRemove: 'Quitar',
      tableEdit: 'Editar',
      tableAccept: 'Aceptar',
      tableCancel: 'Cancelar',
      nameRequired: 'Campo requerido',
      typeRequired: 'Campo requerido',
      minScaleToPromoteRequired: 'Campo requerido',
    },
  },
};
