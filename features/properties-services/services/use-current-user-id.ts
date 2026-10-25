import { useQuery } from "@tanstack/react-query";
import { Me } from "../../../core/api/api-endpoints";
import { useAuth } from "../../../stores/auth-store";

// useAuth.userId solo se llena al registrarse; tras un login hay que tomarlo de "me"
export function useCurrentUserId(): string | null {
    const storedUserId = useAuth((s) => s.userId);
    const { data } = useQuery({ queryKey: ["me"], queryFn: Me });
    return data?.userId ?? storedUserId;
}
