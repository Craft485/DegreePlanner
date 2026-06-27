import { CSSProperties, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Node,
  Edge,
  Position,
  NodeMouseHandler,
  MarkerType,
  Background,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { Curriculum, Vertex } from '$/solver';
import { calculateCoursePath } from "../../../solver/utils/"
import { CustomEdge } from './edge';
import { GraphContext } from './graphProvider';
import { twMerge } from "tailwind-merge";

interface CourseNode extends Node {
  data: {
    label?: string;
    course?: Vertex;
  }
}

export const NODE_WIDTH = 150
export const NODE_HEIGHT = 50

const BASE_NODE_STYLES = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
} satisfies CSSProperties

function curriculumToFlowGraph(curriculum: Curriculum) {
  const nodes: CourseNode[] = []
  const edges: Edge[] = []
  
  for (let semesterIndex = 0; semesterIndex < curriculum.semesters.length; semesterIndex++) {
    const semester = curriculum.semesters[semesterIndex]
    
    // Setup semester header
    const totalSemesterCredits = semester.reduce((total, curr) => total + curr.credits, 0)
    nodes.push({
      id: `semester-${semesterIndex}`,
      data: {
        label: `Semester ${semesterIndex + 1} (${totalSemesterCredits})`,
      },
      position: {
        x: NODE_WIDTH * (1.5 * (semesterIndex + 1)),
        y: 0,
      },
      style: {
        ...BASE_NODE_STYLES,
        borderStyle: "solid",
        borderWidth: "thin",
        borderColor: "white",
        fontWeight: "bold",
      },
      selectable: false,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })

    for (let i = 0; i < semester.length; i++) {
      const course = semester[i]
      // Convert course data to ReactFlow graph node
      nodes.push({
        id: course.courseCode,
        data: {
          label: course.courseCode,
          course,
        },
        position: {
          x: NODE_WIDTH * (1.5 * course.semester),
          y: NODE_HEIGHT * (1.5 * (i + 1)),
        },
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        style: {
          ...BASE_NODE_STYLES,
          borderColor: `#${course.color}`,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })
      // Setup edges
      const connections = [...course.coReqs, ...course.postReqs]
      for (const connection of connections) {
        edges.push({
          id: `${course.courseCode}-to-${connection}`,
          type: "custom",
          source: course.courseCode,
          target: connection,
          style: {
            stroke: `#${course.color}`,
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: `#${course.color}`,
          },
          // selectable: false,
        })
      }
    }
  }

  return { nodes, edges }
}

export function GraphRenderer() {
  const { graph: graphData, courseMap } = useContext(GraphContext)!

  const [nodes, setNodes, onNodesChange] = useNodesState<CourseNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [allEdges, setAllEdges] = useEdgesState<Edge>([])
  const [nodeHover, setNodeHover] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<{x: number, y: number, data?: CourseNode}>({x: 0, y: 0})
  const { fitView } = useReactFlow();

  useLayoutEffect(() => {
    const { nodes, edges } = curriculumToFlowGraph(graphData)
    setNodes(nodes)
    setAllEdges(edges)
  }, [fitView, graphData, setAllEdges, setNodes])

  const onNodeSelect = useCallback<NodeMouseHandler<Node>>(async (_ev, node) => {
    const selectedCourse = courseMap.get(node.id)!
    const nodesToUpdate = await calculateCoursePath(selectedCourse, graphData)
    const coursesToUpdate = nodesToUpdate.map(node => node.courseCode)
    setEdges(() => allEdges.filter(edge => coursesToUpdate.includes(edge.source) && coursesToUpdate.includes(edge.target)))
    setNodes((prev) =>
      prev.map(node => {
        if (node.id.match(/^semester-/)) return node
        const course = courseMap.get(node.id)!
        return {
          ...node,
          style: {
            ...node.style,
            background: coursesToUpdate.includes(course.courseCode) ? `hsl(from #${course.color} h min(50, 0.5 * s) min(50, calc(l - 15)))` : "unset",
          },
        }
      }),
    )
  }, [allEdges, courseMap, graphData, setEdges, setNodes])

  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), [])
  const [maxXExtent, maxYExtent] = useMemo(
    () => [
      1.5 * graphData.semesters.length * NODE_WIDTH,
      1.75 * Math.max(...graphData.semesters.map(s => s.length)) * NODE_HEIGHT,
    ],
    [graphData.semesters],
  )

  return (
    <>
      <div
        className={twMerge(
          'absolute z-101 bg-[#424242] border-gray-400 border-solid border-2 justify-center items-center p-4 rounded-sm',
          nodeHover ? "flex" : "hidden",
        )}
        style={{
          translate: `${hoveredNode.x / (1)}px ${hoveredNode.y / (1)}px`,
          minWidth: `${NODE_WIDTH}px`,
          minHeight: `${NODE_HEIGHT}px`,
          borderColor: `#${hoveredNode.data?.data.course?.color}`,
        }}
      >
        {hoveredNode.data?.data.course?.courseName} ({hoveredNode.data?.data.course?.credits} Credits)
      </div>
      <div className='w-full h-full z-100 top-0 absolute'>
        <ReactFlow
          className="bg-transparent!"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          colorMode="dark"
          color="white"
          nodesDraggable={false}
          onNodeClick={onNodeSelect}
          translateExtent={[[NODE_WIDTH, -NODE_HEIGHT], [maxXExtent, maxYExtent]]}
          minZoom={1}
          maxZoom={1}
          onBeforeDelete={async () => false}
          onNodeMouseEnter={(ev, node) => {
            if (node.data.course?.courseCode) {
              const rect = ev.currentTarget.getBoundingClientRect()
              setHoveredNode({ x: rect.x, y: rect.top, data: node })
              setNodeHover(true)
            }
          }}
          onNodeMouseLeave={() => setNodeHover(false)}
          nodesConnectable={false}
          edgeTypes={edgeTypes}
        >
          <Background color="transparent" bgColor="transparent" />
        </ReactFlow>
      </div>
    </>
  );
}
