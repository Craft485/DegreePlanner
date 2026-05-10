import { Curriculum, Vertex } from "$/solver";
import { createContext, ReactNode, useMemo } from "react";

interface GraphContextProps {
  graph: Curriculum
  customEdgePaths: Map<string, string>
  courseMap: Map<string, Vertex>
}

interface GraphContextProviderProps {
  children: ReactNode
  graph: Curriculum
}

const customEdgePaths = new Map()

export const GraphContext = createContext<GraphContextProps | null>(null)

export function GraphContextProvider({
  children,
  graph,
}: Readonly<GraphContextProviderProps>) {
  const courseMap = useMemo(() => new Map(graph.semesters.flat().map(c => [c.courseCode, c])), [graph.semesters])

  return (
    <GraphContext value={{ graph, customEdgePaths, courseMap }}>
      {children}
    </GraphContext>
  )
}
