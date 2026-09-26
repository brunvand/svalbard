/*
 * chat.js
 *
 * The engine. No model, no API, no GPU. Just a loop that pretends to think,
 * then types out something Alex wrote earlier. You're welcome to keep reading.
 */

import {
  OWNER, ownerEmail, LOOKS, MODELS, greetings, FUN_PROMPTS, SOURCES, THINKING_VERBS,
  OPENERS, SYCOPHANT_OPENERS, MINI_ANSWERS, INTENTS, SEARCHED_INTENTS, TOPICS, REASONING,
  ANSWERS, FLOW, LIMIT_NOTICE, NETWORK_ERROR, MODEL_QUIRKS
} from './content.js';

/* ---------- Settings ---------- */

const QUESTION_LIMIT = 10;        // Free plan. Generous, by industry standards.
const SPAM_WINDOW_MS = 15000;     // Four messages in this window counts as spam.
const SPAM_BURST = 4;
const LONG_CHAT = 22;             // Messages before the "context window" gives up.
const NETWORK_ERROR_RATE = 0.08;  // Reliability: 92%. Better than some real ones.
const PROMPT_ROTATION_MS = 6000;

/* ---------- Elements ---------- */

const $ = id => document.getElementById(id);

const root = document.documentElement;
const app = $('app');
const thread = $('thread');
const messages = $('messages');
const prompt = $('prompt');
const sendButton = $('send');
const menu = $('model-menu');

/* ---------- Small helpers ---------- */

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const pick = list => list[Math.floor(Math.random() * list.length)];
const between = ([min, max]) => min + Math.random() * (max - min);
const shuffle = list => list.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v);
const sleep = ms => new Promise(resolve => setTimeout(resolve, reducedMotion ? 0 : ms));
const currentLook = () => root.dataset.look;
const clockTime = date => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const formatSeconds = s => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`);
const scrollToEnd = () => { thread.scrollTop = thread.scrollHeight; };

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function copyToClipboard(text, onCopied) {
  try {
    navigator.clipboard.writeText(text).then(onCopied, () => {});
  } catch {
    // Clipboard unavailable. The visitor still has Ctrl+C, and opposable thumbs.
  }
}

/* ---------- Reading the visitor's message ---------- */

const classify = text => (INTENTS.find(([, pattern]) => pattern.test(text)) || ['fallback'])[0];
const isQuestion = text => /\?\s*$/.test(text);
const isCancel = text => /^(cancel|stop|never ?mind|forget it)\b/i.test(text.trim());
const stripMarkup = text => text.replace(/[*`]/g, '').trim();

