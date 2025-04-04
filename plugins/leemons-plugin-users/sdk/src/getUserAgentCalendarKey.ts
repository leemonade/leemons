import type { UserAgentID } from "./types";

interface GetUserAgentCalendarKeyParams {
  userAgent: UserAgentID;
}

export function getUserAgentCalendarKey({
  userAgent,
}: GetUserAgentCalendarKeyParams): string {
  return `users.calendar.agent.${userAgent}`;
}
