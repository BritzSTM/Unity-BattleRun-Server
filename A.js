var __A;
(function (__A) {
    const LOCALIZED_COUNTRY_KEY = "LocalizedCountry";
    __A.IsLocalizedCountryCode = function (code) {
        const table = ["GLOBAL", "KR"];
        return table.includes(code);
    };
    __A.GetUserLocalizedCountryCode = function () {
        var getUserInternalDataReq = {
            PlayFabId: currentPlayerId,
            Keys: [LOCALIZED_COUNTRY_KEY]
        };
        var userInternalDataRes = server.GetUserInternalData(getUserInternalDataReq);
        if (!userInternalDataRes.Data.hasOwnProperty(LOCALIZED_COUNTRY_KEY)) {
            return "GLOBAL";
        }
        var lc = JSON.parse(userInternalDataRes.Data[LOCALIZED_COUNTRY_KEY].Value);
        return __A.IsLocalizedCountryCode(lc) ? lc : "GLOBAL";
    };
    __A.GetLocalizedCountryData = function (code) {
        var getTitleInternalDataReq = { Keys: [LOCALIZED_COUNTRY_KEY] };
        var titleInternalDataRes = server.GetTitleInternalData(getTitleInternalDataReq);
        if (!titleInternalDataRes.Data.hasOwnProperty(LOCALIZED_COUNTRY_KEY)) {
            log.error("Not found LocalizedCountry data in title internal data. use global type.");
            return { TimeZoneOffset: 0 };
        }
        var lcs = JSON.parse(titleInternalDataRes.Data[LOCALIZED_COUNTRY_KEY]);
        return lcs.hasOwnProperty(code) ? lcs[code] : { TimeZoneOffset: 0 };
    };
    __A.GetUserLocalizedCountryData = function () {
        var userLCC = __A.GetUserLocalizedCountryCode();
        return __A.GetLocalizedCountryData(userLCC);
    };
    __A.GetUserLocalizedTime = function () {
        var lcd = __A.GetUserLocalizedCountryData();
        var utc = Date.now() + ((lcd.TimeZoneOffset * -1) * 60 * 1000);
        return new Date(utc);
    };
})(__A || (__A = {}));
var IsLocalizedCountryCode = __A.IsLocalizedCountryCode;
var GetUserLocalizedCountryCode = __A.GetUserLocalizedCountryCode;
var GetLocalizedCountryData = __A.GetLocalizedCountryData;
var GetUserLocalizedCountryData = __A.GetUserLocalizedCountryData;
var GetUserLocalizedTimeNow = __A.GetUserLocalizedTime;
//# sourceMappingURL=A.js.map