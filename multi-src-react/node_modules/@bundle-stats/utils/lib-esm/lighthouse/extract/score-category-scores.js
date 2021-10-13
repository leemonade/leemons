import get from 'lodash/get';
import mean from 'lodash/mean';
import round from 'lodash/round';
const SCORES = [
    'performanceScore',
    'accessibilityScore',
    'bestPracticesScore',
    'seoScore',
    'pwaScore',
];
export const extractScoreCategoryScores = (lighthouseSource, currentExtractedData = {}) => {
    const scores = SCORES.map((scoreKey) => get(currentExtractedData, ['metrics', scoreKey, 'value']));
    const score = { value: round(mean(scores), 2) };
    return { metrics: { score } };
};
//# sourceMappingURL=score-category-scores.js.map