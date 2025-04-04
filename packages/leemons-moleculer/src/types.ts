import type { Model } from "@leemons/mongodb";
import type { UserSession } from "@leemons/users";
import type {
  EventSchema,
  LoggerInstance,
  ActionSchema as MoleculerActionSchema,
  Context as MoleculerContext,
  GenericObject as MoleculerGenericObject,
  ServiceSchema as MoleculerServiceSchema,
  Service,
  ServiceSettingSchema,
} from "moleculer";

type DB<Models extends Record<string, Model<any>>> = {
  [modelName in keyof Models]: Models[modelName];
};

export type GenericObject = MoleculerGenericObject;

export interface EventParams {
  event: string;
  params: any;
}

export type Meta<M extends object = Record<string, never>> = M &
  GenericObject & {
    deploymentID: string;
    userSession: UserSession | null;
    $statusCode?: number;
    $statusMessage?: string;
    $location?: string;
    $responseType?: string;
    $responseHeaders?: Record<string, string>;
    relationshipID?: string;
    transactionID?: string;
    transactionExecutionId?: string;
    debugTransaction?: boolean;
    waitToRollbackFinishOnError?: boolean;
    authorization?: string | string[];
  };

export interface MQTTSocket {
  emit: (
    ids: string | string[],
    eventName: string,
    eventData?: any
  ) => Promise<void>;
  emitToAll: (eventName: string, eventData?: any) => Promise<void>;
}

export interface ExtendedContext<
  P = any,
  M extends object = Record<string, never>,
  L extends GenericObject = GenericObject,
  Models extends Record<string, Model<any>> = Record<string, never>,
> extends Omit<MoleculerContext<P, Meta<M>, L>, "params"> {
  db: DB<Models>;
  tx: {
    db: DB<Models>;
    emit: MoleculerContext["emit"];
    call: MoleculerContext["call"];
  };
  callerPlugin: string;
  callerPluginV?: string;
  socket?: MQTTSocket;
  logger: LoggerInstance;
  cache: any;
  service: Service;
  action: {
    name: string;
    [key: string]: any;
  };
  __leemonsDeploymentManagerCall: MoleculerContext["call"];
  __leemonsDeploymentManagerEmit: MoleculerContext["emit"];
  __leemonsMongoDBCall: MoleculerContext["call"];
  __leemonsMongoDBEmit: MoleculerContext["emit"];
  prefixPN: (string?: string) => string;
  prefixPNV: (string?: string) => string;
  params?: P extends EventParams ? P : any;
  id: string;
  event: EventSchema | null;
  deploymentID?: string;
  lrn?: string;
}

export type Context<
  P = any,
  M extends object = Record<string, never>,
  L extends GenericObject = GenericObject,
  Models extends Record<string, Model<any>> = Record<string, Model<any>>,
> = ExtendedContext<P, M, L, Models>;

export type AnyContext = Context<
  any,
  Record<string, never>,
  GenericObject,
  Record<string, never>
>;

// Define the custom ActionHandler type
export type ActionHandler<C = Context> = (ctx: C) => Promise<any> | any;

export type ActionHookBefore<C = Context> = (ctx: C) => Promise<void> | void;
export type ActionHookAfter<C = Context> = (ctx: C) => Promise<void> | void;
export type ActionHookError<C = Context> = (
  ctx: C,
  err: Error
) => Promise<void> | void;

// Extend the existing ActionSchema interface
export interface ActionSchema<C = Context>
  extends Omit<MoleculerActionSchema, "handler"> {
  handler?: ActionHandler<C>;
}

// Extend the ServiceActionsSchema to use CustomActionSchema
export type ServiceActionsSchema<S = ServiceSettingSchema> = {
  [key: string]: ActionSchema<S> | ActionHandler<S> | boolean;
} & ThisType<Service<S>>;

// Extend the ServiceSchema to use CustomServiceActionsSchema
export interface ServiceSchema<S = ServiceSettingSchema>
  extends Omit<MoleculerServiceSchema<S>, "actions"> {
  actions?: ServiceActionsSchema<S>;
  hooks?: {
    before?: {
      [key: string]: ActionHookBefore | ActionHookBefore[];
    };
    after?: {
      [key: string]: ActionHookAfter | ActionHookAfter[];
    };
    error?: {
      [key: string]: ActionHookError | ActionHookError[];
    };
  };
}

export enum EVENT_TYPES {
  ONCE_PER_INSTALL = "once-per-install",
  ONCE = "once",
}
