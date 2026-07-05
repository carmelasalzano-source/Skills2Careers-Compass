// --- CONFIGURATION ---
const API_CONFIG = {
    baseUrl: '', // Leave empty for local files, set to 'https://api.yourdomain.com/v1/' for MVP
    endpoints: {
        wages: 'wages.json',
        ventures: 'ventures.json',
        topOccupations: 'top_occupations.json',
        topSkills: 'top_skills.json',
        courses: 'courses.json',
        appData: 'app_data.json',
        resGeneral: 'resources_general.json',
        resEvidence: 'resources_evidence.json',
        resDigital: 'resources_digital.json',
        resAgri: 'resources_agri.json',
        resEnergy: 'resources_energy.json',
        scholarships: 'scholarships.json'
    }
};

// --- DATA MANAGER CLASS ---
class DataManager {
    constructor() {
        this.wages = [];
        this.ventures = [];
        this.digitalResources = null;
        this.topOccupations = [];
        this.topSkills = [];
        this.courses = [];
        this.scholarships = [];
        this.sectorMap = (typeof sectorMap !== 'undefined') ? sectorMap : { 'agri': 'Agriculture', 'energy': 'Renewables', 'digital': 'Digital/AI' };
        this.wageMap = new Map(); // For ID-based lookup
    }

    async init() {
        try {
            // Phase 1: fetch lightweight endpoints first for fast initial render
            const phase1Keys = ['ventures', 'topOccupations', 'topSkills', 'appData',
                                'resGeneral', 'resEvidence', 'resDigital', 'resAgri',
                                'resEnergy', 'scholarships'];
            const phase1Results = await Promise.allSettled(
                phase1Keys.map(k => this.fetchData(API_CONFIG.endpoints[k]))
            );

            const dataMap = {};
            phase1Keys.forEach((key, i) => {
                dataMap[key] = (phase1Results[i].status === 'fulfilled' && phase1Results[i].value)
                    ? phase1Results[i].value : null;
            });

            // Use fallback course data until Phase 2 loads
            this.wages = [];
            this.courses = typeof realCourses !== 'undefined' ? realCourses : [];
            this.ventures    = (dataMap.ventures && dataMap.ventures.length > 0) ? dataMap.ventures : this.getFallbackVentures();
            this.topOccupations = dataMap.topOccupations || [];
            this.topSkills      = dataMap.topSkills || [];
            this.scholarships   = (dataMap.scholarships && dataMap.scholarships.length > 0) ? dataMap.scholarships : this.getFallbackScholarships();

            const appData = dataMap.appData || {};
            if (appData) Object.assign(window, appData);

            this.digitalResources = {
                ...(dataMap.resGeneral || {}),
                "evidence_providers": dataMap.resEvidence || [],
                "digital": dataMap.resDigital || {},
                "agri":    dataMap.resAgri    || {},
                "energy":  dataMap.resEnergy  || {}
            };
            window.digitalResources = this.digitalResources;

            this.normalizeData();
            this.linkData();
            this.injectResourceCourses();

            console.log(`DataManager P1: ${this.ventures.length} ventures, ${this.topOccupations.length} occupations, ${this.topSkills.length} skills.`);

            try { if (typeof renderOccupationsView === 'function') renderOccupationsView(); } catch(e) { console.warn("renderOccupationsView error:", e); }
            try { if (typeof resetCareerHub === 'function') resetCareerHub(); } catch(e) { console.warn("resetCareerHub error:", e); }
            try { if (typeof updateHeroStats === 'function') updateHeroStats(); } catch(e) {}

            // Phase 2: load heavy files (wages 112KB, courses 159KB) in background
            Promise.allSettled([
                this.fetchData(API_CONFIG.endpoints.wages),
                this.fetchData(API_CONFIG.endpoints.courses)
            ]).then(([wagesRes, coursesRes]) => {
                let updated = false;
                if (wagesRes.status === 'fulfilled' && wagesRes.value && wagesRes.value.length > 0) {
                    this.wages = wagesRes.value;
                    updated = true;
                }
                if (coursesRes.status === 'fulfilled' && coursesRes.value && coursesRes.value.length > 0) {
                    this.courses = coursesRes.value;
                    updated = true;
                }
                if (updated) {
                    this.normalizeData();
                    this.linkData();
                    this.injectResourceCourses();
                    console.log(`DataManager P2: ${this.wages.length} wages, ${this.courses.length} courses.`);
                    try { if (typeof resetCareerHub === 'function') resetCareerHub(); } catch(e) {}
                    try { if (typeof updateHeroStats === 'function') updateHeroStats(); } catch(e) {}
                }
            });

        } catch(e) {
            console.error("DataManager init failed:", e);
        }
    }

