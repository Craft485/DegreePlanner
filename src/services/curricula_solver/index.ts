// Recieve request for course information for a particular program/degree
// handle multi curricula input if needed
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { DegreePlan } from "../types";
import { addLocks } from "./add_locks";
import { mergeCurricula } from "./merge";
import { OPTIMIZERS } from "./optimizers";

/**
 * @param programStacks A list of curriculum ids
 */
export async function getPlanInformation(programStacks: string[]) {
  const programs = [] as DegreePlan[];
  // For each curriculum id provided, grab the corresponding program data
  for (const programStack of programStacks) {
    // TODO: Replace this with a db query at some point
    try {
      const programData = await readFile(
        path.resolve(`src/data/${programStack}.json`),
        {
          encoding: "utf-8",
        },
      );
      programs.push(JSON.parse(programData));
    } catch (err) {
      console.error(`Failed to parse program data for ${programStack}: ${err}`);
      throw new Error(`${programStack} is not a valid program stack.`);
    }
  }

  // TODO: Length of 0 is theoretically an error state
  if (programs.length <= 1) {
    return programs[0];
  }

  // TODO: Use the optimizer specified by the user
  const optimizer = OPTIMIZERS.find((f) => f[0] === "aggressive_build");
  const fullCourseList = mergeCurricula(programs);
  // TODO: Verify the full course list has all attributes present for using a given optimizer
  const initialPlan = addLocks(fullCourseList);
  const filledInPlan = optimizer?.[2]?.(initialPlan, fullCourseList);
  return filledInPlan;
}
