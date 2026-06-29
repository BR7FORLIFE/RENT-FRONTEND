import { Redirect } from "expo-router";
import { useAuth } from "../stores/auth-store";

export default function Index() {
  const { accessToken } = useAuth();
  return (
    <Redirect
      href={accessToken ? "/home/(tabs)/properties-services" : "/login"}
    />
  );
}
