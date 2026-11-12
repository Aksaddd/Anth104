// Word roots for ANTH 102, grouped by exam and by the drill subject (tab) whose questions use the root's terms most often.
// Row: [root, meaning, origin, [[term, what the term means when you put the parts together], ...], {s: subject, n: times its terms appear there}]
// Group: [subject, rows, note shown under the heading]. Roots are unique within an exam.
window.ROOTS = {
 "exam1": {
  "name": "Exam 1",
  "sub": "Science, natural selection, cells & DNA, protein synthesis, genetics and the forces of evolution.",
  "groups": [
   [
    "Science",
    [
     [ "hypo-", "under", "Greek hypo", [ [ "hypothesis", "an idea placed under the evidence, to be tested" ] ], { "s": "Science", "n": 12 }
     ],
     [ "-thesis", "placing, putting", "Greek thesis", [ [ "hypothesis", "a testable proposal" ], [ "synthesis", "putting parts together" ] ], { "s": "Science", "n": 12 }
     ],
     [ "anthropo-", "human being", "Greek anthrōpos", [ [ "anthropology", "the study of humans: biological, cultural, linguistic and archaeological" ] ], { "s": "Science", "n": 4 }
     ],
     [ "archaeo-", "ancient", "Greek archaios", [ [ "archaeology", "the study of the ancient past through material remains" ] ], { "s": "Science", "n": 3 }
     ],
     [ "falsi-", "false", "Latin falsus", [ [ "falsifiability", "a scientific idea must be able to be shown false by evidence" ] ], { "s": "Science", "n": 3 }
     ]
    ],
    "Roots most common in the Science tab: hypotheses, tests and the fields of anthropology."
   ],
   [
    "Natural selection",
    [
     [ "vestig-", "footprint, trace", "Latin vestigium", [ [ "vestigial", "a leftover trace of a structure that was useful in ancestors" ] ]
     ],
     [ "radi-", "ray, spoke", "Latin radius", [ [ "adaptive radiation", "many species spreading out from one ancestor, like spokes from a hub" ] ]
     ],
     [ "analog-", "proportionate, corresponding", "Greek analogos", [ [ "analogous", "alike in function but not in origin (bird and bat wings)" ] ]
     ],
     [ "cata-", "down", "Greek kata", [ [ "catastrophism", "kata + strophē (turning): sudden events that overturned the earth (Cuvier)" ] ]
     ]
    ],
    "Roots most common in the Natural selection tab: Darwin's evidence."
   ],
   [
    "Scientists",
    [
     [ "nomen", "name", "Latin nomen", [ [ "binomial nomenclature", "Linnaeus's two-name naming system" ] ], { "s": "Scientists", "n": 16 }
     ],
     [ "uni-", "one", "Latin unus", [ [ "uniformitarianism", "one uniform set of slow processes, acting then as now (Hutton, Lyell)" ] ], { "s": "Scientists", "n": 8 }
     ],
     [ "bi-", "two", "Latin bis", [ [ "binomial", "two names: genus + species, as in Homo sapiens" ] ], { "s": "Scientists", "n": 8 }
     ],
     [ "geo-", "earth", "Greek gē", [ [ "geology", "the study of the earth's rocks and layers" ], [ "biogeography", "where species live, and why" ] ], { "s": "Scientists", "n": 7 }
     ],
     [ "-logy", "study of", "Greek logos, word, reason", [ [ "biology", "the study of life" ], [ "geology", "the study of the earth" ], [ "anthropology", "the study of humans" ] ], { "s": "Scientists", "n": 6 }
     ],
     [ "taxo-", "arrangement, order", "Greek taxis", [ [ "taxonomy", "taxis + nomos (law): the rules for arranging and naming living things" ] ], { "s": "Scientists", "n": 5 }
     ],
     [ "bio-", "life", "Greek bios", [ [ "biology", "the study of life" ], [ "biogeography", "describing where living things are found on earth" ] ], { "s": "Scientists", "n": 3 }
     ],
     [ "-graphy", "writing, describing", "Greek graphein, to write", [ [ "biogeography", "describing the geography of life" ] ], { "s": "Scientists", "n": 2 }
     ],
     [ "helio-", "sun", "Greek hēlios", [ [ "heliocentric", "with the sun at the center (Copernicus)" ] ], { "s": "Scientists", "n": 2 }
     ],
     [ "-centric", "centered on", "Greek kentron, center", [ [ "heliocentric", "sun-centered model of the solar system" ] ], { "s": "Scientists", "n": 2 }
     ],
     [ "particul-", "small part", "Latin particula", [ [ "particulate inheritance", "traits pass on as separate units that don't blend (Mendel)" ] ], { "s": "Scientists", "n": 2 }
     ]
    ],
    "Roots most common in the Scientists tab: Copernicus, Hutton, Lyell, Linnaeus and the sciences they founded."
   ],
   [
    "Cells & DNA",
    [
     [ "eu-", "true, good", "Greek eu", [ [ "eukaryote", "a cell with a true nucleus" ] ]
     ],
     [ "karyo-", "kernel, nucleus", "Greek karyon, nut", [ [ "eukaryote", "true kernel: DNA wrapped inside a nucleus" ] ]
     ],
     [ "nucle-", "kernel, core", "Latin nucleus, little nut", [ [ "nucleus", "the cell's core, holding the DNA" ], [ "nucleotide", "a building block of DNA and RNA" ] ]
     ]
    ],
    "Roots most common in the Cells & DNA tab: the cell and its nucleus."
   ],
   [
    "Protein synthesis",
    [
     [ "trans-", "across", "Latin trans", [ [ "transcription", "copying DNA's message across into mRNA" ], [ "translation", "carrying the mRNA code across into a protein" ] ]
     ],
     [ "script-", "write", "Latin scribere, scriptum", [ [ "transcription", "re-writing the gene as mRNA" ] ]
     ],
     [ "anti-", "against, opposite", "Greek anti", [ [ "anticodon", "the tRNA triplet that pairs opposite an mRNA codon" ] ]
     ],
     [ "poly-", "many", "Greek polys", [ [ "polypeptide", "a chain of many amino acids" ] ]
     ]
    ],
    "Roots most common in the Protein synthesis tab: from DNA to RNA to protein."
   ],
   [
    "Genetics",
    [
     [ "allo-", "other", "Greek allos", [ [ "allele", "from allelomorph, “other form”: another version of a gene" ] ], { "s": "Genetics", "n": 24 }
     ],
     [ "-zygous", "yoked, paired", "Greek zygon", [ [ "homozygous", "a same pair" ], [ "heterozygous", "a different pair" ] ], { "s": "Genetics", "n": 23 }
     ],
     [ "-ism", "belief, theory, condition", "Greek -ismos", [ [ "catastrophism", "a theory of the earth's past" ], [ "albinism", "the condition of lacking pigment" ] ], { "s": "Genetics", "n": 16 }
     ],
     [ "-type", "form, model", "Greek typos", [ [ "genotype", "the genetic form" ], [ "phenotype", "the visible form" ] ], { "s": "Genetics", "n": 16 }
     ],
     [ "hetero-", "different", "Greek heteros", [ [ "heterozygous", "two different alleles (Aa)" ] ], { "s": "Genetics", "n": 16 }
     ],
     [ "albin-", "white", "Latin albus", [ [ "albinism", "a genetic condition with little or no pigment" ] ], { "s": "Genetics", "n": 16 }
     ],
     [ "-osis", "process, condition", "Greek", [ [ "mitosis", "the process of ordinary cell division" ], [ "meiosis", "the process of making sex cells" ] ], { "s": "Genetics", "n": 14 }
     ],
     [ "gen-", "birth, origin, kind", "Greek genos", [ [ "gene", "a unit of inheritance" ], [ "genotype", "the alleles an individual carries" ], [ "genetics", "the study of inheritance" ] ], { "s": "Genetics", "n": 14 }
     ],
     [ "-some", "body", "Greek sōma", [ [ "chromosome", "colored body" ], [ "ribosome", "the body that builds proteins" ] ], { "s": "Genetics", "n": 10 }
     ],
     [ "chromo-", "color", "Greek chrōma", [ [ "chromosome", "named because it soaks up colored dye under the microscope" ] ], { "s": "Genetics", "n": 10 }
     ],
     [ "homo-", "same", "Greek homos", [ [ "homozygous", "two of the same allele (AA or aa)" ], [ "homologous", "a matching pair of chromosomes, one from each parent" ] ], { "s": "Genetics", "n": 10 }
     ],
     [ "meio-", "less, smaller", "Greek meiōn", [ [ "meiosis", "reduction division: makes sex cells with half the chromosomes" ] ], { "s": "Genetics", "n": 8 }
     ],
     [ "mito-", "thread", "Greek mitos", [ [ "mitosis", "cell division where chromosomes show as threads" ], [ "mitochondria", "mitos + chondrion (grain): thread-like grains that make energy" ] ], { "s": "Genetics", "n": 6 }
     ],
     [ "pheno-", "to show, appear", "Greek phainein", [ [ "phenotype", "the trait that shows: what you can observe" ] ], { "s": "Genetics", "n": 4 }
     ],
     [ "somat-", "body", "Greek sōma, sōmatos", [ [ "somatic cells", "body cells, as opposed to sex cells" ] ], { "s": "Genetics", "n": 3 }
     ],
     [ "-ploid", "-fold, number of sets", "Greek -ploos", [ [ "diploid", "twofold" ], [ "haploid", "single-fold" ] ], { "s": "Genetics", "n": 3 }
     ],
     [ "di-", "two, double", "Greek di-", [ [ "diploid", "two sets of chromosomes (body cells)" ] ], { "s": "Genetics", "n": 2 }
     ],
     [ "haplo-", "single, simple", "Greek haplous", [ [ "haploid", "one set of chromosomes (sex cells). On Exam 2: haplorrhine, “simple nose.”" ] ], { "s": "Genetics", "n": 1 }
     ]
    ],
    "Roots most common in the Genetics tab: alleles, genotypes, chromosomes and cell division."
   ],
   [
    "Forces of evolution",
    [
     [ "zyg-", "yoke, joined pair", "Greek zygon", [ [ "zygote", "the fertilized egg, where sperm and egg are joined" ] ]
     ],
     [ "syn-", "together", "Greek syn", [ [ "protein synthesis", "putting amino acids together into a protein" ] ]
     ],
     [ "muta-", "change", "Latin mutare", [ [ "mutation", "a change in the DNA sequence" ] ]
     ],
     [ "migr-", "move, wander", "Latin migrare", [ [ "migration", "individuals moving between populations, carrying alleles with them: gene flow" ] ]
     ],
     [ "morph-", "shape, form", "Greek morphē", [ [ "dimorphism", "two forms, such as males and females looking different" ] ]
     ]
    ],
    "Roots most common in the Forces of evolution tab: mutation, gene flow and the Modern Synthesis."
   ]
  ]
 },
 "exam2": {
  "name": "Exam 2",
  "sub": "Speciation, phylogeny, primate traits, taxonomy, teeth and skulls, and primate social life.",
  "groups": [
   [
    "Speciation",
    [
     [ "spec-", "kind, appearance", "Latin species", [ [ "species", "a kind of organism" ], [ "speciation", "the making of new species" ] ], { "s": "Speciation", "n": 57 }
     ],
     [ "patr-", "father; homeland", "Greek patris", [ [ "allopatric", "in another homeland: populations split by a barrier" ], [ "sympatric", "in the same homeland" ], [ "peripatric", "at the edge of the homeland" ] ], { "s": "Speciation", "n": 21 }
     ],
     [ "-genesis", "origin, creation", "Greek genesis", [ [ "anagenesis", "one lineage changing into a new form" ], [ "cladogenesis", "a lineage branching into two" ] ], { "s": "Speciation", "n": 16 }
     ],
     [ "ana-", "up, anew", "Greek ana", [ [ "anagenesis", "evolving anew along one line, without splitting" ] ], { "s": "Speciation", "n": 10 }
     ],
     [ "allo-", "other", "Greek allos", [ [ "allopatric", "in another homeland" ], [ "allo-parenting", "care of an infant by someone other than its parent" ] ], { "s": "Speciation", "n": 8 }
     ],
     [ "grad-", "step", "Latin gradus", [ [ "gradualism", "evolution by slow, small steps" ] ], { "s": "Speciation", "n": 8 }
     ],
     [ "peri-", "around, near the edge", "Greek peri", [ [ "peripatric", "a small group budding off at the edge of the range" ] ], { "s": "Speciation", "n": 7 }
     ],
     [ "clado-", "branch", "Greek klados", [ [ "cladogenesis", "branching speciation" ], [ "clade", "a branch: an ancestor and all its descendants" ] ], { "s": "Speciation", "n": 7 }
     ],
     [ "-genic", "produced by, caused by", "Greek -genēs", [ [ "anthropogenic", "caused by humans, like the dodo's extinction" ] ], { "s": "Speciation", "n": 2 }
     ]
    ],
    "Roots most common in the Speciation tab: how new species form, and the pace of change."
   ],
   [
    "Phylogeny",
    [
     [ "homo-", "same", "Greek homos", [ [ "homodont", "teeth all of one kind" ], [ "homology", "a trait shared because of a common ancestor" ] ], { "s": "Phylogeny", "n": 9 }
     ],
     [ "verg-", "bend, turn toward", "Latin vergere", [ [ "convergent evolution", "unrelated lineages turning toward the same form" ] ], { "s": "Phylogeny", "n": 3 }
     ],
     [ "phylo-", "tribe, lineage", "Greek phylon", [ [ "phylogeny", "the family tree of a lineage" ] ], { "s": "Phylogeny", "n": 2 }
     ]
    ],
    "Roots most common in the Phylogeny tab: shared ancestry, homology and analogy."
   ],
   [
    "Primate traits",
    [
     [ "ceno-", "new, recent", "Greek kainos", [ [ "Cenozoic", "the era of recent life, after the dinosaurs (66 mya to now)" ] ]
     ],
     [ "zo-", "animal, life", "Greek zōion", [ [ "Cenozoic", "recent life" ] ]
     ],
     [ "-geny", "development, origin", "Greek -geneia", [ [ "phylogeny", "how a lineage developed" ], [ "ontogeny", "how an individual develops" ] ]
     ],
     [ "quadru- / -ped", "four / foot", "Latin quattuor, pes", [ [ "quadrupedal", "walking on four feet" ] ]
     ],
     [ "stereo-", "solid, three-dimensional", "Greek stereos", [ [ "stereoscopic vision", "seeing in depth with overlapping fields of view" ] ]
     ],
     [ "-scop-", "look at, see", "Greek skopein", [ [ "stereoscopic", "seeing in three dimensions" ] ]
     ],
     [ "tri-", "three", "Latin and Greek", [ [ "trichromatic", "three-color vision" ] ]
     ],
     [ "chromat-", "color", "Greek chrōma, chrōmatos", [ [ "trichromatic", "seeing with three types of color cones" ] ]
     ],
     [ "diurn-", "day", "Latin diurnus", [ [ "diurnal", "active by day" ] ]
     ],
     [ "onto-", "being, individual", "Greek on, ontos", [ [ "ontogeny", "an individual's growth from birth to adulthood" ] ]
     ],
     [ "hetero-", "different", "Greek heteros", [ [ "heterodont", "incisors, canines, premolars and molars: different jobs" ] ]
     ],
     [ "ortho-", "straight", "Greek orthos", [ [ "orthognathic", "straight-jawed: a flat face, jaw not jutting" ] ]
     ],
     [ "gnath-", "jaw", "Greek gnathos", [ [ "orthognathic", "flat face" ], [ "prognathic", "jaw jutting forward" ] ]
     ]
    ],
    "Roots most common in the Primate traits tab: vision, growing up, the Cenozoic and faces."
   ],
   [
    "Taxonomy",
    [
     [ "-ini / -ine", "group name / a member of it", "Latin plural -i", [ [ "Strepsirrhini → strepsirrhine", "the formal group name vs. one member of the group" ], [ "Catarrhini → catarrhine", "the same pattern" ] ], { "s": "Taxonomy", "n": 85 }
     ],
     [ "rhin- / -rrhine", "nose", "Greek rhis, rhinos", [ [ "rhinarium", "the moist, bare nose tip of strepsirrhines" ], [ "platyrrhine", "flat-nosed" ], [ "catarrhine", "down-nosed" ] ], { "s": "Taxonomy", "n": 66 }
     ],
     [ "-oid / -oidea", "resembling; superfamily ending", "Greek -oeidēs, like", [ [ "hominoid", "Hominoidea, the ape superfamily" ], [ "cercopithecoid", "Cercopithecoidea, the Old World monkey superfamily" ] ], { "s": "Taxonomy", "n": 57 }
     ],
     [ "strepsi-", "turned, twisted", "Greek strepsis", [ [ "strepsirrhine", "turned nose: curled, comma-shaped nostrils (lemurs, lorises)" ] ], { "s": "Taxonomy", "n": 53 }
     ],
     [ "haplo-", "simple, single", "Greek haplous", [ [ "haplorrhine", "simple nose: dry, with no rhinarium (tarsiers, monkeys, apes)" ] ], { "s": "Taxonomy", "n": 40 }
     ],
     [ "homin-", "human (Latin)", "Latin homo, hominis", [ [ "hominoid", "human-like: apes and humans (Hominoidea)" ] ], { "s": "Taxonomy", "n": 32 }
     ],
     [ "platy-", "flat, broad", "Greek platys", [ [ "platyrrhine", "flat nose: wide-set nostrils facing sideways (New World monkeys)" ] ], { "s": "Taxonomy", "n": 30 }
     ],
     [ "lemur", "spirit of the night", "Latin lemures, ghosts", [ [ "lemur", "named by Linnaeus for their quiet, ghost-like activity at night" ] ], { "s": "Taxonomy", "n": 29 }
     ],
     [ "cata-", "down", "Greek kata", [ [ "catarrhine", "down nose: close-set nostrils facing down (Old World monkeys and apes)" ] ], { "s": "Taxonomy", "n": 28 }
     ],
     [ "tapetum lucidum", "shining carpet", "Latin tapete + lucidus", [ [ "tapetum lucidum", "the reflective layer behind the retina that makes eyes glow at night" ] ], { "s": "Taxonomy", "n": 23 }
     ],
     [ "tars-", "ankle", "Greek tarsos", [ [ "tarsier", "named for its very long tarsal (ankle) bones" ] ], { "s": "Taxonomy", "n": 16 }
     ],
     [ "cerco-", "tail", "Greek kerkos", [ [ "Cercopithecoidea", "kerkos + pithēkos: “tailed apes,” the Old World monkeys" ] ], { "s": "Taxonomy", "n": 14 }
     ],
     [ "pithec-", "ape", "Greek pithēkos", [ [ "Cercopithecoidea", "tailed ape" ] ], { "s": "Taxonomy", "n": 14 }
     ],
     [ "simian", "ape, monkey", "Latin simia", [ [ "prosimian", "pre-monkey" ], [ "simian", "monkey-like" ] ], { "s": "Taxonomy", "n": 12 }
     ],
     [ "ischi-", "hip", "Greek ischion", [ [ "ischial callosities", "sitting pads on the ischium, the sitting bone" ] ], { "s": "Taxonomy", "n": 12 }
     ],
     [ "prehens-", "grasp, seize", "Latin prehendere", [ [ "prehensile tail", "a tail that can grasp, like a fifth hand" ] ], { "s": "Taxonomy", "n": 11 }
     ],
     [ "brachi-", "arm", "Latin bracchium", [ [ "brachiation", "swinging arm over arm beneath branches" ] ], { "s": "Taxonomy", "n": 11 }
     ],
     [ "noct-", "night", "Latin nox, noctis", [ [ "nocturnal", "active at night" ] ], { "s": "Taxonomy", "n": 11 }
     ],
     [ "post-", "after, behind", "Latin post", [ [ "post-orbital bar / closure", "the bone behind the eye socket" ] ], { "s": "Taxonomy", "n": 11 }
     ],
     [ "orbit-", "circle, track; eye socket", "Latin orbita, wheel track", [ [ "post-orbital", "behind the eye socket" ] ], { "s": "Taxonomy", "n": 11 }
     ],
     [ "-dont", "tooth", "Greek odous, odontos", [ [ "homodont", "all teeth alike" ], [ "heterodont", "different kinds of teeth" ], [ "bilophodont", "two-ridged teeth" ] ], { "s": "Taxonomy", "n": 9 }
     ],
     [ "sym- / syn-", "together", "Greek syn", [ [ "sympatric", "in the same homeland" ], [ "mandibular symphysis", "sym + physis (growth): where the two jaw halves grow together" ] ], { "s": "Taxonomy", "n": 8 }
     ],
     [ "bi-", "two", "Latin bis", [ [ "bilophodont", "two ridges, each joining a pair of cusps (Old World monkeys)" ] ], { "s": "Taxonomy", "n": 8 }
     ],
     [ "lopho-", "crest, ridge", "Greek lophos", [ [ "bilophodont", "bi + lophos + odont: two-ridged tooth" ] ], { "s": "Taxonomy", "n": 8 }
     ],
     [ "arbor-", "tree", "Latin arbor", [ [ "arboreal", "living in trees" ] ], { "s": "Taxonomy", "n": 7 }
     ],
     [ "-vore", "eater", "Latin vorare, to devour", [ [ "frugivore", "fruit eater" ], [ "folivore", "leaf eater" ], [ "insectivore", "insect eater" ] ], { "s": "Taxonomy", "n": 6 }
     ],
     [ "pro-", "before, forward", "Greek and Latin pro", [ [ "prosimian", "“before the apes”: an older name for lemurs, lorises and tarsiers" ], [ "prognathic", "with the jaw jutting forward" ] ], { "s": "Taxonomy", "n": 6 }
     ],
     [ "callos-", "hard skin", "Latin callosus", [ [ "callosities", "thick, hardened pads of skin" ] ], { "s": "Taxonomy", "n": 6 }
     ],
     [ "anthropo-", "human being", "Greek anthrōpos", [ [ "anthropoid", "human-like: monkeys, apes and humans" ], [ "anthropogenic", "caused by humans" ] ], { "s": "Taxonomy", "n": 5 }
     ],
     [ "frugi-", "fruit", "Latin frux, frugis", [ [ "frugivore", "a fruit eater, like an orangutan" ] ], { "s": "Taxonomy", "n": 3 }
     ],
     [ "colobus", "docked, cut short", "Greek kolobos", [ [ "colobus", "named for its tiny, stub-like thumb" ] ], { "s": "Taxonomy", "n": 3 }
     ],
     [ "terr-", "earth, ground", "Latin terra", [ [ "terrestrial", "living on the ground" ] ], { "s": "Taxonomy", "n": 2 }
     ],
     [ "foli-", "leaf", "Latin folium", [ [ "folivore", "a leaf eater, like a colobus or howler" ] ], { "s": "Taxonomy", "n": 1 }
     ],
     [ "omni-", "all", "Latin omnis", [ [ "omnivore", "eats plants and animals" ] ], { "s": "Taxonomy", "n": 1 }
     ],
     [ "mandib-", "chew", "Latin mandere", [ [ "mandible", "the lower jaw, the chewing bone" ] ]
     ]
    ],
    "Roots most common in the Taxonomy tab (and Picture ID and the Classification drill): the primate groups and the traits that tell them apart."
   ],
   [
    "Sociality",
    [
     [ "poly-", "many", "Greek polys", [ [ "polygyny", "one male, many females" ], [ "polyandry", "one female, many males" ], [ "polygynandry", "many males and many females" ] ], { "s": "Sociality", "n": 22 }
     ],
     [ "-gyny", "woman, female", "Greek gynē", [ [ "polygyny", "many females to one male (gorillas)" ] ], { "s": "Sociality", "n": 13 }
     ],
     [ "morph-", "shape, form", "Greek morphē", [ [ "dimorphism", "two forms: males and females differ in size or looks" ], [ "morphological species concept", "species defined by body form" ] ], { "s": "Sociality", "n": 13 }
     ],
     [ "-cide", "killing", "Latin caedere", [ [ "infanticide", "the killing of infants, e.g. by a new male in langurs" ] ], { "s": "Sociality", "n": 8 }
     ],
     [ "philo-", "love, fondness", "Greek philos", [ [ "philopatry", "“love of home”: staying in the group you were born into" ] ], { "s": "Sociality", "n": 7 }
     ],
     [ "con-", "with, together", "Latin con-, cum", [ [ "conspecific", "a member of the same species" ], [ "convergent", "turning toward the same form" ] ], { "s": "Sociality", "n": 6 }
     ],
     [ "orangutan", "person of the forest", "Malay orang + hutan", [ [ "orangutan", "the forest-dwelling great ape of Borneo and Sumatra" ] ], { "s": "Sociality", "n": 5 }
     ],
     [ "mono-", "one, single", "Greek monos", [ [ "monogamy", "one mate: a pair bond" ] ], { "s": "Sociality", "n": 4 }
     ],
     [ "-gamy", "marriage, mating", "Greek gamos", [ [ "monogamy", "mating with one partner" ] ], { "s": "Sociality", "n": 4 }
     ],
     [ "-andry", "man, male", "Greek anēr, andros", [ [ "polyandry", "many males to one female (some marmosets)" ] ], { "s": "Sociality", "n": 4 }
     ],
     [ "altru-", "other", "Latin alter", [ [ "altruism", "helping others at a cost to yourself" ] ], { "s": "Sociality", "n": 4 }
     ]
    ],
    "Roots most common in the Sociality tab: groups, mating systems and behavior."
   ]
  ]
 }
};
