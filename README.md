# Skills2Careers Compass

**© 2026 United Nations Educational, Scientific and Cultural Organization (UNESCO)**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![UNESCO](https://img.shields.io/badge/Owner-UNESCO-e63329)](https://unesco.org)

A career navigation and labour market intelligence platform for East Africa,
supporting learners, educators, and policymakers across the agriculture,
energy, and digital economy sectors. Developed in partnership with the
Inter-University Council for East Africa (IUCEA) and the East African
Community (EAC).

---

## What it does

- **Career pathway explorer** — guided wizard matching learner profiles to
  sector-specific career pathways across three priority sectors (agriculture,
  energy, digital economy) and six EAC member states.
- **Labour market intelligence** — live and curated data on hot skills,
  occupations, wages, and employer demand, sourced from Lightcast,
  LinkedIn Economic Graph, and national LMIS.
- **Training supply observatory** — cross-sector view of course availability,
  provider landscape, regional access gaps, and skills coverage.
- **Resource hub** — curated scholarships, research reports, and sector
  evidence.

## Status

Prototype — validated with partner institutions. Production pathway under
development. See [demo-run-of-show](https://[netlify-url]) for a guided
walkthrough (partner access only).

## Technology

Vanilla JavaScript · Tailwind CSS · Chart.js · No build step required.
Deployable as a static site on Netlify, GitHub Pages, or any web server.

## Getting started

```bash
# Clone the repository
git clone https://code.unesco.org/skills2careers/compass.git
cd compass

# Open locally — no server required for basic browsing
open index.html

# Or serve with any static file server, e.g.:
npx serve .
```

## Project structure

```
index.html          Main application entry point
data.js             Sector, skills, and LMI data
data-manager.js     Async data loader
render-hub.js       Career hub rendering
render-sectors.js   Sector detail and Observatory rendering
init.js             Application initialisation
state.js            Global application state
style.css           Custom styles
courses.json        Course catalogue (200+ courses)
resources_*.json    Curated resources by sector
vendor/             Vendored third-party libraries
img/                Images and logos
```

## Data sources

Labour market intelligence is sourced from:
- **Lightcast** (primary LMI data provider)
- **LinkedIn Economic Graph**
- **National LMIS** of EAC member states (Kenya, Uganda, Tanzania, Rwanda,
  Burundi, South Sudan)

Data is used under licence and may not be redistributed separately.
See [NOTICE](NOTICE) for full attribution.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). All contributors must sign the UNESCO
Contributor Licence Agreement before any code is merged.

## Governance

See [GOVERNANCE.md](GOVERNANCE.md). The platform is governed by a board with
permanent seats held by UNESCO HQ, IUCEA, and the EAC Secretariat.

## Licence

Copyright 2026 United Nations Educational, Scientific and Cultural
Organization (UNESCO).

Licensed under the [Apache License, Version 2.0](LICENSE).

The UNESCO name, logo, and wordmark are not covered by this licence.
Their use requires separate written authorisation from UNESCO's Bureau
of Public Information.

## Contact

UNESCO Education Sector · [Section name]  
7, Place de Fontenoy, 75352 Paris 07 SP, France  
[contact email to be confirmed]
