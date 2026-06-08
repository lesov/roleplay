export const gameData = {
  year: "1496 DR",
  startCityId: "waterdeep",
  startTime: { year: 1496, dayOfYear: 1, hour: 8, minute: 0 },
  travelPace: {
    milesPerHour: 3,
    walkingHoursPerDay: 8
  },
  travelRoutes: {
    "luskan:neverwinter": { miles: 153 },
    "neverwinter:waterdeep": { miles: 335 },
    "daggerford:waterdeep": { miles: 150 },
    "baldurs-gate:daggerford": { miles: 600 },
    "baldurs-gate:elturel": { miles: 200 }
  },
  topicLabels: {
    world: "World",
    rumors: "Rumors",
    roads: "Roads",
    local: "Local"
  },
  cities: {
    luskan: {
      id: "luskan",
      name: "Luskan",
      epithet: "City of Sails",
      region: "Sword Coast North",
      map: { x: 22, y: 12 },
      description:
        "A hard-bitten harbor of cutthroat captains, rebuilt power, and cold sea wind. In 1496 DR, people still measure every promise by who profits from it.",
      connections: ["neverwinter"],
      tavern: {
        name: "The Frosted Tankard",
        innkeeper: "Marda Velryn",
        intro:
          "Marda wipes salt from the bar with a gray cloth and watches the door before she watches you.",
        dialogue: {
          world:
            "The world? It has learned to smile with a knife in its sleeve. Trade runs again, ships crowd the docks, and every lord from here to Calimshan wants the Sword Coast to look orderly enough for taxes.",
          rumors:
            "Black-sailed smugglers have been seen north of the harbor, and folk whisper that old pirate loyalties are waking under new names.",
          roads:
            "South to Neverwinter is the common road. Hire guards if you can; the cold hills hide desperate people, hungry beasts, and worse things that remember older wars.",
          local:
            "Luskan respects strength, coin, and silence. Ask too many names at once and you will be sold three false ones before supper."
        }
      }
    },
    neverwinter: {
      id: "neverwinter",
      name: "Neverwinter",
      epithet: "Jewel of the North",
      region: "Sword Coast North",
      map: { x: 34, y: 25 },
      description:
        "Warm river mist curls through a city still proud of its recovery. Craftsfolk, soldiers, and ambitious nobles all claim they are building the future.",
      connections: ["luskan", "waterdeep"],
      tavern: {
        name: "The Moonstone Rest",
        innkeeper: "Tavik Amblecrown",
        intro:
          "Tavik sets a clean mug before you, polished bright enough to catch the hearthlight.",
        dialogue: {
          world:
            "After all the calamities, folk want roads open, walls mended, and rulers who can keep monsters out of the vegetable carts. That is a humble dream, but not an easy one.",
          rumors:
            "Prospectors from the north came in pale and empty-handed. They claimed something under the old stones sang in a voice they knew from childhood.",
          roads:
            "North takes you to Luskan if the weather holds. South to Waterdeep is safer, busier, and watched by everyone who thinks travelers carry secrets.",
          local:
            "Neverwinter likes to call itself reborn. Mind you, rebirth leaves scars, and some of those scars own property."
        }
      }
    },
    waterdeep: {
      id: "waterdeep",
      name: "Waterdeep",
      epithet: "City of Splendors",
      region: "Sword Coast",
      map: { x: 45, y: 42 },
      description:
        "The great city rises behind guarded gates and crowded wards, wealthy, suspicious, magnificent, and impossible to understand in a single lifetime.",
      connections: ["neverwinter", "daggerford"],
      tavern: {
        name: "The Blue Griffon",
        innkeeper: "Selise Thann",
        intro:
          "Selise knows three conversations at every table and still notices when your boots stop at the bar.",
        dialogue: {
          world:
            "In 1496 DR, the Sword Coast pretends it has recovered its balance. The truth is livelier: merchants, masked powers, priests, and adventurers are all pushing on the same crooked table.",
          rumors:
            "Tall figures in black have been glimpsed near the City of the Dead after moonrise. Sensible people call it nonsense, then lock their shutters early.",
          roads:
            "North goes to Neverwinter by long coastal miles. South to Daggerford is steady traffic, patrols, tolls, and enough gossip to fill a library.",
          local:
            "Waterdeep is ruled by law, coin, custom, and secrets. Only fools try to decide which one is strongest."
        }
      }
    },
    daggerford: {
      id: "daggerford",
      name: "Daggerford",
      epithet: "Duchy on the Delimbiyr",
      region: "Sword Coast",
      map: { x: 49, y: 56 },
      description:
        "A river town with a ducal keep, busy gates, and the wary manners of a place that sees danger before the great cities believe it.",
      connections: ["waterdeep", "baldurs-gate"],
      tavern: {
        name: "The River Gate Hearth",
        innkeeper: "Bran Harlowe",
        intro:
          "Bran leans on the counter with flour on one sleeve and a cudgel within easy reach.",
        dialogue: {
          world:
            "Big cities make grand claims, but the Realms are held together by ferries, granaries, bridge guards, and people willing to light a warning fire.",
          rumors:
            "A caravan master swears one of his wagons arrived lighter than it left, though the seals were untouched and the guards remember nothing.",
          roads:
            "Waterdeep lies north and Baldur's Gate far south. The road is open, but open does not mean kind.",
          local:
            "Daggerford is small enough to remember your face and important enough that your face may matter."
        }
      }
    },
    "baldurs-gate": {
      id: "baldurs-gate",
      name: "Baldur's Gate",
      epithet: "Gate of Trade",
      region: "Western Heartlands",
      map: { x: 34, y: 75 },
      description:
        "A dense, smoky, ambitious city where trade, politics, refugees, soldiers, and criminals all press toward the same narrow streets.",
      connections: ["daggerford", "elturel"],
      tavern: {
        name: "The Lantern and Ledger",
        innkeeper: "Orryn Vale",
        intro:
          "Orryn gives you a merchant's smile, then waits to see whether you spend like a pilgrim or a problem.",
        dialogue: {
          world:
            "The Realms are full of crowns, councils, and temples. Baldur's Gate trusts ledgers first. Ledgers do not lie, though the people holding them often do.",
          rumors:
            "Dockhands say a sealed chest was carried uphill under Flaming Fist guard, and the men carrying it would not meet anyone's eyes.",
          roads:
            "North to Daggerford is a long haul. East to Elturel is watched more closely than most roads, especially by people who remember what the city endured.",
          local:
            "In this city, every door has a price. Sometimes the price is coin, sometimes a favor, sometimes pretending you saw nothing."
        }
      }
    },
    elturel: {
      id: "elturel",
      name: "Elturel",
      epithet: "City of the Companion's Shadow",
      region: "Elturgard",
      map: { x: 78, y: 88 },
      description:
        "A scarred holy city on the River Chionthar, determined to stand upright after horror, judgment, and loss.",
      connections: ["baldurs-gate"],
      tavern: {
        name: "The Ashen Chalice",
        innkeeper: "Maerin Duskford",
        intro:
          "Maerin's voice is gentle, but every candle behind the bar is trimmed with soldierly precision.",
        dialogue: {
          world:
            "The world is not healed just because the screaming stopped. But people rebuild walls, bury names, and choose morning again. That is not small.",
          rumors:
            "Pilgrims report a rider on a pale horse appearing at old battle sites, pointing east without speaking.",
          roads:
            "West to Baldur's Gate follows river trade and hard memories. Travel with company; grief has made some folk merciful and others sharp.",
          local:
            "Elturel listens for sincerity. Empty piety wears thin here, but an honest apology can still open a door."
        }
      }
    }
  }
};
