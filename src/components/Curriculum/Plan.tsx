import { Button } from "antd";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { PlanProvider } from "@/hooks/usePlan";
import type { DegreePlan } from "@/services/types";
import { CourseFocus } from "./CourseFocus";
import { Semester } from "./Semester";

export interface PlanViewProps {
  plan: DegreePlan;
  setCurrentPlan: Dispatch<SetStateAction<DegreePlan | null>>;
}

export function PlanView({ plan, setCurrentPlan }: Readonly<PlanViewProps>) {
  const totalCredits = useMemo(
    () => plan.semesters.flat().reduce((t, c) => t + c.credits, 0),
    [plan.semesters],
  );

  const clearCurrentPlan = useCallback(
    () => setCurrentPlan(null),
    [setCurrentPlan],
  );

  return (
    <PlanProvider plan={plan}>
      <section className="flex flex-col h-screen">
        <div className="p-2 flex justify-between items-center border-b-2 mb-4 border-b-gray-400 bg-[#1a2231]">
          <div>
            <span>Total Credits: {totalCredits}</span>
          </div>
          <div>
            <Button onClick={clearCurrentPlan}>Back</Button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-scroll pb-2">
          {/* TODO: Should not use index as part of the key */}
          {...plan.semesters.map((semester, i) => {
            const key = `S${i + 1}`;
            return <Semester key={key} label={key} courses={semester} />;
          })}
        </div>
        <CourseFocus />
      </section>
    </PlanProvider>
  );
}
