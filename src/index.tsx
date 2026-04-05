/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "./styles/global.css";
import { Layout } from "./components/Layout";
import { Home } from "./chapters/Home";
import { ChapterPage } from "./components/ChapterPage";
import { initTheme } from "./lib/theme";

initTheme();

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

const App = () => (
  <Router root={Layout} base={base}>
    <Route path="/" component={Home} />
    <Route path="/chapter/:id" component={ChapterPage} />
  </Router>
);

render(App, document.getElementById("root")!);
