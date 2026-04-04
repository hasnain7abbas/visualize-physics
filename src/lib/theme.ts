import { createSignal } from "solid-js";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("visualize-physics-theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const [theme, setThemeSignal] = createSignal<Theme>(getInitialTheme());

export function toggleTheme() {
  const next = theme() === "light" ? "dark" : "light";
  setThemeSignal(next);
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("visualize-physics-theme", next);
}

export function initTheme() {
  document.documentElement.setAttribute("data-theme", theme());
}

export { theme };
