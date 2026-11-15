/**
 * Secure contact endpoint.
 *
 * Deploy this project on Vercel (or adapt the same handler to another
 * serverless platform) and set these environment variables in the hosting
 * dashboard — never in the repository:
 *
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_CHAT_ID
 *
 * The browser only calls /api/contact. It never receives a bot token.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const requests = new Map();

function sendJson(res, statusCode, payload) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(payload));
}

function isRateLimited(ip) {
    const now = Date.now();
    const entry = requests.get(ip);

    if (!entry || now - entry.start > WINDOW_MS) {
        requests.set(ip, { start: now, count: 1 });
        return false;
    }

    if (entry.count >= MAX_REQUESTS) {
        return true;
    }

    entry.count += 1;
    return false;
}

function clean(value) {
    return typeof value === 'string' ? value.trim() : '';
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendJson(res, 405, { ok: false, error: 'Method not allowed.' });
    }

    const origin = req.headers.origin;
    const host = req.headers.host;

    if (origin && host) {
        try {
            if (new URL(origin).host !== host) {
                return sendJson(res, 403, { ok: false, error: 'Request not allowed.' });
            }
        } catch (error) {
            return sendJson(res, 403, { ok: false, error: 'Request not allowed.' });
        }
    }

    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0] : 'unknown').trim();

    if (isRateLimited(ip)) {
        return sendJson(res, 429, { ok: false, error: 'Too many messages. Please try again later.' });
    }

    let data = req.body;

    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (error) {
            return sendJson(res, 400, { ok: false, error: 'Invalid request body.' });
        }
    }

    if (!data || typeof data !== 'object') {
        return sendJson(res, 400, { ok: false, error: 'Invalid request body.' });
    }

    const honeypot = clean(data.website);
    if (honeypot) {
        return sendJson(res, 200, { ok: true });
    }

    const name = clean(data.name);
    const email = clean(data.email);
    const message = clean(data.message);

    if (name.length < 2 || name.length > 100) {
        return sendJson(res, 400, { ok: false, error: 'Please provide a valid name.' });
    }

    if (email.length < 5 || email.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return sendJson(res, 400, { ok: false, error: 'Please provide a valid email address.' });
    }

    if (message.length < 10 || message.length > 5000) {
        return sendJson(res, 400, { ok: false, error: 'Please provide a message between 10 and 5000 characters.' });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return sendJson(res, 503, { ok: false, error: 'Contact service is not configured.' });
    }

    const text = [
        'New message from portfolio',
        '',
        'Name: ' + name,
        'Email: ' + email,
        'Message:',
        message
    ].join('\n');

    try {
        const telegramResponse = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                disable_web_page_preview: true
            })
        });

        if (!telegramResponse.ok) {
            console.error('Telegram delivery failed with status', telegramResponse.status);
            return sendJson(res, 502, { ok: false, error: 'Unable to deliver the message.' });
        }

        return sendJson(res, 200, { ok: true });
    } catch (error) {
        console.error('Telegram delivery request failed');
        return sendJson(res, 502, { ok: false, error: 'Unable to deliver the message.' });
    }
};
