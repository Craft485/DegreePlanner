import { Button } from "antd";
import { useCallback } from "react";
import { usePlan } from "@/hooks/usePlan";

export interface CourseProps {
  courseCode: string;
  credits: number;
  color: string;
  // progressState: boolean;
}

export function Course({ courseCode, credits, color }: Readonly<CourseProps>) {
  const { plan, setCurrentFocusCourse } = usePlan();

  const updateFocusCourse = useCallback(() => {
    const course = plan.semesters
      .flat()
      .find((c) => c.courseCode === courseCode);
    if (course !== undefined) {
      setCurrentFocusCourse(course);
    }
  }, [courseCode, plan.semesters, setCurrentFocusCourse]);

  return (
    <Button
      onClick={updateFocusCourse}
      className="relative! border-2! rounded-2xl! flex! items-center! justify-center! p-6!"
      style={{
        borderColor: color,
      }}
    >
      {courseCode}
      <span className="font-light absolute bottom-1 right-3">{credits}</span>
    </Button>
  );
}
