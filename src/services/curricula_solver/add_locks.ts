import type { CourseLookupTable, DegreePlan } from "../types";
import { type CourseWithLocksArray, updateRelativeCourseLocks } from "./utils";

export function addLocks(courseTable: CourseLookupTable) {
  const plan = {
    semesters: [[]],
    totalCredits: 0,
  } as DegreePlan;

  const lockedCourseObjects = Object.values(courseTable).filter((course) =>
    Array.isArray(course.semesterLock),
  ) as CourseWithLocksArray;
  const lockedCourseList = lockedCourseObjects.map((c) => c.courseCode);
  // Slot in locked courses
  for (const lockedCourse of lockedCourseObjects) {
    if (
      plan.semesters
        .flat()
        .map((c) => c.courseCode)
        .includes(lockedCourse.courseCode)
    ) {
      continue;
    }
    const semesterIndex = Math.min(...lockedCourse.semesterLock);
    const absoluteSemesterIndex = Math.abs(semesterIndex);
    // Insert new semester(s) if we need to
    if (plan.semesters.length - 1 < absoluteSemesterIndex) {
      const newSemesterCount =
        absoluteSemesterIndex - (plan.semesters.length - 1);
      const newSemesters = new Array(newSemesterCount)
        .fill(undefined)
        .map((_) => []);
      plan.semesters.push(...newSemesters);
    }

    // biome-ignore lint/style/noNonNullAssertion: We can assume this semester exists based on our work above
    plan.semesters
      .at(semesterIndex)!
      .push(
        ...[lockedCourse, ...lockedCourse.coReqs.map((cc) => courseTable[cc])],
      );
  }

  // Ensure relative locks are up to date in the event a semester was added and the course wasn't moved
  if (lockedCourseList.length > 0) {
    updateRelativeCourseLocks(plan);
  }

  return plan;
}
