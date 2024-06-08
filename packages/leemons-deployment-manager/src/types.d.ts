import { Model } from '@leemons/mongodb'
import { Context as MoleculerContext } from 'moleculer'

type DB = {
  [modelName: string]: Model
}

export type Context = MoleculerContext & {
  db: DB
  tx: {
    db: DB
    emit: MoleculerContext['emit']
  }
}
