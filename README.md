# Tetris

바닐라 HTML/CSS/JavaScript로 만든 클래식 테트리스 게임입니다. 빌드 도구 없이 브라우저에서 바로 실행할 수 있습니다.

- **Play**: [https://june-yang-ai.github.io/tetris/](https://june-yang-ai.github.io/tetris/)
- **Repository**: [https://github.com/june-yang-ai/tetris](https://github.com/june-yang-ai/tetris)

## 실행 방법

### 로컬

1. 저장소를 클론하거나 ZIP으로 다운로드합니다.
   ```bash
   git clone https://github.com/june-yang-ai/tetris.git
   cd tetris
   ```
2. `index.html`을 브라우저에서 엽니다.

별도 설치·빌드 과정이 필요 없습니다.

## 조작법

### 키보드

| 키 | 동작 |
|----|------|
| ArrowLeft | 왼쪽 이동 |
| ArrowRight | 오른쪽 이동 |
| ArrowDown | 한 칸 빠르게 내리기 |
| ArrowUp | 회전 |
| Space | hard drop |
| P | 일시정지 / 재개 |
| R | 재시작 |

조작은 `canMove` 충돌 판정을 통과할 때만 적용됩니다. 회전 후 벽이나 블록과 충돌하면 회전이 취소됩니다.

### UI 버튼

| 버튼 | 동작 |
|------|------|
| 시작 | 게임 시작 (최초 READY 화면) |
| 재시작 | 플레이 중·게임오버 시 보드·점수 리셋 후 새 게임 (R키와 동일) |

## 구현 기능

- 10×20 보드 (CSS Grid)
- 7가지 테트로미노 (I, O, T, S, Z, J, L)
- SRS Wall Kick 회전
- `canMove` 기반 충돌 판정
- 자동 낙하 및 레벨별 속도 증가
- 다음 블록 미리보기
- 라인 삭제 및 점수 (NES 스타일: 100/300/500/800 × level)
- 시작·재시작 버튼 (READY 상태)
- 게임 오버 오버레이 및 재시작
- 일시정지 (P키)

## 품질 점검 방법

단계별 품질 게이트는 [`.cursor/commands/`](.cursor/commands/) 폴더의 Cursor Command로 실행합니다.

| Command | 확인 내용 |
|---------|-----------|
| `/review-structure` | 파일 구조, 역할 분리, 실행 가능성 |
| `/code-review` | DOM 구조, 렌더 함수, 가독성 |
| `/review-game-logic` | 충돌 판정, 경계값, 회전 오류 |
| `/qa-playtest` | 시나리오별 기대 결과 |
| `/bug-hunt` | 고위험 버그, 리팩토링 |
| `/release-check` | 파일 연결, 배포 준비 |

Cursor 채팅에서 위 Command를 입력하면 해당 점검을 수행할 수 있습니다.

## GitHub Pages 배포 방법

이 저장소는 GitHub Actions로 Pages를 배포합니다 (`.github/workflows/pages.yml`).

### 최초 설정 (1회)

1. 코드를 `main` 브랜치에 push합니다.
2. [저장소 Settings → Pages](https://github.com/june-yang-ai/tetris/settings/pages)로 이동합니다.
3. **Build and deployment** → Source: **GitHub Actions**를 선택합니다.
4. [Actions](https://github.com/june-yang-ai/tetris/actions) 탭에서 `Deploy GitHub Pages` 워크플로가 성공했는지 확인합니다.

### 이후 배포

`main` 브랜치에 push할 때마다 자동으로 재배포됩니다.

### 배포 확인

- URL: `https://june-yang-ai.github.io/tetris/`
- 게임 보드 표시, **시작** 버튼 동작, 콘솔 에러 없음을 확인합니다.

## 파일 구조

```
tetris/
├── index.html
├── style.css
├── script.js
├── README.md
├── .gitignore
├── .github/workflows/pages.yml
└── .cursor/commands/    # 품질 점검 Cursor Commands
```

## 라이선스

MIT
