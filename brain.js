/*
 * brain.js
 *
 * The "model". Zero parameters, zero GPUs, and it can't hallucinate: it only knows what Alex typed.
 * It reads your message, squints at the words it recognizes, and picks the answer that fits best.
 * If you came here looking for the neural network, this is as deep as it gets.
 */

import { REFLEXES, INTENTS, GLUE_WORDS, KEYWORDS, FACTS, FOLLOW_UPS, GOES_DEEPER, PIVOTS } from './content.js';
import { EXAMPLES } from './examples.js';

/* ---------- Vocabulary ---------- */

const WEIGHT = {};           // keyword -> points
const WORDS = new Map();     // single word -> keyword
const PHRASES = [];          // [several words, keyword], longest first
const VOCABULARY = new Set();

for (const [group, points] of [[GLUE_WORDS, 1], [KEYWORDS, 2]]) {
  for (const [keyword, terms] of Object.entries(group)) {
    WEIGHT[keyword] = points;
    for (const term of terms.split('|')) {
      if (term.includes(' ')) PHRASES.push([term, keyword]);
      else WORDS.set(term, keyword);
      term.split(' ').forEach(word => VOCABULARY.add(word));
    }
  }
}
PHRASES.sort((a, b) => b[0].length - a[0].length);

// The regex layers get typo forgiveness too. Italian sits this one out: "tutor" is not "tutto".
for (const [id, pattern] of [...REFLEXES, ...INTENTS]) {
  if (id !== 'italian') (pattern.source.match(/[a-z]{5,}/g) || []).forEach(word => VOCABULARY.add(word));
}

// Words too ordinary to be a typo of something, or to count as "a thing I didn't understand".
const ORDINARY = new Set(`
  a an the and or but so if of to in on at by for from with about into over after before during
  is are was were be been being am do does did done has have had can could will would should may might must
  i me my mine we us our you your he him his she her it its they them their this that these those there here
  what which who whom whose when where why how not no yes ok okay please thanks thank
  alex alexs matteo tell know knows show give get got make made let say ask asked want need like
  really very much many more most some any all just also too still ever never always now then than as
  up down out off again one thing things something anything stuff kind sort lot bit way time
  good great nice cool well new old big right sure maybe hi hello hey coming going doing being having
  built change lunch point though store stock white loving use uses used using
`.trim().split(/\s+/));

/* ---------- Reading ---------- */

const clean = text => text
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/^were (is|does|do|did|are|can)\b/, 'where $1');   // "were is alex form". We know. It's fine.

// One letter added, missing, wrong or swapped with its neighbor.
function oneEditApart(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return a.slice(i + 1) === b.slice(i + 1)
    || a.slice(i) === b.slice(i + 1)
    || a.slice(i + 1) === b.slice(i)
    || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
}

// Five-letter words are only forgiven a swap ("wrok"): "short" is not a typo of "sport", and "lunch" is not "launch".
const swapped = (a, b) => a.length === b.length && [...a].sort().join('') === [...b].sort().join('');

function fixTypo(word) {
  if (word.length < 5 || VOCABULARY.has(word) || ORDINARY.has(word)) return word;
  for (const known of VOCABULARY) {
    if (known.length < 5 || known[0] !== word[0] || !oneEditApart(word, known)) continue;
    if (word.length > 5 || swapped(word, known)) return known;
  }
  return word;
}

const tidy = text => clean(text).split(' ').filter(Boolean).map(fixTypo).join(' ');

// Which keywords are in the message, and which words meant nothing to us.
function spot(text) {
  const fixed = tidy(text);
  const keywords = new Set();
  const unknown = [];

  let rest = ` ${fixed} `;
  for (const [phrase, keyword] of PHRASES) {
    if (!rest.includes(` ${phrase} `)) continue;
    keywords.add(keyword);
    rest = rest.split(` ${phrase} `).join(' | ');
  }
  for (const word of rest.split(' ')) {
    const keyword = WORDS.get(word) || (word.length > 3 && WORDS.get(word.replace(/s$/, '')));
    if (keyword) keywords.add(keyword);
    else if (word && word !== '|' && !ORDINARY.has(word)) unknown.push(word);
  }
  return { fixed, keywords, unknown };
}

