import { Form, Select } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import "./programSelection.css"
import { CircleX } from "lucide-react";

export interface ProgramSelectionProps {
  onRemove: (_key: string) => void;
  listId: string;
  locations?: string[];
  colleges?: string[];
  programs?: string[];
  fieldsOfStudy?: string[];
}

function createSelectOptions(values: string[]): DefaultOptionType[] {
  return values.map(value => ({ value, label: value }))
}

const emptyOption: DefaultOptionType = {
  label: "--- Make a Selection ---",
}

export function ProgramSelection(props: Readonly<ProgramSelectionProps>) {
  return (
    <div className="program-selection flex gap-4 items-center" id={props.listId}>
      <Form.Item name={`location${props.listId}`} label="Location" initialValue={emptyOption.label}>
        <Select
          options={[emptyOption, ...createSelectOptions(props.locations ?? [])]}
        />
      </Form.Item>
      <Form.Item name={`college${props.listId}`} label="College" initialValue={emptyOption.label}>
        <Select
          options={[emptyOption, ...createSelectOptions(props.colleges ?? [])]}
        />
      </Form.Item>
      <Form.Item name={`program${props.listId}`} label="Program" initialValue={emptyOption.label}>
        <Select
          options={[emptyOption, ...createSelectOptions(props.colleges ?? [])]}
        />
      </Form.Item>
      <Form.Item name={`field${props.listId}`} label="Field" initialValue={emptyOption.label}>
        <Select
          options={[emptyOption, ...createSelectOptions(props.colleges ?? [])]}
        />
      </Form.Item>
      <CircleX color="red" onClick={() => props.onRemove(props.listId)} style={{ cursor: "pointer" }} />
    </div>
  )
}