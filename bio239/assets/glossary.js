// Course glossary (Bi 239): after a wrong answer, the drills explain what the option the student picked actually means
// ("Why not …?"). Keys are lowercase; GLOSS.look() matches option text loosely (ignores "What is …?",
// "Suborder:" prefixes, a/an/the, and parentheses like "(OWM)").
(() => {
  const G = {
    // ===== Algae & plant groups
    "charophytes": "Charophytes are the green algae most closely related to land plants.",
    "rhodophytes": "Rhodophytes are red algae: photosynthetic, but not the closest relatives of land plants.",
    "red algae": "Red algae (rhodophytes) are not the closest relatives of land plants; charophytes are.",
    "brown algae": "Brown algae (kelps) are stramenopiles, only distantly related to plants.",
    "chrysophytes": "Chrysophytes are golden algae, stramenopiles that are not close relatives of land plants.",
    "bacillariophytes": "Bacillariophytes are diatoms: algae with glass (silica) walls, not close plant relatives.",
    "diatoms": "Diatoms are algae with glass (silica) walls, not close relatives of land plants.",
    "psilophytes": "Psilophytes (whisk ferns) are seedless vascular plants, not algae.",
    "bryophytes": "Bryophytes (liverworts, mosses, hornworts) are the nonvascular plants, with a dominant gametophyte.",
    "liverworts": "Liverworts are bryophytes (nonvascular) and the only group of plants without stomata.",
    "mosses": "Mosses are bryophytes: the green gametophyte dominates, and the sporophyte depends on it.",
    "hornworts": "Hornworts are bryophytes, nonvascular plants with horn-shaped sporophytes.",
    "lycophytes": "Lycophytes (club mosses) are seedless VASCULAR plants despite the name; they bear strobili.",
    "pterophytes": "Pterophytes are ferns and their relatives: seedless vascular plants.",
    "ferns": "Ferns are seedless vascular plants: a dominant sporophyte, a small free-living gametophyte, and sporangia in sori.",
    "whisk ferns": "Whisk ferns are seedless vascular plants with independent sporophytes.",
    "horsetails": "Horsetails are seedless vascular plants (relatives of ferns) with independent sporophytes.",
    "gymnosperms": "Gymnosperms (conifers and relatives) have naked seeds on cones and no flowers or fruits.",
    "angiosperms": "Angiosperms are the flowering plants: seeds enclosed in an ovary that becomes a fruit.",
    "flowering plants": "Flowering plants (angiosperms) have all four key traits: cuticle, vascular tissue, seeds and flowers.",
    "monocot": "Monocots have one cotyledon, parallel veins, scattered vascular bundles, fibrous roots and flower parts in threes.",
    "eudicot": "Eudicots have two cotyledons, net-like veins, vascular bundles in a ring, a taproot and flower parts in fours or fives.",
    "gymnosperm": "Gymnosperms have naked seeds on cones; they have no flowers or fruits.",
    "fern": "Ferns are seedless vascular plants that disperse by spores.",
    // ===== Life cycles & structures
    "gametophyte (n)": "The gametophyte is the haploid, gamete-making generation.",
    "sporophyte (2n)": "The sporophyte is the diploid, spore-making generation.",
    "zygote": "The zygote is the single diploid cell made by fertilization.",
    "spore": "A spore is a single haploid cell made by meiosis that grows into a gametophyte.",
    "archegonia": "Archegonia are the gametangia that make eggs.",
    "antheridia": "Antheridia are the gametangia that make sperm.",
    "antheridium": "The antheridium makes sperm; it doesn't release spores.",
    "archegonium": "The archegonium makes and holds the egg; it doesn't release spores.",
    "sporangia": "Sporangia make spores by meiosis; they are part of the sporophyte.",
    "sori": "Sori are clusters of sporangia on the underside of fern leaves.",
    "strobili": "Strobili are cone-like clusters of sporophylls in lycophytes and gymnosperms.",
    "heterospory": "Heterospory means making two kinds of spores (megaspores and microspores). It is older than seeds and is found in some seedless plants too.",
    "homospory": "Homospory means making one kind of spore, which grows into a bisexual gametophyte.",
    "vascular systems": "Vascular tissue had already evolved in ferns and lycophytes before seed plants appeared.",
    "flowers": "Flowers came last, with the angiosperms, long after the Carboniferous.",
    "double fertilization": "Double fertilization (egg + sperm, polar nuclei + sperm) happens only in angiosperms.",
    "alternation of generations": "Alternation of generations is shared by all land plants.",
    "ovule": "An ovule matures into a seed, not a fruit.",
    "anther": "The anther is the pollen-making part of a stamen.",
    "petal": "Petals attract pollinators; they don't become the fruit.",
    "female gametophyte": "The female gametophyte (n) feeds the embryo in gymnosperms; angiosperms use 3n endosperm.",
    "seed coat": "The seed coat protects the embryo; it isn't food.",
    "male sporophyte": "There is no male sporophyte; the sporophyte is the diploid plant that makes spores.",
    "sperm cell": "Pollen contains sperm (or the cells that make them), but the grain itself is a whole male gametophyte.",
    "seed": "A seed holds an embryo, food and a coat. Pollen is something else: a male gametophyte.",
    // ===== Signals & hormones
    "auxin": "Auxin (IAA) stimulates cell elongation (the acid growth hypothesis), drives phototropism, and maintains apical dominance.",
    "cytokinin": "Cytokinins stimulate cell division, promote lateral bud growth, and slow aging.",
    "cytokinins": "Cytokinins stimulate cell division, promote lateral bud growth, and slow aging.",
    "gibberellin": "Gibberellins promote stem elongation, fruit growth, and seed germination.",
    "gibberellins": "Gibberellins promote stem elongation, fruit growth, and seed germination.",
    "abscisic acid": "Abscisic acid (ABA) keeps seeds dormant and closes stomata during drought, despite its name.",
    "abscisic acid (aba)": "Abscisic acid (ABA) keeps seeds dormant and closes stomata during drought.",
    "ethylene": "Ethylene ripens fruit, drives leaf abscission and senescence, and causes the triple response.",
    "brassinosteroids": "Brassinosteroids are steroids similar to animal sex hormones; they induce cell elongation and division.",
    "jasmonates": "Jasmonates mediate defenses against insect herbivores.",
    "jasmonic acid": "Jasmonic acid (a jasmonate) mediates defenses against herbivores; salicylic acid drives SAR.",
    "strigolactones": "Strigolactones regulate apical dominance, seed germination, and mycorrhizal associations.",
    "salicylic acid": "Salicylic acid triggers systemic acquired resistance.",
    "indoleacetic acid": "Indoleacetic acid (IAA) is the main natural auxin.",
    "gibberellic acid": "Gibberellic acid is a gibberellin, not the main auxin.",
    "cgmp": "cGMP is a second messenger in transduction, not a receptor.",
    "transcription factor": "Transcription factors act in the response step, turning genes on or off; they aren't the receptor.",
    "atp and nadph": "ATP and NADPH are energy carriers from photosynthesis, not second messengers.",
    "auxin and ethylene": "Auxin and ethylene are hormones (signals), not second messengers.",
    "expansins": "Expansins loosen the cell wall at low pH in the acid growth hypothesis; they don't protect against heat.",
    "pr proteins": "PR (pathogenesis-related) proteins are defense proteins made during SAR.",
    // ===== Light, time & movement
    "phytochrome": "Phytochrome is the red/far-red light receptor; it switches between Pr and Pfr.",
    "chlorophyll": "Chlorophyll captures light for photosynthesis but isn't a signaling receptor.",
    "cryptochrome": "Cryptochromes are blue-light receptors, not the red/far-red switch.",
    "pr": "Pr is the inactive, red-absorbing form of phytochrome; far-red light makes it.",
    "pfr": "Pfr is the active, far-red-absorbing form of phytochrome; red light makes it.",
    "iaa": "IAA is auxin, a hormone, not a form of phytochrome.",
    "etiolation": "Etiolation is pale, spindly growth in the dark.",
    "de-etiolation": "De-etiolation is greening and normal growth after light exposure.",
    "phototropism": "Phototropism is bending toward (or away from) light.",
    "photoperiodism": "Photoperiodism is responding to the relative lengths of night and day, e.g., in seasonal flowering.",
    "circadian rhythms": "Circadian rhythms are internal cycles of about 24 hours.",
    "vernalization": "Vernalization is a cold pretreatment that some plants need before flowering.",
    "senescence": "Senescence is programmed death of cells or organs.",
    "thigmomorphogenesis": "Thigmomorphogenesis is a change in form (shorter, stockier) caused by mechanical disturbance.",
    "thigmotropism": "Thigmotropism is growth in response to touch, like tendrils coiling.",
    "gravitropism": "Gravitropism is growth in response to gravity: roots positive, shoots negative.",
    "statolith": "Statoliths are starch-filled plastids that sense gravity.",
    "statoliths": "Statoliths are starch-filled plastids (amyloplasts) that settle to sense gravity.",
    "otoliths": "Otoliths are ear stones in animals, not a plant structure.",
    "statocysts": "Statocysts are balance organs in invertebrate animals, not in plants.",
    "triple response": "The triple response is ethylene-induced: slower elongation, a thicker stem, horizontal growth.",
    "apical dominance": "Apical dominance is the terminal bud suppressing axillary buds.",
    "systemic acquired resistance": "Systemic acquired resistance is the whole-plant, long-lasting defense triggered by salicylic acid.",
    "hypersensitive response": "The hypersensitive response kills cells around an infection site to wall it off.",
    "heat-shock proteins": "Heat-shock proteins protect other proteins from denaturing in heat.",
    "antifreeze proteins": "Antifreeze proteins keep ice crystals from forming in the cold.",
    "antibodies": "Plants have no antibodies; those belong to vertebrate adaptive immunity.",
    "r genes": "R genes are plant-specific resistance genes, not shared by all eukaryotes.",
    "receptors for pathogen molecules": "Plants DO have receptors for pathogen molecules; that's innate immunity.",
    "cell walls": "Plants DO have cell walls, and they help block pathogens.",
    "honeybees": "Honeybees pollinate; they aren't recruited against caterpillars.",
    "ladybugs that eat leaves": "Ladybugs eat aphids, not leaves, and maize doesn't recruit them here.",
    "fruit flies": "Fruit flies don't attack caterpillars.",
    // ===== Fungi
    "zygomycota": "Zygomycota: fast-growing molds like black bread mold, with resistant zygosporangia.",
    "zygomycete": "Zygomycetes form zygosporangia; they don't make eight spores in a sac.",
    "zygomycetes": "Zygomycetes form zygosporangia; they include black bread mold.",
    "ascomycota": "Ascomycota (sac fungi) make spores in asci; examples are yeasts, morels and Penicillium.",
    "ascomycete": "Ascomycetes make spores in sacs (asci), usually eight in a row.",
    "ascomycetes": "Ascomycetes make spores in sacs (asci).",
    "basidiomycota": "Basidiomycota (club fungi) are mushrooms, shelf fungi, rusts and smuts, with spores on basidia.",
    "basidiomycetes": "Basidiomycetes make spores on club-shaped basidia; they include mushrooms.",
    "chytridiomycota": "Chytridiomycota (chytrids) have flagellated spores and live mostly in water and soil.",
    "chytrid": "Chytrids have flagellated spores (zoospores); they don't form fruiting bodies with eight spores.",
    "chytrids": "Chytrids are the only fungi with flagellated spores.",
    "deuteromycete": "\"Deuteromycete\" is an old label for fungi with no known sexual stage, not a group identified by eight spores in a sac.",
    "glomeromycota": "Glomeromycota form arbuscular mycorrhizae inside plant roots.",
    "mycelium": "The mycelium is the mass of hyphae forming the fungus's body.",
    "fruiting body": "The fruiting body is the spore-making part, such as a mushroom.",
    "ascus": "An ascus is the sac where ascomycete spores form.",
    "basidium": "A basidium is the club-shaped cell where basidiospores form.",
    "chitin": "Chitin is the polymer in fungal cell walls and insect exoskeletons.",
    "cellulose": "Cellulose is the polymer in plant cell walls, not fungal walls.",
    "lignin": "Lignin stiffens the walls of plant xylem.",
    "sporopollenin": "Sporopollenin is the tough polymer in plant spore and pollen walls.",
    "plasmogamy": "Plasmogamy is the fusion of cytoplasm, which happens BEFORE the nuclei fuse.",
    "karyogamy": "Karyogamy is the fusion of nuclei, followed by meiosis.",
    "meiosis": "Meiosis makes haploid cells; in fungi it follows karyogamy.",
    "budding": "Budding is asexual reproduction, as in yeasts.",
    "lichen": "A lichen is a fungus plus a photosynthetic partner (a green alga or cyanobacterium).",
    "mycorrhiza": "A mycorrhiza is a partnership between a fungus and plant roots.",
    "endophyte": "An endophyte is a fungus living harmlessly inside plant leaves or stems.",
    "heterokaryon": "A heterokaryon is a fungal cell or mycelium with nuclei from two parents.",
    "haploid spores": "Haploid spores are for dispersal; they don't signal to mates.",
    "heterokaryon hyphae": "Heterokaryon hyphae exist after mates have already fused.",
    "diploid hyphae": "Fungi rarely have diploid hyphae; the diploid stage is usually just the zygote.",
    "diploid spores": "Fungal spores are haploid.",
    "producer": "Fungi lack chloroplasts, so none are producers.",
    "decomposer": "Many fungi are decomposers.",
    "parasite": "Many fungi are parasites.",
    "predator": "Some fungi are predators that trap tiny worms with their hyphae."
  };
  const norm = s => String(s).replace(/<[^>]*>/g, "").trim().replace(/^(what|who) (is|are) (the )?/i, "").replace(/\?$/, "").replace(/^(order|suborder|infraorder|superfamily):\s*/i, "").replace(/^(a|an|the) /i, "").trim().toLowerCase();
  function genotype(raw) {
    const t = String(raw).replace(/<[^>]*>/g, "").trim();
    if (!/^[A-Za-z]{2}$/.test(t) || t[0].toLowerCase() !== t[1].toLowerCase()) return null;
    const up = c => c === c.toUpperCase();
    if (up(t[0]) && up(t[1])) return `${t} is homozygous dominant: two dominant alleles.`;
    if (!up(t[0]) && !up(t[1])) return `${t} is homozygous recessive: two recessive alleles, so the recessive trait shows.`;
    return `${t} is heterozygous: one dominant and one recessive allele, so the dominant trait shows.`;
  }
  function look(raw) {
    const g = genotype(raw); if (g) return g;
    // "trait → group" pairs from the classification drill: explain where that trait really goes
    const pair = String(raw).split("→");
    if (pair.length === 2) { const d = look(pair[0]); return d ? d : null }
    const n = norm(raw); if (!n) return null;
    const noParen = n.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
    const inParen = (n.match(/\(([^)]*)\)/) || [])[1];
    for (const k of [n, noParen, inParen]) {
      if (!k) continue;
      if (G[k]) return G[k];
      if (k.endsWith("s") && G[k.slice(0, -1)]) return G[k.slice(0, -1)];
      if (G[k + "s"]) return G[k + "s"];
    }
    return null;
  }
  window.GLOSS = { look };
})();
