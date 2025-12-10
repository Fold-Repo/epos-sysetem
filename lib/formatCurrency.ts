
export const formatCurrency = (
    amount: number,
    currency: string = "GBP"
): string => {
    const locale: string = typeof navigator !== "undefined" ? navigator.language : "en-NG";

    const effectiveLocale = currency === "NGN" ? "en-NG" : locale;

    return new Intl.NumberFormat(effectiveLocale, {
        style: "currency",
        currency,
    }).format(amount);
};

/**
 * Get just the currency symbol for a given currency code
 */
export const getCurrencySymbol = (currency: string = "GBP"): string => {
    const locale: string = typeof navigator !== "undefined" ? navigator.language : "en-NG";
    const effectiveLocale = currency === "NGN" ? "en-NG" : locale;
    
    const formatter = new Intl.NumberFormat(effectiveLocale, {
        style: "currency",
        currency,
    });
    
    // Format 0 to get the currency symbol
    const parts = formatter.formatToParts(0);
    const symbolPart = parts.find(part => part.type === 'currency');
    return symbolPart?.value || '$';
};
