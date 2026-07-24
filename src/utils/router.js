export function getCurrentPath() {
  const path = window.location.pathname || "/";
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
}

export function navigateTo(path) {
  if (path === getCurrentPath()) {
    window.dispatchEvent(new Event("app:navigate"));
    return;
  }

  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("app:navigate"));
}
