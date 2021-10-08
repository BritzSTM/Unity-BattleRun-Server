/* 
 * 매우 특별한 파일
 * 
 * 현재 PlayFab에서는 파일을 사전수으로 규합하여 단일파일로 만든 후 업로드
 * 그래서 항상 이 파일은 규합된 파일의 최상단에 존재함
 * 필요한 기반 유틸리티 함수들을 여기서 정의할 것
 */
namespace A
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
        // UserInternalData에 존재
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

    export var GetUserLocalizedTime = function (): Date {
        /*
         * 지역화된 시간을 반환하기 위한 함수. 지역 코드는 유저 프로파일에서 획득이 가능함
         * title internal data[LocalizedCountry]에 Key = Country, Value = JS TimeZoneOffset으로 존재
         * 만약 LocalizedCountry존재하지 않는다면 글로벌로 가정하고 서버 UTC를 반환
         */


        var titleDataReq: GetTitleDataRequest = { Keys: [LOCALIZED_COUNTRY_KEY] };

        var titleDataRes: GetTitleDataResult = server.GetTitleInternalData(titleDataReq);
        if (!titleDataRes.Data.hasOwnProperty(LOCALIZED_COUNTRY_KEY)) {
            return new Date();
        }
        // 540 * 60 * 1000 
        return new Date();
    }
}

var IsLocalizedCountryCode = A.IsLocalizedCountryCode;
var GetUserLocalizedCountryCode = A.GetUserLocalizedCountryCode;
var GetUserLocalizedTime = A.GetUserLocalizedTime;

handlers["IsLocalizedCountryCode"] = IsLocalizedCountryCode;
handlers["GetUserLocalizedTime"] = GetUserLocalizedTime;
