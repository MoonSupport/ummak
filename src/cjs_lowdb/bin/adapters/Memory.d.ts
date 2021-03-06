import { Adapter } from '../Low.js';
export declare class Memory<T> implements Adapter<T> {
    #private;
    read(): Promise<T | null>;
    write(obj: T): Promise<void>;
}
//# sourceMappingURL=Memory.d.ts.map