/**
 * Mapping to unify categories across digital (keys) and general (type property) resources.
 */
const CATEGORY_MAP = {
  // Keys from resources_digital.json
  'policy': 'Policy',
  'hubs': 'Hubs',
  'jobs': 'Jobs',
  'data': 'Data',
  'education': 'Education',
  'communities': 'Communities',

  // Types from resources_general.json
  'Policy/Regulation': 'Policy',
  'Ecosystem': 'Hubs',
  'Funding': 'Hubs', // Grouping Funding with Hubs/Ecosystem
  'Skills': 'Education',
  'Education': 'Education',
  'Jobs': 'Jobs',
  'Community': 'Communities',
  'Data/Research': 'Data'
};

/**
 * Flattens the country-specific resources into a normalized array.
 */
function getCountryResources(digitalResources, countryFilter) {
  const allResources = [];
  const countries = digitalResources.country_resources;

  Object.keys(countries).forEach(country => {
    // If a specific country is selected, skip others. Keep "All" to include everything.
    if (countryFilter !== 'All' && country !== countryFilter) return;

    const countryData = countries[country];
    
    // Iterate through categories (policy, hubs, etc.)
    Object.keys(countryData).forEach(key => {
      const category = CATEGORY_MAP[key] || 'Other';
      const items = countryData[key] || [];

      items.forEach(item => {
        allResources.push({
          ...item,
          category,
          country: country,
          source: 'National'
        });
      });
    });
  });

  return allResources;
}

/**
 * Flattens the general (regional/global) resources into a normalized array.
 */
function getGeneralResources(generalResources) {
  const allResources = [];
  
  // Process Regional Multipliers
  (generalResources.regional_multipliers || []).forEach(item => {
    allResources.push({
      ...item,
      category: CATEGORY_MAP[item.type] || 'Other',
      country: 'Regional',
      source: 'Regional'
    });
  });

  // Process Global Resources
  (generalResources.global_resources || []).forEach(item => {
    allResources.push({
      ...item,
      category: CATEGORY_MAP[item.type] || 'Other',
      country: 'Global',
      source: 'Global'
    });
  });

  return allResources;
}

/**
 * Main search function to filter resources.
 * 
 * @param {Object} digitalResources - The raw object from resources_digital.json
 * @param {Object} generalResources - The raw object from resources_general.json
 * @param {string} country - Selected country or "All"
 * @param {string} category - Selected category (Policy, Hubs, Jobs, Data, Education, Communities) or "All"
 * @param {string} query - Search text
 */
export function filterResources(digitalResources, generalResources, country, category, query) {
  // 1. Gather relevant resources
  let results = [
    ...getCountryResources(digitalResources, country),
    ...getGeneralResources(generalResources) // Always include general, or filter if strictly country-only is desired
  ];

  // 2. Filter by Category
  if (category && category !== 'All') {
    results = results.filter(r => r.category === category);
  }

  // 3. Filter by Search Query (Title or Description)
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(r => 
      (r.title && r.title.toLowerCase().includes(lowerQuery)) || 
      (r.desc && r.desc.toLowerCase().includes(lowerQuery))
    );
  }

  return results;
}
