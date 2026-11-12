// Bi 239 on the MeowStudy platform: what the shared engine (../shared/) needs to know about this class.
// Loaded on every page of the class, right after shared/platform.js.
window.COURSE = {
  id: "bio", prefix: "bio-", name: "Bi 239",
  base: (document.currentScript && document.currentScript.src || "").replace(/course\.js.*$/, ""),   // this class's folder
  badges: "bio",
  pardy: "Bio-pardy",
  sourceHint: "for example just Homework 3, or just the clicker questions",
  terms: ["gametophyte", "phototropism"],
  deckBonus: d => /^C\d/.test(d) ? [1, "Professor's clicker question"] : d === "HW" ? [1, "Homework concept"] : null,
  // Dexter's fact for each of his six forms
  facts: [
    "A tiny kitten grows the way a seedling does: from its tips. Apical meristems at the ends of shoots and roots keep dividing, and every right answer helps your kitten grow a little bigger.",
    "Sophomore Dexter's favorite study snack is cat grass: wheat or oat seedlings. They're monocots, with one cotyledon, parallel leaf veins, scattered vascular bundles and fibrous roots.",
    "Catnip makes Dexter pounce because of nepetalactone, a secondary compound the plant makes to repel insect herbivores. It's a chemical defense, like the ones in Ch 39.",
    "Plants fight back too. The hypersensitive response kills cells around an infection to wall it off, and methylsalicylic acid travels through the phloem to trigger systemic acquired resistance.",
    "Grad Student Dexter's thesis experiment is phototropism. Light makes auxin move to a coleoptile's shaded side; cells there elongate (the acid growth hypothesis) and the shoot bends toward the light.",
    "Professor Dexter's big lecture: fungi absorb their food, digesting it outside their bodies with enzymes, and they're more closely related to cats (animals) than to plants."
  ]
};
window.Platform && window.Platform.guard("bio");
