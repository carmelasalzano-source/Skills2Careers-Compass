        // --- UPDATED COUNTRY DATA TO INCLUDE VERIFIED PROVIDER LINKS ---
        const countryData = {
            'all': { currency: 'USD', providers: ['Moringa School', 'ALX Africa', 'Coursera', 'atingi', 'edX'] },
            'Kenya': { currency: 'KES', providers: ['Moringa School', 'Egerton University', 'JKUAT', 'Kenyatta University'], salaryFallback: "60k - 150k" },
            'Tanzania': { currency: 'TZS', providers: ['UDSM', 'TAREA', 'VETA'], salaryFallback: "1.2M - 3M" },
            'Uganda': { currency: 'UGX', providers: ['Makerere Univ', 'Refactory', 'Clarke Int. Univ'], salaryFallback: "1.8M - 4M" },
            'Rwanda': { currency: 'RWF', providers: ['CMU Africa', 'ALU', 'Univ. of Rwanda'], salaryFallback: "600k - 1.5M" },
            'Burundi': { currency: 'BIF', providers: ['Univ. of Burundi', 'BBIN'] },
            'South Sudan': { currency: 'SSP', providers: ['Univ. of Juba', 'Starford Int.'] },
            'DRC': { currency: 'CDF', providers: ['Kinshasa Digital', 'Kadea Academy', 'UNIKIN'] },
            'Somalia': { currency: 'SOS', providers: ['Simad University', 'Jamhuriya University', 'Hormuud Telecom Foundation'] },
            'Nigeria': { currency: 'NGN', providers: ['Precision Field Academy', 'ALX Nigeria'] },
            'South Africa': { currency: 'ZAR', providers: ['University of Johannesburg', 'Stellenbosch University', 'UKZN'] }
        };

        // --- COUNTRY SPECIFIC OVERRIDES ---
        const countryOverrides = {
            'Kenya': {
                'agri': {
                    jobTrend: "+18% YoY",
                    investment: "$60M (Agritech)",
                    skillsDemand: "High",
                    demandContext: "Silicon Savannah AgTech",
                    hiring: "Twiga Foods, SunCulture, Govt Research",
                    hotspots: "Nairobi, Nakuru, Eldoret",
                    source: "World Bank Kenya Overview",
                    sourceUrl: "https://www.worldbank.org/en/country/kenya/overview"
                },
                'digital': {
                    jobTrend: "+8% YoY",
                    investment: "$500M ICT FDI (2023)",
                    skillsDemand: "Critical",
                    demandContext: "Cloud-Native & GenAI Adoption",
                    hiring: "Safaricom (Fintech 2.0), Microsoft ADC, Equity Bank",
                    hotspots: "Nairobi (Westlands/Kilimani)",
                    source: "Kenya CBK / KNBS 2023",
                    sourceUrl: "https://www.centralbank.go.ke/wp-content/uploads/2024/07/2023-Foreign-Investment-Report.pdf"
                },
                'energy': {
                    jobTrend: "+25% YoY",
                    investment: "$150M (Annual est.)",
                    hiring: "KPLC, Geothermal Dev Corp, Solar Firms",
                    hotspots: "Rift Valley (Geothermal), Lake Turkana",
                    source: "IEA Kenya 2024",
                    sourceUrl: "https://www.iea.org/reports/kenya-2024/executive-summary"
                },
            },
            'Rwanda': {
                'digital': {
                    jobTrend: "+35% YoY",
                    investment: "$100M (ICT sector)",
                    demandContext: "ICT: 2nd largest GDP driver (Q1 2025)",
                    hiring: "Norrsken House, Govt Digital Services",
                    hotspots: "Kigali Innovation City",
                    source: "Rwanda MINICT / NISR 2023",
                    sourceUrl: "https://www.minict.gov.rw/"
                },
                'agri': {
                    jobTrend: "+7% YoY",
                    investment: "$300M (World Bank CDAT)",
                    hiring: "Export Crops (Coffee/Tea), Horti-export",
                    hotspots: "Kigali, Northern Province",
                    source: "Rwanda MINAGRI / World Bank",
                    sourceUrl: "https://www.minagri.gov.rw/updates/news-details/rwanda-world-bank-launch-us300-million-project-to-commercialize-de-risk-agriculture"
                },
                'energy': {
                    jobTrend: "+20% YoY",
                    investment: "$65M (Annual est.)",
                    hiring: "REG, Ignite Power, d.light, KivuWatt",
                    hotspots: "Kigali, Lake Kivu, Rural Electrification Zones",
                    source: "RURA / IRENA",
                    sourceUrl: "https://www.rura.rw/sectors/energy/overview"
                },
            },
            'Tanzania': {
                'energy': {
                    jobTrend: "+20% YoY",
                    investment: "$1.5B (World Bank)",
                    hiring: "TANESCO, REA, Solar Home Systems",
                    hotspots: "Rural Electrification Zones",
                    source: "TanzaniaInvest / World Bank Energy",
                    sourceUrl: "https://www.tanzaniainvest.com/energy"
                },
                'agri': {
                    jobTrend: "+14% YoY",
                    investment: "$300M (World Bank TFSRP)",
                    hiring: "Large Commercial Farms, SAGCOT",
                    hotspots: "Iringa, Morogoro, Mbeya",
                    source: "World Bank Tanzania TFSRP 2023",
                    sourceUrl: "https://www.worldbank.org/en/news/press-release/2023/05/31/new-world-bank-financing-for-tanzania-afe-will-enhance-agricultural-productivity-and-improve-resilience-climate-change"
                },
                'digital': {
                    jobTrend: "+16% YoY",
                    investment: "$559M (Ecosystem 2024)",
                    skillsDemand: "Growing",
                    demandContext: "Mobile Money & Govt Digital Services",
                    hiring: "Vodacom Tanzania, CRDB Bank, TTCL, Dar Startups",
                    hotspots: "Dar es Salaam (Masaki, Msasani)",
                    source: "TICGL / Chanzo Digital Economy 2024",
                    sourceUrl: "https://thechanzo.com/2024/05/22/see-how-tanzanias-journey-towards-digital-economy-is-gaining-momentum/"
                },
            },
             'Uganda': {
                'agri': {
                    jobTrend: "+12% YoY",
                    investment: "$45M (Estimated)",
                    skillsDemand: "Growing",
                    demandContext: "Horticulture Export & Coffee Value Chain",
                    hiring: "NARO, Export Farms, Agro-processing Firms",
                    hotspots: "Kampala, Jinja, Mbarara",
                    source: "World Bank Uganda / UBOS",
                    sourceUrl: "https://www.worldbank.org/en/country/uganda/overview"
                },
                'energy': {
                    jobTrend: "+18% YoY",
                    investment: "$400M (COP28 Pledge)",
                    hiring: "Oil & Gas Transition, Hydro",
                    hotspots: "Albertine Graben, Jinja",
                    source: "IEA Uganda 2023 Review",
                    sourceUrl: "https://www.iea.org/reports/uganda-2023/executive-summary"
                },
                'digital': {
                    jobTrend: "+22% YoY",
                    investment: "$55M (Estimated)",
                    skillsDemand: "High",
                    demandContext: "Fintech & Mobile Money Growth",
                    hiring: "MTN Uganda, Airtel, Outbox Hub Startups",
                    hotspots: "Kampala (Kololo, Nakasero)",
                    source: "CIPESA / UNCTAD 2025",
                    sourceUrl: "https://cipesa.org/2025/05/the-future-of-work-in-uganda-challenges-and-prospects-in-the-context-of-the-digital-economy/"
                },
            },
            'Burundi': {
                'agri': {
                    jobTrend: "+8% YoY",
                    investment: "$15M",
                    skillsDemand: "Moderate",
                    demandContext: "Subsistence to Commercial",
                    hiring: "Coffee Co-ops, Tea Estates, NGOs",
                    hotspots: "Bujumbura Rural, Gitega",
                    source: "AfDB Burundi Economic Outlook",
                    sourceUrl: "https://www.afdb.org/en/countries/east-africa/burundi/burundi-economic-outlook"
                },
                'energy': {
                    jobTrend: "+12% YoY",
                    investment: "$147M (AfDB Portfolio)",
                    hiring: "Regideso, Solar Micro-grids",
                    hotspots: "Rural Provinces, Solar Parks",
                    source: "World Bank / AfDB Burundi 2024",
                    sourceUrl: "https://www.worldbank.org/en/news/press-release/2024/01/10/world-bank-provides-continued-support-for-energy-access-in-afe-burundi"
                },
                'digital': {
                    jobTrend: "+10% YoY",
                    investment: "$5M",
                    skillsDemand: "Emerging",
                    demandContext: "Early Stage ICT",
                    hiring: "Telecommunications (Econet), Banks",
                    hotspots: "Bujumbura",
                    source: "Digital Watch / IFC CPSD Burundi",
                    sourceUrl: "https://dig.watch/countries/burundi"
                },
            },
            'South Sudan': {
                'agri': {
                    jobTrend: "+5% YoY",
                    investment: "$46.2M (AfDB CRAFT)",
                    skillsDemand: "High (Basic)",
                    demandContext: "Food Security Focus",
                    hiring: "FAO, WFP, NGOs, Local Co-ops",
                    hotspots: "Greenbelt Region, Juba",
                    source: "AfDB CRAFT Grant 2024",
                    sourceUrl: "https://www.afdb.org/en/news-and-events/press-releases/south-sudan-african-development-bank-group-approves-46-million-grant-funding-agricultural-productivity-food-security-and-resilience-72642"
                },
                'energy': {
                    jobTrend: "+8% YoY",
                    investment: "$50M (World Bank)",
                    hiring: "Ezra Power, Solar Relief Projects",
                    hotspots: "Juba, Oil Fields",
                    source: "World Bank / ESMAP South Sudan",
                    sourceUrl: "https://www.esmap.org/Pathways_to_Electricity_Access_Expansion_in_South_Sudan"
                },
                'digital': {
                    jobTrend: "+15% YoY",
                    investment: "$8M (Estimated)",
                    skillsDemand: "High",
                    demandContext: "Infra & Mobile Money",
                    hiring: "Mobile Operators (MTN/Zain), NGOs",
                    hotspots: "Juba",
                    source: "World Bank South Sudan (Estimated)",
                    sourceUrl: "https://www.worldbank.org/en/country/southsudan/overview"
                },
            },
            'DRC': {
                'agri': {
                    jobTrend: "+10% YoY",
                    investment: "$117.9M (AfDB 2024)",
                    skillsDemand: "Growing",
                    demandContext: "Agro-Industrial Parks",
                    hiring: "Plantations, Agro-processing SEZs",
                    hotspots: "Lubumbashi, Goma, Kinshasa",
                    source: "AfDB DRC Agri Loan Feb 2024",
                    sourceUrl: "https://www.afdb.org/en/news-and-events/press-releases/democratic-republic-congo-african-development-bank-lend-117-million-support-agricultural-transformation-69100"
                },
                'energy': {
                    jobTrend: "+20% YoY",
                    investment: "$340M (Moyi Power)",
                    hiring: "SNEL, Mining Power Projects",
                    hotspots: "Katanga (Mining), Inga Zone",
                    source: "AfDB Moyi Power Dec 2024",
                    sourceUrl: "https://www.afdb.org/en/news-and-events/press-releases/drc-african-development-bank-lead-financing-transformative-moyi-power-project-79372"
                },
                'digital': {
                    jobTrend: "+30% YoY",
                    investment: "$400M+ (World Bank IDA)",
                    skillsDemand: "High",
                    demandContext: "Fintech & Digital Transformation",
                    hiring: "Kinshasa Digital, Orange, Vodacom",
                    hotspots: "Kinshasa (Gombe)",
                    source: "World Bank DRC Digital Project 2023",
                    sourceUrl: "https://www.worldbank.org/en/topic/digitaldevelopment"
                },
            },
            'Somalia': {
                'agri': {
                    jobTrend: "+6% YoY",
                    investment: "$18M (Humanitarian)",
                    skillsDemand: "High (Basic)",
                    demandContext: "Food Security & Livestock Value Chain",
                    hiring: "FAO, WFP, Mercy Corps, Agro-dealers",
                    hotspots: "Kismayo, Bay/Bakool, Puntland",
                    source: "FAO Somalia / SDRB 2023",
                    sourceUrl: "https://sdrb.gov.so/unlocking-investment-in-somalias-livestock-sector-opportunities-challenges-and-market-potential/"
                },
                'energy': {
                    jobTrend: "+15% YoY",
                    investment: "$25M (AfDB + MIGA)",
                    hiring: "Hormuud Telecom, Solar EPC Firms, Private Utilities",
                    hotspots: "Mogadishu, Hargeisa, Bosaso",
                    source: "AfDB / MIGA Somalia 2023",
                    sourceUrl: "https://www.ecofinagency.com/news-industry/1301-51897-somalia-builds-renewable-energy-push-to-tackle-high-electricity-costs"
                },
                'digital': {
                    jobTrend: "+15% YoY",
                    investment: "$15M (Estimated)",
                    skillsDemand: "High",
                    demandContext: "Mobile Money & Diaspora-led Fintech",
                    hiring: "Hormuud (EVC Plus), Somtel, Dahabshiil",
                    hotspots: "Mogadishu, Hargeisa",
                    source: "CBS Somalia / UNDP 2023",
                    sourceUrl: "https://sominvest.gov.so/key-sectors/ict-digital-economy/"
                },
            }
        };

const baseSectorDetailData = {
            agri: {
                growth: { 
                    jobTrend: "+15% YoY", 
                    investment: "$45M (High)", 
                    skillsDemand: "Growing", 
                    demandContext: "High Tech-Adoption" 
                },
                outlook: {
                    hiring: "Agri-Processors, Export Firms, Research Inst.",
                    hotspots: "Nairobi, Arusha, Kigali",
                    entrepreneurship: "High (B2B Supply Chain)",
                    entrepreneurshipLevel: 75,
                    mobility: ["Regional (EAC)", "Rural-Urban"],
                    mobilityLevel: 60,
                    source: "FAOSTAT / ILO",
                    sourceUrl: "https://www.fao.org/faostat/en/"
                },
                occupations: [
                    { name: "Agricultural Extension Officer", desc: "Community mobilization, crop advisory, and farmer training.", isHot: true, escoCode: "2132.2.2" },
                    { name: "Supply Chain Manager", desc: "Applies predictive analytics to manage logistics, reduce post-harvest losses, and connect smallholders to markets.", isHot: true, escoCode: "1324.4" },
                    { name: "Post-Harvest Specialist", desc: "Manages cold-chain and storage using IoT sensors and data platforms to reduce losses between farm and market.", isHot: true, escoCode: "2132.4" },
                    { name: "Digital Extension Officer", desc: "Delivers AI-powered advisory services to farmers — combining agronomic knowledge with mobile and data tools.", isHot: true, escoCode: "2132.2" },
                    { name: "Precision Ag Specialist", desc: "Drone mapping, GIS analysis, and sensor integration.", isHot: true, escoCode: "2132.2.8" },
                    { name: "Farm IoT Engineer", desc: "Maintains connected sensor networks on-farm.", isHot: true, escoCode: "2151.5" },
                    { name: "Drone Pilot", desc: "Operates UAVs for crop surveillance and mapping.", escoCode: "8342.3" },
                    { name: "Soil Data Analyst", desc: "Interprets soil samples for nutrient management.", escoCode: "2132.1" },
                    { name: "Smart Irrigation Tech", desc: "Installs automated water delivery systems.", escoCode: "7126.2" },
                    { name: "Agri-Input Sales", desc: "Distributes seeds/chemicals with technical advice.", escoCode: "3322.2" },
                    { name: "Climate Risk Analyst", desc: "Models weather patterns for crop resilience.", escoCode: "2114.1" },
                    { name: "Urban Farming Architect", desc: "Designs vertical and CEA systems for cities.", escoCode: "2161.1" },
                    { name: "Livestock Health Tech", desc: "Tracks animal health via wearables/software.", escoCode: "3240.1" }
                ],
                skills: [
                    { 
                        name: "Soil Analysis", 
                        desc: "Testing soil health & pH",
                        narrative: "Modern soil analysis goes beyond basic sampling. It involves using digital spectrometers and lab data to map nutrient variability (N-P-K) across a farm. Professionals use this data to create variable-rate fertilizer prescriptions that optimize yield while minimizing environmental runoff."
                    }, 
                    { 
                        name: "IoT Sensors", 
                        desc: "Connected farm monitoring",
                        narrative: "Internet of Things (IoT) in agriculture involves deploying and maintaining networks of sensors that monitor soil moisture, temperature, and humidity in real-time. Mastery includes calibrating devices, troubleshooting connectivity issues (LoRaWAN/GSM), and interpreting the data streams to automate irrigation systems.",
                        isHot: true
                    }, 
                    { 
                        name: "GIS Mapping", 
                        desc: "Spatial data analysis",
                        narrative: "Geographic Information Systems (GIS) allow agronomists to visualize farm data layers—such as yield history, topography, and soil type—on a map. This skill is critical for land-use planning, defining management zones, and piloting autonomous machinery.",
                        isHot: true
                    }, 
                    { 
                        name: "Python", 
                        desc: "Data automation scripts",
                        narrative: "In Agritech, Python is the primary language for analyzing large datasets (yield data, weather patterns). It is used to build predictive models for pest outbreaks, automate report generation, and clean raw data collected from field agents.",
                        isHot: true
                    },
                    { 
                        name: "Mobile Money API", 
                        desc: "Digital payment integration",
                        narrative: "Integrating mobile money (M-Pesa, MTN Mobile Money) is essential for agri-fintech. This skill involves connecting farm management platforms to payment gateways to facilitate instant payments for produce or credit disbursements to unbanked farmers."
                    }, 
                    { 
                        name: "Logistics", 
                        desc: "Supply chain optimization",
                        narrative: "Agri-logistics focuses on the cold chain and efficient movement of perishable goods. Professionals use digital tools to route vehicles, track inventory freshness (FIFO), and minimize post-harvest losses during transport to urban markets."
                    }, 
                    { name: "Climate Modeling", desc: "Weather pattern analysis", narrative: "Using historical weather data and AI models to predict seasonal shifts, helping farmers adapt planting schedules to mitigate climate risks." }, 
                    { name: "Remote Sensing", desc: "Satellite imagery interp.", narrative: "Analyzing satellite (Sentinel-2) or drone imagery to assess crop health (NDVI indices) and detect stress before it becomes visible to the naked eye." },
                    { name: "Inventory Mgmt", desc: "Stock tracking systems", narrative: "Managing input supplies (seeds, fertilizer) and harvest stock using digital ledgers to ensure traceability and prevent theft or spoilage." }, 
                    { name: "Data Viz", desc: "Dashboard creation", narrative: "Translating complex agronomic data into simple, actionable visual dashboards for farmers or stakeholders using tools like Tableau or PowerBI." }, 
                    { name: "Crop Science", desc: "Yield optimization", narrative: "Deep understanding of plant physiology and genetics, combined with digital tools to run trials and select the best seed varieties for specific micro-climates." }, 
                    { name: "Drone Ops", desc: "Aerial surveillance", narrative: "Piloting UAVs for crop spraying or multispectral imaging, including adherence to civil aviation regulations and flight path planning." },
                    { name: "Digital Advisory", desc: "E-extension services", narrative: "Using digital tools to provide farmers with actionable advice on crop management, weather, and markets.", isHot: true },
                    { name: "Precision Ag", desc: "Site-specific farming", narrative: "Farming management concept based on observing, measuring, and responding to inter and intra-field variability in crops.", isHot: true },
                    { name: "Water Management", desc: "Irrigation efficiency", narrative: "The activity of planning, developing, distributing, and managing the optimum use of water resources.", isHot: true },
                    { name: "Climate Adaptation", desc: "Resilience planning", narrative: "Adjusting to actual or expected future climate and its effects. In agriculture, this means changing planting dates or crop varieties.", isHot: true },
                    { name: "Food Security", desc: "Supply stability", narrative: "The measure of the availability of food and individuals' ability to access it." },
                    { name: "Farm Management", desc: "Operational oversight", narrative: "Making and implementing decisions involved in organizing and operating a farm for maximum production and profit." },
                    { name: "Mechanization", desc: "Machinery use", narrative: "The process of changing from working by hand or with animals to doing that work with machinery." },
                    { name: "Agribusiness", desc: "Commercial farming", narrative: "The business of agricultural production including agrichemicals, breeding, crop production, distribution, farm machinery, processing, and seed supply." },
                    { name: "Supply Chain", desc: "Logistics flow", narrative: "The network of all individuals, organizations, resources, activities, and technology involved in the creation and sale of a product." },
                    { name: "Digital Tools", desc: "Software usage", narrative: "General proficiency in using software and applications to enhance productivity and decision making." },
                    { name: "Communication", desc: "Info dissemination", narrative: "Conveying meanings from one entity or group to another through the use of mutually understood signs, symbols, and semiotic rules." },
                    { name: "IoT", desc: "Platform & API connectivity", narrative: "Connecting farm devices and sensors to cloud advisory platforms and market systems using IoT protocols (MQTT, LoRaWAN). Essential for linking field data to decision-support tools." },
                    { name: "Data Analysis", desc: "Farm data & market analytics", narrative: "Analysing yield data, price trends and supply chain performance using tools like Excel, R and Power BI to support farm management decisions and investor reporting." },
                    { name: "Data Science", desc: "Crop modelling & prediction", narrative: "Building predictive models for crop disease risk, climate vulnerability scoring and yield optimisation using historical field and weather data." },
                    { name: "Machine Learning", desc: "Pest & disease detection", narrative: "Applying ML models to field imagery and sensor data to detect crop stress, identify pest outbreaks early and automate irrigation scheduling decisions.", isHot: true },
                    { name: "Project Mgmt", desc: "Value chain coordination", narrative: "Managing timelines, procurement and stakeholder relationships for agri value chain rollouts, rural electrification tie-ins and donor-funded programmes." },
                    { name: "Cloud Computing", desc: "Farm platform hosting", narrative: "Hosting farm management platforms, sensor data lakes and advisory dashboards on cloud infrastructure. Ensures 24/7 availability for remote advisory services." },
                    { name: "Cybersecurity", desc: "Farm data protection", narrative: "Protecting farmer data, payment records and supply chain integrity from digital threats — increasingly important as agri platforms handle financial transactions." },
                    { name: "AI", desc: "Precision farming intelligence", narrative: "Using AI tools for crop disease detection from images, yield prediction, weather-adaptive planting advice and automated market price alerts for smallholders.", isHot: true },
                    { name: "Web Dev", desc: "Market & advisory portals", narrative: "Building farmer-facing web platforms for market price discovery, cooperative management and digital input ordering." },
                    { name: "Digital Marketing", desc: "Market access & e-commerce", narrative: "Using WhatsApp Business, social media and digital marketplaces to connect farmers and agro-dealers with buyers, reducing dependence on middlemen.", isHot: true },
                    { name: "Financial Literacy", desc: "Farm finance & credit", narrative: "Understanding farm budgeting, input credit options, SACCO savings and how to prepare a loan application or pitch to an agri-investor." }
                ],
                entrepreneurship: {
                    successMetrics: { value: "65% Revenue Uplift", source: "TechnoServe 2024", context: "for digitized farms" }
                }
            },
            energy: {
                growth: { 
                    jobTrend: "+22% YoY", 
                    investment: "$120M (Very High)", 
                    skillsDemand: "Stable", 
                    demandContext: "Consistent Growth" 
                },
                outlook: {
                    hiring: "Utilities (KPLC/TANESCO), Solar Home Systems",
                    hotspots: "Remote Off-grid, Rift Valley",
                    entrepreneurship: "Medium (Distribution)",
                    entrepreneurshipLevel: 50,
                    mobility: ["Regional", "Technical Certs"],
                    mobilityLevel: 80,
                    source: "IRENA / IEA",
                    sourceUrl: "https://www.irena.org/Data"
                },
                occupations: [
                    { name: "Solar PV Installer", desc: "Assembles and maintains photovoltaic systems.", isHot: true, escoCode: "7411.3.3" },
                    { name: "Grid Systems Engineer", desc: "Ensures transmission stability and load balance.", isHot: true, escoCode: "2151.2" },
                    { name: "Energy Auditor", desc: "Inspects buildings for efficiency improvements.", isHot: true, escoCode: "2149.6" },
                    { name: "Geothermal Technician", desc: "Operates steam extraction and generation plant.", escoCode: "3131.3" },
                    { name: "Wind Turbine Tech", desc: "Troubleshoots and repairs turbine components.", escoCode: "7412.2" },
                    { name: "Energy Policy Analyst", desc: "Evaluates regulations and tariff frameworks.", escoCode: "2422.5" },
                    { name: "Smart Meter Tech", desc: "Services Advanced Metering Infrastructure (AMI).", escoCode: "7411.2" },
                    { name: "Project Manager", desc: "Oversees renewable construction lifecycles.", escoCode: "1219.3" },
                    { name: "Safety Inspector", desc: "Enforces HSE standards and compliance.", escoCode: "3257.1" },
                    { name: "Bioenergy Specialist", desc: "Manages biomass conversion systems.", escoCode: "2143.1" },
                    { name: "EV Charging Tech", desc: "Maintains electric vehicle infrastructure.", escoCode: "7412.1" },
                    { name: "Energy Storage Specialist", desc: "Designs battery (BESS) integration systems.", escoCode: "2151.4" }
                ],
                skills: [
                    { 
                        name: "Electrical Wiring", 
                        desc: "Circuits & safety standards",
                        narrative: "The fundamental ability to interpret circuit diagrams and safely install AC/DC wiring. In renewable energy, this specifically covers high-voltage DC cabling for solar arrays and connection to inverters."
                    }, 
                    { 
                        name: "Solar PV", 
                        desc: "Solar panel configuration",
                        narrative: "Designing and installing Photovoltaic (PV) systems involves calculating load requirements, selecting appropriate panel/battery combinations, and understanding solar geometry to maximize energy capture.",
                        isHot: true
                    }, 
                    { 
                        name: "SCADA", 
                        desc: "System monitoring control",
                        narrative: "Supervisory Control and Data Acquisition (SCADA) systems are the brain of modern grids. Professionals monitor real-time power flows, detect faults remotely, and balance loads to prevent blackouts.",
                        isHot: true
                    }, 
                    { 
                        name: "Safety Protocols", 
                        desc: "OSHA/ISO compliance",
                        narrative: "Strict adherence to safety standards (Lockout/Tagout, PPE, Working at Heights) is non-negotiable in the energy sector to prevent electrocution and workplace accidents."
                    },
                    { 
                        name: "AutoCAD", 
                        desc: "Technical system design",
                        narrative: "Using CAD software to create precise electrical schematics and site layout plans. These drawings are essential for permitting, regulatory approval, and guiding installation crews."
                    }, 
                    { 
                        name: "Grid Mgmt", 
                        desc: "Load balancing logic",
                        narrative: "Managing the stability of the electrical grid, specifically integrating intermittent renewable sources (solar/wind) without destabilizing frequency or voltage levels."
                    }, 
                    { name: "Energy Efficiency", desc: "Audit & optimization", narrative: "Analyzing building or industrial energy usage to identify wastage. Involves retrofitting lighting, HVAC, and motors to reduce consumption.", isHot: true }, 
                    { name: "Project Mgmt", desc: "Installation oversight", narrative: "Coordinating timelines, budgets, and procurement for energy projects. Essential for ensuring rural electrification projects stay on track." },
                    { name: "Thermodynamics", desc: "Heat transfer systems", narrative: "Understanding heat flow is crucial for geothermal energy and solar water heating systems to optimize thermal exchange efficiency." }, 
                    { name: "Regulatory Compl.", desc: "Policy adherence", narrative: "Navigating the complex landscape of energy laws, tariffs, and environmental regulations in East African nations." }, 
                    { name: "Data Analysis", desc: "Usage pattern tracking", narrative: "Analyzing smart meter data to understand consumption patterns, detect theft, and forecast peak demand periods." }, 
                    { name: "Field Ops", desc: "On-site maintenance", narrative: "Hands-on troubleshooting of hardware—cleaning panels, topping up battery electrolytes, and replacing blown fuses in remote locations." },
                    { name: "Wind Power", desc: "Turbine maintenance", narrative: "Technical skills for the installation, operation, and maintenance of wind turbines, including blade repair and generator troubleshooting." },
                    { name: "Grid Systems", desc: "Transmission & Distribution", narrative: "Understanding the infrastructure of power transmission, including substations, transformers, and the integration of renewable energy sources." },
                    { name: "Sustainability", desc: "Eco-friendly practices", narrative: "Meeting the needs of the present without compromising the ability of future generations to meet their own needs.", isHot: true },
                    { name: "Green Tech", desc: "Clean technology", narrative: "Technology whose use is intended to mitigate or reverse the effects of human activity on the environment.", isHot: true },
                    { name: "Installation", desc: "System setup", narrative: "The physical act of setting up equipment for use. In energy, this involves mounting panels, turbines, and connecting wiring." },
                    { name: "Compliance", desc: "Rule adherence", narrative: "Ensuring energy systems meet legal and safety standards. Covers licensing requirements and inspection protocols." },
                    { name: "Biomass", desc: "Organic energy", narrative: "Fuel developed from organic materials — a renewable and sustainable source of energy used to create electricity or other forms of power." },
                    { name: "Policy", desc: "Regulatory frameworks", narrative: "Understanding and formulating the laws, regulations, and guidelines that govern the energy sector." },
                    { name: "Economics", desc: "Market analysis", narrative: "Analyzing the production, distribution, and consumption of energy goods and services." },
                    { name: "Audit", desc: "Compliance check", narrative: "Systematic examination of records, documents, and systems to ensure an organization meets required standards." },
                    { name: "Python", desc: "Grid modelling & automation", narrative: "Writing scripts for grid simulation, renewable output modelling and automating data collection from smart meters or SCADA systems.", isHot: true },
                    { name: "GIS Mapping", desc: "Site selection & grid planning", narrative: "Using spatial data to plan rural electrification routes, optimise solar site placement and map coverage gaps for off-grid expansion." },
                    { name: "IoT Sensors", desc: "Smart metering & diagnostics", narrative: "Deploying and maintaining sensors for smart metering, fault detection and remote grid diagnostics — core skills for Advanced Metering Infrastructure (AMI) rollout." },
                    { name: "IoT", desc: "Remote asset management", narrative: "Connecting energy assets (solar home systems, smart meters, batteries) to cloud monitoring platforms for real-time performance tracking and automated demand-response." },
                    { name: "Data Science", desc: "Demand & output forecasting", narrative: "Building models to predict energy demand, forecast renewable output (solar irradiance, wind speed) and optimise dispatch decisions for grid operators.", isHot: true },
                    { name: "Machine Learning", desc: "Predictive maintenance", narrative: "Training models on equipment sensor data to predict failures before they occur — reducing downtime for solar plants, wind turbines and grid substations.", isHot: true },
                    { name: "Mobile Money API", desc: "PAYG solar integration", narrative: "Integrating M-Pesa, Airtel Money and MTN MoMo into pay-as-you-go (PAYG) solar platforms — enabling token-based energy access for unbanked households." },
                    { name: "Drone Ops", desc: "Infrastructure inspection", narrative: "Operating UAVs to inspect power lines, wind turbine blades and solar panel arrays — reducing the cost and risk of manual inspection in remote locations." },
                    { name: "Data Viz", desc: "Grid dashboards & reporting", narrative: "Building consumption dashboards and outage heat-maps to help utilities and regulators monitor grid performance and communicate impact to investors." },
                    { name: "Cloud Computing", desc: "Grid data & SCADA hosting", narrative: "Centralising grid monitoring data and SCADA telemetry on cloud infrastructure for reliable access, disaster recovery and multi-site operational visibility." },
                    { name: "Cybersecurity", desc: "Critical grid security", narrative: "Protecting SCADA systems and grid control infrastructure from cyber-attacks — a critical risk as East African utilities digitise and connect to the internet.", isHot: true },
                    { name: "AI", desc: "Grid optimisation & forecasting", narrative: "Using AI for real-time load balancing, renewable energy dispatch optimisation, outage prediction and automated fault isolation in distribution networks.", isHot: true },
                    { name: "Web Dev", desc: "Customer & utility portals", narrative: "Developing customer self-service portals for bill payment, outage reporting and usage tracking — reducing utility call-centre volumes." },
                    { name: "Digital Marketing", desc: "Solar customer acquisition", narrative: "Driving adoption of solar home systems and mini-grids through digital channels — essential for off-grid companies scaling across rural East Africa." },
                    { name: "Financial Literacy", desc: "Project finance & energy ROI", narrative: "Understanding project finance structures, green bonds, carbon credit markets and the ROI calculations behind PAYG solar and mini-grid investments." }
                ],
                entrepreneurship: {
                    successMetrics: null
                }
            },
            digital: {
                growth: { 
                    jobTrend: "+35% YoY", 
                    investment: "$300M (Explosive)", 
                    skillsDemand: "Emerging", 
                    demandContext: "Rapid Evolution" 
                },
                outlook: {
                    hiring: "Fintech, Telcos, Startups, Banks",
                    hotspots: "Nairobi, Kigali, Kampala",
                    entrepreneurship: "Very High (Freelance/SaaS)",
                    entrepreneurshipLevel: 90,
                    mobility: ["Global Remote", "Regional"],
                    mobilityLevel: 95,
                    source: "ITU / GSMA",
                    sourceUrl: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-economy/africa/"
                },
                occupations: [
                    { name: "Data Scientist", desc: "Extracts insights from complex datasets.", isHot: true, escoCode: "2122.2.4" },
                    { name: "Cloud Architect", desc: "Designs scalable cloud computing environments.", isHot: true, escoCode: "2512.3" },
                    { name: "Cybersecurity Analyst", desc: "Monitors networks for security breaches.", isHot: true, escoCode: "2529.1.1" },
                    { name: "Frontend Dev", desc: "Builds interactive user interfaces for web/mobile.", escoCode: "2512.6" },
                    { name: "Backend Dev", desc: "Develops server-side logic and APIs.", escoCode: "2512.5" },
                    { name: "UX/UI Designer", desc: "Creates intuitive product user experiences.", escoCode: "2513.1" },
                    { name: "AI/ML Engineer", desc: "Trains predictive models and algorithms.", escoCode: "2512.8" },
                    { name: "Product Manager", desc: "Guides product strategy and development lifecycles.", escoCode: "2424.1" },
                    { name: "DevOps Engineer", desc: "Automates CI/CD deployment pipelines.", escoCode: "2512.7" },
                    { name: "Digital Marketer", desc: "Drives growth via digital channels.", escoCode: "2431.5" },
                    { name: "Blockchain Developer", desc: "Builds decentralized apps and smart contracts.", escoCode: "2512.9" },
                    { name: "Systems Administrator", desc: "Maintains IT infrastructure and networks.", escoCode: "2522.1" },
                    { name: "Android Dev", desc: "Builds native Android apps for mobile-first EAC markets.", isHot: true, escoCode: "2512.10" }
                ],
                skills: [
                    { 
                        name: "Python", 
                        desc: "Backend & Data Science",
                        narrative: "The lingua franca of data science and AI. In this context, it is used to build backend servers (Django/Flask) or train machine learning models (PyTorch/TensorFlow) to solve local business problems.",
                        isHot: true
                    }, 
                    { 
                        name: "JavaScript", 
                        desc: "Web interactivity",
                        narrative: "The core language of the web. Mastery allows you to build interactive frontends, manage asynchronous API calls, and increasingly, build mobile apps via frameworks like React Native."
                    }, 
                    { 
                        name: "AWS/Azure", 
                        desc: "Cloud infrastructure",
                        narrative: "Deploying and managing applications on cloud platforms. Key skills include setting up virtual machines (EC2), managing databases (RDS), and configuring serverless functions for scalable apps.",
                        isHot: true
                    }, 
                    { 
                        name: "SQL", 
                        desc: "Database management",
                        narrative: "Structured Query Language is essential for talking to databases. You must be able to write complex queries to extract insights, join tables, and ensure data integrity for business reporting."
                    },
                    { 
                        name: "React", 
                        desc: "Frontend UI library",
                        narrative: "A popular JavaScript library for building user interfaces. It enables the creation of reusable components and fast, single-page applications that offer a native-app-like experience."
                    }, 
                    { 
                        name: "Cybersecurity", 
                        desc: "Network defense",
                        narrative: "Protecting digital assets from threats. Includes understanding encryption, configuring firewalls, conducting penetration testing, and implementing zero-trust security architectures.",
                        isHot: true
                    }, 
                    { name: "Machine Learning", desc: "Predictive models", narrative: "Training algorithms to recognize patterns in data. Applied in East Africa for credit scoring, crop disease detection, and natural language processing." }, 
                    { name: "User Research", desc: "UX & customer insights", narrative: "The process of understanding user behaviors, needs, and motivations through observation techniques and feedback loops to guide product design." },
                    { name: "Agile", desc: "Product management", narrative: "A project management methodology that emphasizes iterative delivery, team collaboration, and flexibility to adapt to changing market needs." }, 
                    { name: "DevOps", desc: "CI/CD & automation", narrative: "Bridging development and operations to shorten the development lifecycle. Involves automating code testing, deployment pipelines, and infrastructure monitoring." }, 
                    { name: "API Design", desc: "System integration", narrative: "Designing secure and documented interfaces (REST/GraphQL) that allow different software systems to talk to each other reliably." }, 
                    { name: "Figma", desc: "Interface design", narrative: "The industry-standard tool for collaborative interface design and prototyping. Used to create the visual look and feel before coding begins." },
                    { name: "Cloud Computing", desc: "Serverless & Scalability", narrative: "The delivery of computing services including servers, storage, databases, and networking over the Internet.", isHot: true },
                    { name: "Web Dev", desc: "Full-stack building", narrative: "Building and maintaining websites and web applications, covering both client-side (frontend) and server-side (backend) technologies.", isHot: true },
                    { name: "Data Science", desc: "Insight generation", narrative: "Combining domain expertise, programming skills, and mathematics to extract meaningful insights from data.", isHot: true },
                    { name: "IoT", desc: "Connected devices", narrative: "The Internet of Things involves connecting physical devices to the internet. Essential for smart grids, precision agriculture, and industrial automation.", isHot: true },
                    { name: "Networking", desc: "Connectivity infrastructure", narrative: "Designing and managing computer networks (LAN/WAN). Essential for ensuring connectivity in remote areas and supporting IoT infrastructure.", isHot: true },
                    { name: "AI", desc: "Artificial Intelligence", narrative: "Broad field of computer science focused on creating systems capable of performing tasks that typically require human intelligence.", isHot: true },
                    { name: "Digital Marketing", desc: "Online growth strategy", narrative: "Promoting products or services using digital channels like social media, search engines, and email to reach consumers." },
                    { name: "Product Management", desc: "Lifecycle oversight", narrative: "The business process of planning, developing, launching, and managing a product or service including lifecycle management and strategy." },
                    { name: "Deep Learning", desc: "Neural networks", narrative: "A subset of machine learning based on artificial neural networks. Key for image recognition and NLP.", isHot: true },
                    { name: "Network Security", desc: "Infrastructure defense", narrative: "Policies and practices to prevent and monitor unauthorized access, misuse, modification, or denial of a computer network.", isHot: true },
                    { name: "Cloud Architecture", desc: "Cloud design", narrative: "Designing secure, scalable, and reliable cloud applications. Involves components and subcomponents required for cloud computing.", isHot: true },
                    { name: "UI Design", desc: "Visual interface", narrative: "User Interface design focuses on the look and layout of an interface to ensure it is visually appealing and easy to navigate." },
                    { name: "Automation", desc: "Process efficiency", narrative: "The use of technology to perform tasks with reduced human assistance. Key in DevOps and manufacturing.", isHot: true },
                    { name: "CI/CD", desc: "Deployment pipelines", narrative: "Continuous Integration and Continuous Delivery. A method to frequently deliver apps by introducing automation into app development stages.", isHot: true },
                    { name: "GIS Mapping", desc: "Spatial analytics & logistics", narrative: "Using geospatial data for urban mobility platforms, logistics route optimisation, precision delivery networks and mapping unserved markets across East Africa." },
                    { name: "IoT Sensors", desc: "Connected device integration", narrative: "Integrating physical sensor networks into software platforms — from smart city traffic management to industrial automation and connected consumer devices." },
                    { name: "Data Analysis", desc: "Product & business analytics", narrative: "Analysing user behaviour, A/B test results and business metrics using BI tools (Looker, Tableau, Power BI) to inform product and commercial decisions." },
                    { name: "Project Mgmt", desc: "Tech delivery & coordination", narrative: "Coordinating agile sprints, managing vendor relationships and delivering digital projects on time and budget across distributed teams." },
                    { name: "Mobile Money API", desc: "EAC fintech integration", narrative: "Integrating M-Pesa, Airtel Money and MTN MoMo APIs into digital products — a must-have skill for any consumer app targeting payments in East Africa.", isHot: true },
                    { name: "Drone Ops", desc: "Logistics & aerial tech", narrative: "Programming and operating autonomous delivery drones and building the software platforms that manage flight corridors, payload tracking and last-mile logistics." },
                    { name: "Data Viz", desc: "BI dashboards & data storytelling", narrative: "Building business intelligence dashboards and investor-ready data visualisations using Tableau, Power BI, Looker Studio or D3.js for product and commercial teams." },
                    { name: "Financial Literacy", desc: "Unit economics & fundraising", narrative: "Understanding CAC/LTV ratios, runway management, investor term sheets and cash flow modelling — critical for anyone building or working in a tech startup.", isHot: true }
                ],
                entrepreneurship: {
                    successMetrics: { value: "3x Growth", source: "Partech Africa", context: "for funded startups" }
                }
            }
        };

