import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import SplashScreen from "../components/splash-screen";
import { queryClient } from "../core/tanstackconfig/config";
import { useBootstrapApp } from "../hooks/hooks";

export default function AppLayout() {
  const isLoading = useBootstrapApp();

  const [loaded] = useFonts({
    arimo: require("../assets/fonts/arimo.ttf"),
  });

  if (!loaded) {
    return null;
  }

  if (isLoading) {
    //Mandamos el splashScreen
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <Toast position="top" visibilityTime={2000} />
    </QueryClientProvider>
  );
}
