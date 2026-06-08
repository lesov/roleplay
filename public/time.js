const DAY_MINUTES = 24 * 60;
const DEFAULT_WALKING_MILES_PER_HOUR = 3;
const DEFAULT_WALKING_HOURS_PER_DAY = 8;
const DEFAULT_TRAVEL_START_HOUR = 8;

const MONTHS = [
  "Hammer",
  "Alturiak",
  "Ches",
  "Tarsakh",
  "Mirtul",
  "Kythorn",
  "Flamerule",
  "Eleasis",
  "Eleint",
  "Marpenoth",
  "Uktar",
  "Nightal"
];

const FESTIVALS_AFTER_MONTH = {
  Hammer: ["Midwinter"],
  Tarsakh: ["Greengrass"],
  Flamerule: ["Midsummer"],
  Eleint: ["Highharvestide"],
  Uktar: ["Feast of the Moon"]
};

export function isShieldmeetYear(year) {
  return year % 4 === 0;
}

function yearDays(year) {
  const days = [];

  for (const month of MONTHS) {
    for (let day = 1; day <= 30; day += 1) {
      days.push({ type: "month", month, day });
    }

    const festivals = FESTIVALS_AFTER_MONTH[month] || [];
    for (const festival of festivals) {
      days.push({ type: "festival", festival });
      if (festival === "Midsummer" && isShieldmeetYear(year)) {
        days.push({ type: "festival", festival: "Shieldmeet" });
      }
    }
  }

  return days;
}

function daysInYear(year) {
  return yearDays(year).length;
}

export function createCalendarTime(year, dayOfYear = 1, hour = 8, minute = 0) {
  return normalizeCalendarTime({ year, dayOfYear, hour, minute });
}

export function normalizeCalendarTime(time) {
  const next = { ...time };
  let extraDays = Math.floor(next.hour / 24);
  next.hour %= 24;

  if (next.minute >= 60) {
    const extraHours = Math.floor(next.minute / 60);
    next.hour += extraHours;
    next.minute %= 60;
    extraDays += Math.floor(next.hour / 24);
    next.hour %= 24;
  }

  while (next.dayOfYear + extraDays > daysInYear(next.year)) {
    extraDays -= daysInYear(next.year) - next.dayOfYear + 1;
    next.year += 1;
    next.dayOfYear = 1;
  }

  next.dayOfYear += extraDays;

  return next;
}

export function addMinutes(time, minutes) {
  const totalMinutes = time.hour * 60 + time.minute + minutes;
  const extraDays = Math.floor(totalMinutes / DAY_MINUTES);
  const minuteOfDay = totalMinutes % DAY_MINUTES;
  return normalizeCalendarTime({
    year: time.year,
    dayOfYear: time.dayOfYear + extraDays,
    hour: Math.floor(minuteOfDay / 60),
    minute: minuteOfDay % 60
  });
}

export function travelMinutesForMiles(miles, milesPerHour = DEFAULT_WALKING_MILES_PER_HOUR) {
  return Math.round((miles / milesPerHour) * 60);
}

export function advanceWalkingTravel(time, travelMinutes, options = {}) {
  const walkingHoursPerDay = options.walkingHoursPerDay || DEFAULT_WALKING_HOURS_PER_DAY;
  const travelStartHour = options.travelStartHour || DEFAULT_TRAVEL_START_HOUR;
  const dailyWalkingMinutes = walkingHoursPerDay * 60;
  const travelStartMinute = travelStartHour * 60;
  let remainingMinutes = travelMinutes;
  let current = { ...time };

  while (remainingMinutes > 0) {
    const walkingMinutes = Math.min(remainingMinutes, dailyWalkingMinutes);
    current = addMinutes(current, walkingMinutes);
    remainingMinutes -= walkingMinutes;

    if (remainingMinutes > 0) {
      const minutesSinceMidnight = current.hour * 60 + current.minute;
      const restMinutes =
        minutesSinceMidnight < travelStartMinute
          ? travelStartMinute - minutesSinceMidnight
          : DAY_MINUTES - minutesSinceMidnight + travelStartMinute;
      current = addMinutes(current, restMinutes);
    }
  }

  return current;
}

export function formatWalkingDuration(miles, options = {}) {
  const walkingHoursPerDay = options.walkingHoursPerDay || DEFAULT_WALKING_HOURS_PER_DAY;
  const milesPerHour = options.milesPerHour || DEFAULT_WALKING_MILES_PER_HOUR;
  const days = Math.max(1, Math.ceil(miles / (milesPerHour * walkingHoursPerDay)));
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export function formatCalendarTime(time) {
  const day = yearDays(time.year)[time.dayOfYear - 1];
  const hour = String(time.hour).padStart(2, "0");
  const minute = String(time.minute).padStart(2, "0");
  const date =
    day.type === "festival"
      ? day.festival
      : `${day.day} ${day.month}`;

  return `${date} ${time.year} DR - ${hour}:${minute}`;
}
