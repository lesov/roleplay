export function createPlayerKnowledge() {
  return {
    knownEventIds: new Set(),
    knownFlags: new Set(),
    knownEvents: []
  };
}

export function rememberRumors(knowledge, rumors) {
  const learned = [];

  for (const rumor of rumors || []) {
    if (knowledge.knownEventIds.has(rumor.id)) {
      continue;
    }

    knowledge.knownEventIds.add(rumor.id);
    for (const flag of rumor.flags || []) {
      knowledge.knownFlags.add(flag);
    }

    const knownEvent = {
      id: rumor.id,
      headline: rumor.headline,
      summary: rumor.summary,
      source: rumor.source,
      year: rumor.year
    };
    knowledge.knownEvents.unshift(knownEvent);
    learned.push(knownEvent);
  }

  return learned;
}

export function knownWorldState(knowledge) {
  return {
    flags: [...knowledge.knownFlags]
  };
}
