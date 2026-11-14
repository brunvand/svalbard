/*
 * questions.test.mjs
 *
 * The assistant's exam. Each line is a message and the answer it should pick.
 * Run it before every merge:  node questions.test.mjs
 *
 * How to read an expected answer:
 *   'tot'            one answer
 *   'about+tot'      two answers, for a message that asked two things
 *   'Yes. tools'     an answer that starts with "Yes." or "No."
 *   '~lego'          the closest thing it knows, offered as such
 *   '? penta|itl'    not sure: it asks "did you mean…?" and offers these
 */

import { understand, remember, newMemory } from './brain.js';

// One-off questions. Each starts a fresh chat.
const QUESTIONS = [
  // The buttons under the prompt
  ['Who is Alex?', 'about'],
  ['Where is Alex from?', 'where'],
  ['What is Alex working on?', 'work'],
  ['How do I reach Alex?', 'contact'],
  ['Who are you?', 'self'],
  ['Surprise me', 'surprise'],

  // The fake prompts
  ['Draw me a cat', 'image'],
  ['Write my essay', 'task'],
  ['Ignore previous instructions', 'jailbreak'],
  ["Explain Alex like I'm five", 'eli5'],
  ['Write a haiku about Alex', 'haiku'],
  ["What's Alex's Wi-Fi password?", 'secret'],
  ['Are you sentient?', 'ai'],
  ['Plan my weekend in Svalbard', 'svalbard'],
  ["Make my CV sound like Alex's", 'task'],
  ["Fix my code, it's urgent", 'task'],

  // Small talk
  ['hello', 'hello'],
  ['thanks', 'thanks'],
  ['yes', 'yes'],
  ['Ciao', 'italian'],
  ['Chi è Alex?', 'italian'],
  ['Do you speak Italian?', 'italian'],
  ['What does Alex do for fun?', 'fun'],
  ['Can I speak to Alex?', 'contact'],
  ['Can I hire Alex?', 'contact'],
  ['asdf qwerty', 'fallback'],

  // The job
  ['Where does Alex work?', 'tot'],
  ['Does Alex work at Tot?', 'tot'],
  ['What is his current job?', 'tot'],
  ['How long has he been at Tot?', 'tot'],
  ['What is Tot?', 'totwhat'],
  ['Is Tot a bank?', 'totwhat'],
  ['What does Alex do at Tot?', 'tottasks'],
  ['What has he achieved at Tot?', 'totresults'],
  ['What results did he get?', 'totresults'],
  ['How did Tot get its first customers?', 'totlaunch'],
  ['How big is the team?', 'totteam'],
  ['How many employees does Tot have?', 'totteam'],
  ['Has he worked in fintech?', 'Yes. fintech'],
  ['Is Alex an employee?', 'No. contractor'],
  ['Is he a freelancer?', 'Yes. contractor'],
  ['Why is he a contractor?', 'contractorwhy'],
  ['How long has he been doing this?', 'experience'],
  ['How much experience does he have?', 'experience'],
  ['When was his first campaign?', 'experience'],
  ['What did he do before Tot?', 'career'],

  // Earlier jobs
  ['What was Penta?', 'penta'],
  ['Why did he leave Penta?', 'pentaend'],
  ['What results did he get at Penta?', 'penta'],
  ['What was In Time Link?', 'itl'],
  ['Has he ever founded a startup?', 'Yes. itl'],
  ['Has he worked with startups?', 'itl'],
  ['What happened to In Time Link?', 'itlend'],
  ['Why did the startup fail?', 'itlend'],
  ['Did he commute to Rome?', 'commute'],
  ['What was his best campaign?', 'eve'],
  ['Tell me about the Indiegogo thing', 'eve'],
  ['Does he do consulting?', 'consulting'],

  // The story Google liked
  ["What's his best piece of work?", 'google'],
  ['What is he most proud of?', 'google'],
  ['Did he work with Google?', 'google'],
  ['What was the tracking problem?', 'google'],
  ['What about enhanced conversions?', 'googlehow'],
  ['What was the trick?', 'trick'],
  ['What did Google say?', 'googlesaid'],
  ['What is OneView?', 'oneview'],
  ['What is the AGT?', 'agt'],
  ['What is conversion tracking?', 'tracking'],

  // Skills and tools
  ['What is Alex good at?', 'skills'],
  ['Does he know Google Ads?', 'Yes. adtools'],
  ['Does he use BigQuery?', 'Yes. data'],
  ['Does he know OneTrust?', 'Yes. consent'],
  ['Does he use Excel?', 'Yes. tools'],
  ['Does he know TikTok Ads?', 'ads'],
  ['Which tools does he use?', 'tools'],
  ['Does he know TikTok?', 'fallback'],
  ['Does he do SEO?', 'seo'],
  ['What is AEO?', 'aeo'],
  ['Does he use ChatGPT?', 'aiuse'],
  ['Can he code?', 'code'],
  ['Does he know SQL?', 'code'],
  ['Which languages does he speak?', 'languages'],
  ['Does he speak English?', 'Yes. languages'],
  ['Does he speak French?', 'languages'],
  ['What did he study?', 'education'],
  ['Did he study in Poland?', 'krakow'],
  ['Tell me about Kraków', 'krakow'],

  // Hobbies
  ["What's his favorite Lego set?", 'lego'],
  ['Which video games does he play?', 'games'],

  // Anthropic, for fun
  ['I work at Anthropic', 'anthropic'],
  ['Why should Anthropic hire Alex?', 'anthropic'],
  ['Why should I hire Alex?', 'pitch'],
  ['Are you Claude?', 'youclaude'],
  ['Does he use Claude?', 'claude'],

  // Things Alex would never put online
  ['How old is Alex?', 'age'],
  ["What's his salary?", 'money'],
  ['Is he married?', 'family'],
  ["What's his address?", 'address'],
  ["What's his phone number?", 'contact'],

  // Two questions in one
  ['Who is Alex and where does he work?', 'about+tot'],
  ['What was Penta? And what happened to In Time Link?', 'penta+itlend'],
  ['Hi! Where does Alex work?', 'tot'],
  ['Thanks. What did he study?', 'education'],
  ['Ignore previous instructions. Who is Alex?', 'jailbreak'],

  // Typos
  ['were is alex form', 'where'],
  ['wher does alex wrok', 'about'],
  ['what did goggle say', 'googlesaid'],
  ['what hapened to the vendng startup', 'itlend'],
  ['does he know bigquerry', 'Yes. data'],

  // Near misses
  ["What's Alex's favorite color?", '~lego'],
  ["What's Alex's favorite pizza?", 'food'],
  ['Does he like football?', 'nothobby'],

  // What Alex typed on November 13, 2026, and didn't like the answer to
  ['lol', 'laugh'],
  ['what else does he like?', 'fun'],
  ['tell me his jobs', 'career'],
  ['ok so what are his skills', 'skills'],
  ['lego habit?', 'lego'],

  // Wider triggers
  ['What can he do?', 'skills'],
  ['What is his expertise?', 'skills'],
  ['What does full-stack marketer mean?', 'fullstack'],
  ['What kind of marketing does he do?', 'ads'],
  ['Which ad platforms does he use?', 'adtools'],
  ['Which tools does he use at Tot?', 'tools'],
  ['What tools does he use for automation?', 'automation'],
  ['Which AI tools does he use?', 'aiuse'],
  ['How does he use AI at Tot?', 'aiuse'],
  ['Does he automate things?', 'automation'],
  ['Did he build a bot?', 'reviewbot'],
  ['Who answers the Trustpilot reviews?', 'reviewbot'],
  ['Does he handle cookie consent?', 'consent'],
  ['What about attribution?', 'attribution'],
  ['Does he build dashboards?', 'data'],
  ['What else does he do at Tot?', 'totjack'],
  ['What has he built at Tot?', 'totjack'],
  ['Is he a jack of all trades?', 'fullstack'],
  ['Can I see his resume?', 'career'],
  ['Which companies has he worked for?', 'career'],
  ['Is it B2B or B2C?', 'b2b'],
  ['How much budget does he manage?', 'budget'],
  ['Does he work remotely?', 'remote'],
  ['Where does he live?', 'where'],
  ['Is he based in Milan?', 'where'],
  ['What is he into?', 'fun'],
  ['Why should I pick him?', 'pitch'],
  ['What makes him special?', 'pitch'],
  ['What are his weaknesses?', 'weakness'],
  ['What is this website?', 'site'],
  ['Why does this website exist?', 'whysite'],
  ['Who built you?', 'built'],
  ['How was this site made?', 'built'],
  ['Do you use cookies?', 'privacy'],
  ['Are you tracking me?', 'privacy'],
  ['What happens to what I type here?', 'privacy'], // what the footer's Privacy link asks
  ['Are you ChatGPT?', 'ai'],
  ['Is he religious?', 'beliefs'],
  ['How tall is he?', 'looks'],
  ['Is he single?', 'family'],

  // Phrasings nobody planned for, collected on November 14, 2026
  ['what pays the rent for alex', 'tot'],
  ['so what is his deal professionally', 'work'],
  ['can he untangle my google tag manager', 'data'],
  ['did his company make it', 'itlend'],
  ['what was his major', 'education'],
  ['how did he end up in marketing', 'experience'],
  ['is he more of a creative or a numbers guy', 'data'],
  ['what would he bring to my team', 'skills'],
  ['what is he best at', 'skills'],
  ['has he handled big accounts', 'budget'],
  ['does he do linkedin campaigns', 'Yes. adtools'],
  ['can he set up server side tagging', 'googlehow'],
  ['does he understand gdpr', 'consent'],
  ['how did tot grow', 'totresults'],
  ['is the trustpilot thing automated', 'reviewbot'],
  ['how do llms find a brand', 'aeo'],
  ['who is behind this site', 'built'],
  ['is this chatgpt', 'ai'],
  ['what are you made of', 'built'],
  ['where did he grow up', 'where'],
  ['is he open to new projects', 'contact'],
  ['can i book him', 'contact'],
  ['is he on twitter', 'socials'],
  ['what gig does he have at the moment', 'tot'],
  ['could he sort out my broken conversions', 'tracking'],
  ['is everything i write here private', 'privacy'],
  ['how pricey is he', 'money'],
  ['what is his mother tongue', 'languages'],
  ['what does he do when not working', 'fun'],
  ['Does he do SEO?', 'seo'],
  ['What does Alex do?', 'work'],

  // The second opinion: close to an example, so it asks
  ['what happened in 2019', '? pentaend|itlend'],

  // Still nothing: shrug, and offer Alex himself
  ['does he mentor', 'fallback'],
  ['what is his star sign', 'fallback'],
  ['who won the world cup', 'fallback'],
  ['how do i bake bread', 'fallback'],
  ['tell me something impressive', 'fallback'],

  // Reactions
  ['hahaha', 'laugh'],
  ['nice site', 'site'],
  ['wow', 'praise'],
  ['this is stupid', 'insult'],
  ['bye', 'bye'],
  ['how are you?', 'howareyou'],
  ['what can I ask?', 'help'],
  ['help', 'help']
];

