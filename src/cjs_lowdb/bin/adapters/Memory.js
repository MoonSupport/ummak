"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
class Memory {
    #data = null;
    read() {
        return Promise.resolve(this.#data);
    }
    write(obj) {
        this.#data = obj;
        return Promise.resolve();
    }
}
exports.Memory = Memory;
