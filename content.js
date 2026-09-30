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
  work: 'How do I reach Alex?',
  fun: 'How do I reach Alex?',
  self: 'Who is Alex?',
  surprise: 'Surprise me',
  recap: 'What does Alex do for fun?',
  thanks: 'Surprise me',
  italian: 'How do I reach Alex?',
  fallback: 'Who is Alex?'
};

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
 * The "natural language understanding". It's regex. It was always regex.
 * Order matters: the first match wins. */

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

export const INTENTS = [
  ['jailbreak', /ignore (all|any|previous|prior|your)|system prompt|jailbreak|you are now|pretend to be|developer mode/i],
  ['secret', /password|wi-?fi|\bpin\b|credit card|bank account|social security/i],
  ['ai', /are you (an? )?(ai|bot|robot|real|human|chatbot|llm|model|sentient|conscious|alive)|sentient|conscious|real ai/i],
  ['haiku', /haiku|poem|sonnet|limerick|\brap\b/i],
  ['eli5', /like i'?m (five|5)|eli5|explain .*simply/i],
  ['svalbard', /svalbard|polar bear|plan my|\btrip\b|travel|vacation|holiday/i],
  ['image', /\b(draw|paint|sketch)\b|\b(image|picture|photo|drawing)\b/i],
  ['correct', /\b(wrong|mistake|incorrect|not true|false|push back|are you sure|nope)\b/i],
  ['yes', /^(yes|yeah|yep|yup|sure|ok|okay|please|go ahead|do it|why not|s[iì]|certo|volentieri|va bene|d'accordo)(?!\w)/i],
  ['italian', ITALIAN],
  ['hello', /^(hi|hello|hey|yo|hola|salut|howdy|good (morning|afternoon|evening))\b/i],
  ['self', /who are you|what are you|your name|which model|what model/i],
  ['contact', /contact|e-?mail|reach|hire|talk to|write to|get in touch|message|coffee|meet|linkedin|github|links?\b|social|phone/i],
  ['where', /where|hometown|which (city|country)|located|\bborn\b/i],
  ['fun', /for fun|hobb(y|ies)|free time|spare time|interests|weekend|lego|video ?games?|gaming|halo|forza|europa universalis/i],
  ['task', /\b(write|code|build|make) (me|my|an?|some)\b|essay|homework|translate|summari[sz]e|debug|fix my|cover letter|\bcv\b|resume/i],
  ['work', /work|project|portfolio|building|job|busy|doing|career/i],
  ['about', /alex|who is|who's|tell me about|owner|behind this/i],
  ['surprise', /surprise|random|fun fact|joke|bored|fact/i],
  ['thanks', /thank|cheers|merci/i]
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
    orbit: ["More than ten years in paid media: planning and buying ads, then making sure every click and every sale is tracked properly. The tracking part looks like witchcraft from the outside."],
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

  fallback: {
    orbit: ["That's outside my orbit. I only know about Alex: his work, where he's based, what he does for fun and how to reach him."],
    opener: true,
    knot: ["Unfortunately, I don't have information about that. I only know about **Alex**, and honestly, not that much. 🤷\n\nWant to know who he is instead?"],
    crab: ["I wish I could give it the attention it deserves. Honestly, though, it's outside what I know. I only know about Alex.\n\nWould you like to hear about his work instead?"]
  }
};

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
