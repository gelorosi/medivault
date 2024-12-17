/**
 * Format a number as Philippine Peso (PHP)
 * @param amount - The amount to format
 * @returns Formatted string with PHP symbol and proper decimal places
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
