import type { CourseLookupTable, DegreePlan } from "@/services/types";
import { optimizer as agro_builder } from "./agro_build";

interface Cookie {
  [key: string]: unknown;
}

export type Optimizer = [
  displayName: string,
  verifyFn: (courseTable: CourseLookupTable, cookie?: Cookie) => boolean,
  optimizeFn: (
    program: DegreePlan,
    table: CourseLookupTable,
    cookie?: Cookie,
  ) => DegreePlan,
];

export const OPTIMIZERS = [agro_builder] as const as Optimizer[];
