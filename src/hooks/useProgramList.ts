import { useEffect, useState } from "react";
import type { Program } from "@/services/types";

export interface GetProgramsQueryResult {
  data: Program[];
  loading: boolean;
  error: Error | null;
}

export function usePrograms(): GetProgramsQueryResult {
  const [data, setData] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/program_list.json");

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const json = await response.json();

        if (isMounted) {
          setData(json.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
