// ANTH 102 · Exam 1 question bank (data only; the app lives in ../assets/drill.js)
const S_=s=>`<span class=seq>${s}</span>`;
// ===== Top Hat participation questions: [title, question, correct, wrong[], explanation]
const TH=[
["Anthropology subdisciplines","All of the following are major subdisciplines/branches of anthropology EXCEPT","Geology",["Archaeology","Biological anthropology","Linguistic anthropology","Cultural anthropology"],"The four fields are cultural, biological, archaeology and linguistic. Archaeology IS one, so it can't be the EXCEPT answer."],
["Hypothesis","What are two essential characteristics necessary when formulating a hypothesis?","Falsifiability and testability",["Popularity and certainty","Testability and proof","Complexity and consensus","Certainty and falsifiability"],""],
["Well tested model","A well-tested explanation of nature that has survived repeated attempts to refute it is called","A theory",["A hypothesis","A law","A fact"],""],
["Hierarchical ladder","The universal hierarchical ladder of all matter and life that framed early understanding of humans' position in the world:","Great Chain of Being / Scala Naturae",["Tree of life","Uniformitarianism","Binomial nomenclature"],""],
["Darwin's inspiration","The English economist who inspired Darwin with his argument that overpopulation drives competition for resources, a \"struggle for existence\":","Thomas Malthus",["Charles Lyell","Adam Smith","Alfred Russel Wallace","Jean-Baptiste Lamarck"],"You left this blank on Top Hat. Malthus wrote An Essay on the Principle of Population."],
["Lamarck","Which best describes Lamarck's theory of inheritance of acquired characteristics?","Traits acquired by an organism during its lifetime can be passed on to its offspring.",["Species are fixed and never change.","Individuals with favorable variations leave more offspring.","Traits from both parents blend together in offspring."],""],
["Linnaeus","Which of the following is NOT a contribution of Carolus Linnaeus?","Presented a heliocentric view of the universe",["Binomial nomenclature (Genus species)","A hierarchical taxonomic system","Classifying humans with other primates"],"Heliocentrism is Copernicus."],
["Explanatory models","The model stating that geological processes today are the same as in the past, slow and gradual, so the earth must be immensely old:","Uniformitarianism",["Catastrophism","Great Chain of Being","Adaptive radiation"],""],
["Co-discovery","Another young British naturalist reached the same conclusion as Darwin, that natural selection drives evolutionary change, at about the same time:","Alfred Russel Wallace",["Thomas Malthus","Charles Lyell","Gregor Mendel"],""],
["Human ancestors","After the dinosaurs died out (~65 mya), mammal species boomed to fill the ecological niches dinosaurs once occupied. This process is:","Adaptive radiation",["Population bottleneck","Founder effect","Sexual selection"],""],
["Darwin's evidence","Which line of evidence was NOT available to Darwin and so not included in Origin of Species?","Genetics",["Fossils","Artificial selection","Biogeography","Comparative anatomy"],""],
["Misconceptions","Which of these is NOT a misconception about evolution (i.e., which is TRUE)?","Individuals with favorable variations are more likely to leave offspring.",["Individuals evolve during their lifetime.","Evolution produces perfect organisms.","Organisms evolve because they need to."],""],
["Fitness","Which lizard has the highest fitness? A: very healthy, 19 surviving offspring · B: mated with many, 28 · C: dark and very quick, 22 · D: largest territory, 26","Lizard B",["Lizard A","Lizard C","Lizard D"],"Fitness = number of offspring surviving to adulthood."],
["Antibiotics","Additional sources of antibiotics, including doses given to livestock, play a role in causing resistant bacteria to evolve.","TRUE",["FALSE"],""],
["How natural selection works","Natural selection operates on ______, while evolution occurs at the ______ level.","individuals; population",["populations; individual","genes; species","species; gene"],""],
["Prokaryote vs eukaryote","Which image shows the eukaryotic cell?","B",["A"],"B has a nucleus and membrane-bound organelles. A is a bacterium (prokaryote): its DNA floats free and it has a flagellum."],
["Prokaryote and eukaryote","One primary way in which prokaryotes differ from eukaryotes is:","Prokaryotes have no nucleus",["Prokaryotes have no hereditary material","Prokaryotes have no cell membrane","Prokaryotes are always multicellular"],"You missed this one. Prokaryotes DO have DNA; it just floats in the cytoplasm with no nucleus around it."],
["Genetic information","Genetic information is transmitted from parent to offspring via which cells?","Gametes",["Somatic cells","Red blood cells","Neurons"],""],
["Structure of DNA","Name the unit that is circled in the image:","Nucleotide",["Codon","Amino acid","Chromosome"],""],
["Sugar","What sugar makes up the backbone of DNA?","Deoxyribose",["Ribose","Glucose","Fructose"],""],
["RNA vs DNA","Which is NOT a difference between DNA and RNA?","RNA contains bases including adenine, cytosine and guanine",["DNA has thymine; RNA has uracil","DNA has deoxyribose; RNA has ribose","DNA is double-stranded; RNA is single-stranded"],"DNA has A, C and G too, so that's a similarity."],
["DNA function","What process is depicted: DNA → mRNA","Transcription",["Translation","Replication","Mutation"],""],
["Mutation","A mutation that is a single base different from the normal (wild-type) sequence is a","Point mutation",["Frameshift mutation","Chromosomal mutation","Nondisjunction"],""],
["Chromosome number","Typically, humans have ___ pairs of autosomes and ___ pair(s) of sex chromosomes.","22; 1",["23; 1","46; 2","22; 2"],"22 + 1 = 23 pairs = 46 chromosomes."],
["Genetic shuffling","Recombinant genes (genetic shuffling) arise during this process:","Meiosis",["Mitosis","Transcription","Translation"],""],
["Gametes vs somatic cells","Human gametes typically have 23 chromosomes and so are referred to as having a ______ number.","Haploid",["Diploid","Triploid","Polyploid"],"Somatic cells (46) are diploid."],
["Siblings and genetics","The reason siblings receive different combinations of parental traits is best explained by","Recombination (crossing over) during meiosis",["Mitosis","Pleiotropy","Linkage"],""],
["Gene variants","Variants of a gene, as with brown and blue eye color, are called:","Alleles",["Chromosomes","Codons","Gametes"],""],
["Gene quantity","The number of genes humans have is approximately","20,000–23,000",["About 1,000","About 100,000","About 1 million"],"The film used ~23,000."],
["Genes","A highly conserved group of regulatory genes that control segmental patterning across invertebrate and vertebrate bodies:","HOX genes",["Paintbrush genes","Junk DNA","Velvet worm genes"],""],
["Traits and alleles","Near-sighted (N) is dominant; unimpaired vision (n) is recessive. What appears in someone who inherited Nn?","Near-sighted",["Unimpaired vision","Partly near-sighted","Far-sighted"],"One dominant allele is enough."],
["Genotype 1","If your genotype is homozygous dominant for a trait, which allele combination did you inherit?","BB",["Bb","bb"],""],
["Genotype 2","If your genotype is heterozygous, which allele combination did you inherit?","Bb",["BB","bb"],""],
["Punnett square 1","A homozygous dominant brown mouse mates with a heterozygous brown mouse. What percent of offspring show the brown phenotype?","100%",["75%","50%","25%"],"BB × Bb gives only BB and Bb."],
["Gene expression","An allele that must be inherited in two copies (from mom and dad) to be expressed is:","Recessive",["Dominant","Codominant","Linked"],""],
["Brown mouse","A homozygous dominant brown mouse mates with a heterozygous brown mouse. Their allele combinations are:","BB and Bb",["Bb and bb","BB and bb","Bb and Bb"],""],
["Trisomy","Trisomy 18 (Edwards syndrome), with heart problems, feeding difficulties and early mortality, is an example of this:","A chromosomal abnormality caused by nondisjunction",["A point mutation","Codominance","Heterozygote advantage"],"Chromosomes fail to separate in meiosis, so a gamete gets an extra copy."],
["Mutations","Which are TRUE? i. Mutations are how all new alleles first arise · ii. Mutations create new genetic variation in a gene pool · iii. Only mutations in gametes influence evolution · iv. Mutations are a relatively weak force alone","i, ii, iii, iv",["i and ii","i, ii, iii","ii and iv"],""],
["Punnett square 2","Both parents are heterozygous carriers of Tay-Sachs. Probability a child inherits 2 copies and has the disease?","25%",["50%","75%","0%"],""],
["Modern synthesis","The Modern Evolutionary Synthesis in the 1930s resulted in","A distinction between microevolution and macroevolution",["The discovery of DNA's structure","The theory of acquired characteristics","Blending inheritance"],"Anthro-pardy words it as 'bridging' micro and macro. Know both phrasings."],
["Forces of evolution 1","~12,000 reproductively isolated Amish in Lancaster, PA show rising rates of a recessive short-limb, extra-digit trait due to the small gene pool. This is:","Founder effect",["Population bottleneck","Natural selection","Gene flow"],""],
["Forces of evolution 2","The Toba supervolcano (70,000+ years ago) reduced humans to a few thousand individuals. This is:","Population bottleneck",["Founder effect","Adaptive radiation","Gene flow"],""],
["Dimorphism","Differences between males and females (sexual dimorphism) are best understood as a result of:","Sexual selection",["Genetic drift","Artificial selection","Founder effect"],""],
["Malaria","In malaria zones, people with one sickling and one normal hemoglobin allele have higher fitness than either homozygote. This is:","A heterozygote advantage",["Codominance","A founder effect","A population bottleneck"],""]
];

