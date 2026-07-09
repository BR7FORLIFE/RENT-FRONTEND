export const AUTHPATHS = {
    register: "/rent-auth/auth/register",
    login: "/rent-auth/auth/login",
    email: {
        forward: "/rent-auth/email/forward",
    },
    oauth2: {
        authorization: "/rent-auth/oauth2/authorization/google",
        credentials: "/rent-auth/auth/oauth2/exchange",
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
