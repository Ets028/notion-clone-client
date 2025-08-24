import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return d.toLocaleDateString();
  }
}

export function truncateText(text: string, maxLength: number = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'NOT_STARTED':
      return 'text-muted-foreground';
    case 'IN_PROGRESS':
      return 'text-secondary';
    case 'DONE':
      return 'text-lime-green';
    default:
      return 'text-muted-foreground';
  }
}

export function getStatusIcon(status: string) {
  switch (status) {
    case 'NOT_STARTED':
      return '⭕';
    case 'IN_PROGRESS':
      return '🔄';
    case 'DONE':
      return '✅';
    default:
      return '⭕';
  }
}