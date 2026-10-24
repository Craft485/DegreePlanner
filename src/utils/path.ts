import type { Course } from "@/services/types";

/**
 * Get a list of courses from a degree plan that connect to a specified course
 */
export function getCoursePath(
  courseList: Course[],
  source: Course,
  currPath: Course[] = [],
  onlySelectPreceding: boolean | undefined = undefined,
) {
  if (currPath.length === 0 && onlySelectPreceding === undefined) {
    currPath.push(source);
  }

  const step = courseList.filter((c) => {
    // c is not alreay present in the path
    const cNotAlreadyPresentInPath = !currPath.some(
      (pathCourse) => pathCourse.courseCode === c.courseCode,
    );
    // c is a dependency of source
    const cIsPostReq =
      !onlySelectPreceding && source.postReqs.includes(c.courseCode);
    const cIsPreReq =
      (onlySelectPreceding || onlySelectPreceding === undefined) &&
      source.preReqs.includes(c.courseCode);
    const cIsCoReq = c.coReqs.includes(source.courseCode);

    return cNotAlreadyPresentInPath && (cIsPostReq || cIsCoReq || cIsPreReq);
  });

  currPath.push(...step);

  for (const course of step) {
    const lookPrecedingOnly = source.preReqs.includes(course.courseCode);
    const lookBothWays = source.coReqs.includes(course.courseCode);
    const alreadyLookingInDirection = onlySelectPreceding !== undefined;
    const directionForNextStep = alreadyLookingInDirection
      ? onlySelectPreceding
      : lookBothWays
        ? undefined
        : lookPrecedingOnly;
    getCoursePath(courseList, course, currPath, directionForNextStep);
  }

  return currPath;
}
