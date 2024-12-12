/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from '@leemons/mongodb';
import { UserAgent } from '@leemons/users';
import {
  Context as MoleculerContext,
  ActionSchema as MoleculerActionSchema,
  ServiceSchema as MoleculerServiceSchema,
  ServiceSettingSchema,
  Service,
  LoggerInstance,
} from 'moleculer';

type DB<Models extends Record<string, Model<any>>> = {
  [modelName in keyof Models]: Models[modelName];
};

interface UserSession {
  id: string;
  userAgents: UserAgent[];
  active: boolean;
  name: string;
  surnames: string;
  email: string;
  avatar: string;
  avatarAsset: string;
  locale: string;
  gender: string;
  bithdate: Date;
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
  cache: any;
};

export type AnyContext = Context<unknown, unknown, unknown, unknown>;

export function LeemonsDeploymentManagerMixin(): any;

// Define the custom ActionHandler type
type ActionHandler<C = Context> = (ctx: C) => Promise<any> | any;

// Extend the existing ActionSchema interface
export interface ActionSchema<C = Context> extends Omit<MoleculerActionSchema, 'handler'> {
  handler?: ActionHandler<C>;
}

// Extend the ServiceActionsSchema to use CustomActionSchema
export type ServiceActionsSchema<S = ServiceSettingSchema> = {
  [key: string]: ActionSchema<S> | ActionHandler<S> | boolean;
} & ThisType<Service<S>>;

// Extend the ServiceSchema to use CustomServiceActionsSchema
export interface ServiceSchema<S = ServiceSettingSchema> extends MoleculerServiceSchema<S> {
  actions?: ServiceActionsSchema<S>;
}

export function validateInternalPrivateKey<C = Context>({ ctx }: { ctx: C }): void;

export const ACTION_CALLS_EXCLUDED_ON_DEPLOYMENT_CHECK: string[];
export enum EVENT_TYPES {
  ONCE_PER_INSTALL = 'once-per-install',
  ONCE = 'once',
}
