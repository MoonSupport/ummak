"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextFileSync = void 0;
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
class TextFileSync {
    #tempFilename;
    #filename;
    constructor(filename) {
        this.#filename = filename;
        this.#tempFilename = path_1.default.join(path_1.default.dirname(filename), `.${path_1.default.basename(filename)}.tmp`);
    }
    read() {
        let data;
        try {
            data = fs_1.default.readFileSync(this.#filename, 'utf-8');
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
        fs_1.default.writeFileSync(this.#tempFilename, str);
        fs_1.default.renameSync(this.#tempFilename, this.#filename);
    }
}
exports.TextFileSync = TextFileSync;
