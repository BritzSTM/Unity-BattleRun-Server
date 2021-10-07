var WeeklyRewardCoins;
(function (WeeklyRewardCoins) {
    const TRACKING_SET_KEY = "TrackingSet";
    var CheckIn = function (args) {
        var GetUserRODataReq = {
            PlayFabId: currentPlayerId,
            Keys: [TRACKING_SET_KEY]
        };
        var roDataRes = server.GetUserReadOnlyData(GetUserRODataReq);
        var trackingSet = {};
        if (roDataRes.Data.hasOwnProperty(TRACKING_SET_KEY)) {
            trackingSet = JSON.parse(roDataRes.Data[TRACKING_SET_KEY].Value);
        }
        else {
        }
        return JSON.stringify([]);
    };
    var GetFlag = function () {
        return [];
    };
    var ResetTracker = function () {
        var reset = {};
        reset["LOGIN_STACK"] = 1;
        var dateObj = new Date(Date.now());
        dateObj.setDate(dateObj.getDate() + 1);
        reset["NEXT"] = dateObj.getTime();
        return JSON.stringify(reset);
    };
    function UpdateTrackerData(data) {
        var UpdateUserReadOnlyDataRequest = {
            PlayFabId: currentPlayerId,
            Data: {}
        };
        UpdateUserReadOnlyDataRequest.Data[TRACKING_SET_KEY] = JSON.stringify(data);
        server.UpdateUserReadOnlyData(UpdateUserReadOnlyDataRequest);
    }
})(WeeklyRewardCoins || (WeeklyRewardCoins = {}));
//# sourceMappingURL=WeeklyRewardCoins.js.map