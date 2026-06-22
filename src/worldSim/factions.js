export const factions = {
  cormyr: {
    id: "cormyr",
    displayName: "Cormyr",
    government: "Hereditary monarchy under House Obarskyr, supported by Purple Dragons and War Wizards.",
    leaderIds: ["cormyr_king_baerovus"],
    keyFigureIds: ["cormyr_marshal_daerov", "cormyr_war_wizard_araleth"],
    treasury: 65,
    armyStrength: 82,
    navyStrength: 28,
    prestige: 86,
    territory: ["suzail"],
    relations: {
      sembia: "truce",
      church_state: "truce",
      grand_alliance: "truce",
      thay: "hostile"
    },
    flags: ["ambitious_crown"]
  },
  grand_alliance: {
    id: "grand_alliance",
    displayName: "The Grand Alliance",
    government: "Loose coalition council of envoys, creditors, temple writs, and allied princes.",
    leaderIds: ["grand_alliance_council"],
    keyFigureIds: [],
    treasury: 74,
    armyStrength: 72,
    navyStrength: 68,
    prestige: 76,
    territory: [],
    relations: {
      cormyr: "truce",
      thay: "hostile"
    },
    flags: ["loose_coalition"]
  },
  sembia: {
    id: "sembia",
    displayName: "Sembia",
    government: "Merchant republic governed by shifting councils of wealthy trading families.",
    leaderIds: ["sembia_speaker_mirabet"],
    keyFigureIds: ["sembia_factor_orthal"],
    treasury: 92,
    armyStrength: 44,
    navyStrength: 78,
    prestige: 63,
    territory: ["selgaunt", "yhaunn"],
    relations: {
      cormyr: "truce",
      church_state: "truce",
      thay: "hostile"
    },
    flags: ["merchant_oligarchy"]
  },
  church_state: {
    id: "church_state",
    displayName: "The Church of Torm",
    government: "Territorial high church seated at Arrabar, ruled by temple hierarchy and legal writ.",
    leaderIds: ["church_high_justiciar_maelra"],
    keyFigureIds: [],
    treasury: 70,
    armyStrength: 54,
    navyStrength: 32,
    prestige: 88,
    territory: ["arrabar"],
    relations: {
      cormyr: "truce",
      sembia: "truce",
      grand_alliance: "truce"
    },
    flags: ["kingmaker"]
  },
  dalelands: {
    id: "dalelands",
    displayName: "The Dalelands",
    government: "Independent dales and councils, loosely coordinated by free towns and local speakers.",
    leaderIds: ["dalelands_speaker_merris"],
    keyFigureIds: ["dalelands_captain_tamsin"],
    treasury: 42,
    armyStrength: 76,
    navyStrength: 8,
    prestige: 72,
    territory: ["shadowdale", "mistledale"],
    relations: {
      cormyr: "truce",
      sembia: "truce"
    },
    flags: ["free_companies"]
  },
  lords_alliance: {
    id: "lords_alliance",
    displayName: "The Lords' Alliance",
    government: "League of northern cities and rulers, led in practice by Waterdeep's influence.",
    leaderIds: ["lords_alliance_open_lord"],
    keyFigureIds: ["lords_alliance_prince_vaerlan"],
    treasury: 77,
    armyStrength: 66,
    navyStrength: 82,
    prestige: 84,
    territory: ["waterdeep", "neverwinter"],
    relations: {
      cormyr: "truce",
      grand_alliance: "truce",
      thay: "hostile"
    },
    flags: ["waterdeep_led"]
  },
  amn: {
    id: "amn",
    displayName: "Amn",
    government: "Merchant oligarchy ruled by the secretive Council of Six.",
    leaderIds: ["amn_councilor_sarveth"],
    keyFigureIds: ["amn_unifier_estavan", "amn_captain_roder"],
    treasury: 89,
    armyStrength: 58,
    navyStrength: 74,
    prestige: 61,
    territory: ["athkatla"],
    relations: {
      cormyr: "truce",
      grand_alliance: "ally",
      sembia: "truce"
    },
    flags: ["silver_fleets"]
  },
  thay: {
    id: "thay",
    displayName: "Thay",
    government: "Undead magocracy ruled by Szass Tam and administered through Red Wizard power.",
    leaderIds: ["thay_szass_tam"],
    keyFigureIds: ["thay_zulkir_vharos"],
    treasury: 76,
    armyStrength: 86,
    navyStrength: 66,
    prestige: 58,
    territory: ["eltabbar"],
    relations: {
      cormyr: "hostile",
      grand_alliance: "hostile",
      aglarond: "war",
      sembia: "hostile"
    },
    flags: ["eastern_tide"]
  },
  aglarond: {
    id: "aglarond",
    displayName: "Aglarond",
    government: "Embattled monarchy and war-mage court guarding the eastern passes.",
    leaderIds: ["aglarond_queen_lurathra"],
    keyFigureIds: [],
    treasury: 38,
    armyStrength: 62,
    navyStrength: 24,
    prestige: 70,
    territory: ["velprintalar"],
    relations: {
      thay: "war",
      cormyr: "truce"
    },
    flags: ["eastern_bulwark"]
  },
  chessenta: {
    id: "chessenta",
    displayName: "Chessenta",
    government: "Fractious league of rival city-states and city lords.",
    leaderIds: ["chessenta_duke_lyrandros"],
    keyFigureIds: ["chessenta_heir_phaneros"],
    treasury: 68,
    armyStrength: 52,
    navyStrength: 55,
    prestige: 66,
    territory: ["cimbar", "airspur"],
    relations: {
      cormyr: "truce",
      grand_alliance: "truce"
    },
    flags: ["divided_city_states"]
  },
  soorenar: {
    id: "soorenar",
    displayName: "Soorenar",
    government: "Disputed city-kingdom whose crown is contested by claimants and protectors.",
    leaderIds: ["soorenar_queen_almara"],
    keyFigureIds: ["soorenar_regent_kheld"],
    treasury: 54,
    armyStrength: 48,
    navyStrength: 36,
    prestige: 59,
    territory: ["soorenar"],
    relations: {
      cormyr: "truce",
      amn: "truce"
    },
    flags: ["disputed_crown"]
  },
  mulhorand: {
    id: "mulhorand",
    displayName: "Mulhorand",
    government: "Ancient theocracy of divine incarnations and temple authority.",
    leaderIds: ["mulhorand_incarnation_hesire"],
    keyFigureIds: [],
    treasury: 80,
    armyStrength: 70,
    navyStrength: 40,
    prestige: 82,
    territory: ["skuld"],
    relations: {
      thay: "hostile",
      unther: "hostile"
    },
    flags: ["ancient_thrones"]
  },
  unther: {
    id: "unther",
    displayName: "Unther",
    government: "Restored god-kingdom ruled by Gilgeam's personal command.",
    leaderIds: ["unther_gilgeam"],
    keyFigureIds: [],
    treasury: 52,
    armyStrength: 64,
    navyStrength: 30,
    prestige: 55,
    territory: ["unthalass"],
    relations: {
      mulhorand: "hostile",
      thay: "truce"
    },
    flags: ["returned_empire"]
  },
  pirate_isles: {
    id: "pirate_isles",
    displayName: "The Pirate Isles",
    government: "Corsair havens ruled by shifting pirate captains and sea-lords.",
    leaderIds: ["pirate_corsair_nymara"],
    keyFigureIds: [],
    treasury: 48,
    armyStrength: 34,
    navyStrength: 72,
    prestige: 35,
    territory: ["pirate_isles"],
    relations: {
      thay: "secret_pact",
      sembia: "hostile",
      grand_alliance: "hostile"
    },
    flags: ["corsair_havens"]
  },
  maztica: {
    id: "maztica",
    displayName: "Maztica",
    government: "Distant contested lands of native polities, foreign factors, and resistance leaders.",
    leaderIds: ["maztica_speaker_itzel"],
    keyFigureIds: ["amn_captain_roder"],
    treasury: 62,
    armyStrength: 50,
    navyStrength: 10,
    prestige: 68,
    territory: ["true_world_ports"],
    relations: {
      amn: "hostile"
    },
    flags: ["distant_theater"]
  }
};

export function cloneFactions() {
  return Object.fromEntries(
    Object.entries(factions).map(([id, faction]) => [
      id,
      {
        ...faction,
        leaderIds: [...(faction.leaderIds || [])],
        keyFigureIds: [...(faction.keyFigureIds || [])],
        territory: [...faction.territory],
        relations: { ...faction.relations },
        flags: [...faction.flags]
      }
    ])
  );
}
