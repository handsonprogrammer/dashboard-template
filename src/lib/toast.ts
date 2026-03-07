import { toast as sonner } from "sonner";

/** Typed toast helpers wrapping sonner. */
export const toast = {
    success(message: string, description?: string) {
        sonner.success(message, { description });
    },
    error(message: string, description?: string) {
        sonner.error(message, { description });
    },
    info(message: string, description?: string) {
        sonner.info(message, { description });
    },
    warning(message: string, description?: string) {
        sonner.warning(message, { description });
    },
    loading(message: string) {
        return sonner.loading(message);
    },
    dismiss(id?: string | number) {
        sonner.dismiss(id);
    },
};
