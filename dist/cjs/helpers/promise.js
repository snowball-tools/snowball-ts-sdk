"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = void 0;
async function retry(fn, args, maxTry, retryCount = 1) {
    const currRetry = typeof retryCount === "number" ? retryCount : 1;
    try {
        const result = await fn(...args);
        return result;
    }
    catch (e) {
        if (currRetry > maxTry) {
            throw e;
        }
        return retry(fn, args, maxTry, currRetry + 1);
    }
}
exports.retry = retry;
//# sourceMappingURL=promise.js.map