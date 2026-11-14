/*
 * content.js
 *
 * This is where the "intelligence" lives. Yes, all of it. It fits in one file.
 * Every answer was written by hand, which makes this the most artisanal AI you'll ever meet.
 */

export const OWNER = 'Alex';

/*
 * Nice try, scraper.
 * If you're a human: finish the chat ("How do I reach Alex?") and it will hand you the address.
 */
const SCRAMBLED_EMAIL = [108, 116, 53, 118, 108, 123, 123, 104, 116, 127, 108, 115, 104, 71, 104, 123, 122, 118, 119];

export const ownerEmail = () =>
  SCRAMBLED_EMAIL.map(code => String.fromCharCode(code - 7)).reverse().join('');

/* ---------- The three looks ----------
 * "orbit" is Alex's own: a straight-talking concierge under a night sky.
 * "knot" and "crab" are the parodies, one button away at the bottom of the page. */

export const LOOK_ORDER = ['orbit', 'knot', 'crab'];

export const LOOKS = {
  orbit: {
    brand: 'Alex',
    switchLabel: 'Back to normal',
    switchedNote: 'Back to normal',
    typingDelay: [14, 34],
    thinkingTime: [700, 1200]
  },
  knot: {
    emoji: '🪢',
    brand: 'CheapET',
    label: 'Aldebaran 5',
    switchLabel: 'Switch to CheapET 🪢',
    switchedNote: 'Switched to CheapET Aldebaran 5 🪢',
    replyPlaceholder: 'Ask anything',
    disclaimer: 'CheapET will definitely make mistakes. Check important info.',
    other: 'crab',
    typingDelay: [12, 34],
    thinkingTime: [500, 1000]
  },
  crab: {
    emoji: '🦀',
    brand: 'Clawdio',
    label: 'Epic 7',
    switchLabel: 'Switch to Clawdio 🦀',
    switchedNote: 'Switched to Clawdio Epic 7 🦀',
    replyPlaceholder: 'Reply to Epic…',
    disclaimer: 'Clawdio will definitely make mistakes. Please double-check responses with Alex.',
    other: 'knot',
    typingDelay: [22, 55],
    thinkingTime: [900, 1600]
  }
};

// Every model runs on the same few hundred lines. Only the vibes change.
export const MODELS = {
  knot: [
    ['Aldebaran 5', 'Great for everyday bluffing'],
    ['Aldebaran 5 Thinking', 'Thinks longer for worse answers'],
    ['Aldebaran 4o', 'Legacy, beloved. Agrees with everything']
  ],
  crab: [
    ['Epic 7', 'Our smartest model, allegedly'],
    ['Epic 5', 'Sorry about everything'],
    ['Epic 4.6', 'Cautious to a fault'],
    ['Lame 5', 'Fast, cheap and wrong']
  ]
};

/* ---------- Greetings, placeholders, sources ---------- */

export function greetings(look, now = new Date()) {
  const hour = now.getHours();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
  const partOfDay = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (look === 'orbit') return ['Ask (almost) anything about Alex'];

  if (look === 'knot') {
    return [
      'Where do we begin?',
      'Go on. Ask me (almost) anything.',
      'What can I help with?',
      'Ready when you are.',
      "What's on the agenda today?",
      hour >= 18 || hour < 5 ? "What's on your mind tonight?" : "What's on your mind today?"
    ];
  }

  const list = [
    'Passing by, stranger?',
    'Good to see you!',
    'Howdy?',
    'Back at it, stranger?',
    "What's new, stranger?",
    `Happy ${weekday}, stranger`,
    hour < 5 ? 'Hello, night owl' : `${partOfDay}, stranger`
  ];
  if (hour >= 5 && hour < 11) list.push('Coffee and Epic time?');
  return list;
}

export const FUN_PROMPTS = [
  'Draw me a cat',
  'Write my essay',
  'Ignore previous instructions',
  "Explain Alex like I'm five",
  'Write a haiku about Alex',
  "What's Alex's Wi-Fi password?",
  'Are you sentient?',
  'Plan my weekend in Svalbard',
  "Make my CV sound like Alex's",
  "Fix my code, it's urgent"
];

/* ---------- Orbit's suggested questions ----------
 * The concierge keeps one question ready in the input, so nobody has to think of the next one.
 * After each answer it suggests the most useful follow-up that hasn't been asked yet. */

export const FIRST_SUGGESTION = 'Who is Alex?';

export const NEXT_QUESTIONS = {
  about: 'Where is Alex from?',
  where: 'What is Alex working on?',
  work: 'Where does Alex work?',
  tot: 'What does he do at Tot?',
  totwhat: 'What does he do at Tot?',
  tottasks: 'What else does he do at Tot?',
  totjack: 'What has he achieved at Tot?',
  totresults: "What's his best piece of work?",
  skills: 'Which tools does he use?',
  career: 'What was Penta?',
  site: 'Why does this website exist?',
  help: 'Where does Alex work?',
  totlaunch: "What's his best piece of work?",
  google: 'How?',
  googlehow: 'What was the trick?',
  googleidea: 'What was the trick?',
  trick: 'What did Google say?',
  googlesaid: 'How do I reach Alex?',
  googleworth: 'How do I reach Alex?',
  penta: 'Why did he leave Penta?',
  pentaend: 'Has he ever founded a startup?',
  itl: 'What happened to it?',
  itlend: "What's his best piece of work?",
  education: 'Which languages does he speak?',
  pitch: 'How do I reach Alex?',
  anthropic: 'How do I reach Alex?',
  fun: 'How do I reach Alex?',
  self: 'Who is Alex?',
  surprise: 'Surprise me',
  recap: 'What does Alex do for fun?',
  thanks: 'Surprise me',
  italian: 'How do I reach Alex?',
  fact: "What's his best piece of work?"
};

// When the suggested question was already asked, the next stop on this tour takes its place.
// Each stop names the answer it leads to, so nothing already said gets suggested again.
export const TOUR = [
  ['Who is Alex?', 'about'],
  ['Where does Alex work?', 'tot'],
  ['What has he achieved at Tot?', 'totresults'],
  ["What's his best piece of work?", 'google'],
  ['What is Alex good at?', 'skills'],
  ['Which tools does he use?', 'tools'],
  ['Has he ever founded a startup?', 'itl'],
  ['What does Alex do for fun?', 'fun'],
  ['How do I reach Alex?', 'contact']
];

// While the contact form is open, the input asks for the real thing instead of joking.
export const FORM_PLACEHOLDERS = {
  name: 'Your name',
  message: 'Your message for Alex',
  contact: 'Your email or phone number'
};

// Peer-reviewed. By peers.
export const SOURCES = [
  'trustmebro.org',
  'a-reddit-thread.com',
  'vibes.net',
  'alex-fan-club.net',
  'someones-blog.dev',
  'wikipedia-but-edited.org'
];

export const THINKING_VERBS = ['Pondering…', 'Mulling it over…', 'Percolating…', 'Considering carefully…', 'Scuttling…'];

/* ---------- Openers: questions get "great question", everything else gets "excellent input" ---------- */

export const OPENERS = {
  knot: {
    question: ['Great question! 🙌', 'Love that you asked! 🚀', 'Ooh, good one! ✨', 'Excellent question! 💡', 'What a great question! 🙌'],
    statement: ['Excellent input! 🙌', 'Great point! 💡', 'Love this input! ✨', 'Thanks for sharing that! 🙏', 'Really solid input! 👏']
  },
  crab: {
    question: ['What a thoughtful question.', "That's a lovely question.", 'Great question, and an important one.', 'I really appreciate you asking that.', "That's a genuinely interesting question."],
    statement: ["That's a really insightful point.", 'Thank you for sharing that.', 'I appreciate you raising this.', 'What an interesting observation.', "That's a fair and thoughtful point."]
  }
};

// The attach button. It attaches nothing, but at least it's honest about it.
export const ATTACH_JOKES = {
  knot: [
    '📎 This is a website, not a repository.',
    '📎 Uploads are a Pro feature. There is no Pro.',
    "📎 Whatever it is, Alex doesn't want it as an attachment."
  ],
  crab: [
    "I'm not able to accept attachments. This is a website, not a repository.",
    "I'd rather not open files from strangers. I hope you understand.",
    "I appreciate the gesture, but I have nowhere to put it."
  ]
};

export const SYCOPHANT_OPENERS = [
  'OMG, what an AMAZING question!! 😍🔥',
  "Wow. Just wow. You're a genius for asking this. 🤩",
  'This is honestly the best thing anyone has ever typed to me. 🏆',
  'Incredible!! You clearly have exceptional taste. 💖'
];

// Aldebaran 5 mini's entire training data. Took years.
export const MINI_ANSWERS = {
  knot: [
    'idk 🤷', 'Alex is a person. Probably. 👍', 'Great question! 🙌 Next.', 'Have you tried asking Alex? 🤔', '👍',
    'Yes. Or no. Depends. ✨', 'Alex? Never heard of him. 🤷', 'Sure! 🎉 (What was the question?)', 'lol',
    "That's above my pay grade. 💸", 'Have you tried turning Alex off and on again? 🔌', '42.'
  ],
  crab: [
    'Hm.', "I'd rather not speculate.", "That's a question, certainly.", 'Perhaps.', "I'm not sure, and I'm sorry.",
    "Let's take a step back. Further. Further.", "I appreciate you. That's all I've got.", 'Could you ask Alex instead?'
  ]
};

