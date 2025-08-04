export function parseHourAndMinutesUTC(time: string | Date): {
  hours: string;
  minutes: string;
} | null {
  const hhMMFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (typeof time === 'string' && hhMMFormat.test(time)) {
    return {
      hours: time.split(':')[0],
      minutes: time.split(':')[1],
    };
  }

  const date = new Date(time instanceof Date ? time : new Date(time));
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  if (isNaN(Number(hours)) || isNaN(Number(minutes))) {
    return null;
  }

  return {
    hours,
    minutes,
  };
}
