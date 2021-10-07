var Login;
(function (Login) {
    const LOGIN_TRACKING_KEY = "LOGIN_TRACKING";
    var CreateLoginTrackingDataAndToJson = function () {
        var ltData = {
            TotalLoginCount: 1,
            ContinuousLoginCount: 1
        };
        return JSON.stringify(ltData);
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
    Login.CheckIn = function (arg) {
        var GetUserRODataReq = {
            PlayFabId: currentPlayerId,
            Keys: [LOGIN_TRACKING_KEY]
        };
        var loginRes = { FirstLogin: false };
        var userRODataRes = server.GetUserReadOnlyData(GetUserRODataReq);
        if (!userRODataRes.Data.hasOwnProperty(LOGIN_TRACKING_KEY)) {
            var ltData = CreateLoginTrackingDataAndToJson();
            UpdateLoginTrackingData(ltData);
            loginRes.FirstLogin = true;
            return loginRes;
        }
        return loginRes;
    };
})(Login || (Login = {}));
handlers["Login"] = Login.CheckIn;
//# sourceMappingURL=Login.js.map