// utils/alertService.ts
const ALERT_KEY = "app-alert";

export const setAlertMessage = (msg: string) => {
  localStorage.setItem(ALERT_KEY, msg);
};

export const getAlertMessage = (): string | null => {
  const msg = localStorage.getItem(ALERT_KEY);
  if (msg) localStorage.removeItem(ALERT_KEY);
  return msg;
};
