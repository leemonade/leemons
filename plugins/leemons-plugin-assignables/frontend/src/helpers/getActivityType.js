function getActivityType(instance) {
  const { gradable, allowFeedback, requiresScoring } = instance;

  if (gradable) {
    return 'calificable';
  }
  if (!gradable && requiresScoring) {
    return 'puntuable';
  }
  if (allowFeedback && !requiresScoring) {
    return 'no_evaluable';
  }
  return '';
}

export default getActivityType;
export { getActivityType };
