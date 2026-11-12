// Word roots for Bi 239, organized by the drill's subjects: each section holds the roots
// you need for that subject's terms. Every root appears once, in the subject where it matters most;
// its example terms can come from other subjects too.
// Section: [name, rows, { sub: why these roots matter, topic: the drill's subject tab }]
// Row: [root, meaning, origin, [[term, what the term means when you put the parts together], ...]]
// Mastered/review marks are stored by root text, so keep a root's spelling when you edit it.
window.ROOTS = {
  unit: {
    name: "Plants, Fungi & Signals",
    sub: "Ch 29, 30, 31 and 39, sorted by the drill's subjects. Learn a section's roots before you practice that subject.",
    groups: [
      ["Land plants", [
        ["-phyte", "plant", "Greek phyton", [["gametophyte", "the gamete-making plant (haploid)"], ["sporophyte", "the spore-making plant (diploid)"], ["bryophyte", "moss plant: the nonvascular plants"], ["charophyte", "a green alga related to land plants"], ["embryophyte", "a land plant: a plant that keeps its embryo"]]],
        ["bryo-", "moss", "Greek bryon", [["bryophyte", "mosses, liverworts and hornworts"]]],
        ["gamet-", "spouse, sex cell", "Greek gametēs, husband", [["gamete", "an egg or sperm"], ["gametangium", "a vessel for gametes: archegonium or antheridium"], ["gametophyte", "the plant that makes gametes"]]],
        ["spor-", "seed, sowing", "Greek spora", [["spore", "a single cell \"sown\" to start a new gametophyte"], ["sporangium", "a vessel that makes spores"], ["sporopollenin", "the tough polymer in spore and pollen walls"]]],
        ["-angium", "vessel, container", "Greek angeion", [["sporangium", "spore container"], ["gametangium", "gamete container"], ["angiosperm", "a plant whose seeds sit in a vessel (the ovary)"]]],
        ["haplo-", "single", "Greek haploos", [["haploid", "one set of chromosomes (n): the gametophyte"]]],
        ["diplo-", "double", "Greek diploos", [["diploid", "two sets of chromosomes (2n): the sporophyte"]]],
        ["zyg-", "yoke, joined", "Greek zygon", [["zygote", "the cell formed when two gametes join"], ["zygomycete", "a fungus named for the zygosporangium, where mates join"]]],
        ["embry-", "something growing inside", "Greek embryon", [["embryo", "the young sporophyte, kept inside the parent"], ["embryophyte", "land plants: they protect the embryo"]]],
        ["arche-", "first, origin", "Greek archē", [["archegonium", "\"first offspring\" organ: holds the egg"]]],
        ["anther-", "flowery", "Greek anthos, flower", [["antheridium", "the organ that makes sperm"], ["anther", "the pollen-making tip of a stamen"]]],
        ["cut-", "skin", "Latin cutis", [["cuticle", "the waxy \"little skin\" that keeps leaves from drying out"]]],
        ["stoma-", "mouth", "Greek stoma", [["stoma (stomata)", "a pore, a \"mouth\" for gas exchange; liverworts lack them"], ["peristome", "the ring of teeth around a moss capsule's \"mouth\""]]],
        ["peri-", "around", "Greek peri", [["peristome", "teeth around the opening of a moss capsule"], ["pericarp", "the fruit wall around the seeds"], ["periderm", "the protective layer around older stems and roots"]]],
        ["rhiz-", "root", "Greek rhiza", [["rhizoid", "a root-like anchoring filament on a moss gametophyte"], ["mycorrhiza", "fungus + root partnership"], ["Rhizopus", "black bread mold, named for its root-like hyphae"]]]
      ], { sub: "Charophytes, the move onto land, alternation of generations, and the bryophytes (Ch 29). These roots name the two generations and their parts.", topic: "Plants move to land" }],

      ["Seedless vascular plants", [
        ["vascul-", "little vessel", "Latin vasculum", [["vascular tissue", "tubes (xylem and phloem) that carry water and food"], ["nonvascular", "without those tubes: the bryophytes"]]],
        ["xyl-", "wood", "Greek xylon", [["xylem", "the woody tissue that carries water and minerals"]]],
        ["phlo-", "bark", "Greek phloios", [["phloem", "the tissue just under the bark that carries sugars"]]],
        ["lign-", "wood", "Latin lignum", [["lignin", "the polymer that stiffens xylem walls so plants can grow tall"]]],
        ["trache-", "windpipe, rough tube", "Greek tracheia", [["tracheid", "a long, tube-shaped water-conducting cell in xylem"]]],
        ["-phyll", "leaf", "Greek phyllon", [["sporophyll", "a leaf that bears sporangia"], ["microphyll", "a small leaf with a single vein (lycophytes)"], ["megaphyll", "a large leaf with branched veins (ferns, seed plants)"], ["chlorophyll", "\"green leaf\" pigment"]]],
        ["lyco-", "wolf", "Greek lykos", [["lycophyte", "\"wolf plant\": club mosses, which are vascular despite the name"]]],
        ["pter-", "feather, fern", "Greek pteris (fern), pteron (feather)", [["pterophyte", "\"feather plant\": ferns and their relatives"]]],
        ["strobil-", "pine cone", "Greek strobilos", [["strobilus (strobili)", "a cone-like cluster of sporophylls"]]],
        ["sor-", "heap", "Greek sōros", [["sorus (sori)", "a heap of sporangia on the underside of a fern leaf"]]],
        ["homo-", "same", "Greek homos", [["homosporous", "making one kind of spore (most seedless plants)"]]]
      ], { sub: "Xylem and phloem, dominant sporophytes, lycophytes and ferns (Ch 29). These roots describe the plumbing and the spore-bearing parts.", topic: "Seedless vascular plants" }],

      ["Seed plants", [
        ["-sperm", "seed", "Greek sperma", [["gymnosperm", "naked seed"], ["angiosperm", "vessel seed: seed inside an ovary"], ["endosperm", "the food tissue inside the seed"]]],
        ["gymno-", "naked", "Greek gymnos", [["gymnosperm", "a plant whose seeds sit exposed on cone scales"]]],
        ["hetero-", "different", "Greek heteros", [["heterosporous", "making two different kinds of spores"], ["heterokaryon", "a fungal cell with genetically different nuclei"], ["heterotroph", "an organism that feeds on others: fungi"]]],
        ["mega-", "large", "Greek megas", [["megaspore", "the large spore that becomes the female gametophyte"], ["megasporangium", "where megaspores form, inside the ovule"]]],
        ["micro-", "small", "Greek mikros", [["microspore", "the small spore that becomes a pollen grain"], ["micropyle", "the small gate where the pollen tube enters the ovule"]]],
        ["-pyle", "gate", "Greek pylē", [["micropyle", "the tiny opening in the ovule"]]],
        ["poll-", "fine flour, dust", "Latin pollen", [["pollen", "the dust-like grains that carry the male gametophyte"], ["pollination", "moving pollen to the ovule or stigma"]]],
        ["ov-", "egg", "Latin ovum", [["ovule", "the \"little egg\" holder that becomes a seed"], ["ovary", "the part of the carpel that holds ovules and becomes the fruit"]]],
        ["integ-", "covering", "Latin integumentum", [["integument", "the ovule's covering, which becomes the seed coat"]]],
        ["endo-", "inside", "Greek endon", [["endosperm", "the nourishing tissue inside a seed (3n)"], ["endophyte", "a fungus living inside a plant"]]],
        ["syn-", "together", "Greek syn", [["synergid", "a cell that \"works together\" with the egg; one dies as the pollen tube arrives"]]],
        ["-carp", "fruit", "Greek karpos", [["carpel", "the flower's female part, which becomes the fruit"], ["pericarp", "the fruit wall"], ["ascocarp", "an ascomycete's fruiting body"], ["basidiocarp", "a mushroom: a basidiomycete's fruiting body"]]],
        ["stam-", "thread", "Latin stamen", [["stamen", "the male part of a flower: a thread-like filament plus the anther"]]],
        ["cotyl-", "cup", "Greek kotylē", [["cotyledon", "a seed leaf"], ["monocot", "one seed leaf"], ["eudicot", "\"true\" two seed leaves"]]],
        ["mono-", "one", "Greek monos", [["monocot", "a flowering plant with one cotyledon"]]],
        ["di-", "two", "Greek di-", [["eudicot", "a flowering plant with two cotyledons"], ["dikaryotic", "having two nuclei per cell (fungi)"]]],
        ["eu-", "true, good", "Greek eu", [["eudicot", "the \"true\" dicots, a single evolutionary group"]]]
      ], { sub: "Pollen, heterospory, gymnosperms vs. angiosperms, flowers, double fertilization, fruits, monocots vs. eudicots (Ch 30).", topic: "Seed plants" }],

      ["Signals & tropisms", [
        ["-tropism", "turning", "Greek tropos", [["phototropism", "turning toward light"], ["gravitropism", "turning in response to gravity"], ["thigmotropism", "turning in response to touch"]]],
        ["etiol-", "pale, blanched", "French étioler", [["etiolation", "pale, spindly growth in the dark"], ["de-etiolation", "greening once light arrives"]]],
        ["trans-", "across", "Latin trans", [["transduction", "carrying a signal across the cell, from receptor to response"], ["transcription factor", "a protein that turns genes on or off in the response step"]]],
        ["-duct", "lead, carry", "Latin ducere", [["transduction", "leading the signal through the cell"]]],
        ["recept-", "receive", "Latin recipere", [["receptor", "the protein that receives a signal (e.g., phytochrome)"], ["reception", "the first step: the signal is detected"]]],
        ["coleo-", "sheath", "Greek koleos", [["coleoptile", "the sheath covering a grass seedling's shoot, used in the phototropism experiments"]]],
        ["-ptile", "feather", "Greek ptilon", [["coleoptile", "\"sheath feather\": the seedling's protective tip"]]]
      ], { sub: "Reception → transduction → response, etiolation, and the phototropism experiments (Ch 39).", topic: "Signal transduction & tropisms" }],

      ["Hormones", [
        ["auxe-", "grow, increase", "Greek auxein", [["auxin", "the growth hormone that drives cell elongation"]]],
        ["cyto-", "cell", "Greek kytos, vessel", [["cytokinin", "the hormone that drives cell division (cytokinesis)"], ["cytokinesis", "division of the cytoplasm"], ["cytoplasm", "the material inside the cell"]]],
        ["-kinesis", "movement", "Greek kinēsis", [["cytokinesis", "the cell splitting in two"], ["cytokinin", "named for cytokinesis"]]],
        ["absciss-", "cut off", "Latin abscindere", [["abscission", "the cutting off (falling) of leaves, controlled by ethylene"], ["abscisic acid", "misnamed: it mainly controls dormancy and drought"]]],
        ["dorm-", "sleep", "Latin dormire", [["dormancy", "a seed \"sleeping\" until conditions are good (ABA)"]]],
        ["apic-", "tip, summit", "Latin apex", [["apical dominance", "the tip (terminal) bud suppressing side buds"], ["apical meristem", "growing tissue at the tip of a shoot or root"]]],
        ["axill-", "armpit", "Latin axilla", [["axillary bud", "a bud in the \"armpit\" between leaf and stem"]]],
        ["senesc-", "grow old", "Latin senescere", [["senescence", "programmed aging and death of cells or organs (ethylene)"]]],
        ["pre- / prae-", "before", "Latin prae", [["precocious germination", "\"ripened before its time\": seeds sprouting too early when ABA is missing"]]]
      ], { sub: "Auxin, cytokinins, gibberellins, abscisic acid, ethylene, brassinosteroids and the rest (Ch 39). These roots explain what each hormone's name and job have in common.", topic: "Plant hormones" }],

      ["Light, clocks & seasons", [
        ["photo-", "light", "Greek phōs, phōtos", [["phototropism", "growth toward light"], ["photoperiodism", "responding to night and day length"], ["photomorphogenesis", "light shaping plant form"], ["photoreceptor", "a light-detecting protein"]]],
        ["chrom-", "color", "Greek chrōma", [["phytochrome", "\"plant color\": the red/far-red light receptor"], ["cryptochrome", "a blue-light receptor"]]],
        ["morph-", "form, shape", "Greek morphē", [["photomorphogenesis", "the creation of form by light"], ["thigmomorphogenesis", "the creation of form by touch"]]],
        ["-genesis", "origin, creation", "Greek genesis", [["photomorphogenesis", "light-driven development"]]],
        ["circa-", "about", "Latin circa", [["circadian", "about a day"]]],
        ["-dian", "day", "Latin dies", [["circadian", "a cycle of about one day"]]],
        ["vern-", "spring", "Latin vernus", [["vernalization", "a cold treatment that lets a plant flower in spring"]]]
      ], { sub: "Phytochrome (Pr ⇄ Pfr), blue-light receptors, circadian rhythms and photoperiodism (Ch 39).", topic: "Light, clocks & seasons" }],

      ["Stress & defense", [
        ["thigmo-", "touch", "Greek thigma", [["thigmotropism", "growth in response to touch"], ["thigmomorphogenesis", "change of form caused by touch or mechanical stress"]]],
        ["grav-", "heavy", "Latin gravis", [["gravitropism", "growth in response to gravity: roots down, shoots up"]]],
        ["stato-", "standing, stationary", "Greek statos", [["statolith", "a \"standing stone\" that settles with gravity"]]],
        ["-lith", "stone", "Greek lithos", [["statolith", "a dense, starch-filled plastid that senses gravity"]]],
        ["osmo-", "push", "Greek ōsmos", [["osmosis", "water moving toward more solutes; salty soil pulls water out of roots"], ["osmotic stress", "water loss caused by too many solutes outside"]]],
        ["aer-", "air", "Greek aēr", [["aerenchyma", "air tubes that help flooded roots get oxygen"]]],
        ["path-", "suffering, disease", "Greek pathos", [["pathogen", "a disease-causing organism"]]],
        ["-gen", "producing, origin", "Greek -genēs", [["pathogen", "\"disease-producer\""], ["antigen", "a molecule that produces an immune response"]]],
        ["hyper-", "over, beyond", "Greek hyper", [["hypersensitive response", "an over-the-top defense: cells around an infection kill themselves"]]],
        ["salic-", "willow", "Latin salix", [["salicylic acid", "the SAR signal, first found in willow bark (also the source of aspirin)"]]],
        ["herbi-", "grass, plant", "Latin herba", [["herbivore", "an animal that eats plants"]]],
        ["-vore", "eat, devour", "Latin vorare", [["herbivore", "a plant-eater, like the caterpillars maize defends against"]]]
      ], { sub: "Gravitropism, touch, abiotic stress, and defense against pathogens and herbivores (Ch 39).", topic: "Stress, touch & defense" }],

      ["Fungi", [
        ["-mycete", "fungus", "Greek mykēs, mushroom", [["ascomycete", "sac fungus"], ["basidiomycete", "club fungus"], ["zygomycete", "a fungus named for its zygosporangium"]]],
        ["myc-", "fungus", "Greek mykēs", [["mycelium", "the fungal body of hyphae"], ["mycorrhiza", "fungus-root partnership"], ["mycology", "the study of fungi"]]],
        ["hyph-", "web", "Greek hyphē", [["hypha (hyphae)", "a single fungal filament"]]],
        ["asc-", "sac, bag", "Greek askos", [["ascus", "the sac where ascospores form (usually eight)"], ["ascocarp", "the fruiting body holding asci"]]],
        ["basidi-", "little pedestal, club", "Greek basis", [["basidium", "the club-shaped spore-making cell"], ["basidiocarp", "the mushroom"]]],
        ["chytr-", "little pot", "Greek chytridion", [["chytrid", "fungi named for their pot-like sporangia; the only ones with flagellated spores"]]],
        ["zoo-", "animal", "Greek zōon", [["zoospore", "a swimming, flagellated spore (chytrids)"]]],
        ["karyo-", "nucleus, kernel", "Greek karyon", [["karyogamy", "fusion of nuclei"], ["dikaryotic", "two nuclei per cell"], ["heterokaryon", "a cell with different nuclei"]]],
        ["plasmo-", "formed substance (cytoplasm)", "Greek plasma", [["plasmogamy", "fusion of cytoplasm, which comes before the nuclei fuse"]]],
        ["-gamy", "marriage, fusion", "Greek gamos", [["plasmogamy", "the cytoplasm marries"], ["karyogamy", "the nuclei marry"]]],
        ["coeno-", "common, shared", "Greek koinos", [["coenocytic", "hyphae without cross-walls: many nuclei share one cytoplasm"]]],
        ["sept-", "wall, fence", "Latin saeptum", [["septate", "hyphae divided by cross-walls"], ["septum", "a cross-wall"]]],
        ["haustor-", "drinker", "Latin haurire, to drink", [["haustorium", "a parasitic fungus's hypha that \"drinks\" from host cells"]]],
        ["conidi-", "dust", "Greek konis", [["conidia", "asexual spores, released like dust"]]],
        ["sapro-", "rotten", "Greek sapros", [["saprobe", "a decomposer that feeds on dead matter"]]],
        ["-troph", "nourishment, feeding", "Greek trophē", [["heterotroph", "feeds on others (fungi absorb their food)"], ["autotroph", "makes its own food (plants)"]]]
      ], { sub: "Hyphae and mycelium, absorptive nutrition, life cycles, chytrids, zygomycetes, ascomycetes, basidiomycetes and lichens (Ch 31).", topic: "Fungi" }]
    ]
  }
};
