(function () {
    const shutdownMode = localStorage.getItem('healio_shutdown_mode');
    const isLoginPage = window.location.pathname.includes('admin.html');

    // Only intercept if a shutdown mode is active and we are not on the admin page
    if (shutdownMode && shutdownMode !== 'active' && !isLoginPage) {
        // Immediately hide document elements to prevent flash of content
        document.documentElement.style.display = 'none';

        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', function () {
            // Apply fonts and base overlay stylesheet
            const style = document.createElement('style');
            style.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                
                body {
                    background: radial-gradient(circle at center, #0f172a 0%, #020617 100%) !important;
                    color: #f1f5f9 !important;
                    font-family: 'Outfit', sans-serif !important;
                    height: 100vh !important;
                    width: 100vw !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    overflow: hidden !important;
                    position: relative !important;
                }
                
                .shutdown-container {
                    max-width: 650px;
                    width: 90%;
                    padding: 3rem;
                    background: rgba(15, 23, 42, 0.45);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    text-align: center;
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    z-index: 10;
                }
                
                .icon-wrapper {
                    position: relative;
                    width: 90px;
                    height: 90px;
                    margin: 0 auto 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                
                .shutdown-title {
                    font-size: 2.2rem;
                    font-weight: 800;
                    letter-spacing: -0.025em;
                    margin-bottom: 1.2rem;
                    text-transform: uppercase;
                }
                
                .shutdown-desc {
                    font-size: 1.1rem;
                    color: #94a3b8;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    font-weight: 300;
                }
                
                /* Option-specific Themes & Styles */
                
                /* 1. Maintenance Mode */
                .theme-maintenance .icon-wrapper {
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.2);
                    box-shadow: 0 0 30px rgba(245, 158, 11, 0.15);
                }
                
                .theme-maintenance .icon-wrapper i {
                    color: #f59e0b;
                    font-size: 2.8rem;
                    animation: rotateGear 8s linear infinite;
                }
                
                .theme-maintenance .shutdown-title {
                    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                /* 2. Unresolved Issues Mode */
                .theme-issues .icon-wrapper {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    box-shadow: 0 0 30px rgba(239, 68, 68, 0.15);
                }
                
                .theme-issues .icon-wrapper i {
                    color: #ef4444;
                    font-size: 2.8rem;
                    animation: pulseAlert 2s infinite ease-in-out;
                }
                
                .theme-issues .shutdown-title {
                    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                /* 3. Inactive Plans Mode */
                .theme-plan .icon-wrapper {
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    box-shadow: 0 0 30px rgba(59, 130, 246, 0.15);
                }
                
                .theme-plan .icon-wrapper i {
                    color: #3b82f6;
                    font-size: 2.8rem;
                    animation: floatIcon 4s infinite ease-in-out;
                }
                
                .theme-plan .shutdown-title {
                    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                /* Interactive Checklists and Cards */
                .maintenance-checklist {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    border-radius: 16px;
                    padding: 1.2rem;
                    margin-bottom: 2rem;
                    text-align: left;
                }
                
                .checklist-item {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    font-size: 0.95rem;
                    margin-bottom: 0.75rem;
                    color: #cbd5e1;
                }
                
                .checklist-item:last-child {
                    margin-bottom: 0;
                }
                
                .checklist-item i.status-done {
                    color: #10b981;
                }
                
                .checklist-item i.status-loading {
                    color: #f59e0b;
                    animation: rotateGear 2s linear infinite;
                }
                
                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.8rem 1.8rem;
                    border-radius: 12px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .btn-maintenance {
                    background: #f59e0b;
                    color: #0f172a;
                    border: none;
                }
                
                .btn-maintenance:hover {
                    background: #d97706;
                    transform: translateY(-2px);
                }
                
                .btn-issues {
                    background: #ef4444;
                    color: #ffffff;
                    border: none;
                }
                
                .btn-issues:hover {
                    background: #dc2626;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2);
                }
                
                .btn-plan {
                    background: #3b82f6;
                    color: #ffffff;
                    border: none;
                }
                
                .btn-plan:hover {
                    background: #2563eb;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2);
                }
                
                /* Hidden/Subtle Admin Link */
                .admin-secret-access {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    color: rgba(255, 255, 255, 0.15) !important;
                    text-decoration: none;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    z-index: 100;
                    padding: 10px;
                }
                
                .admin-secret-access:hover {
                    color: rgba(255, 255, 255, 0.75) !important;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                }
                
                /* Decorative background particles */
                .bg-glow-orb {
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    border-radius: 50%;
                    filter: blur(120px);
                    opacity: 0.15;
                    pointer-events: none;
                }
                
                .orb-1 {
                    top: -100px;
                    left: -100px;
                    background: #3b82f6;
                }
                
                .orb-2 {
                    bottom: -150px;
                    right: -100px;
                    background: #f59e0b;
                }
                
                /* Animations */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes rotateGear {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes pulseAlert {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.15); opacity: 0.8; }
                }
                
                @keyframes floatIcon {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);

            // Set up HTML templates
            let innerHtml = '';
            let themeClass = '';

            if (shutdownMode === 'maintenance') {
                themeClass = 'theme-maintenance';
                innerHtml = `
                    <div class="icon-wrapper">
                        <i class="fa-solid fa-gears"></i>
                    </div>
                    <h1 class="shutdown-title">System Maintenance</h1>
                    <p class="shutdown-desc">Healio is currently undergoing scheduled performance tuning and database upgrades. We will be back online shortly to continue providing premium global healthcare support.</p>
                    
                    <div class="maintenance-checklist">
                        <div class="checklist-item">
                            <i class="fa-solid fa-circle-check status-done"></i>
                            <span>Securing client communications & database backup (Completed)</span>
                        </div>
                        <div class="checklist-item">
                            <i class="fa-solid fa-circle-check status-done"></i>
                            <span>Updating medical provider portal registry (Completed)</span>
                        </div>
                        <div class="checklist-item">
                            <i class="fa-solid fa-gear status-loading"></i>
                            <span>Rebalancing system clusters and cache memory (In Progress)</span>
                        </div>
                    </div>
                    
                    <button onclick="window.location.reload();" class="btn btn-maintenance">
                        <i class="fa-solid fa-rotate"></i> Check Status
                    </button>
                `;
            } else if (shutdownMode === 'unresolved_issues') {
                themeClass = 'theme-issues';
                innerHtml = `
                    <div class="icon-wrapper">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h1 class="shutdown-title">Temporary Outage</h1>
                    <p class="shutdown-desc">Our technical staff has detected an anomalous server condition. For security and system stability, the platform has been temporarily taken offline. We are working diligently to resolve the issue.</p>
                    
                    <a href="mailto:support@heliowellness.com?subject=Outage Inquiry" class="btn btn-issues">
                        <i class="fa-solid fa-envelope"></i> Contact Medical Support Desk
                    </a>
                `;
            } else if (shutdownMode === 'inactive_plan') {
                themeClass = 'theme-plan';
                innerHtml = `
                    <div class="icon-wrapper">
                        <i class="fa-solid fa-credit-card"></i>
                    </div>
                    <h1 class="shutdown-title">Subscription Inactive</h1>
                    <p class="shutdown-desc">The workspace license plan for this service has expired or has been paused. Please contact your system administrator or billing representative to renew subscription services immediately.</p>
                    
                    <a href="mailto:billing@heliowellness.com?subject=Healio License Renewal Plan" class="btn btn-plan">
                        <i class="fa-solid fa-wallet"></i> Renew Subscription Plan
                    </a>
                `;
            }

            // Create background ambient glows
            const orb1 = document.createElement('div');
            orb1.className = 'bg-glow-orb orb-1';
            const orb2 = document.createElement('div');
            orb2.className = 'bg-glow-orb orb-2';
            
            // Build the main wrapper
            const wrapper = document.createElement('div');
            wrapper.className = `shutdown-container ${themeClass}`;
            wrapper.innerHTML = innerHtml;

            // Admin secret navigation link
            const secretLink = document.createElement('a');
            secretLink.className = 'admin-secret-access';
            secretLink.href = 'admin.html';
            secretLink.innerHTML = '<i class="fa-solid fa-key"></i> Admin Access';

            // Clear body completely and inject our structures
            document.body.className = '';
            document.body.innerHTML = '';
            document.body.appendChild(orb1);
            document.body.appendChild(orb2);
            document.body.appendChild(wrapper);
            document.body.appendChild(secretLink);

            // Re-show document
            document.documentElement.style.display = '';
        });
    }
})();
