export function extractAssetsSize(webpackStats: any, currentExtractedData: any): {
    metrics: {
        sizes: any;
        totalInitialSizeCSS: {
            value: number;
        };
        totalInitialSizeJS: {
            value: number;
        };
    };
};
