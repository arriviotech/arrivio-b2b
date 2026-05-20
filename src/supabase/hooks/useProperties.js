import { useEffect, useState } from "react";
import { getProperties } from "../services/properties.service";

export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProperties()
      .then(setProperties)
      .catch((err) => {
        console.error("Failed to load properties:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { properties, loading, error };
}
