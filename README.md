# hermes-lang-ko

**Korean language pack for Hermes Desktop.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

한국어 문서: [README.ko.md](./README.ko.md)

Hermes already ships Korean for the CLI and messaging gateway (`locales/ko.yaml`) and for the TUI (`ko.tui.yaml`). The Desktop app is the one surface without Korean. This pack fills only that gap with `locales/ko.desktop.yaml`, and leaves the bundled Korean catalogs in charge of everything else.

It is a text-only language pack: two YAML files, a `plugin.yaml`, and an `__init__.py` whose `register()` does nothing (see below). The Hermes backend serves the strings to Desktop over `i18n.catalog`, where they are merged over the bundled English catalog. Any string the pack does not cover stays in English.

## Requirements

- Hermes Agent 0.21.6 or later, for both the backend and the Desktop app. Language packs (`provides_locales`) arrived in hermes-agent #126296; older versions skip the pack.

## Install

### Option A — Hermes Desktop

Capabilities → Plugins → **Install from Git**, enter `https://github.com/dandacompany/hermes-lang-ko`, then **Review repository** and **Install**. Then set the language (Option B's last line, or the Desktop language switcher) and restart Desktop.

### Option B — `hermes plugins install`

```bash
hermes plugins install hermes-lang-ko          # once listed in the plugin catalog
hermes plugins install dandacompany/hermes-lang-ko   # directly from this repository
hermes config set display.language ko
```

Restart Desktop (and any running gateway or TUI) so it reloads the language list. Korean then appears as **한국어** in the Desktop language switcher.

Plugins are per profile. Install the pack in the profile your Desktop backend runs, or pass `-p <profile>`.

### Option C — personal overlay, no plugin

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
| Desktop | this pack, `locales/ko.desktop.yaml` | 4,934 of 5,038 keys (98%) |

The remaining 104 keys split in two. 74 need no translation: brand names, identifiers, example URLs and pure placeholders such as `{0} · {1}`. The other 30 are function entries the positional format cannot express faithfully: wording that switches on a state (on/off, show/hide), optional parts that would leave a dangling fragment when absent, and list values. Those keep their English wording until Korean ships inside Desktop. Values identical to English are deliberately left out, so untranslated strings fall back to the English catalog instead of being pinned to a stale copy. Desktop entries whose English value is a function are written as positional strings (`"{0}분 전"`), as the pack format requires.

`locales/ko.yaml` is intentionally empty: the bundled core catalog already covers it, and the validator requires the file to exist.

## What this plugin does and does not do

- No executable code: `__init__.py` holds only a `register()` that returns immediately. It exists because Desktop's *Install from Git* check requires it beside `plugin.yaml`; the backend registers `locales/` from the manifest before `register()` runs. No JavaScript, no network access, no shell commands, no background processes, no stored credentials.
- Registering the pack never changes `display.language`. You opt in with `hermes config set display.language ko`.
- The install scanner reports `caution` findings for a few UI strings that mention `sudo` passwords or show the official one-line installer command. They are display text copied from the English catalog's meaning, not executable content.

## Updating to a new Hermes version

`locales/ko.desktop.yaml` is the source of truth and is edited directly. When Desktop keys change, align the pack with the target version's key set:

```bash
node tools/sync-keys.mjs --keys <hermes-agent>/locales/_keys.desktop.json --missing missing.txt   # report
node tools/sync-keys.mjs --keys <hermes-agent>/locales/_keys.desktop.json --fix                   # drop stale keys
hermes plugins validate .
```

`missing.txt` lists keys still waiting for a translation; add them by hand.

## Translation and attribution

The Korean strings are an independent translation by Dante Labs, prepared with AI assistance from the English Desktop catalog only. Corrections from Korean users are welcome as issues or pull requests.

Releases up to 0.1.1 were generated from the Korean Desktop locale in [NousResearch/hermes-agent#40716](https://github.com/NousResearch/hermes-agent/pull/40716) by [@dalgme](https://github.com/dalgme) and contributors, and keep that attribution. Since 0.2.0 the pack contains none of those strings. This pack does not replace #40716: once Korean ships inside Desktop, the pack will carry only what is still missing, or be retired. See [NOTICE](./NOTICE).

## License

[MIT](./LICENSE)

---
Built by [Dante Labs](https://dante-labs.com) · [YouTube @dante-labs](https://youtube.com/@dante-labs) · [dante@dante-labs.com](mailto:dante@dante-labs.com) · [Discord](https://discord.com/invite/rXyy5e9ujs) · [Buy Me a Coffee](https://buymeacoffee.com/dante.labs)
