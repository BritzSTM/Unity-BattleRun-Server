var WeeklyRewardCoins;
(function (WeeklyRewardCoins) {
    const WEEKLY_REWARD_COINS_KEY = "WeeklyRewardCoins";
    const WEEKLY_REWARD_COIN_TRACKING_KEY = "WeeklyRewardCoinsTracking";
    WeeklyRewardCoins.GetWeeklyRewardCoins = function () {
        var getTitleInternalDataReq = {
            Keys: [WEEKLY_REWARD_COINS_KEY]
        };
        var titleInternalDataRes = server.GetTitleInternalData(getTitleInternalDataReq);
        if (!titleInternalDataRes.Data.hasOwnProperty(WEEKLY_REWARD_COINS_KEY)) {
            return new Array(7).fill(0);
        }
        var table = JSON.parse(titleInternalDataRes.Data[WEEKLY_REWARD_COINS_KEY]);
        return (table.length == 7) ? table : new Array(7).fill(0);
    };
    var UpdateUserWeeklyRewardCoinsTracking = function (trackingData) {
        var updateUserRODataReq = {
            PlayFabId: currentPlayerId,
            Data: {},
            Permission: "Public"
        };
        updateUserRODataReq.Data[WEEKLY_REWARD_COIN_TRACKING_KEY] = JSON.stringify(trackingData);
        server.UpdateUserReadOnlyData(updateUserRODataReq);
    };
    WeeklyRewardCoins.GetUserWeeklyRewardCoinsTracking = function () {
        var getUserRODataReq = {
            PlayFabId: currentPlayerId,
            Keys: [WEEKLY_REWARD_COIN_TRACKING_KEY]
        };
        var userRODataRes = server.GetUserReadOnlyData(getUserRODataReq);
        var trackingData;
        if (!userRODataRes.Data.hasOwnProperty(WEEKLY_REWARD_COIN_TRACKING_KEY)) {
            trackingData = new Array(7).fill(false);
        }
        else {
            trackingData = JSON.parse(userRODataRes.Data[WEEKLY_REWARD_COIN_TRACKING_KEY].Value);
        }
        return trackingData;
    };
})(WeeklyRewardCoins || (WeeklyRewardCoins = {}));
handlers["TestCoins"] = function () {
    return {
        WeeklyRewardCoins: WeeklyRewardCoins.GetWeeklyRewardCoins(),
        UserTracking: WeeklyRewardCoins.GetUserWeeklyRewardCoinsTracking()
    };
};
//# sourceMappingURL=WeeklyRewardCoins.js.map