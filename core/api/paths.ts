export const AUTHPATHS = {
    register: "/rent-auth/auth/register",
    login: "/rent-auth/auth/login",
    email: {
        forward: "/rent-auth/email/forward",
    },
    refresh: "/rent-auth/auth/refresh",
    rotate: "/rent-auth/auth/refresh/rotate",
    logout: "/rent-auth/auth/logout",
};

export const FINANCIAL_MODULE = {
    PROPERTY_REGISTRATION_FEATURE: {
        PROPERTY: "/rent-financial/property", // post y GET (ALL)
    },
};
