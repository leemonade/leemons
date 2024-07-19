import { LRN } from '@leemons/lrn';
import { ClassID } from 'leemons-plugin-academic-portfolio';

export type TimetableID = LRN<'timetable', 'Timetable'>;

/**
 * @file plugins/leemons-plugin-timetable/backend/models/timetable.js
 */
export interface Timetable {
  id: TimetableID;
  deploymentID: string;

  // ref: 'plugins_academic-portfolio::class'
  class: ClassID;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
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
