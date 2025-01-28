interface StudentData {
  id: string;
  name: string;
  surname: string;
  image: string | null;
  customScore: number;
  retakeScores: Array<{
    retakeIndex: number;
    retakeId: string;
    grade: number;
  }> | null;
  activities: Array<{
    id: string;
    score: number;
  }>;
}

export interface Retake {
  id: string | null;
  index: number;
}

export interface TableData {
  filters: {
    period: {
      period: {
        id: string;
        program: string;
        name: string;
      };
    };
  };
  activitiesData: {
    value: StudentData[];
    activities: Array<{
      id: string;
      weight: number;
    }>;
  };
  grades: Array<{
    id: string;
    order: number;
    number: number;
  }>;
  retakes: Retake[];
  class: {
    id: string;
  };
}

export interface GradedRetake {
  id: Retake['id'];
  order: Retake['index'];
  grade: number;
}

export interface StudentScores {
  student: {
    id: string;
    name: string;
    avatar: string | null;
  };
  retakes: Record<string, GradedRetake>;
  final: Retake['id'];
}

export interface StudentEvaluationData {
  meanGrade: number;
  final: Retake['id'];
  finalGrade: number;
}
