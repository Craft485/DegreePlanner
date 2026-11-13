import { Card } from "antd";
import { useMemo } from "react";
import type { Course } from "@/services/types";
import { stringToHexCode } from "@/utils/color";
import { Course as CourseDisplay } from "./Course";

export interface SemesterProps {
  label: string;
  courses: Course[];
}

interface SemesterTitleProps {
  label: string;
  credits: number;
}

function SemesterTitle({ label, credits }: Readonly<SemesterTitleProps>) {
  return (
    <div className="flex flex-row justify-between items-center w-full h-full">
      {label}
      <span className="text-xs font-light">{credits} Credits</span>
    </div>
  );
}

export function Semester({ label, courses }: Readonly<SemesterProps>) {
  const semesterColor = useMemo(
    () => stringToHexCode(courses.reduce((s, c) => s + c.courseCode, "")),
    [courses],
  );

  return (
    <Card
      title={
        <SemesterTitle
          label={label}
          credits={courses.reduce((t, c) => t + c.credits, 0)}
        />
      }
      className="min-w-45 bg-[#1a2231]!"
    >
      <div className="flex flex-col gap-4">
        {...courses.map((course) => (
          <CourseDisplay
            key={course.courseCode}
            courseCode={course.courseCode}
            credits={course.credits}
            color={semesterColor}
          />
        ))}
      </div>
    </Card>
  );
}
