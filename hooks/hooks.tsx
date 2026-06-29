import { useEffect, useState } from "react";
import { refresh } from "../core/api/api-endpoints";
import { logoutUser } from "../features/auth/services/auth.service";
import { useAuth } from "../stores/auth-store";

export function useBootstrapApp() {
  const { setAccessToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      try {
        //hay que inyectar el accessToken al store de zustand ademas de validar y
        // hacer logout si el refresh esta expirado
        const { accessToken } = await refresh();
        //hacemos el logout para volver a pedir el refresh
        if (!accessToken) {
          logoutUser();
          return;
        }
        setAccessToken(accessToken);

        setLoading(false);
      } catch (error) {
        logoutUser();
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [setAccessToken]);

  return loading;
}
