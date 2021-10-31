"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONFile = void 0;
const TextFile_js_1 = require("./TextFile.js");
class JSONFile {
    #adapter;
    constructor(filename) {
        this.#adapter = new TextFile_js_1.TextFile(filename);
    }
    async read() {
        const data = await this.#adapter.read();
        if (data === null) {
            return null;
        }
        else {
            return JSON.parse(data);
        }
    }
    write(obj) {
        return this.#adapter.write(JSON.stringify(obj, null, 2));
    }
}
exports.JSONFile = JSONFile;