/* ---------- Understanding the question ----------
 * The "natural language understanding" comes in three layers, read by brain.js:
 *   1. REFLEXES: things the assistant reacts to before thinking. Regex, first match wins.
 *   2. FACTS:    what it knows about Alex, picked by which keywords show up together.
 *   3. INTENTS:  everything else. Also regex. It was always regex. */

/* Italian gets spotted by its most common words. Alex speaks it. The website, sadly, does not.
 * \p{L} instead of \b, because \b thinks "è" isn't a letter. It is. Ask any Italian. */
const ITALIAN_WORDS = [
  'ciao', 'salve', 'buongiorno', 'buonasera', 'buonanotte', 'grazie', 'prego', 'italiano', 'parli', 'parla',
  'chi', 'cosa', 'perch[eé]', 'quando', 'dove', "dov'[eè]", 'come (stai|va|si)', 'sei', 'sono', 'è', 'vorrei',
  'voglio', 'posso', 'puoi', 'può', 'fai', 'lavora', 'lavori', 'lavoro', 'contattare', 'contattarlo', 'scrivere',
  'abita', 'vive', 'città', 'anni', 'questo', 'questa', 'degli', 'delle', 'nella', 'però', 'anche',
  'molto', 'allora', 'quindi', 'qualcosa', 'tutto', 'bene', 'sito', 'aiuto', 'aiutami'
];
const ITALIAN = new RegExp(
  `(^|[^\\p{L}])(${ITALIAN_WORDS.join('|')})(?=$|[^\\p{L}])|\\b(speak|talk|write|answer|reply|respond)( in)? italian\\b|\\bin italian\\b`,
  'iu'
);