// --- STATIC DATA: OCCUPATION DETAILS (Moved from app.js) ---

// 1. Standard Definitions
const standardDefinitions = {
    // Agri
    "Precision Ag Specialist": "Professionals who use geospatial technologies, including GIS, GPS, and remote sensing, to analyze field variability and optimize the application of inputs (seeds, fertilizers) to maximize yield and sustainability.",
    "Drone Pilot": "Specialists who operate Unmanned Aerial Vehicles (UAVs) to conduct aerial surveillance, crop mapping, and multispectral imaging for agricultural monitoring and surveying.",
    "Soil Data Analyst": "Experts who interpret soil sample data and chemical analysis reports to provide nutrient management recommendations and optimize soil health.",
    "Smart Irrigation Tech": "Technicians responsible for installing, calibrating, and maintaining automated irrigation systems and soil moisture sensors to ensure efficient water usage.",
    "Supply Chain Manager": "Professionals who oversee the end-to-end flow of agricultural goods, managing logistics, cold-chain storage, and distribution to minimize post-harvest losses.",
    "Agri-Input Sales": "Sales professionals who advise farmers on seeds, fertilizers, and crop protection products, building relationships and driving sales through technical knowledge and customer service.",
    "Farm IoT Engineer": "Engineers who design, install, and maintain networks of on-farm sensors and devices (IoT) to collect data on soil moisture, weather, and crop health for data-driven decision making.",
    "Post-Harvest Specialist": "Experts who manage the processes after harvesting, including cooling, cleaning, sorting, and packing, to reduce spoilage and maintain the quality of produce for market.",
    "Climate Risk Analyst": "Analysts who use climate data and models to assess the risks of climate change on agricultural production, advising on insurance products and adaptation strategies.",
    "Digital Extension Officer": "Field agents who use digital tools like mobile apps and tablets to deliver agricultural advice, training, and market information to farmers, bridging the digital divide.",
    "Urban Farming Architect": "Designers who plan and build farming systems in urban environments, such as vertical farms and rooftop gardens, using technologies like hydroponics and aquaponics.",
    "Livestock Health Tech": "Technicians who use digital tools, including wearable sensors and data platforms, to monitor animal health, manage vaccination schedules, and improve livestock productivity.",

    // Energy
    "Solar PV Installer": "Technicians who assemble, install, and maintain solar photovoltaic (PV) systems on roofs or other structures in compliance with site assessment and schematics.",
    "Grid Systems Engineer": "Engineers who design and manage electrical power transmission and distribution systems, ensuring grid stability and the integration of renewable energy sources.",
    "Energy Auditor": "Inspectors who conduct energy surveys of buildings or industrial plants to identify energy waste and recommend efficiency improvements or retrofits.",
    "Geothermal Technician": "Technical staff who operate and maintain equipment used for steam extraction and power generation in geothermal plants.",
    "Wind Turbine Tech": "Specialists who inspect, troubleshoot, repair, and maintain wind turbine equipment, including nacelles, blades, and towers.",
    "Energy Policy Analyst": "Analysts who research and develop policies and regulations for the energy sector, focusing on renewable energy adoption, tariff structures, and market design.",
    "Smart Meter Tech": "Technicians who install, maintain, and troubleshoot advanced metering infrastructure (AMI), enabling real-time energy monitoring and billing for utilities and consumers.",
    "Project Manager": "Professionals who plan, execute, and oversee energy or tech projects from conception to completion, managing budgets, timelines, and stakeholder communication.",
    "Safety Inspector": "Specialists who conduct audits and inspections on energy project sites to ensure compliance with occupational health and safety (OHS) standards and prevent accidents.",
    "Bioenergy Specialist": "Experts in converting organic matter, such as agricultural waste, into energy (biogas or biofuels), managing digester operations and output quality.",
    "EV Charging Tech": "Technicians specializing in the installation, maintenance, and repair of electric vehicle (EV) charging stations, including both hardware and network connectivity.",
    "Energy Storage Specialist": "Engineers who design and deploy battery energy storage systems (BESS), managing battery chemistry, thermal management, and grid integration for power stability.",

    // Digital
    "Data Scientist": "Professionals who analyze and interpret complex digital data to assist organizations in decision-making, using statistics, machine learning, and data visualization.",
    "Cloud Architect": "IT experts who design, build, and maintain scalable cloud computing infrastructure and services (AWS, Azure) to support organizational applications.",
    "Cybersecurity Analyst": "Security specialists who monitor computer networks for security breaches, investigate violations, and implement protections against cyber attacks.",
    "Frontend Dev": "Developers who build the visual and interactive elements of websites and applications that users interact with directly, using HTML, CSS, and JavaScript.",
    "Backend Dev": "Engineers who develop the server-side logic, databases, and application programming interfaces (APIs) that power web and mobile applications.",
    "AI/ML Engineer": "Specialists who design and build artificial intelligence models and machine learning algorithms to solve complex problems and automate tasks.",
    "UX/UI Designer": "Designers who create user-friendly and visually appealing interfaces for websites and apps, focusing on user research, wireframing, and interactive prototyping.",
    "Product Manager": "Leaders who define the 'why', 'what', and 'when' of a product, guiding its development from conception to launch by aligning user needs with business goals.",
    "DevOps Engineer": "Engineers who bridge the gap between software development and IT operations, automating the building, testing, and deployment of applications using CI/CD pipelines.",
    "Digital Marketer": "Marketers who use online channels like search engines, social media, and email to promote products or services, analyzing data to optimize campaigns.",
    "Blockchain Developer": "Developers who specialize in building decentralized applications (DApps) and smart contracts on blockchain platforms like Ethereum, focusing on security and consensus algorithms.",
    "Systems Administrator": "IT professionals responsible for the maintenance, configuration, and reliable operation of computer systems, especially multi-user servers.",
    "Android Dev": "Developers who build native mobile applications for Android devices using Kotlin or Java, focusing on mobile-first user experiences and integration with services like M-Pesa and USSD."
};

// 2. Specific Employers Mapping
const roleEmployers = {
    // Agri
    "Precision Ag Specialist": "Commercial Farms, AgTech Firms, Govt Research",
    "Drone Pilot": "Surveying Firms, Large Estates, Security Agencies",
    "Soil Data Analyst": "Research Institutes (KALRO/NARO), Fertilizer Cos",
    "Smart Irrigation Tech": "Irrigation Suppliers, Flower Farms, Greenhouses",
    "Supply Chain Manager": "Export Firms, Logistics Companies, Retailers",
    "Agri-Input Sales": "Agro-vet Chains, Seed Companies, Distributors",
    "Farm IoT Engineer": "Smart Farm Providers, Telecoms, Equipment Vendors",
    "Post-Harvest Specialist": "Food Processors, Cold Storage Providers, NGOs",
    "Climate Risk Analyst": "Insurance Firms, Met Departments, NGOs",
    "Digital Extension Officer": "County Governments, NGOs, Co-operatives",
    "Urban Farming Architect": "Real Estate Developers, Municipalities",
    "Livestock Health Tech": "Dairy Co-ops, Veterinary Services, Ranches",
    "Agricultural Extension Officer": "County Governments, NGOs (One Acre Fund), Co-operatives",

    // Energy
    "Solar PV Installer": "Solar EPC Contractors, Rural Electrification Agencies",
    "Grid Systems Engineer": "National Utilities (KPLC/TANESCO), IPPs",
    "Energy Auditor": "Engineering Consultancies, Manufacturing Plants",
    "Geothermal Technician": "Power Gen Companies (KenGen), Drilling Firms",
    "Wind Turbine Tech": "Wind Farm Operators, Maintenance Contractors",
    
    // Digital
    "Data Scientist": "Banks, Telcos (Safaricom/MTN), Fintechs",
    "Cloud Architect": "Tech Consultancies, Govt IT Authorities",
    "Cybersecurity Analyst": "Financial Institutions, Govt Agencies, Tech Firms",
    "Frontend Dev": "Digital Agencies, Tech Startups, Corporations",
    "Backend Dev": "Product Companies, Banks, Mobile Operators",
    "AI/ML Engineer": "Telcos (Safaricom AI Labs), Fintechs, Microsoft ADC",
    "UX/UI Designer": "FinTechs, Digital Agencies, Large Corporates",
    "Product Manager": "SaaS Companies, Banks, Telcos",
    "DevOps Engineer": "Scale-up Startups, Cloud Providers, Enterprise IT",
    "Digital Marketer": "E-commerce, Media Houses, Marketing Agencies",
    "Blockchain Developer": "Crypto Startups, Financial Institutions, NGOs",
    "Systems Administrator": "ISPs, Universities, Government Ministries",
    "Android Dev": "FinTechs (M-Pesa ecosystem), Telcos, Health Startups, E-commerce"
};

// 3. Specific Skills Mapping
const roleSkills = {
    // --- AGRI SECTOR ---
    "Precision Ag Specialist": {
        technical: ["GIS Mapping", "Precision Ag", "Remote Sensing", "Data Analysis", "Drone Ops"],
        employability: ["Analytical Thinking", "Attention to Detail", "Problem Solving", "Tech Savviness", "Written Communication"]
    },
    "Drone Pilot": {
        technical: ["Drone Ops", "Flight Planning", "Remote Sensing", "Air Law", "Field Ops"],
        employability: ["Situational Awareness", "Safety Consciousness", "Reporting Accuracy", "Adaptability", "Focus/Concentration"]
    },
    "Soil Data Analyst": {
        technical: ["Soil Analysis", "Python", "Data Analysis", "Crop Science", "Data Viz"],
        employability: ["Critical Thinking", "Data Storytelling", "Time Management", "Ethics (Integrity)", "Scientific Curiosity"]
    },
    "Smart Irrigation Tech": {
        technical: ["Water Management", "IoT Sensors", "Precision Ag", "Field Ops", "Installation"],
        employability: ["Troubleshooting", "Adaptability", "Client Communication", "Physical Stamina", "Safety Awareness"]
    },
    "Supply Chain Manager": {
        technical: ["Logistics", "Supply Chain", "Inventory Mgmt", "Agribusiness", "Digital Tools"],
        employability: ["Negotiation", "Leadership", "Crisis Management", "Strategic Planning", "Team Coordination"]
    },
    "Agri-Input Sales": {
        technical: ["Crop Science", "Digital Tools", "Agribusiness", "Communication", "Economics"],
        employability: ["Persuasion", "Empathy", "Resilience", "Active Listening", "Networking"]
    },
    "Farm IoT Engineer": {
        technical: ["IoT Sensors", "Networking", "Field Ops", "Electronics Repair", "Cloud Computing"],
        employability: ["Systems Thinking", "Innovation", "Persistence", "Continuous Learning", "Collaboration"]
    },
    "Post-Harvest Specialist": {
        technical: ["Inventory Mgmt", "Food Security", "Logistics", "Manufacturing", "Supply Chain"],
        employability: ["Process Oriented", "Hygiene Awareness", "Attention to Detail", "Efficiency", "Problem Solving"]
    },
    "Climate Risk Analyst": {
        technical: ["Climate Modeling", "Python", "Climate Adaptation", "GIS Mapping", "Data Analysis"],
        employability: ["Analytical Reasoning", "Forecasting", "Technical Communication", "Strategic View", "Research Skills"]
    },
    "Digital Extension Officer": {
        technical: ["Digital Advisory", "Communication", "Crop Science", "Data Collection", "Digital Tools"],
        employability: ["Cultural Awareness", "Patience", "Public Speaking", "Coaching", "Empathy"]
    },
    "Urban Farming Architect": {
        technical: ["Water Management", "AutoCAD", "Installation", "Green Tech", "Sustainability"],
        employability: ["Creativity", "Design Thinking", "Sustainability Focus", "Planning", "Visualization"]
    },
    "Livestock Health Tech": {
        technical: ["Farm Management", "IoT Sensors", "Record Keeping", "Data Collection", "Food Security"],
        employability: ["Compassion", "Observation", "Quick Response", "Physical Handling", "Record Keeping"]
    },
    "Agricultural Extension Officer": {
        technical: ["Crop Science", "Soil Analysis", "Data Collection", "Communication", "Digital Advisory"],
        employability: ["Community Mobilization", "Public Speaking", "Active Listening", "Adaptability", "Problem Solving"]
    },
    "Farm Services Operator": {
        technical: ["Mechanization", "Drone Ops", "Precision Ag", "Field Ops", "Safety Protocols"],
        employability: ["Time Management", "Customer Service", "Reliability", "Physical Stamina", "Basic Numeracy"]
    },
    "Irrigation Technician": {
        technical: ["Water Management", "Installation", "IoT Sensors", "Field Ops", "Precision Ag"],
        employability: ["Troubleshooting", "Attention to Detail", "Physical Stamina", "Teamwork", "Adaptability"]
    },
    "Agro-Processing Technician": {
        technical: ["Food Security", "Manufacturing", "Quality Control", "Supply Chain", "Safety Protocols"],
        employability: ["Process Discipline", "Cleanliness", "Team Collaboration", "Attention to Detail", "Safety Awareness"]
    },
    "Aquaculture Farm Technician": {
        technical: ["Water Management", "Farm Management", "Record Keeping", "Sustainability", "Food Security"],
        employability: ["Observation", "Consistency", "Physical Fitness", "Problem Solving", "Patience"]
    },
    "Fisheries Compliance Officer": {
        technical: ["Regulatory Compl.", "Audit", "Data Collection", "Communication", "Record Keeping"],
        employability: ["Integrity", "Communication", "Firmness", "Observation", "Report Writing"]
    },

    // --- ENERGY SECTOR ---
    "Solar PV Installer": {
        technical: ["Electrical Wiring", "Solar PV", "Installation", "Safety Protocols", "Field Ops"],
        employability: ["Physical Stamina", "Teamwork", "Safety Compliance", "Reliability", "Attention to Detail"]
    },
    "Grid Systems Engineer": {
        technical: ["Grid Mgmt", "SCADA", "Regulatory Compl.", "Safety Protocols", "Grid Systems"],
        employability: ["Complex Problem Solving", "Project Management", "Accuracy", "Stress Management", "Analytical Thinking"]
    },
    "Energy Auditor": {
        technical: ["Energy Efficiency", "Audit", "Thermodynamics", "Data Analysis", "Economics"],
        employability: ["Client Advisory", "Observational Skills", "Mathematical Aptitude", "Communication", "Integrity"]
    },
    "Geothermal Technician": {
        technical: ["Thermodynamics", "Field Ops", "Mechanical Repair", "Safety Protocols", "Installation"],
        employability: ["Operational Discipline", "Safety Focus", "Technical Reporting", "Physical Aptitude", "Alertness"]
    },
    "Wind Turbine Tech": {
        technical: ["Wind Power", "Field Ops", "Safety Protocols", "Electrical Wiring", "SCADA"],
        employability: ["Risk Assessment", "Resilience", "Team Coordination", "Physical Fitness", "Calmness Under Pressure"]
    },
    "Energy Policy Analyst": {
        technical: ["Regulatory Compl.", "Economics", "Policy", "Communication", "Data Analysis"],
        employability: ["Critical Analysis", "Persuasion", "Written Communication", "Political Awareness", "Ethics"]
    },
    "Smart Meter Tech": {
        technical: ["Grid Systems", "Networking", "Installation", "Data Analysis", "Communication"],
        employability: ["Troubleshooting", "Integrity", "Driving/Mobility", "Tech Literacy", "Patience"]
    },
    "Project Manager": {
        technical: ["Project Mgmt", "Economics", "Supply Chain", "Risk Management", "Communication"],
        employability: ["Leadership", "Organization", "Negotiation", "Conflict Resolution", "Delegation"]
    },
    "Safety Inspector": {
        technical: ["Safety Protocols", "Compliance", "Audit", "Hazard Identification", "Communication"],
        employability: ["Firmness", "Attention to Detail", "Communication", "Integrity", "Observational Skills"]
    },
    "Bioenergy Specialist": {
        technical: ["Biomass", "Sustainability", "Safety Protocols", "Data Analysis", "Green Tech"],
        employability: ["Innovation", "Sustainability Mindset", "Process Safety", "Analytical Skills", "Hands-on Approach"]
    },
    "EV Charging Tech": {
        technical: ["Electrical Wiring", "Networking", "Field Ops", "Grid Systems", "Digital Tools"],
        employability: ["Tech Savvy", "Customer Service", "Safety Awareness", "Problem Solving", "Adaptability"]
    },
    "Energy Storage Specialist": {
        technical: ["Solar PV", "Grid Systems", "Project Mgmt", "Thermodynamics", "Green Tech"],
        employability: ["Forward Thinking", "Analysis", "Safety Consciousness", "Precision", "Continuous Learning"]
    },

    // --- DIGITAL SECTOR ---
    "Data Scientist": {
        technical: ["Python", "Machine Learning", "SQL", "Data Science", "Data Viz"],
        employability: ["Business Acumen", "Curiosity", "Data Storytelling", "Skepticism", "Collaboration"]
    },
    "Cloud Architect": {
        technical: ["Cloud Architecture", "Network Security", "DevOps", "Cloud Computing", "Strategy"],
        employability: ["Strategic Planning", "Decision Making", "Stakeholder Management", "Mentoring", "Visionary Thinking"]
    },
    "Cybersecurity Analyst": {
        technical: ["Threat Intelligence", "Network Security", "Cybersecurity", "Compliance", "Network Security"],
        employability: ["Integrity", "Vigilance", "Stress Management", "Investigative Mindset", "Confidentiality"]
    },
    "Frontend Dev": {
        technical: ["React", "JavaScript", "CSS", "Figma", "Web Dev"],
        employability: ["Creativity", "User Empathy", "Collaboration", "Attention to Detail", "Patience"]
    },
    "Backend Dev": {
        technical: ["Python", "API Design", "Microservices", "Database Mgmt", "Cloud Computing"],
        employability: ["Logic", "Efficiency", "Continuous Learning", "Systems Thinking", "Reliability"]
    },
    "UX/UI Designer": {
        technical: ["Figma", "Prototyping", "User Research", "UI Design", "Product Design"],
        employability: ["Empathy", "Visual Eye", "Communication", "Receptiveness to Feedback", "Innovation"]
    },
    "AI/ML Engineer": {
        technical: ["Deep Learning", "Machine Learning", "AI", "Data Science", "DevOps"],
        employability: ["Innovation", "Ethics", "Problem Decomposition", "Mathematical Aptitude", "Abstraction"]
    },
    "Product Manager": {
        technical: ["Product Management", "Agile", "Strategy", "User Research", "Data Analysis"],
        employability: ["Empathy", "Prioritization", "Leadership", "Communication", "Strategic Thinking"]
    },
    "DevOps Engineer": {
        technical: ["CI/CD", "Cloud Computing", "DevOps", "Automation", "Python"],
        employability: ["Automation Mindset", "Reliability", "Crisis Response", "Collaboration", "Efficiency"]
    },
    "Digital Marketer": {
        technical: ["SEO", "Digital Marketing", "Social Media", "Data Analysis", "Digital Tools"],
        employability: ["Creativity", "Data Analysis", "Adaptability", "Persuasion", "Trend Awareness"]
    },
    "Blockchain Developer": {
        technical: ["Web Dev", "Cybersecurity", "JavaScript", "Data Science", "Python"],
        employability: ["Logic", "Security First Mindset", "Innovation", "Mathematical Aptitude", "Attention to Detail"]
    },
    "Systems Administrator": {
        technical: ["DevOps", "Networking", "Network Security", "Database Mgmt", "Cloud Computing"],
        employability: ["Troubleshooting", "Patience", "Service Orientation", "Reliability", "Organization"]
    },
    "Android Dev": {
        technical: ["Kotlin", "Android SDK", "API Integration", "Firebase", "Git"],
        employability: ["User Empathy", "Attention to Detail", "Continuous Learning", "Collaboration", "Problem Solving"]
    }
};

