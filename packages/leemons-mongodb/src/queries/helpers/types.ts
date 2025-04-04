import type { Context } from "@leemons/moleculer";

export interface LRNConfig {
  prefix: string;
  addPrefix: boolean;
}

export interface ModelParams {
  model: any;
  modelKey: string;
  ignoreTransaction?: boolean;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  ctx: Context;
}

export interface QueryOptions {
  ignoreDeploymentID?: boolean;
  ignoreDeleted?: boolean;
  ignoreLRN?: boolean;
  [key: string]: any;
}

export interface TransactionMeta {
  transactionID?: string;
  transactionPending?: number;
  transactionFinished?: number;
  debugTransaction?: boolean;
  waitToRollbackFinishOnError?: boolean;
}
