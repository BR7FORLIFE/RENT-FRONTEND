// archivo para testear los storage de autenticacion
import AsyncStorage from "@react-native-async-storage/async-storage";
import { beforeEach, expect, test, vi } from "vitest";
import { InfoStorage } from "../services/auth.service";

beforeEach(() => {
    vi.clearAllMocks();
});

vi.mock("@react-native-async-storage/async-storage", () => ({
    // creamos un mock para este modulo
    default: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        clear: vi.fn(),
    },
}));

const AsyncStorageMock = vi.mocked(AsyncStorage); // le dice a typescript que esta tratando con un mock

//configuramos los casos de uso

//get

//cuando se espera que exista la informacion
test("Deberia retornar la informacion del usuario del storage correctamente", async () => {
    AsyncStorageMock.getItem.mockResolvedValue(
        JSON.stringify({ userId: "123", refreshToken: "abc" }),
    );
    const result = await InfoStorage().get(); //llamamos al servico de infoStorage()
    expect(result).toEqual({ userId: "123", refreshToken: "abc" });
});

test("Deberia retornar null cuando el storage esta vacio", async () => {
    AsyncStorageMock.getItem.mockResolvedValue(null);
    const result = await InfoStorage().get(); //llamamos al servico de infoStorage()
    expect(result).toBeNull();
});

//set
test("Debe guardar el userId cuando el storage ya contiene información", async () => {
    AsyncStorageMock.getItem.mockResolvedValue(
        JSON.stringify({
            userId: null,
            refreshToken: "abc",
        }),
    );

    await InfoStorage().set({
        userId: "123",
        refreshToken: null,
    });

    expect(AsyncStorageMock.setItem).toHaveBeenCalledTimes(1);

    expect(AsyncStorageMock.setItem).toHaveBeenCalledWith(
        "userInfo",
        JSON.stringify({
            userId: "123",
            refreshToken: "abc",
        }),
    );
});

test("Debe guardar el refreshToken conservando el userId existente", async () => {
    AsyncStorageMock.getItem.mockResolvedValue(
        JSON.stringify({
            userId: "123",
            refreshToken: null,
        }),
    );

    await InfoStorage().set({
        userId: null,
        refreshToken: "5025c0d9-c61c-4635-bec2-45f992dd7504",
    });

    expect(AsyncStorageMock.setItem).toHaveBeenCalledTimes(1);

    expect(AsyncStorageMock.setItem).toHaveBeenCalledWith(
        "userInfo",
        JSON.stringify({
            userId: "123",
            refreshToken: "5025c0d9-c61c-4635-bec2-45f992dd7504",
        }),
    );
});

//clear
