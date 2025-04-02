import type { Context } from '@leemons/moleculer';

export type EventType = 'once' | 'once-per-install' | 'on';

export interface MultiEventHandler {
  (ctx: Context, ...params: any[]): Promise<void>;
}

export interface MultiEventConfig {
  events: string[];
  type?: EventType;
  handler: MultiEventHandler;
}

export interface MultiEventsSchema {
  multiEvents: Record<string, MultiEventConfig>;
  events: Record<string, MultiEventHandler | { handler: MultiEventHandler }>;
}

export interface MultiEventsMixinOptions {
  ctxKeyValueModelName?: string;
}

export interface MarkEventCalledParams {
  ctx: Context;
  events: string[];
  event: string;
  type: EventType;
  handler: MultiEventHandler;
  ctxKeyValueModelName: string;
  params: any[];
}
