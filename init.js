window.addEventListener('DOMContentLoaded', () => {
    if (typeof countryData === 'undefined' || typeof baseSectorDetailData === 'undefined') {
        console.warn("Data dependencies (data.js) missing or not loaded.");
    }

    // Auto-detect Lite Mode (Saved preference or Slow Connection)
    const savedLite = localStorage.getItem('ai4eac_lite_mode');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlow = connection && (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === '3g');
    
    if (savedLite === 'true' || (savedLite === null && isSlow)) {
        toggleLowBandwidth();
    }

    injectSectorDrawer(); // Inject the new Sector Drawer
    injectAboutDrawer(); // Inject About panel (triggered from horizontal nav bar)
    injectDataSourcesDrawer(); // Inject Data Sources panel (triggered from horizontal nav bar)
    injectObservatoryDrawer(); // Inject Sector Intelligence Observatory (triggered from horizontal nav bar)
    injectCourseSubmissionDrawer(); // Inject Course Submission drawer for training institutions
    renderMainLanding(); // Render the 3-Pillar Dashboard
    refreshIcons();
    const _savedSector = localStorage.getItem('ai4eac_sector') || 'agri';
    const _savedCountry = localStorage.getItem('ai4eac_country') || 'all';
    setGlobalSector(_savedSector);
    if (_savedCountry !== 'all') setGlobalCountry(_savedCountry);
    updateTrainingProviders();
    loadMyPlan(); // Load saved plan from LocalStorage
    resetCareerHub();

    const hubSelector = document.getElementById('hub-country');
    if (hubSelector) {
        hubSelector.value = activeCountry;
    }

    // Hide spinner now that synchronous renders are done — data loads async below
    const spinner = document.getElementById('global-loader');
    if (spinner) spinner.classList.add('hidden');

    dataManager.init(); // Load JSON data and re-render stats/occupations

    // Language Persistence
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
        const savedLang = localStorage.getItem('ai4eac_lang');
        if (savedLang) langSelector.value = savedLang;
        
        langSelector.addEventListener('change', (e) => {
            localStorage.setItem('ai4eac_lang', e.target.value);
        });
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered, scope:', reg.scope))
            .catch(err => console.warn('SW registration failed (expected on file://):', err));
    }
});

// --- NEW: Generate Pathway Logic (Moved from index.html) ---
window.generatePathway = function() {
    const role = document.getElementById('pathway-role').value;
    document.getElementById('pathway-role-display').innerText = role;
    const results = document.getElementById('pathway-results');
    results.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    results.scrollIntoView({ behavior: 'smooth' });
}

// --- NEW: My Plan Widget Logic ---
window.toggleMyPlan = function() {
    const panel = document.getElementById('my-plan-panel');
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        renderMyPlan();
    } else {
        panel.classList.add('hidden');
    }
}

window.togglePlanItem = function(type, id, name) {
    const set = myPlan[type];
    if (set.has(id)) {
        set.delete(id);
    } else {
        set.add(id);
        // Store name map if needed, for now assuming ID is sufficient or name passed
        if(!myPlan.names) myPlan.names = {};
        myPlan.names[id] = name;
    }
    
    saveMyPlan(); // Save to storage on change
    updatePlanBadge();
    renderMyPlan();
    
    // Update UI buttons if visible
    if (type === 'roles') {
        const btnText = document.getElementById('occ-save-text');
        if (btnText) btnText.innerText = set.has(id) ? "Saved to Plan" : "Save Role";
        // Re-render icons in modal if needed
        refreshIcons();
    }
    if (type === 'skills') {
        const btnText = document.getElementById('skill-save-text');
        if (btnText) btnText.innerText = set.has(id) ? "Saved" : "Save Skill";
        refreshIcons();
    }
    if (type === 'courses') {
        // Re-render list to update icons
        const btn = document.querySelector(`button[onclick*="${id}"] i`);
        if(btn) {
            if(set.has(id)) btn.classList.add('fill-indigo-600', 'text-indigo-600');
            else btn.classList.remove('fill-indigo-600', 'text-indigo-600');
        }
    }
}

window.updatePlanBadge = function() {
    const count = myPlan.roles.size + myPlan.skills.size + myPlan.courses.size;
    const badge = document.getElementById('plan-badge');
    if (count > 0) {
        badge.innerText = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

window.clearAppCache = function() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('ai4eac_')) {
            localStorage.removeItem(key);
        }
    });
    alert("Cache cleared. The page will now reload to fetch fresh data.");
    location.reload();
}

