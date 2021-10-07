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
    const TRACKING_SET_KEY: string = "TrackingSet";


    var CheckIn = function (args) : string {
        
        var GetUserRODataReq: GetUserDataRequest = {
            PlayFabId: currentPlayerId,
            Keys: [TRACKING_SET_KEY]
        };

        var roDataRes: GetUserDataResult = server.GetUserReadOnlyData(GetUserRODataReq);
        var trackingSet = { };

        if (roDataRes.Data.hasOwnProperty(TRACKING_SET_KEY)) {
            trackingSet = JSON.parse(roDataRes.Data[TRACKING_SET_KEY].Value);
        }
        else {
            // 추적하는 데이터가 없는 경우
        }

        //if (Date.now() > parseInt(trackingSet["NEXT_GRANT"])) {
        //    var GetTitleDataRequest: GetTitleDataRequest = {
        //        Keys: ["TAB"]
        //    };

        //    var GetTitleDataResult: GetTitleDataResult = server.GetTitleData(GetTitleDataRequest);
        //    log.info("Your consecutive login streak increased to: " + tracker[TRACKER_LOGIN_STREAK]);
        //    UpdateTrackerData(tracker);

        //    // ---
        //    if (!GetTitleDataResult.Data.hasOwnProperty("TAB")) {
        //        log.error("Rewards table could not be found. No rewards will be given. Exiting...");
        //        return JSON.stringify([]);
        //    }
        //}

        return JSON.stringify([]);
    }

    var GetFlag = function (): Array<boolean>{

        return [];
    }

    var ResetTracker = function (): string {
        var reset = {};
        reset["LOGIN_STACK"] = 1;

        var dateObj = new Date(Date.now());
        dateObj.setDate(dateObj.getDate() + 1);

        reset["NEXT"] = dateObj.getTime();

        return JSON.stringify(reset);
    }

    function UpdateTrackerData(data): void {
        var UpdateUserReadOnlyDataRequest: UpdateUserDataRequest = {
            PlayFabId: currentPlayerId,
            Data: {}
        };

        UpdateUserReadOnlyDataRequest.Data[TRACKING_SET_KEY] = JSON.stringify(data);

        server.UpdateUserReadOnlyData(UpdateUserReadOnlyDataRequest);
    }
}