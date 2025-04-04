import type { Context } from "@leemons/moleculer";

export type Action = "create" | "view" | "update" | "delete" | "admin";

export type PermissionsForMiddleware = {
  [key: string]: { actions: Action[] };
};

export interface LeemonsMiddlewareAuthenticatedOptions {
  continueEvenThoughYouAreNotLoggedIn?: boolean;
}

export interface LeemonsMiddlewareNecessaryPermitsOptions {
  allowedPermissions: PermissionsForMiddleware;
}

export type LeemonsMiddleware = (ctx: Context) => Promise<void>;

export type LeemonsMiddlewareFactory<T> = (options?: T) => LeemonsMiddleware;
