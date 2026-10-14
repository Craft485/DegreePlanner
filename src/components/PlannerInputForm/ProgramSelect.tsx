"use client";

import { Form, Select } from "antd";
import { CircleX } from "lucide-react";

export interface ProgramSelectOption {
  value: string;
  label: string;
}

// TODO: Add filter options to this
export interface ProgramSelectProps {
  name: number;
  options: ProgramSelectOption[];
  onRemove: () => void;
}

const { Item } = Form;

export function ProgramSelect({
  name,
  options,
  onRemove,
}: Readonly<ProgramSelectProps>) {
  return (
    <div className="flex items-center">
      <Item name={[name, "selected-program"]} className="m-0!">
        <Select placeholder="Select a program" allowClear options={options} />
      </Item>
      <CircleX color="red" onClick={onRemove} className="cursor-pointer" />
    </div>
  );
}
