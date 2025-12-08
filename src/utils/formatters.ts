const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < MINUTE) {
    return 'agora mesmo';
  }

  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }

  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }

  if (diff < 2 * DAY) {
    return 'ontem';
  }

  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `há ${days} dias`;
  }

  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    return `há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  }

  const months = Math.floor(diff / MONTH);
  return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
}

export function formatCep(cep: string): string {
  const clean = cep.replace(/\D/g, '');
  if (clean.length === 8) {
    return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  }
  return cep;
}

export function cleanCep(cep: string): string {
  return cep.replace(/\D/g, '');
}
