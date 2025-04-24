export const TOAST_CONFIG = {
  duration: 3000,
  position: 'top-right',
  style: {
    background: '#1F2937',
    color: '#fff',
  },
  success: {
    duration: 3000,
    theme: {
      primary: '#10B981',
    },
  },
  error: {
    duration: 4000,
    theme: {
      primary: '#EF4444',
    },
  },
  warning: {
    duration: 4000,
    theme: {
      primary: '#F59E0B',
    },
  },
  info: {
    duration: 4000,
    theme: {
      primary: '#3B82F6',
    },
  },
} as const;

export const TOAST_MESSAGES = {
  auth: {
    loginSuccess: 'Login realizado com sucesso!',
    loginError: 'Erro ao fazer login. Confira seus dados e tente novamente.',
    registerSuccess: 'Cadastro realizado com sucesso!',
    registerError: 'Erro ao fazer cadastro. Tente novamente mais tarde.',
    logoutSuccess: 'Logout realizado com sucesso!',
    logoutError: 'Erro ao fazer logout. Por favor, tente novamente.',
  },
  document: {
    uploadSuccess: 'Documento enviado com sucesso!',
    uploadError: 'Erro ao enviar documento. Tente novamente.',
    deleteSuccess: 'Documento excluído com sucesso!',
    deleteError: 'Erro ao excluir documento. Tente novamente.',
  },
} as const; 