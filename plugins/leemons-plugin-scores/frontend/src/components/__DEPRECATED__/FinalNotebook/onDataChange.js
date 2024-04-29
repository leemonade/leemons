import { addErrorAlert, addSuccessAlert } from '@layout/alert';

function printSuccessMessage({ studentName, className, score, localizations }) {
  addSuccessAlert(
    localizations?.success
      ?.replace('{{student}}', studentName)
      ?.replace('{{subject}}', className)
      ?.replace('{{score}}', score)
  );
}
function printFailMessage({ studentName, className, score, error, localizations }) {
  addErrorAlert(
    localizations?.fail
      ?.replace('{{student}}', studentName)
      ?.replace('{{subject}}', className)
      ?.replace('{{score}}', score),
    error.message
  );
}
export function onDataChange({ mutateScore, periods, classes, students, filters, localizations }) {
  const { program, course } = filters;
  return ({ rowId, columnId, value }) => {
    const student = students?.find((s) => s.id === rowId);
    const studentName = `${student.name} ${student.surname}`;

    if (columnId === 'customScore') {
      mutateScore({
        scores: [
          {
            student: rowId,
            class: `${program}.${course}`,
            period: 'course',
            grade: value,
            published: true,
          },
        ],
      })
        .then(() =>
          printSuccessMessage({
            studentName,
            className: localizations?.course,
            localizations,
            score: value,
          })
        )
        .catch((e) =>
          printFailMessage({
            studentName,
            className: localizations?.course,
            localizations,
            score: value,
            error: e,
          })
        );
    } else {
      const klass = columnId.substring(0, 36);
      const periodName = columnId.substring(37, columnId.length);
      const period = periods?.find((p) => p.name === periodName)?.id;
      const className = classes?.find((c) => c.id === klass)?.subject?.name;

      if (!period) {
        printFailMessage({
          className,
          studentName,
          score: value,
          localizations,
          error: new Error('No period was found'),
        });
        return;
      }

      mutateScore({
        scores: [
          {
            student: rowId,
            class: klass,
            period,
            grade: value,
            published: true,
          },
        ],
      })
        .then(() =>
          printSuccessMessage({
            studentName,
            className: `${className} (${periodName})`,
            score: value,
            localizations,
          })
        )
        .catch((e) =>
          printFailMessage({
            studentName,
            className: `${className} (${periodName})`,
            score: value,
            localizations,
            error: e,
          })
        );
    }
  };
}

export default onDataChange;
