import assert from "node:assert/strict";
import test from "node:test";
import { getNavigationOrigin, updateNavigationFocus } from "../src/utils/navigationFocus.js";

function setup() {
  const calls = [];
  let frame;
  let links = [];
  let anchor;
  const body = {};
  const view = {
    innerHeight: 720,
    scrollTo: (options) => calls.push(["scroll", options]),
    requestAnimationFrame(callback) {
      frame = callback;
      return 1;
    },
    cancelAnimationFrame() {
      frame = undefined;
    },
  };
  const document = {
    body,
    activeElement: body,
    location: { origin: "https://example.test" },
    defaultView: view,
    querySelectorAll: () => links,
    getElementById: () => anchor,
  };
  const target = (name) => ({
    focus: (options) => calls.push(["focus", name, options]),
    scrollIntoView: (options) => calls.push(["anchor scroll", name, options]),
  });
  const heading = target("heading");
  const main = { ownerDocument: document, querySelector: () => heading };
  const link = (name) => ({
    ...target(name),
    ownerDocument: document,
    origin: document.location.origin,
    getAttribute: () => "/team#marco-akol-deng",
    hasAttribute: () => false,
    getClientRects: () => [{}],
  });

  return {
    calls, main, link, heading,
    setLinks: (elements) => { links = elements; },
    setAnchor(top, bottom) {
      anchor = {
        ...target("profile"),
        isConnected: true,
        getBoundingClientRect: () => ({ top, bottom }),
      };
    },
    runFrame: () => frame?.(),
  };
}

test("normal navigation focuses the new heading and scrolls to the top", () => {
  const { calls, main, heading } = setup();
  updateNavigationFocus(main, { hash: "" });
  assert.equal(heading.tabIndex, -1);
  assert.deepEqual(calls, [
    ["focus", "heading", { preventScroll: true }],
    ["scroll", { top: 0, behavior: "instant" }],
  ]);
});

test("initial page loads preserve native focus and deep links focus their fragment", () => {
  const { calls, main, setAnchor } = setup();
  updateNavigationFocus(main, { initial: true, history: true, hash: "" });
  assert.deepEqual(calls, []);
  setAnchor(300, 950);
  updateNavigationFocus(main, { initial: true, history: true, hash: "#marco-akol-deng" });
  assert.deepEqual(calls, [
    ["focus", "profile", { preventScroll: true }],
    ["anchor scroll", "profile", { behavior: "instant" }],
  ]);
});

test("Back restores the originating profile link after it remounts without scrolling", () => {
  const { calls, main, setLinks, link } = setup();
  const original = link("original");
  setLinks([link("other link to profile"), original]);
  const click = { button: 0, target: { closest: () => original } };
  const origin = getNavigationOrigin(click);
  assert.equal(getNavigationOrigin({ ...click, metaKey: true }), null);
  setLinks([link("other remounted link"), link("remounted original")]);

  updateNavigationFocus(main, { hash: "", history: true, origin });
  assert.deepEqual(calls, [["focus", "remounted original", { preventScroll: true }]]);
});

test("Forward can focus the restored profile fragment without scrolling", () => {
  const { calls, main, setAnchor, runFrame } = setup();
  setAnchor(125, 825);
  updateNavigationFocus(main, { hash: "#marco-akol-deng", history: true });
  assert.deepEqual(calls, []);
  runFrame();
  assert.deepEqual(calls, [["focus", "profile", { preventScroll: true }]]);
});

test("history traversal leaves focus alone when there is no visible return target", () => {
  const { calls, main, setAnchor, runFrame } = setup();
  updateNavigationFocus(main, { hash: "", history: true });
  setAnchor(-200, -20);
  updateNavigationFocus(main, { hash: "#marco-akol-deng", history: true });
  runFrame();
  assert.deepEqual(calls, []);
});
