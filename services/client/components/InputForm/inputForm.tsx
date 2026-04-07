import { Button, Card, Form } from "antd"
import { ProgramSelection, ProgramSelectionProps } from "./programSelection"
import { Plus } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import "./inputForm.css"
import { usePrograms } from "@/hooks/programs"

function Title({ onAdd }: Readonly<{ onAdd: () => void }>) {
  return (
    <div className="flex items-center gap-4">
      Program Selection <Button icon={<Plus />} onClick={onAdd}/>
    </div>
  )
}

export function InputForm() {
  const [selections, setSelections] = useState<Omit<ProgramSelectionProps, "onRemove">[]>([])
  const { data, loading, error } = usePrograms()

  const { colleges, fieldsOfStudy, locations, programs } = useMemo(() => (
    {
      programs: Array.from(new Set(data.map(p => p.level).filter(Boolean))),
      locations: Array.from(new Set(data.map(p => p.LocationCode ?? "").filter(Boolean))),
      fieldsOfStudy: Array.from(new Set(data.map(p => p.ProgramTitle ?? "").filter(Boolean))),
      colleges: Array.from(new Set(data.map(p => p.CollegeCode ?? "").filter(Boolean))),
    } satisfies Pick<ProgramSelectionProps, "colleges" | "fieldsOfStudy" | "locations" | "programs">
  ), [data])

  const removeSelection = useCallback((key: string) => {
    setSelections(prev => prev.filter(selection => selection.listId !== key))
  }, [])

  const addSelection = useCallback(() => {
    setSelections(prev => prev.concat([{
      listId: String(new Date().getTime()),
      fieldsOfStudy,
      locations,
      colleges,
      programs,
    }]))
  }, [colleges, fieldsOfStudy, locations, programs])

  const formFinish = useCallback(async (values) => {
    console.log(values)
    await fetch("http://127.0.0.1:3001/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stacks: ["a", "b"],
      }),
    })
  }, [])

  return (
    <Form className="ml-2 mr-2" onFinish={formFinish}>
      <Card title={<Title onAdd={addSelection}/>}>
        {(!loading && !error) && selections.map(props => (
          <ProgramSelection
            key={props.listId}
            listId={props.listId}
            onRemove={removeSelection}
            colleges={props.colleges}
            fieldsOfStudy={props.fieldsOfStudy}
            locations={props.locations}
            programs={props.programs}
          />
        ))}
      </Card>
      <Button htmlType="submit">Submit</Button>
    </Form>
  )
}
