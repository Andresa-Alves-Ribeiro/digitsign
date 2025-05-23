import { useTheme } from '../contexts/ThemeContext';

export default function TestThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="p-4 bg-component-bg-light dark:bg-component-bg-dark rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Teste do Botão de Tema</h2>
      <div className="flex flex-col items-center">
        <p className="mb-4">Tema atual: <span className="font-bold">{isDarkMode ? 'Escuro' : 'Claro'}</span></p>
        <button
          onClick={toggleTheme}
          className="p-3 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
        >
          Alternar para {isDarkMode ? 'Claro' : 'Escuro'}
        </button>
      </div>
    </div>
  );
} 