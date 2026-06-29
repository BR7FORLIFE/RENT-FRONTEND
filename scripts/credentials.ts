import { InfoStorage } from "../features/auth/services/auth.service";

export async function getUserCredentials(): Promise<{
    userId: string | null;
    refreshToken: string | null;
}> {
    const data = await InfoStorage().get();

    return {
        userId: data?.userId ?? null,
        refreshToken: data?.refreshToken ?? null,
    };
}
