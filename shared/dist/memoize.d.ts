type AnyFunction = (...args: any[]) => any;
export declare function memoize<T extends AnyFunction>(fn: T): T & {
    clear: () => void;
};
export {};
