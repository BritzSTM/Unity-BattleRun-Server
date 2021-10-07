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
    const LOGIN_TRACKING_KEY: string = "LOGIN_TRACKING";

    var CreateLoginTrackingData = function (): LoginTracking {
        var ltData: LoginTracking = {
            TotalLoginCount: 1,
            ContinuousLoginCount: 1
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

    var GetDiffDaysFromLastLogin = function (): number {
        var pcs: PlayerProfileViewConstraints;
        pcs.ShowLastLogin = true;

        var getPlayerPFReq: GetPlayerProfileRequest = {
            PlayFabId: currentPlayerId,
            ProfileConstraints: pcs
        }

        var profileRes = server.GetPlayerProfile(getPlayerPFReq);
        var lastLoginDate = new Date(profileRes.PlayerProfile.LastLogin).getTime();
        var diffDay = (Date.now() - lastLoginDate) / (1000 * 60 * 60 * 24);

        return diffDay;
    }

    export var CheckIn = function (arg): LoginResult {
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

            server.WriteTitleEvent({
                EventName: "login_check_in_first",
                Body: { TrackingData: trackingData }
            });

            return loginRes;
        }

        var trackingData: LoginTracking = JSON.parse(userRODataRes.Data[LOGIN_TRACKING_KEY].Value);
        var diffDay = GetDiffDaysFromLastLogin();
        if (diffDay > 1.0) {
            trackingData.ContinuousLoginCount = 1;
            ++trackingData.TotalLoginCount;
        }

        UpdateLoginTrackingData(trackingData);

        server.WriteTitleEvent({
            EventName: "login_check_in",
            Body: {
                TrackingData: trackingData,
                DiffDay: diffDay
            }
        });

        return loginRes;
    }
}
handlers["Login"] = Login.CheckIn;