import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, use, useMemo, useState } from "react";
import type { Course, DegreePlan } from "@/services/types";

export interface PlanContextValue {
  plan: DegreePlan;
  currentFocusCourse: Course;
  setCurrentFocusCourse: Dispatch<SetStateAction<Course>>;
}

export interface PlanProviderProps {
  plan: DegreePlan;
  children: ReactNode;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ plan, children }: Readonly<PlanProviderProps>) {
  const [currentFocusCourse, setCurrentFocusCourse] = useState<Course>(
    plan.semesters[0][0],
  );

  const contextValue = useMemo<PlanContextValue>(
    () => ({
      plan,
      currentFocusCourse,
      setCurrentFocusCourse,
    }),
    [currentFocusCourse, plan],
  );

  return <PlanContext value={contextValue}>{children}</PlanContext>;
}

export function usePlan() {
  const context = use(PlanContext);

  if (context === null) {
    throw new Error("usePlan must be used within a PlanProvider");
  }

  return context;
}