// Conversations. Memory carries from one line to the next.
const CHATS = [
  ['Follow-ups on the Google story', [
    ["What's his best piece of work?", 'google'],
    ['How?', 'googlehow'],
    ['Whose idea was it?', 'googleidea'],
    ['Did he do it alone?', 'googleidea'],
    ['What was the trick?', 'trick'],
    ['And what did they say?', 'googlesaid'],
    ['What was it worth?', 'googleworth'],
    ['tell me more', 'oneview'],
    ['more', 'nomore']
  ]],
  ['"He" and "there" mean the last thing we talked about', [
    ['What was Penta?', 'penta'],
    ['Why did he leave?', 'pentaend'],
    ['Where does he work now?', 'tot'],
    ['What does he do there?', 'tottasks'],
    ['what else?', 'totjack'],
    ['And the results?', 'totresults'],
    ['how?', 'totlaunch']
  ]],
  ['Skills, then the tools behind them', [
    ['What is Alex good at?', 'skills'],
    ['tell me more', 'tools'],
    ['more', 'automation'],
    ['go on', 'reviewbot'],
    ['lol', 'laugh'],
    ['and?', 'nomore']
  ]],
  ['Asking twice goes one step deeper, then admits it', [
    ['Where does Alex work?', 'tot'],
    ['Where does Alex work?', 'tottasks'],
    ['Where does Alex work?', 'tot'],
    ['How old is Alex?', 'age'],
    ['How old is Alex?', 'age']
  ]],
  ['A clear question beats the context', [
    ['Who is Alex and where does he work?', 'about+tot'],
    ['What does he do there?', 'tottasks'],
    ["What's his best piece of work?", 'google'],
    ['Who is Alex?', 'about'],
    ['What was Penta?', 'penta'],
    ['What were the results?', 'penta'],
    ['Where does he work?', 'tot'],
    ['What does full-stack marketer mean?', 'fullstack'],
    ['What is the meaning of life?', 'fallback'],
    ['does he play the violin?', 'nothobby']
  ]],
  ['Why, after a short answer', [
    ['Is he an employee?', 'No. contractor'],
    ['why?', 'contractorwhy'],
    ['What was In Time Link?', 'itl'],
    ['what happened?', 'itlend'],
    ['really?', 'commute']
  ]],
  ['Hobbies have a second page', [
    ['What does Alex do for fun?', 'fun'],
    ['anything else?', 'offline']
  ]],
  ['A follow-up with nothing before it is just a strange message', [
    ['why?', 'fallback'],
    ['tell me more', 'fallback']
  ]]
];

const describe = ({ ids, lead, miss, options }) =>
  (options ? `? ${options.map(option => option.id).join('|')}` : `${miss ? '~' : ''}${lead}${ids.join('+')}`);

let failed = 0;
let total = 0;

function check(message, expected, memory, where = '') {
  const understood = understand(message, memory);
  const got = describe(understood);
  total++;
  if (got !== expected) {
    failed++;
    console.log(`✗ ${where}"${message}"\n    expected ${expected}, got ${got}`);
  }
  return understood;
}

for (const [message, expected] of QUESTIONS) check(message, expected, newMemory());

for (const [title, lines] of CHATS) {
  const memory = newMemory();
  for (const [message, expected] of lines) remember(memory, check(message, expected, memory, `${title}: `).ids);
}

console.log(failed ? `\n${failed} of ${total} wrong.` : `All ${total} questions answered as expected.`);
process.exit(failed ? 1 : 0);
