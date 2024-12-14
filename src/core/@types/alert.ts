export type Severity = 'success' | 'info' | 'warning' | 'error';

export interface Alert {
  isOpen?: boolean;
  message: string;
  severity: Severity;
}
