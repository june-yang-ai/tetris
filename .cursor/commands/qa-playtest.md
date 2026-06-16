# 단계 3 — /qa-playtest

**일시**: 2026-06-16 (재검토)  
**결과**: 통과  
**검증 방식**: 코드 경로 추적 + 점수/라인 삭제 로직 실행 검증

## 시나리오별 기대 결과

| # | 시나리오 | 기대 결과 | 결과 | 근거 |
|---|----------|-----------|------|------|
| 1 | 게임 시작 | 랜덤 피스 상단 스폰, 점수 0, 레벨 1 | PASS | `startGame()` → score/level/lines 초기화, `spawnPiece()` |
| 2 | 블록 착지 | 보드 고정, 다음 피스 스폰 | PASS | `lockPiece()` → `merge` → `spawnPiece()` |
| 3 | 1줄 완성 | 줄 삭제, score += 100×level, lines += 1 | PASS | `addLineScore(1)` 실행 검증: score=100 |
| 4 | Tetris(4줄) | 4줄 동시 삭제, 800×level 점수 | PASS | `addLineScore(4)` 실행 검증: score=800 |
| 5 | 하드 드롭 | 즉시 착지, 거리×2 점수 | PASS | `hardDrop()` while `tryMove` + `distance*2` |
| 6 | 스택 꼭대기 도달 | GAME OVER 오버레이, 입력 무시 | PASS | `spawnPiece` → `!canMove(0,0)` → `handleKey` early return |
| 7 | R키 재시작 | 보드/점수 리셋 | PASS | `resetGame()` → `startGame()` (오버레이 힌트 유지) |
| 8 | P키 일시정지 | PAUSED 오버레이, 낙하 정지 | PASS | `tick` PLAYING만 실행, 오버레이 토글 |

## 조작 시나리오 (추가)

| # | 시나리오 | 기대 결과 | 결과 |
|---|----------|-----------|------|
| 9 | ArrowLeft/Right | `canMove` 통과 시만 이동 | PASS |
| 10 | ArrowDown | 1칸 하강, 실패 시 lock | PASS |
| 11 | ArrowUp 벽/블록 | 회전 취소 (상태 불변) | PASS |
| 12 | Space | hard drop 후 lock | PASS |
| 13 | 키 중복 등록 | 재시작 후 입력 1회당 1동작 | PASS | `keyboardBound` 가드 |

## 점수·레벨

| 항목 | 규칙 | 검증 |
|------|------|------|
| ArrowDown | 1점/칸 (`softDrop`) | 코드 확인 |
| Space | 2점/칸 (`hardDrop`) | 5칸 → 10점 실행 검증 |
| 1/2/3/4줄 | 100/300/500/800 × level | 실행 검증 |
| 레벨 | 10줄마다 +1, `getDropInterval()` 감소 | 코드 확인 |

## 미해결·경미 사항

| 심각도 | 항목 | 비고 |
|--------|------|------|
| 낮음 | GAME_OVER 시 겹친 스폰 피스 미표시 | UX 이슈, 로직 정상 |
| 낮음 | README 조작법에서 P/R 제외, 오버레이엔 R/P 힌트 유지 | 기능은 동작 |

## 비고

- 브라우저 수동 플레이는 `index.html` 로컬 실행으로 재현 가능
- 차단 이슈 없음
