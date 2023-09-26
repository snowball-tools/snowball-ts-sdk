export declare function retry<T extends (...arg0: any[]) => any>(fn: T, args: Parameters<T>, maxTry: number, retryCount?: number): Promise<Awaited<ReturnType<T>>>;
