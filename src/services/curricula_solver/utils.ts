import type { Course, CourseLookupTable, DegreePlan } from "../types";

export type CourseWithLocksArray = Array<
  Omit<Course, "semesterLock"> & { semesterLock: number[] }
>;

// TODO: Question about data model:
// How does the semester prop get updated? Technically its emergent behavior but it could be nice to not have to run a find every time I need the semester number (not index)

/**
 * Ensure courses with relative locks are in the correct semester
 *
 * Modifies program in place, returns reference to given program
 */
export function updateRelativeCourseLocks(program: DegreePlan): DegreePlan {
  // Loop backwards through the semesters and courses to find any relative locks that are not in the right place
  // going backwards means we can safely modify the array as we go since we part that gets re-indexed is the part we already looked at
  for (let sI = program.semesters.length - 1; sI >= 0; sI--) {
    const semester = program.semesters[sI];
    for (let cI = semester.length - 1; cI >= 0; cI--) {
      const course = semester[cI];
      if (Array.isArray(course.semesterLock)) {
        const currentRelativeIndex = sI - program.semesters.length - 1;
        if (!course.semesterLock.includes(currentRelativeIndex)) {
          // biome-ignore lint/style/noNonNullAssertion: Assume the semester exists
          program.semesters.at(Math.min(...course.semesterLock))!.push(course);
          semester.splice(cI, 1);
        }
      }
    }
  }

  return program;
}

/** Grab course codes in ascending order based on their number (101, 102, 103, ...) */
export function getCourseCodesSortedByNumber(
  courses: CourseLookupTable | Course[] | string[],
) {
  if (!Array.isArray(courses)) {
    courses = Object.keys(courses);
  } else if (!(courses.length === 0 || typeof courses[0] === "string")) {
    courses = (courses as Course[]).map((course) => course.courseCode);
  }

  return (courses as string[]).toSorted(
    (a, b) => +(/\d+/.exec(a) ?? [0])[0] - +(/\d+/.exec(b) ?? [0])[0],
  );
}
