import { Button, Card, Form } from "antd"
import { ProgramSelection, ProgramSelectionProps } from "./programSelection"
import { Plus } from "lucide-react"
import { useCallback, useState } from "react"
import "./inputForm.css"

function Title({ onAdd }: Readonly<{ onAdd: () => void }>) {
  return (
    <div className="flex items-center gap-4">
      Program Selection <Button icon={<Plus />} onClick={onAdd}/>
    </div>
  )
}

export function InputForm() {
  const [selections, setSelections] = useState<Omit<ProgramSelectionProps, "onRemove">[]>([])

  const removeSelection = useCallback((key: string) => {
    setSelections(prev => prev.filter(selection => selection.listId !== key))
  }, [])

  const addSelection = useCallback(() => {
    setSelections(prev => prev.concat([{
      listId: String(new Date().getTime()),
      // TODO: Add data for selections
    }]))
  }, [])

  return (
    <Form className="ml-2 mr-2">
      <Card title={<Title onAdd={addSelection}/>}>
        {selections.map(props => (
          <ProgramSelection
            key={props.listId}
            listId={props.listId}
            onRemove={removeSelection}
          />
        ))}
      </Card>
    </Form>
  )
}
