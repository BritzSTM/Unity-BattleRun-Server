# Unity-BattleRun-Server
- PlayFab에서 동작하는 CloudScript
- 내부에서 사용하는 Datas를 반드시 사전에 PlayFab에서 구성
- 각 데이터의 의미는 Datas의 md파일을 참고

## Script
- TypeScript 기반. 반드시 git에 결과물 반영시 트랜스한 결과물을 같이 반영할 것
- PlayFab에서 git의 변경사항을 자동으로 Hook하도록 관련 애드온을 설치할 것
- PlayFab에서 git에 변경사항이 발생하면 root에 존재하는 js파일들을 사전순으로 merge하여 하나의 스크립트 파일로 만들어 수입함
- 따라서 초기화 의존성이 발생한다면 주의 할 것
- 외부라이브러리도 사용불가
- 그렇기에 현재는 A.ts라는 특별한 의미를 가진 파일에 유틸리티나 기반함수들을 작성할 예정

## A.ts
- 현재 사용자 지역화 관련 모듈이 있음

## Entry.ts
- 트랜스파일의 시작점
- 어떤 코드도 작성하지 말 것

## Types.d.ts
- 모든 타입을 기술할 코드파일
- 반드시 공개 타입은 이 파일에 작성