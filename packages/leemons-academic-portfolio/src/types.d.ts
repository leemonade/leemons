import { Asset, AssetID } from '@leemons/library';
import { LRN } from '@leemons/lrn';
import { LeemonsSchema } from '@leemons/mongodb';
import { UserAgentID } from '@leemons/users';
import { Timetable } from 'leemons-plugin-timetable';

type TPlugin = 'academic-portfolio';
export type ClassID = LRN<TPlugin, 'Class'>;
export type ClassTeacherID = LRN<TPlugin, 'ClassTeacher'>;
export type ClassStudentID = LRN<TPlugin, 'ClassStudent'>;
export type ProgramID = LRN<TPlugin, 'Programs'>;
export type SubjectID = LRN<TPlugin, 'Subjects'>;
export type CourseID = LRN<TPlugin, 'Groups'>;

/**
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/class-teacher.js
 */
export interface ClassTeacher extends Omit<LeemonsSchema, 'id'> {
  id: ClassTeacherID;

  type: 'main-teacher' | 'associate-teacher';
  // ref: 'plugins_academic-portfolio::class'
  class: ClassID;
  // ref: 'plugins_users::user-agent'
  teacher: UserAgentID;
}

/**
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/class-student.js
 */
export interface ClassStudent extends Omit<LeemonsSchema, 'id'> {
  id: ClassStudentID;

  // ref: 'plugins_academic-portfolio::class'
  class: ClassID;
  // ref: 'plugins_users::user-agent'
  student: UserAgentID;
}

/**
 * TODO: Non exhaustive definition. Review and improve.
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/programs.js
 */
export interface Program extends Omit<LeemonsSchema, 'id'> {
  id: ProgramID;
  name: string;
  abbreviation: string;
  nomenclature?: {
    block?: string;
  };
}

export interface Subject extends Omit<LeemonsSchema, 'id'> {
  id: SubjectID;
  name: string;
  program: ProgramID;
  course: CourseID | CourseID[];
  image: Asset | AssetID | null;
  icon: Asset | AssetID | null;
  color: string;
  useBlocks: boolean;
}

/**
 * TODO: Non exhaustive definition. Review and improve.
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/courses.js
 */
export interface Course extends Omit<LeemonsSchema, 'id'> {
  id: CourseID;
  name: string;
}

/**
 * TODO: Non exhaustive definition. Review and improve.
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/class.js
 */
export interface Class extends Omit<LeemonsSchema, 'id'> {
  id: ClassID;
  classroomId: string;
  program: Program;
  subject: Subject;
  courses: Course[];
  teachers: Pick<ClassTeacher, 'teacher' | 'type'>[];
  students: UserAgentID[];
  schedule: Timetable[];
}

export type AfterAddClassEventParams = {
  class: Class;
  displayName: string;
};

export type AfterUpdateClassEventParams = {
  class: Class;
};

export type BeforeRemoveClassesEventParams = {
  classes: Class[];
  soft: boolean;
};

export type AfterAddClassStudentEventParams = {
  class: ClassID;
  student: UserAgentID;
};

export type BeforeRemoveStudentsFromClassEventParams = {
  classStudent: ClassStudent;
  classId: ClassID;
  studentId: UserAgentID;
  soft?: boolean;
};

export function getCourseName(item: { name?: string; index: number }): string;
