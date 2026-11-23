/**
 * Format number into Bangladeshi Taka (৳)
 */
export const formatCurrency = (amount = 0) => {
  const num = Number(amount) || 0;
  return `৳ ${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Format date string into readable DD Mon YYYY
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format datetime string into DD Mon YYYY, hh:mm A
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format Bangladeshi Phone Numbers
 */
export const formatPhone = (phone) => {
  if (!phone) return '—';
  const clean = phone.replace(/[^0-9+]/g, '');
  return clean;
};