// ===== Review Activities 1–3 (Brightspace): [question no., question, correct, wrong[], explanation]
const AC=[
["1","Darwin acknowledged important holes in his theory. What is the \"hole\" described in the film?","He couldn't explain where variation in biological organisms came from",["He didn't understand humans and chimpanzees","He didn't understand extinct vs. living organisms that resembled each other","He didn't understand dog breeding","He didn't understand pigeon breeding"],""],
["2","Charles Darwin was first sent off to Edinburgh, Scotland in order","to study medicine",["to enroll in a natural sciences major","to begin courses in evolutionary biology","to study poetry","to become a gentleman scholar"],""],
["3","Darwin's role on the HMS Beagle was to","serve as a conversationalist to the captain",["provide spiritual guidance to the passengers","navigate the boat","clean the vessel","provide medical assistance to the crew"],""],
["4","When the HMS Beagle landed in Argentina, what major discovery did Darwin uncover?","Fossils of large extinct mammals",["13 species of finches with different beaks","Fossils of early pre-humans","A previously uncontacted indigenous population","No living land mammals"],""],
["5","The islands off the coast of Ecuador that were among Darwin's most important stops:","Galápagos Islands",["Canary Islands","Falkland Islands","Azores"],"Spelling counts on the activity."],
["6","What was so remarkable about Darwin's finches?","They were variations of a single type: slightly different species on different islands",["They all belonged to a single species","They lived only where tortoises didn't","They lived only where penguins didn't","They descended from the giant mammal fossils in Argentina"],""],
["7","From his discoveries on the HMS Beagle, Darwin amassed evidence that","species changed over time",["he suffered from sea-sickness","the captain was not a good conversationalist","species were created perfectly and could not change","early pre-humans roamed South America"],""],
["8","Slits around the neck of fish embryos develop into gills; the same slits in humans develop into","bones of the inner ear",["earlobes","bones of the shoulders","bones in the arms","the collar bone"],""],
["9","Darwin's \"tree of life\" suggests that","all living and extinct species are connected, some closely, others distantly",["trees are more closely related to humans than other organisms","all organisms begin life as trees","there are no connections between most organisms","trees are the only organisms worth studying"],""],
["10","The Whippet was bred by combining traits from other dogs to chase rabbits. Choosing individual traits to change a breed is","artificial selection",["natural selection","frankensteinism","Lamarckianism","evolutionary change"],""],
["11","Rock pocket mice living on dark rocks in Arizona's Pinacate Desert avoid predators because","they are camouflaged by their dark fur",["they offer predators Snickers bars","they live under the rocks","they have light fur and are visible targets","they can outrun any predator"],""],
["12","The DNA helix is made of four bases, represented by the letters:","G, A, T, C",["A, L, D, N","D, N, A, S","G, A, T, R"],""],
["13","When examining DNA, what accounts for the differences across all living creatures?","All organisms have the same letters, but differences in letter sequence",["Some organisms have more letters than others","Some organisms have no letters in their DNA","Some organisms do not have DNA","Different organisms use different letters"],""],
["14","______ is the critical ingredient in the recipe for evolution, generating variation and differences between individuals.","Mutation",["Selection","Migration","Replication"],""],
["15","A mutation is","neutral (neither good nor bad)",["rarely found in the human genome","always good","always bad","something that never causes problems"],""],
["16","How many genes make up the human genome?","approximately 23,000",["approximately 120,000","approximately 80,000","approximately 46","approximately 1 million"],"46 is the chromosome count."],
["17","According to the film, ______ genes determine where the head and limbs go and whether limbs become arms, legs or wings.","body-plan",["junk DNA","master","paintbrush","Icarus"],""],
["18","What percentage of our genome codes for proteins?","2%",["98%","100%","22%","50%"],""],
["19","A genetic ______ turns genes on and off (the fruit fly spotted vs. unspotted wings experiment).","switch",["mutation","codon","allele"],""],
["20","Stickleback fish losing their spikes is controlled by the same genetic switch responsible for","the loss of hindlimbs in manatees and whales",["larger brains in humans","the loss of light fur in rock pocket mice","beak differences in Galápagos finches","spots on fruit fly wings"],""],
["21","Differences in beak size and shape among Galápagos finches result from","the same genes in all finches, turned on and off at different times",["the paintbrush gene","genetic mutations","different genes for each beak shape","use and disuse"],""],
["22","The 375-million-year-old Tiktaalik is a perfect transitional form because","it has the body of a fish but an arm-like fin like every four-limbed animal",["it has a fish body and a human-size brain","it has a fish body and bird wings","it has a human body and a fish-size brain","it has a chimpanzee body and an arm-like fin"],""],
["23","With no DNA from Tiktaalik, a living relative was used to study body-plan genes. This fish is the","paddlefish",["sea bass","cuttlefish","salmon","Tiktaalikfish"],""],
["24","______ are body-plan genes that are highly conserved (unchanged ~600 million years, found in all complex animals).","HOX genes",["Velvet worm genes","Mutations","Paintbrush genes"],""],
["25","According to Dr. Katie Pollard, human and chimpanzee DNA are","approximately 99% identical",["exactly the same","not alike in any way","only 2% identical","approximately 50% identical"],""],
["26","Skull plates in chimpanzees, gorillas and orangutans fuse at about ___ years old, limiting brain growth.","3–4",["1","30","35–40"],"Human skull plates stay open far longer."],
["27","A rare disorder called ______ causes children to be born with brains half the normal size.","microcephaly",["megacephaly","minicephaly","muscular dystrophy"],""],
["28","Which part of the human body changed the most during human evolution?","The human brain",["Human feet","Human hands","Human jaw structure","Human lack of body hair"],""],
["29","The ______ is the part of the brain vital for language, music and mathematics.","cortex",["cerebellum","brainstem","hippocampus"],"Spelling counts on the activity."],
["30","Per Dr. Pollard, about how many mutations separate humans from chimps in the gene for cortex development?","18",["2","54","23,000"],""],
["31","The structure that separates DNA from the rest of the cell, the \"brain\" of the cell:","the nucleus",["cytoplasm","gametes","mitochondria","ribosomes"],""],
["32","What type of sugar is indicated by the arrow and labeled \"X\"?","deoxyribose",["ribose","fructose","glucose","phosphate"],""],
["33","The three components of a single DNA nucleotide are","a nitrogenous base, phosphate, and deoxyribose sugar",["a hydrogen bond, deoxyribose sugar, and phosphate","a hydrogen bond, ribose sugar, and phosphate","a nitrogenous base, phosphate, and a peptide bond","a phosphate, a hydrogen bond, and a nitrogenous base"],""],
["34","Base-pairing rules: adenine (A) always bonds with ______, and cytosine (C) always bonds with ______.","thymine; guanine",["guanine; thymine","uracil; guanine","cytosine; adenine"],""],
["35","Plant, mammal and bacterium DNA: is the arrangement of sugar and phosphate groups the same in each?","True",["False"],""],
["36","Does each type of DNA (plant, mammal, bacterium) contain the same four bases (A, C, G, T)?","True",["False"],""],
["37","Is the sequence (order) of bases the same in each type of DNA?","False",["True"],"The order of bases is the only thing that differs."],
["38","Are the base-pairing rules the same in each type of DNA?","True",["False"],""],
["39","What is the only characteristic that differs between the plant, mammal and bacterium DNA segments?","the sequence (order) of bases",["the sequence of the sugar-phosphate backbone","everything is different","bacteria and plants do not have DNA"],""],
["40",`DNA template strand ${S_("TCA GCC TAA")}. The transcribed mRNA codons are:`,S_("AGU CGG AUU"),[S_("UGT CGG UTT"),S_("AGT CGG ATT"),S_("AUT CUU ATT"),S_("TCA GCC TAA")],"Complement each base and use U in place of T."],
["41",`DNA template strand ${S_("TCA GCC TAA")}. The tRNA anticodons are:`,S_("UCA GCC UAA"),[S_("AGU CGG AUU"),S_("AGT CGG ATT"),S_("AUT CGG ATT"),S_("TCA GCC TAA")],"Anticodons pair with mRNA, so they match the template with U for T."],
["42",`Using the codon table, DNA template ${S_("TCA GCC TAA")} codes for which amino acids?`,"serine – arginine – isoleucine",["serine – alanine – stop","isoleucine – arginine – serine","serine – stop – isoleucine","serine – arginine – stop"],"Translate the mRNA (AGU CGG AUU), not the DNA."],
["43","The process in which mRNA copies the DNA template to carry it to the ribosome is called","transcription",["translation","replication","transformation"],"Spelling counts on the activity."],
["44","The molecule labeled with the circled X brings amino acids to the ribosome to build proteins. It is:","tRNA",["mRNA","rRNA","DNA"],""],
["45 · 1/8","Match: Polypeptide","Chain of amino acids",["Series of three-base sequences in mRNA","Peptide bond","Hydrogen bond"],""],
["45 · 2/8","Match: Where translation occurs","In the cytoplasm",["In the nucleus","Deoxyribose","Peptide bond"],""],
["45 · 3/8","Match: Binds amino acids together to form a protein","Peptide bond",["Hydrogen bond","Deoxyribose","Chain of amino acids"],""],
["45 · 4/8","Match: Anticodon","Series of three-base sequences in tRNA",["Series of three-base sequences in mRNA","Chain of amino acids","Hydrogen bond"],""],
["45 · 5/8",`Match: tRNA anticodons that align with mRNA codons ${S_("GAA UAC UUG")}`,S_("CUU AUG AAC"),[S_("CAA TAC AAC"),S_("CGC AUU CAU"),S_("CGC UTT CUT")],""],
["45 · 6/8",`Match: mRNA transcription of DNA strand ${S_("GCG TAA GTA")}`,S_("CGC AUU CAU"),[S_("CGC UTT CUT"),S_("CUU AUG AAC"),S_("CAA TAC AAC")],""],
["45 · 7/8","Match: Codon","Series of three-base sequences in mRNA",["Series of three-base sequences in tRNA","Chain of amino acids","Peptide bond"],""],
["45 · 8/8","Match: Where transcription occurs","In the nucleus",["In the cytoplasm","Hydrogen bond","Deoxyribose"],""],
["46","Bird scenario: the female (left) is heterozygous with white feathers. Her genotype:","Bb",["BB","bb"],""],
["47","Bird scenario: the male (right) is homozygous recessive with black feathers. His genotype:","bb",["BB","Bb"],""],
["48","Bird scenario: which color is dominant, white or black?","White",["Black"],"The heterozygote (Bb) shows white, so white is dominant."],
["49","Bird Punnett square (Bb × bb). What will the hatched babies look like?","50% white feathers; 50% black feathers",["All white feathers","50% white; 50% a mix of black and white","25% white; 75% black","25% black; 75% white"],""],
["50","Albinism is autosomal recessive. Genotypes for an albino male and a heterozygous female:","Male aa; female Aa",["Male Aa; female aa","Male AA; female Aa","Male aa; female AA"],""],
["51","Punnett square for the albino male × heterozygous female. Offspring genotypes:","Aa, Aa, aa, aa",["aa, aa, aa, AA","AA, Aa, Aa, aa","AA, AA, aa, aa"],""],
["52","Phenotypes of the offspring of the albino male × heterozygous female:","50% normal pigmentation; 50% albinism",["all normal pigmentation","75% normal; 25% albinism","25% normal; 75% albinism","all albinism"],""],
["53","Genotypes for two mating heterozygotes (albinism):","Male Aa; female Aa",["Male AA; female aa","Male aa; female aa","Male AA; female AA"],""],
["54","Phenotypes of the offspring of the two heterozygote parents:","75% normal pigmentation; 25% albinism",["all normal pigmentation","25% normal; 75% albinism","50% normal; 50% albinism","all albinism"],"1 AA : 2 Aa : 1 aa."],
["55 · 1/3","Tay-Sachs (T/t). Genotype of individuals WITH Tay-Sachs:","tt",["Tt","TT"],""],
["55 · 2/3","Tay-Sachs (T/t). Genotype of individuals who CARRY the allele:","Tt",["tt","TT"],"Carriers keep about half of normal enzyme function and show no symptoms."],
["55 · 3/3","Tay-Sachs (T/t). Genotype of individuals who do NOT possess the allele:","TT",["Tt","tt"],""],
["56 · 1/3","Two plants produce all tall (Dd) offspring. D = tall, d = dwarf. The female is dwarf. Female's genotype:","dd",["Dd","DD"],""],
["56 · 2/3","Same plants: all offspring Dd, female dd. Male's genotype:","DD",["Dd","dd"],"If the male were Dd, some offspring would be dd."],
["56 · 3/3","Same plants: the male parent's phenotype is","Tall",["Dwarf","Medium"],""]
];

