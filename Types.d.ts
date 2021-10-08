/** 유저의 지역화 시간을 반환하는 유틸리티 함수 */
declare var GetUserLocalizedTime: () => Date;

/** 유저가 사용하고 있는 지역화 클라이언트 타입 */
type LocalizedCountryCode = "GLOBAL" | "KR";

/** 문자열이 LocalizedCountryCode에 해당하는지 확인 */
declare var IsLocalizedCountryCode: (code: string) => boolean;

/** 유저가 사용하고 있는 지역화 클라이언트 코드를 반환.  */
declare var GetUserLocalizedCountryCode: () => LocalizedCountryCode;

interface LocalizedCountryData {
    TimeZoneOffset: number
}

/** 해당 지역화 코드에 맞는 설정 데이터 반환 */
declare var GetLocalizedCountryData: (code: LocalizedCountryCode) => LocalizedCountryData;

interface LoginTracking {
    TotalLoginCount: number,
    ContinuousLoginCount: number,
    LastLogin: Date
}

interface LoginResult {
    FirstLogin: boolean
}

interface LoginRewardTracking {
    WeeklyRewardCoins?: Array<boolean>
}
