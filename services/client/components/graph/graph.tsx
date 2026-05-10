import { useCallback, useContext, useLayoutEffect, useMemo } from 'react';
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
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { Curriculum } from '$/solver';
import { calculateCoursePath } from "../../../solver/utils/"
import { CustomEdge } from './edge';
import { GraphContext } from './graphProvider';

export const NODE_WIDTH = 150
export const NODE_HEIGHT = 50

function curriculumToFlowGraph(curriculum: Curriculum) {
  const nodes: Node[] = []
  const edges: Edge[] = []
  
  for (const semester of curriculum.semesters) {
    for (let i = 0; i < semester.length; i++) {
      const course = semester[i]
      // Convert course data to ReactFlow graph node
      nodes.push({
        id: course.courseCode,
        data: {
          label: course.courseCode,
        },
        position: {
          x: NODE_WIDTH * (1.5 * course.semester),
          y: NODE_HEIGHT * (1.5 * i),
        },
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [allEdges, setAllEdges] = useEdgesState<Edge>([])
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

  return (
    <div style={{ height: window.innerHeight, width: window.innerWidth, position: "absolute", zIndex: 999, top: 0 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode="dark"
        color="white"
        nodesDraggable={false}
        onNodeClick={onNodeSelect}
        // translateExtent={[[0, 0], [5000, 5000]]}
        onBeforeDelete={async () => false}
        nodesConnectable={false}
        fitView
        edgeTypes={edgeTypes}
      />
    </div>
  );
}
