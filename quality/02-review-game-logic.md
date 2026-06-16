# 단계 2 — /review-game-logic

**일시**: 2026-06-16  
**결과**: 통과

## 충돌 판정

- `collides(piece, board, offsetX, offsetY, rotation)` — 벽·바닥·고정 블록 검사
- 좌우 이동, 낙하, 회전 전 모두 충돌 검사 후 적용

## 경계값

| 케이스 | 처리 |
|--------|------|
| 좌/우 벽 | `x < 0` 또는 `x >= COLS` 시 이동 거부 |
| 바닥 | `y >= ROWS` 시 낙하 불가 → lock |
| 상단 음수 y | 스폰·회전 시 허용 (부분 노출) |
| I피스 양끝 | SRS `KICKS_I` 별도 테이블 적용 |
| O피스 | 회전 스킵 (대칭) |

## 회전 (SRS Wall Kick)

- JLSTZ: `KICKS_JLSTZ` 5단계 킥 시도
- I: `KICKS_I` 5단계 킥 시도
- 모든 킥 실패 시 원위치 유지

## 입력·루프

- `requestAnimationFrame` + `deltaTime` 누적 드롭
- 레벨별 `getDropInterval()` 감속
- 게임오버/일시정지 시 입력 early return

## 발견 사항

- 없음 (차단 이슈 없음)
