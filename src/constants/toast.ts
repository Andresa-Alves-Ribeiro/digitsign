export const TOAST_CONFIG = {
  duration: 3000,
  position: 'top-right',
  style: {
    background: 'var(--component-bg-dark)',
    color: 'var(--text-dark)',
    border: '1px solid var(--component-bg-hover-dark)',
  },
  success: {
    duration: 3000,
    theme: {
      primary: 'var(--primary)',
    },
  },
  error: {
    duration: 4000,
    theme: {
      primary: 'var(--red-500)',
    },
  },
  warning: {
    duration: 4000,
    theme: {
      primary: 'var(--yellow-500)',
    },
  },
  info: {
    duration: 4000,
    theme: {
      primary: 'var(--blue-500)',
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