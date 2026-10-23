/**
 * Convert time string "HH:mm" to minutes since midnight
 */
export const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight back to "HH:mm"
 */
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

/**
 * Check if two time slots overlap: [start1, end1] and [start2, end2]
 */
export const isTimeOverlap = (start1, end1, start2, end2) => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);

  return s1 < e2 && e1 > s2;
};

/**
 * Normalize date to YYYY-MM-DD 00:00:00 UTC
 */
export const normalizeDate = (dateInput) => {
  const d = new Date(dateInput);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
};

/**
 * Verify whether requested time slot is within the restaurant's operating hours
 */
export const isWithinOperatingHours = (operatingHours, reservationDate, startTime, endTime) => {
  const dateObj = new Date(reservationDate);
  const dayOfWeek = dateObj.getUTCDay();

  const daySchedule = operatingHours.find((h) => h.dayOfWeek === dayOfWeek);

  if (!daySchedule || daySchedule.isClosed) {
    return { valid: false, reason: "Restaurant is closed on this day" };
  }

  const reqStart = timeToMinutes(startTime);
  const reqEnd = timeToMinutes(endTime);
  const open = timeToMinutes(daySchedule.openTime);
  const close = timeToMinutes(daySchedule.closeTime);

  if (reqStart < open || reqEnd > close) {
    return {
      valid: false,
      reason: `Requested time is outside operating hours (${daySchedule.openTime} - ${daySchedule.closeTime})`,
    };
  }

  return { valid: true };
};
