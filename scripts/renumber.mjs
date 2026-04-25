// Renumber `num` field of each chapter to be a per-category counter.
// "Q1, Q2, ..., Q7" → "1, 2, ..., 7" within Quantum, etc.
// Each category is the contiguous run between `const <name>: Chapter[] = [`
// markers in chapters-data.ts. Counter resets at the start of each run.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "..", "src", "lib", "chapters-data.ts");
let src = fs.readFileSync(file, "utf8");

// Find the start lines of each Chapter[] array.
const arrayRe = /^const (\w+): Chapter\[\] = \[/gm;
const cuts = [];
let m;
while ((m = arrayRe.exec(src)) !== null) cuts.push({ name: m[1], idx: m.index });

// For each segment between cuts, renumber the `num: "..."` strings.
const numRe = /(\bnum:\s*")([^"]+)(")/g;
let out = "";
let lastEnd = 0;
let totalChanges = 0;
for (let i = 0; i < cuts.length; i++) {
  const start = cuts[i].idx;
  const end = i + 1 < cuts.length ? cuts[i + 1].idx : src.length;
  const segment = src.slice(start, end);
  let counter = 0;
  const renumbered = segment.replace(numRe, (_full, p1, _old, p3) => {
    counter++;
    totalChanges++;
    return p1 + counter + p3;
  });
  out += src.slice(lastEnd, start) + renumbered;
  lastEnd = end;
}
out += src.slice(lastEnd);

fs.writeFileSync(file, out);
console.log(`Renumbered ${totalChanges} chapter num fields across ${cuts.length} categories.`);
