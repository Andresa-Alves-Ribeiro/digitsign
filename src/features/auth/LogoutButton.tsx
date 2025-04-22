import { useAuth } from '@/hooks/useAuth';

interface LogoutButtonProps {
    className?: string;
    children?: React.ReactNode;
    onLogout?: () => void;
    onClick?: () => void;
}

export default function LogoutButton({
  className = '',
  children = 'Sair',
  onLogout,
  onClick,
}: LogoutButtonProps) {
  const { logout, loading } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      onLogout?.();
      onClick?.();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      aria-label="Sair da conta"
      className={`flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer transition-colors duration-200 ${className}`}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
                    Saindo...
        </span>
      ) : (
        children
      )}
    </button>
  );
}