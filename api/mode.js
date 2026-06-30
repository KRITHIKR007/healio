import { Redis } from '@upstash/redis';

const VALID_MODES = ['active', 'maintenance', 'unresolved_issues', 'inactive_plan'];

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET — return current site mode
    if (req.method === 'GET') {
        try {
            const redis = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN,
            });
            const mode = await redis.get('healio_shutdown_mode');
            return res.status(200).json({ mode: mode || 'active' });
        } catch (err) {
            console.error('Redis read error:', err.message);
            // Safe default: show site as active if storage is unavailable
            return res.status(200).json({ mode: 'active' });
        }
    }

    // POST — update site mode (requires admin secret)
    if (req.method === 'POST') {
        const ADMIN_SECRET = process.env.ADMIN_SECRET;
        if (!ADMIN_SECRET) {
            return res.status(500).json({ error: 'Server not configured. Add ADMIN_SECRET to Vercel environment variables.' });
        }

        const { secret, mode } = req.body || {};
        if (!secret || secret !== ADMIN_SECRET) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (!VALID_MODES.includes(mode)) {
            return res.status(400).json({ error: `Invalid mode. Must be one of: ${VALID_MODES.join(', ')}` });
        }

        try {
            const redis = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN,
            });
            await redis.set('healio_shutdown_mode', mode);
            return res.status(200).json({ success: true, mode });
        } catch (err) {
            console.error('Redis write error:', err.message);
            return res.status(500).json({ error: 'Storage error. Check Upstash Redis configuration.' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

