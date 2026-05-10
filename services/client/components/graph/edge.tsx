import { BaseEdge, EdgeProps } from '@xyflow/react'
import { NODE_WIDTH, NODE_HEIGHT } from './graph';
import { useContext } from 'react';
import { GraphContext } from './graphProvider';

const BASE_TOLERANCE = 1

interface Position {
  x: number
  y: number
}

function positionIsWithinToleranceOfTarget(currentPosition: Position, targetPosition: Position, tolerance = BASE_TOLERANCE) {
  return (targetPosition.x - currentPosition.x) ** 2 + (targetPosition.y - currentPosition.y) ** 2 <= tolerance ** 2
}

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  source,
  target,
  markerEnd,
}: Readonly<EdgeProps>) {
  const { customEdgePaths, courseMap: map } = useContext(GraphContext)!
  const key = `${source}:${target}`
  let path = customEdgePaths.get(key) ?? ""

  if (!path) {
    const yDirection = sourceY - targetY > 0 ? -1 : 1

    const currentPosition = {
      x: sourceX + (0.25 * NODE_WIDTH),
      y: (targetX - sourceX) <= 0.5 * NODE_WIDTH ? targetY : sourceY + (0.75 * NODE_HEIGHT * yDirection),
    } satisfies Position
    const targetPosition = { x: targetX, y: targetY } as const satisfies Position
    
    const points: Position[] = []
    const clampY = Math[sourceY - targetY > 0 ? "max" : "min"]
    const minXDeltaToTarget = targetX - (0.25 * NODE_WIDTH)
    
    let proceedHorizontally = true
    path = `
      M${sourceX - 5},${sourceY}
      L${currentPosition.x},${sourceY}
      L${currentPosition.x},${currentPosition.y}`
    
    while (!positionIsWithinToleranceOfTarget(currentPosition, targetPosition)) {
      const newPosition = { ...currentPosition } satisfies Position
      
      // Determine direction to travel
      if (proceedHorizontally) {
        const newX = newPosition.x + (1.5 * NODE_WIDTH)
        const clampedX = Math.min(newX, targetX)
        if (currentPosition.x < minXDeltaToTarget || currentPosition.y === targetY) {
          newPosition.x = clampedX
        }
      } else {
        const newY = newPosition.y + (1.5 * NODE_HEIGHT * yDirection)
        const clampedY = clampY(newY, targetY)
        if (clampedY === newY || currentPosition.x >= minXDeltaToTarget) {
          newPosition.y = clampedY
        }
      }
      
      if (newPosition.x !== currentPosition.x || newPosition.y !== currentPosition.y) {
        points.push({ ...newPosition })
        currentPosition.x = newPosition.x
        currentPosition.y = newPosition.y
      }

      proceedHorizontally = !proceedHorizontally
    }
    
    for (let i = 0; i < points.length; i++) {
      const { x, y } = points[i]
      path += `L${x},${y}`
    }
    
    customEdgePaths.set(key, path)
  }

  return (
    <BaseEdge
      id={id}
      path={customEdgePaths.get(key)!}
      style={{
        strokeWidth: "2",
        stroke: `#${map.get(source)!.color}`,
      }}
      markerEnd={markerEnd}
    />
  )
}
