import { unique } from "radashi";
import type { CourseLookupTable, DegreePlan } from "../types";

/**
 * Given a list of programs, build a lookup table of the courses present across all of them
 *
 * If two programs share a course, merge their dependencies
 */
export function mergeCurricula(curricula: DegreePlan[]) {
  const courseTable = {} as CourseLookupTable;

  for (const curriculum of curricula) {
    // For each curriculum, grab a list of courses and upsert each course into the course table
    const courses = curriculum.semesters.flat();
    for (const course of courses) {
      if (courseTable[course.courseCode] === undefined) {
        courseTable[course.courseCode] = course;
      } else {
        // Update course already in the table by combining the dependencies
        const preexistingCourse = courseTable[course.courseCode];
        preexistingCourse.preReqs = unique([
          ...preexistingCourse.preReqs,
          ...course.preReqs,
        ]);
        preexistingCourse.coReqs = unique([
          ...preexistingCourse.coReqs,
          ...course.coReqs,
        ]);
        preexistingCourse.postReqs = unique([
          ...preexistingCourse.postReqs,
          ...course.postReqs,
        ]);
      }
    }
  }

  return courseTable;
}
