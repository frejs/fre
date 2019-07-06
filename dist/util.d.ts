export declare const arrayfy: <T>(arr: T | T[]) => T[];
export declare const isSame: (a: {
    type: any;
}, b: {
    type: any;
}) => boolean;
export declare const isNew: (o: any, n: any) => (k: any) => boolean;
export declare function hashfy(arr: any): {};
export declare function merge<T1 extends object, T2 extends object>(a: T1 | null, b: T2 | null): T1 & T2;
export declare const defer: ((cb: any) => Promise<void>) | typeof setTimeout;
