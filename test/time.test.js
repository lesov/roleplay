import assert from "node:assert/strict";
import test from "node:test";
import {
  addMinutes,
  advanceWalkingTravel,
  createCalendarTime,
  formatCalendarTime,
  formatWalkingDuration,
  isShieldmeetYear,
  travelMinutesForMiles
} from "../public/time.js";

test("formats the starting Calendar of Harptos time", () => {
  const time = createCalendarTime(1496, 1, 8, 0);

  assert.equal(formatCalendarTime(time), "1 Hammer 1496 DR - 08:00");
});

test("walking travel advances through eight-hour travel days with overnight rests", () => {
  const start = createCalendarTime(1496, 1, 8, 0);
  const arrival = advanceWalkingTravel(start, travelMinutesForMiles(153));

  assert.equal(formatWalkingDuration(153), "7 days");
  assert.equal(formatCalendarTime(arrival), "7 Hammer 1496 DR - 11:00");
});

test("calendar advances through festivals between months", () => {
  const hammerEnd = createCalendarTime(1496, 30, 16, 0);
  const midwinterMorning = addMinutes(hammerEnd, 16 * 60);
  const alturiakMorning = addMinutes(midwinterMorning, 24 * 60);

  assert.equal(formatCalendarTime(midwinterMorning), "Midwinter 1496 DR - 08:00");
  assert.equal(formatCalendarTime(alturiakMorning), "1 Alturiak 1496 DR - 08:00");
});

test("Shieldmeet exists in 1496 DR leap year", () => {
  assert.equal(isShieldmeetYear(1496), true);
  assert.equal(formatCalendarTime(createCalendarTime(1496, 214, 8, 0)), "Shieldmeet 1496 DR - 08:00");
  assert.equal(formatCalendarTime(createCalendarTime(1497, 214, 8, 0)), "1 Eleasis 1497 DR - 08:00");
});