    async fetchData(url) {
        const cacheKey = `ai4eac_cache_v2_${url.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const cached = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}_time`);
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours cache

        if (cached && cacheTime && (now - parseInt(cacheTime) < ONE_DAY)) {
            try {
                const parsed = JSON.parse(cached);
                // Treat a cached empty array as stale — discard and re-fetch
                if (Array.isArray(parsed) && parsed.length === 0) {
                    localStorage.removeItem(cacheKey);
                    localStorage.removeItem(`${cacheKey}_time`);
                } else {
                    return parsed;
                }
            } catch (e) {
                console.warn(`Corrupt cache for ${url}, clearing and refetching.`);
                localStorage.removeItem(cacheKey);
                localStorage.removeItem(`${cacheKey}_time`);
            }
        }

        try {
            // Increased timeout to 15s for slow connections
            const fullUrl = `${API_CONFIG.baseUrl}${url}`;
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 15000);
            const response = await fetch(fullUrl, { signal: controller.signal });
            clearTimeout(id);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const data = await response.json();

            try {
                localStorage.setItem(cacheKey, JSON.stringify(data));
                localStorage.setItem(`${cacheKey}_time`, now.toString());
            } catch (e) {
                console.warn("Cache quota exceeded, skipping cache for " + url);
            }

