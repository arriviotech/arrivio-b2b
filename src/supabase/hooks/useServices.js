import { useEffect, useState } from "react";
import { getServices } from "../services/services.service";

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((err) => {
        console.error("Failed to load services:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { services, loading, error };
}

