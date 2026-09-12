// Google Result Nav — selects the first Google result, and ↓/↑ move between
// results. The selected result gets real DOM focus, so Enter, Ctrl+Enter and
// middle click keep their normal browser behaviour; we never navigate ourselves.

'use strict';

// The title link of a result is the only <a> that wraps an <h3>. That one rule
// covers organic results, sitelinks and video/news cards without depending on
// Google's class names, which change every few months.
const RESULTS = '#search a[href]:has(h3), #botstuff a[href]:has(h3)';

// Matches the rule above, but not somewhere you want to land.
const EXCLUDED = [
  '#tads', // ads
  '#bottomads',
  '#taw',
  '[jsname="Cpkphb"]', // "People also ask"
  '[jsname="yEVEwb"]',
  '.related-question-pair',
].join(',');

// Keep a result clear of Google's sticky header when scrolling to it.
const TOP_MARGIN = 80;
const BOTTOM_MARGIN = 20;

let results = [];
let selected = null; // the selected <a>, or null

/** The marker goes on the title; scrolling targets the whole result block. */
const title = (a) => a.querySelector('h3') || a;
const block = (a) => a.closest('[data-hveid]') || a;

const select = (anchor, scroll = true) => {
  if (selected) {
    title(selected).classList.remove('grn-selected');
    selected.classList.remove('grn-no-outline');
  }
  selected = anchor;
  title(anchor).classList.add('grn-selected');
  // The marker is the indicator, so suppress the browser's focus ring.
  anchor.classList.add('grn-no-outline');
  // preventScroll because our own scrolling accounts for the header.
  anchor.focus({preventScroll: true});
  if (!scroll) return;
  const box = block(anchor).getBoundingClientRect();
  if (box.top < TOP_MARGIN) {
    window.scrollBy(0, box.top - TOP_MARGIN);
  } else if (box.bottom + BOTTOM_MARGIN > window.innerHeight) {
    window.scrollBy(0, box.bottom + BOTTOM_MARGIN - window.innerHeight);
  }
};

const move = (delta) => {
  const current = results.indexOf(selected);
  if (current < 0) {
    // Nothing selected yet, or Google replaced the selected node: restart from
    // whichever end the user is heading towards.
    if (results.length) select(results[delta > 0 ? 0 : results.length - 1]);
  } else if (results[current + delta]) {
    select(results[current + delta]);
  } else if (delta < 0) {
    window.scrollTo({top: 0}); // already on the first result
  }
};

const isTyping = (el) =>
  el &&
  (el.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

document.addEventListener(
  'keydown',
  (event) => {
    // A modifier means the keystroke belongs to the browser or to another
    // extension; a text field means it belongs to the page.
    if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
    if (isTyping(event.target)) return;

    if (event.key === 'ArrowDown') move(1);
    else if (event.key === 'ArrowUp') move(-1);
    else return;

    // stopPropagation keeps Google's own arrow-key handling from also reacting.
    event.preventDefault();
    event.stopPropagation();
  },
  true, // capture, so we run before Google's listeners
);

const refresh = () => {
  results = [...document.querySelectorAll(RESULTS)].filter(
    (a) => !a.closest(EXCLUDED) && a.getClientRects().length > 0,
  );
  const nextPage = document.querySelector('a#pnnext');
  if (nextPage) results.push(nextPage);
  // Select the first result once, on load, and deliberately without scrolling:
  // it can sit below a knowledge panel or image row, and yanking the page down
  // is disorienting. Once something is selected this does nothing, so results
  // that load later never steal the selection.
  if (!selected && results.length) select(results[0], false);
};

refresh();

// Google rewrites the results for continuous scrolling and in-page filtering.
let pending;
new MutationObserver(() => {
  clearTimeout(pending);
  pending = setTimeout(refresh, 100);
}).observe(document.querySelector('#rcnt') || document.body, {
  childList: true,
  subtree: true,
});
