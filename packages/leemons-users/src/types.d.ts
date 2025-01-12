import { AssetID } from '@leemons/library';
import { LRN } from '@leemons/lrn';

type TPlugin = 'users';
export type UserAgentID = LRN<TPlugin, 'UserAgent'>;
export type UserID = LRN<TPlugin, 'User'>;
export type CenterID = LRN<TPlugin, 'Center'>;
export type ProfileID = LRN<TPlugin, 'Profile'>;

export interface Center {
  id: CenterID;
  name: string;
  description?: string;
  locale: string;
  email?: string;
  uri: string;
  timezone?: string;
  firstDayOfWeek?: number;
  country?: string;
  city?: string;
  postalCode?: string;
  street?: string;
  phone?: string;
  contactEmail?: string;
}

export interface User {
  id: UserID;
  name: string;
  surnames: string;
  secondSurname: string;
  email: string;
  active: boolean;
  avatar: string;
  avatarAsset: AssetID;
  locale: string;
  gender: string;
  bithdate: Date;
  center?: Center;
}

export interface UserAgent {
  id: UserAgentID;
  disabled: boolean;
  reloadPermissions: boolean;
  role: string;
  user: User;
}

export interface UserSession extends Omit<User, 'id'> {
  id: string;
  userAgents: UserAgent[];
}

export function getUserFullName({
  userSession,
}: {
  userSession: Pick<User, 'name' | 'surnames' | 'secondSurname'>;
}): string;

export type Profile = {
  /** Unique identifier of the profile */
  id: ProfileID;
  /** Name of the profile */
  name: string;
  /** Description of the profile */
  description?: string;
  /** URI of the profile */
  uri: string;
  /** Role associated with the profile */
  role?: string;
  /** If the profile is indexable */
  indexable: boolean;
  /** System name of the profile */
  sysName?: 'teacher' | 'student' | 'admin' | 'parent';
  permissions?: GenericObject[];
  targetPermissions?: GenericObject[];
};
