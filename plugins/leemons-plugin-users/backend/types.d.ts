import { Context } from '@leemons/deployment-manager';
import { LRN } from '@leemons/lrn';

export type UserID = LRN<'users', 'Users'>;
export type UserAgentID = LRN<'users', 'UserAgent'>;

/**
 * WARNING: Non exhaustive type.
 */
export type UserAgentInfo = {
  id: UserAgentID;
  user: {
    id: UserID;
    email: string;
  };
};

/**
 * WARNING: Non exhaustive type.
 */
export type GetUserAgentInfoParams = {
  userAgentIds: UserAgentID[];
  userColumns: (keyof UserAgentInfo['user'])[];
  ctx?: Context;
};
