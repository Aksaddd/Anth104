// Read & Learn: the course content as short reading passages, one chapter per subject (the same 10 subjects as the drill).
// Each section is a passage followed by "check yourself" questions taken from the drill bank (drill/questions.js) by id,
// so answers here count toward the drill's progress and earn Dexter XP like any other answer.
// Text is written from Ahearn's Living Language (3rd ed.), the assigned readings and the lecture slides.
// <b> marks a key term (double-tap it for its definition). Keep each passage short: read it in a minute, then answer.
window.READ = [
{
  id: "social", topic: "Language as social action", title: "The socially charged life of language", ch: "Ch 1 · Rickford & King",
  intro: "Words \"taste\" of every context they have lived in (Bakhtin). This chapter sets up the whole course: language isn't a neutral pipe for information but a form of social action, and four key terms help us see how.",
  sections: [
    { h: "Three puzzles that need both language and culture",
      html: `<p>Ahearn opens with three scenes:</p>
<ul><li>In a San Francisco anti-drug class, students rattle off words for <strong>stoned</strong>: high, bombed, blitzed, weeded. The words <b>index</b> who they are: young, in the know, in particular groups.</li>
<li>In <strong>Gapun, Papua New Guinea</strong>, children stopped speaking <b>Taiap</b> for Tok Pisin. The usual economic causes didn't apply, and adults blamed their \"bikhed\" (strong-willed) children (Kulick).</li>
<li>In the <strong>Pounded Rice Ritual</strong> in Junigau, Nepal, the groom asks his bride for rice three times, moving from the most polite \"you\" (<i>tapāi</i>) to <i>timi</i> to the lowest <i>tã</i>. Only then does she hand it all over.</li></ul>
<p>Neither a purely linguistic nor a purely cultural analysis explains any of them. The starting principle of the field: <strong>language is inherently social</strong>. Using it is itself <b>social action</b>.</p>`,
      qs: ["C010", "C0112", "C0113", "C0114"] },
    { h: "Not a conduit: Saussure, Chomsky and what linguists leave out",
      html: `<p>A popular view treats language as an empty pipe for ideas, the <b>conduit metaphor</b> (Reddy).</p>
<p>Linguistics has its own reductionism. <strong>Saussure</strong> said language structure must be studied apart from its uses, separating <b>langue</b> (the system) from <b>parole</b> (everyday speech). <strong>Chomsky</strong> looks for <b>Universal Grammar</b> and separates <b>competence</b> (unconscious knowledge of rules) from <b>performance</b> (using them).</p>
<p>Ahearn's <strong>\"Chomsky the knittist\"</strong> would study only knitting patterns and a \"Knitting Acquisition Device,\" ignoring who knits, why, and what knitting means. Linguistic anthropologists reject or expand the distinction, for example with Hymes's idea that competence includes using language <strong>appropriately in context</strong>.</p>`,
      qs: ["C011", "C012", "C013", "C014", "C016", "C017"],
      play: [{ t: "match", title: "Who said what?", pairs: [["Saussure", "langue vs. parole"], ["Chomsky", "Universal Grammar; competence vs. performance"], ["Reddy", "the conduit metaphor"], ["Hymes", "competence includes appropriate use"]] }] },
    { h: "What you need to know to \"know\" a language",
      html: `<p>Five components (Cipollone et al.):</p>
<ul><li><b>Phonology</b>: the meaningful sounds (or, in sign languages, gestures).</li>
<li><b>Morphology</b>: word structure: prefixes, suffixes, infixes.</li>
<li><b>Syntax</b>: sentence structure, Chomsky's main focus.</li>
<li><b>Semantics</b>: meaning.</li>
<li><b>Pragmatics</b>: meaning in use, in real social contexts.</li></ul>
<p>Linguists focus on the first three; linguistic anthropologists integrate semantics and pragmatics with them.</p>
<p>Languages differ enormously. Nepali forces you to mark status in \"you\"; Comanche marks whether \"it\" is visible and near; Eastern Pomo marks how you know something (<b>evidentiality</b>); Dyirbal and Swahili sort nouns into <b>noun classes</b>. As Jakobson put it, languages differ in what they <strong>must</strong> convey, not what they <strong>may</strong>.</p>`,
      qs: ["C018", "C019", "C0110", "C0116", "C0117", "C0118", "C0120"],
      play: [{ t: "sort", title: "Which component?", bins: ["Phonology / morphology / syntax", "Semantics / pragmatics"], items: [["Adding \"un-\" to a word", 0], ["Word order in a sentence", 0], ["Which sounds are meaningful", 0], ["What a word means", 1], ["Knowing when a joke is appropriate", 1], ["How to tell a story in a culturally expected way", 1]] }] },
    { h: "Key terms 1 and 2: multifunctionality and language ideologies",
      html: `<p><b>Multifunctionality</b>: language does many jobs at once. <strong>Jakobson</strong> linked six factors of a speech event to six functions:</p>
<ul><li>speaker → <b>expressive</b></li><li>addressee → <b>conative</b></li><li>context → <b>referential</b> (information: just one of six!)</li><li>message → <b>poetic</b></li><li>contact → <b>phatic</b></li><li>code → <b>metalinguistic</b></li></ul>
<p><b>Language ideologies</b> are beliefs about language and its speakers (\"French is romantic,\" \"people who say <i>ain't</i> are ignorant\"). Kroskrity's four features: they <strong>serve group interests</strong>, are <strong>multiple</strong>, people are <strong>more or less aware</strong> of them, and they <strong>mediate</strong> between social structures and talk.</p>`,
      qs: ["C0128", "C0129", "C0130", "C0131", "C0133", "C0134", "C0136"],
      play: [{ t: "match", title: "Jakobson's six functions", pairs: [["Speaker", "Expressive"], ["Addressee", "Conative"], ["Context", "Referential"], ["Message", "Poetic"], ["Contact", "Phatic"], ["Code", "Metalinguistic"]] }] },
    { h: "Key terms 3 and 4: practice and indexicality",
      html: `<p><b>Practice theory</b>: structures constrain actions, and actions recreate or transform structures. Bourdieu's <b>habitus</b> is our socialized set of predispositions; Ortner calls people <strong>\"loosely structured\"</strong>. Language and culture are <b>emergent</b>: more than the sum of their parts.</p>
<p><b>Indexicality</b> comes from Peirce's semiotics. Peirce's sign has three parts (sign, object, <b>interpretant</b>), and there are three kinds of sign:</p>
<ul><li><b>Icon</b>: resemblance (a photo, \"meow\").</li><li><b>Index</b>: contiguity, \"pointing\" (smoke → fire; \"here,\" \"you\").</li><li><b>Symbol</b>: convention (\"bird\").</li></ul>
<p>An accent points to origins without referring to them: <b>nonreferential indexicality</b>. When a way of speaking gets tied to a group, that is <b>enregisterment</b>.</p>`,
      qs: ["C0138", "C0139", "C0140", "C0143", "C0144", "C0145", "C0147", "C0148"],
      play: [{ t: "sort", title: "Icon, index or symbol?", bins: ["Icon", "Index", "Symbol"], items: [["A photograph", 0], ["\"Choo choo\"", 0], ["Smoke means fire", 1], ["The word \"here\"", 1], ["A Southern accent", 1], ["The word \"bird\"", 2], ["A red light means stop", 2]] }] },
    { h: "Reading: Rickford & King, \"Language and Linguistics on Trial\"",
      html: `<p><strong>Rachel Jeantel</strong> was the prosecution's star witness in the 2013 trial of George Zimmerman for killing Trayvon Martin. She spoke <b>AAVE</b>. Juror B37 found her \"hard to understand\" and \"not credible,\" and her testimony played <strong>no role</strong> in deliberations.</p>
<ul><li>Her speech is <strong>systematic AAVE</strong> with Caribbean influence: stressed <strong>BIN</strong> (\"I BIN knew\"), habitual <strong>be</strong>, copula absence, consonant cluster reduction.</li>
<li>Courts give interpreters only for \"languages,\" not \"dialects.\" Aboriginal English \"half moon\" and Jamaican \"mi drap a groun\" → \"I drop the gun\" show the danger.</li>
<li>Non-AAVE listeners understood habitual be and BIN only <strong>10%</strong> of the time.</li></ul>
<p>Following <strong>Saussure</strong>, linguists must dispel prejudices: linguistics itself is on trial.</p>`,
      qs: ["RD0", "RD1", "RD2", "RD3", "RD4", "RD7", "RD9", "RD10"] }
  ]
},
{
  id: "gesture", topic: "Gesture, sign & multimodality", title: "Gestures, sign languages and multimodality", ch: "Ch 2",
  intro: "Talk almost never comes as a disembodied voice. Meaning is made through many channels at once: speech, gesture, gaze, posture, writing, images, whistles, song. This chapter gives you the tools to analyze all of them together.",
  sections: [
    { h: "Many channels, many voices",
      html: `<p><b>Multimodality</b> means participants co-construct meaning through many modes: speech, gestures, gaze, writing, images, objects. In the \"#Hashtag\" skit, the joke is moving a feature of social media into face-to-face talk.</p>
<p>Two theorists help:</p>
<ul><li><strong>Bakhtin</strong>: <b>heteroglossia</b> (the many socially tinged ways of speaking in a society) and <b>double-voiced discourse</b>, where you embed someone else's voice in your own through quotation, parody or tone.</li>
<li><strong>Goffman</strong>: the speaker splits into the <b>animator</b> (voice box), the <b>author</b> (who composed the words) and the <b>principal</b> (whose views are expressed). Hearers can be ratified addressees or unratified overhearers and eavesdroppers. Changes in alignment are shifts in <b>footing</b>.</li></ul>`,
      qs: ["C020", "C022", "C023", "C024", "C025", "C026", "C028"],
      play: [{ t: "match", title: "Goffman's speaker roles", pairs: [["Animator", "the voice box"], ["Author", "composed the words"], ["Principal", "stands behind the opinions"], ["Eavesdropper", "unratified hearer"]] }] },
    { h: "Talk-in-interaction: Conversation Analysis",
      html: `<p><b>Conversation Analysis (CA)</b>, from Schegloff, Sacks and Jefferson, studies talk moment by moment. Each utterance is the context for the next.</p>
<ul><li><b>Turn-taking</b>: we switch turns with \"no gaps, no overlaps\" by reading pauses and <strong>prosody</strong>.</li>
<li><b>Adjacency pairs</b>: two utterances by two speakers (\"How are you?\" / \"Fine\"; offer / acceptance). Some responses are <strong>preferred</strong>, others <strong>dispreferred</strong>.</li></ul>
<p>Duranti's criticisms of CA-only research: it ignores <strong>larger context</strong>, its transcripts leave out <strong>nonverbal</strong> features, and it ignores what speakers say about their <strong>own</strong> talk. Linguistic anthropologists use CA as one method among many.</p>`,
      qs: ["C0210", "C0211", "C0212", "C0213", "C0215", "C0216"] },
    { h: "Gesture and embodied communication",
      html: `<p>McNeill's gesture types:</p>
<ul><li><b>Iconics</b> resemble what is said (tracing a tree). <b>Emblems</b> are conventional stand-alone gestures (thumbs-up).</li>
<li><b>Metaphorics</b> show abstract ideas (a cupped hand for a question).</li>
<li><b>Deictics</b> point.</li>
<li><b>Beats</b> mark emphasis with no meaning of their own.</li></ul>
<p>Streeck treats gesture as a <strong>family of practices</strong>, not a code. Okada's boxer and coach build a <b>joint attentional frame</b>.</p>
<p>When words and bodies disagree, Sicoli calls it <b>intermodal discord</b> (a preschooler sulking while complying; Zapotec hosts and the dishes). Tulbert and Goodwin's toothbrushing study contrasts <b>conjoined directives</b> (words and actions align) with <b>disjunctive directives</b> (they don't).</p>`,
      qs: ["C0218", "C0219", "C0220", "C0221", "C0222", "C0225", "C0227", "C0228"],
      play: [{ t: "sort", title: "Which kind of gesture?", bins: ["Iconic / emblem", "Metaphoric", "Deictic", "Beat"], items: [["Tracing a tree's shape", 0], ["Thumbs-up", 0], ["Cupped hand for \"a question\"", 1], ["Pointing at the door", 2], ["Pounding the table on each point", 3]] }] },
    { h: "Sign languages: four myths",
      html: `<ul><li><strong>Myth 1: they aren't real languages.</strong> False (Stokoe). In place of phonemes, ASL uses five parameters: <strong>handshape</strong>, <strong>location</strong>, <strong>movement</strong>, <strong>palm orientation</strong> and <b>non-manual markers</b> like facial expression.</li>
<li><strong>Myth 2: they're basically iconic.</strong> Some signs are iconic, but most combine iconic and conventional aspects, like spoken onomatopoeia.</li>
<li><strong>Myth 3: there's one universal sign language.</strong> There are hundreds; ASL is closer to <strong>French</strong> Sign Language than to British.</li>
<li><strong>Myth 4: there's no culture attached.</strong> About 90% of deaf people have hearing parents and learn to sign at school, where <b>Deaf culture</b> (capital D) took shape.</li></ul>
<p>New sign languages like <b>Nicaraguan Sign Language</b> and the <strong>Al Sayyid Bedouin</strong> village sign language let researchers watch languages emerge.</p>`,
      qs: ["C0229", "C0230", "C0231", "C0232", "C0233", "C0234", "C0235"],
      play: [{ t: "flip", title: "Myth or fact?", cards: [["Sign languages are pidgins with no grammar.", "Myth. They have every component of language."], ["ASL is closest to British Sign Language.", "Myth. It's closest to French Sign Language."], ["Most deaf children have hearing parents.", "Fact. About 90%."], ["\"Deaf\" with a capital D indexes a cultural identity.", "Fact."]] }] },
    { h: "Poetry, whistles, song, images, and media ideologies",
      html: `<ul><li><b>Ethnopoetics</b> (Hymes, Tedlock, Webster) finds poetic patterning in all discourse. Webster shows young Navajos' \"intimate grammars\" becoming icons of identity.</li>
<li><b>Whistled languages</b> (Silbo Gomero, Sochiapam Chinantec) are based on spoken languages and are endangered.</li>
<li><strong>Song</strong> can restore solidarity (Oxbury's three sisters).</li>
<li><strong>Images</strong>: Central Australian <strong>sand stories</strong> weave speech, sign, gesture and drawing.</li></ul>
<p>The channel itself is a message. Gershon's breakup study shows people hold <b>media ideologies</b>: \"It's over\" by text means something different from the same words in person.</p>`,
      qs: ["C0237", "C0238", "C0239", "C0241"] }
  ]
},
{
  id: "methods", topic: "Doing research", title: "How linguistic anthropologists do research", ch: "Ch 3 · García-Sánchez",
  intro: "How do you actually study language as social action? This chapter walks through the research process: questions, data, methods, analysis and ethics, with García-Sánchez's fieldwork among Moroccan immigrant children in Spain as a worked example.",
  sections: [
    { h: "Questions and kinds of data",
      html: `<p>Research in this field asks how language <strong>reflects and shapes social life</strong> in real settings. Questions often change in the field: <b>grounded theory</b>.</p>
<p>Data can be <b>quantitative</b> (counted: survey answers, pause lengths) or <b>qualitative</b> (in-depth understanding, often from participants' viewpoints). Most researchers <b>triangulate</b>: they combine methods for a fuller picture.</p>`,
      qs: ["C030", "C031", "C032", "C033"] },
    { h: "The toolkit",
      html: `<ul><li><b>Participant observation</b>: months or years living in a community, learning the language, writing <b>fieldnotes</b>. Most consider it essential.</li>
<li><strong>Interviews</strong>: structured, <strong>semi-structured</strong> or open-ended. Briggs warns they're not windows onto \"the facts\": the interviewer co-produces the talk, and researchers must <strong>learn how to ask</strong>.</li>
<li><strong>Naturally occurring conversations</strong>, recorded and transcribed (about <strong>6 hours per hour</strong>). Transcripts are never neutral.</li>
<li><strong>Experiments</strong>, e.g., Levinson's rotation task on spatial language.</li>
<li><b>Matched guise tests</b>: the same speakers read in two varieties; listeners rate the \"different\" voices, revealing <strong>unconscious ideologies</strong>. In Ciscel's Moldova study, rural mixed Romanian/Moldovan was rated lowest.</li>
<li><strong>Written texts</strong> and the <b>linguistic landscape</b>.</li></ul>`,
      qs: ["C034", "C036", "C037", "C038", "C0311", "C0313", "C0314", "C0315"],
      play: [{ t: "match", title: "Match the method", pairs: [["Participant observation", "living in the community for months"], ["Matched guise test", "one reader, two varieties, rated by listeners"], ["Semi-structured interview", "topic list, no fixed order"], ["Linguistic landscape", "signs and billboards as data"]] }] },
    { h: "Interpretation: the jabarjasti lesson",
      html: `<p>All research involves <strong>interpretation</strong>, from forming the question to analyzing data.</p>
<p>In Junigau, Ahearn surveyed marriages as either \"arranged\" or \"self-initiated.\" People kept saying something she heard as \"just like <i>jabar</i>.\" It was <b>jabarjasti</b>: <strong>capture marriage</strong>, a stigmatized third type she hadn't known about. Her categories had distorted every answer, and she had to start over.</p>`,
      qs: ["C0317", "C0318"] },
    { h: "Ethics",
      html: `<p>The <strong>AAA</strong>'s first rule is <strong>do no harm</strong>, which can override the goal of new knowledge. <b>Informed consent</b> is simple for one questionnaire but must be <strong>ongoing</strong> in long-term fieldwork.</p>
<p>Other hard questions: fair pay for assistants, reciprocity, obligations as fictive kin, <b>studying up</b> (Nader) among the powerful, and what to do about morally repugnant behavior. Research is \"partial\" both ways: <strong>incomplete and biased</strong>.</p>`,
      qs: ["C0320", "C0321", "C0322", "C0324"] },
    { h: "A worked example: García-Sánchez in Vallenuevo",
      html: `<p>García-Sánchez spent 16 months with <strong>Moroccan immigrant children</strong> in Vallenuevo, Spain, in the school, the oratory-mosque, homes, peer groups, the health center and the track team.</p>
<ul><li>She carried her gear everywhere so people would get used to it. Kids asked, \"<i>¿Eres de la tele?</i>\"</li>
<li>She observed for two months before filming; teachers found the camera <strong>less</strong> worrying than silent note-taking.</li>
<li>Children acted as <b>language brokers</b> at the health center.</li>
<li>Formal interviews made parents stiff, so she switched to informal talk. With children she used <b>person-centered interviews</b> and <b>lifemaps</b>.</li>
<li>In peer groups she was \"an invisible ghost\" and never intervened.</li></ul>`,
      qs: ["RD12", "RD15", "RD17", "RD19", "RD21", "RD22"] }
  ]
},
{
  id: "socialization", topic: "Acquisition & socialization", title: "Learning language, becoming a member", ch: "Ch 4 · Paugh · Lecture slides",
  intro: "Every typically developing child learns to talk by about age three, but how they are talked to, and what they learn along with the grammar, varies enormously. \"Language is a great force of socialization, probably the greatest that exists\" (Sapir).",
  sections: [
    { h: "Katie and Bage: two ways to talk to a baby",
      html: `<p><strong>Katie</strong> (white, middle-class, US) sits on her mother's knees face to face. Her mother uses <b>baby talk</b> and treats every gurgle as a turn. Ochs and Schieffelin call this <b>self-lowering</b> (simplifying, asking known-answer questions) and <b>child-raising</b> (treating the child as more competent than she is). The situation adapts to the child.</p>
<p><strong>Bage</strong> (Kaluli, Papua New Guinea) faces <strong>outward</strong> toward the household. His mother doesn't talk to him directly. She <strong>speaks for him</strong> to his older brother in a triadic exchange, assertively. The child adapts to the group.</p>
<p>Lesson: baby talk is <strong>not universal</strong> and not necessary.</p>`,
      qs: ["C040", "C041", "C042", "C043", "C044"],
      play: [{ t: "sort", title: "Katie or Bage?", bins: ["Katie (US middle class)", "Bage (Kaluli)"], items: [["Face-to-face \"conversation\"", 0], ["Baby talk", 0], ["Known-answer questions", 0], ["Held facing outward", 1], ["Mother speaks for the infant", 1], ["Triadic exchange with a sibling", 1]] }] },
    { h: "Innate, but how? Chomsky vs. socialization",
      html: `<p><strong>Chomsky</strong>: language \"happens to\" the child. A <b>language acquisition device</b> with <b>Universal Grammar</b> makes up for the <b>poverty of the stimulus</b>; a few examples set <strong>parameters</strong>.</p>
<p>Critics like <strong>Bates and MacWhinney</strong>: language is \"a new machine built out of old parts,\" general cognition, and the input isn't so poor.</p>
<p><b>Language socialization</b> (Ochs and Schieffelin) holds that acquiring language and becoming a competent member of society are <strong>one process</strong>. Evidence:</p>
<ul><li>Samoan children learn the <b>ergative</b> marker late because adults use it less in intimate talk.</li>
<li>They rarely say \"come\" though they hear it often: it's not for low-status speakers.</li>
<li>Demuth's <strong>Sesotho</strong> toddlers use relative clauses early in rough peer groups.</li></ul>`,
      qs: ["C045", "C046", "C047", "C049", "C0410", "C0411", "C0412", "C0413"] },
    { h: "Gaps in the \"language gap\"",
      html: `<p>Programs like <strong>Providence Talks</strong> and <strong>Thirty Million Words</strong> rely on Hart and Risley's claimed <strong>30-million-word gap</strong> between low- and high-income children, and coach \"teacherly\" talk with word pedometers.</p>
<p>Linguistic anthropologists push back:</p>
<ul><li>\"Gaps\" and \"deficits\" are <b>language ideologies</b>, like the verbal deprivation hypothesis <strong>Labov</strong> disproved.</li>
<li><strong>Blum</strong>: known-answer quizzing teaches kids to wait passively for approval.</li>
<li><strong>Heath</strong>: talk alone won't help without economic and healthcare change.</li>
<li><strong>Alim and Paris</strong>: children of color's linguistic <strong>flexibility</strong> is an asset.</li></ul>`,
      qs: ["C0414", "C0415", "C0416", "C0417", "C0418", "C0419", "LS2"] },
    { h: "Two languages in one village: Gapun",
      html: `<p>Bilingualism has <strong>cognitive advantages</strong>, but exposure alone doesn't guarantee it.</p>
<p>In <strong>Gapun</strong> (Kulick), two old concepts shifted meaning:</p>
<ul><li><b>Hed</b>: the selfish, proud self, linked to women, children, and now <strong>Taiap</strong>, paganism and backwardness.</li>
<li><b>Save</b>: knowledge, the cooperative self, linked to men, adults, and now <strong>Tok Pisin</strong>, Christianity and modernity.</li></ul>
<p>Parents switched to Tok Pisin to get attention and heard all speech after a few early \"Taiap words\" as Tok Pisin. Then they blamed their <strong>\"bikhed\"</strong> children. Kulick draws on <strong>Sahlins</strong>: trying to reproduce a culture under new conditions can transform it.</p>`,
      qs: ["C0420", "C0421", "C0422", "C0423", "C0424", "C0425", "C0426"],
      play: [{ t: "sort", title: "Hed or save?", bins: ["Hed", "Save"], items: [["Taiap", 0], ["Selfish and proud", 0], ["Backwardness", 0], ["Tok Pisin", 1], ["Christianity", 1], ["Cooperation", 1], ["Modernity", 1]] }] },
    { h: "Socialization never stops",
      html: `<p>Every new group means new ways of speaking:</p>
<ul><li><strong>Wortham</strong>: a ninth grader's <strong>trajectory of socialization</strong> goes from model student to disruptor.</li>
<li><strong>Fader</strong>: Hasidic girls in Brooklyn end up speaking more English, boys more Yiddish, and girls learn modesty through talk and \"bride class.\"</li>
<li><strong>Mertz</strong>: law students learn to \"think like lawyers\" through Socratic exchanges, voicing positions as <strong>animators</strong> and stripping out moral context.</li>
<li><strong>Jacobs-Huey</strong>: Black hair stylists become \"hair doctors\" with scientific-sounding terms.</li></ul>`,
      qs: ["C0427", "C0428", "C0429", "C0430", "C0431", "C0432", "C0433"] },
    { h: "Reading: Paugh on imaginary play in Dominica",
      html: `<p>Dominica is shifting from <b>Patwa</b> (an Afro-French creole) to English. English indexes <strong>higher scales</strong> (school, government); Patwa lower ones (rural, oral, informal). Adults ban children's Patwa but use it for gossip, jokes, curses and scoldings. Patwa is <b>enregistered</b> as an <strong>adult</strong> language.</p>
<p>Out in the yard, away from adults, children play:</p>
<ul><li><strong>School</strong>, in English, led by Marcel: orderly, enclosed, hard to sustain.</li>
<li>A <strong>pig hunt</strong>, in Patwa, led by Junior: wild, exciting, eagerly joined.</li></ul>
<p>The children <strong>rescale</strong> Patwa into a power code, socialize each other into it, and also reproduce gender lines: Sherona gets stuck as \"mother.\"</p>`,
      qs: ["RD24", "RD25", "RD27", "RD29", "RD30", "RD33", "RD34"],
      play: [{ t: "sort", title: "English or Patwa in Dominica?", bins: ["English", "Patwa"], items: [["Playing school", 0], ["Government and courts", 0], ["Mother and teacher roles", 0], ["The pig hunt", 1], ["Cursing and teasing", 1], ["Farming and the bush", 1]] }] }
  ]
},
{
  id: "thought", topic: "Language, thought & culture", title: "Language, thought and culture", ch: "Ch 5 · DeGraff",
  intro: "Would you think differently if you'd been raised speaking another language? Linguistic anthropologists say language, thought and culture shape one another, but not in the simple way pop culture imagines. And beliefs about which languages are \"real\" have real consequences.",
  sections: [
    { h: "Boas, Sapir, Whorf",
      html: `<ul><li><strong>Boas</strong> fought claims of \"primitive\" languages: all languages are equally complex, and language mostly <strong>reflects</strong> habitual culture.</li>
<li><strong>Sapir</strong> wrote of the \"tyrannical hold\" of linguistic form, yet said any language can express whatever its speakers need.</li>
<li><strong>Whorf</strong> coined <b>linguistic relativity</b> (after Einstein). He contrasted Hopi's process-like \"eventing\" with <b>Standard Average European</b> languages that count time into units, fitting a culture of schedules and record-keeping.</li></ul>
<p>Today's consensus: influence is <strong>predispositional, not deterministic</strong>, and it runs all three ways between language, thought and culture.</p>`,
      qs: ["C050", "C051", "C052", "C053", "C054"] },
    { h: "The \"Sapir–Whorf Hypothesis\" and what's wrong with it",
      html: `<p>Outside anthropology, the label usually means a <strong>strong version</strong>: language determines thought, one way, with culture left out. Like the film <i>Arrival</i>.</p>
<p>It's a misnomer: Sapir and Whorf never co-wrote anything or framed a hypothesis. Hill and Mannheim treat the mutual influence as an <b>axiom</b>, judged by the questions it opens. Others, like John Lucy, test specific effects at three levels: <strong>language-in-general</strong>, <strong>linguistic structures</strong> and <strong>language use</strong>.</p>`,
      qs: ["C055", "C056", "C057", "C058", "C059"],
      play: [{ t: "sort", title: "Strong version or Ahearn's view?", bins: ["Mistaken \"strong\" version", "Linguistic anthropology today"], items: [["Language determines thought", 0], ["Influence runs one way", 0], ["Culture left out", 0], ["Language predisposes but doesn't trap", 1], ["Language, thought, culture shape each other", 1], ["Treat it as an axiom or test specific effects", 1]] }] },
    { h: "Language-in-general: sounds and theory of mind",
      html: `<p>Babies can hear every language's sound contrasts but start losing them by about <strong>six months</strong>.</p>
<p><b>Theory of mind</b> is reading others' beliefs, tested with the <strong>Sally–Anne false-belief task</strong>. Under-fours say Sally will look where the marble <em>is</em>, not where she left it.</p>
<p>Deaf children of non-signing hearing parents are delayed <strong>years</strong>, even on nonverbal versions. Children with sign from birth aren't. Language at three predicts false-belief success at four, not the reverse.</p>`,
      qs: ["C0510", "C0511", "C0512", "C0513", "C0514"] },
    { h: "Structures: words, color, space, time",
      html: `<p>Not single words: lacking a word doesn't stop a thought. English has no words for Nepali <i>dhān</i>, <i>chāmal</i>, <i>bhāt</i>. The \"Eskimo snow words\" are a myth: at most <strong>two roots</strong>.</p>
<p>Look at <b>semantic domains</b> and <b>grammatical categories</b>, which are habitual, obligatory and unconscious.</p>
<ul><li><strong>Color:</strong> Berlin and Kay found universal foci and a sequence (black/white → red → …). But Tarahumara (one green-blue word) vs. English and Russian's two blues show that terms affect perception at the borders.</li>
<li><strong>Space:</strong> <b>relative</b> (left/right) vs. <b>absolute</b> (north/uphill) frames. Guugu Yimithirr and Tzeltal speakers keep a mental compass, and Levinson's rotation task shows it.</li>
<li><strong>Time:</strong> Mandarin \"up\" = earlier; Kuuk Thaayorre lays time east to west.</li></ul>`,
      qs: ["C0515", "C0516", "C0517", "C0519", "C0521", "C0523", "C0524", "C0526", "C0528"],
      play: [{ t: "match", title: "Who found what?", pairs: [["Berlin and Kay", "universal color foci"], ["Kay and Kempton", "Tarahumara blue-green"], ["Levinson", "absolute vs. relative space"], ["Laura Martin", "debunked the snow-words myth"], ["De Villiers", "deaf children and false belief"]] }] },
    { h: "Use: literacy, metaphor, discourse",
      html: `<ul><li>Goody and Watt's \"<strong>cognitive divide</strong>\" for literacy didn't hold: Scribner and Cole found the Vai's three <b>literacies</b> brought only localized skills.</li>
<li><b>Metaphors</b> frame thinking: ARGUMENT IS WAR (Lakoff and Johnson). Crime as a \"virus\" vs. a \"beast\" changes proposed solutions.</li>
<li><strong>Cohn</strong> learned the \"technostrategic\" talk of nuclear strategists and found she could barely <em>think</em> her anti-nuclear views. <strong>Harding</strong> heard a preacher's voice in her own head after a near-crash.</li></ul>
<p>Going the other direction, Everett claims Pirahã <strong>culture constrains grammar</strong>, a controversial claim.</p>`,
      qs: ["C0529", "C0531", "C0532", "C0534", "C0535", "C0536"] },
    { h: "Reading: DeGraff on Creole Exceptionalism",
      html: `<p>When a Miami school taught in <b>Haitian Creole</b>, letters called it \"broken French\" and \"slave lingo.\" DeGraff, a native speaker and linguist, says linguistics itself manufactured these beliefs, which he calls <b>Creole Exceptionalism</b>. Its three tropes:</p>
<ol><li><strong>Degenerate</strong>: \"broken\" European languages (Bloomfield).</li>
<li><strong>Hybrid</strong>: African grammar with European words (relexification). But English is ~65% non-Germanic, and Haitian Creole over 90% French.</li>
<li><strong>Break in transmission</strong>: pidgin to Creole as a \"linguistic fossil\" (Bickerton). But Creole affixes like <i>-te</i> in <i>bèlte</i> (\"beauty\") come from French, and English changed just as much since Chaucer.</li></ol>
<p>His answer is a <b>Cartesian-Uniformitarian</b> view: every mind, every language is normal. French-only schooling in Haiti amounts to <b>linguistic apartheid</b>.</p>`,
      qs: ["RD36", "RD38", "RD40", "RD41", "RD42", "RD43", "RD44", "RD47", "RD48"],
      play: [{ t: "match", title: "Three tropes, three answers", pairs: [["\"Broken French\"", "Creole has full, rule-governed grammar"], ["African grammar + French words", "English is more mixed than Haitian Creole"], ["Pidgin \"break\" = linguistic fossil", "Creole affixes descend from French; English changed as much"]] }] }
  ]
},
{
  id: "multilingual", topic: "Multilingualism & communities", title: "Communities of multilingual speakers", ch: "Ch 6 · Wiel",
  intro: "Who counts as a community of language users? How do people move between languages, dialects and registers, and who decides which ones are allowed? This chapter questions the idea of a \"speech community\" and explores multilingualism around the world.",
  sections: [
    { h: "Defining a \"speech community\"",
      html: `<p>It's hard to say how big a speech community is, what members share, and how they interact.</p>
<ul><li><strong>Gumperz</strong>: frequent interaction, a shared <b>verbal repertoire</b> (not necessarily one language), and shared norms (language ideologies).</li>
<li><strong>Hymes</strong>: the speech community, not the language, is the natural unit of study.</li>
<li><strong>Labov</strong>: New Yorkers pronounced \"r\" differently but shared the same <strong>evaluations</strong>.</li>
<li><strong>Spitulnik</strong>: in multilingual Zambia, <strong>radio</strong> creates shared reference points.</li></ul>
<p><strong>Bucholtz</strong> criticizes the concept for stressing consensus, central members and static identity.</p>`,
      qs: ["C060", "C061", "C063", "C064", "C066"] },
    { h: "Alternatives: speech areas, networks, communities of practice",
      html: `<ul><li><b>Speech area</b> (Jackson): in the Vaupés, everyone speaks 3+ languages and must marry outside their language group (<b>linguistic exogamy</b>), but all share rules for speaking.</li>
<li><b>Speech networks</b> (Milroy): ties can be <strong>strong or weak</strong>, <strong>multiplex or uniplex</strong>, <strong>high- or low-density</strong>. Close-knit networks preserve dialects.</li>
<li><b>Community of practice</b> (Lave and Wenger; Eckert and McConnell-Ginet): <strong>mutual engagement, a joint enterprise, a shared repertoire</strong>. Belten High's <strong>Jocks</strong> and <strong>Burnouts</strong>; Bucholtz's <strong>nerds</strong> with negative and positive identity practices.</li></ul>`,
      qs: ["C067", "C069", "C0610", "C0613", "C0614", "C0615", "C0616"],
      play: [{ t: "match", title: "Match the concept", pairs: [["Speech area", "Vaupés: shared rules, many languages"], ["Speech network", "strong/weak, dense/loose ties"], ["Community of practice", "mutual engagement in a joint enterprise"], ["Speech community", "frequent interaction + shared norms"]] }] },
    { h: "Multilingualism is normal",
      html: `<p>Perhaps <strong>half the world</strong> is multilingual; monolingualism often comes from speaking a \"big\" language (Edwards).</p>
<p>What counts as a language is political: \"a language is a <strong>dialect with an army and a navy</strong>.\" Swedish and Norwegian are mutually intelligible yet \"separate\"; Cantonese and Mandarin aren't, yet are \"dialects.\" <strong>Everyone</strong> speaks a dialect. <b>Registers</b> (\"geek speak,\" \"God talk\") are tied to social practices.</p>
<p>In the US about <strong>21%</strong> speak another language at home, but by the third generation most speak only English. India shows diversity is compatible with unity. The \"<strong>one nation, one language</strong>\" ideology goes back to Herder.</p>`,
      qs: ["C0619", "C0620", "C0621", "C0622", "C0623", "C0626", "C0627", "C0628", "C0629"] },
    { h: "Diglossia, code-switching, code-mixing, heteroglossia",
      html: `<ul><li><b>Diglossia</b>: a stable H/L split by domain (official vs. home).</li>
<li><b>Code-switching</b>: two varieties in one exchange. Don Gabriel's Mexicano vs. Spanish indexed reciprocity vs. profit (Hill). Urciuoli's boundaries were fuzzy among equals, rigid with authorities.</li>
<li><b>Code-mixing</b>: \"bokne-ing the firewood.\" <strong>Auer's continuum</strong>: code-switching → language mixing → <b>fused lects</b>. Ukraine's <i>surzhyk</i> spans it.</li>
<li><b>Heteroglossia</b> (Bakhtin): <strong>centripetal</strong> forces standardize, <strong>centrifugal</strong> forces diversify. No word is neutral.</li></ul>`,
      qs: ["C0630", "C0631", "C0632", "C0633", "C0634", "C0635", "C0638"],
      play: [{ t: "sort", title: "Which practice?", bins: ["Diglossia", "Code-switching", "Code-mixing / fused lect"], items: [["Classical Arabic at the mosque, colloquial at home", 0], ["H variety for school, L for family", 0], ["Switching to Spanish to quote a businessman", 1], ["Changing languages mid-conversation for effect", 1], ["\"bokne-ing the firewood\"", 2], ["Surzhyk", 2]] }] },
    { h: "Reading: Wiel on schools in Aruba and Curaçao",
      html: `<p>Students on these islands live with <strong>\"The Four Languages\"</strong>: <b>Papiamentu</b> (a creole), Dutch, English and Spanish. But schools put <strong>Dutch</strong> first because exams come from the Netherlands.</p>
<ul><li>Yufrou Tjon tells students \"<i>praat Nederlands</i>\": <b>linguistic gatekeeping</b>. She relents only when Bethaliza tearfully asks to use Papiamentu.</li>
<li>In a GoPro-recorded study session, Shanuska explains physics in Papiamentu with Dutch technical terms and an English \"whatever!\": <b>translanguaging</b> across her full <b>linguistic repertoire</b>.</li>
<li>In Aruba's Drink Studies class, <strong>students</strong> open the gate to Papiamentu and English, since their tourism jobs need English.</li></ul>
<p>The Dutch-first hierarchy is a colonial legacy that gatekeeps success.</p>`,
      qs: ["RD49", "RD51", "RD52", "RD53", "RD56", "RD59"] }
  ]
},
{
  id: "literacy", topic: "Literacy & online language", title: "Literacies, online and off", ch: "Ch 7 · Ch 8 · Phyak",
  intro: "Reading and writing saturate daily life, and they are never neutral skills. This chapter covers how linguistic anthropologists study literacy as social practice, and how people build communities, identities and ideologies online.",
  sections: [
    { h: "Events, practices, and two models",
      html: `<p>Most interactions today are <strong>textually mediated</strong>, and orality and literacy are intertwined. Gee: \"the ability to read and write\" hides how literacy relates to <strong>power</strong>.</p>
<ul><li>A <b>literacy event</b> (Heath) is an observable occasion where writing is integral.</li>
<li><b>Literacy practices</b> are the general cultural ways of using writing.</li></ul>
<p>The <b>autonomous model</b> (Goody, Ong) treats literacy as a neutral technology with universal effects, a \"Great Divide.\" The <b>ideological model</b> (Street, Besnier, Barton) studies specific <b>literacies</b> in context. Most linguistic anthropologists take the second.</p>`,
      qs: ["C071", "C073", "C074", "C075", "C077", "C078", "C079"],
      play: [{ t: "sort", title: "Autonomous or ideological?", bins: ["Autonomous model", "Ideological model"], items: [["Literacy has the same effects everywhere", 0], ["A Great Divide between oral and literate", 0], ["\"Without writing, consciousness can't reach its potential\"", 0], ["Many literacies, not one", 1], ["Literacy is tied to power and institutions", 1], ["Study literacy in its social context", 1]] }] },
    { h: "What no bedtime story means",
      html: `<p>Heath compared three Carolina communities:</p>
<ul><li><strong>Maintown</strong> (white middle class): bedtime stories, questions, fiction, books with authority. Ready for school.</li>
<li><strong>Roadville</strong> (white working class): ABCs, labels, workbooks; fiction is a \"lie.\" Good at first, then fall behind by <strong>fourth grade</strong>.</li>
<li><strong>Trackton</strong> (Black working class): a rich, entirely <strong>oral</strong> world of stories and wordplay, but school-style book questions are unfamiliar.</li></ul>
<p>Lesson: there are <strong>many literacies</strong>, and schools reward only one.</p>`,
      qs: ["C0710", "C0711", "C0712", "C0713", "C0714"],
      play: [{ t: "match", title: "Heath's three communities", pairs: [["Maintown", "bedtime stories and fiction"], ["Roadville", "labels, workbooks, \"fiction is a lie\""], ["Trackton", "rich oral storytelling, no children's books"]] }] },
    { h: "Letters in Nepal and \"be + like\" in IM",
      html: `<ul><li><strong>Pema Kumari</strong> wrote her father a letter threatening jail if he forced her arranged marriage. It didn't stop the wedding, but it transformed a practice of token resistance. Widowed, she went back to school and now lives independently.</li>
<li>In 1990s Junigau, newly literate women wrote <strong>love letters</strong> that led to elopements. Writing them marked people as \"developed.\" But eloped women had no parental support if things went badly. Since 2009, phones have replaced letters.</li>
<li><strong>Jones and Schieffelin</strong>: IM grew more speech-like from 2003 to 2006. \"<b>Be + like</b>\" went from 6% to 50% of IM quotatives: creativity, not decline.</li></ul>`,
      qs: ["C0715", "C0716", "C0717", "C0718", "C0720", "C0721"] },
    { h: "Online: tone, platforms, selves",
      html: `<p>Language always changes, usually led by <strong>young people and women</strong>, and every change brings ideologies.</p>
<ul><li><b>Typographical tone of voice</b>: ALL CAPS = shouting; a final period = annoyed; ellipses = ominous to the young; ~tildes~ = sarcasm in English. Emojis work like <strong>emblems</strong>.</li>
<li><b>Affordances</b> (what a platform makes likely or hard) and <b>media ideologies</b> (beliefs about media) shape use. Every new technology, from typewriter to phone, caused panic.</li>
<li><strong>Zoom fatigue</strong>: almost face to face, but not quite; context collapse.</li>
<li><b>Animation</b> vs. performance: Ryzom \"alts\"; Nadone's friends co-writing a breakup (many animators, one principal); \"finsta\" vs. \"rinsta.\"</li></ul>`,
      qs: ["C081", "C084", "C086", "C087", "C088", "C0810", "C0811", "C0813", "C0818", "C0819"],
      play: [{ t: "flip", title: "What does it signal?", cards: [["\"we could do that.\"", "Annoyance: the period is pissed."], ["ALL CAPS", "Shouting or extreme emphasis."], ["a ~tragic past~", "Sarcasm (in English)."], ["\"hai~~\" (Japanese)", "Lengthening for cuteness or playfulness."], ["all lowercase", "Often deliberate, against the phone's default."]] }] },
    { h: "Reading: Phyak on language policing on Facebook",
      html: `<p>Phyak studied a Nepali Facebook group debating federalism. <b>Language policing</b> is norm-making by many actors, not just the state. Facebook is an <b>ideospace</b> where ideologies clash.</p>
<p>Nepal has <strong>123 languages</strong>, but a <strong>one-nation-one-language</strong> policy (since 1768) made Nepali the only official one. Online:</p>
<ul><li>RR tells LT, \"u r Nepali,\" so she should write Nepali. LT (a Tamang speaker) defends using English.</li>
<li>PT iconizes English as the language of science and globalization.</li>
<li>Rekh says all of Nepal's languages are \"Nepali.\"</li></ul>
<p>Irvine and Gal's <b>iconization</b>, <b>fractal recursivity</b> and <b>erasure</b> explain how minority voices disappear even in a \"superdiverse\" space. They form <strong>counterpublics</strong>.</p>`,
      qs: ["RD61", "RD62", "RD64", "RD65", "RD66", "RD68", "RD71", "RD73"] }
  ]
},
{
  id: "performance", topic: "Performance & gender", title: "Performance, performativity and gender", ch: "Ch 9 · Ch 10",
  intro: "\"Performance\" means three different things in this field, and one of them, performativity, changed how we think about gender. Then: do women and men really talk differently? The research says the popular answers are mostly myths.",
  sections: [
    { h: "Three meanings of performance",
      html: `<ol><li><strong>Performance vs. competence</strong> (Chomsky): competence or <b>I-language</b> is what matters; performance or E-language is noise. <strong>Hymes</strong> answered with <b>communicative competence</b>: knowing how to <em>use</em> language.</li>
<li><strong>Performativity</strong>: saying is doing (Austin). Later, <strong>Butler</strong>: gender is something we <em>do</em>.</li>
<li><strong>Performance as verbal artistry</strong> (Bauman): taking responsibility to an <strong>audience</strong> for a display of skill.</li></ol>`,
      qs: ["C090", "C091", "C092"] },
    { h: "How to do things with words",
      html: `<p><strong>Austin</strong> split <b>constatives</b> (true/false: \"It's raining\") from <b>performatives</b> (\"I christen this ship…\"). Performatives aren't true or false but <b>felicitous</b> or <b>infelicitous</b>. Then he realized <strong>every utterance does something</strong>, and split acts into:</p>
<ul><li><b>Locution</b>: saying something.</li><li><b>Illocution</b>: the conventional force (warning, promising).</li><li><b>Perlocution</b>: the effect (being persuaded).</li></ul>
<p>Critiques: <strong>Rosaldo</strong>'s Ilongots have no commissives or expressives, since there's no constant inner self to make promises. Speech act theory's context is \"soup in a bowl.\" <strong>Derrida</strong>: meaning slips free of intention.</p>
<p><strong>Butler</strong>: gender has no being apart from the acts that constitute it. <strong>Latour</strong>: stop making groups and you stop having groups.</p>`,
      qs: ["C093", "C094", "C095", "C096", "C097", "C098", "C0910", "C0912", "C0913"],
      play: [{ t: "sort", title: "Locution, illocution or perlocution?", bins: ["Locution", "Illocution", "Perlocution"], items: [["Saying the words \"The dog bites\"", 0], ["Stating a proposition", 0], ["Warning someone", 1], ["Making a promise", 1], ["The listener steps back in fear", 2], ["The friend is persuaded", 2]] }] },
    { h: "Verbal art: keys, frames, emergence",
      html: `<p>Performance is <strong>keyed</strong>: \"Once upon a time,\" special codes, figurative language, parallelism, special prosody, appeals to tradition, even <strong>disclaimers</strong> (\"I'm bad at jokes, but…\"). Audiences are <strong>co-performers</strong>, and performances are <b>emergent</b>.</p>
<ul><li>A magician's \"Splookie\" story performatively shapes what audiences <em>see</em> (Jones and Shweder).</li>
<li>Mexican American men's sexual joking at barbecues is keyed as play: solidarity, critique of oppression, and also patriarchy (Limón).</li>
<li>At Nepal's <strong>Tij</strong> festival, women dance joyfully to heteroglossic songs of hardship, while men encircle them. Ahearn's <b>practice theory of meaning constraint</b> rules out both \"pure resistance\" and \"just letting off steam.\"</li></ul>`,
      qs: ["C0915", "C0917", "C0918", "C0919", "C0920", "C0921", "C0923", "C0924"] },
    { h: "What gender is",
      html: `<p>Sex itself isn't one biological criterion; <strong>intersex</strong> births show the dichotomy is cultural. Gender is <strong>learned</strong>, <strong>collaborative</strong>, something we <strong>do</strong>, and <strong>asymmetrical</strong>. Masculine forms tend to be <b>unmarked</b> (generic \"he\").</p>
<p>Grammar: singular <i>they</i> (since 1300; Word of the Year 2015), Argentine \"-e,\" German <i>das Mädchen</i>. Ochs: gender is mostly indexed <strong>indirectly</strong>. US mothers accommodate to children; Samoan mothers don't. Same practice, different identities.</p>`,
      qs: ["C100", "C101", "C102", "C103", "C104", "C107", "C108"] },
    { h: "Myths vs. research",
      html: `<ul><li><strong>Tannen</strong>'s \"rapport\" vs. \"report\" talk rests on anecdotes. <strong>Hyde</strong>'s meta-analyses: differences are mostly <strong>near zero or small</strong>.</li>
<li><strong>Talkativeness</strong>: the \"20,000 vs. 7,000 words\" claim had no basis. Mehl: about <strong>16,000 words a day each</strong>.</li>
<li><strong>Goodwin</strong>: girls compete, build hierarchies and win the soccer field. <strong>Eckert</strong>: \"cooperative competition\" in girl talk. <strong>Cameron</strong>: college men gossip cooperatively. <strong>Hall</strong>: phone sex operators feel in control.</li>
<li>Cross-culturally: in <strong>Madagascar</b> women are the direct speakers; in Gapun only women do the <i>kros</i>; \"Japanese women's language\" is a Meiji-era construct (<b>indexical inversion</b>, Inoue).</li></ul>
<p>Stereotypes persist because everyone uses them as shortcuts.</p>`,
      qs: ["C109", "C1010", "C1011", "C1014", "C1015", "C1019", "C1021", "C1023", "C1024", "C1026"],
      play: [{ t: "flip", title: "Myth or finding?", cards: [["Women speak 20,000 words a day, men 7,000.", "Myth. Both about 16,000 (Mehl)."], ["Girls are always cooperative.", "Myth. Goodwin's girls compete and build hierarchies."], ["In Madagascar, men are the indirect speakers.", "Finding (Ochs): women are the direct ones."], ["Most gender differences in talk are small.", "Finding (Hyde)."], ["Japanese women's language is ancient.", "Myth. It took shape in the Meiji era (Inoue)."]] }] }
  ]
},
{
  id: "race", topic: "Race & ethnicity", title: "Language, race and ethnicity", ch: "Ch 11 · Zentella · hooks · Smalls & Davis",
  intro: "Race isn't biology, but it is one of the most powerful social facts in the US, and language is central to how it's made. This chapter covers the rule-governed nature of African American English, covert racism in everyday talk, and how people \"do\" racial and ethnic identity.",
  sections: [
    { h: "Race is social, not biological",
      html: `<p>Hill: many white Americans hold a <strong>folk theory</strong> that race is biological and racism is individual hatred. The <strong>AAA</strong>: about <strong>94%</strong> of variation lies <em>within</em> \"races.\" The one-drop rule shows race is social.</p>
<p>Race is a process of <b>racialization</b> or <b>racial formation</b> (Omi and Winant). Franklin's \"swarthy\" Swedes, Irish and Jewish Americans: who's \"white\" changes. In Nepal, activists invented a \"Mongol\" race; the Tharu built one identity without one culture.</p>
<p>Urciuoli: <strong>racial</strong> discourse frames origin as natural; <strong>ethnic</strong> as cultural. <b>Raciolinguistics</b> (Alim): language and race are co-naturalized.</p>`,
      qs: ["C110", "C111", "C112", "C113", "C114", "C116", "C117", "C118"] },
    { h: "AAE is rule-governed",
      html: `<ul><li><b>Habitual be</b>: \"She be happy\" = usually happy. Non-speakers misuse it.</li>
<li><b>Copula deletion</b>: \"He at home,\" like Hebrew <i>hu babayit</i>, following rules like SAE contraction.</li>
<li><b>Double negatives</b>: in Chaucer, Shakespeare and French. Stigmatized only since the 18th century.</li>
<li><b>Final consonant reduction</b>: only when the preceding consonant has the same voicing (<i>lef'</i>, <i>ol'</i>, but not <i>dum'</i>).</li>
<li><strong>\"Aks\"</strong>: centuries old.</li></ul>
<p>Prestige is <b>misrecognition</b> of power. Lippi-Green: the real problem is unwillingness to accept AAE speakers.</p>`,
      qs: ["C119", "C1110", "C1111", "C1112", "C1113", "C1114", "C1115", "C1117"],
      play: [{ t: "match", title: "Match the AAE rule", pairs: [["She be happy", "habitual aspect"], ["He at home", "copula deletion"], ["I don't want nothing", "negative concord"], ["lef', ol'", "same-voicing final stop deletion"], ["aks", "centuries-old variant"]] }] },
    { h: "Covert racism in talk",
      html: `<ul><li><b>Mock Spanish</b> (\"Hasta la vista, baby\") directly indexes a fun, cosmopolitan speaker, and <strong>indirectly</strong> indexes stereotypes of Spanish speakers (Hill). Racism lives in institutions and everyday talk.</li>
<li>Calhoun: King Bach's Vines are <strong>anti-hegemonic</strong> humor that turn the stereotype back on listeners.</li>
<li>Pagliai's barber shop <strong>spiral effect</strong>: agreement escalates racist talk.</li>
<li>Baugh's <b>linguistic profiling</b>: his AAE voice got <strong>under half</strong> the landlord callbacks. Rubin: an Asian face made students \"hear\" an accent.</li></ul>`,
      qs: ["C1118", "C1119", "C1120", "C1122", "C1123", "C1124", "C1125"] },
    { h: "Doing racial and ethnic identity",
      html: `<p>AAE oral traditions: call-and-response, signifying, instigating, <strong>the dozens</strong>. White teens adopt hip-hop speech (Cutler). Asian Americans are racialized as \"model minorities\" or \"forever foreign\"; no ethnic dialect is needed for an ethnic identity. Bucholtz's Laotian American teens: <strong>Nikki</strong> used AAE features; <strong>Ada</strong> spoke SAE with the \"nerds.\"</p>`,
      qs: ["C1126", "C1127", "C1128", "C1129"] },
    { h: "Reading: Zentella on Latina/o (in)security",
      html: `<p>\"<i>Dime con quién hablas, y te diré quién eres</i>\": who you talk with says who you are. In the US, race has been <strong>remapped onto language</strong>, and you're expected to change your speech to earn respect.</p>
<ul><li><b>Linguistic insecurity</b>: Dominicans showed the most and Colombians the least, tracking class and race more than linguistics (final-s deletion).</li>
<li>Covert norms keep home dialects alive for solidarity.</li>
<li>\"Nuyorican,\" \"pocho\" mark supposedly incomplete identities. <b>Spanglish</b> is creative and rule-governed.</li>
<li>\"Linguistically isolated\" households: a discriminatory census label.</li></ul>
<p>Bilingualism is good, but language isn't the fundamental problem: <strong>inequality</strong> is.</p>`,
      qs: ["RD74", "RD76", "RD78", "RD79", "RD81", "RD83", "RD85"] },
    { h: "Reading: hooks, \"Is Paris Burning?\"",
      html: `<p>bell hooks critiques <i>Paris Is Burning</i>, a documentary of Black gay drag balls by a white filmmaker.</p>
<ul><li>The ideal femininity on display is <strong>ruling-class white womanhood</strong>.</li>
<li>Livingston is <strong>absent</strong> from the frame, posing as neutral while her white outsider gaze shapes everything.</li>
<li>The film turns <b>ritual</b> (meaningful ceremony) into <b>spectacle</b> (entertainment). White audiences laughed at pain; Venus Xtravaganza's murder goes unmourned.</li>
<li><strong>Dorian Carey</strong> is the film's real critic: fantasy as play vs. fantasy as escape.</li></ul>`,
      qs: ["RD86", "RD88", "RD90", "RD91", "RD92", "RD94"] },
    { h: "Reading: Smalls & Davis on language and racism",
      html: `<p><strong>Modern race</strong> was built through colonialism and racial slavery. Studies must <strong>mark whiteness</strong> and account for White Supremacy, antiblackness and anti-Indigeneity.</p>
<ul><li><b>Raciolinguistic ideologies</b> (Flores and Rosa): language and race co-naturalized.</li>
<li>Indigenous approaches reject \"salvage\" thinking.</li>
<li><b>Mock language</b> lumps groups together and doesn't care about accuracy.</li></ul>
<p>In <i>World of Warcraft</i>, Tauren speak \"Hollywood Injun English\" and Trolls a mock Jamaican Patois, while Humans speak unmarked SAE. Smalls calls playing these roles <b>body snatching</b>.</p>`,
      qs: ["RD96", "RD99", "RD100", "RD102", "RD104", "RD106"] }
  ]
},
{
  id: "power", topic: "Endangerment, power & agency", title: "Endangerment, power and agency", ch: "Ch 12 · Ch 13 · Perley · Alim",
  intro: "Why do languages die, what's lost, and who gets to \"save\" them? The course ends with the theories of power and agency that run beneath every topic so far, and with youth remaking language through global Hip Hop.",
  sections: [
    { h: "Last speakers and the numbers",
      html: `<p>Chief Marie Smith Jones (<strong>Eyak</strong>) died in 2008: \"How would you feel if your baby died?\" Laura Fish Somersal kept <strong>Wappo</strong> only because she skipped boarding school.</p>
<p>Ethnologue counts about <strong>7,100 languages</strong>; ~200 are spoken by 88% of people. Krauss: only ~<strong>10%</strong> are \"safe.\" Languages no longer learned by children are <b>moribund</b>, and up to half may vanish this century.</p>
<p>Hill warns that <strong>counting</strong> can alienate speakers and echo colonial control.</p>`,
      qs: ["C120", "C121", "C124", "C125", "C127", "C128", "C1210"] },
    { h: "What's lost, and the trouble with metaphors",
      html: `<p>Harrison: lost <strong>ecological knowledge</strong>, <strong>cultural heritage</strong>, and insight into the human mind (Urarina's <b>O-V-S</b> order; Kayardild breaks a \"universal\"). Crystal gives five reasons to care.</p>
<p>Nettle and Romaine link languages to biodiversity. Critics push back:</p>
<ul><li><strong>Muehlmann</strong>: biological metaphors make Indigenous people \"<strong>icons rather than agents</strong>.\"</li>
<li><strong>Cameron</strong>: \"language is the DNA of a culture\" revives Herder's one nation/one language ideology.</li>
<li><strong>Jaffe</strong>: purist Corsican revival shamed mixers until a <b>polynomic</b> view won.</li></ul>`,
      qs: ["C1211", "C1212", "C1213", "C1214", "C1216", "C1217", "C1218"] },
    { h: "Why languages die, and coming back",
      html: `<p>Mostly through <strong>shift</strong>: speakers stop passing a language on, often under an \"ideology of contempt\" or open coercion: the <b>Welsh Not</b>, boarding schools. Dying languages simplify (Dyirbal's four noun classes became two). Loss can be <b>top-down</b> (gone from public use first) or <b>bottom-up</b> (Hebrew kept only in religion).</p>
<p><strong>Hebrew</strong> came back, with Ben-Yehuda coining words. <b>Language nests</b> immerse children. Jessie Little Doe Baird is waking up <strong>Wampanoag</strong>, a \"sleeping language.\"</p>`,
      qs: ["C1220", "C1221", "C1223", "C1224", "C1225", "C1226"],
      play: [{ t: "sort", title: "Top-down or bottom-up loss?", bins: ["Top-down (public use goes first)", "Bottom-up (home use goes first)"], items: [["Manx", 0], ["Wappo", 0], ["Mbabaram", 0], ["Hebrew in the diaspora", 1], ["A language kept only for ritual", 1]] }] },
    { h: "Theories of power",
      html: `<ul><li><b>Hegemony</b> (Williams, after Gramsci): domination through culture and a way of seeing, always renewed and resisted.</li>
<li><strong>Foucault</strong>: power is action upon others' actions; <b>governmentality</b>; <b>Discourse</b> rules some ways of talking in and others out.</li>
<li><strong>Bourdieu</strong>: <b>habitus</b>, <b>bodily hexis</b> (your accent is body technique), <b>doxa</b> (the taken for granted) vs. orthodoxy and heterodoxy, the <b>linguistic market</b>, <b>symbolic capital</b>, and <b>symbolic violence</b> through misrecognition.</li>
<li><strong>Irvine and Gal</strong>: <b>iconization</b> (Sereer as \"primitive\"), <b>fractal recursivity</b> (Pigg's ever-remoter \"real\" shamans), <b>erasure</b>.</li></ul>`,
      qs: ["C132", "C133", "C135", "C137", "C138", "C1310", "C1311", "C1312", "C1314", "C1315", "C1316"],
      play: [{ t: "match", title: "Irvine and Gal's three processes", pairs: [["Iconization", "Sereer seen as simple, so its speakers \"primitive\""], ["Fractal recursivity", "\"Real\" shamans are always somewhere more remote"], ["Erasure", "Ignoring Senegalese multilingualism"]] }, { t: "sort", title: "Doxa, orthodoxy or heterodoxy?", bins: ["Doxa", "Orthodoxy", "Heterodoxy"], items: [["Something no one thinks to question", 0], ["\"Marriage has always been man–woman, keep it\"", 1], ["Defending the status quo in debate", 1], ["Arguing the status quo should change", 2]] }] },
    { h: "Agency",
      html: `<p><b>Agency</b> = the <strong>socioculturally mediated capacity to act</strong>. It is <em>not</em> free will and <em>not</em> just resistance: think of Mahmood's mosque movement, or <b>negative agency</b>. Ortner distinguishes the agency of <strong>power</strong> from the agency of <strong>projects</strong>.</p>
<p>Grammar encodes agency: <b>ergative</b> vs. accusative patterns, Guaraní's two \"I\"s, LaFrance's <strong>disappearing agent effect</strong>, Duranti's Samoan grammar of blaming.</p>
<p><b>Meta-agentive discourse</b>: couples call love fate but careers choice; in their 1990 love letters, <strong>Shila</strong> stressed fate and obstacles while <strong>Vajra</strong> said nothing was impossible.</p>`,
      qs: ["C130", "C1319", "C1320", "C1321", "C1322", "C1324", "C1326", "C1327", "C1329"] },
    { h: "Reading: Perley, \"Zombie Linguistics\"",
      html: `<p>Perley (Tobique First Nation, <strong>Maliseet</strong>) says recordings of last speakers are <b>zombie voices</b>: neither dead nor alive. Experts value language as <strong>code</strong> rather than as the stuff of social relationships. Metaphors like \"death\" and \"extinction\" shape actions, and they cast communities as helpless victims.</p>
<ul><li>Deloria: \"Indians have anthropologists.\" Perley: endangered communities have linguists.</li>
<li>A teacher wants to teach kids, not just document elders. Then boys play cards using heritage-language numbers.</li>
<li><b>Emergent vitalities</b>: Maliseet TV voice-overs; his mother's children's-book DVD.</li></ul>
<p>Prefer \"sleeping\" and \"awakening,\" and collaboration.</p>`,
      qs: ["RD108", "RD109", "RD110", "RD112", "RD115", "RD116", "RD117", "RD119"] },
    { h: "Reading: Alim, \"Global Hip Hop\"",
      html: `<p>Hip Hop youth are <strong>cultural theorists</strong>. Instead of speech communities, think <b>translocal style communities</b>. Style is <strong>distinction</strong> (be original) and <b>glocal distinctiveness</b> (local and global at once).</p>
<p>Raekwon (Staten Island) and Ol Kainry (France) mix English, French, <b>verlan</b>, Black Language and local varieties. Hip Hop is a <b>mobile matrix</b>, adopted, adapted or rejected locally (GHOST 13's Chavacano).</p>
<p>Caveats: don't lose the <strong>extreme local</strong> (Cape Town's Kaaps, the Afrikaaps movement), and remember that <strong>cisheteropatriarchy</strong> also goes global.</p>`,
      qs: ["RD120", "RD122", "RD123", "RD124", "RD125", "RD126", "RD128", "RD130", "RD132"] }
  ]
}
];
