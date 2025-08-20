export const isBrowserEnv = typeof window !== 'undefined' ? window : 0;

export function getGlobal() {
  if (isBrowserEnv) return window;
}

const _global = getGlobal();

export { _global };
