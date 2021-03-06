var WeeklyRewardCoins;
(function (WeeklyRewardCoins) {
    const WEEKLY_REWARD_COINS_KEY = "WeeklyRewardCoins";
    const WEEKLY_REWARD_COIN_TRACKING_KEY = "WeeklyRewardCoinsTracking";
    const WEEKLY_REWARD_COIN_TYPE = "CI";
    WeeklyRewardCoins.GetWeeklyRewardCoins = function () {
        var getTitleDataReq = {
            Keys: [WEEKLY_REWARD_COINS_KEY]
        };
        var titleDataRes = server.GetTitleData(getTitleDataReq);
        if (!titleDataRes.Data.hasOwnProperty(WEEKLY_REWARD_COINS_KEY)) {
            return new Array(7).fill(0);
        }
        var table = JSON.parse(titleDataRes.Data[WEEKLY_REWARD_COINS_KEY]);
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
        if (!userRODataRes.Data.hasOwnProperty(WEEKLY_REWARD_COIN_TRACKING_KEY) || GetUserDiffDaysFromLastLogin() >= 8) {
            trackingData = new Array(7).fill(false);
        }
        else {
            trackingData = JSON.parse(userRODataRes.Data[WEEKLY_REWARD_COIN_TRACKING_KEY].Value);
            var today = GetUserLocalizedTimeNow().getDay();
            for (var i = today; i < trackingData.length - 1; ++i) {
                if (trackingData[i + 1] == true) {
                    trackingData = new Array(7).fill(false);
                    break;
                }
            }
        }
        return trackingData;
    };
    WeeklyRewardCoins.GetWeeklyRewardCoinState = function () {
        return { WeeklyRewardCoins: WeeklyRewardCoins.GetWeeklyRewardCoins(), WeeklyRewardCoinsTracking: WeeklyRewardCoins.GetUserWeeklyRewardCoinsTracking() };
    };
    WeeklyRewardCoins.TakeTodayRewardCoin = function () {
        var userTrackingData = WeeklyRewardCoins.GetUserWeeklyRewardCoinsTracking();
        var todayPos = GetUserLocalizedTimeNow().getDay();
        if (userTrackingData[todayPos]) {
            return { Code: 1, Message: "Already taken coin." };
        }
        var weeklyRewardCoins = WeeklyRewardCoins.GetWeeklyRewardCoins();
        var addUserCoinReq = {
            PlayFabId: currentPlayerId,
            VirtualCurrency: WEEKLY_REWARD_COIN_TYPE,
            Amount: weeklyRewardCoins[todayPos]
        };
        var addUserCoinRes = server.AddUserVirtualCurrency(addUserCoinReq);
        userTrackingData[todayPos] = true;
        UpdateUserWeeklyRewardCoinsTracking(userTrackingData);
        var takeRes = { Code: 0, Message: "Succeed taken reward coin.", TotalCoin: addUserCoinRes.Balance };
        server.WritePlayerEvent({
            PlayFabId: currentPlayerId,
            EventName: "taken_weekly_reward_coin",
            Body: { takeRes }
        });
        return takeRes;
    };
})(WeeklyRewardCoins || (WeeklyRewardCoins = {}));
handlers["GetWeeklyRewardCoins"] = WeeklyRewardCoins.GetWeeklyRewardCoins;
handlers["GetUserWeeklyRewardCoinsTracking"] = WeeklyRewardCoins.GetUserWeeklyRewardCoinsTracking;
handlers["GetWeeklyRewardCoinState"] = WeeklyRewardCoins.GetWeeklyRewardCoinState;
handlers["TakeTodayRewardCoin"] = WeeklyRewardCoins.TakeTodayRewardCoin;
//# sourceMappingURL=WeeklyRewardCoins.js.map