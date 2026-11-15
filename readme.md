# Vanna Len — Portfolio

A dark-first, responsive portfolio for **Vanna Len**, a web developer and UI/UX designer based in Phnom Penh, Cambodia. Built with semantic HTML, modern CSS, and dependency-free JavaScript.

## Highlights

- Dark and light themes with saved preference and no flash on load
- Responsive layout from 320px to wide desktop screens
- Mobile navigation with keyboard support, backdrop, and Escape handling
- Scroll-triggered reveals, animated counters, and skill bars
- Project filtering with live status announcements
- Accessible contact form with validation, loading state, and email fallback
- Serverless contact endpoint that keeps the Telegram bot token on the server
- Reduced-motion support and visible focus states throughout
- Optimized image variants for faster loading

## Project structure

```text
.
├── index.html                  # Single-page portfolio
├── style/
│   ├── styles.css              # Design tokens, layout, components, themes
│   ├── animations.css          # Keyframes, reveals, reduced-motion rules
│   └── responsive.css          # Breakpoints and mobile navigation
├── js/
│   ├── script.js               # Theme, navigation, scroll state, contact form
│   ├── projects.js             # Project filtering
│   └── animations.js           # Reveal observer, counters, skill bars
├── api/
│   └── contact.js              # Vercel serverless contact handler
├── image/                      # Profile, project, and optimized image assets
├── download-CV/                # Downloadable CV
├── .env.example                # Required environment variable names
├── .gitignore
└── readme.md
```

## Run locally

The site is static, but the contact endpoint requires a serverless runtime. To preview the page:

```bash
npx serve .
```

Or:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

To run the page and the contact API together, use Vercel's local runtime:

```bash
npx vercel dev
```

## Deploy

### Vercel (recommended)

Vercel supports the static site and `api/contact.js` in one project.

1. Import the GitHub repository into Vercel.
2. Add the environment variables `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in **Project Settings → Environment Variables**.
3. Deploy. The contact form posts to `/api/contact`.

### GitHub Pages

GitHub Pages can host the static site, but it cannot run `api/contact.js`. The form will show a friendly error with a direct **email me** link as a fallback. For a working form, deploy the API on Vercel or adapt `api/contact.js` to another serverless provider.

## Contact form setup

1. Create a Telegram bot with [BotFather](https://t.me/BotFather) and copy the token.
2. Get the chat ID that should receive messages.
3. Add both values to the hosting provider's environment settings. For local runs, export them in your shell or create a local `.env` file from `.env.example`; never commit it.
4. Test with `npx vercel dev` and submit the form.

The browser sends only `name`, `email`, `message`, and a honeypot field. The server validates input, rate-limits requests, and sends the message to Telegram. The token is never exposed to the client.

> **Security notice:** an older version of this project contained a Telegram bot token in client-side JavaScript. That token must be revoked in BotFather and replaced. Removing the file does not remove the secret from Git history, so rotation is required even if the old token is no longer used.

## Customize

### Colors and typography

Edit the design tokens near the top of `style/styles.css`. Both themes use the same token names, so changing the palette in one place updates the whole site.

### Content

Update `index.html` for personal details, projects, skills, experience, and activity entries. The footer year is generated automatically.

### Images

Replace the optimized files in `image/` and keep the `width` and `height` attributes in `index.html` accurate to avoid layout shifts. The originals are retained in the same folder.

### CV

Replace `download-CV/Len vanna-Python Developer-CV.pdf` with an updated file and keep the same filename, or update the download links in `index.html`.

## Accessibility and performance

- Semantic landmarks, skip link, and labelled form fields
- `aria-expanded`, `aria-pressed`, `aria-current`, and live status regions
- Visible focus styles and keyboard-operable navigation
- `prefers-reduced-motion` respected by animations and scrolling
- Lazy-loaded images below the fold with explicit dimensions
- No JavaScript framework or build step

## Testing checklist

```bash
node --check js/script.js
node --check js/projects.js
node --check js/animations.js
node --check api/contact.js
```

Then verify:

- Navigation, theme toggle, project filters, and back-to-top button
- Contact form validation and success/error states
- Layout at 320px, 768px, 1024px, and wide desktop widths
- Keyboard-only flow, including Escape to close the mobile menu
- Reduced-motion mode and both color themes

## License

© 2026 Vanna Len. All rights reserved.
