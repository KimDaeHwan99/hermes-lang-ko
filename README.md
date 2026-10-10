# hermes-lang-ko

**Korean language pack for Hermes Desktop.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

한국어 문서: [README.ko.md](./README.ko.md)

Hermes already ships Korean for the CLI and messaging gateway (`locales/ko.yaml`) and for the TUI (`ko.tui.yaml`). The Desktop app is the one surface without Korean. This pack fills only that gap with `locales/ko.desktop.yaml`, and leaves the bundled Korean catalogs in charge of everything else.

It is a manifest-only language pack: two YAML files and a `plugin.yaml`. The Hermes backend serves the strings to Desktop over `i18n.catalog`, where they are merged over the bundled English catalog. Any string the pack does not cover stays in English.

## Requirements

- Hermes Agent 0.21.6 or later, for both the backend and the Desktop app. Language packs (`provides_locales`) arrived in hermes-agent #126296; older versions skip the pack.

## Install

### Option A — `hermes plugins install`

```bash
hermes plugins install hermes-lang-ko          # once listed in the plugin catalog
hermes plugins install dandacompany/hermes-lang-ko   # directly from this repository
hermes config set display.language ko
```

Restart Desktop (and any running gateway or TUI) so it reloads the language list. Korean then appears as **한국어** in the Desktop language switcher.

Plugins are per profile. Install the pack in the profile your Desktop backend runs, or pass `-p <profile>`.

### Option B — personal overlay, no plugin

Copy `locales/ko.desktop.yaml` to `<HERMES_HOME>/locales/ko.desktop.yaml`. A plugin pack takes precedence over the overlay when both exist.

### Verify

```bash
hermes plugins list            # hermes-lang-ko, enabled
hermes config get display.language   # ko
```

## Coverage

| Surface | Source | Status |
| --- | --- | --- |
| CLI, gateway replies, approval prompts | bundled `locales/ko.yaml` | maintained in hermes-agent |
| TUI | bundled `locales/ko.tui.yaml` | maintained in hermes-agent |
| Desktop | this pack, `locales/ko.desktop.yaml` | 3,929 of 4,987 keys (79%) |

Values identical to English are deliberately left out, so untranslated strings fall back to the English catalog instead of being pinned to a stale copy. Desktop entries whose English value is a function are written as positional strings (`"{0}분 전"`), as the pack format requires.

`locales/ko.yaml` is intentionally empty: the bundled core catalog already covers it, and the validator requires the file to exist.

## What this plugin does and does not do

- No Python, no JavaScript, no network access, no shell commands, no background processes, no stored credentials.
- Registering the pack never changes `display.language`. You opt in with `hermes config set display.language ko`.
- The install scanner reports `caution` findings for a few UI strings that mention `sudo` passwords or show the official one-line installer command. They are display text copied from the English catalog's meaning, not executable content.

## Rebuilding the catalog

`tools/convert.mjs` regenerates `locales/ko.desktop.yaml` from a hermes-agent checkout that contains the Korean Desktop catalog, filtered to the key set of the Hermes version you target:

```bash
node tools/convert.mjs \
  --src <hermes-agent checkout with src/i18n/ko.ts> \
  --keys <target hermes-agent>/locales/_keys.desktop.json \
  --esbuild-root <hermes-agent checkout with node_modules>
hermes plugins validate .
```

## Relationship to hermes-agent #40716

The translations come from the Korean Desktop locale proposed in [NousResearch/hermes-agent#40716](https://github.com/NousResearch/hermes-agent/pull/40716) by [@dalgme](https://github.com/dalgme) and contributors. This pack makes that work usable through the language-pack mechanism; it is not a replacement for the PR. Once Korean ships inside Desktop, this pack will carry only the strings that are still missing, or be retired.

## Attribution

Korean Desktop strings: @dalgme and the contributors of hermes-agent #40716, MIT licensed. See [NOTICE](./NOTICE).

## License

[MIT](./LICENSE)

---
Built by [Dante Labs](https://dante-labs.com) · [YouTube @dante-labs](https://youtube.com/@dante-labs) · [dante@dante-labs.com](mailto:dante@dante-labs.com) · [Discord](https://discord.com/invite/rXyy5e9ujs) · [Buy Me a Coffee](https://buymeacoffee.com/dante.labs)
