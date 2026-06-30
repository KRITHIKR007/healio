(function () {
    const isAdminPage = window.location.pathname.includes('admin.html');
    if (isAdminPage) return;

    // Immediately hide the page to prevent any flash of the real site
    document.documentElement.style.visibility = 'hidden';

    // Fetch current global mode from the API (or fall back to localStorage for local dev)
    function fetchMode() {
        return fetch('/api/mode', { cache: 'no-store' })
            .then(function (r) {
                if (!r.ok) throw new Error('API error');
                return r.json();
            })
            .then(function (data) {
                return data.mode || 'active';
            })
            .catch(function () {
                // Fallback for local development (vite dev server has no API)
                return localStorage.getItem('healio_shutdown_mode') || 'active';
            });
    }

    fetchMode().then(function (shutdownMode) {
        // If site is active, reveal page and exit
        if (!shutdownMode || shutdownMode === 'active') {
            document.documentElement.style.visibility = '';
            return;
        }

        // Site is in a shutdown mode — inject the overlay
        var doRender = function () {
            // Inject styles
            var style = document.createElement('style');
            style.textContent = [
                "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');",
                "* { box-sizing: border-box; margin: 0; padding: 0; }",
                "body { background-color: #08090d !important; background-image: radial-gradient(circle at 50% 50%, #11131c 0%, #08090d 100%) !important; color: #f1f5f9 !important; font-family: 'Outfit', -apple-system, sans-serif !important; height: 100vh !important; width: 100vw !important; display: flex !important; justify-content: center !important; align-items: center !important; overflow: hidden !important; position: relative !important; }",
                ".shutdown-wrapper { max-width: 520px; width: 90%; text-align: center; animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; z-index: 10; }",
                ".status-indicator { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); font-size: 0.8rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 2rem; }",
                ".dot { width: 8px; height: 8px; border-radius: 50%; }",
                ".shutdown-title { font-size: 2.5rem; font-weight: 700; letter-spacing: -0.03em; color: #ffffff; margin-bottom: 1.2rem; line-height: 1.15; }",
                ".shutdown-desc { font-size: 1.05rem; color: #94a3b8; line-height: 1.6; margin-bottom: 2.5rem; font-weight: 300; }",
                ".minimal-list { text-align: left; margin: 0 auto 2.5rem; max-width: 400px; display: flex; flex-direction: column; gap: 12px; padding: 1.5rem; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.03); border-radius: 16px; }",
                ".list-item { display: flex; align-items: center; gap: 12px; font-size: 0.9rem; color: #cbd5e1; }",
                ".list-item i { font-size: 0.85rem; }",
                ".list-item .done { color: #10b981; }",
                ".list-item .pending { color: #f59e0b; animation: pulse 2s infinite; }",
                ".contact-card { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 2rem; margin-top: 2rem; display: flex; flex-direction: column; align-items: center; gap: 12px; }",
                ".contact-card-title { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 600; }",
                ".contact-links { display: flex; align-items: center; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }",
                ".contact-link { display: inline-flex; align-items: center; gap: 8px; color: #94a3b8 !important; text-decoration: none; font-size: 0.9rem; transition: color 0.3s ease; }",
                ".contact-link:hover { color: #ffffff !important; }",
                ".contact-link i { font-size: 0.95rem; }",
                ".theme-maintenance .dot { background: #f59e0b; box-shadow: 0 0 10px rgba(245,158,11,0.5); }",
                ".theme-maintenance .status-indicator { color: #f59e0b; }",
                ".theme-issues .dot { background: #ef4444; box-shadow: 0 0 10px rgba(239,68,68,0.5); }",
                ".theme-issues .status-indicator { color: #ef4444; }",
                ".theme-plan .dot { background: #3b82f6; box-shadow: 0 0 10px rgba(59,130,246,0.5); }",
                ".theme-plan .status-indicator { color: #3b82f6; }",
                ".admin-secret-access { position: absolute; bottom: 25px; right: 25px; color: rgba(255,255,255,0.1) !important; text-decoration: none; font-size: 0.8rem; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 6px; padding: 8px; letter-spacing: 0.05em; }",
                ".admin-secret-access:hover { color: rgba(255,255,255,0.5) !important; background: rgba(255,255,255,0.02); border-radius: 6px; }",
                "@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }",
                "@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }"
            ].join('');
            document.head.appendChild(style);

            var innerHtml = '';
            var wrapperClass = '';

            if (shutdownMode === 'maintenance') {
                wrapperClass = 'theme-maintenance';
                innerHtml = [
                    '<div class="status-indicator"><span class="dot"></span> Maintenance Protocol Active</div>',
                    '<h1 class="shutdown-title">Down for maintenance.</h1>',
                    '<p class="shutdown-desc">Healio is undergoing system upgrades and scheduled performance tuning. We will return shortly with optimized medical booking capabilities.</p>',
                    '<div class="minimal-list">',
                    '  <div class="list-item"><i class="fa-solid fa-circle-check done"></i><span>Secure database replication completed</span></div>',
                    '  <div class="list-item"><i class="fa-solid fa-circle-check done"></i><span>Provider network registry updated</span></div>',
                    '  <div class="list-item"><i class="fa-solid fa-circle pending"></i><span>Optimizing node cache memory configurations</span></div>',
                    '</div>'
                ].join('');
            } else if (shutdownMode === 'unresolved_issues') {
                wrapperClass = 'theme-issues';
                innerHtml = [
                    '<div class="status-indicator"><span class="dot"></span> Temporary Outage Detected</div>',
                    '<h1 class="shutdown-title">Service unavailable.</h1>',
                    '<p class="shutdown-desc">We have detected an unexpected database interruption. Our technical administrators are troubleshooting the connection to restore services as fast as possible.</p>'
                ].join('');
            } else if (shutdownMode === 'inactive_plan') {
                wrapperClass = 'theme-plan';
                innerHtml = [
                    '<div class="status-indicator"><span class="dot"></span> Subscription Inactive</div>',
                    '<h1 class="shutdown-title">License paused.</h1>',
                    '<p class="shutdown-desc">The workspace license plan for this platform has expired. If you are the system manager, please complete billing details to re-enable service access.</p>'
                ].join('');
            }

            var contactBox = [
                '<div class="contact-card">',
                '  <span class="contact-card-title">ApexOne Studios Support</span>',
                '  <div class="contact-links">',
                '    <a href="mailto:apexonestudio@gmail.com" class="contact-link"><i class="fa-solid fa-envelope"></i> apexonestudio@gmail.com</a>',
                '    <a href="https://wa.me/918073355047" target="_blank" class="contact-link"><i class="fa-brands fa-whatsapp"></i> +91 8073355047</a>',
                '  </div>',
                '</div>'
            ].join('');

            var wrapper = document.createElement('div');
            wrapper.className = 'shutdown-wrapper ' + wrapperClass;
            wrapper.innerHTML = innerHtml + contactBox;

            var secretLink = document.createElement('a');
            secretLink.className = 'admin-secret-access';
            secretLink.href = 'admin.html';
            secretLink.innerHTML = '<i class="fa-solid fa-key"></i> administrative console';

            document.body.className = '';
            document.body.innerHTML = '';
            document.body.appendChild(wrapper);
            document.body.appendChild(secretLink);

            // Reveal
            document.documentElement.style.visibility = '';
        };

        // Wait for DOM if needed
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', doRender);
        } else {
            doRender();
        }
    });
})();