/* ---------- Choosing ---------- */

// The names a conversation can be about: Tot, Penta, the Google story...
const SUBJECTS = new Set(Object.values(FACTS).map(fact => fact.about).filter(Boolean));

// The fact whose keyword combination is fully present and scores highest. Ties go to the first one written.
// Real topics outrank a subject with glue around it, which outranks glue alone: "which tools does he use
// at Tot?" is about tools, and "what is his role at Tot?" is about Tot, not about work in general.
function bestFact(keywords) {
  let best = null;
  for (const [id, fact] of Object.entries(FACTS)) {
    for (const entry of fact.when) {
      const combination = entry.all || entry;
      if (!combination.every(keyword => keywords.has(keyword))) continue;
      const points = combination.reduce((sum, keyword) => sum + WEIGHT[keyword], 0);
      const topics = combination.filter(keyword => WEIGHT[keyword] > 1);
      const onlySubject = topics.length === 1 && SUBJECTS.has(topics[0]);
      const vague = topics.length ? (onlySubject ? 1.5 : null) : 1;
      const score = vague ? vague + (combination.length - 1) / 10 : points;
      if (points >= 2 && (!best || score > best.score)) best = { id, combination, score, lead: entry.lead };
    }
  }
  return best;
}

const POINTS_BACK = /\b(there|it|that|they|them|then)\b/;
const YES_NO = /^(is|are|was|were|does|do|did|has|have|had|can|could|will|would)\b/;
const PREFIX = '(?:(?:ok|okay|so|and|but|well|wait) )?';
const FOLLOW_UP_KINDS = [
  ['why', new RegExp(`^${PREFIX}(?:why|how come|why so|why is that|why was that|why did (?:he|they) do (?:it|that))$`)],
  ['how', new RegExp(`^${PREFIX}(?:how|how so|how exactly|how did (?:he|they|you) (?:do|solve|fix|crack|manage) (?:it|that|this))$`)],
  ['more', new RegExp(`^${PREFIX}(?:tell me more|more|go on|continue|keep going|and|then|and then|then what|what then|really|seriously|details|more details|elaborate|explain|say more|what else|anything else|when|since when)$`)]
];

// First answer along the "more" trail that hasn't been given yet in this chat.
function untold(id, memory) {
  for (let steps = 0; id && memory.told[id] && steps < 10; steps++) id = FOLLOW_UPS[id]?.more;
  return id;
}

// Asked again? Some answers have a second page. The others get repeated, and say so.
function again(id, memory) {
  const secondPage = memory.told[id] && GOES_DEEPER.includes(id) && FOLLOW_UPS[id]?.more;
  return secondPage && !memory.told[secondPage] ? secondPage : id;
}

/* ---------- A second opinion ----------
 * When the rules above have nothing, the message is compared with every example in examples.js.
 * Rare words count for more than common ones, and words nobody ever used in an example count against.
 * It's the closest this file gets to machine learning: a nearest neighbor, found by counting. */

const FILLER = new Set(`
  a an the of to in on at by for from with is are was were be been am do does did has have had
  can could will would should i me my he him his it its this that there here and or but so if not
  please alex alexs matteo tell know
`.trim().split(/\s+/));

const stem = word => (word.length > 4 ? word.replace(/(ing|ed|es|s)$/, '') : word);

// What a message is made of: its words, the keywords the rules spotted in it (so "broken conversions"
// and "fix my tracking" look alike), and each pair of neighboring words.
function features(text) {
  const { fixed, keywords } = spot(text);
  const words = fixed.split(' ').filter(word => word && !FILLER.has(word)).map(stem);
  return {
    words: new Set([...words, ...[...keywords].map(keyword => `#${keyword}`)]),
    pairs: new Set(words.slice(1).map((word, i) => `${words[i]} ${word}`))
  };
}

