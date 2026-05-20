import { useEffect, useState } from "react";
import { getPropertyBySlug } from "../services/properties.service";

export function useProperty(slug) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    getPropertyBySlug(slug)
      .then(setProperty)
      .catch((err) => {
        console.error("Failed to load property:", err);
        setError(err);
        setProperty(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return { property, loading, error };
}
