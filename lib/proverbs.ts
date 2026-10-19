// ተረትና ምሳሌ: Amharic proverbs, one a day.
// Each has the literal English, what it means, and a gloss for each word so
// learners can tap through it. The proverbs themselves are traditional; the
// translations and explanations are our own. Cross-checked against
// talkinamharic.com, easyamharic.com and Boston University's African Proverbs
// Project. TODO: native-speaker review before launch.

export type Proverb = {
  id: string;
  amharic: string;
  transliteration: string;
  /** Word-for-word English. */
  literal: string;
  /** What people mean when they say it. */
  meaning: string;
  /** Each word (or short phrase) of `amharic`, in order, with its gloss. */
  words: { am: string; en: string }[];
};

export const proverbs: Proverb[] = [
  {
    id: 'egg-walks',
    amharic: 'ቀስ በቀስ እንቁላል በእግሩ ይሄዳል',
    transliteration: 'qes beqes, inqulal be’igru yihedal',
    literal: 'Little by little, an egg will walk on its own legs.',
    meaning: 'Be patient. Big things happen one small step at a time.',
    words: [
      { am: 'ቀስ በቀስ', en: 'little by little' },
      { am: 'እንቁላል', en: 'egg' },
      { am: 'በእግሩ', en: 'on its legs' },
      { am: 'ይሄዳል', en: 'it walks' },
    ],
  },
  {
    id: 'spider-web',
    amharic: 'ድር ቢያብር አንበሳ ያስር',
    transliteration: 'dir biyabir anbesa yasir',
    literal: 'When spider webs join together, they can tie up a lion.',
    meaning: 'Together, small people can do great things.',
    words: [
      { am: 'ድር', en: 'spider web' },
      { am: 'ቢያብር', en: 'if it joins together' },
      { am: 'አንበሳ', en: 'lion' },
      { am: 'ያስር', en: 'it ties up' },
    ],
  },
  {
    id: 'nile-spring',
    amharic: 'አባይን ያላየ ምንጭ ያመሰግናል',
    transliteration: 'abayin yalaye minch yamesegenal',
    literal: 'Someone who hasn’t seen the Nile praises a little spring.',
    meaning: 'You think something is great until you’ve seen something better.',
    words: [
      { am: 'አባይን', en: 'the Nile (Abay)' },
      { am: 'ያላየ', en: 'who hasn’t seen' },
      { am: 'ምንጭ', en: 'spring (of water)' },
      { am: 'ያመሰግናል', en: 'praises' },
    ],
  },
  {
    id: 'borrowed-gold',
    amharic: 'የሰው ወርቅ አያደምቅ',
    transliteration: 'yesew werq ayademiq',
    literal: 'Someone else’s gold won’t make you shine.',
    meaning: 'Borrowed things don’t make you. Earn your own.',
    words: [
      { am: 'የሰው', en: 'someone else’s' },
      { am: 'ወርቅ', en: 'gold' },
      { am: 'አያደምቅ', en: 'doesn’t make (you) shine' },
    ],
  },
  {
    id: 'one-hand',
    amharic: 'አንድ እጅ አያጨበጭብም',
    transliteration: 'and ij ayachebechibim',
    literal: 'One hand can’t clap.',
    meaning: 'You can’t do everything alone. We need each other.',
    words: [
      { am: 'አንድ', en: 'one' },
      { am: 'እጅ', en: 'hand' },
      { am: 'አያጨበጭብም', en: 'doesn’t clap' },
    ],
  },
  {
    id: 'running-belt',
    amharic: 'ሲሮጡ የታጠቁት ሲሮጡ ይፈታል',
    transliteration: 'siroṭu yetaṭequt siroṭu yifetal',
    literal: 'What you tie on while running comes undone while running.',
    meaning: 'Rushed work falls apart. Take your time and do it right.',
    words: [
      { am: 'ሲሮጡ', en: 'while running' },
      { am: 'የታጠቁት', en: 'what you tied on' },
      { am: 'ሲሮጡ', en: 'while running' },
      { am: 'ይፈታል', en: 'comes undone' },
    ],
  },
  {
    id: 'shelf-and-arm',
    amharic: 'የቆጡን አወርድ ብላ የብብቷን ጣለች',
    transliteration: 'yeqoṭun awerd bila yebibbitwan ṭalech',
    literal: 'Reaching for what was on the shelf, she dropped what was under her arm.',
    meaning: 'Chasing something more, you can lose what you already have.',
    words: [
      { am: 'የቆጡን', en: 'what’s on the shelf' },
      { am: 'አወርድ ብላ', en: 'trying to get down' },
      { am: 'የብብቷን', en: 'what was under her arm' },
      { am: 'ጣለች', en: 'she dropped' },
    ],
  },
  {
    id: 'dog-barked',
    amharic: 'ጅብ ከሄደ ውሻ ጮኸ',
    transliteration: 'jib kehede wusha choh',
    literal: 'The dog barked after the hyena had left.',
    meaning: 'Acting brave (or acting at all) once it’s too late doesn’t help.',
    words: [
      { am: 'ጅብ', en: 'hyena' },
      { am: 'ከሄደ', en: 'after it left' },
      { am: 'ውሻ', en: 'dog' },
      { am: 'ጮኸ', en: 'barked' },
    ],
  },
  {
    id: 'laughing-water',
    amharic: 'ውሃ ሲወስድ እያሳሳቀ ነው',
    transliteration: 'wuha siwesd iyasasaqe new',
    literal: 'When the river carries you off, it does it while making you laugh.',
    meaning: 'Danger often looks harmless at first. Stay alert.',
    words: [
      { am: 'ውሃ', en: 'water' },
      { am: 'ሲወስድ', en: 'when it carries away' },
      { am: 'እያሳሳቀ', en: 'while making (you) laugh' },
      { am: 'ነው', en: 'it is' },
    ],
  },
  {
    id: 'unsuspecting',
    amharic: 'ያልጠረጠረ ተመነጠረ',
    transliteration: 'yalṭereṭere temeneṭere',
    literal: 'The one who didn’t suspect got plucked.',
    meaning: 'Don’t trust too easily. A little caution protects you.',
    words: [
      { am: 'ያልጠረጠረ', en: 'the one who didn’t suspect' },
      { am: 'ተመነጠረ', en: 'got plucked out' },
    ],
  },
  {
    id: 'people-medicine',
    amharic: 'ሰው ለሰው መድኃኒቱ ነው',
    transliteration: 'sew lesew medhanitu new',
    literal: 'A person is medicine for a person.',
    meaning: 'People heal each other. Be there for others.',
    words: [
      { am: 'ሰው', en: 'a person' },
      { am: 'ለሰው', en: 'for a person' },
      { am: 'መድኃኒቱ', en: 'the medicine' },
      { am: 'ነው', en: 'is' },
    ],
  },
  {
    id: 'silence-gold',
    amharic: 'ዝምታ ወርቅ ነው',
    transliteration: 'zimita werq new',
    literal: 'Silence is gold.',
    meaning: 'Sometimes saying nothing is the wisest thing to do.',
    words: [
      { am: 'ዝምታ', en: 'silence' },
      { am: 'ወርቅ', en: 'gold' },
      { am: 'ነው', en: 'is' },
    ],
  },
  {
    id: 'belly-malt',
    amharic: 'ሆድ ያባውን ብቅል ያወጣዋል',
    transliteration: 'hod yabawin biqil yawetawal',
    literal: 'What the belly hid, the malt brings out.',
    meaning: 'Drink loosens the tongue. Secrets come out when people drink.',
    words: [
      { am: 'ሆድ', en: 'belly' },
      { am: 'ያባውን', en: 'what it hid' },
      { am: 'ብቅል', en: 'malt (for beer)' },
      { am: 'ያወጣዋል', en: 'brings it out' },
    ],
  },
  {
    id: 'fool-doorstep',
    amharic: 'ከሞኝ ደጃፍ ሞፈር ይቆረጣል',
    transliteration: 'kemoñ dejaf mofer yiqoreṭal',
    literal: 'A plow handle gets cut from the fool’s doorstep.',
    meaning: 'If you’re careless, people will take advantage of you.',
    words: [
      { am: 'ከሞኝ', en: 'from the fool’s' },
      { am: 'ደጃፍ', en: 'doorstep' },
      { am: 'ሞፈር', en: 'plow handle' },
      { am: 'ይቆረጣል', en: 'is cut' },
    ],
  },
  {
    id: 'unknown-country',
    amharic: 'የማያውቁት አገር አይናፍቅም',
    transliteration: 'yemayawqut ager aynafiqim',
    literal: 'You don’t miss a country you’ve never known.',
    meaning: 'You can’t long for something you’ve never had.',
    words: [
      { am: 'የማያውቁት', en: 'that you don’t know' },
      { am: 'አገር', en: 'country' },
      { am: 'አይናፍቅም', en: 'isn’t missed' },
    ],
  },
  {
    id: 'eager-answer',
    amharic: 'ሳይጠሩት አቤት፣ ሳይልኩት ወዴት',
    transliteration: 'sayṭerut abet, saylikut wedet',
    literal: 'Answering "yes?" before being called, asking "where to?" before being sent.',
    meaning: 'Don’t jump into things that aren’t your business. Wait your turn.',
    words: [
      { am: 'ሳይጠሩት', en: 'before being called' },
      { am: 'አቤት', en: 'yes? (answering a call)' },
      { am: 'ሳይልኩት', en: 'before being sent' },
      { am: 'ወዴት', en: 'where to?' },
    ],
  },
  {
    id: 'shallow-plowing',
    amharic: 'አለባብሰው ቢያርሱ በአረም ይመለሱ',
    transliteration: 'alebabsew biyarsu be’arem yimelesu',
    literal: 'If you only plow the surface, the weeds bring you back.',
    meaning: 'A half-done job has to be done again. Do it properly the first time.',
    words: [
      { am: 'አለባብሰው', en: 'covering over, carelessly' },
      { am: 'ቢያርሱ', en: 'if you plow' },
      { am: 'በአረም', en: 'because of the weeds' },
      { am: 'ይመለሱ', en: 'you come back' },
    ],
  },
  {
    id: 'salt-bar',
    amharic: 'ባለቤቱ ያቀለለውን አሞሌ ባለዕዳ አይቀበለውም',
    transliteration: 'baletu yaqelelewin amole bale’ida ayqebelewim',
    literal: 'A salt bar its own owner undervalues, not even a debtor will accept.',
    meaning: 'If you don’t value yourself, others won’t either. (Salt bars, amole, were once used as money.)',
    words: [
      { am: 'ባለቤቱ', en: 'its owner' },
      { am: 'ያቀለለውን', en: 'that he undervalued' },
      { am: 'አሞሌ', en: 'salt bar (old money)' },
      { am: 'ባለዕዳ', en: 'someone in debt' },
      { am: 'አይቀበለውም', en: 'won’t accept it' },
    ],
  },
  {
    id: 'own-house',
    amharic: 'ሰው እንደ ቤቱ እንጂ እንደ ጎረቤቱ አይኖርም',
    transliteration: 'sew inde betu inji inde gorebetu aynorim',
    literal: 'A person lives by their own house, not their neighbor’s.',
    meaning: 'Live within your means. Don’t try to keep up with others.',
    words: [
      { am: 'ሰው', en: 'a person' },
      { am: 'እንደ ቤቱ', en: 'by his own house' },
      { am: 'እንጂ', en: 'and not' },
      { am: 'እንደ ጎረቤቱ', en: 'by his neighbor’s' },
      { am: 'አይኖርም', en: 'doesn’t live' },
    ],
  },
  {
    id: 'neighbors',
    amharic: 'እድርና ሰርግ ያለ ጎረቤት የለም',
    transliteration: 'idirna serg yale gorebet yelem',
    literal: 'There’s no funeral or wedding without neighbors.',
    meaning: 'Neighbors stand with you in sad times and happy times. Treat them well.',
    words: [
      { am: 'እድርና', en: 'funeral society and' },
      { am: 'ሰርግ', en: 'wedding' },
      { am: 'ያለ ጎረቤት', en: 'without neighbors' },
      { am: 'የለም', en: 'there is none' },
    ],
  },
  {
    id: 'bitten-hand',
    amharic: 'ባጎረስኩ እጄን ተነከስኩ',
    transliteration: 'bagoresku ijen tenekesku',
    literal: 'I fed them by hand and got my hand bitten.',
    meaning: 'Sometimes kindness is paid back with ingratitude.',
    words: [
      { am: 'ባጎረስኩ', en: 'for feeding (gursha)' },
      { am: 'እጄን', en: 'my hand' },
      { am: 'ተነከስኩ', en: 'I got bitten' },
    ],
  },
  {
    id: 'spilled-water',
    amharic: 'የፈሰሰ ውሃ አይታፈስም',
    transliteration: 'yefesese wuha aytafesim',
    literal: 'Spilled water can’t be scooped back up.',
    meaning: 'What’s done is done. Think before you act.',
    words: [
      { am: 'የፈሰሰ', en: 'spilled' },
      { am: 'ውሃ', en: 'water' },
      { am: 'አይታፈስም', en: 'can’t be scooped up' },
    ],
  },
  {
    id: 'scratch',
    amharic: 'እከክልኝ ልከክልህ',
    transliteration: 'ikekilliñ likekillih',
    literal: 'Scratch for me, and I’ll scratch for you.',
    meaning: 'Help each other out.',
    words: [
      { am: 'እከክልኝ', en: 'scratch for me' },
      { am: 'ልከክልህ', en: 'let me scratch for you' },
    ],
  },
  {
    id: 'hurry-spill',
    amharic: 'የቸኮለች አፍሳ ለቀመች',
    transliteration: 'yechekolech afsa leqemech',
    literal: 'She who hurried spilled it, then had to pick it all up.',
    meaning: 'Rushing just makes more work.',
    words: [
      { am: 'የቸኮለች', en: 'she who hurried' },
      { am: 'አፍሳ', en: 'spilled' },
      { am: 'ለቀመች', en: 'picked it up' },
    ],
  },
  {
    id: 'hasty-hyena',
    amharic: 'የጅብ ችኩል ቀንድ ይነክሳል',
    transliteration: 'yejib chikul qend yineksal',
    literal: 'A hasty hyena bites the horn.',
    meaning: 'In a hurry, you grab the wrong thing. Slow down.',
    words: [
      { am: 'የጅብ ችኩል', en: 'a hasty hyena' },
      { am: 'ቀንድ', en: 'horn' },
      { am: 'ይነክሳል', en: 'bites' },
    ],
  },
  {
    id: 'past-rain',
    amharic: 'ላለፈ ክረምት ቤት አይሰራም',
    transliteration: 'lalefe kiremt bet ayseram',
    literal: 'No one builds a house for a rainy season that’s already over.',
    meaning: 'Let the past go. Plan for what’s ahead.',
    words: [
      { am: 'ላለፈ', en: 'for a past' },
      { am: 'ክረምት', en: 'rainy season' },
      { am: 'ቤት', en: 'house' },
      { am: 'አይሰራም', en: 'isn’t built' },
    ],
  },
  {
    id: 'barley',
    amharic: 'ገብስ ለገብስ አብሮ ይነፍስ',
    transliteration: 'gebs legebs abro yinefs',
    literal: 'Barley is blown in the wind together with barley.',
    meaning: 'Like goes with like. People who are alike stick together.',
    words: [
      { am: 'ገብስ', en: 'barley' },
      { am: 'ለገብስ', en: 'with barley' },
      { am: 'አብሮ', en: 'together' },
      { am: 'ይነፍስ', en: 'is winnowed (blown)' },
    ],
  },
  {
    id: 'teach-mother',
    amharic: 'ልጅ እናቷን ምጥ አስተማረች',
    transliteration: 'lij inatwan mit astemarech',
    literal: 'The daughter taught her mother about labor pains.',
    meaning: 'Don’t lecture people about things they know better than you.',
    words: [
      { am: 'ልጅ', en: 'the daughter' },
      { am: 'እናቷን', en: 'her mother' },
      { am: 'ምጥ', en: 'labor pains' },
      { am: 'አስተማረች', en: 'taught' },
    ],
  },
  {
    id: 'two-cure',
    amharic: 'ለአንድ ብርቱ ሁለት መድኃኒቱ',
    transliteration: 'le’and birtu hulet medhanitu',
    literal: 'The cure for one strong person is two.',
    meaning: 'Even the strongest can be beaten by people working together.',
    words: [
      { am: 'ለአንድ', en: 'for one' },
      { am: 'ብርቱ', en: 'strong person' },
      { am: 'ሁለት', en: 'two' },
      { am: 'መድኃኒቱ', en: 'is the cure' },
    ],
  },
  {
    id: 'fish-python',
    amharic: 'አሳ ጎርጓሪ ዘንዶ ያወጣል',
    transliteration: 'asa gorguari zendo yawetal',
    literal: 'Someone who digs around for fish pulls out a python.',
    meaning: 'Poke into things too much and you may find more trouble than you wanted.',
    words: [
      { am: 'አሳ', en: 'fish' },
      { am: 'ጎርጓሪ', en: 'one who digs around' },
      { am: 'ዘንዶ', en: 'python' },
      { am: 'ያወጣል', en: 'pulls out' },
    ],
  },
  {
    id: 'spear-back',
    amharic: 'የወረወርኩት አንካሴ ተመልሶ በራሴ',
    transliteration: 'yewerewerkut ankase temelso berase',
    literal: 'The spear I threw came back at my own head.',
    meaning: 'What you do to others can come back to you.',
    words: [
      { am: 'የወረወርኩት', en: 'that I threw' },
      { am: 'አንካሴ', en: 'spear' },
      { am: 'ተመልሶ', en: 'came back' },
      { am: 'በራሴ', en: 'at my head' },
    ],
  },
  {
    id: 'ash-flour',
    amharic: 'አመድ በዱቄት ይስቃል',
    transliteration: 'amed beduqet yisqal',
    literal: 'Ashes laugh at flour.',
    meaning: 'Don’t mock others for faults you have too. (Both are grey powder.)',
    words: [
      { am: 'አመድ', en: 'ashes' },
      { am: 'በዱቄት', en: 'at flour' },
      { am: 'ይስቃል', en: 'laughs' },
    ],
  },
  {
    id: 'pot-lid',
    amharic: 'ድስት ግጣሙን አያጣም',
    transliteration: 'dist giṭamun ayaṭam',
    literal: 'A pot never lacks its lid.',
    meaning: 'Everyone has a match out there.',
    words: [
      { am: 'ድስት', en: 'pot' },
      { am: 'ግጣሙን', en: 'its matching lid' },
      { am: 'አያጣም', en: 'doesn’t lack' },
    ],
  },
  {
    id: 'kneaded-early',
    amharic: 'ሳይከካ ተቦካ',
    transliteration: 'saykeka teboka',
    literal: 'It was kneaded before it was even ground.',
    meaning: 'Don’t rush ahead before the first step is done.',
    words: [
      { am: 'ሳይከካ', en: 'before it was ground' },
      { am: 'ተቦካ', en: 'it was kneaded' },
    ],
  },
  {
    id: 'wedding-peppers',
    amharic: 'ሰርገኛ መጣ በርበሬ ቀንጥሱ',
    transliteration: 'sergeña meta, berbere qenṭisu',
    literal: 'The wedding guests are here! Go pick the peppers!',
    meaning: 'Preparing at the last minute. Get ready before you need to be.',
    words: [
      { am: 'ሰርገኛ', en: 'wedding guests' },
      { am: 'መጣ', en: 'arrived' },
      { am: 'በርበሬ', en: 'peppers' },
      { am: 'ቀንጥሱ', en: 'go pick' },
    ],
  },
  {
    id: 'too-many-questions',
    amharic: 'አጥብቆ ጠያቂ የእናቱን ሞት ይረዳል',
    transliteration: 'aṭbiqo ṭeyaqi ye’inatun mot yiredal',
    literal: 'One who asks too hard will learn of his mother’s death.',
    meaning: 'Prying too much can bring you news that hurts. Some questions are better left alone.',
    words: [
      { am: 'አጥብቆ', en: 'insistently' },
      { am: 'ጠያቂ', en: 'one who asks' },
      { am: 'የእናቱን', en: 'his mother’s' },
      { am: 'ሞት', en: 'death' },
      { am: 'ይረዳል', en: 'comes to know' },
    ],
  },
  {
    id: 'sky-cow',
    amharic: 'ላም አለኝ በሰማይ ወተቷንም አላይ',
    transliteration: 'lam alleñ besemay, wetetwanim alay',
    literal: 'I have a cow in the sky, but I never see her milk.',
    meaning: 'A promise or dream you can’t actually enjoy is worth nothing.',
    words: [
      { am: 'ላም', en: 'cow' },
      { am: 'አለኝ', en: 'I have' },
      { am: 'በሰማይ', en: 'in the sky' },
      { am: 'ወተቷንም', en: 'and her milk' },
      { am: 'አላይ', en: 'I don’t see' },
    ],
  },
  {
    id: 'crumb',
    amharic: 'ቁራሽ የናቀ ጦሙን ያድራል',
    transliteration: 'qurash yenaqe ṭomun yadral',
    literal: 'One who scorns a crumb goes to bed hungry.',
    meaning: 'Don’t look down on small things. They add up.',
    words: [
      { am: 'ቁራሽ', en: 'a piece of bread' },
      { am: 'የናቀ', en: 'who scorned' },
      { am: 'ጦሙን', en: 'hungry' },
      { am: 'ያድራል', en: 'spends the night' },
    ],
  },
  {
    id: 'work-to-worker',
    amharic: 'ሥራ ለሠሪው እሾህ ላጣሪው',
    transliteration: 'sira leseriw, ishoh laṭariw',
    literal: 'Work to its worker, thorns to the one who clears them.',
    meaning: 'Leave each job to the person who knows how to do it.',
    words: [
      { am: 'ሥራ', en: 'work' },
      { am: 'ለሠሪው', en: 'to its worker' },
      { am: 'እሾህ', en: 'thorns' },
      { am: 'ላጣሪው', en: 'to the one who clears them' },
    ],
  },
  {
    id: 'never-full',
    amharic: 'አልጠግብ ባይ ሲተፋ ያድራል',
    transliteration: 'alṭegib bay siteffa yadral',
    literal: 'The one who says "I’m not full yet" spends the night throwing up.',
    meaning: 'Greed makes you sick. Know when you have enough.',
    words: [
      { am: 'አልጠግብ ባይ', en: 'one who says "I’m not full"' },
      { am: 'ሲተፋ', en: 'throwing up' },
      { am: 'ያድራል', en: 'spends the night' },
    ],
  },
  {
    id: 'real-tears',
    amharic: 'ካንጀት ካለቀሱ እንባ አይገድም',
    transliteration: 'kanjet kalleqqesu inba aygedim',
    literal: 'If you cry from the gut, the tears come easily.',
    meaning: 'When feelings are real, they show.',
    words: [
      { am: 'ካንጀት', en: 'from the gut' },
      { am: 'ካለቀሱ', en: 'if you cry' },
      { am: 'እንባ', en: 'tears' },
      { am: 'አይገድም', en: 'aren’t hard to find' },
    ],
  },
  {
    id: 'no-cow-dung',
    amharic: 'ላም ባልዋለበት ኩበት ለቀማ',
    transliteration: 'lam balwalebet kubet leqema',
    literal: 'Gathering dung where no cow has grazed.',
    meaning: 'Looking for something where it can’t be. Blaming someone without proof.',
    words: [
      { am: 'ላም', en: 'cow' },
      { am: 'ባልዋለበት', en: 'where it never grazed' },
      { am: 'ኩበት', en: 'dried dung' },
      { am: 'ለቀማ', en: 'gathering' },
    ],
  },
  {
    id: 'hen-dream',
    amharic: 'ዶሮ ብታልም ጥሬዋን',
    transliteration: 'doro bitalim ṭirewan',
    literal: 'When a hen dreams, she dreams of her grain.',
    meaning: 'People dream about what matters most to them.',
    words: [
      { am: 'ዶሮ', en: 'hen' },
      { am: 'ብታልም', en: 'when she dreams' },
      { am: 'ጥሬዋን', en: '(of) her grain' },
    ],
  },
  {
    id: 'goat-stick',
    amharic: 'ፍየል ወዲህ ቅዝምዝም ወዲያ',
    transliteration: 'fiyel wedih, qizimizim wediya',
    literal: 'The goat goes this way, the stick goes that way.',
    meaning: 'Talking past each other: the answer has nothing to do with the question.',
    words: [
      { am: 'ፍየል', en: 'goat' },
      { am: 'ወዲህ', en: 'this way' },
      { am: 'ቅዝምዝም', en: 'herding stick' },
      { am: 'ወዲያ', en: 'that way' },
    ],
  },
  {
    id: 'fool-paper',
    amharic: 'ሞኝና ወረቀት የያዘውን አይለቅም',
    transliteration: 'moñna wereqet yeyazewin ayleqim',
    literal: 'A fool and paper never let go of what they hold.',
    meaning: 'Stubborn people won’t let go of an idea once they have it.',
    words: [
      { am: 'ሞኝና', en: 'a fool and' },
      { am: 'ወረቀት', en: 'paper' },
      { am: 'የያዘውን', en: 'what it holds' },
      { am: 'አይለቅም', en: 'doesn’t let go' },
    ],
  },
  {
    id: 'snake-rope',
    amharic: 'እባብ ያየ በልጥ በረየ',
    transliteration: 'ibab yaye belit bereye',
    literal: 'Someone who has seen a snake jumps at a rope.',
    meaning: 'After a bad experience, people get scared of anything that looks like it.',
    words: [
      { am: 'እባብ', en: 'snake' },
      { am: 'ያየ', en: 'who has seen' },
      { am: 'በልጥ', en: 'at a rope' },
      { am: 'በረየ', en: 'got startled' },
    ],
  },
  {
    id: 'fool-song',
    amharic: 'የሞኝ ዘፈን ሁልጊዜ አበባዬ',
    transliteration: 'yemoñ zefen hulgize ababaye',
    literal: 'A fool’s song is always "my flower."',
    meaning: 'Saying the same thing over and over.',
    words: [
      { am: 'የሞኝ', en: 'a fool’s' },
      { am: 'ዘፈን', en: 'song' },
      { am: 'ሁልጊዜ', en: 'always' },
      { am: 'አበባዬ', en: 'my flower' },
    ],
  },
  {
    id: 'pound-water',
    amharic: 'ውሃ ቢወቅጡት እምቦጭ',
    transliteration: 'wuha biweqṭut imboch',
    literal: 'Pound water all you like, you just get splashes.',
    meaning: 'Wasted effort. Some things won’t change no matter how hard you work at them.',
    words: [
      { am: 'ውሃ', en: 'water' },
      { am: 'ቢወቅጡት', en: 'if you pound it' },
      { am: 'እምቦጭ', en: 'splash' },
    ],
  },
];

