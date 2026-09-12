# Google Focus First Result

On a Google search page the first result is already focused, so pressing Enter
opens it. ↓ and ↑ move to another result.

The focused result is marked with a `►` before its title.

## Install

1. `chrome://extensions` → **Developer mode**
2. **Load unpacked** → this directory

For another Google domain, add `"*://www.google.<tld>/search*"` to `matches` in
`manifest.json` and reload.

## Credit

This feature comes from
[Web Search Navigator](https://github.com/infokiller/web-search-navigator) by
[infokiller](https://github.com/infokiller), which does far more: eight search
engines, configurable keys, an options page. This is just the one part of it I
use.
