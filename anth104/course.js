// ANTH 104 on the MeowStudy platform: what the shared engine (../shared/) needs to know about this class.
// Loaded on every page of the class, right after shared/platform.js.
window.COURSE = {
  id: "a104", prefix: "a104-", name: "ANTH 104",
  base: (document.currentScript && document.currentScript.src || "").replace(/course\.js.*$/, ""),   // this class's folder
  badges: "a104",   // which Read & Learn badges the badge case shows
  pardy: "Anthro-pardy",
  sourceHint: "for example just the readings, or just two textbook chapters",
  terms: ["heteroglossia", "indexicality"],
  deckBonus: d => d === "RD" ? [1, "Detail from an assigned reading"] : null
};
window.Platform && window.Platform.guard("a104");
