// ANTH 102 on the Eureka platform. The drills here run on this class's own drill engine (assets/), with the
// platform's study buddy on top. Loaded on every page, right after shared/platform.js.
window.COURSE = {
  id: "a102", prefix: "anthro-", name: "ANTH 102",
  base: (document.currentScript && document.currentScript.src || "").replace(/course\.js.*$/, ""),
  badges: "a102",
  pardy: "Anthro-pardy",
  guests: "primate",   // the Cat Café's visitors in this class are primates, in taxonomic order (shared/buddy.js)
  // Dexter's fact for each of his six forms
  facts: [
    "Kittens and baby primates both start out clinging and nursing. Primates take it further: single births, long childhoods and a lot of learning are part of the primate pattern.",
    "Dexter's eyes face forward, like a primate's. Overlapping fields of view give stereoscopic depth perception, handy for pouncing, and for leaping between branches.",
    "Cats are carnivorans, not primates: they have claws instead of nails, no grasping thumb, and they rely much more on smell. Compare that with the primate traits on your chart.",
    "Dexter and a lemur both have a wet nose (a rhinarium) and a reflective tapetum lucidum. In primates those are strepsirrhine traits; haplorhines like monkeys and apes have dry noses.",
    "Grad Student Dexter is studying sociality. Chimpanzees are male-bonded with fission-fusion groups; bonobos are female-bonded. Same genus, very different societies.",
    "Professor Dexter's big lecture: evolution has no goal. Natural selection works on the variation that exists, which is why a cat and a chimpanzee both carry the marks of their ancestors."
  ]
};
window.Platform && window.Platform.guard("a102");
