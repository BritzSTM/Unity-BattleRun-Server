/* 
 * 매우 특별한 파일
 * 
 * 현재 PlayFab에서는 파일을 사전수으로 규합하여 단일파일로 만든 후 업로드
 * 그래서 항상 이 파일은 규합된 파일의 최상단에 존재함
 * 필요한 기반 유틸리티 함수들을 여기서 정의할 것
 * 
 * 또한 네임스페이스는 특별히 __접두사를 붙임
 */
namespace __A
{
    /*
     * alias
     */
    import GetUserDataRequest = PlayFabServerModels.GetUserDataRequest;
    import GetUserDataResult = PlayFabServerModels.GetUserDataResult;
    import GetTitleDataRequest = PlayFabServerModels.GetTitleDataRequest;
    import GetTitleDataResult = PlayFabServerModels.GetTitleDataResult;
    import GetPlayerProfileRequest = PlayFabServerModels.GetPlayerProfileRequest;
    import GetPlayerProfileResult = PlayFabServerModels.GetPlayerProfileResult;

    /*
     * 지역화 관련 유틸리티 함수들
     */
    const LOCALIZED_COUNTRY_KEY: string = "LocalizedCountry";

    export var IsLocalizedCountryCode = function (code: string): boolean{
        const table = ["GLOBAL", "KR"];

        return table.includes(code);
    }

    export var GetUserLocalizedCountryCode = function (): LocalizedCountryCode {
        // UserInternalData에 존재. 없다면 무조건 글로벌 버전으로 취급
        var getUserInternalDataReq: GetUserDataRequest = {
            PlayFabId: currentPlayerId,
            Keys: [LOCALIZED_COUNTRY_KEY]
        };

        var userInternalDataRes: GetUserDataResult = server.GetUserInternalData(getUserInternalDataReq);
        if (!userInternalDataRes.Data.hasOwnProperty(LOCALIZED_COUNTRY_KEY)) {
            return "GLOBAL";
        }

        var lc = JSON.parse(userInternalDataRes.Data[LOCALIZED_COUNTRY_KEY].Value);

        return IsLocalizedCountryCode(lc) ? lc : "GLOBAL";
    }

    export var GetLocalizedCountryData = function(code: LocalizedCountryCode): LocalizedCountryData
    {
        // TItleInetrnalData에 존재
        var getTitleInternalDataReq: GetTitleDataRequest = { Keys: [LOCALIZED_COUNTRY_KEY] };
        var titleInternalDataRes: GetTitleDataResult = server.GetTitleInternalData(getTitleInternalDataReq);

        // 없다면 글로벌로 처리
        if (!titleInternalDataRes.Data.hasOwnProperty(LOCALIZED_COUNTRY_KEY)) {
            log.error("Not found LocalizedCountry data in title internal data. use global type.");
            return { TimeZoneOffset: 0 };
        }

        var lcs: { [key: string]: LocalizedCountryData} = JSON.parse(titleInternalDataRes.Data[LOCALIZED_COUNTRY_KEY]);

        return lcs.hasOwnProperty(code) ? lcs[code] : { TimeZoneOffset: 0 };
    }

    export var GetUserLocalizedCountryData = function (): LocalizedCountryData {
        var userLCC = GetUserLocalizedCountryCode();

        return GetLocalizedCountryData(userLCC);
    }

    export var GetUserLocalizedTime = function (): Date {
        var lcd: LocalizedCountryData = GetUserLocalizedCountryData();
        var utc = Date.now() + ((lcd.TimeZoneOffset * -1) * 60 * 1000);

        return new Date(utc);
    }
}

var IsLocalizedCountryCode = __A.IsLocalizedCountryCode;
var GetUserLocalizedCountryCode = __A.GetUserLocalizedCountryCode;
var GetLocalizedCountryData = __A.GetLocalizedCountryData;
var GetUserLocalizedCountryData = __A.GetUserLocalizedCountryData;
var GetUserLocalizedTime = __A.GetUserLocalizedTime;

handlers["TESTGetUserLocalizedTime"] = function () {
    return {
        Global: GetUserLocalizedTime()
    };
}