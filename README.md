# Google Focus First Result

Focuses the first result on a Google search page, so pressing Enter opens it.
↓/↑ move the focus to another result.

The focused result is marked with a `►` before its title. It holds real DOM
focus, so Enter, Ctrl+Enter (background tab) and middle click all do what they
normally do on a link.

↓/↑ are the only keys bound, and only while focus is outside a text field, so
other keyboard extensions keep their bindings. The trade is that ↓/↑ no longer
scroll a results page.

## Install

No build step — Manifest V3, plain JavaScript, no dependencies, no permissions.

1. `chrome://extensions` → **Developer mode**
2. **Load unpacked** → this directory

For another Google domain, add `"*://www.google.<tld>/search*"` to `matches` in
`manifest.json` and reload.

## How it works

A result's title link is the only `<a>` wrapping an `<h3>`, which is the whole
of the result detection — no dependency on Google's class names, which change
every few months. Ads and "People also ask" are excluded by container. A
MutationObserver re-scans as Google rewrites the page for continuous scrolling.

## Credit

Both the feature and the details of how to do it right come from
[Web Search Navigator](https://github.com/infokiller/web-search-navigator) by
[infokiller](https://github.com/infokiller): real DOM focus instead of an
intercepted Enter, the `►` marker, and focusing the first result *without*
scrolling to it. That extension covers eight search engines with configurable
keys and an options page. This is one feature of it in ~110 lines.