function findContact(text) {
  const email = text.match(/[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/i);
  if (email) return email[0];
  const phone = text.match(/\+?\d[\d\s().-]{5,}\d/);
  return phone && phone[0].replace(/\D/g, '').length >= 7 ? phone[0].trim() : null;
}

function findName(text) {
  const name = text
    .replace(/^(hi|hello|hey)[,!.\s]*/i, '')
    .replace(/^(my name is|my name's|i am|i'm|im|it's|this is|call me)\s+/i, '')
    .replace(/[.!]+$/, '');
  return stripMarkup(name).slice(0, 60) || 'A visitor';
}

/* ---------- A very small markdown ----------
 * Supports ### headings, - lists, **bold**, *italic* and ```fenced``` blocks.
 * Just enough to look like a chatbot that loves formatting. */

const parseInline = line => line
  .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
  .filter(Boolean)
  .map(part => {
    if (part.startsWith('**')) return { tag: 'strong', text: part.slice(2, -2) };
    if (part.startsWith('*')) return { tag: 'em', text: part.slice(1, -1) };
    return { tag: 'span', text: part };
  });

function parseProse(markdown) {
  return markdown.split(/\n\n+/).filter(chunk => chunk.trim()).flatMap(chunk => {
    const blocks = [];
    const add = (tag, row) => {
      const last = blocks[blocks.length - 1];
      if (tag !== 'h3' && last && last.tag === tag) last.rows.push(row);
      else blocks.push({ tag, rows: [row] });
    };
    for (const line of chunk.split('\n')) {
      if (line.startsWith('### ')) add('h3', parseInline(line.slice(4)));
      else if (line.startsWith('- ')) add('ul', parseInline(line.slice(2)));
      else add('p', parseInline(line));
    }
    return blocks;
  });
}

function parseMarkdown(markdown) {
  const parts = markdown.split(/```(\w*)\n([\s\S]*?)\n```/);
  const blocks = [];
  for (let i = 0; i < parts.length; i += 3) {
    blocks.push(...parseProse(parts[i]));
    if (i + 2 < parts.length) blocks.push({ tag: 'code', label: parts[i + 1] || 'text', text: parts[i + 2] });
  }
  return blocks;
}

/* ---------- Rendering a reply, word by word ---------- */

function codeBlock(label, text) {
  const wrapper = element('div', 'code');
  const head = element('div', 'code-head');
  const copy = element('button', null, 'Copy');
  const pre = element('pre');
  const code = element('code');

  copy.type = 'button';
  copy.addEventListener('click', () => copyToClipboard(text, () => {
    copy.textContent = 'Copied';
    setTimeout(() => { copy.textContent = 'Copy'; }, 1400);
  }));

  head.append(element('span', null, label), copy);
  pre.append(code);
  wrapper.append(head, pre);
  return { wrapper, code };
}

// The "streaming". Each word waits a few milliseconds so it feels expensive.
async function typeOut(container, markdown, delay) {
  for (const block of parseMarkdown(markdown)) {
    if (block.tag === 'code') {
      const { wrapper, code } = codeBlock(block.label, block.text);
      container.append(wrapper);
      for (const [i, line] of block.text.split('\n').entries()) {
        code.textContent += (i ? '\n' : '') + line;
        scrollToEnd();
        await sleep(40);
      }
      continue;
    }

    const blockNode = element(block.tag);
    container.append(blockNode);
    for (const [i, row] of block.rows.entries()) {
      let host = blockNode;
      if (block.tag === 'ul') host = blockNode.appendChild(element('li'));
      else if (i > 0) blockNode.append(element('br'));

      for (const part of row) {
        const node = host.appendChild(element(part.tag));
        for (const word of part.text.split(/(\s+)/)) {
          node.textContent += word;
          if (word.trim()) {
            scrollToEnd();
            await sleep(between(delay));
          }
        }
      }
    }
  }
}

const ICONS = {
  copy: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="7" width="9.5" height="9.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M13 7V5.5a2 2 0 0 0-2-2H5.5a2 2 0 0 0-2 2V11a2 2 0 0 0 2 2H7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="m4.5 10.5 3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  thumbUp: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 9v7.5H4a.5.5 0 0 1-.5-.5V9.5A.5.5 0 0 1 4 9zm0 0 3-5.5c1.3 0 2 .9 1.7 2.2L10.8 8h4.4a1.6 1.6 0 0 1 1.6 1.9l-1 5.3a1.6 1.6 0 0 1-1.6 1.3H6.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  thumbDown: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" style="transform:rotate(180deg)"><path d="M6.5 9v7.5H4a.5.5 0 0 1-.5-.5V9.5A.5.5 0 0 1 4 9zm0 0 3-5.5c1.3 0 2 .9 1.7 2.2L10.8 8h4.4a1.6 1.6 0 0 1 1.6 1.9l-1 5.3a1.6 1.6 0 0 1-1.6 1.3H6.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  regenerate: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M16 10a6 6 0 1 1-1.8-4.3M16 3.5v3.3h-3.3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  memory: '<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 16.5h3.2L16 7.7a2.3 2.3 0 0 0-3.2-3.2L4 13.3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'
};

// Thumbs up and down go nowhere. Your feedback has been noted, by you.
function actionBar(message) {
  const bar = element('div', 'actions');
  const button = (icon, label, onClick) => {
    const b = element('button', 'icon-button');
    b.type = 'button';
    b.title = label;
    b.setAttribute('aria-label', label);
    b.innerHTML = ICONS[icon];
    b.addEventListener('click', () => onClick(b));
    bar.append(b);
    return b;
  };
  const toggle = (b, other) => {
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    other.setAttribute('aria-pressed', 'false');
  };

  button('copy', 'Copy', b => copyToClipboard(message.querySelector('.body').innerText, () => {
    b.innerHTML = ICONS.check;
    setTimeout(() => { b.innerHTML = ICONS.copy; }, 1400);
  }));
  const up = button('thumbUp', 'Good response', b => toggle(b, down));
  const down = button('thumbDown', 'Bad response', b => toggle(b, up));
  button('regenerate', 'Regenerate', () => { if (!busy) respond(message.produce, message); });
  return bar;
}

function thinkingIndicator(look, label) {
  const indicator = element('div', 'thinking');
  if (look === 'crab') {
    indicator.append(element('span', 'crab', '🦀'), element('span', 'verb', label || pick(THINKING_VERBS)));
  } else {
    indicator.append(element('span', 'dot'));
    if (label) indicator.append(element('span', 'shimmer', label));
  }
  return indicator;
}

/* ---------- Replying ----------
 * A reply is a "produce" function of the current look, so Regenerate can simply run it again.
 * It returns markdown, or { markdown, note, reasoning, sources, button, error }. */

let busy = false;
let messageCount = 0;

async function respond(produce, existing = null) {
  busy = true;
  syncComposer();

  const look = currentLook();
  const settings = LOOKS[look];
  const message = existing || messages.appendChild(element('div'));
  message.className = 'bot-message';
  message.dataset.look = look;
  message.produce = produce;
  message.textContent = '';

  const indicator = message.appendChild(thinkingIndicator(look, produce.thinkingLabel?.(look)));
  scrollToEnd();

  const thinkingTime = produce.thinkingTime
    || (look === 'knot' && selectedModel.knot === 'Aldebaran 5 Thinking' ? [1800, 3000] : settings.thinkingTime);
  const [output] = await Promise.all([produce(look, message), sleep(between(thinkingTime))]);
  const reply = typeof output === 'string' ? { markdown: output } : output;
  indicator.remove();

  if (reply.error) {
    const { text, action } = NETWORK_ERROR[look];
    const box = message.appendChild(element('div', 'error'));
    const retry = element('button', null, action);
    retry.type = 'button';
    retry.addEventListener('click', () => {
      if (busy) return;
      message.retried = true;
      respond(message.produce, message);
    });
    box.append(element('span', null, text), retry);
  } else {
    renderReply(message, reply, settings);
    await typeOut(message.querySelector('.body'), reply.markdown, settings.typingDelay);
    renderAfterwords(message, reply);
    if (!existing) messageCount++;
  }

  scrollToEnd();
  busy = false;
  syncComposer();
}

function renderReply(message, { note, reasoning }) {
  if (note) {
    const line = message.appendChild(element('div', 'memory-note'));
    line.innerHTML = ICONS.memory;
    line.append(note);
  }

  if (reasoning) {
    const duration = formatSeconds(reasoning.seconds);
    const toggle = message.appendChild(element('button', 'reasoning-toggle', `Thought for ${duration} ›`));
    const text = message.appendChild(element('p', 'reasoning', reasoning.text));
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    text.hidden = true;
    toggle.addEventListener('click', () => {
      text.hidden = !text.hidden;
      toggle.setAttribute('aria-expanded', String(!text.hidden));
      toggle.textContent = `Thought for ${duration} ${text.hidden ? '›' : '⌄'}`;
    });
  }

  message.append(element('div', 'body'));
}

function renderAfterwords(message, { sources, button }) {
  if (sources) {
    const row = message.appendChild(element('div', 'sources'));
    row.append(element('span', 'sources-label', 'Sources'), ...sources.map(s => element('span', null, s)));
  }
  if (button) {
    const b = message.appendChild(element('button', 'pill-button', button.label));
    b.type = 'button';
    b.addEventListener('click', button.onClick);
  }
  message.append(actionBar(message));
  message.classList.add('is-done');
}

/* ---------- Choosing what to say ---------- */

function answer(intent, question, withOpener = true) {
  const produce = async (look, message) => {
    const model = selectedModel[look];
    const repliesSoFar = messages.querySelectorAll('.bot-message.is-done').length;
    if (!message.retried && repliesSoFar > 1 && Math.random() < NETWORK_ERROR_RATE) return { error: true };

    // Contact always works. Even the cheap models know where the money is.
    const dumbedDown = (look === 'knot' && limited.knot) || model === 'Lame 5';
    if (intent !== 'contact' && dumbedDown) return pick(MINI_ANSWERS[look]);

    const options = ANSWERS[intent][look];
    let index = Math.floor(Math.random() * options.length);
    if (options.length > 1 && index === message.lastIndex) index = (index + 1) % options.length;
    message.lastIndex = index;

    let markdown = intent === 'contact' ? FLOW.askName[look]() : options[index];
    const separator = /^[#-]/.test(markdown) ? '\n\n' : ' ';
    if (look === 'knot' && model === 'Aldebaran 4o') {
      markdown = pick(SYCOPHANT_OPENERS) + separator + markdown;
    } else if (withOpener && ANSWERS[intent].opener) {
      markdown = pick(OPENERS[look][question ? 'question' : 'statement']) + separator + markdown;
    }

    const quirk = MODEL_QUIRKS[model];
    if (quirk) markdown = (quirk.prefix || '') + markdown + (quirk.suffix || '');

    const deepThinker = look === 'knot' && model === 'Aldebaran 5 Thinking';
    const reasoning = TOPICS[intent] && (deepThinker || Math.random() < 0.5)
      ? { seconds: Math.round(deepThinker ? 60 + Math.random() * 340 : 12 + Math.random() * 85), text: REASONING[look](TOPICS[intent]) }
      : null;
    const sources = SEARCHED_INTENTS.includes(intent) ? shuffle(SOURCES).slice(0, 3) : null;

    return { markdown, reasoning, sources };
  };

  if (SEARCHED_INTENTS.includes(intent)) {
    produce.thinkingLabel = look => (look === 'knot' ? 'Searching 3 sources…' : 'Searching the web…');
    produce.thinkingTime = [1400, 2200];
  }
  return respond(produce);
}

function say(step, extras) {
  const snapshot = { ...form };
  return respond(async look => {
    const markdown = FLOW[step][look](snapshot);
    return extras ? { markdown, ...extras(look) } : markdown;
  });
}

/* ---------- Usage limits ----------
 * Ten questions, or four in a row too fast, and you're on the free tier's free tier.
 * "Upgrade now" resets everything. If you read this far, you've earned it anyway. */

const questionsAsked = { knot: 0, crab: 0 };
const limited = { knot: false, crab: false };
const resetsAt = { knot: '', crab: '' };
let recentSends = [];
let lastMessage = '';
let repeats = 0;
let spamming = false;
let chatIsFull = false;

function hitLimit(look) {
  limited[look] = true;
  recentSends = [];
  repeats = 0;

  const reset = new Date();
  if (look === 'knot') reset.setMinutes(reset.getMinutes() + 197);
  else reset.setHours(reset.getHours() + 5, 0, 0, 0);
  resetsAt[look] = clockTime(reset);

  syncLimits();
}

function syncLimits() {
  const look = currentLook();
  $('limit-banner').hidden = !limited[look];
  $('limit-text').textContent = LIMIT_NOTICE[look](resetsAt[look]);
  $('model-name').textContent = limited.knot ? 'Aldebaran 5 mini' : selectedModel.knot;
  $('model-inline-name').textContent = selectedModel.crab;
  syncComposer();
}

let funPrompt = pick(FUN_PROMPTS);

function syncComposer() {
  const outOfMessages = currentLook() === 'crab' && limited.crab;
  const locked = outOfMessages || chatIsFull;

  prompt.disabled = locked;
  if (chatIsFull) prompt.placeholder = 'Start a new chat to continue';
  else if (outOfMessages) prompt.placeholder = `Out of free messages until ${resetsAt.crab}`;
  else prompt.placeholder = funPrompt;

  document.querySelectorAll('#suggestions button').forEach(b => { b.disabled = locked; });
  sendButton.disabled = locked || busy || !prompt.value.trim();
}

function rotateFunPrompt() {
  if (prompt.value || prompt.disabled) return;
  funPrompt = pick(FUN_PROMPTS.filter(p => p !== funPrompt));
  syncComposer();
}

function upgrade() {
  if (busy) return;
  const look = currentLook();
  limited[look] = false;
  questionsAsked[look] = 0;
  recentSends = [];
  repeats = 0;
  syncLimits();
  app.classList.remove('is-empty');
  respond(async l => FLOW.upgrade[l]());
}

async function compressChat() {
  chatIsFull = true;
  messages.append(element('div', 'system-note', 'This chat is getting long'));
  scrollToEnd();

  const produce = async look => ({
    markdown: FLOW.compressionFailed[look](),
    button: { label: 'Start new chat', onClick: newChat }
  });
  produce.thinkingLabel = look => (look === 'knot' ? 'Compressing chat…' : 'Compacting our conversation so we can keep chatting…');
  produce.thinkingTime = [2600, 3400];
  await respond(produce);
}

/* ---------- Conversation ---------- */

const suggestionTexts = [...document.querySelectorAll('#suggestions button')].map(b => b.textContent);
const emptyForm = () => ({ step: null, name: '', message: '', contact: '', followUps: 0 });
let form = emptyForm();
let offer = null;

function finishForm() {
  form.step = null;
  form.followUps = 0;
  offer = 'followUp';
  return say('recap');
}

function route(text) {
  const question = isQuestion(text);

  if (form.step && isCancel(text)) {
    form.step = null;
    return say('cancel');
  }
  // Clicking a suggestion (or asking a real question) mid-form abandons the form.
  if (form.step && (suggestionTexts.includes(text) || (form.step === 'name' && question && classify(text) !== 'fallback'))) {
    form.step = null;
  }

  switch (form.step) {
    case 'name':
      form.name = findName(text);
      form.step = 'message';
      return say('askMessage', look => (look === 'knot' ? { note: 'Memory updated' } : {}));

    case 'message':
      form.message = stripMarkup(text.replace(/```/g, '')) || '(no message)';
      if (form.contact) return finishForm();
      form.step = 'contact';
      return say('askContact');

    case 'contact': {
      const contact = findContact(text);
      if (contact) {
        form.contact = stripMarkup(contact);
        return finishForm();
      }
      const intent = classify(text);
      if (intent !== 'fallback' && intent !== 'contact') {
        form.step = null;
        return reply(intent, question);
      }
      return say('invalidContact');
    }
  }

  const contact = findContact(text);
  if (contact) {
    form = { ...emptyForm(), step: 'name', contact: stripMarkup(contact) };
    return say('askNameSpotted');
  }

  const intent = classify(text);
  if (intent === 'yes' && offer === 'followUp') {
    form.followUps++;
    if (form.followUps >= 3) {
      offer = null;
      return say('lastFollowUp', look => ({ button: { label: look === 'knot' ? 'Reset chat' : 'Start over', onClick: newChat } }));
    }
    return say('followUp');
  }
  if (intent === 'yes' && offer) return reply(offer, question, false);
  return reply(intent, question);
}

async function reply(intent, question, withOpener = true) {
  const look = currentLook();
  offer = ANSWERS[intent].offer?.[look] || null;
  if (intent === 'contact') form = { ...emptyForm(), step: 'name' };

  await answer(intent, question, withOpener);

  const counts = intent !== 'contact' && !limited[look];
  if (counts && (++questionsAsked[look] >= QUESTION_LIMIT || spamming)) hitLimit(look);
}

function trackSpam(text) {
  const now = Date.now();
  recentSends = recentSends.filter(time => now - time < SPAM_WINDOW_MS);
  recentSends.push(now);
  repeats = text.toLowerCase() === lastMessage ? repeats + 1 : 0;
  lastMessage = text.toLowerCase();
  spamming = recentSends.length >= SPAM_BURST || repeats >= 2;
}

async function ask(text) {
  text = text.trim();
  if (!text || busy || prompt.disabled) return;

  trackSpam(text);
  prompt.value = '';
  autoGrow();
  app.classList.remove('is-empty');
  $('chat-title').textContent = `Getting to know ${OWNER}`;
  $('chat-title').classList.toggle('is-visible', currentLook() === 'crab');

  messages.append(element('div', 'user-message', text));
  messageCount++;

  await route(text);
  if (!form.step && !chatIsFull && messageCount >= LONG_CHAT) await compressChat();
}

function newChat() {
  if (busy) return;
  messages.textContent = '';
  app.classList.add('is-empty');
  $('chat-title').classList.remove('is-visible');
  form = emptyForm();
  offer = null;
  messageCount = 0;
  chatIsFull = false;
  syncComposer();
  if (!prompt.disabled) prompt.focus();
}

/* ---------- Model pickers ---------- */

const selectedModel = { knot: 'Aldebaran 5', crab: 'Epic 7' };
let menuAnchor = null;

function closeMenu() {
  menu.hidden = true;
  menuAnchor?.setAttribute('aria-expanded', 'false');
  menuAnchor = null;
}

function openMenu(anchor, look) {
  if (menuAnchor === anchor) return closeMenu();
  closeMenu();

  menu.textContent = '';
  for (const [name, blurb] of MODELS[look]) {
    const selected = selectedModel[look] === name;
    const item = element('button');
    item.type = 'button';
    item.setAttribute('role', 'menuitemradio');
    item.setAttribute('aria-checked', String(selected));
    item.append(element('span', 'name', name), element('span', 'check', selected ? '✓' : ''), element('span', 'blurb', blurb));
    item.addEventListener('click', () => {
      selectedModel[look] = name;
      closeMenu();
      syncLimits();
    });
    menu.append(item);
  }

  const box = anchor.getBoundingClientRect();
  const position = look === 'knot'
    ? { left: `${Math.max(8, box.left)}px`, top: `${box.bottom + 6}px`, right: 'auto', bottom: 'auto' }
    : { right: `${Math.max(8, innerWidth - box.right)}px`, bottom: `${innerHeight - box.top + 8}px`, left: 'auto', top: 'auto' };
  Object.assign(menu.style, position);

  menu.hidden = false;
  menuAnchor = anchor;
  anchor.setAttribute('aria-expanded', 'true');
  menu.querySelector('[aria-checked="true"]').focus();
}

/* ---------- Switching looks ---------- */

function setLook(look, announce = false) {
  const settings = LOOKS[look];
  const other = LOOKS[settings.other];

  root.dataset.look = look;
  closeMenu();
  $('disclaimer').textContent = settings.disclaimer;
  $('greeting').textContent = pick(greetings(look));
  $('look-switch-emoji').textContent = other.emoji;
  $('look-switch').setAttribute('aria-label', `Switch to ${other.label}`);
  $('look-switch').title = `Switch to ${other.label} ${other.emoji}`;
  $('model-picker').style.visibility = look === 'knot' ? 'visible' : 'hidden';
  $('chat-title').classList.toggle('is-visible', look === 'crab' && !app.classList.contains('is-empty'));
  syncLimits();

  if (announce && !app.classList.contains('is-empty')) {
    messages.append(element('div', 'system-note', `Switched to ${settings.label} ${settings.emoji}`));
    scrollToEnd();
  }

  try {
    history.replaceState(null, '', look === 'crab' ? '#crab' : location.pathname + location.search);
  } catch {
    // Some hosts won't let us touch the URL. The crab doesn't mind.
  }
}

/* ---------- Wiring ---------- */

function autoGrow() {
  prompt.style.height = 'auto';
  prompt.style.height = `${prompt.scrollHeight}px`;
}

prompt.addEventListener('input', () => {
  autoGrow();
  syncComposer();
});

prompt.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    ask(prompt.value);
  }
});

$('composer').addEventListener('submit', event => {
  event.preventDefault();
  ask(prompt.value);
});

document.querySelectorAll('#suggestions button').forEach(b => b.addEventListener('click', () => ask(b.textContent)));
$('look-switch').addEventListener('click', () => setLook(LOOKS[currentLook()].other, true));
$('new-chat').addEventListener('click', newChat);
$('upgrade').addEventListener('click', upgrade);

$('model-picker').addEventListener('click', event => {
  event.stopPropagation();
  openMenu($('model-picker'), 'knot');
});
$('model-inline').addEventListener('click', event => {
  event.stopPropagation();
  openMenu($('model-inline'), 'crab');
});
document.addEventListener('click', event => {
  if (!menu.hidden && !menu.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || menu.hidden) return;
  const anchor = menuAnchor;
  closeMenu();
  anchor?.focus();
});
addEventListener('resize', closeMenu);

setInterval(rotateFunPrompt, PROMPT_ROTATION_MS);
setLook(location.hash === '#crab' ? 'crab' : 'knot');

console.log(
  '%c👀 Looking under the hood?%c\nThere is no model. There never was. Just regex and good intentions.\nIf you want to talk to Alex, ask the chat: "How do I reach Alex?"',
  'font-size:16px;font-weight:600',
  'font-size:13px'
);

// That's it. No AI was harmed in the making of this website.
// No AI was involved either. (Okay, a crab helped.)