// ===== Anthro-pardy game show: [category, $value, clue, correct, wrong[], explanation]
const DNA="The Wacky World of DNA",SIP="Science in Practice",BEF="A World Before Darwin",DEV="Darwin's Evidence",CEL="Cells & Genes, Oh My",EVT="In Evo Terms",FOR="May the Force Be With You";
const AP=[
[DNA,100,"Of adenine, thymine, guanine and cytosine, the base that is not found in RNA","What is thymine?",["What is adenine?","What is guanine?","What is cytosine?"],"RNA uses uracil instead."],
[DNA,200,"DNA replication occurs in this part of the cell","What is the nucleus?",["What is the cytoplasm?","What is the ribosome?","What is the mitochondria?"],""],
[DNA,300,"When both alleles are phenotypically expressed, as in AB blood type","What is codominance?",["What is incomplete dominance?","What is pleiotropy?","What is linkage?"],"Incomplete dominance is a blend (red × white → pink)."],
[DNA,400,`If one side of the DNA strand has ${S_("AAG TTC CTT")}, the other strand contains these bases`,"What is "+S_("TTC AAG GAA")+"?",["What is "+S_("UUC AAG GAA")+"?","What is "+S_("AAG TTC CTT")+"?","What is "+S_("TTG AAC GAA")+"?"],"A↔T, G↔C, and DNA never has U."],
[DNA,500,`A template strand of protein-coding DNA has ${S_("GTA AAG TAG")}. The corresponding mRNA codons`,"What is "+S_("CAU UUC AUC")+"?",["What is "+S_("CAT TTC ATC")+"?","What is "+S_("GUA AAG UAG")+"?","What is "+S_("CAU UUC AUG")+"?"],""],
[SIP,100,"In the scientific method, the statement of what you predict to see, an educated guess based on observations","What is a hypothesis?",["What is a theory?","What is a law?","What is a fact?"],""],
[SIP,200,"Darwin arrived at natural selection around the same time as this scientist, the \"co-discoverer\" of natural selection","Who is Alfred Russel Wallace?",["Who is Thomas Malthus?","Who is Charles Lyell?","Who is Gregor Mendel?"],""],
[SIP,300,"Investigating phenomena by stating a hypothesis, collecting data and testing the hypothesis","What is the scientific method?",["What is uniformitarianism?","What is peer review?","What is natural theology?"],""],
[SIP,400,"A well-tested model that has survived repeated tests and refinements; it means something different in non-scientific settings","What is a theory?",["What is a hypothesis?","What is a law?","What is a guess?"],""],
[SIP,500,"A scientific hypothesis must meet two criteria: testability and this","What is falsifiability?",["What is popularity?","What is certainty?","What is complexity?"],""],
[BEF,100,"The pre-Darwinian belief that all organisms exist on a hierarchical ladder and species were fixed","What is the Great Chain of Being (Scala Naturae)?",["What is the tree of life?","What is uniformitarianism?","What is binomial nomenclature?"],""],
[BEF,200,"Wrote Principles of Geology describing uniformitarianism","Who is Charles Lyell?",["Who is Thomas Malthus?","Who is Jean-Baptiste Lamarck?","Who is Carolus Linnaeus?"],""],
[BEF,300,"This English economist wrote An Essay on the Principle of Population, which inspired Darwin","Who is Thomas Malthus?",["Who is Charles Lyell?","Who is Adam Smith?","Who is Alfred Russel Wallace?"],""],
[BEF,400,"This naturalist formulated the Inheritance of Acquired Characteristics, the first explanation for how evolutionary change occurred","Who is Jean-Baptiste Lamarck?",["Who is Carolus Linnaeus?","Who is Charles Lyell?","Who is Charles Darwin?"],""],
[BEF,500,"Swedish naturalist who devised the taxonomic hierarchy and binomial nomenclature","Who is Carolus Linnaeus?",["Who is Jean-Baptiste Lamarck?","Who is Gregor Mendel?","Who is Charles Lyell?"],""],
[DEV,100,"Functionless structures that Darwin argued were evidence of an evolutionary past","What are vestigial structures?",["What are homologous structures?","What are analogous structures?","What are transitional forms?"],""],
[DEV,200,"The popular 19th-century hypothesis that blocked acceptance of Mendel; under it, variation is washed away each generation","What is blending inheritance?",["What is particulate inheritance?","What is codominance?","What is acquired inheritance?"],""],
[DEV,300,"On the Galápagos, one founding finch species diversifying into multiple species","What is adaptive radiation?",["What is the founder effect?","What is a population bottleneck?","What is artificial selection?"],""],
[DEV,400,"Geological processes seen today operated in the past at a gradual pace, permitting an Earth older than 6,000 years","What is uniformitarianism?",["What is catastrophism?","What is the Great Chain of Being?","What is adaptive radiation?"],""],
[DEV,500,"Structures similar across species, indicating common ancestry even when they serve different functions","What are homologous structures?",["What are vestigial structures?","What are analogous structures?","What are transitional structures?"],""],
[CEL,100,"This cell division occurs only in somatic cells; each daughter cell is exactly like the parent cell","What is mitosis?",["What is meiosis?","What is fertilization?","What is recombination?"],""],
[CEL,200,"Brown coat (B) is dominant over white (b). A BB male mates with a Bb female. The percentage of offspring born with a white coat","What is 0%?",["What is 25%?","What is 50%?","What is 75%?"],"Every offspring gets at least one B."],
[CEL,300,"Sickled hemoglobin is the result of this type of mutation","What is a point mutation?",["What is a frameshift mutation?","What is a chromosomal deletion?","What is nondisjunction?"],""],
[CEL,400,"A gene with multiple phenotypic outcomes, such as a cat gene that leads to white fur and red eyes","What is pleiotropy?",["What is linkage?","What is codominance?","What is epistasis?"],""],
[CEL,500,"Two or more alleles positioned closely on the same chromosome, so they're likely inherited as a unit","What is linkage?",["What is pleiotropy?","What is crossing over?","What is independent assortment?"],""],
[EVT,100,"This 1930s movement bridged microevolutionary and macroevolutionary processes, producing a refined definition of evolution","What is the Modern Evolutionary Synthesis?",["What is uniformitarianism?","What is the Great Chain of Being?","What is Lamarckism?"],""],
[EVT,200,"True or false: organisms have many traits that are not perfectly structured but function well enough to give a competitive edge","What is TRUE?",["What is FALSE?"],""],
[EVT,300,"Of lizards A (healthy, 19 surviving offspring), B (mated with many, 28), C (dark and quick, 22) and D (largest territory, 26), the one with the greatest fitness","What is lizard B?",["What is lizard A?","What is lizard C?","What is lizard D?"],"Fitness = offspring surviving to adulthood."],
[EVT,400,"Occurs during meiosis when genetic material is exchanged between homologous chromosomes; explains why siblings can be so different","What is recombination (crossing over)?",["What is mitosis?","What is linkage?","What is nondisjunction?"],""],
[EVT,500,"Male and female differences (sexual dimorphism) are best understood as a result of this special type of natural selection","What is sexual selection?",["What is artificial selection?","What is genetic drift?","What is the founder effect?"],""],
[FOR,100,"The weakest force of evolution but the only source of new genetic variation","What is mutation?",["What is natural selection?","What is genetic drift?","What is gene flow?"],""],
[FOR,200,"Dutch colonists in South Africa carried a high share of the Huntington's gene; it became more common among Afrikaners than in the Netherlands","What is the founder effect?",["What is a population bottleneck?","What is natural selection?","What is gene flow?"],"A small group leaves and starts a new population."],
[FOR,300,"Mutations that arise in these cells have important implications for evolution","What are gametes?",["What are somatic cells?","What are skin cells?","What are neurons?"],""],
[FOR,400,"Alleles linked to better survival and reproduction increase in frequency in the next generation","What is natural selection?",["What is genetic drift?","What is mutation?","What is gene flow?"],""],
[FOR,500,"A zombie apocalypse leaves only the few people in your basement to repopulate the earth","What is a population bottleneck?",["What is the founder effect?","What is natural selection?","What is adaptive radiation?"],"A disaster shrinks an existing population."]
];

