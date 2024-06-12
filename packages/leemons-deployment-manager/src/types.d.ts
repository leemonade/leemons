import { Model } from '@leemons/mongodb'
import { Context as MoleculerContext } from 'moleculer'

type DB = {
  [modelName: string]: Model
}

interface UserAgent {
  id: string;
}
interface UserSession {
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
  }
}
