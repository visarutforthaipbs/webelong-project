import { useEffect, useState } from "react";
import { apiUrl } from "../config/api";

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const fullUrl = url.startsWith("http") ? url : apiUrl(url);

    fetch(fullUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
