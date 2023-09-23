export declare enum Auth {
    lit = "lit",
    turnkey = "turnkey",
    privy = "privy"
}
export declare enum AA {
    alchemy = "alchemy",
    fun = "fun"
}
export interface AuthProvider {
    name: Auth;
    apiKeys: {
        [key: string]: string;
    };
}
export interface AAProvider {
    name: AA;
    apiKeys: {
        [key: string]: string;
    };
}
export declare const AAProviders: {
    alchemy: {
        name: AA;
        apiKeys: {};
    };
    fun: {
        name: AA;
        apiKeys: {};
    };
};
export declare const AuthProviders: {
    lit: {
        name: Auth;
        apiKeys: {};
    };
    turnkey: {
        name: Auth;
        apiKeys: {};
    };
    privy: {
        name: Auth;
        apiKeys: {};
    };
};
export declare const DEFAULT_EXP: string;
