import { Router } from "express"

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
  res.setHeader("Access-Control-Allow-Origin", "*").send(result)
})

export default router
