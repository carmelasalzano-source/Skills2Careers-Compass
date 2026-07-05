// toggleMoreFilters is defined in render-sectors.js (loads last, wins at runtime)

window.clearOneFilter = function(filterId) {
    var el = document.getElementById(filterId);
    if (!el) return;
    if (filterId === 'filter-search') el.value = '';
    else if (filterId === 'filter-sort') el.value = 'default';
    else el.value = 'all';
    renderProviderTable();
}

window.saveCourseToMyPlan = function(safeId) {
    var courses = dataManager.courses && dataManager.courses.length > 0 ? dataManager.courses : (typeof realCourses !== 'undefined' ? realCourses : []);
    var course = courses.find(function(c) { return c.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() === safeId; });
    if (!course) return;
    var courseName = course.name;
    var isSaved = myPlan.courses.has(courseName);
    if (isSaved) { myPlan.courses.delete(courseName); } else { myPlan.courses.add(courseName); }
    if (typeof saveMyPlan === 'function') saveMyPlan();
    if (typeof updatePlanBadge === 'function') updatePlanBadge();
    var nowSaved = myPlan.courses.has(courseName);
    document.querySelectorAll('[data-plan-id="' + safeId + '"]').forEach(function(btn) {
        btn.innerHTML = '<i data-lucide="' + (nowSaved ? 'bookmark-check' : 'bookmark') + '" class="w-3 h-3"></i>';
        btn.title = nowSaved ? 'Saved to Plan' : 'Save to Plan';
        btn.className = btn.className.replace(/\btext-(?:slate-300|indigo-500)\b/g, '') + (nowSaved ? ' text-indigo-500' : ' text-slate-300 hover:text-indigo-500');
    });
    refreshIcons();
}

window.renderActiveFilterChips = function() {
    var chipsEl = document.getElementById('active-filter-chips');
    if (!chipsEl) return;
    var defs = [
        { id: 'filter-skill', label: 'Skill', special: { 'ai_special': 'AI & ML', 'leadership_special': 'Leadership' } },
        { id: 'filter-country', label: 'Location' },
        { id: 'filter-difficulty', label: 'Level' },
        { id: 'filter-mode', label: 'Mode' },
        { id: 'filter-duration', label: 'Duration', display: { 'short': '<1 Month', '1-3m': '1-3 Mo', '3-6m': '3-6 Mo', '6-12m': '6-12 Mo', '1-2y': '1-2 Yrs', '2y+': '2+ Yrs' } },
        { id: 'filter-cost', label: 'Cost', display: { 'free': 'Free', 'paid': 'Paid' } },
        { id: 'filter-type', label: 'Type', display: { 'micro': 'Micro-cred', 'cert': 'Certificate', 'degree': 'Degree', 'bootcamp': 'Bootcamp', 'tvet': 'TVET', 'platform': 'Platform', 'hubs': 'Hubs' } },
        { id: 'filter-lang', label: 'Language' },
        { id: 'filter-feature', label: 'Feature', display: { 'women': 'Women-Focused' } },
        { id: 'filter-sort', label: 'Sort', display: { 'duration_asc': 'Shortest First', 'cost_asc': 'Free First', 'rating_desc': 'Top Rated' } }
    ];
    var chips = [];
    defs.forEach(function(d) {
        var el = document.getElementById(d.id);
        if (!el) return;
        var val = el.value;
        if (!val || val === 'all' || val === 'default') return;
        var displayVal = (d.special && d.special[val]) || (d.display && d.display[val]) || val;
        chips.push('<span class="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-full">' +
            d.label + ': ' + displayVal +
            ' <button onclick="clearOneFilter(\'' + d.id + '\')" class="ml-0.5 hover:text-indigo-900 font-bold leading-none">&times;</button></span>');
    });
    var searchEl = document.getElementById('filter-search');
    if (searchEl && searchEl.value.trim()) {
        var q = searchEl.value.trim();
        chips.push('<span class="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-full">' +
            'Search: &ldquo;' + q + '&rdquo;' +
            ' <button onclick="clearOneFilter(\'filter-search\')" class="ml-0.5 hover:text-indigo-900 font-bold leading-none">&times;</button></span>');
    }
    chipsEl.innerHTML = chips.length > 0
        ? '<div class="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 mt-2">' + chips.join('') + '</div>'
        : '';
}