// ===== Question index
const DECKS={
  TH:{name:"Top Hat",sub:"Lecture participation questions from Top Hat."},
  AC:{name:"Review",sub:"Activities 1–3 from Brightspace, in worksheet order when not shuffled."},
  AP:{name:"Anthro-pardy",sub:"The in-class game show. Right answers win the clue's value; wrong ones lose it."}
};
const Q={}, IDS={TH:[],AC:[],AP:[]};
TH.forEach((r,n)=>{const id="TH"+n;Q[id]={d:"TH",tag:r[0],q:r[1],ok:r[2],wrong:r[3],ex:r[4]};IDS.TH.push(id)});
AC.forEach((r,n)=>{const id="AC"+n;Q[id]={d:"AC",tag:"Question "+r[0],q:r[1],ok:r[2],wrong:r[3],ex:r[4]};IDS.AC.push(id)});
AP.forEach((r,n)=>{const id="AP"+n;Q[id]={d:"AP",tag:r[0],val:r[1],q:r[2],ok:r[3],wrong:r[4],ex:r[5]};IDS.AP.push(id)});

// ===== Reference images (cropped from the original Top Hat / Brightspace questions)
const IMG={TH15:["img/cells.jpg","A and B cells"],TH18:["img/nucleotide.jpg","DNA segment with one unit circled"],
AC31:["img/sugar.png","DNA ladder with the sugar labeled X"],AC41:["img/codon.jpg","Genetic code table"],AC43:["img/trna.png","Ribosome with a molecule labeled X"],
AC61:["img/taysachs.png","Enzyme function chart: Tay-Sachs, carrier, normal"],AC62:["img/taysachs.png","Enzyme function chart: Tay-Sachs, carrier, normal"],AC63:["img/taysachs.png","Enzyme function chart: Tay-Sachs, carrier, normal"]};
for(const n of [34,35,36,37,38]) IMG["AC"+n]=["img/dna3.png","DNA segments from a plant, a mammal and a bacterium"];
for(const n of [52,53,54,55]) IMG["AC"+n]=["img/birds.png","White female bird, black male bird, four eggs"];
for(const n of [64,65,66]) IMG["AC"+n]=["img/cross.png","Male × female cross giving Dd, all tall"];

