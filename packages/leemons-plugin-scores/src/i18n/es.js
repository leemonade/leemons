module.exports = {
  periods: {
    alerts: {
      removeSuccess: 'Periodo "{{name}}" eliminado correctamente',
      removeError: 'Error eliminando el periodo "{{name}}": {{error}}',
      addSuccess: 'Periodo "{{name}}" añadido correctamente',
      addError: 'Error añadiendo el periodo "{{name}}": {{error}}',
    },
    periodForm: {
      startDate: 'Fecha inicio',
      endDate: 'Fecha fin',
      submit: 'Buscar',
      newPeriod: 'Nuevo periodo',
      addPeriod: 'Añadir periodo',
      shareWithTeachers: 'Compartir con profesores',
      saveButton: 'Guardar periodo',
      periodName: 'Nombre del periodo',
      center: {
        label: 'Centro',
        placeholder: 'Selecciona un centro',
        error: 'El centro es requerido',
      },
      program: {
        label: 'Programa',
        placeholder: 'Selecciona un programa',
        error: 'El programa es requerido',
      },
      course: {
        label: 'Curso',
        placeholder: 'Selecciona un curso',
        error: 'El curso es requerido',
      },
      subject: {
        label: 'Asignatura',
        placeholder: 'Selecciona una asignatura',
        error: 'La asignatura es requerida',
      },
      group: {
        label: 'Grupo',
        placeholder: 'Selecciona un grupo',
        error: 'El grupo es requerido',
      },
    },
    adminDrawer: {
      title: 'Periodos de evaluación',
      description:
        'Como administrador, puedes crear periódos de tiempo personalizados para facilitar la labor de evaluación de los profesores, por ejemplo, pre-definiendo los periódos de evaluación por programa y curso.',
      new: 'Nuevo periodo',
    },
    teacherDrawer: {
      title: 'Cuaderno de evaluación',
      description:
        'Bienvenido a tu cuaderno de notas. Como profesor puedes hacer búsquedas libres o utilizar los periódos pre-definidos por tu centro educativo para cada programa y curso.',
      new: 'Establecer periodo',
    },
    periodFormErrorMessages: {
      startDate: 'La fecha de inicio es requerida',
      endDate: 'La fecha de fin es requerida',
      validateStartDate: 'La fecha de inicio debe ser anterior a la fecha de fin',
      validateEndDate: 'La fecha de fin debe ser posterior a la fecha de inicio',
      periodName: 'El nombre del periodo es requerido',
    },
    periodListFilters: {
      center: 'Centro',
      program: 'Programa',
      course: 'Curso',
      search: 'Buscar por nombre de periodo',

      centerPlaceholder: 'Selecciona un centro',
      programPlaceholder: 'Selecciona un programa',
      coursePlaceholder: 'Selecciona un curso',
    },
    periodListColumns: {
      name: 'Nombre',
      center: 'Centro',
      program: 'Programa',
      course: 'Curso',
      startDate: 'Fecha de inicio',
      endDate: 'Fecha de fin',
    },
  },
  notebook: {
    header: {
      export: 'Exportar notas a csv',
    },
    noClassSelected: {
      title: 'Cuaderno de evaluación',
      description:
        'El cuaderno de evaluación te permiten evaluar las tareas calificables y no calificables. Selecciona el programa, curso, clase y luego filtrar por periodos de tiempo. También puedes exportar estos informes a excel o csv.',
    },
    noResults: {
      title: 'No results copy ES',
      description:
        'Notas te permite poner notas en tarea calificables y no-calificables y controlar asistencia.',
    },
  },
};
