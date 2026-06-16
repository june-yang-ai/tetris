# 단계 1 — /code-review

**일시**: 2026-06-16  
**결과**: 통과

## DOM 구조

```
.game-container
└── .game-layout
    ├── .main-panel
    │   ├── #game-board (200 cells, data-row/col)
    │   ├── #game-over
    │   └── #paused
    └── .side-panel
        ├── #score, #level, #lines
        ├── #next-board (16 cells)
        └── .controls-help
```

## 렌더 함수 검토

| 함수 | 역할 | 상태 변경 |
|------|------|-----------|
| `drawPiece(board, piece)` | 표시용 2D 배열 생성 | 없음 (순수) |
| `renderBoard(display)` | 메인 보드 DOM 갱신 | DOM만 |
| `renderNext()` | 다음 블록 미리보기 | DOM만 |
| `ensureGridCells` / `updateGridCells` | 셀 생성·className 갱신 | DOM만 |

## 가독성

- 7가지 테트로미노 `PIECES` 객체에 4회전 상태 정의
- 색상은 CSS 클래스(`.I`~`.L`)로 일관 매핑
- 보드·넥스트 패널 공통 헬퍼로 중복 최소화

## 발견 사항

- 없음 (차단 이슈 없음)
