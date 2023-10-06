export declare enum AuthProvider {
    lit = "lit",
    turnkey = "turnkey"
}
export interface AuthProviderInfo {
    name: AuthProvider;
    apiKeys?: {
        [key: string]: string;
    };
}
export declare const AuthProviders: {
    lit: {
        name: AuthProvider;
        apiKeys: {};
    };
    turnkey: {
        name: AuthProvider;
        apiKeys: {};
    };
};
