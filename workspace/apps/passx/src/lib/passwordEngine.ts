// PassX password generation engine
export interface PassOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  extendedSymbols: boolean;
  spaces: boolean;
  excludeAmbiguous: boolean;
  excludeSimilar: boolean;
  excludeDuplicates: boolean;
  avoidSequential: boolean;
  avoidRepeated: boolean;
  enforceEach: boolean;
  mode: "standard" | "pronounceable" | "passphrase" | "memorable" | "pin";
}

const SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*",
  extendedSymbols: "()_+-=[]{}|;:,.<>?/~`",
  spaces: " ",
  ambiguous: "{}[]()/\\'\"`~,;:.<>",
  similar: "0Oo1lI|",
};

const WORDS = [
  "apple","ocean","river","mountain","stellar","quantum","velvet","copper","crystal","horizon",
  "summit","forest","glacier","ember","prism","nebula","cipher","orbit","cobalt","ivory",
  "lunar","aurora","cascade","matrix","tundra","zenith","onyx","saffron","mirage","echo",
];

function rand(n: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % n;
}
function pick<T>(arr: T[] | string): T | string {
  return arr[rand(arr.length)] as any;
}

export function buildPool(o: PassOptions): string {
  let pool = "";
  if (o.uppercase) pool += SETS.uppercase;
  if (o.lowercase) pool += SETS.lowercase;
  if (o.numbers) pool += SETS.numbers;
  if (o.symbols) pool += SETS.symbols;
  if (o.extendedSymbols) pool += SETS.extendedSymbols;
  if (o.spaces) pool += SETS.spaces;
  if (o.excludeAmbiguous) pool = pool.split("").filter(c => !SETS.ambiguous.includes(c)).join("");
  if (o.excludeSimilar) pool = pool.split("").filter(c => !SETS.similar.includes(c)).join("");
  return Array.from(new Set(pool.split(""))).join("");
}

function isSequential(a: string, b: string) {
  return Math.abs(a.charCodeAt(0) - b.charCodeAt(0)) === 1;
}

export function generatePassword(o: PassOptions): string {
  if (o.mode === "pin") {
    let s = "";
    for (let i = 0; i < o.length; i++) s += SETS.numbers[rand(10)];
    return s;
  }
  if (o.mode === "passphrase") {
    const count = Math.max(3, Math.min(12, Math.round(o.length / 6)));
    return Array.from({ length: count }, () => {
      const w = WORDS[rand(WORDS.length)];
      return o.uppercase ? w[0].toUpperCase() + w.slice(1) : w;
    }).join("-") + (o.numbers ? "-" + rand(99) : "");
  }
  if (o.mode === "pronounceable") {
    const c = "bcdfghjklmnpqrstvwxz", v = "aeiouy";
    let s = "";
    for (let i = 0; i < o.length; i++) s += (i % 2 === 0 ? c : v)[rand(20)] || c[0];
    if (o.uppercase) s = s[0].toUpperCase() + s.slice(1);
    if (o.numbers) s += rand(99);
    return s.slice(0, o.length);
  }
  if (o.mode === "memorable") {
    const w1 = WORDS[rand(WORDS.length)], w2 = WORDS[rand(WORDS.length)];
    const cap = (w: string) => w[0].toUpperCase() + w.slice(1);
    return `${cap(w1)}${rand(99)}${cap(w2)}!`.slice(0, Math.max(o.length, 10));
  }

  const pool = buildPool(o);
  if (!pool) return "";
  const requiredSets: string[] = [];
  if (o.enforceEach) {
    if (o.uppercase) requiredSets.push(SETS.uppercase);
    if (o.lowercase) requiredSets.push(SETS.lowercase);
    if (o.numbers) requiredSets.push(SETS.numbers);
    if (o.symbols) requiredSets.push(SETS.symbols);
  }

  const chars: string[] = [];
  for (let i = 0; i < o.length; i++) {
    let tries = 0;
    while (tries++ < 50) {
      const ch = pool[rand(pool.length)];
      const prev = chars[chars.length - 1];
      if (o.avoidRepeated && prev === ch) continue;
      if (o.avoidSequential && prev && isSequential(prev, ch)) continue;
      if (o.excludeDuplicates && chars.includes(ch)) continue;
      chars.push(ch);
      break;
    }
    if (chars.length <= i) chars.push(pool[rand(pool.length)]);
  }
  // ensure required sets
  for (const set of requiredSets) {
    if (!chars.some(c => set.includes(c))) {
      chars[rand(chars.length)] = set[rand(set.length)];
    }
  }
  return chars.join("");
}

export function entropy(password: string, poolSize: number): number {
  if (!password || !poolSize) return 0;
  return +(password.length * Math.log2(poolSize)).toFixed(1);
}

export function strengthLabel(e: number): { label: string; score: number; color: string } {
  if (e < 28) return { label: "Very Weak", score: 1, color: "oklch(0.6 0.22 27)" };
  if (e < 50) return { label: "Weak", score: 2, color: "oklch(0.7 0.18 50)" };
  if (e < 80) return { label: "Fair", score: 3, color: "oklch(0.75 0.15 85)" };
  if (e < 120) return { label: "Strong", score: 4, color: "oklch(0.7 0.18 145)" };
  return { label: "Excellent", score: 5, color: "oklch(0.7 0.18 160)" };
}

export function crackTime(e: number): string {
  // assume 10^11 guesses/sec
  const seconds = Math.pow(2, e) / 1e11;
  if (seconds < 1) return "instant";
  const units: [number, string][] = [
    [60, "seconds"], [60, "minutes"], [24, "hours"], [365, "days"],
    [100, "years"], [1000, "centuries"],
  ];
  let v = seconds; let label = "seconds";
  for (const [div, u] of units) {
    if (v < div) { label = u; break; }
    v /= div; label = u;
  }
  if (v > 1e9) return "heat death of universe";
  if (v > 1e6) return `${(v/1e6).toFixed(1)}M ${label}`;
  if (v > 1e3) return `${(v/1e3).toFixed(1)}K ${label}`;
  return `${v.toFixed(1)} ${label}`;
}

export function charDistribution(p: string) {
  return {
    upper: (p.match(/[A-Z]/g) || []).length,
    lower: (p.match(/[a-z]/g) || []).length,
    number: (p.match(/[0-9]/g) || []).length,
    symbol: (p.match(/[^A-Za-z0-9]/g) || []).length,
  };
}
