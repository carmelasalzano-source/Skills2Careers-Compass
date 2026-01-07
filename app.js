// --- GLOBAL STATE ---
let activeSectorId = 'agri';
let activeCountry = 'all';
let currentSkillName = null;
let currentSkillData = null;
let impactChartsInitialized = false;
let wageData = []; // Store loaded OJA/Wage data
let ventureData = []; // Store loaded Venture data
let digitalResources = null; // Store loaded Digital/Sector resources
let favoriteVentures = new Set(); // Store favorited ventures
let pathwayState = { goal: null, constraints: {} }; // Store Pathway Builder state
let myPlan = { roles: new Set(), skills: new Set(), courses: new Set() }; // New My Plan State

// --- DATA MANAGER CLASS ---
class DataManager {
    constructor() {
        this.wages = [];
        this.ventures = [];
        this.digitalResources = null;
        this.topOccupations = [];
        this.topSkills = [];
        this.courses = [];
        this.sectorMap = (typeof sectorMap !== 'undefined') ? sectorMap : { 'agri': 'Agriculture', 'energy': 'Renewables', 'digital': 'Digital/AI' };
        this.wageMap = new Map(); // For ID-based lookup
    }

    async init() {
        console.log("Initializing DataManager...");
        
        // Show Loading Spinner
        const spinner = document.getElementById('global-loader') || document.createElement('div');
        if(!spinner.id) {
            spinner.id = 'global-loader';
            spinner.className = 'fixed inset-0 bg-white z-[9999] flex items-center justify-center';
            spinner.innerHTML = '<div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>';
            document.body.appendChild(spinner);
        }

        // Use Promise.allSettled to prevent one failure from crashing the app
        const results = await Promise.allSettled([
            this.fetchData('wages.json'),
            this.fetchData('ventures.json'),
            this.fetchData('top_occupations.json'),
            this.fetchData('top_skills.json'),
            this.fetchData('courses.json'),
            this.fetchData('app_data.json'),
            this.fetchData('resources_general.json'),
            this.fetchData('resources_evidence.json'),
            this.fetchData('resources_digital.json'),
            this.fetchData('resources_agri.json'),
            this.fetchData('resources_energy.json')
        ]);

        // Extract data safely
        this.wages = (results[0].status === 'fulfilled' && results[0].value) ? results[0].value : [];
        this.ventures = (results[1].status === 'fulfilled' && results[1].value) ? results[1].value : this.getFallbackVentures();
        this.topOccupations = (results[2].status === 'fulfilled' && results[2].value) ? results[2].value : [];
        this.topSkills = (results[3].status === 'fulfilled' && results[3].value) ? results[3].value : [];
        this.courses = (results[4].status === 'fulfilled' && results[4].value) ? results[4].value : [];

        // Load App Data (UI Config)
        const appData = (results[5].status === 'fulfilled' && results[5].value) ? results[5].value : {};
        if (appData) Object.assign(window, appData); // Expose config globally

        // Construct Digital Resources from split files
        const generalRes = (results[6].status === 'fulfilled' && results[6].value) ? results[6].value : {};
        const evidenceRes = (results[7].status === 'fulfilled' && results[7].value) ? results[7].value : [];
        const digitalRes = (results[8].status === 'fulfilled' && results[8].value) ? results[8].value : {};
        const agriRes = (results[9].status === 'fulfilled' && results[9].value) ? results[9].value : {};
        const energyRes = (results[10].status === 'fulfilled' && results[10].value) ? results[10].value : {};

        this.digitalResources = {
            ...generalRes,
            "evidence_providers": evidenceRes,
            "digital": digitalRes,
            "agri": agriRes,
            "energy": energyRes
        };

        this.normalizeData();
        this.linkData();

        // Expose for backward compatibility
        window.digitalResources = this.digitalResources;
        
        console.log(`DataManager loaded: ${this.wages.length} wages, ${this.ventures.length} ventures, ${this.topOccupations.length} occupations, ${this.topSkills.length} skills, ${this.courses.length} courses.`);
        
        // Force re-renders
        if (typeof renderOccupationsView === 'function') renderOccupationsView();
        if (typeof resetCareerHub === 'function') resetCareerHub();
        if (typeof renderSectorCards === 'function') renderSectorCards(); // Re-render cards with new config
        if (typeof updateHeroStats === 'function') updateHeroStats(); // Update Hero Stats

        // Hide Spinner
        spinner.classList.add('hidden');
    }

    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return await response.json();
        } catch (e) {
            console.warn(`Could not load ${url}:`, e);
            return null;
        }
    }

    normalizeData() {
        // Normalize Venture Sectors
        const normalize = (item) => {
            // Support both PascalCase (legacy) and camelCase (new)
            const sector = item.Sector || item.sector;
            if (sector === 'Agriculture' || sector === 'Agritech') { item.Sector ? item.Sector = 'agri' : item.sector = 'agri'; }
            if (sector === 'Renewables' || sector === 'Renewable Energy') { item.Sector ? item.Sector = 'energy' : item.sector = 'energy'; }
            if (sector === 'Digital/AI' || sector === 'Digital') { item.Sector ? item.Sector = 'digital' : item.sector = 'digital'; }
        };

        if (this.ventures.length > 0) {
            this.ventures.forEach(normalize);
        }
        // Normalize Top Occupations Sectors
        if (this.topOccupations.length > 0) {
             this.topOccupations.forEach(normalize);
        }
        // Normalize Top Skills Sectors
        if (this.topSkills.length > 0) {
            this.topSkills.forEach(normalize);
        }
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
        // Fix for DRC naming inconsistency
        if (searchCountry === 'DRC' || searchCountry === 'Democratic Republic of Congo') searchCountry = 'DR Congo';
        
        // Try ID lookup first
        if (occId) {
            const byId = this.wageMap.get(`${occId}-${searchCountry}`);
            if (byId) return byId;
        }

        // Fallback to Name lookup
        return this.wages.find(d => 
            (d.country === searchCountry || d.Country === searchCountry) && 
            (d.occupation === occupation || d.Occupation === occupation)
        );
    }

    getVentures(sectorId, country) {
        let searchCountry = country;
        // Normalize DRC for data lookup
        if (searchCountry === 'DRC' || searchCountry === 'Democratic Republic of Congo') searchCountry = 'DR Congo';

        return this.ventures.filter(v => 
            v.Sector === sectorId && 
            (country === 'all' || v.Country === searchCountry || v.Country === 'All')
        );
    }
    
    getOccupations(sectorId) {
        // Filter top occupations from external file
        const occs = this.topOccupations.filter(o => (o.sector === sectorId || o.Sector === sectorId));
        if (occs.length > 0) {
            return occs.sort((a,b) => (a.rank || a.Rank) - (b.rank || b.Rank)).map(o => ({
                name: o.occupationRole || o.Occupation_Role,
                desc: (o.skillsDescription || o.Skills_Description) ? (o.skillsDescription || o.Skills_Description).split('.')[0] + '.' : (o.description || o.Description || 'Key role in sector.'),
                isHot: (o.rank || o.Rank) <= 4,
                id: o.masterOccId || o.Master_Occ_ID, // Keep ID for linking
                why: o.whyInDemand || o.Why_In_Demand // Capture Why in Demand
            }));
        }
        return null; // Return null to fallback to baseSectorDetailData
    }

    getSkills(sectorId) {
        // Filter top skills from external file
        const skills = this.topSkills.filter(s => (s.sector === sectorId || s.Sector === sectorId));
        
        if (skills.length > 0) {
            return skills.map(s => ({
                name: s.skill || s.Skill,
                desc: s.description || s.Description,
                narrative: s.narrative || s.Narrative,
                isHot: s.isHot || false
            }));
        }
        
        return null; // Return null to fallback to baseSectorDetailData
    }

    getFallbackVentures() {
        console.warn("Using fallback venture data.");
        // Use global fallback from data.js
        return (typeof fallbackVentures !== 'undefined') ? fallbackVentures : [];
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
        (d.country === searchCountry || d.Country === searchCountry) && 
        (d.occupation === targetOccupation || d.Occupation === targetOccupation)
    );

    if (entry) {
        return { count: entry.ojaCount || entry.OJA_Count || "N/A", ref: entry.ojaReference || entry.OJA_Reference || "UNESCO Global Skills Tracker" };
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
            
            if (wageEntry && (wageEntry.p25MonthlyWage || wageEntry.P25_Monthly_Wage)) {
                const p25 = wageEntry.p25MonthlyWage || wageEntry.P25_Monthly_Wage;
                const p75 = wageEntry.p75MonthlyWage || wageEntry.P75_Monthly_Wage;
                const curr = wageEntry.currency || wageEntry.Currency;
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

            if (wageEntry && (wageEntry.Typical_Employers || wageEntry.typicalEmployers)) {
                employers = wageEntry.Typical_Employers || wageEntry.typicalEmployers;
            } else if (typeof roleEmployers !== 'undefined' && roleEmployers[title]) {
                employers = roleEmployers[title];
                // Append country context if available
                if (sectorOverrides && sectorOverrides.hiring) {
                    employers += `, ${sectorOverrides.hiring}`;
                }
            }
            
            // Apply Work Setting if available
            if (wageEntry && (wageEntry.Work_Setting || wageEntry.workSetting)) {
                workMode = wageEntry.Work_Setting || wageEntry.workSetting;
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
                if (activeSectorId === 'agri') theme = 'green';
                if (activeSectorId === 'energy') theme = 'yellow';
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
            const catalogue = getMasterTrainingCatalogue(keySkill, activeSectorId, activeCountry);
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
               missingSkills: 3,
                matches,
                tools: toolsList,
                credentials,
                resources,
                sector: sectorName,
                specificSkills: rawSkills // Return object instead of array
            };
        }

        // --- HELPER: GENERATE OUTCOME DATA (Updated for Real Data) ---
        const generateOutcomeScorecard = (providerName) => {
            const name = providerName || "";
            const config = (typeof outcomeScorecardConfig !== 'undefined') ? outcomeScorecardConfig : { verified: [], online: [] };
            
            const hasData = config.verified.some(k => name.includes(k));
            const isOnline = config.online.some(k => name.includes(k));
            
            if (hasData) {
                return { available: true, placement: { d90: '62%', m6: '85%', y1: '94%' }, uplift: '+45%', methodology: 'Independent Audit', stars: 4 };
            } else if (isOnline) {
                return { available: true, placement: { d90: 'N/A', m6: 'Global Avg', y1: 'N/A' }, uplift: 'Varies', methodology: 'Self-Reported', stars: 3 };
            } else {
                return { available: false }; 
            }
        };

        // --- MASTER TRAINING CATALOGUE (FILTERED REAL DATA) ---
        const getMasterTrainingCatalogue = (skillName, sector, country) => {
            // Use DataManager courses
            let sourceData = dataManager.courses;
            
            if (!sourceData || sourceData.length === 0) {
                 if (typeof realCourses !== 'undefined') sourceData = realCourses;
                 else return { short: [], med: [], long: [] };
            }

            const bySector = (c) => c.sector === sector || c.sector === 'all';
            const byCountry = (c) => {
                if(c.country === 'all') return true;
                // Normalize DRC for data lookup
                let searchCountry = country === 'DRC' ? 'DR Congo' : country;
                if(country === 'all') return true;
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
                 c.outcomeData = generateOutcomeScorecard(c.provider);
            });

            return { short, med, long };
        };
        
        // --- RENDER FUNCTIONS ---
        
        function formatTrainingList(trainingList) {
            if(!trainingList) return '<div class="text-xs text-slate-500">No specific courses found for this filter.</div>';
            
            return trainingList.map(t => {
                if(!t) return ''; 
                
                const modalityIcon = t.mode === 'Online' ? 'monitor' : t.mode === 'In-Person' ? 'map-pin' : 'shuffle';
                
                let scorecardHtml = '';
                const isSaved = myPlan.courses.has(t.id);
                const saveIconClass = isSaved ? "fill-indigo-600 text-indigo-600" : "text-slate-300 hover:text-indigo-600";

                if (t.outcomeData && t.outcomeData.available) {
                    // ... existing scorecard logic ...
                    const stars = Array(5).fill(0).map((_, i) => 
                        `<i data-lucide="star" class="w-3 h-3 ${i < t.outcomeData.stars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}"></i>`
                    ).join('');

                    scorecardHtml = `
                        <div class="mt-3 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                            <div class="bg-indigo-50 px-3 py-1.5 border-b border-indigo-100 flex justify-between items-center">
                                <span class="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">Provider Outcome Scorecard</span>
                                <div class="flex gap-0.5" title="Data Quality: ${t.outcomeData.stars}/5">${stars}</div>
                            </div>
                            <div class="p-3 grid grid-cols-2 gap-y-3 gap-x-4">
                                <div class="col-span-2">
                                    <div class="text-[10px] text-slate-500 uppercase font-semibold mb-1">Placement Rate (Verified)</div>
                                    <div class="flex justify-between text-xs text-slate-700 bg-slate-50 rounded px-2 py-1 border border-slate-100">
                                        <span><strong>90d:</strong> ${t.outcomeData.placement.d90}</span>
                                        <span class="border-l border-slate-200 mx-1"></span>
                                        <span><strong>6m:</strong> ${t.outcomeData.placement.m6}</span>
                                        <span class="border-l border-slate-200 mx-1"></span>
                                        <span><strong>1y:</strong> ${t.outcomeData.placement.y1}</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-[10px] text-slate-500 uppercase font-semibold">Salary Uplift</div>
                                    <div class="text-sm font-bold text-emerald-600">${t.outcomeData.uplift}</div>
                                </div>
                                <div>
                                    <div class="text-[10px] text-slate-500 uppercase font-semibold">Methodology</div>
                                    <div class="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded w-fit border border-indigo-100">${t.outcomeData.methodology}</div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    scorecardHtml = `
                        <div class="mt-3 bg-slate-50 rounded-lg p-3 border border-slate-200">
                            <div class="flex items-start gap-2">
                                <i data-lucide="alert-circle" class="w-4 h-4 text-slate-400 mt-0.5 shrink-0"></i>
                                <div>
                                    <div class="text-xs font-bold text-slate-700">No public outcomes data available</div>
                                    <div class="text-[10px] text-slate-500 leading-tight mt-1">
                                        This provider does not publicly report verified employment or salary data. Independent tracking is recommended.
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                return `
                    <div class="flex flex-col p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer group shadow-sm">
                        <div class="flex justify-between items-start mb-2">
                            <div class="pr-2">
                                <a href="${t.url}" target="_blank" class="font-bold text-base text-indigo-700 hover:underline flex items-start gap-1 leading-tight">
                                    ${t.name} <i data-lucide="external-link" class="w-3 h-3 mt-1 shrink-0"></i>
                                </a>
                                <div class="text-xs text-slate-500 mt-0.5 flex items-center gap-1 flex-wrap">
                                    ${t.school}
                                    ${t.gsa_member ? '<span title="UNESCO Global Skills Academy Partner" class="text-[9px] bg-blue-100 text-blue-700 px-1 rounded border border-blue-200">UNESCO GSA</span>' : ''}
                                    ${t.unesco_unevoc ? '<span title="UNESCO-UNEVOC Network Member" class="text-[9px] bg-orange-100 text-orange-700 px-1 rounded border border-orange-200">UNEVOC</span>' : ''}
                                    ${t.women_focused ? '<span title="Women-Focused Program" class="text-[9px] bg-pink-100 text-pink-700 px-1 rounded border border-pink-200">Women-Focused</span>' : ''}
                                </div>
                            </div>
                            <div class="flex items-center gap-2 shrink-0">
                                <div class="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-full border border-slate-200 whitespace-nowrap">${t.type}</div>
                                <button onclick="event.stopPropagation(); togglePlanItem('courses', '${t.id}', '${t.name.replace(/'/g, "\\'")}')" class="p-1 rounded-full hover:bg-slate-50 transition-colors"><i data-lucide="bookmark" class="w-4 h-4 ${saveIconClass}"></i></button>
                            </div>
                        </div>
                        
                        <!-- Added Description Section -->
                        <div class="text-xs text-slate-600 mb-3 leading-snug line-clamp-3">
                            ${t.description || 'No description available.'}
                        </div>

                        <div class="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 mb-3">
                            <div class="text-center">
                                <div class="text-sm font-bold text-green-600">${t.durationMonths}</div>
                                <div class="text-[10px] text-slate-500">Duration</div>
                            </div>
                            <div class="text-center border-x border-slate-100">
                                <div class="text-sm font-bold text-indigo-600 truncate px-1">${t.costDisplay}</div>
                                <div class="text-[10px] text-slate-500">Cost</div>
                            </div>
                            <div class="text-center">
                                <i data-lucide="${modalityIcon}" class="w-4 h-4 mx-auto text-slate-500 mb-0.5"></i>
                                <div class="text-[10px] text-slate-500">${t.mode}</div>
                            </div>
                        </div>
                        <div class="space-y-2 mb-2">
                            <div class="flex items-start gap-2">
                                <div class="p-1 bg-purple-50 text-purple-600 rounded-full shrink-0 mt-0.5"><i data-lucide="cpu" class="w-3 h-3"></i></div>
                                <div class="text-xs text-slate-700">
                                    <span class="font-bold">Skills:</span> ${t.skillsCovered.slice(0, 3).join(', ') + (t.skillsCovered.length > 3 ? ` +${t.skillsCovered.length - 3} more` : '')}
                                </div>
                            </div>
                            <div class="flex items-start gap-2">
                                <div class="p-1 bg-amber-50 text-amber-600 rounded-full shrink-0 mt-0.5"><i data-lucide="book-open" class="w-3 h-3"></i></div>
                                <div class="text-xs text-slate-700">
                                    <span class="font-bold">Prereq:</span> ${t.prerequisites || 'None'} <span class="text-slate-400">|</span> <span class="font-bold">Lang:</span> ${t.language || 'English'}
                                </div>
                            </div>
                        </div>
                        ${scorecardHtml}
                        <div class="flex justify-between items-center mt-3">
                            <div class="text-[9px] text-slate-400 italic">Updated: ${t.lastUpdated || '2024'}</div>
                            <a href="${t.url}" target="_blank" class="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1">
                                Visit Site <i data-lucide="arrow-right" class="w-3 h-3"></i>
                            </a>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        function filterSkillTraining(level) {
            if (!currentSkillData) {
                console.error("Skill data not cached. Cannot filter.");
                return;
            }

            const listContainer = document.getElementById('skill-training-list');
            const label = document.getElementById('skill-training-filter-label');
            const buttonContainer = document.getElementById('skill-filter-container');
            
            let filteredCourses = [];
            let levelLabel = "All Levels";

            if (level === 'all') {
                filteredCourses = [...currentSkillData.short, ...currentSkillData.med, ...currentSkillData.long];
            } else {
                filteredCourses = currentSkillData[level];
                levelLabel = level === 'short' ? 'Beginner' : level === 'med' ? 'Intermediate' : 'Advanced';
            }
            
            if(buttonContainer) {
                const buttons = buttonContainer.querySelectorAll('button');
                buttons.forEach(btn => {
                    const isTarget = btn.getAttribute('onclick').includes(`'${level}'`);
                    if(isTarget) {
                        btn.classList.remove('bg-slate-100', 'text-slate-600', 'border-slate-200');
                        btn.classList.add('bg-indigo-100', 'text-indigo-700', 'border-indigo-300');
                    } else {
                        btn.classList.add('bg-slate-100', 'text-slate-600', 'border-slate-200');
                        btn.classList.remove('bg-indigo-100', 'text-indigo-700', 'border-indigo-300');
                    }
                });
            }

            listContainer.innerHTML = formatTrainingList(filteredCourses);
            label.innerText = levelLabel;
            if(window.lucide) lucide.createIcons();
        }

        window.showUnifiedTab = function(tabId) {
            document.querySelectorAll('.pp-tab-content').forEach(c => c.classList.add('hidden'));
            
            const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[activeSectorId] : { color: 'indigo' };
            const theme = themeConfig.color;

            // Reset all buttons
            document.querySelectorAll('.pp-tab-btn').forEach(b => {
                // Remove all active color classes
                b.classList.remove(
                    'text-violet-700', 'border-violet-600', 'bg-violet-50',
                    'text-blue-700', 'border-blue-600', 'bg-blue-50',
                    'text-emerald-700', 'border-emerald-600', 'bg-emerald-50',
                    'text-amber-700', 'border-amber-600', 'bg-amber-50',
                    'text-slate-700', 'border-slate-600', 'bg-slate-50',
                    'text-indigo-700', 'border-indigo-600', 'bg-indigo-50'
                );
                // Add default inactive state
                b.classList.add('text-slate-500', 'border-transparent', 'hover:text-slate-700', 'hover:bg-slate-50');
            });
            
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            } else {
                return;
            }

            const activeBtn = document.querySelector(`.pp-tab-btn[data-tab="${tabId}"]`);
            if(activeBtn) {
                activeBtn.classList.remove('text-slate-500', 'border-transparent', 'hover:text-slate-700', 'hover:bg-slate-50');
                activeBtn.classList.add(`text-${theme}-700`, `border-${theme}-600`, `bg-${theme}-50`);
            }

            // Lazy Load Logic for specific tabs
            if (tabId === 'pp-courses') {
                renderProviderTable();
            } else if (tabId === 'pp-impact') {
                // Small timeout to ensure DOM is visible for Chart.js sizing
                setTimeout(() => { initImpactCharts(); }, 100);
            }

            // Scroll to top logic
            const container = document.getElementById('pp-scroll-container');
            if(container) {
                container.scrollTop = 0;
            }
            
            if(window.lucide) lucide.createIcons();
        }

        // --- NEW: Switch Sector inside PATHWAY ---
        window.switchPATHWAYSector = function(sector) {
            // Use global setter to sync UI and state
            setGlobalSector(sector);

            // Re-render PATHWAY content
            renderPATHWAYContent();
        }

        // --- NEW: Calculate Diagnostic Results (Updated with Skills Analysis) ---
        window.calculateDiagnosticResults = function() {
            // 1. Get Values & Analyze Individual Inputs
            const layerAInputs = document.querySelectorAll('input[name="layerA"]');
            const layerBInputs = document.querySelectorAll('input[name="layerB"]');

            // Helper to get data
            const getSkillData = (inputs, type) => {
                return Array.from(inputs).map(input => ({
                    skill: input.dataset.skill || "Skill",
                    score: parseInt(input.value),
                    type: type
                }));
            };

            const techSkillsData = getSkillData(layerBInputs, 'Technical');
            const softSkillsData = getSkillData(layerAInputs, 'Employability');
            const allSkillsData = [...techSkillsData, ...softSkillsData];

            // Calculate Averages
            const scoreA = softSkillsData.reduce((acc, curr) => acc + curr.score, 0) / (softSkillsData.length || 1);
            const scoreB = techSkillsData.reduce((acc, curr) => acc + curr.score, 0) / (techSkillsData.length || 1);

            
            // 1b. Analyze Evidence (Checkboxes) - NEW
            const evidenceInputs = document.querySelectorAll('input[name="profile_evidence"]:checked');
            // Map 0-5+ items to a 1-5 score roughly
            const scoreEvidence = Math.min(Math.max(evidenceInputs.length, 1), 5);

            // 1c. Analyze Qualifications (NEW)
            const qualChecks = document.querySelectorAll('input[name="qual_check"]');
            const qualChecked = document.querySelectorAll('input[name="qual_check"]:checked');
            const scoreQuals = qualChecks.length > 0 ? (qualChecked.length / qualChecks.length) * 5 : 0;

            // Get Selected Role
            const roleSelect = document.getElementById('pp-role-selector');
            const selectedRole = roleSelect ? roleSelect.value : "Selected Role";

            // 2. Weighted Average (30% Quals, 30% Tech, 20% Soft, 20% Evidence)
            const totalScore = (scoreQuals * 0.3) + (scoreB * 0.3) + (scoreA * 0.2) + (scoreEvidence * 0.2);
            const percent = Math.round((totalScore / 5) * 100);

            // 3. Determine Tier & Segments
            let tier = "Explorer";
            let tierCode = "explorer"; 
            let color = "slate";
            let msg = "You are in the <strong>Explorer</strong> phase. You have early interest but need to build core foundations.";
            let nextStep = "Take introductory courses & join community events";
            
            if (percent > 85) { 
                tier = "Job-ready (Independent)"; 
                tierCode = "independent";
                color = "emerald"; 
                msg = "<strong>Job-ready (Independent)</strong>. You show signs of a strong portfolio and ability to execute work independently."; 
                nextStep = "Apply for senior roles or freelance contracts";
            }
            else if (percent > 65) { 
                tier = "Job-ready (Entry)"; 
                tierCode = "entry";
                color = "indigo"; 
                msg = "<strong>Job-ready (Entry)</strong>. You are capable of performing entry-level tasks with supervision."; 
                nextStep = "Apply for Junior roles & polish your portfolio";
            }
            else if (percent > 40) { 
                tier = "Apprentice-ready"; 
                tierCode = "apprentice";
                color = "amber"; 
                msg = "<strong>Apprentice-ready</strong>. You have the basics and can start structured training or applied projects."; 
                nextStep = "Enroll in a bootcamp, internship, or hackathon";
            }

            // 4. SKILLS ANALYSIS LOGIC
            // Identify Strengths & Gaps for Narrative
            const strengths = allSkillsData.filter(s => s.score >= 4).map(s => s.skill);
            const gaps = allSkillsData.filter(s => s.score < 4).map(s => s.skill);

            let synthesisText = '';
            if (strengths.length > 0 && gaps.length > 0) {
                synthesisText = `You have a solid foundation in <strong>${strengths.slice(0, 3).join(', ')}</strong>${strengths.length > 3 ? ' and others' : ''}. To become fully job-ready for this role, focus your efforts on strengthening <strong>${gaps.slice(0, 3).join(', ')}</strong>.`;
            } else if (gaps.length === 0) {
                synthesisText = `Excellent work! You demonstrate high proficiency across all key areas for this role. Focus on portfolio building and networking.`;
            } else {
                synthesisText = `You are at the beginning of your journey. Prioritize foundational training in <strong>${gaps.slice(0, 3).join(', ')}</strong> to build your profile.`;
            }

            // --- NEW: Dynamic Related Roles Logic ---
            const currentRoleSkills = roleSkills[selectedRole] ? new Set(roleSkills[selectedRole].technical) : new Set();
            let relatedRoles = [];

            if (currentRoleSkills.size > 0) {
                Object.entries(roleSkills).forEach(([rName, rData]) => {
                    if (rName === selectedRole) return;
                    // Simple intersection count
                    const overlap = rData.technical.filter(s => currentRoleSkills.has(s)).length;
                    // Calculate % match based on the target role's total skills
                    const matchScore = Math.round((overlap / rData.technical.length) * 100);
                    
                    if (matchScore > 30) { // Only show relevant matches
                        relatedRoles.push({ name: rName, score: matchScore });
                    }
                });
                relatedRoles.sort((a, b) => b.score - a.score);
            }
            // Fallback if no data
            if (relatedRoles.length === 0) relatedRoles = [{name: "Agri-Data Analyst", score: 65}, {name: "Farm Systems Lead", score: 55}];

            // Hide Inputs
            const inputsContainer = document.getElementById('diagnostic-inputs');
            if(inputsContainer) inputsContainer.classList.add('hidden');

            // 6. Render Results
            const resultsDiv = document.getElementById('diagnostic-results');

            // Dynamic data generation for new UI
            const matchStatus = percent > 65 ? "Strong Match" : percent > 40 ? "Good Match" : "Poor Match";
            const matchColor = percent > 65 ? "emerald" : percent > 40 ? "amber" : "rose";
            const fitText = percent > 65 ? "Great Fit" : percent > 40 ? "Good Fit" : "Poor Fit";
            const fitTextColor = percent > 65 ? "text-emerald-600" : percent > 40 ? "text-amber-600" : "text-rose-600";
            
            let summaryText = percent > 85 ? "you are highly qualified for this role." : percent > 65 ? "you are well-qualified for this role." : percent > 40 ? "you have a foundational match for this role." : "you have several skill gaps for this role.";
            if (scoreQuals < 3) summaryText += " Note: You may be missing key qualifications.";

            // Get role options for the dropdown
            let sectorOccupations = dataManager.getOccupations(activeSectorId);
            if (!sectorOccupations || sectorOccupations.length === 0) {
                sectorOccupations = baseSectorDetailData[activeSectorId] ? baseSectorDetailData[activeSectorId].occupations : [];
            }

            const roleOptions = sectorOccupations.slice(0, 10).map(r => {
                const isSelected = (r.name === selectedRole) ? 'selected' : '';
                return `<option value="${r.name}" ${isSelected}>${r.name}</option>`;
            }).join('');

            resultsDiv.innerHTML = `
            <div class="animate-fade-in bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-4">
                <div class="p-4 border-b border-slate-100 bg-slate-50">
                    <div class="flex flex-wrap justify-between items-center mb-3 gap-2">
                        <h3 class="font-bold text-slate-800 text-sm shrink-0">Assessment Results</h3>
                        <div class="flex items-center gap-2 shrink-0">
                            <button onclick="renderPATHWAYContent('${selectedRole}')" class="text-[10px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm transition-colors"><i data-lucide="rotate-ccw" class="w-3 h-3"></i> Retake</button>
                            <span class="px-2 py-1 rounded-full bg-${matchColor}-100 text-${matchColor}-700 text-[10px] font-bold uppercase tracking-wider">${matchStatus}</span>
                        </div>
                    </div>
                    <select onchange="renderPATHWAYContent(this.value)" class="w-full text-sm border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2">
                        ${roleOptions}
                    </select>
                </div>
                <div class="p-6 space-y-6">
                    <!-- 1. Readiness Spectrum -->
                    <div>
                        <div class="flex justify-between items-end mb-2">
                            <span class="text-xs font-bold text-slate-500 uppercase tracking-wide">Role Readiness Score</span>
                            <span class="text-2xl font-bold text-indigo-600">${percent}%</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full" style="width: ${percent}%"></div>
                        </div>
                    </div>

                    <!-- 2. Assessment Synthesis (Restored) -->
                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <i data-lucide="lightbulb" class="w-3 h-3 text-amber-500"></i> Assessment Synthesis
                        </h4>
                        <p class="text-sm text-slate-700 leading-relaxed">${synthesisText}</p>
                    </div>

                    <!-- INLINE PATHWAY RESULT -->
                    <div id="diagnostic-inline-pathway" class="mt-8 pt-8 border-t border-slate-200">
                        <!-- Pathway content will be injected here -->
                    </div>
                </div>
            </div>
            `;
            
            // Scroll to results
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
            
            // Generate Pathway IN-PLACE (Tab 1)
            if(typeof window.generatePersonalizedPathway === 'function') {
                window.generatePersonalizedPathway(tierCode, activeSectorId, softSkillsData.filter(s => s.score < 4).map(s => s.skill), techSkillsData.filter(s => s.score < 4).map(s => s.skill), selectedRole, 'diagnostic-inline-pathway');
            }
            
            if(window.lucide) lucide.createIcons();
        }

        // --- NEW: Generate Personalized Pathway Content ---
        window.generatePersonalizedPathway = function(tierCode, sector, empGaps = [], techGaps = [], roleName = "General Role", targetContainerId = 'pp-practice-content') {
            const container = document.getElementById(targetContainerId);
            if (!container) return;
            
            // 1. Select Courses based on Tier
            // UPDATED: Logic to fetch 4-6 recommendations across Skill/Up-skill/Re-skill
            const catalogue = getMasterTrainingCatalogue('all', sector, activeCountry);
            
            // --- NEW: Sort buckets by Location (National > Global) ---
            const sortByLocation = (list) => {
                if (activeCountry === 'all') return list;
                return list.sort((a, b) => {
                    const aIsLocal = a.country === activeCountry;
                    const bIsLocal = b.country === activeCountry;
                    if (aIsLocal && !bIsLocal) return -1;
                    if (!aIsLocal && bIsLocal) return 1;
                    return 0;
                });
            };
            catalogue.short = sortByLocation(catalogue.short);
            catalogue.med = sortByLocation(catalogue.med);
            catalogue.long = sortByLocation(catalogue.long);

            let prioritizedCourses = [];
            let pathwayFocus = "Skill Building";
            
            if (tierCode === 'independent') {
                // Mastery / Specialization
                pathwayFocus = "Mastery & Specialization";
                prioritizedCourses = [...catalogue.long, ...catalogue.med, ...catalogue.short];
            } else if (tierCode === 'entry') {
                // Advanced Up-skill
                pathwayFocus = "Advanced Skilling";
                prioritizedCourses = [...catalogue.med, ...catalogue.short, ...catalogue.long];
            } else if (tierCode === 'apprentice') {
                // Intermediate
                pathwayFocus = "Intermediate Skilling";
                prioritizedCourses = [...catalogue.med, ...catalogue.short];
            } else {
                // Foundational (Explorer)
                pathwayFocus = "Foundational Skills";
                prioritizedCourses = [...catalogue.short, ...catalogue.med, ...catalogue.long];
            }

            // NEW: Prioritize courses that match identified Technical Gaps
            if (techGaps && techGaps.length > 0) {
                prioritizedCourses.sort((a, b) => {
                    const countMatches = (course) => {
                        if (!course.skillsCovered) return 0;
                        // Check if any course skill loosely matches a gap skill
                        return course.skillsCovered.filter(s => techGaps.some(g => s.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(s.toLowerCase()))).length;
                    };
                    
                    const matchesA = countMatches(a);
                    const matchesB = countMatches(b);
                    
                    if (matchesA !== matchesB) return matchesB - matchesA; // Descending matches
                    
                    // Secondary Sort: Location
                    if (activeCountry !== 'all') {
                        const aIsLocal = a.country === activeCountry;
                        const bIsLocal = b.country === activeCountry;
                        if (aIsLocal && !bIsLocal) return -1;
                        if (!aIsLocal && bIsLocal) return 1;
                    }
                    return 0;
                });
            }

            // Select top 6 unique recommendations
            let relevantCourses = prioritizedCourses.slice(0, 6).filter(c => c); // Filter out undefined

            // --- COUNTRY SPECIFIC CONTEXT MAP ---
            // Default to 'all' if country not found, or use activeCountry
            const localTip = countryPathwayContext[activeCountry] || countryPathwayContext['all'];

            // Determine Theme based on Sector
            let theme = 'indigo';
            if (sector === 'agri') theme = 'green';
            if (sector === 'energy') theme = 'orange';

            // --- PROOF PROMPTS MAP (With Real Examples/Links) ---

            // Generate Proof Prompts List based on Gaps
            let proofHtml = '';
            if (empGaps.length > 0) {
                proofHtml = empGaps.map(gap => {
                    // Try exact match
                    let item = proofPromptsMap[gap];
                    let linkHtml = '';

                    if (item && item.link && item.link !== '#') {
                        linkHtml = `
                            <a href="${item.link}" target="_blank" class="mt-auto text-[10px] font-bold text-${theme}-600 hover:text-${theme}-800 hover:underline flex items-center gap-1 self-start">
                                ${item.label} <i data-lucide="external-link" class="w-2.5 h-2.5"></i>
                            </a>`;
                    } else {
                        // Fallback if no map entry found or no link
                        const text = item ? item.text : `Demonstrate your ${gap.toLowerCase()} in a real-world scenario.`;
                        item = { text: text };
                        linkHtml = `<span class="mt-auto text-[10px] font-bold text-slate-400 cursor-default flex items-center gap-1 self-start">Resource N/A</span>`;
                    }
                    
                    return `
                        <div class="p-3 bg-${theme}-50 border border-${theme}-100 rounded-lg flex flex-col justify-between h-full">
                            <div>
                                <div class="text-[10px] font-bold text-${theme}-800 uppercase mb-1">Gap: ${gap}</div>
                                <div class="text-xs text-slate-700 font-medium mb-2 leading-snug">
                                    <i data-lucide="pen-tool" class="w-3 h-3 inline mr-1 text-${theme}-500"></i> ${item.text}
                                </div>
                            </div>
                            ${linkHtml}
                        </div>
                    `;
                }).join('');
            } else {
                proofHtml = `
                    <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-lg col-span-2">
                        <div class="text-[10px] font-bold text-emerald-800 uppercase mb-1">Great Foundation</div>
                        <div class="text-xs text-slate-700">You have strong employability skills. Focus on maintaining them through mentorship.</div>
                    </div>
                `;
            }

            // --- ROLE SPECIFIC PRACTICE TASKS ---


            // Select specific tasks or fall back to default
            const practiceTasks = rolePracticeMap[roleName] || defaultPracticeTasks;
            const practiceHtml = practiceTasks.map(t => {
                const isLinkValid = t.link && t.link !== "#";
                const linkAttr = isLinkValid ? `href="${t.link}" target="_blank"` : '';
                const cursorClass = isLinkValid ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default opacity-80';
                const iconHtml = isLinkValid 
                    ? `<i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500"></i>`
                    : `<span class="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">N/A</span>`;

                return `
                <a ${linkAttr} class="p-3 ${cursorClass} transition-colors group flex items-center justify-between">
                    <div class="flex items-start gap-3">
                        <div class="p-2 bg-indigo-50 text-indigo-600 rounded shrink-0"><i data-lucide="${t.icon}" class="w-4 h-4"></i></div>
                        <div>
                            <div class="text-xs font-bold text-indigo-700 mb-0.5">${t.title}</div>
                            <div class="text-xs text-slate-600">${t.desc}</div>
                        </div>
                    </div>
                    ${iconHtml}
                </a>
            `}).join('');

            // 3. Render HTML
            let courseHtml = relevantCourses.map(t => {
                // Check if course matches a gap
                const matchedGaps = (techGaps && t.skillsCovered) 
                    ? t.skillsCovered.filter(s => techGaps.some(g => s.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(s.toLowerCase()))) 
                    : [];
                const matchTag = matchedGaps.length > 0 ? `<span class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-100 text-emerald-800">Matches Gap: ${matchedGaps[0]}</span>` : '';
                
                // UNESCO Tags
                const gsaTag = t.gsa_member ? `<span class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-100 text-blue-800 border border-blue-200" title="UNESCO Global Skills Academy Partner">UNESCO GSA</span>` : '';
                const unevocTag = t.unesco_unevoc ? `<span class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-orange-100 text-orange-800 border border-orange-200" title="UNESCO-UNEVOC Network Member">UNEVOC</span>` : '';
                
                const hasLink = t.url && t.url !== '#';
                const tag = hasLink ? 'a' : 'div';
                const href = hasLink ? `href="${t.url}" target="_blank"` : '';
                const cursor = hasLink ? 'hover:shadow-md cursor-pointer' : 'cursor-default opacity-75';
                const icon = hasLink ? `<i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500 transition-colors"></i>` : `<span class="text-[9px] text-slate-400 font-bold">N/A</span>`;

                return `
                <${tag} ${href} class="flex flex-col justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg hover:border-blue-300 ${cursor} transition-all group text-left h-full">
                    <div>
                        <div class="flex justify-between items-start mb-2">
                            <div class="text-[10px] font-bold text-blue-700 uppercase tracking-wide bg-white px-2 py-0.5 rounded border border-blue-100 inline-block">Recommended</div>
                            ${icon}
                        </div>
                        <div class="text-sm font-bold text-slate-800 leading-tight mb-1 group-hover:text-blue-700 transition-colors line-clamp-2">${t.name}</div>
                        <div class="text-xs text-slate-600 mb-2 line-clamp-2">${t.provider}</div>
                    </div>
                    <div class="flex items-center gap-2 text-[10px] text-slate-500 border-t border-blue-100 pt-2 mt-auto">
                        <span>${t.duration}</span>
                        <span class="text-blue-300">•</span>
                        <span>${t.mode}</span>
                        ${unevocTag ? `<span class="ml-auto">${unevocTag}</span>` : ''}
                    </div>
                </${tag}>
            `}).join('');

            if (relevantCourses.length === 0) {
                courseHtml = `<div class="col-span-1 md:col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 text-center italic">No specific training recommendations found for this profile tier. Please explore the full Training Hub.</div>`;
            }

            // --- SECTOR SPECIFIC RESOURCES (New Request) ---
            let sectorResourcesHtml = '';
            let empSectionNum = 3; // Default Employability to 3

            // 1. Start with static data from data.js (if available)
            let resources = (typeof sectorPathwayResources !== 'undefined' && sectorPathwayResources[sector]) ? [...sectorPathwayResources[sector]] : [];

            // 2. Merge with dynamic data from digital_resources.json (via helper)
            if (typeof getSectorCareerResources === 'function') {
                const dynamicResources = getSectorCareerResources(sector);
                if (dynamicResources) {
                    // Add LMI (Market Intel)
                    if (dynamicResources.lmi) {
                        dynamicResources.lmi.slice(0, 2).forEach(r => {
                            if (!resources.some(ex => ex.title === r.name)) {
                                resources.push({ title: r.name, desc: r.desc, link: r.link, icon: 'line-chart' });
                            }
                        });
                    }
                    // Add Communities
                    if (dynamicResources.communities) {
                        dynamicResources.communities.slice(0, 2).forEach(r => {
                            if (!resources.some(ex => ex.title === r.name)) {
                                resources.push({ title: r.name, desc: r.desc, link: r.link, icon: 'users' });
                            }
                        });
                    }
                }
            }

            // Filter for valid links only
            resources = resources.filter(r => r.link && r.link.startsWith('http'));

            // Limit to 6 items for display
            resources = resources.slice(0, 6);

            if (resources.length > 0) {
                const resourceItems = resources.map(r => {
                    const hasLink = r.link && r.link !== '#';
                    const tag = hasLink ? 'a' : 'div';
                    const href = hasLink ? `href="${r.link}" target="_blank"` : '';
                    const cursor = hasLink ? 'hover:shadow-sm cursor-pointer' : 'cursor-default opacity-75';
                    const icon = hasLink ? `<i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-${theme}-500"></i>` : `<span class="text-[9px] text-slate-400 font-bold">N/A</span>`;

                    return `
                    <${tag} ${href} class="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-${theme}-300 ${cursor} transition-all group">
                        <div class="p-2 bg-${theme}-50 text-${theme}-600 rounded-lg shrink-0 group-hover:bg-${theme}-100"><i data-lucide="${r.icon}" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-slate-800 group-hover:text-${theme}-700 truncate">${r.title}</div>
                            <div class="text-[10px] text-slate-500 truncate">${r.desc}</div>
                        </div>
                        ${icon}
                    </${tag}>
                `}).join('');

                sectorResourcesHtml = `
                    <div>
                        <h4 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <span class="w-5 h-5 rounded-full bg-${theme}-100 text-${theme}-600 flex items-center justify-center text-xs">4</span> 
                            Essential Ecosystem Resources
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            ${resourceItems}
                        </div>
                    </div>
                `;
            }

            const headerTitle = `${pathwayFocus} Pathway: ${roleName}`;
            const headerDesc = "A recommended learning and experience path for this role.";

            container.innerHTML = `
                <div class="space-y-6 animate-fade-in pb-4">
                    
                    <!-- Header -->
                    <div class="bg-slate-50 border-b border-slate-200 -mx-6 -mt-6 px-6 py-4 mb-2 flex justify-between items-start">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                ${activeCountry !== 'all' ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700">Context: ${activeCountry}</span>` : ''}
                            </div>
                            <h3 class="text-lg font-bold text-slate-900">${headerTitle}</h3>
                            <p class="text-xs text-slate-500">${headerDesc}</p>
                        </div>
                    </div>

                    <!-- Step 1: Training & capacity strengthening opportunities -->
                    <div>
                        <h4 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span> 
                            Bridge Knowledge and Skills Gaps
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            ${courseHtml}
                        </div>
                    </div>

                    <!-- Step 2: Apply your technical knowledge -->
                    <div>
                         <h4 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <span class="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">2</span> 
                            Apply your technical knowledge (${roleName})
                        </h4>
                        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div class="divide-y divide-slate-100">
                                <a href="https://github.com/" target="_blank" class="p-3 hover:bg-slate-50 transition-colors group flex items-center justify-between">
                                    <div class="flex items-start gap-3">
                                        <div class="p-2 bg-indigo-50 text-indigo-600 rounded shrink-0"><i data-lucide="briefcase" class="w-4 h-4"></i></div>
                                        <div>
                                            <div class="text-xs font-bold text-indigo-700 mb-0.5">Build a Portfolio</div>
                                            <div class="text-xs text-slate-600">Compile "what I did + evidence" on GitHub, Behance, or LinkedIn.</div>
                                        </div>
                                    </div>
                                    <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500"></i>
                                </a>
                                <a href="https://zindi.africa/" target="_blank" class="p-3 hover:bg-slate-50 transition-colors group flex items-center justify-between">
                                    <div class="flex items-start gap-3">
                                        <div class=" p-2 bg-indigo-50 text-indigo-600 rounded shrink-0"><i data-lucide="code-2" class="w-4 h-4"></i></div>
                                        <div>
                                            <div class="text-xs font-bold text-indigo-700 mb-0.5">Zindi Challenges</div>
                                            <div class="text-xs text-slate-600">Compete in Africa-focused challenges. Build portfolio → Get hired.</div>
                                        </div>
                                    </div>
                                    <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500"></i>
                                </a>
                                <a href="https://www.freecodecamp.org/" target="_blank" class="p-3 hover:bg-slate-50 transition-colors group flex items-center justify-between">
                                    <div class="flex items-start gap-3">
                                        <div class=" p-2 bg-indigo-50 text-indigo-600 rounded shrink-0"><i data-lucide="terminal" class="w-4 h-4"></i></div>
                                        <div>
                                            <div class="text-xs font-bold text-indigo-700 mb-0.5">freeCodeCamp Projects</div>
                                            <div class="text-xs text-slate-600">Learn basics → Build projects → Earn certification.</div>
                                        </div>
                                    </div>
                                    <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500"></i>
                                </a>
                                <a href="https://devpost.com/" target="_blank" class="p-3 hover:bg-slate-50 transition-colors group flex items-center justify-between">
                                    <div class="flex items-start gap-3">
                                        <div class=" p-2 bg-indigo-50 text-indigo-600 rounded shrink-0"><i data-lucide="users" class="w-4 h-4"></i></div>
                                        <div>
                                            <div class="text-xs font-bold text-indigo-700 mb-0.5">Team Challenge / Hackathon</div>
                                            <div class="text-xs text-slate-600">Join a 48h hackathon or group assignment. Check <strong>${localTip.hub}</strong> for local events.</div>
                                        </div>
                                    </div>
                                    <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500"></i>
                                </a>
                                ${practiceHtml}
                            </div>
                        </div>
                    </div>

                    <!-- Step ${empSectionNum}: Enhance your Employability Skills -->
                    <div>
                        <h4 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-3">
                            <span class="w-5 h-5 rounded-full bg-${theme}-100 text-${theme}-600 flex items-center justify-center text-xs">${empSectionNum}</span> 
                            Employability Skills 
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            ${proofHtml}
                        </div>
                    </div>

                    ${sectorResourcesHtml}

                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        // --- Render PATHWAY Content (Restored & Attached to Window) ---
        window.renderPATHWAYContent = function(preSelectedRole = null, preSelectedGoal = null) {
            const sector = activeSectorId;
            let themeColor = 'indigo';
            
            // REMOVED: Sync dropdown value logic (moved to inline HTML generation)

            // --- DATA DEFINITIONS ---
            const context = (typeof sectorContextMap !== 'undefined') ? (sectorContextMap[sector] || sectorContextMap['digital']) : {};


            const activeData = (typeof diagnosticData !== 'undefined') ? (diagnosticData[sector] || diagnosticData['digital']) : { theme: 'indigo', roles: [] };
            themeColor = activeData.theme;

            // --- DETERMINE CURRENT ROLE FIRST (Moved up to fix scope issue) ---
            // Use DataManager to ensure we pull from the same source as the dashboard (Top 10)
            let sectorOccupations = dataManager.getOccupations(sector);
            if (!sectorOccupations || sectorOccupations.length === 0) {
                sectorOccupations = baseSectorDetailData[sector] ? baseSectorDetailData[sector].occupations : activeData.roles.map(r => ({name: r}));
            }
            
            // Determine selected role (Default to first if none selected)
            let currentRoleName = preSelectedRole;
            if (!currentRoleName && sectorOccupations.length > 0) {
                currentRoleName = sectorOccupations[0].name;
            }

            // --- ROLE SPECIFIC BADGE MAP ---
            // Use specific badge if available, else fallback to sector default
            const badgeInfo = (currentRoleName && roleBadgeMap[currentRoleName]) ? roleBadgeMap[currentRoleName] : { title: activeData.badgeTitle, provider: activeData.badgeProvider, standard: activeData.badgeStandard };

            // --- RENDER TABS ---

            // 1. Diagnostic Tab
            const diagContainer = document.getElementById('pp-diagnostic-content');
            if(diagContainer) {
                // Slice to Top 10 to match Dashboard view strictly, but ensure current role is included
                let displayOccs = sectorOccupations.slice(0, 10);
                
                if (currentRoleName && !displayOccs.some(r => r.name === currentRoleName)) {
                    displayOccs = [{name: currentRoleName}, ...displayOccs];
                }

                const roleOptions = displayOccs.map(r => {
                    const isSelected = (r.name === currentRoleName) ? 'selected' : '';
                    return `<option value="${r.name}" ${isSelected}>${r.name}</option>`;
                }).join('');
                
                // --- NEW: Get Skills for Current Role ---
                const sectorDisplayName = sector === 'agri' ? 'Agritech' : sector === 'energy' ? 'Renewable Energy' : 'Digital Economy';
                const roleDetails = getOccupationDetails(currentRoleName, sectorDisplayName);
                
                const techSkills = roleDetails.specificSkills.technical.slice(0, 5);
                const empSkills = roleDetails.specificSkills.employability.slice(0, 5);

                // Qualifications (Global Data)
                const quals = (typeof roleQualifications !== 'undefined' && roleQualifications[currentRoleName]) 
                    ? roleQualifications[currentRoleName] 
                    : { education: "Relevant Degree/Diploma", certification: "Industry Standard Cert", experience: "1-2 Years" };


                // Generate Inputs
                const layerBInputs = techSkills.map((item) => `
                    <div class="mb-4">
                        <div class="flex justify-between mb-1">
                            <label class="text-xs font-medium text-slate-700">${item}</label>
                            <span class="text-[10px] text-slate-400 font-mono" id="val-b-${item.replace(/[^a-zA-Z0-9]/g,'')}">1/5</span>
                        </div>
                        <input type="range" name="layerB" data-skill="${item}" min="1" max="5" value="1" 
                            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-${themeColor}-600"
                            oninput="document.getElementById('val-b-${item.replace(/[^a-zA-Z0-9]/g,'')}').innerText = this.value + '/5'">
                        <div class="flex justify-between text-[9px] text-slate-400 mt-0.5"><span>No Experience</span><span>Can Teach Others</span></div>
                    </div>
                `).join('');

                const layerAInputs = empSkills.map((item) => `
                    <div class="mb-4">
                        <div class="flex justify-between mb-1">
                            <label class="text-xs font-medium text-slate-700">${item}</label>
                            <span class="text-[10px] text-slate-400 font-mono" id="val-a-${item.replace(/[^a-zA-Z0-9]/g,'')}">1/5</span>
                        </div>
                        <input name="layerA" data-skill="${item}" type="range" min="1" max="5" value="1" 
                            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-${themeColor}-600"
                            oninput="document.getElementById('val-a-${item.replace(/[^a-zA-Z0-9]/g,'')}').innerText = this.value + '/5'">
                        <div class="flex justify-between text-[9px] text-slate-400 mt-0.5"><span>Beginner</span><span>Expert</span></div>
                    </div>
                `).join('');

                diagContainer.innerHTML = `
                    <div id="diagnostic-inputs" class="bg-white p-5 rounded-xl border border-slate-200 space-y-6 shadow-sm">
                        
                        <!-- 1. ROLE SELECTOR -->
                        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div class="mb-4">
                                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Role</label>
                                <select id="pp-role-selector" onchange="renderPATHWAYContent(this.value)" class="w-full text-sm font-bold text-slate-700 border-slate-300 rounded-lg shadow-sm focus:border-${themeColor}-500 focus:ring-${themeColor}-500 p-2.5">
                                    ${roleOptions}
                                </select>
                            </div>
                        </div>

                        <!-- 2. THE GATEKEEPER (Qualifications) -->
                        <div>
                            <h3 class="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                                <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">1</span> 
                                Minimum Qualifications Check
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <label class="p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-${themeColor}-400 transition-all bg-white group relative">
                                    <input type="checkbox" name="qual_check" value="edu" class="peer sr-only">
                                    <div class="absolute top-3 right-3 w-4 h-4 border-2 border-slate-300 rounded-full peer-checked:bg-${themeColor}-500 peer-checked:border-${themeColor}-500 transition-colors"></div>
                                    <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Education</div>
                                    <div class="text-xs text-slate-700 font-medium pr-4">${quals.education}</div>
                                </label>
                                <label class="p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-${themeColor}-400 transition-all bg-white group relative">
                                    <input type="checkbox" name="qual_check" value="cert" class="peer sr-only">
                                    <div class="absolute top-3 right-3 w-4 h-4 border-2 border-slate-300 rounded-full peer-checked:bg-${themeColor}-500 peer-checked:border-${themeColor}-500 transition-colors"></div>
                                    <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Certification</div>
                                    <div class="text-xs text-slate-700 font-medium pr-4">${quals.certification}</div>
                                </label>
                                <label class="p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-${themeColor}-400 transition-all bg-white group relative">
                                    <input type="checkbox" name="qual_check" value="exp" class="peer sr-only">
                                    <div class="absolute top-3 right-3 w-4 h-4 border-2 border-slate-300 rounded-full peer-checked:bg-${themeColor}-500 peer-checked:border-${themeColor}-500 transition-colors"></div>
                                    <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Experience</div>
                                    <div class="text-xs text-slate-700 font-medium pr-4">${quals.experience}</div>
                                </label>
                            </div>
                        </div>

                        <!-- 3. SKILLS SCAN -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">2</span> 
                                    Technical Skills
                                </h3>
                                <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    ${layerBInputs}
                                </div>
                            </div>
                            <div>
                                <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</span> 
                                    Employability Skills
                                </h3>
                                <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    ${layerAInputs}
                                </div>
                            </div>
                        </div>

                        <!-- 4. EVIDENCE -->
                        <div>
                            <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">4</span> 
                                Portfolio Evidence
                            </h3>
                            <div class="bg-white border border-slate-200 rounded-xl p-4">
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="profile_evidence" class="rounded text-${themeColor}-600 focus:ring-${themeColor}-500 border-slate-300"><span class="text-xs text-slate-700">Degree / Diploma</span></label>
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="profile_evidence" class="rounded text-${themeColor}-600 focus:ring-${themeColor}-500 border-slate-300"><span class="text-xs text-slate-700">Certificates</span></label>
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="profile_evidence" class="rounded text-${themeColor}-600 focus:ring-${themeColor}-500 border-slate-300"><span class="text-xs text-slate-700">Project Portfolio</span></label>
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="profile_evidence" class="rounded text-${themeColor}-600 focus:ring-${themeColor}-500 border-slate-300"><span class="text-xs text-slate-700">Work History</span></label>
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="profile_evidence" class="rounded text-${themeColor}-600 focus:ring-${themeColor}-500 border-slate-300"><span class="text-xs text-slate-700">References</span></label>
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="profile_evidence" class="rounded text-${themeColor}-600 focus:ring-${themeColor}-500 border-slate-300"><span class="text-xs text-slate-700">Internships</span></label>
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="profile_evidence" class="rounded text-${themeColor}-600 focus:ring-${themeColor}-500 border-slate-300"><span class="text-xs text-slate-700">Volunteering</span></label>
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="profile_evidence" class="rounded text-${themeColor}-600 focus:ring-${themeColor}-500 border-slate-300"><span class="text-xs text-slate-700">Hackathons</span></label>
                                </div>
                            </div>
                        </div>

                        <button onclick="calculateDiagnosticResults()" class="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm">
                            Generate Readiness Report <i data-lucide="sparkles" class="w-4 h-4 text-yellow-400"></i>
                        </button>
                    </div>

                    <!-- RESULTS CONTAINER (Empty initially) -->
                    <div id="diagnostic-results"></div>
                `;
            }

            // Practice Tab
            const pracContainer = document.getElementById('pp-practice-content');
            if(pracContainer) {
                initPathwayWizard(preSelectedGoal);
            }

            // Badges Tab
            const badgeContainer = document.getElementById('pp-badges-content');
            if(badgeContainer) {
                badgeContainer.innerHTML = `
                    <div class="space-y-6">
                        <!-- SECTION 1: Earned Badges -->
                        <div>
                            <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <i data-lucide="award" class="w-4 h-4 text-emerald-600"></i> Earned Credentials
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="p-4 bg-gradient-to-br from-${themeColor}-500 to-${themeColor}-700 rounded-xl text-white relative overflow-hidden shadow-md group">
                                    <i data-lucide="award" class="w-16 h-16 absolute -bottom-4 -right-4 text-white/20"></i>
                                    <div class="relative z-10">
                                        <div class="flex justify-between items-start mb-1">
                                            <div class="text-[10px] uppercase font-bold text-${themeColor}-100">Micro-Credential</div>
                                            <div class="text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-white font-medium">${activeData.badgeProvider}</div>
                                            <div class="text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-white font-medium">${badgeInfo.provider}</div>
                                        </div>
                                        <h3 class="font-bold text-lg leading-tight mb-1">${activeData.badgeTitle}</h3>
                                        <div class="text-[10px] text-${themeColor}-100 italic mb-3 opacity-90">${activeData.badgeStandard}</div>
                                        <h3 class="font-bold text-lg leading-tight mb-1">${badgeInfo.title}</h3>
                                        <div class="text-[10px] text-${themeColor}-100 italic mb-3 opacity-90">${badgeInfo.standard}</div>
                                        
                                        <div class="flex items-center gap-2 mt-2">
                                            <div class="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-[10px]">
                                                <i data-lucide="check-circle" class="w-3 h-3"></i> Verified
                                                <i data-lucide="check-circle" class="w-3 h-3"></i> Recommended
                                            </div>
                                            <button onclick="viewCertificate('${badgeInfo.title}')" class="text-[10px] font-bold bg-white text-${themeColor}-700 px-2 py-1 rounded hover:bg-${themeColor}-50 transition-colors flex items-center gap-1">
                                                View Cert <i data-lucide="file-text" class="w-3 h-3"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 flex-col gap-2">
                                    <i data-lucide="lock" class="w-6 h-6"></i>
                                    <span class="text-xs font-medium">Complete Next Diagnostic</span>
                                </div>
                            </div>
                        </div>
                `;
            }
            
            if(window.lucide) lucide.createIcons();
        }

        // --- PATHWAY BUILDER WIZARD ---
        window.initPathwayWizard = function(preSelectedGoal = null) {
            pathwayState = { goal: preSelectedGoal, constraints: {}, interest: null };
            renderPathwayStep1();
        }

        function _renderSectorOption(id, name, icon) {
            const isActive = activeSectorId === id;
            const theme = (typeof sectorThemes !== 'undefined') ? sectorThemes[id] : { color: 'indigo' };
            const color = theme.color;
            const activeClass = isActive ? `ring-2 ring-${color}-500 bg-${color}-50 border-${color}-200` : `bg-white border-slate-200 hover:border-${color}-300`;
            const iconColor = isActive ? `text-${color}-600` : 'text-slate-400';
            
            return `
                <button onclick="updatePathwaySector('${id}')" class="flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${activeClass} shadow-sm">
                    <i data-lucide="${icon}" class="w-6 h-6 mb-2 ${iconColor}"></i>
                    <span class="text-xs font-bold text-slate-700">${name}</span>
                </button>
            `;
        }

        window.updatePathwaySector = function(sector) {
            setGlobalSector(sector); 
            renderPathwayStep1();
        }

        window.renderPathwayStep1 = function() {
            const container = document.getElementById('pp-practice-content');
            if(!container) return;
            
            container.innerHTML = `
                <div class="max-w-3xl mx-auto py-6 animate-fade-in">
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                            <span class="font-bold text-lg">1</span>
                        </div>
                        <h2 class="text-2xl font-bold text-slate-900 mb-2">Let's build your pathway</h2>
                        <p class="text-slate-500 max-w-md mx-auto">Create a step-by-step roadmap tailored to your career goals. Start by selecting your location and target sector.</p>
                    </div>

                    <!-- NEW: Country Selection -->
                    <div class="mb-8">
                        <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 text-center">1. Choose Location</h3>
                        <div class="max-w-md mx-auto">
                            <select onchange="setGlobalCountry(this.value); renderPathwayStep1();" class="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm bg-white">
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

                    <div class="mb-10">
                        <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 text-center">2. Choose Sector</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            ${_renderSectorOption('agri', 'Agritech', 'leaf')}
                            ${_renderSectorOption('energy', 'Renewable Energy', 'sun')}
                            ${_renderSectorOption('digital', 'Digital Economy', 'cpu')}
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <button onclick="renderPathwayQuiz()" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95 flex items-center gap-2 mx-auto">
                            Next Step <i data-lucide="arrow-right" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        function _renderGoalCard(title, desc, icon) {
            return `
            <button onclick="selectPathwayGoal('${title}')" class="p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all text-left group relative overflow-hidden w-full">
                <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i data-lucide="${icon}" class="w-24 h-24"></i>
                </div>
                <div class="relative z-10">
                    <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <i data-lucide="${icon}" class="w-5 h-5"></i>
                    </div>
                    <h3 class="font-bold text-lg text-slate-800 mb-1">${title}</h3>
                    <p class="text-xs text-slate-500">${desc}</p>
                </div>
            </button>
            `;
        }

        window.selectPathwayGoal = function(goal) {
            pathwayState.goal = goal;
            renderPathwayStep3(); // Go directly to results
        }

        window.renderPathwayStep2 = function() {
            const container = document.getElementById('pp-practice-content');
            if(!container) return;

            container.innerHTML = `
                <div class="max-w-3xl mx-auto py-6 animate-fade-in">
                    <div class="mb-6">
                        <button onclick="renderPathwayStep1()" class="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>
                    </div>
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                            <span class="font-bold text-lg">${pathwayState.interest ? '3' : '2'}</span>
                        </div>
                        <h2 class="text-2xl font-bold text-slate-900 mb-2">Set your constraints</h2>
                        <p class="text-slate-500">Help us find the right fit for your schedule and budget.</p>
                    </div>
                    
                    <div class="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        ${pathwayConstraints.map(c => `
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><i data-lucide="${c.icon}" class="w-4 h-4 text-slate-400"></i> ${c.label}</label>
                                <div class="flex flex-wrap gap-3">
                                    ${c.options.map(opt => _renderConstraintOption(c.id, opt)).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="mt-8 text-center">
                        <button onclick="renderPathwayStep3()" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95 flex items-center gap-2 mx-auto">
                            Generate My Pathway <i data-lucide="wand-2" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        function _renderConstraintOption(category, value) {
            const isChecked = pathwayState.constraints[category] === value ? 'checked' : '';
            return `
                <label class="cursor-pointer">
                    <input type="radio" name="${category}" value="${value}" class="peer sr-only" onchange="updateConstraint('${category}', '${value}')" ${isChecked}>
                    <div class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:border-indigo-500 peer-checked:ring-1 peer-checked:ring-indigo-500 transition-all hover:bg-slate-50">
                        ${value}
                    </div>
                </label>
            `;
        }

        window.updateConstraint = function(cat, val) {
            pathwayState.constraints[cat] = val;
        }

        // --- NEW: Interest Discovery Quiz (O*NET Style) ---
        window.renderPathwayQuiz = function() {
            const container = document.getElementById('pp-practice-content');
            if(!container) return;

            const sector = activeSectorId;
            const options = (typeof pathwayQuizOptions !== 'undefined') ? (pathwayQuizOptions[sector] || pathwayQuizOptions['digital']) : [];

            // Get role descriptions
            const activeRoles = (typeof sectorRoles !== 'undefined') ? (sectorRoles[activeSectorId] || sectorRoles['agri']) : { tech: "N/A", biz: "N/A", venture: "N/A" };
            
            // Map interest IDs to role description keys
            const interestToRoleKeyMap = {
                agri: { tech: 'tech', field: 'biz', biz: 'venture' },
                energy: { 'hands-on': 'tech', design: 'biz', mgmt: 'venture' },
                digital: { code: 'tech', data: 'biz', creative: 'venture' }
            };
            const roleKeyMap = interestToRoleKeyMap[sector] || interestToRoleKeyMap['digital'];

            container.innerHTML = `
                <div class="max-w-3xl mx-auto py-4 animate-fade-in">
                    <div class="mb-4">
                        <button onclick="renderPathwayStep1()" class="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>
                    </div>
                    <div class="text-center mb-6">
                        <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 mb-3">
                            <span class="font-bold text-base">2</span>
                        </div>
                        <h2 class="text-xl font-bold text-slate-900 mb-1">What sounds most like you?</h2>
                        <p class="text-sm text-slate-500">Select the area that matches your interests.</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        ${options.map(opt => {
                            const roleKey = roleKeyMap[opt.id];
                            const roleText = activeRoles[roleKey] || "Role examples unavailable.";
                            return `
                            <button onclick="selectPathwayInterest('${opt.id}')" class="flex flex-col items-center text-center p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all group h-full">
                                <div>
                                    <div class="w-12 h-12 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                                        <i data-lucide="${opt.icon}" class="w-6 h-6"></i>
                                    </div>
                                    <h3 class="font-bold text-base text-slate-800 mb-1">${opt.title}</h3>
                                    <p class="text-xs text-slate-500 leading-relaxed mb-3">${opt.desc}</p>
                                </div>
                                <div class="mt-auto pt-2 border-t border-slate-200 group-hover:border-purple-100 w-full">
                                    <div class="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Example Roles</div>
                                    <p class="text-[10px] text-slate-500 leading-snug">${roleText}</p>
                                </div>
                            </button>
                        `}).join('')}
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        window.selectPathwayInterest = function(interest) {
            pathwayState.interest = interest;
            renderPathwayGoal();
        }

        // --- NEW: Step 3 (Goal) ---
        window.renderPathwayGoal = function() {
            const container = document.getElementById('pp-practice-content');
            if(!container) return;

            // Fallback if pathwayGoals is missing
            const goals = (typeof pathwayGoals !== 'undefined' && Array.isArray(pathwayGoals)) ? pathwayGoals : [
                { "title": "Entry Level Job", "desc": "I want to find my first job or internship.", "icon": "briefcase" },
                { "title": "Apprenticeship", "desc": "I want to learn on the job with a mentor.", "icon": "users" },
                { "title": "Upskill", "desc": "I want to strengthen my current skills.", "icon": "trending-up" },
                { "title": "Venture", "desc": "I want to start my own business.", "icon": "rocket" },
                { "title": "Change Careers", "desc": "I want to pivot to a new sector.", "icon": "refresh-cw" }
            ];

            container.innerHTML = `
                <div class="max-w-3xl mx-auto py-6 animate-fade-in">
                    <div class="mb-6">
                        <button onclick="renderPathwayQuiz()" class="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>
                    </div>
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                            <span class="font-bold text-lg">3</span>
                        </div>
                        <h2 class="text-2xl font-bold text-slate-900 mb-2">What is your primary goal?</h2>
                        <p class="text-slate-500">This helps us tailor the next steps for you.</p>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        ${goals.filter(g => !g.title.toLowerCase().includes('venture')).map(g => _renderGoalCard(g.title, g.desc, g.icon)).join('')}
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        window.renderPathwayStep3 = function() {
            const container = document.getElementById('pp-practice-content');
            if(!container) return;

            const goal = pathwayState.goal || "Strengthen my current skills";
            const sector = activeSectorId;
            const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[sector] : { color: 'indigo' };
            const theme = themeConfig.color;
            
            // --- SECTION A: SKILLS FOCUS ---
            const sectorDetails = baseSectorDetailData[sector];
            const allSkills = sectorDetails ? sectorDetails.skills : [];
            let targetSkills = [];

            // Goal-based Skill Selection
            if (goal === 'Venture') {
                targetSkills = allSkills.slice(0, 5); // Broad mix
            } else if (['Strengthen my current skills', 'Upskill'].includes(goal)) {
                targetSkills = allSkills.filter(s => s.isHot).slice(0, 5); // Hot/Advanced skills
            } else {
                targetSkills = allSkills.slice(0, 4); // Foundational
            }

            // Interest-based refinement
            if (pathwayState.interest) {
                 const interestMap = {
                    'tech': ['Python', 'IoT', 'Solar', 'Design', 'Coding', 'Technical'],
                    'code': ['Python', 'Java', 'React', 'API', 'Code'],
                    'design': ['Design', 'UX', 'CAD', 'Drawing', 'Planning'],
                    'hands-on': ['Installation', 'Wiring', 'Maintenance', 'Repair', 'Field'],
                    'field': ['Soil', 'Crop', 'Drone', 'Scouting', 'Farm'],
                    'biz': ['Sales', 'Management', 'Logistics', 'Finance', 'Business'],
                    'mgmt': ['Management', 'Audit', 'Policy', 'Planning', 'Project'],
                    'data': ['Data', 'Analysis', 'Excel', 'Statistics', 'Logic'],
                    'creative': ['Design', 'Marketing', 'Content', 'Strategy', 'UI']
                };
                const keywords = interestMap[pathwayState.interest] || [];
                if (keywords.length > 0) {
                    const interestedSkills = allSkills.filter(s => keywords.some(k => s.name.includes(k) || (s.desc && s.desc.includes(k))));
                    if (interestedSkills.length > 0) targetSkills = interestedSkills.slice(0, 5);
                }
            }

            const skillsHtml = targetSkills.map(s => `
                <div class="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                    <i data-lucide="check-circle" class="w-4 h-4 text-${theme}-500 mt-0.5 shrink-0"></i>
                    <div>
                        <span class="font-bold">${s.name}</span>
                        ${s.isHot ? '<span title="High Demand" class="text-[10px] ml-1 bg-rose-100 text-rose-700 px-1 rounded">HOT</span>' : ''}
                        <div class="text-[10px] text-slate-500 leading-tight mt-0.5">${s.desc}</div>
                    </div>
                </div>
            `).join('');

            // --- SECTION B: ACTIONABLE NEXT STEP (The "Mission") ---
            let blockBTitle = "";
            let blockBContent = "";
            let blockBAction = "";
            let blockBOnclick = "";

            if (goal === 'Apprenticeship') {
                blockBTitle = "Apprenticeship Starter Kit";
                blockBAction = "";
                blockBOnclick = "";

                // --- NEW: Apprenticeship Framework Data ---
                let framework = {
                    duration: "6 - 12 Months",
                    objective: "Gain practical, on-the-job experience.",
                    role: "Assist senior staff, maintain logbooks, follow safety protocols.",
                    employer: "Provide supervision, tools, and certify completed hours."
                };

                if (sector === 'digital') {
                    framework = {
                        duration: "3 - 6 Months (Project-based)",
                        objective: "Build a portfolio of real-world code/design.",
                        role: "Bug fixing, testing, documentation, junior dev tasks.",
                        employer: "Code reviews, mentorship, access to dev environment."
                    };
                } else if (sector === 'energy') {
                    framework = {
                        duration: "1 - 2 Years (Licensing Track)",
                        objective: "Log required hours for national accreditation (e.g., EPRA).",
                        role: "Installation support, wiring (supervised), strict HSE adherence.",
                        employer: "Licensed supervision, safety gear (PPE), insurance."
                    };
                } else if (sector === 'agri') {
                    framework = {
                        duration: "3 - 6 Months (Seasonal)",
                        objective: "Master crop cycles and farm management systems.",
                        role: "Field scouting, data collection, equipment maintenance.",
                        employer: "Technical guidance, safety training, transport/stipend."
                    };
                }

                // Standards Links
                const standards = [
                    { c: 'Kenya', name: 'NITA Guidelines', url: 'https://www.nita.go.ke/' },
                    { c: 'Tanzania', name: 'VETA Apprenticeship', url: 'https://www.veta.go.tz/' },
                    { c: 'Uganda', name: 'DIT Standards', url: 'https://dituganda.org/' },
                    { c: 'Rwanda', name: 'RTB Workplace Learning', url: 'https://www.rtb.gov.rw/' }
                ];
                
                let localStandards = standards.filter(s => s.c === activeCountry);
                if (localStandards.length === 0) localStandards = standards; // Show all if regional or no match
                
                let appResources = [];
                let mentorResources = [];

                if (sector === 'agri') {
                    appResources = [
                        { title: "NITA Industrial Attachment", desc: "Placement portal for technical trades.", icon: "briefcase", link: "https://www.nita.go.ke/" },
                        { title: "TVET Authority", desc: "Competency Based Education & Training.", icon: "book-open", link: "https://tveta.go.ke/" }
                    ];
                    mentorResources = [
                        { title: "AWAK (Women in Ag)", desc: "Mentorship for women in agribusiness.", link: "https://awak.co.ke/" },
                        { title: "GoGettaz", desc: "Agripreneurship community & support.", link: "https://gogettaz.africa/" }
                    ];
                } else if (sector === 'energy') {
                    appResources = [
                        { title: "EPRA Licensing Guide", desc: "Steps for solar/electrician licensing.", icon: "shield", link: "https://www.epra.go.ke/" },
                        { title: "Women in Renewable Energy", desc: "Mentorship & apprenticeship links.", icon: "users", link: "https://wire-africa.org/" }
                    ];
                    mentorResources = [
                        { title: "GWNET", desc: "Global Women's Network for Energy Transition.", link: "https://www.globalwomennet.org/" },
                        { title: "Shortlist", desc: "Clean energy talent & career guidance.", link: "https://www.shortlist.net/" }
                    ];
                } else {
                    appResources = [
                        { title: "Ajira Digital", desc: "Govt program linking youth to digital work.", icon: "monitor", link: "https://ajiradigital.go.ke/" },
                        { title: "Andela Learning", desc: "Peer learning & potential tracks.", icon: "code", link: "https://andela.com/" }
                    ];
                    mentorResources = [
                        { title: "ADPList", desc: "Global mentorship for designers & devs.", link: "https://adplist.org/" },
                        { title: "She Code Africa", desc: "Mentorship & community for women in tech.", link: "https://shecodeafrica.org/" }
                    ];
                }

                // Add Standards to Resources
                localStandards.forEach(s => {
                    appResources.push({ title: s.name, desc: "National Guidelines", icon: "book", link: s.url });
                });

                const appHtml = appResources.map(r => `
                    <a href="${r.link}" target="_blank" class="flex items-center gap-3 p-2 border border-slate-100 rounded-lg hover:bg-slate-50 group transition-colors bg-white">
                        <div class="p-1.5 bg-blue-100 text-blue-600 rounded shrink-0"><i data-lucide="${r.icon}" class="w-3 h-3"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-slate-700 group-hover:text-blue-700 truncate">${r.title}</div>
                            <div class="text-[10px] text-slate-500 truncate">${r.desc}</div>
                        </div>
                        <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-blue-500"></i>
                    </a>
                `).join('');

                const mentorHtml = mentorResources.map(r => `
                    <a href="${r.link}" target="_blank" class="flex items-center gap-3 p-2 border border-slate-100 rounded-lg hover:bg-slate-50 group transition-colors bg-white">
                        <div class="p-1.5 bg-purple-100 text-purple-600 rounded shrink-0"><i data-lucide="users" class="w-3 h-3"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-slate-700 group-hover:text-purple-700 truncate">${r.title}</div>
                            <div class="text-[10px] text-slate-500 truncate">${r.desc}</div>
                        </div>
                        <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-purple-500"></i>
                    </a>
                `).join('');

                blockBContent = `
                    <div class="space-y-4">
                        <!-- Framework Info -->
                        <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold text-slate-700 uppercase flex items-center gap-2"><i data-lucide="info" class="w-3 h-3"></i> Typical Framework</h4>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-slate-600">
                                <div><span class="font-bold text-slate-800">Duration:</span> ${framework.duration}</div>
                                <div><span class="font-bold text-slate-800">Objective:</span> ${framework.objective}</div>
                                <div><span class="font-bold text-slate-800">Apprentice Role:</span> ${framework.role}</div>
                                <div><span class="font-bold text-slate-800">Employer Role:</span> ${framework.employer}</div>
                            </div>
                        </div>

                        <!-- Soft Skills -->
                        <div class="bg-amber-50 border border-amber-100 rounded-lg p-3">
                            <h4 class="text-xs font-bold text-amber-800 uppercase mb-2 flex items-center gap-2"><i data-lucide="star" class="w-3 h-3"></i> Critical Soft Skills for Retention</h4>
                            <div class="grid grid-cols-2 gap-2 text-[10px] text-amber-900">
                                <div class="flex items-center gap-1.5"><i data-lucide="clock" class="w-3 h-3 text-amber-600"></i> Punctuality & Reliability</div>
                                <div class="flex items-center gap-1.5"><i data-lucide="message-circle" class="w-3 h-3 text-amber-600"></i> Proactive Communication</div>
                                <div class="flex items-center gap-1.5"><i data-lucide="book-open" class="w-3 h-3 text-amber-600"></i> Willingness to Learn</div>
                                <div class="flex items-center gap-1.5"><i data-lucide="shield" class="w-3 h-3 text-amber-600"></i> Professional Attitude</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="space-y-2">
                                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Where to Start</div>
                                ${appHtml}
                            </div>
                            <div class="space-y-2">
                                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Preparation</div>
                                <div class="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                    <div class="flex items-center gap-2 mb-1">
                                        <i data-lucide="file-check" class="w-4 h-4 text-blue-600"></i>
                                        <span class="text-xs font-bold text-blue-800">Logbook & Portfolio</span>
                                    </div>
                                    <p class="text-[10px] text-blue-700 leading-snug">Employers want proof of ability. Document every project.</p>
                                </div>
                                <button onclick="closeModal('unified-hub-modal'); document.getElementById('career-hub-drawer').classList.remove('translate-x-full'); showCVResources();" class="w-full flex items-center gap-3 p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 group transition-colors text-left">
                                    <div class="p-1.5 bg-slate-100 text-slate-600 rounded shrink-0"><i data-lucide="file-text" class="w-3 h-3"></i></div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-xs font-bold text-slate-700 group-hover:text-blue-700">Download Templates</div>
                                        <div class="text-[10px] text-slate-500">Logbooks & CVs</div>
                                    </div>
                                </button>
                            </div>
                            <div class="col-span-1 sm:col-span-2 pt-2 border-t border-slate-100">
                                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Mentorship Programs</div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    ${mentorHtml}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (['Entry Level Job', 'Internship'].includes(goal)) {
                blockBTitle = "Job Seeker Toolkit";
                blockBAction = "Open Career Hub";
                blockBOnclick = "toggleCareerHub()";

                blockBContent = `
                    <div class="space-y-4">
                        <div class="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                            <h4 class="text-xs font-bold text-emerald-800 uppercase mb-2 flex items-center gap-2"><i data-lucide="check-square" class="w-3 h-3"></i> Application Readiness</h4>
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"><input type="checkbox" class="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"> <span>Tailor CV to job description</span></label>
                                <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"><input type="checkbox" class="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"> <span>Optimize LinkedIn headline</span></label>
                                <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"><input type="checkbox" class="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"> <span>Clean up social media footprint</span></label>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button onclick="closeModal('unified-hub-modal'); document.getElementById('career-hub-drawer').classList.remove('translate-x-full'); showCVResources();" class="flex items-center gap-3 p-2 border border-slate-200 rounded-lg hover:border-purple-300 bg-white group transition-all text-left">
                                <div class="p-1.5 bg-purple-100 text-purple-600 rounded shrink-0"><i data-lucide="file-text" class="w-4 h-4"></i></div>
                                <div>
                                    <div class="font-bold text-xs text-slate-800 group-hover:text-purple-700">CV Templates</div>
                                    <div class="text-[10px] text-slate-500">ATS-friendly formats</div>
                                </div>
                            </button>
                            <button onclick="closeModal('unified-hub-modal'); document.getElementById('career-hub-drawer').classList.remove('translate-x-full'); showInterviewPrep();" class="flex items-center gap-3 p-2 border border-slate-200 rounded-lg hover:border-emerald-300 bg-white group transition-all text-left">
                                <div class="p-1.5 bg-emerald-100 text-emerald-600 rounded shrink-0"><i data-lucide="mic" class="w-4 h-4"></i></div>
                                <div>
                                    <div class="font-bold text-xs text-slate-800 group-hover:text-emerald-700">Interview Coach</div>
                                    <div class="text-[10px] text-slate-500">AI-powered practice</div>
                                </div>
                            </button>
                        </div>
                    </div>
                `;
            } else if (goal === 'Venture') {
                blockBTitle = "Founder's Launchpad";
                blockBAction = "Open Launchpad";
                blockBOnclick = "closeModal('unified-hub-modal'); document.getElementById('career-hub-drawer').classList.remove('translate-x-full'); showEntrepreneurshipView();";

                const sectorData = getSectorCareerResources(sector);
                const incubators = (sectorData.entrepreneurship.incubators || []).slice(0, 2);
                const funding = (sectorData.entrepreneurship.funding || []).slice(0, 2);

                const renderRes = (list, icon, color) => list.map(i => `
                    <a href="${i.link}" target="_blank" class="flex items-center gap-3 p-2 border border-slate-100 rounded-lg hover:bg-slate-50 group transition-colors bg-white">
                        <div class="p-1.5 bg-${color}-100 text-${color}-600 rounded shrink-0"><i data-lucide="${icon}" class="w-3 h-3"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-slate-700 group-hover:text-${color}-700 truncate">${i.name}</div>
                            <div class="text-[10px] text-slate-500 truncate">${i.desc}</div>
                        </div>
                    </a>
                `).join('');

                blockBContent = `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="space-y-2">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Incubators</div>
                            ${renderRes(incubators, 'warehouse', 'orange')}
                        </div>
                        <div class="space-y-2">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Funding</div>
                            ${renderRes(funding, 'banknote', 'green')}
                        </div>
                    </div>
                `;
            } else if (goal === 'Change Careers') {
                blockBTitle = "Career Pivot Strategy";
                blockBAction = "Explore Communities";
                blockBOnclick = "closeModal('unified-hub-modal'); document.getElementById('community-hub-drawer').classList.remove('translate-x-full'); showCommunityView();";

                blockBContent = `
                    <div class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="p-3 bg-pink-50 border border-pink-100 rounded-lg">
                                <div class="flex items-center gap-2 mb-2">
                                    <i data-lucide="shuffle" class="w-4 h-4 text-pink-600"></i>
                                    <span class="text-xs font-bold text-pink-800">Transferable Skills</span>
                                </div>
                                <p class="text-[10px] text-pink-700 leading-relaxed mb-2">Identify skills from your past role that apply here (e.g., Project Mgmt, Communication).</p>
                                <div class="flex flex-wrap gap-1">
                                    <span class="px-1.5 py-0.5 bg-white rounded text-[9px] text-pink-600 border border-pink-200">Leadership</span>
                                    <span class="px-1.5 py-0.5 bg-white rounded text-[9px] text-pink-600 border border-pink-200">Analytics</span>
                                </div>
                            </div>
                            <div class="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <div class="flex items-center gap-2 mb-2">
                                    <i data-lucide="users" class="w-4 h-4 text-blue-600"></i>
                                    <span class="text-xs font-bold text-blue-800">Immersion</span>
                                </div>
                                <p class="text-[10px] text-blue-700 leading-relaxed mb-2">The fastest way to pivot is to speak the language. Join sector-specific events.</p>
                                <button onclick="${blockBOnclick}" class="text-[9px] font-bold bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-50 w-full">Find Events</button>
                            </div>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <h4 class="text-[10px] font-bold text-slate-500 uppercase mb-2">Recommended Pivot Projects</h4>
                            <div class="grid grid-cols-2 gap-2">
                                <div class="text-[10px] text-slate-600 flex items-center gap-1.5"><i data-lucide="github" class="w-3 h-3 text-slate-400"></i> Open Source Contrib.</div>
                                <div class="text-[10px] text-slate-600 flex items-center gap-1.5"><i data-lucide="pen-tool" class="w-3 h-3 text-slate-400"></i> Case Study Blog</div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // Upskill / Strengthen
                blockBTitle = "Career Advancement";
                blockBAction = "View Certifications";
                blockBOnclick = "openUnifiedHub('pp-courses')";
                
                // NEW: Contextualize tools based on Interest
                let advancedTools = [];
                const interest = pathwayState.interest;
                
                const toolsInterestMap = {
                    'digital': {
                        'code': ['Docker', 'GraphQL', 'Next.js'],
                        'data': ['TensorFlow', 'Tableau', 'dbt'],
                        'creative': ['Figma (Adv)', 'Webflow', 'Adobe XD']
                    },
                    'energy': {
                        'hands-on': ['Thermal Imaging', 'High Voltage Testers', 'SCADA'],
                        'design': ['PVsyst', 'AutoCAD Electrical', 'Homer Pro'],
                        'mgmt': ['MS Project', 'ERP Systems', 'Auditing Tools']
                    },
                    'agri': {
                        'tech': ['ArcGIS Pro', 'Python for Ag', 'Drone Deploy'],
                        'field': ['Soil Spectrometers', 'GPS Units', 'Farm ERP'],
                        'biz': ['QuickBooks', 'Supply Chain Soft.', 'Market Analytics']
                    }
                };

                if (interest && toolsInterestMap[sector] && toolsInterestMap[sector][interest]) {
                    advancedTools = toolsInterestMap[sector][interest];
                } else {
                    // Fallback to sector defaults
                    if (sector === 'digital') advancedTools = ['Kubernetes', 'TensorFlow', 'Figma (Adv)'];
                    else if (sector === 'energy') advancedTools = ['PVsyst', 'AutoCAD Elec', 'Homer Pro'];
                    else if (sector === 'agri') advancedTools = ['ArcGIS Pro', 'Python', 'Farm ERP'];
                }

                blockBContent = `
                    <div class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                                <div class="flex items-center gap-2 mb-1">
                                    <i data-lucide="trending-up" class="w-4 h-4 text-indigo-600"></i>
                                    <span class="text-xs font-bold text-indigo-800">Salary Potential</span>
                                </div>
                                <div class="text-lg font-bold text-indigo-900">+40% <span class="text-[10px] font-normal text-indigo-700">with specialization</span></div>
                                <div class="w-full bg-indigo-200 h-1.5 rounded-full mt-2"><div class="bg-indigo-600 h-1.5 rounded-full" style="width: 70%"></div></div>
                            </div>
                            <div class="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                <div class="flex items-center gap-2 mb-1">
                                    <i data-lucide="award" class="w-4 h-4 text-amber-600"></i>
                                    <span class="text-xs font-bold text-amber-800">Top Certifications</span>
                                </div>
                                <ul class="text-[10px] text-amber-900 space-y-1 list-disc list-inside">
                                    <li>Professional Cloud Architect</li>
                                    <li>PMP / Agile Practitioner</li>
                                    <li>Advanced Data Analytics</li>
                                </ul>
                            </div>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div class="text-xs text-slate-600 mb-2 font-bold">Master Industry-Standard Tools</div>
                            <div class="flex flex-wrap gap-2">
                                ${advancedTools.map(t => `<span class="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700 shadow-sm">${t}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }

            // --- SECTION C: TRAINING (Bridge Knowledge Gaps) ---
            const catalogue = getMasterTrainingCatalogue('all', sector, activeCountry);
            let courses = [];
            
            if (['Internship', 'Entry Level Job', 'Change Careers', 'Apprenticeship'].includes(goal)) {
                courses = [...catalogue.short, ...catalogue.med];
            } else if (['Strengthen my current skills', 'Upskill'].includes(goal)) {
                courses = [...catalogue.med, ...catalogue.long];
            } else {
                courses = [...catalogue.short, ...catalogue.med, ...catalogue.long];
            }
            
            courses = courses.filter(c => c.url && c.url.startsWith('http'));
            if (pathwayState.constraints.budget === 'Free') courses = courses.filter(c => c.cost && c.cost.toLowerCase().includes('free'));
            if (pathwayState.constraints.mode === 'Online') courses = courses.filter(c => c.mode === 'Online');
            
            const finalCourses = courses.slice(0, 4); // Limit to 4 for cleaner UI
            const trainingHtml = finalCourses.map(c => `
                <a href="${c.url}" target="_blank" class="flex flex-col p-3 bg-white border border-slate-200 rounded-lg hover:border-${theme}-300 transition-colors group h-full">
                    <div class="flex justify-between items-start mb-1">
                        <span class="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">${c.level === 'short' ? 'Short' : 'Cert'}</span>
                        <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-${theme}-500"></i>
                    </div>
                    <div class="font-bold text-xs text-slate-800 group-hover:text-${theme}-700 line-clamp-2 mb-1">${c.name}</div>
                    <div class="text-[10px] text-slate-500 mt-auto">${c.provider}</div>
                </a>
            `).join('');

            // --- SECTION D: ACTIVE JOB BOARDS ---
            const careerResources = getSectorCareerResources(sector);
            let blockDTitle = "Active Job Boards";
            let blockDAction = "View All";
            let blockDOnclick = "toggleCareerHub()";
            let blockDContentHtml = "";
            let blockDColor = "amber";

            if (goal === 'Venture') {
                blockDTitle = "Market Intelligence";
                blockDAction = "View Data";
                blockDOnclick = "closeModal('unified-hub-modal'); document.getElementById('career-hub-drawer').classList.remove('translate-x-full'); showLMIResources();";
                blockDColor = "cyan";
                
                const lmi = (careerResources.lmi || []).filter(r => r.link && r.link.startsWith('http')).slice(0, 3);
                blockDContentHtml = lmi.map(r => `
                    <a href="${r.link}" target="_blank" class="flex items-center gap-3 p-2 border border-slate-100 rounded-lg bg-white hover:border-cyan-300 group transition-colors">
                        <div class="w-8 h-8 rounded bg-cyan-50 flex items-center justify-center text-cyan-600 text-xs font-bold"><i data-lucide="line-chart" class="w-4 h-4"></i></div>
                        <div class="min-w-0 flex-1">
                            <div class="font-bold text-xs text-slate-800 truncate group-hover:text-cyan-700">${r.name}</div>
                            <div class="text-[10px] text-slate-500 truncate">${r.type || 'Report'}</div>
                        </div>
                    </a>
                `).join('');
            } else {
                const jobBoards = (careerResources.jobs || []).filter(j => j.link && j.link.startsWith('http')).slice(0, 3);
                blockDContentHtml = jobBoards.map(j => `
                    <a href="${j.link}" target="_blank" class="flex items-center gap-3 p-2 border border-slate-100 rounded-lg bg-white hover:border-amber-300 group transition-colors">
                        <div class="w-8 h-8 rounded bg-amber-50 flex items-center justify-center text-amber-600 text-xs font-bold">${j.company ? j.company.substring(0,2) : 'JB'}</div>
                        <div class="min-w-0 flex-1">
                            <div class="font-bold text-xs text-slate-800 truncate group-hover:text-amber-700">${j.title}</div>
                            <div class="text-[10px] text-slate-500 truncate">${j.company || 'Job Listing'}</div>
                        </div>
                    </a>
                `).join('');
            }

            // --- SECTION E: ECOSYSTEM RESOURCES ---
            let ecoResources = (typeof sectorPathwayResources !== 'undefined' && sectorPathwayResources[sector]) ? [...sectorPathwayResources[sector]] : [];
            // Merge dynamic
            if (typeof getSectorCareerResources === 'function') {
                const dynamicResources = getSectorCareerResources(sector);
                if (dynamicResources && dynamicResources.communities) {
                    dynamicResources.communities.slice(0, 2).forEach(r => {
                        if (!ecoResources.some(ex => ex.title === r.name)) {
                            ecoResources.push({ title: r.name, desc: r.desc, link: r.link, icon: 'users' });
                        }
                    });
                }
            }
            ecoResources = ecoResources.filter(r => r.link && r.link.startsWith('http')).slice(0, 4);
            
            const ecoHtml = ecoResources.map(r => `
                <a href="${r.link}" target="_blank" class="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-lg hover:border-${theme}-300 transition-all group">
                    <div class="p-1.5 bg-slate-50 text-slate-600 rounded shrink-0 group-hover:bg-${theme}-50 group-hover:text-${theme}-600"><i data-lucide="${r.icon}" class="w-4 h-4"></i></div>
                    <div class="flex-1 min-w-0">
                        <div class="text-xs font-bold text-slate-800 group-hover:text-${theme}-700 truncate">${r.title}</div>
                        <div class="text-[10px] text-slate-500 truncate">${r.desc}</div>
                    </div>
                </a>
            `).join('');

            // --- RENDER FINAL HTML ---
            container.innerHTML = `
                <div class="animate-fade-in space-y-6 pb-8">
                    <!-- Header -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div>
                            <h2 class="text-lg font-bold text-slate-900">Your Personalized Roadmap</h2>
                            <p class="text-xs text-slate-500">
                                Goal: <strong class="text-${theme}-600">${goal}</strong> • 
                                Sector: <strong>${sector === 'agri' ? 'Agritech' : sector === 'energy' ? 'Renewable Energy' : 'Digital'}</strong>
                                ${pathwayState.interest ? ` • Focus: <strong>${pathwayState.interest.charAt(0).toUpperCase() + pathwayState.interest.slice(1)}</strong>` : ''}
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.print()" class="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                                <i data-lucide="download" class="w-3 h-3"></i> Save
                            </button>
                            <button onclick="initPathwayWizard()" class="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shadow-sm">
                                Restart
                            </button>
                        </div>
                    </div>

                    <!-- A. Skills Focus -->
                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <h3 class="font-bold text-slate-800 flex items-center gap-2 mb-4"><span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">A</span> Skills Focus</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            ${skillsHtml}
                        </div>
                    </div>

                    <!-- B. Practice / Toolkit -->
                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2"><span class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">B</span> ${blockBTitle}</h3>
                            ${blockBAction ? `<button onclick="${blockBOnclick}" class="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded hover:bg-purple-100 border border-purple-100">${blockBAction}</button>` : ''}
                        </div>
                        ${blockBContent}
                    </div>

                    <!-- C. Training -->
                    ${goal !== 'Apprenticeship' ? `
                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                        <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2"><span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">C</span> Bridge Knowledge Gaps</h3>
                            <div class="flex gap-2">
                                <select onchange="updatePathwayConstraint('mode', this.value)" class="text-[10px] border-slate-200 rounded bg-slate-50 text-slate-600 focus:ring-0 py-1 pl-2 pr-6 cursor-pointer hover:bg-slate-100">
                                    <option value="Any" ${!pathwayState.constraints.mode || pathwayState.constraints.mode === 'Any' ? 'selected' : ''}>Any Mode</option>
                                    <option value="Online" ${pathwayState.constraints.mode === 'Online' ? 'selected' : ''}>Online</option>
                                </select>
                                <select onchange="updatePathwayConstraint('budget', this.value)" class="text-[10px] border-slate-200 rounded bg-slate-50 text-slate-600 focus:ring-0 py-1 pl-2 pr-6 cursor-pointer hover:bg-slate-100">
                                    <option value="Any" ${!pathwayState.constraints.budget || pathwayState.constraints.budget === 'Any' ? 'selected' : ''}>Any Cost</option>
                                    <option value="Free" ${pathwayState.constraints.budget === 'Free' ? 'selected' : ''}>Free</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            ${trainingHtml}
                        </div>
                        ${finalCourses.length === 0 ? '<div class="text-xs text-slate-500 italic mt-2">No specific courses found matching constraints.</div>' : ''}
                    </div>
                    ` : ''}

                    <!-- D. Opportunities -->
                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-1 h-full bg-${blockDColor}-500"></div>
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2"><span class="w-6 h-6 rounded-full bg-${blockDColor}-100 text-${blockDColor}-600 flex items-center justify-center text-xs font-bold">D</span> ${blockDTitle}</h3>
                            <button onclick="${blockDOnclick}" class="text-[10px] font-bold text-${blockDColor}-600 bg-${blockDColor}-50 px-2 py-1 rounded hover:bg-${blockDColor}-100 border border-${blockDColor}-100">${blockDAction}</button>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            ${blockDContentHtml || '<div class="text-xs text-slate-500 italic">No items found.</div>'}
                        </div>
                    </div>

                    <!-- E. Ecosystem -->
                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-1 h-full bg-slate-400"></div>
                        <h3 class="font-bold text-slate-800 flex items-center gap-2 mb-4"><span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">E</span> Essential Ecosystem Resources</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            ${ecoHtml}
                        </div>
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        window.updatePathwayConstraint = function(key, value) {
            pathwayState.constraints[key] = value;
            renderPathwayStep3(); // Re-render to apply filters
        }

        function openOccupationModal(title) {
            const modal = document.getElementById('occupation-modal');
            const panel = document.getElementById('occupation-modal-panel');
            
            // Reset scroll position and ensure mobile layout
            const scrollContainer = panel.querySelector('.overflow-y-auto');
            if (scrollContainer) scrollContainer.scrollTop = 0;

            const sectorName = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energies' : 'Digital Economies / AI';
            
            const details = getOccupationDetails(title, sectorName);
            
            // Lookup dynamic "Why in Demand" info
            const dynamicOccs = dataManager.getOccupations(activeSectorId);
            const occData = dynamicOccs ? dynamicOccs.find(o => o.name === title) : null;
            const demandInfo = occData && occData.why ? occData.why : "High demand due to sector growth and skills gap.";
            
            // NEW: Fetch Wage/OJA for Modal
            const targetName = (typeof roleToOccupationMap !== 'undefined' && roleToOccupationMap[title]) ? roleToOccupationMap[title] : title;
            const wageEntry = dataManager.getWage(targetName, activeCountry, occData ? occData.id : null);
            
            document.body.classList.add('overflow-hidden');
            
            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-alt-titles').innerText = `AKA: ${details.altTitles}`;
            document.getElementById('modal-sector-badge').innerText = sectorName;

            // Update Footer with Save Button
            const isSaved = myPlan.roles.has(title);
            const saveBtnText = isSaved ? "Saved to Plan" : "Save Role";
            const saveBtnIcon = isSaved ? "fill-current" : "";
            
            // Inject Demand Info
            const demandContainer = document.getElementById('modal-demand-section');
            if (demandContainer) {
                demandContainer.innerHTML = `
                    <div class="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <h4 class="text-xs font-bold text-indigo-800 uppercase mb-2 flex items-center gap-2"><i data-lucide="trending-up" class="w-4 h-4"></i> Why in Demand</h4>
                        <p class="text-sm text-indigo-900/90 leading-relaxed">${demandInfo}</p>
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
                <div class="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded text-xs text-slate-700 hover:border-emerald-200 transition-colors w-full">
                    <div class="w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm text-[10px] font-bold text-emerald-600 border border-slate-100">${i+1}</div>
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
                        <div class="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-2 border-b border-emerald-100 pb-1">Employability & Soft Skills</div>
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
                                Unsure if you have the right skills set? Take our quick <strong>Matching-Skills2Roles</strong> assessment to identify your strengths and gaps and follow up with a curated training plan.
                            </p>
                            <button class="bg-white text-indigo-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm" onclick="event.stopPropagation(); closeModal('occupation-modal'); openUnifiedHub('pp-diagnostic', '${title.replace(/'/g, "\\'")}');">
                                Start Match <i data-lucide="arrow-right" class="w-3 h-3"></i>
                            </button>
                        </div>
                        <div class="hidden sm:block opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all">
                            <i data-lucide="target" class="w-16 h-16 text-white/20"></i>
                        </div>
                    </div>
                </div>
            `;

            // --- 3. Qualifications & Requirements (New Section 3) ---
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

            const qualHtml = `
                <div class="mt-6 pt-6 border-t border-slate-100" id="modal-qualifications-section">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">3</span> Qualifications & Requirements
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div class="flex items-center gap-2 mb-1"><i data-lucide="graduation-cap" class="w-4 h-4 text-indigo-500"></i><span class="text-[10px] font-bold text-slate-500 uppercase">Education</span></div>
                            <div class="text-xs text-slate-700 font-medium">${qualData.education}</div>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div class="flex items-center gap-2 mb-1"><i data-lucide="award" class="w-4 h-4 text-emerald-500"></i><span class="text-[10px] font-bold text-slate-500 uppercase">Certifications</span></div>
                            <div class="text-xs text-slate-700 font-medium">${qualData.certification}</div>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div class="flex items-center gap-2 mb-1"><i data-lucide="briefcase" class="w-4 h-4 text-amber-500"></i><span class="text-[10px] font-bold text-slate-500 uppercase">Experience</span></div>
                            <div class="text-xs text-slate-700 font-medium">${qualData.experience}</div>
                        </div>
                    </div>
                </div>
            `;

            // 4. Demand Signals (Updated Label)
            const baseData = baseSectorDetailData[activeSectorId];
            const overrides = (countryOverrides[activeCountry] && countryOverrides[activeCountry][activeSectorId]) || {};
            const data = { ...baseData, ...overrides };
            const sectorGrowth = data.jobTrend || baseData.growth.jobTrend;

            // --- NEW: Calculate Similar Roles (Moved Up) ---
            const currentTechSkills = new Set(details.specificSkills.technical);
            const relatedRoles = [];

            // Use DataManager to get candidate roles (Dynamic)
            const sectorOccs = dataManager.getOccupations(activeSectorId);
            
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

            // 4. Similar Roles (Lateral Pathways) - Now includes Section 3 injection
            document.getElementById('modal-related-section').innerHTML = hasRelated ? `
                ${qualHtml}
                
                <div class="mt-6 pt-6 border-t border-slate-100">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">4</span> Similar Roles (Lateral Pathways)
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        ${topRelated.map(r => `
                            <button onclick="openOccupationModal('${r.name}')" class="text-left p-3 bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 rounded-lg transition-all group shadow-sm">
                                <div class="text-[10px] text-slate-400 font-bold uppercase mb-1">${r.score} Shared Skills</div>
                                <div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700 truncate">${r.name}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>` : qualHtml; // If no related roles, still show qualifications
            
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
                        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <i data-lucide="info" class="w-4 h-4"></i> At a Glance
                        </h3>
                        <div class="bg-slate-50 rounded-xl border border-slate-200 p-4">
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4">
                                <div>
                                    <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Avg Wage</div>
                                    <div class="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
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
                        </div>
                    </div>
                `;
            }

            // 4. Extra Info (Tools, Creds, Resources)
            const toolsHtml = details.tools.map(t => `<span class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">${t}</span>`).join('');
            const credsHtml = details.credentials.map(c => `<li class="text-xs text-slate-700 mb-1 flex items-start gap-2"><i data-lucide="check-circle" class="w-3 h-3 mt-0.5 text-emerald-500 shrink-0"></i> ${c}</li>`).join('');
            const resHtml = details.resources.length > 0 
                ? details.resources.map(r => `<a href="${r.url}" target="_blank" class="block text-xs text-indigo-600 hover:underline mb-1 flex items-center gap-1"><i data-lucide="external-link" class="w-3 h-3"></i> ${r.title}</a>`).join('')
                : '<div class="text-xs text-slate-400 italic">N/A</div>';

            document.getElementById('modal-extra-section').innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
                    <div>
                        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">${hasRelated ? 5 : 4}</span> Tools & Tech
                        </h3>
                        <div class="flex flex-wrap gap-2 mb-8">
                            ${toolsHtml}
                        </div>
                        
                        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">${hasRelated ? 6 : 5}</span> Read More
                        </h3>
                        <div class="space-y-1">
                            ${resHtml}
                     </div>
                </div>
            `;

            // NEW: Share Button in Footer
            const shareText = encodeURIComponent(`Check out this ${title} role on AI4EAC Skills Compass!`);
            const shareUrl = `https://wa.me/?text=${shareText}`;
            
            const footer = document.getElementById('occ-modal-footer');
            if(footer) {
                footer.innerHTML = `
                    <a href="${shareUrl}" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm">
                        <i data-lucide="share-2" class="w-4 h-4"></i> Share via WhatsApp
                    </a>
                `;
            }

            modal.classList.remove('hidden');
            if(window.lucide) lucide.createIcons();
            setTimeout(() => { panel.classList.remove('scale-95', 'opacity-0'); panel.classList.add('scale-100', 'opacity-100'); }, 10);
        }
        
        function toggleLowBandwidth() {
            const isLite = document.body.classList.toggle('low-bandwidth');
            const btn = document.getElementById('lb-toggle');
            btn.innerText = isLite ? 'Full Mode' : 'Lite Mode';
            
            if (isLite) {
                alert("Lite reduces images/charts for cheaper data use");
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

        window.setGlobalCountry = function(country) {
            activeCountry = country;
            
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

            updateTrainingProviders();
            renderOccupationsView();
        }

        window.setGlobalSector = function(sector) {
            activeSectorId = sector;
            
            // Reset all cards
            document.querySelectorAll('.btn-sector-card').forEach(btn => {
                btn.classList.remove('active', 'ring-1');
                btn.classList.remove('border-green-600', 'ring-green-600', 'border-yellow-600', 'ring-yellow-600', 'border-blue-600', 'ring-blue-600');
                btn.classList.add('border-slate-200');
            });

            const activeCard = document.getElementById(`sector-${sector}`);
            if(activeCard) {
                activeCard.classList.add('active', 'ring-1');
                activeCard.classList.remove('border-slate-200');
                
                if (sector === 'agri') activeCard.classList.add('border-green-600', 'ring-green-600');
                if (sector === 'energy') activeCard.classList.add('border-orange-600', 'ring-orange-600');
                if (sector === 'digital') activeCard.classList.add('border-blue-600', 'ring-blue-600');
            }
            
            renderOccupationsView();
        }

        window.openUnifiedHub = function(startTab = 'pp-diagnostic', roleName = null, pathwayGoal = null) {
            // Close any open drawers to prevent overlap
            const careerDrawer = document.getElementById('career-hub-drawer');
            if (careerDrawer && !careerDrawer.classList.contains('translate-x-full')) {
                careerDrawer.classList.add('translate-x-full');
            }
            const trainingDrawer = document.getElementById('training-hub-drawer');
            if (trainingDrawer && !trainingDrawer.classList.contains('translate-x-full')) {
                trainingDrawer.classList.add('translate-x-full');
            }
            const communityDrawer = document.getElementById('community-hub-drawer');
            if (communityDrawer && !communityDrawer.classList.contains('translate-x-full')) {
                communityDrawer.classList.add('translate-x-full');
            }

            const modal = document.getElementById('unified-hub-modal');
            const panel = document.getElementById('unified-hub-modal-panel');
            
            // Conditional Rendering: Only render pathway content if requested (role/goal) or if it's empty/first load
            // This prevents resetting the Diagnostic/Pathway state when just opening "Find Courses" (Tab 4)
            const diagContent = document.getElementById('pp-diagnostic-content');
            const shouldRender = roleName || pathwayGoal || !diagContent || diagContent.innerHTML.trim() === '';

            if(shouldRender && typeof window.renderPATHWAYContent === 'function') {
                window.renderPATHWAYContent(roleName, pathwayGoal);
            }

            document.body.classList.add('overflow-hidden');
            modal.classList.remove('hidden');
            
            setTimeout(() => { 
                window.showUnifiedTab(startTab); 
                if(panel) {
                    panel.classList.remove('scale-95', 'opacity-0'); 
                    panel.classList.add('scale-100', 'opacity-100'); 
                }
            }, 10);
        }

        window.openVentureLaunchpad = function(ventureTitle) {
            // Close drawers
            const careerDrawer = document.getElementById('career-hub-drawer');
            if (careerDrawer) {
                careerDrawer.classList.remove('translate-x-full');
                showEntrepreneurshipView();
            }
            
            // Close Unified Hub if open
            closeModal('unified-hub-modal');
            closeModal('venture-modal');
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
                                <h4 class="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i> AI Feedback</h4>
                                <p class="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">${feedbackText}</p>
                            </div>
                            <div class="grid grid-cols-2 gap-3 text-xs">
                                <div class="bg-slate-50 p-2 rounded text-center"><span class="block font-bold text-slate-800">Completeness</span><span class="text-emerald-600">High</span></div>
                                <div class="bg-slate-50 p-2 rounded text-center"><span class="block font-bold text-slate-800">Relevance</span><span class="text-emerald-600">Spot On</span></div>
                            </div>
                            <button onclick="window.showUnifiedTab('pp-badges')" class="w-full py-2 bg-slate-900 text-white font-bold rounded-lg text-sm hover:bg-slate-800 transition-colors shadow-sm">
                                View '${awardedBadge}'
                            </button>
                        </div>
                    </div>
                `;
                if(window.lucide) lucide.createIcons();
            }, 1500);
        }

        // --- NEW: View Certificate Logic ---
        window.viewCertificate = function(badgeName) {
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

        // --- NEW: Interview Prep Logic ---
        window.showInterviewPrep = function() {
            const container = document.getElementById('career-hub-content');
            const sector = activeSectorId;
            
            const question = (typeof interviewQuestions !== 'undefined' && interviewQuestions[sector]) ? interviewQuestions[sector] : "Tell me about yourself and your experience.";

            container.innerHTML = `
                <div class="animate-fade-in flex flex-col h-full">
                    <button onclick="resetCareerHub()" class="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 shrink-0"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>
                    
                    <div class="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                        <div class="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2 animate-pulse">
                            <i data-lucide="mic" class="w-8 h-8"></i>
                        </div>
                        
                        <div class="space-y-2">
                            <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wide">AI Interview Coach</span>
                            <h3 class="text-xl font-bold text-slate-900 leading-snug">"${question}"</h3>
                            <p class="text-xs text-slate-500">Speak clearly. The AI is listening for keywords and tone.</p>
                        </div>

                        <!-- Mock Recording Interface -->
                        <div class="w-full max-w-xs space-y-3" id="interview-controls">
                            <button onclick="simulateInterviewResponse()" class="w-full py-3 bg-rose-600 text-white font-bold rounded-xl shadow-lg hover:bg-rose-700 transition-all flex items-center justify-center gap-2">
                                <span class="w-2 h-2 bg-white rounded-full animate-ping"></span> Start Recording Answer
                            </button>
                        </div>
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        window.simulateInterviewResponse = function() {
            const controls = document.getElementById('interview-controls');
            controls.innerHTML = `<div class="text-sm font-medium text-slate-600 animate-pulse">Processing your answer...</div>`;
            
            // Randomized Feedback for Demo Realism
            const feedbacks = [
                { score: "8/10", strength: "Good structure (STAR method).", improve: "Quantify your impact (e.g., 'improved by 20%')." },
                { score: "7/10", strength: "Clear articulation and tone.", improve: "Try to relate your answer back to the company's mission." },
                { score: "9/10", strength: "Excellent technical depth.", improve: "Keep the answer slightly more concise." }
            ];
            const fb = feedbacks[Math.floor(Math.random() * feedbacks.length)];
            
            setTimeout(() => {
                const container = document.getElementById('career-hub-content');
                container.innerHTML = `
                    <div class="animate-fade-in space-y-4">
                        <button onclick="resetCareerHub()" class="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>
                        
                        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2"><i data-lucide="bar-chart" class="w-5 h-5 text-indigo-500"></i> Feedback Report</h3>
                            
                            <div class="space-y-4">
                                <div>
                                    <div class="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Confidence Score</span><span>${fb.score}</span></div>
                                    <div class="w-full bg-slate-100 rounded-full h-2"><div class="bg-emerald-500 h-2 rounded-full" style="width: ${parseInt(fb.score)*10}%"></div></div>
                                </div>
                                
                                <div class="bg-indigo-50 p-3 rounded-lg">
                                    <div class="text-xs font-bold text-indigo-800 mb-1">Key Strengths</div>
                                    <p class="text-xs text-indigo-700">${fb.strength}</p>
                                </div>

                                <div class="bg-orange-50 p-3 rounded-lg">
                                    <div class="text-xs font-bold text-orange-800 mb-1">To Improve</div>
                                    <p class="text-xs text-orange-700">${fb.improve}</p>
                                </div>
                            </div>
                            
                            <button onclick="showInterviewPrep()" class="mt-4 w-full py-2 border border-slate-200 text-slate-700 font-bold rounded-lg text-xs hover:bg-slate-50">Try Another Question</button>
                        </div>
                    </div>
                `;
                if(window.lucide) lucide.createIcons();
            }, 2000);
        }
        
        window.openEvidenceModal = function() {
            const modal = document.getElementById('evidence-modal');
            const panel = document.getElementById('evidence-modal-panel');
            
            document.body.classList.add('overflow-hidden');
            const contentContainer = panel.querySelector('.flex-1'); 
            
            contentContainer.innerHTML = `
                <div class="space-y-6">
                    <div>
                        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-3">Labour Market & Employment</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a href="https://ilostat.ilo.org" target="_blank" class="block p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-colors group bg-white">
                                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">1) ILOSTAT <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i></div>
                                <div class="text-xs text-slate-500 mt-1">Global reference for comparable labour indicators.</div>
                            </a>
                            <a href="https://www.eac.int" target="_blank" class="block p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-colors group bg-white">
                                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">2) EAC Secretariat <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i></div>
                                <div class="text-xs text-slate-500 mt-1">Regional labour policy & Manpower Survey.</div>
                            </a>
                            <a href="https://labourmarket.go.ke" target="_blank" class="block p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-colors group bg-white">
                                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">3a) Kenya KLMIS <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i></div>
                                <div class="text-xs text-slate-500 mt-1">National vacancy signals & skills guidance.</div>
                            </a>
                             <a href="https://lmis.gov.rw" target="_blank" class="block p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-colors group bg-white">
                                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">3b) Rwanda LMIS <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i></div>
                                <div class="text-xs text-slate-500 mt-1">Public dashboards & Labour Force Surveys.</div>
                            </a>
                             <a href="https://jobs.kazi.go.tz" target="_blank" class="block p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-colors group bg-white">
                                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">3c) Tanzania LMIS <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i></div>
                                <div class="text-xs text-slate-500 mt-1">National employment portal.</div>
                            </a>
                             <a href="https://mglsd.go.ug" target="_blank" class="block p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-colors group bg-white">
                                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">3d) Uganda MoGLSD <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i></div>
                                <div class="text-xs text-slate-500 mt-1">Ministry of Gender, Labour & Social Development.</div>
                            </a>
                            <a href="https://unevoc.unesco.org/home/Global+Skills+Tracker" target="_blank" class="block p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-colors group bg-white">
                                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">4) UNESCO Global Skills Tracker <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i></div>
                                <div class="text-xs text-slate-500 mt-1">Labour market insights on skills demand.</div>
                            </a>
                            <a href="https://economicgraph.linkedin.com/workforce-data?selectedFilter=view-all%2Fby-year" target="_blank" class="block p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-colors group bg-white">
                                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">5) LinkedIn Economic Graph <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i></div>
                                <div class="text-xs text-slate-500 mt-1">Interactive workforce trends & skills insights.</div>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-3">Investment & Market Outlooks</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a href="https://unctadstat.unctad.org" target="_blank" class="block p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-colors group bg-white">
                                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">6) UNCTADstat <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i></div>
                                <div class="text-xs text-slate-500 mt-1">FDI flows/stocks & cross-country comparability.</div>
                            </a>
                            <a href="https://data.worldbank.org" target="_blank" class="block p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-colors group bg-white">
                                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">7) World Bank Data <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i></div>
                                <div class="text-xs text-slate-500 mt-1">Harmonized macro indicators.</div>
                            </a>
                            <a href="https://www.afdb.org/en/documents/east-africa-economic-outlook-2023" target="_blank" class="block p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-colors group bg-white">
                                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">8) AfDB Outlooks <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i></div>
                                <div class="text-xs text-slate-500 mt-1">Regional economic & sector narratives.</div>
                            </a>
                             <a href="https://www.avca-africa.org" target="_blank" class="block p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-colors group bg-white">
                                <div class="font-bold text-sm text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">9) AVCA <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i></div>
                                <div class="text-xs text-slate-500 mt-1">Venture capital & private equity data.</div>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-3">Sector Specific Sources</h3>
                        <div class="space-y-3">
                            <!-- Agri -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a href="https://www.fao.org/faostat" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors bg-white group">
                                    <div class="p-2 bg-green-100 text-green-700 rounded shrink-0"><i data-lucide="leaf" class="w-4 h-4"></i></div>
                                    <div>
                                        <div class="font-bold text-sm text-slate-800 group-hover:text-green-800">10) FAOSTAT (Agritech)</div>
                                        <div class="text-xs text-slate-500">Employment indicators.</div>
                                    </div>
                                </a>
                                <a href="https://agfundernews.com/" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors bg-white group">
                                    <div class="p-2 bg-green-100 text-green-700 rounded shrink-0"><i data-lucide="leaf" class="w-4 h-4"></i></div>
                                    <div>
                                        <div class="font-bold text-sm text-slate-800 group-hover:text-green-800">11) AgFunder News</div>
                                        <div class="text-xs text-slate-500">AgriFoodTech investment.</div>
                                    </div>
                                </a>
                            </div>

                            <!-- Energy -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a href="https://www.irena.org/Data" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-colors bg-white group">
                                    <div class="p-2 bg-yellow-100 text-yellow-700 rounded shrink-0"><i data-lucide="sun" class="w-4 h-4"></i></div>
                                    <div>
                                        <div class="font-bold text-sm text-slate-800 group-hover:text-yellow-800">12) IRENA</div>
                                        <div class="text-xs text-slate-500">Renewable jobs & capacity.</div>
                                    </div>
                                </a>
                                 <a href="https://www.iea.org/reports/africa-energy-outlook-2022" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-colors bg-white group">
                                    <div class="p-2 bg-yellow-100 text-yellow-700 rounded shrink-0"><i data-lucide="zap" class="w-4 h-4"></i></div>
                                    <div>
                                        <div class="font-bold text-sm text-slate-800 group-hover:text-yellow-800">13) IEA Outlook</div>
                                        <div class="text-xs text-slate-500">Investment needs.</div>
                                    </div>
                                </a>
                                <a href="https://www.seforall.org" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-colors bg-white group">
                                    <div class="p-2 bg-yellow-100 text-yellow-700 rounded shrink-0"><i data-lucide="flame" class="w-4 h-4"></i></div>
                                    <div>
                                        <div class="font-bold text-sm text-slate-800 group-hover:text-yellow-800">14) SEforALL</div>
                                        <div class="text-xs text-slate-500">Tracking SDG7.</div>
                                    </div>
                                </a>
                                <a href="https://www.gogla.org/resources" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-colors bg-white group">
                                    <div class="p-2 bg-yellow-100 text-yellow-700 rounded shrink-0"><i data-lucide="battery-charging" class="w-4 h-4"></i></div>
                                    <div>
                                        <div class="font-bold text-sm text-slate-800 group-hover:text-yellow-800">15) GOGLA</div>
                                        <div class="text-xs text-slate-500">Off-grid solar market data.</div>
                                    </div>
                                </a>
                            </div>

                            <!-- Digital -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a href="https://datahub.itu.int" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors bg-white group">
                                    <div class="p-2 bg-blue-100 text-blue-700 rounded shrink-0"><i data-lucide="cpu" class="w-4 h-4"></i></div>
                                    <div>
                                        <div class="font-bold text-sm text-slate-800 group-hover:text-blue-800">16) ITU DataHub</div>
                                        <div class="text-xs text-slate-500">Core ICT indicators.</div>
                                    </div>
                                </a>
                                <a href="https://www.gsma.com/mobileeconomy/sub-saharan-africa/" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors bg-white group">
                                    <div class="p-2 bg-blue-100 text-blue-700 rounded shrink-0"><i data-lucide="smartphone" class="w-4 h-4"></i></div>
                                    <div>
                                        <div class="font-bold text-sm text-slate-800 group-hover:text-blue-800">17) GSMA Mobile</div>
                                        <div class="text-xs text-slate-500">Mobile economy context.</div>
                                    </div>
                                </a>
                                <a href="https://partechpartners.com/africa-reports/" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors bg-white group">
                                    <div class="p-2 bg-blue-100 text-blue-700 rounded shrink-0"><i data-lucide="trending-up" class="w-4 h-4"></i></div>
                                    <div>
                                        <div class="font-bold text-sm text-slate-800 group-hover:text-blue-800">18) Partech Africa</div>
                                        <div class="text-xs text-slate-500">Tech investment reports.</div>
                                    </div>
                                </a>
                                <a href="https://disrupt-africa.com/" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors bg-white group">
                                    <div class="p-2 bg-blue-100 text-blue-700 rounded shrink-0"><i data-lucide="newspaper" class="w-4 h-4"></i></div>
                                    <div>
                                        <div class="font-bold text-sm text-slate-800 group-hover:text-blue-800">19) Disrupt Africa</div>
                                        <div class="text-xs text-slate-500">Startup news & stats.</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <div class="font-bold text-sm text-indigo-900 mb-1">17) Business Environment Constraints</div>
                        <p class="text-xs text-indigo-700 mb-2">For evidence on skills gaps, finance access, and infrastructure bottlenecks.</p>
                        <a href="https://www.enterprisesurveys.org" target="_blank" class="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                            View World Bank Enterprise Surveys <i data-lucide="external-link" class="w-3 h-3"></i>
                        </a>
                    </div>
                </div>
            `;
            
            modal.classList.remove('hidden');
            if(window.lucide) lucide.createIcons();
            setTimeout(() => { 
                if(panel) {
                    panel.classList.remove('scale-95', 'opacity-0'); 
                    panel.classList.add('scale-100', 'opacity-100'); 
                }
            }, 10);
        }

window.toggleTrainingHub = function() {
    // Close Unified Hub if open
    const unifiedModal = document.getElementById('unified-hub-modal');
    if (unifiedModal && !unifiedModal.classList.contains('hidden')) {
        closeModal('unified-hub-modal');
    }

    // 1. Close the other drawer if it is open
    const careerDrawer = document.getElementById('career-hub-drawer');
    if (!careerDrawer.classList.contains('translate-x-full')) {
        careerDrawer.classList.add('translate-x-full');
    }

    // 2. Toggle this drawer (Remove class to show, Add class to hide)
    const drawer = document.getElementById('training-hub-drawer');
    drawer.classList.toggle('translate-x-full');

    // 3. Run existing logic
    updateTrainingProviders();

    // 4. Sync dropdowns (Safety check)
    const hubCountrySelector = document.getElementById('hub-country');
    if (hubCountrySelector) {
        hubCountrySelector.value = activeCountry;
    }
    const hubSectorSelector = document.getElementById('hub-sector');
    if (hubSectorSelector) {
        hubSectorSelector.value = activeSectorId;
    }
    if(window.lucide) lucide.createIcons();
}
window.toggleCareerHub = function() {
    // Close Unified Hub if open
    const unifiedModal = document.getElementById('unified-hub-modal');
    if (unifiedModal && !unifiedModal.classList.contains('hidden')) {
        closeModal('unified-hub-modal');
    }

    // 1. Close the other drawer if it is open
    const trainingDrawer = document.getElementById('training-hub-drawer');
    if (!trainingDrawer.classList.contains('translate-x-full')) {
        trainingDrawer.classList.add('translate-x-full');
    }
    
    // Close community drawer if open
    const communityDrawer = document.getElementById('community-hub-drawer');
    if (communityDrawer && !communityDrawer.classList.contains('translate-x-full')) {
        communityDrawer.classList.add('translate-x-full');
    }

    // 2. Toggle this drawer
    const drawer = document.getElementById('career-hub-drawer');
    drawer.classList.toggle('translate-x-full');

    // 3. Run existing logic
    resetCareerHub(); 
}
        window.openSkillModal = function(skillName) {
            const modal = document.getElementById('skill-modal');
            const panel = document.getElementById('skill-modal-panel');
            const sectorName = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energies' : 'Digital Economies / AI';
            
            const data = getMasterTrainingCatalogue(skillName, activeSectorId, activeCountry);
            currentSkillData = data;
            currentSkillName = skillName;

            // --- NEW: Narrative Lookup ---
            let narrativeText = "";
            const dynamicSkills = dataManager.getSkills(activeSectorId);
            const dynamicSkill = dynamicSkills ? dynamicSkills.find(s => s.name === skillName) : null;

            const isSaved = myPlan.skills.has(skillName);
            const saveBtnText = isSaved ? "Saved" : "Save Skill";
            const saveBtnIcon = isSaved ? "fill-current" : "";

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
            
            const hotspotText = (typeof skillHotspots !== 'undefined' && skillHotspots[activeSectorId] && skillHotspots[activeSectorId][skillName]) 
                ? skillHotspots[activeSectorId][skillName]
                : `High demand in major economic hubs like <strong>Nairobi, Kigali, and Dar es Salaam</strong>, particularly within the growing ${activeSectorId === 'agri' ? 'Agribusiness' : activeSectorId === 'energy' ? 'Renewable Energy' : 'ICT'} sector.`;

            // Replace Challenge Content
            document.getElementById('skill-challenge-container').innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg shadow-sm shrink-0 border border-emerald-100">
                        <i data-lucide="map-pin" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-900 text-sm mb-1 uppercase tracking-wide">Regional & Economic Hotspots</h3>
                        <p class="text-sm text-slate-600 leading-relaxed">
                            ${hotspotText}
                        </p>
                    </div>
                </div>
            `;
            // Remove assessment result hidden block as it was part of challenge
            document.getElementById('assessment-result').classList.add('hidden');

            // --- NEW: Inject Dynamic CTAs ---
            const ctaContainer = document.getElementById('skill-cta-container');
            if(ctaContainer) {
                ctaContainer.innerHTML = `
                     <button onclick="closeModal('skill-modal'); openUnifiedHub('pp-practice')" class="bg-indigo-800/50 text-white border border-indigo-400/30 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-800 transition-colors flex items-center gap-2 shadow-sm">
                    Pathway Builder <i data-lucide="map" class="w-3 h-3"></i>
                    </button>
                    <button onclick="openCoursesForSkill('${skillName}')" class="bg-white text-indigo-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm">
                    Find Courses <i data-lucide="search" class="w-3 h-3"></i>
                    </button>
                    <button onclick="togglePlanItem('skills', '${skillName.replace(/'/g, "\\'")}', '${skillName.replace(/'/g, "\\'")}')" class="bg-indigo-900 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-indigo-950 transition-colors flex items-center gap-2 shadow-sm ml-auto">
                        <i data-lucide="bookmark" class="w-3 h-3 ${saveBtnIcon}"></i> <span id="skill-save-text">${saveBtnText}</span>
                    </button>
                `;
            }

            modal.classList.remove('hidden');
            if(window.lucide) lucide.createIcons();
            setTimeout(() => { panel.classList.remove('scale-95', 'opacity-0'); panel.classList.add('scale-100', 'opacity-100'); }, 10);
        }

        window.openCoursesForSkill = function(skillName) {
            closeModal('skill-modal');
            
            // Reset filters to ensure search finds results globally
            const selects = document.querySelectorAll('#course-filters-grid select');
            selects.forEach(s => s.value = 'all');

            const searchInput = document.getElementById('filter-search');
            if(searchInput) {
                searchInput.value = skillName;
            }
            openUnifiedHub('pp-courses');
            // Force render to ensure filter is applied
            setTimeout(() => { renderProviderTable(); }, 150);
        }

        window.openResourceModal = function(category) {
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
                            <div class="text-xs text-slate-500">Provider: Coursera Business • Free</div>
                        </div>
                        <div class="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 cursor-pointer">
                            <div class="font-bold text-sm text-slate-800">Entrepreneurship 101</div>
                            <div class="text-xs text-slate-500">Provider: ALX Ventures • 4 Weeks</div>
                        </div>
                    </div>`;
            } else if (category.includes('Incubator')) {
                 content = `
                    <div class="space-y-3">
                        <div class="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 cursor-pointer">
                            <div class="font-bold text-sm text-slate-800">Nairobi Innovation Hub</div>
                            <div class="text-xs text-slate-500">Focus: Early Stage Tech • Nairobi</div>
                        </div>
                        <div class="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 cursor-pointer">
                            <div class="font-bold text-sm text-slate-800">Norrsken House Kigali</div>
                            <div class="text-xs text-slate-500">Focus: Impact Startups • Kigali</div>
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
            if(window.lucide) lucide.createIcons();
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

        // --- NEW: Show Sector Tooltip ---
        window.showSectorTooltip = function(sector) {
            alert((typeof sectorTooltips !== 'undefined' && sectorTooltips[sector]) ? sectorTooltips[sector] : "Sector Metrics Overview");
        }

        window.renderOccupationsView = function() {
            // Safety Check: Ensure base data exists for the active sector
            const baseData = (typeof baseSectorDetailData !== 'undefined' && baseSectorDetailData[activeSectorId]) 
                ? baseSectorDetailData[activeSectorId] 
                : (typeof baseSectorDetailData !== 'undefined' ? baseSectorDetailData['agri'] : null);

            if (!baseData) return; // Stop if data is completely missing

            const overrides = (countryOverrides[activeCountry] && countryOverrides[activeCountry][activeSectorId]) || {};
            
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
                    entrepreneurship: baseData.outlook.entrepreneurship,
                    entrepreneurshipLevel: baseData.outlook.entrepreneurshipLevel,
                    mobility: baseData.outlook.mobility,
                    mobilityLevel: baseData.outlook.mobilityLevel,
                    source: overrides.source || baseData.outlook.source
                },
                occupations: baseData.occupations,
                // Use DataManager occupations if available, else fallback to baseData
                occupations: dataManager.getOccupations(activeSectorId) || baseData.occupations,
                // Use DataManager skills if available, else fallback to baseData
                skills: dataManager.getSkills(activeSectorId) || baseData.skills
            };

            const container = document.getElementById('dashboard-content');

            let demandColorClass = "text-slate-900";
            let demandBgClass = "bg-slate-50 text-slate-600";
            
            // --- UPDATED: Dynamic Card Styling Variables ---
            const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[activeSectorId] : { color: 'indigo' };
            const themeColor = themeConfig.color;

            let cardTitleColor = `text-${themeColor}-800`;
            let cardDescColor = `text-${themeColor}-700`;
            let cardBgColor = "bg-white";
            let cardBorderColor = "border-slate-200";
            let cardHoverBg = `hover:bg-${themeColor}-50`;
            let cardHoverBorder = `hover:border-${themeColor}-200`;

            if (data.growth.skillsDemand === 'Growing' || data.growth.skillsDemand === 'High' || data.growth.skillsDemand === 'Critical') {
                demandColorClass = "text-emerald-600";
                demandBgClass = "bg-emerald-50 text-emerald-600";
            } else if (data.growth.skillsDemand === 'Stable') {
                demandColorClass = "text-amber-600";
                demandBgClass = "bg-amber-50 text-amber-600";
            } else if (data.growth.skillsDemand === 'Emerging') {
                demandColorClass = "text-indigo-600";
                demandBgClass = "bg-indigo-50 text-indigo-600";
            }

            // --- NEW: Filter Venture Data ---
            const sectorMap = { 'agri': 'Agriculture', 'energy': 'Renewables', 'digital': 'Digital/AI' };
            const targetSector = sectorMap[activeSectorId];
            // Filter by sector and country (if specific country selected, otherwise show all or specific 'All' entries)
            const ventures = dataManager.getVentures(activeSectorId, activeCountry)
                .sort((a, b) => a.Rank - b.Rank)
                .slice(0, 10);

            const ventureHtml = ventures.length > 0 ? `
                <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><i data-lucide="rocket" class="w-4 h-4 text-${themeColor}-600"></i> Top 10 Venture Pathways</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        ${ventures.map(v => `
                            <button onclick="openVentureModal('${v.Venture_Title.replace(/'/g, "\\'")}')" title="${v.Venture_Title}" class="px-3 py-2 bg-white border border-${themeColor}-200 rounded-lg text-left hover:bg-${themeColor}-100 hover:border-${themeColor}-300 transition-all group">
                                <div class="font-bold text-xs text-${themeColor}-800 mb-0.5 flex items-center gap-1 truncate">
                                    ${v.Venture_Title} ${v.Rank <= 3 ? '<span title="High Demand" class="ml-1">🔥</span>' : ''}
                                </div>
                                <div class="text-[10px] text-${themeColor}-700/80 leading-tight truncate">${v.Venture_Description}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : '';

            const html = `
                <div class="space-y-6 animate-fade-in">
                    <!-- Sector Intelligence: 1 Row (4 Columns) -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        
                        <!-- Card 1: Sector Proxy -->
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <div class="p-1.5 bg-${themeColor}-50 text-${themeColor}-600 rounded-lg"><i data-lucide="briefcase" class="w-4 h-4"></i></div>
                                    <h4 class="font-bold text-slate-600 text-xs uppercase tracking-wide">Sector Proxy</h4>
                                </div>
                                <span class="text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Src: ${data.outlook.source}</span>
                            </div>
                            <div class="text-2xl font-bold text-slate-900">${data.growth.jobTrend}</div>
                            <div class="text-xs text-slate-500 mt-1">Macro-economic Growth Trend</div>
                        </div>

                        <!-- Card 2: Investments -->
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                            <div class="flex items-center gap-2 mb-2">
                                <div class="p-1.5 bg-${themeColor}-50 text-${themeColor}-600 rounded-lg"><i data-lucide="trending-up" class="w-4 h-4"></i></div>
                                <h4 class="font-bold text-slate-600 text-xs uppercase tracking-wide">Investments</h4>
                            </div>
                            <div class="text-2xl font-bold text-slate-900">${data.growth.investment}</div>
                            <div class="text-xs text-slate-500 mt-1">FDI & Local Capital Inflow</div>
                        </div>

                        <!-- Card 3: Skills Demand (Meter) -->
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                            <div class="flex items-center gap-2 mb-2">
                                <div class="p-1.5 ${demandBgClass} rounded-lg"><i data-lucide="bar-chart-2" class="w-4 h-4"></i></div>
                                <h4 class="font-bold text-slate-600 text-xs uppercase tracking-wide">Skills Demand</h4>
                            </div>
                            <div class="flex items-end gap-2 mb-2">
                                <div class="text-2xl font-bold ${demandColorClass}">${data.growth.skillsDemand}</div>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2 mb-1">
                                <div class="h-2 rounded-full ${demandColorClass.replace('text', 'bg')}" style="width: ${data.growth.skillsDemand === 'Critical' ? '95%' : data.growth.skillsDemand === 'High' ? '80%' : '60%'}"></div>
                            </div>
                            <div class="text-xs text-slate-500 mt-1">${data.growth.demandContext}</div>
                        </div>

                        <!-- Card 4: Key Hotspots -->
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                            <div class="flex items-center gap-2 mb-2">
                                <div class="p-1.5 bg-${themeColor}-50 text-${themeColor}-600 rounded-lg"><i data-lucide="map-pin" class="w-4 h-4"></i></div>
                                <h4 class="font-bold text-slate-600 text-xs uppercase tracking-wide">Key Hotspots</h4>
                            </div>
                            <div class="text-lg font-bold text-slate-900 leading-tight">${data.outlook.hotspots}</div>
                            <div class="text-xs text-slate-500 mt-1">Regional Economic Hubs</div>
                        </div>

                    </div>

                    <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                        <h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><i data-lucide="users" class="w-4 h-4 text-slate-500"></i> Top Occupations in this Sector</h3>
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            ${data.occupations.slice(0, 12).map(role => {
                                return `
                                <button onclick="openOccupationModal('${role.name}')" title="${role.name}" class="px-3 py-2 ${cardBgColor} border ${cardBorderColor} rounded-lg text-left ${cardHoverBg} ${cardHoverBorder} transition-all group">
                                    <div class="w-full">
                                        <div class="font-bold text-xs ${cardTitleColor} mb-0.5 flex items-center gap-1 min-w-0">
                                            <span class="truncate">${role.name}</span> ${role.isHot ? '<span title="Critical Demand" class="shrink-0 ml-0.5 cursor-help">🔥</span>' : ''}
                                        </div>
                                        <div class="text-[10px] ${cardDescColor} leading-tight line-clamp-2">${role.desc}</div>
                                    </div>
                                </button>
                            `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><i data-lucide="cpu" class="w-4 h-4 text-slate-500"></i> Top Skills sought by Employers</h3>
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            ${data.skills.slice(0, 10).map(skill => `
                                <button onclick="openSkillModal('${skill.name.replace(/'/g, "\\'")}')" class="px-3 py-2 ${cardBgColor} border ${cardBorderColor} rounded-lg text-left ${cardHoverBg} ${cardHoverBorder} transition-all group">
                                    <div class="font-bold text-xs ${cardTitleColor} mb-0.5 flex items-center gap-1 truncate">
                                        ${skill.name} ${skill.isHot ? '<span title="Critical Demand" class="ml-1 cursor-help">🔥</span>' : ''}
                                    </div>
                                    <div class="text-[10px] ${cardDescColor} leading-tight truncate">${skill.desc || 'Key competency'}</div>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Venture Pathways Section -->
                    ${ventureHtml}
                </div>
            `;
            
            container.innerHTML = html;
            if(window.lucide) lucide.createIcons();
        }

        window.openVentureLaunchpad = function(ventureTitle) {
            // Close drawers
            const careerDrawer = document.getElementById('career-hub-drawer');
            if (careerDrawer) careerDrawer.classList.add('translate-x-full');
            const trainingDrawer = document.getElementById('training-hub-drawer');
            if (trainingDrawer) trainingDrawer.classList.add('translate-x-full');

            const modal = document.getElementById('unified-hub-modal');
            const panel = document.getElementById('unified-hub-modal-panel');
            
            document.body.classList.add('overflow-hidden');
            modal.classList.remove('hidden');
            
            // Show tab and render specific venture
            showUnifiedTab('pp-venture');
            if(typeof renderVentureLaunchpad === 'function') renderVentureLaunchpad(ventureTitle);
            
            setTimeout(() => { 
                if(panel) {
                    panel.classList.remove('scale-95', 'opacity-0'); 
                    panel.classList.add('scale-100', 'opacity-100'); 
                }
            }, 10);
        }

        // --- NEW: Venture Modal Logic ---
        window.openVentureModal = function(title) {
            const modal = document.getElementById('venture-modal');
            const panel = document.getElementById('venture-modal-panel');
            
            // Find data
            const venture = dataManager.ventures.find(v => v.Venture_Title === title);
            if (!venture) return;

            document.body.classList.add('overflow-hidden');
            // Reset Favorite Button State
            const favBtn = document.getElementById('btn-venture-fav');
            if(favBtn) {
                const isFav = favoriteVentures.has(title);
                if (isFav) {
                    favBtn.className = "flex items-center gap-2 text-rose-600 transition-colors text-xs font-bold";
                    favBtn.innerHTML = `<i data-lucide="heart" class="w-4 h-4 fill-current"></i> <span>Saved</span>`;
                } else {
                    favBtn.className = "flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors text-xs font-bold";
                    favBtn.innerHTML = `<i data-lucide="heart" class="w-4 h-4"></i> <span>Save to Favorites</span>`;
                }
            }

            const modalTitle = document.getElementById('venture-modal-title');
            modalTitle.innerHTML = `${venture.Venture_Title} ${venture.Rank <= 3 ? '<span title="High Demand" class="ml-2">🔥</span>' : ''}`;

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
            let capitalLevel = venture.Startup_Capital_Est || "Medium";
            let techLevel = "Moderate";
            if (capitalLevel.includes('High')) techLevel = "High";

            // Update Badge
            const badge = document.getElementById('venture-modal-badge');
            badge.className = `text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-${theme}-100 text-${theme}-700`;
            badge.innerText = activeSectorId === 'agri' ? 'Agritech Venture' : activeSectorId === 'energy' ? 'Energy Venture' : 'Digital Venture';

            const skills = Array.isArray(venture.Key_Competencies) ? venture.Key_Competencies : (venture.Key_Competencies ? venture.Key_Competencies.split(',').map(s => s.trim()) : []);
            
            // Regulatory & Licensing Map
            const regulations = (typeof ventureRegulations !== 'undefined') ? (ventureRegulations[venture.Venture_Title] || "Standard Business Permit (Local Authority)") : "Standard Business Permit";

            // Challenges Map
            const challenges = (typeof ventureChallenges !== 'undefined') ? (ventureChallenges[venture.Venture_Title] || "Market competition; Customer acquisition costs.") : "Market competition.";

            // 1. At a Glance (Snapshot)
            const snapshotHtml = `
                <div>
                    <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <i data-lucide="info" class="w-4 h-4"></i> Venture Snapshot
                    </h3>
                    <div class="bg-slate-50 rounded-xl border border-slate-200 p-4">
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4">
                            <div>
                                <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Startup Capital</div>
                                <div class="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                                    <i data-lucide="banknote" class="w-3.5 h-3.5"></i> ${capitalLevel}
                                </div>
                            </div>
                            <div>
                                <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Market Reach</div>
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
                                <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Key Driver</div>
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
                    <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">1</span> Opportunity Description
                    </h3>
                    <div class="text-slate-800 text-base leading-relaxed font-medium">
                        ${venture.Venture_Description}
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
                    <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">2</span> Key Competencies
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${skillsListHtml}
                    </div>
                </section>
            `;

            // 4. Requirements & Regulations
            const reqsHtml = `
                <div class="mt-6 pt-6 border-t border-slate-100">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span class="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">3</span> Requirements & Regulations
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div class="flex items-center gap-2 mb-1"><i data-lucide="file-text" class="w-4 h-4 text-indigo-500"></i><span class="text-[10px] font-bold text-slate-500 uppercase">Licensing</span></div>
                            <div class="text-xs text-slate-700 font-medium">${regulations}</div>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div class="flex items-center gap-2 mb-1"><i data-lucide="alert-triangle" class="w-4 h-4 text-rose-500"></i><span class="text-[10px] font-bold text-slate-500 uppercase">Key Challenge</span></div>
                            <div class="text-xs text-slate-700 font-medium">${challenges}</div>
                        </div>
                    </div>
                </div>
            `;

            // 5. CTA
            const ctaHtml = `
                <div class="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all mt-6" onclick="closeModal('venture-modal'); openVentureLaunchpad('${venture.Venture_Title.replace(/'/g, "\\'")}');">
                    <div class="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/10 transition-colors"></div>
                    <div class="relative z-10 flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-lg mb-1 flex items-center gap-2">Pursue this Venture</h3>
                            <p class="text-xs text-slate-300 max-w-sm leading-relaxed mb-3">Build a personalized roadmap with funding sources, incubators, and registration guides.</p>
                            <button class="bg-white text-indigo-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm">
                                Go to Founder's Launchpad <i data-lucide="arrow-right" class="w-3 h-3"></i>
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
            if(window.lucide) lucide.createIcons();
            setTimeout(() => { panel.classList.remove('scale-95', 'opacity-0'); panel.classList.add('scale-100', 'opacity-100'); }, 10);
        }

        window.toggleVentureFavorite = function() {
            const btn = document.getElementById('btn-venture-fav');
            const title = document.getElementById('venture-modal-title').innerText;
            if (!btn || !title) return;
            
            const isSaved = favoriteVentures.has(title);
            
            if(isSaved) {
                favoriteVentures.delete(title);
                btn.className = "flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors text-xs font-bold";
                btn.innerHTML = `<i data-lucide="heart" class="w-4 h-4"></i> <span>Save to Favorites</span>`;
            } else {
                favoriteVentures.add(title);
                btn.className = "flex items-center gap-2 text-rose-600 transition-colors text-xs font-bold";
                btn.innerHTML = `<i data-lucide="heart" class="w-4 h-4 fill-current"></i> <span>Saved</span>`;
            }
            if(window.lucide) lucide.createIcons();
        }

        window.showNextSteps = function() {
            document.getElementById('assessment-result').classList.remove('hidden');
            if(window.lucide) lucide.createIcons();
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

            // Inject Country Specific Resources
            let resourceKey = activeCountry;
            if (resourceKey === 'DRC' || resourceKey === 'Democratic Republic of Congo') resourceKey = 'DR Congo';

            if (sourceData && sourceData.country_resources && sourceData.country_resources[resourceKey]) {
                const cr = sourceData.country_resources[resourceKey];
                if (cr.policy) {
                    sectorData.lmi.unshift(...cr.policy.map(p => ({ name: p.title, desc: p.desc, link: p.link, type: 'National Policy' })));
                }
                if (cr.hubs) {
                    sectorData.entrepreneurship.incubators.unshift(...cr.hubs.map(h => ({ name: h.title, desc: h.desc, link: h.link })));
                }
                if (cr.jobs) {
                    sectorData.jobs.unshift(...cr.jobs.map(j => ({ title: j.title, company: j.desc, type: "National", link: j.link })));
                }
                if (cr.data) {
                    sectorData.lmi.unshift(...cr.data.map(d => ({ name: d.title, desc: d.desc, link: d.link, type: 'National Data' })));
                }
            }
            
            // --- CONTEXTUAL ENRICHMENT ---
            // Inject relevant Regional Multipliers
            if (dataManager.digitalResources.regional_multipliers) {
                const regionalPolicy = dataManager.digitalResources.regional_multipliers.filter(r => r.type === 'Policy/Regulation');
                const regionalEcosystem = dataManager.digitalResources.regional_multipliers.filter(r => r.type === 'Ecosystem');
                
                sectorData.lmi.push(...regionalPolicy.map(p => ({ name: p.title, desc: p.desc, link: p.link, type: 'Regional Policy', gsa_member: p.gsa_member })));
                sectorData.communities.push(...regionalEcosystem.map(e => ({ name: e.title, desc: e.desc, type: "Regional Hub", link: e.link, gsa_member: e.gsa_member })));
            }

            // Inject relevant Global Resources
            if (dataManager.digitalResources.global_resources) {
                const globalFunding = dataManager.digitalResources.global_resources.filter(r => r.type === 'Funding');
                const globalJobs = dataManager.digitalResources.global_resources.filter(r => r.type === 'Jobs');
                const globalData = dataManager.digitalResources.global_resources.filter(r => r.type === 'Data/Research');
                const globalMentors = dataManager.digitalResources.global_resources.filter(r => r.type === 'Ecosystem' && (r.title.includes('Mentor') || r.title.includes('ADPList')));

                sectorData.entrepreneurship.funding.push(...globalFunding.map(f => ({ name: f.title, desc: f.desc, link: f.link, gsa_member: f.gsa_member })));
                sectorData.jobs.push(...globalJobs.map(j => ({ title: j.title, company: j.desc, type: "Global", link: j.link, gsa_member: j.gsa_member })));
                sectorData.lmi.push(...globalData.map(d => ({ name: d.title, desc: d.desc, link: d.link, type: 'Global Data', gsa_member: d.gsa_member })));
                sectorData.communities.push(...globalMentors.map(m => ({ name: m.title, desc: m.desc, type: "Mentorship", link: m.link, gsa_member: m.gsa_member })));
            }

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
                    } else if (lowerTitle.includes('fund') || lowerTitle.includes('invest') || lowerTitle.includes('grant') || lowerTitle.includes('capital')) {
                        if (!sectorData.entrepreneurship.funding.some(f => f.name === res.title)) {
                            sectorData.entrepreneurship.funding.push({ name: res.title, desc: res.desc, link: res.link });
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

        window.showMentorshipView = function() { 
            const sectorData = getSectorCareerResources(activeSectorId);
            const container = document.getElementById('career-hub-content');
            
            // Filter for mentorship platforms and relevant communities
            const mentorPlatforms = (sectorData.communities || []).filter(c => 
                c.type === 'Mentorship' || 
                c.name.toLowerCase().includes('mentor') ||
                (c.desc && c.desc.toLowerCase().includes('mentor'))
            );

            const mentorsHtml = mentorPlatforms.map(c => `
                <a href="${c.link}" target="_blank" class="block p-3 border border-slate-200 rounded-lg bg-white hover:border-blue-300 hover:shadow-sm transition-all group">
                    <div class="flex justify-between items-start mb-1">
                        <div class="font-bold text-sm text-slate-800 group-hover:text-blue-700 flex items-center gap-1">
                            ${c.name}
                            ${c.gsa_member ? '<span class="text-[9px] bg-blue-100 text-blue-700 px-1 rounded border border-blue-200">UNESCO</span>' : ''}
                        </div>
                        <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-blue-500"></i>
                    </div>
                    <div class="text-xs text-slate-500 mb-2 line-clamp-2">${c.desc}</div>
                    <span class="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100">${c.type || 'Platform'}</span>
                </a>
            `).join('');

            container.innerHTML = `
                <div class="animate-fade-in">
                    <button onclick="resetCareerHub()" class="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>
                    <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2"><i data-lucide="user-check" class="w-5 h-5 text-blue-500"></i> Mentorship Platforms</h3>
                    <div class="space-y-3">
                        ${mentorsHtml.length > 0 ? mentorsHtml : '<p class="text-sm text-slate-500 italic">No specific mentorship platforms found. Check general communities.</p>'}
                        <div class="p-3 bg-slate-50 rounded-lg text-xs text-center text-slate-500 italic border border-slate-100">
                            Connect with experienced professionals for career guidance.
                        </div>
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        window.showLMIResources = function() {
            const sectorData = getSectorCareerResources(activeSectorId);
            const container = document.getElementById('career-hub-content');
            
            // Group resources by type for better display
            const groupedLMI = (sectorData.lmi || []).reduce((acc, item) => {
                const type = item.type || 'General';
                if (!acc[type]) acc[type] = [];
                acc[type].push(item);
                return acc;
            }, {});

            const lmiHtml = Object.entries(groupedLMI).map(([type, items]) => `
                <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">${type.replace(/_/g, ' ')}</h4>
                    <div class="space-y-2">
                        ${items.map(l => `
                            <a href="${l.link}" target="_blank" class="block p-3 border border-indigo-100 bg-indigo-50/30 rounded-lg hover:bg-indigo-50 group">
                                <div class="font-bold text-sm text-indigo-900 group-hover:text-indigo-700 flex justify-between items-center">
                                    <span class="flex items-center gap-1">
                                        ${l.name}
                                        ${l.gsa_member ? '<span class="text-[9px] bg-blue-100 text-blue-700 px-1 rounded border border-blue-200">UNESCO</span>' : ''}
                                    </span>
                                    <i data-lucide="external-link" class="w-3 h-3 text-indigo-400"></i>
                                </div>
                                <div class="text-xs text-indigo-700/80 mt-0.5">${l.desc}</div>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="animate-fade-in">
                    <button onclick="resetCareerHub()" class="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>
                    <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2"><i data-lucide="line-chart" class="w-5 h-5 text-indigo-500"></i> Market Intelligence</h3>
                    <div class="space-y-4">
                        ${lmiHtml || '<p class="text-sm text-slate-500 italic">No market intelligence resources found for this sector.</p>'}
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        window.showCVResources = function() {
            const container = document.getElementById('career-hub-content');
            
            // Pull relevant tools from global resources
            const portfolioTools = (dataManager.digitalResources && dataManager.digitalResources.global_resources ? dataManager.digitalResources.global_resources : []).filter(r => 
                r.type === 'Community' && (r.title.includes('GitHub') || r.title.includes('Kaggle'))
            );

            const staticTools = (typeof staticCVTools !== 'undefined') ? staticCVTools : [];
            const allTools = [...staticTools, ...portfolioTools.map(t => ({...t, icon: 'github'}))];

            const toolsHtml = allTools.map(t => `
                <a href="${t.link}" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-purple-300 bg-white group transition-all">
                    <div class="p-2 bg-purple-100 text-purple-600 rounded"><i data-lucide="${t.icon}" class="w-4 h-4"></i></div>
                    <div>
                        <div class="font-bold text-sm text-slate-800 group-hover:text-purple-700">${t.title}</div>
                        <div class="text-xs text-slate-500">${t.desc}</div>
                    </div>
                    <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-purple-500 ml-auto"></i>
                </a>
            `).join('');

            container.innerHTML = `
                <div class="animate-fade-in">
                    <button onclick="resetCareerHub()" class="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>
                    <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2"><i data-lucide="file-text" class="w-5 h-5 text-purple-500"></i> CV & Portfolio Tools</h3>
                    <div class="space-y-3">
                        ${toolsHtml}
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        window.toggleCommunityHub = function() {
            // Close Unified Hub if open
            const unifiedModal = document.getElementById('unified-hub-modal');
            if (unifiedModal && !unifiedModal.classList.contains('hidden')) {
                closeModal('unified-hub-modal');
            }

            // Close other drawers
            const trainingDrawer = document.getElementById('training-hub-drawer');
            if (!trainingDrawer.classList.contains('translate-x-full')) {
                trainingDrawer.classList.add('translate-x-full');
            }
            const careerDrawer = document.getElementById('career-hub-drawer');
            if (!careerDrawer.classList.contains('translate-x-full')) {
                careerDrawer.classList.add('translate-x-full');
            }
            
            // Toggle Community Drawer
            const drawer = document.getElementById('community-hub-drawer');
            drawer.classList.toggle('translate-x-full');

            if (!drawer.classList.contains('translate-x-full')) {
                showCommunityView();
            }
        }

        window.showCommunityView = function(activeFilter = 'all') {
            const sectorData = getSectorCareerResources(activeSectorId);
            const container = document.getElementById('community-hub-content');
            
            // Determine Theme based on Sector
            const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[activeSectorId] : { color: 'indigo' };
            const theme = themeConfig.color;
            
            // Exclude mentorship platforms shown in the other tab
            let communities = (sectorData.communities || []).filter(c => 
                c.type !== 'Mentorship' && !c.name.toLowerCase().includes('mentor')
            );

            // Add Mock Events based on sector (since JSON might not have them yet)
            if (activeSectorId === 'digital') communities.push({ name: "Africa Tech Summit", desc: "Nairobi • Feb 2025", type: "Event", link: "https://www.africatechsummit.com/" });
            if (activeSectorId === 'agri') communities.push({ name: "Sankalp Africa Summit", desc: "Nairobi • Feb 2025", type: "Event", link: "https://sankalpforum.com/" });
            if (activeSectorId === 'energy') communities.push({ name: "Solar Africa Expo", desc: "KICC • June 2025", type: "Event", link: "https://www.solarafricaexpo.com/" });

            // Filter Logic
            let filteredItems = communities;
            if (activeFilter === 'networks') {
                filteredItems = communities.filter(c => c.type !== 'Event');
            } else if (activeFilter === 'events') {
                filteredItems = communities.filter(c => c.type === 'Event');
            }

            const itemsHtml = filteredItems.map(c => {
                const isEvent = c.type === 'Event';
                const icon = isEvent ? 'calendar' : 'users';
                const btnBg = isEvent ? 'bg-orange-50 text-orange-700' : `bg-${theme}-50 text-${theme}-600`;
                const btnText = isEvent ? 'Register' : 'Join';

                return `
                <div class="p-3 border border-slate-200 rounded-lg bg-white flex flex-col gap-2">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="font-bold text-sm text-slate-800 flex items-center gap-2">
                                <i data-lucide="${icon}" class="w-3.5 h-3.5 text-slate-400"></i> ${c.name}
                            </div>
                            <div class="text-xs text-slate-500 mt-0.5">${c.desc}</div>
                        </div>
                        ${c.link && c.link !== 'N/A' ? `
                        <a href="${c.link}" target="_blank" class="text-[10px] font-bold ${btnBg} hover:underline flex items-center gap-1 px-2 py-1 rounded shrink-0">
                            ${btnText} <i data-lucide="external-link" class="w-3 h-3"></i>
                        </a>` : `<span class="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded cursor-not-allowed">Invite Only</span>`}
                    </div>
                </div>
            `}).join('');

            // --- NEW: Featured WhatsApp/Telegram Groups ---
            const featuredGroup = activeSectorId === 'agri' ? { name: 'Agri-Biz Youth EA', members: '3.4k' } 
                                : activeSectorId === 'energy' ? { name: 'Solar Techs East Africa', members: '1.8k' } 
                                : { name: 'Nairobi Devs & AI', members: '5.2k' };

            // Only show featured group in All or Networks
            const showFeatured = activeFilter === 'all' || activeFilter === 'networks';
            const featuredHtml = showFeatured ? `
                <div class="p-3 border border-emerald-200 bg-emerald-50/50 rounded-lg mb-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="font-bold text-sm text-emerald-900 flex items-center gap-1"><i data-lucide="message-circle" class="w-3.5 h-3.5"></i> ${featuredGroup.name}</div>
                            <div class="text-xs text-emerald-700 mt-0.5">Active WhatsApp Group • ${featuredGroup.members} Members</div>
                        </div>
                        <button class="text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200 px-2 py-1 rounded hover:bg-emerald-50 shadow-sm">Join Chat</button>
                    </div>
                </div>
            ` : '';

            // Filter Buttons Helper
            const getBtnClass = (filter) => activeFilter === filter 
                ? "bg-slate-800 text-white shadow-sm" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50";

            container.innerHTML = `
                <div class="animate-fade-in flex flex-col h-full">
                    <!-- Filters -->
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 mb-1">Location</label>
                            <select onchange="setGlobalCountry(this.value); showCommunityView('${activeFilter}');" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-${theme}-500 cursor-pointer">
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
                            <select onchange="setGlobalSector(this.value); showCommunityView('${activeFilter}');" class="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-${theme}-500 cursor-pointer">
                                <option value="agri" ${activeSectorId === 'agri' ? 'selected' : ''}>Agritech</option>
                                <option value="energy" ${activeSectorId === 'energy' ? 'selected' : ''}>Renewable Energy</option>
                                <option value="digital" ${activeSectorId === 'digital' ? 'selected' : ''}>Digital Economy</option>
                            </select>
                        </div>
                    </div>

                    <div class="shrink-0">
                        <div class="flex gap-2 mb-4 overflow-x-auto pb-1">
                            <button onclick="showCommunityView('all')" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('all')}">All</button>
                            <button onclick="showCommunityView('networks')" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('networks')}">Networks</button>
                            <button onclick="showCommunityView('events')" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${getBtnClass('events')}">Events</button>
                        </div>
                    </div>

                    <div class="space-y-3 overflow-y-auto pr-1 pb-4">
                        ${featuredHtml}
                        ${itemsHtml.length > 0 ? itemsHtml : '<div class="text-xs text-slate-500 italic text-center py-4">No items found for this category.</div>'}
                        
                        ${(activeFilter === 'all' || activeFilter === 'networks') ? `
                        <div class="p-3 border border-slate-200 rounded-lg bg-white">
                            <div class="font-bold text-sm text-slate-800">Women in Tech Africa</div>
                            <div class="text-xs text-slate-500 mb-2">Regional Chapter • Virtual/Hybrid</div>
                            <a href="https://www.womenintechafrica.com/" target="_blank" class="text-[10px] font-bold text-${theme}-600 hover:underline flex items-center gap-1">Join Community <i data-lucide="external-link" class="w-3 h-3"></i></a>
                        </div>` : ''}
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        window.showJobBoardView = function() {
            const sectorData = getSectorCareerResources(activeSectorId);
            const container = document.getElementById('career-hub-content');
            
            const jobsHtml = (sectorData.jobs || []).map(j => `
                <a href="${j.link || '#'}" target="_blank" class="block p-3 border border-slate-200 rounded-lg bg-white hover:border-cyan-300 transition-colors group">
                    <div class="flex justify-between items-start mb-1">
                        <div class="flex gap-1">
                            <span class="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded inline-block uppercase tracking-wide">${j.type || 'Full-Time'}</span>
                            ${j.gsa_member ? '<span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block uppercase tracking-wide">UNESCO</span>' : ''}
                        </div>
                        <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-cyan-500"></i>
                    </div>
                    <div class="font-bold text-sm text-slate-800 group-hover:text-cyan-700">${j.title}</div>
                    <div class="text-xs text-slate-500 mb-1">${j.company} • ${activeCountry === 'all' ? 'Regional' : activeCountry}</div>
                </a>
            `).join('');

            container.innerHTML = `
                <div class="animate-fade-in">
                    <button onclick="resetCareerHub()" class="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>
                    <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2"><i data-lucide="briefcase" class="w-5 h-5 text-cyan-600"></i> Active Opportunities</h3>
                    <div class="space-y-3">
                        ${jobsHtml.length > 0 ? jobsHtml : '<p class="text-sm text-slate-500 italic">No job opportunities found for this filter.</p>'}
                        <div class="p-3 bg-slate-50 rounded text-xs text-center text-slate-500">
                            Showing opportunities in <strong>${activeSectorId}</strong>. Includes national, regional, and global listings.
                        </div>
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        // --- NEW: Hero Persona Logic ---
        window.updateHeroPersona = function(type) {
            const content = {
                learner: {
                    text: "In 10 minutes, you’ll have a shortlist of opportunities you’re suited for + an idea of your skills match + information on training options in your country.",
                    },
                entrepreneur: {
                    text: "Identify high-potential venture niches, access eco-system resources, and build your capability roadmap.",
                },
                provider: {
                    text: "Align curriculum with real-time market demand, benchmark outcomes and connect directly with motivated learners.",
                },
                policy: {
                    text: "Visualize workforce trends, identify critical skills gaps, and monitor training capacity across the region.",
                }
            };

            const data = content[type] || content.learner;
            
            const descEl = document.getElementById('hero-desc');
            
            if(descEl) {
                descEl.style.opacity = '0';
                setTimeout(() => { descEl.innerHTML = data.text; descEl.style.opacity = '1'; }, 150);
            }

            const styles = {
                learner: { active: "border-indigo-600 bg-indigo-600 text-white font-bold shadow-sm", inactive: "border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-300" },
                entrepreneur: { active: "border-fuchsia-600 bg-fuchsia-600 text-white font-bold shadow-sm", inactive: "border-slate-200 bg-white text-slate-500 hover:text-fuchsia-600 hover:border-fuchsia-300" },
                provider: { active: "border-emerald-600 bg-emerald-600 text-white font-bold shadow-sm", inactive: "border-slate-200 bg-white text-slate-500 hover:text-emerald-600 hover:border-emerald-300" },
                policy: { active: "border-cyan-600 bg-cyan-600 text-white font-bold shadow-sm", inactive: "border-slate-200 bg-white text-slate-500 hover:text-cyan-600 hover:border-cyan-300" }
            };

            ['learner', 'entrepreneur', 'provider', 'policy'].forEach(k => {
                const btn = document.getElementById(`btn-p-${k}`);
                if(btn) {
                    if(k === type) {
                        btn.className = `shrink-0 snap-center whitespace-nowrap px-4 py-1.5 rounded-full text-xs transition-colors ${styles[k].active}`;
                    } else {
                        btn.className = `shrink-0 snap-center whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${styles[k].inactive}`;
                    }
                }
            });
        }

        window.setGlobalPersona = function(persona) {
            // Placeholder for future logic to filter content based on persona
            console.log("Persona context set to:", persona);
        }

        // --- NEW: Update Hero Stats ---
        window.updateHeroStats = function() {
            let statsContainer = document.getElementById('hero-stats');
            // Auto-inject if missing but hero-desc exists (fallback for existing HTML)
            if (!statsContainer) {
                const descEl = document.getElementById('hero-desc');
                if (descEl && descEl.parentNode) {
                    statsContainer = document.createElement('div');
                    statsContainer.id = 'hero-stats';
                    // Insert after the description
                    descEl.parentNode.insertBefore(statsContainer, descEl.nextSibling);
                } else {
                    return;
                }
            }

            const courseCount = dataManager.courses.length;
            const providerCount = new Set(dataManager.courses.map(c => c.provider)).size;
            const occCount = dataManager.topOccupations.length;
            const skillCount = dataManager.topSkills.length;
            
            let datasetCount = 0;
            if (dataManager.digitalResources) {
                if (Array.isArray(dataManager.digitalResources.evidence_providers)) datasetCount += dataManager.digitalResources.evidence_providers.length;
                ['agri', 'energy', 'digital'].forEach(sector => {
                    if (dataManager.digitalResources[sector] && Array.isArray(dataManager.digitalResources[sector].lmi)) datasetCount += dataManager.digitalResources[sector].lmi.length;
                });
            }

            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            statsContainer.innerHTML = `
                <div class="mt-4 pt-2 border-t border-slate-200/60 animate-fade-in overflow-x-auto no-scrollbar">
                    <div class="flex flex-nowrap items-center justify-start md:justify-center gap-4 text-[10px] text-slate-500 font-medium min-w-max px-2">
                        <span class="font-bold text-slate-400 uppercase tracking-wide mr-1">Database:</span>
                        <div class="flex items-center gap-1" title="Training Courses"><i data-lucide="book-open" class="w-3 h-3 text-indigo-400"></i> <span>${courseCount} Courses</span></div>
                        <span class="text-slate-300">•</span>
                        <div class="flex items-center gap-1" title="Training Providers"><i data-lucide="building-2" class="w-3 h-3 text-indigo-400"></i> <span>${providerCount} Providers</span></div>
                        <span class="text-slate-300">•</span>
                        <div class="flex items-center gap-1" title="Mapped Occupations"><i data-lucide="briefcase" class="w-3 h-3 text-indigo-400"></i> <span>${occCount} Roles</span></div>
                        <span class="text-slate-300">•</span>
                        <div class="flex items-center gap-1" title="Tracked Skills"><i data-lucide="cpu" class="w-3 h-3 text-indigo-400"></i> <span>${skillCount} Skills</span></div>
                        <span class="ml-2 text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Updated ${dateStr}</span>
                    </div>
                </div>
            `;
            
            if(window.lucide) lucide.createIcons();
        }

        window.showEntrepreneurshipView = function() {
            const sectorData = getSectorCareerResources(activeSectorId);
            const data = sectorData.entrepreneurship || {};
            const tc = data.theme || 'indigo'; // Default theme color
            const title = data.title || (activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy');

            const incubatorHtml = (data.incubators || []).map(i => `
                <a href="${i.link}" target="_blank" class="p-3 bg-white border border-slate-200 rounded-lg hover:border-${tc}-400 transition-colors group block shadow-sm">
                    <div class="font-bold text-xs text-slate-800 flex justify-between items-center group-hover:text-${tc}-700">
                        ${i.name} <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-${tc}-500"></i>
                    </div>
                    <div class="text-[10px] text-slate-500 mt-1 leading-tight">${i.desc}</div>
                </a>
            `).join('');

            const fundingHtml = (data.funding || []).map(f => `
                <a href="${f.link}" target="_blank" class="p-3 bg-white border border-slate-200 rounded-lg hover:border-${tc}-400 transition-colors group block shadow-sm">
                    <div class="font-bold text-xs text-slate-800 flex justify-between items-center group-hover:text-${tc}-700">
                        <span class="flex items-center gap-1">
                            ${f.name}
                            ${f.gsa_member ? '<span class="text-[9px] bg-blue-100 text-blue-700 px-1 rounded border border-blue-200">UNESCO</span>' : ''}
                        </span>
                        <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-${tc}-500"></i>
                    </div>
                    <div class="text-[10px] text-slate-500 mt-1 leading-tight">${f.desc}</div>
                </a>
            `).join('');

            const toolsHtml = (data.tools || []).map(t => `
                <a href="${t.link}" target="_blank" class="flex items-center gap-3 p-2 bg-${tc}-50/50 rounded-lg border border-${tc}-100 hover:bg-${tc}-100 hover:border-${tc}-300 transition-all group">
                    <div class="p-1.5 bg-white text-${tc}-600 rounded shadow-sm group-hover:scale-110 transition-transform"><i data-lucide="${t.icon}" class="w-4 h-4"></i></div>
                    <div class="flex-1">
                        <div class="text-xs font-bold text-slate-800 flex justify-between items-center">
                            ${t.name} <i data-lucide="external-link" class="w-3 h-3 text-${tc}-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </div>
                        <div class="text-[10px] text-slate-500">${t.desc}</div>
                    </div>
                </a>
            `).join('');

            const container = document.getElementById('career-hub-content');
            container.innerHTML = `
                <div class="animate-fade-in space-y-5">
                    <!-- Header -->
                    <div>
                        <button onclick="resetCareerHub()" class="mb-3 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-${tc}-100 text-${tc}-700 border border-${tc}-200">${title} Sector</span>
                        </div>
                        <h3 class="font-bold text-lg text-slate-900 flex items-center gap-2">
                            <i data-lucide="rocket" class="w-5 h-5 text-orange-600"></i> Founder Launchpad
                        </h3>
                        <p class="text-xs text-slate-500">Curated resources to start and scale your ${title} venture.</p>
                    </div>

                    <!-- Incubators -->
                    <div>
                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1"><i data-lucide="warehouse" class="w-3 h-3"></i> Incubators & Hubs</h4>
                        <div class="space-y-2">
                            ${incubatorHtml}
                        </div>
                    </div>

                    <!-- Funding -->
                    <div>
                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1"><i data-lucide="banknote" class="w-3 h-3"></i> Grants & Funding</h4>
                        <div class="space-y-2">
                            ${fundingHtml}
                        </div>
                    </div>

                    <!-- Toolkit -->
                    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">🧰 The Founder's Toolkit</h4>
                        <div class="space-y-2">
                            ${toolsHtml}
                            <a href="https://accounts.ecitizen.go.ke" target="_blank" class="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100 mt-2 hover:bg-slate-100 hover:border-slate-300 transition-all group">
                                <div class="p-1.5 bg-white text-slate-600 rounded shadow-sm"><i data-lucide="file-text" class="w-4 h-4"></i></div>
                                <div class="flex-1">
                                    <div class="text-xs font-bold text-slate-800 flex justify-between items-center">
                                        Business Registration <i data-lucide="external-link" class="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                    </div>
                                    <div class="text-[10px] text-slate-500">e-Citizen (KE) / RDB (RW) / BRELA (TZ).</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        window.resetCareerHub = function() {
            document.getElementById('career-hub-content').innerHTML = `
                <div class="space-y-4">
                    <!-- Filters -->
                    <div class="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 grid grid-cols-2 gap-3">
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

                    <div class="grid grid-cols-2 gap-3">
                        <!-- 1. LMI -->
                        <button onclick="showLMIResources()" class="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-white hover:shadow-sm text-left transition-all group">
                            <div class="p-2 bg-indigo-100 text-indigo-600 rounded-lg w-fit mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><i data-lucide="line-chart" class="w-5 h-5"></i></div>
                            <h4 class="font-bold text-slate-800 text-sm">Market Intel</h4>
                            <p class="text-xs text-slate-500 mt-1">Trends & Data</p>
                        </button>
                        
                        <!-- 2. CV & Portfolio -->
                        <button onclick="showCVResources()" class="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-white hover:shadow-sm text-left transition-all group">
                            <div class="p-2 bg-purple-100 text-purple-600 rounded-lg w-fit mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors"><i data-lucide="file-text" class="w-5 h-5"></i></div>
                            <h4 class="font-bold text-slate-800 text-sm">CV & Portfolio</h4>
                            <p class="text-xs text-slate-500 mt-1">Tools & Templates</p>
                        </button>
                        
                        <!-- 3. AI Interview Coach -->
                        <button onclick="showInterviewPrep()" class="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-white hover:shadow-sm text-left transition-all group">
                            <div class="p-2 bg-emerald-100 text-emerald-600 rounded-lg w-fit mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><i data-lucide="mic" class="w-5 h-5"></i></div>
                            <h4 class="font-bold text-slate-800 text-sm">Interview Prep</h4>
                             <p class="text-xs text-slate-500 mt-1">AI Practice Tool</p>
                        </button>
                        
                        <!-- 4. Find a Mentor -->
                        <button onclick="showMentorshipView()" class="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-white hover:shadow-sm text-left transition-all group">
                            <div class="p-2 bg-blue-100 text-blue-600 rounded-lg w-fit mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors"><i data-lucide="user-check" class="w-5 h-5"></i></div>
                            <h4 class="font-bold text-slate-800 text-sm">Mentorship</h4>
                            <p class="text-xs text-slate-500 mt-1">Communities & Networks</p>
                        </button>
                        
                        <!-- 6. Jobs -->
                        <button onclick="showJobBoardView()" class="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-cyan-300 hover:bg-white hover:shadow-sm text-left transition-all group">
                            <div class="p-2 bg-cyan-100 text-cyan-600 rounded-lg w-fit mb-3 group-hover:bg-cyan-600 group-hover:text-white transition-colors"><i data-lucide="briefcase" class="w-5 h-5"></i></div>
                            <h4 class="font-bold text-slate-800 text-sm">Job Board</h4>
                            <p class="text-xs text-slate-500 mt-1">Active Roles</p>
                        </button>

                        <!-- 7. Founder's Launchpad -->
                        <button onclick="showEntrepreneurshipView()" class="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-orange-300 hover:bg-white hover:shadow-sm text-left transition-all group">
                            <div class="p-2 bg-orange-100 text-orange-600 rounded-lg w-fit mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors"><i data-lucide="rocket" class="w-5 h-5"></i></div>
                            <h4 class="font-bold text-slate-800 text-sm">Founder's Launchpad</h4>
                            <p class="text-xs text-slate-500 mt-1">Start & Scale</p>
                        </button>
                    </div>
                </div>
            `;
            if(window.lucide) lucide.createIcons();
        }

        window.togglePathwayResults = function() {
            const results = document.getElementById('pathway-results');
            const form = document.getElementById('pathway-form');
            if(results.classList.contains('hidden')) {
                results.classList.remove('hidden');
                form.classList.add('opacity-50', 'pointer-events-none');
            } else {
                results.classList.add('hidden');
                form.classList.remove('opacity-50', 'pointer-events-none');
            }
        }

        // --- NEW: Toggle More Filters in Training Hub ---
        window.toggleMoreFilters = function() {
            const advancedFilters = document.getElementById('advanced-filters');
            const btn = document.getElementById('more-filters-btn');
            const isHidden = advancedFilters.classList.contains('hidden');

            if (isHidden) {
                advancedFilters.classList.remove('hidden');
                btn.innerHTML = `<i data-lucide="minus-circle" class="w-3 h-3"></i> Less Filters`;
            } else {
                advancedFilters.classList.add('hidden');
                btn.innerHTML = `<i data-lucide="plus-circle" class="w-3 h-3"></i> More Filters`;
            }
            if(window.lucide) lucide.createIcons();
        }

        window.clearCourseFilters = function() {
            const inputs = ['filter-search', 'filter-country', 'filter-sector', 'filter-duration', 'filter-mode', 'filter-cost', 'filter-type', 'filter-lang', 'filter-feature'];
            inputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = id === 'filter-search' ? '' : 'all';
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

        window.renderProviderTable = function() {
            const countryFilter = document.getElementById('filter-country') ? document.getElementById('filter-country').value : 'all';
            const secFilter = document.getElementById('filter-sector') ? document.getElementById('filter-sector').value : 'all';
            const durationFilter = document.getElementById('filter-duration') ? document.getElementById('filter-duration').value : 'all';
            const modeFilter = document.getElementById('filter-mode') ? document.getElementById('filter-mode').value : 'all';
            const costFilter = document.getElementById('filter-cost') ? document.getElementById('filter-cost').value : 'all';
            const typeFilter = document.getElementById('filter-type') ? document.getElementById('filter-type').value : 'all';
            const langFilter = document.getElementById('filter-lang') ? document.getElementById('filter-lang').value : 'all';
            const featureFilter = document.getElementById('filter-feature') ? document.getElementById('filter-feature').value : 'all';
            const searchFilter = document.getElementById('filter-search') ? document.getElementById('filter-search').value.toLowerCase() : '';
            const tbody = document.getElementById('db-body');
            const mobileContainer = document.getElementById('db-mobile-cards');
            
            if (!tbody) return;
            tbody.innerHTML = '';
            if (mobileContainer) mobileContainer.innerHTML = '';

            // Use DataManager courses or fallback to realCourses from data.js
            let courses = dataManager.courses && dataManager.courses.length > 0 ? dataManager.courses : (typeof realCourses !== 'undefined' ? realCourses : []);

            const filtered = courses.filter(c => {
                const matchCountry = countryFilter === 'all' || c.country === 'all' || c.country === countryFilter;
                const matchSector = secFilter === 'all' || c.sector === secFilter;
                const matchMode = modeFilter === 'all' || c.mode === modeFilter || (modeFilter === 'Hybrid' && c.mode === 'Blended');
                
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
                const matchCost = costFilter === 'all' || (costFilter === 'free' ? (c.cost && c.cost.toLowerCase().includes('free')) : (c.cost && !c.cost.toLowerCase().includes('free')));
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
                }

                let matchFeature = true;
                if (featureFilter === 'unesco') matchFeature = c.gsa_member || c.unesco_unevoc;
                else if (featureFilter === 'women') matchFeature = c.women_focused;

                const matchSearch = searchFilter === '' || (c.name && c.name.toLowerCase().includes(searchFilter)) || (c.provider && c.provider.toLowerCase().includes(searchFilter));

                return matchCountry && matchSector && matchDuration && matchMode && matchCost && matchLang && matchType && matchFeature && matchSearch;
            });

            // Sort: Specific Country > Global ('all')
            filtered.sort((a, b) => {
                const aIsGlobal = a.country === 'all';
                const bIsGlobal = b.country === 'all';
                
                if (!aIsGlobal && bIsGlobal) return -1;
                if (aIsGlobal && !bIsGlobal) return 1;
                
                // If both are specific or both are global, sort by name
                if (!aIsGlobal && !bIsGlobal) return a.country.localeCompare(b.country);
                return a.name.localeCompare(b.name);
            });

            filtered.forEach(c => {
                // Outcome Data Logic
                const outcome = c.outcomeData || { stars: 1, methodology: 'No Data', uplift: 'No Data' };
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

                // Mobile Card HTML
                if (mobileContainer) {
                    const mobileCard = `
                        <div class="p-4 space-y-3">
                            <div class="flex justify-between items-start gap-3">
                                <div>
                                    <div class="font-bold text-sm text-slate-800 leading-tight mb-1">${c.name}</div>
                                    <div class="text-xs text-slate-500">${c.provider}</div>
                                </div>
                                <div class="flex flex-col items-end gap-1">
                                    ${c.gsa_member ? '<span class="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-bold whitespace-nowrap">UNESCO GSA</span>' : ''}
                                    ${c.unesco_unevoc ? '<span class="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200 font-bold whitespace-nowrap">UNEVOC</span>' : ''}
                                    ${c.women_focused ? '<span class="text-[9px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded border border-pink-200 font-bold whitespace-nowrap">Women-Focused</span>' : ''}
                                </div>
                            </div>
                            
                            <div class="flex flex-wrap gap-2">
                                <span class="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] border border-slate-100 flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i> ${c.mode}</span>
                                <span class="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] border border-slate-100 flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${c.duration}</span>
                                <span class="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] border border-slate-100 flex items-center gap-1"><i data-lucide="banknote" class="w-3 h-3"></i> ${c.cost}</span>
                            </div>

                            <div class="flex items-center justify-between pt-2 border-t border-slate-50">
                                <div class="flex items-center gap-2">
                                    <span class="${badgeClass} px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                                        <span>${stars}</span> ${outcome.methodology || qualityText}
                                    </span>
                                </div>
                                ${c.url ? `
                                <a href="${c.url}" target="_blank" class="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">
                                    View <i data-lucide="external-link" class="w-3 h-3"></i>
                                </a>` : `<span class="text-[10px] text-slate-300 cursor-not-allowed">N/A</span>`}
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
                                ${c.gsa_member ? '<span title="UNESCO Global Skills Academy Partner" class="text-[9px] bg-blue-100 text-blue-700 px-1 rounded border border-blue-200">UNESCO GSA</span>' : ''}
                                ${c.unesco_unevoc ? '<span title="UNESCO-UNEVOC Network Member" class="text-[9px] bg-orange-100 text-orange-700 px-1 rounded border border-orange-200">UNEVOC</span>' : ''}
                                ${c.women_focused ? '<span title="Women-Focused Program" class="text-[9px] bg-pink-100 text-pink-700 px-1 rounded border border-pink-200">Women-Focused</span>' : ''}
                            </div>
                            <div class="text-[10px] text-slate-500 truncate max-w-[120px]">${c.provider}</div>
                        </td>
                        <td class="px-3 py-3">
                            <div class="text-[10px] text-slate-600 font-medium">${sectorDisplay}</div>
                            <div class="text-[9px] text-slate-400">${c.mode} • ${c.duration}</div>
                        </td>
                        <td class="px-3 py-3">
                            <span class="${badgeClass} px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1 whitespace-nowrap">
                                <span>${stars}</span> ${outcome.methodology || qualityText}
                            </span>
                        </td>
                        <td class="px-3 py-3">
                            <div class="font-mono font-bold text-xs ${metricDisplay === 'No Data' ? 'text-slate-300' : 'text-blue-600'}">
                                ${metricDisplay}
                            </div>
                        </td>
                        <td class="px-3 py-3">
                            <div class="text-[10px] text-slate-500 font-medium">${c.lastUpdated || 'N/A'}</div>
                        </td>
                        <td class="px-3 py-3 text-right">
                            ${c.url ? `
                            <a href="${c.url}" target="_blank" class="text-slate-400 hover:text-blue-600 transition">
                                <i data-lucide="external-link" class="w-3 h-3"></i>
                            </a>` : `<span class="text-[10px] text-slate-300 cursor-not-allowed">N/A</span>`}
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
            const counter = document.getElementById('provider-counter');
            if(counter) counter.innerText = `Showing ${filtered.length} courses`;
            if(window.lucide) lucide.createIcons();
        }

        // --- NEW: Render Training Hub Drawer Courses ---
        window.renderTrainingHubCourses = function() {
            const countryFilter = document.getElementById('drawer-hub-country') ? document.getElementById('drawer-hub-country').value : 'all';
            const langFilter = document.getElementById('drawer-hub-language') ? document.getElementById('drawer-hub-language').value : 'all';
            const secFilter = document.getElementById('drawer-hub-sector') ? document.getElementById('drawer-hub-sector').value : 'all';
            const modeFilter = document.getElementById('drawer-hub-mode-quick') ? document.getElementById('drawer-hub-mode-quick').value : 'all';
            
            // Advanced filters
            const typeFilter = document.getElementById('drawer-hub-course-type') ? document.getElementById('drawer-hub-course-type').value : 'all';
            const budgetFilter = document.getElementById('drawer-hub-budget') ? document.getElementById('drawer-hub-budget').value : 'all';

            const container = document.getElementById('training-hub-results');
            if (!container) return;
            container.innerHTML = '';

            let courses = dataManager.courses && dataManager.courses.length > 0 ? dataManager.courses : (typeof realCourses !== 'undefined' ? realCourses : []);

            const filtered = courses.filter(c => {
                const matchCountry = countryFilter === 'all' || c.country === 'all' || c.country === countryFilter;
                const matchSector = secFilter === 'all' || c.sector === secFilter;
                const matchLang = langFilter === 'all' || (c.language && c.language.includes(langFilter));
                const matchMode = modeFilter === 'all' || c.mode.toLowerCase() === modeFilter.toLowerCase() || (modeFilter.toLowerCase() === 'hybrid' && c.mode === 'Blended');
                
                let matchType = true;
                if (typeFilter !== 'all') {
                    const t = (c.type || '').toLowerCase();
                    if (typeFilter === 'certificate') matchType = t.includes('certificate');
                    else if (typeFilter === 'micro-credential') matchType = t.includes('micro');
                    else if (typeFilter === 'tvet') matchType = t.includes('tvet') || t.includes('diploma');
                    else if (typeFilter === 'university') matchType = t.includes('degree') || t.includes('bachelor') || t.includes('master');
                    else if (typeFilter === 'bootcamp') matchType = t.includes('bootcamp');
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
            if(window.lucide) lucide.createIcons();
        }

        // --- NEW: Impact Charts Initialization ---
        window.initImpactCharts = function() {
            if (impactChartsInitialized) return;
            if (typeof Chart === 'undefined') return;
            
            // 1. Salary Chart
            const ctxSalary = document.getElementById('salaryChart');
            if (ctxSalary) {
                new Chart(ctxSalary.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: ['Pre-Training', 'Post-Grad (1st Job)', '1 Year Later'],
                        datasets: [{
                            label: 'Avg Monthly Salary (KES)',
                            data: [15000, 36000, 75000],
                            backgroundColor: ['#cbd5e1', '#22c55e', '#3b82f6'],
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { 
                            y: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 9 } } }, 
                            x: { grid: { display: false }, ticks: { font: { size: 9 } } } 
                        }
                    }
                });
            }

            // 2. Time to Employment Chart
            const ctxTime = document.getElementById('timeChart');
            if (ctxTime) {
                new Chart(ctxTime.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: ['< 3 Months', '3-12 Months', '> 1 Year'],
                        datasets: [{
                            data: [66, 17, 17], // Generation Kenya Data
                            backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '70%',
                        plugins: { 
                            legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 6, font: { size: 9 } } }
                        }
                    }
                });
            }
            
            impactChartsInitialized = true;
        }

        // --- NEW: Render Sector Cards ---
        function renderSectorCards() {
            const container = document.getElementById('sector-cards-container');
            if (!container) return;
            if (typeof sectorCardConfig === 'undefined') return;

            container.innerHTML = sectorCardConfig.map(sector => `
                <div onclick="setGlobalSector('${sector.id}')" id="sector-${sector.id}" class="btn-sector-card card-${sector.id} p-4 rounded-xl border-slate-200 bg-${sector.color}-50 shadow-sm text-left group cursor-pointer relative">
                    <div class="flex flex-row items-center gap-3 mb-3">
                        <div class="p-2 bg-${sector.color}-100 text-${sector.color}-700 rounded-lg shrink-0"><i data-lucide="${sector.icon}" class="w-5 h-5"></i></div>
                        <h3 class="font-bold text-slate-800 group-hover:text-${sector.color}-800 text-sm">${sector.name}</h3>
                        <button onclick="event.stopPropagation(); showSectorTooltip('${sector.id}')" class="p-1 hover:bg-${sector.color}-200 rounded-full text-${sector.color}-700 transition-colors" aria-label="Info"><i data-lucide="info" class="w-3 h-3"></i></button>
                        <span class="ml-auto text-[9px] font-bold uppercase tracking-wider bg-${sector.color}-100 text-${sector.color}-800 px-1.5 py-0.5 rounded-full shrink-0">${sector.growth}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-y-2 gap-x-1 text-[10px] sm:text-xs" id="${sector.id}-top-skills"></div>
                </div>
            `).join('');
        }

        window.addEventListener('DOMContentLoaded', () => {
            if (typeof countryData === 'undefined' || typeof baseSectorDetailData === 'undefined') {
                console.warn("Data dependencies (data.js) missing or not loaded.");
            }

            renderSectorCards();
            if(window.lucide) lucide.createIcons();
            setGlobalSector('agri');
            updateTrainingProviders(); 
            dataManager.init(); // Initialize DataManager
            loadMyPlan(); // Load saved plan from LocalStorage
            resetCareerHub(); 
            
            const hubSelector = document.getElementById('hub-country');
            if (hubSelector) {
                hubSelector.value = activeCountry;
            }

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
              window.addEventListener('load', () => {
                console.log('PWA Service Worker Registration skipped for single-file prototype.');
              });
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
                if(window.lucide) lucide.createIcons();
            }
            if (type === 'skills') {
                const btnText = document.getElementById('skill-save-text');
                if (btnText) btnText.innerText = set.has(id) ? "Saved" : "Save Skill";
                if(window.lucide) lucide.createIcons();
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
                ? `<div class="mt-4 pt-3 border-t border-slate-200">
                     <button onclick="copyPlanToClipboard()" class="w-full py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2">
                        <i data-lucide="share-2" class="w-3 h-3"></i> Share My Plan
                     </button>
                   </div>` 
                : '';

            container.innerHTML = (html || '<div class="text-center text-xs text-slate-400 py-4 italic">Your plan is empty.<br>Save roles, skills, or courses to see them here.</div>') + shareBtn;
            if(window.lucide) lucide.createIcons();
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
            let text = "My AI4EAC Career Plan:\n\n";
            if (myPlan.roles.size > 0) {
                text += "🎯 Target Roles:\n";
                myPlan.roles.forEach(id => text += `- ${myPlan.names[id] || id}\n`);
                text += "\n";
            }
            if (myPlan.skills.size > 0) {
                text += "💪 Target Skills:\n";
                myPlan.skills.forEach(id => text += `- ${myPlan.names[id] || id}\n`);
                text += "\n";
            }
            if (myPlan.courses.size > 0) {
                text += "📚 Saved Courses:\n";
                myPlan.courses.forEach(id => text += `- ${myPlan.names[id] || id}\n`);
            }
            text += "\nBuild your own at: https://ai4eac-compass.org";
            
            navigator.clipboard.writeText(text).then(() => {
                alert("Plan copied to clipboard!");
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert("Failed to copy plan. Please try again.");
            });
        }