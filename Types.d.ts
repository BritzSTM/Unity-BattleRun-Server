interface LoginTracking {
    TotalLoginCount: number,
    ContinuousLoginCount: number
}

interface LoginResult {
    FirstLogin: boolean
}

interface LoginRewardTracking {
    WeeklyRewardCoins?: Array<boolean>
}