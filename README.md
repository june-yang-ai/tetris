# Tetris

브라우저에서 실행되는 클래식 테트리스 게임입니다.

**Play**: [https://june-yang-ai.github.io/tetris/](https://june-yang-ai.github.io/tetris/)

## 로컬 실행

1. 저장소를 클론하거나 파일을 다운로드합니다.
2. `index.html`을 브라우저에서 엽니다.

빌드 도구 없이 바로 실행됩니다.

## 조작법

| 키 | 동작 |
|----|------|
| ← → | 좌우 이동 |
| ↑ | 시계 방향 회전 |
| ↓ | 소프트 드롭 (+1점/칸) |
| Space | 하드 드롭 (+2점/칸) |
| P | 일시정지 / 재개 |
| R | 재시작 |

## 기능

- 10×20 보드 (CSS Grid)
- 7가지 테트로미노 (I, O, T, S, Z, J, L)
- SRS Wall Kick 회전
- 다음 블록 미리보기
- 라인 삭제 및 점수 (NES 스타일)
- 레벨 시스템 (10줄마다 레벨 업, 속도 증가)
- 게임 오버 및 재시작
- 일시정지

## 파일 구조

```
tetris/
├── index.html      # 게임 페이지
├── style.css       # 스타일
├── script.js       # 게임 로직
├── README.md
└── quality/        # 품질 점검 기록
    ├── 00-review-structure.md
    ├── 01-code-review.md
    ├── 02-review-game-logic.md
    ├── 03-qa-playtest.md
    ├── 04-bug-hunt.md
    └── 05-release-check.md
```

## 품질 점검

단계별 품질 게이트 결과는 [`quality/`](quality/) 폴더에서 확인할 수 있습니다.

## 라이선스

MIT
