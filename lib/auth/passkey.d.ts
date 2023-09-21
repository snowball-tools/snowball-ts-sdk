import type { SimpleSmartAccountOwner } from "@alchemy/aa-core";
import type { SnowballAuth } from "..";
import type { Chain } from "../helpers/chains";
export declare class Passkey implements SnowballAuth {
    chain: Chain;
    constructor(chain: Chain);
    isWebAuthnSupported(): boolean;
    registerPasskey(_username: string): Promise<void>;
    authenticatePasskey(): Promise<void>;
    getSimpleAccountOwner(_chain: Chain): Promise<SimpleSmartAccountOwner>;
}
