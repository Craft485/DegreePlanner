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

router.post("/plan", async (req, res) => {
  const uniqueStacks = (req.body?.stacks as string[] | undefined)?.filter((v, i, a) => a.indexOf(v) === i)
  if (!uniqueStacks) {
    res.sendStatus(400)
  }
  const result = await Parser(uniqueStacks as string[])
  res.send(result)
})

export default router
