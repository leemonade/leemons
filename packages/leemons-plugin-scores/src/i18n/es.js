module.exports = {
  setup_page: {
    page_title: 'Configuración de las puntuaciones',
    page_description:
      'Configure sus periodos de evaluación: trimestral, semestral, anual... y los diferentes roles de usuario para puntuar tareas y asignaturas, revisar y exportar informes. En primer lugar, seleccione el programa que desea configurar.',
    select_center: 'Seleccionar centro',
    setup: {
      periods: {
        step_label: 'Periodos',
        labels: {
          title: 'Periodos y etapas de evaluación',
          description: 'Seleccione cuáles de sus períodos académicos serán calificables',
          periodProgramLabel: 'El programa completo',
          periodCourseLabel: 'Cada curso del programa ({i} cursos)',
          periodSubstageLabel: 'Todas las subetapas ({i} {x})',
          periodsRequired: 'Mínimo hay que seleccionar un periodo',
          finalPeriodTitle: 'En qué periodo se presenta la nota final',
          finalPeriodProgramLabel: 'Al final del programa completo',
          finalPeriodCourseLabel: 'Al final de cada curso',
          finalPeriodSubstage: 'Al final de cada substage',
          finalPeriodsRequired: 'Campo obligatorio',
          next: 'Siguiente',
        },
      },
    },
  },
};
