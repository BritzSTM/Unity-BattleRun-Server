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
    const LOCALIZED_COUNTRY_KEY: string = "LocalizedCountry";

    var CreateLoginTrackingData = function (): LoginTracking {
        var ltData: LoginTracking = {
            PrevLastLogin: GetUserLocalizedTimeNow(),
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
            Permission: "Public"
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

    var IsValidClientCheckInData = function (data: ClientCheckInData): boolean {
        if (!data.hasOwnProperty("LocalizedType"))
            return false;

        return true;
    }

    var GetUserLoginTrackingDataOrNull = function (): LoginTracking {
        var GetUserRODataReq: GetUserDataRequest = {
            PlayFabId: currentPlayerId,
            Keys: [LOGIN_TRACKING_KEY]
        };

        var userRODataRes: GetUserDataResult = server.GetUserReadOnlyData(GetUserRODataReq);
        if (!userRODataRes.Data.hasOwnProperty(LOGIN_TRACKING_KEY)) {
            return null;
        }

        return JSON.parse(userRODataRes.Data[LOGIN_TRACKING_KEY].Value);
    }

    export var GetUserDiffDaysFromLastLogin = function (): number {
        var trackingData: LoginTracking = GetUserLoginTrackingDataOrNull();
        if (trackingData == null)
            throw "Login tracking data not found.";
        
        return GetDiffDaysFromLastLogin(trackingData);
    }

    var UpdateUserLocalizedCountry = function (checkInData: ClientCheckInData): void {
        var updateUserInternalDataReq: UpdateUserDataRequest = {
            PlayFabId: currentPlayerId,
            Data: {},
            Permission: "Private"
        }
        updateUserInternalDataReq.Data[LOCALIZED_COUNTRY_KEY] = JSON.stringify(checkInData.LocalizedType);

        server.UpdateUserInternalData(updateUserInternalDataReq);
    }

    var GetUserLocalizedCountry = function (): LocalizedCountryCode {
        var updateUserInternalDataReq: GetUserDataRequest = {
            PlayFabId: currentPlayerId,
            Keys: [LOCALIZED_COUNTRY_KEY]
        };

        var userInternalDataRes: GetUserDataResult = server.GetUserInternalData(updateUserInternalDataReq);

        var lc: LocalizedCountryCode;
        if (!userInternalDataRes.Data.hasOwnProperty(LOCALIZED_COUNTRY_KEY))
            lc = "GLOBAL";
        else
            lc = JSON.parse(userInternalDataRes.Data[LOCALIZED_COUNTRY_KEY].Value);

        return lc;
    }

    export var CheckIn = function (checkInData: ClientCheckInData): CheckInResult {
        if (!IsValidClientCheckInData(checkInData)) {
            return { Code: -1, Message: "Submitted invalid CheckIn data.", FirstLogin: false };
        }

        // 첫 체크인 때 클라이언트 버전을 결정함
        // 또한 이미 있는 계정에 다른 지역화 버전을 가지고 체크인을 시도할 경우 실패로 간주
        var loginTrackingData: LoginTracking = GetUserLoginTrackingDataOrNull();
        if (loginTrackingData == null) {
            UpdateUserLocalizedCountry(checkInData); // 지역화 관련 데이터를 먼저 업데이트 해야함

            var ltData = CreateLoginTrackingData();
            UpdateLoginTrackingData(ltData);

            var checkInRes: CheckInResult = { Code: 0, Message: "Succeed login.", FirstLogin: true };
            server.WritePlayerEvent({
                PlayFabId: currentPlayerId,
                EventName: "checkin_first_time",
                Body: { ClientCheckInData: checkInData }
            });

            return checkInRes;
        }

        // 이전에 로그인한 지역화 버전과 현재 제출한 지역화 버전 일치성 확인
        var userLC: LocalizedCountryCode = GetUserLocalizedCountry();
        if (userLC != checkInData.LocalizedType)
            return { Code: -2, Message: "Different from previous UserLocalizedCountry.", FirstLogin: false };

        // 로그인 추적 데이터 업데이트
        var diffDay = GetDiffDaysFromLastLogin(loginTrackingData);
        if (diffDay >= 1.0) {
            ++loginTrackingData.TotalLoginCount;

            if (diffDay < 2.0)
                ++loginTrackingData.ContinuousLoginCount;
            else
                loginTrackingData.ContinuousLoginCount = 1;
        }
        loginTrackingData.PrevLastLogin = loginTrackingData.LastLogin;
        loginTrackingData.LastLogin = GetUserLocalizedTimeNow();
        UpdateLoginTrackingData(loginTrackingData);
                
        var checkInRes: CheckInResult = { Code: 0, Message: "Succeed login.", FirstLogin: false };
        server.WritePlayerEvent({
            PlayFabId: currentPlayerId,
            EventName: "checkin",
            Body: { ClientCheckInData: checkInData }
        });

        return checkInRes;
    }
}

var GetUserDiffDaysFromLastLogin = Login.GetUserDiffDaysFromLastLogin;
handlers["CheckInUser"] = Login.CheckIn;