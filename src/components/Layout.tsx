import { Component, JSX, createSignal } from "solid-js";
import { Sidebar } from "./Sidebar";

const [sidebarOpen, setSidebarOpen] = createSignal(false);
export { sidebarOpen, setSidebarOpen };

export const Layout: Component<{ children?: JSX.Element }> = (props) => {
  return (
    <div class="flex h-screen w-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen() && (
        <div
          class="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar />

      {/* Mobile header */}
      <div class="fixed top-0 left-0 right-0 z-30 lg:hidden flex items-center gap-3 px-4 py-3 border-b"
        style={{ background: "var(--bg-sidebar)", "border-color": "var(--border)" }}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen())}
          class="w-8 h-8 flex items-center justify-center rounded-lg"
          style={{ background: "var(--bg-secondary)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span class="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Visualize Physics</span>
      </div>

      <main
        class="flex-1 overflow-y-auto pt-14 lg:pt-0"
        style={{ "margin-left": "0" }}
      >
        <div class="hidden lg:block" style={{ "margin-left": "var(--sidebar-width)" }}>
          {/* Desktop: content shifted by sidebar */}
        </div>
        <div class="lg:ml-[var(--sidebar-width)]">
          {props.children}
        </div>
      </main>
    </div>
  );
};
