namespace Login {
    // alias
    import GetUserDataRequest = PlayFabServerModels.GetUserDataRequest;
    import GetUserDataResult = PlayFabServerModels.GetUserDataResult;
    import UpdateUserDataRequest = PlayFabServerModels.UpdateUserDataRequest;
    import UpdateUserDataResult = PlayFabServerModels.UpdateUserDataResult;

    const LOGIN_TRACKING_KEY: string = "LOGIN_TRACKING";

    var CreateLoginTrackingDataAndToJson = function (): string {
        var ltData: LoginTracking = {
            TotalLoginCount: 1,
            ContinuousLoginCount: 1
        }

        return JSON.stringify(ltData);
    }

    var UpdateLoginTrackingData = function (data): void {
        var updateUserRODataReq: UpdateUserDataRequest = {
            PlayFabId: currentPlayerId,
            Data: {},
            Permission: "Private"
        }
        updateUserRODataReq.Data[LOGIN_TRACKING_KEY] = JSON.stringify(data);

        server.UpdateUserReadOnlyData(updateUserRODataReq);
    }

    export var CheckIn = function (arg): LoginResult {
        var GetUserRODataReq: GetUserDataRequest = {
            PlayFabId: currentPlayerId,
            Keys: [LOGIN_TRACKING_KEY]
        }

        var loginRes: LoginResult = { FirstLogin: false }
        var userRODataRes: GetUserDataResult = server.GetUserReadOnlyData(GetUserRODataReq);

        if (!userRODataRes.Data.hasOwnProperty(LOGIN_TRACKING_KEY)) {
            var ltData = CreateLoginTrackingDataAndToJson();
            UpdateLoginTrackingData(ltData);
            loginRes.FirstLogin = true;

            return loginRes;
        }

        return loginRes;
    }
}
handlers["Login"] = Login.CheckIn;