const SAMPLES = Object.entries(EXAMPLES).flatMap(([id, questions]) => questions.map(question => {
  const { words, pairs } = features(question);
  return { id, question: questions[0], features: new Set([...words, ...pairs]) };
}));

const SEEN_IN = new Map();
for (const sample of SAMPLES) for (const feature of sample.features) SEEN_IN.set(feature, (SEEN_IN.get(feature) || 0) + 1);

// Rare features weigh more. A word no example ever used weighs like a rare one, and matches nothing.
function weigh(featureSet) {
  const weights = new Map();
  for (const feature of featureSet) weights.set(feature, Math.log(1 + SAMPLES.length / (SEEN_IN.get(feature) || 2)));
  const length = Math.hypot(...weights.values()) || 1;
  for (const [feature, weight] of weights) weights.set(feature, weight / length);
  return weights;
}
for (const sample of SAMPLES) sample.weights = weigh(sample.features);

const SURE = 0.75;      // Nearly an example, word for word: just answer.
const WORTH_ASKING = 0.45;   // Close enough to ask "did you mean…?". Never close enough to assume.

// The best-matching answers for a message, best first: [{ id, question, score }].
// A match has to share something specific. Two questions that both start with "who" have nothing in common.
export function secondOpinion(text) {
  const { words, pairs } = features(text);
  const asked = weigh(new Set([...words, ...[...pairs].filter(pair => SEEN_IN.has(pair))]));
  if ([...words].filter(word => !word.startsWith('#')).length < 2) return [];

  const best = new Map();
  for (const sample of SAMPLES) {
    let score = 0;
    let specific = false;
    for (const [feature, weight] of asked) {
      if (!sample.weights.has(feature)) continue;
      score += weight * sample.weights.get(feature);
      specific ||= SEEN_IN.get(feature) <= 12;
    }
    if (specific && score > (best.get(sample.id)?.score || 0)) best.set(sample.id, { id: sample.id, question: sample.question, score });
  }
  return [...best.values()].sort((a, b) => b.score - a.score);
}

// Counting words is not understanding, so a guess is only trusted when it is nearly certain.
// Anything less becomes a question back to the visitor, with the one or two closest matches.
function guess(text, memory) {
  const [first, second] = secondOpinion(text).filter(({ id, score }) => score >= WORTH_ASKING && !memory.told[id]);
  if (!first) return null;
  if (first.score >= SURE) return { id: first.id, kind: 'guess' };
  const options = second && first.score - second.score < 0.2 ? [first, second] : [first];
  return { kind: 'clarify', options: options.map(({ id, question }) => ({ id, question })) };
}

