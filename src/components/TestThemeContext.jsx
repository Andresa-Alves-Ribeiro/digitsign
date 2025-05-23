import { useTheme } from '../contexts/ThemeContext';

export default function TestThemeContext() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="p-4 bg-component-bg-light dark:bg-component-bg-dark rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Teste do Contexto de Tema</h2>
      <div className="flex flex-col space-y-4">
        <div>
          <p className="font-semibold">Tema atual:</p>
          <p className="text-lg">{isDarkMode ? 'Escuro' : 'Claro'}</p>
        </div>
        <div>
          <p className="font-semibold">Valor do tema:</p>
          <p className="text-lg">{theme}</p>
        </div>
        <div>
          <p className="font-semibold">Classe do documento:</p>
          <p className="text-lg">{document.documentElement.classList.contains('dark') ? 'dark' : 'light'}</p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-3 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity mt-4"
        >
          Alternar Tema
        </button>
      </div>
    </div>
  );
} 