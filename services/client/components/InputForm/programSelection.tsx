import { Form, Select } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import "./programSelection.css"
import { CircleX } from "lucide-react";

const { Item } = Form

export interface ProgramSelectionProps {
  locations: string[];
  colleges: string[];
  programs: string[];
  fieldsOfStudy: string[];
  stacks: { stack: string, title: string }[];
  onRemove: () => void;
  name: number;
}

export function createSelectOptions(values: string[]): DefaultOptionType[] {
  return values.map(value => ({ value, label: value }))
}

function createFieldOptions(values: ProgramSelectionProps["stacks"]): DefaultOptionType[] {
  return values.map(({ stack, title }) => ({ value: stack, label: title }))
}

const emptyOption: DefaultOptionType = {
  label: "--- Make a Selection ---",
}

export function ProgramSelection(props: Readonly<ProgramSelectionProps & { id: number }>) {
  return (
    <div key={props.id} className="program-selection flex gap-4 items-center">
      <Item name={[props.name, "location"]}>
        <Select options={createSelectOptions(props.locations ?? [])} placeholder={emptyOption.label} allowClear={{ clearIcon: <CircleX color="red" size={15} /> }}/>
      </Item>
      <Item name={[props.name, "college"]}>
        <Select options={createSelectOptions(props.colleges ?? [])} placeholder={emptyOption.label} allowClear={{ clearIcon: <CircleX color="red" size={15} /> }}/>
      </Item>
      <Item name={[props.name, "program"]}>
        <Select options={createSelectOptions(props.programs ?? [])} placeholder={emptyOption.label} allowClear={{ clearIcon: <CircleX color="red" size={15} /> }}/>
      </Item>
      <Item name={[props.name, "field"]}>
        <Select options={createFieldOptions(props.stacks)} placeholder={emptyOption.label} allowClear={{ clearIcon: <CircleX color="red" size={15} /> }}/>
      </Item>
      <CircleX color="red" onClick={props.onRemove} style={{ cursor: "pointer" }} />
    </div>
  )
}