import { LRN } from '@leemons/lrn';

type TPlugin = 'users';
export type UserAgentID = LRN<TPlugin, 'UserAgent'>;
export type UserID = LRN<TPlugin, 'User'>;

interface UserAgent {
  id: UserAgentID;
  disabled: boolean;
  reloadPermissions: boolean;
  role: string;
  user: {
    email: string;
  };
}

interface User {
  id: UserID;
  name: string;
  surnames: string;
  secondSurname: string;
  email: string;
  active: boolean;
  avatar: string;
  avatarAsset: string;
  locale: string;
  gender: string;
  bithdate: Date;
}

interface UserSession extends Omit<User, 'id'> {
  id: string;
  userAgents: UserAgent[];
}

export function getUserFullName({
  userSession,
}: {
  userSession: Pick<User, 'name' | 'surnames' | 'secondSurname'>;
}): string;
