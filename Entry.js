var Achivements;
(function (Achivements) {
    Achivements._testAddAchivements = function () {
        let formated = "0".repeat(1024);
        var updateUserDataResult = server.UpdateUserReadOnlyData({
            PlayFabId: currentPlayerId,
            Permission: "Public",
            Data: {
                "_A1": formated
            }
        });
    };
})(Achivements || (Achivements = {}));
handlers["_testAddAchivements"] = Achivements._testAddAchivements;
//# sourceMappingURL=Entry.js.map