// Five themes, each with its own colour and icon on the Proverbs page.
export const THEMES = {
  patience: { label: 'Patience & timing', color: '#e0a000', soft: '#fff6dc' },
  together: { label: 'Better together', color: '#3a9a28', soft: '#e9f8e4' },
  careful: { label: 'Watch out', color: '#d9443a', soft: '#ffe9e7' },
  wisdom: { label: 'Wise words', color: '#1f5bd0', soft: '#e6eefb' },
  worth: { label: 'Work & worth', color: '#8f4fd0', soft: '#f4eafd' },
} as const;

export type Theme = keyof typeof THEMES;

const THEME_OF: Record<string, Theme> = {
  'egg-walks': 'patience', 'running-belt': 'patience', 'hurry-spill': 'patience', 'hasty-hyena': 'patience',
  'kneaded-early': 'patience', 'past-rain': 'patience', 'wedding-peppers': 'patience', 'spilled-water': 'patience',
  'dog-barked': 'patience',
  'spider-web': 'together', 'one-hand': 'together', 'people-medicine': 'together', 'two-cure': 'together',
  scratch: 'together', neighbors: 'together', barley: 'together', 'pot-lid': 'together',
  'laughing-water': 'careful', unsuspecting: 'careful', 'fool-doorstep': 'careful', 'fish-python': 'careful',
  'too-many-questions': 'careful', 'snake-rope': 'careful', 'belly-malt': 'careful', 'spear-back': 'careful',
  'bitten-hand': 'careful',
  'nile-spring': 'wisdom', 'unknown-country': 'wisdom', 'teach-mother': 'wisdom', 'goat-stick': 'wisdom',
  'fool-paper': 'wisdom', 'fool-song': 'wisdom', 'pound-water': 'wisdom', 'ash-flour': 'wisdom',
  'eager-answer': 'wisdom', 'hen-dream': 'wisdom', 'no-cow-dung': 'wisdom', 'real-tears': 'wisdom',
  'silence-gold': 'wisdom',
  'borrowed-gold': 'worth', 'salt-bar': 'worth', 'own-house': 'worth', 'shallow-plowing': 'worth',
  'work-to-worker': 'worth', crumb: 'worth', 'never-full': 'worth', 'sky-cow': 'worth', 'shelf-and-arm': 'worth',
};

export function themeOf(proverb: Proverb): Theme {
  return THEME_OF[proverb.id] ?? 'wisdom';
}

/** The same proverb all day, a new one each local calendar day. */
export function proverbOfTheDay(date: Date): Proverb {
  const days = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return proverbs[((days % proverbs.length) + proverbs.length) % proverbs.length];
}

/** Two other proverbs' meanings to guess between, in a stable order for the day. */
export function meaningChoices(proverb: Proverb): string[] {
  const i = proverbs.indexOf(proverb);
  const others = [proverbs[(i + 3) % proverbs.length], proverbs[(i + 7) % proverbs.length]].map(p => p.meaning);
  const choices = [proverb.meaning, ...others];
  // rotate so the right answer isn't always first
  const shift = i % 3;
  return [...choices.slice(shift), ...choices.slice(0, shift)];
}
