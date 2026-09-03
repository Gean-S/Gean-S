// ============================================================
//  GOATBOARD · design system compartilhado (Node + navegador)
//  Este módulo NÃO pode usar APIs do Node (fs, path, process).
// ============================================================

export const FONT_MONO =
  "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
export const FONT_SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";

/**
 * Paleta "Graphite & Volt".
 * primary   → verde-limão elétrico (energia, contribuições, grama da cabra)
 * secondary → âmbar/dourado (conquistas, níveis, calor)
 * Tudo o mais é grafite dessaturado para não competir com os acentos.
 */
export const THEMES = {
  dark: {
    name: 'dark',
    bg: '#0a0c0f',
    surface: '#11151a',
    surface2: '#171c23',
    border: '#242b34',
    grid: '#1b2129',
    text: '#e6ebf0',
    muted: '#8b96a3',
    faint: '#3c4652',
    primary: '#c6f432',
    primaryDim: '#7fa61f',
    secondary: '#f2b441',
    secondaryDim: '#a67a24',
    onPrimary: '#0a0c0f',
    series: ['#c6f432', '#f2b441', '#4fe3c1', '#ff7b6b', '#b9b4d9', '#7db6c9', '#e88bd2', '#9aa5b1'],
    levels: ['#151a20', '#2f4a12', '#5a8a1a', '#8fc428', '#c6f432'],
    goat: {
      body: '#efe9de',
      shade: '#d9d1c3',
      dark: '#b9b0a2',
      eye: '#0a0c0f',
      bell: '#f2b441',
      collar: '#c6f432',
      outline: 'none',
    },
  },
  light: {
    name: 'light',
    bg: '#ffffff',
    surface: '#f6f8fa',
    surface2: '#eef1f4',
    border: '#d0d7de',
    grid: '#e6eaef',
    text: '#1f2328',
    muted: '#656d76',
    faint: '#aeb6bf',
    primary: '#5b8c0a',
    primaryDim: '#a6e01e',
    secondary: '#b7791f',
    secondaryDim: '#e9c46a',
    onPrimary: '#ffffff',
    series: ['#5b8c0a', '#b7791f', '#0f9d8a', '#d9534f', '#6e63b3', '#2b7fa3', '#b3459a', '#6b7280'],
    levels: ['#ebedf0', '#d3ef9c', '#a9d94f', '#7fb31f', '#4f7f05'],
    goat: {
      body: '#efe9de',
      shade: '#d9d1c3',
      dark: '#a89e8f',
      eye: '#1f2328',
      bell: '#b7791f',
      collar: '#5b8c0a',
      outline: '#a89e8f',
    },
  },
};

export const THEME_NAMES = ['dark', 'light'];

export function getTheme(name) {
  return THEMES[name] || THEMES.dark;
}

// ---------- utilitários de texto ----------

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function fmt(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(Math.round(n));
}

export function truncate(s, max) {
  s = String(s ?? '');
  return s.length > max ? s.slice(0, Math.max(0, max - 1)).trimEnd() + '…' : s;
}

export function wrap(text, maxChars, maxLines = 3) {
  const words = String(text ?? '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? current + ' ' + word : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = truncate(kept[maxLines - 1] + ' ' + lines.slice(maxLines).join(' '), maxChars);
    return kept;
  }
  return lines;
}

export function slug(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

export function round(v, decimals = 2) {
  const f = 10 ** decimals;
  return Math.round(v * f) / f;
}

/** Largura aproximada de texto monoespaçado (0.6em por caractere). */
export function textWidth(str, fontSize) {
  return String(str ?? '').length * fontSize * 0.6;
}

/** Interpola duas cores hex (#rrggbb) → hex. t ∈ [0,1] */
export function mixHex(a, b, t) {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * clamp(t, 0, 1)));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function formatDate(iso, locale = 'pt-BR') {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return locale === 'en' ? `${yyyy}-${mm}-${dd}` : `${dd}/${mm}/${yyyy}`;
}

// ---------- blocos SVG reutilizáveis ----------

