export const TOAST_CONFIG = {
    duration: 4000,
    position: "top-right" as const,
    styles: {
        success: {
            background: "#22c55e",
            color: "#fff",
        },
        error: {
            background: "#ef4444",
            color: "#fff",
        },
    },
} as const;

export const TOAST_MESSAGES = {
    auth: {
        loginSuccess: "Login realizado com sucesso!",
        loginError: "Erro ao fazer login. Confira seus dados e tente novamente.",
        registerSuccess: "Cadastro realizado com sucesso!",
        registerError: "Erro ao fazer cadastro. Tente novamente mais tarde.",
        logoutError: "Erro ao fazer logout. Por favor, tente novamente.",
    },
    document: {
        uploadSuccess: "Documento enviado com sucesso!",
        uploadError: "Erro ao enviar documento. Tente novamente.",
        deleteSuccess: "Documento excluído com sucesso!",
        deleteError: "Erro ao excluir documento. Tente novamente.",
    },
} as const; 