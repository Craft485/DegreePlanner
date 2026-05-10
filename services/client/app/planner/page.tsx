"use client"

import { useState } from "react"
import { Layout, Typography } from "antd"
import { InputForm } from "~/InputForm"
import { GraphRenderer } from "@/components/graph/graph"
import type { Curriculum } from "types/solver"
import { ReactFlowProvider } from "@xyflow/react"
import "./planner.css"
import { GraphContextProvider } from "@/components/graph/graphProvider"

export default function PlannerPage() {
  const [graphData, setGraphData] = useState<Curriculum | null>(null)

  return (
    <Layout className="bg-transparent!">
      <Layout.Header className="flex justify-center items-center bg-transparent!">
        <Typography.Title className="text-white!">Degree Planner</Typography.Title>
      </Layout.Header>
      <Layout.Content className="bg-transparent!">
        {
          graphData === null
          ? <InputForm setGraphData={setGraphData} />
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
