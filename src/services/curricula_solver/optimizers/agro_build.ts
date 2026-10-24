import { cloneDeep } from "radashi";
import type { CourseLookupTable, DegreePlan } from "@/services/types";
import { getCoursePath } from "@/utils";
import {
  getCourseCodesSortedByNumber,
  updateRelativeCourseLocks,
} from "../utils";
import type { Optimizer } from ".";

function aggressiveBuildOptimizer(
  program: DegreePlan,
  table: CourseLookupTable,
) {
  const result = cloneDeep(program);
  const courseList = Object.values(table);

  const courseCodes = getCourseCodesSortedByNumber(table);
  for (const courseCode of courseCodes) {
    // Check that this course hasn't already been accounted for
    if (
      result.semesters
        .flat()
        .map((c) => c.courseCode)
        .includes(courseCode)
    ) {
      continue;
    }

    const currCourse = table[courseCode];
    const coReqs = currCourse.coReqs.map((cc) => table[cc]);
    const creditWeightForCurrentCourse =
      currCourse.credits + coReqs.reduce((total, c) => total + c.credits, 0);

    const preReqs = getCoursePath(courseList, currCourse, [], true);
    const setOfPreReqs = new Set(preReqs.map((c) => c.courseCode));
    const postReqs = getCoursePath(courseList, currCourse, [], false);
    const setOfPostReqs = new Set(postReqs.map((c) => c.courseCode));
    const minSemesterIndex =
      (new Set(preReqs.map((c) => c.semester)).size || 1) - 1;
    let coursePlacedSuccessfully = false;
    // What is the earliest point this course can be placed?
    for (
      let semesterIndex = minSemesterIndex;
      semesterIndex < result.semesters.length;
      semesterIndex++
    ) {
      const currSemester = result.semesters[semesterIndex];
      const creditsForCurrentSemetser = currSemester.reduce(
        (total, course) => total + course.credits,
        0,
      );
      // TODO: Max credits for a semester should be configurable by both the institution (default value) and the user (override value)
      if (creditsForCurrentSemetser + creditWeightForCurrentCourse >= 18) {
        continue;
      }

      // Validate that dependencies won't be violated

      // look at preceding slice, is there a postreq there?
      const setOfPrecedingPlannedCourses = new Set(
        result.semesters
          .slice(0, semesterIndex + 1)
          .flat()
          .map((c) => c.courseCode),
      );
      const postreqPresentInPrecedingCourses =
        !setOfPrecedingPlannedCourses.isDisjointFrom(setOfPostReqs);

      // look at following slice, is there a prereq there?
      const setOfFollowingPlannedCourses = new Set(
        result.semesters
          .slice(semesterIndex)
          .flat()
          .map((c) => c.courseCode),
      );
      const prereqPresentInFollowing =
        !setOfFollowingPlannedCourses.isDisjointFrom(setOfPreReqs);

      if (postreqPresentInPrecedingCourses || prereqPresentInFollowing) {
        continue;
      }

      // Course is ok to add to this semester, ensure to account for coreq if present
      result.semesters[semesterIndex].push(...[currCourse, ...coReqs]);
      coursePlacedSuccessfully = true;
      break;
    }
    if (!coursePlacedSuccessfully) {
      // Course cannot fit into the plan, we need to add another semester
      result.semesters.push([currCourse, ...coReqs]);
      updateRelativeCourseLocks(result);
    }
  }

  return result;
}

export const optimizer = [
  "aggressive_build",
  // TODO: Write verify function
  (..._args) => true,
  aggressiveBuildOptimizer,
] as const as Optimizer;