// ===== DNA sequence problem set: the course's own sequence questions, then a fixed set of practice problems
DECKS.SQ={name:"Sequences",sub:"DNA sequence problems only: complementary strands, transcription, anticodons and translation."};
IDS.SQ=[];
const CODE=(()=>{const b="UCAG",aa="phenylalanine phenylalanine leucine leucine serine serine serine serine tyrosine tyrosine stop stop cysteine cysteine stop tryptophan leucine leucine leucine leucine proline proline proline proline histidine histidine glutamine glutamine arginine arginine arginine arginine isoleucine isoleucine isoleucine methionine threonine threonine threonine threonine asparagine asparagine lysine lysine serine serine arginine arginine valine valine valine valine alanine alanine alanine alanine aspartic_acid aspartic_acid glutamic_acid glutamic_acid glycine glycine glycine glycine".split(" ");
  const m={};
  // table order: first base, second base, third base
  const order=[];for(const f of b)for(const s of b)for(const t of b)order.push(f+s+t);
  // aa list is written first-base, second-base, third-base order
  order.forEach((c,i)=>m[c]=aa[i].replace("_"," "));return m})();
const PAIR_DNA={A:"T",T:"A",G:"C",C:"G"}, PAIR_RNA={A:"U",T:"A",G:"C",C:"G",U:"A"};
const comp=(s,p)=>s.replace(/[ATGCU]/g,c=>p[c]);
const toU=s=>s.replace(/T/g,"U");
const fmt=s=>s.match(/.{3}/g).join(" ");
const tr=r=>fmt(r).split(" ").map(c=>CODE[c]).join(" – ");
// seeded RNG so the set is the same every visit (progress stays matched)
let seed=20261006;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const choose=a=>a[Math.floor(rnd()*a.length)];
function randDNA(n=9){let s="";for(let i=0;i<n;i++)s+=choose("ATGC");return s}
function oneOff(s,alpha){const i=Math.floor(rnd()*s.length);let c;do{c=choose(alpha)}while(c===s[i]);return s.slice(0,i)+c+s.slice(i+1)}
function optsFrom(ok,cands,alpha,mk){const out=[];const seen=new Set([ok]);
  for(const c of cands){if(c&&!seen.has(c)){seen.add(c);out.push(c)}if(out.length===3)break}
  let g=0;while(out.length<3&&g++<50){const c=mk?mk():oneOff(ok,alpha);if(!seen.has(c)){seen.add(c);out.push(c)}}return out}
const SQ=[];
// course questions (same answers as in the other sets)
SQ.push(["From Anthro-pardy · $400",`One side of a DNA strand has ${S_("AAG TTC CTT")}. The other strand contains these bases:`,S_("TTC AAG GAA"),[S_("UUC AAG GAA"),S_("AAG TTC CTT"),S_("TTG AAC GAA")],"DNA pairs A↔T and G↔C. No U in DNA."]);
SQ.push(["From Anthro-pardy · $500",`A template strand of protein-coding DNA has ${S_("GTA AAG TAG")}. The mRNA codons are:`,S_("CAU UUC AUC"),[S_("CAT TTC ATC"),S_("GUA AAG UAG"),S_("CAU UUC AUG")],"Complement each base and write U wherever DNA would have T."]);
SQ.push(["From Review Q34","Base-pairing rules: adenine (A) always bonds with ______, and cytosine (C) always bonds with ______.","thymine; guanine",["guanine; thymine","uracil; guanine","cytosine; adenine"],""]);
SQ.push(["From Review Q40",`DNA template strand ${S_("TCA GCC TAA")}. The transcribed mRNA codons are:`,S_("AGU CGG AUU"),[S_("UGT CGG UTT"),S_("AGT CGG ATT"),S_("AUT CUU ATT"),S_("TCA GCC TAA")],""]);
SQ.push(["From Review Q41",`DNA template strand ${S_("TCA GCC TAA")}. The tRNA anticodons are:`,S_("UCA GCC UAA"),[S_("AGU CGG AUU"),S_("AGT CGG ATT"),S_("AUT CGG ATT"),S_("TCA GCC TAA")],"Anticodons pair with the mRNA, so they match the template with U in place of T."]);
SQ.push(["From Review Q42",`Using the genetic code, DNA template ${S_("TCA GCC TAA")} codes for which amino acids?`,"serine – arginine – isoleucine",["serine – alanine – stop","isoleucine – arginine – serine","serine – stop – isoleucine","serine – arginine – stop"],"First transcribe to mRNA (AGU CGG AUU), then look up each codon.","codon"]);
SQ.push(["From Review Q45",`tRNA anticodons that align with mRNA codons ${S_("GAA UAC UUG")}:`,S_("CUU AUG AAC"),[S_("CAA TAC AAC"),S_("CGC AUU CAU"),S_("CTT ATG AAC")],""]);
SQ.push(["From Review Q45",`mRNA transcription of the DNA strand ${S_("GCG TAA GTA")}:`,S_("CGC AUU CAU"),[S_("CGC UTT CUT"),S_("CGC ATT CAT"),S_("GCG UAA GUA")],""]);
// practice problems
const KINDS=[
  ["Complementary strand",d=>{const ok=comp(d,PAIR_DNA);return [`One DNA strand reads ${S_(fmt(d))}. What is the complementary DNA strand?`,ok,[toU(ok),d,ok.split("").reverse().join("")],"ATGC",`Pair A↔T and G↔C: ${fmt(d)} → ${fmt(ok)}. DNA never contains U.`]}],
  ["Transcription",d=>{const ok=comp(d,PAIR_RNA);return [`DNA template strand ${S_(fmt(d))}. What mRNA codons are transcribed?`,ok,[comp(d,PAIR_DNA),toU(d),d],"AUGC",`Complement each base and use U instead of T: ${fmt(d)} → ${fmt(ok)}.`]}],
  ["Anticodons",d=>{const ok=toU(d);const m=comp(d,PAIR_RNA);return [`DNA template strand ${S_(fmt(d))}. What are the tRNA anticodons?`,ok,[m,d,comp(d,PAIR_DNA)],"AUGC",`mRNA is ${fmt(m)}; anticodons pair with it, giving ${fmt(ok)} (the template with U for T).`]}],
  ["Codons to anticodons",d=>{const m=comp(d,PAIR_RNA);const ok=comp(m,PAIR_RNA);return [`mRNA codons ${S_(fmt(m))}. Which tRNA anticodons align with them?`,ok,[comp(m,{A:"T",U:"A",G:"C",C:"G"}),m,ok.split("").reverse().join("")],"AUGC",`Pair A↔U and G↔C: ${fmt(m)} → ${fmt(ok)}.`]}],
  ["Translation from DNA",d=>{const m=comp(d,PAIR_RNA);const ok=tr(m);return [`Using the genetic code, which amino acids does DNA template ${S_(fmt(d))} code for?`,ok,[tr(toU(d)),tr(comp(m,PAIR_RNA)),tr(oneOff(m,"AUGC"))],null,`Transcribe first: mRNA = ${fmt(m)}. Then look up each codon: ${ok}.`,"codon",()=>tr(oneOff(m,"AUGC"))]}],
  ["Translation from mRNA",d=>{const m=comp(d,PAIR_RNA);const ok=tr(m);return [`Using the genetic code, which amino acids do the mRNA codons ${S_(fmt(m))} code for?`,ok,[tr(comp(m,PAIR_RNA)),tr(m.split("").reverse().join("")),tr(oneOff(m,"AUGC"))],null,`Read each codon in the table: ${fmt(m)} → ${ok}.`,"codon",()=>tr(oneOff(m,"AUGC"))]}]
];
for(let round=0;round<5;round++) for(const [name,make] of KINDS){
  let d;do{d=randDNA()}while(name.startsWith("Translation")&&/stop/.test(tr(comp(d,PAIR_RNA))));
  const [q,ok,cands,alpha,ex,img,mk]=make(d);
  const isSeq=alpha!==null, show=s=>isSeq?S_(fmt(s)):s;
  const wrong=optsFrom(ok,cands,alpha||"AUGC",mk).map(show);
  SQ.push(["Practice · "+name,q,show(ok),wrong,ex,img]);
}
// ===== People: every course question about the scientists and thinkers, then practice questions
DECKS.PP={name:"People",sub:"Darwin, Wallace, Malthus, Lyell, Lamarck, Linnaeus, Mendel and Dr. Katie Pollard: who they were and what they contributed."};
IDS.PP=[];
const SRC={TH:"From Top Hat",AC:"From Review",AP:"From Anthro-pardy"};
const PPLINK=["TH8","AP6","TH4","AP12","AP11","TH5","AP13","TH6","AP14","AP16","TH10","AC0","AC1","AC2","AC3","AC4","AC6","AC8","AC24","AC29"];
PPLINK.forEach((src,n)=>{const x=Q[src],id="PP"+n;
  const tag=SRC[x.d]+" · "+(x.d==="AP"?x.tag+" $"+x.val:x.tag.replace(/^Question /,"Q"));
  Q[id]={d:"PP",tag,q:x.q,ok:x.ok,wrong:x.wrong,ex:x.ex};IDS.PP.push(id)});
