import uniq from 'lodash/uniq';
import map from 'lodash/map';
export const getMetricChanged = (runs) => {
    const uniqValues = uniq(map(runs, 'value'));
    if (uniqValues.length > 1) {
        return true;
    }
    const uniqNames = uniq(map(runs, 'name'));
    if (uniqNames.length > 1) {
        return true;
    }
    return false;
};
//# sourceMappingURL=get-metric-changed.js.map