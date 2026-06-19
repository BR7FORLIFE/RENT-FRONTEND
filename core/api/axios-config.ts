import { create } from "axios";

export const api = create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
});

//interceptores de request

//interceptores de response
