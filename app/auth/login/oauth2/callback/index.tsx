// path para login con oauth2 302 redirecciones -> rentfrontend://login/oauth2/callback?sessionID=
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import SplashScreen from "../../../../../components/splash-screen";
import { oauth2GetCredentials } from "../../../../../core/api/api-endpoints";
import { InfoStorage } from "../../../../../features/auth/services/auth.service";
import { useAuth } from "../../../../../stores/auth-store";
import type { ApiError } from "../../../../../types/global";

export default function Oauth2SessionID() {
  const { setAccessToken } = useAuth();
  const { sessionID } = useLocalSearchParams();

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: () => oauth2GetCredentials(sessionID as string),
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data;
      setAccessToken(accessToken);
      InfoStorage().set({ userId: null, refreshToken });
      router.navigate("/home/(tabs)/property-registration");
    },
    onError: (err: AxiosError<ApiError>) => {
      const data = err.response?.data;
      if (data) {
        Toast.show({
          type: "error",
          text2: data.message,
        });
      }
    },
  });

  useEffect(() => {
    const getData = async () => {
      await mutation.mutateAsync();
    };
    getData();
  }, [sessionID, mutation]);

  return mutation.isPending && <SplashScreen />;
}
