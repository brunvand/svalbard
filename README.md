# svalbard

Personal website: a chat assistant that answers questions about Alex.
Plain HTML, CSS and JavaScript, no build step, no dependencies, no model.

- `index.html` – the page
- `404.html` – sends every other address back to the page, keeping `#knot` or `#crab`
- `style.css` – all three looks: Alex's own (night and day), CheapET and Clawdio
- `content.js` – everything the assistant says
- `brain.js` – picks the answer: keywords, typo forgiveness, a short memory and a second opinion
- `examples.js` – the ways people might ask, for that second opinion
- `chat.js` – the engine that pretends to think
- `questions.test.mjs` – the assistant's exam; run `node questions.test.mjs` before merging
- `sky.js` – the stars and shooting stars behind Alex's look
- `fonts/` – self-hosted fonts and their licenses. `alex-wordmark.woff2` is Michroma with its V turned upside down as the A
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` – the ⋀ icon
- `og-image.png` – the preview image for shared links
- `robots.txt` – keeps the site out of search engines and lets AI assistants in
- `llms.txt` – what those assistants get to read: the paid media and tracking problems Alex gets called for

Nothing loads from other servers. Published with GitHub Pages from the `main` branch.
