import createWorkbook from './config/createWorkbook';
import createSheet from './content/createSheet';
import writeTable from './content/table/writeTable';
import writeHeader from './content/writeHeader';

export default function generateExcel({ headerShown, tableData }) {
  const wb = createWorkbook();
  const notebookSheet = createSheet(wb, 'noebook');
  if (headerShown) {
    writeHeader(
      notebookSheet,
      {
        period: 'Primera evaluación',
        startDate: new Date('1-2-2001'),
        endDate: new Date(),
        program: 'CyLA',
        subject: 'Egiptología',
      },
      {
        period: 'Periodo',
        startDate: 'Fecha de inicio',
        endDate: 'Fecha de fin',
        program: 'Programa',
        subject: 'Asignatura',
      }
    );
  }

  writeTable({
    wb,
    ws: notebookSheet,
    tableData,
    labels: {
      type: 'Tipo',
      evaluation: 'Evaluación',
      name: 'Actividad',
      deadline: 'Fecha límite/cierre',
      calificable: 'calificable',
      noCalificable: 'no calificable',
      avg: 'Promedio',
      notSubmitted: 'No entregado',
      group: 'Grupo',
      surname: 'Apellido',
      name: 'Nombre',
      weight: 'Porcentaje',
    },
    headerShown,
  });

  return wb;
}
