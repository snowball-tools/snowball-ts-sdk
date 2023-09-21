"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var browser_1 = require("@simplewebauthn/browser");
var Passkey = /** @class */ (function () {
    function Passkey(chain) {
        this.chain = chain;
    }
    Passkey.prototype.isWebAuthnSupported = function () {
        return ((0, browser_1.browserSupportsWebAuthn)() && !navigator.userAgent.includes("Firefox"));
    };
    Passkey.prototype.registerPasskey = function (username) {
        throw new Error("Method not implemented..");
    };
    Passkey.prototype.authenticatePasskey = function () {
        throw new Error("Method not implemented.");
    };
    Passkey.prototype.getSimpleAccountOwner = function (chain) {
        throw new Error("Method not implemented.");
    };
    return Passkey;
}());
exports.default = Passkey;
