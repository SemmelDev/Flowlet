export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function currentHour(d = new Date()): number {
  return d.getHours();
}

export function currentDayOfWeek(d = new Date()): number {
  return d.getDay();
}
