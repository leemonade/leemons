import { STATUS_NAMES } from '../constants';

import getStatus from './getStatus';

export default function getStatusName({ assignation, isBlocked, isEvaluable, hasBeenEvaluated }) {
  const { activityHasBeenClosed, studentHasStarted, studentHasFinished } = getStatus(assignation);

  /* --- Evaluated submissions --- */

  if (hasBeenEvaluated && studentHasFinished) {
    return STATUS_NAMES.evaluated;
  }

  /* --- Finished submissions --- */

  if (studentHasFinished) {
    return isEvaluable ? STATUS_NAMES.evaluableSubmitted : STATUS_NAMES.nonEvaluableSubmitted;
  }

  if (activityHasBeenClosed) {
    return STATUS_NAMES.notSubmitted;
  }

  /* --- Unfinished submissions --- */

  if (isBlocked) {
    return STATUS_NAMES.blocked;
  }

  if (studentHasStarted) {
    return STATUS_NAMES.studentStarted;
  }

  return STATUS_NAMES.studentNotStarted;
}
