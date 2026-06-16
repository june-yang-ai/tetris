# 단계 2 — /review-game-logic

**일시**: 2026-06-16 (재검토)  
**결과**: 조건부 통과 (차단 이슈 없음, 경미 이슈 3건)

## 충돌 판정

- `canMove(piece, dx, dy, matrix)` — 이동 후 좌표가 유효하면 `true`
- `tryMove` / `rotatePiece`(testPiece) / `spawnPiece` 모두 `canMove` 경유
- 고정: `lockPiece()` → `merge` → `clearLines` → `spawnPiece` 순서

## 경계값

| 케이스 | 처리 | 결과 |
|--------|------|------|
| 좌/우 벽 | `nextX < 0` 또는 `nextX >= COLS` | PASS |
| 바닥 | `nextY >= ROWS` → 이동 불가 → lock | PASS |
| 상단 음수 y | `nextY < 0` 허용, matrix 미검사 | PASS |
| I피스 양끝 | `KICKS_I` 5단계 킥 | PASS |
| O피스 | 회전 early return | PASS |
| 스폰 겹침 | `!canMove(0,0)` → GAME_OVER | PASS |

## 회전 (SRS Wall Kick)

- JLSTZ / I 별도 킥 테이블, `testPiece` + `canMove(testPiece, kx, ky, board)`
- 모든 킥 실패 시 원위치 유지

## 입력·루프

- `requestAnimationFrame` + `deltaTime` 누적 (`dropCounter`)
- `getDropInterval()` 레벨별 감속
- GAME_OVER / PAUSED 시 입력 차단

## 발견 사항

| 심각도 | 이슈 | 권장 |
|--------|------|------|
| 낮음 | 긴 탭 비활성 후 `delta` 급증 시 중력 1회만 처리 | `delta` 상한 캡 (선택) |
| 낮음 | `softDrop` + `tick` 동시 프레임 이중 낙하 가능 | lock 직후 `dropCounter` 리셋 유지 (현재 부분 완화) |
| 낮음 | GAME_OVER 시 겹친 스폰 피스 미렌더 | 의도된 동작, UX 개선 여지 |
