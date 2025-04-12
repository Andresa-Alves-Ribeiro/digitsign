export const TOAST_CONFIG = {
  duration: 3000,
  position: 'top-right',
  style: {
    background: '#333',
    color: '#fff',
  },
  success: {
    duration: 3000,
    theme: {
      primary: '#4aed88',
    },
  },
  error: {
    duration: 4000,
    theme: {
      primary: '#ff4b4b',
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