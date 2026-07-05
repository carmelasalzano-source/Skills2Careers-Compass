// --- GLOBAL STATE ---
let activeSectorId = 'agri';
let activeCountry = 'all';
let currentSkillName = null;
let currentSkillData = null;
let impactChartsInitialized = false;
let wageData = []; // Store loaded OJA/Wage data
let ventureData = []; // Store loaded Venture data
let digitalResources = null; // Store loaded Digital/Sector resources
let pathwayState = { goal: null, constraints: {} }; // Store Pathway Builder state
let myPlan = { roles: new Set(), skills: new Set(), courses: new Set() }; // New My Plan State
let favoriteVentures = new Set(); // Store favorite ventures
let hubNavigationStack = []; // Navigation history for Unified Hub
let showCrossSectorOnly = false; // Toggle for Cross-Sector Skills
let showSavedOnly = false; // Toggle for Saved Skills filter in Skills in Demand
let isStudentpreneur = false; // Toggle for Studentpreneur Mode

// --- UTILITIES ---
function refreshIcons() { if (window.lucide) lucide.createIcons(); }
function normalizeDRC(country) {
    return (country === 'DRC' || country === 'Democratic Republic of Congo') ? 'DR Congo' : country;
}
