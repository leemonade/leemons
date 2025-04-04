import type { Class, ClassID } from "@leemons/academic-portfolio";
import type { LRN } from "@leemons/lrn";

export type TimetableID = LRN<"timetable", "Timetable">;

/**
 * @file plugins/leemons-plugin-timetable/backend/models/timetable.js
 */
export interface Timetable {
  id: TimetableID;
  deploymentID: string;
  class: ClassID;
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  dayWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  // Hour of day (eg: '08:00')
  start: string;
  // Hour of day (eg: '10:00')
  end: string;
  // Duration in minutes
  duration: number;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ClassWithTimetable extends Class {
  schedule: Timetable[];
}
