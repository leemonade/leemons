import type { Model } from "@leemons/mongodb";
import type { GetKeyValueModel } from "@leemons/mongodb-helpers";
import type { LoggerInstance } from "moleculer";

export interface LocalizationsParams {
  KeyValuesModel: Model<GetKeyValueModel>;
  locales?: string[];
  i18nPath?: string;
}

export interface GetLocalizationsObjectsParams {
  locales?: string[];
  i18nPath?: string;
  logger?: LoggerInstance;
}

export interface LocalizationObject {
  [key: string]: string | LocalizationObject;
}

export interface LocalizationsMap {
  [locale: string]: LocalizationObject;
}

export interface HashPerLocale {
  [locale: string]: string;
}

export interface GetLocalizationHashByLocaleParams {
  localizations: LocalizationsMap;
}

export interface GetLocalesToLoadParams {
  hashPerLocale: HashPerLocale;
  KeyValuesModel: Model<GetKeyValueModel>;
}

export interface SaveHashParams {
  KeyValuesModel: Model<GetKeyValueModel>;
  hashPerLocale: HashPerLocale;
}

export interface LockParams {
  KeyValueModel: Model<GetKeyValueModel>;
  lockName: string;
}

export interface AreLocalesHashesSavedParams {
  KeyValuesModel: Model<GetKeyValueModel>;
  hashPerLocale: HashPerLocale;
}

export interface GetHashKeyParams {
  locale: string;
  hash: string;
}

export interface LocalesSaved {
  [locale: string]: boolean;
}

export interface AcquireLockParams {
  KeyValueModel: Model<GetKeyValueModel>;
  lockName?: string;
  timeout?: number;
}

export interface LockValue {
  acquired: boolean;
  expiration: Date;
}

export interface Lock {
  key: string;
  value: LockValue;
}
