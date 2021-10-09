var Login;
(function (Login) {
    const LOGIN_TRACKING_KEY = "LoginTracking";
    const LOCALIZED_COUNTRY_KEY = "LocalizedCountry";
    var CreateLoginTrackingData = function () {
        var ltData = {
            LastLogin: GetUserLocalizedTimeNow(),
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
    var GetDiffDaysFromLastLogin = function (trackingData) {
        var userDateNow = GetUserLocalizedTimeNow();
        userDateNow.setHours(0, 0, 0, 0);
        var userLastLoginDate = new Date(trackingData.LastLogin);
        userLastLoginDate.setHours(0, 0, 0, 0);
        var diffDay = (userDateNow.getTime() - userLastLoginDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDay;
    };
    var IsValidClientCheckInData = function (data) {
        if (!data.hasOwnProperty("LocalizedType"))
            return false;
        return true;
    };
    var GetUserLoginTrackingDataOrNull = function () {
        var GetUserRODataReq = {
            PlayFabId: currentPlayerId,
            Keys: [LOGIN_TRACKING_KEY]
        };
        var userRODataRes = server.GetUserReadOnlyData(GetUserRODataReq);
        if (!userRODataRes.Data.hasOwnProperty(LOGIN_TRACKING_KEY)) {
            return null;
        }
        return JSON.parse(userRODataRes.Data[LOGIN_TRACKING_KEY].Value);
    };
    var UpdateUserLocalizeCountry = function (checkInData) {
        var updateUserRODataReq = {
            PlayFabId: currentPlayerId,
            Data: {},
            Permission: "Private"
        };
        updateUserRODataReq.Data[LOCALIZED_COUNTRY_KEY] = checkInData.LocalizedType;
        server.UpdateUserReadOnlyData(updateUserRODataReq);
    };
    var GetUserLocalizeCountry = function () {
        var getUserRODataReq = {
            PlayFabId: currentPlayerId,
            Keys: [LOCALIZED_COUNTRY_KEY]
        };
        var userRODataRes = server.GetUserReadOnlyData(getUserRODataReq);
        var lc;
        if (!userRODataRes.Data.hasOwnProperty(LOCALIZED_COUNTRY_KEY))
            lc = "GLOBAL";
        else
            lc = JSON.parse(userRODataRes.Data[LOCALIZED_COUNTRY_KEY].Value);
        return lc;
    };
    Login.CheckIn = function (checkInData) {
        if (!IsValidClientCheckInData(checkInData)) {
            return { Code: -1, Message: "Submitted invalid CheckIn data.", FirstLogin: false };
        }
        var loginTrackingData = GetUserLoginTrackingDataOrNull();
        if (loginTrackingData == null) {
            var ltData = CreateLoginTrackingData();
            UpdateLoginTrackingData(ltData);
            UpdateUserLocalizeCountry(checkInData);
            var checkInRes = { Code: 0, Message: "Succeed login.", FirstLogin: true };
            server.WritePlayerEvent({
                PlayFabId: currentPlayerId,
                EventName: "login_first_time",
                Body: { ClientCheckInData: checkInData }
            });
            return checkInRes;
        }
        var userLC = GetUserLocalizeCountry();
        if (userLC != checkInData.LocalizedType)
            return { Code: -2, Message: "Different from previous UserLocalizeCountry.", FirstLogin: false };
        var diffDay = GetDiffDaysFromLastLogin(loginTrackingData);
        if (diffDay >= 1.0) {
            ++loginTrackingData.TotalLoginCount;
            if (diffDay < 2.0)
                ++loginTrackingData.ContinuousLoginCount;
            else
                loginTrackingData.ContinuousLoginCount = 1;
        }
        loginTrackingData.LastLogin = GetUserLocalizedTimeNow();
        UpdateLoginTrackingData(loginTrackingData);
        var checkInRes = { Code: 0, Message: "Succeed login.", FirstLogin: false };
        server.WritePlayerEvent({
            PlayFabId: currentPlayerId,
            EventName: "login",
            Body: { ClientCheckInData: checkInData }
        });
        return checkInRes;
    };
})(Login || (Login = {}));
handlers["CheckInUser"] = Login.CheckIn;
//# sourceMappingURL=Login.js.map