const PPX=[
["Charles Darwin","Who wrote On the Origin of Species, laying out evolution by natural selection?","Charles Darwin",["Alfred Russel Wallace","Charles Lyell","Jean-Baptiste Lamarck"],""],
["Darwin & Wallace","Darwin and Alfred Russel Wallace independently arrived at the same mechanism for evolutionary change:","Natural selection",["Inheritance of acquired characteristics","Uniformitarianism","Blending inheritance"],"That's why Wallace is called the co-discoverer of natural selection."],
["Charles Lyell","Charles Lyell's Principles of Geology described which model?","Uniformitarianism",["Catastrophism","The Great Chain of Being","Binomial nomenclature"],""],
["Charles Lyell","Why did Lyell's uniformitarianism matter for Darwin's theory?","It meant the earth was immensely old, giving time for slow, gradual change",["It proved species were fixed","It explained where variation comes from","It showed traits blend in offspring"],"Gradual processes need an earth far older than 6,000 years."],
["Thomas Malthus","Thomas Malthus's profession and nationality:","English economist",["Swedish naturalist","French naturalist","English geologist"],"Lyell is the geologist; Linnaeus is Swedish; Lamarck is French."],
["Thomas Malthus","Malthus argued that overpopulation drives competition for resources. Darwin took this as the idea of a:","Struggle for existence",["Great Chain of Being","Tree of life","Scala Naturae"],""],
["Jean-Baptiste Lamarck","A giraffe stretches its neck to reach leaves and passes the longer neck on to its offspring. Whose idea is this?","Jean-Baptiste Lamarck",["Charles Darwin","Thomas Malthus","Gregor Mendel"],"Inheritance of acquired characteristics. It's wrong, but it was the first proposed mechanism."],
["Jean-Baptiste Lamarck","Which pre-Darwin thinker gave the first explanation for HOW evolutionary change occurs?","Jean-Baptiste Lamarck",["Carolus Linnaeus","Charles Lyell","Thomas Malthus"],""],
["Carolus Linnaeus","Naming our species Homo sapiens (Genus species) is an example of which Linnaeus contribution?","Binomial nomenclature",["Uniformitarianism","Natural selection","The Great Chain of Being"],""],
["Carolus Linnaeus","Carolus Linnaeus was a naturalist from:","Sweden",["England","France","Austria"],""],
["Gregor Mendel","Blending inheritance was a barrier to the acceptance of whose principles of inheritance?","Gregor Mendel",["Charles Lyell","Thomas Malthus","Carolus Linnaeus"],"Under blending, variation would wash away each generation; Mendel showed traits are passed on as separate units."],
["Dr. Katie Pollard","In the film, Dr. Katie Pollard's research compares the DNA of:","Humans and chimpanzees",["Finches on different islands","Stickleback fish and manatees","Rock pocket mice"],""],
["Charles Darwin","On the Galápagos, Darwin explained the many finch species as one founding species diversifying. This is:","Adaptive radiation",["Founder effect","Population bottleneck","Artificial selection"],""],
["Charles Darwin","Darwin argued that functionless structures were evidence of an evolutionary past. These are:","Vestigial structures",["Homologous structures","Analogous structures","Transitional forms"],""],
["Match them","Which pairing is WRONG?","Lamarck: natural selection",["Lyell: uniformitarianism","Malthus: population and struggle for existence","Linnaeus: taxonomy and binomial nomenclature"],"Lamarck = inheritance of acquired characteristics. Natural selection = Darwin and Wallace."],
["Match them","Which person is matched with the right book?","Malthus: An Essay on the Principle of Population",["Lyell: On the Origin of Species","Darwin: Principles of Geology","Linnaeus: An Essay on the Principle of Population"],"Lyell wrote Principles of Geology; Darwin wrote On the Origin of Species."]
];
PPX.forEach(r=>{const id="PP"+IDS.PP.length;Q[id]={d:"PP",tag:"Practice · "+r[0],q:r[1],ok:r[2],wrong:r[3],ex:r[4]};IDS.PP.push(id)});

SQ.forEach((r,n)=>{const id="SQ"+n;Q[id]={d:"SQ",tag:r[0],q:r[1],ok:r[2],wrong:r[3],ex:r[4]};IDS.SQ.push(id);if(r[5]==="codon")IMG[id]=["img/codon.jpg","Genetic code table"]});

// ===== Topics (for the Progress tab)
const TOPIC1={SCI:"Science & method",DAR:"Darwin & natural selection",PEO:"Scientists & thinkers",DNA:"Cells, DNA & genes",PRO:"Protein synthesis & sequences",GEN:"Inheritance & genetics",FOR:"Mutation & forces of evolution"};
const RANGE=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const TMAP={
  TH:{SCI:[0,1,2],DAR:RANGE(3,14),DNA:[15,16,17,18,19,20,28,29],PRO:[21],FOR:[22,36,37,39,40,41,42,43],GEN:[23,24,25,26,27,30,31,32,33,34,35,38]},
  AC:{DAR:RANGE(0,10),DNA:[11,12,...RANGE(15,38)],FOR:[13,14],PRO:RANGE(39,51),GEN:RANGE(52,66)},
  AP:{DNA:[0,1],GEN:[2,16,20,21,23,24,28],PRO:[3,4],SCI:[5,7,8,9],DAR:[6,10,11,12,13,14,15,17,18,19,26,27],FOR:[22,25,29,30,31,32,33,34]}
};
for(const d in IDS) IDS[d].forEach((id,n)=>{
  let t=d==="SQ"?"PRO":d==="PP"?"PEO":null;
  if(!t&&TMAP[d]) for(const k in TMAP[d]) if(TMAP[d][k].includes(n)) t=k;
  Q[id].topic=TOPIC1[t]||DECKS[d].name;
});
// Origin labels shown on each question
DECKS.TH.src="Top Hat (lecture)"; DECKS.AC.src="Brightspace Review Activities 1–3"; DECKS.AP.src="Anthro-pardy (in-class game)"; DECKS.SQ.src="Practice: DNA sequences"; DECKS.PP.src="Practice: scientists";
// People repeats 20 questions and Sequences repeats 8 from the other sets. Show each question once,
// and file the people questions under Scientists & thinkers.
PPLINK.forEach((src,n)=>{Q["PP"+n].dup=true;Q[src].topic=TOPIC1.PEO});
for(let n=0;n<8;n++)Q["SQ"+n].dup=true;
// Subject tabs, in course order
const SUBJECTS1=[
  {name:TOPIC1.SCI,short:"Science",sub:"Hypotheses, theories and the scientific method."},
  {name:TOPIC1.DAR,short:"Natural selection",sub:"Ideas before Darwin, Darwin's evidence, fitness and how natural selection works."},
  {name:TOPIC1.PEO,short:"Scientists",sub:"Darwin, Wallace, Malthus, Lyell, Lamarck, Linnaeus, Mendel and Dr. Katie Pollard."},
  {name:TOPIC1.DNA,short:"Cells & DNA",sub:"Cells, DNA structure, genes, HOX and body-plan genes."},
  {name:TOPIC1.PRO,short:"Protein synthesis",sub:"Transcription, translation, codons, anticodons and sequence problems."},
  {name:TOPIC1.GEN,short:"Genetics",sub:"Chromosomes, meiosis, alleles, Punnett squares and inheritance patterns."},
  {name:TOPIC1.FOR,short:"Forces of evolution",sub:"Mutation, gene flow, drift, founder effect, bottlenecks and sexual selection."}
];

