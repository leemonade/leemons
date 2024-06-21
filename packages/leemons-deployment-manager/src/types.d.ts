import { Model } from '@leemons/mongodb'
import {
  Context as MoleculerContext,
  ActionSchema as MoleculerActionSchema,
  ServiceSchema as MoleculerServiceSchema
} from 'moleculer'

type DB = {
  [modelName: string]: Model
}

interface UserAgent {
  id: string;
}
interface UserSession {
  id: string;
  userAgents: UserAgent[];
}

export type Context = MoleculerContext & {
  db: DB
  tx: {
    db: DB
    emit: MoleculerContext['emit']
    call: MoleculerContext['call']
  },
  meta: MoleculerContext['meta'] & {
    deploymentID: string;
    userSession: UserSession;
  },
  callerPlugin: string;
}

export function LeemonsDeploymentManagerMixin(): any;

// Define the custom ActionHandler type
type ActionHandler<T = any> = (ctx: T) => Promise<any> | any;

// Extend the existing ActionSchema interface
export interface ActionSchema extends MoleculerActionSchema {
  handler?: ActionHandler<Context>;
}

// Extend the ServiceActionsSchema to use CustomActionSchema
type ServiceActionsSchema<S = ServiceSettingSchema> = {
  [key: string]: ActionSchema | ActionHandler | boolean;
} & ThisType<Service<S>>;

// Extend the ServiceSchema to use CustomServiceActionsSchema
interface ServiceSchema<S = ServiceSettingSchema> extends MoleculerServiceSchema<S> {
  actions?: ServiceActionsSchema<S>;
}
