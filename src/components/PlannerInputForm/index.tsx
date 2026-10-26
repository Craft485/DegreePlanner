"use client";

import { Button, Form } from "antd";
import { PlusCircle } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useMemo } from "react";
import { usePrograms } from "@/hooks/useProgramList";
import { ProgramSelect } from "./ProgramSelect";

export interface PlannerInputFormProps {
  setSelectedFields: Dispatch<SetStateAction<string[]>>;
}

interface PlannerSubmissionFormData {
  items: {
    "selected-program": string;
  }[];
}

interface PlannerSubmissionPayload {
  stacks: string[];
}

const { List } = Form;

export function PlannerInputForm() {
  const onFinish = useCallback<(values: PlannerSubmissionFormData) => void>(
    (values) => {
      const payload = {
        stacks: values.items.map((item) => item["selected-program"]),
      } satisfies PlannerSubmissionPayload;
      fetch("/api/submit-planner-form", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    [],
  );
  const { data } = usePrograms();

  // TODO: Update this once we have a proper DB
  const options = useMemo(
    () =>
      data
        .filter((p) => ["BSCS", "BSCOMPE", "BSEE"].includes(p.DegreeCode))
        .map((p) => ({ value: p.ProgramStack, label: p.ProgramTitle })),
    [data],
  );

  return (
    <Form onFinish={onFinish} initialValues={{ items: [{}] }}>
      <List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <ProgramSelect
                key={field.key}
                name={field.name}
                onRemove={() => remove(field.name)}
                options={options}
              />
            ))}
            <PlusCircle
              color="white"
              onClick={add}
              className="cursor-pointer"
            />
          </>
        )}
      </List>
      <Button htmlType="submit">Submit</Button>
    </Form>
  );
}
