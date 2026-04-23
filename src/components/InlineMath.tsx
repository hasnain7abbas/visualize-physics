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
  // Auto-wrap bare LaTeX commands (e.g. \mu_s N, \sqrt{x^2+y^2}, \frac{a}{b})
  // in $...$ so the rest of the pipeline can render them through KaTeX.
  const wrapped = autoWrapLatex(input);

  // First handle explicit $...$ delimiters
  if (wrapped.includes("$")) {
    return renderDollarMath(wrapped);
  }

  // Auto-detect and wrap math expressions
  let text = wrapped;

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

/**
 * Finds bare LaTeX commands in prose and wraps the surrounding math expression
 * in $...$ so the KaTeX pipeline picks it up.
 *
 * Strategy: locate each \command with its structural arguments (braces, _{},
 * ^{}), then merge adjacent commands that are separated only by math glue
 * (operators, digits, spaces, single-letter variables, balanced parens), and
 * finally extend the merged region outward through the same glue until it hits
 * a word boundary (2+ consecutive letters) or sentence punctuation.
 *
 * Segments already inside $...$ are skipped to avoid double-wrapping.
 */
function autoWrapLatex(input: string): string {
  if (!input.includes("\\")) return input;

  // Index existing $...$ regions so we don't re-wrap them.
  const existingDollars: [number, number][] = [];
  {
    const re = /\$[^$]+\$/g;
    let m;
    while ((m = re.exec(input)) !== null) {
      existingDollars.push([m.index, m.index + m[0].length]);
    }
  }
  const inDollar = (p: number) =>
    existingDollars.some(([s, e]) => p >= s && p < e);

  // Step 1: find each \command (including non-alpha commands like \, \! \;)
  // along with its immediately-attached args, then extend outward through
  // math tokens until we hit a word (3+ letters) or sentence punctuation.
  type Run = [number, number];
  const regions: Run[] = [];
  const cmdRe = /\\(?:[a-zA-Z]+|[,!;:\\\s&])/g;
  let m: RegExpExecArray | null;
  while ((m = cmdRe.exec(input)) !== null) {
    if (inDollar(m.index)) continue;
    let end = m.index + m[0].length;
    end = consumeArgs(input, end);
    const [s, e] = extendMathRegion(input, m.index, end, inDollar);
    if (e > s) regions.push([s, e]);
    cmdRe.lastIndex = end;
  }
  if (regions.length === 0) return input;

  // Step 2: merge overlapping/adjacent regions.
  regions.sort((a, b) => a[0] - b[0]);
  const merged: Run[] = [regions[0]];
  for (let i = 1; i < regions.length; i++) {
    const last = merged[merged.length - 1];
    const [s, e] = regions[i];
    if (s <= last[1] + 1) {
      if (e > last[1]) last[1] = e;
    } else {
      merged.push([s, e]);
    }
  }

  // Step 3: emit the wrapped text.
  const parts: string[] = [];
  let cursor = 0;
  for (const [s, e] of merged) {
    if (s < cursor || e <= s) continue;
    parts.push(input.slice(cursor, s));
    parts.push("$" + input.slice(s, e) + "$");
    cursor = e;
  }
  parts.push(input.slice(cursor));
  return parts.join("");
}

/** Consume sub/sup/brace arguments attached to a \command. */
function consumeArgs(text: string, pos: number): number {
  let end = pos;
  while (end < text.length) {
    const ch = text[end];
    if (ch === "{") {
      end = consumeBalanced(text, end, "{", "}");
    } else if (ch === "_" || ch === "^") {
      end++;
      if (text[end] === "{") {
        end = consumeBalanced(text, end, "{", "}");
      } else if (end < text.length && /[a-zA-Z0-9]/.test(text[end])) {
        end++;
      }
    } else {
      break;
    }
  }
  return end;
}

function consumeBalanced(text: string, start: number, open: string, close: string): number {
  let depth = 1;
  let i = start + 1;
  while (i < text.length && depth > 0) {
    if (text[i] === open) depth++;
    else if (text[i] === close) depth--;
    i++;
  }
  return i;
}

/**
 * Extend a math region outward. Walks through anything that isn't a prose
 * word (2+ consecutive letters) or a sentence-ending period/semicolon/colon.
 * Jumps over \command structures so embedded LaTeX doesn't register as words.
 * Adjacent $...$ regions are treated as impenetrable.
 */
function extendMathRegion(
  text: string,
  start: number,
  end: number,
  inDollar: (p: number) => boolean
): [number, number] {
  const STOP_PUNCT = /[.;:!?]/;

  // Extend right.
  while (end < text.length && !inDollar(end)) {
    const ch = text[end];
    // LaTeX command: jump past it + any attached args so its letters
    // aren't seen as a prose word by the check below.
    if (ch === "\\" && end + 1 < text.length) {
      const next = text[end + 1];
      if (/[a-zA-Z]/.test(next)) {
        let j = end + 1;
        while (j < text.length && /[a-zA-Z]/.test(text[j])) j++;
        end = consumeArgs(text, j);
        continue;
      }
      // Non-letter commands like \, \! \; \\ — advance past them.
      end += 2;
      continue;
    }
    // A prose word (2+ consecutive letters) marks the end of math.
    if (/^[a-zA-Z]{2,}/.test(text.slice(end))) break;
    if (
      STOP_PUNCT.test(ch) &&
      (end + 1 >= text.length || /\s/.test(text[end + 1]))
    ) break;
    if (ch === "\n") break;
    end++;
  }

  // Extend left.
  while (start > 0 && !inDollar(start - 1)) {
    const prefix = text.slice(Math.max(0, start - 50), start);
    if (/[a-zA-Z]{2,}$/.test(prefix)) break;
    const ch = text[start - 1];
    if (
      STOP_PUNCT.test(ch) &&
      (start - 2 < 0 || /\s/.test(text[start - 2]))
    ) break;
    if (ch === "\n") break;
    start--;
  }

  // Trim boundary whitespace and sentence punctuation from both ends,
  // but don't strip a trailing char that's part of a LaTeX command (\, \!).
  while (start < end && /[\s.,;:!?]/.test(text[start])) start++;
  while (end > start && /[\s.,;:!?]/.test(text[end - 1])) {
    if (end >= 2 && text[end - 2] === "\\") break;
    end--;
  }

  // If the region starts with an orphan superscript/subscript operator,
  // try to grab a short alphanumeric base preceding it (e.g. "TV^{...}").
  if (start < end && (text[start] === "^" || text[start] === "_")) {
    let b = start;
    while (b > 0 && /[a-zA-Z0-9]/.test(text[b - 1]) && start - b < 3) b--;
    if (b < start) start = b;
  }

  return [start, end];
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