function interpret(text, memory) {
  const { fixed, keywords, unknown } = spot(text);
  const matches = ([, pattern]) => pattern.test(text) || pattern.test(fixed);

  const reflex = REFLEXES.find(matches);
  if (reflex) return { id: reflex[0], kind: 'reflex' };

  // "Why did he leave?" means nothing alone. After talking about Penta, it means Penta.
  // A question that already makes sense alone, or has words we don't know, only bends to the context
  // for a real keyword, or when it points at it ("what does he do there?"). "What is the meaning of
  // life?" is not about Tot, whatever came before.
  let fact = bestFact(keywords);
  if (memory.about && !keywords.has(memory.about)) {
    const inContext = bestFact(new Set([...keywords, memory.about]));
    const shared = inContext?.combination.includes(memory.about)
      ? inContext.combination.filter(keyword => keywords.has(keyword))
      : [];
    const topical = shared.some(keyword => WEIGHT[keyword] > 1);
    const loose = shared.some(keyword => keyword !== 'what');
    const fits = unknown.length ? topical : fact ? topical || (loose && POINTS_BACK.test(fixed)) : loose;
    if (fits && inContext.score > (fact?.score || 0)) fact = { ...inContext, lead: null };
  }
  if (fact) {
    // "Yes." and "No." are promises. Only make them when every word of the question was understood.
    const onTopic = [...keywords].every(keyword => WEIGHT[keyword] < 2 || fact.combination.includes(keyword));
    const lead = fact.lead && YES_NO.test(fixed) && !unknown.length && onTopic ? `${fact.lead} ` : '';
    const id = again(fact.id, memory);
    return { id, kind: 'fact', lead: id === fact.id ? lead : '' };
  }

  const followUp = FOLLOW_UP_KINDS.find(([, pattern]) => pattern.test(fixed));
  if (followUp && memory.last) {
    const trail = FOLLOW_UPS[memory.last] || {};
    return { id: untold(trail[followUp[0]] || trail.more, memory) || 'nomore', kind: 'follow-up' };
  }

  const intent = INTENTS.find(matches);
  const pivot = unknown.length && PIVOTS.find(([keyword]) => keywords.has(keyword));
  if (pivot && (!intent || intent[0] === 'about')) return { id: pivot[1], kind: 'miss' };
  if (intent && intent[0] !== 'about') return { id: again(intent[0], memory), kind: 'intent' };

  // The rules have nothing, or only "it mentions Alex". Ask for the second opinion.
  const guessed = guess(text, memory);
  if (guessed && (!intent || (guessed.kind === 'guess' && guessed.id !== 'about'))) return guessed;
  if (intent) return { id: again(intent[0], memory), kind: 'intent' };
  return { id: 'fallback', kind: 'fallback' };
}

/* ---------- The whole thing ----------
 * understand() returns { ids, lead, miss, known, guessed, options }:
 *   ids:     one answer, or two when the message asked two things.
 *   lead:    "Yes. " or "No. " when the question deserves one.
 *   miss:    the answer is only the closest thing we know.
 *   known:   false when we're shrugging.
 *   guessed: the rules had nothing and the second opinion answered.
 *   options: two answers were equally likely, so we ask: [{ id, question }, { id, question }]. */

const BIO = ['about', 'where', 'work', 'fun'];
const SMALL_TALK = ['hello', 'thanks', 'yes', 'fallback'];
const SPLIT = /[?!.;]+\s+|,?\s+(?:and|also|plus)\s+(?=(?:who|what|where|when|why|how|is|does|did|can|has|which)\b)|,\s+(?=(?:who|what|where|when|why|how)\b)/i;

const answersAlex = found => found.kind === 'fact' || (found.kind === 'intent' && BIO.includes(found.id));

const single = found => ({
  ids: [found.id || 'clarify'],
  lead: found.lead || '',
  miss: found.kind === 'miss',
  known: !['miss', 'fallback', 'clarify'].includes(found.kind) && found.id !== 'nomore',
  guessed: found.kind === 'guess',
  options: found.options
});

export function understand(text, memory = { told: {} }) {
  const whole = interpret(text, memory);
  if (whole.kind === 'reflex') return single(whole);

  const parts = text.split(SPLIT).map(part => part.trim()).filter(Boolean);
  if (parts.length > 1) {
    const answers = [];
    for (const part of parts) {
      const found = interpret(part, memory);
      if (answersAlex(found) && !answers.some(other => other.id === found.id)) answers.push(found);
    }
    if (answers.length > 1) return { ids: answers.slice(0, 2).map(found => found.id), lead: '', miss: false, known: true };
    if (answers.length === 1 && SMALL_TALK.includes(whole.id)) return single(answers[0]);
  }
  return single(whole);
}

// What the conversation has covered so far. This is the entire context window.
export const newMemory = () => ({ told: {}, last: null, about: null });

export function remember(memory, ids) {
  for (const id of ids) memory.told[id] = (memory.told[id] || 0) + 1;
  const last = ids[ids.length - 1];
  if (FACTS[last] || FOLLOW_UPS[last]) memory.last = last;
  if (FACTS[last]?.about) memory.about = FACTS[last].about;
}
