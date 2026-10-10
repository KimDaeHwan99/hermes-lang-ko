# hermes-lang-ko

**Hermes Desktop 한국어 언어팩.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

English: [README.md](./README.md)

Hermes 에는 이미 CLI·메시징 게이트웨이(`locales/ko.yaml`)와 TUI(`ko.tui.yaml`) 한국어가 들어 있습니다. 한국어가 없는 곳은 Desktop 앱 하나입니다. 이 팩은 그 빈자리만 `locales/ko.desktop.yaml` 로 채우고, 나머지는 Hermes 에 내장된 한국어에 맡깁니다.

코드 없이 YAML 파일 두 개와 `plugin.yaml` 로만 이뤄진 언어팩입니다. Hermes 백엔드가 `i18n.catalog` 로 Desktop 에 문구를 넘겨 주고, Desktop 은 이를 내장 영어 문구 위에 덮어씁니다. 팩에 없는 문구는 영어로 남습니다.

## 요구 사항

- 백엔드와 Desktop 앱 모두 Hermes Agent 0.22 이상. 언어팩 기능(`provides_locales`)은 hermes-agent #126296 에서 들어왔고, 이전 버전은 이 팩을 건너뜁니다.

## 설치

### 방법 A — `hermes plugins install`

```bash
hermes plugins install hermes-lang-ko                # 플러그인 카탈로그 등재 후
hermes plugins install dandacompany/hermes-lang-ko   # 이 저장소에서 바로
hermes config set display.language ko
```

Desktop(그리고 실행 중인 게이트웨이·TUI)을 다시 시작하면 Desktop 언어 선택에 **한국어** 가 보입니다.

플러그인은 프로필마다 따로 설치됩니다. Desktop 백엔드가 쓰는 프로필에 설치하거나 `-p <프로필>` 을 붙이세요.

### 방법 B — 플러그인 없이 개인 덮어쓰기

`locales/ko.desktop.yaml` 을 `<HERMES_HOME>/locales/ko.desktop.yaml` 로 복사합니다. 둘 다 있으면 플러그인 쪽이 우선합니다.

### 확인

```bash
hermes plugins list                  # hermes-lang-ko, enabled
hermes config get display.language   # ko
```

## 번역 범위

| 화면 | 출처 | 상태 |
| --- | --- | --- |
| CLI·게이트웨이 응답·승인 프롬프트 | 내장 `locales/ko.yaml` | hermes-agent 에서 관리 |
| TUI | 내장 `locales/ko.tui.yaml` | hermes-agent 에서 관리 |
| Desktop | 이 팩 `locales/ko.desktop.yaml` | 4,987개 키 중 3,929개(79%) |

영어와 같은 값은 일부러 넣지 않았습니다. 번역되지 않은 문구가 낡은 사본에 묶이지 않고 영어 카탈로그로 자연스럽게 넘어가게 하려는 것입니다. 영어 값이 함수인 Desktop 문구는 언어팩 규약대로 위치 자리표시자 문자열(`"{0}분 전"`)로 적습니다.

`locales/ko.yaml` 은 일부러 비워 두었습니다. 내장 카탈로그가 이미 채우고 있고, 검증기가 파일의 존재만 요구합니다.

## 이 플러그인이 하는 일과 하지 않는 일

- Python·JavaScript·네트워크 접속·셸 명령·백그라운드 프로세스·자격 증명 저장 모두 없습니다.
- 팩을 등록해도 `display.language` 는 바뀌지 않습니다. `hermes config set display.language ko` 로 직접 켭니다.
- 설치 스캐너가 `sudo` 비밀번호를 언급하거나 공식 한 줄 설치 명령을 보여 주는 화면 문구 몇 개를 `caution` 으로 표시합니다. 실행되는 내용이 아니라 영어 원문과 같은 뜻의 화면 문구입니다.

## 카탈로그 다시 만들기

```bash
node tools/convert.mjs \
  --src <src/i18n/ko.ts 가 있는 hermes-agent 체크아웃> \
  --keys <대상 hermes-agent>/locales/_keys.desktop.json \
  --esbuild-root <node_modules 가 있는 hermes-agent 체크아웃>
hermes plugins validate .
```

## hermes-agent #40716 과의 관계

번역은 [@dalgme](https://github.com/dalgme) 와 기여자들이 [NousResearch/hermes-agent#40716](https://github.com/NousResearch/hermes-agent/pull/40716) 에서 제안한 Desktop 한국어에서 왔습니다. 이 팩은 그 작업을 언어팩 방식으로 쓸 수 있게 한 것이고, PR 을 대신하지 않습니다. Desktop 에 한국어가 내장되면 아직 빠진 문구만 남기거나 팩을 정리합니다.

## 출처

Desktop 한국어 문구: @dalgme 와 hermes-agent #40716 기여자, MIT 라이선스. [NOTICE](./NOTICE) 참조.

## 라이선스

[MIT](./LICENSE)

---
Built by [Dante Labs](https://dante-labs.com) · [YouTube @dante-labs](https://youtube.com/@dante-labs) · [dante@dante-labs.com](mailto:dante@dante-labs.com) · [Discord](https://discord.com/invite/rXyy5e9ujs) · [Buy Me a Coffee](https://buymeacoffee.com/dante.labs)
