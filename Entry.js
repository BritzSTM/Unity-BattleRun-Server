"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitset_1 = require("bitset");
var tmp = async function () {
    let bs = new bitset_1.default("0".repeat(1024));
    bs.set(511, 1);
    let formated = ("0".repeat(1024) + bs.toString()).slice(-1024);
    console.log(formated);
    await new Promise(resolve => setTimeout(resolve, 5000));
};
tmp();
//# sourceMappingURL=Entry.js.map