import pick from 'lodash/pick';
export const filter = (source) => {
    const meta = pick(source, ['lighthouseVersion', 'fetchTime', 'requestedUrl']);
    const categories = Object.entries(source.categories).reduce((agg, [categoryId, categoryData]) => ({
        ...agg,
        [categoryId]: pick(categoryData, ['score']),
    }), {});
    const audits = Object.entries(source.audits).reduce((agg, [auditId, auditData]) => ({
        ...agg,
        [auditId]: pick(auditData, ['score', 'numericValue']),
    }), {});
    return {
        ...meta,
        categories,
        audits,
    };
};
//# sourceMappingURL=filter.js.map