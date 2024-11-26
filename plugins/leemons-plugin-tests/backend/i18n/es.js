const CATEGORY = 'Categoría';
const CATEGORIES = 'Categorías';

const EXPLANATION = 'Explicación';

module.exports = {
  questionsBanksList: {
    pageTitle: 'Listado de bancos de preguntas',
    nameHeader: 'Nombre',
    nQuestionsHeader: 'Preguntas',
    levelHeader: 'Nivel',
    actionsHeader: 'Acciones',
    view: 'Ver',
    show: 'Mostrar',
    goTo: 'Ir a',
    published: 'Publicados',
    draft: 'Borradores',
  },
  questionsBanksDetail: {
    basic: 'Información básica',
    coverRequired: 'Es necesario subir una imagen de portada',
    coverImage: 'Imagen de portada',
    coverImageAdd: 'Añadir imagen',
    coverImageRemove: 'Eliminar imagen',
    programLabel: 'Programa',
    programRequired: 'Campo necesario',
    subjectLabel: 'Asignatura',
    subjectRequired: 'Campo necesario',
    pageTitle: 'Editando banco de preguntas',
    pageTitleNew: 'Nuevo banco de preguntas',
    saveDraft: 'Guardar borrador',
    publish: 'Publicar',
    finish: 'Finalizar',
    config: 'Configuración',
    design: 'Diseño',
    questions: 'Preguntas',
    questionList: 'Lista de Preguntas',
    questionListEmpty: 'Aún no has creado ninguna pregunta',
    nameLabel: 'Nombre',
    nameRequired: 'Campo necesario',
    taglineLabel: 'Subtítulo',
    taglineRequired: 'Campo necesario',
    summaryLabel: 'Resumen',
    summaryRequired: 'Campo necesario',
    tagsLabel: 'Etiquetas',
    addTag: 'Añadir',
    continue: 'Continuar',
    next: 'Siguiente',
    previous: 'Anterior',
    addQuestion: 'Añadir nueva pregunta',
    save: 'Guardar',
    saveQuestion: 'Guardar pregunta',
    returnToList: 'Volver al banco de preguntas',
    questionDetail: 'Detalle de la pregunta',
    typeLabel: 'Tipo',
    typeRequired: 'Campo necesario',
    typePlaceholder: 'Escoger tipo',
    levelLabel: 'Nivel',
    levelPlaceholder: 'Escoger nivel',
    withImagesLabel: 'Con imágenes',
    questionLabel: 'Enunciado',
    statementPlaceHolder: 'Añadir aquí el texto del enunciado',
    questionImage: 'Añadir imagen destacada',
    questionRequired: 'Debes añadir al menos una pregunta',
    responsesLabel: 'Respuestas',
    responseLabel: 'Respuesta',
    responsePlaceholder: 'Añadir aquí el texto de la respuesta',
    alternativeResponseLabel: 'Alternativas',
    tagsInputPlaceholder: 'Separar por comas y pulsar intro',
    needImages: 'Las respuestas deben tener imágenes',
    needExplanationAndResponse: 'Todas las respuestas necesitan un texto y una explicación',
    needExplanation: 'Todas las respuestas requieren una explicación',
    needResponse: 'Las respuestas deben tener un texto',
    needsResponse: 'Respuesta requerida',
    errorMarkGoodResponse: 'Es necesario marcar la respuesta correcta',
    responsesDescription:
      'Primero añade las respuestas y después selecciona la respuesta correcta pulsando el circulo.',
    addResponse: 'Añadir respuesta',
    responseRequired: 'Campo necesario',
    explanationRequired: 'Campo necesario',
    includeExplanationToEveryAnswerLabel:
      'Incluir una explicación a cada respuesta (correctas e incorrectas)',
    explanationLabel: EXPLANATION,
    explanationPlaceHolder: 'Añadir aquí el texto de la explicación',
    captionPlaceholder: 'Añadir aquí el texto de la imagen',
    caption: 'Pie de foto/texto alternativo',
    cluesLabel: 'Configuración de pistas',
    cluesPlaceholder: 'Añadir aquí el texto de las pistas',
    addClue: 'Añadir pista',
    cluesSwitchDescription:
      'Es posible dar pistas a los alumnos proporcionando información que facilite la tarea de recuperación de la memoria.',
    cluesDescription: 'Información para mostrar al alumno',
    hasCluesLabelWithMinResponses: 'Con pistas (mínimo 3 respuestas)',
    hasCluesLabel: 'Con pistas',
    imageLabel: 'Imagen',
    saveImage: 'Guardar imagen',
    addImage: 'Añadir imagen',
    captionAltLabel: 'Leyenda / texto alt',
    captionAltPlaceholder: 'Añadir aquí la leyenda /texto alt',
    saveResponse: 'Guardar respuesta',
    monoResponse: 'Respuesta única',
    trueFalse: 'V/F',
    map: 'Mapa',
    shortResponse: 'Respuesta corta',
    openResponse: 'Respuesta abierta',
    mapLabel: 'Mapa',
    addMap: 'Añadir mapa',
    itemsLabel: 'Respuestas',
    itemsDescriptionBeforeMap:
      'Una vez añadidas los números a la imagen, se pueden incluir los nombres',
    itemsDescription:
      'Primero añade las respuestas y después selecciona la respuesta correcta pulsando el circulo.',
    createNumbering: 'Crear numeración',
    editNumbering: 'Editar numeración',
    savedAsDraft: 'Guardado como borrador',
    published: 'Publicado',
    actionsHeader: 'Acciones',
    markersRequired: 'Marcar un elemento como mínimo',
    markersNeedResponseInAllItems: 'Añadir un texto a todos los elementos',
    cancel: 'Cancelar',
    saveChanges: 'Guardar cambios',
    hideOptionsLabel: 'Ocultar opciones',
    hideOptionsPlaceholder: 'Selecciona una opción',
    hideOptionsHelp: 'Las opciones ocultas se identifican con el icono {{icon}}',
    hasCoverLabel: 'Imagen destacada',
    hideOptionNoRightAnswer: 'Primero selecciona la respuesta correcta',
    headerTitlePlaceholder: 'Título del banco de preguntas',
    cluesCopy:
      'Es posible dar pistas a los alumnos proporcionando información que facilite la tarea de recuperación de la memoria.',
    questionLabels: {
      trueFalse: {
        true: 'Verdadero',
        false: 'Falso',
        type: 'V/F',
      },
      answerPlaceholder: 'Escribe aquí tu respuesta',
      limitCharactersLabel: 'Limitar caracteres',
      minCharactersPlaceHolder: 'Mín.',
      maxCharactersPlaceHolder: 'Máx.',
    },
    errors: {
      save: 'No se han podido guardar los cambios.',
    },
    questionCategories: {
      categoriesLabel: CATEGORIES,
      categoryLabel: CATEGORY,
      addCategory: 'Añadir categoría',
      newCategory: 'Nueva categoría',
      none: 'Ninguna',
      addCategoriesSeperatedByComma: 'Escribe las categorías separadas por comas y pulsa enter',
      noCategories: 'Aun no hay categorías creadas',
      selectPlaceholder: 'Escoger categoría',
      manageCategories: 'Gestionar categorías',
    },
  },
  questionImageModal: {
    createNumbering: 'Crear numeración',
    save: 'Guardar',
    cancel: 'Cancelar',
    type: 'Tipo',
    color: 'Color',
    delete: 'Eliminar',
    move: 'Mover',
    numberingStyle1: 'Estilo de numeración 1 (1, 2, 3, ...)',
    numberingStyle2: 'Estilo de numeración 2 (A, B, C, ...)',
  },
  testsList: {
    pageTitle: 'Biblioteca de tests',
    nameHeader: 'Nombre',
    nQuestionsHeader: 'Preguntas',
    levelHeader: 'Nivel',
    actionsHeader: 'Acciones',
    view: 'Ver',
    show: 'Mostrar',
    goTo: 'Ir a',
    published: 'Publicados',
    draft: 'Borradores',
  },
  testsEdit: {
    gradableLabel: 'Evaluable',
    programLabel: 'Programa',
    courseLabel: 'Curso',
    programPlaceholder: 'Seleccionar ...',
    programRequired: 'Campo necesario',
    subjectLabel: 'Asignatura',
    subjectRequired: 'Campo necesario',
    basic: 'Datos básicos',
    pageTitle: 'Editando test: {name}',
    pageTitleNew: 'Nuevo test',
    pageTitleEdit: 'Editar test',
    saveDraft: 'Guardar borrador',
    publish: 'Publicar',
    config: 'Configuración',
    changeQBankTitle: 'Cambio de banco de preguntas',
    changeQBankDescription:
      '¿Estas seguro que deseas cambiar de banco de preguntas? Se borraran todas las preguntas que has guardado hasta ahora',
    changeQBankConfirm: 'Confirmar',
    changeQBankCancel: 'Cancelar',
    nameLabel: 'Nombre',
    nameRequired: 'Campo necesario',
    typeLabel: 'Tipo',
    typeRequired: 'Campo necesario',
    learn: 'Aprender',
    taglineLabel: 'Subtítulo',
    taglineRequired: 'Campo necesario',
    summaryLabel: 'Resumen',
    summaryRequired: 'Campo necesario',
    tagsLabel: 'Etiquetas',
    addTag: 'Añadir',
    previous: 'Anterior',
    continue: 'Continuar',
    next: 'Siguiente',
    statementPlaceholder: 'Añadir aquí el texto del enunciado',
    addResourcesLabel: 'Añadir recursos',
    resources: 'Recursos de apoyo',
    instructions: 'Instrucciones',
    resoucesAndInstructions: 'Recursos e instrucciones',
    onlyPublish: 'Solo publicar',
    publishAndAssign: 'Publicar y asignar',
    questionsBank: 'Banco de preguntas',
    design: 'Diseño',
    evaluation: 'Evaluación',
    questionsBanksDescription: 'Seleccionar el banco de preguntas',
    questionsBanks: 'Bancos de preguntas',
    nameHeader: 'Nombre',
    nQuestionsHeader: 'Preguntas',
    levelHeader: 'Nivel',
    actionsHeader: 'Acciones',
    questionBankRequired: 'Seleccionar un banco de preguntas',
    questions: 'Preguntas',
    questionsStepName: 'Selección de preguntas',
    noQuestionBanks:
      'No hay ningún banco de preguntas disponible para las asignaturas seleccionadas',
    savedAsDraft: 'Guardado como borrador',
    published: 'Publicado',
    finish: 'Finalizar',
    questionsDescription: 'Selecciona las preguntas del banco para utilizar en este test',
    questionsDescriptionReorder:
      'Ahora puedes modificar el orden en el que el alumno responderá las preguntas. Arrastra y suelta las preguntas para re-ordenarlas.',
    questionBank: 'Banco de preguntas: {name}',
    nQuestions: 'El Banco de preguntas contiene {n} preguntas',
    questionBankMethodSelection: 'Método de selección',
    questionFiltersDescription1:
      'El sistema permite, por defecto, filtrar automáticamente por tipo de pregunta, categoría y nivel.',
    questionFiltersDescription2:
      'Para escoger preguntas específicas, haz click sobre la opción "Seleccionar preguntas manualmente" y pulsa en "continuar".',
    numberOfQuestions: 'Número de preguntas',
    useAllQuestions: 'Seleccionar preguntas manualmente',
    addType: 'Añadir tipo',
    levelLabel: 'Nivel',
    selectionCounter: 'La selección contiene {n} preguntas',
    all: 'Todos',
    categoriesLabel: CATEGORIES,
    addLevel: 'Añadir nivel',
    selectByTag: 'Seleccionar por etiqueta',
    showQuestions: 'Continuar',
    nQuestionsRequired: 'Campo necesario',
    minOneQuestion: 'Seleccionar al menos una pregunta',
    selectQuestionDescription:
      'Preguntas seleccionadas, confirmar el contenido para el test o editar manualmente las preguntas.',
    selectQuestionNothingToSelect:
      'No se han encontrado preguntas con los criterios introducidos. Volver atrás y ampliar la búsqueda.',
    returnFilters: 'Volver a Seleccionar preguntas',
    assignSelectedQuestions: 'Seleccionar preguntas y continuar',
    responsesLabel: 'Respuestas',
    questionLabel: 'Pregunta',
    questionsRequired: 'Seleccionar al menos una pregunta',
    reorderQuestionsDescription: 'Preguntas seleccionas para este test (reordenar si es necesario)',
    statementLabel: 'Texto de enunciado',
    addFromCurriculum: 'Añadir del curriculum',
    objectivesCurriculum: 'Objetivos personalizados',
    inputLabel: 'Introduce un objetivo personalizado',
    inputPlaceholder: 'Objetivo...',
    numberHeader: 'Nº',
    objectiveHeader: 'Objetivo',
    curriculum: 'Curriculum',
    statementRequired: 'Campo necesario',
    contentLabel: 'Contenido',
    instructionsForTeacherLabel: 'Instrucciones para el profesor',
    instructionsForStudentLabel: 'Instrucciones para el alumno',
    recommendedDuration: 'Duración recomendada',
    instructions: 'Instrucciones',
    statement: 'Enunciado',
    evaluationCriteria: 'Criterios de evaluación',
    enableCurriculum: 'Habilitar curriculum',
    addCustomObjectives: 'Añadir objetivos personalizados',
    customQuestionSelection: 'Elección personalizada de preguntas',
    randomQuestions: 'Aleatorias',
    filteredQuestions: 'Filtradas',
    manualQuestions: 'Manual',
    generate: 'Generar',
    selectorManualCounter: '{n} de {x} preguntas seleccionadas',
    allQuestions: 'Todas',
    questionsSelected: 'Selección',
    addInstructions: 'Añadir instrucciones',
    other: 'Otros',
    headerTitlePlaceholder: 'Título del test',
    cancel: 'Cancelar',
  },
  testsDetail: {
    assign: 'Asignar test',
    edit: 'Editar test',
    undefined: 'Indefinido',
    questionTypes: 'Tipos de preguntas',
    levels: 'Niveles',
    categories: CATEGORIES,
    questions: 'Preguntas',
    chartLabel: 'Composición de las preguntas',
    showInTests: 'Vista previa',
    goBackToDashboardPreview: 'Volver al dashboard',
  },
  testsCard: {
    view: 'Vista previa',
    edit: 'Editar',
    tests: 'Test',
    assign: 'Asignar',
    questionBank: 'Banco de preguntas',
    delete: 'Borrar',
    deleted: 'Borrado',
    questions: 'Preguntas:',
    categories: 'Categorias:',
    evaluation: 'Evaluación:',
    gradable: 'Calificable',
    nogradable: 'No calificable',
    task: 'Tarea',
    toggle: 'Cerrar',
    open: 'Abrir',
    duplicate: 'Duplicar',
    duplicated: 'Duplicado',
    simpleQuestion: 'Respuesta única',
    map: 'Mapa',
    trueFalse: 'V/F',
    hints: 'Pistas',
    yes: 'Si',
    no: 'No',
    pin: 'Marcar como favorito',
    unpin: 'Quitar de favorito',
    share: 'Compartir',
    cannotAssignModal: {
      title: 'Directrices de asignación',
      descriptionWhenNotOwner:
        'Debes ser profesor de alguna de las asignaturas asociadas al test o su propietario para poder asignarlo.',
      descriptionWhenOwner:
        'Eres propietario de este test pero no eres profesor de ninguna de las asignaturas asociadas. Por favor, edita el test para actualizar o eliminar las asignaturas asociadas si deseas asignarlo.',
      edit: 'Editar test',
      accept: 'Aceptar',
    },
  },
  instructions: {
    instructions: 'Instrucciones',
    howItWorks: 'Más información',
    timeLimit1: 'Tienes',
    timeLimit2: 'para hacer la actividad',
    withoutPause: 'Sin pausa',
    withoutPause1: 'No puedes pausar',
    withoutPause2: 'la actividad una vez empezada',
    noTimeLimit: 'Sin límite de tiempo',
    limitedTime: 'Tiempo limitado',
    limitedTimeDescription:
      'Una vez comenzado tienes {time} para finalizar esta actividad, deberás hacer la entrega antes de que este tiempo termine.',
    canNotStop: 'La actividad no se puede pausar',
    canNotStopDescription:
      'Si sales de la aplicación con la actividad en proceso, esta se dará por finalizada y se enviará automáticamente la última entrega guardada antes del momento de la interrupción. Si se produce algún error en el sistema y te expulsa de la actividad, deberás notificarlo para subsanar el error.',
  },
  studentInstance: {
    multiSubject: 'Multi-Asignatura',
    delivery: 'Entrega',
    resume: 'Enunciado',
    objectives: 'Objetivos personalizados',
    statement: 'Enunciado',
    prev: 'Anterior',
    curriculum: 'Curriculum',
    next: 'Continuar',
    askForAHint: 'Pedir pista...',
    'cluehide-response': 'Ocultar opción',
    cluenote: 'Pista de texto',
    pts: 'pts',
    development: 'Enunciado e instrucciones',
    activityNotAvailable: 'Actividad no disponible',
    instructions: 'Instrucciones',
    test: 'TEST',
    instructionsForTest: 'Instrucciones para hacer este test',
    clueWithoutPer:
      '<span><strong>Pista de texto:</strong> El uso de pistas no resta ninguna puntuación, es decir, puedes pedir pistas sin penalización.</span>',
    clueWithPer:
      '<span><strong>Pista de texto:</strong> El uso de pistas resta un {per}% de la pregunta, es decir, restarán {points} por cada pista utilizada.</span>',
    questions: 'Preguntas',
    perQuestion: 'Puntos por pregunta',
    totalPoints: 'Puntuación total',
    minScore: 'Puntuación mínima',
    maxScore: 'Puntuación máxima',
    minToApprove: 'Puntos para aprobar',
    importantInformation: 'Información importante',
    informationOnlyView: 'Este test esta en modo "solo consulta"',
    informationStart: 'Esta actividad estará disponible el día {date} a las {hour}',
    beforeStart: 'A tener en cuenta',
    penalties: 'Penalizaciones',
    withoutPause: 'Sin pausa',
    withoutPause1: 'No puedes pausar',
    withoutPause2: 'el test una vez empezado',
    timeLimit1: 'Tienes',
    timeLimit2: 'para hacer el test',
    noTimeLimit: 'Sin límite de tiempo',
    howItWorks: '¿Cómo funciona?',
    limitedTime: 'Tiempo limitado',
    limitedTimeDescription:
      'Una vez comenzado tienes {time} para finalizar el test, si el tiempo acaba antes de que contestes a todas las preguntas, puntuarán solo las preguntas contestadas hasta el momento de la interrupción.',
    canNotStop: 'La prueba no se puede pausar',
    canNotStopDescription:
      'Si sales de la aplicación con la prueba en proceso, esta se dará por finalizada, puntuando solo las preguntas contestadas hasta el momento de la interrupción. Si se produce algún error en el sistema y te expulsa de la prueba, podrás notificarlo y en caso de que tu error sea comprobado podrás volver a realizar la prueba.',
    questionNumber: 'PREGUNTA: {number}',
    theQuestionValueIs: 'La pregunta vale',
    pointsInTotal: 'Puntos',
    pointsOutOf: 'puntos de {questionPoints}',
    askForAHint: 'Pedir una pista',
    hint: 'Pista',
    skipButton: 'Omitir',
    nextButton: 'Siguiente',
    finishButton: 'Finalizar',
    selectResponse: 'Seleccionar respuesta',
    blankQuestionsTitle: 'Preguntas en blanco:',
    wrongAnswersTitle: 'Contestaciones erróneas:',
    textTrack: 'Pista de texto:',
    noBlankQuestions: '<strong>Preguntas en blanco:</strong> No puedes dejar preguntas en blanco',
    blankQuestions:
      '<span><strong>Preguntas en blanco:</strong> Puedes dejar preguntas en blanco y estas no puntuarán (es decir, puntúan 0)</span>',
    blankQuestionsScores:
      '<span><strong>Preguntas en blanco:</strong> Puedes dejar preguntas en blanco  y estas restaran el {per}% de su valor (es decir, puntúan {points})</span>',
    errorQuestions:
      '<span><strong>Contestaciones erróneas:</strong> Las contestaciones erróneas restan el {per}% de su valor, es decir, puntúan {points}</span>',
    noErrorQuestions:
      '<strong>Contestaciones erróneas:</strong> Las contestaciones erroneas no restan puntos',
    finishTestModalTitle: 'Test finalizado',
    finishTestModalDescription: 'Tu respuestas han sido enviadas con éxito',
    confirmSubmission: 'Confirmar entrega',
    cancelSubmission: 'Cancelar',
    finishForceTestModalTitle: 'El tiempo establecido para completar este test ha finalizado.',
    finishForceTestModalDescription:
      'Las preguntas respondidas hasta este momento han sido correctamente enviadas. <br/><br/> Puedes revisar el resultado del test o consultar tus actividades en curso.',
    activitiesInCourse: 'Actividades en curso',
    reviewResults: 'Revisar resultados',
    warnNoResponseTitle: 'PREGUNTA NO RESPONDIDA',
    warnNoResponseDescription:
      'Esta pregunta no ha sido respondida, a continuación puede consultar cuál es la respuesta correcta con su explicación (si la hubiese)',
    mapNeedResponses:
      'Esta pregunta requiere que respondas a todas las opciones presentadas para poder ser evaluada (en caso contrario contará como pregunta no respondida)',
    attention: 'Atención',
    correctResponse: 'Respuesta correcta',
    explanation: EXPLANATION,
    returnToTable: 'Volver al listado',
    clueN: '{number}ª Pista',
    pendingActivities: 'Actividades pendientes',
    modulesDashboard: 'Dashboard del módulo',
    viewResults: 'Consultar resultados',
    nextActivity: 'Siguiente actividad',
    questionLabels: {
      answerPlaceholder: 'Escribe aqui tu respuesta',
      openResponse: {
        minLengthCharacters: 'Escribe aqui tu respuesta de mínimo {number} caracteres',
        maxLengthCharacters: 'Escribe aqui tu respuesta de máximo {number} caracteres',
        minAndMaxLengthCharacters: 'Escribe aqui tu respuesta entre {min} y {max} caracteres',
      },
    },
  },
  testAssign: {
    pageTitle: 'Asignar Test:',
    assign: 'Asignar',
    config: 'Configuración',
    questions: 'Preguntas',
    rules: 'Reglas',
    configs: 'Configuraciones',
    next: 'Siguiente',
    prev: 'Anterior',
    delete: 'Borrar',
    update: 'Actualizar',
    updatedConfig: 'Configuración actualizada correctamente',
    deletedConfig: 'Configuración borrada correctamente',
    createdConfigSuccess: 'Configuración creada con éxito',
    assignDone: 'Asignación creada con éxito',
    configTitle: 'Selección de preguntas',
    configDescription:
      'Puedes seleccionar un sub-conjunto aleatorio de preguntas de este test segn su categoría o nivel. Si quieres utilizar todas las preguntas, marca "Utilizar todas las preguntas"',
    totalQuestions: 'El test contiene: {n} preguntas',
    advancedSettings: 'Configuración avanzada',
    executionRules: 'Reglas de ejecución',
    allowAdvancedSettings: 'Usar configuración avanzada',
    useSettings: 'Selecciona un preajuste guardado anteriormente o crea una configuración nueva',
    requirementsQuestions: '{n} preguntas cumplen con los requisitos',
    nOfQuestions: 'Número de preguntas',
    useAllQuestions: 'Utilizar todas las preguntas',
    customQuestionSelection: 'Elección personalizada de preguntas',
    level: 'Nivel',
    nQuestionsRequired: 'Campo necesario',
    minOneQuestion: 'Seleccionar al menos una pregunta',
    all: 'Todos',
    new: 'Nuevo',
    settingsAsPreset: 'Guardar esta configuración',
    presetName: 'Nombre de la configuración',
    wrongAnswerLabel: 'Respuestas incorrectas',
    wrongAnswerDescription:
      '¿Qué impacto tienen las respuestas incorrectas en la puntuación del examen?',
    wrongAnswerDoNotScore: 'No puntuar',
    wrongAnswerPercentage: 'Resta el {number}%',
    unansweredLabel: 'Sin respuesta',
    unansweredDescriptions: 'Permitir preguntas sin responder',
    unansweredDescription2: 'Impacto en la puntuación',
    clues: 'Pistas',
    allowClues: 'Permitir el uso de pistas',
    clueExtraInfo: 'Pista de texto',
    clueHideOption: 'Ocultar una de la opciones erróneas',
    cluePer: '{number}% reducción del valor',
    clueReduction: 'Reducción',
    clueType: 'Tipo',
    clueCanUse: 'Se puede usar',
    clueNoImpact: 'Sin impacto',
    newConfig: 'Nueva configuración',
    existingConfig: 'Configuración existente',
    categoriesLabel: CATEGORIES,
    noRequiredQuestions: 'Las preguntas filtradas son menores que las solicitadas',
    defaultRules: {
      alert: 'IMPORTANTE:',
      title: 'Reglas de un test por defecto:',
      canOmit: 'Las preguntas sin responder NO restan puntuación.',
      errorQuestions: 'Las respuestas incorrectas NO restan puntuación.',
      canClue: 'Se ofrecerán todas las pistas disponibles sin penalización',
    },
    rulesByQuestionType: {
      title: 'Tipo de pregunta',
      shortResponse: {
        title: 'Respuesta corta',
        activateTolerances: 'Activar tolerancias',
        tolerateAccents: 'Tildes',
        tolerateCase: 'Mayúsculas y minúsculas',
        tolerateSpaces: 'Espacios',
      },
    },
  },
  testResult: {
    testResult: 'Estadísticas por tipo de pregunta',
    questions: 'Preguntas',
    test: 'Test',
    notGradable: 'No calificable',
    gradable: 'Calificable',
    category: CATEGORY,
    level: 'Nivel',
    undefined: 'No definido',
    showInTests: 'Detalle de respuestas ',
    feedbackForStudent: 'Comentario para el estudiante',
    sendFeedback: 'Enviar comentario',
    feedbackRequired: 'Comentario obligatorio',
    feedbackDone: 'Comentario enviado con éxito',
    ok: 'Correcta',
    ko: 'Incorrecta',
    nsnc: 'NS/NC',
    chatDescription: '¿Quieres hacer alguna consulta sobre esta evaluación?',
    chatTeacherDescription: '¿Quieres escribir alguna observación?',
    chatButtonStudent: 'Escribe a tu alumno',
    chatButtonTeacher: 'Escribe a tu profesor',
    student: 'Estudiante',
    responses: 'Respuestas',
    saveAndSendFeedback: 'Guardar y enviar comentario',
    returnToTable: 'Volver al listado',
    nextActivity: 'Siguiente actividad',
    goToModule: 'Dashboard del modulo',
    questionResultsTable: {
      nonGradedQuestionsAlert: {
        title: 'Preguntas por corregir',
        description:
          'Evalúa las preguntas de respuesta abierta para enviar la nota final a los estudiantes.',
      },
      openQuestions: 'Preguntas abiertas',
      testQuestions: 'Preguntas de test',
      questionType: 'Tipo',
      level: 'Nivel',
      question: 'Pregunta',
      category: CATEGORY,
      result: 'Resultado',
      score: 'Puntuación',
    },
    responseDetail: {
      answers: 'Respuestas',
      answer: 'Respuesta',
      result: 'Resultado',
      solution: 'Solución',
      correct: 'Correcto',
      incorrect: 'Incorrecto',
      questionStatus: {
        ok: 'Correcto',
        ko: 'Incorrecto',
        partial: 'Parciamente correcta',
        notGraded: 'Esta pregunta aún no ha sido corregida',
      },
      explanation: EXPLANATION,
      feedback: 'Feedback',
      gradeAndFeedback: 'Corrección y feedback',
      feedbackPlaceholder: 'Escribe aquí el texto de feedback',
      saveCorrection: 'Guardar corrección',
      correctionSaved: 'Corrección guardada correctamente',
    },
  },
};
