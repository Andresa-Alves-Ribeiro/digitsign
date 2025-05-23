import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity flex items-center gap-2 text-lg font-semibold shadow-md hover:shadow-lg"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <>
          <span className="text-2xl">☀️</span>
          <span>Modo Claro</span>
        </>
      ) : (
        <>
          <span className="text-2xl">🌙</span>
          <span>Modo Escuro</span>
        </>
      )}
    </button>
  );
} 