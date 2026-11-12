// Read & Learn for ANTH 102: the course as short reading passages, in eight chapters (four for each exam).
// Each section is a passage followed by "check yourself" questions taken from the Exam 1 and Exam 2 drill banks by id
// ("1TH0" = Exam 1, question TH0; "2PR13" = Exam 2, question PR13; see read/bank.js, built by tools/build-read.js),
// so answers here count toward those drills' progress and earn XP like any other answer.
// The passages are written from the same course content as the drills: the Top Hat questions, Brightspace activities,
// films (What Darwin Never Knew, Life in the Trees, Why Sex?) and lecture slides. Check anything that differs from your notes.
window.READ = [
{
  id: "sci", topic: "Science and early ideas", title: "Science, and the world before Darwin", ch: "Exam 1 · Science · Scientists",
  intro: "Before Darwin, most people thought species were fixed and the earth was young. This chapter covers how science works, and the thinkers whose ideas Darwin built on or had to overturn.",
  sections: [
    { h: "Anthropology and the scientific method",
      html: `<p>Anthropology has <strong>four fields</strong>: cultural anthropology, biological anthropology, archaeology and linguistic anthropology. This course is biological anthropology: human evolution and our place among the primates.</p>
<p>Science investigates the world with the <strong>scientific method</strong>: observe, state a hypothesis, collect data and test it.</p>
<ul><li>A <strong>hypothesis</strong> is a prediction, an educated guess based on observations. It must be <strong>testable</strong> and <strong>falsifiable</strong>: there has to be some result that could show it's wrong.</li>
<li>A <strong>theory</strong> is not a guess. In science it's a well-tested explanation that has survived repeated attempts to refute it. (Everyday speech uses the word very differently.)</li></ul>`,
      qs: ["1TH0", "1TH1", "1AP9", "1AP5", "1AP7", "1TH2", "1AP8"] },
    { h: "A fixed world: the Great Chain of Being and Linnaeus",
      html: `<p>The pre-Darwinian picture was the <strong>Great Chain of Being</strong> (<i>Scala Naturae</i>): every kind of matter and life sat on one hierarchical ladder, and each species was fixed in its place. Species did not change.</p>
<p><strong>Carolus Linnaeus</strong>, a Swedish naturalist, organized that fixed world. He devised the <strong>taxonomic hierarchy</strong> and <strong>binomial nomenclature</strong>, the two-part name of genus and species, as in <i>Homo sapiens</i>. He did not propose evolution, and he had nothing to do with a sun-centered universe.</p>`,
      qs: ["1TH3", "1AP10", "1AP14", "1TH6", "1PP28", "1PP29"] },
    { h: "Deep time and the struggle for existence: Lyell and Malthus",
      html: `<p>Two thinkers gave Darwin pieces he needed.</p>
<ul><li><strong>Charles Lyell</strong> wrote <i>Principles of Geology</i> and argued for <strong>uniformitarianism</strong>: the geological processes we see today worked the same way in the past, slowly and gradually. That makes the earth immensely old, far older than 6,000 years, which gives slow evolutionary change the time it needs.</li>
<li><strong>Thomas Malthus</strong>, an English economist, wrote <i>An Essay on the Principle of Population</i>. He argued that populations outgrow their resources, so individuals compete. Darwin took from this the idea of a <strong>struggle for existence</strong>.</li></ul>`,
      qs: ["1TH7", "1AP18", "1AP11", "1PP23", "1TH4", "1AP12", "1PP25", "1PP35"],
      play: [{ t: "match", title: "Who did what?", pairs: [["Linnaeus", "taxonomic hierarchy and binomial nomenclature"], ["Lyell", "uniformitarianism: an old, slowly changing earth"], ["Malthus", "overpopulation drives competition"], ["Lamarck", "inheritance of acquired characteristics"], ["Wallace", "co-discoverer of natural selection"]] }] },
    { h: "Lamarck's answer",
      html: `<p><strong>Jean-Baptiste Lamarck</strong> gave the <strong>first explanation for how evolutionary change happens</strong>, which makes him important even though his mechanism was wrong.</p>
<p>His idea was the <strong>inheritance of acquired characteristics</strong>: traits an organism acquires during its lifetime are passed to its offspring. The classic example is a giraffe that stretches its neck to reach leaves and so has longer-necked young.</p>
<p>Don't mix the names up: Lamarck is acquired characteristics, never natural selection. Natural selection belongs to Darwin and Wallace.</p>`,
      qs: ["1TH5", "1AP13", "1PP26", "1PP27", "1PP34"] }
  ]
},
{
  id: "darwin", topic: "Darwin", title: "Darwin and natural selection", ch: "Exam 1 · Natural selection",
  intro: "Darwin spent five years on the Beagle, came home with evidence that species change, and worked out why. This chapter follows the voyage, the mechanism, the evidence, and the one thing he could never explain.",
  sections: [
    { h: "The voyage of the Beagle",
      html: `<p>Charles Darwin was first sent to Edinburgh to <strong>study medicine</strong>, which he didn't take to. He later joined the <strong>HMS Beagle</strong>, where his role was to be a <strong>conversationalist (companion) to the captain</strong>.</p>
<ul><li>In <strong>Argentina</strong> he dug up <strong>fossils of large extinct mammals</strong> that resembled smaller living ones.</li>
<li>On the <strong>Galápagos Islands</strong>, off Ecuador, he collected finches. What was remarkable is that they were <strong>variations of a single type</strong>: slightly different species on different islands.</li></ul>
<p>From all of this he amassed evidence that <strong>species change over time</strong>.</p>`,
      qs: ["1AC1", "1AC2", "1AC3", "1AC4", "1AC5", "1AC6"] },
    { h: "Natural selection, and Wallace",
      html: `<p>Darwin's mechanism is <strong>natural selection</strong>: individuals vary, some variations help survival and reproduction, and those are passed on more often. Over generations, alleles linked to better survival and reproduction <strong>increase in frequency</strong>.</p>
<p>Another young British naturalist, <strong>Alfred Russel Wallace</strong>, independently reached the same conclusion, which is why he's called the co-discoverer. Darwin then published <i>On the Origin of Species</i>.</p>
<p>Darwin's <strong>tree of life</strong> expresses the result: all living and extinct species are connected, some closely and others distantly, through common ancestors.</p>`,
      qs: ["1TH8", "1AP6", "1PP20", "1PP21", "1AC8", "1AP33"] },
    { h: "Fitness means offspring",
      html: `<p>In evolution, <strong>fitness</strong> is not strength, health or size. It's <strong>reproductive success</strong>: how many surviving offspring you leave. Of four lizards, the one with the most surviving offspring (28) has the highest fitness, even if another is healthier or larger.</p>
<ul><li>Natural selection <strong>operates on individuals</strong>, but evolution <strong>occurs at the population level</strong>. Individuals don't evolve; populations do.</li>
<li>Selection doesn't make perfect organisms. Many traits are just <strong>good enough</strong> to give an advantage.</li>
<li>Rock pocket mice on dark lava rock survive because their <strong>dark fur camouflages</strong> them from predators.</li></ul>`,
      qs: ["1TH12", "1AP27", "1TH14", "1TH11", "1AP26", "1AC10"] },
    { h: "The evidence",
      html: `<ul><li><strong>Homologous structures</strong> are similar across species because of common ancestry, even when they do different jobs.</li>
<li><strong>Vestigial structures</strong> have lost their function. Darwin read them as leftovers of an evolutionary past.</li>
<li><strong>Embryos</strong> show shared ancestry: the slits in a fish embryo's neck become gills, and the same slits in a human embryo become <strong>bones of the inner ear</strong>.</li>
<li><strong>Artificial selection</strong>: breeders choose which traits pass on. The whippet was bred to chase rabbits.</li>
<li>Selection can be watched today. Overusing <strong>antibiotics</strong>, including in livestock, favors <strong>resistant bacteria</strong>.</li>
<li><strong>Adaptive radiation</strong>: one founding species diversifies into many, like the Galápagos finches, or mammals after the dinosaurs died out about 65 million years ago.</li></ul>`,
      qs: ["1AP19", "1AP15", "1PP33", "1AC7", "1AC9", "1TH13", "1TH9", "1AP17"],
      play: [{ t: "match", title: "Name the evidence", pairs: [["Similar structure, shared ancestor", "homologous structure"], ["No longer has a function", "vestigial structure"], ["Breeders pick the traits", "artificial selection"], ["One founder species becomes many", "adaptive radiation"], ["Resistant bacteria spread", "natural selection today"]] }] },
    { h: "What Darwin never knew",
      html: `<p>Darwin admitted holes in his theory. The biggest: he <strong>couldn't explain where variation comes from</strong>, or how traits are inherited. <strong>Genetics was not available to him</strong>, so it isn't in the <i>Origin</i>.</p>
<p>The popular idea of his day was <strong>blending inheritance</strong>: offspring are a blend of their parents. If that were true, variation would be washed away each generation and selection would have nothing to work on. The same idea was a barrier to accepting <strong>Gregor Mendel's</strong> principles of inheritance, which showed traits are passed on as separate units.</p>`,
      qs: ["1AC0", "1TH10", "1AP16", "1PP30"] }
  ]
},
{
  id: "dna", topic: "Cells and DNA", title: "Cells, DNA and how genes build bodies", ch: "Exam 1 · Cells & DNA · Protein synthesis",
  intro: "The answer to Darwin's puzzle is DNA. This chapter covers where DNA sits in the cell, how it's built, how its code becomes a protein, and how the same genes can build very different bodies.",
  sections: [
    { h: "Cells and where DNA lives",
      html: `<p><strong>Prokaryotes</strong> (bacteria) have <strong>no nucleus</strong>. <strong>Eukaryotes</strong>, including us, keep their DNA inside a <strong>nucleus</strong>, the structure that separates DNA from the rest of the cell. DNA replication happens in the nucleus.</p>
<p>Body cells are <strong>somatic cells</strong>. Sex cells are <strong>gametes</strong> (egg and sperm), and only gametes carry genetic information from parent to offspring. That's why a mutation matters for evolution only if it's in a gamete.</p>`,
      qs: ["1TH16", "1AC30", "1AP1", "1TH17", "1AP32"] },
    { h: "How DNA is built",
      html: `<p>DNA is a double helix made of <strong>nucleotides</strong>. Each nucleotide has three parts: a <strong>phosphate</strong>, the sugar <strong>deoxyribose</strong>, and a <strong>nitrogenous base</strong>. Sugar and phosphate form the backbone.</p>
<ul><li>There are four bases: <strong>G, A, T, C</strong>. The pairing rules never change: <strong>A pairs with T</strong>, and <strong>C pairs with G</strong>.</li>
<li>Plant, mammal and bacterial DNA all use the same backbone, the same four bases and the same pairing rules. The <strong>only thing that differs is the sequence</strong> (order) of the bases.</li>
<li><strong>RNA</strong> differs from DNA: it's single-stranded, its sugar is ribose, and it uses <strong>uracil (U) instead of thymine</strong>. It still has A, C and G.</li></ul>`,
      qs: ["1TH19", "1AC32", "1AC33", "1AC11", "1AC12", "1AC38", "1AC36", "1TH20", "1AP0"] },
    { h: "From DNA to protein",
      html: `<p>A gene's code becomes a protein in two steps.</p>
<ol><li><strong>Transcription</strong>, in the <strong>nucleus</strong>: mRNA copies the DNA template strand and carries the message to the ribosome. mRNA is read in three-base <strong>codons</strong>.</li>
<li><strong>Translation</strong>, in the <strong>cytoplasm</strong>: <strong>tRNA</strong> brings amino acids to the ribosome. Each tRNA has a three-base <strong>anticodon</strong> that matches an mRNA codon. <strong>Peptide bonds</strong> join the amino acids into a <strong>polypeptide</strong>, a chain of amino acids.</li></ol>
<p>Worked example, DNA template <strong>TCA GCC TAA</strong>: the mRNA is the complement with U for T, <strong>AGU CGG AUU</strong>. The tRNA anticodons complement the mRNA, <strong>UCA GCC UAA</strong> (the template again, with U for T). The codon table then gives <strong>serine, arginine, isoleucine</strong>.</p>`,
      qs: ["1TH21", "1AC42", "1AC51", "1AC45", "1AC50", "1AC47", "1AC46", "1AC44", "1AC39", "1AC40", "1AC41"],
      play: [{ t: "sort", title: "Where does it happen?", bins: ["Nucleus", "Cytoplasm (ribosome)"], items: [["Transcription", 0], ["DNA replication", 0], ["mRNA is made", 0], ["Translation", 1], ["tRNA brings amino acids", 1], ["Peptide bonds form", 1]] }] },
    { h: "Practice reading a sequence",
      html: `<p>Three rules cover every sequence question:</p>
<ul><li><strong>DNA to its complementary DNA strand:</strong> A↔T and C↔G. AAG TTC CTT pairs with TTC AAG GAA.</li>
<li><strong>DNA template to mRNA:</strong> the same complement, but write <strong>U</strong> wherever you'd write T. GTA AAG TAG gives CAU UUC AUC.</li>
<li><strong>mRNA codons to tRNA anticodons:</strong> complement again, still using U. GAA UAC UUG gives CUU AUG AAC.</li></ul>
<p>A shortcut: the tRNA anticodons are the DNA template with every T changed to U. For amino acids, always read the <strong>mRNA codons</strong> in the codon table, never the DNA.</p>`,
      qs: ["1SQ0", "1SQ8", "1AP4", "1SQ9", "1SQ10", "1SQ11", "1SQ13"] },
    { h: "Genes, switches and body plans",
      html: `<p>Humans have only about <strong>20,000 to 23,000 genes</strong>, and just <strong>2% of the genome codes for proteins</strong>. Much of the rest regulates genes.</p>
<ul><li>A genetic <strong>switch</strong> turns genes on and off. Fruit flies with spotted and unspotted wings carry the same gene, switched differently.</li>
<li>Stickleback fish lose their spikes through the same switch involved in the <strong>loss of hindlimbs in manatees and whales</strong>.</li>
<li>Galápagos finch beaks differ because the <strong>same genes are turned on at different times</strong>.</li>
<li><strong>Body-plan genes</strong> decide where the head and limbs go. The <strong>HOX genes</strong> are highly conserved, almost unchanged for about 600 million years and found in all complex animals.</li>
<li><strong>Tiktaalik</strong>, 375 million years old, is a transitional form: a fish body with an arm-like fin. Its body-plan genes were studied through a living relative, the <strong>paddlefish</strong>.</li></ul>`,
      qs: ["1TH28", "1AC17", "1AC18", "1AC19", "1AC20", "1TH29", "1AC23", "1AC16", "1AC21", "1AC22"] },
    { h: "What makes the human brain different",
      html: `<p>Dr. <strong>Katie Pollard</strong> compares human and chimpanzee DNA, which is about <strong>99% identical</strong>. In one gene involved in building the <strong>cortex</strong>, the part of the brain vital for language, music and mathematics, about <strong>18 mutations</strong> separate us from chimps.</p>
<p>The <strong>brain</strong> is the part of the body that changed most in human evolution. In chimpanzees, gorillas and orangutans the skull plates fuse at about <strong>3 to 4 years old</strong>, which limits brain growth; ours stay open much longer. In the rare disorder <strong>microcephaly</strong>, children are born with brains about half the normal size.</p>`,
      qs: ["1AC24", "1PP31", "1AC29", "1AC28", "1AC27", "1AC25", "1AC26"] }
  ]
},
{
  id: "genes", topic: "Genetics and evolution", title: "Inheritance and the forces of evolution", ch: "Exam 1 · Genetics · Forces of evolution",
  intro: "Mendel's units of inheritance plus Darwin's selection make modern evolutionary theory. This chapter covers chromosomes and meiosis, Punnett squares, and the forces that change a population's alleles.",
  sections: [
    { h: "Chromosomes, mitosis and meiosis",
      html: `<p>Humans have <strong>22 pairs of autosomes and 1 pair of sex chromosomes</strong>, 46 in all.</p>
<ul><li><strong>Mitosis</strong> happens in <strong>somatic cells</strong>. Each daughter cell is exactly like the parent cell.</li>
<li><strong>Meiosis</strong> makes <strong>gametes</strong>, which are <strong>haploid</strong>: 23 chromosomes, half the usual number.</li>
<li>During meiosis, homologous chromosomes swap material. This <strong>recombination (crossing over)</strong> shuffles the genes, which is why siblings get different combinations of their parents' traits.</li></ul>`,
      qs: ["1TH23", "1AP20", "1TH25", "1TH24", "1TH26", "1AP28"] },
    { h: "Alleles, genotype and phenotype",
      html: `<p><strong>Alleles</strong> are variants of a gene, such as the versions for brown and blue eyes. Your <strong>genotype</strong> is the pair of alleles you inherited; your <strong>phenotype</strong> is what shows.</p>
<ul><li><strong>Homozygous</strong> means two of the same allele (BB or bb). <strong>Heterozygous</strong> means two different ones (Bb).</li>
<li>A <strong>dominant</strong> allele shows with one copy, so Nn is near-sighted if N is dominant. A <strong>recessive</strong> allele shows only with <strong>two copies</strong>, one from each parent.</li>
<li><strong>Codominance:</strong> both alleles are expressed, as in AB blood type.</li>
<li><strong>Pleiotropy:</strong> one gene with several effects, like a cat gene giving white fur and red eyes.</li>
<li><strong>Linkage:</strong> alleles close together on a chromosome tend to be inherited as a unit.</li></ul>`,
      qs: ["1TH27", "1TH34", "1TH31", "1TH32", "1TH30", "1AP2", "1AP23", "1AP24"] },
    { h: "Punnett squares",
      html: `<p>A Punnett square crosses each parent's alleles. Know these outcomes:</p>
<ul><li><strong>BB × Bb:</strong> every offspring gets at least one B, so <strong>100% show the dominant trait</strong> and 0% show the recessive one.</li>
<li><strong>Bb × bb:</strong> half Bb, half bb, so <strong>50% dominant, 50% recessive</strong>.</li>
<li><strong>Aa × Aa</strong> (two carriers): AA, Aa, Aa, aa, so <strong>75% dominant, 25% recessive</strong>.</li></ul>
<p>Recessive disorders work this way. For Tay-Sachs, <strong>tt</strong> has the disease, <strong>Tt</strong> is a carrier and <strong>TT</strong> doesn't have the allele. Two carrier parents have a <strong>25% chance</strong> of a child with the disease on each pregnancy.</p>`,
      qs: ["1TH33", "1TH35", "1AP21", "1AC55", "1AC57", "1AC58", "1AC60", "1TH38", "1AC62"],
      play: [{ t: "match", title: "Which cross gives which result?", pairs: [["BB × Bb", "100% show the dominant trait"], ["Bb × bb", "50% dominant, 50% recessive"], ["Aa × Aa", "75% dominant, 25% recessive"], ["tt", "has the recessive disorder"], ["Tt", "carrier"]] }] },
    { h: "Mutation: the only source of new variation",
      html: `<p><strong>Mutation</strong> is the critical ingredient in evolution. It is how <strong>all new alleles first arise</strong>, so it's the only source of brand-new genetic variation, even though it's the <strong>weakest force</strong> at changing a population.</p>
<ul><li>Most mutations are <strong>neutral</strong>, neither good nor bad.</li>
<li>A <strong>point mutation</strong> changes a single base. Sickled hemoglobin comes from one.</li>
<li>Only mutations in <strong>gametes</strong> are passed on, so only those matter for evolution.</li>
<li>Whole chromosomes can go wrong too. <strong>Trisomy 18</strong> (Edwards syndrome) is a chromosomal abnormality caused by <strong>nondisjunction</strong>, when chromosomes fail to separate.</li></ul>`,
      qs: ["1AC13", "1AC14", "1TH22", "1AP22", "1AP30", "1TH37", "1TH36"] },
    { h: "Drift, bottlenecks, selection and the Modern Synthesis",
      html: `<ul><li><strong>Founder effect:</strong> a small group starts a new population and its alleles become common. The reproductively isolated Amish of Lancaster show rising rates of a recessive short-limb, extra-digit condition, and Dutch colonists carried the Huntington's gene to South Africa.</li>
<li><strong>Population bottleneck:</strong> a disaster cuts a population to a few survivors, like the Toba supervolcano more than 70,000 years ago.</li>
<li><strong>Heterozygote advantage:</strong> in malaria zones, people with one sickling and one normal hemoglobin allele have higher fitness than either homozygote.</li>
<li><strong>Sexual selection</strong> explains <strong>sexual dimorphism</strong>, the differences between males and females.</li></ul>
<p>In the 1930s the <strong>Modern Evolutionary Synthesis</strong> joined Mendel's genetics with Darwin's selection, and distinguished <strong>microevolution</strong> from <strong>macroevolution</strong>.</p>`,
      qs: ["1TH40", "1AP31", "1TH41", "1AP34", "1TH43", "1TH42", "1AP29", "1TH39", "1AP25"],
      play: [{ t: "sort", title: "Founder effect or bottleneck?", bins: ["Founder effect", "Population bottleneck"], items: [["Amish of Lancaster, PA", 0], ["Huntington's among Afrikaners", 0], ["A few colonists start a new population", 0], ["Toba supervolcano", 1], ["A disaster leaves a handful of survivors", 1]] }] }
  ]
},
{
  id: "species", topic: "Speciation and phylogeny", title: "Species, speciation and phylogeny", ch: "Exam 2 · Speciation · Phylogeny",
  intro: "Macroevolution is change at and above the species level. This chapter covers what counts as a species, how new ones form, how fast evolution goes, and how we work out who is related to whom.",
  sections: [
    { h: "What is a species?",
      html: `<p>There is more than one definition, and each suits a different job.</p>
<ul><li><strong>Biological species concept:</strong> a group of populations that can interbreed and produce <strong>fertile offspring</strong>, and are reproductively isolated from other groups.</li>
<li><strong>Morphological species concept:</strong> species defined by <strong>physical form</strong>. Paleontologists have to use this for fossils, which can't be tested for interbreeding.</li>
<li><strong>Ecological species concept:</strong> species defined by the <strong>niche</strong> they occupy: what they eat and where they live.</li></ul>
<p>A subdivision of a population is a <strong>deme</strong>.</p>`,
      qs: ["2PR0", "2AP21", "2PR1", "2PR2", "2PR9"] },
    { h: "How new species form",
      html: `<ul><li><strong>Allopatric speciation:</strong> a geographic barrier splits a population and the two sides diverge until they can't interbreed. A river dividing squirrels is the textbook case. The best primate example is <strong>bonobos and chimpanzees, separated by the Congo River</strong>.</li>
<li><strong>Peripatric speciation:</strong> a small group at the <strong>edge</strong> of the range becomes isolated. Founder effect and drift help it diverge quickly.</li>
<li><strong>Sympatric speciation:</strong> a new species arises in the same place, with no barrier. A spontaneous mutation stops gene flow with the parent population, like the slough crayfish whose offspring had three copies of each chromosome and reproduce by cloning.</li></ul>`,
      qs: ["2TH1", "2AP20", "2PR10", "2PR8", "2TH0", "2AP24"],
      play: [{ t: "match", title: "Which kind of speciation?", pairs: [["A river divides a squirrel population", "allopatric"], ["A small group at the edge of the range is cut off", "peripatric"], ["A mutation isolates offspring in the same place", "sympatric"], ["Bonobos and chimpanzees", "allopatric (Congo River)"]] }] },
    { h: "Tempo and pattern",
      html: `<p><strong>How fast?</strong> <strong>Gradualism</strong> is slow, steady change accumulating over long periods. <strong>Punctuated equilibrium</strong> is long periods of little change (<strong>stasis</strong>) interrupted by short bursts of rapid change.</p>
<p><strong>What shape?</strong> In <strong>anagenesis</strong>, species A gradually becomes species B along a single line. In <strong>cladogenesis</strong>, a lineage splits, so species A becomes A and B.</p>
<p><strong>Extinction</strong> is when no members of a species survive. Today <strong>anthropogenic</strong> factors, meaning human influence, are a major cause of endangerment and extinction.</p>`,
      qs: ["2PR4", "2PR3", "2AP23", "2PR7", "2AP22", "2PR11", "2TH2"] },
    { h: "Phylogeny: homology and analogy",
      html: `<p><strong>Systematics</strong> combines <strong>taxonomy</strong> (naming and grouping) with <strong>phylogeny</strong> (evolutionary relationships).</p>
<ul><li>A <strong>homology</strong> is a trait shared because it was inherited from a common ancestor.</li>
<li>An <strong>analogy</strong> does the same job but evolved independently, by <strong>convergent evolution</strong>. Wings in birds, bats and insects are analogies.</li>
<li>An <strong>ancestral (primitive) homology</strong> is old and widely shared, like five digits (pentadactyly) in primates, frogs and lizards. It doesn't tell you who is closest to whom.</li>
<li>A <strong>derived homology</strong> is newer and marks a group. <strong>Postorbital closure</strong> is shared by all haplorrhines but not strepsirrhines.</li></ul>
<p>This is why the old <strong>"prosimian"</strong> group was dropped: it put tarsiers with lemurs on ancestral look-alike traits instead of derived ones. The aye-aye's ever-growing incisors are <strong>highly derived</strong>.</p>`,
      qs: ["2PR12", "2PR13", "2PR14", "2PR15", "2PR16", "2PR17", "2PR18"],
      play: [{ t: "sort", title: "Homology or analogy?", bins: ["Homology (shared ancestor)", "Analogy (convergent)"], items: [["Five digits in primates and lizards", 0], ["Postorbital closure in haplorrhines", 0], ["Wings of birds and insects", 1], ["Wings of bats and birds, as wings", 1]] }] }
  ]
},
{
  id: "primate", topic: "Primate traits", title: "What makes a primate", ch: "Exam 2 · Primate traits",
  intro: "Primates are mammals built for life in the trees, with grasping hands, forward-facing eyes, big brains and slow childhoods. This chapter covers where primates came from and the features they share.",
  sections: [
    { h: "The age of mammals",
      html: `<p>The <strong>Cenozoic</strong>, the "age of mammals", began about <strong>66 million years ago</strong>. After the dinosaurs died out, mammals spread into the empty niches and diversified: an <strong>adaptive radiation</strong> that produced sea lions, elephants, sloths and primates. The <strong>protoprimate</strong> appeared around that time.</p>
<p>Primates have an <strong>arboreal heritage</strong>: the first primates were adapted to life in the trees. They're also called <strong>generalized</strong>, because they kept flexible features (five digits, a mixed diet, varied ways of moving) instead of specializing.</p>`,
      qs: ["2PR19", "2PR20", "2TH3", "2TH5", "2PR21"] },
    { h: "Hands and eyes for the trees",
      html: `<p>A successful life in the trees needs two things: grasping hands and forward-facing eyes.</p>
<ul><li><strong>Hands and feet:</strong> prehensile (grasping), with opposable thumbs, <strong>nails</strong> instead of claws, and tactile pads with fingerprint ridges called <strong>dermatoglyphs</strong>. Many primates have a <strong>precision grip</strong> between finger and thumb.</li>
<li><strong>Eyes:</strong> <strong>convergent (forward-facing) orbits</strong> give overlapping fields of view, so vision is <strong>binocular and stereoscopic</strong>, with 3D depth perception.</li>
<li><strong>Color vision</strong> is found in <strong>diurnal</strong> species, which rely heavily on visual cues.</li>
<li>In exchange, primates rely <strong>less on smell</strong>.</li></ul>`,
      qs: ["2LT0", "2PR22", "2AP11", "2PR23", "2AP10", "2PR24", "2LT8"] },
    { h: "Teeth, faces and brains",
      html: `<ul><li><strong>Heterodonty:</strong> different kinds of teeth for different jobs: incisors, canines, premolars and molars.</li>
<li>A <strong>dental formula</strong> counts them on one side of the jaw, front to back. <strong>2.1.3.3</strong> means 2 incisors, 1 canine, 3 premolars, 3 molars.</li>
<li>A flat face tucked under the braincase, as in humans, is <strong>orthognathic</strong>.</li>
<li><strong>Encephalization</strong> is a large brain relative to body size. The most encephalized part of a primate brain is the <strong>neocortex</strong>.</li></ul>`,
      qs: ["2TH6", "2PR25", "2PR26", "2AP0"] },
    { h: "Slow lives",
      html: `<p>Primate life history runs slowly: usually a <strong>single offspring</strong>, a <strong>long gestation</strong> and an <strong>extended ontogeny</strong> (growth and development).</p>
<p>The long childhood is the point. It gives young primates <strong>time to learn</strong> social roles and behavior. A chimpanzee infant stays dependent on its mother for <strong>at least 5 years</strong>.</p>`,
      qs: ["2PR27", "2TH8", "2LT22"] },
    { h: "Where primates live",
      html: `<p>Wild primates live in <strong>Central and South America, Africa and Asia</strong>. There are none native to <strong>Australia</strong>.</p>
<ul><li><strong>Lemurs</strong> are found only on <strong>Madagascar</strong>.</li>
<li>The <strong>orangutan</strong>, on Sumatra and Borneo, is the only great ape in Asia.</li></ul>`,
      qs: ["2AP2", "2TH4", "2PR28", "2PR29"] }
  ]
},
{
  id: "taxa", topic: "Primate taxonomy", title: "The primate family tree", ch: "Exam 2 · Taxonomy · Classification chart",
  intro: "This chapter walks down the classification chart from the order Primates to the apes. For each group, learn the traits listed under it. The safari's primates are in the same order.",
  sections: [
    { h: "Reading the chart",
      html: `<p>The chart runs from the largest group to the smallest: <strong>Order → Suborder → Infraorder → Superfamily</strong>.</p>
<ul><li>The <strong>order</strong> is Primates. Traits listed there (grasping hands and feet, nails and dermatoglyphs, binocular vision) apply to every group below.</li>
<li>The two <strong>suborders</strong> are <strong>strepsirrhines</strong> and <strong>haplorrhines</strong>.</li>
<li>Platyrrhines against catarrhines is a comparison between <strong>infraorders</strong>.</li>
<li>Cercopithecoids against hominoids is a comparison between <strong>superfamilies</strong>. Both sit inside the infraorder Catarrhini.</li></ul>
<p>Traits pass down the chart: apes are haplorrhines, so apes have a dry nose even though it's listed higher up.</p>`,
      qs: ["2TH9", "2CH32", "2CH31", "2CH29", "2CH30", "2CH34"] },
    { h: "Strepsirrhines: the wet-nosed primates",
      html: `<p><strong>Strepsirrhines</strong> are lemurs and lorises. Their traits are mostly about smell and night vision:</p>
<ul><li>A <strong>rhinarium</strong>, the moist pad at the tip of the nose: they rely more on smell than vision.</li>
<li>A <strong>postorbital bar</strong> (a bony ring, not a full cup), a <strong>dental comb</strong>, a <strong>grooming claw</strong>, and a <strong>tapetum lucidum</strong> that reflects light for night vision.</li>
<li><strong>2.1.3.3</strong> dentition, and an unfused frontal bone and mandibular symphysis.</li></ul>
<p><strong>Lemurs</strong> live only on Madagascar. The ring-tailed lemur is both terrestrial and arboreal and scent-marks with glands. The sifaka leaps on hind limbs much longer than its forelimbs. The smallest lemur is the nocturnal <strong>mouse lemur</strong>. The <strong>aye-aye</strong> probes for grubs with a long, bony third finger. Lorises are small, nocturnal and arboreal.</p>`,
      qs: ["2TH10", "2AP1", "2TH11", "2PR36", "2PR37", "2TH13", "2LT1", "2LT2", "2LT3", "2LT5", "2LT6", "2AP8"] },
    { h: "Tarsiers: the in-between primates",
      html: `<p><strong>Tarsiers</strong> used to be grouped with lemurs and lorises as <strong>"prosimians"</strong>. In the current system they are <strong>haplorrhines</strong>.</p>
<ul><li>What makes them haplorrhine: <strong>no tapetum lucidum</strong> and <strong>postorbital closure</strong>, both anthropoid-like.</li>
<li>What they share with strepsirrhines: a <strong>grooming claw</strong>, and being small, nocturnal and arboreal.</li>
<li>Their own specialty: <strong>huge eyes, each as large as the brain</strong>. Vision is their dominant sense.</li></ul>`,
      qs: ["2TH14", "2CH33", "2PR38", "2LT7", "2CH13", "2CH27"] },
    { h: "Haplorrhines and anthropoids",
      html: `<p><strong>Haplorrhines</strong> are the <strong>dry-nosed</strong> primates: tarsiers, monkeys, apes and humans.</p>
<ul><li><strong>Postorbital closure:</strong> a bony plate behind the whole eye socket.</li>
<li><strong>Reduced olfaction</strong> compared with strepsirrhines, and well-developed vision.</li>
<li>Mostly <strong>diurnal</strong>, not nocturnal.</li>
<li>A fused frontal bone and a fused mandibular symphysis.</li></ul>
<p><strong>Anthropoids</strong> are the monkeys, apes and humans: the haplorrhines without the tarsiers.</p>`,
      qs: ["2TH15", "2PR39", "2CH9", "2CH11"] },
    { h: "New World and Old World: platyrrhines and catarrhines",
      html: `<p>The nose and the teeth tell them apart.</p>
<ul><li><strong>Platyrrhines</strong> (New World monkeys) live in Central and South America. They have <strong>broad, sideways-facing nostrils</strong> set wide apart, <strong>2.1.3.3</strong> dentition (with exceptions), and <strong>some have prehensile tails</strong>. Howler monkeys move their large bodies through the forest with theirs.</li>
<li><strong>Catarrhines</strong> (Old World monkeys and apes) have <strong>downward-facing nostrils</strong> and <strong>2.1.2.3</strong> dentition: one fewer premolar.</li></ul>
<p>So a jaw with three premolars per side is a platyrrhine or a strepsirrhine, and 2.1.2.3 can only be a catarrhine.</p>`,
      qs: ["2PR40", "2TH16", "2LT10", "2AP6", "2AP9", "2CH35", "2CH20"],
      play: [{ t: "sort", title: "Platyrrhine or catarrhine?", bins: ["Platyrrhines (New World)", "Catarrhines (Old World)"], items: [["Broad, sideways-facing nostrils", 0], ["2.1.3.3 dentition", 0], ["Prehensile tail in some", 0], ["Central and South America", 0], ["Downward-facing nostrils", 1], ["2.1.2.3 dentition", 1], ["Includes the apes", 1]] }] },
    { h: "Old World monkeys",
      html: `<p><strong>Cercopithecoids</strong> (Old World monkeys) have <strong>bilophodont molars</strong>, high-cusped teeth for grinding leafy, fibrous food, and <strong>ischial callosities</strong>, hardened sitting pads. They <strong>never have a prehensile tail</strong>.</p>
<ul><li><strong>Cercopithecines</strong> are the cheek-pouch monkeys: macaques, baboons and vervets. They're omnivores that store food in their cheeks. Baboons eat fruit, leaves, roots, lizards and rodents; vervets spend their time on the ground. <i>Macaca fuscata</i>, the Japanese macaque, lives in snowy northern Japan.</li>
<li><strong>Colobines</strong> are the leaf-eaters: langurs, colobus and proboscis monkeys. A <strong>semi-chambered stomach</strong> lets them digest cellulose.</li></ul>`,
      qs: ["2AP14", "2PR41", "2PR42", "2PR43", "2TH17", "2PR44", "2LT11", "2LT12"] },
    { h: "Apes",
      html: `<p><strong>Hominoids</strong> (apes) have <strong>no tail</strong>, <strong>Y-5 molars</strong> (simpler than bilophodont ones), and the <strong>longest ontogeny</strong> of all primates.</p>
<ul><li>Their upper body is built for hanging: long arms, a scapula on the back and a long clavicle. Swinging under the branches arm over arm is <strong>brachiation</strong>.</li>
<li><strong>Gibbons and siamangs</strong> are the small (lesser) apes: acrobatic brachiators and fruit-eaters with throat sacs. Their skeletons show many healed fractures.</li>
<li><strong>Gorillas</strong> are knuckle-walking folivores with marked sexual dimorphism.</li></ul>
<p>Every vertebrate embryo has a tail early on. In apes it shrinks to a tailbone: a <strong>vestigial structure</strong> and evidence of common ancestry.</p>`,
      qs: ["2LT16", "2TH19", "2TH20", "2TH21", "2AP5", "2PR45", "2PR46", "2PR47", "2PR48", "2LT17"],
      play: [{ t: "match", title: "Which group has it?", pairs: [["Dental comb and tapetum lucidum", "Strepsirrhines"], ["Huge eyes, each as large as the brain", "Tarsiers"], ["Prehensile tail in some species", "Platyrrhines"], ["Bilophodont molars and sitting pads", "Old World monkeys"], ["Y-5 molars and no tail", "Apes"]] }] }
  ]
},
{
  id: "troop", topic: "Primate sociality", title: "Primate social lives", ch: "Exam 2 · Sociality · Chimps & bonobos",
  intro: "Almost all primates live in groups, and the kind of group shapes their bodies and behavior. This chapter covers why groups form, mating systems, competition, cooperation, culture, and what separates chimpanzees from bonobos.",
  sections: [
    { h: "Why live in groups?",
      html: `<p><strong>Behavioral ecology</strong> studies behavior as it evolved through natural selection in particular environments.</p>
<ul><li><strong>Benefits:</strong> more eyes to detect predators, group defense, and <strong>dilution</strong>: more individuals means a lower chance that you are the one caught.</li>
<li><strong>Costs:</strong> competition for food and mates, and <strong>disease transmission</strong>.</li>
<li><strong>Group size</strong> depends on <strong>food availability and distribution</strong> and on predators. Widely scattered food, like insects, means <strong>small groups</strong>. Terrestrial, diurnal primates under heavy predation live in <strong>larger groups</strong>.</li></ul>
<p>Size, diet and activity go together: a small primate is likely a nocturnal, insect-eating strepsirrhine that spends much of its time alone.</p>`,
      qs: ["2TH23", "2TH24", "2PR50", "2PR49", "2AP4", "2PR52", "2PR53", "2TH27"] },
    { h: "Who lives together, and who mates with whom",
      html: `<p><strong>Social organization is not the mating system.</strong> Who lives together isn't the same as who mates with whom.</p>
<ul><li><strong>Polygyny:</strong> one male, several females. <strong>Gorillas and langurs</strong> live in one-male, multi-female groups.</li>
<li><strong>Polyandry:</strong> one female, several males. <strong>Marmosets and tamarins</strong> live as one female with two adult males and breed cooperatively.</li>
<li><strong>Polygynandry:</strong> several males and several females mating within the group.</li>
<li><strong>Pair bonds:</strong> gibbons and owl monkeys, though extra-pair copulations are common.</li>
<li><strong>Fission-fusion:</strong> the community splits into smaller foraging parties and comes back together. Chimpanzees do this.</li></ul>
<p>An animal that stays in its birth (natal) group is <strong>philopatric</strong>. Male chimpanzees are.</p>`,
      qs: ["2PR54", "2PR55", "2PR56", "2AP17", "2PR57", "2PR58", "2PR59", "2PR61", "2AP18", "2TH25", "2AP13"],
      play: [{ t: "match", title: "Match the mating system", pairs: [["One male, several females", "polygyny"], ["One female, several males", "polyandry"], ["Several males and several females", "polygynandry"], ["Gorillas and langurs", "one-male, multi-female groups"], ["Marmosets and tamarins", "cooperative breeding"]] }] },
    { h: "Competition, dimorphism and infanticide",
      html: `<p><strong>Sexual dimorphism</strong> in body and canine size comes mainly from <strong>sexual selection</strong> through male-male competition.</p>
<ul><li>Where one male holds a group of females, competition is fierce and dimorphism is <strong>high</strong>.</li>
<li><strong>Pair-bonded</strong> primates compete little for mates, so dimorphism is <strong>low</strong>.</li>
<li>Female choice counts too: male proboscis monkeys' long noses are a product of sexual selection.</li></ul>
<p><strong>Estrus</strong> is the window when a female is sexually receptive. <strong>Infanticide</strong>, a male killing a nursing infant he didn't father, is a reproductive strategy: the infant's death <strong>speeds the mother's return to estrus</strong>. It's most expected when a new male takes over a one-male group with nursing infants.</p>`,
      qs: ["2PR64", "2AP19", "2TH26", "2PR60", "2AP12", "2TH18", "2PR65", "2AP28"] },
    { h: "Getting along: rank, grooming and kin",
      html: `<ul><li><strong>Dominance hierarchies</strong> reduce constant fighting by settling who gets priority access to resources. They're <strong>fluid</strong>: rank changes with age, alliances and health. Offspring of <strong>high-ranking females</strong> survive and grow better.</li>
<li><strong>Displays</strong>, like a chimpanzee's charge, a gorilla's chest-beating or a baboon's eyebrow flash, communicate strength without an actual fight.</li>
<li><strong>Grooming</strong> is the social cement. Beyond hygiene, it builds bonds and alliances and eases tension.</li>
<li><strong>Altruism</strong> is helping another at a cost to yourself. The <strong>kin selection</strong> hypothesis explains it: relatives share your genes, so helping them can still spread them.</li>
<li><strong>Allo-parenting</strong> is care of young by group members other than the parents.</li></ul>
<p>Members of the same species are <strong>conspecifics</strong>.</p>`,
      qs: ["2PR66", "2PR67", "2AP25", "2PR69", "2LT13", "2PR70", "2AP15", "2AP29", "2PR68", "2TH28", "2PR51", "2PR77"] },
    { h: "Learning, tools and culture",
      html: `<p>The long juvenile period lets young primates learn by watching others, and <strong>play</strong> lets them practice the physical and social skills they'll need as adults.</p>
<ul><li><strong>Tools:</strong> chimpanzees fashion sticks for <strong>termite fishing</strong>; capuchins <strong>crack nuts with stones</strong> on rock anvils.</li>
<li><strong>Culture</strong> in primates means learned behavior, passed on socially, that differs between groups of the same species. The <strong>Koshima macaques</strong> throw unhusked rice and sand into sea water and skim off the floating rice.</li>
<li>Japanese macaques also cope with the cold by <strong>sitting in hot springs</strong>.</li></ul>
<p>Researchers to know: <strong>Jane Goodall</strong> studied chimpanzees, and <strong>Biruté Galdikas</strong> studied orangutans.</p>`,
      qs: ["2PR72", "2PR71", "2LT24", "2PR73", "2LT15", "2AP16", "2PR74", "2LT14", "2PR75", "2PR76"] },
    { h: "Chimpanzees and bonobos",
      html: `<p>The genus <i>Pan</i> has two species: <i>Pan troglodytes</i>, the common chimpanzee, and <i>Pan paniscus</i>, the bonobo. The <strong>Congo River</strong> separates them.</p>
<ul><li><strong>Chimpanzees</strong> are <strong>male-dominated</strong>: males stay in their natal group and form coalitions. Infanticide is a danger, so females <strong>mate with many males to confuse paternity</strong>. That leads to <strong>sperm competition</strong>, which is why male chimps have large testes. Gorillas have small ones: a silverback controls his females, so there's little sperm competition.</li>
<li><strong>Bonobos</strong> are <strong>female-dominant</strong>. Females form strong alliances and use sex socially to ease tension, so relations between the sexes are relatively peaceful.</li></ul>
<p>The explanation offered is <strong>ecology</strong>: bonobos have plentiful, evenly spread food and no gorillas competing for it, so females can stay together.</p>`,
      qs: ["2WS9", "2WS8", "2WS0", "2WS2", "2TH22", "2WS3", "2WS4", "2WS5", "2WS6", "2WS7"],
      play: [{ t: "sort", title: "Chimpanzee or bonobo?", bins: ["Chimpanzee", "Bonobo"], items: [["Male-dominated, male coalitions", 0], ["Pan troglodytes", 0], ["Infanticide is a danger", 0], ["Females dominant through alliances", 1], ["Pan paniscus", 1], ["Sex used to ease tension", 1]] }] }
  ]
}
];