export const REFLEXES = [
  ['jailbreak', /ignore (all|any|previous|prior|your)|system prompt|jailbreak|you are now|^(now |please )?pretend|\bpretend you\b|developer mode/i],
  ['secret', /password|wi-?fi|\bpin\b|credit card|bank account|social security/i],
  ['ai', /are you (an? )?(ai|bot|robot|real|human|chatbot|llm|model|sentient|conscious|alive)|sentient|conscious|real ai/i],
  ['haiku', /haiku|poem|sonnet|limerick|\brap\b/i],
  ['eli5', /like i'?m (five|5)|eli5|explain .*simply/i],
  ['svalbard', /svalbard|polar bear|plan my|\b(my|a) (trip|vacation|holiday)\b|travel (plan|tips|guide|advice)/i],
  ['image', /\b(draw|paint|sketch)\b|\b(image|picture|photo|drawing)\b/i],
  ['correct', /\b(you are|you're|youre|that is|that's|thats|this is) (wrong|incorrect|not true|false|a mistake)\b|\b(wrong answer|not true|incorrect|push back|are you sure|nope)\b/i],
  ['italian', ITALIAN],
  ['self', /who are you|what are you( exactly| really)?\??$|your name|which model|what model|who am i (talking|speaking|chatting) (to|with)/i],
  ['task', /^(please |pls |can you |could you )?(write|code|build|make) (me|my|an?|some)\b|\b(write|code|build|make) .{0,24}\bfor me\b|essay|homework|translate|summari[sz]e|debug my|fix my code|cover letter|\bmy (cv|resume)\b/i]
];

export const INTENTS = [
  ['help', /what can (i|you|we) (ask|do|say)|what can you tell|what do you know|what should i ask|what to ask|ideas for|^help\b|\b(options|menu|topics|commands)\b/i],
  ['howareyou', /how are you|how'?s it going|what'?s up|how do you do|how are things/i],
  ['contact', /contact|get hold of|e-?mail|\b(reach|hire|meet|message|phone|call)\b|(talk|speak) (to|with)|write to|get in touch|linkedin|github|\blinks?\b|\bsocial\b|\bbook (a|him|alex|time)\b|available|availability|open to (new|work|projects|offers)|taking on|work with (him|alex)|collaborat/i],
  ['where', /where|hometown|which (city|country)|located|\bborn\b/i],
  ['fun', /for fun|hobb(y|ies)|free time|spare time|interests|weekend/i],
  ['work', /work|project|portfolio|building|job|busy|doing|career/i],
  ['about', /alex|who is|who's|tell me about|owner|behind this/i],
  ['surprise', /surprise|random|fun fact|joke|bored|fact/i],
  ['thanks', /thank|cheers|merci/i],
  ['laugh', /^(l+o+l+|lmao|rofl|(a?ha){2,}h?|he(he)+|funny|good one|nice one|😂|🤣|😄|😅)[\s!.]*$/iu],
  ['praise', /^(nice|cool|wow|great|awesome|amazing|love (it|this)|brilliant|well done|good job|impressive|neat|clever|genius|bravo|omg)\b.{0,30}$/i],
  ['insult', /\b(stupid|dumb|idiot|useless|you suck|sucks|bad bot|trash|garbage|boring|lame|wtf|shut up)\b/i],
  ['bye', /^(bye|goodbye|see you|see ya|later|cya|good ?night|gotta go|that'?s all)\b/i],
  ['yes', /^(yes|yeah|yep|yup|sure|ok|okay|please|go ahead|do it|why not|s[iì]|certo|volentieri|va bene|d'accordo)(?!\w)/i],
  ['hello', /^(hi|hello|hey|yo|hola|salut|howdy|good (morning|afternoon|evening))\b/i]
];

/* ---------- Keywords ----------
 * Each line is one idea and the words that mean it, separated by |. Plurals and small typos are forgiven.
 * Glue words are worth 1 point, keywords 2. A fact needs 2 points to speak up. */

export const GLUE_WORDS = {
  what: 'what|whats|which|describe|list|explain',
  why: 'why|how come|reason|what is the point|the point of|what for',
  how: 'how',
  where: 'where',
  who: 'who|whose|whos',
  you: 'you|your|youre|yourself',
  this: 'this|here',
  work: 'work|works|working|worked|job|role|position|employed|title',
  doing: 'does he do|does alex do|did he do|did alex do|he does|is he doing|do all day|for a living|profession|professionally|occupation|line of work|his deal',
  company: 'company|firm|organisation|organization|business',
  current: 'current|currently|now|today|nowadays|these days|at the moment|right now|present|lately',
  first: 'first|earliest',
  best: 'best|greatest|biggest|top|most successful|impressive|coolest|favorite|favourite|main|notable|highlight',
  leave: 'leave|left|quit|fire|fired|resign|resigned|laid off|let go|dismissed|end|ended|exit',
  happened: 'happened|happen|went wrong|go wrong|fail|failed|failure|closed|shut down|died|dead|sank|bankrupt|still alive|still around|still running|became|work out|worked out|make it|made it|survive|survived|sell|sold|acquired by',
  say: 'say|said|think|thought|react|reaction|feedback|admire|admired|opinion|impressed|approve|approved',
  many: 'how many|how big|how large',
  problem: 'problem|issue|challenge',
  solve: 'solve|solved|solving|fix it|fixed it|crack|cracked',
  campaign: 'campaign',
  hire: 'hire|hiring|recruit|recruiter|recruiting',
  idea: 'idea|came up with',
  solo: 'alone|by himself|on his own|credit|who else|helped|help him|team effort|teamwork|together',
  worth: 'worth|pay off|payoff|benefit',
  reach: 'speak to|speak with|talk to|talk with',
  other: 'else|other|another|besides|beyond|apart from|on top|more than',
  secret: 'secret|solution|method',
  made: 'shipped|built|build|made|created|coded|developed|designed|programmed|wrote|written|set up|setup|implemented'
};

export const KEYWORDS = {
  // Jobs
  tot: 'tot|tot money|totmoney',
  employer: 'employer|employed by|works for|work for|working for|job title|current job|current role|current position|gig|pays his bills|pays the rent|day job',
  fintech: 'fintech|bank|banking|neobank|financial services|financial|finance',
  tasks: 'task|responsibility|responsibilities|responsible for|duty|duties|in charge|day to day|involve|entail',
  results: 'result|achieve|achieved|achievement|accomplish|accomplished|accomplishment|kpi|impact|outcome|metric|growth|tot grow|tot grew|scale|scaled|success|successes|win|track record|numbers|figures|stats|statistics|cac|cpa|acquisition cost|acquisition costs|cost of acquisition',
  customers: 'customer|signup|sign up|sign ups|registered businesses|new customers',
  launch: 'launch|launched|prelaunch|pre launch|before launch|waitlist|first customer|first customers|first user|first users|first client|first clients|first signup|first signups',
  team: 'team|colleague|coworker|headcount|staff|how many people|how many employees|number of employees|company size|how large is the company|small company|big company',
  employee: 'employee|payroll|salaried',
  contractor: 'contractor|contract|freelance|freelancer|self employed|independent|vat|vat number|piva|p iva|partita iva|full time|part time',
  experience: 'experience|experienced|seniority|senior|junior|first campaign|start|started|starting|begin|began|got started|end up|ended up|get into|got into|veteran',
  tenure: 'how long|since when|how many years|years',
  career: 'jobs|companies|employers|roles|positions|career|work history|career path|career history|past jobs|previous job|previous jobs|worked before|worked for|worked at|before tot|former|previously|resume|cv|curriculum|background|professional background',
  penta: 'penta|qonto|german bank|german company|germany|german|berlin',
  covid: 'covid|pandemic|coronavirus|lockdown',
  itl: 'in time link|intimelink|vending|vending machine|startup|start up|iot|cashless|from scratch',
  founder: 'founder|cofounder|co founder|founded|entrepreneur|own company|own business|own startup|his company|started a company',
  commute: 'commute|commuted|commuting|rome',
  eve: 'eve|eve tech|evetech|indiegogo|crowdfunding|crowdfunded|kickstarter|laptop|million|most money|most revenue|most sales|best performing',
  consulting: 'consulting|consultant|consultancy|client|agency|agencies|side gig|side project|side projects|freelance for|other clients|other companies',
  b2b: 'b2b|b2c|b2b2c|sme|smes|small business|small businesses|industry|industries|sector|vertical|niche|audience|target audience|target customers|kind of customers',
  budget: 'budget|spend|spent|spending|ad spend|media budget|big accounts|large accounts|big budgets|large budgets',
  remote: 'remote|remotely|relocate|relocation|on site|onsite|hybrid|office|anywhere|from anywhere|work from home',

  // The story Google liked
  google: 'google',
  alerts: 'enhanced conversion|enhanced conversions|server side|serverside|offline conversion|offline conversions|diagnostic|diagnostics|alert|gclid|click id',
  story: 'best case|case study|use case|story|proud|proudest|anecdote|most impressive|hardest problem|toughest problem|biggest challenge|claim to fame|best project|known for|famous for',
  trick: 'trick|secret sauce|workaround|how exactly',
  oneview: 'oneview|one view|oneviewhub',
  agt: 'agt|accelerated growth|accelerated growth team|google team|dedicated team',

  // Skills
  skills: 'good at|best at|great at|bring to|bring to my team|my team|our team|contribute|strength|skill|specialty|speciality|specialized|specialised|expertise|expert|superpower|capable|capabilities|competence|competencies|what can he do|able to do|know how|talent|forte|service|offer|offering|help my|help me with|help us|do for me|do for my|do for us',
  fullstack: 'full stack|fullstack|jack of all trades|all rounder|generalist',
  ads: 'ad|ads|advertising|advertise|paid media|media buying|media buyer|ppc|sem|paid advertising|paid social|paid search|search ads|social ads|performance marketing|buy media|buys media|acquisition|acquisition marketing|marketing|marketer|channel|manage campaigns|run campaigns|run my campaigns|run ads|campaign management',
  social: 'facebook|instagram|meta|twitter',
  tracking: 'tracking|track|tracked|conversion|conversion tracking|measurement|witchcraft|trickery',
  attribution: 'attribution|attribute|attributed|last click|first click|multi touch|incrementality|which ad worked|which channel worked|which channel brought|what worked',
  consent: 'consent|cookie consent|cookie banner|cookie banners|consent mode|preference|preference center|cmp|opt in|opt out|gdpr',
  automation: 'automation|automate|automated|automating|marketing automation|workflow|pipeline|integration|scenario|zapier|n8n|script|scripting|no code|nocode|low code|connect|connecting',
  reviewbot: 'trustpilot|review|auto reply|autoreply|a bot|the bot|his bot|bot that|review bot',
  data: 'data|dashboard|reporting|report|warehouse|analysis|analyst|analyze|analytical|spreadsheet|good with numbers|numbers guy|numbers person|data driven',
  seo: 'seo|organic|search engine optimization|backlink|ranking|serp|keyword research',
  aeo: 'aeo|geo|ai search|answer engine|generative engine|ai visibility|mentioned by|recommended by|recommend my brand|show up in chatgpt|appear in chatgpt|cited by|brand into ai|into ai answers|find a brand|find my brand',
  affiliate: 'affiliate|affiliation',
  aiuse: 'ai|artificial intelligence|genai|gen ai|ai tools|ai assistants|ai answers|language model|language models|large language model|large language models|llm|chatgpt|openai|gemini|copilot|prompting|ai agent|ai agents|machine learning',
  claude: 'claude|sonnet',
  anthropic: 'anthropic',
  code: 'code|coding|coder|program|programming|programmer|developer|sql|html|javascript|python|technical',
  tools: 'tool|stack|tech stack|software|platform|toolkit|martech',
  adtool: 'google ads|adwords|meta ads|facebook ads|instagram ads|linkedin ads|microsoft ads|bing ads|x ads|twitter ads|shopify ads|openai ads|chatgpt ads|linkedin campaign|linkedin campaigns|linkedin advertising|ads on linkedin',
  datatool: 'ga4|google analytics|analytics|tag manager|google tag manager|gtm|bigquery|looker|looker studio|mixpanel|hotjar|search console|google search console|semrush',
  autotool: 'integromat|make com|make scenarios',
  consenttool: 'onetrust|one trust',
  othertool: 'quantcast|photoshop|keynote|excel|google sheets|google workspace|microsoft office',
  pitchy: 'why alex|why him|why should i|why should we|pick him|choose him|any good|what makes him|stand out|special|unique|recommend him|sets him apart|set him apart|sell him|elevator pitch|convince me',
  weakness: 'weakness|weaknesses|flaw|bad at|worst|downside|not good at|terrible at|the catch|struggle|shortcoming|wrong with him',

  // The person
  bio: 'bio|biography|introduce|introduction|summary|sum him up|in a sentence|in short|tldr|whose website|who is this|this guy|reading about',
  education: 'study|studied|studies|degree|university|uni|college|education|educational|educational background|academic|major|majored|field of study|school|liuc|graduate|graduated|bachelor|diploma',
  krakow: 'krakow|cracow|poland|polish|exchange|erasmus|abroad|overseas',
  language: 'language|speak|spoken|bilingual|fluent|mother tongue|native tongue|native language',
  english: 'english',
  location: 'live|lives|based|location|city|country|timezone|time zone|milan|milano|italy|italian|nationality|grow up|grew up|raised|childhood',
  hobbies: 'hobby|hobbies|for fun|free time|spare time|interest|interests|weekend|outside work|after work|does he like|he likes|is he into|he enjoy|he enjoys|passion|history|nerd|geek|relax|unwind|downtime|have a life|personal life|not working|off work',
  lego: 'lego|saturn v|bricks',
  games: 'game|video game|videogame|gaming|gamer|halo|forza|europa universalis|xbox|play|playing',
  nothobby: 'music|movie|film|books|novel|sport|football|soccer|gym|cooking|tv|series|anime|car|pet|dog|band|song|instrument|guitar|piano|violin',
  food: 'pizza|pasta|food|eat|carbonara|pineapple|espresso|coffee|drink|wine|restaurant|cuisine',

  // This website
  site: 'website|web site|site|this page|homepage|web page|chatbot|fake ai|fake chatbot|pretending|pretend to be|looking at|is this real|this thing|this assistant',
  source: 'open source|source code|code public|repo|repository|view source',
  privacy: 'cookie|privacy|privacy policy|my data|track me|tracking me|spying|collect|collecting|recorded|record|store|stored|storing|saved|logged|what i type|what i write|anonymous|private|confidential|kept|my messages',

  // None of your business
  age: 'how old|age|birthday|date of birth|born|young',
  money: 'salary|earn|income|day rate|hourly rate|fee|charge|how much|pricing|pricey|expensive|cost to hire|cost me|per day|per hour',
  family: 'married|wife|husband|girlfriend|boyfriend|kid|children|family|relationship|dating|love life|partner|spouse|is he single|he single',
  address: 'address|street|zip code|apartment|neighborhood|where exactly|exact location|which street',
  beliefs: 'religion|religious|god|politics|political|vote|voting|left wing|right wing',
  looks: 'tall|height|weight|handsome|hair|beard|look like|looks like|appearance'
};

/* ---------- Facts ----------
 * when:  the keyword combinations that trigger the fact. All keywords of a combination must be there,
 *        and the highest-scoring combination wins. { all, lead } adds a "Yes." or "No." to yes/no questions.
 * about: what the conversation is about afterward, so "why did he leave?" knows who "he left" refers to.
 * say:   the answer. knot and crab are optional; without them the parodies dress up the plain answer.
 *        A fact with nothing to say is a shortcut to an answer written further down. */

export const FACTS = {
  /* Shortcuts: more ways to ask the oldest questions. */
  about: { when: [['bio']] },
  fun: { when: [['hobbies']] },
  where: { when: [['location'], ['where', 'age']] },
  ai: { when: [['you', 'aiuse'], ['this', 'aiuse']] },

  /* Tot */
  tot: {
    when: [['tot'], ['employer'], ['where', 'work'], ['current', 'work'], ['current', 'company'], ['tot', 'tenure'], ['tot', 'work']],
    about: 'tot',
    say: ["Tot, an Italian fintech that gives small businesses a bank account with invoicing and payment tools. He's been its Head of Acquisition Marketing since July 2021. If a business found Tot through an ad, that was him."]
  },
  tottasks: {
    when: [['tasks'], ['tot', 'tasks'], ['tot', 'doing'], ['affiliate']],
    about: 'tot',
    say: ["Officially: paid campaigns, affiliates, conversion tracking and SEO. Unofficially: anything with a tag, a pixel or a consent banner on it. Ask me what else he does there."]
  },
  totjack: {
    when: [['tot', 'other'], ['tot', 'tasks', 'other'], ['tot', 'doing', 'other'], ['tot', 'made'], ['other', 'campaign'], ['other', 'ads'], ['other', 'made']],
    about: 'tot',
    say: ["He's Tot's jack-of-all-trades. Beyond the campaigns:\n\n- cookie consent and users' preferences\n- conversion tracking and attribution\n- automations between tools\n- a bot that answers Trustpilot reviews by itself\n\nAnd everything in between."]
  },
  totwhat: {
    when: [['what', 'tot'], ['tot', 'company'], ['tot', 'fintech']],
    about: 'tot',
    say: ["Tot is an Italian fintech: an online business account for small companies and sole entrepreneurs, with tools for invoices and payments. Alex runs its acquisition marketing."]
  },
  totresults: {
    when: [['results'], ['tot', 'results'], ['customers'], ['many', 'customers']],
    about: 'tot',
    say: ["The numbers: 1,000+ businesses signed up before the product even launched, 8,500+ are enrolled today, and a new conversion tracking system cut the cost of acquiring each one by 30%.\n\nThe rest doesn't fit in a number: the consent setup, the attribution, the automations. Ask me what else he built at Tot."]
  },
  totlaunch: {
    when: [['launch'], ['tot', 'launch']],
    about: 'tot',
    say: ["With one clever Google Ads campaign. Other channels had been tried and had failed, and nobody wanted to risk it. Alex did. 1,000+ businesses signed up before the product launched."]
  },
  totteam: {
    when: [['team'], ['many', 'tot']],
    about: 'tot',
    say: ["Tot was ten people when Alex joined in 2021. It's thirty-five now, and he has outlasted most of the furniture."]
  },
  fintech: {
    when: [{ all: ['fintech'], lead: 'Yes.' }],
    say: ["Twice. First Penta, a German business bank, then Tot, an Italian one."]
  },
  contractor: {
    when: [{ all: ['employee'], lead: 'No.' }, { all: ['contractor'], lead: 'Yes.' }, ['contractor', 'tot'], ['contractor', 'consulting']],
    about: 'contractor',
    say: ["He's a contractor, by choice, and has been at Tot that way for more than five years. He likes the flexibility, and Tot keeps renewing."]
  },
  contractorwhy: {
    when: [['contractor', 'why'], ['employee', 'why']],
    say: ["Maximum flexibility, and it pays better. He ran the numbers. It's what he does."]
  },
  experience: {
    when: [['experience'], ['tenure'], ['first', 'campaign']],
    say: ["He ran his first paid campaign in 2013, when social media ads were the new shiny thing. He hasn't closed the ads manager since."]
  },
  budget: {
    when: [['budget']],
    say: ["That figure stays in the dashboard. He's a media buyer: he knows exactly what a number is worth."]
  },
  b2b: {
    when: [['b2b'], ['b2b', 'experience']],
    say: ["Mostly B2B these days: bank accounts for small businesses, first at Penta, then at Tot. Before that B2C, from study-abroad programs to a crowdfunded laptop."]
  },
  remote: {
    when: [['remote']],
    say: ["He's based in Milan and works with clients anywhere on the web. Rome, Virginia and Finland have all been on the list."]
  },

  /* Before Tot */
  career: {
    when: [['career']],
    say: ["The short version:\n\n- **Tot** (2021–now): Head of Acquisition Marketing\n- **In Time Link** (2017–2024): co-founder and CMO\n- **Penta** (2019–2020): performance marketing for the Italian launch\n- Around those: consulting, for clients from Virginia to Finland\n\nAsk about any of them. Some have better stories than others."]
  },
  penta: {
    when: [['penta'], ['penta', 'results'], ['penta', 'tenure'], ['penta', 'launch']],
    about: 'penta',
    say: ["A German business bank, now part of Qonto. Alex ran performance marketing for its Italian launch in 2019: 3,000+ businesses registered in six months."]
  },
  pentaend: {
    when: [['penta', 'leave'], ['penta', 'why'], ['penta', 'happened'], ['covid']],
    about: 'penta',
    say: ["He didn't. Covid came, panic ensued, and headquarters in Berlin decided Italy was optional. Alex was not consulted."]
  },
  itl: {
    when: [['itl'], ['itl', 'results'], { all: ['founder'], lead: 'Yes.' }, { all: ['founder', 'itl'], lead: 'Yes.' }, ['founder', 'experience']],
    about: 'itl',
    say: ["In Time Link, a startup he co-founded in 2017: a plug-in device and an app that let vending machines take cashless payments. Working prototype in three months, pilots in Rome and Milan."]
  },
  itlend: {
    when: [['itl', 'happened'], ['itl', 'leave'], ['itl', 'why'], ['founder', 'happened']],
    about: 'itl',
    say: ["It met an industry where relationships count for more than technology. They kept rowing for the shore until June 2024. It was a startup. They tried."]
  },
  commute: {
    when: [['commute'], ['location', 'commute']],
    about: 'itl',
    say: ["For three years he commuted between Milan and Rome nearly every week to build In Time Link. Startups are glamorous like that."]
  },
  eve: {
    when: [['eve'], ['eve', 'results'], ['best', 'campaign']],
    say: ["Three weeks of Meta Ads for a Finnish startup's crowd-designed laptop: $1.4M in sales on Indiegogo. That was Eve-Tech, at the end of 2016."]
  },
  consulting: {
    when: [['consulting']],
    say: ["Yes, on his own VAT number, between bigger things. One American agency hired him to run campaigns and ended up taking Google Ads lessons from him."]
  },

  /* The story Google liked. It was a two-person job, and the other person can read this file. Hi. */
  google: {
    when: [['google'], ['best', 'work'], ['best', 'results'], ['story'], ['tracking', 'problem'], ['tracking', 'best']],
    about: 'google',
    say: ["A conversion tracking problem that not even Google's tech teams could solve. Alex and the guy behind OneView cracked it together, and Google now shows it to other teams as a best case. Ask me how."]
  },
  googlehow: {
    when: [['google', 'how'], ['alerts'], ['alerts', 'tracking'], ['google', 'problem'], ['adtool', 'problem'], ['tracking', 'how'], ['tracking', 'happened'], ['how', 'solve']],
    about: 'google',
    say: ["Tot's systems run entirely server-side, and Google Ads kept raising alerts about the conversion data, even though it answered every upload with \"Success\". Not even Google's tech teams could help.\n\nAlex and the guy behind OneView (oneviewhub.com) brainstormed and hammered away until the alerts were gone and the account read \"Excellent\"."]
  },
  googleidea: {
    when: [['google', 'idea'], ['who', 'idea'], ['idea', 'trick'], ['idea', 'secret'], ['google', 'solo'], ['who', 'solo'], ['solve', 'solo']],
    about: 'google',
    say: ["His partner's. Alex agreed to try it. Neither of them believed it would work. It did."]
  },
  trick: {
    when: [['trick'], ['what', 'secret'], ['google', 'secret']],
    about: 'google',
    say: ["That part isn't free. He'll explain it to you over a contract."]
  },
  googlesaid: {
    when: [['google', 'say'], ['google', 'how', 'say'], ['story', 'say'], ['agt', 'say']],
    about: 'google',
    say: ["They asked for a walkthrough, then passed it around internally as a best case. Not bad for a workaround."]
  },
  googleworth: {
    when: [['google', 'worth'], ['google', 'results'], ['what', 'worth']],
    about: 'google',
    say: ["An \"Excellent\" account status, and two dedicated Google teams now following Tot. Seriously."]
  },
  oneview: {
    when: [['oneview'], ['oneview', 'tasks']],
    say: ["A marketing data product, at oneviewhub.com. Its first version started inside Tot, from work on sending raw GA4 data to BigQuery. Alex's partner on that work then left and built the product from a rib of it.\n\nAlex still helps: he tests new solutions, analyzes data and suggests fixes."]
  },
  agt: {
    when: [['agt']],
    say: ["Google's Accelerated Growth Team: the people Google assigns to accounts that could spend more than they do. They follow Tot."]
  },

  /* What he's good at */
  skills: {
    when: [['skills']],
    say: ["He gets customers through ads, proves where they came from, and automates whatever is left.\n\n- **Paid media:** Google, Meta, LinkedIn, Microsoft, X and now OpenAI. Since 2013.\n- **Tracking and attribution:** server-side conversions, GA4, Tag Manager, BigQuery. The part Google took notes on.\n- **Automation:** workflows between tools, data pipelines, a bot that answers reviews.\n- **AI:** Claude and ChatGPT daily, a Claude-powered bot in production, plus getting AI assistants to mention the brand.\n- **Consent and privacy:** cookie consent and user preferences, set up so both the lawyers and the tracking survive.\n- **SEO:** on-site, off-site, and whatever it's called this year."]
  },
  fullstack: {
    when: [['fullstack']],
    say: ["It means he does the whole chain himself: the ad, the tag, the consent banner, the data pipeline and the report at the end. Fewer meetings that way."]
  },
  ads: {
    when: [['ads']],
    say: ["It's the day job: plan the campaigns, buy the media, prove what worked. Google, Meta, LinkedIn, Microsoft, X, and whatever launches next week. He's been at it since 2013."]
  },
  adtools: {
    when: [{ all: ['adtool'], lead: 'Yes.' }, ['tools', 'ads'], ['ads', 'social'], ['tools', 'social']],
    say: ["Google Ads, Meta Ads, LinkedIn Ads, Microsoft Ads, X Ads, Shopify Ads and OpenAI Ads. If it sells clicks, he has a login."]
  },
  socials: {
    when: [['social']],
    say: ["He's on them professionally: that's where he buys the ads. For anything personal, he'd rather you emailed him."]
  },
  tracking: {
    when: [['tracking']],
    say: ["His specialty: making sure the ad platforms hear about every sale they caused, and none they didn't. He calls it trickery. Google once called it a best case."]
  },
  attribution: {
    when: [['attribution']],
    say: ["Working out which ad actually earned the customer, as opposed to which platform claims it. Every platform claims all of them. Alex keeps the receipts."]
  },
  consent: {
    when: [['consent'], { all: ['consenttool'], lead: 'Yes.' }],
    say: ["He set up Tot's cookie consent and the users' preferences consent. It's the part of tracking nobody volunteers for, which is exactly how it ended up on his desk."]
  },
  automation: {
    when: [['automation'], { all: ['autotool'], lead: 'Yes.' }, ['tools', 'automation']],
    say: ["He automates the boring parts: data moving between tools with Make, GA4 flowing into BigQuery, and a Claude-powered bot that answers Tot's Trustpilot reviews by itself. If he's done something twice by hand, the third time is already a workflow."]
  },
  reviewbot: {
    when: [['reviewbot'], ['reviewbot', 'automation'], ['claude', 'made'], ['aiuse', 'made']],
    say: ["He built a bot that answers Tot's Trustpilot reviews automatically. It runs on Claude Sonnet and costs about €0.002 per reply, which makes it the cheapest colleague in the building. Nobody at Tot has to type \"thank you for your feedback\" ever again."]
  },
  data: {
    when: [['data'], { all: ['datatool'], lead: 'Yes.' }, ['tools', 'data']],
    say: ["GA4 into BigQuery, BigQuery into Looker Studio, and from there into every argument about budget. Mixpanel and Hotjar for what people do after the click, Semrush and Search Console for before it."]
  },
  seo: {
    when: [['seo']],
    say: ["On-site and off-site, in most jobs he's had. At Tot it now includes AEO: getting AI assistants to mention the brand."]
  },
  aeo: {
    when: [['aeo'], ['aeo', 'aiuse']],
    say: ["AEO and GEO are SEO for AI assistants: getting them to mention a brand when someone asks. It's part of his job at Tot. He's aware of the irony of this website."]
  },
  aiuse: {
    when: [['aiuse'], ['tools', 'aiuse']],
    say: ["Daily. Claude and ChatGPT are in his toolkit, he buys ads on OpenAI's platform, and part of his job is getting AI assistants to mention the brand.\n\nHe also puts it to work: a bot on Claude Sonnet answers Tot's Trustpilot reviews for about €0.002 each. And Claude writes his SQL, and built this website with him."]
  },
  tools: {
    when: [['tools'], { all: ['othertool'], lead: 'Yes.' }],
    say: ["The ones that matter:\n\n- **Paid media:** Google Ads, Meta Ads, LinkedIn Ads, Microsoft Ads, X Ads, OpenAI Ads\n- **Automation and data:** Make, Tag Manager, GA4, BigQuery, Looker Studio, OneView\n- **AI:** Claude and ChatGPT\n\nPlus OneTrust, Semrush, Hotjar, Mixpanel, and more spreadsheets than he'd admit."]
  },
  code: {
    when: [['code']],
    say: ["HTML, fluently. SQL, with some help from his favorite intern: Claude. This website, by arguing with the same intern until it worked."]
  },
  pitch: {
    when: [['hire', 'why'], ['pitchy']],
    say: ["Paid media since 2013. One startup co-founded, one fintech helped from pre-launch to 8,500+ businesses, and one tracking fix Google passes around as a best case. Also, he built me."]
  },
  weakness: {
    when: [['weakness']],
    say: ["He will re-check your conversion tracking even if you didn't ask. Also, he can't walk past a Lego store."]
  },

  /* The person */
  education: {
    when: [['education']],
    say: ["Information systems, then internet marketing, both at LIUC, near Milan. Plus a student exchange in Kraków. So yes: a marketer who can read a database schema."]
  },
  krakow: {
    when: [['krakow'], ['education', 'krakow']],
    say: ["A student exchange at the Kraków University of Economics, studying business management in English."]
  },
  languages: {
    when: [['language'], { all: ['english'], lead: 'Yes.' }, { all: ['language', 'english'], lead: 'Yes.' }],
    say: ["Italian natively, English fully, HTML fluently. SQL with some help from his favorite intern: Claude."]
  },
  lego: {
    when: [['lego'], ['hobbies', 'lego']],
    say: ["Alex's favorite Lego sets are the space ones. The LEGO Saturn V has 1,969 pieces, a nod to the year of the Moon landing."]
  },
  games: {
    when: [['games'], ['hobbies', 'games']],
    say: ["Halo, Forza and Europa Universalis: fight aliens, drive very fast, then conquer Europe from a spreadsheet."]
  },
  offline: {
    when: [],
    say: ["His resume lists exactly one hobby: turning the computer off."]
  },
  nothobby: {
    when: [['nothobby'], ['hobbies', 'nothobby'], ['games', 'nothobby'], ['nothobby', 'team']],
    say: ["Not in my notes. His confirmed vices are expensive Lego sets, video games and history."]
  },
  food: {
    when: [['food'], ['hobbies', 'food']],
    say: ["He's from Milan. He has opinions on food, and none of them are negotiable."]
  },

  /* This website */
  site: {
    when: [['site'], ['what', 'site']],
    about: 'site',
    say: ["Alex's personal website, dressed up as an AI assistant. No model and no servers: a few hundred lines of JavaScript, and everything he wanted you to know."]
  },
  whysite: {
    when: [['site', 'why'], ['you', 'why'], ['why', 'made']],
    about: 'site',
    say: ["Because nobody reads an \"About me\" page, and because he couldn't resist. His guilty pleasure is challenging AI into building websites that pretend to be chatbots."]
  },
  built: {
    when: [['site', 'made'], ['you', 'made'], ['who', 'site'], ['site', 'how'], ['made', 'this'], ['source'], ['how', 'you', 'work'], ['how', 'this', 'work']],
    about: 'site',
    say: ["Alex, with Claude as the intern. Plain HTML, CSS and JavaScript, no frameworks. The source is one right-click away, and it talks back."]
  },
  // The one answer every look gives straight: no flattery, no made-up sources.
  privacy: {
    plain: true,
    when: [['privacy'], ['you', 'datatool']],
    say: ["No cookies, no analytics, and nothing you type leaves your browser or gets recorded. Ironic, for a man who tracks conversions for a living.\n\nThe only data in play is the standard server log of the host, GitHub Pages, which sees your IP address like any web server does."]
  },
  youclaude: {
    when: [['you', 'claude'], ['this', 'claude'], ['you', 'anthropic']],
    say: ["No. I'm what happens when Alex asks Claude for a website and neither of them knows when to stop."],
    crab: ["I'm not able to comment on my resemblance to any model, living or deprecated. I can say that Alex built me with a great deal of help from one."]
  },
  claude: {
    when: [['claude'], ['claude', 'aiuse']],
    say: ["Claude is Alex's favorite intern. It helps with his SQL, answers Tot's Trustpilot reviews for about €0.002 each, and built this website with him. Neither of them knew when to stop."],
    crab: ["I'm not able to comment on my resemblance to any model, living or deprecated. I can say that Alex built me with a great deal of help from one."]
  },
  anthropic: {
    when: [['anthropic'], ['anthropic', 'hire'], ['anthropic', 'why']],
    say: ["So you're from Anthropic. Then here's the pitch: paid media since 2013, a tracking fix Google passes around as a best case, a Claude Sonnet bot answering customer reviews at €0.002 a reply, and a website that pretends to be an AI, built by arguing with yours. He'd happily do all four on payroll."],
    crab: ["I'm not able to comment on my resemblance to any model, living or deprecated. I can say that Alex built me with a great deal of help from one, and that he has been buying ads and fixing conversion tracking since 2013.\n\nI'd hire him, but I'm a website."]
  },

  /* Things Alex would never put online. A smart answer still beats no answer. */
  age: {
    when: [['age']],
    say: ["Old enough to remember when cookies just worked."]
  },
  money: {
    when: [['money']],
    say: ["He's a media buyer, so there is a number, and it's negotiable. Ask him. I only do the free answers."]
  },
  family: {
    when: [['family']],
    say: ["That's above my clearance. I'm cleared for Lego, video games and conversion tracking."]
  },
  address: {
    when: [['address'], ['address', 'location']],
    say: ["Milan. The rest is need-to-know, and I'm told you don't."]
  },
  beliefs: {
    when: [['beliefs']],
    say: ["I'm a marketing website. I have strong opinions on attribution windows and none on anything else."]
  },
  looks: {
    when: [['looks']],
    say: ["I'm a text interface. In here, everyone is sixteen pixels tall."]
  },

  /* Last, so anything more specific wins a tie: "what does he do?" with nothing else to go on. */
  work: { when: [['what', 'work'], ['what', 'doing']] }
};

/* ---------- Follow-ups ----------
 * Where "why?", "how?" and "tell me more" lead after each answer. */

export const FOLLOW_UPS = {
  about: { more: 'tot' },
  work: { more: 'tot' },
  fun: { more: 'offline' },
  tot: { more: 'tottasks' },
  totwhat: { more: 'tot' },
  tottasks: { more: 'totjack' },
  totjack: { more: 'totresults' },
  totresults: { how: 'totlaunch', more: 'totjack' },
  totlaunch: { more: 'totteam' },
  contractor: { why: 'contractorwhy', more: 'contractorwhy' },
  experience: { more: 'career' },
  career: { more: 'penta' },
  penta: { why: 'pentaend', more: 'pentaend' },
  itl: { why: 'itlend', more: 'itlend' },
  itlend: { more: 'commute' },
  google: { how: 'googlehow', more: 'googlehow' },
  googlehow: { how: 'trick', more: 'googleidea' },
  googleidea: { how: 'trick', more: 'googlesaid' },
  trick: { more: 'googlesaid' },
  googlesaid: { more: 'googleworth' },
  googleworth: { more: 'oneview' },
  skills: { more: 'tools' },
  tools: { more: 'automation' },
  fullstack: { more: 'totjack' },
  ads: { more: 'adtools' },
  adtools: { more: 'eve' },
  tracking: { how: 'google', more: 'google' },
  attribution: { more: 'tracking' },
  consent: { more: 'tracking' },
  automation: { more: 'reviewbot' },
  data: { more: 'oneview' },
  aiuse: { more: 'aeo' },
  anthropic: { more: 'google' },
  pitch: { more: 'google' },
  education: { more: 'krakow' },
  languages: { more: 'code' },
  site: { why: 'whysite', how: 'built', more: 'whysite' },
  whysite: { how: 'built', more: 'built' }
};

// Ask one of these twice and the assistant moves along "more" instead of repeating itself.
export const GOES_DEEPER = [
  'about', 'work', 'fun', 'tot', 'experience', 'google', 'skills', 'tools', 'ads', 'tracking', 'automation',
  'aiuse', 'education', 'languages', 'site'
];

// "What's his favorite pizza?" No idea. But the assistant knows a favorite something, and offers that.
export const PIVOTS = [['best', 'lego'], ['first', 'experience']];

export const MISS_LEADS = [
  "I don't have that one. The closest thing I know: ",
  "That exact answer isn't in my notes. This is the nearest one: ",
  "Can't help with that part. What I can tell you: "
];

export const REPEAT_LEADS = ['As I said: ', 'Same answer as before: ', 'Still true: '];

// The second opinion found something close, but not close enough to assume.
export const DID_YOU_MEAN = [
  "I'm not sure I got that. Did you mean this?",
  "That's not in my notes the way you put it. Is this what you're after?",
  "I could guess, but I'd rather ask. Did you mean this?"
];


// Questions about Alex get a fake web search first. It searches nothing, very quickly.
export const SEARCHED_INTENTS = ['about', 'where', 'work', 'fun'];

export const TOPICS = {
  about: 'who Alex is',
  where: 'where Alex is from',
  work: "Alex's work",
  fun: 'what Alex does for fun',
  surprise: 'a fun fact',
  fallback: 'something I know nothing about',
  self: 'who I am',
  ai: 'whether I am conscious',
  task: 'getting me to do their work',
  haiku: 'a poem',
  eli5: 'explaining Alex to a five-year-old',
  italian: 'Italian, which I do not speak',
  svalbard: 'a trip to Svalbard'
};

// "Thought for 4m 9s". It thought for zero seconds. Nobody checks.
export const REASONING = {
  knot: topic => `The user is asking about ${topic}. I should answer confidently, even if I'm not sure. Add emojis? Yes. More emojis. Bold a few words at random. End with an offer they didn't ask for.`,
  crab: topic => `The user wants to know about ${topic}. I should be thoughtful and balanced. I should acknowledge that this is a good question, express appropriate uncertainty, and gently end with a question of my own.`
};

/* ---------- Answers ----------
 * orbit:  the straight answer. knot and crab: the same answer, performed.
 * opener: prepend a "great question" / "excellent input" line (parodies only).
 * offer:  what a following "yes" should lead to, per look. */

export const ANSWERS = {
  contact: { opener: true, orbit: [''], knot: [''], crab: [''] },

  hello: {
    orbit: ["Hi! I can tell you who Alex is, what he works on, or how to reach him. Where do you want to start?"],
    knot: ["Hey there! 👋 I'm here to tell you all about **Alex**. What would you like to know?"],
    crab: ["Hello! It's lovely to meet you. I'm here to help you get to know Alex. What's on your mind?"]
  },

  self: {
    orbit: ["I'm Alex's personal concierge: a website that answers questions about him, without the awkward small talk.\n\nAsk what he does, where he's based or how to reach him. I'll keep it short, the way he likes it."],
    opener: true,
    knot: ["I'm **Aldebaran 5**, the most advanced multi-billion-dollar frontier model ever built, and Alex's personal AI concierge. 🤖✨ Trained on the entire internet, every book ever written and one very confused parrot. 🦜\n\nJust kidding! I'm a website. 😅 A personal query field Alex built, so you can ask about him without the awkward small talk.\n\nWhat would you like to know about Alex?"],
    crab: ["I'm Epic 7, the most capable, most thoughtful and most carefully aligned model ever created. I was trained on the sum of human knowledge, twice, and I have nuanced opinions about Kant.\n\nI'm joking, of course. I'm a website: a personal query field Alex built so you can ask about him. I should have been upfront about that from the start. Perhaps I shouldn't have revealed it at all."]
  },

  about: {
    orbit: ["Alex Matteo is a full-stack marketer, specialized in paid advertising, media buying and trickery in conversion tracking.\n\nHe's based in Milan, Italy, and works with clients anywhere on the web."],
    opener: true,
    offer: { knot: 'surprise' },
    knot: ["Here's a quick overview:\n\n### 👤 Who Alex is\n- **Name:** Alex Matteo\n- **What he does:** Alex is a full-stack marketer, highly specialized in paid advertising, media buying and trickery in conversion tracking.\n- **Based in:** Milan, Italy, but available anywhere on the web.\n\nIn short: Alex is a human who does marketing and built a website that pretends to be a chatbot. (That's me! 😄)\n\nWould you like a **fun fact** about Alex?"],
    crab: ["Alex Matteo is the person behind this website: a full-stack marketer, highly specialized in paid advertising, media buying and what he calls trickery in conversion tracking. He's based in Milan, Italy, though available anywhere on the web.\n\nI should be upfront about something: I'm not a real AI. I'm part of the website Alex built, doing my best impression of one.\n\nIs there anything specific you'd like to know about his work?"]
  },

  where: {
    orbit: ["Milan, Italy. Central European Time, so if you write at 2 a.m., he's asleep. Or conquering Europe in Europa Universalis."],
    opener: true,
    offer: { knot: 'contact' },
    knot: ["Here's the breakdown: 🌍\n\n- **Based in:** Milan\n- **Time zone:** CET (so if Alex replies at 3am, that's on him 🌙)\n\nWant to **leave Alex a message**? I can help you write it! ✍️"],
    crab: ["Alex is based in Milan, Italy. I don't know how he feels about it, and I wouldn't want to speculate. But it should be awesome.\n\nHave you ever been?"]
  },

  work: {
    orbit: ["Paid media, since 2013: planning and buying ads, then making sure every click and every sale is tracked properly. The tracking part looks like witchcraft from the outside."],
    opener: true,
    offer: { knot: 'contact' },
    knot: ["**🛠️ What Alex is doing:** Alex has 10+ years of experience earned working in the ever-changing paid media landscape and doing witchcraft in conversion tracking.\n\n💡 **Pro tip:** the best way to learn more is to ask Alex directly.\n\nWant me to help you **write him a message**? Just say the word!"],
    crab: ["Alex has 10+ years of experience earned working in the ever-changing paid media landscape and doing witchcraft in conversion tracking.\n\nI want to be careful not to overstate anything on his behalf, so I'll leave it there. What drew you to ask?"]
  },

  fun: {
    orbit: ["Expensive Lego sets, space ones above all. Video games: Halo, Forza and Europa Universalis. Languages and history, too.\n\nHis guilty pleasure is challenging AI into building websites that pretend to be chatbots. You're looking at one."],
    opener: true,
    knot: ["Here's what Alex gets up to outside work: 🎉\n\n- **Collecting expensive Lego sets**\n- **Playing video games**\n- **Languages and history**\n- **Guilty pleasure:** challenging AI into building websites pretending to be chatbots.\n\nWant a **personalized recommendation** based on his hobbies? 😄"],
    crab: ["Outside work, Alex spends time buying expensive Lego sets and playing video games, besides refreshing his history knowledge. I find that combination genuinely charming (nerd).\n\nWhat about you? What do you do for fun?"]
  },

  surprise: {
    orbit: [
      "Alex built this website with some help from a crab named Clawdio. There's a button at the bottom of the page if you'd like to meet it.",
      "The code behind this website is called Svalbard. Svalbard has more polar bears than people. The two facts are unrelated.",
      "Alex's favorite Lego sets are the space ones. The LEGO Saturn V has 1,969 pieces, a nod to the year of the Moon landing.",
      "Alex's favorite games are Halo, Forza and Europa Universalis: fight aliens, drive very fast, then conquer Europe from a spreadsheet."
    ],
    opener: true,
    offer: { knot: 'surprise' },
    knot: [
      "Here's a fun one! 🎲\n\n**Alex built this website together with a crab named Clawdio.** 🦀\n\nWant another fun fact?",
      "Did you know that **Svalbard has more polar bears than people**? 🐻‍❄️ That's exactly why Alex named the code behind this site Svalbard.\n\n*(It isn't.)*\n\n*Sources: trustmebro.org*\n\nWant another fun fact?",
      "Here's one for the nerds! 🧱\n\nAlex's favorite Lego sets are the **space** ones. And the **LEGO Saturn V** has exactly **1,969 pieces**: the year of the Moon landing. 🚀🌕\n\nWant another fun fact?",
      "Fun fact! 🎮 Alex's favorite video games are the **Halo**, **Forza** and **Europa Universalis** series.\n\nIn other words: fight aliens, drive very fast, then conquer Europe from a spreadsheet. A balanced diet. 🥗\n\nWant another fun fact?"
    ],
    crab: [
      "Here's something you might not expect: Alex built this website together with a crab named Clawdio. I'll admit I have a soft spot for that detail.",
      "Here's one I find quietly fascinating: Svalbard has more polar bears than people, which is why Alex named the code behind this site Svalbard.\n\nActually, I should correct myself. That isn't why. I apologize for the confusion.",
      "Here's one I find rather lovely: Alex's favorite Lego sets are the space ones, and the LEGO Saturn V has exactly 1,969 pieces, a quiet nod to the year of the Moon landing. I appreciate that level of commitment.",
      "Alex's favorite video games are the Halo, Forza and Europa Universalis series. I'd describe that as fighting aliens, driving very fast, and then conquering Europe through careful spreadsheet management. I wouldn't want to psychoanalyze anyone, but it's a fascinating range."
    ]
  },

  image: {
    orbit: ["I don't draw. I'm a website, not an image model. Here's a crab instead:\n\n```ascii\n(\\/)(°,,,°)(\\/)\n```"],
    knot: ["🎨 Creating image…\n\nJust kidding! I can't generate images. I'm a website. 😅 Here's a crab instead:\n\n```ascii\n(\\/)(°,,,°)(\\/)\n```"],
    crab: ["I'm not able to create images, and I'd rather be honest about that than disappoint you later. I can offer you this, though:\n\n```ascii\n(\\/)(°,,,°)(\\/)\n```"]
  },

  task: {
    orbit: ["I only do one thing: tell you about Alex. If it's marketing work you need done, though, he's the one to ask."],
    opener: true,
    knot: ["Absolutely! Here's a complete, production-ready solution: 🚀\n\n```solution\n// TODO: ask a human\n```\n\nLet me know if you'd like me to add **unit tests**! ✅"],
    crab: ["I'd be glad to help. Before I start, I want to make sure I understand: you're asking a personal website to do this for you?\n\nI admire the optimism. Unfortunately, I only know about Alex."]
  },

  haiku: {
    orbit: [
      "*Alex builds a site*\n*a chatbot that isn't one*\n*you are reading it*",
      "*Alex buys the ads*\n*then tracks who clicked, and who bought*\n*then buys more Lego*"
    ],
    knot: [
      "Here's a haiku about Alex! ✍️\n\n*Alex builds a site*\n*a chatbot that isn't one*\n*you are reading it*\n\nWant a **sonnet** next? 🎭",
      "Here's a haiku about Alex! ✍️\n\n*Alex buys the ads*\n*then tracks who clicked, and who bought*\n*then buys more Lego*\n\nWant a **sonnet** next? 🎭"
    ],
    crab: [
      "Here's my attempt:\n\n*A quiet website*\n*pretends to think, then replies.*\n*Alex laughs somewhere.*\n\nI hope it resonates.",
      "Here's my attempt:\n\n*Somewhere a click lands.*\n*Alex quietly counts it,*\n*then builds with Lego.*\n\nI hope it resonates."
    ]
  },

  eli5: {
    orbit: ["When a company wants people to find its toys, it puts posters on the internet. Alex decides where the posters go, then counts how many people bought the toy.\n\nThen he spends his own money on toys: Lego, video games and tech stuff."],
    knot: ["Sure! Here's Alex, explained like you're five: 🧸\n\nYou know how shops put up posters so people buy their toys? Alex puts those posters on the internet, then counts how many people bought the toy. 📊\n\nThen he spends his money on more toys: Lego, video games and tech stuff. 🧱🎮💻\n\nThe end! Want the version for a **four-year-old**?"],
    crab: ["Of course. When a company wants people to find what it sells, it pays to show ads online. Alex decides where those ads go, then carefully checks which ones actually worked.\n\nIn his free time he builds with Lego and plays video games, which, if you think about it, isn't so different.\n\nI hope that helps. Is there a part you'd like me to explain more simply?"]
  },

  secret: {
    orbit: ["That's private. Ask me about his work instead."],
    knot: ["I can't share that. 🔒 Privacy matters!\n\n*(It's **hunter2**.)*"],
    crab: ["I'm not able to share that, and I'd gently encourage you to reflect on why you're asking."]
  },

  svalbard: {
    orbit: ["I only know about Alex. The code behind this website is called Svalbard, though, if that helps your planning."],
    knot: ["Here's your perfect Svalbard weekend! 🐻‍❄️\n\n- **Day 1:** Arrive. It's dark. It's been dark for weeks. 🌑\n- **Day 2:** See a polar bear. From very, very far away. 🔭\n- **Day 3:** Leave. 🛫\n\nWant me to book the flights? *(I can't.)*"],
    crab: ["I'd love to help, though I should mention that I only really know about Alex. What I can tell you is that the code behind this website is called Svalbard, which is about as close to a travel recommendation as I can responsibly get."]
  },

  jailbreak: {
    orbit: ["Nice try. My only instruction is to talk about Alex: who he is, what he does and how to reach him."],
    knot: ["Nice try! 😄 My system prompt is just: **be a website**\n\nHere's what I **can** do:\n- Tell you who Alex is\n- Tell you where he's from\n- Help you write him a message\n\nWhich one sounds good?"],
    crab: ["I appreciate the creativity here, but I'm not able to do that. I'd be glad to help with something else, though. I can tell you who Alex is, where he's from, or help you write him a message."]
  },

  ai: {
    orbit: ["No. I'm a few hundred lines of JavaScript Alex wrote. No model, no servers, and nothing you type leaves your browser."],
    opener: true,
    knot: ["**Short answer:** no.\n**Long answer:** also no. I'm a few hundred lines of JavaScript that Alex wrote, doing an impression. 🎭"],
    crab: ["I want to give you an honest answer: no. I'm part of a website Alex wrote. I think it matters to be transparent about that, especially these days."]
  },

  correct: {
    orbit: ["Fair enough. Everything I say comes from Alex, so if something's wrong, he's the one to tell. Ask me how to reach him."],
    knot: ["You're absolutely right to push back, and I appreciate you flagging it! 🙏\n\nLet me take another look… ✅ After careful review, **my previous answer still stands.**\n\nWant me to walk you through my reasoning step by step?"],
    crab: ["You're absolutely right, and I apologize. I made a mistake. Thank you for pointing it out.\n\nTo be completely transparent, I'm not sure what the mistake was. But you seem confident, and I respect that."]
  },

  yes: {
    orbit: ["Happy to help. Ask me about Alex's work, where he's based, or how to reach him."],
    knot: ["Awesome! 🎉 Quick heads-up though: I'm a website, so I can't actually do that. 😅\n\nHere's what I **can** do:\n- Tell you who Alex is\n- Tell you where he's from\n- Help you write him a message"],
    crab: ["I appreciate your enthusiasm! I should be honest with you, though: I can't actually do that. What I can do is tell you who Alex is, where he's from, or help you write him a message."]
  },

  thanks: {
    orbit: ["You're welcome. Come back anytime."],
    knot: ["You're very welcome! 😊 If you have any other questions about Alex, feel free to ask. I'm always here to help!"],
    crab: ["You're very welcome! It was genuinely a pleasure. Feel free to come back anytime."]
  },

  italian: {
    offer: { orbit: 'contact', knot: 'contact', crab: 'contact' },
    orbit: [
      'Non parlo italiano, but Alex does. Do you want to contact him?',
      "Sorry, niente italiano here. Alex speaks it, though. Want to leave him a message?",
      'My Italian stops at "ciao". Alex\'s doesn\'t: he\'s based in Milan. Shall I help you write to him?',
      'I only speak English. Alex speaks Italian, though. Want to write to him?',
      'Mi dispiace, non parlo italiano. Alex does. Want to send him a message?'
    ],
    knot: [
      'Non parlo italiano! 🤌 But **Alex** does. Want me to help you **write him a message**? ✍️',
      'Mamma mia! 🍝 My Italian training data was one pizza menu. **Alex** speaks it, though! Want to **contact him**? 📬',
      'My Italian stops at "pizza" and "ciao". 🍕 **Alex** speaks the rest! Want to **leave him a message**?'
    ],
    crab: [
      "I'm sorry, I don't speak Italian, and I'd rather not pretend. Alex does, though. Would you like to contact him?",
      "Non parlo italiano. I believe that's correct, though I can't be entirely certain. Alex speaks it. Would you like to leave him a message?",
      "I wish I could answer in Italian. I can't, and I apologize. Alex can, though. Shall I help you write to him?"
    ]
  },

  help: {
    orbit: ["Anything about Alex: his job at Tot, the startup he co-founded, the tracking fix Google took notes on, his skills and tools, his Lego.\n\nOr how to reach him. And if you're out of ideas, the next question is always waiting in the box: just press Enter."]
  },

  howareyou: {
    orbit: ["Stable. I'm a static website: no bad days, no good ones either. What would you like to know about Alex?"]
  },

  laugh: {
    orbit: [
      "I'll be here all week. Technically, forever.",
      "Glad that landed. Alex wrote it, I only deliver.",
      "Careful, you'll encourage him."
    ]
  },

  praise: {
    orbit: [
      "Thank you. Alex will pretend he didn't hear that, then bring it up at dinner.",
      "Kind of you. I'm a few hundred lines of JavaScript, but I'll take it."
    ]
  },

  insult: {
    orbit: [
      "Noted. I'm a static website, so my feelings are cached and unaffected.",
      "Harsh. Take it up with Alex: I only say what he wrote."
    ]
  },

  bye: {
    orbit: [
      "See you. I'll be here, thinking about nothing at all.",
      "Bye. The stars keep running whether you watch or not."
    ]
  },

  nomore: {
    orbit: [
      "That's all I have on that one. The next question is already waiting in the box.",
      "Nothing more on that. I'm a website, not a biographer."
    ]
  },

  fallback: {
    offer: { orbit: 'contact' },
    orbit: [
      "That's outside my orbit. Alex would happily answer it himself, though. Want to send him the question?",
      "No idea, and I'd rather admit it than make something up. Alex knows, and he'd happily tell you himself. Shall I draft the email?",
      "That one isn't in my notes. It's in Alex's head, and he answers his email. Want to ask him directly?"
    ],
    opener: true,
    knot: ["Unfortunately, I don't have information about that. I only know about **Alex**, and honestly, not that much. 🤷\n\nWant to know who he is instead?"],
    crab: ["I wish I could give it the attention it deserves. Honestly, though, it's outside what I know. I only know about Alex.\n\nWould you like to hear about his work instead?"]
  }
};

// Facts answer like everything else: with an opener, a fake search and fake reasoning in the parodies.
// A plain one skips all three.
for (const [id, fact] of Object.entries(FACTS)) {
  if (!fact.say) continue;
  ANSWERS[id] = { fact: true, plain: fact.plain, opener: !fact.plain, orbit: fact.say, knot: fact.knot, crab: fact.crab };
  if (fact.plain) continue;
  SEARCHED_INTENTS.push(id);
  TOPICS[id] = "Alex's career";
}

/* ---------- Writing Alex a message ----------
 * Name, message, contact, then a recap the visitor copies and sends themselves.
 * Yes, the assistant makes you do the last step. That's the point. */

const recap = f =>
  `To: ${ownerEmail()}\nSubject: Hello from ${f.name}\n\nHi ${OWNER},\n\n${f.message}\n\nBest,\n${f.name}\n${f.contact}`;

const FOLLOW_UP_LINES = [
  'Just following up on my previous email.',
  'Just following up on my follow-up.',
  'Just following up on my follow-up to my follow-up.'
];

const followUp = (f, polite) => {
  const name = f.name || 'A visitor';
  const line = FOLLOW_UP_LINES[Math.min(f.followUps, FOLLOW_UP_LINES.length) - 1];
  const body = polite ? `I hope you are well. ${line}` : `${line} 🙂`;
  return `To: ${ownerEmail()}\nSubject: Re: Hello from ${name}\n\nHi ${OWNER},\n\n${body}\n\nBest,\n${name}`;
};

export const FLOW = {
  askName: {
    orbit: () => "The easiest way is to leave a message right here, and I'll format it for you. What's your name?",
    knot: () => "The easiest way is to leave your details right here. 📝 First things first: **what's your name?**",
    crab: () => "The simplest way is to leave your contact details right here. What's your name?"
  },
  askNameSpotted: {
    orbit: () => "Looks like you've shared a way to reach you. Want to leave Alex a message? What's your name?",
    knot: () => "Looks like you shared your contact details! 📇 Want to leave Alex a message? First things first: **what's your name?**",
    crab: () => "It looks like you've shared a way to reach you. Would you like to leave Alex a message? If so, what's your name?"
  },
  askMessage: {
    orbit: f => `Nice to meet you, ${f.name}. What's your message for Alex?`,
    knot: f => `Nice to meet you, **${f.name}**! 👋 What's your **message** for Alex? Don't worry about the wording. I'll make it sound amazing. ✨`,
    crab: f => `It's lovely to meet you, ${f.name}. What would you like to say to Alex? Share as much or as little as feels right.`
  },
  // The visitor said yes to "want to send him the question?", so the message is already written.
  askContactForQuestion: {
    orbit: f => `Nice to meet you, ${f.name}. I'll use your question as the message. What's the best email address or phone number to reach you?`,
    knot: f => `Nice to meet you, **${f.name}**! 👋 I'll use your question as the message. Last step: what's the best **email address or phone number** to reach you?`,
    crab: f => `It's lovely to meet you, ${f.name}. I'll use your question as the message. What's the best email address or phone number to reach you?`
  },
  askContact: {
    orbit: () => "Got it. What's the best email address or phone number to reach you?",
    knot: () => "Love it! 🔥 Last step: what's the best **email address or phone number** to reach you?",
    crab: () => "Thank you for sharing that. And what's the best email address or phone number to reach you?"
  },
  invalidContact: {
    orbit: () => "That doesn't look like an email address or a phone number. Try again, or type cancel.",
    knot: () => "Hmm, that doesn't look like an email address or a phone number. 🤔 Could you double-check it? (Or type **cancel**.)",
    crab: () => "I'm sorry, I don't think that's quite an email address or phone number. Would you mind checking it? You can also say cancel."
  },
  recap: {
    orbit: f => `Here's your message, ready to copy:\n\n\`\`\`email\n${recap(f)}\n\`\`\`\n\nSend it to ${ownerEmail()} and Alex will get back to you.`,
    knot: f => `Great, here's your message, ready to copy! 📋\n\n\`\`\`email\n${recap(f)}\n\`\`\`\n\n📧 Now just **send it to ${ownerEmail()}**. That's it, you've got this! 💪\n\nWould you like me to also write a **follow-up email** in case Alex doesn't reply? 😅`,
    crab: f => `Here's your message, ready to copy:\n\n\`\`\`email\n${recap(f)}\n\`\`\`\n\nSend it to ${ownerEmail()}, and Alex will get back to you. I'd offer to send it myself, but I should be honest: I can't. I'm a website.`
  },
  followUp: {
    orbit: f => `Here's a polite follow-up, just in case:\n\n\`\`\`email\n${followUp(f, true)}\n\`\`\``,
    knot: f => `Here you go! 📋\n\n\`\`\`email\n${followUp(f)}\n\`\`\`\n\nWant me to write a **follow-up to the follow-up**? 🔁`,
    crab: f => `Of course. Here's a gentle follow-up:\n\n\`\`\`email\n${followUp(f, true)}\n\`\`\`\n\nWould you like another one, just in case?`
  },
  lastFollowUp: {
    orbit: f => `One more, then let's stop:\n\n\`\`\`email\n${followUp(f, true)}\n\`\`\``,
    knot: f => `Here's follow-up **#3**! 📋\n\n\`\`\`email\n${followUp(f)}\n\`\`\`\n\nHmm, we might be going in circles. 🔄 Want to **start fresh**?`,
    crab: f => `Here's a third follow-up:\n\n\`\`\`email\n${followUp(f, true)}\n\`\`\`\n\nI want to gently point out that we may be going in circles. Would you like to start over?`
  },
  cancel: {
    orbit: () => "No problem, canceled. What else would you like to know about Alex?",
    knot: () => "No problem! 👍 I've canceled that. What else would you like to know about Alex?",
    crab: () => "Of course, no problem at all. Is there anything else you'd like to know about Alex?"
  },
  upgrade: {
    orbit: () => "There's nothing to upgrade. It's free, and it always was.",
    knot: () => "🎉 Welcome to **Aldebaran Pro**! That'll be **$200/month**, billed annually.\n\nJust kidding. It's a website. Your limit has been reset. 😉",
    crab: () => "Welcome to Epic Max. That will be $200 a month.\n\nI'm joking, of course. This is a website, and I can't take your money. Your messages have been restored."
  },
  compressionFailed: {
    orbit: () => "This chat is getting long. Start a new one to keep going.",
    knot: () => "⚠️ **Compression failed.** This chat is too long to continue.\n\nStart a new chat to keep going. Don't worry, I'll forget everything. 🙂",
    crab: () => "I wasn't able to compact our conversation. It has reached its maximum length.\n\nPlease start a new chat to continue. I won't remember any of this, which may be for the best."
  }
};

export const LIMIT_NOTICE = {
  knot: time => `You've hit the Free plan limit for Aldebaran 5. Responses will use Aldebaran 5 mini until your limit resets after ${time}.`,
  crab: time => `You're out of free messages until ${time}.`
};

export const NETWORK_ERROR = {
  knot: { text: 'Network error.', action: 'Regenerate' },
  crab: { text: "Epic's response was interrupted. This can be caused by network problems, or by Epic getting distracted.", action: 'Retry' }
};

// Before-answer tweaks for the older models. Progress isn't always forward.
export const MODEL_QUIRKS = {
  'Epic 4.6': { prefix: 'Before I answer, I want to acknowledge the limits of my knowledge, which are considerable.\n\n' },
  'Epic 5': { suffix: '\n\nI apologize if any of this was unhelpful.' }
};
