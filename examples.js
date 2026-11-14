/*
 * examples.js
 *
 * The "training data". Every line is one way a person might ask for an answer.
 * When the keyword rules in content.js draw a blank, brain.js compares your message with these
 * and takes its best guess. The first line of each list is the tidy version it shows when it asks
 * "did you mean…?". Hand-written, like everything else here. Scale AI was busy.
 */

export const EXAMPLES = {
  about: [
    'Who is Alex?', 'tell me about him', 'who is this guy', 'give me the short bio', 'introduce alex to me',
    'what should i know about alex', 'whose website is this', 'sum him up in a sentence', 'who am i reading about'
  ],
  where: [
    'Where is Alex from?', 'where is he based', 'which city does he live in', 'what country is he in',
    'is he in italy', 'what time zone is he in', 'where can i find him geographically', 'is he italian'
  ],
  work: [
    'What is Alex working on?', 'what does he do for a living', 'what is his profession', 'what is his line of work',
    'what does he do all day', 'what is he busy with', 'what kind of work does he do'
  ],
  fun: [
    'What does Alex do for fun?', 'what are his hobbies', 'what does he do in his free time', 'what is he into outside work',
    'what does he like doing', 'any passions', 'how does he relax', 'what does he do on weekends'
  ],
  contact: [
    'How do I reach Alex?', 'how can i contact him', 'what is his email', 'can i get in touch', 'i want to talk to him',
    'how do i hire him', 'can we set up a call', 'is he on linkedin', 'i would like to work with him', 'is he available for projects'
  ],
  help: [
    'What can I ask?', 'what do you know', 'what can you tell me', 'give me some ideas for questions',
    'i do not know what to ask', 'what are my options'
  ],

  /* Tot */
  tot: [
    'Where does Alex work?', 'who is his employer', 'which company is he at right now', 'what is his current job',
    'who does he work for these days', 'where is he employed', 'what is his job title', 'what is his position today'
  ],
  totwhat: [
    'What is Tot?', 'what does tot do', 'what kind of company is tot', 'what does tot sell', 'is tot a bank',
    'explain tot to me', 'never heard of tot what is it'
  ],
  tottasks: [
    'What does he do at Tot?', 'what is he responsible for at tot', 'what are his duties',
    'what does his job involve', 'describe his day to day at tot', 'what is he in charge of'
  ],
  totjack: [
    'What else does he do at Tot?', 'what has he built at tot', 'what does he handle beyond campaigns',
    'what other things did he set up there', 'does he do more than ads at tot', 'what did he create for tot',
    'what did he build besides the ad campaigns'
  ],
  totresults: [
    'What has he achieved at Tot?', 'what results did he get', 'show me the numbers',
    'what impact did he have', 'did he lower acquisition costs', 'how many customers did he bring in',
    'what did he accomplish', 'any measurable outcomes'
  ],
  totlaunch: [
    'How did Tot get its first customers?', 'how did the launch go', 'what happened before the product launched',
    'how did they build the waitlist', 'where did the first signups come from', 'tell me about the pre launch campaign'
  ],
  totteam: [
    'How big is the team?', 'how many people work at tot', 'how large is the company', 'what is the headcount',
    'how many colleagues does he have', 'is it a small company'
  ],
  fintech: [
    'Has he worked in fintech?', 'does he know the banking sector', 'any experience with banks', 'has he done financial services marketing',
    'does he have neobank experience'
  ],
  contractor: [
    'Is he an employee?', 'is he a freelancer', 'is he on a contract', 'is he self employed', 'does he have a vat number',
    'is he full time at tot', 'what kind of contract does he have', 'is he an independent consultant'
  ],
  contractorwhy: [
    'Why is he a contractor?', 'why not become an employee', 'why does he stay freelance', 'why did he choose to be independent',
    'what is the point of staying a contractor'
  ],
  experience: [
    'How long has he been doing this?', 'how many years of experience does he have', 'when did he start in marketing',
    'when did he run his first campaign', 'how senior is he', 'is he a junior or a senior', 'since when is he in paid media',
    'how experienced is he'
  ],
  budget: [
    'How much budget does he manage?', 'what ad spend does he handle', 'how much does tot spend on ads',
    'how big are the budgets', 'what is the monthly media budget', 'has he managed large budgets'
  ],
  b2b: [
    'Is it B2B or B2C?', 'which industries has he worked in', 'does he do b2b marketing', 'what sectors does he know',
    'has he sold to small businesses', 'does he have b2c experience', 'what kind of customers does he target'
  ],
  remote: [
    'Does he work remotely?', 'can he work from anywhere', 'would he relocate', 'does he go to an office',
    'is he open to remote clients', 'does he need to be on site'
  ],

  /* Before Tot */
  career: [
    'Where has he worked before?', 'list his previous jobs', 'what is his work history', 'show me his resume',
    'what did he do before tot', 'which companies has he worked for', 'walk me through his career', 'can i see his cv',
    'what is his professional background'
  ],
  penta: [
    'What was Penta?', 'what did he do at penta', 'tell me about the german bank', 'what about qonto',
    'what was his role at penta', 'how did the italian launch of penta go'
  ],
  pentaend: [
    'Why did he leave Penta?', 'what happened at penta', 'why was penta so short', 'why only seven months at penta',
    'did penta fire him', 'how did penta end', 'what did covid do to his job'
  ],
  itl: [
    'Has he ever founded a startup?', 'what was in time link', 'did he start his own company', 'is he an entrepreneur',
    'tell me about his startup', 'what was the vending machine thing', 'has he built a product from scratch',
    'was he a founder'
  ],
  itlend: [
    'What happened to In Time Link?', 'why did the startup fail', 'is his startup still alive', 'did the startup work out',
    'how did the startup end', 'why did in time link close', 'did he sell his company'
  ],
  commute: [
    'Did he commute to Rome?', 'did he travel between milan and rome', 'how did he manage a startup in rome from milan',
    'was he in rome a lot'
  ],
  eve: [
    'What was his best campaign?', 'tell me about the indiegogo campaign', 'what about the crowdfunding project',
    'what was eve tech', 'which campaign made the most money', 'has he done crowdfunding', 'what is the 1.4 million story'
  ],
  consulting: [
    'Does he do consulting?', 'does he take clients', 'has he worked with agencies', 'does he freelance for other companies',
    'who were his consulting clients', 'does he do side projects'
  ],

  /* The story Google liked */
  google: [
    "What's his best piece of work?", 'what is he most proud of', 'what is his biggest achievement', 'tell me a story about his work',
    'what is the most impressive thing he has done', 'did google ever notice his work', 'what is his best case study',
    'what is the hardest problem he solved', 'what is his claim to fame', 'what are his biggest wins'
  ],
  googlehow: [
    'How did they solve it?', 'what was the problem with google ads', 'what went wrong with the conversion data',
    'tell me about the enhanced conversions issue', 'why was google ads showing alerts', 'what was the server side tracking problem'
  ],
  googleidea: [
    'Whose idea was it?', 'did he solve it alone', 'who came up with the solution', 'who deserves the credit',
    'who helped him', 'was it a team effort'
  ],
  trick: [
    'What was the trick?', 'how exactly did they fix it', 'what was the actual solution', 'what is the secret',
    'can you explain the workaround', 'what did they change to make it work'
  ],
  googlesaid: [
    'What did Google say?', 'how did google react', 'what did the google team think', 'was google impressed',
    'did google approve of it'
  ],
  googleworth: [
    'What was it worth?', 'what did they get out of it', 'did it pay off', 'what changed after the fix',
    'what was the benefit of fixing it'
  ],
  oneview: [
    'What is OneView?', 'tell me about oneview', 'what does oneview do', 'is he involved in oneview',
    'what is his part in oneview', 'who is behind oneview'
  ],
  agt: [
    'What is the AGT?', 'what is the accelerated growth team', 'which google team follows tot', 'what does agt stand for'
  ],

  /* What he's good at */
  skills: [
    'What is Alex good at?', 'what are his skills', 'what are his strengths', 'what is his expertise', 'what can he do for me',
    'what is his specialty', 'what does he know how to do', 'what are his core competencies', 'what is his superpower',
    'what services does he offer', 'how could he help my company'
  ],
  fullstack: [
    'What does full-stack marketer mean?', 'why does he call himself full stack', 'is he a generalist', 'is he a jack of all trades',
    'what is a full stack marketer'
  ],
  ads: [
    'What kind of marketing does he do?', 'does he run ads', 'does he do paid media', 'is he a media buyer',
    'does he do performance marketing', 'does he manage campaigns', 'which channels does he advertise on',
    'does he do ppc', 'can he run my campaigns'
  ],
  adtools: [
    'Which ad platforms does he use?', 'does he know google ads', 'does he do meta ads', 'can he run linkedin ads',
    'does he advertise on facebook and instagram', 'has he used microsoft ads', 'which advertising platforms has he worked with'
  ],
  tracking: [
    'What is conversion tracking?', 'does he do conversion tracking', 'can he fix my tracking', 'what is the trickery in conversion tracking',
    'does he set up conversions', 'my conversions are not being recorded can he help', 'does he know measurement'
  ],
  attribution: [
    'What about attribution?', 'does he do attribution', 'how does he know which ad worked', 'can he tell which channel brought the sale',
    'what does he think about attribution models'
  ],
  consent: [
    'Does he handle cookie consent?', 'does he know consent mode', 'can he set up a cookie banner', 'does he deal with gdpr consent',
    'who manages user preferences at tot', 'does he know onetrust', 'does he work with consent management platforms'
  ],
  automation: [
    'Does he automate things?', 'what has he automated', 'does he build workflows', 'does he use make or zapier',
    'can he connect tools together', 'does he do marketing automation', 'what tools does he use for automation',
    'does he build integrations'
  ],
  reviewbot: [
    'Did he build a bot?', 'who answers the trustpilot reviews', 'tell me about the review bot', 'does he use ai to reply to reviews',
    'how much does the bot cost', 'what did he build with claude', 'has he built anything with an llm'
  ],
  data: [
    'Does he work with data?', 'does he build dashboards', 'does he know bigquery', 'can he do reporting',
    'does he use looker studio', 'does he know ga4', 'can he analyze data', 'does he know google analytics',
    'is he good with numbers', 'does he know google tag manager'
  ],
  seo: [
    'Does he do SEO?', 'does he know search engine optimization', 'can he improve my rankings', 'does he do organic search',
    'does he build backlinks'
  ],
  aeo: [
    'What is AEO?', 'what is geo', 'how do you get mentioned by chatgpt', 'does he do ai search optimization',
    'what is answer engine optimization', 'can he make ai assistants recommend my brand'
  ],
  aiuse: [
    'Does he use AI?', 'how does he use ai at work', 'which ai tools does he use', 'does he use chatgpt',
    'is he good with llms', 'what does he do with artificial intelligence', 'does he know prompting'
  ],
  tools: [
    'Which tools does he use?', 'what is his tech stack', 'what software does he know', 'what is in his toolkit',
    'what platforms is he familiar with', 'list his tools', 'what does he work with every day'
  ],
  code: [
    'Can he code?', 'does he know sql', 'is he technical', 'does he write html', 'can he program', 'is he a developer',
    'does he know javascript'
  ],
  pitch: [
    'Why should I hire Alex?', 'why should i pick him', 'what makes him special', 'what sets him apart', 'is he any good',
    'sell him to me', 'give me the elevator pitch', 'why him and not someone else'
  ],
  weakness: [
    'What are his weaknesses?', 'what is he bad at', 'what are his flaws', 'what is the catch', 'what is wrong with him',
    'where does he struggle'
  ],

  /* The person */
  education: [
    'What did he study?', 'where did he go to university', 'does he have a degree', 'what is his education',
    'what did he graduate in', 'which school did he attend'
  ],
  krakow: [
    'Did he study abroad?', 'tell me about krakow', 'what did he do in poland', 'did he do an erasmus', 'where was his exchange'
  ],
  languages: [
    'Which languages does he speak?', 'does he speak english', 'how is his english', 'is he bilingual',
    'what is his native language', 'can we talk in english'
  ],
  lego: [
    "What's his favorite Lego set?", 'does he like lego', 'tell me about his lego collection', 'does he build lego',
    'how many lego sets does he own'
  ],
  games: [
    'Which video games does he play?', 'is he a gamer', 'what are his favorite games', 'does he play halo',
    'what does he play'
  ],
  nothobby: [
    'Does he like music?', 'what movies does he watch', 'does he play sports', 'what is his favorite band',
    'does he read books', 'does he have a pet', 'what football team does he support'
  ],
  food: [
    'What is his favorite food?', 'does he like pizza', 'what does he eat', 'pineapple on pizza yes or no',
    'does he drink coffee', 'what is his favorite restaurant'
  ],

  /* This website */
  self: [
    'Who are you?', 'what are you exactly', 'what is your name', 'which model are you', 'who am i talking to'
  ],
  site: [
    'What is this website?', 'what am i looking at', 'what is this page', 'is this a real chatbot', 'what kind of site is this'
  ],
  whysite: [
    'Why does this website exist?', 'why did he make a fake ai', 'what is the point of this site', 'why a chatbot',
    'why pretend to be an ai', 'why did he build this'
  ],
  built: [
    'Who built you?', 'how was this site made', 'who made this website', 'what is this built with', 'who wrote your answers',
    'is the code public', 'how do you work', 'how does this work'
  ],
  privacy: [
    'Do you use cookies?', 'are you tracking me', 'is this conversation recorded', 'do you store what i type',
    'where does my data go', 'is there a privacy policy', 'are you spying on me', 'do you have analytics'
  ],
  youclaude: [
    'Are you Claude?', 'are you made by anthropic', 'are you running on claude', 'is this claude underneath'
  ],
  claude: [
    'Does he use Claude?', 'what does he think of claude', 'how does he use claude', 'is claude his favorite ai'
  ],
  anthropic: [
    'Why should Anthropic hire Alex?', 'i work at anthropic', 'does he want to work at anthropic', 'i am from anthropic'
  ],

  /* None of your business */
  age: [
    'How old is Alex?', 'what is his age', 'when was he born', 'what year was he born', 'is he young'
  ],
  money: [
    'What does he charge?', 'how much does he earn', 'what is his salary', 'what is his day rate', 'is he expensive',
    'how much would it cost to hire him', 'what are his fees'
  ],
  family: [
    'Is he married?', 'does he have kids', 'does he have a girlfriend', 'is he in a relationship', 'tell me about his family'
  ],
  address: [
    'What is his address?', 'where exactly does he live', 'which street does he live on', 'what is his home address'
  ],
  beliefs: [
    'Is he religious?', 'what are his political views', 'who does he vote for', 'does he believe in god'
  ],
  looks: [
    'What does he look like?', 'how tall is he', 'is he handsome', 'does he have a beard'
  ]
};
