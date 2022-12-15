import toast from "./Toast";

export const notify = ((type, message) => {
    toast({ type, message });
});