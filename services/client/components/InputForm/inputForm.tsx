import { Button, Card, Form } from "antd"
import { ProgramSelection, ProgramSelectionProps } from "./programSelection"
import { Plus } from "lucide-react"
import { useCallback, useMemo } from "react"
import "./inputForm.css"
import { usePrograms } from "@/hooks/programs"

const { List } = Form

function Title({ onAdd }: Readonly<{ onAdd: () => void }>) {
  return (
    <div className="flex items-center gap-4">
      Program Selection <Button icon={<Plus />} onClick={onAdd}/>
    </div>
  )
}

export function InputForm() {
  const [form] = Form.useForm()
  const { data } = usePrograms()

  const props = useMemo(() => (
    {
      programs: Array.from(new Set(data.map(p => p.level).filter(Boolean))),
      locations: Array.from(new Set(data.map(p => p.LocationCode ?? "").filter(Boolean))),
      fieldsOfStudy: Array.from(new Set(data.map(p => p.ProgramTitle ?? "").filter(Boolean))),
      colleges: Array.from(new Set(data.map(p => p.CollegeCode ?? "").filter(Boolean))),
      stacks: Array.from(new Set(data.map(p => ({ stack: p.ProgramStack ?? "", title: p.ProgramTitle ?? ""})).filter(Boolean))),
    } satisfies Pick<ProgramSelectionProps, "colleges" | "fieldsOfStudy" | "locations" | "programs" | "stacks">
  ), [data])

  const formFinish = useCallback(async (values) => {
    console.log(values)
    await fetch("http://127.0.0.1:3001/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: values,
      }),
    })
  }, [])

  return (
    <Form
      className="ml-2 mr-2"
      onFinish={formFinish}
      form={form}
      initialValues={{ location: undefined, college: undefined, program: undefined }}
    >
      <List name="items">
        {(fields, {add, remove}) => (
          <Card title={<Title onAdd={add}/>}>
            {fields.map(field => (
              <ProgramSelection 
                locations={props.locations}
                colleges={props.colleges}
                fieldsOfStudy={props.fieldsOfStudy}
                programs={props.programs}
                onRemove={() => remove(field.name)}
                stacks={props.stacks}
                name={field.name}
                key={field.key}
                id={field.key}
              />
            ))}
          </Card>
        )}
      </List>
      <Button htmlType="submit">Submit</Button>
    </Form>
  )
}
