// Read & Learn: the course content as short reading passages, one chapter per subject (the same 8 subjects as the drill).
// Each section is a passage followed by "check yourself" questions taken from the drill bank (drill/questions.js) by id,
// so answers here count toward the drill's progress and earn Dexter XP like any other answer.
// Text is written from the lecture slides and HW 3 answers (Campbell Ch 29, 30, 31 and 39).
// <b> marks a key term. Keep each passage short: read it in a minute, then answer.
window.READ = [
{
  id: "land", topic: "Plants move to land", title: "Plants move to land", ch: "Ch 29",
  intro: "About 470 million years ago, green algae living at the edges of ponds gave rise to the first land plants. This chapter is about who those ancestors were, what life on land offered and demanded, and the bryophytes: the plants that still live the way the first ones did.",
  sections: [
    { h: "The closest relatives: charophytes",
      html: `<p>Land plants evolved from green algae called <b>charophytes</b>. They are the closest living relatives of land plants, and the evidence is in their cells.</p>
<p>Land plants and charophytes share three traits that no other algae have:</p>
<ul><li><b>Rings of cellulose-synthesizing proteins</b> (rosettes) in the plasma membrane, which build the cell wall.</li>
<li><b>Flagellated sperm</b> with a similar structure.</li>
<li><b>Sporopollenin</b>, a tough polymer that keeps charophyte zygotes from drying out when a pond shrinks.</li></ul>
<p>Sporopollenin is important for the move to land. A layer of it let zygotes survive brief dry spells, and land plants later used the same polymer to protect their spores.</p>`,
      qs: ["C290", "HW3"],
      play: [{ t: "flip", title: "Why each shared trait matters", cards: [["Rosette cellulose-synthesizing complexes", "Ring-shaped protein complexes in the membrane that build cellulose cell walls. Found only in land plants and charophytes."], ["Flagellated sperm", "Charophyte sperm look like the swimming sperm of mosses and ferns."], ["Sporopollenin", "A tough polymer that keeps zygotes from drying out. Land plants reuse it to armor spores and pollen."]] }] },
    { h: "Life on land: the payoff and the problems",
      html: `<p>Land offered early plants a lot. They got <strong>unfiltered sunlight</strong>, because water absorbs light. They also got more <b>CO<sub>2</sub></b> in the air, <strong>nutrient-rich soil</strong>, and at first almost no herbivores or pathogens.</p>
<p>It also brought two big problems. The first was <strong>drying out</strong>, because water was no longer all around them. The second was <strong>support</strong>, because air doesn't hold a body up the way water does. Sperm also needed water to swim to an egg.</p>
<p>Land plants (<b>embryophytes</b>) have traits that charophytes lack, and these traits deal with those problems:</p>
<ul><li><b>Alternation of generations</b>, with a <strong>multicellular, dependent embryo</strong> protected and fed by the parent.</li>
<li><b>Walled spores</b> made in <b>sporangia</b>.</li>
<li>Multicellular <b>gametangia</b>: <b>archegonia</b> make eggs and <b>antheridia</b> make sperm.</li>
<li><b>Apical meristems</b> at the tips of shoots and roots, which keep growing toward light and water.</li></ul>
<p>Most land plants also have a waxy <b>cuticle</b> and <b>stomata</b>, the pores for gas exchange.</p>`,
      qs: ["HW1", "HW2", "HW4"],
      play: [{ t: "sort", title: "Payoff or problem?", bins: ["☀️ Payoff of life on land", "⚠️ Problem to solve"], items: [["Unfiltered sunlight", 0], ["More CO<sub>2</sub> in the air", 0], ["Nutrient-rich soil", 0], ["Few herbivores or pathogens at first", 0], ["Drying out", 1], ["No water to hold the body up", 1], ["Sperm need water to swim to the egg", 1]] }] },
    { h: "Alternation of generations",
      html: `<p>Every land plant alternates between two multicellular forms:</p>
<ul><li>The <b>gametophyte</b> is <b>haploid (n)</b>. It makes gametes by <b>mitosis</b>.</li>
<li>Two gametes fuse to make a diploid zygote. The zygote grows into the <b>sporophyte</b>, which is <b>diploid (2n)</b>.</li>
<li>The sporophyte makes haploid <strong>spores by meiosis</strong>, and each spore grows into a new gametophyte.</li></ul>
<p>So gametophytes have half as many chromosomes as sporophytes.</p>
<p>Plants are grouped by whether they have <b>vascular tissue</b>, and the two groups differ in which generation is in charge:</p>
<ul><li>In <b>nonvascular plants</b> the haploid <strong>gametophyte dominates</strong>.</li>
<li>In <b>vascular plants</b> the diploid <strong>sporophyte dominates</strong>.</li></ul>`,
      qs: ["HW5", "HW7"],
      play: [{ t: "order", title: "Go around the life cycle", how: "Start with the gametophyte.", items: ["Gametophyte (n) makes gametes by mitosis", "Sperm fertilizes egg", "Zygote (2n)", "Sporophyte (2n) grows from the embryo", "Meiosis in the sporangium", "Spores (n) grow into new gametophytes"] }] },
    { h: "Bryophytes: liverworts, mosses and hornworts",
      html: `<p>The nonvascular plants are the <b>bryophytes</b>: <b>liverworts</b>, <b>mosses</b> and <b>hornworts</b>.</p>
<p>In a moss, the green carpet you see is the <b>gametophyte</b>. It is large, long-lived and photosynthetic. The <b>sporophyte</b> is a small stalk growing out of it.</p>
<p>The sporophyte stays attached to the gametophyte and <strong>depends on it for food</strong>, much as a child depends on a parent. At the sporophyte's tip, a <b>sporangium (capsule)</b> makes spores and releases them into the wind.</p>
<p>Liverworts are the only plants with <strong>no stomata</strong> at all. Because of this, they are thought to resemble the earliest land plants.</p>`,
      qs: ["HW6", "HW11", "HW14", "C294"],
      play: [{ t: "fig", src: ["moss-cycle"], cap: "The moss life cycle from the clicker slides. Haploid (n) parts are shown in one color, diploid (2n) in another. Find the sporophyte growing out of the female gametophyte." }] },
    { h: "Mosses changed the planet",
      html: `<p>Even without roots, early nonvascular plants changed Earth.</p>
<p>In one experiment, researchers put granite and andesite rock in small sealed containers called microcosms. Some held living moss. The control containers held only the liquid that had been filtered from ground-up moss. That way, any chemicals from the moss were in both, and the only difference was whether the moss was alive.</p>
<p>Living moss greatly increased the <b>chemical weathering</b> of the rock. It released calcium, magnesium and other minerals from the rock.</p>
<p>Weathering rock this way pulls <b>CO<sub>2</sub></b> out of the air. Climate models that included moss weathering suggest that Ordovician bryophytes could have cooled the planet enough to help bring on an ice age.</p>`,
      qs: ["C2911", "C2916"],
      play: [{ t: "fig", src: ["weathering"], cap: "The moss experiment's results (clicker slides): green bars are the controls (no living moss), purple bars have living moss. Calcium, magnesium and potassium released from granite (left) and andesite (right)." }] }
  ]
},
{
  id: "vascular", topic: "Seedless vascular plants", title: "Seedless vascular plants", ch: "Ch 29",
  intro: "Vascular tissue let plants stand up and grow tall, and the sporophyte took over the life cycle. Ferns and lycophytes still reproduce by spores and swimming sperm, but they built the first forests.",
  sections: [
    { h: "Xylem, phloem and lignin",
      html: `<p>Vascular plants have two kinds of plumbing:</p>
<ul><li><b>Xylem</b> carries <strong>water and minerals</strong> up from the roots. Its conducting cells are dead, and their walls are strengthened with <b>lignin</b>.</li>
<li><b>Phloem</b> carries <strong>sugars and other organic products</strong> to wherever they're needed. Its cells are alive.</li></ul>
<p>Lignified vascular tissue lets a plant <strong>grow tall</strong>. It holds the plant up and moves water to its top, which a bryophyte cannot do. A taller plant wins the competition for light and spreads its spores farther.</p>
<p>The traits that define vascular plants are:</p>
<ul><li>a <strong>dominant, independent sporophyte</strong></li>
<li>xylem and phloem</li>
<li>true <b>roots</b> and <b>leaves</b></li>
<li>leaves that bear sporangia, called <b>sporophylls</b></li></ul>`,
      qs: ["HW9", "HW10", "HW8", "C292"],
      play: [{ t: "match", title: "What does each one do?", pairs: [["Xylem", "Carries water and minerals up from the roots"], ["Phloem", "Carries sugars to where they're needed"], ["Lignin", "Strengthens cell walls so plants can grow tall"], ["Sporophylls", "Leaves that bear sporangia"]] }] },
    { h: "Ferns and their relatives",
      html: `<p>There are two groups of <b>seedless vascular plants</b>:</p>
<ul><li><b>Lycophytes</b>: club mosses, spike mosses and quillworts. Despite the name, club mosses are vascular, not mosses.</li>
<li><b>Monilophytes</b>: <b>ferns</b>, <b>horsetails</b> and <b>whisk ferns</b>.</li></ul>
<p>In a fern, the leafy plant you know is the <b>sporophyte</b>. On the underside of its leaves are brown dots called <b>sori</b>, which are clusters of <b>sporangia</b> that release spores. In lycophytes, sporangia are grouped into cones called <b>strobili</b>.</p>
<p>A spore grows into a tiny, heart-shaped <b>gametophyte</b>. It is <strong>free-living and photosynthetic</strong>, and it does not depend on the sporophyte.</p>
<p>Ferns still fertilize the way bryophytes do. <strong>Flagellated sperm swim through a film of water</strong> to the egg in the archegonium, so ferns do best in damp places.</p>`,
      qs: ["HW12", "HW15", "HW13", "C298"],
      play: [{ t: "sort", title: "Lycophyte or monilophyte?", bins: ["Lycophytes", "Monilophytes"], items: [["Club mosses", 0], ["Spike mosses", 0], ["Quillworts", 0], ["Ferns", 1], ["Horsetails", 1], ["Whisk ferns", 1]] }] },
    { h: "Spores, and the first forests",
      html: `<p>Most seedless vascular plants are <b>homosporous</b>. They make one kind of spore, which grows into a gametophyte with both sexes.</p>
<p>A few are <b>heterosporous</b> and make two kinds of spore:</p>
<ul><li><b>megaspores</b> grow into <strong>female</strong> gametophytes</li>
<li><b>microspores</b> grow into <strong>male</strong> gametophytes</li></ul>
<p>In the Carboniferous, lycophytes, horsetails and ferns grew into tree-sized forests, and they changed the world in three ways:</p>
<ul><li>Their roots sped up <b>weathering</b> of rock, which pulled <b>CO<sub>2</sub></b> out of the air and cooled the climate.</li>
<li>They built up soil.</li>
<li>Their buried remains became <b>coal</b>.</li></ul>
<p>In a table of key traits, bryophytes have only a cuticle. <strong>Ferns and their relatives</strong> add vascular tissue.</p>`,
      qs: ["C299", "C297", "C302"],
      play: [{ t: "match", title: "Spore vocabulary", pairs: [["Megaspore", "Grows into a female gametophyte"], ["Microspore", "Grows into a male gametophyte"], ["Homosporous", "One kind of spore"], ["Heterosporous", "Two kinds of spore"], ["Sorus", "A cluster of sporangia under a fern leaf"], ["Strobilus", "A cone of sporangia in lycophytes"]] }] }
  ]
},
{
  id: "seed", topic: "Seed plants", title: "Seed plants", ch: "Ch 30",
  intro: "Seeds and pollen freed plants from needing water to reproduce. Gymnosperms carry naked seeds on cones; angiosperms wrap them in fruits and add flowers and double fertilization.",
  sections: [
    { h: "What every seed plant shares",
      html: `<p>Seed plants took the trend toward a dominant sporophyte as far as it goes. All seed plants share five things:</p>
<ul><li><strong>Reduced gametophytes</strong>. They are tiny and stay inside the sporophyte's tissues, protected and fed by it.</li>
<li><b>Heterospory</b>: <b>megaspores</b> become female gametophytes and <b>microspores</b> become male gametophytes.</li>
<li><b>Ovules</b>: a megasporangium, a megaspore and the protective layers around them, called <b>integuments</b>.</li>
<li><b>Pollen</b>: a pollen grain is a <b>male gametophyte</b> inside a tough pollen wall containing sporopollenin. Wind or animals carry it, so sperm no longer need to swim through water to reach the egg.</li>
<li><b>Seeds</b>.</li></ul>
<p>The gametangia, the archegonia and antheridia, are still on the haploid gametophyte. In seed plants, that gametophyte sits inside the sporophyte.</p>`,
      qs: ["HW16", "HW24", "HW17", "HW19", "C296"],
      play: [{ t: "flip", title: "The seed plant toolkit", cards: [["Reduced gametophytes", "Tiny, kept inside the sporophyte's tissues and fed by it"], ["Heterospory", "Megaspores → female gametophytes; microspores → male gametophytes"], ["Ovule", "Megasporangium + megaspore + protective integuments"], ["Pollen grain", "A male gametophyte in a sporopollenin wall; no water needed"], ["Seed", "Embryo + food supply + seed coat"]] }] },
    { h: "Seeds beat spores",
      html: `<p>After fertilization, an ovule develops into a <b>seed</b>. Every seed has three parts:</p>
<ul><li>an <b>embryo</b></li>
<li>a <strong>food supply</strong></li>
<li>a protective <b>seed coat</b>, which comes from the integuments</li></ul>
<p>A spore is a single cell. A seed is a <strong>multicellular embryo with packed food and a coat</strong>. It can stay <b>dormant</b> for days or even centuries, travel a long way, and germinate when conditions are good. A date palm seed about 2,000 years old was able to sprout, living on the food stored inside it.</p>
<p>Dormancy is adaptive because the seed waits to germinate until the environment is likely to let the seedling survive.</p>`,
      qs: ["HW23", "HW25", "C306", "C307"],
      play: [{ t: "match", title: "Build a seed", pairs: [["Embryo", "The baby sporophyte"], ["Food supply", "Feeds the embryo until it can photosynthesize"], ["Seed coat", "Protection, made from the integuments"]] }] },
    { h: "Gymnosperms: naked seeds on cones",
      html: `<p><b>Gymnosperms</b> include conifers such as pines, cycads, ginkgo and gnetophytes. Their seeds are <strong>"naked"</strong>: they sit exposed on the scales of cones instead of inside an ovary.</p>
<p>In a pine:</p>
<ul><li><b>Pollen cones</b> make microspores, which become pollen grains.</li>
<li><b>Ovulate cones</b> hold ovules. Inside each ovule, a megaspore becomes the female gametophyte.</li>
<li>Pollination to fertilization can take <strong>over a year</strong>.</li>
<li>The seed's food is the <b>haploid female gametophyte</b> tissue.</li></ul>
<p>Gymnosperms have a cuticle, vascular tissue and seeds, but <strong>no flowers or fruits</strong>.</p>`,
      qs: ["HW20", "HW26", "C303"],
      play: [{ t: "sort", title: "Gymnosperm or angiosperm?", bins: ["🌲 Gymnosperms", "🌸 Angiosperms"], items: [["Naked seeds on cone scales", 0], ["Seed food = haploid female gametophyte", 0], ["Pollination to fertilization can take a year", 0], ["Pines, cycads, ginkgo", 0], ["Seeds enclosed in an ovary", 1], ["Flowers and fruits", 1], ["Double fertilization", 1], ["Seed food = 3n endosperm", 1]] }] },
    { h: "Flowers",
      html: `<p><b>Angiosperms</b> are the flowering plants. A <b>flower</b> is a shoot built for sexual reproduction, and its parts are <strong>modified leaves</strong> arranged in rings:</p>
<ul><li><b>Sepals</b> enclose and protect the bud.</li>
<li><b>Petals</b> attract pollinators.</li>
<li><b>Stamens</b> are a filament topped by an anther, which makes pollen.</li>
<li><b>Carpels</b> are made of a <b>stigma</b> that catches pollen, a <b>style</b>, and an <b>ovary</b> with the ovules inside.</li></ul>
<p>Flowers pollinated by animals tend to be showy. Flowers pollinated by wind tend to be <strong>small, green and inconspicuous</strong>, since they have no one to attract.</p>
<p>Angiosperms have all four of the key traits of land plants: <strong>cuticle, vascular tissue, seeds and flowers</strong>.</p>`,
      qs: ["HW29", "HW30", "HW31", "C305", "C301"],
      play: [{ t: "match", title: "Flower parts", pairs: [["Sepals", "Enclose and protect the bud"], ["Petals", "Attract pollinators"], ["Stamen", "Filament + anther, which makes pollen"], ["Stigma", "The sticky tip that catches pollen"], ["Ovary", "Holds the ovules; becomes the fruit"]] }, { t: "table", title: "The clicker table: four key traits", how: "Tick each trait the group has.", cols: ["Cuticle", "Vascular tissue", "Seeds", "Flowers"], rows: ["Bryophytes", "Ferns", "Gymnosperms", "Angiosperms"], ans: [[1, 0, 0, 0], [1, 1, 0, 0], [1, 1, 1, 0], [1, 1, 1, 1]] }] },
    { h: "Double fertilization and fruits",
      html: `<p>In an angiosperm, the female gametophyte is the <b>embryo sac</b>, and it has seven cells:</p>
<ul><li>an <b>egg</b>, with two <b>synergids</b> beside it</li>
<li>three <b>antipodal cells</b></li>
<li>a large <b>central cell with two polar nuclei</b></li></ul>
<p>A pollen tube delivers <strong>two sperm</strong>, and each has a job. One fertilizes the <b>egg</b> and makes the <b>2n zygote</b>. The other fuses with the <b>two polar nuclei</b> and makes the <b>3n endosperm</b>, which is the seed's food. This is <b>double fertilization</b>, and only angiosperms do it.</p>
<p>The ovary then ripens into a <b>fruit</b>. Fruits protect the seeds and spread them by wind, water or animals.</p>
<p>Three things are found in angiosperms but not gymnosperms: <strong>flowers, fruits and double fertilization</strong>.</p>`,
      qs: ["HW27", "HW28", "C300", "HW32", "HW33", "HW22", "HW21"],
      play: [{ t: "match", title: "Who becomes what?", pairs: [["Sperm 1 + egg", "2n zygote (the embryo)"], ["Sperm 2 + two polar nuclei", "3n endosperm (food)"], ["Ovule", "Seed"], ["Ovary", "Fruit"]] }] },
    { h: "Monocots and eudicots",
      html: `<p>Most angiosperms are either monocots or eudicots, and the two are easy to tell apart:</p>
<table class="rd-t"><tr><th></th><th>Monocots</th><th>Eudicots</th></tr>
<tr><td>Cotyledons (seed leaves)</td><td>one</td><td>two</td></tr>
<tr><td>Leaf veins</td><td>parallel</td><td>net-like</td></tr>
<tr><td>Vascular bundles in the stem</td><td>scattered</td><td>in a ring</td></tr>
<tr><td>Roots</td><td>fibrous</td><td>taproot</td></tr>
<tr><td>Flower parts</td><td>in threes</td><td>in fours or fives</td></tr></table>
<p>Grasses, lilies and orchids are monocots. Roses, beans and oaks are eudicots.</p>`,
      qs: ["HW34", "HW35"],
      play: [{ t: "sort", title: "Monocot or eudicot?", bins: ["Monocots", "Eudicots"], items: [["One cotyledon", 0], ["Parallel leaf veins", 0], ["Scattered vascular bundles", 0], ["Fibrous roots", 0], ["Flower parts in threes", 0], ["Two cotyledons", 1], ["Net-like leaf veins", 1], ["Vascular bundles in a ring", 1], ["Taproot", 1], ["Flower parts in fours or fives", 1]] }] }
  ]
},
{
  id: "signals", topic: "Signal transduction & tropisms", title: "Signals and tropisms", ch: "Ch 39",
  intro: "Plants can't walk away, so they respond by changing how they grow. A potato sprouting in the dark shows how a signal is received, passed along and turned into a response; the coleoptile experiments show how scientists found the first plant hormone.",
  sections: [
    { h: "A potato in the dark",
      html: `<p>A potato sprouting in a dark cellar shows <b>etiolation</b>, which is growth adapted to darkness. It has pale, long stems, small unexpanded leaves and short roots. All its energy goes into growing up toward light.</p>
<p>Once the shoot reaches light, it goes through <b>de-etiolation</b>, or "greening":</p>
<ul><li>stem elongation slows</li>
<li>leaves expand</li>
<li>roots elongate</li>
<li>the plant makes chlorophyll</li></ul>
<p>These are <b>growth responses</b>. They build new, permanent structures. <b>Behavioral</b> responses, like leaves folding at night, are reversible and build nothing new.</p>`,
      qs: ["HW36", "HW37", "C3910"],
      play: [{ t: "fig", src: ["potato"], cap: "<b>Fig. 39-2.</b> (a) A potato sprouted in the dark: etiolated. (b) The same potato after a week in daylight: de-etiolated, green and leafy." }, { t: "fig", src: ["etiolated"], cap: "Etiolation in the kitchen: white asparagus is grown covered from the light; green asparagus is not. Right: pale, long etiolated shoots." }] },
    { h: "Reception, transduction, response",
      html: `<p>Every <b>signal transduction pathway</b> has three steps:</p>
<ol><li><b>Reception</b>: a receptor detects the signal. In de-etiolation the receptor is <b>phytochrome</b>, a protein that detects light.</li>
<li><b>Transduction</b>: <b>second messengers</b> pass the signal along inside the cell and amplify it. In de-etiolation these are <b>cyclic GMP (cGMP)</b> and <b>Ca<sup>2+</sup> ions</b>.</li>
<li><b>Response</b>: the cell's activity changes. This happens in two ways:
<ul><li>by <b>post-translational modification</b> of proteins the cell already has, often by adding phosphate groups</li>
<li>by <b>transcriptional regulation</b>, which switches genes on or off</li></ul></li></ol>
<p>Not every signal is light. A <b>dodder</b> seedling, a parasitic vine, bends toward a tomato plant because it detects <strong>chemicals</strong> the host releases.</p>`,
      qs: ["HW38", "HW39", "HW40", "HW41", "LS0"],
      play: [{ t: "label", title: "Label the general model", src: "transduction-model", cap: "Fig. 39-3: a general model for signal transduction pathways.", pins: [[0.258, 0.318, "Reception"], [0.561, 0.316, "Transduction"], [0.887, 0.316, "Response"], [0.23, 0.7, "Receptor"], [0.523, 0.545, "Relay proteins and second messengers"], [0.846, 0.548, "Activation of cellular responses"], [0.148, 0.86, "Hormone or environmental stimulus"]] }, { t: "label", title: "Label phytochrome's pathway", how: "The same three steps, in de-etiolation.", src: "deetiolation-path", cap: "Fig. 39-4: phytochrome in the de-etiolation (greening) response.", pins: [[0.185, 0.349, "Phytochrome activated by light"], [0.451, 0.195, "cGMP"], [0.485, 0.773, "Ca2+ channel opened"], [0.603, 0.218, "Protein kinase 1 activated"], [0.636, 0.482, "Protein kinase 2 activated"], [0.81, 0.125, "Transcription factor 1"], [0.894, 0.771, "De-etiolation (greening) response proteins"]] }, { t: "fig", src: ["seedling-dodder"], cap: "<b>Fig. 39.1.</b> Signals aren't only light: a dodder seedling (right, a parasitic vine) grows toward a host plant by sensing its chemicals." }] },
    { h: "The coleoptile experiments",
      html: `<p><b>Phototropism</b> is growing toward light. Scientists worked out how it happens by experimenting on grass <b>coleoptiles</b>, the sheaths over young shoots.</p>
<ul><li><b>Charles and Francis Darwin</b> found that a coleoptile bends only if its <strong>tip</strong> can see light. If they covered the tip, it didn't bend. If they shielded only the bending region below the tip, it still bent. So the <strong>tip senses the light</strong>, but the <strong>region below it does the bending</strong>.</li>
<li><b>Boysen-Jensen</b> separated the tip from the rest of the coleoptile with a block. Through <b>gelatin</b>, which chemicals can pass, it still bent. Through <b>mica</b>, which chemicals can't pass, it didn't. So the signal is a <strong>mobile chemical</strong>.</li>
<li><b>Frits Went</b> soaked that chemical into agar blocks. He put a block off-center on a coleoptile with its tip cut off, and the coleoptile <strong>curved away from the side with the block</strong>, even in the dark. He named the chemical <b>auxin</b>.</li></ul>
<p>In light from one side, auxin moves to the <strong>shaded side</strong>. Cells there elongate more, so the shoot bends toward the light.</p>`,
      qs: ["HW43", "HW44", "LS1", "LS2", "LS3", "HW42"],
      play: [{ t: "sim", kind: "coleo" }, { t: "fig", src: ["darwin-tips", "boysen-jensen", "went"], cap: "The real experiments (Fig. 39-5 and 39-6): Darwin and Darwin's caps and shields, Boysen-Jensen's gelatin and mica, and Went's agar blocks." }] },
    { h: "The acid growth hypothesis",
      html: `<p>Plant cells are boxed in by rigid walls. So how does auxin make a cell longer? The <b>acid growth hypothesis</b> explains it in four steps:</p>
<ol><li>Auxin activates <b>proton pumps</b> in the plasma membrane.</li>
<li>The pumps push <strong>H<sup>+</sup> into the cell wall</strong>, so the wall becomes more acidic.</li>
<li>The low pH activates <b>expansins</b>, enzymes that loosen the cellulose network of the wall.</li>
<li>Water rushes in by osmosis, and the cell <strong>elongates</strong>.</li></ol>
<p>The cell grows in only one direction because of how the <b>cellulose microfibrils</b> in its wall are arranged. They wrap around the cell like hoops, so it can stretch lengthwise but not sideways.</p>`,
      qs: ["HW45", "C390", "C391"],
      play: [{ t: "label", title: "Label the acid growth figure", src: "acid-growth", cap: "Figure 39.7: the acid growth hypothesis. Steps 1–3 run up the left side; 4 and 5 are on the right.", pins: [[0.102, 0.737, "Proton pump activity increases."], [0.102, 0.471, "Acidity increases."], [0.104, 0.239, "Low pH activates expansins."], [0.854, 0.108, "Enzymes cleave cross-linking polysaccharides."], [0.841, 0.92, "Sliding microfibrils let the cell elongate."]] }, { t: "order", title: "Acid growth, step by step", items: ["Auxin activates proton pumps", "H<sup>+</sup> is pumped into the cell wall", "Low pH activates expansins", "Expansins loosen the cellulose", "Water enters and the cell elongates"] }] }
  ]
},
{
  id: "hormones", topic: "Plant hormones", title: "Plant hormones", ch: "Ch 39",
  intro: "Plant hormones work in tiny amounts, each has several effects, and they often work together or against each other. Learn each one by its signature job.",
  sections: [
    { h: "How plant hormones work",
      html: `<p>Plant hormones are chemical signals with four general properties:</p>
<ul><li>They act at <strong>very low concentrations</strong>.</li>
<li>Each one has <strong>several effects</strong>.</li>
<li>Their effects depend on <strong>concentration</strong> and on <strong>which tissue</strong> they reach.</li>
<li>They often <strong>interact</strong>, sometimes working together and sometimes against each other.</li></ul>
<p><b>Auxin</b> is the classic example. The most common natural auxin is <b>indoleacetic acid (IAA)</b>.</p>
<ul><li>At low concentrations, auxin <strong>stimulates</strong> the elongation of stem cells.</li>
<li>At high concentrations, it <strong>inhibits</strong> them.</li></ul>
<p>Auxin also helps form roots, controls how leaves are arranged, and helps form vascular tissue.</p>`,
      qs: ["LS5", "LS4", "HW46"],
      play: [{ t: "fig", src: ["coleoptile"], cap: "Auxin was discovered in coleoptiles: the protective sheath around a grass seedling's first leaves." }] },
    { h: "Cytokinins and apical dominance",
      html: `<p><b>Cytokinins</b> stimulate <b>cell division</b> (cytokinesis), working together with auxin.</p>
<p>The terminal bud at the top of a shoot makes auxin, which holds back the side buds. This is called <b>apical dominance</b>. Cytokinins coming up from the roots work against it and promote growth of <b>axillary (lateral) buds</b>.</p>
<p>If a gardener pinches off the terminal bud, the auxin is gone. The side buds then grow into branches and the plant gets <strong>bushier</strong>.</p>
<p>Cytokinins also <strong>slow aging</strong> by holding back protein breakdown and stimulating RNA and protein synthesis. That is why florists use them to keep cut flowers fresh.</p>
<p>The bacterium <b>Agrobacterium</b> causes crown gall tumors by inserting genes that raise the plant's cytokinin and auxin levels.</p>`,
      qs: ["HW47", "HW48", "LS7", "HW49", "LS6"],
      play: [{ t: "fig", src: ["apical-dominance"], cap: "<b>Fig. 39-9.</b> (a) With the apical bud, axillary buds stay dormant. (b) Remove it and lateral branches grow. (c) Put auxin on the stump and the buds stay dormant again." }, { t: "fig", src: ["crown-gall"], cap: "A crown gall tumor: <i>Agrobacterium</i> boosts the plant's cytokinin and auxin, causing massive cell division." }] },
    { h: "Gibberellins and brassinosteroids",
      html: `<p><b>Gibberellins</b> drive three things:</p>
<ul><li><strong>stem elongation</strong></li>
<li><strong>fruit growth</strong> (grapes are sprayed with them to grow bigger)</li>
<li><b>seed germination</b></li></ul>
<p>They were discovered through the fungus <i>Gibberella</i>, which made infected rice plants grow so <strong>tall and spindly</strong> that they fell over. In ferns, gibberellins even act as pheromones.</p>
<p><b>Brassinosteroids</b> are steroids, <strong>chemically similar to the sex hormones of animals</strong>. Their effects overlap with auxin's: cell elongation, cell division and making xylem.</p>`,
      qs: ["HW50", "LS8", "LS9", "HW52"],
      play: [{ t: "fig", src: ["foolish-rice", "ga-growth", "ga-grapes", "ga-dwarf"], cap: "Gibberellins at work: \"foolish\" rice infected with <i>Gibberella</i>; stem and fruit growth; bigger seedless grapes; and dwarf mutants grown back to normal height with gibberellin." }] },
    { h: "Abscisic acid: the brake",
      html: `<p><b>Abscisic acid (ABA)</b> slows things down, and it has three main jobs:</p>
<ul><li>It <strong>slows growth</strong>.</li>
<li>It <strong>keeps seeds dormant</strong>.</li>
<li>It helps plants survive <b>drought</b> by closing the stomata.</li></ul>
<p>Seed dormancy ends when the ABA is removed. In some seeds, <strong>heavy rain</strong> washes it out. In others, <strong>light</strong> or a <strong>long cold spell</strong> breaks it down.</p>
<p>Without ABA, nothing keeps a seed dormant. That is why <b>red mangrove</b> seeds and some maize mutants germinate while still attached to the parent plant.</p>`,
      qs: ["HW53", "HW54", "LS10"],
      play: [{ t: "fig", src: ["vivipary"], cap: "<b>Fig. 39-12.</b> With no ABA keeping them dormant, red mangrove seeds and maize mutant kernels germinate right on the parent plant." }] },
    { h: "Ethylene: ripening, falling leaves and the triple response",
      html: `<p>Plants make the gas <b>ethylene</b> in response to stresses such as drought, flooding, mechanical pressure, injury and infection. It has three signature effects.</p>
<p><b>The triple response.</b> If a seedling pushing up through soil hits a stone or a sidewalk, ethylene makes it react three ways:</p>
<ul><li>it <strong>slows stem elongation</strong></li>
<li>it <strong>thickens its stem</strong></li>
<li>it <strong>grows sideways</strong> around the obstacle</li></ul>
<p>An <b>ein</b> (ethylene-insensitive) mutant can't respond to ethylene, so it doesn't do the triple response.</p>
<p><strong>Ripening and senescence.</strong> Ethylene causes <b>fruit ripening</b>, and ripening fruit makes more ethylene, so one rotten apple speeds up the rest. Tomatoes have been engineered with an antisense gene that blocks ethylene synthesis, so they stay fresh longer.</p>
<p><b>Senescence</b> is the programmed death of cells or organs. Ethylene drives it, along with <b>leaf abscission</b>: the leaves falling from deciduous trees in autumn.</p>`,
      qs: ["HW56", "C393", "LS11", "LS12", "HW51", "C392", "LS13", "LS14"],
      play: [{ t: "fig", src: ["triple-response"], cap: "<b>Fig. 39-13.</b> The triple response: as ethylene goes up (0 → 0.80 ppm), seedlings get shorter, thicker and grow sideways." }, { t: "fig", src: ["ein-mutant", "abscission", "tomato-antisense"], cap: "Left: an <i>ein</i> mutant ignores ethylene and grows straight up. Middle: the abscission layer where a leaf breaks off. Right: tomatoes with an antisense ethylene gene stay green until ethylene is added." }] },
    { h: "Newer hormones: jasmonates and strigolactones",
      html: `<p>Two more groups of hormones have been discovered more recently:</p>
<ul><li><b>Jasmonates</b> control <strong>defense against insect herbivores</strong>, along with fruit ripening and root growth.</li>
<li><b>Strigolactones</b> regulate <b>apical dominance</b>, which controls how much a shoot branches. They also stimulate seed germination and help set up partnerships with mycorrhizal fungi.</li></ul>`,
      qs: ["LS15"],
      play: [{ t: "match", title: "The hormone table (lecture slide)", how: "Match every hormone to its signature job.", pairs: [["Auxin", "Cell elongation; branching and organ bending"], ["Cytokinins", "Cell division; lateral bud growth; slow aging"], ["Gibberellins", "Stem elongation; seeds break dormancy"], ["Abscisic acid", "Closes stomata in drought; seed dormancy"], ["Ethylene", "Fruit ripening and the triple response"], ["Brassinosteroids", "Like animal sex hormones; elongation and division"], ["Jasmonates", "Defenses against insect herbivores"], ["Strigolactones", "Apical dominance, germination, mycorrhizae"]] }] }
  ]
},
{
  id: "light", topic: "Light, clocks & seasons", title: "Light, clocks and seasons", ch: "Ch 39",
  intro: "Light tells a plant where it is, what time it is, and what season it is. Two kinds of photoreceptor do the sensing: blue-light receptors and phytochromes.",
  sections: [
    { h: "Photoreceptors",
      html: `<p><b>Photomorphogenesis</b> is the effect of light on a plant's form and development. Two classes of photoreceptor sense the light.</p>
<p><b>Blue-light photoreceptors</b> control:</p>
<ul><li><strong>hypocotyl elongation</strong></li>
<li><strong>stomatal opening</strong></li>
<li><b>phototropism</b></li></ul>
<p><b>Phytochromes</b> absorb <strong>red and far-red</strong> light and control seed germination and shade avoidance.</p>
<p>The key experiment used lettuce seeds:</p>
<ul><li><strong>Red light promoted germination.</strong></li>
<li><strong>Far-red light inhibited it.</strong></li></ul>`,
      qs: ["LS16", "LS17", "LS18"],
      play: [{ t: "fig", src: ["phototropism", "sunflowers"], cap: "Blue light drives phototropism: seedlings bend toward the lamp. Some movements are triggered by light to maximize photosynthesis." }] },
    { h: "Phytochrome: a light switch",
      html: `<p>Phytochrome switches back and forth between two forms:</p>
<ul><li><b>Red light</b> converts <strong>Pr → Pfr</strong>, the <strong>active</strong> form.</li>
<li><b>Far-red light</b> converts <strong>Pfr → Pr</strong>.</li></ul>
<p>So with any series of flashes, <strong>the last flash wins</strong>. Lettuce seeds given red, then far-red, then red light germinate, because the last flash was red.</p>
<p>Sunlight has both red and far-red, yet it still triggers germination. That's because Pr turns into Pfr faster than Pfr turns back, so sunlight leaves plenty of active Pfr.</p>
<p>Leaves at the top of a canopy get direct sun, so their phytochromes have a <strong>high Pfr/Pr ratio</strong>. Leaves below sit in light that has been filtered through other leaves, and it is rich in far-red. Their phytochromes shift toward <b>Pr</b>, which tells the shoot it is <strong>shaded</strong> and should grow taller.</p>`,
      qs: ["HW58", "HW59", "HW60", "C3912", "C394"],
      play: [{ t: "sim", kind: "phyto" }, { t: "fig", src: ["lettuce", "phytochrome"], cap: "<b>Figures 39.16 and 39.17.</b> The real lettuce-seed results, and the phytochrome switch: red light makes Pfr, which triggers germination, branching, clocks and flowering." }] },
    { h: "Biological clocks",
      html: `<p>Many plant activities repeat on a roughly 24-hour cycle. These <b>circadian rhythms</b> include stomata opening and leaves folding at night in <b>"sleep" movements</b>. Sleep movements form no permanent structures, so they count as <b>plant behavior</b>.</p>
<p>Circadian rhythms have four characteristics:</p>
<ul><li>They are controlled by an internal clock.</li>
<li>They <strong>persist in constant conditions</strong>, such as constant darkness.</li>
<li>In constant conditions their period drifts a little from exactly 24 hours.</li>
<li>Light and dark cues reset them every day.</li></ul>`,
      qs: ["HW63", "LS19", "C3913"],
      play: [{ t: "flipbook", src: ["glory-1", "glory-2", "glory-3", "glory-4"], labels: ["Before dawn", "Opening", "Almost open", "Fully open"], cap: "A morning glory opening: flowers open at the same time each day, run by an internal clock." }, { t: "fig", src: ["sleep-legume"], cap: "<b>Fig. 39-20.</b> \"Sleep\" movements: a legume's leaves are up at noon and down at midnight, even in constant light or dark." }] },
    { h: "Photoperiodism: it's the night that counts",
      html: `<p>Plants use day length, their <b>photoperiod</b>, to tell the season and time their flowering. In the 1940s, researchers found that what plants actually measure is the length of the <strong>night</strong>.</p>
<ul><li><b>Short-day plants</b> flower when the night is <strong>longer</strong> than a critical length.</li>
<li><b>Long-day plants</b> flower when the night is <strong>shorter</strong> than a critical length.</li></ul>
<p>A brief flash of light in the middle of the night breaks it into two short nights:</p>
<ul><li>A <strong>red</strong> flash keeps a short-day plant from flowering, and makes a long-day plant flower even on long nights.</li>
<li>Follow the red flash with a <strong>far-red</strong> flash and the far-red undoes the red. The plant behaves as if the night was never interrupted.</li></ul>
<p>Some plants also need <b>vernalization</b>, a long cold pretreatment, before they will flower.</p>`,
      qs: ["LS20", "HW61", "HW62", "C395", "LS21", "LS22"],
      play: [{ t: "sim", kind: "night" }, { t: "fig", src: ["photoperiod", "night-flash"], cap: "<b>Figures 39.19 and 39.20.</b> What the plants measure is the night: a flash of light breaks it in two, and far-red after red cancels the flash." }] }
  ]
},
{
  id: "stress", topic: "Stress, touch & defense", title: "Stress, touch and defense", ch: "Ch 39",
  intro: "A rooted plant has to cope with gravity, wind and touch, with drought, flooding, salt, heat and cold, and with pathogens and hungry insects. It does it all chemically.",
  sections: [
    { h: "Gravity and touch",
      html: `<p><b>Gravitropism</b>: roots grow down (<strong>positive</strong> gravitropism) and shoots grow up (<strong>negative</strong> gravitropism). Plants may sense gravity using <b>statoliths</b>: plastids (amyloplasts) heavy with starch grains that settle to the low side of a cell.</p>
<p><strong>Touch</strong> changes plants as well:</p>
<ul><li><b>Thigmomorphogenesis</b>: plants that are rubbed or shaken, for example by wind, grow <strong>shorter and stockier</strong>.</li>
<li><b>Thigmotropism</b>: <b>tendrils</b> coil around anything they touch.</li>
<li><b>Mimosa pudica</b> folds its leaflets within seconds of a touch. <b>Electrical signals (action potentials)</b> make cells at the base of each leaflet quickly lose potassium and water.</li></ul>`,
      qs: ["C396", "LS23", "HW55", "HW57", "LS24"],
      play: [{ t: "fig", src: ["gravitropism", "statoliths"], cap: "Gravitropism: a potted tomato on its side turns its shoot up. Statoliths settle to the lowest side of root-cap cells within minutes (Figure 39.22)." }, { t: "fig", src: ["thigmo", "mimosa", "tendril"], cap: "Touch: rubbed plants (left in Figure 39.23) grow shorter; <i>Mimosa</i> folds its leaflets in seconds (Figure 39.24); tendrils coil around supports." }, { t: "fig", src: ["wind-tree"], cap: "A tree shaped by constant wind: thigmomorphogenesis in the wild." }] },
    { h: "Abiotic stress",
      html: `<p><b>Stress</b> is any condition that can hurt a plant's growth, development or reproduction. Each stress has its own fix:</p>
<ul><li><b>Drought</b>: the plant makes <b>ABA</b>, which closes the stomata to save water. Its leaves may also roll up.</li>
<li><b>Flooding</b>: ethylene triggers cell death in the root cortex, which forms <b>air tubes</b> that bring oxygen to the drowned roots. ABA is not the response to flooding.</li>
<li><b>Salt</b>: the plant makes <strong>solutes it can tolerate</strong>, so water doesn't get pulled out of its cells.</li>
<li><b>Heat</b>: <b>heat-shock proteins</b> keep other proteins from <b>denaturing</b>.</li>
<li><b>Cold</b>: the plant adjusts its <b>membrane fluidity</b>, and some make <b>antifreeze proteins</b> that stop <strong>ice crystals</strong> from forming.</li></ul>`,
      qs: ["HW64", "HW65", "HW66", "C3914", "HW67", "HW68", "HW69", "C397"],
      play: [{ t: "match", title: "The stress table (lecture slide)", pairs: [["Drought", "ABA closes stomata to cut water loss"], ["Flooding", "Air tubes form to bring roots oxygen"], ["Salt", "Make solutes tolerated at high concentration"], ["Heat", "Heat-shock proteins stop denaturing"], ["Cold", "Adjust membrane fluidity; antifreeze proteins"]] }] },
    { h: "Defense against pathogens",
      html: `<p>A plant's first line of defense is a barrier: the <b>epidermis</b> and, in woody plants, the <b>periderm</b>. Pathogens usually get in through <strong>wounds or natural openings such as stomata</strong>.</p>
<p>Once inside, they meet the plant's innate immunity, which works at two levels.</p>
<ul><li><b>PAMP-triggered immunity.</b> Receptors recognize <b>molecular patterns found on many pathogens</b> (PAMPs). Many eukaryotes have receptors like these.</li>
<li><b>Effector-triggered immunity.</b> <b>R (resistance) proteins</b> detect specific <b>effectors</b> that a pathogen injects. This triggers the <b>hypersensitive response</b>: cells near the infection kill themselves and make antimicrobial compounds, and that walls off the pathogen.</li></ul>
<p>Plants do <strong>not</strong> make antibodies. Those belong to the adaptive immunity of vertebrates.</p>`,
      qs: ["HW70", "LS25", "C3915", "LS26", "HW71", "C398"],
      play: [{ t: "fig", src: ["thorns"], cap: "Physical defenses: spines and thorns keep herbivores away." }, { t: "label", title: "Label the pathogen defense figure", src: "sar", cap: "Figure 39.26: the hypersensitive response (left leaf) and systemic acquired resistance (right leaf). There are two \"Signal transduction pathway\" spots.", pins: [[0.147, 0.833, "Pathogen"], [0.339, 0.878, "Effector protein"], [0.365, 0.794, "R protein"], [0.272, 0.623, "Signal transduction pathway"], [0.284, 0.556, "Hypersensitive response"], [0.279, 0.439, "Signal"], [0.592, 0.575, "Signal transduction pathway"], [0.617, 0.688, "Acquired resistance"]] }] },
    { h: "Systemic acquired resistance and herbivores",
      html: `<p>The infected area sends out an alarm, and the whole plant becomes more resistant. This is <b>systemic acquired resistance (SAR)</b>, and it happens in four steps:</p>
<ol><li>The infected area makes <b>methylsalicylic acid</b>.</li>
<li>Phloem carries it through the plant.</li>
<li>Far from the infection, it is converted to <b>salicylic acid</b>.</li>
<li>Salicylic acid switches on defenses everywhere.</li></ol>
<p>SAR lasts for days. If it stayed on all the time, the plant would pay a <strong>metabolic cost</strong> and grow more slowly.</p>
<p><b>Herbivores</b> trigger defenses too. When caterpillars chew on a maize leaf, chemicals in their saliva make the plant release <b>volatile compounds</b>. These attract <b>parasitoid wasps</b>, which lay their eggs in the caterpillars.</p>`,
      qs: ["HW72", "C399", "C3916", "HW73"],
      play: [{ t: "order", title: "SAR in order", items: ["The infected area makes methylsalicylic acid", "Phloem carries it through the plant", "It's converted to salicylic acid far away", "Defenses switch on everywhere"] }, { t: "label", title: "Label the maize defense", src: "maize-wasp", cap: "Fig. 39-28: how a maize plant calls for help.", pins: [[0.371, 0.726, "Wounding"], [0.579, 0.705, "Chemical in saliva"], [0.432, 0.851, "Signal transduction pathway"], [0.766, 0.472, "Volatile attractants released"], [0.772, 0.116, "Parasitoid wasps recruited"]] }] }
  ]
},
{
  id: "fungi", topic: "Fungi", title: "Fungi", ch: "Ch 31",
  intro: "Fungi are not plants. They're closer to animals, they eat by absorbing, and most of each fungus lives hidden underground or inside its food.",
  sections: [
    { h: "Hyphae, mycelium and absorption",
      html: `<p>A fungus is built from <b>hyphae</b>, tiny tube-like filaments. A tangled network of hyphae is a <b>mycelium</b>. Most of a fungus is its mycelium, hidden in soil or wood.</p>
<p>A single mycelium can be enormous. A <b>fairy ring</b> of mushrooms marks the growing outer edge of one underground fungus, which may have more biomass than the trees around it.</p>
<p>Fungi are <b>heterotrophs</b>, like animals, but they <b>absorb</b> their food instead of eating it:</p>
<ol><li>They <strong>secrete enzymes</strong> into their surroundings.</li>
<li>The enzymes break down large molecules.</li>
<li>The fungus takes in the small molecules that result.</li></ol>
<p>Their cell walls are made of <b>chitin</b>, the same material as insect exoskeletons. That is one way to recognize a single-celled fungus.</p>`,
      qs: ["HW80", "C3111", "HW81", "C311", "C313"],
      play: [{ t: "fig", src: ["armillaria", "fairy-ring"], cap: "Honey mushrooms are just the fruiting bodies of an enormous underground mycelium. A fairy ring is <b>one</b> fungus growing outward (clicker slides)." }] },
    { h: "How fungi reproduce",
      html: `<p>Fungi reproduce both <strong>sexually and asexually</strong>, and both ways usually make <b>spores</b>. Sexual reproduction happens in four steps:</p>
<ol><li><b>Plasmogamy</b>: the cytoplasm of two mycelia fuses.</li>
<li>A <b>heterokaryotic</b> or <b>dikaryotic</b> stage follows. Each cell holds two different, unfused haploid nuclei, and this stage can last for years.</li>
<li><b>Karyogamy</b>: the nuclei fuse into a <b>diploid zygote</b>, the only diploid stage.</li>
<li><b>Meiosis</b> follows right away and makes haploid spores.</li></ol>
<p>Fungi have no courtship. Instead, haploid hyphae release <b>pheromones</b>, which attract compatible mates and check that they're compatible.</p>
<p>A <b>fruiting body</b> such as a mushroom is a reproductive structure made of tightly packed hyphae. It is where spores are made.</p>`,
      qs: ["HW78", "HW79", "C314", "C315", "HW77"],
      play: [{ t: "order", title: "Fungal sex in order", items: ["Pheromones bring compatible mycelia together", "Plasmogamy: the cytoplasm fuses", "Heterokaryotic / dikaryotic stage (n + n)", "Karyogamy: nuclei fuse into a 2n zygote", "Meiosis right away", "Haploid spores germinate into new mycelia"] }] },
    { h: "The fungal groups",
      html: `<p>Know each group by its signature feature:</p>
<ul><li><b>Chytrids</b> have <b>flagellated spores (zoospores)</b>, the only fungi that do. That is why they are thought to resemble the earliest fungi.</li>
<li><b>Zygomycetes</b> include <b>black bread mold</b>. Hyphae of opposite mating types fuse and form a tough <b>zygosporangium</b> that can survive harsh conditions. They grow fast.</li>
<li><b>Glomeromycetes</b> form <b>arbuscular mycorrhizae</b> inside the <strong>roots of most vascular plants</strong>.</li>
<li><b>Ascomycetes</b> are the sac fungi. They make spores inside sacs called <b>asci</b>, usually eight spores per ascus, often within a fruiting body called an <b>ascocarp</b>.</li>
<li><b>Basidiomycetes</b> are the club fungi, including mushrooms. They have club-shaped <b>basidia</b> and a <b>long-lived dikaryotic mycelium</b>. Each cell of a mushroom holds <strong>two different haploid nuclei</strong>.</li></ul>`,
      qs: ["HW85", "C319", "HW86", "HW82", "C316", "C317", "HW87", "HW83", "C318", "HW88", "HW84", "C3110"],
      play: [{ t: "match", title: "Know each group by its signature", pairs: [["Chytrids", "Flagellated spores (zoospores)"], ["Zygomycetes", "Black bread mold; tough zygosporangium"], ["Glomeromycetes", "Arbuscular mycorrhizae in plant roots"], ["Ascomycetes", "Spores in sacs (asci), 8 per ascus"], ["Basidiomycetes", "Club-shaped basidia; mushrooms; dikaryotic mycelium"]] }] },
    { h: "Fungi in the world: decomposers, partners and lichens",
      html: `<p>Fungi play several important roles in nature:</p>
<ul><li>They are major <b>decomposers</b> that recycle nutrients.</li>
<li>They are <b>mutualists</b>, such as mycorrhizae, which trade minerals for a plant's sugars.</li>
<li>Some are <b>pathogens</b> and parasites.</li></ul>
<p>Fungi are never <b>producers</b>, because none of them photosynthesize. Many make <b>antibiotics</b> such as penicillin, most likely to kill off bacteria that compete with them for food.</p>
<p>A <b>lichen</b> is a partnership between a <b>fungus</b> and a <b>photosynthetic partner</b>, either green algae or cyanobacteria.</p>
<ul><li>The <b>fungus</b> gives the lichen its body. It absorbs water and minerals and protects the partner.</li>
<li>The <strong>partner</strong> makes the food.</li></ul>
<p>Lichens survive drying out and can break down rock, so they are often <strong>first on bare rock</strong> or new volcanic ground.</p>`,
      qs: ["HW76", "C312", "C3113", "HW74", "HW75", "C3114"],
      play: [{ t: "sort", title: "Role of fungi?", bins: ["Fungi do this", "No fungus does this"], items: [["Decompose dead matter", 0], ["Form mycorrhizae with plants", 0], ["Cause disease as pathogens", 0], ["Make antibiotics like penicillin", 0], ["Partner with algae in lichens", 0], ["Photosynthesize as producers", 1], ["Make chloroplasts", 1], ["Swallow food like animals", 1]] }] }
  ]
}
];
