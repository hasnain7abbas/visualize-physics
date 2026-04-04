import { Component, createEffect, onMount } from "solid-js";
import katex from "katex";
import "katex/dist/katex.min.css";

export const MathBlock: Component<{
  tex: string;
  display?: boolean;
  class?: string;
}> = (props) => {
  let ref!: HTMLSpanElement;

  const render = () => {
    if (!ref) return;
    try {
      katex.render(props.tex, ref, {
        displayMode: props.display ?? false,
        throwOnError: false,
        trust: true,
      });
    } catch {
      ref.textContent = props.tex;
    }
  };

  onMount(render);
  createEffect(render);

  return (
    <span
      ref={ref}
      class={props.class ?? ""}
    />
  );
};