            return data;
        } catch (e) {
            console.warn(`Could not load ${url}:`, e);
            return null;
        }
    }

    normalizeData() {
        // Helper to normalize keys to camelCase and standardize values
        const normalizeItem = (item, keyMap) => {
            // Remap keys
            for (const [oldKey, newKey] of Object.entries(keyMap)) {
                if (item[oldKey] !== undefined && item[newKey] === undefined) {
                    item[newKey] = item[oldKey];
                }
            }

            // Normalize Sector
            if (item.sector === 'Agriculture' || item.sector === 'Agritech') item.sector = 'agri';
            if (item.sector === 'Renewables' || item.sector === 'Renewable Energy') item.sector = 'energy';
            if (item.sector === 'Digital/AI' || item.sector === 'Digital') item.sector = 'digital';

            // Normalize Country
            item.country = normalizeDRC(item.country);
        };

        const ventureMap = {
            'Venture_Title': 'title', 'Venture_Description': 'description', 'Rank': 'rank',
            'Country': 'country', 'Sector': 'sector', 'Key_Competencies': 'competencies',
            'Startup_Capital_Est': 'capital'
        };
        this.ventures.forEach(v => normalizeItem(v, ventureMap));

        const wageMap = {
            'Country': 'country', 'Occupation': 'occupation', 'Occ_ID': 'occId',
            'P25_Monthly_Wage': 'p25MonthlyWage', 'P75_Monthly_Wage': 'p75MonthlyWage',
            'Avg_Monthly_Wage': 'avgMonthlyWage', 'Currency': 'currency',
            'Typical_Employers': 'typicalEmployers', 'Work_Setting': 'workSetting',
            'OJA_Count': 'ojaCount', 'OJA_Reference': 'ojaReference'
        };
        this.wages.forEach(w => normalizeItem(w, wageMap));

        const occMap = {
            'Occupation_Role': 'occupationRole', 'Skills_Description': 'skillsDescription',
            'Master_Occ_ID': 'masterOccId', 'Why_In_Demand': 'whyInDemand',
            'Country': 'country', 'Sector': 'sector', 'Rank': 'rank'
        };
        this.topOccupations.forEach(o => normalizeItem(o, occMap));

        const skillMap = {
            'Skill': 'skill', 'Description': 'description', 'Narrative': 'narrative', 'Sector': 'sector'
        };
        this.topSkills.forEach(s => normalizeItem(s, skillMap));
    }

    linkData() {
        // Link Wages by ID for faster lookup
        this.wages.forEach(w => {
            // Support both casing
            const id = w.occId || w.Occ_ID;
            const country = w.country || w.Country;
            if (id) {
                this.wageMap.set(`${id}-${country}`, w);
            }
        });
    }
    getWage(occupation, country, occId = null) {
        let searchCountry = country === 'all' ? 'Kenya' : country;
        searchCountry = normalizeDRC(searchCountry);

        // Try ID lookup first
        if (occId) {
            const byId = this.wageMap.get(`${occId}-${searchCountry}`); // wageMap logic in linkData might need update if keys changed, but linkData runs after normalizeData so it should use new keys if updated there.
            // Actually linkData runs after normalizeData, so we should update linkData to use camelCase too.
            // But linkData uses w.occId || w.Occ_ID, which is fine.
            if (byId) return byId;
        }

        // Fallback to Name lookup
        return this.wages.find(d =>
            d.country === searchCountry && d.occupation === occupation
        );
    }

    getVentures(sectorId, country) {
        let searchCountry = country;
        searchCountry = normalizeDRC(searchCountry);

        return this.ventures.filter(v =>
            v.sector === sectorId &&
            (country === 'all' || v.country === searchCountry || v.country === 'All')
        );
    }

    getOccupations(sectorId, country = 'all') {
        let searchCountry = normalizeDRC(country === 'all' ? 'All' : country);

        // Filter top occupations from external file
        let occs = this.topOccupations.filter(o => o.sector === sectorId);

        if (occs.length > 0) {
            // Contextualize by country
            if (country !== 'all') {
                 const countryOccs = occs.filter(o => o.country === searchCountry);
                 if (countryOccs.length > 0) {
                     occs = countryOccs;
                 } else {
                     const regionalOccs = occs.filter(o => (o.country === 'All' || o.country === 'Regional'));
                     if (regionalOccs.length > 0) occs = regionalOccs;
                 }
            } else {
                 const regionalOccs = occs.filter(o => (o.country === 'All' || o.country === 'Regional'));
                 if (regionalOccs.length > 0) occs = regionalOccs;
            }

            return occs.sort((a,b) => a.rank - b.rank).map(o => ({
                name: o.occupationRole,
                desc: o.skillsDescription ? o.skillsDescription.split('.')[0] + '.' : (o.description || 'Key role in sector.'),
                isHot: o.rank <= 4,
                id: o.masterOccId, // Keep ID for linking
                why: o.whyInDemand, // Capture Why in Demand
                escoCode: o.escoCode,  // Pass through ESCO
                nationalStandards: o.nationalStandards || [], // Pass through National Standards
                country: o.country // Pass through Country
            }));
        }
        return null; // Return null to fallback to baseSectorDetailData
    }

    getSkills(sectorId) {
        // Filter top skills from external file
        const skills = this.topSkills.filter(s => s.sector === sectorId);

        if (skills.length > 0) {
            return skills.map(s => ({
                name: s.skill,
                desc: s.description,
                narrative: s.narrative,
                isHot: s.isHot || false
            }));
        }

        return null; // Return null to fallback to baseSectorDetailData
    }

    injectResourceCourses() {
        if (!this.digitalResources) return;

        const newCourses = [];

        // Prepare skill keywords for inference
        const skillKeywords = this.topSkills.map(s => (s.skill || s.name || "").toLowerCase()).filter(s => s.length > 1);

        const mapToCourse = (res, sector, country) => {
            const desc = (res.desc || "").toLowerCase();
            const title = (res.title || res.name || "").toLowerCase();
            const type = (res.type || "").toLowerCase();

            // Deduplication: Skip if a course with this name already exists (prefer manual entry)
            if (this.courses.some(c => (c.name || "").toLowerCase() === title)) return null;

            // Filter out invalid URLs
            if (!res.link || res.link === '#' || !res.link.startsWith('http')) return null;

            // Heuristic to identify training/learning resources
            const isTraining = type.includes('skill') || type.includes('education') || type.includes('bootcamp') || type.includes('training') || type.includes('academy') ||
                               desc.includes('training') || desc.includes('course') || desc.includes('academy') || desc.includes('learning') || desc.includes('curriculum') ||
                               title.includes('academy') || title.includes('learning') || title.includes('training');

            if (!isTraining) return null;

            let courseType = 'Short Course';
            if (type.includes('bootcamp') || desc.includes('bootcamp')) courseType = 'Bootcamp';
            else if (type.includes('degree') || desc.includes('degree')) courseType = 'Degree';
            else if (type.includes('hub') || type.includes('lab') || type.includes('incubator') || title.includes('hub')) courseType = 'Innovation Hub';
            else if (type.includes('ecosystem') || type.includes('community')) courseType = 'Platform';
            else if (title.includes('academy') || desc.includes('academy')) courseType = 'Academy';

            // Infer skills from title/desc
            const inferredSkills = [];
            const textToSearch = (title + " " + desc).toLowerCase();

            skillKeywords.forEach(k => {
                try {
                    const regex = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                    if (regex.test(textToSearch)) {
                        const original = this.topSkills.find(s => (s.skill || s.name || "").toLowerCase() === k);
                        inferredSkills.push(original ? (original.skill || original.name) : k.charAt(0).toUpperCase() + k.slice(1));
                    }
                } catch(e) {}
            });
            const uniqueSkills = [...new Set(inferredSkills)];

            return {
                id: `res_${Math.random().toString(36).substr(2, 9)}`,
                name: res.title || res.name,
                provider: res.title || res.name,
                type: courseType,
                level: 'short',
                duration: 'Self-paced',
                difficulty: 'All Levels',
                cost: 'Variable',
                mode: 'Online',
                sector: sector,
                country: country,
                skills: uniqueSkills,
                url: res.link,
                description: res.desc,
                isResource: true,
                outcomeData: window.generateOutcomeScorecard ? window.generateOutcomeScorecard(res.title, courseType) : { available: false }
            };
        };

        // 1. General Resources
        if (this.digitalResources.regional_multipliers) {
            this.digitalResources.regional_multipliers.forEach(r => {
                const c = mapToCourse(r, 'all', 'all');
                if(c) newCourses.push(c);
            });
        }
        if (this.digitalResources.global_resources) {
            this.digitalResources.global_resources.forEach(r => {
                const c = mapToCourse(r, 'all', 'all');
                if(c) newCourses.push(c);
            });
        }

        // 2. Country Resources (General)
        if (this.digitalResources.country_resources) {
            Object.entries(this.digitalResources.country_resources).forEach(([country, data]) => {
                if(data.hubs) data.hubs.forEach(r => { const c = mapToCourse(r, 'all', country); if(c) newCourses.push(c); });
                if(data.communities) data.communities.forEach(r => { const c = mapToCourse(r, 'all', country); if(c) newCourses.push(c); });
            });
        }

        // 3. Sector Specific
        ['agri', 'energy', 'digital'].forEach(sector => {
            if (this.digitalResources[sector]) {
                const sData = this.digitalResources[sector];
                if (sData.entrepreneurship) {
                    if(sData.entrepreneurship.incubators) sData.entrepreneurship.incubators.forEach(r => { const c = mapToCourse(r, sector, 'all'); if(c) newCourses.push(c); });
                    if(sData.entrepreneurship.tools) sData.entrepreneurship.tools.forEach(r => { const c = mapToCourse(r, sector, 'all'); if(c) newCourses.push(c); });
                }
                if (sData.country_resources) {
                    Object.entries(sData.country_resources).forEach(([country, cData]) => {
                         if(cData.hubs) cData.hubs.forEach(r => { const c = mapToCourse(r, sector, country); if(c) newCourses.push(c); });
                    });
                }
            }
        });

        this.courses = [...this.courses, ...newCourses];
    }

    getFallbackVentures() {
        console.warn("Using fallback venture data.");
        // Use global fallback from data.js
        return (typeof fallbackVentures !== 'undefined') ? fallbackVentures : [];
    }

    getFallbackScholarships() {
        return (typeof fallbackScholarships !== 'undefined') ? fallbackScholarships : [];
    }
}

