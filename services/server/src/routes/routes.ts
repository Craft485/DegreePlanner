import { Router } from "express"
import { ParseAnalytics as Parser } from "../../../solver/index.js"
console.log(Parser)
const router = Router()

router.get("/programs", async (req, res) => {
  const { default: fileData } = await import("../../public/program-list.json", { with: { type: "json" } })
  const optionsList = fileData.data.filter(program => {
    return (
      program.HasMajorMap &&
      program.CollegeCode === "Engineering & Applied Science" &&
      program.LocationCode === "West Campus" &&
      /^(BSCS|BSCOMPE|BSEE)$/.test(program.DegreeCode)
    )
  })
  const result = optionsList.map(program => ({
    ...program,
    // TODO: dynamically determine level (could this be done client side?)
    level: "Bachelor's of Science"
  }))
  res.send(result)
})

interface FormSubmissionDate {
  items: {
    college?: string;
    field: string;
    location?: string;
    program?: string;
  }[]
}

router.post("/plan", async (req, res) => {
  const data: FormSubmissionDate = req.body?.data
  const stacks = data.items.map(item => item.field)
  console.log(stacks)
  const result = await Parser(stacks)
  res.send(result)
})

export default router
