export const formatPrice = (value: string) => {
  return `$${value ? parseFloat(value)?.toFixed(2) : '0.00'}`;
};
