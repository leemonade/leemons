const { getCurrentPhaseKey, getLastPhaseOnErrorKey } = require('../../helpers/cacheKeys');

const LOAD_PHASES = {
  LOCALES: 'locales',
  PLATFORM: 'platform',
  PROVIDERS: 'providers',
  ADMIN: 'admin',
  CENTERS: 'centers',
  PROFILES: 'profiles',
  USERS: 'users',
  GRADES: 'grades',
  LIBRARY: 'library',
  ACADEMIC_PORTFOLIO: 'academic portfolio',
  CALENDAR: 'calendar',
  ACADEMIC_CALENDAR: 'academic calendar',
  CONTENT_CREATOR: 'content creator',
  TESTS: 'tests',
  TASKS: 'tasks',
  WIDGETS: 'widgets',
};
const LOAD_ERROR = 'error';
const PHASES = Object.values(LOAD_PHASES);

function getLoadProgress(currentPhase, initOnPhase) {
  if (!currentPhase) {
    return 0;
  }

  // Skip all the previous phases if initOnPhase is set
  let offset = 0;
  if (initOnPhase) {
    offset = PHASES.indexOf(initOnPhase.toLowerCase());
  }

  const total = Object.keys(LOAD_PHASES).length - offset;
  let current = PHASES.indexOf(currentPhase) + 1 - offset;

  // Some of the phases are divided into subphases, so we need to count them as a single phase
  // Example: LIBRARY[1/3] -> LIBRARY
  if (currentPhase.indexOf('[') < 0) {
    return Math.floor((current / total) * 100);
  }

  const phase = currentPhase.split('[').shift();
  current = PHASES.indexOf(phase) + 1 - offset;
  const next = current + 1;

  // Then, calculate the subphases progress
  // Example: LIBRARY[1/3] -> 1/3
  const subphases = currentPhase.match(/\d+/g);
  const subProgress = Number(subphases[0]) / Number(subphases[1]);

  const currentProgress = current / total;
  const nextProgress = next / total;
  const relativeProgress = (nextProgress - currentProgress) * subProgress;
  return Math.floor((currentProgress + relativeProgress) * 100);
}

async function getLoadStatus({
  useCache = true,
  localCurrentPhase,
  localLastPhaseOnError,
  ctx,
  initOnPhase,
}) {
  const current = useCache ? await ctx.cache.get(getCurrentPhaseKey(ctx)) : localCurrentPhase;

  if (current === LOAD_ERROR) {
    const lastOnError = useCache
      ? await ctx.cache.get(getLastPhaseOnErrorKey(ctx))
      : localLastPhaseOnError;

    return {
      status: 200,
      inProgressPhase: LOAD_ERROR,
      currentPhase: LOAD_ERROR,
      overallProgress: `0%`,
      lastPhaseOnError: lastOnError,
    };
  }

  const progress = getLoadProgress(current, initOnPhase);

  // Some of the phases are divided into subphases, so we need to count them as a single phase
  // Example: LIBRARY[1/3] -> LIBRARY
  let phase = current;
  if (current.indexOf('[') > -1) {
    phase = current.split('[').shift();
  }

  const workingPhaseIndex = PHASES.indexOf(phase);

  return {
    status: 200,
    inProgressPhase: String(PHASES[workingPhaseIndex] || '').toUpperCase(),
    currentPhase: String(phase).toUpperCase(),
    overallProgress: `${progress} %`,
  };
}

module.exports = { getLoadStatus, LOAD_PHASES, LOAD_ERROR };