export function baseDefs(theme) {
  return `
<linearGradient id="g-accent" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${theme.primary}"/>
  <stop offset="1" stop-color="${theme.secondary}"/>
</linearGradient>
<linearGradient id="g-accent-v" x1="0" y1="1" x2="0" y2="0">
  <stop offset="0" stop-color="${theme.primary}"/>
  <stop offset="1" stop-color="${theme.secondary}"/>
</linearGradient>
<radialGradient id="g-glow-p" cx="50%" cy="50%" r="50%">
  <stop offset="0" stop-color="${theme.primary}" stop-opacity="${theme.name === 'dark' ? 0.32 : 0.16}"/>
  <stop offset="1" stop-color="${theme.primary}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="g-glow-s" cx="50%" cy="50%" r="50%">
  <stop offset="0" stop-color="${theme.secondary}" stop-opacity="${theme.name === 'dark' ? 0.28 : 0.14}"/>
  <stop offset="1" stop-color="${theme.secondary}" stop-opacity="0"/>
</radialGradient>
<linearGradient id="g-line" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${theme.primary}" stop-opacity="0"/>
  <stop offset="0.35" stop-color="${theme.primary}"/>
  <stop offset="0.65" stop-color="${theme.secondary}"/>
  <stop offset="1" stop-color="${theme.secondary}" stop-opacity="0"/>
</linearGradient>
<linearGradient id="g-shine" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
  <stop offset="0.5" stop-color="#ffffff" stop-opacity="${theme.name === 'dark' ? 0.35 : 0.5}"/>
  <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
</linearGradient>
<filter id="f-shadow" x="-50%" y="-50%" width="200%" height="200%">
  <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
</filter>
<filter id="f-blur" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
</filter>`;
}

export function svgDoc({ width, height, theme, title, body, defs = '', transparent = false }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(
    title,
  )}" font-family="${FONT_MONO}">
<title>${esc(title)}</title>
<defs>${baseDefs(theme)}${defs}</defs>
${transparent ? '' : `<rect width="${width}" height="${height}" fill="${theme.bg}"/>`}${body}
</svg>`;
}

export function card({ x = 0, y = 0, width, height, theme, radius = 16, fill }) {
  return `<rect x="${x + 0.5}" y="${y + 0.5}" width="${width - 1}" height="${height - 1}" rx="${radius}" fill="${
    fill || theme.surface
  }" stroke="${theme.border}" stroke-width="1"/>`;
}

export function cardTitle({ x, y, theme, title, subtitle, right }) {
  let out = `<text x="${x}" y="${y}" font-size="12" font-weight="700" letter-spacing="1.4" fill="${theme.text}">${esc(
    title,
  )}</text>`;
  if (subtitle) {
    out += `<text x="${x}" y="${y + 16}" font-size="10.5" fill="${theme.muted}">${esc(subtitle)}</text>`;
  }
  if (right) {
    out += `<text x="${right.x}" y="${y}" font-size="11" text-anchor="end" fill="${theme.primary}">${esc(
      right.text,
    )}</text>`;
  }
  return out;
}

export function sampleTag(theme, x, y) {
  return `<g transform="translate(${x} ${y})">
  <rect x="-62" y="-11" width="62" height="16" rx="8" fill="${theme.secondary}" fill-opacity="0.16" stroke="${theme.secondary}" stroke-opacity="0.6" stroke-width="1"/>
  <text x="-31" y="0.5" font-size="8.5" font-weight="700" letter-spacing="1" text-anchor="middle" fill="${theme.secondary}">AMOSTRA</text>
</g>`;
}

/** Chip com ponto colorido + texto */
export function chip({ x, y, text, color, theme, size = 10 }) {
  const w = textWidth(text, size) + 22;
  return `<g transform="translate(${x} ${y})">
  <rect width="${w}" height="${size + 8}" rx="${(size + 8) / 2}" fill="${theme.surface2}" stroke="${theme.border}" stroke-width="1"/>
  <circle cx="9" cy="${(size + 8) / 2}" r="3" fill="${color}"/>
  <text x="16" y="${(size + 8) / 2 + size * 0.36}" font-size="${size}" fill="${theme.text}">${esc(text)}</text>
</g>`;
}

export function chipWidth(text, size = 10) {
  return textWidth(text, size) + 22;
}

/** Ícone de estrela (16px, centrado em 8,8) */
export function starIcon(color) {
  return `<path d="M8 1.5l1.9 4.1 4.5.5-3.3 3.1.9 4.4L8 11.4l-4 2.2.9-4.4L1.6 6.1l4.5-.5z" fill="${color}"/>`;
}

