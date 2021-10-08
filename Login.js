var Login;
(function (Login) {
    const LOGIN_TRACKING_KEY = "LOGIN_TRACKING";
    var CreateLoginTrackingData = function () {
        var ltData = {
            LastLogin: new Date(),
            TotalLoginCount: 1,
            ContinuousLoginCount: 1,
        };
        return ltData;
    };
    var UpdateLoginTrackingData = function (data) {
        var updateUserRODataReq = {
            PlayFabId: currentPlayerId,
            Data: {},
            Permission: "Private"
        };
        updateUserRODataReq.Data[LOGIN_TRACKING_KEY] = JSON.stringify(data);
        server.UpdateUserReadOnlyData(updateUserRODataReq);
    };
    var GetDiffDaysFromLastLogin = function () {
        var pcs;
        pcs.ShowLastLogin = true;
        var getPlayerPFReq = {
            PlayFabId: currentPlayerId,
            ProfileConstraints: pcs
        };
        var profileRes = server.GetPlayerProfile(getPlayerPFReq);
        var lastLoginDate = new Date(profileRes.PlayerProfile.LastLogin).getTime();
        var diffDay = (Date.now() - lastLoginDate) / (1000 * 60 * 60 * 24);
        return diffDay;
    };
    Login.CheckIn = function (arg) {
        var GetUserRODataReq = {
            PlayFabId: currentPlayerId,
            Keys: [LOGIN_TRACKING_KEY]
        };
        var loginRes = { FirstLogin: false };
        var userRODataRes = server.GetUserReadOnlyData(GetUserRODataReq);
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
        var trackingData = JSON.parse(userRODataRes.Data[LOGIN_TRACKING_KEY].Value);
        var lastLoginDate = new Date(trackingData.LastLogin).getTime();
        var diffDay = (Date.now() - lastLoginDate) / (1000 * 60 * 60 * 24);
        trackingData.LastLogin = new Date();
        if (diffDay > 1.0) {
            ++trackingData.TotalLoginCount;
            if (diffDay <= 2.0)
                ++trackingData.ContinuousLoginCount;
            else
                trackingData.ContinuousLoginCount = 1;
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
    };
})(Login || (Login = {}));
handlers["Login"] = Login.CheckIn;
//# sourceMappingURL=Login.js.map