import BitSet from 'bitset';
var _testAddAchivements = function () {
    let bs = new BitSet("0".repeat(1024));
    bs.set(511, 1);
    let formated = ("0".repeat(1024) + bs.toString()).slice(-1024);
    var updateUserDataResult = server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            "_A1": formated
        }
    });
};
handlers["_testAddAchivements"] = _testAddAchivements;
//# sourceMappingURL=Entry.js.map