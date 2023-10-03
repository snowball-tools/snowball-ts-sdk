"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurkeyPasskey = exports.LitPasskey = exports.Passkey = void 0;
var Passkey_1 = require("./Passkey");
Object.defineProperty(exports, "Passkey", { enumerable: true, get: function () { return Passkey_1.Passkey; } });
var LitPasskey_1 = require("./LitPasskey");
Object.defineProperty(exports, "LitPasskey", { enumerable: true, get: function () { return LitPasskey_1.LitPasskey; } });
var TurkeyPasskey_1 = require("./TurkeyPasskey");
Object.defineProperty(exports, "TurkeyPasskey", { enumerable: true, get: function () { return TurkeyPasskey_1.TurkeyPasskey; } });
__exportStar(require("./types"), exports);
