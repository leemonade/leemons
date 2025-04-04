import type { Asset, AssetID } from "@leemons/library";
import type { LRN } from "@leemons/lrn";
import type { LeemonsSchema } from "@leemons/mongodb";
import type { UserAgentID } from "@leemons/users";

type TPlugin = "academic-portfolio";
export type ClassID = LRN<TPlugin, "Class">;
export type ClassTeacherID = LRN<TPlugin, "ClassTeacher">;
export type ClassStudentID = LRN<TPlugin, "ClassStudent">;
export type ProgramID = LRN<TPlugin, "Programs">;
export type SubjectID = LRN<TPlugin, "Subjects">;
export type CourseID = LRN<TPlugin, "Groups">;
export type BlockID = LRN<TPlugin, "Blocks">;

/**
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/class-teacher.js
 */
export interface ClassTeacher extends Omit<LeemonsSchema, "id"> {
  id: ClassTeacherID;

  type: "main-teacher" | "associate-teacher";
  // ref: 'plugins_academic-portfolio::class'
  class: ClassID;
  // ref: 'plugins_users::user-agent'
  teacher: UserAgentID;
}

/**
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/class-student.js
 */
export interface ClassStudent extends Omit<LeemonsSchema, "id"> {
  id: ClassStudentID;

  // ref: 'plugins_academic-portfolio::class'
  class: ClassID;
  // ref: 'plugins_users::user-agent'
  student: UserAgentID;
}

export interface Subject extends Omit<LeemonsSchema, "id"> {
  id: SubjectID;
  name: string;
  program: ProgramID;
  course: CourseID | CourseID[];
  image: Asset | AssetID | null;
  icon?: Asset | AssetID | null;
  color?: string;
  useBlocks: boolean;
}

export type ProgramNomenclature = {
  block?: string;
  subject?: string;
};

/**
 * TODO: Non exhaustive definition. Review and improve.
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/programs.js
 */
export interface Program extends Omit<LeemonsSchema, "id"> {
  id: ProgramID;
  name: string;
  abbreviation: string;
  nomenclature?: ProgramNomenclature;
  subjects?: Subject[];
  staff?: Partial<Record<ProgramStaffRole, UserAgentID>>;
}

/**
 * TODO: Non exhaustive definition. Review and improve.
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/courses.js
 */
export interface Course extends Omit<LeemonsSchema, "id"> {
  id: CourseID;
  name: string;
  index?: string;
}

export type ScheduleItem = {
  dayWeek: number;
  start: string;
  end: string;
};

/**
 * TODO: Non exhaustive definition. Review and improve.
 * @file plugins/leemons-plugin-academic-portfolio/backend/models/class.js
 */
export interface Class extends Omit<LeemonsSchema, "id"> {
  id: ClassID;
  classroomId: string;
  program: Program;
  subject: Subject;
  courses: Course[];
  teachers: Pick<ClassTeacher, "teacher" | "type">[];
  students: UserAgentID[];
  schedule?: ScheduleItem[];
}

export type Block = {
  id: BlockID;
  name: string;
};

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

export type ProgramStaffRole =
  | "program-director"
  | "program-coordinator"
  | "lead-instructor"
  | "academic-advisor"
  | "external-evaluator";

export type ClassData<
  WithTeachers extends boolean,
  WithProgram extends boolean,
> = {
  id?: ClassID;
  deploymentID?: string;
  program: WithProgram extends true
    ? Program
    : {
        name: string;
        center: string;
      };
  subject: Subject;
  courses?: Course | Course[];
  groups?: {
    id: string;
    abbreviation: string;
    [key: string]: any;
  };
  substages?: {
    id: string;
    name: string;
    [key: string]: any;
  }[];
  alias?: string;
  classroomId?: string;
  classWithoutGroupId?: string;
  students: UserAgentID[];
  teachers: {
    teacher: WithTeachers extends true ? { id: UserAgentID } : UserAgentID;
    type: string;
  }[];
  schedule?: ScheduleItem[];
  subjectType: {
    id: string;
    [key: string]: any;
  };
  classes?: Class[];
  parentClass?: Class;
  image?: Asset | AssetID | null;
  knowledges: {
    id: string;
    [key: string]: any;
  } | null;

  parentStudents: string[];
};
