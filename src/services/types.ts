export interface Course {
  courseCode: string;
  courseName: string;
  credits: number;
  semester: number;
  preReqs: string[];
  coReqs: string[];
  postReqs: string[];
  semesterLock: number[] | undefined;
}

export interface CourseLookupTable {
  [courseCode: string]: Course;
}

interface ComplexityMetrics {
  delayFactor: number;
  blockingFactor: number;
  structuralComplexity: number;
}

export interface DegreePlan {
  semesters: Course[][];
  totalCredits: number;
  metrics?: ComplexityMetrics;
}

export interface Program {
  ProgramStack: string;
  ProgramTitle: string;
  DegreeCode: string;
}
