/** 유저의 지역화 시간을 반환하는 유틸리티 함수 */
declare var GetUserLocalizedTimeNow: () => Date;

/** 유저의 지역화 시간에서 마지막으로 로그인 날과의 차이 */
declare var GetUserDiffDaysFromLastLogin: () => number;

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

/** 유저에 맞는 유저 지역화 데이터 획득 */
declare var GetUserLocalizedCountryData: () => LocalizedCountryData;

interface ClientCheckInData {
    LocalizedType: LocalizedCountryCode
}

interface LoginTracking {
    PrevLastLogin: Date,
    LastLogin: Date,
    TotalLoginCount: number,
    ContinuousLoginCount: number
}

interface CheckInResult {
    Code: number,
    Message: string,
    FirstLogin: boolean
}

type WeeklyRewardCoins = Array<number>;
type WeeklyRewardCoinsTracking = Array<boolean>;

interface WeeklyRewardCoinState {
    WeeklyRewardCoins: WeeklyRewardCoins,
    WeeklyRewardCoinsTracking: WeeklyRewardCoinsTracking
}

interface TakeTodayRewardCoinResult {
    Code: number,
    Message: string,
    TotalCoin?: number
}