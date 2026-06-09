const LOCATION_CONTACT_NAMES = {
  "sand-court": "Nymor Phoros",
  "duelists-salle": "Master Rhelos Ankar",
  "forum-of-orators": "Dathia Merrow",
  "captains-hall": "Vargos Kline",
  "claimants-court": "Seneschal Jorvan Nemeir",
  "hall-of-lineages": "Archivist Sella Vant",
  "shuttered-market": "Mira Haless",
  "old-royal-wall": "Watch-Captain Orsik",
  "high-temple": "Canon Vaelis Dorn",
  "templar-barracks": "Marshal Sereth Korr",
  "tithe-house": "Ledger-Priest Odran",
  "pilgrim-quay": "Sister Calitha",
  "great-counting-house": "Factor Brelan Morn",
  "carrack-wharves": "Harbor Clerk Tessae",
  "merchant-villa": "Steward Imbrar Sann",
  "contract-court": "Arbiter Jalen Vorr",
  "royal-court": "Court Usher Elian",
  "war-wizards-college": "Scribe Amlar",
  "purple-dragon-barracks": "Sergeant Kael Drann",
  "royal-harbor": "Harbormaster Lysaer",
  "watchtower-wall": "Warden Thaela",
  "war-mages-hall": "Magister Corun",
  "refugee-quays": "Dock-Healer Sellae",
  "wardens-gate": "Gatewarden Rusk",
  "enclave-gate": "Factor Nethros",
  "slave-market": "Registrar Vekra",
  "canal-wharves": "Canal-Master Orreth",
  "factors-house": "Secretary Halvren"
};

const CATEGORY_CONTACT_ROLES = {
  Arena: "Arena Steward",
  Archive: "Archivist",
  Barracks: "Drill Officer",
  Canals: "Canal-Master",
  "Counting-House": "Ledger-Keeper",
  Court: "Court Officer",
  Docks: "Dockmaster",
  Enclave: "Enclave Factor",
  "Factor-House": "Factor's Secretary",
  "Fencing School": "Salle Master",
  Forum: "Forum Speaker",
  Fortifications: "Watch Officer",
  Hall: "Hall Custodian",
  Harbor: "Harbormaster",
  Keep: "Gatewarden",
  Market: "Market Registrar",
  "Mercenary Hall": "Company Broker",
  "Royal Court": "Court Officer",
  Temple: "Temple Officer",
  Villa: "House Steward"
};

function locationContact(location) {
  const name = LOCATION_CONTACT_NAMES[location.id] || "A local attendant";
  return {
    name,
    role: CATEGORY_CONTACT_ROLES[location.category] || "Local Contact",
    intro: `${name} gives you a measured look, then explains what this place means to the city.`,
    dialogue: {
      establishment: location.description
    }
  };
}

function tavernLocation(tavern) {
  return {
    id: tavern.id,
    name: tavern.name,
    category: "Tavern",
    description:
      `${tavern.name} is a common room where travelers, locals, and working folk trade road talk, prices, and news that has reached the city.`,
    contact: {
      name: tavern.innkeeper,
      role: "Innkeeper",
      intro: tavern.intro,
      dialogue: tavern.dialogue
    }
  };
}