window.clearCourseFilters = function() {
    const inputs = ['filter-search', 'filter-country', 'filter-skill', 'filter-difficulty', 'filter-duration', 'filter-mode', 'filter-cost', 'filter-type', 'filter-lang', 'filter-feature', 'filter-sort'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = id === 'filter-search' ? '' : (id === 'filter-sort' ? 'default' : 'all');
    });
    renderProviderTable();
}

// Helper to parse duration string to months
function parseDuration(dur) {
    if (!dur) return null;
    dur = dur.toLowerCase();
    const match = dur.match(/[\d\.]+/);
    if (!match) return null;

    const num = parseFloat(match[0]);
    if (dur.includes('year')) return num * 12;
    if (dur.includes('month')) return num;
    if (dur.includes('week')) return num / 4.33;
    if (dur.includes('day')) return num / 30;
    if (dur.includes('hour')) return num / 730;
    return null;
}

window.populateSkillFilter = function() {
    const select = document.getElementById('filter-skill');
    if (!select) return;

    // Check for local filter first, then global
    const secFilter = document.getElementById('filter-sector');
    const sector = secFilter ? secFilter.value : activeSectorId;

    let skills = [];

    // Try DataManager first
    if (sector === 'all') {
         skills = dataManager.topSkills || [];
    } else {
         skills = dataManager.getSkills(sector) || [];
    }

    // Fallback to static data if DataManager empty
    if (skills.length === 0) {
         if (typeof baseSectorDetailData !== 'undefined') {
             if (sector === 'all') {
                 Object.values(baseSectorDetailData).forEach(s => {
                     if(s.skills) skills = [...skills, ...s.skills];
                 });
             } else if (baseSectorDetailData[sector]) {
                skills = baseSectorDetailData[sector].skills;
             }
         }
    }

    // Deduplicate and Sort
    const uniqueSkills = Array.from(new Set((skills || []).map(s => s.name || s.skill || s.Skill)))
        .filter(n => n) // Filter undefined
        .sort((a, b) => a.localeCompare(b));

    let html = `<option value="all">All Skills</option>`;
    html += `<option value="leadership_special">Leadership & Management</option>`;
    if (sector === 'digital' || sector === 'all') {
        html += `<option value="ai_special">✨ AI & Machine Learning</option>`;
    }
    uniqueSkills.forEach(name => {
        html += `<option value="${name}">${name}</option>`;
    });

    select.innerHTML = html;
    select.value = 'all';
}

