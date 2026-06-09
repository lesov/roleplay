export const timelineEvents = [
  {
    id: "evt_southern_claim",
    fire: { year: 1496, month: "Eleint", day: 18 },
    category: "war",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "Cormyr's banners move south.",
      summary:
        "The Forest Kingdom revives an old claim on Soorenar, and Chessentan cities begin weighing surrender against ruin.",
      newsSources: ["caravan_rumor", "tavern_talk"]
    },
    rumor: {
      originCityId: "suzail",
      text:
        "Riders out of Suzail say purple banners are mustering for the southern road, though every teller disagrees on how far the crown means to march."
    },
    effects: {
      setFlags: ["cormyr_southern_claim", "western_wars_stirring"],
      factionDeltas: [
        { faction: "cormyr", field: "armyStrength", op: "add", value: 5 },
        { faction: "cormyr", field: "prestige", op: "add", value: 4 },
        { faction: "soorenar", field: "prestige", op: "sub", value: 8 }
      ],
      relations: [
        { a: "cormyr", b: "soorenar", value: "war" },
        { a: "cormyr", b: "chessenta", value: "hostile" }
      ]
    }
  },
  {
    id: "evt_inner_sea_league",
    fire: { year: 1497, festival: "Greengrass" },
    category: "war",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "The Inner Sea powers league against Cormyr.",
      summary:
        "Sembian gold, temple writs, and nervous city councils combine after a bloody retreat-road battle leaves no side satisfied.",
      newsSources: ["merchant_dispatch", "tavern_talk"]
    },
    rumor: {
      originCityId: "selgaunt",
      text:
        "Merchants whisper that Sembian gold and temple writs are binding frightened powers into a league against Cormyr."
    },
    effects: {
      setFlags: ["first_grand_alliance_forms"],
      factionDeltas: [
        { faction: "grand_alliance", field: "prestige", op: "add", value: 8 },
        { faction: "cormyr", field: "armyStrength", op: "sub", value: 6 }
      ],
      relations: [
        { a: "cormyr", b: "grand_alliance", value: "war" },
        { a: "sembia", b: "church_state", value: "ally" },
        { a: "sembia", b: "amn", value: "ally" }
      ]
    }
  },
  {
    id: "evt_cormyr_succession",
    fire: { year: 1500, month: "Tarsakh", day: 1 },
    category: "succession",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "A new Obarskyr inherits old wars.",
      summary:
        "Cormyr's crown passes to a harder claimant, and court heralds add Cimbar to the kingdom's list of grievances.",
      newsSources: ["court_rumor", "war_wizard_sending"]
    },
    rumor: {
      originCityId: "suzail",
      text:
        "Court talk from Suzail says a new Obarskyr has taken the crown and is listening closely to old claims on Cimbar."
    },
    effects: {
      setFlags: ["cormyr_new_claimant", "cimbar_claim_active"],
      factionDeltas: [{ faction: "cormyr", field: "prestige", op: "add", value: 6 }]
    }
  },
  {
    id: "evt_cimbar_taken",
    fire: { year: 1501, month: "Eleint", day: 1 },
    category: "territory",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "Cimbar falls to Cormyr.",
      summary:
        "Cormyrean troops depose Cimbar's duke, while quiet treaties divide southern spoils behind closed doors.",
      newsSources: ["caravan_rumor", "merchant_dispatch"]
    },
    rumor: {
      originCityId: "cimbar",
      text:
        "Refugees and hired blades agree on one thing: Cimbar's old lord is gone, and Cormyrean soldiers hold the gates."
    },
    effects: {
      setFlags: ["cimbar_under_cormyr"],
      factionDeltas: [
        { faction: "cormyr", field: "prestige", op: "add", value: 10 },
        { faction: "chessenta", field: "prestige", op: "sub", value: 10 }
      ],
      territory: [
        { faction: "chessenta", op: "remove", value: "cimbar" },
        { faction: "cormyr", op: "add", value: "cimbar" }
      ]
    }
  },
  {
    id: "evt_thayan_ports",
    fire: { year: 1502, month: "Eleasis", day: 16 },
    category: "naval",
    storyline: "eastern_tide",
    protected: true,
    presentation: {
      headline: "Thayan sails darken the Wizards' Reach.",
      summary:
        "Red Wizard fleets and hired corsairs seize Sembian trading ports, proving the eastern war is no border rumor.",
      newsSources: ["ship_news", "merchant_dispatch"]
    },
    rumor: {
      originCityId: "velprintalar",
      text:
        "Sailors out of the east say Thayan galleys have taken ports along the Wizards' Reach and that the west is slow to care."
    },
    effects: {
      setFlags: ["thay_seizes_eastern_ports"],
      factionDeltas: [
        { faction: "thay", field: "navyStrength", op: "add", value: 8 },
        { faction: "sembia", field: "treasury", op: "sub", value: 12 }
      ],
      relations: [{ a: "thay", b: "sembia", value: "war" }]
    }
  },
  {
    id: "evt_southern_spoils_break",
    fire: { year: 1505, month: "Tarsakh", day: 3 },
    category: "war",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "Smokepowder breaks Cormyr's southern host.",
      summary:
        "Amnian-backed companies rout Cormyr's garrisons with massed handgonnes, and Soorenar passes into Alliance hands.",
      newsSources: ["soldier_tale", "tavern_talk"]
    },
    rumor: {
      originCityId: "soorenar",
      text:
        "Soldiers coming north swear the new handgonnes tore open Cormyr's charge near Soorenar and changed the sound of battle."
    },
    effects: {
      setFlags: ["smokepowder_age_begins", "soorenar_under_alliance"],
      factionDeltas: [
        { faction: "cormyr", field: "armyStrength", op: "sub", value: 14 },
        { faction: "amn", field: "prestige", op: "add", value: 8 }
      ],
      territory: [
        { faction: "soorenar", op: "remove", value: "soorenar" },
        { faction: "amn", op: "add", value: "soorenar" }
      ]
    }
  },
  {
    id: "evt_partition_league",
    fire: { year: 1510, month: "Nightal", day: 1 },
    category: "war",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "A secret league turns on Sembia.",
      summary:
        "The richest republic on the Inner Sea finds itself surrounded by partners who have begun calling it a prize.",
      newsSources: ["merchant_dispatch", "court_rumor"]
    },
    rumor: {
      originCityId: "arrabar",
      text:
        "Quiet men from Arrabar say the great powers have stopped admiring Sembia's wealth and started measuring it."
    },
    effects: {
      setFlags: ["first_great_war_active", "sembia_partition_plots"],
      relations: [
        { a: "sembia", b: "grand_alliance", value: "war" },
        { a: "sembia", b: "cormyr", value: "war" }
      ]
    }
  },
  {
    id: "evt_sembia_mainland_collapses",
    fire: { year: 1511, month: "Mirtul", day: 14 },
    category: "territory",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "Sembia's mainland holdings collapse.",
      summary:
        "Cormyr smashes Sembia's field army; only the home cities and counting-houses keep the republic standing.",
      newsSources: ["merchant_dispatch", "tavern_talk"]
    },
    rumor: {
      originCityId: "selgaunt",
      text:
        "Sembian teamsters say the mainland roads are broken, and only the rich cities still keep the republic on its feet."
    },
    effects: {
      setFlags: ["sembia_mainland_lost"],
      factionDeltas: [
        { faction: "sembia", field: "armyStrength", op: "mul", value: 0.55 },
        { faction: "sembia", field: "prestige", op: "sub", value: 16 },
        { faction: "cormyr", field: "prestige", op: "add", value: 8 }
      ]
    }
  },
  {
    id: "evt_church_flips",
    fire: { year: 1512, month: "Alturiak", day: 11 },
    category: "reveal",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "Arrabar turns against Cormyr.",
      summary:
        "The Church of Torm declares that no crown may master the Inner Sea alone, and Sembia is welcomed back into the league that wounded it.",
      newsSources: ["temple_proclamation", "merchant_dispatch"]
    },
    rumor: {
      originCityId: "arrabar",
      text:
        "Temple messengers out of Arrabar say the high seat has cooled toward Cormyr and is blessing new friends with old enemies."
    },
    effects: {
      setFlags: ["holy_league_against_cormyr"],
      relations: [
        { a: "church_state", b: "cormyr", value: "war" },
        { a: "church_state", b: "sembia", value: "ally" },
        { a: "sembia", b: "grand_alliance", value: "ally" }
      ]
    }
  },
  {
    id: "evt_cormyr_expelled",
    fire: { year: 1514, month: "Tarsakh", day: 11 },
    category: "war",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "Cormyr wins a battle and loses the Reach.",
      summary:
        "A brilliant Cormyrean marshal dies in victory, and Dalelands companies help drive the crown's army from the Vilhon.",
      newsSources: ["soldier_tale", "caravan_rumor"]
    },
    rumor: {
      originCityId: "cimbar",
      text:
        "Bloodied companies say Cormyr won a field and lost the Reach, with its best marshal dead and Dalelands pikes everywhere."
    },
    effects: {
      setFlags: ["cormyr_expelled_from_vilhon", "dalelands_prestige_peak"],
      factionDeltas: [
        { faction: "cormyr", field: "armyStrength", op: "sub", value: 10 },
        { faction: "dalelands", field: "prestige", op: "add", value: 14 }
      ],
      territory: [
        { faction: "cormyr", op: "remove", value: "cimbar" },
        { faction: "chessenta", op: "add", value: "cimbar" }
      ]
    }
  },
  {
    id: "evt_lords_alliance_raids",
    fire: { year: 1515, month: "Eleasis", day: 16 },
    category: "war",
    storyline: "western_wars",
    protected: false,
    presentation: {
      headline: "The Lords' Alliance raids Cormyr's flank.",
      summary:
        "Waterdhavian coin and northern ships enter the war just long enough to make Cormyr bleed on another front.",
      newsSources: ["ship_news", "tavern_talk"]
    },
    rumor: {
      originCityId: "suzail",
      text:
        "Cormyrean sailors complain that northern ships and Waterdhavian coin have made the kingdom bleed far from the southern fields."
    },
    effects: {
      setFlags: ["lords_alliance_enters_war"],
      factionDeltas: [
        { faction: "lords_alliance", field: "prestige", op: "add", value: 5 },
        { faction: "cormyr", field: "armyStrength", op: "sub", value: 8 }
      ],
      relations: [{ a: "lords_alliance", b: "cormyr", value: "war" }]
    }
  },
  {
    id: "evt_cormyr_great_king",
    fire: { year: 1517, month: "Eleint", day: 13 },
    category: "succession",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "Cormyr's new king retakes Cimbar.",
      summary:
        "A fierce young monarch breaks the Dalelands' mercenary myth in a two-day slaughter and restores Cormyr's claim by force.",
      newsSources: ["court_rumor", "soldier_tale"]
    },
    rumor: {
      originCityId: "cimbar",
      text:
        "Every wounded veteran has a different count of the dead, but all agree Cormyr's young king has taken Cimbar back."
    },
    effects: {
      setFlags: ["cormyr_great_king", "first_great_war_ending"],
      factionDeltas: [
        { faction: "cormyr", field: "prestige", op: "add", value: 16 },
        { faction: "dalelands", field: "prestige", op: "sub", value: 12 }
      ],
      territory: [
        { faction: "chessenta", op: "remove", value: "cimbar" },
        { faction: "cormyr", op: "add", value: "cimbar" }
      ]
    }
  },
  {
    id: "evt_fragile_peace",
    fire: { year: 1518, month: "Eleasis", day: 13 },
    category: "diplomacy",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "The Inner Sea exhales into a fragile peace.",
      summary:
        "The first great war quiets, but Amn's silver and Sembia's ledgers are being gathered under a colder Alliance hand.",
      newsSources: ["merchant_dispatch", "court_rumor"]
    },
    rumor: {
      originCityId: "arrabar",
      text:
        "Caravan factors say the great war has quieted, though nobody with coin believes the peace is more than a pause."
    },
    effects: {
      setFlags: ["first_great_war_closed", "alliance_unifier_rising"],
      relations: [
        { a: "cormyr", b: "grand_alliance", value: "truce" },
        { a: "cormyr", b: "sembia", value: "truce" }
      ]
    }
  },
  {
    id: "evt_great_schism",
    fire: { year: 1519, festival: "Feast of the Moon" },
    category: "schism",
    storyline: "schism",
    protected: true,
    presentation: {
      headline: "The Great Schism begins.",
      summary:
        "A renegade priest's denunciations spread from temple doors to market squares, and princes begin seizing church lands.",
      newsSources: ["temple_proclamation", "tavern_talk"]
    },
    rumor: {
      originCityId: "arrabar",
      text:
        "Temple doors and market mouths carry the same shock: a priest has denounced the old order, and copies are spreading faster than sermons."
    },
    effects: {
      setFlags: ["great_schism_active", "reform_sects_spread"],
      factionDeltas: [
        { faction: "church_state", field: "treasury", op: "sub", value: 12 },
        { faction: "church_state", field: "prestige", op: "sub", value: 12 },
        { faction: "dalelands", field: "treasury", op: "add", value: 10 }
      ]
    }
  },
  {
    id: "evt_alliance_consolidates",
    fire: { year: 1521, month: "Eleint", day: 20 },
    category: "discovery",
    storyline: "new_world",
    protected: true,
    presentation: {
      headline: "The Grand Alliance finds one voice.",
      summary:
        "Sembian gold, Amnian silver, temple authority, and Dalelands levies answer a single overlord as bold ships seek new Maztican coasts.",
      newsSources: ["ship_news", "merchant_dispatch"]
    },
    rumor: {
      originCityId: "selgaunt",
      text:
        "Sembian clerks say too many ledgers now answer to one Alliance hand, and westbound captains are being paid for stranger voyages."
    },
    effects: {
      setFlags: ["grand_alliance_consolidated", "maztica_rush_begins"],
      factionDeltas: [
        { faction: "grand_alliance", field: "treasury", op: "add", value: 18 },
        { faction: "amn", field: "treasury", op: "add", value: 16 }
      ],
      relations: [
        { a: "grand_alliance", b: "amn", value: "ally" },
        { a: "grand_alliance", b: "sembia", value: "ally" }
      ]
    }
  },
  {
    id: "evt_second_great_war",
    fire: { year: 1523, month: "Eleasis", day: 1 },
    category: "war",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "The Second Great War begins.",
      summary:
        "Cormyr and the consolidated Grand Alliance abandon diplomacy and drag the Inner Sea into a war for mastery.",
      newsSources: ["court_rumor", "tavern_talk"]
    },
    rumor: {
      originCityId: "suzail",
      text:
        "The road out of Suzail is full of requisitions and hard faces; folk say Cormyr and the Alliance have run out of patient words."
    },
    effects: {
      setFlags: ["second_great_war_active"],
      relations: [{ a: "cormyr", b: "grand_alliance", value: "war" }]
    }
  },
  {
    id: "evt_firearms_and_island",
    fire: { year: 1524, month: "Tarsakh", day: 27 },
    category: "war",
    storyline: "eastern_tide",
    protected: true,
    presentation: {
      headline: "Guns rule the field, and Thay takes an island fortress.",
      summary:
        "Alliance columns break Dalelands pikes near Cimbar while Thayan fleets storm a fortified holy-order island in the Inner Sea.",
      newsSources: ["soldier_tale", "ship_news"]
    },
    rumor: {
      originCityId: "cimbar",
      text:
        "Veterans near Cimbar say pikes no longer frighten guns, while sailors claim Thay has taken a fortress out on the Inner Sea."
    },
    effects: {
      setFlags: ["pikes_obsolete", "thay_takes_island_fortress"],
      factionDeltas: [
        { faction: "dalelands", field: "armyStrength", op: "mul", value: 0.65 },
        { faction: "thay", field: "navyStrength", op: "add", value: 8 }
      ],
      territory: [
        { faction: "cormyr", op: "remove", value: "cimbar" },
        { faction: "grand_alliance", op: "add", value: "cimbar" }
      ]
    }
  },
  {
    id: "evt_king_captured",
    fire: { year: 1527, month: "Alturiak", day: 24 },
    category: "war",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "The King is taken.",
      summary:
        "Cormyr's host is shattered in the south, and the crown sits captive in an enemy camp while regents bargain in panic.",
      newsSources: ["war_wizard_sending", "soldier_tale"]
    },
    rumor: {
      originCityId: "cimbar",
      text:
        "No one says it loudly near loyal ears, but the rumor is everywhere: Cormyr's king was taken alive beneath Cimbar's walls."
    },
    effects: {
      setFlags: ["cormyr_king_captured", "regency_crisis"],
      factionDeltas: [
        { faction: "cormyr", field: "armyStrength", op: "mul", value: 0.55 },
        { faction: "cormyr", field: "prestige", op: "sub", value: 22 },
        { faction: "grand_alliance", field: "prestige", op: "add", value: 12 }
      ]
    }
  },
  {
    id: "evt_aglarond_breaks",
    fire: { year: 1528, month: "Eleasis", day: 29 },
    category: "war",
    storyline: "eastern_tide",
    protected: true,
    presentation: {
      headline: "Aglarond breaks before Thay.",
      summary:
        "The eastern shield is destroyed in one terrible field battle, its monarch dead and its passes open to the Red Wizards.",
      newsSources: ["refugee_rumor", "war_wizard_sending"]
    },
    rumor: {
      originCityId: "velprintalar",
      text:
        "Refugees from Aglarond say the eastern shield has cracked and the Red Wizards are coming through the passes."
    },
    effects: {
      setFlags: ["aglarond_destroyed", "thay_pours_west"],
      factionDeltas: [
        { faction: "aglarond", field: "armyStrength", op: "mul", value: 0.2 },
        { faction: "aglarond", field: "prestige", op: "sub", value: 35 },
        { faction: "thay", field: "prestige", op: "add", value: 18 }
      ],
      territory: [
        { faction: "aglarond", op: "remove", value: "velprintalar" },
        { faction: "thay", op: "add", value: "velprintalar" }
      ]
    }
  },
  {
    id: "evt_arrabar_sacked",
    fire: { year: 1529, month: "Mirtul", day: 6 },
    category: "schism",
    storyline: "schism",
    protected: true,
    presentation: {
      headline: "Arrabar burns.",
      summary:
        "Unpaid, schism-radicalized mercenaries sack the Church of Torm's holy seat, shocking every faithful court in Faerûn.",
      newsSources: ["temple_proclamation", "refugee_rumor"]
    },
    rumor: {
      originCityId: "arrabar",
      text:
        "Smoke-stained pilgrims say Arrabar was sacked by unpaid soldiers, and even hardened merchants lower their voices at the telling."
    },
    effects: {
      setFlags: ["arrabar_sacked", "church_state_humiliated"],
      factionDeltas: [
        { faction: "church_state", field: "prestige", op: "sub", value: 28 },
        { faction: "grand_alliance", field: "prestige", op: "sub", value: 10 }
      ]
    }
  },
  {
    id: "evt_eastern_siege_repulsed",
    fire: { year: 1531, month: "Eleint", day: 1 },
    category: "war",
    storyline: "eastern_tide",
    protected: true,
    presentation: {
      headline: "The great eastern siege is repulsed.",
      summary:
        "Thay reaches the gate-city of the east and is thrown back bloodily, leaving the frontier alive but badly wounded.",
      newsSources: ["war_wizard_sending", "caravan_rumor"]
    },
    rumor: {
      originCityId: "velprintalar",
      text:
        "Aglarond's survivors say the eastern siege has been thrown back, though every victory feast sounds too tired to last."
    },
    effects: {
      setFlags: ["eastern_siege_repulsed", "thay_overextended"],
      factionDeltas: [
        { faction: "thay", field: "armyStrength", op: "sub", value: 12 },
        { faction: "grand_alliance", field: "prestige", op: "add", value: 8 }
      ]
    }
  },
  {
    id: "evt_alliance_crowned",
    fire: { year: 1532, month: "Alturiak", day: 24 },
    category: "diplomacy",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "The Alliance overlord is crowned.",
      summary:
        "Arrabar's wounded hierarchy reconciles just enough to bless the Grand Alliance's supremacy over the Vilhon.",
      newsSources: ["temple_proclamation", "court_rumor"]
    },
    rumor: {
      originCityId: "arrabar",
      text:
        "Priests in Arrabar have blessed the Alliance's overlord, and taverns are split over whether that is healing or surrender."
    },
    effects: {
      setFlags: ["alliance_leader_crowned"],
      relations: [{ a: "church_state", b: "grand_alliance", value: "ally" }]
    }
  },
  {
    id: "evt_impious_pact",
    fire: { year: 1538, month: "Kythorn", day: 1 },
    category: "reveal",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "Cormyr's secret pact with Thay is revealed.",
      summary:
        "Courts recoil as the Forest Kingdom's hidden bargain with the Red Wizards comes to light during a renewed border war.",
      newsSources: ["court_rumor", "tavern_talk"]
    },
    rumor: {
      originCityId: "suzail",
      text:
        "Courtiers deny it too quickly: letters have surfaced tying Cormyr to Thay, and every pious listener looks sick."
    },
    effects: {
      setFlags: ["impious_pact_revealed"],
      factionDeltas: [{ faction: "cormyr", field: "prestige", op: "sub", value: 18 }],
      relations: [
        { a: "cormyr", b: "thay", value: "secret_pact" },
        { a: "cormyr", b: "grand_alliance", value: "war" }
      ]
    }
  },
  {
    id: "evt_thayan_naval_supremacy",
    fire: { year: 1540, month: "Eleint", day: 28 },
    category: "naval",
    storyline: "eastern_tide",
    protected: true,
    presentation: {
      headline: "Thay rules the Inner Sea's open waters.",
      summary:
        "Corsair fleets out of the Pirate Isles smash the Alliance navy, and every coastal city begins watching the horizon.",
      newsSources: ["ship_news", "merchant_dispatch"]
    },
    rumor: {
      originCityId: "eltabbar",
      text:
        "Ship captains say Thayan-backed corsairs broke the Alliance fleet, and coastal folk have begun watching every sail."
    },
    effects: {
      setFlags: ["thay_naval_supremacy"],
      factionDeltas: [
        { faction: "thay", field: "navyStrength", op: "add", value: 18 },
        { faction: "grand_alliance", field: "navyStrength", op: "mul", value: 0.6 },
        { faction: "pirate_isles", field: "prestige", op: "add", value: 15 }
      ],
      relations: [{ a: "thay", b: "pirate_isles", value: "ally" }]
    }
  },
  {
    id: "evt_failed_corsair_expedition",
    fire: { year: 1543, month: "Marpenoth", day: 1 },
    category: "naval",
    storyline: "eastern_tide",
    protected: false,
    presentation: {
      headline: "The corsair expedition fails in storm and ambush.",
      summary:
        "The Alliance's punitive fleet limps home broken, leaving the Pirate Isles louder and richer than before.",
      newsSources: ["ship_news", "tavern_talk"]
    },
    rumor: {
      originCityId: "selgaunt",
      text:
        "Dockside talk says the fleet sent against the corsairs came back broken, and the pirates are drinking to it."
    },
    effects: {
      setFlags: ["failed_corsair_expedition"],
      factionDeltas: [
        { faction: "grand_alliance", field: "navyStrength", op: "sub", value: 10 },
        { faction: "pirate_isles", field: "treasury", op: "add", value: 10 }
      ]
    }
  },
  {
    id: "evt_comprehensive_peace",
    fire: { year: 1546, month: "Eleint", day: 29 },
    category: "diplomacy",
    storyline: "western_wars",
    protected: true,
    presentation: {
      headline: "A comprehensive peace ends the long war.",
      summary:
        "Every border has moved, every house has buried heirs, and every surviving power begins preparing for the next generation.",
      newsSources: ["court_rumor", "merchant_dispatch"]
    },
    rumor: {
      originCityId: "arrabar",
      text:
        "Couriers say the exhausted powers have signed a comprehensive peace, though nobody has forgotten who burned whose fields."
    },
    effects: {
      setFlags: ["campaign_peace_1546"],
      relations: [
        { a: "cormyr", b: "grand_alliance", value: "truce" },
        { a: "lords_alliance", b: "cormyr", value: "truce" }
      ]
    }
  }
];
