import { Component, createMemo } from "solid-js";
import katex from "katex";

/**
 * Renders text with auto-detected math expressions via KaTeX.
 * Detects common patterns: subscripts, superscripts, Greek, operators,
 * and common physics/math expressions like P(A|B), |amplitude|², etc.
 */
export const InlineMathText: Component<{ text: string; class?: string }> = (props) => {
  const html = createMemo(() => renderMathInText(props.text));
  return <span class={props.class ?? ""} innerHTML={html()} />;
};

function renderMathInText(input: string): string {
  // First handle explicit $...$ delimiters
  if (input.includes("$")) {
    return renderDollarMath(input);
  }

  // Auto-detect and wrap math expressions
  let text = input;

  // Build replacements list — ordered from most specific to least
  const swaps: [RegExp, (m: string, ...args: string[]) => string][] = [
    // Common physics expressions: P(outcome) = |amplitude|²
    [/\|([A-Za-zα-ω]+)\|\²/g, (_, inner) => renderKatex(`|${inner}|^{2}`)],
    [/\|([A-Za-zα-ω]+)\|/g, (_, inner) => renderKatex(`|${inner}|`)],
    // P(A|B) style conditional probability
    [/P\(([^)]+)\|([^)]+)\)/g, (_, a, b) => renderKatex(`P(${a}|${b})`)],
    // P(outcome), P(E), etc.
    [/P\(([^)]+)\)/g, (_, inner) => renderKatex(`P(${inner})`)],
    // C(n,k) combinations
    [/C\(([^,]+),([^)]+)\)/g, (_, n, k) => renderKatex(`\\binom{${n.trim()}}{${k.trim()}}`)],
    // I(X;Y) mutual info
    [/I\(([^;]+);([^)]+)\)/g, (_, x, y) => renderKatex(`I(${x.trim()};${y.trim()})`)],
    // Cov( and Var(
    [/Cov\(([^)]+)\)/g, (_, inner) => renderKatex(`\\text{Cov}(${inner})`)],
    [/Var\(([^)]+)\)/g, (_, inner) => renderKatex(`\\text{Var}(${inner})`)],
    // Greek unicode -> KaTeX
    [/[αβγδεζηθικλμνξπρστυφχψωΓΔΘΛΞΠΣΦΨΩℏ]/g, (m) => renderKatex(greekToLatex(m))],
    // Subscript unicode ₀₁₂₃...
    [/([A-Za-z])([₀₁₂₃₄₅₆₇₈₉ₐₑₒₓₕₖₗₘₙₚₛₜ]+)/g, (_, letter, sub) => renderKatex(letter + "_{" + unicodeSubToNum(sub) + "}")],
    // Superscript unicode ²³
    [/([A-Za-z)\]])(²)/g, (_, base) => renderKatex(base + "^{2}")],
    [/([A-Za-z)\]])(³)/g, (_, base) => renderKatex(base + "^{3}")],
    // Special symbols
    [/∞/g, () => renderKatex("\\infty")],
    [/√/g, () => renderKatex("\\sqrt{\\,}")],
    [/∝/g, () => renderKatex("\\propto")],
    [/≈/g, () => renderKatex("\\approx")],
    [/≥/g, () => renderKatex("\\geq")],
    [/≤/g, () => renderKatex("\\leq")],
    [/±/g, () => renderKatex("\\pm")],
    [/×/g, () => renderKatex("\\times")],
    [/→/g, () => renderKatex("\\to")],
    [/∑/g, () => renderKatex("\\sum")],
    [/∫/g, () => renderKatex("\\int")],
    [/∂/g, () => renderKatex("\\partial")],
    [/∈/g, () => renderKatex("\\in")],
    [/≠/g, () => renderKatex("\\neq")],
    [/⟨/g, () => renderKatex("\\langle")],
    [/⟩/g, () => renderKatex("\\rangle")],
  ];

  for (const [pat, fn] of swaps) {
    text = text.replace(pat, fn as any);
  }

  // Markdown bold: **term** → <strong>term</strong>. Safe to run last:
  // KaTeX output never contains literal "**".
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  return text;
}

function renderDollarMath(input: string): string {
  const parts: string[] = [];
  const regex = /\$([^$]+)\$/g;
  let lastIdx = 0;
  let match;
  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIdx) {
      parts.push(renderBoldAndEscape(input.slice(lastIdx, match.index)));
    }
    parts.push(renderKatex(match[1]));
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < input.length) {
    parts.push(renderBoldAndEscape(input.slice(lastIdx)));
  }
  return parts.join("");
}

/** Escapes HTML and converts **word** markdown to <strong>word</strong>. Applied only to non-math prose. */
function renderBoldAndEscape(text: string): string {
  return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function renderKatex(tex: string): string {
  try {
    return katex.renderToString(tex, {
      throwOnError: false,
      displayMode: false,
      trust: true,
    });
  } catch {
    return escapeHtml(tex);
  }
}

function greekToLatex(ch: string): string {
  const map: Record<string, string> = {
    "α": "\\alpha", "β": "\\beta", "γ": "\\gamma", "δ": "\\delta",
    "ε": "\\varepsilon", "ζ": "\\zeta", "η": "\\eta", "θ": "\\theta",
    "ι": "\\iota", "κ": "\\kappa", "λ": "\\lambda", "μ": "\\mu",
    "ν": "\\nu", "ξ": "\\xi", "π": "\\pi", "ρ": "\\rho",
    "σ": "\\sigma", "τ": "\\tau", "υ": "\\upsilon", "φ": "\\varphi",
    "χ": "\\chi", "ψ": "\\psi", "ω": "\\omega",
    "Γ": "\\Gamma", "Δ": "\\Delta", "Θ": "\\Theta", "Λ": "\\Lambda",
    "Ξ": "\\Xi", "Π": "\\Pi", "Σ": "\\Sigma", "Φ": "\\Phi",
    "Ψ": "\\Psi", "Ω": "\\Omega", "ℏ": "\\hbar",
  };
  return map[ch] || ch;
}

function unicodeSubToNum(sub: string): string {
  const map: Record<string, string> = {
    "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4",
    "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
    "ₐ": "a", "ₑ": "e", "ₒ": "o", "ₓ": "x", "ₕ": "h",
    "ₖ": "k", "ₗ": "l", "ₘ": "m", "ₙ": "n", "ₚ": "p",
    "ₛ": "s", "ₜ": "t",
  };
  return sub.split("").map((c) => map[c] || c).join("");
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
