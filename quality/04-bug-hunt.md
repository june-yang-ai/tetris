# 단계 4 — /bug-hunt, /refactor-safe

**일시**: 2026-06-16  
**결과**: 통과

## 고위험 버그 점검

| 항목 | 상태 | 조치 |
|------|------|------|
| 회전 벽 관통 | 해결 | SRS 킥 테이블 적용 |
| lock → clear → spawn 순서 | 해결 | `lockPiece()` 내 순서 고정 |
| 키 반복·게임오버 입력 | 해결 | 상태별 early return |
| DOM 깜빡임 | 해결 | 셀 재사용, className만 갱신 |
| 타이머 누적 오류 | 해결 | deltaTime 기반 dropCounter |

## /refactor-safe 변경

- 매직 넘버 → `CONFIG` 객체
- `ensureGridCells` / `updateGridCells` 헬퍼로 보드·넥스트 렌더 통합
- `GAME_STATE` enum (`playing` | `paused` | `game_over`)

## 기능 회귀

- 렌더링·조작·점수 동작 변경 없음 확인
