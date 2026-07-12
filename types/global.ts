export interface ApiError {
    localDateTime: string;
    error: string;
    message: string;
    path: string;
}

interface Metadata {
    limit: number;
    page: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    total: number;
    totalPages: number;
}

export type GetAll<T> = {
    data: T;
    metadata: Metadata;
};

export type Get<T extends PropertyKey, K> = {
    [P in T]: K;
};

export interface Storage<T> {
    get: () => Promise<T | null>;
    set: (data: T) => Promise<void>;
    clean: () => Promise<void>;
}