function cityLocations(tavern, locations) {
  return [
    tavernLocation(tavern),
    ...locations.map((location) => ({
      ...location,
      contact: locationContact(location)
    }))
  ];
}

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
      locations: cityLocations({
        id: "bronze-laurel",
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
      }, [
        {
          id: "sand-court",
          name: "The Sand Court",
          category: "Arena",
          description:
            "Tiered marble seats climb above a raked sand floor the attendants never quite scrub clean. Between the blood-sports Cimbar argues philosophy here just as fiercely, and a clever orator can leave more bruised than any duelist."
        },
        {
          id: "duelists-salle",
          name: "The Duelists' Salle",
          category: "Fencing School",
          description:
            "Chalk dust and oiled steel hang in the air of Cimbar's most famous fencing school, where the sons of noble houses learn the forms that settle quarrels before any magistrate hears them. Its masters are bought, feared, and now and then hired to settle a quarrel permanently."
        },
        {
          id: "forum-of-orators",
          name: "The Forum of Orators",
          category: "Forum",
          description:
            "A colonnade of weathered marble where Cimbar conducts the business it loves best: talking. Merchants, demagogues, and foreign factors trade rumor and insult beneath statues of heroes the city has already half-forgotten."
        },
        {
          id: "captains-hall",
          name: "The Captains' Hall",
          category: "Mercenary Hall",
          description:
            "A smoke-stained hall near the gates where free-company captains post their banners and their prices. Every claimant in Chessenta hires here, and more than one has discovered too late that a rival hired the same blades first."
        }
      ])
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
      locations: cityLocations({
        id: "swan-and-spear",
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
      }, [
        {
          id: "claimants-court",
          name: "The Claimant's Court",
          category: "Royal Court",
          description:
            "A cramped throne room kept deliberately grand, where Soorenar's rulers receive petitioners beneath a canopy of old battle-flags. Every courtier watches the doors, and every greeting is weighed for the word king."
        },
        {
          id: "hall-of-lineages",
          name: "The Hall of Lineages",
          category: "Archive",
          description:
            "Shelf upon shelf of brittle genealogies, guarded more jealously than the treasury. In Soorenar a bloodline is a weapon, and the archivists here have learned to lie with perfect handwriting."
        },
        {
          id: "shuttered-market",
          name: "The Shuttered Market",
          category: "Market",
          description:
            "A square that does brisk trade behind half-closed shutters, as though commerce itself were best done quietly. The vendors price strangers higher and remember their faces longer."
        },
        {
          id: "old-royal-wall",
          name: "The Old Royal Wall",
          category: "Fortifications",
          description:
            "The city's ancient wall, patched and re-patched, manned by guards who study the northern road as if Cormyr might appear upon it any morning. From the rampart you can see exactly how small a kingdom Soorenar truly is."
        }
      ])
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
      locations: cityLocations({
        id: "gilded-gauntlet",
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
      }, [
        {
          id: "high-temple",
          name: "The High Temple of Torm",
          category: "Temple",
          description:
            "The marble heart of the Church of Torm the Vigilant, where templars in burnished mail keep watch over an altar that has crowned and uncrowned kings. Pilgrims kneel in its nave while clerks in the side-chapels count the tithes of a dozen realms."
        },
        {
          id: "templar-barracks",
          name: "The Templar Barracks",
          category: "Barracks",
          description:
            "Ordered ranks of cots, drilling yards, and racked halberds house the Church's own soldiers. The men here answer to no crown, only to the high seat, and they know precisely what that independence is worth."
        },
        {
          id: "tithe-house",
          name: "The Tithe-House",
          category: "Counting-House",
          description:
            "A fortified counting-house where the faith's wealth is weighed, recorded, and lent. Here a churchman will tell you that good accounting is itself a form of devotion, and in Arrabar he is not entirely joking."
        },
        {
          id: "pilgrim-quay",
          name: "The Pilgrim Quay",
          category: "Docks",
          description:
            "A crowded wharf where pilgrim barges unload the faithful alongside crates of incense, grain, and less holy cargo. The dockside priests bless arrivals and inspect their purses with the same practiced glance."
        }
      ])
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
      locations: cityLocations({
        id: "silver-abacus",
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
      }, [
        {
          id: "great-counting-house",
          name: "The Great Counting-House",
          category: "Counting-House",
          description:
            "A cathedral of commerce in all but name, its long halls lined with ledgers, money-changers, and the quiet scratch of a hundred pens. Half the crowns of Faerun owe paper that is filed somewhere in these rooms."
        },
        {
          id: "carrack-wharves",
          name: "The Carrack Wharves",
          category: "Docks",
          description:
            "Forests of masts crowd the Selgauntan waterfront, where Sembian carracks load and unload the trade of the whole Inner Sea. Nothing moves here without a fee, a tally, and someone taking note."
        },
        {
          id: "merchant-villa",
          name: "A Counting-Family Villa",
          category: "Villa",
          description:
            "The walled townhouse of one of Selgaunt's merchant dynasties, where business is done over wine and the guards outnumber the servants. An invitation here is an honor that usually costs the guest more than the host."
        },
        {
          id: "contract-court",
          name: "The Contract Court",
          category: "Court",
          description:
            "A dim hall of arbiters where Sembia settles its disputes the civilized way, with sealed contracts and ruinous penalties. Wise visitors read every clause twice, since the city's idea of an honest bargain is one where the trap was disclosed in advance."
        }
      ])
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
      locations: cityLocations({
        id: "purple-tankard",
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
      }, [
        {
          id: "royal-court",
          name: "The Royal Court",
          category: "Royal Court",
          description:
            "Beneath purple banners and the watchful eyes of courtiers, the Obarskyr court conducts the business of a kingdom rediscovering its ambition. The talk these days is less of defense than of old rights and crowns across the sea."
        },
        {
          id: "war-wizards-college",
          name: "The War Wizards' College",
          category: "College",
          description:
            "A guarded precinct of warded doors and quiet apprentices, home to the dread War Wizards whose battle-magic no rival can match in open field. Visitors are watched by spells they will never see and rarely invited past the threshold."
        },
        {
          id: "purple-dragon-barracks",
          name: "The Purple Dragon Barracks",
          category: "Barracks",
          description:
            "Drill-yards ring with the tramp of Cormyr's famous legions, disciplined, loyal, and visibly itching for a campaign. The veterans here remember old wars; the young officers can hardly wait for a new one."
        },
        {
          id: "royal-harbor",
          name: "The Royal Harbor",
          category: "Harbor",
          description:
            "Suzail's orderly harbor bristles with naval pennants and customs clerks, every hull logged and every cargo taxed. It is the kind of harbor that makes a merchant feel safe and watched in equal measure."
        }
      ])
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
      locations: cityLocations({
        id: "windward-shield",
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
      }, [
        {
          id: "watchtower-wall",
          name: "The Watchtower Wall",
          category: "Fortifications",
          description:
            "A grim curtain of stone and spell-ward facing east, manned day and night by soldiers who sleep in their armor. From the parapet the frontier with Thay looks deceptively quiet."
        },
        {
          id: "war-mages-hall",
          name: "The Hall of War-Mages",
          category: "Hall",
          description:
            "The austere hall of Aglarond's war-mages, heirs to the tradition that has thrown the Red Wizards back for three centuries. They train without ceremony here, knowing the line holds only as long as they do."
        },
        {
          id: "refugee-quays",
          name: "The Refugee Quays",
          category: "Docks",
          description:
            "Crowded jetties where fishing boats and refugee craft put in from the contested eastern shore. The harbor-folk trade in rumor and red wax, and grief has made some of them merciful and others sharp."
        },
        {
          id: "wardens-gate",
          name: "The Warden's Gate",
          category: "Keep",
          description:
            "The studded gate of the citadel from which Aglarond's witch-rulers have long defied Thay. Petitioners wait under the arch beside soldiers who measure every stranger against the threat across the water."
        }
      ])
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
      locations: cityLocations({
        id: "ashen-seal",
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
      }, [
        {
          id: "enclave-gate",
          name: "The Red Enclave Gate",
          category: "Enclave",
          description:
            "The lacquered gate of a Red Wizard enclave, flanked by silent guards and wards that prickle the skin. Beyond it lie courtyards no outsider sees twice, and servants who do not seem to breathe."
        },
        {
          id: "slave-market",
          name: "The Slave Market",
          category: "Market",
          description:
            "A grim plaza where Thay trades the bodies that fuel its endless ambitions, conducted with the cold efficiency of a grain exchange. Foreigners are advised to keep their eyes down and their papers in order."
        },
        {
          id: "canal-wharves",
          name: "The Canal Wharves",
          category: "Canals",
          description:
            "Guarded canals thread the city, their black water carrying barges of goods, secrets, and things best not named. The wharf-masters note every hull and forget nothing."
        },
        {
          id: "factors-house",
          name: "A Zulkir's Factor-House",
          category: "Factor-House",
          description:
            "The fortified townhouse of a zulkir's factor, where Thayan gold buys charts, chains, and influence in cities far to the west. Business here is brief, exact, and never quite as scholarly as it pretends."
        }
      ])
    }
  }
};
