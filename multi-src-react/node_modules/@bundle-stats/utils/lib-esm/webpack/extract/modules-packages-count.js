import get from 'lodash/get';
export const extractModulesPackagesCount = (webpackStats, currentExtractedData) => {
    const packages = get(currentExtractedData, 'metrics.packages', {});
    const value = Object.values(packages).length;
    return { metrics: { packageCount: { value } } };
};
//# sourceMappingURL=modules-packages-count.js.map