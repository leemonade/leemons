import type { User } from "./types";

type UserSession = Pick<User, "name" | "surnames" | "secondSurname">;

interface GetUserFullNameParams {
  userSession: UserSession;
}

export function getUserFullName({
  userSession,
}: GetUserFullNameParams): string {
  return `${userSession.name ? userSession.name : ""}${
    userSession.surnames ? ` ${userSession.surnames}` : ""
  }${userSession.secondSurname ? ` ${userSession.secondSurname}` : ""}`;
}
