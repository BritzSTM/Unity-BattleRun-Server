# TitleDatas.json의 구조를 설명하기 위한 마크업 파일

## LocalizedCountry
- 지역화된 서비스를 제공하기 위한 데이터들의 집합
- 지역화 코드는 PlayFab CountryCode와 동일
- 만약 이 지역화 데이터가 없으면 UTC 0기준으로 처리

## WeeklyRewardCoins
- 주간 접속보상 코인의 수를 정의
- 숫자 배열이며 [0, 6]의 범위를 가진다.
- 0부터 일요일로 가정한다. 6은 토요일이다.