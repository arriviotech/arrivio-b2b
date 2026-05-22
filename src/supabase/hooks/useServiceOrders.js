import { useCallback, useEffect, useState } from "react";
import {
  createServiceOrder,
  getServiceOrders,
  updateServiceOrderStatus,
  updateServiceOrderStatusBulk,
} from "../services/orders.service";

export function useServiceOrders({ status = "all" } = {}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    setLoading(true);
    return getServiceOrders({ status })
      .then(setOrders)
      .catch((err) => {
        console.error("Failed to load service orders:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (payload) => {
      const order = await createServiceOrder(payload);
      await refresh();
      return order;
    },
    [refresh]
  );

  const updateStatus = useCallback(
    async ({ id, status: nextStatus }) => {
      const order = await updateServiceOrderStatus({ id, status: nextStatus });
      await refresh();
      return order;
    },
    [refresh]
  );

  const updateManyStatus = useCallback(
    async ({ ids, status: nextStatus }) => {
      const updated = await updateServiceOrderStatusBulk({ ids, status: nextStatus });
      await refresh();
      return updated;
    },
    [refresh]
  );

  return { orders, loading, error, refresh, create, updateStatus, updateManyStatus };
}
