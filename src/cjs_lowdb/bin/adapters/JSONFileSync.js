"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONFileSync = void 0;
const TextFileSync_js_1 = require("./TextFileSync.js");
class JSONFileSync {
    #adapter;
    constructor(filename) {
        this.#adapter = new TextFileSync_js_1.TextFileSync(filename);
    }
    read() {
        const data = this.#adapter.read();
        if (data === null) {
            return null;
        }
        else {
            return JSON.parse(data);
        }
    }
    write(obj) {
        this.#adapter.write(JSON.stringify(obj, null, 2));
    }
}
exports.JSONFileSync = JSONFileSync;
