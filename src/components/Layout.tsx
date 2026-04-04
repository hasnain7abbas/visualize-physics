import { Component, JSX } from "solid-js";
import { Sidebar } from "./Sidebar";

export const Layout: Component<{ children?: JSX.Element }> = (props) => {
  return (
    <div class="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <main
        class="flex-1 overflow-y-auto"
        style={{ "margin-left": "var(--sidebar-width)" }}
      >
        {props.children}
      </main>
    </div>
  );
};
