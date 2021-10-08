// 유저의 지역화 시간을 반환하는 유틸리티 함수
declare var GetUserLocalizedTime: () => Date;

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
