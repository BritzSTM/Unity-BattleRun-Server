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