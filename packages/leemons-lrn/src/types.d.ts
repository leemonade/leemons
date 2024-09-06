export type Partition = string;
export type Region = string;

export type LRN<
  TPlugin extends string = string,
  TModel extends string = string,
> = `lrn:${Partition}:${TPlugin}:${Region}:${string}:${TModel}:${string}`;

export interface DecodedLRN<TPlugin extends string = string, TModel extends string = string> {
  partition: Partition;
  pluginName: TPlugin;
  region: Region;
  deploymentID: string;
  modelName: TModel;
  resourceID: string;
}

export function generateLRN<TPlugin extends string = string, TModel extends string = string>(
  parts: DecodedLRN<TPlugin, TModel>
): LRN<TPlugin, TModel>;

export function isLRN(candidate: string): candidate is LRN;

export function parseLRN<TPlugin extends string = string, TModel extends string = string>(
  lrn: LRN<TPlugin, TModel>
): DecodedLRN<TPlugin, TModel>;
