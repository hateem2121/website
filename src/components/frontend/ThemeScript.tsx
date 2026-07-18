/**
 * No-flash theme init. Runs before first paint so a saved light/dark choice is applied to
 * <html data-theme> synchronously — otherwise the page would paint in the OS theme and jump.
 * Kept tiny and inline; the toggle (ThemeToggle) writes the same `run-theme` localStorage key.
 */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('run-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`
  return <script dangerouslySetInnerHTML={{ __html: js }} />
}
