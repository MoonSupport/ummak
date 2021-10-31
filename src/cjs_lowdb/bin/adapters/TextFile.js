"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextFile = void 0;
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const steno_1 = require("../steno");
class TextFile {
    #filename;
    #writer;
    constructor(filename) {
        this.#filename = filename;
        this.#writer = new steno_1.Writer(filename);
    }
    async read() {
        let data;
        try {
            data = await fs_1.default.promises.readFile(this.#filename, 'utf-8');
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                return null;
            }
            throw e;
        }
        return data;
    }
    write(str) {
        return this.#writer.write(str);
    }
}
exports.TextFile = TextFile;
