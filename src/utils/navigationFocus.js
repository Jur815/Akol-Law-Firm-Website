function linksTo(document, href) {
  return Array.from(document.querySelectorAll("a[href]")).filter(
    (link) => link.getAttribute("href") === href,
  );
}

export function getNavigationOrigin(event) {
  if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return null;
  }

  const link = event.target.closest("a[href]");
  const document = link?.ownerDocument;
  if (!link || link.target || link.hasAttribute("download") ||
      link.origin !== document.location.origin) {
    return null;
  }

  const href = link.getAttribute("href");
  return { href, index: linksTo(document, href).indexOf(link) };
}

export function updateNavigationFocus(main, { hash, initial, history, origin }) {
  if (initial && !hash) return;

  const document = main.ownerDocument;
  const window = document.defaultView;
  const anchor = hash ? document.getElementById(hash.slice(1)) : null;

  if (history && !initial) {
    const link = origin && linksTo(document, origin.href)[origin.index];
    if (link?.getClientRects().length) {
      link.focus({ preventScroll: true });
    } else if (anchor) {
      // Allow native history scroll restoration before checking the fragment's visibility.
      const frame = window.requestAnimationFrame(() => {
        const { top, bottom } = anchor.getBoundingClientRect();
        if (anchor.isConnected && document.activeElement === document.body &&
            top < window.innerHeight && bottom > 0) {
          focusPageTarget(anchor);
        }
      });
      return () => window.cancelAnimationFrame(frame);
    }
    return;
  }

  focusPageTarget(anchor || main.querySelector("h1") || main);
  if (anchor) {
    anchor.scrollIntoView({ behavior: "instant" });
  } else {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

function focusPageTarget(target) {
  target.tabIndex = -1;
  target.focus({ preventScroll: true });
}
