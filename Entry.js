var _testAddAchivements = function () {
    let formated = "0".repeat(1024);
    var updateUserDataResult = server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            "_A1": formated
        }
    });
};
handlers["_testAddAchivements"] = _testAddAchivements;
//# sourceMappingURL=Entry.js.map