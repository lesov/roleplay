export const gameData = {
  year: "1496 DR",
  startCityId: "cimbar",
  startTime: { year: 1496, dayOfYear: 1, hour: 8, minute: 0 },
  travelPace: {
    milesPerHour: 3,
    walkingHoursPerDay: 8
  },
  travelRoutes: {
    "arrabar:cimbar": {
      miles: 520,
      baseRisk: "watchful",
      hazards: ["Vilhon toll posts", "mercenary escorts", "rival city agents"],
      safetyTags: ["southern", "trade", "religious"],
      safeSummary:
        "The Vilhon road is busy enough to find company, but every shrine, bridge, and counting-house has a watcher."
    },
    "arrabar:selgaunt": {
      miles: 640,
      baseRisk: "risky",
      hazards: ["long caravan stages", "political scrutiny", "thin rural patrols"],
      safetyTags: ["trade", "religious", "coastal"],
      safeSummary:
        "Merchant traffic keeps the road alive, though temple agents and Sembian factors both take careful note of strangers."
    },
    "cimbar:soorenar": {
      miles: 430,
      baseRisk: "risky",
      hazards: ["contested claims", "city-state patrols", "hired blades"],
      safetyTags: ["southern", "trade"],
      safeSummary:
        "This is the road every claimant watches; travel is possible, but neutrality is hard to prove near Soorenar."
    },
    "cimbar:velprintalar": {
      miles: 780,
      baseRisk: "perilous",
      hazards: ["empty frontier roads", "war refugees", "eastern scouts"],
      safetyTags: ["eastern", "coastal", "wilderness"],
      safeSummary:
        "The eastern crossing is long, exposed, and full of rumors from Thay's frontier."
    },
    "eltabbar:velprintalar": {
      miles: 360,
      baseRisk: "perilous",
      hazards: ["border skirmishes", "Red Wizard patrols", "haunted battlefields"],
      safetyTags: ["eastern", "wilderness"],
      safeSummary:
        "Aglarond's shield holds for now, but the road toward Thay is no place for careless travelers."
    },
    "selgaunt:suzail": {
      miles: 260,
      baseRisk: "watchful",
      hazards: ["customs posts", "royal patrols", "merchant spies"],
      safetyTags: ["trade", "northern", "patrolled"],
      safeSummary:
        "Cormyrean patrols and Sembian ledgers keep this road orderly, which also means every traveler is noticed."
    }
  },
  topicLabels: {
    world: "World",
    rumors: "Rumors",
    roads: "Roads",
    local: "Local"
  },
  cities: {
    cimbar: {
      id: "cimbar",
      name: "Cimbar",
      epithet: "Prize City of Chessenta",
      region: "Chessenta",
      map: { x: 47, y: 65 },
      description:
        "A brilliant, fractious city of marble courts, dueling schools, hired captains, and noble houses that know every foreign power is counting their gates.",
      connections: ["arrabar", "soorenar", "velprintalar"],
      tavern: {
        name: "The Bronze Laurel",
        innkeeper: "Ilyra Dathane",
        intro:
          "Ilyra sets down a cup of dark wine and studies whether your purse or your accent will cause more trouble.",
        dialogue: {
          world:
            "The Inner Sea is smiling with all its teeth. Cormyr talks of old rights, Sembia talks of lawful trade, Arrabar talks of holy order, and Chessenta knows all three mean soldiers eventually.",
          rumors:
            "A Cormyrean herald was seen pricing horses near the east gate, then pretending he had never heard the word Soorenar.",
          roads:
            "West takes you to Arrabar and the temples. South runs toward Soorenar, where every claim has a knife behind it. East is a long, hard crossing toward Aglarond.",
          local:
            "Cimbar is rich enough to buy loyalty and proud enough to insult it. Smile politely, pay promptly, and never assume a hired guard is only hired once."
        }
      }
    },
    soorenar: {
      id: "soorenar",
      name: "Soorenar",
      epithet: "The Disputed Crown",
      region: "Chessenta",
      map: { x: 39, y: 86 },
      description:
        "A southern city-kingdom with old royal claims, anxious gates, and a court where every genealogy is treated like a drawn sword.",
      connections: ["cimbar"],
      tavern: {
        name: "The Swan and Spear",
        innkeeper: "Doros Halvren",
        intro:
          "Doros keeps the shutters half-latched even at noon, as if the road itself might listen through the windows.",
        dialogue: {
          world:
            "When great crowns rediscover old bloodlines, small kingdoms discover how heavy parchment can be. Soorenar hears Cormyr's name in too many foreign mouths.",
          rumors:
            "Three nobles have hired extra household guards this tenday, and none of them will say which cousin they fear.",
          roads:
            "The north road back to Cimbar is open, but no checkpoint asks only one question. Carry papers, coin, and a story that survives repetition.",
          local:
            "Soorenar calls itself a kingdom because it remembers being treated as one. That memory is a treasure and a wound."
        }
      }
    },
    arrabar: {
      id: "arrabar",
      name: "Arrabar",
      epithet: "Seat of the Vigilant",
      region: "Vilhon Reach",
      map: { x: 25, y: 56 },
      description:
        "A mercantile holy city where temple writs, trade contracts, and armed orders compete for the same narrow streets.",
      connections: ["cimbar", "selgaunt"],
      tavern: {
        name: "The Gilded Gauntlet",
        innkeeper: "Brother Caldus Merro",
        intro:
          "Caldus polishes a brass holy symbol with one hand and counts dockside gossip with the other.",
        dialogue: {
          world:
            "The faithful want peace, the merchants want certainty, and the high seat wants neither crown nor council strong enough to command it.",
          rumors:
            "A sealed packet from Selgaunt reached the temple before dawn. By breakfast, three priests had changed their travel plans.",
          roads:
            "East to Cimbar is watched by soldiers and supplicants alike. North to Selgaunt is longer, richer, and full of people paid to remember faces.",
          local:
            "Arrabar forgives many sins after confession. Bad accounting is not one of them."
        }
      }
    },
    selgaunt: {
      id: "selgaunt",
      name: "Selgaunt",
      epithet: "Counting-House of Sembia",
      region: "Sembia",
      map: { x: 47, y: 31 },
      description:
        "A rich Sembian port of counting rooms, private guards, sharp contracts, and merchant families who treat rumors as a tradable good.",
      connections: ["arrabar", "suzail"],
      tavern: {
        name: "The Silver Abacus",
        innkeeper: "Nessa Ormblade",
        intro:
          "Nessa has a ledger open before you sit down, though she has the courtesy not to write in it yet.",
        dialogue: {
          world:
            "Sembia has survived shades, crowns, and pious lectures. Coin still moves, and where coin moves, armies eventually follow.",
          rumors:
            "A dozen warehouses near the old quay are buying grain above market. That usually means famine, war, or a merchant who knows both are profitable.",
          roads:
            "West to Suzail has patrols and paperwork. South to Arrabar has caravans, priests, and tolls that multiply after sunset.",
          local:
            "In Selgaunt, an honest bargain is one where everyone understands the trap before signing."
        }
      }
    },
    suzail: {
      id: "suzail",
      name: "Suzail",
      epithet: "Capital of the Forest Kingdom",
      region: "Cormyr",
      map: { x: 32, y: 20 },
      description:
        "Cormyr's royal harbor stands beneath purple banners, orderly streets, and a court newly hungry for glory beyond its borders.",
      connections: ["selgaunt"],
      tavern: {
        name: "The Purple Tankard",
        innkeeper: "Maerun Thistle",
        intro:
          "Maerun lowers his voice whenever a purple cloak passes the window, which is often.",
        dialogue: {
          world:
            "The crown says the realm is secure enough to remember its rights abroad. Veterans hear that and start checking their old boots.",
          rumors:
            "War Wizards have been taking private rooms near the docks. They ask about southern roads and pay in freshly stamped coin.",
          roads:
            "East to Selgaunt is orderly and watched. The patrols keep bandits away, but they also keep questions close.",
          local:
            "Suzail loves law, lineage, and banners. If you cannot offer one, keep your business modest."
        }
      }
    },
    velprintalar: {
      id: "velprintalar",
      name: "Velprintalar",
      epithet: "Bulwark of Aglarond",
      region: "Aglarond",
      map: { x: 78, y: 48 },
      description:
        "A tense eastern city of watchtowers, spell-wards, refugee boats, and soldiers who sleep lightly with Thay across the frontier.",
      connections: ["cimbar", "eltabbar"],
      tavern: {
        name: "The Windward Shield",
        innkeeper: "Savaen Rul",
        intro:
          "Savaen serves tea strong enough to wake the dead, then apologizes for the phrase with a glance eastward.",
        dialogue: {
          world:
            "The west argues over thrones while Aglarond counts patrols. Thay does not need an invitation, only a weak hour.",
          rumors:
            "A fishing crew came in with red wax on its nets and no fish. The harbor master bought their silence badly.",
          roads:
            "West to Cimbar is long and lonely. East toward Eltabbar is shorter, but every mile feels watched by something patient.",
          local:
            "Velprintalar welcomes help, mistrusts strangers, and has learned that both habits keep people alive."
        }
      }
    },
    eltabbar: {
      id: "eltabbar",
      name: "Eltabbar",
      epithet: "Red Seat of Thay",
      region: "Thay",
      map: { x: 92, y: 68 },
      description:
        "A severe city of red-robed masters, silent servants, guarded canals, and power that treats mercy as a negotiable luxury.",
      connections: ["velprintalar"],
      tavern: {
        name: "The Ashen Seal",
        innkeeper: "Kethra Voss",
        intro:
          "Kethra pours without asking your name, then waits to see whether you are foolish enough to volunteer it.",
        dialogue: {
          world:
            "Westerners call Thay a rumor until its ships take their ports. The wise prepare before the red sails are visible.",
          rumors:
            "A zulkir's factor has been buying old sea charts and new chains. No one here mistakes that for scholarship.",
          roads:
            "The road west returns to Velprintalar if the patrols allow it. Leave with papers, witnesses, and no borrowed debts.",
          local:
            "Eltabbar teaches caution quickly. Speak little, owe less, and never make eye contact with someone whose servants do not breathe."
        }
      }
    }
  }
};