window.renderProviderTable = function() {
    const countryFilter = document.getElementById('filter-country') ? document.getElementById('filter-country').value : activeCountry;
    const secFilter = document.getElementById('filter-sector') ? document.getElementById('filter-sector').value : activeSectorId;
    const skillFilter = document.getElementById('filter-skill') ? document.getElementById('filter-skill').value : 'all';
    const difficultyFilter = document.getElementById('filter-difficulty') ? document.getElementById('filter-difficulty').value : 'all';
    const durationFilter = document.getElementById('filter-duration') ? document.getElementById('filter-duration').value : 'all';
    const modeFilter = document.getElementById('filter-mode') ? document.getElementById('filter-mode').value : 'all';
    const costFilter = document.getElementById('filter-cost') ? document.getElementById('filter-cost').value : 'all';
    const typeFilter = document.getElementById('filter-type') ? document.getElementById('filter-type').value : 'all';
    const langFilter = document.getElementById('filter-lang') ? document.getElementById('filter-lang').value : 'all';
    const featureFilter = document.getElementById('filter-feature') ? document.getElementById('filter-feature').value : 'all';
    const searchFilter = document.getElementById('filter-search') ? document.getElementById('filter-search').value.toLowerCase() : '';
    const sortFilter = document.getElementById('filter-sort') ? document.getElementById('filter-sort').value : 'default';
    const tbody = document.getElementById('db-body');
    const mobileContainer = document.getElementById('db-mobile-cards');

    if (!tbody) return;
    tbody.innerHTML = '';
    if (mobileContainer) mobileContainer.innerHTML = '';

    // Use DataManager courses or fallback to realCourses from data.js
    let courses = dataManager.courses && dataManager.courses.length > 0 ? dataManager.courses : (typeof realCourses !== 'undefined' ? realCourses : []);

    const filtered = courses.filter(c => {
        const matchCountry = countryFilter === 'all' || c.country === 'all' || c.country === countryFilter;
        const matchSector = secFilter === 'all' || c.sector === 'all' || c.sector === secFilter;

        let matchSkill = true;
        if (skillFilter !== 'all') {
            if (skillFilter === 'ai_special') {
                const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural networks', 'generative ai', 'gpt', 'llm', 'nlp', 'computer vision', 'robotics'];
                const skillText = (c.skills || []).join(' ').toLowerCase();
                const nameText = (c.name || '').toLowerCase();
                matchSkill = aiKeywords.some(k => skillText.includes(k) || nameText.includes(k));
            } else if (skillFilter === 'leadership_special') {
                const leadKeywords = ['leadership', 'management', 'entrepreneurship', 'business', 'strategy', 'civic'];
                const skillText = (c.skills || []).join(' ').toLowerCase();
                const nameText = (c.name || '').toLowerCase();
                matchSkill = leadKeywords.some(k => skillText.includes(k) || nameText.includes(k));
            } else {
                const sf = skillFilter.toLowerCase();
                if (c.skills && Array.isArray(c.skills)) {
                    // Bidirectional includes: handles abbreviations ("Drone Ops" ↔ "Drone", "Precision Ag" ↔ "Precision Agriculture")
                    matchSkill = c.skills.some(s => {
                        const sl = s.toLowerCase();
                        return sl === sf || sl.includes(sf) || sf.includes(sl);
                    });
                    // Fall back to course name match if skills array doesn't cover it
                    if (!matchSkill) {
                        matchSkill = !!(c.name && c.name.toLowerCase().includes(sf));
                    }
                } else {
                    matchSkill = !!(c.name && c.name.toLowerCase().includes(sf));
                }
            }
        }

        const matchMode = modeFilter === 'all' || (c.mode && c.mode.toLowerCase() === modeFilter.toLowerCase()) || (modeFilter.toLowerCase() === 'hybrid' && (c.mode === 'Blended' || c.mode === 'Hybrid')) || (modeFilter.toLowerCase() === 'online' && c.mode === 'Remote');
        const matchDifficulty = difficultyFilter === 'all' || (c.difficulty && c.difficulty === difficultyFilter);

        let matchDuration = true;
        if (durationFilter !== 'all') {
            const months = parseDuration(c.duration);
            if (months === null) matchDuration = false; // Exclude variable/self-paced from specific time buckets
            else if (durationFilter === 'short') matchDuration = months < 1;
            else if (durationFilter === '1-3m') matchDuration = months >= 1 && months <= 3;
            else if (durationFilter === '3-6m') matchDuration = months > 3 && months <= 6;
            else if (durationFilter === '6-12m') matchDuration = months > 6 && months <= 12;
            else if (durationFilter === '1-2y') matchDuration = months > 12 && months <= 24;
            else if (durationFilter === '2y+') matchDuration = months > 24;
        }

        // Granular Filters
        const matchCost = costFilter === 'all' || (costFilter === 'free' ?
            ((c.cost && c.cost.toLowerCase().includes('free')) || c.costType === 'Subsidized' || c.costType === 'Free') :
            ((c.cost && !c.cost.toLowerCase().includes('free')) && c.costType !== 'Subsidized' && c.costType !== 'Free'));
        const matchLang = langFilter === 'all' || (c.language && c.language.includes(langFilter));

        let matchType = true;
        if (typeFilter !== 'all') {
            const t = (c.type || '').toLowerCase();
            if (typeFilter === 'cert') matchType = t.includes('certificate') || t.includes('credential') || t.includes('specialization') || t.includes('license') || t.includes('certification');
            else if (typeFilter === 'micro') matchType = t.includes('micro');
            else if (typeFilter === 'degree') matchType = t.includes('degree') || t.includes('diploma') || t.includes('master') || t.includes('bachelor');
            else if (typeFilter === 'bootcamp') matchType = t.includes('bootcamp') || t.includes('initiative') || t.includes('short') || t.includes('path');
            else if (typeFilter === 'tvet') matchType = t.includes('tvet') || t.includes('polytechnic');
            else if (typeFilter === 'platform') matchType = t.includes('platform') || t.includes('community') || t.includes('provider') || t.includes('academy');
            else if (typeFilter === 'hubs') matchType = t.includes('incubator') || t.includes('hub') || t.includes('lab') || (c.provider && (c.provider.toLowerCase().includes('hub') || c.provider.toLowerCase().includes('lab')));
            else if (typeFilter === 'accredited') matchType = (c.outcomeData && c.outcomeData.accreditation === 'Accredited') || t.includes('certificate') || t.includes('credential') || t.includes('specialization') || t.includes('licence') || t.includes('license') || t.includes('certification') || t.includes('degree') || t.includes('diploma') || t.includes('master') || t.includes('bachelor');
        }

        let matchFeature = true;
        if (featureFilter === 'women') matchFeature = c.women_focused;

        const matchSearch = searchFilter === '' ||
            (c.name && c.name.toLowerCase().includes(searchFilter)) ||
            (c.provider && c.provider.toLowerCase().includes(searchFilter)) ||
            (c.skills && Array.isArray(c.skills) && c.skills.some(s => s.toLowerCase().includes(searchFilter)));

        return matchCountry && matchSector && matchSkill && matchDuration && matchMode && matchCost && matchLang && matchType && matchFeature && matchSearch && matchDifficulty;
    });

    if (filtered.length === 0) {
        var skillHint = '';
        if (skillFilter !== 'all') {
            var skillLabel = skillFilter === 'ai_special' ? 'AI & ML' : skillFilter === 'leadership_special' ? 'Leadership & Management' : skillFilter;
            skillHint = '<p class="text-xs text-slate-500 mb-3">No courses tagged for <strong>' + skillLabel + '</strong>. <a href="#" onclick="event.preventDefault();clearOneFilter(\'filter-skill\')" class="text-indigo-600 underline font-bold">Clear skill filter</a> to see all courses.</p>';
        }
        var noResultsHtml = '<div class="flex flex-col items-center justify-center py-8 text-center w-full">' +
            '<div class="bg-slate-50 p-3 rounded-full mb-3"><i data-lucide="search-x" class="w-6 h-6 text-slate-400"></i></div>' +
            '<p class="text-sm text-slate-600 font-medium mb-2">No courses found matching your filters.</p>' +
            skillHint +
            '<div class="flex items-center gap-2 flex-wrap justify-center">' +
            '<button onclick="clearCourseFilters()" class="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"><i data-lucide="rotate-ccw" class="w-3 h-3"></i> Clear All Filters</button>' +
            '<button onclick="openSkillsView(\'pp-practice\')" class="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"><i data-lucide="map" class="w-3 h-3"></i> Try Pathway Builder</button>' +
            '</div></div>';
        tbody.innerHTML = '<tr><td colspan="4" class="p-0">' + noResultsHtml + '</td></tr>';
        if (mobileContainer) mobileContainer.innerHTML = noResultsHtml;
    }

    // Sort Logic
    filtered.sort((a, b) => {
        // 1. Certified / Accredited Priority (Applies to Default Sort)
        const isCertA = (a.outcomeData && a.outcomeData.accreditation === 'Accredited') || (a.type && /Degree|Diploma|Certificate|License|Certification|Professional/.test(a.type));
        const isCertB = (b.outcomeData && b.outcomeData.accreditation === 'Accredited') || (b.type && /Degree|Diploma|Certificate|License|Certification|Professional/.test(b.type));

        if (sortFilter === 'duration_asc') {
            const durA = parseDuration(a.duration) || 999;
            const durB = parseDuration(b.duration) || 999;
            return durA - durB;
        } else if (sortFilter === 'cost_asc') {
            // Simple heuristic: Free < Paid
            const costA = (a.cost || '').toLowerCase();
            const costB = (b.cost || '').toLowerCase();
            const isFreeA = costA.includes('free');
            const isFreeB = costB.includes('free');
            if (isFreeA && !isFreeB) return -1;
            if (!isFreeA && isFreeB) return 1;
            return a.name.localeCompare(b.name);
        } else if (sortFilter === 'rating_desc') {
            const starsA = (a.outcomeData && a.outcomeData.stars) ? a.outcomeData.stars : 0;
            const starsB = (b.outcomeData && b.outcomeData.stars) ? b.outcomeData.stars : 0;
            return starsB - starsA;
        } else {
            // Default: Certified > Specific Country > Global
            if (isCertA && !isCertB) return -1;
            if (!isCertA && isCertB) return 1;

            // Default: Specific Country > Global ('all')
            const aIsGlobal = a.country === 'all';
            const bIsGlobal = b.country === 'all';

            if (!aIsGlobal && bIsGlobal) return -1;
            if (aIsGlobal && !bIsGlobal) return 1;

            // If both are specific or both are global, sort by name
            if (!aIsGlobal && !bIsGlobal) return a.country.localeCompare(b.country);
            return a.name.localeCompare(b.name);
        }
    });

    filtered.forEach(c => {
        const safeId = c.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const isSaved = myPlan && myPlan.courses && myPlan.courses.has(c.name);
        // Outcome Data Logic
        const outcome = c.outcomeData || window.generateOutcomeScorecard(c.provider, c.type);
        const rating = outcome.stars || 1;

        let stars = '';
        for(let i=0; i<5; i++) { stars += i < rating ? '★' : '☆'; }

        let badgeClass = 'star-1';
        let qualityText = 'No Data';
        if(rating === 5) { badgeClass = 'star-5'; qualityText = 'Indep. Audit'; }
        else if(rating >= 3) { badgeClass = 'star-3'; qualityText = 'Self-Reported'; }

        // Metric Display
        let metricDisplay = outcome.uplift || outcome.placement?.d90 || "No Data";
        if (metricDisplay === "No Data" && outcome.placement?.m6) metricDisplay = outcome.placement.m6;

        // Sector Display
        const sectorDisplay = c.sector === 'agri' ? 'Agriculture' : c.sector === 'energy' ? 'Renewable Energy' : c.sector === 'digital' ? 'Digital Economy' : 'Multi-Sector';

        // Trust Tags for Table
        let trustIcons = '';
        if (outcome.accreditation === 'Accredited') {
            trustIcons += `<i data-lucide="shield-check" class="w-3 h-3 text-blue-500" title="Accredited"></i>`;
        }
        if (outcome.stackable) {
            trustIcons += `<i data-lucide="layers" class="w-3 h-3 text-blue-500" title="Stackable"></i>`;
        }

        // Mobile Card HTML
        if (mobileContainer) {
            const mobileCard = `
                <div class="p-4 space-y-3">
                    <div class="flex justify-between items-start gap-3">
                        <div class="flex-1">
                            <div class="font-bold text-sm text-slate-800 leading-tight mb-1">${c.name}</div>
                            <div class="text-xs text-slate-500 flex items-center gap-1">
                                ${c.provider}
                                ${trustIcons}
                            </div>
                            ${(c.skills && c.skills.length > 0) ? '<div class="flex flex-wrap gap-1 mt-1">' + (c.skills || []).slice(0,3).map(function(s) { return '<span class="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">' + s + '</span>'; }).join('') + '</div>' : ''}
                        </div>
                        <div class="flex flex-col items-end gap-1">
                            ${c.women_focused ? '<span class="text-[9px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded border border-sky-200 font-bold whitespace-nowrap">Women-Focused</span>' : ''}
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <span class="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] border border-slate-100 flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i> ${c.mode}</span>
                        <span class="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] border border-slate-100 flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${c.duration}</span>
                        <span class="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] border border-slate-100 flex items-center gap-1"><i data-lucide="banknote" class="w-3 h-3"></i> ${c.cost}</span>
                    </div>

                    <div class="flex items-center justify-between pt-2 border-t border-slate-50">
                        <button onclick="event.stopPropagation(); window.open('mailto:support@ai4eac.org?subject=Broken Link Report: ${encodeURIComponent(c.name)}', '_blank')" class="text-[9px] text-slate-400 hover:text-slate-600 flex items-center gap-1" title="Report Broken Link">
                            <i data-lucide="flag" class="w-2.5 h-2.5"></i> Report
                        </button>
                        <div class="flex items-center gap-2">
                            <button data-plan-id="${safeId}" onclick="saveCourseToMyPlan('${safeId}')" class="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-100 ${isSaved ? 'text-indigo-500' : 'text-slate-300 hover:text-indigo-500'} transition-colors" title="${isSaved ? 'Saved to Plan' : 'Save to Plan'}"><i data-lucide="${isSaved ? 'bookmark-check' : 'bookmark'}" class="w-3.5 h-3.5"></i></button>
                            ${c.url ? `<a href="${c.url}" target="_blank" class="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">View <i data-lucide="external-link" class="w-3 h-3"></i></a>` : `<span class="text-[10px] text-slate-300 cursor-not-allowed">N/A</span>`}
                        </div>
                    </div>
                </div>
            `;
            mobileContainer.innerHTML += mobileCard;
        }

        const row = `
            <tr class="hover:bg-slate-50 transition group border-b border-slate-50 last:border-0">
                <td class="px-3 py-3">
                    <div class="font-bold text-slate-800 text-xs flex items-center gap-1 flex-wrap">
                        ${c.name}
                        ${c.women_focused ? '<span title="Women-Focused Program" class="text-[9px] bg-sky-100 text-sky-700 px-1 rounded border border-sky-200">Women-Focused</span>' : ''}
                    </div>
                    <div class="flex items-center gap-1 mt-0.5">${trustIcons} <span class="text-[10px] text-slate-500 truncate max-w-[120px]">${c.provider}</span></div>
                    ${(c.skills && c.skills.length > 0) ? '<div class="flex flex-wrap gap-0.5 mt-1">' + (c.skills || []).slice(0,3).map(function(s) { return '<span class="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded">' + s + '</span>'; }).join('') + '</div>' : ''}
                </td>
                <td class="px-3 py-3">
                    <div class="text-[10px] text-slate-600 font-medium">${sectorDisplay}</div>
                    <div class="text-[9px] text-slate-400">${c.mode} • ${c.duration}</div>
                </td>
                <td class="px-3 py-3">
                    <div class="text-[10px] text-slate-500 font-medium">${c.lastUpdated || 'N/A'}</div>
                </td>
                <td class="px-3 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                        <button data-plan-id="${safeId}" onclick="saveCourseToMyPlan('${safeId}')" class="p-1 rounded hover:bg-slate-100 ${isSaved ? 'text-indigo-500' : 'text-slate-300 hover:text-indigo-500'} transition-colors" title="${isSaved ? 'Saved to Plan' : 'Save to Plan'}"><i data-lucide="${isSaved ? 'bookmark-check' : 'bookmark'}" class="w-3 h-3"></i></button>
                        <button onclick="event.stopPropagation(); window.open('mailto:support@ai4eac.org?subject=Broken Link Report: ${encodeURIComponent(c.name)}', '_blank')" class="text-slate-300 hover:text-slate-500 transition p-1" title="Report Broken Link"><i data-lucide="flag" class="w-3 h-3"></i></button>
                        ${c.url ? `<a href="${c.url}" target="_blank" class="text-slate-400 hover:text-blue-600 transition p-1"><i data-lucide="external-link" class="w-3 h-3"></i></a>` : `<span class="text-[10px] text-slate-300 cursor-not-allowed">N/A</span>`}
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    const counter = document.getElementById('provider-counter');
    if(counter) counter.innerText = `Showing ${filtered.length} courses`;
    renderActiveFilterChips();
    refreshIcons();
}

// --- NEW: Render Training Hub Drawer Courses ---
window.renderTrainingHubCourses = function() {
    const countryFilter = document.getElementById('drawer-hub-country') ? document.getElementById('drawer-hub-country').value : activeCountry;
    const langFilter = document.getElementById('drawer-hub-language') ? document.getElementById('drawer-hub-language').value : 'all';
    const secFilter = document.getElementById('drawer-hub-sector') ? document.getElementById('drawer-hub-sector').value : activeSectorId;
    const modeFilter = document.getElementById('drawer-hub-mode-quick') ? document.getElementById('drawer-hub-mode-quick').value : 'all';

    // Advanced filters
    const typeFilter = document.getElementById('drawer-hub-course-type') ? document.getElementById('drawer-hub-course-type').value : 'all';
    const budgetFilter = document.getElementById('drawer-hub-budget') ? document.getElementById('drawer-hub-budget').value : 'all';

    const container = document.getElementById('training-hub-results');
    if (!container) return;
    container.innerHTML = '';

    let courses = dataManager.courses && dataManager.courses.length > 0 ? dataManager.courses : (typeof realCourses !== 'undefined' ? realCourses : []);

    // Normalize courses for display (ensure skillsCovered and outcomeData exist)
    courses = courses.map(c => ({
        ...c,
        skillsCovered: c.skills || [],
        costDisplay: c.cost,
        durationMonths: c.duration,
        school: c.provider,
        outcomeData: c.outcomeData || window.generateOutcomeScorecard(c.provider, c.type)
    }));

    const filtered = courses.filter(c => {
        const matchCountry = countryFilter === 'all' || c.country === 'all' || c.country === countryFilter;
        const matchSector = secFilter === 'all' || c.sector === 'all' || c.sector === secFilter;
        const matchLang = langFilter === 'all' || (c.language && c.language.includes(langFilter));
        const matchMode = modeFilter === 'all' || (c.mode && c.mode.toLowerCase() === modeFilter.toLowerCase()) || (modeFilter.toLowerCase() === 'hybrid' && (c.mode === 'Blended' || c.mode === 'Hybrid')) || (modeFilter.toLowerCase() === 'online' && c.mode === 'Remote');

        let matchType = true;
        if (typeFilter !== 'all') {
            const t = (c.type || '').toLowerCase();
            if (typeFilter === 'certificate') matchType = t.includes('certificate');
            else if (typeFilter === 'micro-credential') matchType = t.includes('micro');
            else if (typeFilter === 'tvet') matchType = t.includes('tvet') || t.includes('diploma');
            else if (typeFilter === 'university') matchType = t.includes('degree') || t.includes('bachelor') || t.includes('master');
            else if (typeFilter === 'bootcamp') matchType = t.includes('bootcamp');
            else if (typeFilter === 'hubs') matchType = t.includes('incubator') || t.includes('hub') || t.includes('lab') || (c.provider && (c.provider.toLowerCase().includes('hub') || c.provider.toLowerCase().includes('lab')));
            else if (typeFilter === 'accredited') matchType = (c.outcomeData && c.outcomeData.accreditation === 'Accredited') || t.includes('certificate') || t.includes('credential') || t.includes('specialization') || t.includes('licence') || t.includes('license') || t.includes('certification') || t.includes('degree') || t.includes('diploma') || t.includes('master') || t.includes('bachelor');
        }

        let matchBudget = true;
        if (budgetFilter !== 'all') {
            const cost = (c.cost || '').toLowerCase();
            if (budgetFilter === 'low') matchBudget = cost.includes('free') || cost.includes('subsidized');
            else if (budgetFilter === 'medium') matchBudget = !cost.includes('free') && !cost.includes('high');
            else if (budgetFilter === 'high') matchBudget = cost.includes('high');
        }

        return matchCountry && matchSector && matchLang && matchMode && matchType && matchBudget;
    });

    container.innerHTML = formatTrainingList(filtered);
    refreshIcons();
}
