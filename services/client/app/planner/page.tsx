"use client"

import { useState } from "react"
import { Layout } from "antd"
import { InputForm } from "~/InputForm"
import { GraphRenderer } from "@/components/graph/graph"
import type { Curriculum } from "types/solver"
import { ReactFlowProvider } from "@xyflow/react"
import "./planner.css"
import { GraphContextProvider } from "@/components/graph/graphProvider"
import { twMerge } from "tailwind-merge"
import { X } from "lucide-react"

export default function PlannerPage() {
  const [graphData, setGraphData] = useState<Curriculum | null>(null)
  const [selectedFields, setSelectedFields] = useState<string[]>([])

  return (
    <Layout className="bg-transparent!">
      <Layout.Header className={twMerge([
        "relative z-101 flex items-center bg-transparent!",
        graphData === null ? "justify-evenly" : "justify-between",
      ])}>
        {
          graphData === null
            ? <h1 className="text-white text-4xl font-bold">Degree Planner</h1>
            : <>
              <h2 className="text-2xl font-semibold">Showing potential degree plan for: {selectedFields.join(" + ")}</h2>
              {/* TODO: Add proper WAILA button */}
              <h2 className="text-2xl font-semibold">What am I looking at?</h2>
              <X color="red" onClick={() => setGraphData(null)} className="cursor-pointer" />
            </>
        }
      </Layout.Header>
      <Layout.Content className="bg-transparent!">
        {
          graphData === null
          ? <InputForm setGraphData={setGraphData} setSelectedFields={setSelectedFields} />
          : <GraphContextProvider graph={graphData}>
            <ReactFlowProvider>
              <GraphRenderer />
            </ReactFlowProvider>
          </GraphContextProvider>
        }
      </Layout.Content>
    </Layout>
  )
}