window.renderMyPlan = function() {
    const container = document.getElementById('my-plan-content');
    if (!container) return;

    const renderSection = (title, type, icon, set) => {
        if (set.size === 0) return '';
        const items = Array.from(set).map(id => {
            const name = (myPlan.names && myPlan.names[id]) ? myPlan.names[id] : id;
            return `
                <div class="flex justify-between items-center bg-white p-2 rounded border border-slate-200 text-xs shadow-sm">
                    <span class="truncate font-medium text-slate-700">${name}</span>
                    <button onclick="togglePlanItem('${type}', '${id}')" class="text-slate-400 hover:text-rose-500"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
                </div>
            `;
        }).join('');
        return `
            <div class="mb-3">
                <h4 class="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><i data-lucide="${icon}" class="w-3 h-3"></i> ${title}</h4>
                <div class="space-y-1">${items}</div>
            </div>
        `;
    };

    const html = 
        renderSection('Saved Roles', 'roles', 'briefcase', myPlan.roles) +
        renderSection('Target Skills', 'skills', 'cpu', myPlan.skills) +
        renderSection('Bookmarked Courses', 'courses', 'graduation-cap', myPlan.courses);

    const shareBtn = (myPlan.roles.size + myPlan.skills.size + myPlan.courses.size > 0)
        ? `<div class="mt-4 pt-3 border-t border-slate-200 flex gap-2">
             <button onclick="copyPlanToClipboard()" class="flex-1 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs hover:bg-indigo-200 transition-colors flex items-center justify-center gap-1.5">
                <i data-lucide="copy" class="w-3 h-3"></i> Copy
             </button>
             <button onclick="shareViaWhatsApp()" class="flex-1 py-2 bg-green-100 text-green-700 font-bold rounded-lg text-xs hover:bg-green-200 transition-colors flex items-center justify-center gap-1.5">
                <i data-lucide="message-circle" class="w-3 h-3"></i> WhatsApp
             </button>
           </div>`
        : '';

    container.innerHTML = (html || '<div class="text-center text-xs text-slate-400 py-4 italic">Your plan is empty.<br>Save roles, skills, or courses to see them here.</div>') + shareBtn;
    refreshIcons();
}

window.toggleCommunityHub = function() {
    closeAllModals('community-hub-drawer');
    const drawer = document.getElementById('community-hub-drawer');
    if (drawer) {
        drawer.classList.toggle('translate-x-full');
        if (!drawer.classList.contains('translate-x-full')) {
            showCommunitiesView();
        }
    }
    refreshIcons();
}

// --- NEW: Persistence & Sharing Logic ---
function saveMyPlan() {
    const serialized = {
        roles: Array.from(myPlan.roles),
        skills: Array.from(myPlan.skills),
        courses: Array.from(myPlan.courses),
        names: myPlan.names || {}
    };
    localStorage.setItem('ai4eac_myPlan', JSON.stringify(serialized));
}

function loadMyPlan() {
    const saved = localStorage.getItem('ai4eac_myPlan');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            myPlan.roles = new Set(parsed.roles);
            myPlan.skills = new Set(parsed.skills);
            myPlan.courses = new Set(parsed.courses);
            myPlan.names = parsed.names || {};
            updatePlanBadge();
        } catch(e) {
            console.error("Failed to load plan", e);
        }
    }
}

window.copyPlanToClipboard = function() {
    var text = 'My Career Plan:\n\n';
    if (myPlan.roles.size > 0) {
        text += 'Target Roles:\n';
        myPlan.roles.forEach(function(id) { text += '- ' + (myPlan.names[id] || id) + '\n'; });
        text += '\n';
    }
    if (myPlan.skills.size > 0) {
        text += 'Target Skills:\n';
        myPlan.skills.forEach(function(id) { text += '- ' + (myPlan.names[id] || id) + '\n'; });
        text += '\n';
    }
    if (myPlan.courses.size > 0) {
        text += 'Saved Courses:\n';
        myPlan.courses.forEach(function(id) { text += '- ' + (myPlan.names[id] || id) + '\n'; });
    }
    text += '\nBuild your own at: https://skills2careers-compass.org';
    navigator.clipboard.writeText(text).then(function() {
        alert('Plan copied to clipboard!');
    }).catch(function(err) {
        console.error('Failed to copy: ', err);
        alert('Failed to copy plan. Please try again.');
    });
}

window.shareViaWhatsApp = function() {
    var text = 'My Career Plan:\n\n';
    if (myPlan.roles.size > 0) {
        text += 'Target Roles:\n';
        myPlan.roles.forEach(function(id) { text += '- ' + (myPlan.names[id] || id) + '\n'; });
        text += '\n';
    }
    if (myPlan.skills.size > 0) {
        text += 'Target Skills:\n';
        myPlan.skills.forEach(function(id) { text += '- ' + (myPlan.names[id] || id) + '\n'; });
        text += '\n';
    }
    if (myPlan.courses.size > 0) {
        text += 'Saved Courses:\n';
        myPlan.courses.forEach(function(id) { text += '- ' + (myPlan.names[id] || id) + '\n'; });
        text += '\n';
    }
    text += 'Build your own at: https://skills2careers-compass.org';
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

