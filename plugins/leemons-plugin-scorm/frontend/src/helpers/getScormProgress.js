import { isNumber } from 'lodash';

export function getScormProgress({ state, ensurePercentage = true }) {
  let progress = state?.cmi?.progress_measure ?? ensurePercentage ? 0 : null;

  if (progress === null && !ensurePercentage) {
    return null;
  }

  if (!progress && state?.cmi?.completion_status === 'completed') {
    progress = 1;
  }
  if (!isNumber(progress)) {
    return 0;
  }

  return Math.floor(progress * 100);
}

export default getScormProgress;
