// SRD/PHB backgrounds. Each grants fixed skill proficiencies, optional tool and
// language grants, starting equipment, a roleplay feature, and suggested
// personality entries the wizard offers (or the player writes their own).

export const backgrounds = [
  {
    id: "acolyte",
    label: "Acolyte",
    skillProficiencies: ["insight", "religion"],
    languageChoices: 2,
    startingEquipment: ["holy-symbol", "incense", "vestments", "common-clothes", "belt-pouch"],
    feature: { name: "Shelter of the Faithful", text: "You and your companions can expect free healing and care at temples of your faith, and you can call on the support of fellow believers." },
    personality: {
      traits: ["I idolize a particular hero of my faith and constantly refer to their deeds.", "I see omens in every event and action; the gods try to speak to us, we just need to listen."],
      ideals: ["Faith: I trust that my deity will guide my actions.", "Charity: I always try to help those in need."],
      bonds: ["I would die to recover an ancient relic of my faith that was lost long ago.", "I owe my life to the priest who took me in when my parents died."],
      flaws: ["I judge others harshly, and myself even more severely.", "I put too much trust in those who wield power within my temple's hierarchy."]
    }
  },
  {
    id: "criminal",
    label: "Criminal",
    skillProficiencies: ["deception", "stealth"],
    toolProficiencies: ["thieves-tools"],
    startingEquipment: ["common-clothes", "belt-pouch"],
    feature: { name: "Criminal Contact", text: "You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals." },
    personality: {
      traits: ["I always have a plan for what to do when things go wrong.", "I would rather make a new friend than a new enemy."],
      ideals: ["Honor: I don't steal from others in the trade.", "Freedom: Chains are meant to be broken, as are those who would forge them."],
      bonds: ["I'm trying to pay off an old debt I owe to a generous benefactor.", "Someone I loved died because of a mistake I made. That will never happen again."],
      flaws: ["When I see something valuable, I can't think about anything but how to steal it.", "I turn tail and run when things look bad."]
    }
  },
  {
    id: "folk-hero",
    label: "Folk Hero",
    skillProficiencies: ["animal-handling", "survival"],
    toolProficiencies: ["explorers-clothes"],
    startingEquipment: ["common-clothes", "belt-pouch"],
    feature: { name: "Rustic Hospitality", text: "Common folk will shelter you from the law or anyone searching for you, and will provide you with a humble place to hide, rest, or recuperate." },
    personality: {
      traits: ["I judge people by their actions, not their words.", "If someone is in trouble, I'm always ready to lend help."],
      ideals: ["Sincerity: There's no good in pretending to be something I'm not.", "Might: If I become strong, I can take what I want — what I deserve."],
      bonds: ["I protect those who cannot protect themselves.", "I have a family, but I have no idea where they are. One day, I hope to see them again."],
      flaws: ["The tyrant who rules my land will stop at nothing to see me killed.", "I have a weakness for the vices of the city, especially hard drink."]
    }
  },
  {
    id: "noble",
    label: "Noble",
    skillProficiencies: ["history", "persuasion"],
    languageChoices: 1,
    startingEquipment: ["fine-clothes", "belt-pouch"],
    feature: { name: "Position of Privilege", text: "People are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are." },
    personality: {
      traits: ["My eloquent flattery makes everyone I talk to feel like the most wonderful person in the world.", "Despite my noble birth, I do not place myself above other folk."],
      ideals: ["Respect: Respect is due to me because of my position.", "Noble Obligation: It is my duty to protect and care for the people beneath me."],
      bonds: ["The common folk must see me as a hero of the people.", "My family's honor must be protected at all costs."],
      flaws: ["I secretly believe that everyone is beneath me.", "I have an insatiable desire for carnal pleasures."]
    }
  },
  {
    id: "sage",
    label: "Sage",
    skillProficiencies: ["arcana", "history"],
    languageChoices: 2,
    startingEquipment: ["common-clothes", "belt-pouch"],
    feature: { name: "Researcher", text: "When you attempt to learn or recall a piece of lore, you often know where and from whom you can obtain it." },
    personality: {
      traits: ["I use polysyllabic words that convey the impression of great erudition.", "I'm convinced that people are always trying to steal my secrets."],
      ideals: ["Knowledge: The path to power and self-improvement is through knowledge.", "Logic: Emotions must not cloud our logical thinking."],
      bonds: ["I've been searching my whole life for the answer to a certain question.", "My life's work is a series of tomes related to a specific field of lore."],
      flaws: ["I am easily distracted by the promise of information.", "Most people scream and run when they see a demon. I stop to take notes."]
    }
  },
  {
    id: "soldier",
    label: "Soldier",
    skillProficiencies: ["athletics", "intimidation"],
    startingEquipment: ["common-clothes", "belt-pouch"],
    feature: { name: "Military Rank", text: "Soldiers loyal to your former military organization still recognize your authority and influence, deferring to you if they are of lower rank." },
    personality: {
      traits: ["I'm always polite and respectful.", "I can stare down a hell hound without flinching."],
      ideals: ["Greater Good: Our lot is to lay down our lives in defense of others.", "Responsibility: I do what I must and obey just authority."],
      bonds: ["I would still lay down my life for the people I served with.", "Those who fight beside me are those worth dying for."],
      flaws: ["The monstrous enemy we faced in battle still leaves me quivering with fear.", "My hatred of my enemies is blinding and unreasoning."]
    }
  },
  {
    id: "charlatan",
    label: "Charlatan",
    skillProficiencies: ["deception", "sleight-of-hand"],
    startingEquipment: ["fine-clothes", "belt-pouch"],
    feature: { name: "False Identity", text: "You have a second identity, complete with documentation and established acquaintances, and you can forge documents convincingly." },
    personality: {
      traits: ["I fall in and out of love easily, and am always pursuing someone.", "I have a joke for every occasion, especially occasions where humor is inappropriate."],
      ideals: ["Independence: I am a free spirit — no one tells me what to do.", "Fairness: I never target people who can't afford to lose a few coins."],
      bonds: ["I fleeced the wrong person and must work to ensure they never cross my path again.", "I owe everything to my mentor, a horrible person who's probably rotting in jail."],
      flaws: ["I can't resist a pretty face.", "I'm convinced that no one could ever fool me the way I fool others."]
    }
  },
  {
    id: "entertainer",
    label: "Entertainer",
    skillProficiencies: ["acrobatics", "performance"],
    toolProficiencies: ["lute"],
    startingEquipment: ["costume", "belt-pouch"],
    feature: { name: "By Popular Demand", text: "You can always find a place to perform, where you are welcomed and appreciated, receiving free lodging and food in exchange." },
    personality: {
      traits: ["I know a story relevant to almost every situation.", "I love a good insult, even one directed at me."],
      ideals: ["Beauty: When I perform, I make the world better than it was.", "Freedom: Everyone should be free to pursue their own livelihood."],
      bonds: ["My instrument is my most treasured possession, and it reminds me of someone I love.", "Someone stole my precious instrument, and someday I'll get it back."],
      flaws: ["I'll do anything to win fame and renown.", "A scandal prevents me from ever going home again."]
    }
  },
  {
    id: "guild-artisan",
    label: "Guild Artisan",
    skillProficiencies: ["insight", "persuasion"],
    languageChoices: 1,
    startingEquipment: ["explorers-clothes", "belt-pouch"],
    feature: { name: "Guild Membership", text: "Your guild provides lodging and food, powerful political connections, and will support you if accused of a crime." },
    personality: {
      traits: ["I believe that anything worth doing is worth doing right.", "I'm a snob who looks down on those who can't appreciate fine craftsmanship."],
      ideals: ["Community: It is the duty of all civilized people to strengthen the bonds of community.", "Aspiration: I work hard to be the best there is at my craft."],
      bonds: ["The workshop where I learned my trade is the most important place in the world to me.", "I owe my guild a great debt for forging me into the person I am today."],
      flaws: ["I'll do anything to get my hands on something rare or priceless.", "I'm never satisfied with what I have — I always want more."]
    }
  },
  {
    id: "hermit",
    label: "Hermit",
    skillProficiencies: ["medicine", "religion"],
    languageChoices: 1,
    startingEquipment: ["common-clothes", "incense"],
    feature: { name: "Discovery", text: "Your seclusion gave you access to a unique and powerful discovery — a great truth, a hidden location, or a forgotten secret." },
    personality: {
      traits: ["I've been isolated for so long that I rarely speak, preferring gestures.", "I am utterly serene, even in the face of disaster."],
      ideals: ["Greater Good: My gifts are meant to be shared with all.", "Self-Knowledge: If you know yourself, there's nothing left to know."],
      bonds: ["I entered seclusion to hide from those who might still be hunting me.", "My isolation gave me great insight into a great evil that only I can destroy."],
      flaws: ["Now that I've returned to the world, I enjoy its delights a little too much.", "I harbor dark, bloodthirsty thoughts that my isolation failed to quell."]
    }
  },
  {
    id: "outlander",
    label: "Outlander",
    skillProficiencies: ["athletics", "survival"],
    toolProficiencies: ["lute"],
    languageChoices: 1,
    startingEquipment: ["explorers-clothes", "belt-pouch"],
    feature: { name: "Wanderer", text: "You have an excellent memory for maps and geography, and can always recall the general layout of terrain and settlements. You can find food and water for yourself and others." },
    personality: {
      traits: ["I'm driven by a wanderlust that led me away from home.", "I have a lesson for every situation, drawn from observing nature."],
      ideals: ["Nature: The natural world is more important than the constructs of civilization.", "Glory: I must earn glory in battle, for myself and my clan."],
      bonds: ["My family, clan, or tribe is the most important thing in my life.", "An injury to the unspoiled wilderness of my home is an injury to me."],
      flaws: ["I am too enamored of ale, wine, and other intoxicants.", "I remember every insult I've received and nurse a silent resentment."]
    }
  },
  {
    id: "sailor",
    label: "Sailor",
    skillProficiencies: ["athletics", "perception"],
    toolProficiencies: ["thieves-tools"],
    startingEquipment: ["common-clothes", "belt-pouch"],
    feature: { name: "Ship's Passage", text: "You can secure free passage on a sailing ship for yourself and your companions, calling in old favors among the crews you've known." },
    personality: {
      traits: ["My friends know they can rely on me, no matter what.", "I work hard so that I can play hard when the work is done."],
      ideals: ["Respect: The thing that keeps a ship together is mutual respect.", "Free Spirit: Sailors should be free to go where they want and do what they want."],
      bonds: ["I'm loyal to my captain first; everything else comes second.", "The ship is most important — crewmates and captains come and go."],
      flaws: ["I follow orders, even if I think they're wrong.", "I'll say anything to avoid having to do extra work."]
    }
  },
  {
    id: "urchin",
    label: "Urchin",
    skillProficiencies: ["sleight-of-hand", "stealth"],
    toolProficiencies: ["thieves-tools"],
    startingEquipment: ["common-clothes", "belt-pouch"],
    feature: { name: "City Secrets", text: "You know the secret patterns and flow of cities and can find passages through the urban sprawl, traveling twice as fast between locations." },
    personality: {
      traits: ["I hide scraps of food and trinkets away in my pockets.", "I ask a lot of questions."],
      ideals: ["Respect: All people deserve to be treated with dignity.", "Change: The low are lifted up, and the high and mighty are brought down."],
      bonds: ["My town or city is my home, and I'll fight to defend it.", "I owe a debt I can never repay to the person who took pity on me."],
      flaws: ["If I'm outnumbered, I will run away from a fight.", "The people who knew me when I was young know my shameful secret."]
    }
  }
];

export const backgroundIds = backgrounds.map((bg) => bg.id);
