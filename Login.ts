namespace Login {
    // alias
    import GetUserDataRequest = PlayFabServerModels.GetUserDataRequest;
    import GetUserDataResult = PlayFabServerModels.GetUserDataResult;
    import UpdateUserDataRequest = PlayFabServerModels.UpdateUserDataRequest;
    import UpdateUserDataResult = PlayFabServerModels.UpdateUserDataResult;
    import GetPlayerProfileRequest = PlayFabServerModels.GetPlayerProfileRequest;
    import GetPlayerProfileResult = PlayFabServerModels.GetPlayerProfileResult;
    import PlayerProfileViewConstraints = PlayFabServerModels.PlayerProfileViewConstraints;

    // constants
    const LOGIN_TRACKING_KEY: string = "LoginTracking";

    var CreateLoginTrackingData = function (): LoginTracking {
        var ltData: LoginTracking = {
            LastLogin: GetUserLocalizedTimeNow(),
            TotalLoginCount: 1,
            ContinuousLoginCount: 1,
        }

        return ltData;
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

    
    var GetDiffDaysFromLastLogin = function (trackingData: LoginTracking): number {

        var userDateNow = GetUserLocalizedTimeNow();
        userDateNow.setHours(0, 0, 0, 0);

        var userLastLoginDate = new Date(trackingData.LastLogin);
        userLastLoginDate.setHours(0, 0, 0, 0);

        var diffDay = (userDateNow.getTime() - userLastLoginDate.getTime()) / (1000 * 60 * 60 * 24);

        return diffDay;
    }

    export var CheckIn = function (arg): LoginResult {
        // 반드시 arg 에 LocalizedCountry 데이터가 들어 있어야함.
        var GetUserRODataReq: GetUserDataRequest = {
            PlayFabId: currentPlayerId,
            Keys: [LOGIN_TRACKING_KEY]
        }

        var loginRes: LoginResult = { FirstLogin: false }
        var userRODataRes: GetUserDataResult = server.GetUserReadOnlyData(GetUserRODataReq);

        // 첫 로그인
        if (!userRODataRes.Data.hasOwnProperty(LOGIN_TRACKING_KEY)) {
            var ltData = CreateLoginTrackingData();
            UpdateLoginTrackingData(ltData);
            loginRes.FirstLogin = true;

            server.WritePlayerEvent({
                PlayFabId: currentPlayerId,
                EventName: "login_check_in_first",
                Body: { TrackingData: trackingData }
            });

            return loginRes;
        }

        var trackingData: LoginTracking = JSON.parse(userRODataRes.Data[LOGIN_TRACKING_KEY].Value);
        var diffDay = GetDiffDaysFromLastLogin(trackingData);
        if (diffDay > 1.0) {
            ++trackingData.TotalLoginCount;

            if (diffDay <= 2.0)
                ++trackingData.ContinuousLoginCount;
            else
                trackingData.ContinuousLoginCount = 1;
        }


        trackingData.LastLogin = GetUserLocalizedTimeNow();
        UpdateLoginTrackingData(trackingData);

        server.WriteTitleEvent({
            EventName: "login_check_in",
            Body: {
                TrackingData: trackingData,
                DiffDay: diffDay
            }
        });

        GetUserLocalizedTimeNow();
        return loginRes;
    }
}
handlers["Login"] = Login.CheckIn;
