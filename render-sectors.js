function openOccupationModal(title) {
    closeModalOverlaysOnly('occupation-modal');
    const modal = document.getElementById('occupation-modal');
    const panel = document.getElementById('occupation-modal-panel');
    
    // Reset scroll position and ensure mobile layout
    const scrollContainer = panel.querySelector('.overflow-y-auto');
    if (scrollContainer) scrollContainer.scrollTop = 0;

    const sectorName = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';
    
    // Determine Theme based on Sector
    const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[activeSectorId] : { color: 'indigo' };
    const themeColor = themeConfig.color;
    
    const details = getOccupationDetails(title, sectorName);
    
    // Lookup dynamic "Why in Demand" info
    const dynamicOccs = dataManager.getOccupations(activeSectorId, activeCountry);
    const occData = dynamicOccs ? dynamicOccs.find(o => o.name === title) : null;
    const demandInfo = occData && occData.why ? occData.why : "High demand due to sector growth and skills gap.";
    
    // NEW: Fetch Wage/OJA for Modal
    const targetName = (typeof roleToOccupationMap !== 'undefined' && roleToOccupationMap[title]) ? roleToOccupationMap[title] : title;
    const wageEntry = dataManager.getWage(targetName, activeCountry, occData ? occData.id : null);
    
    document.body.classList.add('overflow-hidden');
    
    document.getElementById('modal-title').innerText = title;
    
    // NEW: Fetch and display ESCO Codes
    // Priority: Check dynamic occData first, then fallback to baseSectorDetailData
    
    const baseSectorDetails = (typeof baseSectorDetailData !== 'undefined') ? baseSectorDetailData[activeSectorId] : null;
    const baseOcc = baseSectorDetails ? baseSectorDetails.occupations.find(o => o.name === title) : null;

    const esco = (occData && occData.escoCode) ? occData.escoCode : (baseOcc ? baseOcc.escoCode : null);

    const codesHtml = esco 
        ? `<span class="block mt-1 text-[10px] text-slate-400 font-mono opacity-80">
            ESCO: ${esco}
           </span>` 
        : '';

    document.getElementById('modal-alt-titles').innerHTML = `AKA: ${details.altTitles} ${codesHtml}`;
    document.getElementById('modal-sector-badge').innerText = sectorName;

    // Update Footer with Save Button
    const isSaved = myPlan.roles.has(title);
    const saveBtnText = isSaved ? "Saved to Plan" : "Save Role";
    const saveBtnIcon = isSaved ? "fill-current" : "";
    
    // Inject Demand Info
    const demandContainer = document.getElementById('modal-demand-section');
    if (demandContainer) {
        demandContainer.innerHTML = `
            <div class="p-4 bg-${themeColor}-50 border border-${themeColor}-100 rounded-xl">
                <h4 class="text-xs font-bold text-${themeColor}-800 uppercase mb-2 flex items-center gap-2"><i data-lucide="trending-up" class="w-4 h-4"></i> Why in Demand</h4>
                <p class="text-sm text-${themeColor}-900/90 leading-relaxed">${demandInfo}</p>
            </div>
        `;
    }

    // Inject HTML description
    document.getElementById('occ-desc').innerHTML = details.desc;
    
    // 2. Typical Skills Required (Ranked & Categorized)
    const techHtml = details.specificSkills.technical.map((s, i) => `
        <div class="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded text-xs text-slate-700 hover:border-indigo-200 transition-colors w-full">
            <div class="w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm text-[10px] font-bold text-slate-400 border border-slate-100">${i+1}</div>
            <span class="font-bold text-slate-800">${s}</span>
        </div>
    `).join('');

    const empHtml = details.specificSkills.employability.map((s, i) => `
        <div class="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded text-xs text-slate-700 hover:border-blue-200 transition-colors w-full">
            <div class="w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm text-[10px] font-bold text-blue-600 border border-slate-100">${i+1}</div>
            <span class="font-bold text-slate-800">${s}</span>
        </div>
    `).join('');

    document.getElementById('occ-skills-list').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div>
                <div class="text-[10px] font-bold text-indigo-700 uppercase tracking-wide mb-2 border-b border-indigo-100 pb-1">Technical Skills (Ranked by Importance)</div>
                <div class="space-y-2">
                    ${techHtml}
                </div>
            </div>
            <div>
                <div class="text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-2 border-b border-blue-100 pb-1">Interpersonal & Soft Skills</div>
                <div class="space-y-2">
                    ${empHtml}
                </div>
            </div>
        </div>
    `;

    // 3. New Section: Am I a good fit?
    document.getElementById('occ-fit-section').innerHTML = `
        <div class="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all" onclick="closeModal('occupation-modal'); openUnifiedHub('pp-diagnostic', '${title.replace(/'/g, "\\'")}');">
            <div class="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/10 transition-colors"></div>
            
            <div class="relative z-10 flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-lg mb-1 flex items-center gap-2">
                        Am I a good fit for this role?
                    </h3>
                    <p class="text-xs text-slate-300 max-w-sm leading-relaxed mb-3">
                        Unsure if you have the right skills set for this role? Take our quick <strong>SkillsMatch</strong> assessment to identify your strengths and gaps and follow up with a curated training plan.
                    </p>
                    <button class="bg-white text-indigo-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm" onclick="event.stopPropagation(); closeModal('occupation-modal'); openUnifiedHub('pp-diagnostic', '${title.replace(/'/g, "\\'")}');">
                        Start SkillsMatch <i data-lucide="arrow-right" class="w-3 h-3"></i>
                    </button>
                </div>
                <div class="hidden sm:block opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all">
                    <i data-lucide="target" class="w-16 h-16 text-white/20"></i>
                </div>
            </div>
        </div>
    `;
    // --- 3. Qualifications & Industry Standards (New Section 3) ---
    const qualData = (typeof roleQualifications !== 'undefined' && roleQualifications[title]) 
        ? roleQualifications[title] 
        : { 
            education: "Relevant Diploma or Bachelor's Degree", 
            certification: "Sector-specific professional certification", 
            experience: "1-3 years relevant work experience" 
        };
    
    // Contextualize Certs if needed (override generic if country specific logic exists)
    if (activeSectorId === 'energy' && activeCountry === 'Kenya' && title.includes('Solar')) {
        qualData.certification = "EPRA Solar PV License (T1/T2)";
    }

    const pathwaySteps = [
        `<strong>Build Skills:</strong> Focus on ${details.specificSkills.technical.slice(0, 3).join(", ")}.`,
        `<strong>Education:</strong> ${qualData.education}.`,
        `<strong>Credentialing:</strong> Obtain ${qualData.certification}.`,
        `<strong>Experience:</strong> ${qualData.experience}.`
    ];

    const qualHtml = `
        <div class="mt-6 pt-6 border-t border-slate-100" id="modal-qualifications-section">
            <h3 class="text-xs font-bold text-${themeColor}-800 uppercase tracking-wide mb-1 flex items-center gap-2">
                <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">3</span> Typical Skilling Pathway
            </h3>
            <p class="text-[10px] text-slate-700 italic mb-3 ml-8">This is a typical use case. Please check with employers for exact qualifications, industry standards and years of experience required.</p>
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div class="space-y-3 relative">
                    <div class="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                    ${pathwaySteps.map((step, i) => `
                        <div class="flex gap-3 relative">
                            <div class="w-5 h-5 rounded-full bg-white border-2 border-indigo-100 text-[10px] font-bold text-slate-500 flex items-center justify-center shrink-0 z-10">${i+1}</div>
                            <p class="text-xs text-slate-700 leading-snug pt-0.5">${step}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div id="modal-standards-section"></div>
        </div>
    `;

    // --- NEW: Calculate Similar Roles (Moved Up) ---
    const currentTechSkills = new Set(details.specificSkills.technical);
    const relatedRoles = [];

    // Use DataManager to get candidate roles (Dynamic)
    const sectorOccs = dataManager.getOccupations(activeSectorId, activeCountry);
    
    if (sectorOccs && sectorOccs.length > 0) {
        sectorOccs.forEach(occ => {
            if (occ.name === title) return;
            
            // Get skills for candidate role
            const candidateDetails = getOccupationDetails(occ.name, sectorName);
            const candidateSkills = candidateDetails.specificSkills.technical;
            
            const overlap = candidateSkills.filter(s => currentTechSkills.has(s)).length;
            if (overlap > 0) {
                relatedRoles.push({ name: occ.name, score: overlap });
            }
        });
    } else if (typeof roleSkills !== 'undefined') {
        Object.entries(roleSkills).forEach(([rName, rData]) => {
            if (rName === title) return;
            const overlap = rData.technical.filter(s => currentTechSkills.has(s)).length;
            if (overlap > 0) {
                relatedRoles.push({ name: rName, score: overlap });
            }
        });
    }
    relatedRoles.sort((a, b) => b.score - a.score);
    const topRelated = relatedRoles.slice(0, 3);
    const hasRelated = topRelated.length > 0;

    // 4. Similar Roles (Lateral Skills Pathways) - Now includes Section 3 injection
    document.getElementById('modal-related-section').innerHTML = hasRelated ? `
        ${qualHtml}

        <div class="mt-6 pt-6 border-t border-slate-100">
            <h3 class="text-xs font-bold text-${themeColor}-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">4</span> Similar Roles (Lateral Skills Pathways)
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                ${topRelated.map(r => `
                    <button onclick="openOccupationModal('${r.name.replace(/'/g, "\\'")}')" class="text-left p-3 bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 rounded-lg transition-all group shadow-sm">
                        <div class="text-[10px] text-slate-400 font-bold uppercase mb-1">${r.score} Shared Skills</div>
                        <div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700 truncate">${r.name}</div>
                    </button>
                `).join('')}
            </div>
        </div>` : qualHtml; // If no related roles, still show qualifications

    // --- National Standards Section (injected after qualHtml is in DOM) ---
    const standardsContainer = document.getElementById('modal-standards-section');
    if (standardsContainer) {
        const standards = occData && occData.nationalStandards && occData.nationalStandards.length > 0
            ? occData.nationalStandards : [];
        if (standards.length > 0) {
            const stdHtml = standards.map(s => `
                <div class="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded text-xs">
                    <div>
                        <div class="font-bold text-slate-700">${s.standard}</div>
                        <div class="text-[10px] text-slate-500">${s.authority} (${s.country})</div>
                    </div>
                    ${s.link ? `<a href="${s.link}" target="_blank" class="text-indigo-600 hover:text-indigo-800"><i data-lucide="external-link" class="w-3 h-3"></i></a>` : ''}
                </div>
            `).join('');
            standardsContainer.innerHTML = `<h3 class="text-xs font-bold text-${themeColor}-800 uppercase tracking-wide mb-2 mt-4">National Competency Standards</h3><div class="space-y-2">${stdHtml}</div>`;
        } else {
            standardsContainer.innerHTML = `<h3 class="text-xs font-bold text-${themeColor}-800 uppercase tracking-wide mb-2 mt-4">National Competency Standards</h3><div class="text-xs text-slate-400 italic">Not reported for this role.</div>`;
        }
    }

    // --- NEW: Role Snapshot Section ---
    const snapshotContainer = document.getElementById('modal-snapshot-section');
    if (snapshotContainer) {
        // Logic for Personality/Fit
        // Check for specific snapshot first
        const specificSnapshot = (typeof roleSpecificSnapshots !== 'undefined') ? roleSpecificSnapshots[title] : null;
        
        let bestFor = "Adaptable problem-solvers";
        let envs = "Office & Site visits";

        if (specificSnapshot) {
            bestFor = specificSnapshot.bestFor;
            envs = specificSnapshot.envs;
        } else {
            // Fallback to sector generic
            const snapshotData = (typeof roleSnapshotConfig !== 'undefined' && roleSnapshotConfig[activeSectorId]) 
                ? roleSnapshotConfig[activeSectorId] 
                : (typeof roleSnapshotConfig !== 'undefined' ? roleSnapshotConfig.default : { bestFor: "Adaptable problem-solvers", envs: "Office & Site visits" });
            
            bestFor = snapshotData.bestFor;
            envs = snapshotData.envs;
            
            // Simple heuristics
            if (title.includes('Manager') || title.includes('Lead')) bestFor += " with leadership traits.";
            else if (title.includes('Analyst')) bestFor += " who love data.";
            else if (title.includes('Technician')) bestFor += " who enjoy hands-on work.";
        }

        // Prepare Wage/Demand items
        let wageHtml = `<span class="text-slate-400 italic">Data unavailable</span>`;
        let demandHtml = `<span class="text-slate-400 italic">Data unavailable</span>`;

        if (wageEntry) {
            const avgWage = wageEntry.avgMonthlyWage || wageEntry.Avg_Monthly_Wage;
            const curr = wageEntry.currency || wageEntry.Currency;
            if (avgWage && avgWage !== 'TBD') {
                wageHtml = `${curr} ${avgWage} <span class="text-[9px] text-slate-400 font-normal ml-1">/mo</span>`;
            }
            const oja = wageEntry.ojaCount || wageEntry.OJA_Count;
            if (oja && oja !== 'N/A') {
                demandHtml = `${oja} <span class="text-[9px] text-slate-400 font-normal ml-1">Ads/Year</span>`;
            }
        }

        snapshotContainer.innerHTML = `
            <div>
                <h3 class="text-sm font-bold text-${themeColor}-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <i data-lucide="info" class="w-4 h-4"></i> At a Glance
                </h3>
                <div class="bg-slate-50 rounded-xl border border-slate-200 p-4">
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4">
                        <div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Avg Wage</div>
                            <div class="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                                <i data-lucide="banknote" class="w-3.5 h-3.5"></i> ${wageHtml}
                            </div>
                        </div>
                        <div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Demand (OJA)</div>
                            <div class="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                                <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i> ${demandHtml}
                            </div>
                        </div>
                        <div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Work Setting/s</div>
                            <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-500"></i> ${details.workMode}
                            </div>
                        </div>
                        <div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Best For</div>
                            <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <i data-lucide="user" class="w-3.5 h-3.5 text-slate-500"></i> ${bestFor}
                            </div>
                        </div>
                        <div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Typical Employers</div>
                            <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <i data-lucide="briefcase" class="w-3.5 h-3.5 text-slate-500"></i> ${details.employers}
                            </div>
                        </div>
                        <div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Common Environments</div>
                            <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <i data-lucide="globe" class="w-3.5 h-3.5 text-slate-500"></i> ${envs}
                            </div>
                        </div>
                    </div>
                    <p class="text-[9px] text-slate-400 mt-3 pt-2 border-t border-slate-100 flex items-center gap-1">
                        <i data-lucide="info" class="w-2.5 h-2.5 shrink-0"></i> Wage and demand figures reflect formal sector employers posting online. Informal employment and self-employment are not captured.
                    </p>
                </div>
            </div>
        `;
    }

    // 4. Extra Info (Tools, Creds, Resources)
    const toolsHtml = details.tools.map(t => `<span class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">${t}</span>`).join('');
    const credsHtml = details.credentials.map(c => `<li class="text-xs text-slate-700 mb-1 flex items-start gap-2"><i data-lucide="check-circle" class="w-3 h-3 mt-0.5 text-blue-500 shrink-0"></i> ${c}</li>`).join('');
    const resHtml = details.resources.length > 0 
        ? details.resources.map(r => `<a href="${r.url}" target="_blank" class="block text-xs text-indigo-600 hover:underline mb-1 flex items-center gap-1"><i data-lucide="external-link" class="w-3 h-3"></i> ${r.title}</a>`).join('')
        : '<div class="text-xs text-slate-400 italic">N/A</div>';

    document.getElementById('modal-extra-section').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
            <div>
                <h3 class="text-xs font-bold text-${themeColor}-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">${hasRelated ? 5 : 4}</span> Tools & Tech
                </h3>
                <div class="flex flex-wrap gap-2 mb-8">
                    ${toolsHtml}
                </div>
            </div>
            <div>
                <h3 class="text-xs font-bold text-${themeColor}-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">${hasRelated ? 6 : 5}</span> Read More
                </h3>
                <div class="space-y-1">
                    ${resHtml}
                </div>
            </div>
        </div>
    `;

    // --- 5. Typical Skilling Pathway (New Section 7) ---
    document.getElementById('modal-pathway-section').innerHTML = '';

    // NEW: Share Button in Footer
    const shareText = encodeURIComponent(`Check out this ${title} role on the Skills Compass!`);
    const shareUrl = `https://wa.me/?text=${shareText}`;
    
    const footer = document.getElementById('occ-modal-footer');
    if(footer) {
        footer.innerHTML = `
            <a href="${shareUrl}" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm">
                <i data-lucide="share-2" class="w-4 h-4"></i> Share via WhatsApp
            </a>
        `;
    }

    modal.classList.remove('hidden');
    refreshIcons();
    setTimeout(() => { panel.classList.remove('scale-95', 'opacity-0'); panel.classList.add('scale-100', 'opacity-100'); }, 10);
}

function toggleLowBandwidth() {
    const isLite = document.body.classList.toggle('low-bandwidth');
    const btn = document.getElementById('lb-toggle');
    btn.innerText = isLite ? 'Full Mode' : 'Lite Mode';
    localStorage.setItem('ai4eac_lite_mode', isLite);

    // Floating badge so users always know lite mode is active
    let badge = document.getElementById('lite-mode-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.id = 'lite-mode-badge';
        badge.className = 'fixed bottom-24 left-3 z-[200] bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg pointer-events-none select-none';
        badge.textContent = 'Lite';
        document.body.appendChild(badge);
    }
    badge.style.display = isLite ? '' : 'none';

    if (isLite) {
        // Destroy any active Chart.js instances to free memory
        if (typeof Chart !== 'undefined' && Chart.getChart) {
            document.querySelectorAll('canvas').forEach(c => {
                const chart = Chart.getChart(c);
                if (chart) chart.destroy();
            });
        }
        impactChartsInitialized = true;  // block chart re-initialization
    } else {
        impactChartsInitialized = false;  // re-enable charts on full mode
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const panel = modal.querySelector('div[id$="panel"]');
    
    if(panel) {
        panel.classList.remove('scale-100', 'opacity-100');
        panel.classList.add('scale-95', 'opacity-0');
    }
    setTimeout(() => { 
        modal.classList.add('hidden'); 
        // Only remove overflow-hidden if no other modals are open
        if(document.querySelectorAll('.fixed.inset-0.z-\\[100\\]:not(.hidden)').length === 0) document.body.classList.remove('overflow-hidden');
    }, 200);
}

// Closes only centred modal overlays — leaves drawers open behind the backdrop.
// Use this when opening occupation/skill/venture/resource modals so the parent
// drawer is still visible when the modal is dismissed.
function closeModalOverlaysOnly(exceptId = null) {
    ['occupation-modal', 'skill-modal', 'venture-modal', 'resource-modal', 'certificate-modal'].forEach(id => {
        if (id !== exceptId) {
            const el = document.getElementById(id);
            if (el && !el.classList.contains('hidden')) closeModal(id);
        }
    });
}

function closeAllModals(exceptId = null) {
    // 1. Close Drawers
    const drawers = [
        'unified-hub-modal',
        'career-hub-drawer',
        'training-hub-drawer',
        'sector-hub-drawer',
        'community-hub-drawer',
        'data-sources-drawer',
        'observatory-drawer'
    ];
    drawers.forEach(id => {
        if (id !== exceptId) {
            const el = document.getElementById(id);
            if (el && !el.classList.contains('translate-x-full')) {
                el.classList.add('translate-x-full');
            }
        }
    });

    // Close Left Drawer (App Menu)
    if (exceptId !== 'about-drawer') {
        const el = document.getElementById('about-drawer');
        if (el && !el.classList.contains('-translate-x-full')) {
            el.classList.add('-translate-x-full');
        }
    }
    if (exceptId !== 'users-drawer') {
        const el = document.getElementById('users-drawer');
        if (el && !el.classList.contains('-translate-x-full')) {
            el.classList.add('-translate-x-full');
        }
    }

    // 2. Close Centered Modals
    const modals = [
        'occupation-modal',
        'skill-modal',
        'venture-modal',
        'resource-modal',
        'certificate-modal'
    ];
    modals.forEach(id => {
        if (id !== exceptId) {
            const el = document.getElementById(id);
            if (el && !el.classList.contains('hidden')) {
                closeModal(id);
            }
        }
    });
}

window.setGlobalCountry = function(country) {
    activeCountry = country;
    localStorage.setItem('ai4eac_country', country);

    // Update Top Nav Dropdown (if changed via Hub)
    const navSelector = document.getElementById('country-selector');
    if (navSelector && navSelector.value !== country) {
        navSelector.value = country;
    }

    // Update Hub Dropdown (if changed via Nav)
    const hubSelector = document.getElementById('hub-country');
    if (hubSelector && hubSelector.value !== country) {
        hubSelector.value = country;
    }

    // Update Career Hub Dropdown
    const careerSelector = document.getElementById('career-country-select');
    if (careerSelector && careerSelector.value !== country) {
        careerSelector.value = country;
    }

    // Update Skills Hub Dropdown
    const skillsHubSelector = document.getElementById('skills-hub-country');
    if (skillsHubSelector && skillsHubSelector.value !== country) {
        skillsHubSelector.value = country;
    }

    // Update Sector Hub Country Dropdown
    const sectorHubCountry = document.getElementById('sector-hub-country');
    if (sectorHubCountry && sectorHubCountry.value !== country) {
        sectorHubCountry.value = country;
    }

    // Update Find Courses Filter (Sync)
    const courseFilter = document.getElementById('filter-country');
    if (courseFilter && courseFilter.value !== country) {
        courseFilter.value = country;
        if (!document.getElementById('pp-courses').classList.contains('hidden')) {
            renderProviderTable();
        }
    }

    // Update Financial Aid Filter (Sync)
    const financeFilter = document.getElementById('pp-finance-filter-country');
    if (financeFilter && financeFilter.value !== country) {
        financeFilter.value = country;
        if (!document.getElementById('pp-finance').classList.contains('hidden')) {
            renderFinancialAidTab();
        }
    }

    updateTrainingProviders();
    _refreshSectorHub();

    // Update Dashboard Cards Context
    if (document.getElementById('skills-hub-home') && !document.getElementById('skills-hub-home').classList.contains('hidden')) {
         renderSkillsHubCards();
    }
    if (document.getElementById('pp-top-skills') && !document.getElementById('pp-top-skills').classList.contains('hidden')) {
         renderSkillsHubSkills();
    }

    // Update Hero Country Signal Bar
    const heroSignal = document.getElementById('hero-country-signal');
    if (heroSignal) {
        if (country === 'all') {
            heroSignal.innerHTML = `<span class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[10px] text-slate-500"><i data-lucide="globe" class="w-3 h-3"></i> EAC-wide &middot; 8 countries covered &middot; select a country above to localise</span>`;
            heroSignal.classList.remove('hidden');
            if (typeof refreshIcons === 'function') refreshIcons();
        } else {
            heroSignal.classList.add('hidden');
        }
    }
}

window.setGlobalSector = function(sector) {
    activeSectorId = sector;
    localStorage.setItem('ai4eac_sector', sector);

    // Update Sector Hub Sector Dropdown
    const sectorHubSelect = document.getElementById('sector-hub-sector-select');
    if (sectorHubSelect && sectorHubSelect.value !== sector) {
        sectorHubSelect.value = sector;
    }

    // Update Skills Hub Dropdown
    const skillsHubSectorSelector = document.getElementById('skills-hub-sector');
    if (skillsHubSectorSelector && skillsHubSectorSelector.value !== sector) {
        skillsHubSectorSelector.value = sector;
    }

    // Update Find Courses Filter (Sync)
    const courseSectorFilter = document.getElementById('filter-sector');
    if (courseSectorFilter) {
        if (courseSectorFilter.value !== sector) {
            courseSectorFilter.value = sector;
        }
        if (!document.getElementById('pp-courses').classList.contains('hidden')) {
            if (typeof populateSkillFilter === 'function') populateSkillFilter();
            renderProviderTable();
        }
    }
    
    _refreshSectorHub();

    // Update Dashboard Cards Context
    if (document.getElementById('skills-hub-home') && !document.getElementById('skills-hub-home').classList.contains('hidden')) {
         renderSkillsHubCards();
    }
    if (document.getElementById('pp-top-skills') && !document.getElementById('pp-top-skills').classList.contains('hidden')) {
         renderSkillsHubSkills();
    }
}

window.openUnifiedHub = function(startTab = 'pp-diagnostic', roleName = null, pathwayGoal = null, suppressBack = false) {
    // Close any open drawers to prevent overlap
    closeAllModals('unified-hub-modal');

    const drawer = document.getElementById('unified-hub-modal');
    
    // SAFETY FIX: Ensure hidden class is removed if it was added by mistake
    if(drawer) drawer.classList.remove('hidden');
    
    // Check if we are opening from a closed state
    const wasClosed = drawer.classList.contains('translate-x-full');
    
    // Conditional Rendering: Only render pathway content if requested (role/goal)
    const specificRequest = !!(roleName || pathwayGoal);
    // Check if this is a specific tab request (not default dashboard)
    const specificTabRequest = startTab !== 'pp-diagnostic';

    if(specificRequest && typeof window.renderPathwayContent === 'function') {
        window.renderPathwayContent(roleName, pathwayGoal);
    }
    drawer.classList.remove('translate-x-full');
    
    // RESUME LOGIC: Check if we are just re-opening without specific intent
    const isDefaultRequest = (startTab === 'pp-diagnostic' && !roleName && !pathwayGoal);
    const activeView = document.querySelector('.pp-view-content:not(.hidden)');
    
    // If opening fresh with a specific request (Deep Link), clear history to avoid ghost navigation
    if (wasClosed && (specificRequest || specificTabRequest)) {
        hubNavigationStack = [];
        // Hide all views to ensure we start clean
        document.querySelectorAll('.pp-view-content').forEach(el => el.classList.add('hidden'));
    }

    if (isDefaultRequest && activeView && !wasClosed) {
        // Resume current view if already open
        return;
    }
    
    if (isDefaultRequest && wasClosed) {
         // Resume if opening default and something was already active
         hubNavigationStack = [];
         renderSkillsHubDashboard();
         return;
    }

    if (startTab === 'pp-diagnostic' && !roleName) {
        // Default open: Show Dashboard
        renderSkillsHubDashboard();
    } else {
        // Specific deep link (e.g. from "Am I a good fit?")
        // If specific request was made, preserve state. Otherwise reset.
        const addToStack = !wasClosed;
        openSkillsView(startTab, specificRequest, addToStack, suppressBack);
    }
}

window.closeUnifiedHub = function() {
    const drawer = document.getElementById('unified-hub-modal');
    if(drawer) drawer.classList.add('translate-x-full');
}

window.renderSkillsHubDashboard = function() {
    hubNavigationStack = []; // Clear history when returning to dashboard
    const container = document.getElementById('skills-hub-home');
    if(!container) return;
    
    // Reset Header Title
    const headerTitle = document.getElementById('pp-header-title');
    if (headerTitle) {
        headerTitle.innerHTML = `<i data-lucide="layers" class="w-6 h-6 text-indigo-600"></i> Learning, Skills & Career Pathways`;
    }

    // Hide other views
    document.querySelectorAll('.pp-view-content').forEach(el => el.classList.add('hidden'));
    container.classList.remove('hidden');

    container.innerHTML = `
        <!-- Journey Banner -->
        <div class="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4 mb-4">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Your Learning Journey</p>
            <div class="flex items-center justify-center gap-2">
                <button onclick="openSkillsView('pp-diagnostic')" class="text-sm font-bold text-indigo-700 hover:text-indigo-900 transition-colors">Assess</button>
                <i data-lucide="chevron-right" class="w-5 h-5 text-indigo-700 shrink-0" style="stroke-width:3"></i>
                <button onclick="openSkillsView('pp-practice')" class="text-sm font-bold text-indigo-700 hover:text-indigo-900 transition-colors">Build</button>
                <i data-lucide="chevron-right" class="w-5 h-5 text-indigo-700 shrink-0" style="stroke-width:3"></i>
                <button onclick="renderPathwayGoal()" class="text-sm font-bold text-indigo-700 hover:text-indigo-900 transition-colors">Skill</button>
            </div>
        </div>

        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
                <label class="block text-[10px] font-bold text-slate-500 mb-1">Location</label>
                <select id="skills-hub-country" onchange="setGlobalCountry(this.value)" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                    <option value="all" ${activeCountry === 'all' ? 'selected' : ''}>Regional</option>
                    <option value="Kenya" ${activeCountry === 'Kenya' ? 'selected' : ''}>Kenya</option>
                    <option value="Uganda" ${activeCountry === 'Uganda' ? 'selected' : ''}>Uganda</option>
                    <option value="Tanzania" ${activeCountry === 'Tanzania' ? 'selected' : ''}>Tanzania</option>
                    <option value="Rwanda" ${activeCountry === 'Rwanda' ? 'selected' : ''}>Rwanda</option>
                    <option value="Burundi" ${activeCountry === 'Burundi' ? 'selected' : ''}>Burundi</option>
                    <option value="South Sudan" ${activeCountry === 'South Sudan' ? 'selected' : ''}>South Sudan</option>
                    <option value="DRC" ${activeCountry === 'DRC' ? 'selected' : ''}>DR Congo</option>
                    <option value="Somalia" ${activeCountry === 'Somalia' ? 'selected' : ''}>Somalia</option>
                </select>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 mb-1">Sector</label>
                <select id="skills-hub-sector" onchange="setGlobalSector(this.value)" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                    <option value="agri" ${activeSectorId === 'agri' ? 'selected' : ''}>Agritech</option>
                    <option value="energy" ${activeSectorId === 'energy' ? 'selected' : ''}>Renewable Energy</option>
                    <option value="digital" ${activeSectorId === 'digital' ? 'selected' : ''}>Digital Economy</option>
                </select>
            </div>
        </div>

        <div id="skills-hub-cards" class="grid grid-cols-1 gap-4">
            <!-- Cards injected via renderSkillsHubCards -->
        </div>
    `;

    renderSkillsHubCards();
}

window.renderSkillsHubCards = function() {
    const container = document.getElementById('skills-hub-cards');
    if(!container) return;

    const sectorName = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';

    container.innerHTML = `
        <!-- Section title -->
        <div class="pb-0.5">
            <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Your Journey</p>
        </div>

        <!-- Core Journey Cards (full-width) -->
        <button onclick="openSkillsView('pp-practice')" class="p-3 sm:p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:border-indigo-300 hover:bg-white hover:shadow-md text-left transition-all group w-full flex items-start gap-3 sm:gap-4">
            <div class="p-2 sm:p-3 bg-indigo-100 text-indigo-600 rounded-lg shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><i data-lucide="map" class="w-5 h-5 sm:w-6 sm:h-6"></i></div>
            <div>
                <h3 class="font-bold text-slate-800 text-base mb-1">Learning and Career Pathways</h3>
                <p class="text-sm text-slate-600">Build a step-by-step learning roadmap tailored to your goals and skills strengths and gaps in <strong>${sectorName}</strong> — starting with a quick job readiness check.</p>
            </div>
        </button>

        <button onclick="openSkillsView('pp-sector-ai')" class="p-3 sm:p-4 bg-sky-50 border border-sky-100 rounded-xl hover:border-sky-300 hover:bg-white hover:shadow-md text-left transition-all group w-full flex items-start gap-3 sm:gap-4">
            <div class="p-2 sm:p-3 bg-sky-100 text-sky-600 rounded-lg shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors"><i data-lucide="trending-up" class="w-5 h-5 sm:w-6 sm:h-6"></i></div>
            <div>
                <h3 class="font-bold text-slate-800 text-base mb-1">Upskilling and Lifelong Learning</h3>
                <p class="text-sm text-slate-600">Already working in <strong>${sectorName}</strong>? Upskill into hybrid and in-demand roles, apply AI to your current work, or audit your team's skills strengths and gaps.</p>
            </div>
        </button>

    `;
    refreshIcons();
}

window.renderSectorAIHub = function(sector, focus, subFocus) {
    const container = document.getElementById('pp-sector-ai');
    if (!container) return;
    sector = sector || activeSectorId;
    if (focus === 'upskill') {
        pathwayState.upskillingSubFocus = subFocus;
        if (pathwayState.upskillingSector !== sector) {
            pathwayState.upskillingOccupation = null;
        }
        pathwayState.upskillingSector = sector;
    }
    const _exp = pathwayState.upskillingExperience || 'building';

    const sectorOptions = [
        { id: 'agri',    label: 'Agritech',         icon: 'leaf',  desc: 'Agriculture, food systems & rural value chains' },
        { id: 'energy',  label: 'Renewable Energy',  icon: 'sun',   desc: 'Solar, wind, grid & energy access' },
        { id: 'digital', label: 'Digital Economy',   icon: 'globe', desc: 'Tech, fintech & digital services' }
    ];

    const focusOptions = [
        { id: 'upskill', icon: 'trending-up', label: 'Upskilling and Lifelong Learning',  desc: 'Build new skills, earn certifications and stay current — personalised to where you are now',  onclick: `renderSectorAIHub('${sector}', 'upskill', 'broad')`, isActive: focus === 'upskill' && subFocus !== 'ai' },
        { id: 'ai',      icon: 'sparkles',    label: 'Apply AI to My Work',    desc: 'Learn to use AI tools in your sector role — without retraining as a developer',               onclick: `renderSectorAIHub('${sector}', 'upskill', 'ai')`,   isActive: focus === 'upskill' && subFocus === 'ai' }
    ];

    const hybridOccs = {
        agri: [
            { name: 'Supply Chain Manager',      desc: 'Applies predictive analytics to manage logistics, reduce post-harvest losses, and connect smallholders to markets.', hot: true },
            { name: 'Post-Harvest Specialist',   desc: 'Manages cold-chain and storage using IoT sensors and data platforms to reduce losses between farm and market.', hot: true },
            { name: 'Digital Extension Officer', desc: 'Delivers AI-powered advisory services to farmers — combining agronomic knowledge with mobile and data tools.', hot: true },
            { name: 'Agri-Data Analyst',         desc: 'Assembles and interprets agricultural data to make value chains legible to investors and development partners.', hot: true }
        ],
        energy: [
            { name: 'Energy Auditor',        desc: 'Uses data analytics and AI tools to identify efficiency gaps and model ROI for energy investments.', hot: true },
            { name: 'Grid Systems Engineer', desc: 'Integrates AI-powered monitoring (SCADA/IoT) to balance renewable energy grids and prevent outages.', hot: true },
            { name: 'Smart Meter Tech',      desc: 'Deploys advanced metering infrastructure that feeds AI demand-forecasting models.', hot: false }
        ],
        digital: [
            { name: 'Data Scientist',   desc: 'Applies machine learning to real-sector problems in agriculture, energy, or logistics — not just pure tech.', hot: true },
            { name: 'AI/ML Engineer',   desc: 'Builds and deploys AI tools for agritech, energy, or fintech companies — bridging data science with domain context.', hot: true },
            { name: 'Product Manager',  desc: 'Leads AI-enabled products for specific sectors — requires both domain knowledge and technical understanding.', hot: false }
        ]
    };

    const hybridSkills = {
        agri:    ['Python', 'Data Analysis', 'GIS Mapping', 'IoT Sensors', 'Digital Advisory', 'Supply Chain', 'Remote Sensing', 'Climate Modeling'],
        energy:  ['SCADA', 'Data Analysis', 'Energy Efficiency', 'Grid Systems', 'AutoCAD', 'Regulatory Compl.', 'Field Ops'],
        digital: ['Machine Learning', 'Python', 'Data Science', 'Product Mgmt', 'Data Viz', 'API Integration']
    };

    const focusIntro = {
        upskill: 'Covering any type of new skills — courses, certifications and networks across the full spectrum of in-demand roles in this sector.',
        apply:   'These roles let you apply AI tools within your existing sector work. No need to retrain as a developer.',
        cpd:     'Stay ahead with structured professional development — certifications, communities and curated courses to keep your skills current.',
    };

    const certifications = {
        digital: [
            { title: 'Google Career Certificates',  desc: 'Data Analytics, UX Design, Project Management.', icon: 'award',    link: 'https://grow.google/certificates/' },
            { title: 'AWS Training & Certification', desc: 'Cloud skills for the digital economy.',           icon: 'cloud',    link: 'https://aws.amazon.com/training/' },
            { title: 'Microsoft Learn',              desc: 'Free paths for Azure, AI & developer skills.',    icon: 'monitor',  link: 'https://learn.microsoft.com/' }
        ],
        energy: [
            { title: 'EPRA Licensing Guide',         desc: 'Solar & electrical licensing requirements.',          icon: 'zap',      link: 'https://www.epra.go.ke/' },
            { title: 'IRENA Learning Platform',      desc: 'Renewable energy professional development.',          icon: 'sun',      link: 'https://www.irena.org/energytransition/capacity-building' },
            { title: 'Solar Energy International',   desc: 'Technical solar training & certification.',           icon: 'award',    link: 'https://www.solarenergy.org/' }
        ],
        agri: [
            { title: 'FAO e-Learning Centre',        desc: 'Agriculture, food security & rural development.',     icon: 'book-open', link: 'https://elearning.fao.org/' },
            { title: 'AGRA Resources',               desc: 'African agriculture transformation training.',        icon: 'award',    link: 'https://agra.org/' },
            { title: 'CTA Knowledge Hub',            desc: 'Agri-business and value chain learning.',             icon: 'layers',   link: 'https://www.cgiar.org/' }
        ]
    };

    const networksBySector = {
        digital: [
            { title: 'ADPList',              desc: 'Mentorship for designers, devs & data pros.',        link: 'https://adplist.org/' },
            { title: 'iHub Community',       desc: "East Africa's leading tech innovation hub.",         link: 'https://ihub.co.ke/' },
            { title: 'Women in Tech Africa', desc: 'Network for women advancing in technology.',         link: 'https://womenintechafrica.com/' }
        ],
        energy: [
            { title: 'GWNET',                desc: "Global Women's Network for Energy Transition.",      link: 'https://www.globalwomennet.org/' },
            { title: 'GOGLA',                desc: 'Off-grid solar industry network & resources.',       link: 'https://www.gogla.org/' },
            { title: 'Africa Energy Forum',  desc: 'Professional network for energy practitioners.',     link: 'https://www.africaenergyforum.com/' }
        ],
        agri: [
            { title: 'AWARD Fellowship',     desc: 'Science leadership for African women in agri.',      link: 'https://awardfellowships.org/' },
            { title: 'CGIAR Research Network', desc: 'Agricultural research & innovation community.',    link: 'https://www.cgiar.org/' },
            { title: 'GoGettaz',             desc: 'Agripreneurship community & mentorship.',            link: 'https://gogettaz.africa/' }
        ]
    };

    const sectorCerts    = certifications[sector]    || certifications.digital;
    const sectorNetworks = networksBySector[sector]  || networksBySector.digital;

    const sectorSelectorHtml = `
        <div class="space-y-2">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Your sector</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                ${sectorOptions.map(s => `
                    <button onclick="renderSectorAIHub('${s.id}', 'upskill', 'ai')" class="p-3 rounded-xl border text-left transition-all ${sector === s.id ? 'bg-sky-600 text-white border-sky-600' : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50'}">
                        <div class="flex items-center gap-2 mb-1">
                            <i data-lucide="${s.icon}" class="w-4 h-4 shrink-0"></i>
                            <span class="text-xs font-bold">${s.label}</span>
                        </div>
                        <p class="text-[10px] ${sector === s.id ? 'text-sky-100' : 'text-slate-500'} leading-snug">${s.desc}</p>
                    </button>`).join('')}
            </div>
        </div>`;

    const focusSelectorHtml = `
        <div class="space-y-2">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wide"></p>
            <div class="flex flex-col gap-2">
                ${focusOptions.map(f => `
                    <button onclick="${f.onclick}" class="p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${f.isActive ? 'bg-sky-600 text-white border-sky-600' : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50'}">
                        <div class="p-1.5 ${f.isActive ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-600'} rounded-lg shrink-0 mt-0.5">
                            <i data-lucide="${f.icon}" class="w-3.5 h-3.5"></i>
                        </div>
                        <div>
                            <div class="text-xs font-bold ${f.isActive ? 'text-white' : 'text-slate-800'}">${f.label}</div>
                            <div class="text-[10px] ${f.isActive ? 'text-sky-100' : 'text-slate-500'} mt-0.5 leading-snug">${f.desc}</div>
                        </div>
                    </button>`).join('')}
            </div>
        </div>`;

    let experienceSelectorHtml = '';
    if (focus === 'upskill' && subFocus === 'broad') {
        const expOptions = [
            { id: 'building', icon: 'arrow-up-right', label: 'Upskilling',    desc: 'Build new skills and move into in-demand roles in this sector' },
            { id: 'current',  icon: 'refresh-cw',     label: 'Stay Current', desc: 'CPD, certifications and networks to keep your skills sharp' }
        ];
        const expBtns = expOptions.map(function(e) {
            const active = _exp === e.id;
            const btnCls = 'p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ' + (active ? 'bg-sky-600 text-white border-sky-600' : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50');
            const iconCls = 'w-3.5 h-3.5 ' + (active ? 'text-white' : 'text-sky-600');
            const lblCls = 'text-xs font-bold ' + (active ? 'text-white' : 'text-slate-800');
            const dscCls = 'text-[10px] ' + (active ? 'text-sky-100' : 'text-slate-500') + ' leading-snug';
            return `<button onclick="selectUpskillingExperience('${e.id}')" class="${btnCls}"><div class="flex items-center gap-1.5"><i data-lucide="${e.icon}" class="${iconCls}"></i><span class="${lblCls}">${e.label}</span></div><div class="${dscCls}">${e.desc}</div></button>`;
        }).join('');
        experienceSelectorHtml = `<div class="space-y-2"><p class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Your situation</p><div class="grid grid-cols-3 gap-2">${expBtns}</div></div>`;
    }

    // AI experience selector — shown only in Apply AI view
    let aiExperienceSelectorHtml = '';
    if (focus === 'upskill' && subFocus === 'ai') {
        const aiExpOptions = [
            { id: 'building', icon: 'user',  label: 'For myself',      desc: 'Apply AI tools in my own work and role' },
            { id: 'team',     icon: 'users', label: 'Managing a team', desc: 'Build AI readiness across my team or organisation' }
        ];
        const aiExpBtns = aiExpOptions.map(function(e) {
            const active = e.id === 'team' ? _exp === 'team' : _exp !== 'team';
            const btnCls = 'p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ' + (active ? 'bg-sky-600 text-white border-sky-600' : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50');
            const iconCls = 'w-3.5 h-3.5 ' + (active ? 'text-white' : 'text-sky-600');
            const lblCls = 'text-xs font-bold ' + (active ? 'text-white' : 'text-slate-800');
            const dscCls = 'text-[10px] ' + (active ? 'text-sky-100' : 'text-slate-500') + ' leading-snug';
            return `<button onclick="selectAIExperience('${e.id}', '${sector}')" class="${btnCls}"><div class="flex items-center gap-1.5"><i data-lucide="${e.icon}" class="${iconCls}"></i><span class="${lblCls}">${e.label}</span></div><div class="${dscCls}">${e.desc}</div></button>`;
        }).join('');
        aiExperienceSelectorHtml = `<div class="space-y-2"><p class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Who is this for?</p><div class="grid grid-cols-2 gap-2">${aiExpBtns}</div></div>`;
    }

    // Occupation picker — shown only in the clean upskill view
    let occupationPickerHtml = '';
    if (focus === 'upskill') {
        const baseOccs = (typeof baseSectorDetailData !== 'undefined' && baseSectorDetailData[sector] && baseSectorDetailData[sector].occupations)
            ? baseSectorDetailData[sector].occupations.map(o => o.name)
            : hybridOccs[sector].map(o => o.name);
        const selectedOcc = pathwayState.upskillingOccupation || '';
        const opts = ['', ...baseOccs].map(n =>
            `<option value="${n}" ${selectedOcc === n ? 'selected' : ''}>${n || 'Select your occupation…'}</option>`
        ).join('');
        occupationPickerHtml = `
            <div class="space-y-2">
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Your current occupation <span class="normal-case font-normal text-slate-400">(optional — helps us personalise)</span></p>
                <div class="relative">
                    <select onchange="window.selectUpskillingOccupation(this.value)" class="w-full text-sm font-semibold text-slate-700 border border-slate-300 rounded-xl py-2.5 pl-3 pr-8 appearance-none bg-white hover:border-sky-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-200 transition-colors">
                        ${opts}
                    </select>
                    <i data-lucide="chevron-down" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"></i>
                </div>
            </div>`;
    }

    const subFocusIntro = {
        broad: '',
        ai:    'Learn to apply AI tools within your existing sector role — no retraining as a developer required.',
    };

    let resultsHtml = '';
    const showResults = focus === 'upskill' && !!subFocus;
    if (showResults) {
        const contentType = (subFocus === 'broad' && _exp === 'current') ? 'cpd' : (_exp === 'team') ? 'team' : subFocus;
        const occs = hybridOccs[sector] || [];
        const sectorLabel = sector === 'agri' ? 'Agritech' : sector === 'energy' ? 'Renewable Energy' : 'the Digital Economy';
        const aiKeywords = ['python', 'data', 'ai', 'machine learning', 'iot', 'analytics', 'gis', 'scada', 'digital advisory', 'remote sensing'];

        // Occupation context
        const selectedOcc = pathwayState.upskillingOccupation || null;
        const occSkillSet = (selectedOcc && typeof roleSkills !== 'undefined' && roleSkills[selectedOcc])
            ? roleSkills[selectedOcc].technical : null;

        // Intro — personalised when occupation is selected
        let intro = '';
        if (focus !== 'cpd') {
            intro = selectedOcc
                ? (contentType === 'ai'
                    ? `How to bring data and AI tools into your work as a <strong>${selectedOcc}</strong> — practical skills and courses, no retraining as a developer required.`
                    : `Building on your background as a <strong>${selectedOcc}</strong> — the in-demand skills, recommended courses and roles to grow into within ${sectorLabel}.`)
                : (subFocusIntro[subFocus] || '');
        }

        // Skills — occupation-specific when selected, otherwise sector hot-skills
        let skillItems = hybridSkills[sector] || [];
        if (occSkillSet) {
            if (contentType === 'ai') {
                const aiOverlap = occSkillSet.filter(s =>
                    aiKeywords.some(k => s.toLowerCase().includes(k.split(' ')[0]))
                );
                skillItems = aiOverlap.length >= 3
                    ? aiOverlap
                    : [...new Set([...aiOverlap, ...hybridSkills[sector]])].slice(0, 8);
            } else {
                skillItems = occSkillSet;
            }
        } else if (contentType !== 'ai') {
            const sectorDetails = (typeof baseSectorDetailData !== 'undefined') ? baseSectorDetailData[sector] : null;
            const hotSkills = sectorDetails ? sectorDetails.skills.filter(s => s.isHot).map(s => s.name) : [];
            if (hotSkills.length > 0) skillItems = hotSkills.slice(0, 8);
        }

        const allCourses = (typeof dataManager !== 'undefined' && dataManager.courses && dataManager.courses.length > 0)
            ? dataManager.courses : (typeof realCourses !== 'undefined' ? realCourses : []);

        const courseLimit = contentType === 'cpd' ? 3 : 6;

        // Courses — matched to occupation skills when selected, falling back to sector-wide
        let courses = [];
        if (occSkillSet && contentType !== 'cpd') {
            courses = allCourses.filter(c => {
                const matchSector = c.sector === sector || c.sector === 'all';
                if (!matchSector) return false;
                const courseSkillsLower = (c.skills || []).map(s => s.toLowerCase());
                const matchesOcc = occSkillSet.some(s => courseSkillsLower.some(cs => cs.includes(s.toLowerCase())));
                if (contentType === 'ai') {
                    return matchesOcc && aiKeywords.some(k => courseSkillsLower.join(' ').includes(k));
                }
                return matchesOcc;
            }).slice(0, courseLimit);
        }
        if (courses.length === 0) {
            courses = allCourses.filter(c => {
                const matchSector = c.sector === sector || c.sector === 'all';
                if (contentType === 'ai') {
                    const skillText = (c.skills || []).join(' ').toLowerCase();
                    return matchSector && aiKeywords.some(k => skillText.includes(k));
                }
                return matchSector;
            }).slice(0, courseLimit);
        }

        // --- Shared HTML builders ---
        const skillsHtml = skillItems.map(s =>
            `<span class="px-2 py-1 bg-sky-50 border border-sky-100 text-sky-700 rounded-lg text-[10px] font-bold">${s}</span>`
        ).join('');

        const courseRowHtml = c => `
            <a href="${c.url || '#'}" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-sky-300 hover:shadow-sm group transition-all">
                <div class="p-1.5 bg-blue-100 text-blue-600 rounded shrink-0"><i data-lucide="book-open" class="w-3.5 h-3.5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-700 group-hover:text-sky-700 truncate">${c.name}</div>
                    <div class="text-[10px] text-slate-500 truncate">${c.provider} &middot; ${c.duration} &middot; ${c.cost}</div>
                </div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-sky-500 shrink-0"></i>
            </a>`;

        const coursesHtml = courses.length > 0
            ? courses.map(courseRowHtml).join('')
            : '<div class="text-xs text-slate-400 italic py-2">No matching courses found — try the full course search below.</div>';

        const certsHtml = sectorCerts.map(c => `
            <a href="${c.link}" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-sky-300 hover:shadow-sm group transition-all">
                <div class="p-1.5 bg-sky-100 text-sky-600 rounded shrink-0"><i data-lucide="${c.icon}" class="w-3.5 h-3.5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-700 group-hover:text-sky-700 truncate">${c.title}</div>
                    <div class="text-[10px] text-slate-500 truncate">${c.desc}</div>
                </div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-sky-500 shrink-0"></i>
            </a>`).join('');

        const networksHtml = sectorNetworks.map(n => `
            <a href="${n.link}" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm group transition-all">
                <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded shrink-0"><i data-lucide="users" class="w-3.5 h-3.5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700 truncate">${n.title}</div>
                    <div class="text-[10px] text-slate-500 truncate">${n.desc}</div>
                </div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
            </a>`).join('');

        const occsHtml = occs.map(o => `
            <div class="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <div class="p-1.5 bg-sky-100 text-sky-600 rounded-lg shrink-0 mt-0.5"><i data-lucide="briefcase" class="w-3.5 h-3.5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                        ${o.name}
                        ${o.hot ? '<span class="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold border border-amber-200">In demand</span>' : ''}
                    </div>
                    <div class="text-[11px] text-slate-500 mt-0.5 leading-snug">${o.desc}</div>
                </div>
            </div>`).join('');

        const ctaHtml = `
            <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span class="text-xs text-slate-500">Want a full personalised action plan?</span>
                <button onclick="openSkillsView('pp-practice')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-1.5 w-fit">
                    Full Pathway Builder <i data-lucide="arrow-right" class="w-3 h-3"></i>
                </button>
            </div>`;

        // --- Content-type-specific layouts ---
        if (contentType === 'team') {
            const teamAiContext = {
                agri:    'precision farming, predictive crop disease alerts, AI-powered extension advisory, and supply chain optimisation',
                energy:  'predictive maintenance for solar and grid assets, AI-driven energy auditing, demand forecasting, and smart meter analytics',
                digital: 'AI-assisted code generation, automated testing pipelines, intelligent data engineering, and LLM-powered product features'
            };
            const auditSteps = [
                ['Assess each team member',  'Ask them to complete Assess Job Readiness for their current role.'],
                ['Map collective gaps',       'Use Top Skills in Demand as a benchmark for the whole team.'],
                ['Find group training',       'Use Find Courses — filter by In-Person or Bootcamp for cohort delivery.'],
                ['Track CPD progress',        'Have each team member revisit their pathway after completing training.']
            ];
            const aiResources = [
                { href: 'https://grow.google/ai',                                        icon: 'graduation-cap', label: 'Google AI Professional Certificate',     desc: 'AI fundamentals, prompting & ethical use — free, no coding required' },
                { href: 'https://grow.google/certificates/prompting-essentials/',        icon: 'message-square', label: 'Google Prompting Essentials',             desc: 'Certified course — practical prompt writing for everyday AI tools at work' },
                { href: 'https://learn.microsoft.com/en-us/ai/',                         icon: 'monitor',        label: 'Microsoft AI Skills',                     desc: 'Free learning paths on Copilot & Azure AI — verifiable badges on completion' },
                { href: 'https://www.coursera.org/collections/ai-productivity-tools',      icon: 'trending-up',    label: 'LinkedIn Learning — AI for Productivity', desc: 'Courses on ChatGPT, Copilot & Gemini in real workflows — attaches to your profile' },
                { href: 'https://www.coursera.org/learn/ai-for-everyone',               icon: 'brain',          label: 'AI For Everyone — DeepLearning.AI',      desc: 'Organisational AI strategy for non-technical leaders — free audit on Coursera' },
                { href: 'https://www.elementsofai.com',                                 icon: 'cpu',            label: 'Elements of AI — University of Helsinki', desc: "What AI is and isn't — designed for managers & non-developers, free certificate" },
                { href: 'https://zindi.africa',                                         icon: 'globe',          label: 'Zindi — African AI Challenges & Learning', desc: 'Africa-focused data science competitions & AI upskilling, 73,000+ EAC learners' }
            ];
            resultsHtml = `
                <div class="space-y-4 pt-1 border-t border-slate-100">
                    <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <h4 class="text-xs font-bold text-blue-900 mb-3 flex items-center gap-2"><i data-lucide="clipboard-list" class="w-3.5 h-3.5"></i> How to Run a Team Skills Audit</h4>
                        <div class="space-y-2">
                            ${auditSteps.map(([t, d], i) => `
                            <div class="flex items-start gap-3 bg-white rounded-lg p-2.5 border border-blue-100">
                                <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">${i + 1}</span>
                                <div><div class="text-xs font-bold text-slate-800">${t}</div><div class="text-[11px] text-slate-500 mt-0.5">${d}</div></div>
                            </div>`).join('')}
                        </div>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-slate-800 mb-1 flex items-center gap-2"><i data-lucide="sparkles" class="w-3.5 h-3.5 text-indigo-600"></i> AI Readiness Resources</h4>
                        <p class="text-[11px] text-slate-500 mb-2">Key AI applications in ${sectorLabel} include ${teamAiContext[sector] || 'automation, data analysis and intelligent decision-making'}. Equipping your team is now a core management responsibility.</p>
                        <div class="space-y-1.5">
                            ${aiResources.map(r => `
                            <a href="${r.href}" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm group transition-all">
                                <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded shrink-0"><i data-lucide="${r.icon}" class="w-3.5 h-3.5"></i></div>
                                <div class="flex-1 min-w-0"><div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700 truncate">${r.label}</div><div class="text-[10px] text-slate-500 truncate">${r.desc}</div></div>
                                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
                            </a>`).join('')}
                        </div>
                    </div>
                    <div class="space-y-2">
                        <h4 class="text-xs font-bold text-slate-800 mb-1 flex items-center gap-2"><i data-lucide="shield" class="w-3.5 h-3.5 text-rose-500"></i> Cyber Resilience</h4>
                        <p class="text-[11px] text-slate-500 mb-2">As AI tools and cloud services become standard, cybersecurity literacy is essential across your whole team — not just IT staff.</p>
                        <div class="space-y-1.5">
                            <a href="https://www.isaca.org/chapters" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-rose-300 hover:shadow-sm group transition-all">
                                <div class="p-1.5 bg-rose-50 text-rose-600 rounded shrink-0"><i data-lucide="shield" class="w-3.5 h-3.5"></i></div>
                                <div class="flex-1 min-w-0"><div class="text-xs font-bold text-slate-700 group-hover:text-rose-700 truncate">ISACA East Africa Chapters</div><div class="text-[10px] text-slate-500 truncate">CISA, CISM & CRISC pathways — globally recognised credentials</div></div>
                                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-rose-400 shrink-0"></i>
                            </a>
                            <a href="https://www.eccouncil.org" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-rose-300 hover:shadow-sm group transition-all">
                                <div class="p-1.5 bg-rose-50 text-rose-600 rounded shrink-0"><i data-lucide="lock" class="w-3.5 h-3.5"></i></div>
                                <div class="flex-1 min-w-0"><div class="text-xs font-bold text-slate-700 group-hover:text-rose-700 truncate">EC-Council / CLC Kenya</div><div class="text-[10px] text-slate-500 truncate">CEH, CSCU & CND certifications — practical, hands-on cyber skills</div></div>
                                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-rose-400 shrink-0"></i>
                            </a>
                            <a href="https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/entry/ccst.html" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-rose-300 hover:shadow-sm group transition-all">
                                <div class="p-1.5 bg-rose-50 text-rose-600 rounded shrink-0"><i data-lucide="eye" class="w-3.5 h-3.5"></i></div>
                                <div class="flex-1 min-w-0"><div class="text-xs font-bold text-slate-700 group-hover:text-rose-700 truncate">ESET Cybersecurity Awareness Training</div><div class="text-[10px] text-slate-500 truncate">Free awareness modules — phishing, social engineering & safe digital habits</div></div>
                                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-rose-400 shrink-0"></i>
                            </a>
                        </div>
                    </div>
                </div>`;
        } else if (contentType === 'cpd') {
            resultsHtml = `
                <div class="space-y-4 pt-1 border-t border-slate-100">
                    <div class="space-y-2">
                        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                            <i data-lucide="award" class="w-3.5 h-3.5 text-sky-500"></i> Certifications
                        </h3>
                        <div class="space-y-1.5">${certsHtml}</div>
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                            <i data-lucide="book-open" class="w-3.5 h-3.5 text-sky-500"></i> Courses
                        </h3>
                        <div class="space-y-1.5">${coursesHtml}</div>
                        <button onclick="openSkillsView('pp-courses')" class="text-[11px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1.5 mt-1">
                            Browse all courses <i data-lucide="arrow-right" class="w-3 h-3"></i>
                        </button>
                    </div>
                    ${ctaHtml}
                </div>`;
        } else {
            const rolesHeading = selectedOcc
                ? `Roles to grow into from ${selectedOcc}`
                : (contentType === 'broad' ? 'In-Demand Roles' : 'Hybrid Roles to Target');
            const certNetworkSection = contentType === 'broad' ? `
                <div class="space-y-2">
                    <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                        <i data-lucide="award" class="w-3.5 h-3.5 text-sky-500"></i> Certifications
                    </h3>
                    <div class="space-y-1.5">${certsHtml}</div>
                </div>` : '';

            resultsHtml = `
                <div class="space-y-4 pt-1 border-t border-slate-100">
                    ${intro ? `<p class="text-xs text-slate-500 leading-relaxed">${intro}</p>` : ''}
                    <div class="space-y-2">
                        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                            <i data-lucide="zap" class="w-3.5 h-3.5 text-sky-500"></i> Key Skills
                        </h3>
                        <div class="flex flex-wrap gap-1.5">${skillsHtml}</div>
                    </div>
                    ${certNetworkSection}

                    ${contentType === 'ai' ? `
                    <div class="space-y-2">
                        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                            <i data-lucide="trending-up" class="w-3.5 h-3.5 text-indigo-500"></i> AI Tools & Productivity
                        </h3>
                        <p class="text-[11px] text-slate-500 mb-1">Free and certified courses to help you use AI tools confidently in your day-to-day work.</p>
                        <div class="space-y-1.5">
                            <a href="https://grow.google/certificates/prompting-essentials/" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm group transition-all">
                                <div class="p-1.5 bg-indigo-50 text-indigo-600 rounded shrink-0"><i data-lucide="message-square" class="w-3.5 h-3.5"></i></div>
                                <div class="flex-1 min-w-0"><div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700 truncate">Google Prompting Essentials</div><div class="text-[10px] text-slate-500 truncate">Certified course — practical prompt writing for everyday AI tools at work</div></div>
                                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
                            </a>
                            <a href="https://learn.microsoft.com/en-us/ai/" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm group transition-all">
                                <div class="p-1.5 bg-indigo-50 text-indigo-600 rounded shrink-0"><i data-lucide="monitor" class="w-3.5 h-3.5"></i></div>
                                <div class="flex-1 min-w-0"><div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700 truncate">Microsoft AI Skills</div><div class="text-[10px] text-slate-500 truncate">Free learning paths on Copilot & Azure AI — verifiable badges on completion</div></div>
                                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
                            </a>
                            <a href="https://www.coursera.org/collections/ai-productivity-tools" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm group transition-all">
                                <div class="p-1.5 bg-indigo-50 text-indigo-600 rounded shrink-0"><i data-lucide="trending-up" class="w-3.5 h-3.5"></i></div>
                                <div class="flex-1 min-w-0"><div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700 truncate">LinkedIn Learning — AI for Productivity</div><div class="text-[10px] text-slate-500 truncate">Courses on ChatGPT, Copilot & Gemini in real workflows — attaches to your profile</div></div>
                                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
                            </a>
                        </div>
                    </div>` : ''}

                    ${contentType === 'ai' ? `
                    <div class="space-y-2">
                        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                            <i data-lucide="shield" class="w-3.5 h-3.5 text-rose-500"></i> Cyber Resilience
                        </h3>
                        <p class="text-[11px] text-slate-500 mb-1">As AI tools and cloud services become standard, cybersecurity literacy is essential for all staff — not just IT.</p>
                        <div class="space-y-1.5">
                            <a href="https://www.isaca.org/chapters" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-rose-300 hover:shadow-sm group transition-all">
                                <div class="p-1.5 bg-rose-50 text-rose-600 rounded shrink-0"><i data-lucide="shield" class="w-3.5 h-3.5"></i></div>
                                <div class="flex-1 min-w-0"><div class="text-xs font-bold text-slate-700 group-hover:text-rose-700 truncate">ISACA East Africa Chapters</div><div class="text-[10px] text-slate-500 truncate">CISA, CISM & CRISC pathways — globally recognised credentials</div></div>
                                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-rose-400 shrink-0"></i>
                            </a>
                            <a href="https://www.eccouncil.org" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-rose-300 hover:shadow-sm group transition-all">
                                <div class="p-1.5 bg-rose-50 text-rose-600 rounded shrink-0"><i data-lucide="lock" class="w-3.5 h-3.5"></i></div>
                                <div class="flex-1 min-w-0"><div class="text-xs font-bold text-slate-700 group-hover:text-rose-700 truncate">EC-Council / CLC Kenya</div><div class="text-[10px] text-slate-500 truncate">CEH, CSCU & CND certifications — practical, hands-on cyber skills</div></div>
                                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-rose-400 shrink-0"></i>
                            </a>
                            <a href="https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/entry/ccst.html" target="_blank" rel="noopener" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-rose-300 hover:shadow-sm group transition-all">
                                <div class="p-1.5 bg-rose-50 text-rose-600 rounded shrink-0"><i data-lucide="eye" class="w-3.5 h-3.5"></i></div>
                                <div class="flex-1 min-w-0"><div class="text-xs font-bold text-slate-700 group-hover:text-rose-700 truncate">ESET Cybersecurity Awareness Training</div><div class="text-[10px] text-slate-500 truncate">Free awareness modules — phishing, social engineering & safe digital habits</div></div>
                                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-rose-400 shrink-0"></i>
                            </a>
                        </div>
                    </div>` : ''}

                    <div class="space-y-2">
                        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                            <i data-lucide="book-open" class="w-3.5 h-3.5 text-sky-500"></i> Recommended Courses
                        </h3>
                        <div class="space-y-1.5">${coursesHtml}</div>
                        <button onclick="openSkillsView('pp-courses')" class="text-[11px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1.5 mt-1">
                            Browse all courses <i data-lucide="arrow-right" class="w-3 h-3"></i>
                        </button>
                    </div>
                    ${ctaHtml}
                </div>`;
        }
    }

    const backBtn = `<button onclick="renderSectorAIHub('${sector}', null)" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>`;

    const _sectorLabel = sector === 'agri' ? 'Agritech' : sector === 'energy' ? 'Renewable Energy' : 'the Digital Economy';
    const _occName = pathwayState.upskillingOccupation || null;
    let upskillHeading, upskillSubtitle;
    if (subFocus === 'ai') {
        upskillHeading = 'Apply AI to My Work';
        upskillSubtitle = _occName
            ? `AI tools and techniques tailored for your role as a <strong>${_occName}</strong> in ${_sectorLabel}.`
            : `How to bring AI and data tools into your work in ${_sectorLabel}.`;
    } else if (_exp === 'current') {
        upskillHeading = 'Stay Current & Keep Learning';
        upskillSubtitle = _occName
            ? `Certifications, communities and curated courses to keep your skills sharp as a <strong>${_occName}</strong> in ${_sectorLabel}.`
            : `Certifications, communities and curated courses to keep your professional skills sharp in ${_sectorLabel}.`;
    } else if (_exp === 'team') {
        upskillHeading = 'Upskilling for Your Team';
        upskillSubtitle = `A practical guide for team leaders, L&amp;D managers and HR professionals in ${_sectorLabel}.`;
    } else {
        upskillHeading = 'Grow Your Skills';
        upskillSubtitle = _occName
            ? `Building on your background as a <strong>${_occName}</strong> — in-demand skills, recommended courses and roles to grow into in ${_sectorLabel}.`
            : `In-demand skills, recommended courses and roles to target in ${_sectorLabel}.`;
    }

    const _aiKeyApps = {
        agri:    'precision crop monitoring, AI-driven pest and disease detection, soil health prediction, yield optimisation, and smart supply chain management',
        energy:  'solar output forecasting, predictive maintenance for equipment, smart grid load optimisation, energy demand modelling, and AI-assisted site assessment',
        digital: 'AI-assisted code generation and review, automated data analysis, content creation, workflow automation, and AI-powered UX and product research'
    };
    const aiReadinessIntroHtml = subFocus === 'ai' ? `
        <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p class="text-xs font-bold text-indigo-900 mb-1.5">AI Readiness for Your Workforce</p>
            <p class="text-xs text-indigo-800 leading-relaxed">AI is reshaping occupations and workflows across ${_sectorLabel}. Key applications include ${_aiKeyApps[sector] || 'automation, data analysis, and intelligent decision-making tools'}. Equipping yourself to use AI tools confidently and responsibly is now a core part of the workplace for many and a management responsibility.</p>
        </div>` : '';

    const _aiCardContext = {
        agri:    'AI tools are transforming agriculture — from precision crop monitoring and AI-powered pest detection to intelligent extension advisory and supply chain optimisation.',
        energy:  'AI is driving smarter energy systems — from predictive maintenance and solar output forecasting to real-time grid optimisation and demand modelling.',
        digital: 'AI is reshaping digital work — from code generation and automated testing to data-driven product decisions and AI-powered UX research.'
    };
    const aiCardIntroHtml = `
        <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p class="text-xs font-bold text-indigo-900 mb-1.5">AI Readiness for Your Workforce</p>
            <p class="text-xs text-indigo-800 leading-relaxed">${_aiCardContext[sector] || 'AI is reshaping occupations and workflows across all sectors.'} Whether you\'re building new skills, staying current in your role, or developing your team\'s capabilities, AI literacy is now a core part of professional practice in ${_sectorLabel}.</p>
        </div>`;

    container.innerHTML = (focus === 'upskill') ? `
        <div class="pp-back-nav mb-4">${backBtn}</div>
        <div class="space-y-5">
            ${subFocus !== 'broad' ? `<div>
                <h2 class="text-base font-bold text-slate-900 mb-0.5">${upskillHeading}</h2>
                <p class="text-xs text-slate-500 leading-relaxed">${upskillSubtitle}</p>
            </div>` : ''}
            ${subFocus === 'ai' ? sectorSelectorHtml : ''}
            ${aiReadinessIntroHtml}
            ${subFocus === 'ai' ? aiExperienceSelectorHtml : ''}
            ${occupationPickerHtml}
            ${experienceSelectorHtml}
            ${resultsHtml}
        </div>` : `
        <div class="pp-back-nav mb-4">
            <button onclick="navigateBackInHub()" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>
        </div>
        <div class="space-y-5">
            ${focusSelectorHtml}
        </div>`;
    refreshIcons();
};

window.selectUpskillingOccupation = function(occ) {
    pathwayState.upskillingOccupation = occ || null;
    renderSectorAIHub(pathwayState.upskillingSector || activeSectorId, 'upskill', pathwayState.upskillingSubFocus || null);
};

window.selectUpskillingExperience = function(level) {
    pathwayState.upskillingExperience = level || 'building';
    renderSectorAIHub(pathwayState.upskillingSector || activeSectorId, 'upskill', 'broad');
};

window.selectAIExperience = function(exp, sector) {
    pathwayState.upskillingExperience = exp || 'building';
    renderSectorAIHub(sector || activeSectorId, 'upskill', 'ai');
};

window.openAuditMyTeam = function(sector) {
    pathwayState.upskillingSector = sector || activeSectorId;
    openSkillsView('pp-employer');
};

window.getSavedSkills = function() {
    try {
        var raw = JSON.parse(localStorage.getItem('savedSkills') || '[]');
        if (!raw.length) return [];
        if (typeof raw[0] === 'string') return raw;
        return raw.map(function(e) { return e.name; });
    } catch(e) { return []; }
}
window.getSavedSkillObjects = function() {
    try {
        var raw = JSON.parse(localStorage.getItem('savedSkills') || '[]');
        if (!raw.length) return [];
        if (typeof raw[0] === 'string') return raw.map(function(n) { return { name: n, savedAt: new Date().toISOString() }; });
        return raw;
    } catch(e) { return []; }
}
window.toggleSavedSkill = function(skillName, btn) {
    try {
        var saved = getSavedSkillObjects();
        var idx = saved.findIndex(function(e) { return e.name === skillName; });
        if (idx >= 0) saved.splice(idx, 1); else saved.push({ name: skillName, savedAt: new Date().toISOString() });
        localStorage.setItem('savedSkills', JSON.stringify(saved));
        var isSaved = saved.some(function(e) { return e.name === skillName; });
        btn.className = 'absolute top-1.5 right-1.5 p-1 rounded transition-colors ' + (isSaved ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-slate-300 hover:text-slate-500 bg-white');
        var icon = btn.querySelector('i');
        if (icon) { icon.setAttribute('data-lucide', isSaved ? 'bookmark-check' : 'bookmark'); refreshIcons(); }
        btn.title = isSaved ? 'Remove from saved' : 'Save skill';
    } catch(e) {}
}

let _sectorHubView = 'occupations'; // tracks active sub-view for refresh-on-change
let _marketIntelTab = 'sector';

function _refreshSectorHub() {
    if (_sectorHubView === 'top-skills') {
        renderTopSkillsInBlock1();
    } else if (_sectorHubView === 'occupations-detail') {
        renderSectorOccupationsDetail();
    } else if (_sectorHubView === 'entrepreneurship') {
        renderEntrepreneurshipView();
    } else if (_sectorHubView === 'market-intel') {
        showMarketIntelView(_marketIntelTab, 'sector-hub-results', 'renderOccupationsView()');
    } else {
        renderOccupationsView();
    }
}

// Renders Top Skills into the Block 1 sector-hub-results container (keeps navigation within Block 1)
window.renderTopSkillsInBlock1 = function() {
    _sectorHubView = 'top-skills';
    const hub = document.getElementById('sector-hub-results');
    if (!hub) return;
    hub.innerHTML = `
        <button onclick="renderOccupationsView()" class="mb-4 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Back
        </button>
        <div id="block1-top-skills" class="space-y-4"></div>
        <div id="block1-cross-skills" class="mt-4"></div>
    `;
    refreshIcons();
    renderSkillsHubSkills('block1-top-skills');
    renderCrossSectorSkillsBlock('block1-cross-skills');
}

window.renderCrossSectorSkillsBlock = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const crossEntries = (typeof crossSectorSkillMatrix !== 'undefined')
        ? Object.entries(crossSectorSkillMatrix)
            .filter(([,v]) => v.agri && v.energy && v.digital)
            .sort(([a], [b]) => a.localeCompare(b))
        : [];
    if (crossEntries.length === 0) return;
    const makeRow = ([skill, apps], hidden = false) => `
        <tr class="border-t border-slate-100${hidden ? ' cross-extra-row' : ''}"${hidden ? ' style="display:none"' : ''}>
            <td class="py-3 pl-4 pr-2 text-xs font-semibold text-slate-700 align-top w-[22%]">${skill}</td>
            <td class="py-3 px-3 text-xs text-green-700 leading-snug align-top">${apps.agri}</td>
            <td class="py-3 px-3 text-xs text-orange-700 leading-snug align-top">${apps.energy}</td>
            <td class="py-3 pl-3 pr-4 text-xs text-indigo-700 leading-snug align-top">${apps.digital}</td>
        </tr>`;
    const rowsVisible = crossEntries.slice(0, 5).map(e => makeRow(e)).join('');
    const rowsHidden  = crossEntries.slice(5).map(e => makeRow(e, true)).join('');
    container.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div class="flex items-center gap-2 p-4 border-b border-slate-100 bg-slate-50">
                <i data-lucide="layers" class="w-4 h-4 text-amber-500"></i>
                <span class="text-sm sm:text-[17px] font-bold text-slate-800">Cross-Sector Skills</span>
                <span class="text-[11px] text-slate-400 ml-1">— how each skill applies across all three sectors</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[520px]">
                    <thead>
                        <tr class="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            <th class="py-2.5 pl-4 pr-2 text-left w-[22%]">Skill</th>
                            <th class="py-2.5 px-3 text-left text-green-600">Agritech</th>
                            <th class="py-2.5 px-3 text-left text-orange-600">Renewable Energy</th>
                            <th class="py-2.5 pl-3 pr-4 text-left text-indigo-600">Digital Economy</th>
                        </tr>
                    </thead>
                    <tbody>${rowsVisible}${rowsHidden}</tbody>
                </table>
            </div>
            ${crossEntries.length > 5 ? `
            <div id="cross-show-more-wrap" class="border-t border-slate-100 px-4 py-3 text-center" data-extra-count="${crossEntries.length - 5}">
                <button onclick="showAllCrossSkills()" class="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1.5 mx-auto">
                    Show ${crossEntries.length - 5} more skills <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
                </button>
            </div>` : ''}
        </div>
    `;
    refreshIcons();
};

// --- NEW: Render Skills Grid in Skills Hub ---
window.renderSkillsHubSkills = function(containerIdOverride) {
    const container = document.getElementById(containerIdOverride || 'pp-top-skills');
    if (!container) return;

    // Fetch Skills Data
    let displaySkills = dataManager.getSkills(activeSectorId);
    if (!displaySkills || displaySkills.length === 0) {
         const baseData = (typeof baseSectorDetailData !== 'undefined' && baseSectorDetailData[activeSectorId]) 
            ? baseSectorDetailData[activeSectorId] 
            : (typeof baseSectorDetailData !== 'undefined' ? baseSectorDetailData['agri'] : null);
         if (baseData) displaySkills = baseData.skills;
    }
    if (!displaySkills) displaySkills = [];

    // Sort: hot skills first, preserve relative order within each group
    displaySkills = [
        ...displaySkills.filter(s => s.isHot),
        ...displaySkills.filter(s => !s.isHot)
    ];

    // Filter Logic
    if (showCrossSectorOnly) {
        displaySkills = displaySkills.filter(s => {
            const name = s.name || s.skill;
            return typeof crossSectorSkillMatrix !== 'undefined' && crossSectorSkillMatrix[name];
        });
    }
    if (showSavedOnly) {
        const savedNames = getSavedSkills();
        displaySkills = displaySkills.filter(s => savedNames.includes(s.name || s.skill));
        if (displaySkills.length === 0) {
            container.innerHTML = `<div class="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm"><i data-lucide="bookmark" class="w-8 h-8 text-slate-300 mx-auto mb-3"></i><p class="text-sm text-slate-500 mb-3">No saved skills yet. Browse skills and click the bookmark icon to save them here.</p><button onclick="toggleSavedFilter()" class="text-xs font-bold text-indigo-600 hover:underline">Show All Skills</button></div>`;
            refreshIcons();
            return;
        }
    }

    const topSkills = displaySkills.slice(0, 6);
    const moreSkills = displaySkills.slice(6, 15);

    // Styling
    const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[activeSectorId] : { color: 'indigo' };
    const themeColor = themeConfig.color;
    const sectorLabel = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';
    const countryLabel = activeCountry === 'all' ? 'Regional' : activeCountry;

    const cardTitleColor = `text-${themeColor}-800`;
    const cardDescColor  = `text-${themeColor}-700/80`;
    const cardBgColor    = 'bg-white';
    const cardBorderColor = `border-${themeColor}-200`;
    const cardHoverBg    = `hover:bg-${themeColor}-50`;
    const cardHoverBorder = `hover:border-${themeColor}-300`;

    const renderSkillCard = (skill) => {
        const skillName = skill.name || skill.skill;
        const skillDesc = skill.desc || skill.description || 'Key competency';
        const isSaved = getSavedSkills().includes(skillName);
        return `
        <div class="relative group h-full">
            <button onclick="openSkillModal('${skillName.replace(/'/g, "\\'")}')" class="w-full px-3 py-2 pr-7 ${cardBgColor} border ${cardBorderColor} rounded-lg text-left ${cardHoverBg} ${cardHoverBorder} transition-all h-full flex flex-col justify-between">
                <div class="w-full">
                    <div class="font-bold text-xs ${cardTitleColor} mb-0.5 flex items-center gap-1 flex-wrap min-w-0">
                        <i data-lucide="cpu" class="w-3 h-3 shrink-0 opacity-60"></i>
                        <span class="truncate">${skillName}</span>
                        ${skill.isHot ? '<span title="Critical Demand" class="shrink-0">&#x1F525;</span>' : ''}
                    </div>
                    <div class="text-[10px] ${cardDescColor} leading-tight line-clamp-2">${skillDesc}</div>
                </div>
            </button>
            <button onclick="event.stopPropagation(); toggleSavedSkill('${skillName.replace(/'/g, "\\'")}', this)"
                class="absolute top-1.5 right-1.5 p-1 rounded transition-colors ${isSaved ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-slate-300 hover:text-slate-500 bg-white'}"
                title="${isSaved ? 'Remove from saved' : 'Save skill'}">
                <i data-lucide="${isSaved ? 'bookmark-check' : 'bookmark'}" class="w-3 h-3"></i>
            </button>
        </div>`;
    };

    container.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div class="flex items-center justify-between gap-3 p-4 border-b border-slate-100 bg-slate-50">
                <div class="flex items-center gap-2">
                    <i data-lucide="trending-up" class="w-4 h-4 text-indigo-500"></i>
                    <span class="text-sm sm:text-[17px] font-bold text-slate-800">Top Skills Sought by Employers</span>
                </div>
                <button onclick="toggleSavedFilter()" class="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1 ${showSavedOnly ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}">
                    <i data-lucide="bookmark" class="w-3 h-3"></i> Saved
                </button>
            </div>
            <div class="p-4">
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    ${topSkills.map(renderSkillCard).join('')}
                </div>
                ${moreSkills.length > 0 ? `
                <div id="skills-extra-cards" class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 hidden">
                    ${moreSkills.map(renderSkillCard).join('')}
                </div>
                <div id="skills-show-more-wrap" class="mt-3 text-center" data-extra-count="${moreSkills.length}">
                    <button onclick="showAllTopSkills()" class="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1.5 mx-auto">
                        View ${moreSkills.length} more skills <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
                    </button>
                </div>` : ''}
            </div>
        </div>
    `;
    refreshIcons();
}

window.toggleMoreFilters = function() {
    const panel = document.getElementById('secondary-filters');
    if (!panel) return;
    const isHidden = panel.classList.contains('hidden');
    panel.classList.toggle('hidden');
    const chevron = document.getElementById('more-filters-chevron');
    if (chevron) chevron.setAttribute('data-lucide', isHidden ? 'chevron-up' : 'chevron-down');
    refreshIcons();
}

window.toggleFreeFilter = function() {
    const costFilter = document.getElementById('filter-cost');
    const btn = document.getElementById('free-toggle');
    if (!costFilter || !btn) return;
    const isActive = costFilter.value === 'free';
    costFilter.value = isActive ? 'all' : 'free';
    if (isActive) {
        btn.className = 'px-3 py-1 rounded-full text-[11px] font-semibold border transition-all border-slate-300 text-slate-500 bg-white hover:border-indigo-400 hover:text-indigo-600';
    } else {
        btn.className = 'px-3 py-1 rounded-full text-[11px] font-semibold border transition-all border-indigo-600 bg-indigo-600 text-white';
    }
    renderProviderTable();
}

window.toggleAccreditedFilter = function() {
    const typeFilter = document.getElementById('filter-type');
    const btn = document.getElementById('accredited-toggle');
    if (!typeFilter || !btn) return;
    const isActive = typeFilter.value === 'accredited';
    typeFilter.value = isActive ? 'all' : 'accredited';
    if (isActive) {
        btn.className = 'px-3 py-1 rounded-full text-[11px] font-semibold border transition-all border-slate-300 text-slate-500 bg-white hover:border-indigo-400 hover:text-indigo-600';
    } else {
        btn.className = 'px-3 py-1 rounded-full text-[11px] font-semibold border transition-all border-indigo-600 bg-indigo-600 text-white';
    }
    renderProviderTable();
}

// --- NEW: Render Find Courses View (Optimized Layout) ---
window.renderFindCoursesView = function() {
    const container = document.getElementById('pp-courses');
    if (!container) return;

    const sectorLabel = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';
    const countryLabel = activeCountry === 'all' ? 'Regional' : activeCountry;
    const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[activeSectorId] : { color: 'indigo' };
    const themeColor = themeConfig.color;

    container.innerHTML = `
        <div class="animate-fade-in space-y-4">
            <!-- Header -->
            <div class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                    <h2 class="text-lg font-bold text-slate-900">Find Courses</h2>
                    <p class="text-xs text-slate-500">Browse verified training providers in <strong>${sectorLabel}</strong>.</p>
                    <div class="flex flex-wrap items-center gap-1.5 mt-2 text-[11px] text-slate-400">
                        <span class="inline-flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded-full"><i data-lucide="map-pin" class="w-2.5 h-2.5"></i> ${countryLabel}</span>
                        <span class="inline-flex items-center gap-1 bg-${themeColor}-50 border border-${themeColor}-200 text-${themeColor}-700 px-1.5 py-0.5 rounded-full"><i data-lucide="briefcase" class="w-2.5 h-2.5"></i> ${sectorLabel}</span>
                    </div>
                    <!-- Quick filter pills -->
                    <div class="mt-3 flex flex-wrap items-center gap-2">
                        <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Quick filters:</span>
                        <button type="button" id="free-toggle" onclick="toggleFreeFilter()" class="px-3 py-1 rounded-full text-[11px] font-semibold border transition-all border-slate-300 text-slate-500 bg-white hover:border-indigo-400 hover:text-indigo-600">
                            Free &amp; Subsidised only
                        </button>
                        <button type="button" id="accredited-toggle" onclick="toggleAccreditedFilter()" class="px-3 py-1 rounded-full text-[11px] font-semibold border transition-all border-slate-300 text-slate-500 bg-white hover:border-indigo-400 hover:text-indigo-600">
                            Accredited only
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <!-- Primary filters (always visible) -->
                <div class="mb-3">
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Search Courses</label>
                    <input id="filter-search" type="text" oninput="renderProviderTable()" placeholder="Search by name, provider or skill..." class="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <!-- Skill Filter (First Priority) -->
                    <div class="col-span-1 sm:col-span-2">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Skill Focus</label>
                        <select id="filter-skill" onchange="renderProviderTable()" class="w-full text-xs border-slate-300 rounded-lg p-2 focus:ring-indigo-500 bg-indigo-50/50 border-indigo-200 text-indigo-900 font-medium">
                            <option value="all">All Skills</option>
                            <!-- Populated dynamically -->
                        </select>
                        <p class="text-[10px] text-slate-400 mt-1">Not sure? <button type="button" onclick="openSkillsView('pp-top-skills')" class="text-indigo-500 hover:underline font-medium">Browse Skills in Demand</button></p>
                    </div>

                    <!-- Country -->
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Location</label>
                        <select id="filter-country" onchange="renderProviderTable()" class="w-full text-xs border-slate-300 rounded-lg p-2 focus:ring-indigo-500">
                            <option value="all">All Locations</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Tanzania">Tanzania</option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="Burundi">Burundi</option>
                            <option value="South Sudan">South Sudan</option>
                            <option value="DRC">DR Congo</option>
                            <option value="Somalia">Somalia</option>
                        </select>
                    </div>
                </div>

                <!-- More Filters toggle -->
                <button type="button" onclick="toggleMoreFilters()" id="more-filters-toggle" class="mt-2 text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                    <i data-lucide="sliders" class="w-3 h-3"></i> More Filters <i data-lucide="chevron-down" class="w-3 h-3" id="more-filters-chevron"></i>
                </button>

                <!-- Secondary filters (collapsible) -->
                <div id="secondary-filters" class="hidden mt-3 pt-3 border-t border-slate-100">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <!-- Level -->
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Level</label>
                            <select id="filter-difficulty" onchange="renderProviderTable()" class="w-full text-xs border-slate-300 rounded-lg p-2 focus:ring-indigo-500">
                                <option value="all">All Levels</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <!-- Mode -->
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mode</label>
                            <select id="filter-mode" onchange="renderProviderTable()" class="w-full text-xs border-slate-300 rounded-lg p-2 focus:ring-indigo-500">
                                <option value="all">Any Mode</option>
                                <option value="Online">Online</option>
                                <option value="In-Person">In-Person</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <!-- Duration -->
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Duration</label>
                            <select id="filter-duration" onchange="renderProviderTable()" class="w-full text-xs border-slate-300 rounded-lg p-2 focus:ring-indigo-500">
                                <option value="all">Any Duration</option>
                                <option value="short">&lt; 1 Month</option>
                                <option value="1-3m">1-3 Months</option>
                                <option value="3-6m">3-6 Months</option>
                                <option value="6-12m">6-12 Months</option>
                                <option value="1-2y">1-2 Years</option>
                                <option value="2y+">2 Years+</option>
                            </select>
                        </div>

                        <!-- Cost -->
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cost</label>
                            <select id="filter-cost" onchange="renderProviderTable()" class="w-full text-xs border-slate-300 rounded-lg p-2 focus:ring-indigo-500">
                                <option value="all">Any Cost</option>
                                <option value="free">Free / Subsidized</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>

                        <!-- Type -->
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Type</label>
                            <select id="filter-type" onchange="renderProviderTable()" class="w-full text-xs border-slate-300 rounded-lg p-2 focus:ring-indigo-500">
                                <option value="all">Any Type</option>
                                <option value="micro">Micro-credential</option>
                                <option value="cert">Certificate</option>
                                <option value="degree">Degree/Diploma</option>
                                <option value="bootcamp">Bootcamp</option>
                                <option value="hubs">Hubs & Labs</option>
                            </select>
                        </div>

                        <!-- Sort By -->
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sort By</label>
                            <select id="filter-sort" onchange="renderProviderTable()" class="w-full text-xs border-slate-300 rounded-lg p-2 focus:ring-indigo-500">
                                <option value="default">Relevance</option>
                                <option value="duration_asc">Shortest First</option>
                                <option value="cost_asc">Free First</option>
                                <option value="rating_desc">Top Rated</option>
                            </select>
                        </div>

                        <!-- Language -->
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Language</label>
                            <select id="filter-lang" onchange="renderProviderTable()" class="w-full text-xs border-slate-300 rounded-lg p-2 focus:ring-indigo-500">
                                <option value="all">Any Language</option>
                                <option value="English">English</option>
                                <option value="French">French</option>
                                <option value="Swahili">Swahili</option>
                                <option value="Arabic">Arabic</option>
                            </select>
                        </div>

                        <!-- Feature -->
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Feature</label>
                            <select id="filter-feature" onchange="renderProviderTable()" class="w-full text-xs border-slate-300 rounded-lg p-2 focus:ring-indigo-500">
                                <option value="all">Any</option>
                                <option value="women">Women-Focused</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results -->
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-3 border-b border-slate-200 bg-slate-50">
                    <div class="flex flex-wrap justify-between items-center gap-2">
                        <span class="text-xs font-bold text-slate-600" id="provider-counter">Loading...</span>
                    </div>
                    <div id="active-filter-chips"></div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse hidden md:table">
                        <thead>
                            <tr class="text-[10px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <th class="px-3 py-2 font-bold">Course / Provider</th>
                                <th class="px-3 py-2 font-bold">Details</th>
                                <th class="px-3 py-2 font-bold">Updated</th>
                                <th class="px-3 py-2 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody id="db-body"></tbody>
                    </table>
                    <!-- Mobile Cards -->
                    <div id="db-mobile-cards" class="md:hidden divide-y divide-slate-100"></div>
                </div>
            </div>

            <!-- Financial Aid Nudge -->
            <div class="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between gap-3">
                <div class="flex items-center gap-2 text-xs text-indigo-800">
                    <i data-lucide="banknote" class="w-4 h-4 text-indigo-600 shrink-0"></i>
                    <span>Paid course? You may be eligible for funding support.</span>
                </div>
                <button onclick="openSkillsView('pp-finance')" class="text-[10px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-200 whitespace-nowrap transition-colors flex items-center gap-1">
                    Check Aid <i data-lucide="arrow-right" class="w-3 h-3"></i>
                </button>
            </div>
        </div>
    `;

    // Initialize Filters
    populateSkillFilter();
    // Pre-select gap skill from SkillsMatch if available
    if (typeof pathwayState !== 'undefined' && pathwayState.diagnosticGapSkill) {
        const gapSelect = document.getElementById('filter-skill');
        if (gapSelect) {
            const gapOpt = Array.from(gapSelect.options).find(function(o) { return o.value === pathwayState.diagnosticGapSkill; });
            if (gapOpt) gapSelect.value = pathwayState.diagnosticGapSkill;
        }
    }
    const countrySelect = document.getElementById('filter-country');
    if(countrySelect) countrySelect.value = activeCountry;

    renderProviderTable();
    refreshIcons();
}

window.openSkillsView = function(viewId, preserveState = false, addToStack = true, suppressBack = false) {
    // Hide dashboard
    const dashboard = document.getElementById('skills-hub-home');
    if(dashboard) dashboard.classList.add('hidden');
    
    // Manage Navigation Stack
    if (addToStack) {
        const currentView = document.querySelector('.pp-view-content:not(.hidden)');
        if (currentView && currentView.id !== viewId) {
            hubNavigationStack.push(currentView.id);
        }
    }

    // Hide all views
    document.querySelectorAll('.pp-view-content').forEach(el => el.classList.add('hidden'));
    
    // Show target view
    const target = document.getElementById(viewId);
    if(target) {
        target.classList.remove('hidden');
        
        // Update Header Title
        const headerTitle = document.getElementById('pp-header-title');
        if (headerTitle) {
            if (viewId === 'pp-launchpad') {
                headerTitle.innerHTML = `<i data-lucide="rocket" class="w-6 h-6 text-indigo-600"></i> Start-Up Resources`;
            } else if (viewId === 'pp-finance') {
                headerTitle.innerHTML = `<i data-lucide="banknote" class="w-6 h-6 text-blue-600"></i> Financial Aid and Scholarships`;
            } else if (viewId === 'pp-top-skills') {
                headerTitle.innerHTML = `<i data-lucide="trending-up" class="w-6 h-6 text-indigo-600"></i> Top Skills in Demand`;
            } else if (viewId === 'pp-diagnostic') {
                headerTitle.innerHTML = `<i data-lucide="clipboard-check" class="w-6 h-6 text-indigo-600"></i> Assess Job Readiness`;
            } else if (viewId === 'pp-practice') {
                headerTitle.innerHTML = `<i data-lucide="map" class="w-6 h-6 text-indigo-600"></i> Learning and Career Pathways`;
            } else if (viewId === 'pp-courses') {
                headerTitle.innerHTML = `<i data-lucide="search" class="w-6 h-6 text-blue-600"></i> Find Courses`;
                const _ha = document.getElementById('pp-header-action');
                if (_ha) { _ha.innerHTML = `<button onclick="toggleCourseSubmission()" class="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-lg border border-teal-200 transition-colors"><i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> Submit a Course</button>`; refreshIcons(); }
            } else if (viewId === 'pp-resources') {
                headerTitle.innerHTML = `<i data-lucide="library" class="w-6 h-6 text-slate-600"></i> Resource Library`;
            } else if (viewId === 'pp-recommendations') {
                headerTitle.innerHTML = `<i data-lucide="git-branch" class="w-6 h-6 text-indigo-600"></i> Career Pathways`;
            } else if (viewId === 'pp-sector-ai') {
                headerTitle.innerHTML = `<i data-lucide="trending-up" class="w-6 h-6 text-sky-600"></i> Upskilling and Lifelong Learning`;
            } else if (viewId === 'pp-employer') {
                headerTitle.innerHTML = `<i data-lucide="building-2" class="w-6 h-6 text-sky-600"></i> Upskilling for Businesses &amp; Teams`;
            } else if (viewId === 'pp-self-employment') {
                headerTitle.innerHTML = `<i data-lucide="store" class="w-6 h-6 text-sky-600"></i> Self-Employment &amp; Gig Work`;
            } else {
                headerTitle.innerHTML = `<i data-lucide="layers" class="w-6 h-6 text-indigo-600"></i> Skills &amp; Career Pathways`;
            }
            if (viewId !== 'pp-courses') {
                const _ha = document.getElementById('pp-header-action');
                if (_ha) _ha.innerHTML = '';
            }
        }

        // Trigger specific render logic if needed (Render FIRST, then inject nav)
        if(viewId === 'pp-diagnostic') {
            if (!preserveState) {
                const cachedResults = document.getElementById('diagnostic-results');
                if (pathwayState.diagnosticRole && pathwayState.diagnosticSector === activeSectorId && pathwayState.diagnosticCountry === activeCountry && cachedResults && cachedResults.innerHTML.trim()) {
                    const inputsEl = document.getElementById('diagnostic-inputs');
                    if (inputsEl) inputsEl.classList.add('hidden');
                } else {
                    renderPathwayContent();
                }
            }
        } else if (viewId === 'pp-practice') {
             if (!preserveState) initPathwayWizard();
        } else if (viewId === 'pp-courses') {
            renderFindCoursesView();
        } else if (viewId === 'pp-launchpad') {
            renderLaunchpadTab();
        } else if (viewId === 'pp-finance') {
            renderFinancialAidTab();
        } else if (viewId === 'pp-resources') {
            renderResourceLibrary();
        } else if (viewId === 'pp-recommendations') {
            showTrainingRecommendations('pp-recommendations', 'navigateBackInHub()');
        } else if (viewId === 'pp-top-skills') {
            renderSkillsHubSkills();
        } else if (viewId === 'pp-sector-ai') {
            renderSectorAIHub(activeSectorId, null);
        } else if (viewId === 'pp-employer') {
            renderHRView();
        } else if (viewId === 'pp-self-employment') {
            renderSelfEmploymentView();
        }

        // Inject Back Button (After render to ensure it persists)
        if (!suppressBack) {
            let nav = target.querySelector('.pp-back-nav');
            if(!nav) {
                nav = document.createElement('div');
                nav.className = 'pp-back-nav mb-4';
                target.insertBefore(nav, target.firstChild);
            }
            const backLabel = (hubNavigationStack.length === 0) ? "Back to Hub" : "Back";
            nav.innerHTML = `<button onclick="navigateBackInHub()" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"><i data-lucide="arrow-left" class="w-4 h-4"></i> ${backLabel}</button>`;
        } else {
            const nav = target.querySelector('.pp-back-nav');
            if (nav) nav.remove();
        }

        // Scroll to top
        const container = document.getElementById('pp-scroll-container');
        if(container) container.scrollTop = 0;

        refreshIcons();
    }
}

window.navigateBackInHub = function() {
    if (hubNavigationStack.length > 0) {
        const prevViewId = hubNavigationStack.pop();
        // Return to previous view, preserving its state, and NOT adding to stack (since we are popping)
        openSkillsView(prevViewId, true, false);
    } else {
        renderSkillsHubDashboard();
    }
}

window.openVentureLaunchpad = function(ventureTitle) {
    // Close Venture Modal
    closeModal('venture-modal');
    
    // Open Unified Hub -> Founder's Launchpad Tab
    openUnifiedHub('pp-launchpad', null, null);
    // Ensure specific venture is rendered after opening
    setTimeout(() => {
        if(typeof renderVentureLaunchpad === 'function') renderVentureLaunchpad(ventureTitle);
    }, 100);
}

// --- NEW: Submit Practice Task Logic (Updated to accept badge name) ---
window.submitPracticeTask = function(badgeName) {
    const container = document.getElementById('pp-practice-content');
    const awardedBadge = badgeName || "Verified Competency Badge";
    
    // Show loading state
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div>
                <h3 class="font-bold text-slate-800">AI Analysis in Progress...</h3>
                <p class="text-xs text-slate-500">Checking against sector benchmarks</p>
            </div>
        </div>
    `;
    
    // Mock delay then result
    setTimeout(() => {
        const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[activeSectorId] : { color: 'indigo', feedback: "Great work." };
        const themeColor = themeConfig.color;
        const feedbackText = themeConfig.feedback;

        container.innerHTML = `
            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden animate-fade-in">
                <div class="bg-gradient-to-r from-${themeColor}-500 to-${themeColor}-600 p-6 text-white text-center">
                    <div class="text-3xl font-bold mb-1">92%</div>
                    <div class="text-xs font-medium opacity-90 uppercase tracking-wide">Technical Accuracy</div>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <h4 class="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-blue-500"></i> AI Feedback</h4>
                        <p class="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">${feedbackText}</p>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div class="bg-slate-50 p-2 rounded text-center"><span class="block font-bold text-slate-800">Completeness</span><span class="text-blue-600">High</span></div>
                        <div class="bg-slate-50 p-2 rounded text-center"><span class="block font-bold text-slate-800">Relevance</span><span class="text-blue-600">Spot On</span></div>
                    </div>
                <button class="w-full py-2 bg-slate-900 text-white font-bold rounded-lg text-sm hover:bg-slate-800 transition-colors shadow-sm">
                        View '${awardedBadge}'
                    </button>
                </div>
            </div>
        `;
        refreshIcons();
    }, 1500);
}

// --- NEW: View Certificate Logic ---
window.viewCertificate = function(badgeName) {
    closeModalOverlaysOnly('certificate-modal');
    const modal = document.getElementById('certificate-modal');
    const panel = document.getElementById('certificate-modal-panel');
    
    // Set dynamic content
    document.getElementById('cert-skill').innerText = badgeName || "Data Science Associate";
    document.getElementById('cert-date').innerText = new Date().toLocaleDateString();
    document.getElementById('cert-sector').innerText = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';

    document.body.classList.add('overflow-hidden');
    modal.classList.remove('hidden');
    setTimeout(() => { 
        panel.classList.remove('scale-95', 'opacity-0'); 
        panel.classList.add('scale-100', 'opacity-100'); 
    }, 10);
}

// Interview Coach functions removed — feature not active in this release
window.toggleTrainingHub = function() {
    // Close Unified Hub if open
    closeAllModals('training-hub-drawer');

    // 2. Toggle this drawer (Remove class to show, Add class to hide)
    const drawer = document.getElementById('training-hub-drawer');
    drawer.classList.toggle('translate-x-full');

    if (!drawer.classList.contains('translate-x-full')) {
resetTrainingHub();
    }
    refreshIcons();
}

window.resetTrainingHub = function() {
    const container = document.getElementById('training-hub-content');
    if(!container) return;

    container.innerHTML = `
<div class="space-y-4">
    <!-- Filters -->
    <div class="bg-blue-50/50 p-3 rounded-xl border border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
            <label class="block text-[10px] font-bold text-blue-900 mb-1">Location</label>
            <select onchange="setGlobalCountry(this.value); resetTrainingHub();" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="all" ${activeCountry === 'all' ? 'selected' : ''}>Regional</option>
                <option value="Kenya" ${activeCountry === 'Kenya' ? 'selected' : ''}>Kenya</option>
                <option value="Uganda" ${activeCountry === 'Uganda' ? 'selected' : ''}>Uganda</option>
                <option value="Tanzania" ${activeCountry === 'Tanzania' ? 'selected' : ''}>Tanzania</option>
                <option value="Rwanda" ${activeCountry === 'Rwanda' ? 'selected' : ''}>Rwanda</option>
                <option value="Burundi" ${activeCountry === 'Burundi' ? 'selected' : ''}>Burundi</option>
                <option value="South Sudan" ${activeCountry === 'South Sudan' ? 'selected' : ''}>South Sudan</option>
                <option value="DRC" ${activeCountry === 'DRC' ? 'selected' : ''}>DR Congo</option>
                <option value="Somalia" ${activeCountry === 'Somalia' ? 'selected' : ''}>Somalia</option>
            </select>
        </div>
        <div>
            <label class="block text-[10px] font-bold text-blue-900 mb-1">Sector</label>
            <select onchange="setGlobalSector(this.value); resetTrainingHub();" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="agri" ${activeSectorId === 'agri' ? 'selected' : ''}>Agritech</option>
                <option value="energy" ${activeSectorId === 'energy' ? 'selected' : ''}>Renewable Energy</option>
                <option value="digital" ${activeSectorId === 'digital' ? 'selected' : ''}>Digital Economy</option>
            </select>
        </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onclick="showTrainingHubView('find')" class="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-white hover:shadow-sm text-left transition-all group">
            <div class="p-2 bg-blue-100 text-blue-600 rounded-lg w-fit mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors"><i data-lucide="search" class="w-5 h-5"></i></div>
            <h4 class="font-bold text-slate-800 text-sm">Find Courses</h4>
            <p class="text-xs text-slate-500 mt-1">Search Database</p>
        </button>

        <button onclick="showTrainingRecommendations()" class="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-white hover:shadow-sm text-left transition-all group">
            <div class="p-2 bg-indigo-100 text-indigo-600 rounded-lg w-fit mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><i data-lucide="compass" class="w-5 h-5"></i></div>
            <h4 class="font-bold text-slate-800 text-sm">Career Roadmaps</h4>
            <p class="text-xs text-slate-500 mt-1">Role-based pathways</p>
        </button>

        <button onclick="showTrainingHubView('impact')" class="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-sky-300 hover:bg-white hover:shadow-sm text-left transition-all group">
            <div class="p-2 bg-sky-100 text-sky-600 rounded-lg w-fit mb-3 group-hover:bg-sky-600 group-hover:text-white transition-colors"><i data-lucide="bar-chart-2" class="w-5 h-5"></i></div>
            <h4 class="font-bold text-slate-800 text-sm">Impact Evidence</h4>
            <p class="text-xs text-slate-500 mt-1">Outcomes Data</p>
        </button>

        <button onclick="showTrainingHubView('finance')" class="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-400 hover:bg-white hover:shadow-sm text-left transition-all group">
            <div class="p-2 bg-slate-200 text-slate-600 rounded-lg w-fit mb-3 group-hover:bg-slate-600 group-hover:text-white transition-colors"><i data-lucide="banknote" class="w-5 h-5"></i></div>
            <h4 class="font-bold text-slate-800 text-sm">Financial Aid &amp; Scholarships</h4>
            <p class="text-xs text-slate-500 mt-1">Funding options</p>
        </button>
    </div>
</div>
    `;
    refreshIcons();
}

window.showTrainingHubView = function(view) {
    const container = document.getElementById('training-hub-content');
    let content = '';
    
    if (view === 'find') {
content = `
    <!-- Featured Course Banner -->
    <div class="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-xl p-4 text-white shadow-md relative overflow-hidden flex items-center justify-between group cursor-pointer mb-4" onclick="window.open('https://www.alxafrica.com/programmes/', '_blank')">
        <div class="relative z-10">
            <div class="flex items-center gap-2 mb-1">
                <span class="bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">New & Featured</span>
            </div>
            <h3 class="font-bold text-lg leading-tight mb-1">ALX AI Career Essentials</h3>
            <p class="text-xs text-slate-300 max-w-sm">Master AI tools to boost your productivity. 6 weeks, fully sponsored.</p>
        </div>
        <div class="relative z-10 bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
            <i data-lucide="arrow-right" class="w-5 h-5 text-white"></i>
        </div>
        <div class="absolute right-0 top-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
    </div>

    <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4 flex justify-between items-center shadow-sm">
        <div>
            <h3 class="font-bold text-indigo-900 text-sm">Not sure where to start?</h3>
            <p class="text-xs text-indigo-700">Explore curated quick-start paths.</p>
        </div>
        <button onclick="showTrainingRecommendations()" class="px-3 py-2 bg-white text-indigo-700 font-bold rounded-lg text-xs border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-1">
            <i data-lucide="compass" class="w-3 h-3"></i> Recommendations
        </button>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3"><i data-lucide="filter" class="w-4 h-4 text-indigo-500"></i> Filter Training</h3>
        <div class="space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label for="drawer-hub-language" class="block text-xs font-medium text-slate-600 mb-1">Language</label>
                    <select id="drawer-hub-language" onchange="renderTrainingHubCourses()" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="all">Language (All)</option>
                        <option value="Kiswahili">Kiswahili</option>
                        <option value="English">English</option>
                        <option value="French">French</option>
                    </select>
                </div>
                <div>
                    <label for="drawer-hub-mode-quick" class="block text-xs font-medium text-slate-600 mb-1">Learning Mode</label>
                    <select id="drawer-hub-mode-quick" onchange="renderTrainingHubCourses()" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="all">Any Mode</option>
                        <option value="online">Online</option>
                        <option value="in-person">In-Person</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="pt-2">
            <button onclick="toggleMoreFilters()" id="more-filters-btn" class="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <i data-lucide="plus-circle" class="w-3 h-3"></i> More Filters
            </button>
        </div>
        <div id="advanced-filters" class="hidden pt-4 mt-4 border-t border-slate-200 space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label for="drawer-hub-course-type" class="block text-xs font-medium text-slate-600 mb-1">Course Type</label>
                    <select id="drawer-hub-course-type" onchange="renderTrainingHubCourses()" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="all">Any Type</option>
                        <option value="certificate">Certificates</option>
                        <option value="micro-credential">Micro-credentials</option>
                        <option value="tvet">TVET courses</option>
                        <option value="university">University courses</option>
                        <option value="bootcamp">Bootcamps</option>
                        <option value="hubs">Hubs & Labs</option>
                    </select>
                </div>
                <div>
                    <label for="drawer-hub-budget" class="block text-xs font-medium text-slate-600 mb-1">Budget Band</label>
                    <select id="drawer-hub-budget" onchange="renderTrainingHubCourses()" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="all">Any Cost</option>
                        <option value="low">Low Cost / Free</option>
                        <option value="medium">Medium Cost</option>
                        <option value="high">High Cost</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
    <div id="training-hub-results" class="space-y-4"></div>
`;
    } else if (view === 'featured') {
content = `
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div class="p-4 border-b border-slate-200 bg-slate-50">
            <h3 class="font-bold text-slate-800 text-sm mb-2">Top Rated Providers</h3>
            <p class="text-xs text-slate-500">Providers with independently verified outcome data.</p>
        </div>
        <div id="training-hub-results" class="space-y-4 p-4"></div>
    </div>
`;
    } else if (view === 'impact') {
content = `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <div class="text-slate-500 text-[10px] uppercase font-bold mb-1">Graduates Tracked</div>
            <div class="text-xl font-bold text-slate-800">23,700+</div>
            <div class="text-[10px] text-slate-400">Source: ALX Africa (2024)</div>
        </div>
        <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <div class="text-slate-500 text-[10px] uppercase font-bold mb-1">Max Salary Uplift</div>
            <div class="text-xl font-bold text-blue-600">+140%</div>
            <div class="text-[10px] text-slate-400">Source: ALX Africa / Digital sector</div>
        </div>
    </div>
    <div class="space-y-4">
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 class="font-bold text-xs text-slate-700 mb-2">Salary Progression (Digital Sector)</h3>
            <div class="heavy-chart h-48 w-full relative">
                <canvas id="drawer-salaryChart"></canvas>
            </div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 class="font-bold text-xs text-slate-700 mb-2">Time to Full-Time Employment</h3>
            <div class="heavy-chart h-48 w-full relative flex justify-center">
                <canvas id="drawer-timeChart"></canvas>
            </div>
        </div>
    </div>
`;
    } else if (view === 'finance') {
content = `
    <div class="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-start gap-3">
        <div class="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0"><i data-lucide="banknote" class="w-5 h-5"></i></div>
        <div>
            <h3 class="font-bold text-indigo-900 text-sm">Scholarships & Loans</h3>
            <p class="text-xs text-indigo-700 mt-1">Find financial support for your education and skills training across East Africa.</p>
        </div>
    </div>
    <div class="flex flex-col sm:flex-row gap-2">
        <select id="finance-filter-type" onchange="renderFinancialAid()" class="flex-1 text-xs border border-slate-300 rounded-lg px-2 py-2 focus:ring-indigo-500">
            <option value="all">All Types</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Loan">Loan</option>
            <option value="Grant">Grant</option>
        </select>
    </div>
    <div id="financial-aid-list" class="space-y-3"></div>
`;
    }

    container.innerHTML = `
<div class="animate-fade-in space-y-4">
    <button onclick="resetTrainingHub()" class="mb-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>
    ${content}
</div>
    `;
    
    if (view === 'find') renderTrainingHubCourses();
    if (view === 'featured') {
// Reuse renderTrainingHubCourses but force high quality filter if possible, or just render all for now as per previous logic
renderTrainingHubCourses(); 
    }
    if (view === 'impact') initImpactCharts();
    if (view === 'finance') renderFinancialAid();
    
    refreshIcons();
}

window.showTrainingRecommendations = function(targetId = 'training-hub-content', backAction = "showTrainingHubView('find')") {
    const container = document.getElementById(targetId);
    if (!container) return;

    function getOccupationIcon(name) {
        var n = (name || '').toLowerCase();
        if (n.includes('engineer') || n.includes('developer') || n.includes('software') || n.includes('programmer') || n.includes('technician')) return 'code-2';
        if (n.includes('data') || n.includes('analyst') || n.includes('scientist') || n.includes('intelligence')) return 'bar-chart-2';
        if (n.includes('manager') || n.includes('director') || n.includes('lead') || n.includes('supervisor') || n.includes('officer')) return 'users';
        if (n.includes('designer') || n.includes('ux') || n.includes('creative') || n.includes('media')) return 'palette';
        if (n.includes('solar') || n.includes('energy') || n.includes('power') || n.includes('electrician') || n.includes('grid')) return 'zap';
        if (n.includes('agri') || n.includes('farm') || n.includes('crop') || n.includes('irrigation') || n.includes('soil') || n.includes('precision')) return 'leaf';
        if (n.includes('drone') || n.includes('uav') || n.includes('pilot')) return 'plane';
        if (n.includes('teach') || n.includes('train') || n.includes('educator') || n.includes('instructor')) return 'graduation-cap';
        if (n.includes('market') || n.includes('sales') || n.includes('growth') || n.includes('business develop')) return 'trending-up';
        if (n.includes('finance') || n.includes('account') || n.includes('financial') || n.includes('banking')) return 'banknote';
        if (n.includes('logistic') || n.includes('supply') || n.includes('chain') || n.includes('transport')) return 'truck';
        if (n.includes('health') || n.includes('medical') || n.includes('clinic')) return 'heart-pulse';
        return 'briefcase';
    }

    // 1. Get Occupations for current context (Sector & Country)
    let occupations = dataManager.getOccupations(activeSectorId, activeCountry);
    
    // Fallback if DataManager returns nothing
    if (!occupations || occupations.length === 0) {
const baseData = (typeof baseSectorDetailData !== 'undefined') ? baseSectorDetailData[activeSectorId] : null;
if (baseData && baseData.occupations) occupations = baseData.occupations;
    }

    // Ensure we have data and limit to top 10
    const topOccupations = (occupations || []).slice(0, 10);

    // 2. Generate Pathways dynamically
    const paths = topOccupations.map((occ, index) => {
const roleName = occ.name;

// Get Qualifications (Global Data)
const quals = (typeof roleQualifications !== 'undefined' && roleQualifications[roleName]) 
    ? roleQualifications[roleName] 
    : { education: "Relevant Degree or Diploma", certification: "Industry Standard Certification", experience: "Entry-level experience" };

// Get Skills (Global Data)
const skillsData = (typeof roleSkills !== 'undefined' && roleSkills[roleName]) 
    ? roleSkills[roleName] 
    : { technical: ["Core Technical Skills", "Industry Knowledge"] };

// Format Skills (Top 3)
const topSkills = skillsData.technical ? skillsData.technical.slice(0, 3).join(", ") : "Key Sector Skills";

// Determine Icon/Color
const colors = ['indigo', 'blue', 'sky', 'indigo', 'blue', 'sky'];
const color = colors[index % colors.length];

return {
    title: roleName,
    icon: getOccupationIcon(roleName),
    color: color,
    steps: [
        `<strong>Build Skills:</strong> Focus on ${topSkills}.`,
        `<strong>Education:</strong> ${quals.education}.`,
        `<strong>Credentialing:</strong> Obtain ${quals.certification}.`,
        `<strong>Experience:</strong> ${quals.experience}.`
    ]
};
    });

    // 3. Render
    const sectorName = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';
    const countryName = activeCountry === 'all' ? 'East Africa (Regional)' : activeCountry;
    const safeTarget = targetId;
    const safeBack = backAction.replace(/'/g, "\\'");

    const INITIAL_CAP = 6;
    const hasMore = paths.length > INITIAL_CAP;

    const pathsHtml = paths.map((p, idx) => {
        const hidden = idx >= INITIAL_CAP ? 'pathway-extra hidden' : '';
        return `
<div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-${p.color}-300 transition-colors ${hidden}">
    <div class="flex items-center gap-3 mb-3">
        <div class="p-2 bg-${p.color}-50 text-${p.color}-600 rounded-lg shrink-0"><i data-lucide="${p.icon}" class="w-5 h-5"></i></div>
        <h3 class="font-bold text-slate-800 text-sm">${p.title}</h3>
    </div>
    <div class="space-y-2">
        ${p.steps.map((step, i) => `
            <div class="flex items-start gap-2">
                <span class="shrink-0 w-4 h-4 rounded-full bg-${p.color}-100 text-${p.color}-700 text-[9px] font-bold flex items-center justify-center mt-0.5">${i+1}</span>
                <p class="text-xs text-slate-600 leading-snug">${step}</p>
            </div>
        `).join('')}
    </div>
    <div class="flex gap-2 mt-3 pt-2 border-t border-slate-100">
        <button onclick="openUnifiedHub('pp-diagnostic')" class="flex-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"><i data-lucide="clipboard-check" class="w-3 h-3"></i> Assess Readiness</button>
        <button onclick="openUnifiedHub('pp-courses')" class="flex-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"><i data-lucide="search" class="w-3 h-3"></i> Find Courses</button>
    </div>
</div>`;
    }).join('');

    const showMoreBtn = hasMore ? `
        <div class="text-center pt-2" id="pathway-show-more">
            <button onclick="document.querySelectorAll('.pathway-extra').forEach(el => el.classList.remove('hidden')); document.getElementById('pathway-show-more').classList.add('hidden');" class="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors">
                Show all ${paths.length} pathways
            </button>
        </div>` : '';

    // Only show back button if NOT in Unified Hub (pp-recommendations)
    const showBackBtn = !targetId.startsWith('pp-');
    const backBtnHtml = showBackBtn ? `<button onclick="${backAction}" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>` : '';

    container.innerHTML = `
<div class="animate-fade-in space-y-4">
    ${backBtnHtml}

    <div class="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
            <label class="block text-[10px] font-bold text-indigo-900 mb-1">Location</label>
            <select onchange="setGlobalCountry(this.value); showTrainingRecommendations('${safeTarget}', '${safeBack}');" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                <option value="all" ${activeCountry === 'all' ? 'selected' : ''}>Regional</option>
                <option value="Kenya" ${activeCountry === 'Kenya' ? 'selected' : ''}>Kenya</option>
                <option value="Uganda" ${activeCountry === 'Uganda' ? 'selected' : ''}>Uganda</option>
                <option value="Tanzania" ${activeCountry === 'Tanzania' ? 'selected' : ''}>Tanzania</option>
                <option value="Rwanda" ${activeCountry === 'Rwanda' ? 'selected' : ''}>Rwanda</option>
                <option value="Burundi" ${activeCountry === 'Burundi' ? 'selected' : ''}>Burundi</option>
                <option value="South Sudan" ${activeCountry === 'South Sudan' ? 'selected' : ''}>South Sudan</option>
                <option value="DRC" ${activeCountry === 'DRC' ? 'selected' : ''}>DR Congo</option>
                <option value="Somalia" ${activeCountry === 'Somalia' ? 'selected' : ''}>Somalia</option>
            </select>
        </div>
        <div>
            <label class="block text-[10px] font-bold text-indigo-900 mb-1">Sector</label>
            <select onchange="setGlobalSector(this.value); showTrainingRecommendations('${safeTarget}', '${safeBack}');" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                <option value="agri" ${activeSectorId === 'agri' ? 'selected' : ''}>Agritech</option>
                <option value="energy" ${activeSectorId === 'energy' ? 'selected' : ''}>Renewable Energy</option>
                <option value="digital" ${activeSectorId === 'digital' ? 'selected' : ''}>Digital Economy</option>
            </select>
        </div>
    </div>

    <div class="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
        <h2 class="text-base font-bold text-indigo-900 mb-1">Career Pathways: ${sectorName}</h2>
        <p class="text-xs text-indigo-700">Typical skills, education, and credentialing routes for top occupations in <strong>${countryName}</strong>.</p>
    </div>

    <div class="grid grid-cols-1 gap-3">
        ${paths.length > 0 ? pathsHtml + showMoreBtn : '<div class="text-center text-slate-500 italic py-8">No occupation pathways found for this selection.</div>'}
    </div>
</div>
    `;
    refreshIcons();
}

window.toggleCareerHub = function() {
    // Close Unified Hub if open
    closeAllModals('career-hub-drawer');

    // 2. Toggle this drawer
    const drawer = document.getElementById('career-hub-drawer');
    drawer.classList.toggle('translate-x-full');

    // 3. Run existing logic
    resetCareerHub(); 
}
window.openSkillModal = function(skillName) {
    closeModalOverlaysOnly('skill-modal');
    const modal = document.getElementById('skill-modal');
    const panel = document.getElementById('skill-modal-panel');
    const sectorName = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';
    
    const data = getMasterTrainingCatalogue(activeSectorId, activeCountry);
    currentSkillData = data;
    currentSkillName = skillName;

    // --- NEW: Narrative Lookup ---
    let narrativeText = "";
    const dynamicSkills = dataManager.getSkills(activeSectorId);
    const dynamicSkill = dynamicSkills ? dynamicSkills.find(s => s.name === skillName) : null;

    if (dynamicSkill && dynamicSkill.narrative) {
        narrativeText = dynamicSkill.narrative;
    } else {
        const sectorDetails = baseSectorDetailData[activeSectorId];
        const skillObj = sectorDetails.skills.find(s => s.name === skillName);
        narrativeText = skillObj ? skillObj.narrative : `The ability to apply ${skillName} effectively within the context of ${sectorName}. Mastery of this skill allows for improved operational efficiency and is highly sought after by employers in the region.`;
    }

    document.body.classList.add('overflow-hidden');
    document.getElementById('skill-modal-title').innerText = skillName;
    document.getElementById('skill-def').innerText = narrativeText;

    const levels = (typeof skillLevelDescriptions !== 'undefined' && skillLevelDescriptions[activeSectorId] && skillLevelDescriptions[activeSectorId][skillName])
        ? skillLevelDescriptions[activeSectorId][skillName]
        : {
            beg: "Basic tasks under supervision, such as tool identification or simple report generation.",
            int: "Can solve routine problems independently, manage small projects, and optimize basic workflow processes.",
            adv: "Expert in the domain. Capable of designing complex systems, leading teams, and mentoring intermediate staff."
        };

    document.getElementById('skill-lvl-beg').innerText = levels.beg;
    document.getElementById('skill-lvl-int').innerText = levels.int;
    document.getElementById('skill-lvl-adv').innerText = levels.adv;
    
    const roles = (typeof specificJobTitles !== 'undefined' && specificJobTitles[activeSectorId] && specificJobTitles[activeSectorId][skillName]) 
        ? specificJobTitles[activeSectorId][skillName] 
        : ["Specialist", "Analyst", "Technician", "Consultant"];

    // Split roles into primary and similar for display
    const primaryRoles = roles.slice(0, 2);
    const similarRoles = roles.slice(2);

    // --- NEW: Calculate Skill Synergies (Often Paired With) ---
    const synergies = {};
    if (typeof roleSkills !== 'undefined') {
        Object.values(roleSkills).forEach(role => {
            if (role.technical.includes(skillName)) {
                role.technical.forEach(s => {
                    if (s !== skillName) synergies[s] = (synergies[s] || 0) + 1;
                });
            }
        });
    }
    // Sort by frequency
    const sortedSynergies = Object.entries(synergies).sort((a, b) => b[1] - a[1]).slice(0, 4).map(e => e[0]);

    // Render Synergies Section
    if (sortedSynergies.length > 0) {
        document.getElementById('skill-synergies-section').classList.remove('hidden');
        document.getElementById('skill-synergies-list').innerHTML = sortedSynergies.map(s => `<button onclick="openSkillModal('${s}')" class="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-xs rounded hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm">${s}</button>`).join('');
    } else {
        document.getElementById('skill-synergies-section').classList.add('hidden');
    }

    document.getElementById('skill-roles-primary').innerHTML = primaryRoles.map(r => `<span class="px-2 py-1 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 text-xs font-medium">${r}</span>`).join('');
    document.getElementById('skill-roles-similar').innerHTML = similarRoles.map(r => `<span class="px-2 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200 text-xs">${r}</span>`).join('');
    
    let defaultHotspotText = `High demand in major economic hubs like <strong>Nairobi, Kigali, and Dar es Salaam</strong>, particularly within the growing ${activeSectorId === 'agri' ? 'Agribusiness' : activeSectorId === 'energy' ? 'Renewable Energy' : 'ICT'} sector.`;
    
    if (activeCountry !== 'all') {
         defaultHotspotText = `High demand in <strong>${activeCountry}</strong> and key regional hubs, particularly within the growing ${activeSectorId === 'agri' ? 'Agribusiness' : activeSectorId === 'energy' ? 'Renewable Energy' : 'ICT'} sector.`;
    }

    const hotspotText = (typeof skillHotspots !== 'undefined' && skillHotspots[activeSectorId] && skillHotspots[activeSectorId][skillName]) 
        ? skillHotspots[activeSectorId][skillName]
        : defaultHotspotText;

    // --- NEW: Cross-Sector Matrix Logic ---
    const matrix = (typeof crossSectorSkillMatrix !== 'undefined') ? crossSectorSkillMatrix[skillName] : null;
    let matrixHtml = '';
    
    if (matrix) {
        matrixHtml = `
            <div>
                <h3 class="font-bold text-slate-900 text-sm mb-2.5 uppercase tracking-wide flex items-center gap-2">
                    <i data-lucide="layers" class="w-4 h-4 text-slate-500"></i> Cross-Sector Application
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    <div class="p-2.5 sm:p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <div class="flex items-center gap-2 mb-1">
                            <i data-lucide="leaf" class="w-3 h-3 text-blue-600"></i>
                            <span class="text-[10px] font-bold text-blue-700 uppercase">Smart Agriculture</span>
                        </div>
                        <p class="text-xs text-slate-700 leading-snug">${matrix.agri}</p>
                    </div>
                    <div class="p-2.5 sm:p-3 bg-sky-50 border border-sky-100 rounded-lg">
                        <div class="flex items-center gap-2 mb-1">
                            <i data-lucide="zap" class="w-3 h-3 text-sky-600"></i>
                            <span class="text-[10px] font-bold text-sky-700 uppercase">Energy / Grid</span>
                        </div>
                        <p class="text-xs text-slate-700 leading-snug">${matrix.energy}</p>
                    </div>
                    <div class="p-2.5 sm:p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <div class="flex items-center gap-2 mb-1">
                            <i data-lucide="cpu" class="w-3 h-3 text-indigo-600"></i>
                            <span class="text-[10px] font-bold text-indigo-700 uppercase">Digital Economy</span>
                        </div>
                        <p class="text-xs text-slate-700 leading-snug">${matrix.digital}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Replace Challenge Content
    document.getElementById('skill-challenge-container').innerHTML = `
        ${matrixHtml}
        <div class="${matrixHtml ? 'mt-4 pt-4 border-t border-slate-100' : ''}">
            <div class="rounded-lg bg-sky-50 border border-sky-100 p-3 sm:p-4">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-6 h-6 rounded-md bg-sky-600 flex items-center justify-center shrink-0">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-white"></i>
                    </div>
                    <h3 class="text-xs font-bold text-sky-900 uppercase tracking-wide">National & Regional Hotspots</h3>
                </div>
                <p class="text-xs text-slate-700 leading-relaxed pl-8">${hotspotText}</p>
            </div>
        </div>
    `;
    // Remove assessment result hidden block as it was part of challenge
    document.getElementById('assessment-result').classList.add('hidden');

    // --- NEW: Inject Dynamic CTAs ---
    const ctaContainer = document.getElementById('skill-cta-container');
    if(ctaContainer) {
        ctaContainer.innerHTML = `
            <button onclick="openCoursesForSkill('${skillName.replace(/'/g, "\\'")}')" class="bg-white text-indigo-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm">
            Find Courses <i data-lucide="search" class="w-3 h-3"></i>
            </button>
        `;
    }

    modal.classList.remove('hidden');
    refreshIcons();
    setTimeout(() => { panel.classList.remove('scale-95', 'opacity-0'); panel.classList.add('scale-100', 'opacity-100'); }, 10);
}

window.openCoursesForSkill = function(skillName) {
    closeModal('skill-modal');
    
    // Open the view first
    openUnifiedHub('pp-courses', null, null);

    // Apply filters after view is ready
    setTimeout(() => {
        // 1. Reset other filters
        const container = document.getElementById('pp-courses');
        if (container) {
            const selects = container.querySelectorAll('select');
            selects.forEach(s => {
                if (s.id !== 'filter-skill') s.value = 'all';
            });
        }

        // 2. Try to select the skill in dropdown
        const skillSelect = document.getElementById('filter-skill');

        if (skillSelect) {
            // Normalize for comparison
            const target = skillName.toLowerCase();
            for (let i = 0; i < skillSelect.options.length; i++) {
                if (skillSelect.options[i].value.toLowerCase() === target) {
                    skillSelect.value = skillSelect.options[i].value;
                    break;
                }
            }
        }

        // 5. Render
        renderProviderTable();
    }, 150);
}

window.openResourceModal = function(category) {
    closeModalOverlaysOnly('resource-modal');

    const modal = document.getElementById('resource-modal');
    const panel = document.getElementById('resource-modal-panel');
    document.getElementById('resource-modal-title').innerText = category;
    document.body.classList.add('overflow-hidden');
    
    let content = '';
    const sectorName = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energies' : 'Digital Economies';
    
    const selectedResources = (typeof signalResources !== 'undefined' && signalResources[activeSectorId]) ? signalResources[activeSectorId][category] : null;

    if (selectedResources) {
         content = `
            <div class="space-y-3">
                <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 mb-2">
                    Showing verifiable ${category.toLowerCase()} sources for the <strong>${sectorName}</strong> sector.
                </div>
                ${selectedResources.map(r => `
                    <a href="${r.link}" target="_blank" class="block p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors group">
                        <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex justify-between items-center">
                            ${r.title} <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500"></i>
                        </div>
                        <div class="text-xs text-slate-500 mt-1">${r.desc}</div>
                    </a>
                `).join('')}
            </div>`;
    } else if (category.includes('Training')) {
        content = `
            <div class="space-y-3">
                <div class="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 cursor-pointer">
                    <div class="font-bold text-sm text-slate-800">Advanced ${sectorName} Management</div>
                    <div class="text-xs text-slate-500">Provider: Coursera Business &bull; Free</div>
                </div>
                <div class="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 cursor-pointer">
                    <div class="font-bold text-sm text-slate-800">Entrepreneurship 101</div>
                    <div class="text-xs text-slate-500">Provider: ALX Ventures &bull; 4 Weeks</div>
                </div>
            </div>`;
    } else if (category.includes('Incubator')) {
         content = `
            <div class="space-y-3">
                <div class="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 cursor-pointer">
                    <div class="font-bold text-sm text-slate-800">Nairobi Innovation Hub</div>
                    <div class="text-xs text-slate-500">Focus: Early Stage Tech &bull; Nairobi</div>
                </div>
                <div class="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 cursor-pointer">
                    <div class="font-bold text-sm text-slate-800">Norrsken House Kigali</div>
                    <div class="text-xs text-slate-500">Focus: Impact Startups &bull; Kigali</div>
                </div>
            </div>`;
    } else {
         content = `
            <div class="p-4 bg-slate-50 rounded text-sm text-slate-600">
                Detailed resources for <strong>${category}</strong> in the ${sectorName} sector are being curated. Check back soon for updated listings.
            </div>`;
    }
    
    document.getElementById('resource-modal-content').innerHTML = content;
    
    modal.classList.remove('hidden');
    setTimeout(() => { panel.classList.remove('scale-95', 'opacity-0'); panel.classList.add('scale-100', 'opacity-100'); }, 10);
    refreshIcons();
}

window.updateTrainingProviders = function() {
    if (typeof countryData === 'undefined') return;
    const data = countryData[activeCountry] || countryData['all'];
    const providers = data.providers || [];
    const container = document.getElementById('training-providers-list');
    const label = document.getElementById('training-country-label');
    
    if(label) label.innerText = activeCountry === 'all' ? 'Region' : activeCountry;
    
    if(container) {
        if (providers.length === 0) {
            container.innerHTML = `<div class="text-xs text-slate-500 italic p-2">No specific providers listed for ${activeCountry}.</div>`;
        } else {
            container.innerHTML = providers.map((p, i) => `
                <div class="p-3 border border-slate-200 rounded-lg flex items-center gap-3 bg-white hover:shadow-sm cursor-pointer">
                    <div class="w-10 h-10 bg-slate-100 text-slate-600 rounded flex items-center justify-center font-bold">${p.substring(0,2).toUpperCase()}</div>
                    <div class="flex-1">
                        <div class="text-sm font-bold text-slate-800">${p}</div>
                        <div class="text-xs text-slate-500">Top Rated in ${activeCountry === 'all' ? 'Region' : activeCountry}</div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// --- NEW: Toggle Grid Helper ---
window.toggleMobileMore = function(id, btn, moreCount) {
    const el = document.getElementById(id);
    if (!el) return;
    const isHidden = el.classList.contains('hidden');
    if (isHidden) {
        el.classList.remove('hidden');
        el.classList.add('grid');
        btn.innerHTML = `Show less <i data-lucide="chevron-up" class="w-3 h-3"></i>`;
    } else {
        el.classList.add('hidden');
        el.classList.remove('grid');
        btn.innerHTML = `Show ${moreCount} more <i data-lucide="chevron-down" class="w-3 h-3"></i>`;
    }
    refreshIcons();
}

window.toggleGrid = function(id, btn, label) {
    const el = document.getElementById(id);
    if (el) {
        const isExpanded = el.classList.contains('max-h-[2000px]');
        if (isExpanded) {
            el.classList.remove('max-h-[2000px]', 'opacity-100', 'mt-3');
            el.classList.add('max-h-0', 'opacity-0');
            btn.innerHTML = `View All ${label} <i data-lucide="chevron-down" class="w-3 h-3"></i>`;
        } else {
            el.classList.remove('max-h-0', 'opacity-0');
            el.classList.add('max-h-[2000px]', 'opacity-100', 'mt-3');
            btn.innerHTML = `View Less ${label} <i data-lucide="chevron-up" class="w-3 h-3"></i>`;
        }
        refreshIcons();
    }
}

function getSectorHubData() {
    const baseData = (typeof baseSectorDetailData !== 'undefined' && baseSectorDetailData[activeSectorId])
        ? baseSectorDetailData[activeSectorId]
        : (typeof baseSectorDetailData !== 'undefined' ? baseSectorDetailData['agri'] : null);
    if (!baseData) return null;

    const overrides = (typeof countryOverrides !== 'undefined' && countryOverrides[activeCountry] && countryOverrides[activeCountry][activeSectorId]) || {};
    const data = {
        growth: {
            jobTrend: overrides.jobTrend || baseData.growth.jobTrend,
            investment: overrides.investment || baseData.growth.investment,
            skillsDemand: overrides.skillsDemand || baseData.growth.skillsDemand,
            demandContext: overrides.demandContext || baseData.growth.demandContext
        },
        outlook: {
            hiring: overrides.hiring || baseData.outlook.hiring,
            hotspots: overrides.hotspots || baseData.outlook.hotspots,
            entrepreneurship: overrides.entrepreneurship || baseData.outlook.entrepreneurship,
            entrepreneurshipLevel: overrides.entrepreneurshipLevel || baseData.outlook.entrepreneurshipLevel,
            mobility: overrides.mobility || baseData.outlook.mobility,
            mobilityLevel: overrides.mobilityLevel || baseData.outlook.mobilityLevel,
            source: overrides.source || baseData.outlook.source,
            sourceUrl: overrides.sourceUrl || baseData.outlook.sourceUrl || null
        },
        occupations: dataManager.getOccupations(activeSectorId, activeCountry) || baseData.occupations,
        skills: dataManager.getSkills(activeSectorId) || baseData.skills
    };

    const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[activeSectorId] : { color: 'indigo' };
    const themeColor = themeConfig.color;

    let demandColorClass = "text-slate-900";
    let demandBgClass = "bg-slate-50 text-slate-600";
    if (data.growth.skillsDemand === 'Growing' || data.growth.skillsDemand === 'High' || data.growth.skillsDemand === 'Critical') {
        demandColorClass = "text-blue-600"; demandBgClass = "bg-blue-50 text-blue-600";
    } else if (data.growth.skillsDemand === 'Stable') {
        demandColorClass = "text-amber-600"; demandBgClass = "bg-amber-50 text-amber-600";
    } else if (data.growth.skillsDemand === 'Emerging') {
        demandColorClass = "text-indigo-600"; demandBgClass = "bg-indigo-50 text-indigo-600";
    }

    return {
        data, themeColor, demandColorClass, demandBgClass,
        cardTitleColor: `text-${themeColor}-800`,
        cardDescColor: `text-${themeColor}-700/80`,
        cardBgColor: "bg-white",
        cardBorderColor: `border-${themeColor}-200`,
        cardHoverBg: `hover:bg-${themeColor}-100`,
        cardHoverBorder: `hover:border-${themeColor}-300`,
    };
}

window.renderOccupationsView = function() {
    _sectorHubView = 'occupations';
    const d = getSectorHubData();
    if (!d) return;
    const { data, themeColor, demandColorClass, demandBgClass } = d;

    const container = document.getElementById('sector-hub-results');
    if (!container) return;

    const sectorName = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';
    const ventureCount = dataManager.getVentures(activeSectorId, activeCountry).length;

    container.innerHTML = `
        <div class="space-y-4 animate-fade-in">

            <!-- Sector identity label -->
            <div class="flex items-center gap-2 px-0.5">
                <div class="w-1 h-5 bg-${themeColor}-500 rounded-full"></div>
                <span class="text-xs font-bold text-${themeColor}-700 uppercase tracking-wide">${sectorName}</span>
                <span class="text-[11px] text-slate-400">· Labour Market Intelligence</span>
            </div>

            <!-- Sector Intelligence Stats -->
            <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <div class="p-1.5 bg-${themeColor}-50 text-${themeColor}-600 rounded-lg"><i data-lucide="briefcase" class="w-4 h-4"></i></div>
                            <h4 class="font-bold text-slate-600 text-xs uppercase tracking-wide">Growth Trends</h4>
                        </div>
                        ${data.outlook.sourceUrl
                            ? `<a href="${data.outlook.sourceUrl}" target="_blank" rel="noopener noreferrer" class="text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors">Src: ${data.outlook.source} ↗</a>`
                            : `<span class="text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Src: ${data.outlook.source}</span>`}
                    </div>
                    <div class="text-2xl font-bold text-slate-900">${data.growth.jobTrend}</div>
                    <div class="text-xs text-slate-500 mt-1">Overall Sector Growth</div>
                </div>

                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="p-1.5 bg-${themeColor}-50 text-${themeColor}-600 rounded-lg"><i data-lucide="trending-up" class="w-4 h-4"></i></div>
                        <h4 class="font-bold text-slate-600 text-xs uppercase tracking-wide">Investment Flow</h4>
                    </div>
                    <div class="text-2xl font-bold text-slate-900">${data.growth.investment}</div>
                    <div class="text-xs text-slate-500 mt-1">Money coming into the sector</div>
                </div>

                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="p-1.5 ${demandBgClass} rounded-lg"><i data-lucide="bar-chart-2" class="w-4 h-4"></i></div>
                        <h4 class="font-bold text-slate-600 text-xs uppercase tracking-wide">Hiring Demand</h4>
                    </div>
                    <div class="text-2xl font-bold ${demandColorClass}">${data.growth.skillsDemand}</div>
                    <div class="w-full bg-slate-100 rounded-full h-2 my-1">
                        <div class="h-2 rounded-full ${demandColorClass.replace('text', 'bg')}" style="width: ${data.growth.skillsDemand === 'Critical' ? '95%' : data.growth.skillsDemand === 'High' ? '80%' : '60%'}"></div>
                    </div>
                    <div class="text-xs text-slate-500">${data.growth.demandContext}</div>
                </div>

                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="p-1.5 bg-${themeColor}-50 text-${themeColor}-600 rounded-lg"><i data-lucide="map-pin" class="w-4 h-4"></i></div>
                        <h4 class="font-bold text-slate-600 text-xs uppercase tracking-wide">Top Locations</h4>
                    </div>
                    <div class="text-lg font-bold text-slate-900 leading-tight">${data.outlook.hotspots}</div>
                    <div class="text-xs text-slate-500 mt-1">Where the jobs are</div>
                </div>
            </div>

            <!-- Discovery Cards -->
            <button onclick="renderSectorOccupationsDetail()" class="p-4 bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-xl hover:shadow-md text-left transition-all group w-full flex items-center gap-4">
                <div class="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors"><i data-lucide="users" class="w-5 h-5"></i></div>
                <div class="flex-1">
                    <h3 class="font-bold text-slate-800 text-sm mb-0.5">Top Occupations &amp; Roles</h3>
                    <p class="text-xs text-slate-500">Salary data, career snapshots, and skills required for in-demand roles in <strong>${sectorName}</strong>.</p>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-blue-500"></i>
            </button>

            <button onclick="renderTopSkillsInBlock1()" class="p-4 bg-white border border-slate-200 border-l-4 border-l-indigo-500 rounded-xl hover:shadow-md text-left transition-all group w-full flex items-center gap-4">
                <div class="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><i data-lucide="trending-up" class="w-5 h-5"></i></div>
                <div class="flex-1">
                    <h3 class="font-bold text-slate-800 text-sm mb-0.5">Top Skills in Demand</h3>
                    <p class="text-xs text-slate-500">Definitions, proficiency levels, and linked roles for skills employers are seeking in <strong>${sectorName}</strong>.</p>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-indigo-500"></i>
            </button>

            <button onclick="renderEntrepreneurshipView()" class="p-4 bg-white border border-slate-200 border-l-4 border-l-sky-500 rounded-xl hover:shadow-md text-left transition-all group w-full flex items-center gap-4">
                <div class="p-2.5 bg-sky-50 text-sky-600 rounded-lg shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors"><i data-lucide="rocket" class="w-5 h-5"></i></div>
                <div class="flex-1">
                    <h3 class="font-bold text-slate-800 text-sm mb-0.5">Top Venture Opportunities</h3>
                    <p class="text-xs text-slate-500">Self-employment pathways and high-growth business ideas in <strong>${sectorName}</strong>.</p>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-sky-500"></i>
            </button>

            <!-- Data Sources — secondary, compact, placed last -->
            <button onclick="showMarketIntelView('sector', 'sector-hub-results', 'renderOccupationsView()')" class="w-full p-4 bg-white border border-slate-200 border-l-4 border-l-slate-300 rounded-xl hover:shadow-md text-left transition-all group flex items-center gap-4">
                <div class="p-2.5 bg-slate-100 text-slate-500 rounded-lg shrink-0 group-hover:bg-slate-500 group-hover:text-white transition-colors"><i data-lucide="line-chart" class="w-5 h-5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-sm font-bold text-slate-700">Data Sources</div>
                    <div class="text-xs text-slate-400">Sector reports, LMI &amp; gig/informal economy data</div>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-slate-500"></i>
            </button>

        </div>
    `;
    refreshIcons();
}

window.renderSectorOccupationsDetail = function() {
    _sectorHubView = 'occupations-detail';
    const d = getSectorHubData();
    if (!d) return;
    const { data, cardTitleColor, cardDescColor, cardBgColor, cardBorderColor, cardHoverBg, cardHoverBorder } = d;

    const container = document.getElementById('sector-hub-results');
    if (!container) return;

    const topOccs = data.occupations.slice(0, 10);

    const getLocalBadge = (roleCountry) => {
        if (activeCountry === 'all' || !roleCountry) return '';
        if (roleCountry === normalizeDRC(activeCountry)) {
            return `<span title="Specific to ${activeCountry}" class="shrink-0 ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-white border border-slate-200 text-slate-600 shadow-sm"><i data-lucide="map-pin" class="w-2.5 h-2.5 mr-0.5"></i> ${activeCountry}</span>`;
        }
        return '';
    };

    container.innerHTML = `
        <div class="space-y-4 animate-fade-in">
            <button onclick="renderOccupationsView()" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit">
                <i data-lucide="arrow-left" class="w-4 h-4"></i> Back
            </button>
            <div class="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
                <div class="mb-4">
                    <h3 class="text-base font-bold text-slate-800 flex items-center gap-2"><i data-lucide="users" class="w-4 h-4 text-blue-500"></i> Top Occupations &amp; Roles</h3>
                    <p class="text-xs text-slate-500 mt-1">Click any role to view salary data, career snapshots, typical skills and qualifications required, and similar roles.</p>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    ${topOccs.slice(0, 4).map(role => `
                        <button onclick="openOccupationModal('${role.name.replace(/'/g, "\\'")}')" title="${role.name}" class="px-3 py-2 ${cardBgColor} border ${cardBorderColor} rounded-lg text-left ${cardHoverBg} ${cardHoverBorder} transition-all group h-full flex flex-col justify-between">
                            <div class="w-full">
                                <div class="font-bold text-xs ${cardTitleColor} mb-0.5 flex items-center gap-1 min-w-0">
                                    <i data-lucide="briefcase" class="w-3 h-3 shrink-0 opacity-60"></i>
                                    <span class="truncate">${role.name}</span>
                                    ${getLocalBadge(role.country)}
                                    ${role.isHot ? '<span title="Critical Demand" class="shrink-0 ml-0.5">&#x1F525;</span>' : ''}
                                </div>
                                <div class="text-[10px] ${cardDescColor} leading-tight line-clamp-2">${role.desc}</div>
                            </div>
                        </button>
                    `).join('')}
                    ${topOccs.length > 4 ? `
                    <div id="more-occs" class="col-span-full grid grid-cols-2 gap-3 hidden sm:contents">
                        ${topOccs.slice(4).map(role => `
                            <button onclick="openOccupationModal('${role.name.replace(/'/g, "\\'")}')" title="${role.name}" class="px-3 py-2 ${cardBgColor} border ${cardBorderColor} rounded-lg text-left ${cardHoverBg} ${cardHoverBorder} transition-all group h-full flex flex-col justify-between">
                                <div class="w-full">
                                    <div class="font-bold text-xs ${cardTitleColor} mb-0.5 flex items-center gap-1 min-w-0">
                                        <i data-lucide="briefcase" class="w-3 h-3 shrink-0 opacity-60"></i>
                                        <span class="truncate">${role.name}</span>
                                        ${getLocalBadge(role.country)}
                                        ${role.isHot ? '<span title="Critical Demand" class="shrink-0 ml-0.5">&#x1F525;</span>' : ''}
                                    </div>
                                    <div class="text-[10px] ${cardDescColor} leading-tight line-clamp-2">${role.desc}</div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                    <button onclick="toggleMobileMore('more-occs', this, ${topOccs.length - 4})" class="col-span-full sm:hidden text-xs font-bold text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1">
                        Show ${topOccs.length - 4} more <i data-lucide="chevron-down" class="w-3 h-3"></i>
                    </button>` : ''}
                </div>
                <p class="text-[9px] text-slate-400 mt-3 pt-2 border-t border-slate-100 flex items-center gap-1">
                    <i data-lucide="info" class="w-2.5 h-2.5 shrink-0"></i> Wage and demand figures reflect formal sector employers posting online. Informal employment and self-employment are not captured.
                </p>
            </div>
        </div>
    `;
    refreshIcons();
}

window.renderEntrepreneurshipView = function() {
    _sectorHubView = 'entrepreneurship';
    const d = getSectorHubData();
    if (!d) return;
    const { themeColor, cardTitleColor, cardDescColor } = d;

    const container = document.getElementById('sector-hub-results');
    if (!container) return;

    const sectorName = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';

    const pathways = {
        agri: [
            { title: 'Smallholder Farming', desc: 'Grow food crops or raise livestock for local and regional markets. Entry cost is low; income scales with land access and market links.', icon: 'leaf' },
            { title: 'Agro-dealer & Input Trader', desc: 'Supply seeds, fertilisers and pesticides to local farmers. Requires product knowledge and a small trading capital.', icon: 'shopping-bag' },
            { title: 'Agricultural Market Trader', desc: 'Buy produce at farm gate and sell at town or city markets. Margins depend on transport access and negotiation skills.', icon: 'store' },
            { title: 'Contract Farm Services', desc: 'Offer land preparation, irrigation, pest control or harvest services to other farmers on a contract basis.', icon: 'wrench' },
        ],
        energy: [
            { title: 'Solar PV Installer (Independent)', desc: 'Install and maintain solar panels for homes and small businesses. Certification from KIRDI or KCSE improves client trust.', icon: 'zap' },
            { title: 'Off-grid Energy Agent', desc: 'Distribute and service pay-as-you-go solar kits for companies like M-KOPA, BBOXX or Sun King on a commission basis.', icon: 'sun' },
            { title: 'Biomass & Clean Cooking', desc: 'Produce or distribute improved cookstoves and biomass briquettes. Strong demand in peri-urban areas.', icon: 'flame' },
        ],
        digital: [
            { title: 'Freelance Developer / Designer', desc: 'Offer web, mobile app and graphic design services on platforms like Upwork, Fiverr or via direct clients.', icon: 'code-2' },
            { title: 'Mobile Money Agent', desc: 'Run an M-Pesa, Airtel Money or MTN MoMo outlet. Requires a float, a registered business and a network of regular customers.', icon: 'smartphone' },
            { title: 'Digital Content Creator', desc: 'Build an audience on YouTube, TikTok or Instagram and earn through ads, sponsorships or selling your own products.', icon: 'video' },
            { title: 'Online Commerce & Reselling', desc: 'Source goods and sell on Jumia, Jiji or WhatsApp Business. Lower barrier to entry than a physical shop.', icon: 'shopping-cart' },
        ]
    };

    const sectorPaths = pathways[activeSectorId] || pathways.digital;

    const ventures = dataManager.getVentures(activeSectorId, activeCountry)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 15);
    const topVentures = ventures.slice(0, 10);

    const ventureGrid = ventures.length > 0 ? `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            ${topVentures.slice(0, 4).map(v => `
                <button onclick="openVentureModal('${v.title.replace(/'/g, "\\'")}')" title="${v.title}" class="px-3 py-2 bg-white border border-${themeColor}-200 rounded-lg text-left hover:bg-${themeColor}-100 hover:border-${themeColor}-300 transition-all group h-full flex flex-col justify-between">
                    <div class="w-full">
                        <div class="font-bold text-xs ${cardTitleColor} mb-0.5 flex items-center gap-1 min-w-0">
                            <i data-lucide="store" class="w-3 h-3 shrink-0 opacity-60"></i>
                            <span class="truncate">${v.title}</span>
                            <span title="High Demand" class="ml-0.5 shrink-0">&#x1F525;</span>
                        </div>
                        <div class="text-[10px] ${cardDescColor} leading-tight line-clamp-2">${v.description}</div>
                    </div>
                </button>
            `).join('')}
            ${topVentures.length > 4 ? `
            <div id="more-ventures" class="col-span-full grid grid-cols-2 gap-3 hidden sm:contents">
                ${topVentures.slice(4).map(v => `
                    <button onclick="openVentureModal('${v.title.replace(/'/g, "\\'")}')" title="${v.title}" class="px-3 py-2 bg-white border border-${themeColor}-200 rounded-lg text-left hover:bg-${themeColor}-100 hover:border-${themeColor}-300 transition-all group h-full flex flex-col justify-between">
                        <div class="w-full">
                            <div class="font-bold text-xs ${cardTitleColor} mb-0.5 flex items-center gap-1 min-w-0">
                                <i data-lucide="store" class="w-3 h-3 shrink-0 opacity-60"></i>
                                <span class="truncate">${v.title}</span>
                                <span title="High Demand" class="ml-0.5 shrink-0">&#x1F525;</span>
                            </div>
                            <div class="text-[10px] ${cardDescColor} leading-tight line-clamp-2">${v.description}</div>
                        </div>
                    </button>
                `).join('')}
            </div>
            <button onclick="toggleMobileMore('more-ventures', this, ${topVentures.length - 4})" class="col-span-full sm:hidden text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-1 flex items-center gap-1">
                Show ${topVentures.length - 4} more <i data-lucide="chevron-down" class="w-3 h-3"></i>
            </button>` : ''}
        </div>` : `<p class="text-sm text-slate-400 italic">No venture data available for this region.</p>`;

    container.innerHTML = `
        <div class="space-y-3 animate-fade-in">
            <button onclick="renderOccupationsView()" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit">
                <i data-lucide="arrow-left" class="w-4 h-4"></i> Back
            </button>

            <!-- Context Banner -->
            <div class="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-start gap-3">
                <div class="p-2 bg-sky-100 text-sky-600 rounded-lg shrink-0"><i data-lucide="info" class="w-4 h-4"></i></div>
                <div>
                    <p class="text-sm font-bold text-sky-900 mb-1">Most East Africans work informally</p>
                    <p class="text-xs text-sky-800 leading-relaxed">Across the EAC, 70&ndash;90% of employment is informal — self-employment, micro-enterprise and gig work are the primary routes to income. The pathways and opportunities below cover both informal entry points and higher-growth ventures in <strong>${sectorName}</strong>.</p>
                </div>
            </div>

            <!-- Venture Opportunities -->
            <div class="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                <h4 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><i data-lucide="rocket" class="w-4 h-4 text-sky-500"></i> Top Venture Opportunities</h4>
                <p class="text-xs text-slate-500 mb-3">Click any opportunity for a detailed breakdown of skills, market context and getting started.</p>
                ${ventureGrid}
            </div>

        </div>
    `;
    refreshIcons();
}

// --- NEW: Toggle Cross-Sector Filter ---
window.toggleCrossSectorFilter = function() {
    showCrossSectorOnly = !showCrossSectorOnly;
    renderSkillsHubSkills();
}

window.toggleSavedFilter = function() {
    showSavedOnly = !showSavedOnly;
    renderSkillsHubSkills();
}

window.openCPDPathway = function() {
    pathwayState.entryPoint = 'cpd';
    openSkillsView('pp-practice', true, true);
    initPathwayWizard('Upskilling & Lifelong Learning', 'cpd');
    const headerTitle = document.getElementById('pp-header-title');
    if (headerTitle) {
        headerTitle.innerHTML = `<i data-lucide="refresh-cw" class="w-6 h-6 text-slate-600"></i> Upskilling &amp; Lifelong Learning`;
        refreshIcons();
    }
}

window.setCPDMode = function(isCPD) {
    pathwayState.cpdMode = isCPD;
    renderPathwayContent();
}

window.confirmRoleChange = function(newRole, selectEl) {
    var prevRole = selectEl.getAttribute('data-prev') || newRole;
    if (confirm('Changing role will reset your skill ratings. Continue?')) {
        selectEl.setAttribute('data-prev', newRole);
        renderPathwayContent(newRole);
    } else {
        selectEl.value = prevRole;
    }
}

window.togglePathwayContextEdit = function() {
    var panel = document.getElementById('pathway-context-edit-panel');
    if (panel) panel.classList.toggle('hidden');
    refreshIcons();
}

window.renderHRView = function() {
    var container = document.getElementById('pp-employer');
    if (!container) return;
    var sector = pathwayState.upskillingSector || activeSectorId;
    var sectorName = sector === 'agri' ? 'Agritech' : sector === 'energy' ? 'Renewable Energy' : 'Digital Economy';
    var selectedOcc = pathwayState.upskillingOccupation || null;
    var occSkillSet = (selectedOcc && typeof roleSkills !== 'undefined' && roleSkills[selectedOcc])
        ? roleSkills[selectedOcc].technical : null;
    var aiSectorContext = {
        agri: 'Key applications include precision farming, predictive crop disease alerts, AI-powered extension advisory, and supply chain optimisation.',
        energy: 'Key applications include predictive maintenance for solar and grid assets, AI-driven energy auditing, demand forecasting, and smart meter analytics.',
        digital: 'Key applications include AI-assisted development (GitHub Copilot), automated testing pipelines, intelligent data engineering, and LLM-powered product features.'
    };
    var occAuditBlock = occSkillSet ? `
            <div class="bg-sky-50 border border-sky-100 rounded-xl p-4">
                <h4 class="text-xs font-bold text-sky-900 mb-2 flex items-center gap-2"><i data-lucide="briefcase" class="w-3.5 h-3.5"></i> Skills to audit for: ${selectedOcc}</h4>
                <p class="text-[11px] text-sky-700 mb-3">Benchmark your team against these key technical skills for this role:</p>
                <div class="flex flex-wrap gap-1.5">
                    ${occSkillSet.map(s => `<span class="px-2 py-1 bg-white border border-sky-200 text-sky-700 rounded-lg text-[10px] font-bold">${s}</span>`).join('')}
                </div>
            </div>` : '';
    container.innerHTML = `
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-5 animate-fade-in">

            <!-- Heading + Subtitle -->
            <div>
                <h2 class="text-base font-bold text-slate-900 mb-0.5">Upskilling for Your Team or Cohort</h2>
                <p class="text-xs text-slate-500 leading-relaxed">A practical guide for higher-education career services advisors, team leaders, L&amp;D managers, and HR professionals in <strong>${sectorName}</strong>.</p>
            </div>

            ${occAuditBlock}

            <!-- Team Skills Audit -->
            <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h4 class="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2"><i data-lucide="clipboard-list" class="w-4 h-4"></i> How to Run a Team Skills Audit</h4>
                <div class="space-y-2">
                    <div class="flex items-start gap-3 bg-white rounded-lg p-2.5 border border-blue-100">
                        <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <div>
                            <div class="text-xs font-bold text-slate-800">Assess each team member</div>
                            <div class="text-[11px] text-slate-500 mt-0.5">Ask them to complete Assess Job Readiness for their current role.</div>
                        </div>
                    </div>
                    <div class="flex items-start gap-3 bg-white rounded-lg p-2.5 border border-blue-100">
                        <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <div>
                            <div class="text-xs font-bold text-slate-800">Map collective gaps</div>
                            <div class="text-[11px] text-slate-500 mt-0.5">Use Top Skills in Demand as a benchmark for the whole team.</div>
                        </div>
                    </div>
                    <div class="flex items-start gap-3 bg-white rounded-lg p-2.5 border border-blue-100">
                        <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <div>
                            <div class="text-xs font-bold text-slate-800">Find group training</div>
                            <div class="text-[11px] text-slate-500 mt-0.5">Use Find Courses — filter by In-Person or Bootcamp for cohort delivery.</div>
                        </div>
                    </div>
                    <div class="flex items-start gap-3 bg-white rounded-lg p-2.5 border border-blue-100">
                        <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                        <div>
                            <div class="text-xs font-bold text-slate-800">Track CPD progress</div>
                            <div class="text-[11px] text-slate-500 mt-0.5">Have each team member revisit their pathway after completing training.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AI Readiness -->
            <div>
                <h4 class="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <i data-lucide="sparkles" class="w-4 h-4 text-indigo-600"></i> AI Readiness for Your Workforce
                </h4>
                <p class="text-xs text-slate-500 mb-3">AI is reshaping workflows across ${sectorName}. ${aiSectorContext[sector] || ''} Equipping your team to use AI tools confidently &mdash; not just understand them &mdash; is now a core management responsibility. EAC governments have active national AI strategies (Kenya 2025–2030, Rwanda Smart Rwanda 2030, Uganda Digital Roadmap 2023–2028).</p>
                <div class="space-y-2">
                    <a href="https://grow.google/ai" target="_blank" class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 group transition-colors">
                        <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded shrink-0"><i data-lucide="graduation-cap" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700">Google AI Professional Certificate</div>
                            <div class="text-[10px] text-slate-500">AI fundamentals, prompting &amp; ethical use — free, no coding required</div>
                        </div>
                        <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
                    </a>
                    <a href="https://www.coursera.org/learn/ai-for-everyone" target="_blank" class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 group transition-colors">
                        <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded shrink-0"><i data-lucide="brain" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700">AI For Everyone — DeepLearning.AI</div>
                            <div class="text-[10px] text-slate-500">Organisational AI strategy for non-technical leaders — free audit on Coursera</div>
                        </div>
                        <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
                    </a>
                    <a href="https://www.elementsofai.com" target="_blank" class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 group transition-colors">
                        <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded shrink-0"><i data-lucide="cpu" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700">Elements of AI — University of Helsinki</div>
                            <div class="text-[10px] text-slate-500">What AI is and isn't — designed for managers &amp; non-developers, free certificate</div>
                        </div>
                        <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
                    </a>
                    <a href="https://zindi.africa" target="_blank" class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 group transition-colors">
                        <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded shrink-0"><i data-lucide="globe" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700">Zindi — African AI Challenges &amp; Learning</div>
                            <div class="text-[10px] text-slate-500">Africa-focused data science competitions &amp; AI upskilling, 73,000+ EAC learners</div>
                        </div>
                        <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
                    </a>
                </div>
            </div>

            <!-- Cyber Resilience -->
            <div>
                <h4 class="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <i data-lucide="shield" class="w-4 h-4 text-amber-600"></i> Cyber Resilience for Teams
                </h4>
                <p class="text-xs text-slate-500 mb-3">As organisations adopt AI tools and cloud services, cybersecurity literacy across all staff levels is essential &mdash; not just for IT. Phishing, social engineering, and data handling risks are the most common entry points.</p>
                <div class="space-y-2">
                    <a href="https://engage.isaca.org/kenyachapter/home" target="_blank" class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 group transition-colors">
                        <div class="p-1.5 bg-amber-100 text-amber-700 rounded shrink-0"><i data-lucide="award" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-slate-700 group-hover:text-amber-700">ISACA East Africa Chapters</div>
                            <div class="text-[10px] text-slate-500">CISA, CISM &amp; CRISC certification pathways — active chapters in KE, UG, TZ, RW</div>
                        </div>
                        <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 shrink-0"></i>
                    </a>
                    <a href="https://www.eccouncil.org" target="_blank" class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 group transition-colors">
                        <div class="p-1.5 bg-amber-100 text-amber-700 rounded shrink-0"><i data-lucide="lock" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-slate-700 group-hover:text-amber-700">EC-Council / CLC Kenya</div>
                            <div class="text-[10px] text-slate-500">CEH, CSCU &amp; CND certifications — accredited training centres in Nairobi</div>
                        </div>
                        <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 shrink-0"></i>
                    </a>
                    <a href="https://www.eset.com/us/cybertraining/" target="_blank" class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 group transition-colors">
                        <div class="p-1.5 bg-amber-100 text-amber-700 rounded shrink-0"><i data-lucide="shield-check" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-slate-700 group-hover:text-amber-700">ESET Cybersecurity Awareness Training</div>
                            <div class="text-[10px] text-slate-500">Free, accessible awareness modules — suitable for all staff levels</div>
                        </div>
                        <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 shrink-0"></i>
                    </a>
                </div>
            </div>

            <!-- CPD & Enterprise Training (condensed) -->
            <div>
                <h4 class="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2"><i data-lucide="building-2" class="w-4 h-4 text-slate-500"></i> CPD &amp; Enterprise Training</h4>
                <div class="space-y-2 text-xs text-slate-700">
                    <div class="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <i data-lucide="book-open" class="w-4 h-4 text-indigo-500 shrink-0 mt-0.5"></i>
                        <div><strong>TVET Credit &amp; CPD Recognition</strong> — Short courses and micro-credentials can count towards NITA (KE), UVQF (UG), or VETA (TZ) qualifications. Professional bodies (IEEE, CIPS, CPA East Africa) require documented CPD hours.</div>
                    </div>
                    <div class="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <i data-lucide="school" class="w-4 h-4 text-blue-600 shrink-0 mt-0.5"></i>
                        <div><strong>Coursera for Business / LinkedIn Learning</strong> — Subscription access with team progress tracking. Partner with a UNESCO-UNEVOC centre for subsidised in-house training.</div>
                    </div>
                    <div class="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <i data-lucide="briefcase" class="w-4 h-4 text-slate-500 shrink-0 mt-0.5"></i>
                        <div><strong>Apprenticeship Co-funding</strong> — Work with NITA-Uganda or TVET CDACC Kenya to co-fund structured work-based learning placements.</div>
                    </div>
                </div>
            </div>

            <!-- Action buttons -->
            <div class="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                <button onclick="openSkillsView('pp-diagnostic')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-colors">
                    <i data-lucide="clipboard-check" class="w-3.5 h-3.5"></i> Run Team Skills Audit
                </button>
                <button onclick="openSkillsView('pp-courses')" class="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-slate-200 transition-colors">
                    <i data-lucide="search" class="w-3.5 h-3.5"></i> Find Group Training
                </button>
            </div>
        </div>
    `;
    refreshIcons();
}

window.renderSelfEmploymentView = function() {
    const container = document.getElementById('pp-self-employment');
    if (!container) return;

    const sectorName = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';

    const pathways = {
        agri: [
            { title: 'Smallholder Farming', desc: 'Grow food crops or raise livestock for local and regional markets. Entry cost is low; income scales with land access and market links.', icon: 'leaf' },
            { title: 'Agro-dealer & Input Trader', desc: 'Supply seeds, fertilisers and pesticides to local farmers. Requires product knowledge and a small trading capital.', icon: 'shopping-bag' },
            { title: 'Agricultural Market Trader', desc: 'Buy produce at farm gate and sell at town or city markets. Margins depend on transport access and negotiation skills.', icon: 'store' },
            { title: 'Contract Farm Services', desc: 'Offer land preparation, irrigation, pest control or harvest services to other farmers on a contract basis.', icon: 'wrench' },
        ],
        energy: [
            { title: 'Solar PV Installer (Independent)', desc: 'Install and maintain solar panels for homes and small businesses. Certification from KIRDI or KCSE improves client trust.', icon: 'zap' },
            { title: 'Off-grid Energy Agent', desc: 'Distribute and service pay-as-you-go solar kits for companies like M-KOPA, BBOXX or Sun King on a commission basis.', icon: 'sun' },
            { title: 'Biomass & Clean Cooking', desc: 'Produce or distribute improved cookstoves and biomass briquettes. Strong demand in peri-urban areas.', icon: 'flame' },
        ],
        digital: [
            { title: 'Freelance Developer / Designer', desc: 'Offer web, mobile app and graphic design services on platforms like Upwork, Fiverr or via direct clients.', icon: 'code-2' },
            { title: 'Mobile Money Agent', desc: 'Run an M-Pesa, Airtel Money or MTN MoMo outlet. Requires a float, a registered business and a network of regular customers.', icon: 'smartphone' },
            { title: 'Digital Content Creator', desc: 'Build an audience on YouTube, TikTok or Instagram and earn through ads, sponsorships or selling your own products.', icon: 'video' },
            { title: 'Online Commerce & Reselling', desc: 'Source goods and sell on Jumia, Jiji or WhatsApp Business. Lower barrier to entry than a physical shop.', icon: 'shopping-cart' },
        ]
    };

    const sectorPaths = pathways[activeSectorId] || pathways.digital;

    container.innerHTML = `
        <div class="space-y-6 animate-fade-in">

            <!-- Context Banner -->
            <div class="bg-sky-50 border border-sky-100 rounded-xl p-4">
                <div class="flex items-start gap-3">
                    <div class="p-2 bg-sky-100 text-sky-600 rounded-lg shrink-0"><i data-lucide="info" class="w-4 h-4"></i></div>
                    <div>
                        <p class="text-sm font-bold text-sky-900 mb-1">Most East Africans work informally</p>
                        <p class="text-xs text-sky-800 leading-relaxed">Across the EAC, 70&ndash;90% of employment is in the informal economy. This section helps you explore self-employment and gig pathways in <strong>${sectorName}</strong> — and build the skills to succeed.</p>
                    </div>
                </div>
            </div>

            <!-- Common Pathways -->
            <div class="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                <h4 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><i data-lucide="map" class="w-4 h-4 text-sky-500"></i> Common Self-Employment Pathways in ${sectorName}</h4>
                <div class="space-y-3">
                    ${sectorPaths.map(p => `
                    <div class="flex items-start gap-3 p-3 bg-sky-50 border border-sky-100 rounded-lg">
                        <div class="p-1.5 bg-sky-100 text-sky-600 rounded-md shrink-0"><i data-lucide="${p.icon}" class="w-3.5 h-3.5"></i></div>
                        <div>
                            <div class="text-xs font-bold text-sky-900 mb-0.5">${p.title}</div>
                            <div class="text-[11px] text-sky-800 leading-snug">${p.desc}</div>
                        </div>
                    </div>`).join('')}
                </div>
            </div>

            <!-- Next Step -->
            <button onclick="openSkillsView('pp-launchpad')" class="w-full p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:border-indigo-300 hover:bg-white hover:shadow-md text-left transition-all group flex items-center gap-4">
                <div class="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><i data-lucide="rocket" class="w-5 h-5"></i></div>
                <div class="flex-1">
                    <div class="font-bold text-slate-800 text-sm group-hover:text-indigo-700">Build your venture skills</div>
                    <div class="text-xs text-slate-500 mt-0.5">Foundation skills, a First 30 Days game plan, and a full startup resource directory — in Start-Up Resources.</div>
                </div>
                <i data-lucide="arrow-right" class="w-4 h-4 text-indigo-300 group-hover:text-indigo-500 shrink-0"></i>
            </button>

        </div>
    `;
    refreshIcons();
}

// --- NEW: Venture Modal Logic ---
window.openVentureModal = function(title) {
    closeModalOverlaysOnly('venture-modal');
    const modal = document.getElementById('venture-modal');
    const panel = document.getElementById('venture-modal-panel');
    
    // Find data
    const venture = dataManager.ventures.find(v => v.title === title);
    if (!venture) return;

    document.body.classList.add('overflow-hidden');
    // Reset Favorite Button State
    const favBtn = document.getElementById('btn-venture-fav');
    if(favBtn) {
        const isFav = favoriteVentures.has(title);
        if (isFav) {
            favBtn.className = "flex items-center gap-2 text-blue-600 transition-colors text-xs font-bold";
            favBtn.innerHTML = `<i data-lucide="heart" class="w-4 h-4 fill-current"></i> <span>Saved</span>`;
        } else {
            favBtn.className = "flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-xs font-bold";
            favBtn.innerHTML = `<i data-lucide="heart" class="w-4 h-4"></i> <span>Save to Favorites</span>`;
        }
    }

    const modalTitle = document.getElementById('venture-modal-title');
    modalTitle.innerHTML = `${venture.title} ${venture.rank <= 3 ? '<span title="High Demand" class="ml-2">&#x1F525;</span>' : ''}`;

    // Determine Theme based on Sector
    const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[activeSectorId] : { color: 'indigo' };
    const theme = themeConfig.color;
    
    // Context Data (Local definition to ensure availability)
    const vContext = {
        agri: { location: "Rural / Peri-urban", customer: "Smallholder Farmers", drivers: ["Food Security", "Climate Resilience"], tools: "Smartphone, Sensors" },
        energy: { location: "Off-grid / Peri-urban", customer: "Households & SMEs", drivers: ["Energy Access", "Cost Savings"], tools: "Multimeter, GPS" },
        digital: { location: "Urban / Remote", customer: "B2B & B2C", drivers: ["Efficiency", "Market Access"], tools: "Laptop, Cloud" }
    };
    const ctx = vContext[activeSectorId] || vContext['digital'];
    
    // Entry Level Logic based on Capital
    let capitalLevel = venture.capital || "Medium";
    let techLevel = "Moderate";
    if (capitalLevel.includes('High')) techLevel = "High";

    // Update Badge
    const badge = document.getElementById('venture-modal-badge');
    badge.className = `text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-${theme}-100 text-${theme}-700`;
    badge.innerText = activeSectorId === 'agri' ? 'Agritech Venture' : activeSectorId === 'energy' ? 'Energy Venture' : 'Digital Venture';

    const skills = Array.isArray(venture.competencies) ? venture.competencies : (venture.competencies ? venture.competencies.split(',').map(s => s.trim()) : []);
    
    // Regulatory & Licensing Map
    const regulations = (typeof ventureRegulations !== 'undefined') ? (ventureRegulations[venture.title] || "Standard Business Permit (Local Authority)") : "Standard Business Permit";

    // Challenges Map
    const challenges = (typeof ventureChallenges !== 'undefined') ? (ventureChallenges[venture.title] || "Market competition; Customer acquisition costs.") : "Market competition.";

    // 1. At a Glance (Snapshot)
    const snapshotHtml = `
        <div>
            <h3 class="text-sm font-bold text-${theme}-800 uppercase tracking-wide mb-1 flex items-center gap-2">
                <i data-lucide="info" class="w-4 h-4"></i> Quick Look
            </h3>
            <p class="text-[10px] text-slate-400 italic mb-3 ml-6">Capital estimates are indicative and vary by location.</p>
            <div class="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div class="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4">
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Starting Cash</div>
                        <div class="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                            <i data-lucide="banknote" class="w-3.5 h-3.5"></i> ${capitalLevel}
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Where to Sell</div>
                        <div class="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                            <i data-lucide="globe" class="w-3.5 h-3.5"></i> ${ctx.location}
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Target Customer</div>
                        <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <i data-lucide="users" class="w-3.5 h-3.5 text-slate-500"></i> ${ctx.customer}
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Tech Level</div>
                        <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <i data-lucide="cpu" class="w-3.5 h-3.5 text-slate-500"></i> ${techLevel}
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Main Benefit</div>
                        <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <i data-lucide="trending-up" class="w-3.5 h-3.5 text-slate-500"></i> ${ctx.drivers[0] || 'Innovation'}
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Tools Required</div>
                        <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <i data-lucide="wrench" class="w-3.5 h-3.5 text-slate-500"></i> ${ctx.tools}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 2. Description
    const descHtml = `
        <section>
            <h3 class="text-sm font-bold text-${theme}-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">1</span> Opportunity Description
            </h3>
            <div class="text-slate-800 text-base leading-relaxed font-medium">
                ${venture.description}
            </div>
        </section>
    `;

    // 3. Competencies (Skills)
    const skillsListHtml = skills.map((s, i) => `
        <div class="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded text-xs text-slate-700 hover:border-${theme}-200 transition-colors w-full">
            <div class="w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm text-[10px] font-bold text-${theme}-600 border border-slate-100">${i+1}</div>
            <span class="font-bold text-slate-800">${s}</span>
        </div>
    `).join('');

    const competenciesHtml = `
        <section>
            <h3 class="text-sm font-bold text-${theme}-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">2</span> Skills You Need
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${skillsListHtml}
            </div>
        </section>
    `;

    // 4. Requirements & Regulations
    const reqsHtml = `
        <div class="mt-6 pt-6 border-t border-slate-100">
            <h3 class="text-xs font-bold text-${theme}-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">3</span> Rules & Requirements
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div class="flex items-center gap-2 mb-1"><i data-lucide="file-text" class="w-4 h-4 text-indigo-500"></i><span class="text-[10px] font-bold text-slate-500 uppercase">Licensing ${activeCountry !== 'all' ? `(${activeCountry})` : ''}</span></div>
                    <div class="text-xs text-slate-700 font-medium">${regulations}</div>
                </div>
                <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div class="flex items-center gap-2 mb-1"><i data-lucide="alert-triangle" class="w-4 h-4 text-amber-500"></i><span class="text-[10px] font-bold text-slate-500 uppercase">Key Challenge</span></div>
                    <div class="text-xs text-slate-700 font-medium">${challenges}</div>
                </div>
            </div>
        </div>
    `;

    // 5. CTA
    const ctaHtml = `
        <div class="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all mt-6" onclick="openVentureLaunchpad('${venture.title.replace(/'/g, "\\'")}');">
            <div class="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/10 transition-colors"></div>
            <div class="relative z-10 flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-lg mb-1 flex items-center gap-2">Pursue this Venture</h3>
                    <p class="text-xs text-slate-300 max-w-sm leading-relaxed mb-3">Build a personalized roadmap with funding sources, incubators, and registration guides.</p>
                    <button class="bg-white text-indigo-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm">
                        Go to Start-Up Resources <i data-lucide="arrow-right" class="w-3 h-3"></i>
                    </button>
                </div>
                <div class="hidden sm:block opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all">
                    <i data-lucide="rocket" class="w-16 h-16 text-white/20"></i>
                </div>
            </div>
        </div>
    `;

    const content = `
        <div class="space-y-6">
            ${snapshotHtml}
            ${descHtml}
            ${competenciesHtml}
            ${reqsHtml}
            ${ctaHtml}
        </div>
    `;

    document.getElementById('venture-modal-content').innerHTML = content;

    modal.classList.remove('hidden');
    refreshIcons();
    setTimeout(() => { panel.classList.remove('scale-95', 'opacity-0'); panel.classList.add('scale-100', 'opacity-100'); }, 10);
}

window.showNextSteps = function() {
    document.getElementById('assessment-result').classList.remove('hidden');
    refreshIcons();
}

// --- UPDATED: Careers Hub Data & Functions ---

const getSectorCareerResources = (sector) => {
    // Helper for ISO codes
    const iso = countryISOMap[activeCountry] || 'KEN';

    if (!dataManager.digitalResources) {
        console.warn("digital_resources.json not loaded. Using fallback data.");
        // This is a minimal fallback. The original hardcoded data was huge.
        return { mentors: [], lmi: [], communities: [], jobs: [], entrepreneurship: { incubators: [], funding: [], tools: [] } };
    }

    let sourceData = null;
    
    // Use standardized short keys directly
    if (dataManager.digitalResources[sector]) {
        sourceData = dataManager.digitalResources[sector];
    }

    // Deep clone to avoid mutating the cache
    let sectorData = sourceData ? JSON.parse(JSON.stringify(sourceData)) : {};

    // Safety: Ensure arrays exist to prevent crashes during injection or rendering
    sectorData.lmi = sectorData.lmi || [];
    sectorData.communities = sectorData.communities || [];
    sectorData.jobs = sectorData.jobs || [];
    sectorData.entrepreneurship = sectorData.entrepreneurship || { incubators: [], funding: [], tools: [] };
    if (!sectorData.entrepreneurship.incubators) sectorData.entrepreneurship.incubators = [];
    if (!sectorData.entrepreneurship.funding) sectorData.entrepreneurship.funding = [];
    if (!sectorData.entrepreneurship.tools) sectorData.entrepreneurship.tools = [];
    if (!sectorData.entrepreneurship.competitions) sectorData.entrepreneurship.competitions = [];
    if (!sectorData.entrepreneurship.research) sectorData.entrepreneurship.research = [];

    // Inject Country Specific Resources
    let resourceKey = normalizeDRC(activeCountry);

    // --- NEW: Merge General Country Resources (Cross-Cutting) ---
    // This pulls from resources_general.json via the root digitalResources object
    if (dataManager.digitalResources.country_resources && dataManager.digitalResources.country_resources[resourceKey]) {
        const genCr = dataManager.digitalResources.country_resources[resourceKey];
        if (genCr.policy) {
            sectorData.lmi.push(...genCr.policy.map(p => ({ name: p.title || p.name, desc: p.desc, link: p.link, type: 'National Policy' })));
            // NEW: Also map to tools for Launchpad (Market Access/Registration)
            sectorData.entrepreneurship.tools.push(...genCr.policy.map(p => ({ name: p.title || p.name, desc: p.desc, link: p.link, type: 'Public Service' })));
        }
        if (genCr.hubs) {
            genCr.hubs.forEach(h => {
                const text = ((h.title || h.name) + " " + h.desc).toLowerCase();
                if (text.includes('lab') || text.includes('research') || text.includes('innovation') || text.includes('science')) {
                     sectorData.entrepreneurship.research.push({ name: h.title || h.name, desc: h.desc, link: h.link });
                } else {
                     sectorData.entrepreneurship.incubators.push({ name: h.title || h.name, desc: h.desc, link: h.link });
                }
            });
        }
        if (genCr.jobs) {
            sectorData.jobs.push(...genCr.jobs.map(j => ({ title: j.title || j.name, company: j.desc, type: "National", link: j.link })));
        }
        if (genCr.communities) {
            sectorData.communities.push(...genCr.communities.map(c => ({ name: c.title || c.name, desc: c.desc, link: c.link, type: c.type || "General Community" })));
        }
        if (genCr.tools) {
            sectorData.entrepreneurship.tools.push(...genCr.tools.map(t => ({ name: t.title || t.name, desc: t.desc, link: t.link, icon: 'wrench' })));
        }
        if (genCr.mentorship) {
            sectorData.communities.push(...genCr.mentorship.map(m => ({ name: m.title || m.name, desc: m.desc, link: m.link, type: 'Mentorship' })));
        }
        if (genCr.events) {
            sectorData.communities.push(...genCr.events.map(e => ({ name: e.title || e.name, desc: e.desc, link: e.link, type: 'Event' })));
        }
        if (genCr.competitions) {
            sectorData.entrepreneurship.competitions.push(...genCr.competitions.map(c => ({ name: c.title || c.name, desc: c.desc, link: c.link })));
        }
        if (genCr.funding) {
            sectorData.entrepreneurship.funding.push(...genCr.funding.map(f => ({ name: f.title || f.name, desc: f.desc, link: f.link, type: 'National Funding' })));
        }
    }

    // Inject Sector Specific Country Resources
    if (sourceData && sourceData.country_resources && sourceData.country_resources[resourceKey]) {
        const cr = sourceData.country_resources[resourceKey];
        if (cr.policy) {
            sectorData.lmi.unshift(...cr.policy.map(p => ({ name: p.title || p.name, desc: p.desc, link: p.link, type: 'National Policy' })));
        }
        if (cr.hubs) {
            cr.hubs.forEach(h => {
                const text = ((h.title || h.name) + " " + h.desc).toLowerCase();
                if (text.includes('lab') || text.includes('research') || text.includes('innovation') || text.includes('science')) {
                     sectorData.entrepreneurship.research.unshift({ name: h.title || h.name, desc: h.desc, link: h.link });
                } else {
                     sectorData.entrepreneurship.incubators.unshift({ name: h.title || h.name, desc: h.desc, link: h.link });
                }
            });
        }
        if (cr.jobs) {
            sectorData.jobs.unshift(...cr.jobs.map(j => ({ title: j.title || j.name, company: j.desc, type: "National", link: j.link })));
        }
        if (cr.data) {
            sectorData.lmi.unshift(...cr.data.map(d => ({ name: d.title || d.name, desc: d.desc, link: d.link, type: 'National Data' })));
        }
        if (cr.education) {
            sectorData.lmi.unshift(...cr.education.map(e => ({ name: e.title || e.name, desc: e.desc, link: e.link, type: 'Accreditation' })));
        }
        if (cr.communities) {
            sectorData.communities.unshift(...cr.communities.map(c => ({ name: c.title || c.name, desc: c.desc, link: c.link, type: 'Local Community' })));
        }
        if (cr.tools) {
            sectorData.entrepreneurship.tools.unshift(...cr.tools.map(t => ({ name: t.title || t.name, desc: t.desc, link: t.link, icon: 'wrench' })));
        }
        if (cr.mentorship) {
            sectorData.communities.unshift(...cr.mentorship.map(m => ({ name: m.title || m.name, desc: m.desc, link: m.link, type: 'Mentorship' })));
        }
        if (cr.events) {
            sectorData.communities.unshift(...cr.events.map(e => ({ name: e.title || e.name, desc: e.desc, link: e.link, type: 'Event' })));
        }
        if (cr.competitions) {
            sectorData.entrepreneurship.competitions.unshift(...cr.competitions.map(c => ({ name: c.title || c.name, desc: c.desc, link: c.link })));
        }
    }
    
    // --- CONTEXTUAL ENRICHMENT ---
    // Inject relevant Regional Multipliers
    if (dataManager.digitalResources.regional_multipliers) {
        const regionalPolicy = dataManager.digitalResources.regional_multipliers.filter(r => r.type === 'Policy/Regulation');
        const regionalEcosystem = dataManager.digitalResources.regional_multipliers.filter(r => r.type === 'Ecosystem');
        const regionalFunding = dataManager.digitalResources.regional_multipliers.filter(r => r.type === 'Funding');
        const regionalSkills = dataManager.digitalResources.regional_multipliers.filter(r => r.type === 'Skills');
        
        sectorData.lmi.push(...regionalPolicy.map(p => ({ name: p.title || p.name, desc: p.desc, link: p.link, type: 'Regional Policy', gsa_member: p.gsa_member })));
        sectorData.communities.push(...regionalEcosystem.map(e => ({ name: e.title || e.name, desc: e.desc, type: "Regional Hub", link: e.link, gsa_member: e.gsa_member })));
        
        // Inject Funding & Skills
        sectorData.entrepreneurship.funding.push(...regionalFunding.map(f => ({ name: f.title || f.name, desc: f.desc, link: f.link, gsa_member: f.gsa_member })));
        sectorData.communities.push(...regionalSkills.map(s => ({ name: s.title || s.name, desc: s.desc, type: "Learning Community", link: s.link, gsa_member: s.gsa_member })));
    }

    // Inject relevant Global Resources
    if (dataManager.digitalResources.global_resources) {
        const globalFunding = dataManager.digitalResources.global_resources.filter(r => r.type === 'Funding');
        const globalJobs = dataManager.digitalResources.global_resources.filter(r => r.type === 'Jobs');
        const globalData = dataManager.digitalResources.global_resources.filter(r => r.type === 'Data/Research');
        const globalEcosystem = dataManager.digitalResources.global_resources.filter(r => r.type === 'Ecosystem');
        const globalCommunities = dataManager.digitalResources.global_resources.filter(r => r.type === 'Community');
        const globalPolicy = dataManager.digitalResources.global_resources.filter(r => r.type === 'Policy/Regulation');

        sectorData.entrepreneurship.funding.push(...globalFunding.map(f => ({ name: f.title || f.name, desc: f.desc, link: f.link, gsa_member: f.gsa_member })));
        sectorData.jobs.push(...globalJobs.map(j => ({ title: j.title || j.name, company: j.desc, type: "Global", link: j.link, gsa_member: j.gsa_member })));
        sectorData.lmi.push(...globalData.map(d => ({ name: d.title || d.name, desc: d.desc, link: d.link, type: 'Global Data', gsa_member: d.gsa_member })));
        sectorData.communities.push(...globalEcosystem.map(m => ({ 
            name: m.title || m.name, 
            desc: m.desc, 
            type: ((m.title || m.name).includes('Mentor') || (m.title || m.name).includes('ADPList')) ? "Mentorship" : "Global Ecosystem", 
            link: m.link, 
            gsa_member: m.gsa_member 
        })));
        
        // Inject Global Communities & Policy
        sectorData.communities.push(...globalCommunities.map(c => ({ name: c.title || c.name, desc: c.desc, type: "Global Community", link: c.link, gsa_member: c.gsa_member })));
        sectorData.lmi.push(...globalPolicy.map(p => ({ name: p.title || p.name, desc: p.desc, link: p.link, type: 'Global Policy', gsa_member: p.gsa_member })));
    }

    // --- NEW: Inject National Mentorships ---
    const nationalMentorships = {
        'Kenya': [{ title: "KamiLimu", desc: "Structured mentorship for CS students.", link: "https://kamilimu.org/", type: "Mentorship" }],
        'Rwanda': [{ title: "Girls in ICT Rwanda", desc: "Mentorship and networking.", link: "https://girlsinict.rw/", type: "Mentorship" }],
        'Uganda': [{ title: "Women in Technology Uganda", desc: "Networking and mentorship.", link: "https://witu.org/", type: "Mentorship" }],
        'Tanzania': [{ title: "Buni Innovation Hub", desc: "Tanzania's leading tech innovation hub with youth programmes.", link: "https://bunihub.or.tz/", type: "Mentorship" }]
    };

    if (nationalMentorships[activeCountry]) {
        nationalMentorships[activeCountry].forEach(m => {
            if (!sectorData.communities.some(c => c.name === m.title)) {
                sectorData.communities.push({ name: m.title, desc: m.desc, link: m.link, type: "Mentorship" });
            }
        });
    }

    // --- NEW: Heuristic Scan for Launchpad Resources (Dynamic) ---
    // Ensure any relevant resource (startup, funding, etc.) from regional/global lists is surfaced in Launchpad
    if (dataManager.digitalResources) {
        const categorizeEnt = (item) => {
            const text = ((item.title || item.name || "") + " " + (item.desc || "") + " " + (item.type || "")).toLowerCase();
            if (text.includes('research') || text.includes('satreps') || text.includes('africa-ai-japan') || text.includes('innovation lab') || text.includes('living lab') || text.includes('science')) return 'research';
            if (text.includes('fund') || text.includes('invest') || text.includes('grant') || text.includes('capital') || text.includes('equity') || text.includes('venture capital')) return 'funding';
            if (text.includes('incubator') || text.includes('accelerator') || text.includes('startup') || text.includes('venture builder') || text.includes('entrepreneurship center') || text.includes('hub')) return 'incubators';
            if (text.includes('competition') || text.includes('challenge') || text.includes('prize') || text.includes('hackathon') || text.includes('award')) return 'competitions';
            return null;
        };

        const injectIfNew = (list, item, typeLabel) => {
            if (!list.some(x => x.name === (item.title || item.name))) {
                list.push({ name: item.title || item.name, desc: item.desc, link: item.link, type: item.type || typeLabel, gsa_member: item.gsa_member, deadline: item.deadline });
            }
        };

        const scanLists = [
            dataManager.digitalResources.regional_multipliers,
            dataManager.digitalResources.global_resources
        ];

        scanLists.forEach(list => {
            if (list) {
                list.forEach(item => {
                    const cat = categorizeEnt(item);
                    if (cat) injectIfNew(sectorData.entrepreneurship[cat], item, 'Global/Regional');
                });
            }
        });
    }

    // --- NEW: Inject Gig/Informal LMI (Static for Prototype) ---
    const gigLmi = [
        { name: "Platform Livelihoods (Caribou Digital)", desc: "Research on how digital platforms are shaping work in East Africa.", link: "https://www.cariboudigital.net/platform-livelihoods", type: "Gig Economy" },
        { name: "ILO: Informal Economy in Africa", desc: "Statistics and policy analysis on the informal sector.", link: "https://www.ilo.org/topics/informal-economy", type: "Informal Sector" },
        { name: "Mastercard Fdn: Youth Employment", desc: "Insights on youth transitions into gig and informal work.", link: "https://mastercardfdn.org/all/research/", type: "Gig Economy" }
    ];
    sectorData.lmi.push(...gigLmi);

    // --- NEW: Merge Static Data from data.js (Safety Net) ---
    // This ensures the Careers Hub is populated even if digital_resources.json is sparse/missing
    if (typeof sectorPathwayResources !== 'undefined' && sectorPathwayResources[sector]) {
        sectorPathwayResources[sector].forEach(res => {
            const lowerTitle = res.title.toLowerCase();
            const lowerDesc = res.desc.toLowerCase();
            
            // Heuristic categorization
            if (lowerTitle.includes('job') || lowerDesc.includes('vacancies') || lowerTitle.includes('career')) {
                if (!sectorData.jobs.some(j => j.title === res.title)) {
                    sectorData.jobs.push({ title: res.title, company: "Sector Resource", link: res.link, type: "Platform" });
                }
            } else if (lowerTitle.includes('fund') || lowerTitle.includes('invest') || lowerTitle.includes('grant') || lowerTitle.includes('capital') || lowerDesc.includes('loan') || lowerDesc.includes('finance')) {
                if (!sectorData.entrepreneurship.funding.some(f => f.name === res.title)) {
                    sectorData.entrepreneurship.funding.push({ name: res.title, desc: res.desc, link: res.link });
                }
            } else if (lowerTitle.includes('incubator') || lowerTitle.includes('accelerator') || lowerTitle.includes('hub') || lowerTitle.includes('lab') || lowerDesc.includes('startup') || lowerDesc.includes('venture')) {
                if (!sectorData.entrepreneurship.incubators.some(i => i.name === res.title)) {
                    sectorData.entrepreneurship.incubators.push({ name: res.title, desc: res.desc, link: res.link });
                }
            } else if (lowerTitle.includes('research') || lowerDesc.includes('research') || lowerTitle.includes('innovation') || lowerDesc.includes('innovation')) {
                if (!sectorData.entrepreneurship.research.some(r => r.name === res.title)) {
                    sectorData.entrepreneurship.research.push({ name: res.title, desc: res.desc, link: res.link });
                }
            } else if (!lowerTitle.includes('academy') && !lowerTitle.includes('learning') && !lowerDesc.includes('training')) {
                // Default to Community/Ecosystem (excluding pure training which belongs in Training Hub)
                if (!sectorData.communities.some(c => c.name === res.title)) {
                    // Check if it's LMI
                    if(lowerDesc.includes('data') || lowerDesc.includes('report') || lowerDesc.includes('insight')) {
                        sectorData.lmi.push({ name: res.title, desc: res.desc, link: res.link, type: "Sector Data" });
                    } else {
                        sectorData.communities.push({ name: res.title, desc: res.desc, link: res.link, type: "Ecosystem" });
                    }
                }
            }
        });
    }

    return sectorData;
};

window.showMentorsAlumniInHub = function() {
    const container = document.getElementById('career-hub-content');
    const sector = activeSectorId;
    const country = activeCountry;
    const sectorName = sector === 'agri' ? 'Agritech' : sector === 'energy' ? 'Renewable Energy' : 'Digital Economy';

    // --- Section 1: Find a Mentor (live platforms) ---

    // --- Section 2: Mentorship programmes ---
    const sectorMentorPrograms = {
        agri: [
            { title: 'AWARD Mentorship Programme', desc: 'Formal mentoring for women in agricultural research and development across sub-Saharan Africa.', link: 'https://awardfellowships.org/', icon: 'leaf' },
            { title: 'CGIAR Gender Research Programme', desc: 'Connects young researchers with senior scientists for collaborative research mentorship.', link: 'https://gender.cgiar.org/', icon: 'users' }
        ],
        energy: [
            { title: 'GOGLA Mentors Network', desc: 'Mentoring within the off-grid solar and energy access industry community.', link: 'https://www.gogla.org/', icon: 'zap' },
            { title: 'IRENA Young Professionals Programme', desc: 'Career development and mentoring for young renewable energy professionals globally.', link: 'https://www.irena.org/', icon: 'sun' }
        ],
        digital: [
            { title: 'Akirachix Mentorship', desc: 'Structured mentoring connecting women in tech students with industry professionals across Africa.', link: 'https://akirachix.com/', icon: 'code-2' },
            { title: 'iHub Community Mentoring', desc: 'Kenya\'s leading tech hub — peer mentoring, workshops and connections to the startup ecosystem.', link: 'https://ihub.co.ke/', icon: 'cpu' }
        ]
    };
    const nationalPrograms = (sector === 'digital' && typeof nationalMentorships !== 'undefined' && nationalMentorships[country])
        ? nationalMentorships[country] : [];
    const crossSectorPrograms = [
        { title: 'ADPList', desc: 'Book free 1:1 mentoring sessions with verified professionals across industries worldwide.', link: 'https://adplist.org/', icon: 'user-check' },
        { title: 'MicroMentor', desc: 'Free business mentoring connecting entrepreneurs and early-career professionals with experienced volunteers.', link: 'https://www.micromentor.org/', icon: 'handshake' }
    ];
    const allPrograms = [...(sectorMentorPrograms[sector] || []), ...nationalPrograms, ...crossSectorPrograms];

    const programsHtml = allPrograms.map(p => `
        <a href="${p.link}" target="_blank" class="flex items-center gap-3 p-3 border border-blue-100 rounded-lg hover:border-blue-300 bg-white group transition-all">
            <div class="p-2 bg-blue-50 text-blue-600 rounded shrink-0"><i data-lucide="${p.icon || 'star'}" class="w-4 h-4"></i></div>
            <div class="flex-1 min-w-0">
                <div class="font-bold text-sm text-slate-800 group-hover:text-blue-700">${p.title}</div>
                <div class="text-xs text-slate-500">${p.desc}</div>
            </div>
            <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-blue-400 shrink-0 ml-auto"></i>
        </a>
    `).join('');

    // --- Section 3: Alumni & professional networks ---
    const alumniNetworks = {
        agri: [
            { title: 'CGIAR Alumni Network', desc: 'Global community of agricultural researchers — job boards, events and cross-border collaboration.', link: 'https://www.cgiar.org/', icon: 'graduation-cap' },
            { title: 'AWAK — Women in Agriculture Kenya', desc: 'Association of women professionals in Kenyan agriculture — peer support, advocacy and events.', link: 'https://awak.co.ke/', icon: 'users' },
            { title: 'YPARD', desc: 'Young Professionals for Agricultural Development — global network with active EAC regional chapters.', link: 'https://ypard.net/', icon: 'globe' }
        ],
        energy: [
            { title: 'WIRE — Women in Renewable Energy', desc: 'Pan-African professional network for women across the clean energy sector.', link: 'https://wire-africa.org/', icon: 'zap' },
            { title: 'IEEE Power & Energy Society', desc: 'Global technical community for power engineering professionals — active EAC chapters.', link: 'https://www.ieee-pes.org/', icon: 'cpu' },
            { title: 'AFSIA Members Network', desc: 'Africa Solar Industry Association — industry professionals, job opportunities and events.', link: 'http://www.afsiasolar.com/', icon: 'sun' }
        ],
        digital: [
            { title: 'ALX Fellowship Network', desc: '50,000+ African tech professionals — active alumni community with peer referrals and job postings.', link: 'https://www.alxafrica.com/', icon: 'graduation-cap' },
            { title: 'Google Developer Groups', desc: 'Local chapters across EAC cities — meetups, workshops and peer mentoring from senior developers.', link: 'https://developers.google.com/community/gdg', icon: 'code-2' },
            { title: 'Women in Tech Africa', desc: 'Pan-African network supporting women in technology — mentorship, training and career connections.', link: 'https://www.womenintechafrica.com/', icon: 'users' }
        ]
    };

    const alumniHtml = (alumniNetworks[sector] || alumniNetworks.digital).map(a => `
        <a href="${a.link}" target="_blank" class="flex items-center gap-3 p-3 border border-sky-100 rounded-lg hover:border-sky-300 bg-white group transition-all">
            <div class="p-2 bg-sky-50 text-sky-600 rounded shrink-0"><i data-lucide="${a.icon}" class="w-4 h-4"></i></div>
            <div class="flex-1 min-w-0">
                <div class="font-bold text-sm text-slate-800 group-hover:text-sky-700">${a.title}</div>
                <div class="text-xs text-slate-500">${a.desc}</div>
            </div>
            <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-sky-400 shrink-0 ml-auto"></i>
        </a>
    `).join('');

    container.innerHTML = `
        <div class="animate-fade-in space-y-6">
            <button onclick="resetCareerHub()" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>

            <div>
                <h3 class="font-bold text-lg text-slate-900 mb-1 flex items-center gap-2"><i data-lucide="user-check" class="w-5 h-5 text-indigo-600"></i> Mentors &amp; Alumni</h3>
                <p class="text-xs text-slate-500">Connect with mentors, structured programmes and alumni networks in <strong>${sectorName}</strong>.</p>
            </div>

            <!-- Find a Mentor -->
            <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Find a Mentor</div>
                <p class="text-xs text-slate-500 mb-3">Book a free 1:1 session with a verified professional in your field.</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a href="https://adplist.org/" target="_blank" class="flex items-center gap-3 p-3 bg-white border border-indigo-100 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group">
                        <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0"><i data-lucide="user-check" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700">ADPList</div>
                            <div class="text-xs text-slate-500">Free 1:1 sessions with global tech &amp; business mentors.</div>
                        </div>
                        <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-400 shrink-0"></i>
                    </a>
                    <a href="https://www.micromentor.org/" target="_blank" class="flex items-center gap-3 p-3 bg-white border border-indigo-100 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group">
                        <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0"><i data-lucide="handshake" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700">MicroMentor</div>
                            <div class="text-xs text-slate-500">Free business mentoring for entrepreneurs &amp; early-career professionals.</div>
                        </div>
                        <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-400 shrink-0"></i>
                    </a>
                </div>
            </div>

            <!-- Mentorship Programmes -->
            <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Mentorship Programmes</div>
                <p class="text-xs text-slate-500 mb-3">Structured and open programmes to match you with an experienced guide.</p>
                <div class="space-y-2">${programsHtml}</div>
            </div>

            <!-- Alumni & Professional Networks -->
            <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Alumni &amp; Professional Networks</div>
                <p class="text-xs text-slate-500 mb-3">Join established communities for peer support, job referrals and sector events.</p>
                <div class="space-y-2">${alumniHtml}</div>
            </div>

            <!-- How to reach out -->
            <div class="flex items-start gap-2.5 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                <i data-lucide="lightbulb" class="w-4 h-4 text-indigo-500 shrink-0 mt-0.5"></i>
                <p class="text-xs text-indigo-800 leading-snug"><strong>How to reach out:</strong> Keep your first message short &mdash; introduce yourself, mention one specific thing you admire about their work, and ask one clear question. Don't ask for a job; ask for a 20-minute conversation.</p>
            </div>
        </div>
    `;
    refreshIcons();
}

window.showCommunitiesView = function(activeFilter, containerId) {
    activeFilter = activeFilter || 'all';
    containerId = containerId || 'community-hub-content';
    const sectorData = getSectorCareerResources(activeSectorId);
    const container = document.getElementById(containerId);
    
    // 1. Consolidate Data & Deduplicate
    const uniqueItems = new Map();
    
    // Helper to add unique items
    const addUnique = (items) => {
        items.forEach(item => {
            if (item && item.name && !uniqueItems.has(item.name)) {
                uniqueItems.set(item.name, item);
            }
        });
    };

    addUnique(sectorData.communities || []);

    // Add Alumni (Static Data)
    const alumniData = {
        agri: [
            { name: "CGIAR Alumni Network", link: "https://www.cgiar.org/", type: "Alumni", desc: "Global network of agricultural researchers." },
            { name: "AWAK (Women in Ag)", link: "https://awak.co.ke/", type: "Community", desc: "Association of Women in Agriculture Kenya." },
            { name: "YPARD", link: "https://ypard.net/", type: "Community", desc: "Young Professionals for Agricultural Development." }
        ],
        energy: [
            { name: "WIRE (Women in Renewable Energy)", link: "https://wire-africa.org/", type: "Community", desc: "Network for women in the energy sector." },
            { name: "AFSIA Members", link: "http://www.afsiasolar.com/", type: "Community", desc: "Solar industry association members." },
            { name: "IEEE PES", link: "https://www.ieee-pes.org/", type: "Community", desc: "Power & Energy Society professionals." }
        ],
        digital: [
            { name: "ALX Fellowship", link: "https://www.alxafrica.com/", type: "Alumni", desc: "Community of ALX graduates." },
            { name: "Google Developer Groups", link: "https://developers.google.com/community/gdg", type: "Community", desc: "Local groups of developers interested in Google's developer technology." },
            { name: "Women in Tech Africa", link: "https://www.womenintechafrica.com/", type: "Community", desc: "Supporting women in technology across Africa." }
        ]
    };
    const sectorAlumni = alumniData[activeSectorId] || alumniData.digital;
    addUnique(sectorAlumni);

    // Add Sector Events
    const events = [
        { name: "Africa Tech Summit", desc: "Nairobi &bull; Feb 2027", type: "Event", link: "https://www.africatechsummit.com/", sector: 'digital' },
        { name: "Sankalp Africa Summit", desc: "Nairobi &bull; Feb 2027", type: "Event", link: "https://sankalpforum.com/", sector: 'agri' },
        { name: "Solar Africa Expo", desc: "Nairobi &bull; May 2027", type: "Event", link: "https://www.africaenergyindaba.com/", sector: 'energy' }
    ].filter(e => e.sector === activeSectorId);
    addUnique(events);

    let allItems = Array.from(uniqueItems.values());

    // 2. Categorization Logic
    const getCategory = (item) => {
        const t = (item.type || '').toLowerCase();
        const n = (item.name || '').toLowerCase();
        const d = (item.desc || '').toLowerCase();

        // Alumni & Fellowships
        if (t.includes('alumni') || n.includes('alumni') || n.includes('fellowship') || n.includes('graduates') || d.includes('alumni')) return 'Alumni';
        
        // Mentorship & Coaching
        if (t.includes('mentor') || n.includes('mentor') || d.includes('mentor') || t.includes('advice') || n.includes('coach') || d.includes('coach')) return 'Mentorship';
        
        // Events & Conferences
        if (t.includes('event') || t.includes('summit') || t.includes('conf') || t.includes('expo') || t.includes('hackathon') || t.includes('meetup') || t.includes('webinar')) return 'Events';
        
        // Ecosystem (Hubs, Labs, Incubators)
        if (t.includes('ecosystem') || t.includes('hub') || t.includes('lab') || t.includes('incubator') || t.includes('accelerator') || t.includes('space') || t.includes('center') || d.includes('hub') || d.includes('lab') || d.includes('incubator')) return 'Ecosystem';
        
        // Networks (Communities, Associations) - Default
        return 'Networks'; 
    };

    const hasJobs = (item) => {
        const text = ((item.desc || '') + (item.name || '')).toLowerCase();
        return text.includes('job board') || text.includes('hiring') || text.includes('vacancy') || text.includes('vacancies') || text.includes('placement');
    };

    // 3. Filter
    let filteredItems = allItems;
    if (activeFilter !== 'all') {
        filteredItems = allItems.filter(item => getCategory(item) === activeFilter);
    }

    // Sort Alphabetically
    filteredItems.sort((a, b) => (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase()));

    // 4. Render
    const getBtnClass = (filter) => activeFilter === filter 
        ? "bg-slate-800 text-white shadow-sm" 
        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50";

    const itemsHtml = filteredItems.length > 0 ? filteredItems.map(c => {
        const cat = getCategory(c);
        const isJob = hasJobs(c);
        let icon = 'users';
        if (cat === 'Mentorship') icon = 'user-check';
        if (cat === 'Events') icon = 'calendar';
        if (cat === 'Alumni') icon = 'graduation-cap';

        return `
            <a href="${c.link}" target="_blank" class="block p-3 border border-slate-200 rounded-lg bg-white hover:border-blue-300 hover:shadow-sm transition-all group relative">
                ${isJob ? '<div class="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded flex items-center gap-1"><i data-lucide="briefcase" class="w-2.5 h-2.5"></i> Jobs</div>' : ''}
                <div class="flex justify-between items-start mb-1 pr-16">
                    <div class="font-bold text-sm text-slate-800 group-hover:text-blue-700 flex items-center gap-2">
                        <div class="p-1.5 bg-slate-100 rounded text-slate-500"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i></div>
                        ${c.name}
                    </div>
                </div>
                <div class="text-xs text-slate-500 mb-2 line-clamp-2 pl-8">${c.desc}</div>
                <div class="pl-8 flex gap-2">
                    <span class="inline-block px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded border border-slate-100">${cat}</span>
                </div>
            </a>
        `;
    }).join('') : '<p class="text-sm text-slate-500 italic text-center py-8">No communities found for this category.</p>';

    const backBtn = containerId === 'career-hub-content'
        ? `<button onclick="resetCareerHub()" class="mb-4 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>`
        : '';

    container.innerHTML = `
        <div class="animate-fade-in flex flex-col h-full">
            ${backBtn}
            <div class="bg-sky-50/50 p-3 rounded-xl border border-sky-100 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 shrink-0">
                <div>
                    <label class="block text-[10px] font-bold text-sky-900 mb-1">Location</label>
                    <select onchange="setGlobalCountry(this.value); showCommunitiesView('${activeFilter}', '${containerId}');" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                        <option value="all" ${activeCountry === 'all' ? 'selected' : ''}>Regional</option>
                        <option value="Kenya" ${activeCountry === 'Kenya' ? 'selected' : ''}>Kenya</option>
                        <option value="Uganda" ${activeCountry === 'Uganda' ? 'selected' : ''}>Uganda</option>
                        <option value="Tanzania" ${activeCountry === 'Tanzania' ? 'selected' : ''}>Tanzania</option>
                        <option value="Rwanda" ${activeCountry === 'Rwanda' ? 'selected' : ''}>Rwanda</option>
                        <option value="Burundi" ${activeCountry === 'Burundi' ? 'selected' : ''}>Burundi</option>
                        <option value="South Sudan" ${activeCountry === 'South Sudan' ? 'selected' : ''}>South Sudan</option>
                        <option value="DRC" ${activeCountry === 'DRC' ? 'selected' : ''}>DR Congo</option>
                        <option value="Somalia" ${activeCountry === 'Somalia' ? 'selected' : ''}>Somalia</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-sky-900 mb-1">Sector</label>
                    <select onchange="setGlobalSector(this.value); showCommunitiesView('${activeFilter}', '${containerId}');" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                        <option value="agri" ${activeSectorId === 'agri' ? 'selected' : ''}>Agritech</option>
                        <option value="energy" ${activeSectorId === 'energy' ? 'selected' : ''}>Renewable Energy</option>
                        <option value="digital" ${activeSectorId === 'digital' ? 'selected' : ''}>Digital Economy</option>
                    </select>
                </div>
            </div>

            <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2"><i data-lucide="users" class="w-5 h-5 text-sky-500"></i> Mentoring Communities &amp; Alumni Networks</h3>

            <div class="flex gap-2 mb-4 overflow-x-auto pb-1 shrink-0 scrollbar-hide">
                <button onclick="showCommunitiesView('all', '${containerId}')" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('all')}">All</button>
                <button onclick="showCommunitiesView('Networks', '${containerId}')" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('Networks')}">Communities</button>
                <button onclick="showCommunitiesView('Mentorship', '${containerId}')" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('Mentorship')}">Mentorship</button>
                <button onclick="showCommunitiesView('Alumni', '${containerId}')" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('Alumni')}">Alumni</button>
                <button onclick="showCommunitiesView('Events', '${containerId}')" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('Events')}">Events</button>
            </div>

            <div class="space-y-3 pr-1 pb-4">
                ${itemsHtml}
            </div>
        </div>
    `;
    refreshIcons();
}

window.showMarketIntelView = function(activeTab = 'sector', targetId = 'career-hub-content', backAction = 'resetCareerHub()') {
    if (targetId === 'sector-hub-results') {
        _sectorHubView = 'market-intel';
        _marketIntelTab = activeTab;
    }
    const sectorData = getSectorCareerResources(activeSectorId);
    const container = document.getElementById(targetId);

    const lmi = sectorData.lmi || [];
    const researchItems = sectorData.entrepreneurship ? (sectorData.entrepreneurship.research || []) : [];

    let filteredLmi = [];
    if (activeTab === 'research') {
        // All report/research lmi items + entrepreneurship.research, deduplicated by URL
        const researchLmi = lmi.filter(l => {
            const t = (l.type || '').toLowerCase();
            return t.includes('research') || t.includes('report');
        });
        const combined = [
            ...researchLmi,
            ...researchItems.map(r => ({...r, type: r.type || 'Research & Innovation'}))
        ];
        const seenUrls = new Set();
        filteredLmi = combined.filter(item => {
            const url = item.link || '';
            if (!url) return true; // items without a link always show
            if (seenUrls.has(url)) return false;
            seenUrls.add(url);
            return true;
        });
    } else if (activeTab === 'global') {
        filteredLmi = lmi.filter(l => {
            const t = (l.type || '').toLowerCase();
            return t.includes('global') || t.includes('regional');
        });
    } else {
        // sector tab: everything that isn't a global/regional/research report
        filteredLmi = lmi.filter(l => {
            const t = (l.type || '').toLowerCase();
            return !t.includes('global') && !t.includes('regional') && !t.includes('research');
        });
    }

    const getBtnClass = (tab) => activeTab === tab
        ? 'bg-slate-800 text-white shadow-sm'
        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50';

    // Group by type, sort groups alphabetically
    const groupedItems = filteredLmi.reduce((groups, item) => {
        const type = item.type || 'General Resources';
        if (!groups[type]) groups[type] = [];
        groups[type].push(item);
        return groups;
    }, {});
    const sortedTypes = Object.keys(groupedItems).sort();

    const makeItemHtml = l => `
        <a href="${l.link}" target="_blank" rel="noopener" class="block p-3 border border-slate-200 rounded-lg bg-white hover:border-slate-400 hover:shadow-sm transition-all group">
            <div class="flex justify-between items-start mb-1">
                <div class="font-bold text-sm text-slate-800 group-hover:text-slate-900">${l.name}</div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-slate-500 shrink-0 ml-2"></i>
            </div>
            <div class="text-xs text-slate-500">${l.desc}</div>
        </a>`;

    let contentHtml = sortedTypes.length > 0
        ? sortedTypes.map(type => `
            <div class="mb-5 last:mb-0">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 border-b border-slate-100 pb-1 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span> ${type}
                </h4>
                <div class="space-y-3">${groupedItems[type].map(makeItemHtml).join('')}</div>
            </div>`).join('')
        : '<p class="text-sm text-slate-500 italic">No reports found for this category.</p>';

    // Gig & informal context panel — shown within Sector & Market Data tab
    const gigPathways = {
        agri:    [{ title: 'Smallholder Farmer', icon: 'leaf' }, { title: 'Agro-dealer & Input Supplier', icon: 'shopping-bag' }, { title: 'Agricultural Market Trader', icon: 'store' }, { title: 'Contract Farm Services', icon: 'wrench' }],
        energy:  [{ title: 'Solar PV Installer (Independent)', icon: 'zap' }, { title: 'Off-grid Energy Agent', icon: 'sun' }, { title: 'Biomass & Clean Cooking', icon: 'flame' }],
        digital: [{ title: 'Freelance Developer / Designer', icon: 'code-2' }, { title: 'Mobile Money Agent', icon: 'smartphone' }, { title: 'Digital Content Creator', icon: 'video' }, { title: 'Online Commerce & Reselling', icon: 'shopping-cart' }]
    };
    const gigPanelHtml = activeTab === 'sector' ? `
        <div class="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-5">
            <div class="flex items-start gap-3 mb-3">
                <div class="p-2 bg-sky-100 text-sky-600 rounded-lg shrink-0"><i data-lucide="store" class="w-4 h-4"></i></div>
                <div>
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                        <h4 class="font-bold text-sky-900 text-sm">Informal Economy Context</h4>
                        <span class="text-[10px] font-bold text-sky-700 bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full">~70–90% of EAC employment</span>
                    </div>
                    <p class="text-xs text-sky-800 leading-relaxed">In East Africa, most employment is informal — self-employment, micro-enterprises, platform gig work and smallholder farming. These are not captured in formal vacancy data but represent the primary income route for most people in the region.</p>
                </div>
            </div>
            <div class="border-t border-sky-100 pt-3">
                <p class="text-[10px] font-bold text-sky-700 uppercase tracking-wide mb-2">Common informal pathways in this sector</p>
                <div class="flex flex-wrap gap-2 mb-3">
                    ${(gigPathways[activeSectorId] || gigPathways.digital).map(r => `<span class="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-sky-200 rounded-lg text-xs text-sky-800 font-medium shadow-sm"><i data-lucide="${r.icon}" class="w-3 h-3 text-sky-500 shrink-0"></i> ${r.title}</span>`).join('')}
                </div>
                <button onclick="toggleSectorHub(); openUnifiedHub('pp-self-employment')" class="text-[10px] font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 underline underline-offset-2">
                    Build skills for self-employment <i data-lucide="arrow-right" class="w-3 h-3"></i>
                </button>
            </div>
        </div>` : '';

    container.innerHTML = `
        <div class="animate-fade-in">
            <button onclick="${backAction}" class="mb-4 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>

            <h3 class="font-bold text-slate-800 mb-1 flex items-center gap-2"><i data-lucide="line-chart" class="w-5 h-5 text-slate-600"></i> Sector &amp; Labour Market Intelligence</h3>
            <p class="text-[10px] text-slate-400 mb-4 flex items-start gap-1.5"><i data-lucide="database" class="w-3 h-3 mt-px shrink-0"></i><span>Online job vacancy data sourced from the <a href="https://unevoc.unesco.org/home/Global+Skills+Tracker" target="_blank" class="text-indigo-500 hover:underline font-medium">UNESCO Global Skills Tracker</a>. Reflects formal sector employers; informal and self-employment activity is shown in the Sector &amp; Market Data tab.</span></p>

            <div class="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                <button onclick="showMarketIntelView('sector', '${targetId}', '${backAction}')" class="shrink-0 py-2 px-3 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('sector')}">Sector &amp; Market Data</button>
                <button onclick="showMarketIntelView('research', '${targetId}', '${backAction}')" class="shrink-0 py-2 px-3 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('research')}">Research &amp; Reports</button>
                <button onclick="showMarketIntelView('global', '${targetId}', '${backAction}')" class="shrink-0 py-2 px-3 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('global')}">Regional &amp; International</button>
            </div>

            ${gigPanelHtml}
            <div class="space-y-1">${contentHtml}</div>
        </div>
    `;
    refreshIcons();
}

// --- Career Guides View ---
window.showCareerGuides = function(backAction = null) {
    const container = document.getElementById('career-hub-content');

    const backBtn = backAction
        ? `<button onclick="${backAction}" class="mb-4 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Upskilling</button>`
        : `<button onclick="resetCareerHub()" class="mb-4 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>`;

    const sections = [
        {
            label: 'Application Preparation',
            desc: 'Get your documents and interview technique ready before you apply.',
            color: 'indigo',
            resources: [
                { icon: 'file-text',      title: 'How to Write an ATS-Friendly CV',         desc: 'Optimise your resume to pass automated screening systems.',                           link: 'https://www.jobscan.co/blog/ats-resume/' },
                { icon: 'star',           title: 'Mastering the STAR Method for Interviews', desc: 'Structure behavioural interview answers clearly and confidently.',                   link: 'https://www.thebalancemoney.com/what-is-the-star-interview-response-technique-2061629' },
                { icon: 'message-square', title: 'A Guide to Informational Interviews',      desc: 'Learn how to approach professionals in your target field before applying.',          link: 'https://career.berkeley.edu/start-exploring/informational-interviews/' }
            ]
        },
        {
            label: 'Personal Brand & Networking',
            desc: 'Build visibility and make connections that open doors.',
            color: 'sky',
            resources: [
                { icon: 'linkedin', title: 'Building Your Personal Brand on LinkedIn', desc: 'Optimise your profile and content to attract recruiters and collaborators.',   link: 'https://www.linkedin.com/business/marketing/blog/linkedin-ads/how-to-build-your-personal-brand-on-linkedin' },
                { icon: 'users',    title: 'Networking for Introverts',               desc: 'Practical strategies to build genuine professional connections authentically.', link: 'https://hbr.org/2011/02/a-networking-guide-for-introverts' }
            ]
        },
        {
            label: 'Career Strategy & Growth',
            desc: 'Plan your long-term path, negotiate your worth, and develop as a leader.',
            color: 'blue',
            resources: [
                { icon: 'trending-up', title: 'Career Planning & Advancement',   desc: 'HBR articles on navigating promotions, pivots and long-term career growth.',                  link: 'https://hbr.org/topic/career-planning' },
                { icon: 'banknote',    title: 'Salary Negotiation 101',          desc: 'Practical tips and scripts for confidently discussing compensation.',                          link: 'https://www.glassdoor.com/blog/guide/how-to-negotiate-your-salary/' },
                { icon: 'handshake',   title: 'Negotiation Fundamentals',        desc: 'Free Coursera course covering negotiation strategy for salary, projects and contracts.',      link: 'https://www.coursera.org/learn/negotiation-fundamentals' },
                { icon: 'award',       title: 'Leadership Skills',               desc: 'MindTools practical guides on influence, delegation and leading teams.',                       link: 'https://www.ccl.org/articles/leading-effectively-articles/' }
            ]
        }
    ];

    const sectionsHtml = sections.map(s => {
        const itemsHtml = s.resources.map(r => `
            <a href="${r.link}" target="_blank" class="flex items-center gap-3 p-3 border border-${s.color}-100 rounded-lg hover:border-${s.color}-300 bg-white group transition-all">
                <div class="p-2 bg-${s.color}-50 text-${s.color}-600 rounded shrink-0"><i data-lucide="${r.icon}" class="w-4 h-4"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="font-bold text-sm text-slate-800 group-hover:text-${s.color}-700">${r.title}</div>
                    <div class="text-xs text-slate-500">${r.desc}</div>
                </div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-${s.color}-400 shrink-0 ml-auto"></i>
            </a>
        `).join('');
        return `
            <div class="mb-6">
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">${s.label}</div>
                <p class="text-xs text-slate-500 mb-2">${s.desc}</p>
                <div class="space-y-2">${itemsHtml}</div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="animate-fade-in">
            ${backBtn}
            <h3 class="font-bold text-slate-800 mb-5 flex items-center gap-2"><i data-lucide="compass" class="w-5 h-5 text-slate-500"></i> Career Guidance</h3>
            ${sectionsHtml}
        </div>
    `;
    refreshIcons();
}

// --- NEW: Helper to restore Pathway from Career Guides ---
window.restorePathwayFromGuides = function() {
    openUnifiedHub('pp-practice');
    pathwayState.goal = 'Upskilling & Lifelong Learning';
    renderPathwayStep3();
}

// --- NEW: Helper for Lifelong Learning Button (Fixes Quoting Issues) ---
window.openLifelongLearningGuides = function() {
    // Correctly close the drawer without hiding it (display:none)
    const hub = document.getElementById('unified-hub-modal');
    if(hub) hub.classList.add('translate-x-full');
    
    const drawer = document.getElementById('career-hub-drawer');
    if(drawer) drawer.classList.remove('translate-x-full');
    showCareerGuides("restorePathwayFromGuides()");
}

window.showCVResources = function(containerId, backFn) {
    containerId = containerId || 'career-hub-content';
    backFn = backFn || (containerId === 'career-hub-content' ? 'resetCareerHub()' : 'renderPathwayContent()');
    window._cvToolsContainer = containerId;
    window._cvToolsBackFn = backFn;

    const container = document.getElementById(containerId);
    if (!container) return;

    const allTools = (typeof staticCVTools !== 'undefined') ? staticCVTools : [];

    const toolsHtml = allTools.map(t => `
        <a href="${t.link}" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-indigo-300 bg-white group transition-all">
            <div class="p-2 bg-indigo-100 text-indigo-600 rounded"><i data-lucide="${t.icon}" class="w-4 h-4"></i></div>
            <div>
                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700">${t.title}</div>
                <div class="text-xs text-slate-500">${t.desc}</div>
            </div>
            <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500 ml-auto"></i>
        </a>
    `).join('');

    const backLabel = containerId === 'career-hub-content' ? 'Back to Hub' : 'Back to Pathway';

    container.innerHTML = `
        <div class="animate-fade-in">
            <button onclick="${backFn}" class="mb-4 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> ${backLabel}</button>
            <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2"><i data-lucide="file-text" class="w-5 h-5 text-indigo-500"></i> CV Tools &amp; Checklists</h3>

            <!-- Step 1: Job Readiness — check before building -->
            <div class="mb-5">
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Step 1 — Check Your Readiness</div>
                <button onclick="renderReadinessScorecard('${containerId}', 'showCVResources(window._cvToolsContainer, window._cvToolsBackFn)')" class="w-full flex items-center gap-3 p-3 border border-blue-100 bg-blue-50 rounded-xl hover:bg-blue-100 group transition-colors text-left">
                    <div class="p-2 bg-white text-blue-600 rounded-lg shadow-sm shrink-0"><i data-lucide="clipboard-check" class="w-4 h-4"></i></div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-bold text-blue-900 group-hover:text-blue-700">Job Readiness Scorecard</div>
                        <div class="text-xs text-blue-600">See how prepared you are before writing your CV or applying</div>
                    </div>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-blue-300 group-hover:text-blue-600 shrink-0"></i>
                </button>
            </div>

            <!-- Step 2: Build your CV -->
            <div class="mb-5">
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Step 2 — Build Your CV</div>
                <div class="mb-4 p-4 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl text-white shadow-md">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-bold text-sm">Instant CV Builder</h4>
                        <i data-lucide="zap" class="w-4 h-4 text-yellow-300"></i>
                    </div>
                    <p class="text-xs text-indigo-100 mb-3 leading-relaxed">Create a standardised, ATS-friendly PDF resume directly in your browser. No sign-up required.</p>
                    <button onclick="renderCVGenerator('${containerId}')" class="w-full py-2 bg-white text-indigo-700 font-bold rounded-lg text-xs hover:bg-indigo-50 transition-colors shadow-sm">
                        Build My CV Now
                    </button>
                </div>
                <div class="space-y-3">
                    ${toolsHtml}
                </div>
            </div>

            <!-- Step 3: Prepare your applications -->
            <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Step 3 — Prepare Your Applications</div>
                <div class="space-y-2">
                    <button onclick="renderApplicationKit('all', 'showCVResources(window._cvToolsContainer, window._cvToolsBackFn)')" class="w-full flex items-center gap-3 p-3 border border-sky-100 bg-sky-50 rounded-xl hover:bg-sky-100 group transition-colors text-left">
                        <div class="p-2 bg-white text-sky-600 rounded-lg shadow-sm shrink-0"><i data-lucide="file-check" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-sm font-bold text-sky-900 group-hover:text-sky-700">Application Checklists</div>
                            <div class="text-xs text-sky-600">Tailored checklists for general, internship, placement, freelance and volunteer applications</div>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-sky-300 group-hover:text-sky-600 shrink-0"></i>
                    </button>
                    <button onclick="renderApprenticeshipChecklist('${containerId}', 'showCVResources(window._cvToolsContainer, window._cvToolsBackFn)')" class="w-full flex items-center gap-3 p-3 border border-indigo-100 bg-indigo-50 rounded-xl hover:bg-indigo-100 group transition-colors text-left">
                        <div class="p-2 bg-white text-indigo-600 rounded-lg shadow-sm shrink-0"><i data-lucide="clipboard-list" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-sm font-bold text-indigo-900 group-hover:text-indigo-700">Apprenticeship Prep Checklist</div>
                            <div class="text-xs text-indigo-600">Step-by-step placement audit before you start</div>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-indigo-300 group-hover:text-indigo-600 shrink-0"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    refreshIcons();
}

// --- CV Generator Logic ---
window.renderCVGenerator = function(containerId) {
    containerId = containerId || window._cvToolsContainer || 'career-hub-content';
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <div class="animate-fade-in space-y-4">
            <button onclick="showCVResources()" class="mb-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Tools</button>
            
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="font-bold text-slate-800 text-lg">Quick CV Builder</h3>
                        <p class="text-xs text-slate-500">Generate a clean, ATS-friendly PDF resume in seconds.</p>
                    </div>
                    <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><i data-lucide="file-text" class="w-5 h-5"></i></div>
                </div>

                <form id="cv-form" class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                            <input type="text" id="cv-name" class="w-full text-sm border-slate-300 rounded-lg p-2" placeholder="Jane Doe">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-1">Target Role</label>
                            <input type="text" id="cv-role" class="w-full text-sm border-slate-300 rounded-lg p-2" placeholder="Data Analyst">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-1">Email</label>
                            <input type="email" id="cv-email" class="w-full text-sm border-slate-300 rounded-lg p-2" placeholder="jane@example.com">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                            <input type="text" id="cv-phone" class="w-full text-sm border-slate-300 rounded-lg p-2" placeholder="+254 700 000000">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Portfolio / LinkedIn URL</label>
                        <input type="text" id="cv-portfolio" class="w-full text-sm border-slate-300 rounded-lg p-2" placeholder="github.com/username or behance.net/user">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Professional Summary</label>
                        <textarea id="cv-summary" rows="3" class="w-full text-sm border-slate-300 rounded-lg p-2" placeholder="Motivated professional with 2 years of experience in..."></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Key Skills (Comma separated)</label>
                        <input type="text" id="cv-skills" class="w-full text-sm border-slate-300 rounded-lg p-2" placeholder="Python, Data Analysis, Project Management">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Work Experience</label>
                        <textarea id="cv-experience" rows="3" class="w-full text-sm border-slate-300 rounded-lg p-2" placeholder="&bull; Role at Company (Dates): Achieved X by doing Y..."></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Key Projects (Micro-Projects)</label>
                        <textarea id="cv-projects" rows="3" class="w-full text-sm border-slate-300 rounded-lg p-2" placeholder="&bull; Project Name: Description of what you built or solved..."></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Education</label>
                        <textarea id="cv-education" rows="2" class="w-full text-sm border-slate-300 rounded-lg p-2" placeholder="BSc Computer Science, University of Nairobi (2024)"></textarea>
                    </div>
                </form>

                <div class="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                    <button onclick="generatePDF()" class="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                        <i data-lucide="download" class="w-4 h-4"></i> Download PDF
                    </button>
                </div>
            </div>
        </div>
    `;
    refreshIcons();
}

window.generatePDF = function() {
    if (!window.jspdf) {
        alert("PDF Generator library not loaded. Please check your internet connection.");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const name = document.getElementById('cv-name').value || "Your Name";
    const role = document.getElementById('cv-role').value || "Professional Role";
    const email = document.getElementById('cv-email').value || "email@example.com";
    const phone = document.getElementById('cv-phone').value || "Phone";
    const portfolio = document.getElementById('cv-portfolio').value || "";
    const summary = document.getElementById('cv-summary').value || "";
    const skills = document.getElementById('cv-skills').value || "";
    const experience = document.getElementById('cv-experience').value || "";
    const projects = document.getElementById('cv-projects').value || "";
    const education = document.getElementById('cv-education').value || "";

    // Styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(name, 20, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(role, 20, 28);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");
    
    let contactInfo = `${email} | ${phone}`;
    if (portfolio) contactInfo += ` | ${portfolio}`;
    
    doc.text(contactInfo, 20, 35);
    
    doc.setLineWidth(0.5);
    doc.line(20, 38, 190, 38);
    
    let yPos = 45;
    
    const addSection = (title, content) => {
        if(content) {
            if (yPos > 270) { doc.addPage(); yPos = 20; }
            doc.setFont("helvetica", "bold");
            doc.text(title, 20, yPos);
            yPos += 5;
            doc.setFont("helvetica", "normal");
            const splitContent = doc.splitTextToSize(content, 170);
            doc.text(splitContent, 20, yPos);
            yPos += (splitContent.length * 5) + 5;
        }
    };

    addSection("SUMMARY", summary);
    addSection("SKILLS", skills);
    addSection("EXPERIENCE", experience);
    addSection("PROJECTS", projects);
    addSection("EDUCATION", education);
    
    doc.save(`${name.replace(/ /g, "_")}_CV.pdf`);
}

window.showEmployerConnectView = function() {
    const container = document.getElementById('career-hub-content');
    const sector = activeSectorId;
    const country = activeCountry;

    // Generic career fairs shared across all sectors
    const universalEvents = [
        { title: "Africa Tech Summit Nairobi", date: "Feb 2027", type: "Nairobi", link: "https://www.africatechsummit.com/" },
        { title: "Sankalp Africa Summit", date: "2026 (TBC)", type: "Nairobi", link: "https://sankalpforum.com/" },
        { title: "GITEX Africa", date: "Apr 2026", type: "Marrakech", link: "https://gitexafrica.com" },
        { title: "Africa Energy Forum", date: "Jun 2026", type: "Cape Town", link: "https://www.africaenergyforum.com/" },
        { title: "AGRF Summit", date: "Sep 2026", type: "Regional", link: "https://agrf.org/" }
    ];

    const connectData = {
        agri: {
            partners: [
                { name: "One Acre Fund", url: "https://oneacrefund.org/" },
                { name: "SunCulture", url: "https://sunculture.io/" },
                { name: "Apollo Agriculture", url: "https://apolloagriculture.com/" },
                { name: "Kakuzi", url: "https://www.kakuzi.co.ke/" },
                { name: "Victory Farms", url: "https://www.victoryfarmskenya.com/" },
                { name: "Komaza", url: "https://komaza.com/" }
            ],
            events: [
                { title: "Sankalp Africa Summit", date: "2026 (TBC)", type: "Nairobi", link: "https://sankalpforum.com/" },
                { title: "AGRF Summit", date: "Sep 2026", type: "Regional", link: "https://agrf.org/" },
                { title: "EAFF Farmer's Field Days", date: "Quarterly", type: "In-Person", link: "https://eaffu.org/" }
            ]
        },
        energy: {
            partners: [
                { name: "M-KOPA", url: "https://m-kopa.com/" },
                { name: "Sun King", url: "https://sunking.com/" },
                { name: "d.light", url: "https://www.dlight.com/" },
                { name: "Ignite Access", url: "https://igniteaccess.com/" },
                { name: "KenGen", url: "https://www.kengen.co.ke/" },
                { name: "Bboxx", url: "https://www.bboxx.com/" },
                { name: "CrossBoundary", url: "https://www.crossboundary.com/" }
            ],
            events: [
                { title: "Africa Energy Forum", date: "Jun 2026", type: "Cape Town", link: "https://www.africaenergyforum.com/" },
                { title: "African Utilities Week", date: "May 2026", type: "Cape Town", link: "https://clarion-events.com/energy-utilities/" },
                { title: "GOGLA Forum", date: "Sep 2026", type: "Virtual", link: "https://www.gogla.org/" }
            ]
        },
        digital: {
            partners: [
                { name: "Safaricom", url: "https://www.safaricom.co.ke/careers", desc: "Hiring for: AWS Cloud, GenAI & Fintech" },
                { name: "Microsoft ADC", url: "https://careers.microsoft.com/", desc: "Hiring for: Software Engineering & AI" },
                { name: "Equity Bank", url: "https://equitygroupholdings.com/", desc: "Hiring for: Cybersecurity & Data Science" },
                { name: "ALX Africa", url: "https://www.alxafrica.com/", desc: "Hiring for: Tech Mentors & Data Analysts" },
                { name: "Cellulant", url: "https://cellulant.io/", desc: "Hiring for: Backend Dev & API Integration" },
                { name: "Wasoko", url: "https://wasoko.com/" }
            ],
            events: [
                { title: "Africa Tech Summit", date: "Feb 2027", type: "Nairobi", link: "https://www.africatechsummit.com/" },
                { title: "GITEX Africa", date: "Apr 2026", type: "Marrakech", link: "https://gitexafrica.com" },
                { title: "Africa Tech Festival", date: "Nov 2026", type: "Cape Town", link: "https://africatechfestival.com/" }
            ]
        }
    };

    const sectorData = connectData[sector] || connectData.digital;
    const seenTitles = new Set();
    const allEvents = [...sectorData.events, ...universalEvents].filter(e => {
        if (seenTitles.has(e.title)) return false;
        seenTitles.add(e.title);
        return true;
    });

    let partners = sectorData.partners;
    if (country === 'Rwanda' && sector === 'digital') partners = [{ name: "Irembo", url: "https://irembo.gov.rw/" }, { name: "Bank of Kigali", url: "https://bk.rw/" }, ...partners];
    partners = partners.slice(0, 5);

    const partnersHtml = partners.map(p => `
        <a href="${p.url}" target="_blank" class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors group">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">${p.name.substring(0,2).toUpperCase()}</div>
                <div>
                    <div class="text-xs font-bold text-slate-800 group-hover:text-blue-700">${p.name}</div>
                    <div class="text-[10px] text-slate-500">${p.desc || 'Hiring Partner'}</div>
                </div>
            </div>
            <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 border border-blue-100 flex items-center gap-1">Connect <i data-lucide="external-link" class="w-3 h-3"></i></span>
        </a>
    `).join('');

    const eventsHtml = allEvents.map(e => {
        const parts = e.date.split(' ');
        const day = parts.length > 1 ? parts[1].replace(',','') : '';
        return `
        <a href="${e.link || '#'}" target="_blank" class="flex items-center gap-3 p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-white hover:border-blue-200 transition-colors group">
            <div class="p-2 bg-white rounded shadow-sm text-center min-w-[50px]">
                <div class="text-[9px] text-slate-400 uppercase font-bold">${parts[0]}</div>
                <div class="text-sm font-bold text-slate-800">${day}</div>
            </div>
            <div>
                <div class="text-xs font-bold text-slate-800 group-hover:text-blue-700">${e.title}</div>
                <div class="text-[10px] text-slate-500">${e.type} &bull; ${country === 'all' ? 'Regional' : country}</div>
            </div>
        </a>
    `}).join('');

    container.innerHTML = `
        <div class="animate-fade-in space-y-6">
            <button onclick="resetCareerHub()" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>
            <div>
                <h3 class="font-bold text-lg text-slate-900 mb-1 flex items-center gap-2"><i data-lucide="handshake" class="w-5 h-5 text-blue-600"></i> Employer Connect</h3>
                <p class="text-xs text-slate-500">Direct links to industry partners and career fairs.</p>
            </div>
            <div>
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Work-Integrated Learning Partners</h4>
                <div class="space-y-2">${partnersHtml}</div>
                <div class="mt-3 flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <i data-lucide="lightbulb" class="w-4 h-4 text-blue-500 shrink-0 mt-0.5"></i>
                    <p class="text-xs text-blue-800 leading-snug"><strong>How to connect:</strong> Visit their careers page directly, or send a short LinkedIn message referencing a specific role or programme. Mention your sector focus and the Skills2Careers platform for context.</p>
                </div>
            </div>
            <div>
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Upcoming Career &amp; Industry Events</h4>
                <div class="space-y-2">${eventsHtml}</div>
            </div>
        </div>
    `;
    refreshIcons();
}

window.showStudentNetworks = function() {
    const container = document.getElementById('career-hub-content');

    // Sector-specific youth & student network fallbacks
    const sectorYouthNetworks = {
        agri: [
            { title: "YPARD (Young Professionals in Agriculture)", desc: "Global network of young professionals shaping the future of food systems.", link: "https://ypard.net/", type: "Network" },
            { title: "CGIAR Youth Network", desc: "Young researchers and innovators driving agricultural transformation.", link: "https://www.cgiar.org/", type: "Network" },
            { title: "AGRA Youth in Agriculture", desc: "Alliance for a Green Revolution in Africa — careers and youth programming in food systems.", link: "https://agra.org/", type: "Community" }
        ],
        energy: [
            { title: "Energy & Environment Partnership (EEP Africa)", desc: "Financing and networking for clean energy professionals in East & Southern Africa.", link: "https://eepafrica.org/", type: "Network" },
            { title: "AFSIA Young Members", desc: "Youth chapter of the Africa Solar Industry Association.", link: "https://afsiasolar.com/", type: "Community" },
            { title: "IRENA Young Professionals", desc: "International Renewable Energy Agency youth and graduate community.", link: "https://www.irena.org/", type: "Network" }
        ],
        digital: [
            { title: "ALX Fellowship", desc: "Community of ALX graduates building Africa's tech talent pipeline.", link: "https://www.alxafrica.com/", type: "Alumni" },
            { title: "Google Developer Student Clubs", desc: "University-based community groups powered by Google Developers.", link: "https://developers.google.com/community/gdsc", type: "Campus" },
            { title: "Akirachix", desc: "Community of women in tech across Africa — mentorship, training and careers.", link: "https://akirachix.com/", type: "Community" }
        ]
    };

    const keywords = ['student', 'youth', 'campus', 'university', 'young', 'sprint up', 'dot', 'ceda', 'elisa', 'scenius', 'jhub', 'yaden', 'commonwealth alliance', 'educate!', 'ashoka', 'studentpreneur'];

    // Pull from sector-aware communities data
    const sectorCommunities = getSectorCareerResources(activeSectorId).communities || [];
    const dynamicResources = sectorCommunities.filter(r => {
        const text = ((r.title || r.name || '') + ' ' + (r.desc || '')).toLowerCase();
        return keywords.some(k => text.includes(k));
    }).map(r => ({ title: r.title || r.name, desc: r.desc, link: r.link, type: r.type || 'Network' }));

    // Use dynamic results if available, otherwise fall back to static per-sector list
    const resources = dynamicResources.length > 0 ? dynamicResources : (sectorYouthNetworks[activeSectorId] || sectorYouthNetworks.digital);

    // Render
    const itemsHtml = resources.map(r => `
        <a href="${r.link}" target="_blank" class="block p-3 border border-slate-200 rounded-lg bg-white hover:border-indigo-300 hover:shadow-sm transition-all group">
            <div class="flex justify-between items-start mb-1">
                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">
                    <div class="p-1.5 bg-indigo-50 text-indigo-600 rounded"><i data-lucide="users" class="w-3.5 h-3.5"></i></div>
                    ${r.title || r.name}
                </div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500"></i>
            </div>
            <div class="text-xs text-slate-500 mb-1 pl-8">${r.desc}</div>
            <div class="pl-8 flex gap-2">
                <span class="inline-block px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded border border-slate-100">${r.type || 'Network'}</span>
            </div>
        </a>
    `).join('');

    container.innerHTML = `
        <div class="animate-fade-in">
            <button onclick="resetCareerHub()" class="mb-4 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>
            
            <div class="mb-4">
                <h3 class="font-bold text-slate-800 mb-1 flex items-center gap-2"><i data-lucide="users" class="w-5 h-5 text-indigo-600"></i> Student &amp; Youth Networks</h3>
                <p class="text-xs text-slate-500">Communities, campus groups and professional networks for students and young people starting out in the sector.</p>
            </div>

            <div class="space-y-3">
                ${itemsHtml || '<div class="text-sm text-slate-500 italic">No specific student networks found for this selection.</div>'}
            </div>
        </div>
    `;
    refreshIcons();
}

window.showJobBoardView = function(filter = 'all', sectorOverride, countryOverride) {
    const sectorLabels = { agri: 'Agriculture', energy: 'Clean Energy', digital: 'Digital & Tech' };
    const resolvedSector = sectorOverride || activeSectorId;
    const resolvedCountry = countryOverride || activeCountry;
    const sectorData = getSectorCareerResources(resolvedSector);
    const container = document.getElementById('career-hub-content');

    // 1. Merge real jobs; add curated fallback boards by type if no live data exists
    let allOps = [...(sectorData.jobs || [])];
    if (!allOps.some(j => j.type === 'Internship')) allOps.push({ title: "Search Graduate & Internship Roles", company: "LinkedIn Jobs", type: "Internship", link: "https://www.linkedin.com/jobs/search/?keywords=Graduate%20Trainee" });
    if (!allOps.some(j => j.type === 'Freelance')) allOps.push({ title: "Browse Freelance Projects", company: "Upwork", type: "Freelance", link: "https://www.upwork.com/freelance-jobs/" });
    if (!allOps.some(j => j.type === 'Volunteer')) allOps.push({ title: "Find Volunteer Opportunities", company: "Idealist", type: "Volunteer", link: "https://www.idealist.org/en/volunteer" });

    // 2. Filter Logic
    let filteredOps = allOps;
    if (filter !== 'all') {
        filteredOps = allOps.filter(j => (j.type && j.type.toLowerCase().includes(filter)) || (filter === 'entry' && !j.type));
    }

    const opsHtml = filteredOps.map(j => `
        <a href="${j.link || '#'}" target="_blank" class="block p-3 border border-slate-200 rounded-lg bg-white hover:border-sky-300 transition-colors group">
            <div class="flex justify-between items-start mb-1">
                <div class="flex gap-1">
                    <span class="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded inline-block uppercase tracking-wide">${j.type || 'Full-Time'}</span>
                </div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-sky-500"></i>
            </div>
            <div class="font-bold text-sm text-slate-800 group-hover:text-sky-700">${j.title}</div>
            <div class="text-xs text-slate-500 mb-1">${j.company} &bull; ${resolvedCountry === 'all' ? 'Regional' : resolvedCountry}</div>
        </a>
    `).join('');

    const getBtnClass = (f) => filter === f ? "bg-sky-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50";
    const sectorLabel = sectorLabels[resolvedSector] || resolvedSector;

    container.innerHTML = `
        <div class="animate-fade-in">
            <button onclick="resetCareerHub()" class="mb-4 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>

            <div class="mb-4">
                <h3 class="font-bold text-slate-800 mb-1 flex items-center gap-2"><i data-lucide="briefcase" class="w-5 h-5 text-sky-600"></i> Job Boards &amp; Opportunities</h3>
                <p class="text-xs text-slate-500">Curated listings for job boards, internships and volunteering positions.</p>
            </div>

            <div class="bg-slate-50/80 p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                    <label class="block text-[10px] font-bold text-slate-600 mb-1">Location</label>
                    <select onchange="showJobBoardView('${filter}', '${resolvedSector}', this.value)" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                        <option value="all" ${resolvedCountry === 'all' ? 'selected' : ''}>Regional</option>
                        <option value="Kenya" ${resolvedCountry === 'Kenya' ? 'selected' : ''}>Kenya</option>
                        <option value="Uganda" ${resolvedCountry === 'Uganda' ? 'selected' : ''}>Uganda</option>
                        <option value="Tanzania" ${resolvedCountry === 'Tanzania' ? 'selected' : ''}>Tanzania</option>
                        <option value="Rwanda" ${resolvedCountry === 'Rwanda' ? 'selected' : ''}>Rwanda</option>
                        <option value="Ethiopia" ${resolvedCountry === 'Ethiopia' ? 'selected' : ''}>Ethiopia</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-600 mb-1">Sector</label>
                    <select onchange="showJobBoardView('${filter}', this.value, '${resolvedCountry}')" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                        <option value="agri" ${resolvedSector === 'agri' ? 'selected' : ''}>Agriculture</option>
                        <option value="energy" ${resolvedSector === 'energy' ? 'selected' : ''}>Clean Energy</option>
                        <option value="digital" ${resolvedSector === 'digital' ? 'selected' : ''}>Digital & Tech</option>
                    </select>
                </div>
            </div>

            <div class="flex gap-2 mb-4 overflow-x-auto pb-1 shrink-0">
                <button onclick="showJobBoardView('all', '${resolvedSector}', '${resolvedCountry}')" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('all')}">All Opportunities</button>
                <button onclick="showJobBoardView('internship', '${resolvedSector}', '${resolvedCountry}')" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('internship')}">Internships</button>
                <button onclick="showJobBoardView('volunteer', '${resolvedSector}', '${resolvedCountry}')" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('volunteer')}">Volunteer</button>
            </div>

            <div class="space-y-3 pr-1 pb-2">
                ${opsHtml.length > 0 ? opsHtml : '<p class="text-sm text-slate-500 italic text-center py-4">No specific opportunities found for this category yet.</p>'}
                <div class="p-3 bg-slate-50 rounded text-xs text-center text-slate-500">
                    Showing opportunities in <strong>${sectorLabel}</strong>. Includes national, regional, and global listings.
                </div>
            </div>

        </div>
    `;
    refreshIcons();
}

// --- NEW: Render Applications Checklist ---
window.renderApplicationKit = function(type, backAction = null) {
    const container = document.getElementById('career-hub-content');
    
    const kits = {
        'all': { title: "General Job Applications Checklist", items: ["Master CV Template", "Cover Letter Guide", "LinkedIn Checklist", "Common Interview Qs"] },
        'internship': { title: "Internship Starter Kit", items: ["No-Experience Resume Template", "University Transcript Guide", "Internship Cover Letter", "Behavioral Interview Prep"] },
        'placement': { title: "Work Placement Kit", items: ["Placement Application Letter", "Daily Work Logbook Template", "Supervisor Evaluation Form", "Placement Report Structure"] },
        'freelance': { title: "Freelancer Toolkit", items: ["Service Rate Card Template", "Client Contract Draft", "Portfolio Website Checklist", "Proposal Email Script"] },
        'tender': { title: "Founder Tender Kit", items: ["Capability Statement Template", "Tax Compliance Checklist", "Technical Proposal Structure", "Financial Proposal Sheet"] },
        'volunteer': { title: "Volunteer Applications Checklist", items: ["Motivation Statement Template", "Availability Schedule", "Soft Skills Checklist", "Values Alignment Prep"] }
    };
    const kit = kits[type] || kits['all'];

    // Back Button Logic
    const backBtnCode = backAction
        ? `onclick="${backAction}"`
        : `onclick="showJobBoardView('${type}')"`;

    const backLabel = !backAction ? "Back to Opportunities"
        : backAction.includes('showCVResources') ? "Back to CV Tools"
        : "Back to Hub";

    // Tab Helper
    const getBtnClass = (t) => type === t
        ? "bg-indigo-600 text-white shadow-sm"
        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50";

    // Safe Back Action for recursion
    const safeBackAction = backAction ? `'${backAction.replace(/'/g, "\\'")}'` : 'null';

    const sectorArticles = {
        agri: [
            { title: 'FAO Digital Agriculture Careers', desc: 'Explore roles in precision farming, food tech and agri-data across the region.', icon: 'leaf', link: 'https://www.fao.org/digital-agriculture/en/' },
            { title: 'TVET Pathways into Agritech', desc: 'How vocational qualifications support agriculture careers across the EAC region.', icon: 'graduation-cap', link: 'https://unevoc.unesco.org/home/UNEVOC+Network' }
        ],
        energy: [
            { title: 'IRENA: Jobs in Renewable Energy', desc: 'The growing range of roles in solar, wind and off-grid energy across Africa.', icon: 'zap', link: 'https://www.irena.org/Energy-Transition/Socio-economic-impact/Jobs' },
            { title: 'Solar Technician Career Path', desc: 'Skills, certifications and entry routes for solar PV installation roles.', icon: 'sun', link: 'https://unevoc.unesco.org/home/UNEVOC+Network' }
        ],
        digital: [
            { title: 'GSMA Digital Skills Resources', desc: 'Reports and guidance on digital skills gaps and job opportunities across Africa.', icon: 'wifi', link: 'https://www.gsma.com/mobilefordevelopment/digital-skills/' },
            { title: 'Build a Developer Portfolio', desc: 'What to include, how to host it, and how to pitch it to employers.', icon: 'code-2', link: 'https://docs.github.com/en/get-started/start-your-journey/uploading-a-project-to-github' }
        ]
    };
    const sectorGuides = sectorArticles[activeSectorId] || [];
    const guidesHtml = sectorGuides.length ? sectorGuides.map(g =>
        '<a href="' + g.link + '" target="_blank" class="flex items-center gap-2.5 p-2.5 border border-sky-100 rounded-lg hover:border-sky-300 bg-white group transition-all">' +
        '<div class="p-1.5 bg-sky-50 text-sky-600 rounded shrink-0"><i data-lucide="' + g.icon + '" class="w-3.5 h-3.5"></i></div>' +
        '<div class="flex-1 min-w-0">' +
        '<div class="font-bold text-xs text-slate-800 group-hover:text-sky-700">' + g.title + '</div>' +
        '<div class="text-[11px] text-slate-500 leading-snug">' + g.desc + '</div>' +
        '</div>' +
        '<i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-sky-500 shrink-0"></i>' +
        '</a>'
    ).join('') : '';

    container.innerHTML = `
        <div class="animate-fade-in space-y-5">
            <button ${backBtnCode} class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> ${backLabel}</button>

            <div class="text-center">
                <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i data-lucide="briefcase" class="w-6 h-6"></i>
                </div>
                <h3 class="font-bold text-lg text-slate-900">Application Checklists</h3>
                <p class="text-xs text-slate-500">Select a persona to view tailored checklists.</p>
            </div>

            <!-- Micro Tabs -->
            <div class="flex gap-2 mb-2 overflow-x-auto pb-1 shrink-0 justify-center">
                <button onclick="renderApplicationKit('all', ${safeBackAction})" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('all')}">General</button>
                <button onclick="renderApplicationKit('internship', ${safeBackAction})" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('internship')}">Internship</button>
                <button onclick="renderApplicationKit('placement', ${safeBackAction})" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('placement')}">Placement</button>
                <button onclick="renderApplicationKit('freelance', ${safeBackAction})" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('freelance')}">Freelance</button>
                <button onclick="renderApplicationKit('volunteer', ${safeBackAction})" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('volunteer')}">Volunteer</button>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">${kit.title} Resources</div>
                <div class="divide-y divide-slate-100">
                    ${kit.items.map(item => `
                        <div class="p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                            <i data-lucide="check-circle" class="w-4 h-4 text-blue-500 shrink-0"></i>
                            <span class="text-sm text-slate-700">${item}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${guidesHtml ? `<div class="border-t border-slate-100 pt-4">
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Sector Resources</div>
                <p class="text-xs text-slate-500 mb-3">Guides and pathways specific to your sector.</p>
                <div class="space-y-1.5">${guidesHtml}</div>
            </div>` : ''}
        </div>
    `;
    refreshIcons();
}

// --- NEW: Update Hero Stats ---

// --- NEW: AI Tools View ---
window.showAIToolsView = function() {
    const container = document.getElementById('career-hub-content');

    const aiToolGroups = [
        {
            label: 'Write & Refine',
            desc: 'Draft, score and sharpen your CV and cover letters.',
            color: 'indigo',
            tools: [
                { title: "ChatGPT / Claude", desc: "Draft cover letters, rewrite CV bullet points and rehearse interview answers.", link: "https://chatgpt.com/", icon: "message-square" },
                { title: "Resume Worded", desc: "AI-powered scoring and line-by-line feedback on your CV content.", link: "https://resumeworded.com/", icon: "file-text" }
            ]
        },
        {
            label: 'Interview Practice',
            desc: 'Build confidence and sharpen your spoken answers before the real thing.',
            color: 'blue',
            tools: [
                { title: "Interview Warmup", desc: "Google's AI tool — practise real interview questions with instant transcript feedback.", link: "https://grow.google/certificates/interview-warmup/", icon: "mic" },
                { title: "Yoodli", desc: "AI speech coach — improve clarity, reduce filler words and boost delivery.", link: "https://yoodli.ai/", icon: "video" }
            ]
        },
        {
            label: 'Plan & Track',
            desc: 'Manage your job search and get personalised career guidance.',
            color: 'sky',
            tools: [
                { title: "CareerVillage Coach", desc: "Ask career questions and get personalised AI coaching on next steps.", link: "https://www.careervillage.org/", icon: "user-check" },
                { title: "TealHQ", desc: "AI resume builder and job application tracker — manage your whole search in one place.", link: "https://www.tealhq.com/", icon: "briefcase" }
            ]
        }
    ];

    const groupsHtml = aiToolGroups.map(g => {
        const toolsHtml = g.tools.map(t => `
            <a href="${t.link}" target="_blank" class="flex items-center gap-3 p-3 border border-${g.color}-100 rounded-lg hover:border-${g.color}-300 bg-white group transition-all">
                <div class="p-2 bg-${g.color}-50 text-${g.color}-600 rounded shrink-0"><i data-lucide="${t.icon}" class="w-4 h-4"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="font-bold text-sm text-slate-800 group-hover:text-${g.color}-700">${t.title}</div>
                    <div class="text-xs text-slate-500">${t.desc}</div>
                </div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-${g.color}-400 shrink-0 ml-auto"></i>
            </a>`).join('');
        return `
            <div class="mb-5">
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">${g.label}</div>
                <p class="text-xs text-slate-500 mb-2">${g.desc}</p>
                <div class="space-y-2">${toolsHtml}</div>
            </div>`;
    }).join('');

    container.innerHTML = `
        <div class="animate-fade-in">
            <button onclick="resetCareerHub()" class="mb-4 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>
            <h3 class="font-bold text-slate-800 mb-2 flex items-center gap-2"><i data-lucide="cpu" class="w-5 h-5 text-indigo-500"></i> AI Career Tools</h3>
            <p class="text-xs text-slate-500 mb-5">AI tools can accelerate your job search — always review outputs for accuracy before sending anything.</p>
            ${groupsHtml}
        </div>
    `;
    refreshIcons();
}

window.resetCareerHub = function() {
    document.getElementById('career-hub-content').innerHTML = `
        <div class="space-y-6">
            <!-- Filters -->
            <div class="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label for="career-country-select" class="block text-[10px] font-bold text-indigo-900 mb-1">Location</label>
                    <select id="career-country-select" onchange="setGlobalCountry(this.value)" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                        <option value="all" ${activeCountry === 'all' ? 'selected' : ''}>Regional</option>
                        <option value="Kenya" ${activeCountry === 'Kenya' ? 'selected' : ''}>Kenya</option>
                        <option value="Uganda" ${activeCountry === 'Uganda' ? 'selected' : ''}>Uganda</option>
                        <option value="Tanzania" ${activeCountry === 'Tanzania' ? 'selected' : ''}>Tanzania</option>
                        <option value="Rwanda" ${activeCountry === 'Rwanda' ? 'selected' : ''}>Rwanda</option>
                        <option value="Burundi" ${activeCountry === 'Burundi' ? 'selected' : ''}>Burundi</option>
                        <option value="South Sudan" ${activeCountry === 'South Sudan' ? 'selected' : ''}>South Sudan</option>
                        <option value="DRC" ${activeCountry === 'DRC' ? 'selected' : ''}>DR Congo</option>
                        <option value="Somalia" ${activeCountry === 'Somalia' ? 'selected' : ''}>Somalia</option>
                    </select>
                </div>
                <div>
                    <label for="career-sector-select" class="block text-[10px] font-bold text-indigo-900 mb-1">Sector</label>
                    <select id="career-sector-select" onchange="setGlobalSector(this.value)" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                        <option value="agri" ${activeSectorId === 'agri' ? 'selected' : ''}>Agritech</option>
                        <option value="energy" ${activeSectorId === 'energy' ? 'selected' : ''}>Renewable Energy</option>
                        <option value="digital" ${activeSectorId === 'digital' ? 'selected' : ''}>Digital Economy</option>
                    </select>
                </div>
            </div>

            <!-- Section 1: Career Pathways -->
            <div>
                <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">1</span> Career Pathways
                </h3>
                <div class="grid grid-cols-1 gap-2.5">
                    <button onclick="showTrainingRecommendations('career-hub-content', 'resetCareerHub()')" class="p-4 bg-white border border-slate-200 border-l-4 border-l-indigo-500 rounded-xl hover:shadow-md text-left transition-all group flex items-center gap-4">
                        <div class="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><i data-lucide="git-branch" class="w-5 h-5"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 text-sm">Career Roadmaps</h4>
                            <p class="text-xs text-slate-500 mt-0.5">Step-by-step routes into top roles in your sector.</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-indigo-500"></i>
                    </button>
                </div>
            </div>

            <!-- Section 2: Work Readiness -->
            <div>
                <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">2</span> Work Readiness
                </h3>
                <div class="grid grid-cols-1 gap-2.5">
                    <button onclick="showCVResources()" class="p-4 bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-xl hover:shadow-md text-left transition-all group flex items-center gap-4">
                        <div class="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors"><i data-lucide="file-text" class="w-5 h-5"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 text-sm">CV Tools &amp; Checklists</h4>
                            <p class="text-xs text-slate-500 mt-0.5">Build an ATS-friendly CV or download ready-to-use templates.</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-blue-500"></i>
                    </button>
                    <button onclick="showCareerGuides()" class="p-4 bg-white border border-slate-200 border-l-4 border-l-blue-300 rounded-xl hover:shadow-md text-left transition-all group flex items-center gap-4">
                        <div class="p-2.5 bg-slate-100 text-slate-600 rounded-lg shrink-0 group-hover:bg-slate-600 group-hover:text-white transition-colors"><i data-lucide="library" class="w-5 h-5"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 text-sm">Career Guidance</h4>
                            <p class="text-xs text-slate-500 mt-0.5">Articles and guides to help you plan and advance your career.</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-slate-500"></i>
                    </button>
                    <button onclick="showAIToolsView()" class="p-4 bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-xl hover:shadow-md text-left transition-all group flex items-center gap-4">
                        <div class="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><i data-lucide="cpu" class="w-5 h-5"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 text-sm">AI Career Tools</h4>
                            <p class="text-xs text-slate-500 mt-0.5">AI-powered tools for CV optimisation, interview practice and job tracking.</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-indigo-500"></i>
                    </button>
                </div>
            </div>

            <!-- Section 3: Connections & Opportunities -->
            <div>
                <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-[10px] font-bold shrink-0">3</span> Connections &amp; Opportunities
                </h3>
                <div class="grid grid-cols-1 gap-2.5">
                    <button onclick="showEmployerConnectView()" class="p-4 bg-white border border-slate-200 border-l-4 border-l-sky-500 rounded-xl hover:shadow-md text-left transition-all group flex items-center gap-4">
                        <div class="p-2.5 bg-sky-50 text-sky-600 rounded-lg shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors"><i data-lucide="handshake" class="w-5 h-5"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 text-sm">Employer Connect</h4>
                            <p class="text-xs text-slate-500 mt-0.5">Hiring partners, industry associations and career fairs.</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-sky-500"></i>
                    </button>
                    <button onclick="showMentorsAlumniInHub()" class="p-4 bg-white border border-slate-200 border-l-4 border-l-sky-400 rounded-xl hover:shadow-md text-left transition-all group flex items-center gap-4">
                        <div class="p-2.5 bg-sky-50 text-sky-600 rounded-lg shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors"><i data-lucide="users" class="w-5 h-5"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 text-sm">Mentors &amp; Alumni Networks</h4>
                            <p class="text-xs text-slate-500 mt-0.5">Connect with mentors and alumni working in your field.</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-sky-500"></i>
                    </button>
                    <button onclick="showStudentNetworks()" class="p-4 bg-white border border-slate-200 border-l-4 border-l-sky-300 rounded-xl hover:shadow-md text-left transition-all group flex items-center gap-4">
                        <div class="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><i data-lucide="users" class="w-5 h-5"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 text-sm">Student &amp; Youth Networks</h4>
                            <p class="text-xs text-slate-500 mt-0.5">Communities and campus groups for students and young professionals.</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-indigo-500"></i>
                    </button>
                    <button onclick="showJobBoardView()" class="p-4 bg-white border border-slate-200 border-l-4 border-l-blue-400 rounded-xl hover:shadow-md text-left transition-all group flex items-center gap-4">
                        <div class="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors"><i data-lucide="search" class="w-5 h-5"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 text-sm">Job Boards &amp; Opportunities</h4>
                            <p class="text-xs text-slate-500 mt-0.5">Job boards, internships and volunteering opportunities.</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-blue-500"></i>
                    </button>
                </div>
            </div>

            <!-- Section 4: Labour Market Context -->
            <div>
                <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">4</span> Labour Market Context
                </h3>
                <div class="grid grid-cols-1 gap-2.5">
                    <button onclick="showMarketIntelView('sector', 'career-hub-content', 'resetCareerHub()')" class="p-4 bg-white border border-slate-200 border-l-4 border-l-slate-400 rounded-xl hover:shadow-md text-left transition-all group flex items-center gap-4">
                        <div class="p-2.5 bg-slate-100 text-slate-600 rounded-lg shrink-0 group-hover:bg-slate-600 group-hover:text-white transition-colors"><i data-lucide="line-chart" class="w-5 h-5"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 text-sm">Sector &amp; Labour Market Intelligence</h4>
                            <p class="text-xs text-slate-500 mt-0.5">Sector reports, national LMI and research on skills demand across East Africa.</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-slate-500"></i>
                    </button>
                    <button onclick="showMarketIntelView('gig', 'career-hub-content', 'resetCareerHub()')" class="p-4 bg-white border border-slate-200 border-l-4 border-l-slate-300 rounded-xl hover:shadow-md text-left transition-all group flex items-center gap-4">
                        <div class="p-2.5 bg-sky-50 text-sky-600 rounded-lg shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors"><i data-lucide="store" class="w-5 h-5"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 text-sm">Informal &amp; Gig Economy</h4>
                            <p class="text-xs text-slate-500 mt-0.5">Self-employment, platform work and informal sector pathways — where most East Africans work.</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 shrink-0 group-hover:text-sky-500"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    refreshIcons();
}

// --- NEW: Toggle More Filters in Training Hub ---

window.updateHeroStats = function() {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    if (typeof roleSkills !== 'undefined') {
        set('stat-roles', Object.keys(roleSkills).length);
        const techSkills = new Set();
        Object.values(roleSkills).forEach(r => (r.technical || []).forEach(s => techSkills.add(s)));
        set('stat-skills', techSkills.size);
    }
};

window.renderMainLanding = function() {
    const container = document.getElementById('dashboard-content');
    if (!container) return;

    container.innerHTML = `

        <!-- Section 1: Your Pathway — white background -->
        <div class="bg-white py-16 sm:py-20 animate-fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="text-center mb-10">
                    <div class="text-[17px] font-semibold text-slate-400 uppercase tracking-widest mb-3">How It Works</div>
                    <h2 class="text-2xl sm:text-3xl font-bold text-[#007DBA]">Explore, Personalise, Take Action</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    <button onclick="setActiveNav('nav-sector'); toggleSectorHub()" class="flex flex-col text-left h-full bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div class="h-1.5 bg-blue-600"></div>
                        <div class="flex flex-col flex-1 p-5 sm:p-6">
                            <div class="flex items-center gap-2.5 mb-3">
                                <div class="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                    <i data-lucide="bar-chart-2" class="w-4 h-4"></i>
                                </div>
                                <h3 class="text-xs font-bold text-blue-600 uppercase tracking-wide">01 &middot; Explore Trends</h3>
                            </div>
                            <p class="text-base font-semibold text-slate-900 leading-snug mb-2">Sector Hiring Trends &amp; Opportunities</p>
                            <p class="text-sm text-slate-500 mb-4 flex-1 leading-relaxed">See live labour market data — investment flows, hiring demand, and the most in-demand occupations and entrepreneurship opportunities across Agritech, Renewable Energy, and Digital Economy.</p>
                            <div class="flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-3 transition-all">
                                Discover Trends <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </div>
                        </div>
                    </button>

                    <button onclick="setActiveNav('nav-skills'); openUnifiedHub(); renderSkillsHubDashboard()" class="flex flex-col text-left h-full bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div class="h-1.5 bg-green-600"></div>
                        <div class="flex flex-col flex-1 p-5 sm:p-6">
                            <div class="flex items-center gap-2.5 mb-3">
                                <div class="w-9 h-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                                    <i data-lucide="layers" class="w-4 h-4"></i>
                                </div>
                                <h3 class="text-xs font-bold text-green-600 uppercase tracking-wide">02 &middot; Personalise Pathway</h3>
                            </div>
                            <p class="text-base font-semibold text-slate-900 leading-snug mb-2">Learning, Skills &amp; Career Pathways</p>
                            <p class="text-sm text-slate-500 mb-4 flex-1 leading-relaxed">Take a job readiness check, identify your skills strengths and gaps, and receive a personalised training plan — or search 200+ courses by sector, skill, delivery mode, and cost.</p>
                            <div class="flex items-center gap-2 text-sm font-bold text-green-600 group-hover:gap-3 transition-all">
                                Build Skills <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </div>
                        </div>
                    </button>

                    <button onclick="setActiveNav('nav-career'); toggleCareerHub()" class="flex flex-col text-left h-full bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div class="h-1.5 bg-amber-600"></div>
                        <div class="flex flex-col flex-1 p-5 sm:p-6">
                            <div class="flex items-center gap-2.5 mb-3">
                                <div class="w-9 h-9 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                                    <i data-lucide="handshake" class="w-4 h-4"></i>
                                </div>
                                <h3 class="text-xs font-bold text-amber-600 uppercase tracking-wide">03 &middot; Enter Careers</h3>
                            </div>
                            <p class="text-base font-semibold text-slate-900 leading-snug mb-2">Careers Hub</p>
                            <p class="text-sm text-slate-500 mb-4 flex-1 leading-relaxed">Access career roadmaps, CV tools, and AI job-search assistants — then connect with employers, mentors, and alumni networks across East Africa.</p>
                            <div class="flex items-center gap-2 text-sm font-bold text-amber-600 group-hover:gap-3 transition-all">
                                Enter Careers Hub <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Section 2: Platform Features — light grey background -->
        <div class="bg-slate-50 border-t border-slate-100 py-16 sm:py-20 animate-fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="text-center mb-10">
                    <div class="text-[17px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Platform Features</div>
                    <h2 class="text-2xl sm:text-3xl font-bold text-[#007DBA]">Two complementary skills assessments</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <!-- Tool 1: dark blue header -->
                    <div class="flex flex-col rounded-xl overflow-hidden border border-slate-200">
                        <div class="bg-blue-900 p-4">
                            <div class="flex items-start gap-3">
                                <div class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                                    <i data-lucide="map" class="w-4 h-4 text-white"></i>
                                </div>
                                <div>
                                    <div class="text-[10px] font-semibold uppercase tracking-widest text-blue-200 mb-0.5">For Individuals</div>
                                    <h3 class="text-base font-bold text-white mb-1">Learning and Career Pathways</h3>
                                    <p class="text-xs text-blue-100/80 leading-relaxed">Build a step-by-step personalised learning roadmap tailored to your goals and skills strengths and gaps — starting with a quick job readiness check.</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-50 flex-1 p-4">
                            <ul class="space-y-2 mb-0">
                                <li class="flex items-start gap-2 text-sm text-slate-600"><i data-lucide="check" class="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5"></i> Take a quick job readiness check</li>
                                <li class="flex items-start gap-2 text-sm text-slate-600"><i data-lucide="check" class="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5"></i> Get your personalised skills strengths and gaps profile</li>
                                <li class="flex items-start gap-2 text-sm text-slate-600"><i data-lucide="check" class="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5"></i> Receive a tailored action plan matched to courses</li>
                            </ul>
                        </div>
                        <button onclick="openUnifiedHub(); renderSkillsHubDashboard(); openSkillsView('pp-practice')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-5 flex items-center justify-center gap-2 transition-colors">
                            Build My Pathway <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <!-- Tool 2: dark indigo header -->
                    <div class="flex flex-col rounded-xl overflow-hidden border border-slate-200">
                        <div class="bg-indigo-900 p-4">
                            <div class="flex items-start gap-3">
                                <div class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                                    <i data-lucide="clipboard-list" class="w-4 h-4 text-white"></i>
                                </div>
                                <div>
                                    <div class="text-[10px] font-semibold uppercase tracking-widest text-indigo-200 mb-0.5">For Teams &amp; Career Services</div>
                                    <h3 class="text-base font-bold text-white mb-1">Cohort &amp; Team Skills Audit</h3>
                                    <p class="text-xs text-indigo-100/80 leading-relaxed">A structured audit workflow for higher-education career services, employers, and L&amp;D teams — mapping skills strengths and gaps across a group of learners or staff.</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-50 flex-1 p-4">
                            <ul class="space-y-2 mb-0">
                                <li class="flex items-start gap-2 text-sm text-slate-600"><i data-lucide="check" class="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5"></i> Benchmark a student cohort or team against in-demand role skills</li>
                                <li class="flex items-start gap-2 text-sm text-slate-600"><i data-lucide="check" class="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5"></i> Map collective skills strengths and gaps using live labour-market data</li>
                                <li class="flex items-start gap-2 text-sm text-slate-600"><i data-lucide="check" class="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5"></i> Find group training &amp; track CPD progress</li>
                            </ul>
                        </div>
                        <button onclick="openUnifiedHub(); renderSkillsHubDashboard(); openSkillsView('pp-employer')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 px-5 flex items-center justify-center gap-2 transition-colors">
                            Audit My Team or Cohort <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section 3: Who Is This For — white background -->
        <div class="bg-white border-t border-slate-100 py-16 sm:py-20 animate-fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="text-center mb-10">
                    <div class="text-[17px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Who Is This For</div>
                    <h2 class="text-2xl sm:text-3xl font-bold text-[#007DBA]">Built for everyone shaping a career journey</h2>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

                    <div class="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div class="w-1 shrink-0 bg-indigo-500"></div>
                        <div class="p-3 flex-1">
                            <div class="flex items-center gap-2 mb-1.5">
                                <div class="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                                    <i data-lucide="graduation-cap" class="w-3.5 h-3.5"></i>
                                </div>
                                <h4 class="text-sm font-bold text-slate-900">Students &amp; Graduates</h4>
                            </div>
                            <p class="text-xs text-slate-500 leading-relaxed">See which roles are growing, check what skills you need to get there, and build a step-by-step learning plan — from your first course to your first job.</p>
                        </div>
                    </div>

                    <div class="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div class="w-1 shrink-0 bg-blue-500"></div>
                        <div class="p-3 flex-1">
                            <div class="flex items-center gap-2 mb-1.5">
                                <div class="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                    <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
                                </div>
                                <h4 class="text-sm font-bold text-slate-900">Career Specialists</h4>
                            </div>
                            <p class="text-xs text-slate-500 leading-relaxed">Pull up live sector trends, map a student's skills strengths and gaps, and share a step-by-step career pathway — all within a single advising session.</p>
                        </div>
                    </div>

                    <div class="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div class="w-1 shrink-0 bg-green-500"></div>
                        <div class="p-3 flex-1">
                            <div class="flex items-center gap-2 mb-1.5">
                                <div class="w-7 h-7 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                                    <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                                </div>
                                <h4 class="text-sm font-bold text-slate-900">Educators &amp; Trainers</h4>
                            </div>
                            <p class="text-xs text-slate-500 leading-relaxed">See what employers are demanding right now, spot gaps in your current course offer, and design training that places graduates in roles that are actually hiring.</p>
                        </div>
                    </div>

                    <div class="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div class="w-1 shrink-0 bg-amber-500"></div>
                        <div class="p-3 flex-1">
                            <div class="flex items-center gap-2 mb-1.5">
                                <div class="w-7 h-7 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                                    <i data-lucide="briefcase" class="w-3.5 h-3.5"></i>
                                </div>
                                <h4 class="text-sm font-bold text-slate-900">Employers</h4>
                            </div>
                            <p class="text-xs text-slate-500 leading-relaxed">Pinpoint the skills your teams need, find accredited providers who can build them, and back your workforce decisions with live labour market data.</p>
                        </div>
                    </div>

                    <div class="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div class="w-1 shrink-0 bg-slate-400"></div>
                        <div class="p-3 flex-1">
                            <div class="flex items-center gap-2 mb-1.5">
                                <div class="w-7 h-7 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
                                    <i data-lucide="landmark" class="w-3.5 h-3.5"></i>
                                </div>
                                <h4 class="text-sm font-bold text-slate-900">Policymakers</h4>
                            </div>
                            <p class="text-xs text-slate-500 leading-relaxed">Spot where jobs are growing fastest, compare training supply against demand across eight countries, and direct investment to the skills strengths and gaps that matter most.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- WhatsApp Callout Strip -->
        <div class="bg-[#0E4280] py-8 px-4 sm:px-6 animate-fade-in">
            <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                        <i data-lucide="message-circle" class="w-5 h-5 text-white"></i>
                    </div>
                    <div>
                        <p class="text-white font-bold text-sm sm:text-base">Also built for WhatsApp-first users</p>
                        <p class="text-blue-200 text-xs sm:text-sm mt-0.5">Share your career plan directly via WhatsApp — or install the Compass as an app and access it offline, even on a 2G connection.</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <span class="text-[10px] font-semibold uppercase tracking-widest text-blue-300">WhatsApp career guidance bot &mdash; coming soon</span>
                </div>
            </div>
        </div>

        <!-- Feedback link — mobile only -->
        <div class="py-6 flex justify-center w-full animate-fade-in md:hidden bg-white border-t border-slate-100">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLScMkRMgF8TE-nr_xvRuCZ5nF1H-J3uQiM4_-TBUbPycxFQv9Q/viewform?usp=header" target="_blank" class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all">
                <i data-lucide="message-square" class="w-4 h-4"></i> Share Feedback
            </a>
        </div>
    `;
    refreshIcons();
}

window.generateUserInsight = function(userType) {
    // Close drawer to show modal
    toggleUsersDrawer();
    
    const modal = document.getElementById('resource-modal');
    const panel = document.getElementById('resource-modal-panel');
    const titleEl = document.getElementById('resource-modal-title');
    const contentEl = document.getElementById('resource-modal-content');
    
    const sector = activeSectorId;
    const country = activeCountry;
    const sectorName = sector === 'agri' ? 'Agritech' : sector === 'energy' ? 'Renewable Energy' : 'Digital Economy';
    
    let title = "";
    let content = "";
    
    if (userType === 'graduates') {
        title = "Graduate Insights: " + sectorName;
        const skills = dataManager.getSkills(sector) || [];
        const hotSkills = skills.filter(s => s.isHot).slice(0, 3).map(s => s.name).join(", ") || "Data Analysis, Project Management";
        const occs = dataManager.getOccupations(sector, country) || [];
        const entryRoles = occs.slice(0, 3).map(o => o.name).join(", ") || "Entry Level Roles";
        
        content = `
            <div class="space-y-4">
                <div class="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <h4 class="font-bold text-sm text-blue-800 mb-1">&#x1F680; High Growth Opportunities</h4>
                    <p class="text-xs text-blue-700">In ${country === 'all' ? 'East Africa' : country}, the ${sectorName} sector is actively hiring for: <strong>${entryRoles}</strong>.</p>
                </div>
                <div class="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <h4 class="font-bold text-sm text-indigo-800 mb-1">&#x1F525; Skills in Demand</h4>
                    <p class="text-xs text-indigo-700">Employers are looking for proficiency in: <strong>${hotSkills}</strong>.</p>
                </div>
                <button onclick="openUnifiedHub('pp-practice')" class="w-full py-2 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800 transition-colors">Build Your Pathway</button>
            </div>
        `;
    } else if (userType === 'specialists') {
        title = "Career Specialist Brief: " + sectorName;
        content = `
            <div class="space-y-4">
                <div class="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <h4 class="font-bold text-sm text-blue-800 mb-1">&#x1F4C8; Market Trends</h4>
                    <p class="text-xs text-blue-700">The ${sectorName} sector shows strong demand for hybrid roles combining technical skills with soft skills like communication and project management.</p>
                </div>
                <div class="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <h4 class="font-bold text-sm text-amber-800 mb-1">⚠️ Guidance Gap</h4>
                    <p class="text-xs text-amber-700">Students often lack awareness of "middle-skill" technical roles which offer faster employment routes than general degrees.</p>
                </div>
                <button onclick="showMarketIntelView('sector')" class="w-full py-2 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800 transition-colors">View Labor Market Data</button>
            </div>
        `;
    } else if (userType === 'educators') {
        title = "Educator Intelligence: " + sectorName;
        content = `
            <div class="space-y-4">
                <div class="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <h4 class="font-bold text-sm text-indigo-800 mb-1">&#x1F393; Curriculum Alignment</h4>
                    <p class="text-xs text-indigo-700">Industry feedback suggests current curricula may under-emphasize practical application of: <strong>Data Analysis, Regulatory Compliance, and Safety Protocols</strong>.</p>
                </div>
                <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <h4 class="font-bold text-sm text-slate-800 mb-1">&#x1F6E0;&#xFE0F; Recommended Updates</h4>
                    <p class="text-xs text-slate-600">Consider integrating micro-credentials for specific tools (e.g., GIS, Python, AutoCAD) into degree programs.</p>
                </div>
            </div>
        `;
    } else if (userType === 'employers') {
        title = "Employer Snapshot: " + sectorName;
        const courseCount = dataManager.courses.filter(c => c.sector === sector || c.sector === 'all').length;
        content = `
            <div class="space-y-4">
                <div class="p-3 bg-sky-50 border border-sky-100 rounded-lg">
                    <h4 class="font-bold text-sm text-sky-800 mb-1">&#x1F465; Talent Pipeline</h4>
                    <p class="text-xs text-sky-700">There are currently <strong>${courseCount}+</strong> active training programs in the region producing talent relevant to your sector.</p>
                </div>
                <div class="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <h4 class="font-bold text-sm text-amber-800 mb-1">&#x1F91D; Partnership Opportunity</h4>
                    <p class="text-xs text-amber-700">Training providers are seeking industry partners for Work-Integrated Learning (internships/apprenticeships) to improve graduate readiness.</p>
                </div>
                <button onclick="showTrainingHubView('featured')" class="w-full py-2 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800 transition-colors">Find Training Partners</button>
            </div>
        `;
    } else if (userType === 'policymakers') {
        title = "Policy Brief: " + sectorName;
        content = `
            <div class="space-y-4">
                <div class="p-3 bg-slate-100 border border-slate-200 rounded-lg">
                    <h4 class="font-bold text-sm text-slate-800 mb-1">&#x1F4CA; Regional Competitiveness</h4>
                    <p class="text-xs text-slate-600">Investment in ${sectorName} skills is critical for achieving national development goals. Current training density is concentrated in urban centers, suggesting a need for rural TVET expansion.</p>
                </div>
                <div class="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <h4 class="font-bold text-sm text-red-800 mb-1">&#x1F6A8; Strategic Intervention</h4>
                    <p class="text-xs text-red-700">Harmonization of certification standards across the EAC would significantly boost labor mobility.</p>
                </div>
            </div>
        `;
    }

    titleEl.innerText = title;
    contentEl.innerHTML = content;
    
    document.body.classList.add('overflow-hidden');
    modal.classList.remove('hidden');
    setTimeout(() => { panel.classList.remove('scale-95', 'opacity-0'); panel.classList.add('scale-100', 'opacity-100'); }, 10);
    refreshIcons();
}
window.injectAboutDrawer = function() {
    if (document.getElementById('about-drawer')) return;

    const drawer = document.createElement('div');
    drawer.id = 'about-drawer';
    drawer.className = 'fixed inset-y-0 left-0 w-80 bg-white shadow-2xl transform -translate-x-full transition-transform duration-300 z-[70] overflow-y-auto flex flex-col';
    
    drawer.innerHTML = `
        <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <i data-lucide="info" class="w-5 h-5 text-indigo-600"></i> About
            </h2>
            <button onclick="toggleAboutDrawer()" class="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <i data-lucide="x" class="w-5 h-5 text-slate-500"></i>
            </button>
        </div>
        <div class="p-5 space-y-5 flex-1 overflow-y-auto min-h-0">
            <div class="flex items-center gap-3 mb-1">
                <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <i data-lucide="compass" class="w-5 h-5 text-white"></i>
                </div>
                <div>
                    <div class="font-bold text-sm text-slate-800 leading-tight">Skills2Careers Compass</div>
                </div>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
                A mobile-first navigation tool connecting labour market intelligence with practical career guidance for young people across East Africa's three fastest-growing sectors: Agritech, Renewable Energy, and the Digital Economy.
            </p>
            <a href="https://unevoc.unesco.org/home/Global+Skills+Tracker" target="_blank" class="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors group">
                <div class="flex items-center gap-2.5">
                    <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded group-hover:bg-indigo-200 transition-colors shrink-0"><i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i></div>
                    <div>
                        <div class="text-xs font-bold text-indigo-800">Visit the Global Skills Tracker</div>
                        <div class="text-[10px] text-indigo-500">UNESCO &middot; unevoc.unesco.org</div>
                    </div>
                </div>
                <i data-lucide="external-link" class="w-3.5 h-3.5 text-indigo-300 group-hover:text-indigo-500 shrink-0"></i>
            </a>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLScMkRMgF8TE-nr_xvRuCZ5nF1H-J3uQiM4_-TBUbPycxFQv9Q/viewform?usp=header" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group">
                <div class="p-2 bg-indigo-50 text-indigo-600 rounded shrink-0"><i data-lucide="message-square" class="w-4 h-4"></i></div>
                <div>
                    <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700">Share Feedback</div>
                    <div class="text-xs text-slate-500">Help us improve the Compass.</div>
                </div>
            </a>
        </div>
    `;
    document.body.appendChild(drawer);
}

window.injectObservatoryDrawer = function() {
    if (document.getElementById('observatory-drawer')) return;
    const drawer = document.createElement('div');
    drawer.id = 'observatory-drawer';
    drawer.className = 'fixed inset-y-0 right-0 w-full md:w-[820px] bg-white shadow-2xl transform translate-x-full transition-transform duration-300 z-[95] flex flex-col';
    drawer.innerHTML = `
        <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i data-lucide="activity" class="w-5 h-5 text-indigo-600"></i> Sector Intelligence Observatory
            </h2>
            <button onclick="toggleObservatoryDrawer()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <i data-lucide="x" class="w-5 h-5 text-slate-500"></i>
            </button>
        </div>
        <div class="p-4 space-y-4 flex-1 overflow-y-auto min-h-0 overscroll-y-contain bg-slate-50/50">
            <div id="observatory-content"></div>
        </div>
    `;
    document.body.appendChild(drawer);
}

window.observatorySectors = window.observatorySectors || new Set(['agri', 'energy', 'digital']);
let _observatoryTab = 'market';

window.toggleObservatoryTab = function(tab) {
    _observatoryTab = tab;
    renderObservatoryView();
};

window.renderObservatoryView = function() {
    const container = document.getElementById('observatory-content');
    if (!container) return;

    const allSectors = ['agri', 'energy', 'digital'];
    const sectorNames  = { agri: 'Agritech', energy: 'Renewable Energy', digital: 'Digital Economy' };
    const sectorColors = { agri: 'green',    energy: 'orange',           digital: 'indigo' };
    const sectorIcons  = { agri: 'leaf',      energy: 'zap',              digital: 'cpu' };
    const country = activeCountry;
    const activeSectors = allSectors.filter(s => observatorySectors.has(s));

    const eacCountries = [
        { val: 'all', label: 'All EAC Countries' },
        { val: 'Kenya', label: 'Kenya' },
        { val: 'Tanzania', label: 'Tanzania' },
        { val: 'Uganda', label: 'Uganda' },
        { val: 'Rwanda', label: 'Rwanda' },
        { val: 'Burundi', label: 'Burundi' },
        { val: 'Ethiopia', label: 'Ethiopia' },
        { val: 'South Sudan', label: 'South Sudan' },
        { val: 'DRC', label: 'DRC' },
        { val: 'Somalia', label: 'Somalia' },
    ];

    const demandColor = d => {
        if (['Critical','High','Growing'].includes(d)) return 'text-blue-700 bg-blue-50 border-blue-200';
        if (d === 'Emerging') return 'text-indigo-700 bg-indigo-50 border-indigo-200';
        if (d === 'Stable')   return 'text-amber-700 bg-amber-50 border-amber-200';
        return 'text-slate-600 bg-slate-50 border-slate-200';
    };

    const sd = {};
    allSectors.forEach(s => {
        const base = baseSectorDetailData[s];
        const ov = (typeof countryOverrides !== 'undefined' && countryOverrides[country] && countryOverrides[country][s]) || {};
        sd[s] = {
            jobTrend:     ov.jobTrend     || base.growth.jobTrend,
            investment:   ov.investment   || base.growth.investment,
            demand:       ov.skillsDemand || base.growth.skillsDemand,
            demandCtx:    ov.demandContext || base.growth.demandContext,
            hotspots:     ov.hotspots     || base.outlook.hotspots,
            hiring:       ov.hiring       || base.outlook.hiring,
            source:       ov.source       || base.outlook.source,
            topOccs:      base.occupations.filter(o => o.isHot).slice(0, 3).map(o => o.name),
            topSkills:    base.skills.filter(sk => sk.isHot).slice(0, 4).map(sk => sk.name),
        };
    });

    const sectorCardHtml = s => {
        const c = sectorColors[s];
        const d = sd[s];
        return `
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div class="h-1.5 bg-${c}-500"></div>
            <div class="p-4 flex-1 space-y-3">
                <div class="flex items-center gap-2">
                    <div class="p-1.5 bg-${c}-50 text-${c}-600 rounded-lg shrink-0"><i data-lucide="${sectorIcons[s]}" class="w-4 h-4"></i></div>
                    <span class="text-sm font-bold text-slate-800">${sectorNames[s]}</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Growth</div>
                        <div class="text-base font-bold text-${c}-600">${d.jobTrend}</div>
                    </div>
                    <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Demand</div>
                        <span class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${demandColor(d.demand)}">${d.demand}</span>
                    </div>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Investment Signal</div>
                    <div class="text-xs font-semibold text-slate-700">${d.investment}</div>
                </div>
                <div>
                    <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Hot Occupations</div>
                    <div class="space-y-1">
                        ${d.topOccs.map(o => `<div class="text-[11px] text-slate-600 flex items-center gap-1.5"><div class="w-1 h-1 rounded-full bg-${c}-400 shrink-0"></div>${o}</div>`).join('')}
                    </div>
                </div>
                <div>
                    <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">In-Demand Skills</div>
                    <div class="flex flex-wrap gap-1">
                        ${d.topSkills.map(sk => `<span class="text-[10px] bg-${c}-50 text-${c}-700 border border-${c}-100 px-1.5 py-0.5 rounded-full">${sk}</span>`).join('')}
                    </div>
                </div>
                <div class="pt-2 border-t border-slate-100">
                    <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Where Hiring</div>
                    <div class="text-[11px] text-slate-500">${d.hotspots}</div>
                </div>
            </div>
        </div>`;
    };

    const countryOptions = eacCountries.map(({ val, label }) =>
        `<option value="${val}" ${val === country ? 'selected' : ''}>${label}</option>`
    ).join('');

    const sectorToggleHtml = allSectors.map(s => {
        const c = sectorColors[s];
        const isActive = observatorySectors.has(s);
        return isActive
            ? `<button onclick="toggleObservatorySector('${s}')" class="px-3 py-1 text-[11px] font-bold rounded-lg border bg-${c}-600 text-white border-${c}-600 transition-colors">${sectorNames[s]}</button>`
            : `<button onclick="toggleObservatorySector('${s}')" class="px-3 py-1 text-[11px] font-bold rounded-lg border bg-white text-${c}-700 border-${c}-200 hover:bg-${c}-50 transition-colors">${sectorNames[s]}</button>`;
    }).join('');

    const gridCols = activeSectors.length === 1 ? 'grid-cols-1' : activeSectors.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3';

    // ── Tab navigation ───────────────────────────────────────────────────────────
    const obsTabs = [
        { id: 'market',    label: 'Market Signals',    icon: 'bar-chart-3'  },
        { id: 'supply',    label: 'Supply vs Demand',  icon: 'git-compare'  },
        { id: 'providers', label: 'Provider Landscape',icon: 'building-2'   },
        { id: 'regional',  label: 'Regional Access',   icon: 'map-pin'      },
        { id: 'coverage',  label: 'Skills Coverage',   icon: 'grid-3x3'     },
    ];
    const tabNavHtml = obsTabs.map(t => {
        const active = _observatoryTab === t.id;
        return `<button onclick="toggleObservatoryTab('${t.id}')" class="shrink-0 flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold rounded-lg border transition-colors whitespace-nowrap ${active ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}">
            <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i> ${t.label}
        </button>`;
    }).join('');

    // ── Tab content ──────────────────────────────────────────────────────────────
    let tabContentHtml = '';

    if (_observatoryTab === 'market') {
        tabContentHtml = `
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <i data-lucide="bar-chart-3" class="w-4 h-4 text-indigo-500"></i>
                    <span class="text-sm font-bold text-slate-800">Market Intelligence</span>
                    <span class="text-xs text-slate-400 ml-1 hidden sm:inline">— East Africa Labour Market Signals</span>
                </div>
                <div class="p-4 space-y-5">
                    <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Annual Job Growth Rate</p>
                        <div style="height:90px"><canvas id="obs-chart-growth"></canvas></div>
                    </div>
                    <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Active Investment Signal (USD)</p>
                        <div style="height:90px"><canvas id="obs-chart-invest"></canvas></div>
                    </div>
                </div>
            </div>
            ${activeSectors.length > 0 ? `
            <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Sector-by-Sector Detail</div>
                <div class="grid ${gridCols} gap-3">
                    ${activeSectors.map(sectorCardHtml).join('')}
                </div>
            </div>` : `
            <div class="text-center py-10 text-slate-400 text-sm">
                <i data-lucide="filter-x" class="w-6 h-6 mx-auto mb-2 opacity-40"></i>
                Select at least one sector above to compare
            </div>`}`;

    } else if (_observatoryTab === 'supply') {
        tabContentHtml = `
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <i data-lucide="git-compare" class="w-4 h-4 text-indigo-500"></i>
                    <span class="text-sm font-bold text-slate-800">Training Supply vs Skills Demand</span>
                </div>
                <div class="p-4">
                    <p class="text-xs text-slate-500 mb-4">All skills shown are identified as in-demand by employers. Bars show how many courses in the database cover each skill — <span class="text-rose-500 font-semibold">red = no coverage</span>, <span class="text-amber-500 font-semibold">amber = 1–3</span>, <span class="text-sky-500 font-semibold">blue = 4–8</span>, <span class="text-green-600 font-semibold">green = 9+</span>.</p>
                    <div class="grid ${gridCols} gap-5">
                        ${activeSectors.map(s => `
                        <div>
                            <div class="flex items-center gap-1.5 mb-2">
                                <span class="w-2 h-2 rounded-full bg-${sectorColors[s]}-500 inline-block"></span>
                                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">${sectorNames[s]}</p>
                            </div>
                            <div style="height:260px"><canvas id="obs-sd-${s}"></canvas></div>
                        </div>`).join('')}
                    </div>
                </div>
            </div>`;

    } else if (_observatoryTab === 'providers') {
        tabContentHtml = `
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <i data-lucide="building-2" class="w-4 h-4 text-indigo-500"></i>
                    <span class="text-sm font-bold text-slate-800">Training Provider Landscape</span>
                </div>
                <div class="p-4">
                    <p class="text-xs text-slate-500 mb-4">Course supply broken down by provider type across sectors. The focus chart shows where global technology companies (Google, Microsoft, IBM, AWS, Cisco, Oracle) concentrate their training effort — a proxy for where commercial tech investment is shaping workforce development.</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Courses by Provider Type &amp; Sector</p>
                            <div style="height:260px"><canvas id="obs-provider-stacked"></canvas></div>
                        </div>
                        <div>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Tech Partner Training Focus</p>
                            <p class="text-[10px] text-slate-400 mb-2">Google · Microsoft · IBM · AWS · Cisco · Oracle</p>
                            <div style="height:240px"><canvas id="obs-provider-tech"></canvas></div>
                        </div>
                    </div>
                </div>
            </div>`;

    } else if (_observatoryTab === 'regional') {
        tabContentHtml = `
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <i data-lucide="map-pin" class="w-4 h-4 text-indigo-500"></i>
                    <span class="text-sm font-bold text-slate-800">Regional Access to Training</span>
                </div>
                <div class="p-4">
                    <p class="text-xs text-slate-500 mb-4">Left: locally-targeted courses per EAC country (excludes global/all-regions programmes). Right: training cost profile per sector — showing the split between free, freemium, subsidised and paid provision.</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Local Courses per Country</p>
                            <div style="height:260px"><canvas id="obs-regional-country"></canvas></div>
                        </div>
                        <div>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Cost Profile by Sector</p>
                            <div style="height:260px"><canvas id="obs-regional-cost"></canvas></div>
                        </div>
                    </div>
                </div>
            </div>`;

    } else if (_observatoryTab === 'coverage') {
        const allCrossSkills = (typeof crossSectorSkillMatrix !== 'undefined')
            ? Object.entries(crossSectorSkillMatrix)
                .filter(([, v]) => v.agri && v.energy && v.digital)
                .map(([k]) => k).sort()
            : [];
        const courses = dataManager.courses || [];
        const coverageLevel = n => {
            if (n === 0) return { bg: 'bg-rose-50',   text: 'text-rose-400',   border: 'border-rose-100',   label: '—' };
            if (n <= 3)  return { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-100',  label: String(n) };
            if (n <= 8)  return { bg: 'bg-sky-50',    text: 'text-sky-600',    border: 'border-sky-100',    label: String(n) };
            return             { bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-100',  label: String(n) };
        };
        // For cross-sector skills, count all courses that teach the skill regardless of sector tag —
        // a Python course tagged "digital" is equally valid for agritech or energy use.
        const totalBySkill = {};
        allCrossSkills.forEach(skill => {
            totalBySkill[skill] = courses.filter(c => (c.skills || []).includes(skill)).length;
        });
        const matrix = typeof crossSectorSkillMatrix !== 'undefined' ? crossSectorSkillMatrix : {};
        const tableRows = allCrossSkills.map(skill => {
            const n = totalBySkill[skill];
            const { bg, text, border, label } = coverageLevel(n);
            const mx = matrix[skill] || {};
            const appCell = sect => {
                const app = mx[sect] || '';
                return `<td class="px-3 py-2 text-[10px] text-slate-500 leading-snug border-l border-slate-100">${app}</td>`;
            };
            return `<tr class="border-t border-slate-100">
                <td class="px-3 py-2.5 text-xs text-slate-700 font-medium whitespace-nowrap">${skill}</td>
                <td class="px-3 py-2.5 text-center ${bg} border-l ${border}"><span class="text-[12px] font-bold ${text}">${label}</span></td>
                ${appCell('agri')}${appCell('energy')}${appCell('digital')}
            </tr>`;
        }).join('');
        tabContentHtml = `
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <i data-lucide="grid-3x3" class="w-4 h-4 text-indigo-500"></i>
                    <span class="text-sm font-bold text-slate-800">Skills Coverage Heatmap</span>
                </div>
                <div class="p-4">
                    <p class="text-xs text-slate-500 mb-3">Course count shows total courses teaching each skill across all sectors — cross-sector skills (Python, ML, Cloud etc.) are taught through the same courses regardless of industry context. Sector columns show how the skill applies in each context. Based on ${courses.length} courses.</p>
                    <div class="flex flex-wrap gap-3 mb-4 text-[10px] font-bold">
                        <span class="flex items-center gap-1.5 text-rose-400"><span class="w-3 h-3 rounded bg-rose-50 border border-rose-100 inline-block"></span>No courses found</span>
                        <span class="flex items-center gap-1.5 text-amber-600"><span class="w-3 h-3 rounded bg-amber-50 border border-amber-100 inline-block"></span>1–3 courses</span>
                        <span class="flex items-center gap-1.5 text-sky-600"><span class="w-3 h-3 rounded bg-sky-50 border border-sky-100 inline-block"></span>4–8 courses</span>
                        <span class="flex items-center gap-1.5 text-green-700"><span class="w-3 h-3 rounded bg-green-50 border border-green-100 inline-block"></span>9+ courses</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200">
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">Skill</th>
                                    <th class="px-3 py-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wide border-l border-slate-200 whitespace-nowrap">Courses</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-green-600 uppercase tracking-wide border-l border-slate-200">Agritech Application</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-orange-600 uppercase tracking-wide border-l border-slate-200">Energy Application</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-indigo-600 uppercase tracking-wide border-l border-slate-200">Digital Application</th>
                                </tr>
                            </thead>
                            <tbody>${tableRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    // ── Assemble ─────────────────────────────────────────────────────────────────
    container.innerHTML = `
        <div class="space-y-5 animate-fade-in">
            <!-- Filter bar -->
            <div class="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                <div class="flex items-center gap-3 flex-wrap">
                    <i data-lucide="map-pin" class="w-3.5 h-3.5 text-indigo-500 shrink-0"></i>
                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wide shrink-0">Country</span>
                    <select onchange="setGlobalCountry(this.value); renderObservatoryView()" class="text-xs text-slate-700 font-semibold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                        ${countryOptions}
                    </select>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wide shrink-0">Sectors</span>
                    <div class="flex flex-wrap gap-1.5">${sectorToggleHtml}</div>
                </div>
            </div>
            <!-- Tab navigation -->
            <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">${tabNavHtml}</div>
            <!-- Tab content -->
            ${tabContentHtml}
            <!-- Data & Methodology -->
            <div class="border border-slate-100 rounded-xl p-4 bg-slate-50">
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <i data-lucide="info" class="w-3 h-3"></i> Data &amp; Methodology
                </p>
                <p class="text-[11px] text-slate-500 leading-relaxed">
                    Occupation demand, skills trends and wage estimates are derived from online job vacancy analysis (2024–2026), national labour force surveys (Kenya KNBS, Uganda UBOS, Tanzania NBS, Rwanda NISR), ILO sector employment estimates, and regional sector intelligence reports including GSMA, IRENA and AGRA. Training supply data is drawn from the Skills2Careers Compass course database (${(dataManager.courses || []).length || 199} courses). Data is synthesised for the East African context and should be read as indicative of broad trends.
                </p>
            </div>
        </div>
    `;
    refreshIcons();
    if (_observatoryTab === 'market')         setTimeout(renderObservatoryCharts, 350);
    else if (_observatoryTab === 'supply')    setTimeout(() => renderObservatorySupplyDemandCharts(activeSectors), 350);
    else if (_observatoryTab === 'providers') setTimeout(renderObservatoryProviderCharts, 350);
    else if (_observatoryTab === 'regional')  setTimeout(renderObservatoryRegionalCharts, 350);
}

window.renderObservatoryCharts = function() {
    ['obs-chart-growth', 'obs-chart-invest'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { const ex = Chart.getChart(el); if (ex) ex.destroy(); }
    });

    const sectors = ['agri', 'energy', 'digital'];
    const shortLabels = ['Agritech', 'Energy', 'Digital'];
    const sectorColors = ['#4FB293', '#E4A429', '#4B6AD9'];

    // Chart 1 — Annual Job Growth Rate (horizontal bar)
    const growthVals = sectors.map(s => parseFloat(baseSectorDetailData[s].growth.jobTrend.replace(/[^0-9.]/g, '')));
    const ctx1 = document.getElementById('obs-chart-growth');
    if (ctx1) { const c1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: shortLabels,
            datasets: [{ data: growthVals, backgroundColor: sectorColors, borderRadius: 6, borderSkipped: false }]
        },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` +${c.parsed.x}% YoY` } } },
            scales: {
                x: { beginAtZero: true, max: 45, grid: { color: '#F1F4F6' }, ticks: { callback: v => `+${v}%`, font: { size: 10 } } },
                y: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
        }
    }); c1.resize(); }

    // Chart 2 — Active Investment Signal (horizontal bar, $M)
    const investVals = sectors.map(s => {
        const m = baseSectorDetailData[s].growth.investment.match(/\$(\d+)M/);
        return m ? parseInt(m[1]) : 0;
    });
    const ctx3 = document.getElementById('obs-chart-invest');
    if (ctx3) { const c3 = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: shortLabels,
            datasets: [{ data: investVals, backgroundColor: sectorColors, borderRadius: 6, borderSkipped: false }]
        },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` $${c.parsed.x}M` } } },
            scales: {
                x: { beginAtZero: true, grid: { color: '#F1F4F6' }, ticks: { callback: v => `$${v}M`, font: { size: 10 } } },
                y: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
        }
    }); c3.resize(); }
};

window.renderObservatorySupplyDemandCharts = function(activeSectors) {
    const sectors = (activeSectors && activeSectors.length) ? activeSectors : ['agri', 'energy', 'digital'];
    const courses = dataManager.courses || [];

    // Colour bars by coverage level
    const barColor = n => {
        if (n === 0) return 'rgba(251,113,133,0.75)';  // rose — gap
        if (n <= 3)  return 'rgba(251,191,36,0.75)';   // amber — limited
        if (n <= 8)  return 'rgba(56,189,248,0.75)';   // sky — moderate
        return              'rgba(74,222,128,0.75)';   // green — good
    };

    sectors.forEach(sector => {
        const el = document.getElementById(`obs-sd-${sector}`);
        if (!el) return;
        const ex = Chart.getChart(el); if (ex) ex.destroy();

        const hotSkills = ((baseSectorDetailData[sector] || {}).skills || []).filter(s => s.isHot).slice(0, 8);
        const labels = hotSkills.map(s => s.name.length > 20 ? s.name.slice(0, 19) + '…' : s.name);
        // Count all courses for this skill regardless of sector tag (cross-sector skills are in any tagged course)
        const counts = hotSkills.map(s => courses.filter(c => (c.skills || []).includes(s.name)).length);
        const colors = counts.map(barColor);

        new Chart(el, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Courses available',
                    data: counts,
                    backgroundColor: colors,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: c => ` ${c.parsed.x} course${c.parsed.x === 1 ? '' : 's'} available` } }
                },
                scales: {
                    x: { beginAtZero: true, grid: { color: '#F1F4F6' }, ticks: { font: { size: 9 }, stepSize: 5 } },
                    y: { grid: { display: false }, ticks: { font: { size: 9 } } }
                }
            }
        });
    });
};

window.renderObservatoryProviderCharts = function() {
    const categorize = p => {
        const lp = (p || '').toLowerCase();
        if (['google','microsoft','ibm','amazon','aws','cisco','oracle','meta','deeplearning','edx','linkedin','salesforce'].some(k => lp.includes(k))) return 'Tech Partners';
        if (['alx','refactory','moringa','andela','eldohub','african leadership','generation','euroafrique','trainingcred','precision field','skills for africa'].some(k => lp.includes(k))) return 'Regional Academies';
        if (['university','université','institut','college','makerere','nm-aist','strathmore'].some(k => lp.includes(k))) return 'Universities & TVET';
        return 'NGO & Development';
    };
    const providerTypes = ['Tech Partners', 'Regional Academies', 'Universities & TVET', 'NGO & Development'];
    const ptColors = ['#4B6AD9', '#4FB293', '#E4A429', '#9B59B6'];
    const courses = dataManager.courses || [];
    const sectors = ['agri', 'energy', 'digital'];
    const sectorLabels = ['Agritech', 'Energy', 'Digital'];

    const el1 = document.getElementById('obs-provider-stacked');
    if (el1) {
        const ex = Chart.getChart(el1); if (ex) ex.destroy();
        new Chart(el1, {
            type: 'bar',
            data: {
                labels: sectorLabels,
                datasets: providerTypes.map((pt, i) => ({
                    label: pt,
                    data: sectors.map(s => courses.filter(c => (c.sector === s || c.sector === 'all') && categorize(c.provider) === pt).length),
                    backgroundColor: ptColors[i], borderRadius: 2
                }))
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { font: { size: 9 }, boxWidth: 8, padding: 5 } } },
                scales: {
                    x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 } } },
                    y: { stacked: true, beginAtZero: true, grid: { color: '#F1F4F6' }, ticks: { font: { size: 9 }, stepSize: 10 } }
                }
            }
        });
    }

    const el2 = document.getElementById('obs-provider-tech');
    if (el2) {
        const ex = Chart.getChart(el2); if (ex) ex.destroy();
        const techCourses = courses.filter(c => categorize(c.provider) === 'Tech Partners');
        const techTotal = techCourses.length || 1;
        new Chart(el2, {
            type: 'doughnut',
            data: {
                labels: ['Agritech', 'Renewable Energy', 'Digital Economy'],
                datasets: [{ data: sectors.map(s => techCourses.filter(c => c.sector === s || c.sector === 'all').length), backgroundColor: ['#4FB293','#E4A429','#4B6AD9'], borderWidth: 2, borderColor: '#fff' }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 9 }, boxWidth: 10, padding: 5 } },
                    tooltip: { callbacks: { label: c => ` ${c.label}: ${c.parsed} courses (${Math.round(c.parsed / techTotal * 100)}%)` } }
                }
            }
        });
    }
};

window.renderObservatoryRegionalCharts = function() {
    const courses = dataManager.courses || [];

    const el1 = document.getElementById('obs-regional-country');
    if (el1) {
        const ex = Chart.getChart(el1); if (ex) ex.destroy();
        const eacList = ['Kenya','Tanzania','Uganda','Rwanda','Ethiopia','Burundi','South Sudan','DR Congo','Somalia'];
        const counts = eacList
            .map(c => ({ name: c, count: courses.filter(co => co.country === c || (co.country === 'DRC' && c === 'DR Congo')).length }))
            .filter(c => c.count > 0).sort((a, b) => b.count - a.count);
        new Chart(el1, {
            type: 'bar',
            data: {
                labels: counts.map(c => c.name),
                datasets: [{ data: counts.map(c => c.count), backgroundColor: '#4B6AD9', borderRadius: 4, borderSkipped: false }]
            },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.parsed.x} courses` } } },
                scales: {
                    x: { beginAtZero: true, grid: { color: '#F1F4F6' }, ticks: { font: { size: 9 }, stepSize: 2 } },
                    y: { grid: { display: false }, ticks: { font: { size: 10 } } }
                }
            }
        });
    }

    const el2 = document.getElementById('obs-regional-cost');
    if (el2) {
        const ex = Chart.getChart(el2); if (ex) ex.destroy();
        const costTypes = ['Free','Freemium','Subsidized','Paid'];
        const costColors = ['#4FB293','#4B6AD9','#9B59B6','#E4A429'];
        new Chart(el2, {
            type: 'bar',
            data: {
                labels: ['Agritech','Energy','Digital'],
                datasets: costTypes.map((ct, i) => ({
                    label: ct,
                    data: ['agri','energy','digital'].map(s => courses.filter(c => (c.sector === s || c.sector === 'all') && c.costType === ct).length),
                    backgroundColor: costColors[i], borderRadius: 2
                }))
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { font: { size: 9 }, boxWidth: 8, padding: 5 } } },
                scales: {
                    x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 } } },
                    y: { stacked: true, beginAtZero: true, grid: { color: '#F1F4F6' }, ticks: { font: { size: 9 } } }
                }
            }
        });
    }
};

window.toggleObservatorySector = function(s) {
    if (observatorySectors.has(s)) {
        if (observatorySectors.size > 1) observatorySectors.delete(s);
    } else {
        observatorySectors.add(s);
    }
    renderObservatoryView();
};

window.showAllCrossSkills = function() {
    document.querySelectorAll('.cross-extra-row').forEach(row => row.style.display = '');
    const wrap = document.getElementById('cross-show-more-wrap');
    if (wrap) wrap.innerHTML = `
        <button onclick="hideExtraCrossSkills()" class="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1.5 mx-auto">
            See less <i data-lucide="chevron-up" class="w-3.5 h-3.5"></i>
        </button>`;
    if (typeof refreshIcons === 'function') refreshIcons();
};

window.hideExtraCrossSkills = function() {
    document.querySelectorAll('.cross-extra-row').forEach(row => row.style.display = 'none');
    const wrap = document.getElementById('cross-show-more-wrap');
    if (wrap) {
        const count = wrap.dataset.extraCount || '';
        wrap.innerHTML = `
            <button onclick="showAllCrossSkills()" class="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1.5 mx-auto">
                Show ${count} more skills <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
            </button>`;
        if (typeof refreshIcons === 'function') refreshIcons();
    }
};

window.showAllTopSkills = function() {
    const extra = document.getElementById('skills-extra-cards');
    if (extra) extra.classList.remove('hidden');
    const wrap = document.getElementById('skills-show-more-wrap');
    if (wrap) wrap.innerHTML = `
        <button onclick="hideExtraTopSkills()" class="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1.5 mx-auto">
            See less <i data-lucide="chevron-up" class="w-3.5 h-3.5"></i>
        </button>`;
    if (typeof refreshIcons === 'function') refreshIcons();
};

window.hideExtraTopSkills = function() {
    const extra = document.getElementById('skills-extra-cards');
    if (extra) extra.classList.add('hidden');
    const wrap = document.getElementById('skills-show-more-wrap');
    if (wrap) {
        const count = wrap.dataset.extraCount || '';
        wrap.innerHTML = `
            <button onclick="showAllTopSkills()" class="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1.5 mx-auto">
                View ${count} more skills <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
            </button>`;
        if (typeof refreshIcons === 'function') refreshIcons();
    }
};

window.toggleObservatoryDrawer = function() {
    const drawer = document.getElementById('observatory-drawer');
    if (drawer) {
        closeAllModals('observatory-drawer');
        const isClosed = drawer.classList.contains('translate-x-full');
        if (isClosed) {
            observatorySectors = new Set(['agri', 'energy', 'digital']);
            drawer.classList.remove('translate-x-full');
            renderObservatoryView();
        } else {
            drawer.classList.add('translate-x-full');
        }
    }
    refreshIcons();
}

window.injectDataSourcesDrawer = function() {
    if (document.getElementById('data-sources-drawer')) return;

    const drawer = document.createElement('div');
    drawer.id = 'data-sources-drawer';
    drawer.className = 'fixed inset-y-0 right-0 w-full md:w-[620px] bg-white shadow-2xl transform translate-x-full transition-transform duration-300 z-[95] flex flex-col';

    drawer.innerHTML = `
        <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i data-lucide="database" class="w-5 h-5 text-indigo-600"></i> Data Sources &amp; Methodology
            </h2>
            <button onclick="toggleDataSourcesDrawer()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <i data-lucide="x" class="w-5 h-5 text-slate-500"></i>
            </button>
        </div>
        <div class="p-5 space-y-5 flex-1 overflow-y-auto min-h-0 overscroll-y-contain bg-slate-50/50">

            <p class="text-sm text-slate-500 leading-relaxed">
                The Compass draws on two primary data sources to generate occupational profiles, skills signals, and labour market intelligence across East Africa's three high-growth sectors.
            </p>

            <!-- OJA -->
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="flex items-center gap-3 p-4 border-b border-slate-100">
                    <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0"><i data-lucide="database" class="w-5 h-5"></i></div>
                    <div>
                        <div class="text-sm font-bold text-slate-800">OJA Labour-Market Signals</div>
                        <div class="text-[11px] text-slate-400">Online Job Advertisement Analytics · UNESCO UNEVOC</div>
                    </div>
                </div>
                <div class="p-4 space-y-3">
                    <p class="text-xs text-slate-600 leading-relaxed">Real-time hiring demand data extracted from online job advertisements posted across East Africa. OJA data tracks what employers are actually asking for — which occupations are growing, which skills appear most frequently in postings, and where hiring is concentrated geographically.</p>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Coverage</div>
                            <div class="text-xs text-slate-700">8 East African countries</div>
                        </div>
                        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Signals</div>
                            <div class="text-xs text-slate-700">Hiring demand, skill frequency, investment flows</div>
                        </div>
                        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Sectors</div>
                            <div class="text-xs text-slate-700">Agritech, Renewable Energy, Digital Economy</div>
                        </div>
                        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Currency</div>
                            <div class="text-xs text-slate-700">Varies by country — see in-app notes</div>
                        </div>
                    </div>
                    <a href="https://unevoc.unesco.org/home/Global+Skills+Tracker" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors group text-xs font-bold text-indigo-700">
                        <span class="flex items-center gap-2"><i data-lucide="external-link" class="w-3.5 h-3.5"></i> UNESCO Global Skills Tracker</span>
                        <span class="text-[10px] font-normal text-indigo-400">unevoc.unesco.org</span>
                    </a>
                </div>
            </div>

            <!-- ESCO -->
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="flex items-center gap-3 p-4 border-b border-slate-100">
                    <div class="p-2 bg-green-50 text-green-600 rounded-lg shrink-0"><i data-lucide="list-tree" class="w-5 h-5"></i></div>
                    <div>
                        <div class="text-sm font-bold text-slate-800">ESCO Skills Taxonomy</div>
                        <div class="text-[11px] text-slate-400">European Skills, Competences, Qualifications &amp; Occupations · European Commission</div>
                    </div>
                </div>
                <div class="p-4 space-y-3">
                    <p class="text-xs text-slate-600 leading-relaxed">ESCO provides the standardised classification framework used to define, label, and align skills and occupations across the Compass. It enables consistent comparison of skills demand across countries and sectors, and links occupational profiles to internationally recognised training and qualifications.</p>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Occupations</div>
                            <div class="text-xs text-slate-700">3,000+ structured profiles</div>
                        </div>
                        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Skills</div>
                            <div class="text-xs text-slate-700">13,000+ skills &amp; competences</div>
                        </div>
                    </div>
                    <a href="https://esco.ec.europa.eu/en" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition-colors group text-xs font-bold text-green-700">
                        <span class="flex items-center gap-2"><i data-lucide="external-link" class="w-3.5 h-3.5"></i> ESCO Portal</span>
                        <span class="text-[10px] font-normal text-green-400">esco.ec.europa.eu</span>
                    </a>
                </div>
            </div>

            <!-- Coverage note -->
            <div class="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <i data-lucide="info" class="w-4 h-4 text-amber-500 shrink-0 mt-0.5"></i>
                <div class="text-xs text-amber-800 leading-relaxed">
                    <strong>Coverage note:</strong> Data density and currency vary by country. Kenya, Rwanda and Tanzania have the strongest signal coverage. South Sudan, Burundi and Somalia have sparser data. Where national data is thin, regional East Africa aggregates are used as a proxy. In-app source tags indicate the basis for each data point.
                </div>
            </div>

        </div>
    `;
    document.body.appendChild(drawer);
}

window.toggleDataSourcesDrawer = function() {
    const drawer = document.getElementById('data-sources-drawer');
    if (drawer) {
        closeAllModals('data-sources-drawer');
        const isClosed = drawer.classList.contains('translate-x-full');
        if (isClosed) {
            drawer.classList.remove('translate-x-full');
        } else {
            drawer.classList.add('translate-x-full');
        }
    }
    refreshIcons();
}

window.injectUsersDrawer = function() {
    if (document.getElementById('users-drawer')) return;

    const drawer = document.createElement('div');
    drawer.id = 'users-drawer';
    drawer.className = 'fixed inset-y-0 right-0 w-full md:w-[680px] bg-white shadow-2xl transform translate-x-full transition-transform duration-300 z-[95] flex flex-col';

    drawer.innerHTML = `
        <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i data-lucide="users" class="w-5 h-5 text-indigo-600"></i> Who Benefits from the Compass
            </h2>
            <button onclick="toggleUsersDrawer()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <i data-lucide="x" class="w-5 h-5 text-slate-500"></i>
            </button>
        </div>
        <div class="p-5 space-y-4 flex-1 overflow-y-auto min-h-0 overscroll-y-contain bg-slate-50/50">

            <p class="text-sm text-slate-500 leading-relaxed">
                The Compass connects real-time labour market data with practical guidance across East Africa's three high-growth sectors. Here's what each audience can do with it.
            </p>

            <!-- Students -->
            <div class="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="w-1.5 shrink-0 bg-indigo-500"></div>
                <div class="p-5 flex-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                            <i data-lucide="graduation-cap" class="w-4 h-4"></i>
                        </div>
                        <h3 class="text-sm font-bold text-slate-900">Students</h3>
                    </div>
                    <p class="text-xs text-slate-500 leading-relaxed mb-3">Explore in-demand occupations, take a quick skills readiness check, and find verified training courses across Agritech, Renewable Energy and the Digital Economy.</p>
                    <div class="flex flex-wrap gap-1.5">
                        <span class="text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">Explore sector trends</span>
                        <span class="text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">Skills readiness check</span>
                        <span class="text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">Find courses</span>
                    </div>
                </div>
            </div>

            <!-- Graduates -->
            <div class="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="w-1.5 shrink-0 bg-blue-500"></div>
                <div class="p-5 flex-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                            <i data-lucide="award" class="w-4 h-4"></i>
                        </div>
                        <h3 class="text-sm font-bold text-slate-900">Graduates</h3>
                    </div>
                    <p class="text-xs text-slate-500 leading-relaxed mb-3">Map your existing skills to high-growth roles, close gaps with targeted courses, build a personalised pathway, and connect with employers across East Africa.</p>
                    <div class="flex flex-wrap gap-1.5">
                        <span class="text-[11px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">Skills-to-role mapping</span>
                        <span class="text-[11px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">Career roadmaps</span>
                        <span class="text-[11px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">Employer connections</span>
                    </div>
                </div>
            </div>

            <!-- Career Specialists -->
            <div class="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="w-1.5 shrink-0 bg-sky-500"></div>
                <div class="p-5 flex-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-9 h-9 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center shrink-0">
                            <i data-lucide="user-check" class="w-4 h-4"></i>
                        </div>
                        <h3 class="text-sm font-bold text-slate-900">Career Specialists &amp; Counsellors</h3>
                    </div>
                    <p class="text-xs text-slate-500 leading-relaxed mb-3">Access evidence-based sector intelligence and structured progression routes to support every learner — from career exploration through to job placement.</p>
                    <div class="flex flex-wrap gap-1.5">
                        <span class="text-[11px] bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-full">Team skills audit</span>
                        <span class="text-[11px] bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-full">Cohort pathway planning</span>
                        <span class="text-[11px] bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-full">Labour market data</span>
                    </div>
                </div>
            </div>

            <!-- Educators & Trainers -->
            <div class="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="w-1.5 shrink-0 bg-green-500"></div>
                <div class="p-5 flex-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-9 h-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                            <i data-lucide="book-open" class="w-4 h-4"></i>
                        </div>
                        <h3 class="text-sm font-bold text-slate-900">Educators &amp; Trainers</h3>
                    </div>
                    <p class="text-xs text-slate-500 leading-relaxed mb-3">Translate real-time skills trends into curriculum updates, micro-credential design, and modernised training offers aligned to what employers actually need.</p>
                    <div class="flex flex-wrap gap-1.5">
                        <span class="text-[11px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">Curriculum alignment</span>
                        <span class="text-[11px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">Top skills by sector</span>
                        <span class="text-[11px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">Provider directory</span>
                    </div>
                </div>
            </div>

            <!-- Employers -->
            <div class="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="w-1.5 shrink-0 bg-amber-500"></div>
                <div class="p-5 flex-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-9 h-9 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                            <i data-lucide="briefcase" class="w-4 h-4"></i>
                        </div>
                        <h3 class="text-sm font-bold text-slate-900">Employers</h3>
                    </div>
                    <p class="text-xs text-slate-500 leading-relaxed mb-3">Identify training providers, articulate skill needs to the wider ecosystem, and build stronger recruitment and partnership pipelines across the region.</p>
                    <div class="flex flex-wrap gap-1.5">
                        <span class="text-[11px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">Hiring demand data</span>
                        <span class="text-[11px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">Training providers</span>
                        <span class="text-[11px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">Occupation profiles</span>
                    </div>
                </div>
            </div>

            <!-- Policymakers -->
            <div class="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="w-1.5 shrink-0 bg-slate-400"></div>
                <div class="p-5 flex-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-9 h-9 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
                            <i data-lucide="landmark" class="w-4 h-4"></i>
                        </div>
                        <h3 class="text-sm font-bold text-slate-900">Policymakers &amp; Funders</h3>
                    </div>
                    <p class="text-xs text-slate-500 leading-relaxed mb-3">Align investments to skills in value chains poised for job growth, with comparable cross-country data across sectors to inform evidence-based workforce strategy.</p>
                    <div class="flex flex-wrap gap-1.5">
                        <span class="text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">Investment trends</span>
                        <span class="text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">Cross-country data</span>
                        <span class="text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">Sector growth outlook</span>
                    </div>
                </div>
            </div>

        </div>
    `;
    document.body.appendChild(drawer);
}

window.toggleAboutDrawer = function() {
    const drawer = document.getElementById('about-drawer');
    if (drawer) {
        closeAllModals('about-drawer');
        const isClosed = drawer.classList.contains('-translate-x-full');
        if (isClosed) {
            drawer.classList.remove('-translate-x-full');
        } else {
            drawer.classList.add('-translate-x-full');
        }
    }
    refreshIcons();
}

window.toggleUsersDrawer = function() {
    const drawer = document.getElementById('users-drawer');
    if (drawer) {
        closeAllModals('users-drawer');
        const isClosed = drawer.classList.contains('-translate-x-full');
        if (isClosed) {
            drawer.classList.remove('-translate-x-full');
        } else {
            drawer.classList.add('-translate-x-full');
        }
    }
    refreshIcons();
}

window.injectSectorDrawer = function() {
    if (document.getElementById('sector-hub-drawer')) return;

    const drawer = document.createElement('div');
    drawer.id = 'sector-hub-drawer';
    drawer.className = 'fixed inset-y-0 right-0 w-full md:w-[800px] bg-white shadow-2xl transform translate-x-full transition-transform duration-300 z-[95] flex flex-col';
    
    drawer.innerHTML = `
        <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i data-lucide="bar-chart-2" class="w-5 h-5 text-indigo-600"></i> Sector Trends, Occupations &amp; Skills in Demand
            </h2>
            <button onclick="toggleSectorHub()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <i data-lucide="x" class="w-5 h-5 text-slate-500"></i>
            </button>
        </div>
        <div class="p-4 space-y-4 flex-1 overflow-y-auto min-h-0 overscroll-y-contain bg-slate-50/50">
            <!-- Navigation & Explanation -->
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div>
                    <h3 class="text-base font-bold text-slate-800 mb-1">Navigate High Growth Sectors</h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                        Select a sector and country to explore live labour market intelligence — hiring demand, investment flows, in-demand occupations, top skills sought by employers, and entrepreneurship opportunities.
                    </p>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Sector</label>
                        <select onchange="setGlobalSector(this.value)" id="sector-hub-sector-select" class="w-full text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="agri" ${activeSectorId === 'agri' ? 'selected' : ''}>Agritech</option>
                            <option value="energy" ${activeSectorId === 'energy' ? 'selected' : ''}>Renewable Energy</option>
                            <option value="digital" ${activeSectorId === 'digital' ? 'selected' : ''}>Digital Economy</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Region</label>
                        <select onchange="setGlobalCountry(this.value)" id="sector-hub-country" class="w-full text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="all" ${activeCountry === 'all' ? 'selected' : ''}>Regional (East Africa)</option>
                            <option value="Kenya" ${activeCountry === 'Kenya' ? 'selected' : ''}>Kenya</option>
                            <option value="Uganda" ${activeCountry === 'Uganda' ? 'selected' : ''}>Uganda</option>
                            <option value="Tanzania" ${activeCountry === 'Tanzania' ? 'selected' : ''}>Tanzania</option>
                            <option value="Rwanda" ${activeCountry === 'Rwanda' ? 'selected' : ''}>Rwanda</option>
                            <option value="Burundi" ${activeCountry === 'Burundi' ? 'selected' : ''}>Burundi</option>
                            <option value="South Sudan" ${activeCountry === 'South Sudan' ? 'selected' : ''}>South Sudan</option>
                            <option value="DRC" ${activeCountry === 'DRC' ? 'selected' : ''}>DR Congo</option>
                            <option value="Somalia" ${activeCountry === 'Somalia' ? 'selected' : ''}>Somalia</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Results -->
            <div id="sector-hub-results">
                <!-- Dashboard Content Injected Here -->
            </div>
        </div>
    `;
    document.body.appendChild(drawer);
}

window.toggleSectorHub = function() {
    closeAllModals('sector-hub-drawer');
    const drawer = document.getElementById('sector-hub-drawer');
    if (drawer) {
        drawer.classList.toggle('translate-x-full');
        if (!drawer.classList.contains('translate-x-full')) {
            // Ensure content is rendered when opening
            renderOccupationsView();
        }
    }
    refreshIcons();
}

// ─── Course Submission Drawer ────────────────────────────────────────────────

window.injectCourseSubmissionDrawer = function() {
    if (document.getElementById('course-submission-drawer')) return;
    const drawer = document.createElement('div');
    drawer.id = 'course-submission-drawer';
    drawer.className = 'fixed inset-y-0 right-0 w-full md:w-[680px] bg-white shadow-2xl transform translate-x-full transition-transform duration-300 z-[96] flex flex-col';
    drawer.innerHTML = `
        <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i data-lucide="plus-circle" class="w-5 h-5 text-teal-600"></i> Submit a Course or Programme
            </h2>
            <button onclick="toggleCourseSubmission()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <i data-lucide="x" class="w-5 h-5 text-slate-500"></i>
            </button>
        </div>
        <div class="flex-1 overflow-y-auto min-h-0 overscroll-y-contain bg-slate-50/50">
            <div class="p-5 space-y-5">

                <!-- Intro -->
                <div class="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <div class="text-sm font-bold text-teal-800 mb-1">For Training Institutions &amp; Universities</div>
                    <p class="text-xs text-teal-700 leading-relaxed">Fill in the details below to generate a formatted course entry. You can then submit it to the Skills2Careers Compass database via a GitLab merge request — once reviewed by the UNESCO team, it will appear on the platform for all users.</p>
                </div>

                <!-- Form -->
                <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                    <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course Details</div>

                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Course / Programme Name *</label>
                            <input id="csub-name" type="text" placeholder="e.g. Certificate in Agritech Innovation" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Provider / Institution Name *</label>
                            <input id="csub-provider" type="text" placeholder="e.g. Makerere University" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Course URL *</label>
                            <input id="csub-url" type="url" placeholder="https://..." class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Short Description *</label>
                            <textarea id="csub-desc" rows="3" placeholder="What will learners gain? Who is it for?" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"></textarea>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Sector *</label>
                            <select id="csub-sector" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                                <option value="all">All Sectors</option>
                                <option value="agri">Agriculture &amp; Agritech</option>
                                <option value="energy">Renewable Energy</option>
                                <option value="digital">Digital Economy</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Country</label>
                            <select id="csub-country" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                                <option value="all">All EAC Countries</option>
                                <option value="Kenya">Kenya</option>
                                <option value="Uganda">Uganda</option>
                                <option value="Tanzania">Tanzania</option>
                                <option value="Rwanda">Rwanda</option>
                                <option value="Burundi">Burundi</option>
                                <option value="South Sudan">South Sudan</option>
                                <option value="Ethiopia">Ethiopia</option>
                                <option value="Somalia">Somalia</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Course Type *</label>
                            <select id="csub-type" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                                <option value="Short Course">Short Course</option>
                                <option value="Professional Certificate">Professional Certificate</option>
                                <option value="TVET Certificate">TVET Certificate</option>
                                <option value="Degree Programme">Degree Programme</option>
                                <option value="Online Course">Online Course</option>
                                <option value="Workshop">Workshop / Bootcamp</option>
                                <option value="Postgraduate">Postgraduate</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Level</label>
                            <select id="csub-level" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                                <option value="low">Beginner</option>
                                <option value="med" selected>Intermediate</option>
                                <option value="high">Advanced</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Duration</label>
                            <input id="csub-duration" type="text" placeholder="e.g. 3 months" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Delivery Mode</label>
                            <select id="csub-mode" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                                <option value="Online">Online</option>
                                <option value="In-person">In-person</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Cost Model</label>
                            <select id="csub-costtype" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                                <option value="Free">Free</option>
                                <option value="Freemium">Freemium (free audit available)</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Cost / Fee</label>
                            <input id="csub-cost" type="text" placeholder="e.g. Free / $200 / KES 5,000" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">Skills Covered <span class="font-normal text-slate-400">(comma-separated)</span></label>
                        <input id="csub-skills" type="text" placeholder="e.g. Python, Data Analysis, GIS Mapping" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Language of Instruction</label>
                            <select id="csub-lang" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                                <option value="English">English</option>
                                <option value="French">French</option>
                                <option value="Swahili">Swahili</option>
                                <option value="English / French">English / French</option>
                                <option value="English / Swahili">English / Swahili</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Prerequisites</label>
                            <input id="csub-prereq" type="text" placeholder="e.g. Secondary school certificate" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                        </div>
                    </div>

                    <button onclick="generateCourseJson()" class="w-full py-2.5 bg-teal-600 text-white font-bold rounded-xl text-sm hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 mt-2">
                        <i data-lucide="code-2" class="w-4 h-4"></i> Generate Course Entry
                    </button>
                </div>

                <!-- JSON Output -->
                <div id="csub-output" class="hidden">
                    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <div class="flex items-center justify-between px-4 py-3 bg-slate-800 text-white">
                            <span class="text-xs font-bold font-mono">courses.json entry — ready to submit</span>
                            <button onclick="copyCourseJson()" class="text-xs bg-teal-500 hover:bg-teal-400 text-white px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1">
                                <i data-lucide="copy" class="w-3 h-3"></i> Copy
                            </button>
                        </div>
                        <pre id="csub-json" class="text-xs text-slate-700 p-4 overflow-x-auto font-mono leading-relaxed bg-slate-50 whitespace-pre-wrap"></pre>
                    </div>

                    <!-- Submission instructions -->
                    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                        <div class="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5"><i data-lucide="git-branch" class="w-3.5 h-3.5"></i> How to submit to the platform</div>
                        <div class="bg-amber-100 rounded-lg px-3 py-2 mb-3 text-xs text-amber-800"><strong>Note:</strong> The <code class="bg-amber-200 px-1 rounded">id</code> field is set to a draft placeholder (e.g. <code class="bg-amber-200 px-1 rounded">a_draft</code>). The UNESCO reviewer should replace it with the next sequential ID in the file — e.g. <code class="bg-amber-200 px-1 rounded">a6</code> for agri, <code class="bg-amber-200 px-1 rounded">e7</code> for energy, <code class="bg-amber-200 px-1 rounded">d13</code> for digital, <code class="bg-amber-200 px-1 rounded">x11</code> for cross-sector.</div>
                        <ol class="text-xs text-amber-700 space-y-1.5 leading-relaxed">
                            <li class="flex gap-2"><span class="font-bold flex-shrink-0">1.</span>Copy the JSON entry above</li>
                            <li class="flex gap-2"><span class="font-bold flex-shrink-0">2.</span>Go to the Skills2Careers Compass repository: <span class="font-mono bg-amber-100 px-1 rounded">repository.unesco.org/gitlab/EDU/skills2careers-compass</span></li>
                            <li class="flex gap-2"><span class="font-bold flex-shrink-0">3.</span>Open the file <span class="font-mono bg-amber-100 px-1 rounded">courses.json</span> and click Edit</li>
                            <li class="flex gap-2"><span class="font-bold flex-shrink-0">4.</span>Paste your entry before the closing <span class="font-mono bg-amber-100 px-1 rounded">]</span> at the end of the file (add a comma after the previous entry)</li>
                            <li class="flex gap-2"><span class="font-bold flex-shrink-0">5.</span>Click <strong>Commit changes</strong> → choose <em>Create a new branch and merge request</em></li>
                            <li class="flex gap-2"><span class="font-bold flex-shrink-0">6.</span>The UNESCO team will review and merge — your course will appear on the platform within 5 working days</li>
                        </ol>
                    </div>
                </div>

            </div>
        </div>
    `;
    document.body.appendChild(drawer);
    refreshIcons();
};

window.toggleCourseSubmission = function() {
    closeAllModals('course-submission-drawer');
    const drawer = document.getElementById('course-submission-drawer');
    if (drawer) {
        drawer.classList.toggle('translate-x-full');
        refreshIcons();
    }
};

window.generateCourseJson = function() {
    const name = document.getElementById('csub-name').value.trim();
    const provider = document.getElementById('csub-provider').value.trim();
    const url = document.getElementById('csub-url').value.trim();
    const desc = document.getElementById('csub-desc').value.trim();

    if (!name || !provider || !url || !desc) {
        alert('Please fill in all required fields (marked with *).');
        return;
    }

    const skillsRaw = document.getElementById('csub-skills').value;
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    const sectorPrefix = { agri: 'a', energy: 'e', digital: 'd', all: 'x' }[document.getElementById('csub-sector').value] || 'x';
    const entry = {
        id: sectorPrefix + '_draft',
        name,
        provider,
        type: document.getElementById('csub-type').value,
        level: document.getElementById('csub-level').value,
        duration: document.getElementById('csub-duration').value.trim() || 'Contact provider',
        difficulty: { low: 'Beginner', med: 'Intermediate', high: 'Advanced' }[document.getElementById('csub-level').value],
        cost: document.getElementById('csub-cost').value.trim() || 'Contact provider',
        costType: document.getElementById('csub-costtype').value,
        mode: document.getElementById('csub-mode').value,
        sector: document.getElementById('csub-sector').value,
        skills,
        url,
        country: document.getElementById('csub-country').value,
        description: desc,
        language: document.getElementById('csub-lang').value,
        prerequisites: document.getElementById('csub-prereq').value.trim() || 'None',
        gsa_member: false,
        tracerAvailable: false,
        lastUpdated: new Date().getFullYear().toString()
    };

    const json = JSON.stringify(entry, null, 2);
    document.getElementById('csub-json').textContent = json;
    document.getElementById('csub-output').classList.remove('hidden');
    document.getElementById('csub-output').scrollIntoView({ behavior: 'smooth' });
    refreshIcons();
};

window.copyCourseJson = function() {
    const json = document.getElementById('csub-json').textContent;
    navigator.clipboard.writeText(json).then(() => {
        const btn = document.querySelector('button[onclick="copyCourseJson()"]');
        if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.innerHTML = '<i data-lucide="copy" class="w-3 h-3 inline mr-1"></i>Copy'; refreshIcons(); }, 2000); }
    });
};

