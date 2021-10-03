"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitset_1 = require("bitset");
var _testAddAchivements = function () {
    let bs = new bitset_1.default("0".repeat(1024));
    bs.set(511, 1);
    let formated = ("0".repeat(1024) + bs.toString()).slice(-1024);
    var updateUserDataResult = server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            "_A1": formated
        }
    });
};
//# sourceMappingURL=Entry.js.map