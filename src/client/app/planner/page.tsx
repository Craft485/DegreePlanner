"use client"

import { Layout, Typography } from "antd"
import { InputForm } from "~/InputForm"

export default function PlannerPage() {
  return (
    <Layout className="bg-transparent!">
      <Layout.Header className="flex justify-center items-center bg-transparent!">
        <Typography.Title className="text-white!">Degree Planner</Typography.Title>
      </Layout.Header>
      <Layout.Content className="bg-transparent!">
        <InputForm />
      </Layout.Content>
    </Layout>
  )
}
