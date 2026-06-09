import { daysInYear, fireDayOfYear } from "./sim.js";
import { timelineEvents } from "./timeline.js";

export const FASTEST_RIDER_MILES_PER_DAY = 60;

function routeKey(cityId, destinationId) {
  return [cityId, destinationId].sort().join(":");
}

function absoluteDay(time) {
  let day = time.dayOfYear;
  for (let year = 1496; year < time.year; year += 1) {
    day += daysInYear(year);
  }
  return day;
}

function timeFromAbsoluteDay(day) {
  let year = 1496;
  let dayOfYear = day;

  while (dayOfYear > daysInYear(year)) {
    dayOfYear -= daysInYear(year);
    year += 1;
  }

  return { year, dayOfYear };
}

function eventTime(event) {
  return {
    year: event.fire.year,
    dayOfYear: fireDayOfYear(event.fire)
  };
}

export function shortestTravelMiles(gameData, originCityId, destinationCityId) {
  if (originCityId === destinationCityId) {
    return 0;
  }

  const frontier = [{ cityId: originCityId, miles: 0 }];
  const best = new Map([[originCityId, 0]]);

  while (frontier.length > 0) {
    frontier.sort((a, b) => a.miles - b.miles);
    const current = frontier.shift();

    if (current.cityId === destinationCityId) {
      return current.miles;
    }

    const city = gameData.cities[current.cityId];
    if (!city) {
      continue;
    }

    for (const connectionId of city.connections) {
      const route = gameData.travelRoutes[routeKey(current.cityId, connectionId)];
      if (!route) {
        continue;
      }

      const nextMiles = current.miles + route.miles;
      if (nextMiles >= (best.get(connectionId) ?? Infinity)) {
        continue;
      }

      best.set(connectionId, nextMiles);
      frontier.push({ cityId: connectionId, miles: nextMiles });
    }
  }

  return Infinity;
}

export function rumorArrivalTime(event, cityId, gameData) {
  if (!event.rumor?.originCityId) {
    return null;
  }

  const miles = shortestTravelMiles(gameData, event.rumor.originCityId, cityId);
  if (!Number.isFinite(miles)) {
    return null;
  }

  const travelDays = Math.ceil(miles / FASTEST_RIDER_MILES_PER_DAY);
  const socialDelayDays = event.rumor.delayDays || 0;
  const arrivalDay = absoluteDay(eventTime(event)) + travelDays + socialDelayDays;

  return {
    ...timeFromAbsoluteDay(arrivalDay),
    travelDays,
    miles
  };
}

function eventHasHappened(event, time) {
  return absoluteDay(eventTime(event)) <= absoluteDay(time);
}

function rumorHasArrived(event, cityId, time, gameData) {
  const arrival = rumorArrivalTime(event, cityId, gameData);
  return arrival ? absoluteDay(arrival) <= absoluteDay(time) : false;
}

function publicRumor(event, cityId, gameData) {
  const arrival = rumorArrivalTime(event, cityId, gameData);
  return {
    id: event.id,
    headline: event.presentation.headline,
    summary: event.rumor.text,
    source: "innkeeper_rumor",
    year: event.fire.year,
    originCityId: event.rumor.originCityId,
    heardInCityId: cityId,
    heardAfterDays: arrival?.travelDays ?? null,
    flags: [...(event.effects?.setFlags || [])]
  };
}

export function discoverableRumors(time, cityId, gameData, knownEventIds = []) {
  const known = new Set(knownEventIds);
  return timelineEvents
    .filter((event) => event.rumor)
    .filter((event) => !known.has(event.id))
    .filter((event) => eventHasHappened(event, time))
    .filter((event) => rumorHasArrived(event, cityId, time, gameData))
    .map((event) => publicRumor(event, cityId, gameData));
}
