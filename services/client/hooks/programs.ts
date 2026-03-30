import { useEffect, useState } from "react"
import type { Program } from "$/programs"

export interface GetProgramsQueryResult {
  data: Program[]
  loading: boolean
  error: Error | null
}

export function usePrograms(): GetProgramsQueryResult {
  const [data, setData] = useState<[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchPrograms = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("http://127.0.0.1:3001/programs")

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const json = await response.json()

        if (isMounted) {
          setData(json)
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPrograms()

    return () => {
      isMounted = false
    }
  }, [])

  return { data, loading, error }
}