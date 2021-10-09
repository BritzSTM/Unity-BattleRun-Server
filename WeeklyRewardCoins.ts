namespace WeeklyRewardCoins
{
    // alias
    import GetUserDataRequest = PlayFabServerModels.GetUserDataRequest;
    import GetUserDataResult = PlayFabServerModels.GetUserDataResult;
    import UpdateUserDataRequest = PlayFabServerModels.UpdateUserDataRequest;
    import UpdateUserDataResult = PlayFabServerModels.UpdateUserDataResult;
    import GetTitleDataRequest = PlayFabServerModels.GetTitleDataRequest;
    import GetTitleDataResult = PlayFabServerModels.GetTitleDataResult;

    // constants
    const WEEKLY_REWARD_COINS_KEY: string = "WeeklyRewardCoins";
    const WEEKLY_REWARD_COIN_TRACKING_KEY: string = "WeeklyRewardCoinsTracking";

    // 주간 코인보상 획득 
    export var GetWeeklyRewardCoins = function (): WeeklyRewardCoins {
        var getTitleDataReq: GetTitleDataRequest = {
            Keys: [WEEKLY_REWARD_COINS_KEY]
        };

        var titleDataRes: GetTitleDataResult = server.GetTitleData(getTitleDataReq);
        if (!titleDataRes.Data.hasOwnProperty(WEEKLY_REWARD_COINS_KEY)) {
            return new Array<number>(7).fill(0);
        }

        var table: WeeklyRewardCoins = JSON.parse(titleDataRes.Data[WEEKLY_REWARD_COINS_KEY]);

        return (table.length == 7) ? table : new Array<number>(7).fill(0);
    }

    var UpdateUserWeeklyRewardCoinsTracking = function (trackingData: WeeklyRewardCoinsTracking): void {
        var updateUserRODataReq: UpdateUserDataRequest = {
            PlayFabId: currentPlayerId,
            Data: {},
            Permission: "Public"
        };

        updateUserRODataReq.Data[WEEKLY_REWARD_COIN_TRACKING_KEY] = JSON.stringify(trackingData);
        server.UpdateUserReadOnlyData(updateUserRODataReq);
    }

    // 주간 코인보상 획득 추적 획득
    export var GetUserWeeklyRewardCoinsTracking = function (): WeeklyRewardCoinsTracking {
        var getUserRODataReq: GetUserDataRequest = {
            PlayFabId: currentPlayerId,
            Keys: [WEEKLY_REWARD_COIN_TRACKING_KEY]
        };

        var userRODataRes: GetUserDataResult = server.GetUserReadOnlyData(getUserRODataReq);

        // 주간 코인보상 추적목록이 없다면 생성
        var trackingData: WeeklyRewardCoinsTracking;
        if (!userRODataRes.Data.hasOwnProperty(WEEKLY_REWARD_COIN_TRACKING_KEY)) {
            trackingData = new Array<boolean>(7).fill(false);
            UpdateUserWeeklyRewardCoinsTracking(trackingData);
        }
        else {
            trackingData = JSON.parse(userRODataRes.Data[WEEKLY_REWARD_COIN_TRACKING_KEY].Value);
        }

        return trackingData;
    }
}

handlers["TestCoins"] = function () {
    return {
        WeeklyRewardCoins: WeeklyRewardCoins.GetWeeklyRewardCoins(),
        UserTracking: WeeklyRewardCoins.GetUserWeeklyRewardCoinsTracking()
    };
}