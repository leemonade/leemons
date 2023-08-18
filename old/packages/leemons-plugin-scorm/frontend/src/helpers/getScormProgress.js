import { isNumber } from 'lodash';

export function getScormProgress({ state }) {
  let progress = state?.cmi?.progress_measure ?? 0;
  if (!progress && state?.cmi?.completion_status === 'completed') {
    progress = 1;
  }
  if (!isNumber(progress)) {
    return 0;
  }

  return Math.floor(progress * 100);
}

export default getScormProgress;
