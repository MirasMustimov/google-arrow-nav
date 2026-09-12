# Google Arrow Nav

A one-feature Chromium extension: on a Google results page the first result is
selected — marked with a `►` before its title — so Enter opens it, and ↓/↑ move
the selection.

The selected link gets real DOM focus, so Enter, Ctrl+Enter (background tab) and
middle click are just the browser's normal link behaviour. ↓/↑ are the only keys
bound, and only outside text fields, so Vimium and friends keep every key they
use. The trade: ↓/↑ no longer scroll a results page.

## Install

No build step — Manifest V3, plain JS, no dependencies, no permissions.

1. `chrome://extensions` → **Developer mode**
2. **Load unpacked** → this directory

For another Google domain, add `"*://www.google.<tld>/search*"` to `matches` in
`manifest.json` and reload.

## Credit

This reimplements one feature of
[Web Search Navigator](https://github.com/infokiller/web-search-navigator) by
[infokiller](https://github.com/infokiller) (MIT), which is where all the good
ideas here come from: real DOM focus instead of intercepting Enter, the `►`
marker, selecting the first result without scrolling to it, and a
MutationObserver to re-scan as Google rewrites the page. The original supports
eight search engines with configurable keys and an options page, and is the one
to install if you want any of that. This is a narrowing of it, not an
improvement: ~110 lines I can re-read and fix myself when Google changes its
markup.

Result detection is the one rule the original replaces with a hand-tuned
selector per Google surface: a result's title link is the only `<a>` wrapping an
`<h3>`. Fewer cases covered, far less to maintain.
