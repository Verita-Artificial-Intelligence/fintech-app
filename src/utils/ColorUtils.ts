// Theme-related utility functions for consistent styling throughout the application

// Royal Business Bank color palette
export const ROYAL_BLUE = '#002366';
export const LIGHTER_BLUE = '#0056b3';
export const GRAY = '#808080';
export const WHITE = '#ffffff';
export const BG_LIGHT = '#f8f9fc';

// Functional colors
export const SUCCESS_COLOR = '#388e3c';
export const WARNING_COLOR = '#f57c00';
export const ERROR_COLOR = '#d32f2f';

// Get color for trend indicators
export function getTrendColor(trend: 'up' | 'down' | 'neutral'): string {
  switch (trend) {
    case 'down':
      return SUCCESS_COLOR;
    case 'up':
      return ERROR_COLOR;
    case 'neutral':
    default:
      return GRAY;
  }
}

// Get color for score indicators
export function getScoreColor(score: number): string {
  if (score >= 80) return SUCCESS_COLOR;
  if (score >= 60) return WARNING_COLOR;
  return ERROR_COLOR;
}

// Get color for impact indicators
export function getImpactColor(impact: 'positive' | 'negative' | 'neutral'): string {
  switch (impact) {
    case 'positive':
      return SUCCESS_COLOR;
    case 'negative':
      return ERROR_COLOR;
    case 'neutral':
    default:
      return GRAY;
  }
}

// Get color for status indicators
export function getStatusColor(status: string): string {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('approve') || lowerStatus.includes('complete') || lowerStatus.includes('success')) {
    return SUCCESS_COLOR;
  }
  if (lowerStatus.includes('review') || lowerStatus.includes('pending') || lowerStatus.includes('warn')) {
    return WARNING_COLOR;
  }
  if (lowerStatus.includes('decline') || lowerStatus.includes('reject') || lowerStatus.includes('fail') || lowerStatus.includes('error')) {
    return ERROR_COLOR;
  }
  return GRAY;
}