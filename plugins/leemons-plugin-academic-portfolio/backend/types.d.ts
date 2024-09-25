import { LRN } from '@leemons/lrn';
import { Timetable } from 'leemons-plugin-timetable';
import { UserAgentID } from 'leemons-plugin-users';

type TPlugin = 'academic-portfolio';
export type ClassID = LRN<TPlugin, 'Class'>;
export type ClassTeacherID = LRN<TPlugin, 'ClassTeacher'>;
export type ClassStudentID = LRN<TPlugin, 'ClassStudent'>;

/**
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/class-teacher.js
 */
export interface ClassTeacher {
  id: ClassTeacherID;
  deploymentID: string;

  type: 'main-teacher' | 'associate-teacher';
  // ref: 'plugins_academic-portfolio::class'
  class: ClassID;
  // ref: 'plugins_users::user-agent'
  teacher: UserAgentID;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/class-student.js
 */
export type ClassStudent = {
  id: ClassStudentID;
  deploymentID: string;

  // ref: 'plugins_academic-portfolio::class'
  class: ClassID;
  // ref: 'plugins_users::user-agent'
  student: UserAgentID;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

/**
 * TODO: Non exhaustive definition. Review and improve.
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/programs.js
 */
export type Program = {
  id: ProgramID;
  name: string;
  abbreviation: string;
};

/**
 * TODO: Non exhaustive definition. Review and improve.
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/subjects.js
 */
export type Subject = {
  id: SubjectID;
  name: string;
};

/**
 * TODO: Non exhaustive definition. Review and improve.
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/courses.js
 */
export type Course = {
  id: CourseID;
  name: string;
};

/**
 * TODO: Non exhaustive definition. Review and improve.
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/class.js
 */
export interface Class {
  id: ClassID;
  deploymentID: string;

  classroomId: string;
  program: Program;
  subject: Subject;
  courses: Course[];
  teachers: Pick<ClassTeacher, 'teacher' | 'type'>[];
  students: UserAgentID[];
  schedule: Timetable[];

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
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
