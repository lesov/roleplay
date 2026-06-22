// Player-safe public leader and notable-person records for the world simulation.
// gmNotes stay server-side and are stripped from /api/world-state output.

export const people = {
  cormyr_king_baerovus: {
    id: "cormyr_king_baerovus",
    displayName: "King Baerovus Obarskyr",
    title: "King of Cormyr",
    factionId: "cormyr",
    status: "active",
    race: "Human",
    classOrRole: "Noble Fighter",
    publicSummary: "A young Obarskyr monarch whose court speaks openly of old southern claims.",
    gmNotes: "First Cormyrean conquering-king analog; dies in 1500 to hand the claim to his cousin.",
    tags: ["crown", "obarskyr", "western_wars"]
  },
  cormyr_king_aldren: {
    id: "cormyr_king_aldren",
    displayName: "King Aldren Obarskyr",
    title: "King of Cormyr",
    factionId: "cormyr",
    status: "waiting",
    race: "Human",
    classOrRole: "Noble Warlord",
    publicSummary: "A hard-eyed cousin of the crown with blood claims on Cimbar and Soorenar.",
    gmNotes: "Second Cormyrean claimant king; rules after 1500 until the 1517 succession.",
    tags: ["crown", "obarskyr", "claimant"]
  },
  cormyr_king_corath: {
    id: "cormyr_king_corath",
    displayName: "King Corath Obarskyr",
    title: "King of Cormyr",
    factionId: "cormyr",
    status: "waiting",
    race: "Human",
    classOrRole: "Noble Fighter",
    publicSummary: "A brilliant young heir already praised by soldiers as the future of the Forest Kingdom.",
    gmNotes: "Great king figure; rises in 1517 and is captured in 1527.",
    tags: ["crown", "obarskyr", "great_king"]
  },
  cormyr_marshal_daerov: {
    id: "cormyr_marshal_daerov",
    displayName: "Marshal Daerov Huntsilver",
    title: "Marshal of the Southern Host",
    factionId: "cormyr",
    status: "active",
    race: "Human",
    classOrRole: "Fighter",
    publicSummary: "A beloved field commander whose speed and nerve make Cormyr's southern host dangerous.",
    gmNotes: "Battlefield death should land before Cormyr is expelled from the Vilhon.",
    tags: ["general", "purple_dragons", "western_wars"]
  },
  cormyr_war_wizard_araleth: {
    id: "cormyr_war_wizard_araleth",
    displayName: "Araleth Rowanmantle",
    title: "Senior War Wizard",
    factionId: "cormyr",
    status: "active",
    race: "Human",
    classOrRole: "Wizard",
    publicSummary: "A cool-voiced War Wizard who turns royal policy into battlefield spellcraft.",
    gmNotes: "Reusable Cormyrean arcane face for court, scouting, and battle briefings.",
    tags: ["war_wizard", "court", "arcane"]
  },
  sembia_speaker_mirabet: {
    id: "sembia_speaker_mirabet",
    displayName: "Mirabet Hulorn",
    title: "First Speaker of the Merchant Council",
    factionId: "sembia",
    status: "active",
    race: "Human",
    classOrRole: "Merchant Noble",
    publicSummary: "A Selgaunt magnate whose votes and loans move fleets faster than royal decrees.",
    gmNotes: "Public face of the oligarchy; good contact for Sembian pragmatism.",
    tags: ["merchant_council", "selgaunt", "naval_trade"]
  },
  sembia_factor_orthal: {
    id: "sembia_factor_orthal",
    displayName: "Orthal Daernd",
    title: "Master Factor of Yhaunn",
    factionId: "sembia",
    status: "active",
    race: "Human",
    classOrRole: "Rogue",
    publicSummary: "A broker of contracts, ships, and hired blades whose ledgers carry more weight than banners.",
    gmNotes: "Useful for morally gray Sembian intelligence and finance.",
    tags: ["merchant_council", "yhaunn", "spymaster"]
  },
  church_high_justiciar_maelra: {
    id: "church_high_justiciar_maelra",
    displayName: "High Justiciar Maelra Dawnmantle",
    title: "High Justiciar of Torm",
    factionId: "church_state",
    status: "active",
    race: "Human",
    classOrRole: "Cleric",
    publicSummary: "The stern high seat at Arrabar, keeper of temple armies, writs, and royal blessings.",
    gmNotes: "Church-state ruler; humiliated by sack but can survive as wounded authority.",
    tags: ["tormtar", "arrabar", "faith"]
  },
  church_reformer_caladorn: {
    id: "church_reformer_caladorn",
    displayName: "Brother Caladorn Vey",
    title: "Schism Preacher",
    factionId: "church_state",
    status: "hidden",
    race: "Human",
    classOrRole: "Cleric",
    publicSummary: "A temple-trained preacher whose denunciations against sold blessings spread through market towns.",
    gmNotes: "Schism catalyst; protected in the Dales after 1520.",
    tags: ["schism", "reformer", "preacher"]
  },
  grand_alliance_council: {
    id: "grand_alliance_council",
    displayName: "The Inner Sea Congress",
    title: "Coalition Council",
    factionId: "grand_alliance",
    status: "active",
    race: null,
    classOrRole: "Council",
    publicSummary: "A council of envoys, temple writs, merchant purses, and nervous princes joined against common threats.",
    gmNotes: "Collective leader before consolidation under one overlord.",
    tags: ["coalition", "diplomacy", "council"]
  },
  grand_alliance_overlord_aerovar: {
    id: "grand_alliance_overlord_aerovar",
    displayName: "Aerovar Dathchant",
    title: "Overlord of the Grand Alliance",
    factionId: "grand_alliance",
    status: "waiting",
    race: "Half-Elf",
    classOrRole: "Noble Paladin",
    publicSummary: "A silver-backed heir whose diplomacy binds rival powers beneath one commanding hand.",
    gmNotes: "Alliance unifier; inherits enough claims, money, and legitimacy to become the major rival.",
    tags: ["overlord", "silver", "grand_alliance"]
  },
  dalelands_speaker_merris: {
    id: "dalelands_speaker_merris",
    displayName: "Merris Oakmantle",
    title: "Speaker of the Dales Council",
    factionId: "dalelands",
    status: "active",
    race: "Halfling",
    classOrRole: "Ranger",
    publicSummary: "A plain-spoken council speaker trusted by farms, foresters, and stubborn free towns.",
    gmNotes: "Civilian face of Dale independence.",
    tags: ["dales_council", "free_dales", "ranger"]
  },
  dalelands_captain_tamsin: {
    id: "dalelands_captain_tamsin",
    displayName: "Tamsin Irongate",
    title: "Free-Company Captain",
    factionId: "dalelands",
    status: "active",
    race: "Human",
    classOrRole: "Fighter",
    publicSummary: "A pike captain whose contracts make small Dales companies matter in great-power wars.",
    gmNotes: "Representative of pike prestige, then its decline after 1517 and 1524.",
    tags: ["free_company", "pikes", "mercenary"]
  },
  lords_alliance_open_lord: {
    id: "lords_alliance_open_lord",
    displayName: "Laeral Silverhand",
    title: "Open Lord of Waterdeep",
    factionId: "lords_alliance",
    status: "active",
    race: "Human",
    classOrRole: "Wizard",
    publicSummary: "Waterdeep's Open Lord, whose influence gives the northern alliance a far-carrying voice.",
    gmNotes: "Canon public leader; can remain above the mess while agents move.",
    tags: ["waterdeep", "lords_alliance", "arcane"]
  },
  lords_alliance_prince_vaerlan: {
    id: "lords_alliance_prince_vaerlan",
    displayName: "Prince Vaerlan Thann",
    title: "Northern War-Prince",
    factionId: "lords_alliance",
    status: "active",
    race: "Human",
    classOrRole: "Noble Fighter",
    publicSummary: "An ambitious northern prince with ships, creditors, and a taste for humiliating Cormyr.",
    gmNotes: "Blocked coronation and northern raid figure.",
    tags: ["northern_prince", "war", "waterdeep"]
  },
  amn_councilor_sarveth: {
    id: "amn_councilor_sarveth",
    displayName: "Sarveth Brokengulf",
    title: "Voice of the Council of Six",
    factionId: "amn",
    status: "active",
    race: "Human",
    classOrRole: "Merchant Noble",
    publicSummary: "A masked council voice whose silver fleets buy soldiers long before Amn risks its own banners.",
    gmNotes: "Public proxy for the Council of Six without exposing masked identities.",
    tags: ["council_of_six", "silver", "athkatla"]
  },
  amn_unifier_estavan: {
    id: "amn_unifier_estavan",
    displayName: "Estavan Alard",
    title: "Silver Heir of Amn",
    factionId: "amn",
    status: "waiting",
    race: "Human",
    classOrRole: "Noble Warlock",
    publicSummary: "A ruthless heir whose fortune, ships, and marriage ties make distant wars suddenly affordable.",
    gmNotes: "Feeds into Alliance consolidation and Maztican silver.",
    tags: ["silver", "heir", "grand_alliance"]
  },
  amn_captain_roder: {
    id: "amn_captain_roder",
    displayName: "Roder Marquest",
    title: "Captain of the Western Venture",
    factionId: "amn",
    status: "waiting",
    race: "Human",
    classOrRole: "Fighter",
    publicSummary: "An Amnian captain hired to carry steel and ambition across the western sea.",
    gmNotes: "Maztican expedition face; avoid scaffold terms in public strings.",
    tags: ["maztica", "expedition", "captain"]
  },
  thay_szass_tam: {
    id: "thay_szass_tam",
    displayName: "Szass Tam",
    title: "Lich-Regent of Thay",
    factionId: "thay",
    status: "active",
    race: "Undead Human",
    classOrRole: "Wizard Necromancer",
    publicSummary: "The deathless master of Thay, patient enough to win the Inner Sea one broken frontier at a time.",
    gmNotes: "Canon leader; eastern expansion mastermind.",
    tags: ["thay", "necromancy", "red_wizards"]
  },
  thay_zulkir_vharos: {
    id: "thay_zulkir_vharos",
    displayName: "Vharos Mard",
    title: "Red Wizard Envoy-Admiral",
    factionId: "thay",
    status: "active",
    race: "Human",
    classOrRole: "Wizard",
    publicSummary: "A Red Wizard envoy whose fleets and undead oars bind Thay to corsair havens.",
    gmNotes: "Reusable naval Thayan face and Pirate Isles handler.",
    tags: ["red_wizard", "naval", "corsairs"]
  },
  aglarond_queen_lurathra: {
    id: "aglarond_queen_lurathra",
    displayName: "Queen Lurathra Aerlonde",
    title: "Queen of Aglarond",
    factionId: "aglarond",
    status: "active",
    race: "Half-Elf",
    classOrRole: "Wizard",
    publicSummary: "A tired war-mage queen holding the eastern passes while richer realms look away.",
    gmNotes: "Dies at the 1528 breaking of Aglarond.",
    tags: ["aglarond", "war_mage", "eastern_tide"]
  },
  chessenta_duke_lyrandros: {
    id: "chessenta_duke_lyrandros",
    displayName: "Duke Lyrandros of Cimbar",
    title: "Duke of Cimbar",
    factionId: "chessenta",
    status: "active",
    race: "Human",
    classOrRole: "Noble Fighter",
    publicSummary: "Cimbar's proud duke, rich enough to hire armies and isolated enough to need them.",
    gmNotes: "Exiled/captured figure for early Cimbar beats.",
    tags: ["cimbar", "duke", "exile"]
  },
  chessenta_heir_phaneros: {
    id: "chessenta_heir_phaneros",
    displayName: "Phaneros of Cimbar",
    title: "Heir of Cimbar",
    factionId: "chessenta",
    status: "waiting",
    race: "Human",
    classOrRole: "Noble",
    publicSummary: "The old duke's heir, carried between courts as every army claims to fight for Cimbar's liberty.",
    gmNotes: "Restored in 1514 under Dales backing.",
    tags: ["cimbar", "heir", "restoration"]
  },
  soorenar_queen_almara: {
    id: "soorenar_queen_almara",
    displayName: "Queen Almara Vaunt",
    title: "Claimant Queen of Soorenar",
    factionId: "soorenar",
    status: "active",
    race: "Human",
    classOrRole: "Noble",
    publicSummary: "A disputed claimant whose fragile crown invites every neighbor to call itself protector.",
    gmNotes: "Soorenar succession prize and puppet-crown target.",
    tags: ["soorenar", "claimant", "southern_crown"]
  },
  soorenar_regent_kheld: {
    id: "soorenar_regent_kheld",
    displayName: "Regent Kheld Ruldran",
    title: "Regent of Soorenar",
    factionId: "soorenar",
    status: "waiting",
    race: "Human",
    classOrRole: "Noble Fighter",
    publicSummary: "A hard regent willing to wear any foreign friendship that keeps Soorenar's gates closed.",
    gmNotes: "Can serve as Cormyrean puppet or later compromise ruler.",
    tags: ["soorenar", "regent", "puppet"]
  },
  mulhorand_incarnation_hesire: {
    id: "mulhorand_incarnation_hesire",
    displayName: "Hesireth the Golden Vessel",
    title: "Divine Incarnation of Mulhorand",
    factionId: "mulhorand",
    status: "active",
    race: "Human God-Incarnate",
    classOrRole: "Priest-King",
    publicSummary: "A golden throne-holder revered as a walking vessel of ancient divine authority.",
    gmNotes: "Public belief matters more than objective divine mechanics.",
    tags: ["mulhorand", "god_incarnate", "theocracy"]
  },
  unther_gilgeam: {
    id: "unther_gilgeam",
    displayName: "Gilgeam",
    title: "God-King of Unther",
    factionId: "unther",
    status: "active",
    race: "God-King",
    classOrRole: "Tyrant Warrior",
    publicSummary: "The restored god-king of Unther, feared as much by his own people as by his enemies.",
    gmNotes: "Canon returned tyrant; volatile southeastern wildcard.",
    tags: ["unther", "god_king", "returned_empire"]
  },
  pirate_corsair_nymara: {
    id: "pirate_corsair_nymara",
    displayName: "Nymara Blackwake",
    title: "Corsair-Lord of the Pirate Isles",
    factionId: "pirate_isles",
    status: "active",
    race: "Tiefling",
    classOrRole: "Rogue",
    publicSummary: "A corsair-lord whose ships raid like freebooters and maneuver like someone pays for the pattern.",
    gmNotes: "Thayan-backed naval proxy; public connection should emerge gradually.",
    tags: ["pirate_isles", "corsair", "naval"]
  },
  maztica_speaker_itzel: {
    id: "maztica_speaker_itzel",
    displayName: "Itzel of the Reed Crown",
    title: "Speaker of the Western Resistance",
    factionId: "maztica",
    status: "active",
    race: "Human",
    classOrRole: "Druid",
    publicSummary: "A Maztican speaker rallying scattered towns against foreign silver-hunters and their steel.",
    gmNotes: "Native resistance leader for western theater hooks.",
    tags: ["maztica", "resistance", "druid"]
  }
};

export function clonePeople() {
  return Object.fromEntries(
    Object.entries(people).map(([id, person]) => [
      id,
      {
        ...person,
        tags: [...(person.tags || [])]
      }
    ])
  );
}
