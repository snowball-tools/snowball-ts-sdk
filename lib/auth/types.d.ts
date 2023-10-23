import { AuthProvider } from "./base";
export interface AuthProviderInfo {
    name: AuthProvider;
    apiKeys?: {
        [key: string]: string;
    };
}
