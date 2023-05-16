export type TimeInMiliseconds = Number;
export type QueryKey = [
  {
    plugin: string;
    scope: string;
    action: string;
    entity: string;
    [property: string]: any;
  }
];

export type RefetchStrategyAutomatically = {
  strategy: 'automatically';
  frequency: TimeInMiliseconds;
};

export type RefetchStrategyWithEnabled = {
  strategy: 'onReconnect' | 'onFocus';
  enabled: boolean;
};

export type CachingStrategies = 'cacheable' | 'non-cacheable';
export type ModificationTrends = 'constantly' | 'frequently' | 'standard' | 'lazy' | 'occasionally';
export type RefetchFrequencies = (
  | RefetchStrategyAutomatically
  | RefetchStrategyWithEnabled
  | 'none'
)[];
