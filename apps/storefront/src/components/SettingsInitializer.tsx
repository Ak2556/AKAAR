// Inline script to apply accessibility settings before React hydration
// This prevents flash of wrong settings (FOWS)

const settingsScript = `
(function() {
  const STORAGE_KEY = 'akaar-settings';
  const defaults = {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium'
  };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const settings = saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    const root = document.documentElement;

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    }

    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    }

    // Apply font size
    root.setAttribute('data-font-size', settings.fontSize || 'medium');
  } catch (e) {}
})();
`;

export function SettingsInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: settingsScript }}
      suppressHydrationWarning
    />
  );
}