// Explanations for questions that had none (shown after every answer)
const MORE_EX1 = {
"TH1": "A hypothesis must be testable (you can check it with observations or experiments) and falsifiable (some possible result could prove it wrong). Science never proves an idea with certainty.",
"TH2": "A theory is a well-tested explanation that has survived repeated attempts to disprove it. A hypothesis is a testable prediction, and a law describes a pattern without explaining it.",
"TH3": "The Great Chain of Being (Scala Naturae) ranked all matter and life on one fixed ladder, from rocks up through plants, animals and humans to the divine, with species never changing.",
"TH5": "Lamarck proposed the inheritance of acquired characteristics: traits gained during a lifetime (like a giraffe stretching its neck) pass to offspring. It was the first explanation of how change happens, but genetics showed acquired traits aren't inherited.",
"TH7": "Uniformitarianism (Hutton, then Lyell): the slow processes we see today, like erosion and sedimentation, also shaped the earth in the past, so the earth must be very old. Catastrophism instead blamed sudden disasters.",
"TH8": "Alfred Russel Wallace reached natural selection on his own; his 1858 letter pushed Darwin to publish. Malthus inspired both men, Lyell was a geologist, and Mendel worked on heredity.",
"TH9": "Adaptive radiation: one ancestral group quickly diversifies into many species that fill open niches. Mammals did this after the dinosaurs died out.",
"TH10": "Darwin didn't know how traits are inherited: Mendel's work wasn't widely known until 1900, and DNA came much later. Fossils, artificial selection, biogeography and comparative anatomy were all in Origin of Species.",
"TH11": "This is how natural selection works: individuals with favorable variations survive and reproduce more. The rest are misconceptions. Individuals don't evolve, evolution doesn't make perfect organisms, and it has no goals or needs.",
"TH13": "TRUE. Every use of antibiotics, including in livestock, kills susceptible bacteria and leaves the resistant ones to multiply, so resistance spreads by natural selection.",
"TH14": "Selection acts on individuals: who survives and reproduces. Evolution is the change in allele frequencies in a population over generations.",
"TH17": "Gametes (sperm and eggs) carry DNA to the next generation. Somatic (body) cells, like blood cells and neurons, aren't passed on.",
"TH18": "A nucleotide is DNA's building block: one phosphate, one deoxyribose sugar and one nitrogenous base.",
"TH19": "DNA is deoxyribonucleic acid, so its sugar is deoxyribose. RNA uses ribose.",
"TH21": "Transcription copies a gene's DNA into mRNA, in the nucleus. Translation then reads the mRNA to build a protein.",
"TH22": "A point mutation changes a single base. Sickle-cell hemoglobin comes from one changed base. A frameshift instead adds or deletes bases and shifts the whole reading frame.",
"TH24": "Crossing over happens in meiosis, when gametes form, and it shuffles alleles into new combinations. Mitosis makes identical copies.",
"TH26": "Crossing over (recombination) in meiosis swaps pieces between homologous chromosomes, so each sperm and egg carries a new mix of the parents' alleles. That's why siblings differ.",
"TH27": "Alleles are different versions of the same gene, such as brown vs. blue eye color.",
"TH29": "HOX genes are highly conserved regulatory genes that lay out the head-to-tail body plan in animals from flies to humans.",
"TH31": "Homozygous means two identical alleles, and dominant alleles are written in capitals: BB.",
"TH32": "Heterozygous means two different alleles, one dominant (B) and one recessive (b): Bb.",
"TH34": "A recessive allele only shows when there are two copies (bb); a single dominant allele masks it.",
"TH35": "Homozygous dominant = BB; heterozygous = Bb. Both mice look brown because B is dominant.",
"TH37": "All four are true. Mutation is the only source of new alleles, only mutations in gametes reach offspring, and on its own mutation is a weak force because new mutations are rare.",
"TH38": "Tt × Tt gives TT, Tt, Tt and tt. One in four children (25%) is tt and has Tay-Sachs.",
"TH40": "Founder effect: a small group starts a new, isolated population, so its gene pool carries chance allele frequencies. A rare recessive trait becomes common.",
"TH41": "A population bottleneck is a sudden, drastic drop in population size, often from a disaster, that wipes out genetic diversity. A founder effect is a small group breaking away to start a new population.",
"TH42": "Sexual selection, through competition for mates and mate choice, favors traits that differ between the sexes, like larger males or bigger canines.",
"TH43": "Carriers with one sickle and one normal allele resist malaria without getting sickle-cell disease, so they out-reproduce both kinds of homozygote. This is heterozygote advantage.",
"AC0": "Darwin saw that variation existed but couldn't explain where it came from or how it was inherited. Genetics answered that later.",
"AC1": "His father sent him to Edinburgh to study medicine, but Darwin couldn't stand surgery and left.",
"AC2": "Captain FitzRoy wanted a gentleman companion to talk to on the long voyage. That was Darwin's role.",
"AC3": "In Argentina Darwin found fossils of giant extinct mammals, like giant ground sloths, that resembled living species. That suggested species change over time.",
"AC5": "The finches were closely related but separate species on different islands, with beaks suited to local foods: one ancestor diversifying.",
"AC6": "Fossils, finches and other observations convinced Darwin that species change over time instead of being fixed.",
"AC7": "The same embryonic structures become gills in fish but ear bones in humans, a sign of shared ancestry (homology).",
"AC8": "The tree of life shows every species, living or extinct, branching from common ancestors. Close relatives sit on nearby branches.",
"AC9": "Artificial selection: humans choose which individuals breed to get the traits they want, as with dog breeds.",
"AC10": "On dark lava rock, dark-furred mice are hard for predators to see, so they survive and reproduce more. That's natural selection.",
"AC11": "DNA's four bases are guanine, adenine, thymine and cytosine: G, A, T, C.",
"AC12": "All life uses the same four letters; what differs is their order (sequence).",
"AC13": "Mutation creates new variation; selection then acts on it.",
"AC14": "Most mutations are neutral. Some are harmful and a few helpful, depending on the environment.",
"AC16": "Body-plan (HOX) genes decide where the head, body segments and limbs develop.",
"AC17": "Only about 2% of the human genome codes for proteins; much of the rest helps regulate genes.",
"AC18": "Genetic switches turn genes on or off in particular places and times. The wing spots appear only where the switch is on.",
"AC19": "The same kind of genetic switch that removed the sticklebacks' pelvic spines is linked to the loss of hindlimbs in manatees and whales: the same toolkit, reused.",
"AC20": "All finches share the same beak genes. The differences come from when, and how strongly, those genes are switched on during development.",
"AC21": "Tiktaalik has a fish body, gills and scales, but its fin has arm-like bones (shoulder, elbow, wrist). That makes it a transitional form between fish and four-limbed animals.",
"AC22": "With no Tiktaalik DNA, scientists studied the paddlefish, a primitive living fish, to see how fin and limb genes work.",
"AC23": "HOX genes are body-plan genes conserved across complex animals for about 600 million years.",
"AC24": "Humans and chimps share about 99% of their DNA. The small differences, many of them in gene switches, matter a lot.",
"AC26": "Microcephaly (\"small head\") gives children much smaller brains; the genes involved are clues to how the human brain grew.",
"AC27": "The brain changed the most: human brains are about three times the size of a chimpanzee's.",
"AC29": "In HAR1, a gene active in building the cortex, 18 changes separate humans from chimps, while chimps and chickens differ by only 2.",
"AC30": "The nucleus holds the DNA and separates it from the rest of the cell (the cytoplasm).",
"AC31": "DNA's sugar is deoxyribose (\"de-oxy\": one oxygen fewer than ribose, RNA's sugar).",
"AC32": "Each nucleotide is a phosphate, a deoxyribose sugar and a nitrogenous base. Hydrogen bonds join the bases of the two strands; they aren't part of one nucleotide.",
"AC33": "A pairs with T, and C pairs with G. (In RNA, A pairs with U.)",
"AC34": "True. All DNA has the same sugar–phosphate backbone.",
"AC35": "True. All DNA uses the same four bases: A, C, G and T.",
"AC37": "True. A–T and C–G pairing is the same in all DNA.",
"AC38": "Only the order of the bases differs, and that order carries the genetic information.",
"AC43": "tRNA (transfer RNA) carries amino acids to the ribosome; its anticodon pairs with the mRNA codon.",
"AC44": "A polypeptide is a chain of amino acids linked by peptide bonds; it folds into a protein.",
"AC45": "Translation happens at ribosomes, in the cytoplasm.",
"AC46": "Peptide bonds join amino acids into a chain. Hydrogen bonds are what hold DNA's two strands together.",
"AC47": "An anticodon is the three-base sequence on tRNA that matches an mRNA codon.",
"AC48": "Pair each mRNA base (G–C, A–U, U–A, C–G): GAA → CUU, UAC → AUG, UUG → AAC. RNA uses U, never T.",
"AC49": "Pair each DNA base (G → C, C → G, T → A, A → U): GCG → CGC, TAA → AUU, GTA → CAU. mRNA has U instead of T.",
"AC50": "A codon is a three-base sequence on mRNA that codes for one amino acid.",
"AC51": "Transcription happens in the nucleus, where the DNA is.",
"AC52": "Heterozygous means one of each allele: Bb.",
"AC53": "Homozygous recessive means two recessive alleles: bb.",
"AC55": "Bb × bb gives Bb, Bb, bb, bb: half Bb (white, the dominant color here) and half bb (black).",
"AC56": "Albinism is recessive, so an albino male is aa. A heterozygous female is Aa.",
"AC57": "The aa male can only pass on a; the Aa female passes on A or a. That gives Aa, Aa, aa, aa.",
"AC58": "Two Aa children have normal pigmentation (A is dominant) and two aa children are albino: 50/50.",
"AC59": "Heterozygous means each parent carries one of each allele: Aa and Aa.",
"AC61": "Tay-Sachs is recessive, so people with the disease carry two copies: tt.",
"AC63": "Having no disease allele means two normal alleles: TT.",
"AC64": "Dwarf is recessive, so a dwarf plant must be dd.",
"AC66": "For every offspring to be Dd with a dd mother, the father must always pass on D. So he is DD, which makes him tall.",
"AP1": "DNA is copied (replicated) in the nucleus, where it's kept.",
"AP4": "Pair each base and use U instead of T (G → C, T → A, A → U): GTA AAG TAG becomes CAU UUC AUC.",
"AP5": "A hypothesis is a testable, educated prediction based on observations.",
"AP6": "Alfred Russel Wallace reached natural selection on his own; his 1858 letter pushed Darwin to publish. Malthus inspired both men, Lyell was a geologist, and Mendel worked on heredity.",
"AP7": "The scientific method: observe, form a hypothesis, collect data, test it, and revise.",
"AP8": "In science, a theory is a well-tested explanation (like evolution), not a guess as in everyday speech.",
"AP9": "A hypothesis must be testable and falsifiable: there must be some result that could prove it wrong.",
"AP10": "The Great Chain of Being (Scala Naturae) ranked all matter and life on one fixed ladder, from rocks up through plants, animals and humans to the divine, with species never changing.",
"AP11": "Charles Lyell's Principles of Geology popularized uniformitarianism; Darwin read it on the Beagle.",
"AP12": "Thomas Malthus argued that populations grow faster than their food supply, causing a struggle for existence. That helped Darwin see natural selection.",
"AP13": "Lamarck proposed the inheritance of acquired characteristics: traits gained during a lifetime (like a giraffe stretching its neck) pass to offspring. It was the first explanation of how change happens, but genetics showed acquired traits aren't inherited.",
"AP14": "Carolus Linnaeus (Sweden) built the taxonomic hierarchy (kingdom down to species) and binomial nomenclature, two-part names like Homo sapiens.",
"AP15": "Vestigial structures, like the human tailbone, have lost their original function but show an evolutionary past.",
"AP16": "Blending inheritance said offspring are an average of their parents, so variation would be watered down each generation. Mendel showed traits pass on as separate units (particulate inheritance).",
"AP17": "Adaptive radiation: one ancestral group quickly diversifies into many species that fill open niches. Darwin's finches are the classic example.",
"AP18": "Uniformitarianism (Hutton, then Lyell): the slow processes we see today, like erosion and sedimentation, also shaped the earth in the past, so the earth must be very old. Catastrophism instead blamed sudden disasters.",
"AP19": "Homologous structures share an underlying form from a common ancestor even when they do different jobs, like a human arm, bat wing and whale flipper. Analogous structures do similar jobs but evolved separately.",
"AP20": "Mitosis divides body (somatic) cells into two identical copies. Meiosis makes gametes with half the chromosomes.",
"AP22": "A point mutation changes a single base. Sickle-cell hemoglobin comes from one changed base. A frameshift instead adds or deletes bases and shifts the whole reading frame.",
"AP23": "Pleiotropy: one gene affects several traits, like white fur and red eyes.",
"AP24": "Linked genes sit close together on the same chromosome, so they're usually inherited together.",
"AP25": "The Modern Synthesis (1930s–40s) combined Darwin's natural selection with Mendelian and population genetics.",
"AP26": "TRUE. Evolution produces \"good enough\", not perfect: a trait only has to work better than the alternatives.",
"AP28": "Crossing over (recombination) in meiosis swaps pieces between homologous chromosomes, so each sperm and egg carries a new mix of the parents' alleles. That's why siblings differ.",
"AP29": "Sexual selection, through competition for mates and mate choice, favors traits that differ between the sexes, like larger males or bigger canines.",
"AP30": "Mutation is the only source of new alleles, but on its own it's a weak force because new mutations are rare.",
"AP32": "Only mutations in gametes (sperm and eggs) reach the next generation, so they're the ones that matter for evolution.",
"AP33": "Natural selection: alleles that help survival and reproduction become more common over the generations.",
"PP20": "Charles Darwin published On the Origin of Species in 1859.",
"PP22": "Uniformitarianism (Hutton, then Lyell): the slow processes we see today, like erosion and sedimentation, also shaped the earth in the past, so the earth must be very old. Catastrophism instead blamed sudden disasters.",
"PP25": "Malthus's idea that overpopulation leads to competition became Darwin's \"struggle for existence\".",
"PP27": "Lamarck proposed the inheritance of acquired characteristics: traits gained during a lifetime (like a giraffe stretching its neck) pass to offspring. It was the first explanation of how change happens, but genetics showed acquired traits aren't inherited.",
"PP28": "Binomial nomenclature gives every species a two-part name, genus + species, like Homo sapiens.",
"PP29": "Carolus Linnaeus (Sweden) built the taxonomic hierarchy (kingdom down to species) and binomial nomenclature, two-part names like Homo sapiens.",
"PP31": "Dr. Katie Pollard compares human and chimpanzee DNA to find what makes us human, such as the HAR1 gene.",
"PP32": "Adaptive radiation: one ancestral group quickly diversifies into many species that fill open niches. Darwin used it to explain the Galápagos finches.",
"PP33": "Vestigial structures, like the human tailbone, have lost their original function but show an evolutionary past."
};
for (const id in MORE_EX1) if (Q[id] && !String(Q[id].ex || "").trim()) Q[id].ex = MORE_EX1[id];
window.BANK={mastery:true,title:"Anthro Exam 1 Multiple-Choice Drill",storageKey:"ant1-progress-v2",decks:DECKS,ids:IDS,q:Q,img:IMG,topics:SUBJECTS1};