// 4. Role-Specific "Typical Day" Content
const roleDayBreakdown = {
    // --- AGRI ---
    "Precision Ag Specialist": { theme: 'sky', entry: "Collecting soil/leaf samples, calibrating GPS on tractors, and flying drones for basic field mapping under supervision.", mid: "Analyzing satellite/drone imagery to create variable rate prescription maps for fertilizer application and presenting findings to farm managers.", senior: "Developing the farm's overall precision ag strategy, evaluating new technologies (e.g., AI-powered weed recognition), and managing the data analytics team." },
    "Drone Pilot": { theme: 'sky', entry: "Performing pre-flight checks, executing pre-planned flight paths for aerial mapping, and logging flight data.", mid: "Planning complex flight missions (e.g., multispectral imaging), processing raw imagery into usable data layers (e.g., NDVI), and performing minor drone maintenance.", senior: "Managing a fleet of UAVs, ensuring regulatory compliance (e.g., KCAA), training junior pilots, and integrating drone data with other farm management systems." },
    "Soil Data Analyst": { theme: 'sky', entry: "Organizing and cleaning soil lab result spreadsheets, creating basic charts of nutrient levels, and assisting with report preparation.", mid: "Using statistical software (R/Python) to analyze soil data trends across regions, correlating them with yield data, and writing nutrient management recommendations.", senior: "Building predictive soil health models, advising on regional soil policy, and developing new data products for fertilizer companies or government agencies." },
    "Smart Irrigation Tech": { theme: 'sky', entry: "Installing soil moisture probes and weather stations, laying pipes and drip lines, and assisting with basic system troubleshooting.", mid: "Calibrating irrigation controllers, diagnosing sensor or valve failures, and training farm staff on system operation and basic maintenance.", senior: "Designing end-to-end smart irrigation systems for large commercial farms, managing water use budgets, and integrating the system with crop growth models." },
    "Supply Chain Manager": { theme: 'sky', entry: "Tracking shipments, coordinating with transporters, and ensuring cold chain temperature logs are correctly maintained.", mid: "Optimizing transport routes, managing warehouse inventory using ERP software, and negotiating contracts with logistics providers.", senior: "Designing the entire supply chain strategy, managing international export compliance and documentation, and implementing risk mitigation plans (e.g., for port delays)." },
    "Agri-Input Sales": { theme: 'sky', entry: "Visiting small-scale farmers to demonstrate products, taking orders, and providing basic agronomic advice.", mid: "Managing a sales territory, developing relationships with co-operatives and large farms, and conducting farmer training days.", senior: "Developing regional sales strategies, managing key accounts (e.g., large distributors), and providing market feedback to the product development team." },
    "Farm IoT Engineer": { theme: 'sky', entry: "Assembling and testing IoT devices, installing gateways and sensors in the field, and monitoring network connectivity dashboards.", mid: "Troubleshooting hardware and network issues, writing scripts to process sensor data, and integrating data streams into a cloud platform (e.g., AWS IoT).", senior: "Architecting the entire on-farm IoT network, selecting hardware vendors, ensuring data security, and developing custom analytics from the collected data." },
    "Post-Harvest Specialist": { theme: 'sky', entry: "Monitoring sorting and grading lines, ensuring hygiene protocols are followed, and conducting basic quality checks (e.g., size, color).", mid: "Implementing food safety standards (e.g., HACCP), managing cold storage conditions, and training workers on quality control procedures.", senior: "Designing post-harvest handling systems to reduce spoilage, auditing facilities for compliance, and researching new preservation or packaging technologies." },
    "Climate Risk Analyst": { theme: 'sky', entry: "Gathering historical weather data, running pre-built climate models, and creating charts for internal reports.", mid: "Using Python/R to analyze climate data, assessing the probability of events like drought or floods, and contributing to risk reports for insurance products.", senior: "Developing custom climate models for specific regions, advising financial institutions on climate-related investment risks, and engaging with policymakers." },
    "Digital Extension Officer": { theme: 'sky', entry: "Registering farmers onto a digital platform, providing basic app support via phone, and collecting field data using a tablet.", mid: "Creating and disseminating digital advisory content (SMS, voice messages), analyzing user engagement data, and training lead farmers on new digital tools.", senior: "Designing the digital extension strategy for a region, managing partnerships with NGOs or government, and evaluating the impact of digital advisory on farmer incomes." },
    "Agricultural Extension Officer": { theme: 'sky', entry: "Conducting farm visits, registering farmers on digital platforms, and distributing educational flyers.", mid: "Organizing field days, training lead farmers, and collecting data on crop yields using mobile tools.", senior: "Managing a team of extension officers, designing curriculum for farmer training, and liaising with research institutions." },
    "Farm Services Operator": { theme: 'sky', entry: "Operating basic machinery (e.g., threshers) and assisting with drone spraying setups under supervision.", mid: "Independently managing spraying missions, maintaining equipment, and coordinating service schedules with farmer groups.", senior: "Managing a fleet of machinery and operators, negotiating service contracts with cooperatives, and analyzing operational efficiency." },
    "Irrigation Technician": { theme: 'sky', entry: "Laying drip lines, checking for leaks, and cleaning filters under the guidance of a senior technician.", mid: "Installing solar pumps, calibrating automated controllers, and troubleshooting hydraulic pressure issues.", senior: "Designing irrigation layouts for large farms, managing water use budgets, and training junior installation teams." },
    "Agro-Processing Technician": { theme: 'sky', entry: "Operating sorting or drying machinery, maintaining hygiene logs, and packaging finished products.", mid: "Supervising a production line, conducting quality assurance tests, and performing routine machine maintenance.", senior: "Managing facility operations, ensuring HACCP compliance, and optimizing production workflows for efficiency." },
    "Aquaculture Farm Technician": { theme: 'sky', entry: "Feeding fish, cleaning ponds/cages, and recording water quality metrics (pH, oxygen).", mid: "Managing breeding cycles, diagnosing fish health issues, and supervising harvest logistics.", senior: "Overseeing hatchery operations, designing farm expansion plans, and managing production data for investors." },
    "Fisheries Compliance Officer": { theme: 'sky', entry: "Conducting beach patrols, checking licenses, and recording catch data at landing sites.", mid: "Leading inspection teams, investigating illegal fishing reports, and preparing prosecution case files.", senior: "Developing regional compliance strategies, liaising with maritime police, and analyzing catch data trends for policy." },

    // --- ENERGY ---
    "Solar PV Installer": { theme: 'amber', entry: "Carrying panels, mounting racking systems on roofs, and running cables under the supervision of a lead installer.", mid: "Wiring DC components, connecting inverters and batteries, and commissioning small residential systems according to electrical diagrams.", senior: "Leading an installation crew, conducting site surveys and system design for commercial projects, and ensuring compliance with safety and electrical codes." },
    "Grid Systems Engineer": { theme: 'amber', entry: "Monitoring grid performance on SCADA screens, logging system events, and assisting with basic power flow calculations.", mid: "Running grid simulation models (e.g., PSS/E) to analyze the impact of new generators, and designing substation protection schemes.", senior: "Planning national grid expansion, developing grid codes for renewable energy integration, and managing the stability of the entire transmission system." },
    "Energy Auditor": { theme: 'amber', entry: "Collecting utility bills, conducting walk-throughs of facilities to spot energy waste, and taking measurements with light meters or thermal cameras.", mid: "Analyzing energy consumption data, calculating potential savings from retrofits (e.g., LED lighting, new motors), and writing detailed audit reports.", senior: "Managing complex industrial audits, developing corporate energy management strategies (ISO 50001), and providing expert testimony on energy savings." },
    "Geothermal Technician": { theme: 'amber', entry: "Taking readings from gauges on wellheads and steam pipes, performing routine maintenance on pumps and valves, and assisting with safety checks.", mid: "Operating control room systems to manage steam flow, troubleshooting mechanical or electrical faults in plant equipment, and analyzing plant efficiency data.", senior: "Supervising plant operations during a shift, planning major turbine or generator overhauls, and optimizing the entire steam-to-power generation process." },
    "Wind Turbine Tech": { theme: 'amber', entry: "Performing routine inspections and lubrication of turbine components, assisting with blade cleaning, and ensuring safety equipment is in order.", mid: "Troubleshooting and repairing electrical or hydraulic faults within the nacelle, performing composite repairs on blades, and analyzing turbine performance data.", senior: "Managing the operations and maintenance (O&M) for a section of a wind farm, planning preventative maintenance schedules, and ensuring high turbine availability." },
    "Energy Policy Analyst": { theme: 'amber', entry: "Researching energy policies from other countries, summarizing regulatory documents, and preparing briefing notes for senior staff.", mid: "Modeling the financial impact of different tariff structures, writing draft policy papers, and consulting with stakeholders (utilities, consumer groups).", senior: "Leading the development of national energy policy, advising government ministers, and representing the country in international energy forums." },
    "Smart Meter Tech": { theme: 'amber', entry: "Replacing old analog meters with new smart meters at customer premises and verifying basic network connectivity.", mid: "Troubleshooting communication issues between meters and the central system, performing remote meter diagnostics, and training customers on new features.", senior: "Managing the deployment plan for a large-scale meter rollout, overseeing the AMI network infrastructure, and analyzing meter data for fraud or outage detection." },
    "Project Manager": { theme: 'amber', entry: "Tracking project tasks and deadlines, organizing team meetings and taking minutes, and preparing simple status reports.", mid: "Managing the budget and schedule for a small-to-medium sized project, coordinating with contractors and suppliers, and managing project risks.", senior: "Overseeing a large, complex energy project (e.g., building a power plant), managing all stakeholder relationships, and being accountable for the project's success." },
    "Safety Inspector": { theme: 'amber', entry: "Conducting daily site walk-throughs to check for hazards, ensuring workers are using correct PPE, and delivering toolbox safety talks.", mid: "Investigating minor incidents, conducting formal site safety audits, and delivering safety training to workers and contractors.", senior: "Developing and implementing the entire Health, Safety, and Environment (HSE) management system for a company, managing regulatory compliance, and leading major incident investigations." },
    "Bioenergy Specialist": { theme: 'amber', entry: "Collecting feedstock samples for analysis, monitoring digester temperature and pH levels, and performing routine equipment checks.", mid: "Adjusting feedstock recipes to optimize gas production, troubleshooting operational issues with the digester, and managing the offtake of biogas or digestate.", senior: "Designing new biogas plants, developing business models for waste-to-energy projects, and ensuring compliance with environmental regulations." },

    // --- DIGITAL ---
    "Data Scientist": { theme: 'indigo', entry: "Cleaning and preparing datasets, performing exploratory data analysis to find trends, and building simple predictive models using libraries like scikit-learn.", mid: "Developing and tuning complex machine learning models, deploying models as APIs, and presenting data-driven insights to business stakeholders.", senior: "Defining the AI/ML strategy for the company, leading a team of data scientists, and researching novel algorithms to solve complex business problems." },
    "Cloud Architect": { theme: 'indigo', entry: "Assisting with the setup of cloud resources (e.g., virtual machines, storage buckets) using predefined templates.", mid: "Designing and deploying scalable and secure cloud infrastructure for applications, managing cloud costs, and implementing infrastructure-as-code (e.g., Terraform).", senior: "Leading an organization's cloud strategy, designing multi-cloud or hybrid-cloud architectures, and ensuring governance, security, and compliance across all cloud services." },
    "Cybersecurity Analyst": { theme: 'indigo', entry: "Monitoring security alerts from tools like SIEM, investigating low-level incidents, and assisting with vulnerability scans.", mid: "Actively hunting for threats in the network, responding to security incidents, configuring security tools (e.g., firewalls), and conducting phishing simulations.", senior: "Developing the organization's security strategy, leading incident response for major breaches, performing penetration testing, and advising leadership on cyber risk." },
    "Frontend Dev": { theme: 'indigo', entry: "Translating design mockups (e.g., from Figma) into HTML and CSS, and writing basic JavaScript for user interactions.", mid: "Building complex, interactive user interfaces using a framework like React or Vue, managing application state, and integrating with backend APIs.", senior: "Architecting the entire frontend of a large application, creating reusable component libraries, optimizing for performance and accessibility, and mentoring junior developers." },
    "Backend Dev": { theme: 'indigo', entry: "Writing simple API endpoints, fixing bugs in existing code, and writing database queries to fetch data.", mid: "Designing and building robust and scalable APIs, designing database schemas, implementing authentication and authorization, and writing automated tests.", senior: "Architecting the entire server-side of an application, choosing the right database technologies, ensuring high performance and reliability, and managing system security." },
    "AI/ML Engineer": { theme: 'indigo', entry: "Annotating data for model training, running training scripts for existing models, and evaluating model performance on test sets.", mid: "Implementing and training deep learning models (e.g., using PyTorch/TensorFlow), optimizing models for performance, and deploying them into production environments (MLOps).", senior: "Designing novel neural network architectures, leading research and development of new AI capabilities, and building the infrastructure for large-scale model training and deployment." },
    "UX/UI Designer": { theme: 'indigo', entry: "Creating simple wireframes, making small visual updates to existing designs, and creating assets like icons and images.", mid: "Conducting user research (interviews, surveys), creating high-fidelity interactive prototypes in Figma, and developing a consistent design system.", senior: "Leading the overall user experience strategy for a product, mentoring other designers, and using data to inform and validate design decisions." },
    "Product Manager": { theme: 'indigo', entry: "Writing detailed user stories for the development team, organizing user feedback, and conducting competitor analysis.", mid: "Managing the product backlog, prioritizing features for upcoming sprints, and defining and analyzing product metrics to measure success.", senior: "Defining the long-term product vision and strategy, creating and managing the product roadmap, and being accountable for the product's commercial success." },
    "DevOps Engineer": { theme: 'indigo', entry: "Running manual deployment scripts, monitoring application health dashboards, and managing user access in development tools.", mid: "Building and maintaining CI/CD pipelines to automate testing and deployment, managing infrastructure with code (IaC), and implementing containerization with Docker.", senior: "Architecting scalable and resilient infrastructure on the cloud, managing container orchestration with Kubernetes, and implementing advanced monitoring and observability." },
    "Digital Marketer": { theme: 'indigo', entry: "Scheduling social media posts, building simple email newsletters, and pulling basic reports from Google Analytics.", mid: "Managing paid ad campaigns (Google/Social Media), performing SEO keyword research and on-page optimization, and setting up A/B tests to improve conversion rates.", senior: "Developing the overall digital marketing strategy, managing a multi-channel budget, and building marketing automation workflows to nurture leads." },
    "Android Dev": { theme: 'indigo', entry: "Building simple UI screens in Android Studio, fixing layout bugs, and implementing basic API calls under a senior developer's guidance.", mid: "Developing full features (authentication flows, M-Pesa payment integrations, push notifications), optimizing app performance, and writing unit tests.", senior: "Architecting modular Android apps, leading code reviews, setting up CI/CD for the Play Store, and mentoring junior developers." },

    // --- AGRI (additional) ---
    "Urban Farming Architect": { theme: 'sky', entry: "Setting up basic hydroponic units, monitoring nutrient solution levels, and maintaining grow-lighting schedules under a senior architect's guidance.", mid: "Designing vertical farming layouts for commercial clients, sourcing automated irrigation systems, and analysing crop yield data to optimise growing cycles.", senior: "Leading urban agriculture projects for municipal and real-estate developers, advising on city food-security policy, and integrating smart sensors across multiple production sites." },
    "Livestock Health Tech": { theme: 'sky', entry: "Assisting with routine vaccinations, recording health observations on mobile apps, and helping with basic feed distribution and herd checks.", mid: "Using smart collar and sensor data to monitor herd health remotely, diagnosing common diseases, and coordinating treatment plans with supervising veterinarians.", senior: "Managing herd health programmes across large commercial farms, implementing IoT monitoring systems at scale, and training and mentoring junior health technicians." },

    // --- ENERGY (additional) ---
    "EV Charging Tech": { theme: 'amber', entry: "Installing residential EV charging units, routing cable to consumer units, and testing basic connectivity and earth-fault protection under supervision.", mid: "Commissioning commercial charging hubs, diagnosing network communication faults between chargers and back-office systems, and configuring load-management software.", senior: "Designing multi-point charging infrastructure for logistics fleets and commercial premises, managing charge-point operator relationships, and ensuring compliance with evolving EV installation standards." },
    "Energy Storage Specialist": { theme: 'amber', entry: "Monitoring battery management systems (BMS), logging daily state-of-charge and cycle data, and assisting with battery cell inspection and replacement under supervision.", mid: "Commissioning BESS installations, programming charge/discharge schedules to optimise grid tariffs and self-consumption, and conducting performance-degradation analysis.", senior: "Designing large-scale battery storage systems, selecting cell chemistry and topology for specific grid or off-grid applications, and managing integration with renewable generation and grid stability services." },

    // --- DIGITAL (additional) ---
    "Blockchain Developer": { theme: 'indigo', entry: "Writing and testing basic smart contracts on a local testnet, reading existing contract code, and documenting function inputs, outputs, and security assumptions.", mid: "Deploying production smart contracts (ERC-20/ERC-721), building DApp front-ends with Web3.js or Ethers.js, and auditing contracts for common vulnerabilities (re-entrancy, overflow).", senior: "Architecting multi-contract protocols and token economies, leading security audits of production-grade systems, and advising on chain selection and cross-chain bridging strategies." },
    "Systems Administrator": { theme: 'indigo', entry: "Managing user accounts and access rights, monitoring server health dashboards, and responding to first-line helpdesk tickets under senior guidance.", mid: "Maintaining Linux/Windows server infrastructure, configuring automated backups and disaster-recovery runbooks, and implementing monitoring with tools like Nagios or Grafana.", senior: "Architecting the organisation's IT infrastructure, leading migrations to cloud or hybrid environments, and owning the disaster-recovery and business-continuity strategy." }
};

// 5. Tools & Technologies
const roleToolsMap = {
    // --- AGRI ---
    "Precision Ag Specialist": ["GPS/GNSS Receivers", "GIS Software (QGIS/ArcGIS)", "Drones (e.g., DJI Mavic)", "Soil Moisture Sensors", "Farm Management Software"],
    "Drone Pilot": ["UAV Platform (Fixed-wing/Rotary)", "Flight Planning Software (Pix4D)", "Radio Controller", "Safety Gear (Vest/Helmet)", "Logbooks"],
    "Soil Data Analyst": ["Spectrometers", "LIMS (Lab Info Systems)", "Soil Augers", "R / Python", "pH Meters"],
    "Smart Irrigation Tech": ["Soil Moisture Probes", "Irrigation Controllers", "Flow Meters", "Pipe Cutters", "Multimeters"],
    "Supply Chain Manager": ["ERP Systems (SAP/Oracle)", "Fleet Management Software", "Cold Chain Sensors", "Barcode Scanners", "Excel"],
    "Agri-Input Sales": ["CRM Software (Salesforce)", "Mobile POS", "Crop Catalogues", "Tablet/Smartphone", "WhatsApp Business"],
    "Farm IoT Engineer": ["LoRaWAN Gateways", "Soldering Iron", "Raspberry Pi/Arduino", "Network Analyzers", "Cloud Dashboards"],
    "Post-Harvest Specialist": ["Hygrometers", "Thermometers", "Grading Machines", "Cold Storage Controllers", "Quality Testing Kits"],
    "Climate Risk Analyst": ["Climate Models (GCMs)", "GIS (ArcGIS)", "Python/R", "Satellite Data (Sentinel)", "Risk Modelling Software"],
    "Digital Extension Officer": ["ODK (Open Data Kit)", "Tablets", "SMS Platforms", "Farm Management Apps", "GPS Units"],
    "Urban Farming Architect": ["SketchUp / AutoCAD", "Hydroponic Controllers", "LED Grow Lights", "pH/EC Meters", "Vertical Farming Systems"],
    "Livestock Health Tech": ["Ultrasound Scanners", "Smart Collars/Tags", "Vaccination Guns", "Herd Management Software", "Mobile Apps"],
    "Agricultural Extension Officer": ["ODK/KoboCollect", "Motorbike", "Soil pH Meter", "Tablet/Smartphone", "Visual Aids (Flipcharts)"],
    "Farm Services Operator": ["Tractors", "Spray Drones", "Knapsack Sprayers", "GPS Units", "PPE"],
    "Irrigation Technician": ["Pipe Wrenches", "Glue/Solvent", "Trenching Tools", "Pressure Gauges", "Multimeters"],
    "Agro-Processing Technician": ["Sorting Machines", "Drying Racks", "Moisture Meters", "Sealing Machines", "Weighing Scales"],
    "Aquaculture Farm Technician": ["Water Quality Kits (pH/DO)", "Nets", "Feeding Hoppers", "Aerators", "Record Books"],
    "Fisheries Compliance Officer": ["GPS Trackers", "Patrol Boat", "Measuring Boards", "Camera/Tablet", "Radio"],

    // --- ENERGY ---
    "Solar PV Installer": ["Digital Multimeter", "Clamp Meter", "Wire Strippers/Crimpers", "Irradiance Meter", "Fall Arrest System (PPE)"],
    "Grid Systems Engineer": ["SCADA Systems", "Power Flow Software (PSS/E)", "High Voltage Testers", "CAD Software", "Protective Relays"],
    "Energy Auditor": ["Thermal Cameras (FLIR)", "Power Loggers", "Blower Doors", "Light Meters (Lux)", "Combustion Analyzers"],
    "Geothermal Technician": ["Pressure Gauges", "Steam Flow Meters", "Vibration Analyzers", "Thermocouples", "SCADA Terminals"],
    "Wind Turbine Tech": ["Hydraulic Torque Wrenches", "Laser Alignment Tools", "Fall Arrest Gear", "Multimeters", "SCADA"],
    "Energy Policy Analyst": ["LEAP Software", "Excel (Advanced)", "Regulatory Databases", "Economic Modeling Tools", "Policy Briefs"],
    "Smart Meter Tech": ["Optical Probes", "Handheld Terminals", "Laptop/Tablet", "Wire Strippers", "Network Testers"],
    "Project Manager": ["MS Project / Primavera", "Gantt Charts", "Budgeting Software", "Collaboration Tools", "Excel"],
    "Safety Inspector": ["Noise Dosimeters", "Gas Detectors", "Inspection Checklists", "PPE", "Accident Reporting Software"],
    "Bioenergy Specialist": ["Gas Analyzers", "pH Meters", "Flow Meters", "Lab Glassware", "Digester Control Systems"],
    "EV Charging Tech": ["EVSE Testers", "Oscilloscopes", "Network Diagnostic Tools", "Insulated Tools", "Torque Drivers"],
    "Energy Storage Specialist": ["Battery Mgmt Systems (BMS)", "Thermal Sensors", "Power Quality Analyzers", "Simulation Software (HOMER)", "Multimeters"],

    // --- DIGITAL ---
    "Data Scientist": ["Jupyter Notebooks", "Python/R Environments", "SQL Clients", "Cloud Consoles (AWS/Azure)", "Tableau/PowerBI"],
    "Cloud Architect": ["AWS/Azure Console", "Terraform / Ansible", "Docker / Kubernetes", "Visio / Lucidchart", "Cost Mgmt Tools"],
    "Cybersecurity Analyst": ["Wireshark", "Metasploit", "SIEM Tools (Splunk)", "Firewalls", "Nessus"],
    "Frontend Dev": ["VS Code", "Git/GitHub", "Browser DevTools", "Figma (View Mode)", "Package Managers (npm)"],
    "Backend Dev": ["Postman", "Docker", "Database Clients (DBeaver)", "IDE (VS Code)", "Git"],
    "AI/ML Engineer": ["Amazon SageMaker", "Amazon Bedrock", "TensorFlow / PyTorch", "Hugging Face", "MLOps (MLflow)"],
    "UX/UI Designer": ["Figma", "Adobe XD", "Miro", "UserTesting.com", "Sketch"],
    "Product Manager": ["Jira / Linear", "Notion", "Amplitude / Mixpanel", "Figma (View)", "Slack"],
    "DevOps Engineer": ["Jenkins / GitLab", "Docker", "Kubernetes", "Prometheus / Grafana", "AWS/Azure CLI"],
    "Digital Marketer": ["Google Analytics 4", "Google Ads", "Meta Business Suite", "Canva", "Mailchimp / HubSpot"],
    "Blockchain Developer": ["Remix IDE", "Truffle / Hardhat", "Metamask", "Solidity", "Geth"],
    "Systems Administrator": ["PowerShell / Bash", "Active Directory", "VMware / Hyper-V", "Monitoring Tools (Nagios)", "Backup Software"],
    "Android Dev": ["Android Studio", "Kotlin / Java", "Firebase Console", "ADB / Emulator", "Git/GitHub"]
};

