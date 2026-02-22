import { storage } from './storage';

export type ThemeMode = 'light' | 'dark';

export interface ThemeOrigin {
  x: number;
  y: number;
}

export interface ThemeTransitionOptions {
  origin?: ThemeOrigin;
}

const THEME_KEY = 'theme';
const STORAGE_KEY = `bilibili_desktop_${THEME_KEY}`;
const TRANSITION_DURATION = 520;
let syncInitialized = false;
const WINDOW_ID =
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
type StoredTheme = ThemeMode | { mode: ThemeMode; source?: string; time?: number };

const applyTheme = (mode: ThemeMode) => {
  document.documentElement.dataset.theme = mode === 'dark' ? 'dark' : '';
  document.documentElement.style.colorScheme = mode === 'dark' ? 'dark' : 'light';
};

const getCurrentTheme = (): ThemeMode =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const resolveThemeMode = (value: unknown): ThemeMode | null => {
  if (value === 'light' || value === 'dark') return value;
  if (value && typeof value === 'object' && 'mode' in value) {
    const mode = (value as { mode?: unknown }).mode;
    if (mode === 'light' || mode === 'dark') return mode;
  }
  return null;
};

const parseThemeEvent = (raw: string | null): { mode: ThemeMode; source?: string } | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredTheme;
    const mode = resolveThemeMode(parsed);
    if (!mode) return null;
    if (typeof parsed === 'object' && parsed && 'source' in parsed) {
      return { mode, source: (parsed as { source?: string }).source };
    }
    return { mode };
  } catch {
    return null;
  }
};


const getThemeColors = (mode: ThemeMode) => {
  const root = document.documentElement;
  const prevTheme = root.dataset.theme;
  const prevScheme = root.style.colorScheme;
  if (mode === 'dark') {
    root.dataset.theme = 'dark';
  } else {
    root.removeAttribute('data-theme');
  }
  root.style.colorScheme = mode === 'dark' ? 'dark' : 'light';
  const styles = getComputedStyle(root);
  const background = styles.getPropertyValue('--color-body-bg').trim() || '#ffffff';
  const accent = styles.getPropertyValue('--color-primary').trim() || '#fb7299';
  if (prevTheme) {
    root.dataset.theme = prevTheme;
  } else {
    root.removeAttribute('data-theme');
  }
  root.style.colorScheme = prevScheme;
  return { background, accent };
};

const toRgba = (value: string, alpha: number) => {
  const raw = value.trim();
  if (raw.startsWith('#')) {
    const hex = raw.slice(1);
    const normalized =
      hex.length === 3 ? `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}` : hex;
    if (normalized.length === 6) {
      const num = Number.parseInt(normalized, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
  const rgb = raw.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgb) {
    return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})`;
  }
  return raw;
};

const createRipple = (origin: ThemeOrigin, maxRadius: number, background: string) => {
  const ripple = document.createElement('div');
  ripple.className = 'theme-ripple';
  ripple.style.setProperty('--x', `${origin.x}px`);
  ripple.style.setProperty('--y', `${origin.y}px`);
  ripple.style.setProperty('--size', `${maxRadius}px`);
  ripple.style.background = background;
  ripple.style.clipPath = `circle(0px at ${origin.x}px ${origin.y}px)`;
  return ripple;
};


export const loadTheme = (): ThemeMode => {
  const saved = storage.get<StoredTheme>(THEME_KEY, 'light');
  const mode = resolveThemeMode(saved) ?? 'light';
  applyTheme(mode);
  return mode;
};

export const setTheme = (
  mode: ThemeMode,
  options?: ThemeTransitionOptions,
  persist: boolean = true,
) => {
  if (persist) storage.set(THEME_KEY, { mode, source: WINDOW_ID, time: Date.now() });
  if (typeof document === 'undefined') return;

  const current = getCurrentTheme();
  if (current === mode) return;

  if (prefersReducedMotion()) {
    applyTheme(mode);
    return;
  }

  const root = document.documentElement;
  const body = document.body;
  if (!body) {
    applyTheme(mode);
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const origin = options?.origin ?? { x: width / 2, y: height / 2 };
  const x = Math.max(0, Math.min(origin.x, width));
  const y = Math.max(0, Math.min(origin.y, height));
  const maxRadius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));

  const existing = document.querySelector('.theme-ripple');
  if (existing) existing.remove();

  const useViewTransition = 'startViewTransition' in document;
  if (useViewTransition) {
    const transition = (document as Document & { startViewTransition: (cb: () => void) => any })
      .startViewTransition(() => {
        applyTheme(mode);
      });

    transition.ready.then(() => {
      const ripple = createRipple({ x, y }, maxRadius, 'transparent');
      body.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.classList.add('is-animating');
        ripple.style.clipPath = `circle(${maxRadius}px at ${x}px ${y}px)`;
      });

      const easing = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
      const clipKeyframes = [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${maxRadius}px at ${x}px ${y}px)` },
      ];

      document.documentElement.animate(clipKeyframes, {
        duration: TRANSITION_DURATION,
        easing,
        pseudoElement: '::view-transition-new(root)',
      });

      const cleanup = () => ripple.remove();
      ripple.addEventListener('transitionend', cleanup, { once: true });
      setTimeout(cleanup, TRANSITION_DURATION + 80);
    });
    return;
  }

  const { background } = getThemeColors(mode);
  const ripple = createRipple({ x, y }, maxRadius, background);
  body.appendChild(ripple);
  requestAnimationFrame(() => {
    ripple.classList.add('is-animating');
    ripple.style.clipPath = `circle(${maxRadius}px at ${x}px ${y}px)`;
  });

  const cleanup = () => {
    applyTheme(mode);
    ripple.remove();
  };
  ripple.addEventListener('transitionend', cleanup, { once: true });
  setTimeout(cleanup, TRANSITION_DURATION + 80);
};

export const initThemeSync = () => {
  if (syncInitialized || typeof window === 'undefined') return;
  syncInitialized = true;
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || event.newValue == null) return;
    const payload = parseThemeEvent(event.newValue);
    if (!payload) return;
    if (payload.mode === getCurrentTheme()) return;
    if (payload.source && payload.source === WINDOW_ID) return;
    setTheme(payload.mode, { origin: { x: 0, y: 0 } }, false);
  });
};
