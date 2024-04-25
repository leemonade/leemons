import { addErrorAlert } from '@layout/alert';

export default function handleOpen({ rowId, columnId, activities, labels }) {
  const activityObj = activities?.find((a) => a.id === columnId);
  const activity = activityObj?.instance;

  if (!activityObj) {
    addErrorAlert(labels?.unableToOpen);

    return;
  }

  if (!activity) {
    addErrorAlert(labels?.noEvaluationPage);

    return;
  }

  const url = activity.assignable.roleDetails.evaluationDetailUrl;

  window.open(url.replace(':id', columnId).replace(':user', rowId), '_blank', 'noopener');
}
