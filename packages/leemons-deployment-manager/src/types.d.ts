/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from '@leemons/mongodb';
import {
  Context as MoleculerContext,
  ActionSchema as MoleculerActionSchema,
  ServiceSchema as MoleculerServiceSchema,
  LoggerInstance,
  ServiceSettingSchema,
  Service
} from 'moleculer';

type DB<Models extends Record<string, Model<any>>> = {
  [modelName in keyof Models]: Models[modelName];
};

interface UserAgent {
  id: string;
}
interface UserSession {
  id: string;
  userAgents: UserAgent[];
}

export type GenericObject = { [name: string]: any };

export type Meta<M extends object = Record<string, never>> = M &
  GenericObject & {
    deploymentID: string;
    userSession: UserSession;
    $statusCode?: number;
    $statusMessage?: string;
    $location?: string;
    $responseType?: string;
    $responseHeaders?: Record<string, string>;
  };

export type Context<
  P = any,
  M extends object = Record<string, never>,
  L = GenericObject,
  Models extends Record<string, Model<any>> = Record<string, never>,
> = MoleculerContext<P, Meta<M>, L> & {
  db: DB<Models>;
  tx: {
    db: DB<Models>;
    emit: MoleculerContext['emit'];
    call: MoleculerContext['call'];
  };
  callerPlugin: string;
  socket: any;
  logger: LoggerInstance;
};

export function LeemonsDeploymentManagerMixin(): any;

// Define the custom ActionHandler type
type ActionHandler<C = Context> = (ctx: C) => Promise<any> | any;

// Extend the existing ActionSchema interface
export interface ActionSchema<C = Context> extends Omit<MoleculerActionSchema, 'handler'> {
  handler?: ActionHandler<C>;
}

// Extend the ServiceActionsSchema to use CustomActionSchema
export type ServiceActionsSchema<S = ServiceSettingSchema> = {
  [key: string]: ActionSchema | ActionHandler | boolean;
} & ThisType<Service<S>>;

// Extend the ServiceSchema to use CustomServiceActionsSchema
export interface ServiceSchema<S = ServiceSettingSchema> extends MoleculerServiceSchema<S> {
  actions?: ServiceActionsSchema<S>;
}
