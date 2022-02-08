module.exports = {
  schedule_picker: {
    labels: {
      input: 'Horario de clases',
      checkboxLabel: 'Misma franja horaria para cada clase',
      groupLabel: 'Días de clase',
      schedule: 'Horario',
      divider: 'a',
      useCustomDates: 'Usar fechas personalizadas',
      startDate: 'Fecha de primera clase',
      endDate: 'Fecha de última clase',
      apply: 'Aplicar',
      clear: 'Limpiar',
    },
    errorMessages: {
      invalidSchedule: 'La clase debe tener una duración',
      invalidDates: 'La hora de salida debe ser posterior a la hora de entrada',
    },
    placeholders: {
      input: 'Seleccionar el horario',
      startDate: 'Seleccionar fecha',
      endDate: 'Seleccionar fecha',
    },
  },
};
