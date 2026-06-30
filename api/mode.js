import { createClient } from '@supabase/supabase-js';

const VALID_MODES = ['active', 'maintenance', 'unresolved_issues', 'inactive_plan'];

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // GET — return current site mode
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('site_config')
                .select('mode')
                .eq('id', 1)
                .single();

            if (error) throw error;
            return res.status(200).json({ mode: data.mode || 'active' });
        } catch (err) {
            console.error('Supabase read error:', err.message);
            return res.status(200).json({ mode: 'active' }); // safe default
        }
    }

    // POST — update site mode (requires admin secret)
    if (req.method === 'POST') {
        const ADMIN_SECRET = process.env.ADMIN_SECRET;
        if (!ADMIN_SECRET) {
            return res.status(500).json({ error: 'ADMIN_SECRET not configured in Vercel env vars.' });
        }

        const { secret, mode } = req.body || {};

        if (!secret || secret !== ADMIN_SECRET) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (!VALID_MODES.includes(mode)) {
            return res.status(400).json({ error: `Invalid mode. Must be one of: ${VALID_MODES.join(', ')}` });
        }

        try {
            const { error } = await supabase
                .from('site_config')
                .upsert({ id: 1, mode, updated_at: new Date().toISOString() });

            if (error) throw error;
            return res.status(200).json({ success: true, mode });
        } catch (err) {
            console.error('Supabase write error:', err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
