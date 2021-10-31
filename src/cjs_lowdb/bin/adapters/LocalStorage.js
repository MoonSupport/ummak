"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
class LocalStorage {
    #key;
    constructor(key) {
        this.#key = key;
    }
    read() {
        const value = localStorage.getItem(this.#key);
        if (value === null) {
            return null;
        }
        return JSON.parse(value);
    }
    write(obj) {
        localStorage.setItem(this.#key, JSON.stringify(obj));
    }
}
exports.LocalStorage = LocalStorage;
