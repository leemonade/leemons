module.exports = {
  welcome_page: {
    page_title: 'Reglas académicas',
    page_description:
      '"Reglas Académicas" permite crear reglas personalizadas para los programas y cursos: máximo o mínimo de créditos básicos/electivos, materias obligatorias, cursos electivos... para extraer informes de notas y definir qué estudiantes serán promocionados.',
    hide_info_label: '¡Entendido!. No mostrar más, una vez finalizada la configuración.',
    step_evaluations: {
      title: 'Sistemas de evaluación.',
      description:
        'Permite definir sistemas de evaluación basados en una escala numérica (de 1 a 10), en letras (de A a F) o incluso tipos más específicos (conseguido / progresa adecuadamente / necesita mejorar).',
      btn: 'Crear sistema',
    },
    step_promotions: {
      title: 'Reglas de promoción',
      description:
        'Conjunto de reglas de evaluación basadas en créditos, en asignaturas obligatorias y optativas o áreas de conocimiento.',
      btn: 'Añadir regla',
    },
    step_dependencies: {
      title: 'Dependencias',
      description:
        'Relación de dependencias entre asignaturas, según su sistema de rendimiento o evaluación (por ejemplo, "es necesario aprobar Matemáticas I para cursar Matemáticas II").',
      btn: 'Configurar dependencias',
    },
  },
  evaluationsPage: {
    pageTitle: 'Sistemas de evaluación',
    newEvaluationSystemButtonLabel: 'Nuevo sistema de evaluación',
    emptyMessage: 'Crea un nuevo sistema de evaluación para poder evaluar a tus alumnos',
    basicData: 'Datos básicos',
    numbersTitle: 'Numeros',
    lettersTitle: 'Letras',
    othersTitle: 'Otros',
    scaleTypesLabel: 'Tipos de escala de nota',
    scaleTypesPlaceholder: 'Seleccionar...',
    errorTypeRequired: 'Campo necesario',
    letterLabel: 'Letra',
    percentageLabel: 'Porcentaje',
    numberLabel: 'Número',
    addScoreButton: 'Añadir nota',
    scalesDescriptionLabel: 'Descripción',
    otherTagsRelationScaleLabel: 'Correlación con otro valor de escala',
    tableAdd: 'Añadir',
    tableRemove: 'Borrar',
    tableEdit: 'Editar',
    tableAccept: 'Aceptar',
    tableCancel: 'Cancelar',
    saveButtonLabel: 'Guardar',
    addLetterPlaceholder: 'Añade una letra...',
    addTextPlaceholder: 'Añade texto...',
    addCorelationPlaceholder: 'Añade correlación...',
    nameLabel: 'Nombre',
    scaleLabel: 'Escala',
    minToPromoteLabel: 'Valor mínimo para aprobar',
    namePlaceholder: 'Nombre del sistema...',
    minSacleToPromoteLabel: 'Valor mínimo para aprobar/promocionar',
    minSacleToPromotePlaceholder: 'Seleccionar valor...',
    scalesNumericalEquivalentLabel: 'Equivalente numérico',
    percentagesLabel: 'Usar porcentajes en lugar de números',
    addGrade: 'Añadir nuevo sistema de evaluación',
    successSave: 'Guardado con éxito',
    successDelete: 'Borrado con éxito',
    selectCenter: 'Seleccionar centro',
    errorCode6002:
      'No se puede eliminar un sistema de evaluación que está en uso en las reglas de promoción',
    errorCode6003:
      'No se puede eliminar un sistema de evaluación que está en uso en las etiquetas de calificación',
    errorCode6004: 'No se puede eliminar un sistema de evaluación que está en uso',
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
      minScaleToPromoteLabel: 'Valor mínimo para aprobar/promocionar',
      minScaleToPromotePlaceholder: 'Seleccionar valor...',
      otherTagsLabel: 'Otras etiquetas',
      otherTagsDescription: 'Etiquetas personalizadas para clasificar condiciones especiales.',
      otherTagsRelationScaleLabel: 'Correlación con otro valor de escala',
      tableAdd: 'Añadir',
      tableRemove: 'Borrar',
      tableEdit: 'Editar',
      tableAccept: 'Aceptar',
      tableCancel: 'Cancelar',
      nameRequired: 'Campo necesario',
      typeRequired: 'Campo necesario',
      minScaleToPromoteRequired: 'Campo necesario',
      numeric: 'Numérico',
      letter: 'Letras',
    },
  },
  conditionOptions: {
    sourceProgram: 'Programa',
    sourceCourse: 'Curso',
    sourceKnowledge: 'Área de conocimiento',
    sourceSubject: 'Asignatura',
    sourceSubjectType: 'Tipo de asignatura',
    sourceSubjectGroup: 'Grupo de asignaturas',
    dataTypeGPA: 'Medios',
    dataTypeCPP: 'Créditos por programa',
    dataTypeCPC: 'Créditos por curso',
    dataTypeCPCG: 'Créditos por grupo de curso',
    dataTypeGrade: 'Tipo de evaluación',
    dataTypeEnrolled: 'Matriculado',
    dataTypeCredits: 'Créditos',
    operatorGT: 'Mayor que',
    operatorGTE: 'Mayor o igual que',
    operatorLT: 'Menor que',
    operatorLTE: 'Menor o igual',
    operatorEQ: 'Igual',
    operatorNEQ: 'No igual',
    operatorContains: 'Contiene',
  },
  promotionDetail: {
    detail: {
      nameRequired: 'Campo necesario',
      programRequired: 'Campo necesario',
      gradeRequired: 'Campo necesario',
      subjectRequired: 'Campo necesario',
      conditionErrorMessage: 'Seleccionar una nota',
      nameLabel: 'Nombre de la promoción',
      subjectLabel: 'Asignatura',
      saveButtonLabel: 'Guardar',
      programLabel: 'Programa',
      programPlaceholder: 'Seleccionar programa...',
      gradeLabel: 'Sistema de evaluación',
      gradePlaceholder: 'Seleccionar nota...',
      subjectPlaceholder: 'Seleccionar asignatura...',
      labels: {
        saveButton: 'Guardar',
        newRule: 'Nueva regla',
        newRuleGroup: 'Nuevo grupo de reglas',
        menuLabels: {
          remove: 'Eliminar',
          duplicate: 'Duplicar',
          turnIntoCondition: 'Convertir en condición/es',
          turnIntoGroup: 'Convertir en grupo',
        },
        where: 'Where',
      },
      placeholders: {
        programName: 'Nombre del programa',
        selectProgram: 'Seleccionar programa...',
        selectGradeSystem: 'Seleccionar sistema de evaluación...',
        conditionPlaceholders: {
          selectItem: 'Seleccionar...',
          selectCourse: 'Seleccionar curso...',
          selectKnowledge: 'Seleccionar área de conocimiento...',
          selectSubject: 'Selecciona asignatura...',
          selectSubjectType: 'Seleccionar tipo de asignatura...',
          selectSubjectGroup: 'Seleccionar grupo de asignaturas...',
          selectDataType: 'Seleccionar datos...',
          selectOperator: 'Seleccionar operador...',
          selectTargetGrade: 'Seleccionar nota...',
          enterTarget: 'Introducir valor...',
        },
      },
    },
  },
  promotionsPage: {
    pageTitle: 'Reglas de promoción',
    pageDescription:
      'Conjunto de reglas de promoción basadas en créditos o en asignaturas troncales y optativas. Es posible añadir reglas para áreas de conocimiento específicas',
    addPromotion: 'Nuevo grupo de reglas',
    successSave: 'Guardado con éxito',
    successDelete: 'Eliminado con éxito',
    selectCenter: 'Seleccionar centro',
    courseName: 'Curso {index}',
  },
  dependenciesPage: {
    pageTitle: 'Dependencias entre asignaturas',
    pageDescription:
      'Permite establecer reglas específicas de matriculación de alumnos  a partir de la promoción en asignaturas anteriormente cursadas.',
    addPromotion: 'Nuevo mapa de dependencias',
    successSave: 'Guardado con éxito',
    successDelete: 'Eliminado con éxito',
    selectCenter: 'Seleccionar centro',
    courseName: 'Curso {index}',
    nameLabel: 'Nombre del sistema',
  },
};
