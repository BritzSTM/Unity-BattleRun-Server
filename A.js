var A;
(function (A) {
    const LOCALIZED_COUNTRY_KEY = "LocalizedCountry";
    A.IsLocalizedCountryCode = function (code) {
        const table = ["GLOBAL", "KR"];
        return table.includes(code);
    };
    A.GetUserLocalizedCountryCode = function () {
        var getUserInternalDataReq = {
            PlayFabId: currentPlayerId,
            Keys: [LOCALIZED_COUNTRY_KEY]
        };
        var userInternalDataRes = server.GetUserInternalData(getUserInternalDataReq);
        if (!userInternalDataRes.Data.hasOwnProperty(LOCALIZED_COUNTRY_KEY)) {
            return "GLOBAL";
        }
        var lc = JSON.parse(userInternalDataRes.Data[LOCALIZED_COUNTRY_KEY].Value);
        return A.IsLocalizedCountryCode(lc) ? lc : "GLOBAL";
    };
    A.GetUserLocalizedTime = function () {
        var titleDataReq = { Keys: [LOCALIZED_COUNTRY_KEY] };
        var titleDataRes = server.GetTitleInternalData(titleDataReq);
        if (!titleDataRes.Data.hasOwnProperty(LOCALIZED_COUNTRY_KEY)) {
            return new Date();
        }
        return new Date();
    };
})(A || (A = {}));
var IsLocalizedCountryCode = A.IsLocalizedCountryCode;
var GetUserLocalizedCountryCode = A.GetUserLocalizedCountryCode;
var GetUserLocalizedTime = A.GetUserLocalizedTime;
handlers["IsLocalizedCountryCode"] = IsLocalizedCountryCode;
handlers["GetUserLocalizedTime"] = GetUserLocalizedTime;
//# sourceMappingURL=A.js.map