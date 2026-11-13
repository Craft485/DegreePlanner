import { usePlan } from "@/hooks/usePlan";

export function CourseFocus() {
  const plan = usePlan();

  return (
    <div className="flex grow flex-row items-center p-2 pb-0 border-t-2 border-t-gray-100 bg-[#1a2231] text-xl">
      <div className="pr-4 border-r-2 border-dashed border-r-gray-100 mr-4">
        Selected Course
        <div className="border-l-2 border-l-gray-200 pl-2">
          <b>{plan.currentFocusCourse.courseCode}</b>
          <br />
          {plan.currentFocusCourse.credits} Credit Hour
          {plan.currentFocusCourse.credits > 1 ? "s" : ""}
        </div>
      </div>
      <div>{plan.currentFocusCourse.courseName}</div>
    </div>
  );
}
