namespace WeeklyRewardCoins
{
    // alias
    import GetUserDataRequest = PlayFabServerModels.GetUserDataRequest;
    import GetUserDataResult = PlayFabServerModels.GetUserDataResult;
    import UpdateUserDataRequest = PlayFabServerModels.UpdateUserDataRequest;
    import UpdateUserDataResult = PlayFabServerModels.UpdateUserDataResult;
    import GetTitleDataRequest = PlayFabServerModels.GetTitleDataRequest;
    import GetTitleDataResult = PlayFabServerModels.GetTitleDataResult;
    import AddUserVirtualCurrencyRequest = PlayFabServerModels.AddUserVirtualCurrencyRequest;
    import ModifyUserVirtualCurrencyResult = PlayFabServerModels.ModifyUserVirtualCurrencyResult;

    // constants
    const WEEKLY_REWARD_COINS_KEY: string = "WeeklyRewardCoins";
    const WEEKLY_REWARD_COIN_TRACKING_KEY: string = "WeeklyRewardCoinsTracking";
    const WEEKLY_REWARD_COIN_TYPE: string = "CI";

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

        // 추적 테이블의 주간 초기화 조건
        // 1. 주간 코인보상 추적목록이 없다면 생성
        // 2. 마지막으로 로그인한 날과의 차이가 8이상이면 테이블을 초기화
        // 3. 만약 추적 테이블에서 다음날 이후에도 추적한 데이터가 있다면 초기화
        var trackingData: WeeklyRewardCoinsTracking;
        if (!userRODataRes.Data.hasOwnProperty(WEEKLY_REWARD_COIN_TRACKING_KEY) || GetUserDiffDaysFromLastLogin() >= 8) {
            trackingData = new Array<boolean>(7).fill(false);
        }
        else {
            trackingData = JSON.parse(userRODataRes.Data[WEEKLY_REWARD_COIN_TRACKING_KEY].Value);
            
            var today: number = GetUserLocalizedTimeNow().getDay();
            for (var i = today; i < trackingData.length - 1; ++i) {
                if (trackingData[i + 1] == true) {
                    trackingData = new Array<boolean>(7).fill(false);
                    break;
                }
            }
        }

        return trackingData;
    }

    export var GetWeeklyRewardCoinState = function (): WeeklyRewardCoinState
    {
        return { WeeklyRewardCoins: GetWeeklyRewardCoins(), WeeklyRewardCoinsTracking: GetUserWeeklyRewardCoinsTracking() };
    }

    // 오늘의 보상 코인을 획득처리
    export var TakeTodayRewardCoin = function (): TakeTodayRewardCoinResult {
        var userTrackingData: WeeklyRewardCoinsTracking = GetUserWeeklyRewardCoinsTracking();
        var todayPos: number = GetUserLocalizedTimeNow().getDay();

        if (userTrackingData[todayPos]) {
            return { Code: 1, Message: "Already taken coin." };
        }

        var weeklyRewardCoins: WeeklyRewardCoins = GetWeeklyRewardCoins();
        var addUserCoinReq: AddUserVirtualCurrencyRequest = {
            PlayFabId: currentPlayerId,
            VirtualCurrency: WEEKLY_REWARD_COIN_TYPE,
            Amount: weeklyRewardCoins[todayPos]
        };

        var addUserCoinRes: ModifyUserVirtualCurrencyResult = server.AddUserVirtualCurrency(addUserCoinReq);
        userTrackingData[todayPos] = true;
        UpdateUserWeeklyRewardCoinsTracking(userTrackingData);

        var takeRes: TakeTodayRewardCoinResult = { Code: 0, Message: "Succeed taken reward coin.", TotalCoin: addUserCoinRes.Balance };
        server.WritePlayerEvent({
            PlayFabId: currentPlayerId,
            EventName: "taken_weekly_reward_coin",
            Body: { takeRes }
        });

        return takeRes;
    }
}

handlers["GetWeeklyRewardCoins"] = WeeklyRewardCoins.GetWeeklyRewardCoins;
handlers["GetUserWeeklyRewardCoinsTracking"] = WeeklyRewardCoins.GetUserWeeklyRewardCoinsTracking;
handlers["GetWeeklyRewardCoinState"] = WeeklyRewardCoins.GetWeeklyRewardCoinState;
handlers["TakeTodayRewardCoin"] = WeeklyRewardCoins.TakeTodayRewardCoin;