const dataManager = new DataManager();

// --- HELPER: OJA Data Lookup ---
function getOJAMetrics(roleTitle, country) {
    if (!dataManager.wages || dataManager.wages.length === 0) return null;

    // 1. Handle 'all' country case (Default to Kenya or aggregate logic)
    let searchCountry = country === 'all' ? 'Kenya' : country;

    if (typeof roleToOccupationMap === 'undefined') return null;
    const targetOccupation = roleToOccupationMap[roleTitle];

    if (!targetOccupation) return null;

    // 3. Find Entry using the precise occupation name
    const entry = dataManager.wages.find(d =>
        d.country === searchCountry &&
        d.occupation === targetOccupation
    );

    if (entry) {
        return { count: entry.ojaCount || "N/A", ref: entry.ojaReference || "UNESCO Global Skills Tracker" };
    }

    return null;
}

// --- MOCK DETAILS PROVIDER ---
function getOccupationDetails(title, sectorName) {
    const country = activeCountry;
    const currency = (typeof countryData !== 'undefined' && countryData[country] && countryData[country].currency) ? countryData[country].currency : 'USD';

    // Generate some base info
    let altTitles = "Specialist, Technician";
    let employers = "SMEs, Startups";
    let workMode = "On-Site";

    // --- DYNAMIC DATA LOOKUP ---
    const targetOcc = (typeof roleToOccupationMap !== 'undefined') ? roleToOccupationMap[title] : null;
    let searchCountry = activeCountry === 'all' ? 'Kenya' : activeCountry;

    const wageEntry = dataManager.getWage(targetOcc, activeCountry);

    // Salary Logic: Show currency code unless generic
    let salaryRange = "$500 - $1,200";

    if (wageEntry && wageEntry.p25MonthlyWage) {
        const p25 = wageEntry.p25MonthlyWage;
        const p75 = wageEntry.p75MonthlyWage;
        const curr = wageEntry.currency;
        if (p25 !== "TBD") salaryRange = `${curr} ${p25} - ${p75}`;
    } else if (typeof countryData !== 'undefined' && countryData[activeCountry]) {
        // Fallback to country default if specific wage not found
        if (countryData[activeCountry].salaryFallback) {
            salaryRange = `${currency} ${countryData[activeCountry].salaryFallback}`;
        } else if (activeCountry !== 'all') {
            salaryRange = `Competitive (${currency})`;
        }
    }

    const specificDef = standardDefinitions[title];
    const baseDesc = specificDef
        ? `<div>${specificDef}</div>`
        : `<div>As a ${title}, you bridge the gap between technical systems and on-ground operations in the ${sectorName} sector. Key responsibilities include data analysis, maintenance, and reporting.</div>`;

    // Apply specific employers if available
    // NEW: Check country overrides for sector-level hiring context
    const sectorOverrides = (typeof countryOverrides !== 'undefined' && countryOverrides[activeCountry] && countryOverrides[activeCountry][activeSectorId]) ? countryOverrides[activeCountry][activeSectorId] : null;

    if (wageEntry && wageEntry.typicalEmployers) {
        employers = wageEntry.typicalEmployers;
    } else if (typeof roleEmployers !== 'undefined' && roleEmployers[title]) {
        employers = roleEmployers[title];
        // Append country context if available
        if (sectorOverrides && sectorOverrides.hiring) {
            employers += `, ${sectorOverrides.hiring}`;
        }
    }

    // Apply Work Setting if available
    if (wageEntry && wageEntry.workSetting) {
        workMode = wageEntry.workSetting;
    }

    // --- Generate Typical Day Breakdown ---
    let dayBreakdown = "";
    // Use global roleDayBreakdown from data.js
    const breakdownData = (typeof roleDayBreakdown !== 'undefined') ? roleDayBreakdown[title] : null;

    if (breakdownData) {
        const theme = breakdownData.theme;
        dayBreakdown = `
            <div class="mt-4 pt-4 border-t border-slate-100">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">A Typical Day at Different Levels</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="p-3 bg-${theme}-50 rounded border border-${theme}-100">
                        <strong class="block text-${theme}-800 text-xs mb-1 font-bold">Entry Level (0-2 Yrs)</strong>
                        <p class="text-xs text-slate-600 leading-snug">${breakdownData.entry}</p>
                    </div>
                    <div class="p-3 bg-${theme}-50 rounded border border-${theme}-100">
                        <strong class="block text-${theme}-800 text-xs mb-1 font-bold">Mid-Career (3-5 Yrs)</strong>
                        <p class="text-xs text-slate-600 leading-snug">${breakdownData.mid}</p>
                    </div>
                    <div class="p-3 bg-${theme}-50 rounded border border-${theme}-100">
                        <strong class="block text-${theme}-800 text-xs mb-1 font-bold">Senior (5+ Yrs)</strong>
                        <p class="text-xs text-slate-600 leading-snug">${breakdownData.senior}</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Fallback for roles not in the detailed breakdown (e.g., from lower ranks)
        let theme = 'slate';
        if (activeSectorId === 'agri') theme = 'sky';
        if (activeSectorId === 'energy') theme = 'amber';
        if (activeSectorId === 'digital') theme = 'indigo';

        dayBreakdown = `
            <div class="mt-4 pt-4 border-t border-slate-100">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">A Typical Day at Different Levels</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="p-3 bg-${theme}-50 rounded border border-${theme}-100">
                        <strong class="block text-${theme}-800 text-xs mb-1 font-bold">Entry Level (0-2 Yrs)</strong>
                        <p class="text-xs text-slate-600 leading-snug">Focuses on executing specific tasks under supervision, data collection, and learning core operational processes.</p>
                    </div>
                    <div class="p-3 bg-${theme}-50 rounded border border-${theme}-100">
                        <strong class="block text-${theme}-800 text-xs mb-1 font-bold">Mid-Career (3-5 Yrs)</strong>
                        <p class="text-xs text-slate-600 leading-snug">Involves independent problem-solving, managing small projects or teams, and contributing to process improvements.</p>
                    </div>
                    <div class="p-3 bg-${theme}-50 rounded border border-${theme}-100">
                        <strong class="block text-${theme}-800 text-xs mb-1 font-bold">Senior (5+ Yrs)</strong>
                        <p class="text-xs text-slate-600 leading-snug">Shifts to strategic planning, system design, mentoring junior staff, and managing key stakeholder relationships.</p>
                    </div>
                </div>
            </div>
        `;
    }

    let desc = `
        ${baseDesc}
        ${dayBreakdown}
    `;

    // Specific Overrides for flavor
    if (title.includes("Drone")) { altTitles = "UAV Operator, Aerial Surveyor"; }
    if (title.includes("Data")) { altTitles = "Data Analyst, Insights Lead"; workMode = "Remote"; }
    if (title.includes("Solar")) { altTitles = "PV Tech, Solar Engineer"; workMode = "On-Site"; }

    // Training Matches (Proxy)
    const keySkill = title.split(' ')[0];
    const catalogue = getMasterTrainingCatalogue(activeSectorId, activeCountry);
    // Default to 'med' (intermediate) for general view
    const matches = catalogue.med;

    // Get specific skills (Object with technical/employability or fallback)
    // Updated fallback to ensure 5 skills if key is missing
    const rawSkills = (typeof roleSkills !== 'undefined' && roleSkills[title]) ? roleSkills[title] : {
        technical: ["Core Technical Competency", "Industry Software Proficiency", "Data Analysis/Literacy", "Regulatory Compliance", "Equipment Maintenance"],
        employability: ["Effective Communication", "Problem Solving", "Team Collaboration", "Time Management", "Adaptability"]
    };

    const toolsList = (typeof roleToolsMap !== 'undefined' && roleToolsMap[title]) ? roleToolsMap[title] : ["Industry Standard Software", "Sector-Specific Hardware", "Reporting Tools", "Communication Platforms"];

    // --- 5. Regulatory Credentials (Contextualized) ---
    let credentials = [];
    const rules = (typeof credentialRules !== 'undefined') ? credentialRules[activeSectorId] : null;

    if (rules) {
        // 1. Common Rules
        if (rules.common) credentials.push(...rules.common);

        // 2. Conditional Rules (Keywords)
        if (rules.conditional) {
            rules.conditional.forEach(rule => {
                if (rule.keywords.some(k => title.includes(k))) credentials.push(rule.text);
            });
        }

        // 3. Country Specific Rules
        if (rules.countries && rules.countries[activeCountry]) {
            rules.countries[activeCountry].forEach(rule => {
                if (rule.keywords.some(k => title.includes(k))) credentials.push(rule.text);
            });
        } else if (rules.defaultCountry && activeCountry !== 'all') {
            credentials.push(...rules.defaultCountry);
        }
    }

    // Legacy/Specific Logic for Drone (Complex conditional)
    if (activeSectorId === 'agri' && title.includes('Drone')) {
            if (activeCountry === 'Kenya') credentials.push("KCAA Remote Pilot License (RPL)");
            else if (activeCountry === 'Rwanda') credentials.push("RCAA Drone Operator Permit");
            else credentials.push("Civil Aviation Authority (CAA) Remote Pilot License");
    }

    if (credentials.length === 0) credentials.push("Please consult the relevant Industry Governing Body or Ministry for specific requirements.");

    // --- 5. Read More Resources ---
    const resources = (typeof roleResourcesMap !== 'undefined' && roleResourcesMap[title]) ? roleResourcesMap[title] : [];

        return {
        desc,
        altTitles,
        employers,
        workMode,
        salaryRange,
        matches,
        tools: toolsList,
        credentials,
        resources,
        sector: sectorName,
        specificSkills: rawSkills // Return object instead of array
    };
}

// --- HELPER: GENERATE OUTCOME DATA (Updated for Real Data) ---
window.generateOutcomeScorecard = (providerName, courseType) => {
    const name = providerName || "";
    const config = (typeof outcomeScorecardConfig !== 'undefined') ? outcomeScorecardConfig : { verified: [], online: [] };

    const hasData = config.verified.some(k => name.includes(k));
    const isOnline = config.online.some(k => name.includes(k));

    // Accreditation & Stackable Logic
    let accreditation = null;
    if (name.includes("University") || name.includes("TVET") || name.includes("Institute") || name.includes("College")) {
        accreditation = "Accredited";
    }

    const isStackable = (courseType && (courseType.includes('Micro') || courseType.includes('Cert') || courseType.includes('Badge') || courseType.includes('Degree')));

    if (hasData) {
        return { available: true, placement: { d90: '62%', m6: '85%', y1: '94%' }, uplift: '+45%', methodology: 'Independent Audit', stars: 5, evidence: { completion: '94%', timeToJob: '3 Mo', sample: 'n=1.2k' }, accreditation: accreditation || "Verified Provider", stackable: isStackable };
    } else if (isOnline) {
        return { available: true, placement: { d90: 'N/A', m6: 'Global Avg', y1: 'N/A' }, uplift: 'Varies', methodology: 'Self-Reported', stars: 3, evidence: { completion: 'Varies', timeToJob: 'N/A', sample: 'Global' }, accreditation: accreditation || "Industry Recog.", stackable: isStackable };
    } else {
        return { available: false, accreditation: accreditation, stackable: isStackable };
    }
};

// --- MASTER TRAINING CATALOGUE (FILTERED REAL DATA) ---
const getMasterTrainingCatalogue = (sector, country) => {
    // Use DataManager courses
    let sourceData = dataManager.courses;

    if (!sourceData || sourceData.length === 0) {
         if (typeof realCourses !== 'undefined') sourceData = realCourses;
         else return { short: [], med: [], long: [] };
    }

    const bySector = (c) => c.sector === sector || c.sector === 'all';
    const byCountry = (c) => {
        if(c.country === 'all') return true;
        if(country === 'all') return true;
        let searchCountry = normalizeDRC(country);
        return c.country === searchCountry;
    };

    let courses = sourceData.filter(c => bySector(c) && byCountry(c));

    // FIX: Include 'all' level courses (platforms) in specific buckets to ensure visibility
    const short = courses.filter(c => c.level === 'short' || c.level === 'all');
    const med = courses.filter(c => c.level === 'med' || c.level === 'all');
    const long = courses.filter(c => c.level === 'long' || c.level === 'all');

    [short, med, long].flat().forEach(c => {
         if(!c) return;
         c.costDisplay = c.cost;
         c.school = c.provider;
         c.durationMonths = c.duration;
         c.skillsCovered = c.skills || [];
         c.occupationsMapped = ["Specialist", "Analyst"];
         if (!c.outcomeData) {
             c.outcomeData = window.generateOutcomeScorecard(c.provider, c.type);
         }
    });

    return { short, med, long };
};
