"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemorySync = void 0;
class MemorySync {
    #data = null;
    read() {
        return this.#data || null;
    }
    write(obj) {
        this.#data = obj;
    }
}
exports.MemorySync = MemorySync;
