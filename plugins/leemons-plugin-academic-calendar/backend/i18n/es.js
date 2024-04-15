module.exports = {
  configList: {
    title: 'Academic calendar',
    description:
      'Define las fechas para inicio y fin de cada programa y curso, así como las horas lectivas habituales.',
    select_center: 'Seleccionar centro',
  },
  configDetail: {
    title: 'Configurar {name}',
    switchAllCourses: 'Todos los cursos (x{n}) tienen la misma configuración',
    initEndCourse: 'Inicio y fin de curso',
    allCoursesSameDate: 'Todos los cursos comparten estas fechas',
    startDate: 'Fecha de inicio',
    endDate: 'Fecha fin',
    schoolDays: 'Días lectivos',
    allCoursesSameDays: 'Todos los cursos comparten estas días ',
    schoolHour: 'Horas lectivas (puede incluir extra-escolares)',
    allCoursesSameHours: 'Mismo horario para todos los cursos',
    sameHoursForAllDays: 'Mismo horario para todos los días',
    course: 'Curso',
    from: 'Desde',
    to: 'Hasta',
    breaks: 'Descansos',
    name: 'Nombre',
    addBreak: 'Añadir descanso',
    save: 'Guardar',
    fieldRequired: 'Campo necesario',
    configSaved: 'Configuración guardada',
    tableAdd: 'Añadir descanso',
    tableRemove: 'Eliminar',
    allCourses: 'Todos los cursos',
    calendarOf: 'Calendario del programa',
  },
  regionalList: {
    title: 'Calendarios regionales',
    description:
      'Puedes crear calendarios regionales para registrar los días festivos o las vacaciones de un determinado territorio. <br/> Estos eventos se pueden asociar más tarde con tus Calendarios de programa.',
    selectCenter: 'Seleccionar centro',
    addRegionalCalendar: 'Añadir calendario regional',
    detailTitle: 'Calendario regional {name}',
    regionalEvents: 'Festivos nacionales/regionales',
    regionalEventsDescription:
      'Si los eventos nacionales/regionales se repiten en varios calendarios diferentes, puedes indicarlo a continuación.',
    useEventsFrom: 'Usar los eventos de:',
    useEventsFromPlaceholder: 'Elegir calendario',
    localEvents: 'Festivos locales',
    daysOffEvents: 'Días no lectivos',
    daysOffEventsDescription:
      'Si estos días son específicos de un programa concreto y no de una zona geográfica, te aconsejamos incluirlos en el calendario de programa en vez de en el calendario regional.',
    name: 'Nombre',
    nameRequired: 'Nombre necesario',
    init: 'Inicio',
    end: 'Final',
    add: 'Añadir',
    save: 'Guardar',
    remove: 'Eliminar',
    edit: 'Editar',
    accept: 'Aceptar',
    cancel: 'Cancelar',
    saved: 'Guardado',
    newRegionalCalendar: 'Nuevo calendario regional',
    requiredField: 'Campo necesario',
    emptyCalendar: 'Todavía no has creado ningún programa',
  },
  programList: {
    tableAdd: 'Añadir descanso',
    tableRemove: 'Eliminar',
    saved: 'Guardado',
    title: 'Calendario de programa',
    description:
      'Establece las fechas clave para programas/cursos específicos (por ejemplo, inicio y final del año académico, subetapas de evaluación, períodos de exámenes...).',
    selectCenter: 'Seleccionar centro',
    basic: 'Básicos',
    periods: 'Períodos',
    preview: 'Vista previa',
    basicData: 'Datos básicos',
    hourZone: 'Zona horaria:',
    firstDayOfWeek: 'Primer día de la semana:',
    baseRegionalCalendar: 'Calendario regional base:',
    selectCalendar: 'Seleccionar calendario',
    forAllProgram: 'Para todo el programa',
    forEachCourseOfTheProgram: 'Para cada curso del programa',
    course: 'Curso',
    courses: 'Cursos',
    forAllSubStages: 'Para todas las subetapas',
    continueButton: 'Continuar',
    saveButton: 'Guardar',
    academicPeriods: 'Períodos académicos',
    allCoursesShareTheSameDates: 'Todos los cursos comparten las mismas fechas',
    initOfCourse: 'Inicio del curso',
    endOfCourse: 'Fin del curso',
    initOfProgram: 'Inicio programa',
    endOfProgram: 'Fin del programa',
    substagesOrEvaluations: 'SUB-ETAPAS O EVALUACIONES',
    init: 'Inicio',
    end: 'Final',
    otherEvents: 'OTROS EVENTOS',
    name: 'Nombre',
    addNewEvent: 'Añadir nuevo evento',
    hoursOfPauseOrDailyBreaks: 'Horas de pausa o descansos diarios',
    hoursOfPauseOrDailyBreaksDescription:
      'Recreos, almuerzo... estos descansos se reflejarán automáticamente en los horarios semanales de cada estudiante según los cursos donde este matriculado.',
    from: 'Desde',
    to: 'Hasta',
    add: 'Añadir',
    previous: 'Anterior',
    saveAndPreview: 'Guardar y vista previa',
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
    allCourses: 'Todos los cursos',
    fieldRequired: 'Campo necesario',
    edit: 'Editar',
    delete: 'Eliminar',
    frequencies: {
      year: 'Anual',
      semester: 'Semestral',
      quarter: 'Cuatrimestral',
      trimester: 'Trimestral',
      month: 'Mensual',
      week: 'Semanal',
      day: 'Diario',
    },
    eventModal: {
      labels: {
        periodName: 'Nombre del período',
        schoolDays: 'Días lectivos',
        nonSchoolDays: 'Días no lectivos',
        withoutOrdinaryDays: 'Sin clases ordinarias',
        startDate: 'Fecha inicio',
        endDate: 'Fecha fin',
        color: 'Color',
        add: 'Añadir',
      },
      placeholders: {
        periodName: 'Exámenes finales',
        startDate: 'Selecciona una fecha de inicio',
        endDate: 'Selecciona una fecha de finalización',
        color: 'Selecciona un color',
      },
    },
  },
  calendarKey: {
    regionalEvents: 'Festivos nacionales/regionales',
    localEvents: 'Festivos locales',
    daysOffEvents: 'Días no lectivos',
    specialSchoolDay: 'Día escolar especial',
    courseStartEnd: 'Inicio/Fin de curso',
    subStageStartEnd: 'Inicio/Fin de subetapa',
  },
};
