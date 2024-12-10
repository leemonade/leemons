import { addErrorAlert, addSuccessAlert } from '@layout/alert';

export function printSuccessMessage({ labels, student, activity, score }) {
  addSuccessAlert(
    labels?.updatedSuccess
      ?.replace('{{student}}', `${student.name} ${student.surname}`)
      ?.replace('{{activity}}', activity)
      ?.replace('{{score}}', score?.letter || score?.number)
  );
}
export function printErrorMessage({ labels, student, activity, score, error }) {
  addErrorAlert(
    labels?.updatedError
      ?.replace('{{student}}', `${student.name} ${student.surname}`)
      ?.replace('{{activity}}', activity)
      ?.replace('{{score}}', score?.letter || score?.number)
      ?.replace('{{error}}', error.message || error.error),
    error.message
  );
}
