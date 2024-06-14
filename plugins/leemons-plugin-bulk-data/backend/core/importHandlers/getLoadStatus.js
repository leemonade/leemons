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

function getLoadProgress(currentPhase) {
  if (!currentPhase) {
    return 0;
  }

  const total = Object.keys(LOAD_PHASES).length;
  const current = PHASES.indexOf(currentPhase) + 1;

  return Math.floor((current / total) * 100);
}

async function getLoadStatus({ useCache = true, localCurrentPhase, localLastPhaseOnError, ctx }) {
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

  const progress = getLoadProgress(current);
  const workingPhaseIndex = PHASES.indexOf(current) + 1;

  return {
    status: 200,
    inProgressPhase: String(PHASES[workingPhaseIndex] || '').toUpperCase(),
    currentPhase: String(current).toUpperCase(),
    overallProgress: `${progress} %`,
  };
}

module.exports = { getLoadStatus, LOAD_PHASES, LOAD_ERROR };
