import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
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
          router.navigate("/login");
          return;
        }
        setAccessToken(accessToken);

        setLoading(false);
      } catch (error) {
        logoutUser();
        router.navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [setAccessToken]);

  return loading;
}
//loop para opacidades animadas
export function useTextAnimation() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return opacity;
}
