import { useTheme } from '../contexts/ThemeContext';

export default function SimpleThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
    >
      {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
    </button>
  );
} 