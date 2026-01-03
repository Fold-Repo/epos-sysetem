export function getErrorMessage(error: unknown): string {
    if (error && typeof error === "object" && "message" in error && !("response" in error)) {
        return (error as Error).message;
    }

    if (error && typeof error === "object" && "response" in error) {
        const response = (error as { response?: { data?: any } }).response?.data;

        // ==============================
        // Format with fields { fields: { field: "message" } }
        // ==============================
        if (response?.fields && typeof response.fields === "object") {
            const errorMessages = Object.values(response.fields);
            return errorMessages.length > 0 ? String(errorMessages[0]) : response?.error || "An unknown error occurred";
        }

        // ==============================
        // Just a single message
        // ==============================
        return response?.message || response?.error || "An unknown error occurred";
        
    }

    return "An unknown error occurred";
}