/** Ícone de fork (16px) */
export function forkIcon(color) {
  return `<g fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="4" cy="3.5" r="1.6"/>
  <circle cx="12" cy="3.5" r="1.6"/>
  <circle cx="8" cy="12.5" r="1.6"/>
  <path d="M4 5.1v5.3M12 5.1v5.3M4 7.7h4m0 0h4"/>
</g>`;
}

/** Ícone de código */
export function codeIcon(color) {
  return `<path d="M5 2l-4 6 4 6m6-12l4 6-4 6M8 1v14" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** Ícone de gráfico */
export function chartIcon(color) {
  return `<g fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round">
  <path d="M2 14h12V2"/>
  <path d="M2 11l3-3 3 2 4-5"/>
</g>`;
}

/** Ícone de fire/chama */
export function fireIcon(color) {
  return `<path d="M8 2c2 0 4 3 4 6 0 2-1 4-2 5h-4c-1-1-2-3-2-5 0-3 2-6 4-6z" fill="${color}" opacity="0.8"/>
<path d="M8 3c1 1 2 2 2 4 0 1-0.5 2-1 3" fill="none" stroke="${color}" stroke-width="0.5"/>`;
}

/** Ícone de estrela preenchida */
export function starFilledIcon(color) {
  return `<path d="M8 1.5l1.9 4.1 4.5.5-3.3 3.1.9 4.4L8 11.4l-4 2.2.9-4.4L1.6 6.1l4.5-.5z" fill="${color}"/>`;
}

/** Padrão de grade (background) */
export function gridPattern(theme) {
  return `<defs>
  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${theme.grid}" stroke-width="0.5"/>
  </pattern>
</defs>
<rect width="100%" height="100%" fill="url(#grid)"/>`;
}

/** Placeholder exibido quando não há dados (antes do primeiro workflow) */
export function renderPlaceholder({ theme, title, width = 440, height = 200, message, sample = false }) {
  const lines = wrap(
    message || 'Aguardando dados · execute o workflow "profile-dashboard" para gerar este gráfico com seus repositórios.',
    Math.floor((width - 60) / 7),
    3,
  );
  const body = `
${card({ width, height, theme })}
<rect x="20" y="20" width="4" height="${height - 40}" rx="2" fill="url(#g-accent-v)"/>
<text x="38" y="42" font-size="12" font-weight="700" letter-spacing="1.4" fill="${theme.text}">${esc(title)}</text>
${lines
  .map(
    (l, i) =>
      `<text x="38" y="${72 + i * 18}" font-size="11.5" fill="${theme.muted}">${esc(l)}</text>`,
  )
  .join('')}
<g transform="translate(${width - 60} ${height - 44})">
  <circle r="6" fill="${theme.primary}" opacity="0.9">
    <animate attributeName="r" values="4;8;4" dur="1.6s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.6s" repeatCount="indefinite"/>
  </circle>
</g>
${sample ? sampleTag(theme, width - 16, 28) : ''}`;
  return svgDoc({ width, height, theme, title, body });
}

/** Renderiza um badge/badge com ícone */
export function badge({ icon, text, color, theme, size = 12 }) {
  return `<g>
  <rect width="${textWidth(text, size) + 32}" height="24" rx="12" fill="${color}" opacity="0.15" stroke="${color}" stroke-width="1"/>
  <text x="16" y="16" font-size="${size}" font-weight="600" text-anchor="middle" fill="${color}">${esc(text)}</text>
</g>`;
}

/** Renderiza uma linha animada */
export function animatedLine(theme, x1, y1, x2, y2, duration = 2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#g-accent)" stroke-width="2" opacity="0.6">
  <animate attributeName="stroke-width" values="2;3;2" dur="${duration}s" repeatCount="indefinite"/>
</line>`;
}

/** Renderiza um card com gradiente e sombra */
export function gradientCard({ x = 0, y = 0, width, height, theme, title, content }) {
  return `<g>
  <defs>
    <linearGradient id="card-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.primary}" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="${theme.secondary}" stop-opacity="0.1"/>
    </linearGradient>
  </defs>
  <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="12" fill="url(#card-grad)" stroke="${theme.border}" stroke-width="1" filter="url(#f-shadow)"/>
  <text x="${x + 16}" y="${y + 28}" font-size="14" font-weight="700" fill="${theme.text}">${esc(title)}</text>
  <text x="${x + 16}" y="${y + height - 16}" font-size="11" fill="${theme.muted}">${esc(content)}</text>
</g>`;
}
