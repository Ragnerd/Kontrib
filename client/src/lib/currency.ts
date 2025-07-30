export function formatNaira(amount: string | number): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount).replace('NGN', '₦');
}

export function formatNumber(amount: string | number): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-NG').format(numAmount);
}

export function calculateProgress(collected: string | number, target: string | number): number {
  const collectedNum = typeof collected === 'string' ? parseFloat(collected) : collected;
  const targetNum = typeof target === 'string' ? parseFloat(target) : target;
  
  if (targetNum === 0) return 0;
  return Math.round((collectedNum / targetNum) * 100);
}