// 6. Read More Resources
const roleResourcesMap = {
    // --- AGRI ---
    "Precision Ag Specialist": [
        { title: "CTA: Digitalisation of African Agriculture", url: "https://www.cgiar.org/" },
        { title: "Hello Tractor: IoT Fleet Mgmt", url: "https://hellotractor.com/" },
        { title: "Precision Agriculture for Development (PAD)", url: "https://precisiondev.org/" },
        { title: "FAO: E-Agriculture Strategy Guide", url: "https://www.fao.org/e-agriculture/" }
    ],
    "Drone Pilot": [
        { title: "AU-NEPAD: Drones for Agriculture", url: "https://www.nepad.org" },
        { title: "KCAA: UAS Regulatory Framework", url: "https://www.kcaa.or.ke" },
        { title: "WeRobotics: Flying Labs Network", url: "https://werobotics.org/" },
        { title: "African Drone Forum", url: "https://www.africandroneforum.org/" }
    ],
    "Soil Data Analyst": [
        { title: "FAO: Global Soil Partnership", url: "https://www.fao.org/global-soil-partnership" },
        { title: "ISRIC: SoilGrids Africa", url: "https://www.isric.org" },
        { title: "AfSIS: Africa Soil Information Service", url: "https://www.isric.org/explore/afsis" },
        { title: "SoilCares: Digital Soil Testing", url: "https://soilcares.com/" }
    ],
    "Smart Irrigation Tech": [
        { title: "World Bank: Water in Agriculture", url: "https://www.worldbank.org/en/topic/water-in-agriculture" },
        { title: "FAO: Solar-powered Irrigation", url: "https://www.fao.org" },
        { title: "SunCulture: Solar Irrigation", url: "https://sunculture.io/" },
        { title: "KickStart International", url: "https://kickstart.org/" }
    ],
    "Supply Chain Manager": [
        { title: "AGRA: Africa Agriculture Status Report", url: "https://agra.org" },
        { title: "FAO: Food Loss Index", url: "https://www.fao.org/platform-food-loss-waste" },
        { title: "TradeMark East Africa", url: "https://www.trademarkea.com/" },
        { title: "Twiga Foods: Supply Chain Tech", url: "https://twiga.com" }
    ],
    "Agri-Input Sales": [
        { title: "Apollo Agriculture: Agent Model", url: "https://apolloagriculture.com/" },
        { title: "Safaricom DigiFarm", url: "https://www.safaricom.co.ke/annualreport_2022/digifarm/" },
        { title: "CropLife Africa Middle East", url: "https://croplifeafrica.org/" },
        { title: "Agro-Dealer Development (AFAP)", url: "https://www.afap-partnership.org/" }
    ],
    "Farm IoT Engineer": [
        { title: "GSMA: AgriTech Programme", url: "https://www.gsma.com/mobilefordevelopment/agritech/" },
        { title: "World Bank: IoT in Agriculture", url: "https://www.worldbank.org" },
        { title: "CGIAR: Big Data in Agriculture", url: "https://bigdata.cgiar.org/" },
        { title: "Liquid Intelligent Technologies: IoT", url: "https://www.liquid.tech/" }
    ],
    "Post-Harvest Specialist": [
        { title: "Rockefeller: YieldWise Initiative", url: "https://www.rockefellerfoundation.org" },
        { title: "FAO: Post-harvest Loss Reduction", url: "https://www.fao.org" },
        { title: "Global Cold Chain Alliance", url: "https://www.gcca.org/" },
        { title: "InspiraFarms: Cold Storage", url: "https://inspirafarms.com/" }
    ],
    "Climate Risk Analyst": [
        { title: "IPCC: Africa Regional Factsheet", url: "https://www.ipcc.ch" },
        { title: "CGIAR: CCAFS Reports", url: "https://ccafs.cgiar.org" },
        { title: "ACRE Africa: Insurance", url: "https://acreafrica.com/" },
        { title: "ICPAC: Climate Prediction", url: "https://www.icpac.net/" }
    ],
    "Digital Extension Officer": [
        { title: "iShamba: SMS Advisory", url: "https://ishamba.com/" },
        { title: "Digital Green: Video Extension", url: "https://www.digitalgreen.org/" },
        { title: "Esoko: Market Data & Tips", url: "https://esoko.com/" },
        { title: "Farm.ink: Digital Advisory", url: "https://farm.ink/" }
    ],
    "Urban Farming Architect": [
        { title: "FAO: Urban Agriculture", url: "https://www.fao.org/urban-food-actions/urban-agriculture/en/" },
        { title: "UN-Habitat: Urban Food Systems", url: "https://unhabitat.org" },
        { title: "Vertical Farming Institute", url: "https://vertical-farming.net/" },
        { title: "Hydroponics Africa", url: "https://hydroponicskenya.com/" }
    ],
    "Livestock Health Tech": [
        { title: "WOAH: Animal Health in Africa", url: "https://www.woah.org" },
        { title: "Kenya Veterinary Board (KVB)", url: "https://kenyavetboard.or.ke/" },
        { title: "Tanzania Vet Council (VCT)", url: "https://www.vct.go.tz/" },
        { title: "Uganda Vet Board (MAAIF)", url: "https://www.agriculture.go.ug/" },
        { title: "GALVmed: Livestock Health", url: "https://www.galvmed.org" },
        { title: "ILRI: Livestock Research", url: "https://www.ilri.org/" },
        { title: "CowTribe: Last Mile Delivery", url: "https://www.cowtribe.com/" }
    ],
    "Agricultural Extension Officer": [
        { title: "One Acre Fund: Field Model", url: "https://oneacrefund.org/" },
        { title: "FAO eLearning Academy", url: "https://elearning.fao.org/" },
        { title: "GFRAS: Rural Advisory Services", url: "https://www.g-fras.org/" },
        { title: "AFAAS: African Forum for Advisory Services", url: "https://www.afaas-africa.org/" }
    ],
    "Agro-Processing Technician": [
        { title: "Kenya Ministry of Health (Food Hygiene)", url: "https://www.health.go.ke/" },
        { title: "Rwanda Standards Board (RSB)", url: "https://www.rsb.gov.rw/" },
        { title: "Uganda National Bureau of Standards", url: "https://www.unbs.go.ug/" },
        { title: "Tanzania Bureau of Standards (TBS)", url: "https://www.tbs.go.tz/" },
        { title: "KEBS: Food Safety Schemes", url: "https://www.kebs.org/" }
    ],

    // --- ENERGY ---
    "Solar PV Installer": [
        { title: "EPRA: Licensing Guide (Kenya)", url: "https://www.epra.go.ke" },
        { title: "ERA: Installation Permits (Uganda)", url: "https://www.era.go.ug/" },
        { title: "EWURA: LOIS Licensing (Tanzania)", url: "https://www.ewura.go.tz/" },
        { title: "RURA: Electrical Permits (Rwanda)", url: "https://licensing.rura.rw/" },
        { title: "IRENA: Renewable Energy Jobs", url: "https://www.irena.org" },
        { title: "GOGLA: Off-Grid Solar", url: "https://www.gogla.org/" },
        { title: "Solar Energy International", url: "https://www.solarenergy.org/" }
    ],
    "Grid Systems Engineer": [
        { title: "IEA: Africa Energy Outlook", url: "https://www.iea.org" },
        { title: "AfDB: Power Africa Initiative", url: "https://www.afdb.org" },
        { title: "EAPP: Eastern Africa Power Pool", url: "https://eappool.org/" },
        { title: "IEEE Power & Energy Society", url: "https://www.ieee-pes.org/" }
    ],
    "Energy Auditor": [
        { title: "EPRA: Energy Management Regulations", url: "https://www.epra.go.ke" },
        { title: "UNIDO: Industrial Energy Efficiency", url: "https://www.unido.org" },
        { title: "Association of Energy Engineers", url: "https://www.aeecenter.org/" },
        { title: "Kenya Association of Manufacturers", url: "https://kam.co.ke/" }
    ],
    "Geothermal Technician": [
        { title: "GDC: Geothermal Development in Kenya", url: "https://www.gdc.co.ke" },
        { title: "IRENA: Geothermal Energy", url: "https://www.irena.org" },
        { title: "KenGen: Geothermal", url: "https://www.kengen.co.ke/" },
        { title: "IGA: International Geothermal Association", url: "https://www.geothermal-energy.org/" }
    ],
    "Wind Turbine Tech": [
        { title: "GWEC: Global Wind Report", url: "https://gwec.net" },
        { title: "Lake Turkana Wind Power", url: "https://ltwp.co.ke" },
        { title: "WindEurope", url: "https://windeurope.org/" },
        { title: "Kipeto Energy", url: "https://kipetoenergy.co.ke/" }
    ],
    "Energy Policy Analyst": [
        { title: "UNECA: Energy Policy in Africa", url: "https://www.uneca.org" },
        { title: "AFREC: Africa Energy Database", url: "https://au-afrec.org" },
        { title: "Energy for Growth Hub", url: "https://www.energyforgrowth.org/" },
        { title: "Strathmore Energy Research Centre", url: "https://serc.strathmore.edu/" }
    ],
    "Smart Meter Tech": [
        { title: "ESMAP: Utility Modernization", url: "https://www.esmap.org" },
        { title: "IEA: Smart Grids", url: "https://www.iea.org" },
        { title: "KPLC: Smart Metering", url: "https://kplc.co.ke/" },
        { title: "African Utility Week", url: "https://wearevuka.com/energy/enlit-africa/" }
    ],
    "Project Manager": [
        { title: "PMI: Project Management in Africa", url: "https://www.pmi.org" },
        { title: "IPMA: Competence Baseline", url: "https://www.ipma.world" },
        { title: "Renewable Energy Solutions for Africa", url: "https://www.res4africa.org/" },
        { title: "Power for All", url: "https://www.powerforall.org/" }
    ],
    "Safety Inspector": [
        { title: "OSHA: Safety Guidelines", url: "https://www.osha.gov" },
        { title: "ISO 45001: Occupational Health", url: "https://www.iso.org" },
        { title: "DOSHS Kenya", url: "https://labour.go.ke/" },
        { title: "Global Wind Organisation (GWO)", url: "https://www.globalwindsafety.org/" }
    ],
    "Bioenergy Specialist": [
        { title: "Clean Cooking Alliance", url: "https://cleancooking.org" },
        { title: "WBA: Global Bioenergy Statistics", url: "https://www.worldbioenergy.org" },
        { title: "Biogas International", url: "https://biogas.co.ke/" },
        { title: "Africa Biogas Partnership Programme", url: "https://www.hivos.org/" }
    ],
    "EV Charging Tech": [
        { title: "UNEP: E-Mobility in Africa", url: "https://www.unep.org" },
        { title: "IEA: Global EV Outlook", url: "https://www.iea.org" },
        { title: "E-Mobility Association of Kenya", url: "https://emak.co.ke/" },
        { title: "BasiGo", url: "https://www.basi-go.com/" }
    ],
    "Energy Storage Specialist": [
        { title: "World Bank: Battery Storage Program", url: "https://www.worldbank.org" },
        { title: "ESA: Energy Storage Priorities", url: "https://energystorage.org" },
        { title: "Faraday Institution", url: "https://www.faraday.ac.uk/" },
        { title: "Energy Storage Association", url: "https://energystorage.org/" }
    ],

    // --- DIGITAL ---
    "Data Scientist": [
        { title: "World Bank: Data for Policy", url: "https://data.worldbank.org" },
        { title: "UN Global Pulse", url: "https://www.unglobalpulse.org" },
        { title: "Data Science Africa", url: "https://www.datascienceafrica.org/" },
        { title: "DeepLearning.AI", url: "https://www.deeplearning.ai/" }
    ],
    "Cloud Architect": [
        { title: "Microsoft: Africa Transformation", url: "https://www.microsoft.com/africa" },
        { title: "AWS: Cloud in Africa", url: "https://aws.amazon.com" },
        { title: "Google Cloud Architecture", url: "https://cloud.google.com/architecture" },
        { title: "Cloud Native Computing Foundation", url: "https://www.cncf.io/" }
    ],
    "Cybersecurity Analyst": [
        { title: "ITU: Global Cybersecurity Index", url: "https://www.itu.int" },
        { title: "INTERPOL: African Cyberthreat Assessment", url: "https://www.interpol.int" },
        { title: "Africa Cyber Defense Forum", url: "https://africacyberdefenseforum.com/" },
        { title: "OWASP", url: "https://owasp.org/" }
    ],
    "Frontend Dev": [
        { title: "Stack Overflow: Developer Survey", url: "https://survey.stackoverflow.co" },
        { title: "Google: Chrome Developers", url: "https://developer.chrome.com" },
        { title: "MDN Web Docs", url: "https://developer.mozilla.org/" },
        { title: "CSS-Tricks", url: "https://css-tricks.com/" }
    ],
    "Backend Dev": [
        { title: "GitHub: Octoverse Report", url: "https://octoverse.github.com" },
        { title: "System Design Primer", url: "https://github.com/" },
        { title: "Node.js Best Practices", url: "https://github.com/" },
        { title: "12 Factor App", url: "https://12factor.net/" }
    ],
    "AI/ML Engineer": [
        { title: "UNESCO: Ethics of AI", url: "https://www.unesco.org" },
        { title: "AU: Artificial Intelligence Strategy", url: "https://au.int" },
        { title: "AI Kenya", url: "https://kenya.ai/" },
        { title: "Papers with Code", url: "https://huggingface.co/papers/trending" }
    ],
    "UX/UI Designer": [
        { title: "Nielsen Norman Group: UX Research", url: "https://www.nngroup.com" },
        { title: "Interaction Design Foundation", url: "https://ixdf.org" },
        { title: "Laws of UX", url: "https://lawsofux.com/" },
        { title: "Smashing Magazine", url: "https://www.smashingmagazine.com/" }
    ],
    "Product Manager": [
        { title: "Product School: State of Product", url: "https://productschool.com" },
        { title: "Mind the Product", url: "https://www.mindtheproduct.com" },
        { title: "Silicon Valley Product Group", url: "https://www.svpg.com/" },
        { title: "Lenny's Newsletter", url: "https://www.lennysnewsletter.com/" }
    ],
    "DevOps Engineer": [
        { title: "DORA: State of DevOps", url: "https://dora.dev" },
        { title: "CNCF: Cloud Native Reports", url: "https://www.cncf.io" },
        { title: "DevOps Roadmap", url: "https://roadmap.sh/devops" },
        { title: "Google SRE Book", url: "https://sre.google/books/" }
    ],
    "Digital Marketer": [
        { title: "Hootsuite: Digital Trends Report", url: "https://www.hootsuite.com" },
        { title: "Google: Digital Skills for Africa", url: "https://grow.google" },
        { title: "HubSpot Academy", url: "https://academy.hubspot.com/" },
        { title: "Moz Blog", url: "https://moz.com/blog" }
    ],
    "Blockchain Developer": [
        { title: "OECD: Blockchain in Africa", url: "https://www.oecd.org" },
        { title: "CV VC: African Blockchain Report", url: "https://www.cvvc.com" },
        { title: "Ethereum Foundation", url: "https://ethereum.org/" },
        { title: "Binance Academy", url: "https://academy.binance.com/" }
    ],
    "Systems Administrator": [
        { title: "Linux Foundation: SysAdmin Reports", url: "https://www.linuxfoundation.org" },
        { title: "CompTIA: IT Industry Outlook", url: "https://www.comptia.org" },
        { title: "Server Fault", url: "https://serverfault.com/" },
        { title: "Microsoft Sysinternals", url: "https://learn.microsoft.com/en-us/sysinternals/" }
    ],
    "Android Dev": [
        { title: "Google: Android Developers", url: "https://developer.android.com/" },
        { title: "Jetpack Compose Pathway", url: "https://developer.android.com/courses/pathways/compose" },
        { title: "Zindi: Mobile & AI Challenges", url: "https://zindi.africa/" },
        { title: "AfriLabs: Community & Events", url: "https://www.afrilabs.com/" }
    ],
    "Farm Services Operator": [
        { title: "Hello Tractor: Fleet Management", url: "https://hellotractor.com/" },
        { title: "FAO: Agricultural Mechanization", url: "https://www.fao.org/agricultural-mechanization/en/" },
        { title: "Agrilinks: Extension Resources", url: "https://agrilinks.org/" },
        { title: "GSMA: Mobile for Agriculture", url: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/" }
    ],
    "Irrigation Technician": [
        { title: "FAO: Irrigation Water Management", url: "https://www.fao.org/land-water/water/water-management/irrigationwater/en/" },
        { title: "SunCulture: Solar Irrigation", url: "https://sunculture.io/" },
        { title: "Irrigation Association: Training", url: "https://www.irrigation.org/" },
        { title: "iDE: Smallholder Irrigation", url: "https://www.ideglobal.org/" }
    ],
    "Aquaculture Farm Technician": [
        { title: "FAO: State of World Fisheries 2024", url: "https://www.fao.org/fishery/en/sofia" },
        { title: "WorldFish: Aquaculture Research", url: "https://www.worldfishcenter.org/" },
        { title: "Aquaculture Alliance: Resources", url: "https://www.globalseafood.org/" },
        { title: "EAF-Nansen: Fisheries Training", url: "https://www.fao.org/in-action/eaf-nansen/en/" }
    ],
    "Fisheries Compliance Officer": [
        { title: "FAO: Code of Conduct — Responsible Fisheries", url: "https://www.fao.org/fishery/en/publications/cofi" },
        { title: "FISH-i Africa: IUU Compliance Network", url: "https://swiofish.org/" },
        { title: "Too Big To Ignore: Small-Scale Fisheries", url: "https://toobigtoignore.net/" },
        { title: "World Bank: SWIOFISH Programme", url: "https://www.worldbank.org/en/topic/environment/brief/swiofish" }
    ]
};

// 7. Role to Occupation Mapping (For OJA & Wage Data)
const roleToOccupationMap = {
    // Agri
    "Precision Ag Specialist": "Precision Ag Specialist",
    "Drone Pilot": "Drone Pilot",
    "Soil Data Analyst": "Agronomist / Crop production specialist",
    "Smart Irrigation Tech": "Farm manager / Production supervisor",
    "Supply Chain Manager": "Farm manager / Production supervisor",
    "Agri-Input Sales": "Farm manager / Production supervisor",
    "Farm IoT Engineer": "Agronomist / Crop production specialist",
    "Post-Harvest Specialist": "Post-Harvest Specialist",
    "Climate Risk Analyst": "Agronomist / Crop production specialist",
    "Digital Extension Officer": "Digital Extension Officer",
    "Urban Farming Architect": "Agronomist / Crop production specialist",
    "Livestock Health Tech": "Animal health technician / Livestock technician",
    "Agricultural Extension Officer": "Agricultural Extension Officer",
    "Farm Services Operator": "Farm Services Operator",
    "Irrigation Technician": "Irrigation Technician",
    "Agro-Processing Technician": "Food technologist / Agro-processing technician",
    "Aquaculture Farm Technician": "Fisheries / Aquaculture technician",
    "Fisheries Compliance Officer": "Fisheries Compliance Officer",

    // Energy
    "Solar PV Installer": "Solar PV installer / Solar technician",
    "Grid Systems Engineer": "Renewable energy engineer (electrical/power/energy)",
    "Energy Auditor": "Energy Auditor",
    "Geothermal Technician": "Geothermal Technician",
    "Wind Turbine Tech": "Wind Turbine Tech",
    "Energy Policy Analyst": "Energy Policy Analyst",
    "Smart Meter Tech": "Electrician / Electrical technician",
    "Project Manager": "Renewables project manager / Site supervisor",
    "Safety Inspector": "Safety Inspector",
    "Bioenergy Specialist": "Bioenergy Specialist",
    "EV Charging Tech": "Electrician / Electrical technician",
    "Energy Storage Specialist": "Renewable energy engineer (electrical/power/energy)",

    // Digital
    "Data Scientist": "Data analyst",
    "Cloud Architect": "Systems analyst / IT solutions specialist",
    "Cybersecurity Analyst": "Cybersecurity analyst / IT security specialist",
    "Frontend Dev": "Software developer / Software engineer",
    "Backend Dev": "Software developer / Software engineer",
    "AI/ML Engineer": "Data engineer",
    "UX/UI Designer": "UX/UI Designer",
    "Product Manager": "Business intelligence analyst / Business analyst (digital)",
    "DevOps Engineer": "DevOps Engineer",
    "Digital Marketer": "Business intelligence analyst / Business analyst (digital)",
    "Blockchain Developer": "Software developer / Software engineer",
    "Systems Administrator": "Systems analyst / IT solutions specialist",
    "Android Dev": "Software developer / Software engineer"
};

// 8. Role Qualifications (Minimum Requirements)
const roleQualifications = {
    // --- AGRI ---
    "Precision Ag Specialist": { education: "Bachelor's in Agronomy, GIS, or AgTech", certification: "Remote Pilot License (RPL) / GIS Cert / ISPRS", experience: "1-2 years in field data collection" },
    "Drone Pilot": { education: "KCSE C- / High School Diploma", certification: "KCAA/RCAA Remote Pilot License (RPL) / ICAO", experience: "50+ logged flight hours" },
    "Soil Data Analyst": { education: "Bachelor's in Soil Science or Chemistry", certification: "Lab Safety / ISO 17025 Awareness / GLP", experience: "2 years in a wet lab environment" },
    "Smart Irrigation Tech": { education: "Diploma in Water Engineering / Plumbing", certification: "NITA Grade III (Plumbing) / Irrigation Association Cert", experience: "1 year in irrigation installation" },
    "Supply Chain Manager": { education: "Bachelor's in Procurement or Logistics", certification: "CIPS / KISM Certification / APICS", experience: "3-5 years in logistics operations" },
    "Agri-Input Sales": { education: "Certificate/Diploma in General Agriculture", certification: "Agro-vet Accreditation / BASIS", experience: "1 year in retail or field sales" },
    "Farm IoT Engineer": { education: "Bachelor's in Mechatronics or Telecoms", certification: "IoT / LoRaWAN Fundamentals / Cisco IoT", experience: "Portfolio of hardware projects" },
    "Post-Harvest Specialist": { education: "Bachelor's in Food Science/Technology", certification: "HACCP / Food Safety Level 2 / ISO 22000", experience: "2 years in packhouse operations" },
    "Climate Risk Analyst": { education: "Bachelor's in Meteorology or Actuarial Science", certification: "Data Analysis (Python/R) / GARP SCR", experience: "3 years in risk modeling" },
    "Digital Extension Officer": { education: "Diploma in Ag-Extension or Community Dev", certification: "Digital Literacy / Adult Education / FAO E-Ag", experience: "Experience with smallholder farmers" },
    "Urban Farming Architect": { education: "Bachelor's in Landscape Architecture", certification: "Hydroponics Design Cert / LEED", experience: "Portfolio of urban designs" },
    "Livestock Health Tech": { education: "Diploma in Animal Health", certification: "KVB (Vet Board) Registration / CAHT", experience: "1 year clinical attachment" },
    "Agricultural Extension Officer": { education: "Diploma/Degree in Agricultural Extension", certification: "Motorbike License / Min. of Ag Accreditation", experience: "2 years community field work" },
    "Farm Services Operator": { education: "Certificate in Ag-Mechanization", certification: "Driving License / Drone Pilot License", experience: "1 year machinery operation" },
    "Irrigation Technician": { education: "Diploma in Water Engineering", certification: "NITA Grade III (Plumbing) / Certified Irrigation Technician", experience: "1 year field installation" },
    "Agro-Processing Technician": { education: "Diploma in Food Technology", certification: "Food Safety / HACCP Level 2 / FSSC 22000", experience: "1 year production line" },
    "Aquaculture Farm Technician": { education: "Certificate in Fisheries/Aquaculture", certification: "Swimming / First Aid / GlobalG.A.P. Aquaculture", experience: "1 year pond management" },
    "Fisheries Compliance Officer": { education: "Diploma in Fisheries Management", certification: "Maritime Safety / Inspection / STCW", experience: "2 years enforcement/patrol" },

    // --- ENERGY ---
    "Solar PV Installer": { education: "Diploma in Electrical Engineering", certification: "EPRA T1/T2 License (Kenya) / NABCEP / EWURA", experience: "1 year apprenticeship" },
    "Grid Systems Engineer": { education: "Bachelor's in Electrical Engineering", certification: "EBK/ERB Graduate Engineer / IEEE", experience: "3 years in power systems" },
    "Energy Auditor": { education: "Bachelor's in Engineering (Mech/Elec)", certification: "CEM (Certified Energy Manager) / EPRA / ISO 50001", experience: "3 years in industrial maintenance" },
    "Geothermal Technician": { education: "Higher Diploma in Mechanical Eng.", certification: "NITA Industrial Mechanics / ASME", experience: "2 years in power plant ops" },
    "Wind Turbine Tech": { education: "Diploma in Mechatronics/Electrical", certification: "GWO (Global Wind Org) Basic Safety", experience: "Working at Heights certification" },
    "Energy Policy Analyst": { education: "Bachelor's in Economics, Law or Policy", certification: "Regulatory Impact Assessment / CEM", experience: "3-5 years in regulated sector" },
    "Smart Meter Tech": { education: "Certificate in Electrical Installation", certification: "NITA Grade II (Electrical) / DLMS/COSEM", experience: "1 year field installation" },
    "Project Manager": { education: "Bachelor's in Construction/Engineering", certification: "PMP or PRINCE2 / CAPM", experience: "5 years managing infrastructure projects" },
    "Safety Inspector": { education: "Diploma in Occup. Health & Safety", certification: "NEBOSH / DOSH Certification / OSHA", experience: "3 years in site safety supervision" },
    "Bioenergy Specialist": { education: "Bachelor's in Chemical/Env. Engineering", certification: "Biogas Systems Design / WBA", experience: "2 years in waste management" },
    "EV Charging Tech": { education: "Diploma in Auto-Electrical / Electronics", certification: "High Voltage Safety (EV) / IMI EV", experience: "1 year in automotive repair" },
    "Energy Storage Specialist": { education: "Bachelor's in Electrical/Chemical Eng.", certification: "Battery Systems (BESS) Cert / IEEE", experience: "2 years in renewable integration" },

    // --- DIGITAL ---
    "Data Scientist": { education: "Bachelor's in Math, CS, or Statistics", certification: "Google/IBM Data Professional Cert / CAP", experience: "Portfolio of predictive models" },
    "Cloud Architect": { education: "Bachelor's in Computer Science", certification: "AWS Solutions Architect / Azure Admin / TOGAF", experience: "5 years in system administration" },
    "Cybersecurity Analyst": { education: "Bachelor's in IT or Forensics", certification: "CompTIA Security+ / CEH / CISSP", experience: "2 years in network defense" },
    "Frontend Dev": { education: "Bootcamp Cert or Bachelor's in CS", certification: "Meta Frontend Developer Cert / CIW", experience: "GitHub portfolio with React projects" },
    "Backend Dev": { education: "Bachelor's in CS or equiv. experience", certification: "Cloud Developer Associate / Oracle Certified", experience: "2 years building REST APIs" },
    "AI/ML Engineer": { education: "Master's in CS or AI (Preferred)", certification: "TensorFlow Developer Cert / AWS Machine Learning", experience: "Published research or deployed models" },
    "UX/UI Designer": { education: "Diploma in Design / Interaction", certification: "Google UX Design Cert / HFI CUA", experience: "Figma portfolio (3+ case studies)" },
    "Product Manager": { education: "Bachelor's in Business or Tech", certification: "PMP / Agile / Scrum Master / AIPMM", experience: "3 years in product lifecycle mgmt" },
    "DevOps Engineer": { education: "Bachelor's in CS / Engineering", certification: "Docker / Kubernetes (CKA) / AWS DevOps", experience: "3 years in CI/CD automation" },
    "Digital Marketer": { education: "Bachelor's in Marketing / Comms", certification: "Google Ads / Meta Blueprint / HubSpot", experience: "Proven ROI on ad campaigns" },
    "Blockchain Developer": { education: "Bachelor's in CS / Cryptography", certification: "Solidity / Ethereum Dev Cert / CBP", experience: "Deployed Smart Contracts" },
    "Systems Administrator": { education: "Diploma/Degree in IT", certification: "Red Hat (RHCSA) / Microsoft Certified / CompTIA Server+", experience: "2 years server management" },
    "Android Dev": { education: "Bootcamp Cert or Bachelor's in CS", certification: "Associate Android Developer (Google) / Meta Android Cert", experience: "2+ apps published on Google Play Store" }
};

// --- 9. Pathway & Diagnostic Configuration (Moved from app.js) ---

const countryPathwayContext = {
    'Kenya': { hub: 'iHub or Nairobi Garage', jobBoard: 'BrighterMonday Kenya', community: 'Silicon Savannah meetups' },
    'Rwanda': { hub: 'Norrsken House Kigali', jobBoard: 'Job in Rwanda', community: 'Kigali Innovation City events' },
    'Tanzania': { hub: 'Buni Hub', jobBoard: 'BrighterMonday Tanzania', community: 'Dar es Salaam Tech initiatives' },
    'Uganda': { hub: 'The Innovation Village', jobBoard: 'BrighterMonday Uganda', community: 'Kampala tech circles' },
    'Burundi': { hub: 'Burundi Innovation Hub', jobBoard: 'Job Burundi', community: 'Bujumbura Tech' },
    'South Sudan': { hub: 'Juba Hub', jobBoard: 'South Sudan Jobs', community: 'Juba Tech Community' },
    'DRC': { hub: 'Ingenious City', jobBoard: 'Kazi', community: 'Kinshasa Digital' },
    'Somalia': { hub: 'Ileys Hub', jobBoard: 'Somali Jobs', community: 'Mogadishu Tech' },
    'all': { hub: 'AfriLabs Hubs', jobBoard: 'LinkedIn Africa', community: 'Regional EAC networks' }
};

const proofPromptsMap = {
    "Communication (Written)": { text: "Write a 1-page project brief, a stakeholder email, or a short technical report.", link: "https://www.atlassian.com/software/confluence/templates/project-poster", label: "Template: Project Poster" },
    "Written Communication": { text: "Draft a clear, concise email or technical memo for a non-technical audience.", link: "https://www.grammarly.com/blog/how-to-write-a-report/", label: "Guide: Report Writing" },
    "Communication (Spoken)": { text: "Record a 2-min video update or lead a 15-min team briefing.", link: "https://hbr.org/2016/11/how-to-give-a-killer-presentation", label: "Guide: Effective Briefings" },
    "Public Speaking": { text: "Prepare and deliver a 5-minute presentation on a technical topic.", link: "https://www.ted.com/playlists/226/before_public_speaking", label: "Watch: TED Speaking Tips" },
    "Active Listening": { text: "Practice active listening in a meeting and summarize key points.", link: "https://hbr.org/2024/01/what-is-active-listening", label: "Technique: Active Listening" },
    "Teamwork & Collaboration": { text: "Complete a group project with defined roles and collect peer feedback.", link: "https://www.atlassian.com/team-playbook/plays/roles-and-responsibilities", label: "Tool: Roles & Resp. Play" },
    "Collaboration": { text: "Use a collaborative tool (Google Docs, Miro) to brainstorm with a peer.", link: "https://www.mural.co/templates", label: "Template: Brainstorming" },
    "Problem-solving": { text: "Write a case study using the ‘problem → options → decision → results’ framework.", link: "https://www.indeed.com/career-advice/resumes-cover-letters/star-method-resume", label: "Framework: S.T.A.R. Method" },
    "Problem Solving": { text: "Apply the '5 Whys' technique to identify the root cause of a recent issue.", link: "https://asq.org/quality-resources/five-whys", label: "Tool: 5 Whys Analysis" },
    "Critical Thinking": { text: "Critique a recent industry report identifying 3 potential biases or gaps.", link: "https://www.futurelearn.com/info/blog/how-to-improve-critical-thinking", label: "Guide: Critical Analysis" },
    "Analytical Thinking": { text: "Break down a complex problem into smaller, manageable components.", link: "https://lucid.co/blog/problem-solving-strategies", label: "Guide: Problem Decomposition" },
    "Time & Task Management": { text: "Create and execute a 2-week plan with milestones + what you actually delivered.", link: "https://trello.com/templates/personal/personal-productivity-4Hh2QOOU", label: "Template: Personal Productivity" },
    "Time Management": { text: "Use the Eisenhower Matrix to prioritize your tasks for the week.", link: "https://todoist.com/productivity-methods/eisenhower-matrix", label: "Method: Eisenhower Matrix" },
    "Adaptability & Resilience": { text: "Document a recent project change, describing how you pivoted and what you learned.", link: "https://www.betterup.com/blog/adaptability", label: "Read: Adaptability Skills" },
    "Adaptability": { text: "Reflect on a recent change and identify one positive opportunity it created.", link: "https://www.psychologytoday.com/us/basics/adaptability", label: "Guide: Developing Adaptability" },
    "Professionalism & Reliability": { text: "Maintain a meeting/work log for a month showing punctuality and preparation.", link: "https://clockify.me/blog/productivity/", label: "Tool: Work Logging" },
    "Digital Literacy (Tools)": { text: "Create screenshots or a walkthrough of advanced tool use (Sheets, CRM, GIS, Git).", link: "https://workspace.google.com/learning-center/", label: "Tips: Advanced Sheets" },
    "Tech Savviness": { text: "Learn a new keyboard shortcut or software feature and teach it to a colleague.", link: "https://www.learnfree.org/en/computerbasics/", label: "Course: Computer Basics" },
    "Data Literacy (Quality)": { text: "Clean a raw dataset and document the errors found and fixed.", link: "https://www.kaggle.com/learn/pandas", label: "Practice: Kaggle Cleaning" },
    "Data Storytelling": { text: "Create a chart that clearly communicates a key insight from a dataset.", link: "https://www.storytellingwithdata.com/blog", label: "Blog: Storytelling w/ Data" },
    "Customer/User Orientation": { text: "Map a customer journey or conduct and summarize a user feedback session.", link: "https://miro.com/templates/customer-journey-map/", label: "Template: Journey Map" },
    "Client Communication": { text: "Draft a response to a difficult client query or complaint.", link: "https://www.helpscout.com/blog/customer-service-scenarios/", label: "Examples: Service Scenarios" },
    "Ethics & Integrity": { text: "Draft a privacy statement, risk note, or safety briefing checklist.", link: "https://gdpr.eu/privacy-notice/", label: "Guide: Privacy Notices" },
    "Integrity": { text: "Review a professional code of ethics relevant to your field.", link: "https://www.acm.org/code-of-ethics", label: "Example: ACM Code of Ethics" },
    "Leadership": { text: "Lead a small project or volunteer initiative.", link: "https://hbr.org/topic/subject/leadership", label: "Quiz: Leadership Style" },
    "Negotiation": { text: "Practice a negotiation scenario with a peer.", link: "https://www.pon.harvard.edu/free-reports/negotiation-skills-negotiation-strategies-and-negotiation-techniques-to-help-you-become-a-better-negotiator/", label: "Tips: Negotiation Skills" },
    "Creativity": { text: "Brainstorm 10 different solutions to a single problem.", link: "https://www.ideou.com/pages/brainstorming", label: "Guide: Effective Brainstorming" },
    "Safety Awareness": { text: "Conduct a mock risk assessment for your workspace.", link: "https://www.osha.gov/safety-management/hazard-identification", label: "Guide: Hazard ID" }
};

const rolePracticeMap = {
    "Precision Ag Specialist": [
        { title: "Process Drone Imagery", desc: "Use OpenDroneMap to stitch a basic orthomosaic from sample data.", icon: "map", link: "https://www.opendronemap.org/" },
        { title: "Create a VRT Map", desc: "Design a Variable Rate prescription map in QGIS using NDVI data.", icon: "layers", link: "https://qgis.org/" }
    ],
    "Digital Extension Officer": [
        { title: "Design a Digital Survey", desc: "Build a farmer data collection form using ODK Build or KoboToolbox.", icon: "clipboard", link: "https://docs.getodk.org/" },
        { title: "Record Advisory Content", desc: "Create a 2-min voice advisory message for dissemination via IVR.", icon: "mic", link: "https://www.farmradio.org/resources/" }
    ],
    "Solar PV Installer": [
        { title: "Sizing Calculation", desc: "Calculate battery and panel needs for a 5kW off-grid home system.", icon: "calculator", link: "https://pvwatts.nrel.gov/pvwatts.php" },
        { title: "Wiring Diagram", desc: "Draw a single-line diagram for a DC-coupled system.", icon: "pen-tool", link: "https://www.solar-electric.com/learning-center/" }
    ],
    "Data Scientist": [
        { title: "Kaggle Challenge", desc: "Participate in a Zindi Africa challenge (e.g., Crop Yield Prediction).", icon: "database", link: "https://zindi.africa/" },
        { title: "Clean a Dataset", desc: "Use Python/Pandas to clean a raw CSV and visualize missing values.", icon: "code", link: "https://www.kaggle.com/learn/pandas" }
    ]
};

const defaultPracticeTasks = [
    { title: "Build a Portfolio", desc: "Compile 'what I did + evidence' on GitHub, Behance, or LinkedIn.", icon: "briefcase", link: "https://github.com/" },
    { title: "Real Mini-Project", desc: "Solve one real problem (e.g., crop disease ID) and produce an output.", icon: "code-2", link: "https://zindi.africa/" },
    { title: "Team Challenge", desc: "Join a 48h hackathon or group assignment.", icon: "users", link: "https://devpost.com/" }
];

const sectorContextMap = {
    agri: {
        comm: "Farmer training & negotiation",
        prob: "Field constraints & trade-offs",
        ethic: "Fair dealing & farmer data consent"
    },
    energy: {
        comm: "Safety protocols & handover instructions",
        prob: "Fault diagnosis & root cause analysis",
        ethic: "Consumer protection & safety compliance"
    },
    digital: {
        comm: "Technical documentation & async updates",
        prob: "Debugging & hypothesis testing",
        ethic: "Data privacy, bias mitigation & security"
    }
};

const diagnosticData = {
    agri: {
        theme: 'sky',
        foundations: [
            "Basic Agronomy & Crop Science (Soil, Diseases)",
            "Farm Data & Analytics (Yields, Inputs, Viz)",
            "Digital Tools (IoT Sensors, Drones, GIS)",
            "Ag-Finance (Mobile Money, Costing)",
            "Supply Chain & Logistics (Post-harvest, Inventory)",
            "Climate Smart Practices (Resilience, Modeling)",
            "Field Safety & Compliance (Traceability)"
        ],
        roles: [
            "Extension Officer", "Agri-data Analyst", "Cold-chain Supervisor", "Input Supply Sales", "Digital Advisory Associate"
        ],
        practiceTitle: 'Crop Rotation Plan',
        badgeTitle: 'Field Data Collection & Advisory Comm.',
        badgeProvider: 'GIZ / atingi',
        badgeStandard: 'Aligned to: CDACC Agri-Extension Lvl 4'
    },
    energy: {
        theme: 'amber',
        foundations: [
            "Electrical Fundamentals (AC/DC, wiring)",
            "Renewable Systems (PV, Wind, Storage)",
            "Technical Design (AutoCAD, Sizing)",
            "Grid & Systems Management (SCADA, Smart Meters)",
            "Safety Standards (PPE, Protocols)",
            "Energy Efficiency & Auditing",
            "Regulatory & Policy Compliance"
        ],
        roles: [
            "Solar PV Technician", "Energy Auditor", "Mini-grid Operator", "Project Developer", "O&M Supervisor"
        ],
        practiceTitle: 'Solar Load Calculation',
        badgeTitle: 'Customer Handover & After-Sales Support',
        badgeProvider: 'NITA / EPRA',
        badgeStandard: 'Unit of Competency: Solar T2 Curriculum'
    },
    digital: {
        theme: 'indigo',
        foundations: [
            "Programming Logic (Python, JS, SQL)",
            "Cloud & Infrastructure (AWS, Azure, DevOps)",
            "Data Science & Machine Learning",
            "Cybersecurity & Digital Hygiene",
            "Product Development (Agile, User Research)",
            "UI/UX Design Principles (Figma)",
            "Web Technologies (React, APIs)"
        ],
        roles: [
            "Data Analyst", "Junior Software Dev", "AI Product Associate", "Cybersecurity Analyst", "Prompt Specialist"
        ],
        practiceTitle: 'Build a React Component',
        badgeTitle: 'Workplace Docs & Responsible Data Handling',
        badgeProvider: 'IBM SkillsBuild',
        badgeStandard: 'Verifiable via: Credly / OpenBadges'
    }
};

const roleBadgeMap = {
    "Precision Ag Specialist": { title: "Certified Drone Pilot (RPL)", provider: "KCAA / CAA", standard: "Civil Aviation Regs" },
    "Digital Extension Officer": { title: "Digital Extension Services", provider: "FAO / AgLearning", standard: "Global GAP" },
    "Solar PV Installer": { title: "Solar T1/T2 License", provider: "EPRA / ERC", standard: "National Energy Regs" },
    "Data Scientist": { title: "Professional Data Engineer", provider: "Google / IBM", standard: "Industry Cert" }
};

// --- 10. Pathway "At a Glance" Roles ---
const sectorRoles = {
    agri: {
        tech: "Irrigation tech, greenhouse/horticulture tech, post-harvest/cold chain tech, mechanization",
        biz: "Extension/advisory, QA/food safety, aggregation/procurement, logistics",
        venture: "Input retail + advisory, farm services (spraying/soil testing), aggregation/trading, processing/value-add"
    },
    energy: {
        tech: "Solar PV installer/technician, mini-grid technician, O&M technician, wind turbine technician, battery/storage technician (incl. BMS), electrician (renewables focus)",
        biz: "Project developer, site assessor/surveyor, energy auditor, sales & customer acquisition (C&I / off-grid), carbon/MRV assistant, community engagement officer",
        venture: "Off-grid solar retail + after-sales, productive-use solutions (solar water pumping/cold rooms), installation & maintenance services, energy auditing/efficiency services, mini-grid O&M subcontracting, battery refurb/recycling collection services"
    },
    digital: {
        tech: "Software/dev, cloud/DevOps, cybersecurity, data engineering",
        biz: "Data analyst, BI analyst, product ops, digital marketing analytics",
        venture: "Freelance dashboards, no-code automation services, e-commerce ops, MSME digitization services"
    }
};

// --- 11. Sector Pathway Resources (Ecosystem) ---
const sectorPathwayResources = {
    agri: [
        { title: "Safaricom DigiFarm", desc: "Integrated inputs, finance & info hub.", link: "https://www.safaricom.co.ke/annualreport_2022/digifarm/", icon: "smartphone" },
        { title: "iShamba", desc: "SMS-first advisory & weather updates.", link: "https://ishamba.com/", icon: "message-square" },
        { title: "Emata", desc: "Digital micro-loans for farmers (Uganda).", link: "https://emata.ug/", icon: "banknote" },
        { title: "GIZ-SAIS Investment Readiness", desc: "Support for African agritech scaling.", link: "https://www.giz.de/en/worldwide/78869.html", icon: "trending-up" },
        { title: "Katapult Africa", desc: "Accelerator for climate & agri-tech.", link: "https://katapult.vc/africa/", icon: "rocket" },
        { title: "Apollo Agriculture", desc: "Financing for small-scale farmers.", link: "https://apolloagriculture.com/", icon: "credit-card" },
        { title: "One Acre Fund", desc: "Field officer support & USSD access.", link: "https://oneacrefund.org/", icon: "users" },
        { title: "Digital Green", desc: "Localized video extension content.", link: "https://www.digitalgreen.org/", icon: "video" },
        { title: "Hello Tractor", desc: "Tractor sharing & fleet management.", link: "https://hellotractor.com/", icon: "truck" },
        { title: "FAO eLearning", desc: "Certified climate-smart modules.", link: "https://elearning.fao.org/", icon: "book-open" },
        { title: "Zindi Africa", desc: "Competitions to build portfolio.", link: "https://zindi.africa/", icon: "award" },
        { title: "Moringa School", desc: "Project-based tech training.", link: "https://moringaschool.com/", icon: "code" },
        { title: "CareerVillage Coach", desc: "AI Career Coach & Mentorship.", link: "https://www.careervillage.org/", icon: "message-circle" },
        { title: "AfDB ENABLE Youth", desc: "Agri-business incubation & finance.", link: "https://www.afdb.org/en/topics-and-sectors/initiatives-partnerships/enable-youth", icon: "sprout" },
        { title: "Villgro Africa", desc: "Incubator for health & life science (agri) startups.", link: "https://villgroafrica.org/", icon: "sprout" },
        { title: "AECF", desc: "Funding for agribusiness & renewable energy.", link: "https://www.aecfafrica.org/", icon: "banknote" },
        { title: "Ignite Trade Africa", desc: "Trade facilitation & market access support.", link: "https://ignitetradeafrica.com/", icon: "globe" },
        { title: "Village Enterprise", desc: "Micro-enterprise graduation program.", link: "https://villageenterprise.org/", icon: "users" },
        { title: "SPARK", desc: "SME coaching in fragile communities.", link: "https://spark.ngo/", icon: "briefcase" }
    ],
    energy: [
        { title: "Digital Energy Challenge", desc: "Grants for digital energy startups.", link: "https://www.afd.fr/en/digital-and-technology", icon: "award" },
        { title: "SEforALL Open Africa Power", desc: "Leadership for young energy professionals.", link: "https://www.seforall.org/", icon: "users" },
        { title: "AFSIA Jobs", desc: "Africa Solar Industry Association vacancies.", link: "https://afsiasolar.com/career/", icon: "briefcase" },
        { title: "GOGLA Investment Academy", desc: "Off-grid solar finance know-how.", link: "https://www.gogla.org/resources", icon: "trending-up" },
        { title: "ARE Investment Academy", desc: "DRE investment readiness modules.", link: "https://renewelec.org/", icon: "book-open" },
        { title: "CareerVillage Coach", desc: "AI Career Coach & Mentorship.", link: "https://www.careervillage.org/", icon: "message-circle" },
        { title: "Kenya Climate Ventures", desc: "Investments for climate-smart energy solutions.", link: "https://kcv.co.ke/", icon: "leaf" },
        { title: "ClimAccelerator", desc: "Global accelerator for climate innovation.", link: "https://climaccelerator.climate-kic.org/", icon: "zap" },
        { title: "Schneider Electric Univ.", desc: "Free energy & automation training.", link: "https://www.se.com/ww/en/about-us/university/", icon: "cpu" },
        { title: "EEP Africa", desc: "Clean energy financing & knowledge.", link: "https://eepafrica.org/", icon: "sun" }
    ],
    digital: [
        { title: "The Baobab Network", desc: "Accelerator for early-stage tech.", link: "https://thebaobabnetwork.com/", icon: "rocket" },
        { title: "Nvidia Inception", desc: "Program for AI startups (Free credits).", link: "https://www.nvidia.com/en-us/startups/", icon: "cpu" },
        { title: "CareerVillage Coach", desc: "AI Career Coach & Mentorship.", link: "https://www.careervillage.org/", icon: "message-circle" },
        { title: "Andela Learning", desc: "Tech skills & community.", link: "https://andela.com/learning-community/", icon: "code" },
        { title: "ALX Africa", desc: "Software engineering & AI career tracks.", link: "https://www.alxafrica.com/", icon: "terminal" },
        { title: "Refactory", desc: "Employer-driven software skilling.", link: "https://refactory.academy/", icon: "briefcase" },
        { title: "Google Digital Skills", desc: "Free digital marketing courses.", link: "https://grow.google/intl/en_uk/", icon: "monitor" },
        { title: "Zindi Africa", desc: "Data science competitions.", link: "https://zindi.africa/", icon: "database" },
        { title: "Antler East Africa", desc: "Build your startup from scratch with funding.", link: "https://www.antler.co/location/nairobi", icon: "rocket" },
        { title: "Norrsken House Kigali", desc: "Largest hub for entrepreneurs in East Africa.", link: "https://www.norrsken.org/eastafrica", icon: "home" },
        { title: "Flat6Labs", desc: "Seed funding & mentorship for startups.", link: "https://flat6labs.com/", icon: "trending-up" },
        { title: "Tony Elumelu Foundation", desc: "Seed capital & training for African entrepreneurs.", link: "https://www.tonyelumelufoundation.org/", icon: "users" },
        { title: "Google for Startups", desc: "Accelerator for African tech startups.", link: "https://startup.google.com/accelerator/africa/", icon: "cpu" },
        { title: "Lionesses of Africa", desc: "Community for women entrepreneurs.", link: "https://lionessesofafrica.com/", icon: "heart" },
        { title: "YALI Network", desc: "Leadership training & connection.", link: "https://yali.state.gov/", icon: "globe" },
        { title: "Orange Corners", desc: "Incubation & facilities for youth.", link: "https://www.orangecorners.com/", icon: "box" }
    ]
};

// --- 12. Skill Level Descriptions ---
const skillLevelDescriptions = {
    agri: {
        "Soil Analysis": { beg: "Performs basic soil sampling and uses handheld pH/moisture meters.", int: "Interprets lab reports to prescribe specific fertilizer mixes.", adv: "Develops long-term nutrient management strategies for large commercial estates." },
        "IoT Sensors": { beg: "Installs and pairs sensors; replaces batteries and checks connectivity.", int: "Calibrates devices, troubleshoots network gateways, and logs data.", adv: "Designs full-farm sensor architectures and integrates data into decision dashboards." },
        "GIS Mapping": { beg: "Collects GPS waypoints and views existing map layers.", int: "Creates custom field maps, calculates acreage, and overlays yield data.", adv: "Performs complex spatial analysis, remote sensing integration, and watershed modeling." },
        "Python": { beg: "Writes simple scripts to automate data entry or basic calculations.", int: "Uses Pandas/NumPy for cleaning agricultural datasets and basic plotting.", adv: "Builds predictive crop models and deploys machine learning pipelines." },
        "Mobile Money API": { beg: "Understands payment flows and assists users with transactions.", int: "Integrates payment APIs into farm management software.", adv: "Architects secure, high-volume financial platforms for agri-value chains." },
        "Logistics": { beg: "Tracks shipments and manages basic dispatch schedules.", int: "Optimizes delivery routes and manages cold-chain storage compliance.", adv: "Designs regional supply chain networks and negotiates international freight." },
        "Climate Modeling": { beg: "Reads weather forecasts and advises on immediate planting windows.", int: "Analyzes historical weather data to identify seasonal trends.", adv: "Develops localized climate risk models and adaptation strategies." },
        "Remote Sensing": { beg: "Identifies basic crop stress from NDVI images.", int: "Processes drone/satellite imagery to map variability.", adv: "Develops custom algorithms for pest detection and yield forecasting." },
        "Inventory Mgmt": { beg: "Logs stock in/out using digital tools.", int: "Analyzes usage rates to forecast reorder points.", adv: "Manages multi-warehouse ERP systems and procurement strategies." },
        "Data Viz": { beg: "Creates simple bar/line charts for weekly reports.", int: "Builds interactive dashboards for monitoring farm KPIs.", adv: "Develops complex visual stories for investor reporting and impact analysis." },
        "Crop Science": { beg: "Identifies common pests and deficiency symptoms.", int: "Manages field trials and selects varieties for local conditions.", adv: "Leads breeding programs and integrated pest management strategies." },
        "Drone Ops": { beg: "Conducts basic line-of-sight manual flights.", int: "Plans automated flight missions for mapping.", adv: "Manages fleet operations, regulatory compliance, and data processing." }
    },
    energy: {
        "Electrical Wiring": { beg: "Cuts, strips, and connects wires under supervision.", int: "Reads schematics to wire complex panels and distribution boards.", adv: "Designs industrial wiring systems and troubleshoots high-voltage faults." },
        "Solar PV": { beg: "Mounts panels and connects standard connectors (MC4).", int: "Sizes strings, configures inverters, and commissions systems.", adv: "Designs utility-scale solar farms and storage integration." },
        "SCADA": { beg: "Monitors screens for alarms and logs basic events.", int: "Diagnoses system faults and performs remote switching.", adv: "Programs SCADA logic, integrates new hardware, and manages cybersecurity." },
        "Safety Protocols": { beg: "Uses PPE correctly and follows permit-to-work checklists.", int: "Conducts risk assessments and supervises site safety.", adv: "Develops corporate HSE policies and manages safety audits." },
        "AutoCAD": { beg: "Edits existing drawings and prints layouts.", int: "Creates detailed electrical schematics and site plans.", adv: "Manages BIM models and complex 3D plant designs." },
        "Grid Mgmt": { beg: "Monitors local load metrics.", int: "Balances distribution loads and manages outages.", adv: "Models power flow and plans transmission network expansion." },
        "Energy Efficiency": { beg: "Collects consumption data and identifies obvious waste.", int: "Conducts Level 2 audits and calculates ROI for retrofits.", adv: "Designs ISO 50001 energy management systems." },
        "Project Mgmt": { beg: "Updates schedules and tracks material delivery.", int: "Manages site teams, budgets, and client reporting.", adv: "Oversees multi-million dollar portfolios and contract negotiations." },
        "Thermodynamics": { beg: "Reads pressure/temperature gauges.", int: "Analyzes heat exchange efficiency.", adv: "Designs geothermal cycles and thermal plants." },
        "Regulatory Compl.": { beg: "Prepares standard permit applications.", int: "Ensures projects meet grid codes and local laws.", adv: "Advocates for policy changes and manages regulatory strategy." },
        "Data Analysis": { beg: "Cleans meter data for billing.", int: "Analyzes load profiles to detect theft or anomalies.", adv: "Forecasts demand and optimizes generation dispatch models." },
        "Field Ops": { beg: "Performs cleaning and basic visual inspections.", int: "Diagnoses hardware failures and replaces components.", adv: "Manages O&M contracts and predictive maintenance programs." }
    },
    digital: {
        "Python": { beg: "Writes basic scripts and uses standard libraries.", int: "Builds web backends (Django/Flask) and processes data.", adv: "Architects scalable systems and optimizing performance." },
        "JavaScript": { beg: "Adds interactivity to web pages (DOM manipulation).", int: "Builds SPAs using React/Vue and manages state.", adv: "Optimizes frontend performance and architectures full-stack apps." },
        "AWS/Azure": { beg: "Launches virtual machines and uses object storage.", int: "Configures VPCs, databases, and load balancers.", adv: "Designs serverless architectures and manages cost/security at scale." },
        "SQL": { beg: "Writes basic SELECT queries with simple joins.", int: "Optimizes queries, designs schemas, and creates stored procedures.", adv: "Tunes database performance and manages data warehousing." },
        "React": { beg: "Creates static components and uses props.", int: "Manages state with Hooks/Context and connects APIs.", adv: "Optimizes rendering, manages complex global state, and custom libraries." },
        "Cybersecurity": { beg: "Monitors logs and manages user access.", int: "Configures firewalls and performs vulnerability scans.", adv: "Conducts penetration testing and designs zero-trust architectures." },
        "Machine Learning": { beg: "Trains simple models using Scikit-Learn.", int: "Tunes hyperparameters and deploys models via APIs.", adv: "Designs custom architectures and manages MLOps pipelines." },
        "User Research": { beg: "Conducts user surveys and organizes feedback.", int: "Runs usability tests and creates personas.", adv: "Leads UX strategy and integrates insights into product roadmap." },
        "Agile": { beg: "Participates in daily standups and sprint planning.", int: "Facilitates scrum ceremonies and manages backlogs.", adv: "Coaches organizations on Agile transformation." },
        "DevOps": { beg: "Uses Git and runs basic build scripts.", int: "Sets up CI/CD pipelines and containerization (Docker).", adv: "Manages Kubernetes clusters and Infrastructure as Code." },
        "API Design": { beg: "Consumes APIs and understands JSON.", int: "Builds RESTful endpoints with validation.", adv: "Designs GraphQL schemas and manages API gateway policies." },
        "Figma": { beg: "Creates basic wireframes and uses components.", int: "Builds interactive high-fidelity prototypes.", adv: "Manages design systems and design ops workflows." }
    }
};

// --- 13. Cross-Sector Skills Matrix ---
const crossSectorSkillMatrix = {
    "Python": {
        agri: "Crop modeling scripts & automation",
        energy: "Grid simulation & system modelling",
        digital: "Backend development & AI pipelines"
    },
    "GIS Mapping": {
        agri: "Precision mapping & land use planning",
        energy: "Network coverage optimisation & site selection",
        digital: "Urban mobility analytics & logistics"
    },
    "IoT Sensors": {
        agri: "Soil moisture, temperature & humidity monitoring for precision farming",
        energy: "Smart metering, fault detection & remote grid diagnostics",
        digital: "Industrial sensor networks & predictive maintenance systems"
    },
    "IoT": {
        agri: "Connecting farm devices to cloud advisory & market platforms",
        energy: "Remote asset monitoring & automated demand-response control",
        digital: "API integration, MQTT/LoRaWAN protocols & IoT platform management"
    },
    "Data Analysis": {
        agri: "Yield trend tracking & supply chain performance",
        energy: "Consumption pattern analysis & outage reporting",
        digital: "User behaviour analytics, A/B testing & BI dashboards"
    },
    "Data Science": {
        agri: "Crop disease prediction models & climate risk scoring",
        energy: "Demand forecasting & renewable output prediction",
        digital: "ML pipelines, NLP & recommendation systems"
    },
    "Machine Learning": {
        agri: "Pest & disease detection from field images",
        energy: "Load balancing & predictive maintenance models",
        digital: "Personalisation engines & churn prediction"
    },
    "Project Mgmt": {
        agri: "Supply chain coordination & agri value chain rollout",
        energy: "Infrastructure deployment, subcontractor management & commissioning",
        digital: "Agile sprint planning, stakeholder reporting & product delivery"
    },
    "Mobile Money API": {
        agri: "Farmer payments & micro-insurance disbursement",
        energy: "Pay-as-you-go (PAYG) solar integration",
        digital: "E-commerce checkout & digital wallet integration"
    },
    "Drone Ops": {
        agri: "Crop spraying & multispectral field imaging",
        energy: "Power line & wind turbine inspection",
        digital: "Delivery logistics & aerial surveying"
    },
    "Data Viz": {
        agri: "Yield maps, dashboards & seasonal briefings",
        energy: "Consumption patterns & outage heat-maps",
        digital: "Business intelligence dashboards & investor decks"
    },
    "Cloud Computing": {
        agri: "Hosting farm management platforms & sensor data lakes",
        energy: "Centralised grid data storage & SCADA integrations",
        digital: "Scalable SaaS infrastructure & serverless deployments"
    },
    "Cybersecurity": {
        agri: "Protecting farm data & supply chain integrity",
        energy: "Securing critical grid infrastructure (SCADA/ICS)",
        digital: "Data privacy, secure APIs & transaction protection"
    },
    "AI": {
        agri: "Crop disease detection & yield prediction",
        energy: "Grid load forecasting & renewable optimisation",
        digital: "Personalisation, chatbots & process automation"
    },
    "Web Dev": {
        agri: "E-commerce platforms for produce & cooperative portals",
        energy: "Customer self-service portals for utility payment",
        digital: "SaaS applications, APIs & consumer-facing websites"
    },
    "Digital Marketing": {
        agri: "Market access, WhatsApp trade & social media sales",
        energy: "Customer acquisition for off-grid solar home systems",
        digital: "SEO, content strategy, paid media & campaign analytics"
    },
    "Financial Literacy": {
        agri: "Farm budgeting, input credit & loan application readiness",
        energy: "PAYG payment planning & solar ROI calculation",
        digital: "Unit economics (CAC/LTV), runway management & cash flow"
    }
};

// --- 13. Specific Job Titles Mapping ---
const specificJobTitles = {
    agri: {
        "Soil Analysis": ["Soil Scientist", "Agronomist", "Lab Technician", "Field Researcher"],
        "IoT Sensors": ["Farm IoT Specialist", "Precision Ag Tech", "Sensor Network Engineer", "Smart Farm Manager"],
        "GIS Mapping": ["GIS Analyst", "Spatial Data Scientist", "Land Surveyor", "Cartographer"],
        "Python": ["Agri-Data Analyst", "Crop Modeller", "Research Scientist", "Bioinformatics Assistant"],
        "Mobile Money API": ["Agri-FinTech Integrator", "Digital Extension Lead", "Payment Systems Support", "Technical Agent"],
        "Logistics": ["Cold Chain Manager", "Supply Chain Coordinator", "Fleet Manager", "Distribution Lead"],
        "Climate Modeling": ["Climate Risk Analyst", "Adaptation Specialist", "Carbon Credit Auditor", "Met Data Officer"],
        "Remote Sensing": ["Drone Data Analyst", "Satellite Imagery Expert", "Geospatial Tech", "Surveyor"],
        "Inventory Mgmt": ["Warehouse Manager", "Input Supply Coordinator", "Stock Controller", "Procurement Officer"],
        "Data Viz": ["M&E Officer", "Impact Analyst", "Agri-Reporting Specialist", "Program Coordinator"],
        "Crop Science": ["Seed Technologist", "Field Trials Officer", "Plant Breeder", "Extension Officer"],
        "Drone Ops": ["UAV Pilot", "Aerial Surveyor", "Crop Spraying Tech", "Flight Planner"]
    },
    energy: {
        "Electrical Wiring": ["Solar Installer", "Industrial Electrician", "Grid Technician", "Panel Assembler"],
        "Solar PV": ["Solar Design Engineer", "O&M Technician", "PV Systems Integrator", "Site Assessor"],
        "SCADA": ["Control Room Operator", "Automation Engineer", "Grid Systems Analyst", "Tele-control Tech"],
        "Safety Protocols": ["HSE Officer", "Site Safety Inspector", "Compliance Manager", "Risk Assessor"],
        "AutoCAD": ["CAD Draughtsman", "Solar Layout Designer", "Technical Illustrator", "Schematic Technician"],
        "Grid Mgmt": ["Distribution Engineer", "Load Dispatcher", "Network Planner", "Substation Operator"],
        "Energy Efficiency": ["Energy Auditor", "Green Building Consultant", "Retrofit Specialist", "Sustainability Officer"],
        "Project Mgmt": ["Renewable Project Manager", "Site Supervisor", "Construction Lead", "Operations Manager"],
        "Thermodynamics": ["Geothermal Engineer", "Thermal Systems Analyst", "HVAC Technician", "Plant Operator"],
        "Regulatory Compl.": ["Policy Analyst", "Tariff Specialist", "Licensing Officer", "Legal Compliance Officer"],
        "Data Analysis": ["Smart Meter Analyst", "Revenue Protection Officer", "Energy Data Scientist", "Demand Planner"],
        "Field Ops": ["Maintenance Technician", "Field Service Engineer", "Site Operator", "Rapid Response Team"]
    },
    digital: {
        "Python": ["Backend Developer", "Data Scientist", "AI Engineer", "Scripting Specialist"],
        "JavaScript": ["Frontend Developer", "Full Stack Engineer", "Web App Developer", "React Native Dev"],
        "AWS/Azure": ["Cloud Architect", "DevOps Engineer", "Site Reliability Eng.", "SysAdmin"],
        "SQL": ["Database Administrator", "BI Developer", "Data Analyst", "Reporting Specialist"],
        "React": ["UI Engineer", "Frontend Specialist", "Interactive Designer", "Mobile App Dev"],
        "Cybersecurity": ["SOC Analyst", "Penetration Tester", "Security Engineer", "Network Defender"],
        "Machine Learning": ["ML Ops Engineer", "AI Researcher", "NLP Specialist", "Computer Vision Eng."],
        "User Research": ["UX Researcher", "Product Designer", "CX Lead", "Usability Tester"],
        "Agile": ["Scrum Master", "Product Owner", "Delivery Manager", "Technical Project Mgr"],
        "DevOps": ["Platform Engineer", "Release Manager", "Automation Architect", "Build Engineer"],
        "API Design": ["Integration Specialist", "Backend Engineer", "Software Architect", "Technical Lead"],
        "Figma": ["UI/UX Designer", "Product Designer", "Interaction Designer", "Visual Designer"]
    }
};

// --- 14. Regional Hotspots ---
const skillHotspots = {
    agri: {
        "Soil Analysis": "High demand in the <strong>Rift Valley (Kenya)</strong> and <strong>SAGCOT region (Tanzania)</strong> within large commercial estates (Tea/Coffee).",
        "IoT Sensors": "Rapid adoption in export-grade <strong>Horticulture</strong> farms in <strong>Naivasha</strong> and smart-irrigation projects.",
        "GIS Mapping": "Critical for <strong>County Government</strong> land registries and regional urban planning departments across the EAC.",
        "Python": "Central to <strong>Nairobi's AgTech startups</strong> building credit scoring models and crop yield prediction platforms.",
        "Mobile Money API": "Ubiquitous demand across <strong>FinTech hubs</strong> in Nairobi, Kampala, and Dar es Salaam for rural payment integration.",
        "Logistics": "Critical for <strong>Horticulture & Dairy (Cold Chain)</strong>. Less relevant for Cereal/Maize belts unless for export.",
        "Climate Modeling": "Key for Insurance companies in <strong>Nairobi</strong> and regional meteorological departments.",
        "Remote Sensing": "Used extensively by NGOs and development agencies monitoring food security in <strong>Northern Kenya</strong> and <strong>Karamoja (Uganda)</strong>.",
        "Inventory Mgmt": "Essential for Agri-input distributors and warehouse receipt systems (Maize/Grains) in <strong>Eldoret</strong> and <strong>Kitale</strong>.",
        "Data Viz": "Sought after by Impact Investors and donor-funded programs headquartered in <strong>Nairobi</strong> and <strong>Kigali</strong>.",
        "Crop Science": "Research institutes like <strong>KALRO</strong> and seed companies in the <strong>Western Kenya</strong> maize belt.",
        "Drone Ops": "Growing demand for crop spraying and mapping in large-scale plantations in <strong>Kilifi</strong> and <strong>Central Province</strong>."
    },
    energy: {
        "Electrical Wiring": "Universal demand, peaking in <strong>urban construction booms</strong> (Nairobi, Kigali) and industrial zones.",
        "Solar PV": "Booming in off-grid counties (e.g., <strong>Turkana, Marsabit</strong>) and for commercial rooftop installations in industrial areas.",
        "SCADA": "Concentrated in National Control Centers and geothermal fields in <strong>Olkaria (Naivasha)</strong>.",
        "Safety Protocols": "Strictly enforced in oil & gas exploration zones and large infrastructure projects across the region.",
        "AutoCAD": "Standard requirement for EPC contractors and engineering consultancies in major cities.",
        "Grid Mgmt": "National utility headquarters (e.g., <strong>KPLC, TANESCO</strong>) and rural electrification agencies.",
        "Energy Efficiency": "Growing in manufacturing hubs (e.g., <strong>Athiriver, Jinja</strong>) seeking to reduce production costs.",
        "Project Mgmt": "High demand for rural electrification programs funded by World Bank/AfDB across <strong>rural East Africa</strong>.",
        "Thermodynamics": "Niche but critical demand in <strong>Rift Valley geothermal</strong> power plants.",
        "Regulatory Compl.": "Energy ministries and regulatory bodies (EPRA, EWURA) in capital cities.",
        "Data Analysis": "Revenue protection units within utilities and pay-as-you-go solar companies.",
        "Field Ops": "Remote sites across the region; high mobility required for maintenance technicians."
    },
    digital: {
        "Python": "The backbone of the <strong>'Silicon Savannah' (Nairobi)</strong>, Kigali Innovation City, and Kampala's tech ecosystem.",
        "JavaScript": "The most common requirement for web development agencies and startups in <strong>all major urban centers</strong>.",
        "AWS/Azure": "Enterprise usage in the Banking and Telco sectors (e.g., <strong>Equity Bank, Safaricom</strong>).",
        "SQL": "Foundational for data teams in established corporations and government revenue authorities.",
        "React": "Preferred by product-led startups in <strong>Westlands (Nairobi)</strong> and <strong>Norrsken House (Kigali)</strong>.",
        "Cybersecurity": "Critical hotspot in the <strong>Financial Services</strong> sector and Government e-citizen platforms.",
        "Machine Learning": "Innovation hubs and research labs (e.g., <strong>IBM Research, Google</strong>) in Nairobi.",
        "User Research": "FinTech product teams focusing on financial inclusion for the unbanked population.",
        "Agile": "Standard operational model for software development houses across the region.",
        "DevOps": "High demand in scale-up tech companies handling high-traffic platforms.",
        "API Design": "Essential for the <strong>Open Banking</strong> and mobile money integration ecosystem.",
        "Figma": "Digital agencies and product design studios in creative hubs."
    }
};

// --- 15. Signal Resources (Resource Modal) ---
const signalResources = {
    agri: {
        'Sector Value-Chain Gaps': [
            { title: "FAOSTAT Value Chain", desc: "Global food and agriculture data.", link: "https://www.fao.org/faostat/en/#data" },
            { title: "World Bank Agriculture", desc: "Data on agricultural development.", link: "https://data.worldbank.org/topic/agriculture" },
            { title: "World Bank Skills Demand", desc: "Cognitive & technical skills data.", link: "https://datatopics.worldbank.org/education/w/skills" },
            { title: "AU Digital Strategy", desc: "Agri-tech transformation indicators.", link: "https://au.int/en/documents/20200518/digital-transformation-strategy-africa-2020-2030" }
        ],
        'Innovation Investments/Grants': [
            { title: "AgFunder News", desc: "AgriFoodTech investment news and reports.", link: "https://agfundernews.com/" },
            { title: "Briter Bridges", desc: "Innovation ecosystem intelligence in Africa.", link: "https://briterbridges.com/" },
            { title: "AECF", desc: "Africa Enterprise Challenge Fund.", link: "https://www.aecfafrica.org/" },
            { title: "Heifer International", desc: "Grants for youth in agriculture.", link: "https://www.heifer.org/" }
        ]
    },
    energy: {
        'Sector Value-Chain Gaps': [
            { title: "SEforALL Knowledge Hub", desc: "Sustainable Energy for All data.", link: "https://www.seforall.org/data-and-evidence" },
            { title: "IRENA Data", desc: "Renewable energy statistics.", link: "https://www.irena.org/Data" }
        ],
        'Innovation Investments/Grants': [
            { title: "GOGLA Resources", desc: "Off-grid solar market reports.", link: "https://www.gogla.org/resources" },
            { title: "EEP Africa", desc: "Clean energy financing.", link: "https://eepafrica.org/" },
            { title: "Kenya Climate Ventures", desc: "Climate-smart investment.", link: "https://kcv.co.ke/" },
            { title: "All On", desc: "Impact investing for energy access.", link: "https://www.all-on.com/" }
        ]
    },
    digital: {
        'Sector Value-Chain Gaps': [
            { title: "ITU DataHub", desc: "ICT statistics and data.", link: "https://datahub.itu.int/" },
            { title: "GSMA Mobile Economy", desc: "Mobile industry data and analysis.", "link": "https://www.gsma.com/mobileeconomy/sub-saharan-africa/" },
            { title: "UNESCO UIS", desc: "Science, Tech & Innovation data.", "link": "http://uis.unesco.org/" },
            { title: "World Bank Skills", desc: "Digital skills demand metrics.", "link": "https://datatopics.worldbank.org/education/w/skills" }
        ],
        'Innovation Investments/Grants': [
            { title: "Partech Africa", desc: "Tech investment reports.", link: "https://partechpartners.com/africa-reports/" },
            { title: "Disrupt Africa", desc: "Startup news and investment reports.", link: "https://disrupt-africa.com/" },
            { title: "TLcom Capital", desc: "Tech VC for Africa.", link: "https://tlcomcapital.com/" },
            { title: "Ajim Capital", desc: "Pre-seed/Seed funding for African tech.", link: "https://ajimcapital.com/" }
        ]
    }
};

// --- 16. Venture Regulations ---
const ventureRegulations = {
    // Agri
    "Smart-irrigation services": "Water Abstraction Permit, Business License",
    "Agri-advisory micro-enterprises": "Agri-Service Provider Reg. (County)",
    "Input retail + soil testing hubs": "Agro-dealer License (KEPHIS/TPRI)",
    "Cold-chain & post-harvest logistics": "Food Hygiene Cert, Transport License",
    "Value-added food processing": "Food Safety Cert (KEBS/TBS/UNBS)",
    "Organic fertilizer production": "NEMA EIA License, Bureau of Standards",
    "Digital marketplace for produce": "Data Protection Reg., Business Permit",
    "Mechanization-as-a-service": "Business Permit, Insurance",
    "Climate-risk info services": "Met Dept Authorization (if applicable)",
    "Women-led horticulture enterprises": "Horticultural Crops Directorate Reg.",
    // Energy
    "Mini-grid O&M micro-enterprises": "EPRA/EWURA/ERA Class C1/C2 License",
    "Solar-home-system retail & servicing": "Solar PV License (T1/T2)",
    "Battery refurbishment / recycling services": "NEMA Hazardous Waste License",
    "Appliance distribution for productive use": "Standard Business Permit",
    "Energy-efficient cooking / biogas solutions": "NEMA Approval (Biogas)",
    "Rooftop / institutional solar integrators": "Solar PV License (T3), NCA/CRB",
    "Renewable energy audit & consulting": "Energy Auditor License (A/B)",
    "E-mobility charging & conversion services": "EV Charging Station License",
    "Solar irrigation system integrators": "Solar PV License, Water Permit",
    "Renewable-energy training & certification centres": "TVET/NITA Accreditation",
    // Digital
    "Data analytics & dashboard services for MSMEs": "Data Protection Reg. (ODPC)",
    "No-code app / automation micro-agency": "Standard Business Permit",
    "Digital-marketing / e-commerce agency": "Standard Business Permit",
    "AI-enabled content / translation services": "Standard Business Permit",
    "Tech support / cyber-safety services for SMEs": "Standard Business Permit",
    "Cloud integration / migration consulting": "Vendor Certs (AWS/Azure Partner)",
    "Digital-skills bootcamp / training hub": "Education/TVET Registration",
    "Agritech/healthtech data platforms": "Data Protection, Sector License",
    "Freelance AI model-labeling / annotation teams": "Standard Business Permit",
    "Remote-work co-ops / talent collectives": "Co-operative Society Reg."
};

// --- 17. Venture Challenges ---
const ventureChallenges = {
    // Agri
    "Smart-irrigation services": "High upfront equipment cost for farmers; theft risk of pumps.",
    "Agri-advisory micro-enterprises": "Monetization difficulty; building trust with farmers.",
    "Input retail + soil testing hubs": "Counterfeit products in market; seasonal cash flow.",
    "Cold-chain & post-harvest logistics": "High energy costs; road infrastructure reliability.",
    "Value-added food processing": "Strict food safety compliance; packaging sourcing.",
    "Organic fertilizer production": "Slow adoption vs chemical fertilizers; consistency.",
    "Digital marketplace for produce": "Side-selling by farmers; logistics coordination.",
    "Mechanization-as-a-service": "Equipment breakdown costs; seasonality of demand.",
    "Climate-risk info services": "Data accuracy at micro-level; willingness to pay.",
    "Women-led horticulture enterprises": "Access to land/finance; labor intensity.",
    // Energy
    "Mini-grid O&M micro-enterprises": "Remote site access costs; payment collection.",
    "Solar-home-system retail & servicing": "Last-mile distribution; customer credit risk.",
    "Battery refurbishment / recycling services": "Hazardous material handling; compliance costs.",
    "Appliance distribution for productive use": "High capital for stock; consumer financing needs.",
    "Energy-efficient cooking / biogas solutions": "Cultural cooking habits; feedstock availability.",
    "Rooftop / institutional solar integrators": "Long sales cycles (B2B); client financing.",
    "Renewable energy audit & consulting": "Niche market awareness; regulatory enforcement.",
    "E-mobility charging & conversion services": "Grid reliability; high battery replacement costs.",
    "Solar irrigation system integrators": "System sizing complexity; water table risks.",
    "Renewable-energy training & certification centres": "Accreditation bureaucracy; lab equipment costs.",
    // Digital
    "Data analytics & dashboard services for MSMEs": "Client data quality; explaining ROI to MSMEs.",
    "No-code app / automation micro-agency": "Client scope creep; platform dependency risks.",
    "Digital-marketing / e-commerce agency": "Crowded market; demonstrating clear attribution.",
    "AI-enabled content / translation services": "Quality control of AI outputs; context loss.",
    "Tech support / cyber-safety services for SMEs": "Clients undervalue prevention; emergency stress.",
    "Cloud integration / migration consulting": "High technical barrier; data privacy liability.",
    "Digital-skills bootcamp / training hub": "Student placement rates; curriculum relevance.",
    "Agritech/healthtech data platforms": "User adoption barriers; data privacy compliance.",
    "Freelance AI model-labeling / annotation teams": "Global wage competition; repetitive tasks.",
    "Remote-work co-ops / talent collectives": "International payment processing; time zones."
};

// --- 18. Pathway Quiz Options ---
const pathwayQuizOptions = {
    agri: [
        { id: 'tech', title: "Technology & Data", desc: "I like using drones, sensors, and software to solve problems.", icon: "cpu" },
        { id: 'field', title: "Field & Crops", desc: "I prefer working outdoors with plants, soil, and farmers.", icon: "leaf" },
        { id: 'biz', title: "Business & Trade", desc: "I enjoy selling products, managing logistics, and finding markets.", icon: "briefcase" }
    ],
    energy: [
        { id: 'hands-on', title: "Installation & Fixes", desc: "I like working with my hands, wiring systems, and fixing equipment.", icon: "wrench" },
        { id: 'design', title: "Design & Engineering", desc: "I enjoy planning systems, calculating loads, and technical drawing.", icon: "pen-tool" },
        { id: 'mgmt', title: "Management & Audit", desc: "I prefer managing projects, checking compliance, and analyzing usage.", icon: "clipboard-check" }
    ],
    digital: [
        { id: 'code', title: "Building & Coding", desc: "I want to create websites, apps, and software logic.", icon: "code" },
        { id: 'data', title: "Data & Logic", desc: "I like finding patterns in numbers and training AI models.", icon: "database" },
        { id: 'creative', title: "Design & Strategy", desc: "I enjoy designing user interfaces and planning product features.", icon: "palette" }
    ]
};

// --- 23. Static CV Tools ---
const staticCVTools = [
    { title: "Canva Templates", desc: "Free, design-focused CV layouts.", link: "https://www.canva.com/resumes/templates/", icon: "layout" },
    { title: "Resume Worded", desc: "AI scoring for your CV content.", link: "https://resumeworded.com/", icon: "check-circle" },
    { title: "LinkedIn Career Explorer", desc: "Skills-based career transition tool.", link: "https://linkedin.github.io/career-explorer/", icon: "shuffle" },
    { title: "ESCO Skills Cloud", desc: "EU Skills & Occupations Framework.", link: "https://esco.ec.europa.eu/en", icon: "globe" },
    { title: "CareerVillage Coach", desc: "Personalized AI Career Coach.", link: "https://www.careervillage.org/", icon: "message-circle" }
];

// --- 25. Country ISO Map ---
const countryISOMap = {
    'Kenya': 'KEN', 'Tanzania': 'TZA', 'Uganda': 'UGA', 'Rwanda': 'RWA',
    'Burundi': 'BDI', 'South Sudan': 'SSD', 'DRC': 'COD', 'DR Congo': 'COD', 'Democratic Republic of Congo': 'COD', 'Somalia': 'SOM', 
    'Nigeria': 'NGA', 'South Africa': 'ZAF', 'all': 'KEN'
};

// --- 26. Fallback Ventures (Full set — mirrors ventures.json for offline/file:// use) ---
const fallbackVentures = [
    { "country": "All", "sector": "agri", "rank": 1, "title": "Smart-irrigation services", "description": "Low-cost drip systems, sensors, and solar pumps. Viable due to high training density in irrigation + renewable energy cross-skills.", "competencies": "Irrigation Tech, Renewable Integration", "capital": "Medium ($2k-$5k)" },
    { "country": "All", "sector": "agri", "rank": 2, "title": "Agri-advisory micro-enterprises", "description": "Mobile / WhatsApp advisory groups. Viable due to skills gap in extension/advisory and high smartphone adoption.", "competencies": "Advisory Agent, Digital Literacy", "capital": "Low (<$500)" },
    { "country": "All", "sector": "agri", "rank": 3, "title": "Input retail + soil testing hubs", "description": "Agro-dealer networks with soil testing. Viable due to existing networks and strong SME potential.", "competencies": "Soil Testing, Sales & Distribution", "capital": "Medium ($5k-$10k)" },
    { "country": "All", "sector": "agri", "rank": 4, "title": "Cold-chain & post-harvest logistics", "description": "Logistics to reduce losses. Viable due to persistent losses and training availability on post-harvest management.", "competencies": "Cold-chain Tech, Supply Chain", "capital": "High ($10k+)" },
    { "country": "All", "sector": "agri", "rank": 5, "title": "Value-added food processing", "description": "Drying and packaging. Viable as it is gender-inclusive and aligns with TVET modules.", "competencies": "Food Safety, Processing Tech", "capital": "Medium ($2k-$8k)" },
    { "country": "All", "sector": "agri", "rank": 6, "title": "Organic fertilizer production", "description": "Bio-inputs production. Viable due to circular-economy demand and training supply gap.", "competencies": "Composting, Micro-biotech", "capital": "Low ($1k-$3k)" },
    { "country": "All", "sector": "agri", "rank": 7, "title": "Digital marketplace for produce", "description": "Agri-e-commerce platforms. Viable due to growth in platform data.", "competencies": "E-commerce, Market Analytics", "capital": "Low (<$1k)" },
    { "country": "All", "sector": "agri", "rank": 8, "title": "Mechanization-as-a-service", "description": "Tractor / drone hire. Viable due to existing micro-leasing pilots.", "competencies": "Mechanization, Maintenance", "capital": "High ($15k+)" },
    { "country": "All", "sector": "agri", "rank": 9, "title": "Climate-risk info services", "description": "Weather services. Viable due to high regional investment in agri-data.", "competencies": "GIS, Data Analysis", "capital": "Low ($1k-$5k)" },
    { "country": "All", "sector": "agri", "rank": 10, "title": "Women-led horticulture enterprises", "description": "Seedling enterprises. Viable due to youth/women training overlap.", "competencies": "Agribusiness Mgmt, Gender Lens", "capital": "Low (<$1k)" },
    { "country": "All", "sector": "energy", "rank": 1, "title": "Mini-grid O&M micro-enterprises", "description": "High installation growth, weak maintenance capacity.", "competencies": "Electrical Tech, Safety Standards", "capital": "Medium ($2k-$5k)" },
    { "country": "All", "sector": "energy", "rank": 2, "title": "Solar-home-system retail & servicing", "description": "Training density + consumer demand.", "competencies": "PV Installation, Sales", "capital": "Low ($500-$2k)" },
    { "country": "All", "sector": "energy", "rank": 3, "title": "Battery refurbishment / recycling services", "description": "Skills overlap in energy storage.", "competencies": "Battery Tech, Circular Economy", "capital": "High ($10k+)" },
    { "country": "All", "sector": "energy", "rank": 4, "title": "Appliance distribution for productive use", "description": "Strong link with agri-processing / MSMEs.", "competencies": "Energy Sales, Agribusiness", "capital": "Medium ($5k-$10k)" },
    { "country": "All", "sector": "energy", "rank": 5, "title": "Energy-efficient cooking / biogas solutions", "description": "Climate mitigation + rural adoption.", "competencies": "Clean-Cooking Tech, Marketing", "capital": "Low ($1k-$3k)" },
    { "country": "All", "sector": "energy", "rank": 6, "title": "Rooftop / institutional solar integrators", "description": "Emerging urban market.", "competencies": "PV Design, Project Dev", "capital": "High ($15k+)" },
    { "country": "All", "sector": "energy", "rank": 7, "title": "Renewable energy audit & consulting", "description": "Growing regulatory compliance needs.", "competencies": "Energy Audit, Policy", "capital": "Low (<$1k)" },
    { "country": "All", "sector": "energy", "rank": 8, "title": "E-mobility charging & conversion services", "description": "Early growth segment.", "competencies": "EV Systems, Entrepreneurship", "capital": "High ($20k+)" },
    { "country": "All", "sector": "energy", "rank": 9, "title": "Solar irrigation system integrators", "description": "Agritech synergy – high demand.", "competencies": "PV Pumps, Irrigation", "capital": "Medium ($5k-$10k)" },
    { "country": "All", "sector": "energy", "rank": 10, "title": "Renewable-energy training & certification centres", "description": "Workforce expansion requirement.", "competencies": "Pedagogical, Technical Train-the-Trainer", "capital": "High ($10k+)" },
    { "country": "All", "sector": "digital", "rank": 1, "title": "Data analytics & dashboard services for MSMEs", "description": "Strong demand for local data insights.", "competencies": "Data Analysis, Visualization", "capital": "Low (<$1k)" },
    { "country": "All", "sector": "digital", "rank": 2, "title": "No-code app / automation micro-agency", "description": "Low-code tool adoption rising.", "competencies": "No-code Dev, Client Ops", "capital": "Low (<$1k)" },
    { "country": "All", "sector": "digital", "rank": 3, "title": "Digital-marketing / e-commerce agency", "description": "Rapid SME digitalization.", "competencies": "SEO, Campaign Mgmt", "capital": "Low (<$1k)" },
    { "country": "All", "sector": "digital", "rank": 4, "title": "AI-enabled content / translation services", "description": "Regional language data scarcity.", "competencies": "NLP, Localization", "capital": "Low ($1k-$3k)" },
    { "country": "All", "sector": "digital", "rank": 5, "title": "Tech support / cyber-safety services for SMEs", "description": "Security skills gap.", "competencies": "IT Support, Cyber Basics", "capital": "Low ($500-$2k)" },
    { "country": "All", "sector": "digital", "rank": 6, "title": "Cloud integration / migration consulting", "description": "Enterprise adoption of SaaS.", "competencies": "Cloud Ops, Project Mgmt", "capital": "Low (<$1k)" },
    { "country": "All", "sector": "digital", "rank": 7, "title": "Digital-skills bootcamp / training hub", "description": "Youth upskilling demand.", "competencies": "Instructional Design, Mentorship", "capital": "Medium ($5k-$10k)" },
    { "country": "All", "sector": "digital", "rank": 8, "title": "Agritech/healthtech data platforms", "description": "Cross-sector innovation driver.", "competencies": "Data Engineering, Domain Knowledge", "capital": "High ($10k+)" },
    { "country": "All", "sector": "digital", "rank": 9, "title": "Freelance AI model-labeling / annotation teams", "description": "Expanding AI data pipeline demand.", "competencies": "Data Curation, Ethics", "capital": "Low (<$500)" },
    { "country": "All", "sector": "digital", "rank": 10, "title": "Remote-work co-ops / talent collectives", "description": "Gig-economy trend, shared infrastructure.", "competencies": "Platform Mgmt, Co-op Gov", "capital": "Low ($1k-$3k)" }
];

// --- 30. Sector Map ---
const sectorMap = {
    'agri': 'Agriculture',
    'energy': 'Renewables',
    'digital': 'Digital/AI',
};

// --- 31. Outcome Scorecard Configuration ---
const outcomeScorecardConfig = {
    verified: ['Moringa', 'ALX', 'Refactory', 'Strathmore', 'CMU', 'Coursera', 'Google'],
    online: ['Coursera', 'Google', 'edX', 'AWS', 'atingi']
};

// --- 32. Role Snapshot Configuration ---
const roleSnapshotConfig = {
    agri: {
        bestFor: "Outdoorsy, patient, and analytical",
        envs: "Rural farms, peri-urban sites, processing zones"
    },
    energy: {
        bestFor: "Safety-conscious, precise, and technical",
        envs: "Remote sites, rooftops, utility plants"
    },
    digital: {
        bestFor: "Logical, creative, and detail-oriented",
        envs: "Urban offices, co-working hubs, remote"
    },
    default: {
        bestFor: "Adaptable problem-solvers",
        envs: "Office & Site visits"
    }
};

// --- 35. Role Specific Snapshots (Contextualized At-a-Glance) ---
const roleSpecificSnapshots = {
    // Agri
    "Digital Extension Officer": { bestFor: "Tech-savvy communicators", envs: "Rural communities, field visits" },
    "Precision Ag Specialist": { bestFor: "Data-driven problem solvers", envs: "Large farms, GIS labs" },
    "Drone Pilot": { bestFor: "Focused & detail-oriented", envs: "Remote fields, flight stations" },
    "Soil Data Analyst": { bestFor: "Analytical & scientific", envs: "Laboratories, research centers" },
    "Farm Services Operator": { bestFor: "Hands-on & entrepreneurial", envs: "Various farm sites, workshops" },
    "Irrigation Technician": { bestFor: "Practical & technical", envs: "Greenhouses, open fields" },
    "Agro-Processing Technician": { bestFor: "Process-oriented & hygienic", envs: "Processing plants, factories" },
    "Post-Harvest Specialist": { bestFor: "Logistical & quality-focused", envs: "Packhouses, cold storage" },
    "Aquaculture Farm Technician": { bestFor: "Observant & patient", envs: "Fish ponds, hatcheries" },
    "Fisheries Compliance Officer": { bestFor: "Principled & firm", envs: "Lakesides, patrol boats" },
    // Energy
    "Solar PV Installer": { bestFor: "Physically fit & safety-conscious", envs: "Rooftops, remote sites" },
    "Grid Systems Engineer": { bestFor: "Systems thinkers", envs: "Control rooms, substations" },
    "Energy Auditor": { bestFor: "Investigative & analytical", envs: "Industrial plants, commercial buildings" },
    "Geothermal Technician": { bestFor: "Technical & resilient", envs: "Power plants, steam fields" },
    "Wind Turbine Tech": { bestFor: "Unafraid of heights", envs: "Wind farms, nacelles" },
    "Energy Policy Analyst": { bestFor: "Strategic & articulate", envs: "Government offices, boardrooms" },
    "Smart Meter Tech": { bestFor: "Mobile & technical", envs: "Residential areas, utility depots" },
    "Project Manager": { bestFor: "Organized leaders", envs: "Construction sites, offices" },
    "Safety Inspector": { bestFor: "Vigilant & detail-oriented", envs: "Construction sites, power plants" },
    "Bioenergy Specialist": { bestFor: "Innovative & scientific", envs: "Biogas plants, waste facilities" },
    // Digital
    "Data Scientist": { bestFor: "Curious & mathematical", envs: "Tech hubs, remote work" },
    "Cloud Architect": { bestFor: "Strategic & structural", envs: "Corporate offices, data centers" },
    "Cybersecurity Analyst": { bestFor: "Vigilant & investigative", envs: "SOCs, secure offices" },
    "Frontend Dev": { bestFor: "Creative & visual", envs: "Design studios, remote" },
    "Backend Dev": { bestFor: "Logical & efficient", envs: "Tech startups, remote" },
    "UX/UI Designer": { bestFor: "Empathetic & artistic", envs: "Creative agencies, co-working spaces" },
    "AI/ML Engineer": { bestFor: "Innovative & abstract thinkers", envs: "Research labs, tech hubs" },
    "Product Manager": { bestFor: "Visionary & collaborative", envs: "Cross-functional teams" },
    "DevOps Engineer": { bestFor: "Automation-focused", envs: "Cloud environments, remote" },
    "Digital Marketer": { bestFor: "Persuasive & analytical", envs: "Marketing agencies, remote" }
};

// --- 33. Credential Rules (Regulatory Logic) ---
const credentialRules = {
    energy: {
        common: ["NABCEP Associate (Solar PV) - Global Benchmark", "OSHA / DOSH Safety Certification"],
        conditional: [
            { keywords: ['Wind', 'Field'], text: "GWO Basic Safety Training (BST)" }
        ],
        countries: {
            Kenya: [
                { keywords: ['Solar', 'Installer', 'Technician', 'Tech'], text: "EPRA Solar PV License (Class T1/T2/T3)" },
                { keywords: ['Electrician', 'Grid'], text: "EPRA Electrician License (Class C2/C1)" },
                { keywords: ['Engineer'], text: "EBK (Engineers Board of Kenya) Registration" }
            ],
            Tanzania: [
                { keywords: ['Solar', 'Electrician'], text: "EWURA Electricity Installation License" },
                { keywords: ['Engineer'], text: "ERB (Engineers Registration Board) Certification" }
            ],
            Uganda: [
                { keywords: ['Solar', 'Electrician'], text: "ERA Installation Permit (Class D/Z)" },
                { keywords: ['Engineer'], text: "ERB Registration" }
            ]
        },
        defaultCountry: ["National Energy Regulator License (e.g., EPRA, EWURA, ERA)"]
    },
    agri: {
        conditional: [
            { keywords: ['Extension', 'Agronomist'], text: "Ministry of Agriculture Accreditation" }
        ]
    },
    digital: {
        conditional: [
            { keywords: ['Security'], text: "Certified Ethical Hacker (CEH) / CISSP" },
            { keywords: ['Cloud'], text: "Vendor Certifications (AWS/Azure)" }
        ]
    }
};

// --- 34. Sector Card Config ---
const sectorCardConfig = [
    { id: 'agri', name: 'Agritech', icon: 'leaf', color: 'green', growth: 'High Growth' },
    { id: 'energy', name: 'Renewable Energy', icon: 'zap', color: 'orange', growth: 'High Demand' },
    { id: 'digital', name: 'Digital Economy', icon: 'cpu', color: 'indigo', growth: 'Exponential' }
];

// --- 35. Sector Themes ---
const sectorThemes = {
    agri: { color: 'green', feedback: "Solid alignment with Agritech standards." },
    energy: { color: 'orange', feedback: "Meets renewable energy competency baselines." },
    digital: { color: 'indigo', feedback: "Strong digital literacy demonstrated." },
};

// --- 36. Pathway Constraints ---
const pathwayConstraints = [
    { id: 'time', label: 'Time Commitment', options: ['< 1 Month', '1-3 Months', '3-6 Months', '6+ Months'] },
    { id: 'budget', label: 'Budget', options: ['Free', 'Low Cost', 'Paid'] },
    { id: 'mode', label: 'Learning Mode', options: ['Online', 'In-Person', 'Hybrid'] }
];

// --- 37. Pathway Goals ---
const pathwayGoals = [
    { "title": "Build My Foundation", "desc": "I want to strengthen my core skills before applying for roles or placements.", "icon": "layers" },
    { "title": "Apprenticeships and Job Placements", "desc": "I want to gain hands-on experience through a structured apprenticeship or workplace placement.", "icon": "users" },
    { "title": "Entry Level Job", "desc": "I want to find my first job in the sector and start building my career.", "icon": "briefcase" },
    { "title": "Start my own Venture", "desc": "I want to launch a business or freelance venture.", "icon": "rocket" },
];

// --- 38. Interview Questions ---
const interviewQuestions = {
    agri: "Describe a time you used data to improve a crop yield or farm process.",
    energy: "How do you ensure safety compliance when installing a new system?",
    digital: "Tell me about a challenging bug you fixed and your process.",
};

// --- 39. Sector Tooltips ---
const sectorTooltips = {
    agri: "Metrics: Job Growth (High), Tech Adoption (Rapid). Key focus on precision ag and value addition.",
    energy: "Metrics: Investment (Very High), Skills Gap (Critical). Focus on solar, wind, and grid stability.",
    digital: "Metrics: Remote Work (High), Salary (Competitive). Focus on software, data, and AI.",
};

// --- 36. Venture Playbooks ---
const venturePlaybooks = {
    agri: {
        reg: "KEPHIS (Seeds), PCPB (Chemicals), County Business Permit",
        economics: "Yield/Acre vs Input Cost",
        pricing: "Commission on Produce (5-10%) or Input Margin",
        gtm: "Farmer Co-ops, Aggregators, USSD/SMS Blasts"
    },
    energy: {
        reg: "EPRA Solar License (T1/T2), ERC Class C1",
        economics: "Hardware Payback Period (PAYG)",
        pricing: "Deposit (15%) + Daily Rate (KES 50)",
        gtm: "Door-to-door Agents, SACCO Partnerships"
    },
    digital: {
        reg: "Data Protection (ODPC), Copyright/IP",
        economics: "CAC < LTV (3:1 Ratio)",
        pricing: "Freemium, Tiered Subscription (SaaS)",
        gtm: "SEO/Content, LinkedIn B2B, App Stores"
    },
};

// --- 37. Pathway Tools Interest Map ---
const pathwayToolsInterestMap = {
    'digital': {
        'code': ['Docker', 'Amazon Bedrock', 'Next.js'],
        'data': ['Amazon SageMaker', 'TensorFlow', 'dbt'],
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
    },
};

// --- 38. Apprenticeship Standards ---
const apprenticeshipStandards = [
    { c: 'Kenya', name: 'NITA Guidelines', url: 'https://www.nita.go.ke/' },
    { c: 'Tanzania', name: 'VETA Apprenticeship', url: 'https://www.veta.go.tz/' },
    { c: 'Uganda', name: 'DIT Standards', url: 'https://www.ictau.ug/' },
    { c: 'Rwanda', name: 'RTB Workplace Learning', url: 'https://www.rtb.gov.rw/' },
    { c: 'all', name: 'EAC TVET Harmonization', url: 'https://www.eac.int/education' }
];

// --- 39. National Mentorships ---
const nationalMentorships = {
    'Kenya': [{ title: "KamiLimu", desc: "Structured mentorship for CS students.", link: "https://kamilimu.org/", type: "Mentorship" }],
    'Rwanda': [{ title: "Girls in ICT Rwanda", desc: "Mentorship and networking.", link: "https://girlsinict.rw/", type: "Mentorship" }],
    'Uganda': [{ title: "Women in Technology Uganda", desc: "Networking and mentorship.", link: "https://witug.org/", type: "Mentorship" }],
    'Tanzania': [{ title: "Apps and Girls", desc: "Coding and mentorship for girls.", link: "https://www.girlscode.com/", type: "Mentorship" }]
};

// --- 40. Outreach Templates ---
const outreachTemplates = [
    {
        title: "LinkedIn Connection (Alumni)",
        subject: "N/A",
        body: "Hi [Name], I noticed we both studied at [University]. I'm currently exploring careers in [Sector] and would love to connect to learn from your journey. Thanks, [Your Name]"
    },
    {
        title: "Informational Interview Request",
        subject: "Quick question about [Role] at [Company]",
        body: "Dear [Name],\n\nI'm a [Current Role/Student] admiring [Company]'s work in [Specific Project]. I'd love to ask 3 quick questions about your experience as a [Role] to help guide my next steps.\n\nWould you be open to a 15-min chat next week?\n\nBest,\n[Your Name]"
    },
    {
        title: "Application Follow-up",
        subject: "Following up on [Role] application - [Your Name]",
        body: "Dear Hiring Manager,\n\nI applied for the [Role] position last week (ID: 12345). I'm very interested in [Company]'s mission to [Mission] and wanted to reiterate my enthusiasm.\n\nPlease let me know if you need any further information.\n\nBest regards,\n[Your Name]"
    }
];

// --- 41. Readiness Scorecard Sections ---
const readinessScorecardSections = [
    {
        title: "Digital Assets", icon: "file-text", color: "blue",
        items: ["CV is ATS-friendly (no graphics/columns)", "LinkedIn profile has a professional photo", "LinkedIn 'About' section tells a story", "Portfolio link is working and accessible"]
    },
    {
        title: "Search Strategy", icon: "target", color: "purple",
        items: ["Identified top 10 target companies", "Set up job alerts on 3+ platforms", "Connected with 5+ alumni/peers in sector", "Researched salary benchmarks for role"]
    },
    {
        title: "Interview Prep", icon: "mic", color: "emerald",
        items: ["Prepared 3 STAR stories for behavioral Qs", "Researched 'Why this company?' answer", "Practiced technical/case study questions", "Prepared questions to ask the interviewer"]
    }
];

// --- 42. Pivot Audit Sections ---
const pivotAuditSections = [
    {
        title: "Skill Translation", icon: "languages", color: "pink",
        items: ["Mapped past skills to new sector jargon", "Identified transferable soft skills (e.g. Mgmt)", "Created a 'functional' CV format"]
    },
    {
        title: "Market Immersion", icon: "users", color: "blue",
        items: ["Joined 2+ sector-specific communities", "Followed 10 industry leaders on LinkedIn", "Subscribed to 3 industry newsletters"]
    },
    {
        title: "Validation", icon: "check-circle", color: "emerald",
        items: ["Conducted 3 informational interviews", "Completed 1 relevant mini-project", "Updated LinkedIn headline to 'Aspiring [Role]'"]
    }
];

// --- 43. Application Kits Config (Job Board) ---
const applicationKitsConfig = {
    'all': { title: "General Job Applications Checklist", icon: "briefcase", cv: "Standard Professional CV", check: "LinkedIn Updated, References Ready", test: "General Aptitude" },
    'internship': { title: "Internship Starter Kit", icon: "graduation-cap", cv: "Academic/Project-based CV", check: "Transcript, Cover Letter", test: "Basic Logic / Personality" },
    'placement': { title: "Work Placement Kit", icon: "id-card", cv: "Placement CV / Bio-data", check: "Placement Letter, Insurance Form", test: "Work Readiness Assessment" },
    'freelance': { title: "Freelancer Toolkit", icon: "laptop", cv: "Portfolio/Case Studies", check: "Rate Card, Contract Template", test: "Skill Assessment (e.g. Coding)" },
    'tender': { title: "Founder Tender Kit", icon: "file-text", cv: "Company Profile / Capability Statement", check: "Tax Compliance, Registration Certs", test: "Technical Proposal Evaluation" },
    'volunteer': { title: "Volunteer Kit", icon: "heart", cv: "Skills-based Resume", check: "Availability Schedule, Motivation Statement", test: "Values Alignment" }
};

// --- 44. Application Kits Resources (Download) ---
const applicationKitsResources = {
    'all': { title: "General Job Applications Checklist", items: ["Master CV Template (ATS-Optimized)", "Cover Letter Guide & Examples", "LinkedIn Profile Optimization Checklist", "Common Interview Questions & STAR Answers", "Salary Negotiation Script"] },
    'internship': { title: "Internship Starter Kit", items: ["Student/Graduate Resume Template", "University Recommendation Letter Request", "Internship Cover Letter (No Experience)", "Learning Agreement Template", "Internship Report Guidelines"] },
    'placement': { title: "Work Placement Kit", items: ["Placement Application Letter", "Daily Work Logbook Template", "Supervisor Evaluation Form", "Placement Report Structure", "Workplace Safety Checklist"] },
    'freelance': { title: "Freelancer Toolkit", items: ["Freelance Service Rate Card", "Client Contract & SOW Template", "Portfolio Website Checklist", "Cold Pitch Email Templates", "Invoice & Payment Tracker"] },
    'tender': { title: "Founder Tender Kit", items: ["Company Profile / Capability Statement", "Tax Compliance Checklist (KRA/TRA/URA)", "Technical Proposal Structure", "Financial Proposal Budget Sheet", "Pre-qualification Questionnaire Guide"] },
    'volunteer': { title: "Volunteer Applications Checklist", items: ["Skills-Based Volunteer Resume", "Motivation Statement / Personal Essay", "Availability & Commitment Schedule", "Soft Skills Self-Assessment", "Volunteer Code of Conduct Preview"] }
};

// --- 45. Hero Persona Content ---
const heroPersonaContent = {
    learner: {
        text: "In 10 minutes, you’ll have a shortlist of occupations, skills in demand and leads to targeted training options.",
    },
    entrepreneur: {
        text: "Identify high-potential venture niches, access eco-system resources, and build your capability roadmap.",
    },
    counsellor: {
        text: "Access labor market intelligence to guide students towards high-growth career paths.",
    },
    provider: {
        text: "Align your curriculum with real-time market demand and skills gaps.",
    },
    policy: {
        text: "View workforce data and trends to inform education and employment policy.",
    }
};

// --- 46. Real Courses Data (Fallback) ---
const realCourses = [
    {
        "id": "ai_nvidia_1",
        "name": "Building A Brain in 10 Minutes",
        "provider": "Nvidia",
        "type": "Short Course",
        "level": "short",
        "duration": "Self-paced",
        "durationHours": 1,
        "difficulty": "Beginner",
        "cost": "Free",
        "costType": "Free",
        "mode": "Online",
        "sector": "digital",
        "skills": ["AI", "Neural Networks", "Deep Learning"],
        "occupations": ["AI Engineer", "Data Scientist"],
        "url": "https://learn.nvidia.com/en-us/training/self-paced-courses",
        "country": "all",
        "description": "A quick, high-level introduction to how neural networks learn from data.",
        "language": "English",
        "lastUpdated": "2025"
    },
    {
        "id": "ai_dl_1",
        "name": "Generative AI for Everyone",
        "provider": "DeepLearning.AI (Coursera)",
        "type": "Short Course",
        "level": "short",
        "duration": "6 hours",
        "durationHours": 6,
        "difficulty": "Beginner",
        "cost": "Free (Audit)",
        "costType": "Freemium",
        "mode": "Online",
        "sector": "digital",
        "skills": ["Generative AI", "Prompt Engineering", "AI Strategy"],
        "occupations": ["AI Product Manager", "Digital Marketer"],
        "url": "https://www.coursera.org/learn/generative-ai-for-everyone",
        "country": "all",
        "description": "Understand how generative AI works and how to use it in your professional life.",
        "language": "English",
        "lastUpdated": "2025"
    },
    {
        "id": "ai_harvard_1",
        "name": "CS50's Intro to AI with Python",
        "provider": "Harvard (edX)",
        "type": "University Course",
        "level": "long",
        "duration": "7 weeks",
        "durationHours": 80,
        "difficulty": "Advanced",
        "cost": "Free (Audit)",
        "costType": "Freemium",
        "mode": "Online",
        "sector": "digital",
        "skills": ["Python", "Machine Learning", "AI Algorithms"],
        "occupations": ["Machine Learning Engineer", "Python Developer"],
        "url": "https://cs50.harvard.edu/ai/",
        "country": "all",
        "description": "Explore the concepts and algorithms at the foundation of modern artificial intelligence.",
        "language": "English",
        "lastUpdated": "2025"
    },
    {
        "id": "ai_ibm_gen",
        "name": "Generative AI Fundamentals",
        "provider": "IBM SkillsBuild",
        "type": "Micro-Credential",
        "level": "short",
        "duration": "Self-paced",
        "durationHours": 5,
        "difficulty": "Beginner",
        "cost": "Free",
        "costType": "Free",
        "mode": "Online",
        "sector": "digital",
        "skills": ["Generative AI", "Ethics", "AI Models"],
        "occupations": ["AI Ethics Officer", "Business Analyst"],
        "url": "https://skillsbuild.org/",
        "country": "all",
        "description": "Learn the basics of generative AI models and their applications in business.",
        "language": "English",
        "lastUpdated": "2025"
    },
    {
        "id": "c_001",
        "name": "Solar PV Installation T1/T2",
        "provider": "Strathmore Energy Research Centre",
        "country": "Kenya",
        "sector": "energy",
        "level": "med",
        "duration": "3 Weeks",
        "mode": "In-Person",
        "cost": "Paid",
        "type": "Certificate",
        "url": "https://serc.strathmore.edu/",
        "skills": ["Solar PV", "Electrical Wiring", "Safety Protocols"],
        "occupations": ["Solar PV Installer", "Solar Technician"],
        "gsa_member": true,
        "lastUpdated": "2024"
    },
    {
        "id": "c_002",
        "name": "Data Science Core",
        "provider": "Moringa School",
        "country": "Kenya",
        "sector": "digital",
        "level": "long",
        "duration": "20 Weeks",
        "mode": "Hybrid",
        "cost": "Paid",
        "type": "Bootcamp",
        "url": "https://moringaschool.com/",
        "skills": ["Python", "Data Analysis", "Machine Learning"],
        "occupations": ["Data Scientist", "Data Analyst"],
        "women_focused": true,
        "lastUpdated": "2024"
    },
    {
        "id": "c_003",
        "name": "Introduction to Agribusiness",
        "provider": "African Management Institute",
        "country": "Rwanda",
        "sector": "agri",
        "level": "short",
        "duration": "4 Weeks",
        "mode": "Online",
        "cost": "Free",
        "type": "Short Course",
        "url": "https://www.africanmanagers.com/",
        "skills": ["Agribusiness", "Financial Literacy", "Market Access"],
        "occupations": ["Agri-Entrepreneur", "Co-op Manager"],
        "lastUpdated": "2024"
    },
    { "id": "d1", "name": "Google Data Analytics Professional Certificate", "provider": "Google via Coursera", "type": "Professional Certificate", "level": "med", "duration": "6 months", "durationHours": 120, "difficulty": "Beginner", "cost": "Free (Audit) / $49/mo", "costType": "Freemium", "mode": "Online", "sector": "digital", "skills": ["Data Analysis", "SQL", "Tableau", "R Programming", "Data Science", "Data Viz"], "url": "https://www.coursera.org/professional-certificates/google-data-analytics", "country": "all", "description": "Gain an immersive understanding of the practices and processes used by a junior or associate data analyst.", "language": "English", "lastUpdated": "2024" },
    { "id": "d3", "name": "Google IT Support Professional Certificate", "provider": "Google via Coursera", "type": "Professional Certificate", "level": "med", "duration": "6 months", "durationHours": 120, "difficulty": "Beginner", "cost": "Free (Audit) / $49/mo", "costType": "Freemium", "mode": "Online", "sector": "digital", "skills": ["Networking", "IT Support", "System Admin", "Cybersecurity", "Cloud Computing"], "url": "https://www.coursera.org/professional-certificates/google-it-support", "country": "all", "description": "Prepare for an entry-level role in IT support. Learn computer assembly, wireless networking, and customer service.", "language": "English", "lastUpdated": "2024" },
    { "id": "d6", "name": "Google AI Essentials", "provider": "Google via Coursera", "type": "Micro-Credential", "level": "short", "duration": "10 hours", "durationHours": 10, "difficulty": "Beginner", "cost": "Free (Audit) / $49", "costType": "Freemium", "mode": "Online", "sector": "digital", "skills": ["AI", "Machine Learning", "Digital Tools", "Automation"], "url": "https://www.coursera.org/learn/google-ai-essentials", "country": "all", "description": "Learn how to use generative AI tools to help speed up daily tasks, make more informed decisions, and develop new ideas.", "language": "English", "lastUpdated": "2024" },
    { "id": "d7", "name": "IBM Cybersecurity Analyst Professional Certificate", "provider": "IBM via Coursera", "type": "Professional Certificate", "level": "med", "duration": "8 months", "durationHours": 160, "difficulty": "Beginner", "cost": "Free (Audit) / $49/mo", "costType": "Freemium", "mode": "Online", "sector": "digital", "skills": ["Network Security", "Incident Response", "Threat Intelligence", "Cybersecurity", "Compliance"], "url": "https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst", "country": "all", "description": "Develop the knowledge and skills to enter the cybersecurity workforce.", "language": "English", "lastUpdated": "2024" },
    { "id": "d11", "name": "Low-Code App Development", "provider": "OutSystems", "type": "Learning Path", "level": "med", "duration": "Self-paced", "durationHours": 0, "difficulty": "Beginner", "cost": "Free", "costType": "Free", "mode": "Online", "sector": "digital", "skills": ["Web Dev", "Automation", "AI", "Prototyping", "Product Design"], "url": "https://www.outsystems.com/learn/", "country": "all", "description": "Build and deploy enterprise-grade applications with minimal coding.", "language": "English", "lastUpdated": "2024" },
    { "id": "d12", "name": "AI Fundamentals", "provider": "IBM SkillsBuild", "type": "Micro-Credential", "level": "short", "duration": "4 hours", "durationHours": 4, "difficulty": "Beginner", "cost": "Free", "costType": "Free", "mode": "Online", "sector": "digital", "skills": ["AI", "Machine Learning", "Cybersecurity", "Data Science"], "url": "https://skillsbuild.org/", "country": "all", "description": "A foundational course on Artificial Intelligence, covering key concepts, applications, and ethical considerations.", "language": "English", "lastUpdated": "2024" },
    { "id": "d_pan_1", "name": "ALX Software Engineering", "provider": "ALX Africa", "type": "Bootcamp", "level": "long", "duration": "12 months", "durationHours": 1500, "difficulty": "Intermediate", "cost": "Free (Sponsored)", "costType": "Subsidized", "mode": "Online", "sector": "digital", "skills": ["Web Dev", "Python", "DevOps", "Software Engineering", "C Programming"], "url": "https://www.alxafrica.com/", "country": "all", "description": "Rigorous full-stack software engineering curriculum. Fully sponsored for eligible African youth.", "language": "English", "lastUpdated": "2024" },
    { "id": "d_pan_2", "name": "ALX Virtual Assistant", "provider": "ALX Africa", "type": "Short Course", "level": "short", "duration": "8 weeks", "durationHours": 100, "difficulty": "Beginner", "cost": "Free (Sponsored)", "costType": "Subsidized", "mode": "Online", "sector": "digital", "skills": ["Digital Tools", "Communication", "Remote Work", "Google Workspace"], "url": "https://www.alxafrica.com/", "country": "all", "description": "Prepares learners for remote work opportunities as virtual assistants.", "language": "English", "lastUpdated": "2024" },
    { "id": "e1", "name": "Renewable Energy Technology Fundamentals", "provider": "Univ. of Colorado Boulder (Coursera)", "type": "Specialization", "level": "short", "duration": "4 months", "durationHours": 80, "difficulty": "Beginner", "cost": "Free (Audit) / $49/mo", "costType": "Freemium", "mode": "Online", "sector": "energy", "skills": ["Solar PV", "Wind Power", "Grid Systems", "Energy Efficiency", "Green Tech"], "url": "https://www.coursera.org/learn/renewable-energy-fundamentals", "country": "all", "description": "Foundation in renewable energy technologies including solar, wind, and storage systems.", "language": "English", "lastUpdated": "2023" },
    { "id": "e_online_1", "name": "Energy University", "provider": "Schneider Electric", "type": "Learning Platform", "level": "short", "duration": "Self-paced", "durationHours": 0, "difficulty": "All Levels", "cost": "Free", "costType": "Free", "mode": "Online", "sector": "energy", "skills": ["Energy Efficiency", "Data Center Mgmt", "Sustainability"], "url": "https://university.se.com/", "country": "all", "description": "Free online courses on energy efficiency and data center management from industry experts.", "language": "English", "lastUpdated": "2024" },
    { "id": "e_online_2", "name": "Introduction to Biogas", "provider": "DBFZ / Biogas Training", "type": "Short Course", "level": "short", "duration": "Self-paced", "durationHours": 20, "difficulty": "Beginner", "cost": "Free", "costType": "Free", "mode": "Online", "sector": "energy", "skills": ["Biomass", "Safety Protocols", "Green Tech"], "url": "https://www.biogas-training.de/", "country": "all", "description": "Basics of biogas production, digester types, and safety. Relevant for rural energy access.", "language": "English", "lastUpdated": "2024" },
    { "id": "e_online_3", "name": "Solar Water Pumping", "provider": "Solar Energy International", "type": "Short Course", "level": "short", "duration": "6 weeks", "durationHours": 40, "difficulty": "Intermediate", "cost": "Paid", "costType": "Paid", "mode": "Online", "sector": "energy", "skills": ["Solar PV", "Water Management", "Irrigation", "Installation"], "url": "https://www.solarenergy.org/", "country": "all", "description": "Design and installation of solar water pumping systems, critical for off-grid agriculture.", "language": "English", "lastUpdated": "2024" },
    { "id": "e_online_4", "name": "Wind Energy", "provider": "DTU (Coursera)", "type": "Short Course", "level": "short", "duration": "5 weeks", "durationHours": 30, "difficulty": "Intermediate", "cost": "Free (Audit)", "costType": "Freemium", "mode": "Online", "sector": "energy", "skills": ["Wind Power", "Project Mgmt", "Engineering"], "url": "https://www.coursera.org/learn/wind-energy", "country": "all", "description": "Engineering aspects of wind energy technology from the Technical University of Denmark.", "language": "English", "lastUpdated": "2024" },
    { "id": "e2", "name": "Diploma in Renewable Energy", "provider": "Jomo Kenyatta Univ. (JKUAT)", "type": "Diploma", "level": "med", "duration": "2 years", "durationHours": 2400, "cost": "Variable (KES)", "costType": "Paid", "mode": "In-Person", "sector": "energy", "skills": ["Solar PV", "Wind Power", "Green Tech", "Installation", "Field Ops"], "url": "https://www.jkuat.ac.ke/institutes/ieet/", "country": "Kenya", "description": "Hands-on diploma covering the installation, maintenance, and design of renewable energy systems.", "language": "English", "lastUpdated": "2023" },
    { "id": "c_solar_t1", "name": "Solar T1/T2 License", "provider": "EPRA / ERC", "type": "License", "level": "med", "duration": "Exam", "durationHours": 4, "cost": "Paid", "costType": "Paid", "mode": "In-Person", "sector": "energy", "skills": ["Solar PV", "Safety Protocols", "Installation", "Electrical Wiring"], "url": "https://www.epra.go.ke/", "country": "Kenya", "description": "National license for solar PV technicians. Required for installation and maintenance of solar systems.", "language": "English", "lastUpdated": "2024" },
    { "id": "e_ke_2", "name": "Solar PV Training (T3)", "provider": "Strathmore Energy Research Centre", "type": "Professional Certificate", "level": "short", "duration": "2 weeks", "durationHours": 80, "cost": "Paid", "costType": "Paid", "mode": "In-Person", "sector": "energy", "skills": ["Solar PV", "Grid Systems", "Installation", "Safety Protocols"], "url": "https://serc.strathmore.edu/", "country": "Kenya", "description": "Advanced solar training for designing and installing complex grid-tie and hybrid systems.", "language": "English", "lastUpdated": "2024" },
    { "id": "e_ug_2", "name": "Solar Systems Installation Level 1", "provider": "Nakawa Vocational Training Institute", "type": "Certificate", "level": "short", "duration": "3 months", "durationHours": 360, "cost": "Variable", "costType": "Paid", "mode": "In-Person", "sector": "energy", "skills": ["Solar PV", "Installation", "Safety Protocols", "Electrical Wiring"], "url": "https://www.nakawavtc.ac.ug/", "country": "Uganda", "description": "Vocational training for solar technicians, covering basic installation and maintenance.", "language": "English", "lastUpdated": "2024" },
    { "id": "a2", "name": "Smart Farming", "provider": "atingi", "type": "Short Course", "level": "short", "duration": "Self-paced", "durationHours": 0, "difficulty": "Intermediate", "cost": "Free", "costType": "Free", "mode": "Online", "sector": "agri", "skills": ["Precision Ag", "IoT Sensors", "Digital Advisory", "Farm Management", "Digital Tools"], "url": "https://www.atingi.org/en/", "country": "all", "description": "Digital tools for agriculture including weather apps, market price platforms, and farm management software.", "language": "English", "lastUpdated": "2023" },
    { "id": "a3", "name": "Digital Agriculture Africa (DAA) Program", "provider": "GIZ", "type": "Initiative", "level": "med", "duration": "Ongoing", "durationHours": 0, "difficulty": "Intermediate", "cost": "Free", "costType": "Free", "mode": "Hybrid", "sector": "agri", "skills": ["Farm Management", "Food Security", "Precision Ag", "Digital Advisory", "Data Collection"], "url": "https://www.giz.de/en/worldwide/77241.html", "country": "all", "description": "Trainings cover data privacy, user-centered design for farmers, and business models for agritech.", "language": "English", "lastUpdated": "2024" },
    { "id": "a5", "name": "Climate Smart Agriculture", "provider": "SkillEd", "type": "Blended Course", "level": "med", "duration": "Self-paced", "durationHours": 0, "difficulty": "Intermediate", "cost": "Free", "costType": "Free", "mode": "Hybrid", "sector": "agri", "skills": ["Climate Adaptation", "Water Management", "Agribusiness", "Sustainability", "Crop Science"], "url": "https://www.skill-ed.org/programmes", "country": "all", "description": "Designed for low-connectivity environments, covering climate-smart agriculture, water management, and agribusiness.", "language": "English", "lastUpdated": "2024" },
    { "id": "p8", "name": "FAO eLearning Academy", "provider": "FAO", "type": "Learning Platform", "level": "short", "duration": "Self-paced", "durationHours": 0, "difficulty": "All Levels", "cost": "Free", "costType": "Free", "mode": "Online", "sector": "agri", "skills": ["Food Security", "Climate Smart Ag", "Nutrition", "Sustainability", "Digital Advisory"], "url": "https://elearning.fao.org/", "country": "all", "description": "Free multilingual courses on food and nutrition security, social development, and sustainable natural resource management.", "language": "English", "lastUpdated": "2024" },
    { "id": "a_online_2", "name": "Agribusiness Management", "provider": "African Management Institute (AMI)", "type": "Short Course", "level": "short", "duration": "4 months", "durationHours": 100, "difficulty": "Intermediate", "cost": "Paid", "costType": "Paid", "mode": "Online", "sector": "agri", "skills": ["Agribusiness", "Economics", "Farm Management", "Entrepreneurship"], "url": "https://www.africanmanagers.com/", "country": "all", "description": "Practical business management course tailored for entrepreneurs in the agricultural sector.", "language": "English", "lastUpdated": "2024" },
    { "id": "a_online_3", "name": "Introduction to Precision Agriculture", "provider": "Coursera (Various)", "type": "Short Course", "level": "short", "duration": "20 hours", "durationHours": 20, "difficulty": "Beginner", "cost": "Free (Audit)", "costType": "Freemium", "mode": "Online", "sector": "agri", "skills": ["GIS Mapping", "Precision Ag", "Remote Sensing"], "url": "https://www.coursera.org/", "country": "all", "description": "Overview of precision agriculture technologies and their application.", "language": "English", "lastUpdated": "2024" },
    { "id": "a1", "name": "Bachelor of Science in Agriculture (Online)", "provider": "Egerton University", "type": "University Degree", "level": "long", "duration": "4 years", "durationHours": 4800, "cost": "Variable (KES)", "costType": "Paid", "mode": "Hybrid", "sector": "agri", "skills": ["Crop Science", "Economics", "Farm Management", "Soil Analysis", "Agribusiness"], "url": "https://www.egerton.ac.ke/faculty-of-agriculture-foa", "country": "Kenya", "description": "Comprehensive degree covering crop production, animal science, and agricultural economics.", "language": "English", "lastUpdated": "2023" },
    { "id": "a_rw_1", "name": "Advanced Diploma in Crop Production", "provider": "Rwanda Polytechnic (IPRC)", "type": "TVET Diploma", "level": "med", "duration": "2 years", "durationHours": 2400, "cost": "Subsidized", "costType": "Subsidized", "mode": "In-Person", "sector": "agri", "skills": ["Crop Science", "Water Management", "Mechanization", "Farm Management"], "url": "https://www.rp.ac.rw/", "country": "Rwanda", "description": "Hands-on technical training in modern crop production techniques and farm mechanization.", "language": "English", "lastUpdated": "2024" },
    { "id": "a_ke_2", "name": "Certificate in Entrepreneurial Agriculture", "provider": "Latia Agripreneurship Institute", "type": "Certificate", "level": "med", "duration": "6 months", "durationHours": 720, "cost": "Paid", "costType": "Paid", "mode": "In-Person", "sector": "agri", "skills": ["Agribusiness", "Farm Management", "Manufacturing", "Entrepreneurship"], "url": "https://www.latiaagribusinesssolutions.com/", "country": "Kenya", "description": "Apprenticeship-based training focusing on the business side of farming and practical skills.", "language": "English", "lastUpdated": "2024" },
    { "id": "ent_yali", "name": "YALI Regional Leadership", "provider": "YALI / USAID", "type": "Fellowship", "level": "med", "duration": "4 weeks", "durationHours": 160, "cost": "Free (Funded)", "costType": "Subsidized", "mode": "Hybrid", "sector": "all", "skills": ["Leadership", "Entrepreneurship", "Civic Engagement", "Management"], "url": "https://www.rlceastafrica.org/", "country": "all", "description": "Transformational leadership training for young Africans, covering business, civic leadership, and public management.", "language": "English", "lastUpdated": "2025" },
    { "id": "ent_tef_1", "name": "TEF Entrepreneurship Programme", "provider": "Tony Elumelu Foundation", "type": "Bootcamp", "level": "med", "duration": "12 weeks", "durationHours": 100, "cost": "Free (Grant Opportunity)", "costType": "Subsidized", "mode": "Online", "sector": "all", "skills": ["Entrepreneurship", "Business Mgmt", "Strategy", "Financial Literacy"], "url": "https://www.tonyelumelufoundation.org/", "country": "all", "description": "Training, mentorship, and seed capital for African entrepreneurs across all 54 countries.", "language": "English", "lastUpdated": "2025" },

    // --- NEW 2024–2025 ADDITIONS ---

    // AGRITECH
    { "id": "a_atingi_agri", "name": "Agribusiness e-Academy", "provider": "atingi / Agribusiness Facility for Africa", "type": "Learning Platform", "level": "short", "duration": "Self-paced", "durationHours": 0, "difficulty": "All Levels", "cost": "Free", "costType": "Free", "mode": "Online", "sector": "agri", "skills": ["Agribusiness", "Climate Smart Ag", "Farm Management", "Food Processing", "Market Access", "Livestock"], "occupations": ["Agri-Entrepreneur", "Farm Manager", "Agricultural Advisor", "Agribusiness Analyst"], "url": "https://online.atingi.org/local/partner/page.php?id=6", "country": "all", "description": "Free multilingual platform (English, Kiswahili, French, Spanish, Portuguese) covering cocoa, maize, cashew, livestock, and climate-smart agriculture. 55,000+ learners. Works offline via mobile app. Includes a 2025–2026 funding programme for agripreneurs.", "language": "English, Kiswahili, French", "lastUpdated": "2025" },
    { "id": "a_tagdev_2", "name": "Agrisiti + TAGDev 2.0 Agribusiness Training", "provider": "IFAD / Agrisiti", "type": "Short Course", "level": "med", "duration": "12 weeks", "durationHours": 120, "difficulty": "Beginner", "cost": "Free", "costType": "Free", "mode": "Hybrid", "sector": "agri", "skills": ["Agribusiness", "Climate Adaptation", "Digital Tools", "Entrepreneurship", "Food Security"], "occupations": ["Agri-Entrepreneur", "Farm Manager", "Agricultural Advisor"], "url": "https://www.ifad.org/en/tagdev", "country": "all", "description": "Free 12-week hybrid training (Telegram + in-person demo hubs) in agribusiness and climate-smart skills for young Africans. Digital certificate on completion.", "language": "English", "lastUpdated": "2025" },
    { "id": "a_sfa_1", "name": "Agritech for Smallholder Farmers", "provider": "Skills for Africa", "type": "Short Course", "level": "short", "duration": "5 days", "durationHours": 40, "difficulty": "Intermediate", "cost": "Paid", "costType": "Paid", "mode": "In-Person", "sector": "agri", "skills": ["Precision Ag", "Digital Tools", "Farm Management", "IoT Sensors", "Agribusiness"], "occupations": ["Smallholder Farmer", "Agricultural Extension Officer", "Agritech Specialist"], "url": "https://skillsforafrica.org/us/course/agritech-for-smallholder-farmers-practical-solutions-training-course", "country": "all", "description": "Hands-on training in agritech tools for small-scale farmers, covering precision agriculture, mobile apps, and data-driven farm management.", "language": "English", "lastUpdated": "2025" },

    // RENEWABLE ENERGY
    { "id": "e_irena_ea", "name": "Eastern Africa Regional Energy Planning Programme", "provider": "IRENA / EAPP", "type": "Certificate", "level": "med", "duration": "Ongoing (2024–2026)", "durationHours": 0, "difficulty": "Intermediate", "cost": "Free (Funded)", "costType": "Subsidized", "mode": "Hybrid", "sector": "energy", "skills": ["Energy Policy", "Grid Systems", "Energy Planning", "Data Analysis", "Sustainability"], "occupations": ["Energy Planner", "Policy Analyst", "Renewable Energy Engineer", "Energy Advisor"], "url": "https://www.irena.org/energytransition/Energy-Planning-Support/Regional-training-workshops", "country": "all", "description": "IRENA technical capacity-building programme covering all 8 East African Compass countries via the Eastern Africa Power Pool. Mix of regional workshops, virtual sessions, and e-learning modules (Nov 2024–Nov 2026).", "language": "English", "lastUpdated": "2025" },
    { "id": "e_toolkit_ke", "name": "Renewable Energy Installation & Maintenance", "provider": "Toolkit Africa", "type": "Certificate", "level": "med", "duration": "6 months", "durationHours": 720, "difficulty": "Beginner", "cost": "Variable", "costType": "Paid", "mode": "In-Person", "sector": "energy", "skills": ["Solar PV", "Installation", "Maintenance", "Electrical Wiring", "Safety Protocols"], "occupations": ["Solar Technician", "Renewable Energy Installer", "Field Technician"], "url": "https://toolkitafrica.ac.ke/our-ventures/renewable-energy/", "country": "Kenya", "description": "Youth-focused vocational training in renewable energy installation and maintenance in Nairobi. Equips graduates for employment and self-employment in Kenya's growing RE sector.", "language": "English", "lastUpdated": "2025" },
    { "id": "e_wb_ret", "name": "Effective Renewable Energy Tendering in Africa", "provider": "World Bank Academy (with IRENA & GIZ)", "type": "Professional Certificate", "level": "long", "duration": "9 months", "durationHours": 300, "difficulty": "Advanced", "cost": "Free (Sponsored)", "costType": "Subsidized", "mode": "Hybrid", "sector": "energy", "skills": ["Project Finance", "Energy Policy", "Procurement", "Contract Management", "Renewable Energy"], "occupations": ["Energy Policy Analyst", "Project Developer", "Procurement Specialist", "Energy Advisor"], "url": "https://academy.worldbank.org/en/infrastructure/energy/effective-renewable-energy-tendering-in-africa", "country": "all", "description": "9-month hybrid programme for African energy professionals covering competitive renewable energy procurement, IPP structuring, and contract negotiation. Fully sponsored for eligible participants.", "language": "English", "lastUpdated": "2025" },

    // DIGITAL ECONOMY
    { "id": "d_undp_ms", "name": "Africa Centre of Competence — Digital & AI Skilling", "provider": "UNDP / Microsoft", "type": "Learning Platform", "level": "short", "duration": "Self-paced", "durationHours": 0, "difficulty": "All Levels", "cost": "Free (Subsidized)", "costType": "Subsidized", "mode": "Hybrid", "sector": "digital", "skills": ["AI", "Data Science", "Cybersecurity", "Cloud Computing", "Digital Tools", "Deep Tech"], "occupations": ["AI Engineer", "Data Scientist", "Cybersecurity Analyst", "Cloud Architect", "Digital Transformation Officer"], "url": "https://www.undp.org/kenya/africa-centre-competence-digital-and-artificial-intelligence-skilling", "country": "all", "description": "Nairobi-based hub launched Dec 2024, targeting 100,000 professionals across Kenya, Rwanda, Uganda, Tanzania and beyond. Covers AI, data science, cybersecurity, and deep tech via hub-and-spokes delivery model.", "language": "English", "lastUpdated": "2025" },
    { "id": "d_aiaca_1", "name": "Data Analytics & AI Training", "provider": "AI Academy Africa", "type": "Learning Platform", "level": "med", "duration": "Self-paced", "durationHours": 0, "difficulty": "Beginner", "cost": "Free (Audit)", "costType": "Freemium", "mode": "Online", "sector": "digital", "skills": ["Data Analytics", "Data Science", "AI", "Machine Learning", "Python"], "occupations": ["Data Analyst", "Data Scientist", "AI Engineer", "Business Intelligence Analyst"], "url": "https://www.aiacademy.africa/", "country": "all", "description": "Free and low-cost Data Analytics, Data Science, and AI training for African learners. No prior degree or experience required. New cohorts open for 2026.", "language": "English", "lastUpdated": "2025" },
    { "id": "d_datalens", "name": "AI Talents Program", "provider": "DataLens Africa", "type": "Short Course", "level": "short", "duration": "Self-paced", "durationHours": 60, "difficulty": "Beginner", "cost": "Free", "costType": "Free", "mode": "Online", "sector": "digital", "skills": ["AI", "Data Annotation", "Quality Assurance", "Machine Learning", "LLM Fine-Tuning"], "occupations": ["AI Data Annotator", "QA Engineer", "Machine Learning Engineer", "Data Curator"], "url": "https://www.datalens.africa/ai-talents-program", "country": "all", "description": "Free certified training in Data Annotation, QA, and LLM Fine-Tuning. Connects graduates to paid remote projects with AI companies worldwide.", "language": "English", "lastUpdated": "2025" },
    { "id": "d_andela_cloud", "name": "Cloud-Native & Kubernetes Engineering", "provider": "Andela / CNCF", "type": "Bootcamp", "level": "med", "duration": "6 months", "durationHours": 500, "difficulty": "Intermediate", "cost": "Free (Sponsored)", "costType": "Subsidized", "mode": "Online", "sector": "digital", "skills": ["Cloud Computing", "Kubernetes", "DevOps", "Software Engineering", "Container Orchestration"], "occupations": ["Cloud Engineer", "DevOps Engineer", "Platform Engineer", "Site Reliability Engineer"], "url": "https://andela.com/", "country": "all", "description": "CNCF-partnered programme training African technologists in cloud-native technologies and Kubernetes. Targeting 30,000 engineers by 2028. Graduates connected to global tech employers via Andela's network.", "language": "English", "lastUpdated": "2025" },
    { "id": "d_ajira_ke", "name": "Ajira Digital Skills Programme", "provider": "Ajira Digital / Kenya ICT Authority", "type": "Learning Platform", "level": "short", "duration": "Self-paced", "durationHours": 0, "difficulty": "Beginner", "cost": "Free", "costType": "Free", "mode": "Hybrid", "sector": "digital", "skills": ["Digital Tools", "Freelancing", "Remote Work", "Digital Marketing", "Data Entry", "Content Creation"], "occupations": ["Freelancer", "Virtual Assistant", "Digital Marketer", "Content Creator", "Data Entry Specialist"], "url": "https://ajiradigital.go.ke/", "country": "Kenya", "description": "Government of Kenya initiative with 391,000 youth trained as of June 2024. 101 Ajira Youth Empowerment Centres provide free internet, computers, and guided digital training in freelancing and online work.", "language": "English, Kiswahili", "lastUpdated": "2025" }
];

// --- 47. Fallback Scholarships ---
const fallbackScholarships = [
    { "id": "aid_001", "name": "Mastercard Foundation Scholars Program", "provider": "Mastercard Foundation", "type": "Scholarship", "coverage": "Full (Tuition + Stipend)", "country": "Regional", "target": "Undergraduate / Master's", "deadline": "Varies by University", "link": "https://mastercardfdn.org/all/scholars/", "desc": "Comprehensive support for academically talented young leaders from economically disadvantaged backgrounds." },
    { "id": "aid_002", "name": "HELB Undergraduate Loan", "provider": "Government of Kenya", "type": "Loan", "coverage": "Partial (Tuition + Upkeep)", "country": "Kenya", "target": "Undergraduate (Public/Private)", "deadline": "Annual (August)", "link": "https://www.helb.co.ke/", "desc": "Low-interest government loans for Kenyan students in recognized universities and TVETs." },
    { "id": "aid_003", "name": "HESLB Loan", "provider": "Higher Education Students' Loans Board", "type": "Loan", "coverage": "Partial (Tuition + Meals)", "country": "Tanzania", "target": "Undergraduate", "deadline": "Annual (July-Sept)", "link": "https://www.heslb.go.tz/", "desc": "Loans for needy Tanzanian students admitted to accredited higher education institutions." },
    { "id": "aid_004", "name": "HESFB Loan Scheme", "provider": "Higher Education Students Financing Board", "type": "Loan", "coverage": "Tuition Fees", "country": "Uganda", "target": "Undergraduate / Diploma", "deadline": "Annual (July)", "link": "https://www.moesvtcs.go.ug/", "desc": "Loans for Ugandan students pursuing STEM programs and persons with disabilities." },
    { "id": "aid_005", "name": "Ashinaga Africa Initiative", "provider": "Ashinaga", "type": "Scholarship", "coverage": "Full (International)", "country": "Regional", "target": "Undergraduate", "deadline": "Annual (January)", "link": "https://en.ashinaga.org/apply/aai/", "desc": "Academic leadership program for orphaned students to study abroad and return to contribute to Sub-Saharan Africa." },
    { "id": "aid_006", "name": "Equity Wings to Fly / Elimu", "provider": "Equity Group Foundation", "type": "Scholarship", "coverage": "Full (Secondary + Uni Support)", "country": "Kenya", "target": "Secondary / TVET / Uni", "deadline": "Annual (December)", "link": "https://equitygroupfoundation.com/wings-to-fly/", "desc": "Comprehensive secondary school scholarship and leadership training for academically promising but financially challenged students." },
    { "id": "aid_007", "name": "BRD Student Loan (MinEduc)", "provider": "Development Bank of Rwanda", "type": "Loan", "coverage": "Tuition + Living Allowance", "country": "Rwanda", "target": "Undergraduate", "deadline": "Annual", "link": "https://www.brd.rw/brd/education-financing/", "desc": "Government-backed student loans for Rwandan students in public and private higher learning institutions." },
    { "id": "aid_008", "name": "IUCEA-Kyung Dong Scholarship", "provider": "IUCEA", "type": "Scholarship", "coverage": "Partial (Tuition)", "country": "Regional", "target": "Undergraduate", "deadline": "Annual (March)", "link": "https://www.iucea.org/", "desc": "Scholarships for students from EAC partner states to study at Kyung Dong University in South Korea." },
    { "id": "aid_009", "name": "Windle International Scholarship", "provider": "Windle International", "type": "Scholarship", "coverage": "Full", "country": "Regional (Refugee Focus)", "target": "Undergraduate / Master's", "deadline": "Varies", "link": "https://windle.org/", "desc": "Education opportunities for refugees and conflict-affected communities in East Africa." },
    { "id": "aid_010", "name": "KCB Foundation Tujiajiri", "provider": "KCB Foundation", "type": "Grant / Training", "coverage": "Vocational Training", "country": "Kenya", "target": "TVET / Youth", "deadline": "Rolling", "link": "https://www.kcbfoundation.org/", "desc": "Vocational skills training and mentorship for youth to establish their own businesses." },
    { "id": "aid_011", "name": "DAAD In-Country/In-Region", "provider": "DAAD", "type": "Scholarship", "coverage": "Full (Tuition + Stipend)", "country": "Regional", "target": "Master's / PhD", "deadline": "Varies", "link": "https://www.daad.or.ke/en/", "desc": "Support for postgraduate studies at selected partner universities within the East African region." },
    { "id": "aid_012", "name": "Madhvani Foundation Scholarship", "provider": "Madhvani Foundation", "type": "Scholarship", "coverage": "Tuition Fees", "country": "Uganda", "target": "Undergraduate", "deadline": "Annual (April)", "link": "https://www.madhvanifoundation.com/", "desc": "Scholarships for Ugandan university students demonstrating financial need and academic merit." },
    { "id": "aid_013", "name": "Excellentia Program", "provider": "Denise Nyakeru Tshisekedi Foundation", "type": "Scholarship", "coverage": "Full", "country": "DR Congo", "target": "Undergraduate", "deadline": "Annual", "link": "https://fondationdnt.org/", "desc": "Promoting academic excellence by awarding scholarships to top-performing state exam graduates in DRC." },
    { "id": "aid_014", "name": "Iftin Foundation Education Fund", "provider": "Iftin Foundation", "type": "Grant", "coverage": "Partial", "country": "Somalia", "target": "Youth / TVET", "deadline": "Rolling", "link": "https://iftinfoundation.org/", "desc": "Support for skills development and education for youth in Somalia." },
    { "id": "aid_015", "name": "EAC Scholarship Programme", "provider": "EAC / KfW", "type": "Scholarship", "coverage": "Full", "country": "Regional", "target": "Master's", "deadline": "Bi-annual", "link": "https://www.eac.int/",
    "desc": "Scholarships for Master's students in Mathematics, Engineering, Informatics, Science, Technology and Business Science." },
    { "id": "aid_016", "name": "ABE Initiative", "provider": "JICA", "type": "Scholarship", "coverage": "Full (Master's + Internship)", "country": "Regional", "target": "Master's", "deadline": "Annual", "link": "https://www.jica.go.jp/english/countries/africa/internship.html", "desc": "Master's Degree and Internship Program of African Business Education Initiative for Youth, bridging Africa-Japan industry networks." }
];

// --- 48. Apprenticeship Frameworks ---
const apprenticeshipFrameworks = {
    digital: {
        duration: "3 - 6 Months (Project-based)",
        objective: "Build a portfolio of real-world code/design.",
        role: "Bug fixing, testing, documentation, junior dev tasks.",
        employer: "Code reviews, mentorship, access to dev environment."
    },
    energy: {
        duration: "1 - 2 Years (Licensing Track)",
        objective: "Log required hours for national accreditation (e.g., EPRA).",
        role: "Installation support, wiring (supervised), strict HSE adherence.",
        employer: "Licensed supervision, safety gear (PPE), insurance."
    },
    agri: {
        duration: "3 - 6 Months (Seasonal)",
        objective: "Master crop cycles and farm management systems.",
        role: "Field scouting, data collection, equipment maintenance.",
        employer: "Technical guidance, safety training, transport/stipend."
    },
    default: {
        duration: "6 - 12 Months",
        objective: "Gain practical, on-the-job experience.",
        role: "Assist senior staff, maintain logbooks, follow safety protocols.",
        employer: "Provide supervision, tools, and certify completed hours."
    }
};

// --- 49. AI Tools ---
const aiTools = [
    { title: "ChatGPT / Claude", desc: "Drafting cover letters & interview practice.", link: "https://chatgpt.com/", icon: "message-square" },
    { title: "Resume Worded", desc: "AI scoring for your CV content.", link: "https://resumeworded.com/", icon: "file-text" },
    { title: "CareerVillage Coach", desc: "Personalized AI Career Coach.", link: "https://www.careervillage.org/", icon: "user-check" },
    { title: "Interview Warmup", desc: "Google's AI interview practice tool.", link: "https://grow.google/certificates/interview-warmup/", icon: "mic" },
    { title: "TealHQ", desc: "AI Resume Builder & Job Tracker.", link: "https://www.tealhq.com/", icon: "briefcase" },
    { title: "Yoodli", desc: "AI Interview Speech Coach.", link: "https://yoodli.ai/", icon: "video" }
];

// --- 50. Library Resources ---
const libraryResources = [
    { title: "How to Write an ATS-Friendly CV", desc: "Optimize your resume to pass through automated screening systems.", icon: "file-text", link: "https://www.jobscan.co/blog/ats-resume/" },
    { title: "Mastering the STAR Method for Interviews", desc: "Structure your answers to behavioral questions effectively.", icon: "star", link: "https://www.thebalancemoney.com/what-is-the-star-interview-response-technique-2061629" },
    { title: "Networking for Introverts", desc: "Strategies to build professional connections authentically.", icon: "users", link: "https://hbr.org/2011/02/a-networking-guide-for-introverts" },
    { title: "Salary Negotiation 101", desc: "Tips and scripts for discussing compensation.", icon: "banknote", link: "https://www.glassdoor.com/blog/guide/how-to-negotiate-your-salary/" },
    { title: "Building Your Personal Brand on LinkedIn", desc: "Optimize your profile to attract recruiters.", icon: "linkedin", link: "https://www.linkedin.com/business/marketing/blog/linkedin-ads/how-to-build-your-personal-brand-on-linkedin" },
    { title: "A Guide to Informational Interviews", desc: "Learn from professionals in your target field.", icon: "message-square", link: "https://career.berkeley.edu/start-exploring/informational-interviews/" }
];

// --- 51. Employer Connect Events ---
const employerConnectEvents = [
    { title: "Annual Career Fair", date: "Oct 15, 2025", type: "Virtual" },
    { title: "East Africa Graduate Recruitment Drive", date: "Nov 02, 2025", type: "Hybrid" },
    { title: "Industry Networking Night", date: "Monthly", type: "In-Person" },
    { title: "EAC Tech & Innovation Summit", date: "Mar 20, 2026", type: "Hybrid" },
    { title: "Green Energy Jobs Expo", date: "Jun 10, 2026", type: "In-Person" }
];

// --- 52. Alumni Networks ---
const alumniNetworks = [
    { name: "Sector Professionals EA", platform: "LinkedIn" },
    { name: "University Alumni Network", platform: "Portal" },
    { name: "Mastercard Foundation Alumni Network", platform: "Community Hub" },
    { name: "East Africa Women in Tech Alumni", platform: "LinkedIn" }
];

