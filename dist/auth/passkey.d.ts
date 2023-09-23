import type { SimpleSmartAccountOwner } from "@alchemy/aa-core";
import type { AuthProvider, SnowballAuth } from "..";
import type { Chain } from "../helpers/chains";
import type { AuthMethod } from "@lit-protocol/types";
export declare class Passkey implements SnowballAuth {
    chain: Chain;
    authProvider: AuthProvider;
    constructor(chain: Chain, authProvider: AuthProvider);
    registerPasskey(_username: string): Promise<void>;
    authenticatePasskey(): Promise<AuthMethod>;
    getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner>;
}
