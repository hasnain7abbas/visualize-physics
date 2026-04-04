/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "./styles/global.css";
import { Layout } from "./components/Layout";
import { Home } from "./chapters/Home";
import { ChapterPage } from "./components/ChapterPage";
import { initTheme } from "./lib/theme";

initTheme();

const App = () => (
  <Router root={Layout}>
    <Route path="/" component={Home} />
    <Route path="/chapter/:id" component={ChapterPage} />
  </Router>
);

render(App, document.getElementById("root")!);
