// validation.service.ts
export const validateEmailAndPassword = (email: string, password: string): string | null => {
    if (!email) {
        return "El email es obligatorio";
    }
    if (!password) {
        return "El password es obligatorio";
    }
    return null;
};
