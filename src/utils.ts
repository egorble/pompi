export const formatCurrency = (value: number, minDecimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: Math.max(minDecimals, 2),
  }).format(value);
};

export const formatPercent = (value: number) => {
  return (value > 0 ? '+' : '') + value.toFixed(2) + '%';
};
