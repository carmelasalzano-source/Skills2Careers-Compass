// --- RENDER FUNCTIONS ---

function formatTrainingList(trainingList) {
    if(!trainingList || trainingList.length === 0) return '<div class="text-xs text-slate-500 p-4 text-center italic">No specific courses found for this filter.</div>';
    
    return trainingList.map(t => {
        if(!t) return ''; 
        
        const modalityIcon = t.mode === 'Online' ? 'monitor' : t.mode === 'In-Person' ? 'map-pin' : 'shuffle';
        
        let scorecardHtml = '';
        const isSaved = myPlan.courses.has(t.id);
        const isNew = t.lastUpdated === '2025';
        const saveIconClass = isSaved ? "fill-indigo-600 text-indigo-600" : "text-slate-300 hover:text-indigo-600";

        // Trust Tags
        let tagsHtml = '';
        
        // 1. Outcome-tracked
        if (t.outcomeData && t.outcomeData.available) {
            tagsHtml += `<span class="text-[9px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-1" title="Employment outcomes verified"><i data-lucide="bar-chart-2" class="w-2.5 h-2.5"></i> Outcome-tracked</span>`;
        }

        // 2. Stackable (Check outcomeData or infer from type)
        const isStackable = t.outcomeData.stackable || (t.type && (t.type.includes('Micro') || t.type.includes('Cert') || t.type.includes('Badge') || t.type.includes('Degree')));
        if (isStackable) {
            tagsHtml += `<span class="text-[9px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-1" title="Counts towards larger qualification"><i data-lucide="layers" class="w-2.5 h-2.5"></i> Stackable</span>`;
        }

        // 3. Credit-bearing
        if (t.micro_credential_policy && t.micro_credential_policy.credit_recognition) {
            tagsHtml += `<span class="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 flex items-center gap-1" title="Recognized as credit toward degree"><i data-lucide="graduation-cap" class="w-2.5 h-2.5"></i> Credit-bearing</span>`;
        }

        // 4. Low-cost / Subsidized / ISA
        const costLower = (t.cost || '').toLowerCase();
        const costTypeLower = (t.costType || '').toLowerCase();
        if (costTypeLower === 'free' || costTypeLower === 'subsidized' || costLower.includes('isa') || costLower.includes('income share') || costLower.includes('free')) {
             let label = 'Low-cost';
             if (costLower.includes('isa') || costLower.includes('income share')) label = 'ISA Available';
             else if (costTypeLower === 'subsidized') label = 'Subsidized';
             
             tagsHtml += `<span class="text-[9px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-1" title="Financial accessibility"><i data-lucide="banknote" class="w-2.5 h-2.5"></i> ${label}</span>`;
        }

        // Accreditation (Keep as it's valuable)
        if (t.outcomeData.accreditation === 'Accredited') {
            tagsHtml += `<span class="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1" title="Nationally Accredited"><i data-lucide="shield-check" class="w-2.5 h-2.5"></i> Accredited</span>`;
        }
        
        // QA Framework Tags
        if (t.qa_framework) {
            if (t.qa_framework.regulator_id) {
                tagsHtml += `<span class="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1" title="Regulator ID: ${t.qa_framework.regulator_id}"><i data-lucide="file-badge" class="w-2.5 h-2.5"></i> Regulated</span>`;
            }
            if (t.qa_framework.practical_theory_ratio) {
                tagsHtml += `<span class="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1" title="Practical to Theory Ratio"><i data-lucide="hammer" class="w-2.5 h-2.5"></i> ${t.qa_framework.practical_theory_ratio} Practical</span>`;
            }
        }

        // Micro-credential Policy Tags
        if (t.micro_credential_policy) {
            if (t.micro_credential_policy.standalone_cert) {
                tagsHtml += `<span class="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 flex items-center gap-1" title="Available as standalone professional certificate"><i data-lucide="award" class="w-2.5 h-2.5"></i> Pro Cert</span>`;
            }
            if (t.micro_credential_policy.alternative_pathway) {
                tagsHtml += `<span class="text-[9px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-1" title="Alternative admission pathway"><i data-lucide="shuffle" class="w-2.5 h-2.5"></i> Alt Pathway</span>`;
            }
        }

        if (t.outcomeData && t.outcomeData.available) {
            // ... existing scorecard logic ...
            const stars = Array(5).fill(0).map((_, i) => 
                `<i data-lucide="star" class="w-3 h-3 ${i < t.outcomeData.stars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}"></i>`
            ).join('');

            const sampleSize = (t.outcomeData.evidence && t.outcomeData.evidence.sample) ? t.outcomeData.evidence.sample : 'N/A';

            scorecardHtml = `
                <div class="mt-3 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                    <div class="bg-indigo-50 px-3 py-1.5 border-b border-indigo-100 flex justify-between items-center">
                        <span class="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">Provider Outcome Scorecard</span>
                        <div class="flex items-center gap-1.5">
                            <span class="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">Provider Outcome Scorecard</span>
                            <i data-lucide="info" class="w-3 h-3 text-indigo-400 cursor-help" title="Source: ${t.outcomeData.methodology} &#10;Sample: ${sampleSize}"></i>
                        </div>
                        <div class="flex gap-0.5" title="Evidence Strength: ${t.outcomeData.stars}/5">${stars}</div>
                    </div>
                    <div class="p-3">
                        <div class="grid grid-cols-3 gap-2 text-center mb-3">
                            <div>
                                <div class="text-[9px] text-slate-500 uppercase">Completion</div>
                                <div class="text-xs font-bold text-slate-800">${t.outcomeData.evidence ? t.outcomeData.evidence.completion : 'N/A'}</div>
                            </div>
                            <div class="border-x border-slate-100">
                                <div class="text-[9px] text-slate-500 uppercase">Time-to-Job</div>
                                <div class="text-xs font-bold text-slate-800">${t.outcomeData.evidence ? t.outcomeData.evidence.timeToJob : 'N/A'}</div>
                            </div>
                            <div>
                                <div class="text-[9px] text-slate-500 uppercase">Sample</div>
                                <div class="text-xs font-bold text-slate-800">${t.outcomeData.evidence ? t.outcomeData.evidence.sample : 'N/A'}</div>
                            </div>
                        </div>
                        <div class="flex justify-between items-center pt-2 border-t border-slate-100">
                            <div class="text-[10px] text-slate-500">Method: <span class="font-bold text-indigo-700">${t.outcomeData.methodology}</span></div>
                            <div class="text-[10px] font-bold text-blue-600">Uplift: ${t.outcomeData.uplift}</div>
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
                            ${isNew ? '<span class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-700 animate-pulse">NEW</span>' : ''}
                        </a>
                        <div class="text-xs text-slate-500 mt-0.5 flex items-center gap-1 flex-wrap">
                            ${t.school}
                            ${t.women_focused ? '<span title="Women-Focused Program" class="text-[9px] bg-sky-100 text-sky-700 px-1 rounded border border-sky-200">Women-Focused</span>' : ''}
                        </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <div class="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-full border border-slate-200 whitespace-nowrap">${t.type}</div>
                        <button onclick="event.stopPropagation(); togglePlanItem('courses', '${t.id}', '${t.name.replace(/'/g, "\\'")}')" class="p-1 rounded-full hover:bg-slate-50 transition-colors"><i data-lucide="bookmark" class="w-4 h-4 ${saveIconClass}"></i></button>
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-3">
                    ${tagsHtml}
                </div>

                <!-- Added Description Section -->
                <div class="text-xs text-slate-600 mb-3 leading-snug line-clamp-3">
                    ${t.description || 'No description available.'}
                </div>

                ${t.micro_credential_policy && t.micro_credential_policy.partners && t.micro_credential_policy.partners.length > 0 ? 
                    `<div class="text-[10px] text-slate-500 mb-3 pt-2 border-t border-slate-50 flex items-center gap-1">
                        <span class="font-bold">Partners:</span> ${t.micro_credential_policy.partners.join(', ')}
                     </div>` : ''}

                <div class="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 mb-3">
                    <div class="text-center">
                        <div class="text-sm font-bold text-slate-700">${t.durationMonths}</div>
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
                        <div class="p-1 bg-indigo-50 text-indigo-600 rounded-full shrink-0 mt-0.5"><i data-lucide="cpu" class="w-3 h-3"></i></div>
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
                <div class="flex justify-between items-end mt-3 pt-2 border-t border-slate-50">
                    <div class="flex flex-col gap-1">
                        <div class="text-[9px] text-slate-400 italic">Updated: ${t.lastUpdated || '2024'}</div>
                        <button onclick="event.stopPropagation(); window.open('mailto:support@ai4eac.org?subject=Broken Link Report: ${encodeURIComponent(t.name)}', '_blank')" class="text-[9px] text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors" title="Report Broken Link">
                            <i data-lucide="flag" class="w-2.5 h-2.5"></i> Report Issue
                        </button>
                    </div>
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
    refreshIcons();
}

// --- NEW: Switch Sector inside PATHWAY ---
window.switchPathwaySector = function(sector) {
    // Use global setter to sync UI and state
    setGlobalSector(sector);

    // Re-render PATHWAY content
    renderPathwayContent();
}

// --- NEW: Skill Gap Analysis Utility ---
window.getSkillGapAnalysis = function(targetRole, userSkillsList) {
    // Ensure data is available
    if (typeof roleSkills === 'undefined') {
        console.warn("roleSkills data not loaded.");
        return null;
    }
    
    const targetData = roleSkills[targetRole];
    if (!targetData) {
        console.warn(`Role '${targetRole}' not found in database.`);
        return { error: "Role not found", matchScore: 0, technicalGaps: [], employabilityGaps: [] };
    }

    const requiredTech = targetData.technical || [];
    const requiredSoft = targetData.employability || [];
    
    // Normalize user skills for comparison (case-insensitive)
    const userSet = new Set((userSkillsList || []).map(s => s.toLowerCase().trim()));

    // Identify Gaps (Return original casing from required list)
    const techGaps = requiredTech.filter(s => !userSet.has(s.toLowerCase().trim()));
    const softGaps = requiredSoft.filter(s => !userSet.has(s.toLowerCase().trim()));
    
    // Calculate Match Score
    const totalRequired = requiredTech.length + requiredSoft.length;
    const totalGaps = techGaps.length + softGaps.length;
    const matchScore = totalRequired > 0 ? Math.round(((totalRequired - totalGaps) / totalRequired) * 100) : 0;

    return {
        role: targetRole,
        matchScore,
        technicalGaps: techGaps,
        employabilityGaps: softGaps,
        totalRequired
    };
}

// --- NEW: Calculate Diagnostic Results (Updated with Skills Analysis) ---
window.calculateDiagnosticResults = function(scopeId) {
    const scope = scopeId ? (document.getElementById(scopeId) || document) : document;
    // 1. Get Values & Analyze Individual Inputs
    const layerAInputs = scope.querySelectorAll('input[name="layerA"]');
    const layerBInputs = scope.querySelectorAll('input[name="layerB"]');

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
    const evidenceInputs = scope.querySelectorAll('input[name="profile_evidence"]:checked');
    // Map 0-5+ items to a 1-5 score roughly
    const scoreEvidence = Math.min(evidenceInputs.length + 1, 5);

    // 1c. Analyze Qualifications (NEW)
    const qualChecks = scope.querySelectorAll('input[name="qual_check"]');
    const qualChecked = scope.querySelectorAll('input[name="qual_check"]:checked');
    const scoreQuals = qualChecks.length > 0 ? ((qualChecked.length / qualChecks.length) * 4) + 1 : 1;

    // Get Selected Role
    const roleSelect = scope.querySelector('#pp-role-selector');
    const selectedRole = roleSelect ? roleSelect.value : "Selected Role";

    // 2. Weighted Average (10% Quals, 50% Tech, 30% Soft, 10% Evidence)
    const totalScore = (scoreQuals * 0.1) + (scoreB * 0.5) + (scoreA * 0.3) + (scoreEvidence * 0.1);
    const percent = Math.round((totalScore / 5) * 100);

    // 3. Run Skill Gap Analysis (Using Utility)
    // We consider a skill "possessed" if score >= 4 (Proficient) to maintain high standards
    const userSkillsList = allSkillsData.filter(s => s.score >= 4).map(s => s.skill);
    const analysis = window.getSkillGapAnalysis(selectedRole, userSkillsList);
    const techGaps = analysis.technicalGaps;
    const empGaps = analysis.employabilityGaps;

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
        nextStep = "Apply for junior roles & polish your portfolio";
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
    // 4. Narrative Generation
    const strengths = allSkillsData.filter(s => s.score >= 4).map(s => s.skill);
    const allGaps = [...techGaps, ...empGaps];

    let synthesisText = '';
    // Use tier/percent to drive the main narrative for consistency
    if (percent > 85) {
        synthesisText = `Excellent work! You demonstrate high proficiency across key areas for this role.`;
        if (allGaps.length > 0) synthesisText += ` Consider polishing <strong>${allGaps.slice(0, 2).join(', ')}</strong> to reach expert level.`;
        else synthesisText += ` Focus on your portfolio building and networking.`;
    } else if (percent > 65) {
        synthesisText = `You have a solid foundation.`;
        if (strengths.length > 0) synthesisText += ` You are strong in <strong>${strengths.slice(0, 2).join(', ')}</strong>.`;
        if (allGaps.length > 0) synthesisText += ` To become fully job-ready, focus on strengthening <strong>${allGaps.slice(0, 3).join(', ')}</strong>.`;
    } else if (percent > 40) {
        synthesisText = `You are making good progress but have some key gaps.`;
        if (allGaps.length > 0) synthesisText += ` Prioritize training in <strong>${allGaps.slice(0, 3).join(', ')}</strong> to build your profile.`;
    } else {
        synthesisText = `You are at the beginning of your journey. Focus on foundational training in <strong>${allGaps.slice(0, 3).join(', ')}</strong>.`;
    }

    // --- NEW: Dynamic Related Roles Logic ---
    const currentRoleSkills = (typeof roleSkills !== 'undefined' && roleSkills[selectedRole]) ? new Set(roleSkills[selectedRole].technical) : new Set();
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

    // Cache diagnostic key fields for cross-view use
    pathwayState.diagnosticRole = selectedRole;
    pathwayState.diagnosticTierCode = tierCode;
    pathwayState.diagnosticGapSkill = allGaps.length > 0 ? allGaps[0] : null;
    pathwayState.diagnosticSector = activeSectorId;
    pathwayState.diagnosticCountry = activeCountry;
    pathwayState.diagnosticEmpGaps = empGaps;
    pathwayState.diagnosticTechGaps = techGaps;
    pathwayState.diagnosticScore = percent;

    // Hide Inputs
    const inputsContainer = scope.querySelector('#diagnostic-inputs');
    if(inputsContainer) inputsContainer.classList.add('hidden');

    // 6. Render Results
    const resultsDiv = scope.querySelector('#diagnostic-results');

    // Dynamic data generation for new UI
    const matchStatus = percent > 65 ? "Strong Match" : percent > 40 ? "Good Match" : "Poor Match";
    const matchColor = percent > 65 ? "blue" : percent > 40 ? "amber" : "slate";
    const fitText = percent > 65 ? "Great Fit" : percent > 40 ? "Good Fit" : "Poor Fit";
    const fitTextColor = percent > 65 ? "text-blue-600" : percent > 40 ? "text-amber-600" : "text-slate-600";
    
    let summaryText = percent > 85 ? "you are highly qualified for this role." : percent > 65 ? "you are well-qualified for this role." : percent > 40 ? "you have a foundational match for this role." : "you have several skills strengths and gaps to address for this role.";
    if (scoreQuals < 3) summaryText += " Note: You may be missing key qualifications.";

    // Get role options for the dropdown
    let sectorOccupations = dataManager.getOccupations(activeSectorId, activeCountry);
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
                    <button onclick="renderPathwayStep0('${selectedRole}')" class="text-[10px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm transition-colors"><i data-lucide="rotate-ccw" class="w-3 h-3"></i> Retake</button>
                    <button onclick="window.print()" class="text-[10px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm transition-colors"><i data-lucide="printer" class="w-3 h-3"></i> Print</button>
                    <span class="px-2 py-1 rounded-full bg-${matchColor}-100 text-${matchColor}-700 text-[10px] font-bold uppercase tracking-wider">${matchStatus}</span>
                </div>
            </div>
            <select onchange="renderPathwayStep0(this.value)" class="w-full text-sm border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2">
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
                    <div class="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full" style="width: ${percent}%"></div>
                </div>
            </div>

            <!-- 2. Assessment Synthesis (Restored) -->
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <i data-lucide="lightbulb" class="w-3 h-3 text-amber-500"></i> Assessment Synthesis
                </h4>
                <p class="text-sm text-slate-700 leading-relaxed">${synthesisText}</p>
            </div>

            <!-- Next Step CTAs -->
            <div class="mt-6 pt-4 border-t border-slate-100">
                <p class="text-xs font-bold text-slate-500 uppercase mb-3 text-center">What next?</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onclick="renderPathwayGoal()" class="py-2.5 bg-indigo-600 border border-indigo-700 text-white font-bold rounded-lg text-xs hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                        <i data-lucide="map" class="w-3.5 h-3.5"></i> Choose My Goal
                    </button>
                    <button onclick="openSkillsView('pp-courses')" class="py-2.5 bg-blue-50 border border-blue-100 text-blue-700 font-bold rounded-lg text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                        <i data-lucide="search" class="w-3.5 h-3.5"></i> Find Courses
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });

    refreshIcons();
}


// --- Render PATHWAY Content (Restored & Attached to Window) ---
window.renderPathwayContent = function(preSelectedRole = null, preSelectedGoal = null) {
    const sector = activeSectorId;
    let themeColor = 'indigo';
    
    // REMOVED: Sync dropdown value logic (moved to inline HTML generation)

    // --- DATA DEFINITIONS ---
    const context = (typeof sectorContextMap !== 'undefined') ? (sectorContextMap[sector] || sectorContextMap['digital']) : {};


    const activeData = (typeof diagnosticData !== 'undefined') ? (diagnosticData[sector] || diagnosticData['digital']) : { theme: 'indigo', roles: [] };
    themeColor = activeData.theme;

    // --- DETERMINE CURRENT ROLE FIRST (Moved up to fix scope issue) ---
    // Use DataManager to ensure we pull from the same source as the dashboard (Top 10)
    let sectorOccupations = dataManager.getOccupations(sector, activeCountry);
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
    const badgeInfo = (currentRoleName && typeof roleBadgeMap !== 'undefined' && roleBadgeMap[currentRoleName]) ? roleBadgeMap[currentRoleName] : { title: activeData.badgeTitle, provider: activeData.badgeProvider, standard: activeData.badgeStandard };

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

                <!-- Role Selector + Context bar -->
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Target Role</label>
                    <select id="pp-role-selector" data-prev="${currentRoleName}" onchange="confirmRoleChange(this.value, this)" class="w-full text-sm font-bold text-slate-700 border-slate-300 rounded-lg shadow-sm focus:border-${themeColor}-500 focus:ring-${themeColor}-500 p-2.5 mb-2">
                        ${roleOptions}
                    </select>
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span class="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-full"><i data-lucide="map-pin" class="w-2.5 h-2.5"></i> ${activeCountry === 'all' ? 'Regional' : activeCountry}</span>
                            <span class="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-full"><i data-lucide="briefcase" class="w-2.5 h-2.5"></i> ${sector === 'agri' ? 'Agritech' : sector === 'energy' ? 'Renewable Energy' : 'Digital Economy'}</span>
                        </div>
                        <div class="flex bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm shrink-0">
                            <button onclick="setCPDMode(false)" class="px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${!pathwayState.cpdMode ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700'}">Exploring</button>
                            <button onclick="setCPDMode(true)" class="px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${pathwayState.cpdMode ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700'}">Working (CPD)</button>
                        </div>
                    </div>
                </div>

                <!-- 2. THE GATEKEEPER (Qualifications) -->
                <div id="diag-section-1">
                    <h3 class="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">1</span>
                        Minimum Qualifications Check
                    </h3>
                    <p class="text-[10px] text-slate-400 italic mb-3 ml-8">These are typical requirements. Specific employers may request different qualifications or occupational standards.</p>
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
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
                </div>

                <!-- 3. SKILLS SCAN -->
                <div id="diag-section-2" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">2</span>
                            Technical Skills
                        </h3>
                        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            ${layerBInputs}
                        </div>
                    </div>
                    <div id="diag-section-3">
                        <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
                            Interpersonal & Soft Skills
                        </h3>
                        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            ${layerAInputs}
                        </div>
                    </div>
                </div>

                <!-- 4. EVIDENCE -->
                <div id="diag-section-4">
                    <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold">4</span>
                        My Portfolio
                    </h3>
                    <div class="bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <button onclick="calculateDiagnosticResults('pp-diagnostic-content')" class="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm">
                    Generate Readiness Report <i data-lucide="sparkles" class="w-4 h-4 text-yellow-400"></i>
                </button>
            </div>

            <!-- RESULTS CONTAINER (Empty initially) -->
            <div id="diagnostic-results"></div>
        `;
    }

    // Practice Tab — only initialize if a specific goal was deep-linked, or the container is empty
    const pracContainer = document.getElementById('pp-practice-content');
    if(pracContainer && (preSelectedGoal || !pracContainer.innerHTML.trim())) {
        initPathwayWizard(preSelectedGoal);
    }

    refreshIcons();
}

// --- PATHWAY BUILDER WIZARD ---

window.updatePathwayBackNav = function(label, onclickStr) {
    var ppPractice = document.getElementById('pp-practice');
    if (!ppPractice) return;
    var nav = ppPractice.querySelector('.pp-back-nav');
    if (nav) {
        nav.innerHTML = '<button onclick="' + onclickStr + '" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"><i data-lucide="arrow-left" class="w-4 h-4"></i> ' + label + '</button>';
        refreshIcons();
    }
}

function getBestMatchGoal() {
    if (pathwayState.cpdMode) return null;
    if (pathwayState.diagnosticScore !== undefined && pathwayState.diagnosticScore < 40) return 'Build My Foundation';
    if (pathwayState.diagnosticScore !== undefined && pathwayState.diagnosticScore >= 70) return null;
    var interest = pathwayState.interest;
    if (!interest && pathwayState.profile) {
        var trait = pathwayState.profile.trait;
        if (trait === 'R' || trait === 'I') interest = 'tech';
        else if (trait === 'E') interest = 'mgmt';
        else if (trait === 'A' || trait === 'S') interest = 'creative';
        else interest = 'data';
    }
    if (!interest) return null;
    if (interest === 'mgmt' || interest === 'biz') return 'Start my own Venture';
    if (interest === 'tech' || interest === 'code' || interest === 'hands-on' || interest === 'field') return 'Apprenticeships and Job Placements';
    return 'Entry Level Job';
}

window.initPathwayWizard = function(preSelectedGoal = null, entryPoint = 'hub') {
    pathwayState = { goal: preSelectedGoal, constraints: {}, interest: null, entryPoint: entryPoint };
    if (preSelectedGoal) {
        renderPathwayStep3();
    } else {
        renderPathwayStep1();
    }
}

// --- Step 0: Skills Assessment (entry gate to the pathway) ---
window.renderPathwayStep0 = function(preSelectedRole) {
    const container = document.getElementById('pp-practice-content');
    if (!container) return;

    const sector = activeSectorId;
    const activeData = (typeof diagnosticData !== 'undefined') ? (diagnosticData[sector] || diagnosticData['digital']) : { theme: 'indigo', roles: [] };
    const themeColor = activeData.theme || 'indigo';

    let sectorOccupations = dataManager.getOccupations(sector, activeCountry);
    if (!sectorOccupations || sectorOccupations.length === 0) {
        sectorOccupations = baseSectorDetailData[sector] ? baseSectorDetailData[sector].occupations : activeData.roles.map(r => ({name: r}));
    }

    // Filter occupations to the chosen interest family
    const interestOccupationMap = {
        agri: {
            tech:  ['Precision Ag Specialist', 'Farm IoT Engineer', 'Drone Pilot', 'Soil Data Analyst', 'Digital Extension Officer', 'Climate Risk Analyst'],
            field: ['Agricultural Extension Officer', 'Post-Harvest Specialist', 'Smart Irrigation Tech', 'Urban Farming Architect', 'Digital Extension Officer'],
            biz:   ['Supply Chain Manager', 'Agri-Input Sales', 'Post-Harvest Specialist']
        },
        energy: {
            'hands-on': ['Solar PV Installer', 'Smart Meter Tech', 'Wind Turbine Tech', 'Geothermal Technician', 'EV Charging Tech'],
            design:     ['Grid Systems Engineer', 'Bioenergy Specialist', 'Energy Storage Specialist', 'EV Charging Tech'],
            mgmt:       ['Energy Auditor', 'Energy Policy Analyst', 'Project Manager', 'Safety Inspector']
        },
        digital: {
            code:     ['Frontend Dev', 'Backend Dev', 'Blockchain Developer', 'DevOps Engineer', 'Cloud Architect'],
            data:     ['Data Scientist', 'AI/ML Engineer', 'Cybersecurity Analyst', 'Systems Administrator'],
            creative: ['UX/UI Designer', 'Digital Marketer', 'Product Manager']
        }
    };
    let filteredOccupations = sectorOccupations;
    if (pathwayState.interest && interestOccupationMap[sector] && interestOccupationMap[sector][pathwayState.interest]) {
        const interestNames = interestOccupationMap[sector][pathwayState.interest];
        const matched = sectorOccupations.filter(o => interestNames.includes(o.name));
        if (matched.length > 0) filteredOccupations = matched;
    }

    const currentRoleName = preSelectedRole || (filteredOccupations.length > 0 ? filteredOccupations[0].name : '');
    const sectorDisplayName = sector === 'agri' ? 'Agritech' : sector === 'energy' ? 'Renewable Energy' : 'Digital Economy';
    const roleDetails = getOccupationDetails(currentRoleName, sectorDisplayName);
    const techSkills = roleDetails.specificSkills.technical.slice(0, 5);
    const empSkills = roleDetails.specificSkills.employability.slice(0, 5);

    const quals = (typeof roleQualifications !== 'undefined' && roleQualifications[currentRoleName])
        ? roleQualifications[currentRoleName]
        : { education: 'Relevant Degree/Diploma', certification: 'Industry Standard Cert', experience: '1-2 Years' };

    const roleOptions = filteredOccupations.map(r => {
        const isSelected = (r.name === currentRoleName) ? 'selected' : '';
        return `<option value="${r.name}" ${isSelected}>${r.name}</option>`;
    }).join('');

    const layerBInputs = techSkills.map(item => `
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

    const layerAInputs = empSkills.map(item => `
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

    const interestDisplayMap = {
        tech: 'Technology & Data', field: 'Field & Crops', biz: 'Business & Trade',
        'hands-on': 'Installation & Fixes', design: 'Design & Engineering', mgmt: 'Management & Audit',
        code: 'Building & Coding', data: 'Data & Logic', creative: 'Design & Strategy'
    };
    const interestLabel = pathwayState.interest ? (interestDisplayMap[pathwayState.interest] || pathwayState.interest) : null;

    container.innerHTML = `
        <div class="animate-fade-in py-2">
            <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <i data-lucide="clipboard-check" class="w-5 h-5"></i>
                </div>
                <div>
                    <h2 class="text-base font-bold text-slate-900 leading-tight">Check Your Readiness</h2>
                    <p class="text-xs text-slate-500 mt-0.5">Rate your skills to personalise your pathway. Takes 2 minutes.</p>
                    ${interestLabel ? `<div class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full"><i data-lucide="zap" class="w-3 h-3"></i> ${interestLabel}</div>` : ''}
                </div>
            </div>

            <div id="diagnostic-inputs" class="bg-white p-5 rounded-xl border border-slate-200 space-y-6 shadow-sm">
                <!-- Role Selector -->
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Target Role</label>
                    <select id="pp-role-selector" onchange="renderPathwayStep0(this.value)" class="w-full text-sm font-bold text-slate-700 border-slate-300 rounded-lg shadow-sm focus:border-${themeColor}-500 focus:ring-${themeColor}-500 p-2.5 mb-2">
                        ${roleOptions}
                    </select>
                    <div class="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span class="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-full"><i data-lucide="map-pin" class="w-2.5 h-2.5"></i> ${activeCountry === 'all' ? 'Regional' : activeCountry}</span>
                        <span class="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-full"><i data-lucide="briefcase" class="w-2.5 h-2.5"></i> ${sectorDisplayName}</span>
                    </div>
                </div>

                <!-- 1. Qualifications -->
                <div id="diag-section-1">
                    <h3 class="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">1</span>
                        Minimum Qualifications Check
                    </h3>
                    <p class="text-[10px] text-slate-400 italic mb-3 ml-8">These are typical requirements. Specific employers may vary.</p>
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label class="p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-${themeColor}-400 transition-all bg-white relative">
                                <input type="checkbox" name="qual_check" value="edu" class="peer sr-only">
                                <div class="absolute top-3 right-3 w-4 h-4 border-2 border-slate-300 rounded-full peer-checked:bg-${themeColor}-500 peer-checked:border-${themeColor}-500 transition-colors"></div>
                                <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Education</div>
                                <div class="text-xs text-slate-700 font-medium pr-4">${quals.education}</div>
                            </label>
                            <label class="p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-${themeColor}-400 transition-all bg-white relative">
                                <input type="checkbox" name="qual_check" value="cert" class="peer sr-only">
                                <div class="absolute top-3 right-3 w-4 h-4 border-2 border-slate-300 rounded-full peer-checked:bg-${themeColor}-500 peer-checked:border-${themeColor}-500 transition-colors"></div>
                                <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Certification</div>
                                <div class="text-xs text-slate-700 font-medium pr-4">${quals.certification}</div>
                            </label>
                            <label class="p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-${themeColor}-400 transition-all bg-white relative">
                                <input type="checkbox" name="qual_check" value="exp" class="peer sr-only">
                                <div class="absolute top-3 right-3 w-4 h-4 border-2 border-slate-300 rounded-full peer-checked:bg-${themeColor}-500 peer-checked:border-${themeColor}-500 transition-colors"></div>
                                <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">Experience</div>
                                <div class="text-xs text-slate-700 font-medium pr-4">${quals.experience}</div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- 2 & 3. Skills Sliders -->
                <div id="diag-section-2" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">2</span>
                            Technical Skills
                        </h3>
                        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">${layerBInputs}</div>
                    </div>
                    <div id="diag-section-3">
                        <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
                            Interpersonal &amp; Soft Skills
                        </h3>
                        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">${layerAInputs}</div>
                    </div>
                </div>

                <!-- 4. Portfolio -->
                <div id="diag-section-4">
                    <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold">4</span>
                        My Portfolio
                    </h3>
                    <div class="bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <button onclick="calculateDiagnosticResults('pp-practice-content')" class="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm">
                    Generate Readiness Report <i data-lucide="sparkles" class="w-4 h-4 text-yellow-400"></i>
                </button>
            </div>

            <!-- Results appear here after generation -->
            <div id="diagnostic-results"></div>
        </div>
    `;
    const backSkipNav = document.querySelector('#pp-practice .pp-back-nav');
    if (backSkipNav) {
        backSkipNav.className = 'pp-back-nav mb-4 flex items-center gap-2';
        backSkipNav.innerHTML =
            '<button onclick="renderPathwayQuiz()" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>' +
            '<button onclick="renderPathwayGoal()" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm">Skip <i data-lucide="arrow-right" class="w-4 h-4"></i></button>';
    }
    refreshIcons();
};

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

    const sectorName = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';
    const countryName = activeCountry === 'all' ? 'East Africa (Regional)' : activeCountry;

    container.innerHTML = `
        <div class="animate-fade-in py-2">

            <!-- Header -->
            <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <i data-lucide="map" class="w-5 h-5"></i>
                </div>
                <div>
                    <h2 class="text-base font-bold text-slate-900 leading-tight">Build Your Pathway</h2>
                    <p class="text-xs text-slate-500 mt-0.5">Tell us your focus and we'll build your roadmap.</p>
                </div>
            </div>

            <!-- Context Form -->
            <div class="space-y-3 mb-5">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Sector</label>
                    <select onchange="updatePathwaySector(this.value);" class="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                        <option value="agri" ${activeSectorId === 'agri' ? 'selected' : ''}>Agritech</option>
                        <option value="energy" ${activeSectorId === 'energy' ? 'selected' : ''}>Renewable Energy</option>
                        <option value="digital" ${activeSectorId === 'digital' ? 'selected' : ''}>Digital Economy</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Location</label>
                    <select onchange="setGlobalCountry(this.value); renderPathwayStep1();" class="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                        <option value="all" ${activeCountry === 'all' ? 'selected' : ''}>Regional (All Countries)</option>
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

            <!-- Value pills -->
            <div class="flex items-center justify-center gap-2 mb-6 flex-wrap">
                <span class="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full"><i data-lucide="briefcase" class="w-3 h-3"></i> Matched Roles</span>
                <span class="text-slate-300 text-xs">·</span>
                <span class="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full"><i data-lucide="trending-up" class="w-3 h-3"></i> Strengths &amp; Gaps</span>
                <span class="text-slate-300 text-xs">·</span>
                <span class="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full"><i data-lucide="book-open" class="w-3 h-3"></i> Curated Courses</span>
            </div>

            <!-- CTA -->
            <button onclick="renderPathwayQuiz()" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-sm">
                Get Started <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    updatePathwayBackNav('Back to Hub', 'navigateBackInHub()');
    refreshIcons();
}

function _renderGoalCard(g, color, tagline, isBestMatch) {
    var borderClass = isBestMatch ? ('border-2 border-' + color + '-400') : ('border border-slate-200 hover:border-' + color + '-300');
    var bestMatchBadge = isBestMatch ? ('<span class="shrink-0 bg-' + color + '-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">Best Match</span>') : '';
    return '<button onclick="selectPathwayGoal(\'' + g.title.replace(/'/g, "\\'") + '\')" class="flex items-center gap-4 p-4 bg-slate-50 ' + borderClass + ' rounded-xl hover:shadow-md transition-all text-left group w-full">' +
        '<div class="shrink-0 w-11 h-11 bg-' + color + '-50 text-' + color + '-600 rounded-lg flex items-center justify-center group-hover:bg-' + color + '-600 group-hover:text-white transition-colors"><i data-lucide="' + g.icon + '" class="w-5 h-5"></i></div>' +
        '<div class="flex-1 min-w-0">' +
            '<div class="flex items-center gap-2 mb-0.5">' +
                '<h3 class="font-bold text-sm text-slate-800">' + g.title + '</h3>' +
                bestMatchBadge +
            '</div>' +
            '<p class="text-xs text-slate-500">' + g.desc + '</p>' +
        '</div>' +
        '<i data-lucide="chevron-right" class="shrink-0 w-4 h-4 text-slate-300 group-hover:text-' + color + '-500 transition-colors"></i>' +
        '</button>';
}

window.togglePlacementSection = function(id) {
    const el = document.getElementById(id);
    const chevron = document.getElementById('chevron-' + id);
    if (!el) return;
    const isOpen = !el.classList.contains('hidden');
    el.classList.toggle('hidden');
    if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
    refreshIcons();
}

window.selectPathwayGoal = function(goal) {
    pathwayState.goal = goal;
    if (goal === 'Start my own Venture') {
        openSkillsView('pp-launchpad');
    } else {
        renderPathwayStep3();
    }
}

window.selectUpskillingGoal = function(goalId) {
    pathwayState.upskillingGoal = goalId;
    renderPathwayStep3();
}

window.selectUpskillingFilter = function(focus, skillArea) {
    if (focus !== null) pathwayState.upskillingGoal = (focus === 'all' ? null : focus);
    if (skillArea !== null) pathwayState.upskillingSkillArea = (skillArea === 'all' ? null : skillArea);
    renderPathwayStep3();
}

window.selectUpskillingTab = function(tab) {
    pathwayState.upskillingTab = (tab === 'all' ? null : tab);
    renderPathwayStep3();
}

// --- Step 2: Interest Selection (combined quick match + deep dive option) ---
window.renderPathwayQuiz = function() {
    const container = document.getElementById('pp-practice-content');
    if(!container) return;

    const sector = activeSectorId;
    let theme = 'indigo';
    if (sector === 'agri') theme = 'blue';
    if (sector === 'energy') theme = 'sky';

    const options = (typeof pathwayQuizOptions !== 'undefined') ? (pathwayQuizOptions[sector] || pathwayQuizOptions['digital']) : [];
    const activeRoles = (typeof sectorRoles !== 'undefined') ? (sectorRoles[activeSectorId] || sectorRoles['agri']) : { tech: "N/A", biz: "N/A", venture: "N/A" };
    const interestToRoleKeyMap = {
        agri: { tech: 'tech', field: 'biz', biz: 'venture' },
        energy: { 'hands-on': 'tech', design: 'biz', mgmt: 'venture' },
        digital: { code: 'tech', data: 'biz', creative: 'venture' }
    };
    const roleKeyMap = interestToRoleKeyMap[sector] || interestToRoleKeyMap['digital'];

    container.innerHTML = `
        <div class="animate-fade-in py-2">

            <!-- Header -->
            <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-${theme}-100 text-${theme}-600 flex items-center justify-center shrink-0">
                    <i data-lucide="sparkles" class="w-5 h-5"></i>
                </div>
                <div>
                    <h2 class="text-base font-bold text-slate-900 leading-tight">What sounds most like you?</h2>
                    <p class="text-xs text-slate-500 mt-0.5">Pick the area that best matches your interests.</p>
                </div>
            </div>

            <!-- Interest Options — horizontal rows -->
            <div class="space-y-3 mb-5">
                ${options.map(opt => {
                    const roleKey = roleKeyMap[opt.id];
                    const roleText = activeRoles[roleKey] || "Role examples unavailable.";
                    return `
                    <button onclick="selectPathwayInterest('${opt.id}')" class="w-full flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-${theme}-400 hover:shadow-md transition-all group text-left">
                        <div class="w-11 h-11 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-${theme}-50 group-hover:text-${theme}-600 transition-colors">
                            <i data-lucide="${opt.icon}" class="w-5 h-5"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-bold text-sm text-slate-800 mb-0.5">${opt.title}</div>
                            <div class="text-xs text-slate-500 leading-snug mb-1">${opt.desc}</div>
                            <div class="text-[10px] text-${theme}-700 font-medium truncate">${roleText}</div>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 group-hover:text-${theme}-500 shrink-0 transition-colors"></i>
                    </button>
                `}).join('')}
            </div>

            <!-- Deep-dive banner -->
            <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between gap-3">
                <div class="min-w-0">
                    <p class="text-xs font-bold text-indigo-900 flex items-center gap-1.5"><i data-lucide="compass" class="w-3.5 h-3.5 shrink-0"></i> Want a deeper recommendation?</p>
                    <p class="text-[10px] text-indigo-700 mt-0.5 leading-snug">3-min Career Personality Profile (RIASEC) for a more tailored result.</p>
                </div>
                <button onclick="renderDeepDiveAssessment()" class="shrink-0 px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm">
                    <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i> Start
                </button>
            </div>
        </div>
    `;
    updatePathwayBackNav('Back', 'renderPathwayStep1()');
    refreshIcons();
}

// Redirect legacy renderQuickMatch calls to the combined screen
window.renderQuickMatch = function() { renderPathwayQuiz(); }

// --- NEW: Deep Dive Assessment Logic ---
window.renderDeepDiveAssessment = function() {
    const container = document.getElementById('pp-practice-content');
    if(!container) return;

    // Load questions from app_data.json (via window.assessmentConfig)
    const config = window.assessmentConfig || { riasec: [] };
    const questions = config.riasec || [];

    const questionsHtml = questions.map((q, idx) => `
        <div class="bg-white p-4 rounded-xl border border-slate-200 mb-3">
            <p class="text-sm font-bold text-slate-800 mb-3">${idx + 1}. ${q.question}</p>
            <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="riasec_${q.code}" value="1" class="text-indigo-600 focus:ring-indigo-500">
                    <span class="text-xs text-slate-600">Disagree</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="riasec_${q.code}" value="2" class="text-indigo-600 focus:ring-indigo-500">
                    <span class="text-xs text-slate-600">Neutral</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="riasec_${q.code}" value="3" class="text-indigo-600 focus:ring-indigo-500">
                    <span class="text-xs text-slate-600">Agree</span>
                </label>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="max-w-2xl mx-auto py-4 animate-fade-in">
            <div class="text-center mb-6">
                <h2 class="text-xl font-bold text-slate-900">Career Personality Assessment</h2>
                <p class="text-sm text-slate-500">Rate how much you agree with the following statements.</p>
            </div>
            <form id="riasec-form">
                ${questionsHtml}
            </form>
            <div class="mt-6 text-center">
                <button onclick="calculateDeepDive()" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95 flex items-center gap-2 mx-auto">
                    Analyze Profile <i data-lucide="bar-chart-2" class="w-5 h-5"></i>
                </button>
            </div>
        </div>
    `;
    updatePathwayBackNav('Back', 'renderPathwayQuiz()');
    refreshIcons();
}

window.calculateDeepDive = function() {
    // 1. Tally Scores
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const form = document.getElementById('riasec-form');
    if(!form) return;

    const formData = new FormData(form);
    for (let [key, value] of formData.entries()) {
        const code = key.split('_')[1];
        if (scores[code] !== undefined) scores[code] += parseInt(value);
    }

    // 2. Find Dominant Trait
    let maxScore = -1;
    let dominantTrait = 'R'; // Default
    
    Object.entries(scores).forEach(([trait, score]) => {
        if (score > maxScore) {
            maxScore = score;
            dominantTrait = trait;
        }
    });

    // 3. Map Trait to Pathway Interest (to keep compatibility with Step 3)
    // Mapping Logic:
    // R (Realistic) -> Tech/Hands-on
    // I (Investigative) -> Data/Design
    // A (Artistic) -> Creative/Design
    // S (Social) -> Biz/Mgmt
    // E (Enterprising) -> Biz/Venture
    // C (Conventional) -> Data/Mgmt

    const sector = activeSectorId;
    let mappedInterest = 'tech'; // fallback

    if (sector === 'agri') {
        if (['R'].includes(dominantTrait)) mappedInterest = 'field';
        else if (['I', 'C'].includes(dominantTrait)) mappedInterest = 'tech';
        else mappedInterest = 'biz';
    } else if (sector === 'energy') {
        if (['R'].includes(dominantTrait)) mappedInterest = 'hands-on';
        else if (['I', 'C'].includes(dominantTrait)) mappedInterest = 'design';
        else mappedInterest = 'mgmt';
    } else { // Digital
        if (['R', 'I'].includes(dominantTrait)) mappedInterest = 'code';
        else if (['C'].includes(dominantTrait)) mappedInterest = 'data';
        else mappedInterest = 'creative';
    }

    // 4. Save & Proceed
    pathwayState.interest = mappedInterest;
    pathwayState.profile = { trait: dominantTrait, scores: scores };
    pathwayState.assessmentRoute = 'deepdive';
    renderPathwayGoal();
}

window.selectPathwayInterest = function(interest) {
    pathwayState.interest = interest;
    pathwayState.assessmentRoute = 'quiz';
    // Pre-select the most relevant role in the diagnostic for each interest
    const interestRoleMap = {
        agri:    { tech: 'Precision Ag Specialist', field: 'Agricultural Extension Officer', biz: 'Supply Chain Manager' },
        energy:  { 'hands-on': 'Solar PV Installer', design: 'Grid Systems Engineer', mgmt: 'Energy Auditor' },
        digital: { code: 'Frontend Dev', data: 'Data Scientist', creative: 'UX/UI Designer' }
    };
    const preSelectedRole = (interestRoleMap[activeSectorId] || {})[interest] || null;
    renderPathwayStep0(preSelectedRole);
}

// --- Step 3: Goal Selection ---
window.renderPathwayGoal = function() {
    // When arriving from pp-diagnostic (Block 1 CTA), pp-practice is hidden.
    // Switch to it before rendering, without re-initialising the wizard.
    const practiceView = document.getElementById('pp-practice');
    if (practiceView && practiceView.classList.contains('hidden')) {
        openSkillsView('pp-practice', /* preserveState= */ true, /* addToStack= */ false);
    }

    const container = document.getElementById('pp-practice-content');
    if(!container) return;

    const goals = (typeof pathwayGoals !== 'undefined' && Array.isArray(pathwayGoals)) ? pathwayGoals : [
        { "title": "Apprenticeships and Job Placements", "desc": "I want to gain hands-on experience through a structured apprenticeship or workplace placement.", "icon": "users" },
        { "title": "Entry Level Job", "desc": "I want to find my first job in the sector and start building my career.", "icon": "briefcase" }
    ];

    const goalMeta = {
        'Build My Foundation':                  { color: 'sky', tagline: 'Includes: skills strengths &amp; gaps summary, priority courses &amp; a 30-day build plan' },
        'Apprenticeships and Job Placements':   { color: 'indigo', tagline: 'Includes: sector framework, prep checklist &amp; mentor links' },
        'Entry Level Job':                      { color: 'blue', tagline: 'Includes: CV templates, technical training &amp; career tools' },
        'Start my own Venture':                 { color: 'indigo', tagline: 'Includes: foundation skills, venture playbook &amp; startup resources' }
    };

    const bestMatch = getBestMatchGoal();

    // Interest / profile badge
    let contextBadge = '';
    if (pathwayState.profile) {
        const traitLabels = { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' };
        const traitLabel = traitLabels[pathwayState.profile.trait] || pathwayState.profile.trait;
        contextBadge = '<div class="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mb-6 flex items-center gap-3 text-xs">' +
            '<div class="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg shrink-0"><i data-lucide="user-check" class="w-4 h-4"></i></div>' +
            '<div><span class="font-bold text-indigo-900">Personality Profile: ' + traitLabel + '</span>' +
            '<span class="text-indigo-700"> &mdash; Based on your assessment, we\'ve highlighted your best match below.</span></div></div>';
    } else if (pathwayState.interest) {
        const interestDisplayMap = {
            tech: 'Technical & Digital', code: 'Software & Development',
            design: 'Design & Systems', 'hands-on': 'Hands-on & Installation',
            field: 'Field & Agricultural', biz: 'Business & Entrepreneurship',
            mgmt: 'Management & Leadership', data: 'Data & Analytics',
            creative: 'Creative & Marketing'
        };
        const interestLabel = interestDisplayMap[pathwayState.interest] || pathwayState.interest;
        contextBadge = '<div class="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 flex items-center gap-3 text-xs">' +
            '<div class="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0"><i data-lucide="zap" class="w-4 h-4"></i></div>' +
            '<div><span class="font-bold text-slate-800">Interest area: ' + interestLabel + '</span>' +
            '<span class="text-slate-500"> &mdash; We\'ve highlighted your best-match goal below.</span></div></div>';
    }

    const filteredGoals = goals.filter(function(g) { return g.title !== 'Venture' && g.title !== 'Career Pivot'; });
    const cardsHtml = filteredGoals.map(function(g) {
        const meta = goalMeta[g.title] || { color: 'slate', tagline: '' };
        return _renderGoalCard(g, meta.color, meta.tagline, g.title === bestMatch);
    }).join('');

    const jobReadyBanner = (pathwayState.diagnosticScore !== undefined && pathwayState.diagnosticScore >= 70) ? `
        <div class="bg-sky-50 border border-sky-200 rounded-xl p-3 mb-4 flex items-start gap-3">
            <div class="p-1.5 bg-sky-100 text-sky-600 rounded-lg shrink-0 mt-0.5"><i data-lucide="check-circle" class="w-4 h-4"></i></div>
            <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-sky-900">You scored ${pathwayState.diagnosticScore}% — you're already job-ready for ${pathwayState.diagnosticRole || 'your target role'}.</p>
                <p class="text-xs text-sky-700 mt-0.5 leading-snug">Consider <strong>Upskilling and Lifelong Learning</strong> to build the hybrid skills employers are increasingly hiring for.</p>
                <button onclick="openSkillsView('pp-sector-ai')" class="mt-2 text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-sky-100 hover:bg-sky-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 w-fit">Explore Upskilling <i data-lucide="arrow-right" class="w-3 h-3"></i></button>
            </div>
        </div>` : '';

    container.innerHTML = `
        <div class="max-w-3xl mx-auto py-3 sm:py-6 animate-fade-in">
            <div class="text-center mb-4 sm:mb-8">
                <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-2">What is your primary goal?</h2>
                <p class="text-slate-500 text-sm sm:text-base">Choose the outcome that matters most to you right now.</p>
            </div>
            ${contextBadge}
            ${jobReadyBanner}
            ${!pathwayState.profile && !pathwayState.interest ? `
            <div class="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <div class="flex items-start gap-3">
                    <div class="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5"><i data-lucide="help-circle" class="w-4 h-4"></i></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-amber-900 mb-0.5">Not sure where you stand?</p>
                        <p class="text-xs text-amber-700 leading-snug">Take the Skills Assessment first to identify your gaps.</p>
                        <button onclick="renderPathwayStep0()" class="mt-2 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg transition-colors">Assess first →</button>
                    </div>
                </div>
            </div>` : ''}
            <div class="flex flex-col gap-3">
                ${cardsHtml}
            </div>
        </div>
    `;
    updatePathwayBackNav('Back', 'renderPathwayStep0()');
    refreshIcons();
}

window.renderPathwayStep3 = function() {
    const container = document.getElementById('pp-practice-content');
    if(!container) return;

    const goal = pathwayState.goal || "Strengthen my current skills";
    const isUpskilling = (goal === 'Upskilling & Lifelong Learning');

    // Pre-tune upskilling state from diagnostic data when arriving via assessment
    if (isUpskilling && pathwayState.diagnosticScore !== undefined) {
        const hasTechGaps = pathwayState.diagnosticTechGaps && pathwayState.diagnosticTechGaps.length > 0;
        if (!pathwayState.upskillingGoal) {
            pathwayState.upskillingGoal = hasTechGaps ? 'gap' : 'advance';
        }
        if (!pathwayState.upskillingSkillArea && pathwayState.diagnosticGapSkill) {
            pathwayState.upskillingSkillArea = pathwayState.diagnosticGapSkill;
        }
    }
    const sector = activeSectorId;
    const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[sector] : { color: 'indigo' };
    const theme = themeConfig.color;
    let advancedTools = []; // Defined here for scope access
    let certList = [];      // Hoisted for upskillingHtml builder
    let networkList = [];
    let gapHtml = '';
    
    // --- SECTION A: SKILLS FOCUS ---
    const sectorDetails = (typeof baseSectorDetailData !== 'undefined') ? baseSectorDetailData[sector] : { skills: [] };
    const allSkills = sectorDetails ? sectorDetails.skills : [];
    let targetSkills = [];

    // Goal-based Skill Selection
    if (['Strengthen my current skills', 'Upskill', 'Upskilling & Lifelong Learning'].includes(goal)) {
        targetSkills = allSkills.filter(s => s.isHot).slice(0, 5); // Hot/Advanced skills
    } else {
        targetSkills = allSkills.slice(0, 4); // Foundational
    }

    // Interest-based refinement
    if (pathwayState.interest) {
         const interestMap = {
            'tech': ['Python', 'IoT', 'Solar', 'Design', 'Coding', 'Technical', 'Digital', 'Technology'],
            'code': ['Python', 'Java', 'React', 'API', 'Code', 'Software', 'Web', 'Development'],
            'design': ['Design', 'UX', 'CAD', 'Drawing', 'Planning', 'Product', 'Creative'],
            'hands-on': ['Installation', 'Wiring', 'Maintenance', 'Repair', 'Field', 'Technician', 'Practical'],
            'field': ['Soil', 'Crop', 'Drone', 'Scouting', 'Farm', 'Agriculture', 'Field'],
            'biz': ['Sales', 'Management', 'Logistics', 'Finance', 'Business', 'Supply Chain', 'Entrepreneurship'],
            'mgmt': ['Management', 'Audit', 'Policy', 'Planning', 'Project', 'Leadership'],
            'data': ['Data', 'Analysis', 'Excel', 'Statistics', 'Logic', 'Science', 'Analytics'],
            'creative': ['Design', 'Marketing', 'Content', 'Strategy', 'UI', 'Creative']
        };
        const keywords = interestMap[pathwayState.interest] || [];
        if (keywords.length > 0) {
            const interestedSkills = allSkills.filter(s => keywords.some(k => s.name.includes(k) || (s.desc && s.desc.includes(k))));
            if (interestedSkills.length > 0) targetSkills = interestedSkills.slice(0, 5);
        }
    }

    // Profile / interest badge
    let profileHtml = '';
    const interestDisplayMap = {
        tech: 'Technical & Digital', code: 'Software & Development',
        design: 'Design & Systems', 'hands-on': 'Hands-on & Installation',
        field: 'Field & Agricultural', biz: 'Business & Entrepreneurship',
        mgmt: 'Management & Leadership', data: 'Data & Analytics',
        creative: 'Creative & Marketing'
    };
    const interestLabel = pathwayState.interest ? (interestDisplayMap[pathwayState.interest] || pathwayState.interest) : '';

    if (pathwayState.profile) {
        const traitLabels = { R: "Realistic (Doer)", I: "Investigative (Thinker)", A: "Artistic (Creator)", S: "Social (Helper)", E: "Enterprising (Persuader)", C: "Conventional (Organizer)" };
        const label = traitLabels[pathwayState.profile.trait];
        profileHtml = `<div class="flex items-center gap-2 mt-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5">
            <i data-lucide="user-check" class="w-3.5 h-3.5 text-indigo-600 shrink-0"></i>
            <span class="text-[10px] font-bold text-indigo-800">${label}</span>
            <span class="text-[10px] text-indigo-500">· results tailored to your profile</span>
        </div>`;
    } else if (pathwayState.interest) {
        profileHtml = `<div class="flex items-center gap-2 mt-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5">
            <i data-lucide="zap" class="w-3.5 h-3.5 text-indigo-600 shrink-0"></i>
            <span class="text-[10px] font-bold text-indigo-800">${interestLabel}</span>
            <span class="text-[10px] text-indigo-500">· skills tailored to your interest</span>
        </div>`;
    }

    const skillsHtml = targetSkills.map(s => `
        <button onclick="openSkillModal('${s.name.replace(/'/g, "\\'")}')" class="w-full text-left flex items-start gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 hover:border-${theme}-300 hover:shadow-sm transition-all group">
            <i data-lucide="check-circle" class="w-4 h-4 text-${theme}-500 mt-0.5 shrink-0 group-hover:text-${theme}-600"></i>
            <div>
                <span class="font-bold group-hover:text-${theme}-700 transition-colors">${s.name}</span>
                ${s.isHot ? '<span title="High Demand" class="text-[10px] ml-1 bg-amber-100 text-amber-700 px-1 rounded">HOT</span>' : ''}
                <div class="text-[10px] text-slate-500 leading-tight mt-0.5">${s.desc}</div>
            </div>
        </button>
    `).join('');

    // --- SECTION B: ACTIONABLE NEXT STEP (The "Mission") ---
    let blockBTitle = "";
    let blockBContent = "";
    let blockBAction = "";
    let blockBOnclick = "";
    let blockCAction = "";
    let blockCOnclick = "";

    if (goal === 'Apprenticeships and Job Placements' || goal === 'Placements and Apprenticeships' || goal === 'Placements and Apprenticeship' || goal === 'Apprenticeship' || goal === 'Placements & Apprenticeship') {
        blockBTitle = "Overview";

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
            { c: 'Uganda', name: 'DIT Standards', url: 'https://www.ictau.ug/' },
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
                { title: "Ajira Digital", desc: "Govt programme linking youth to digital work.", icon: "monitor", link: "https://ajiradigital.go.ke/" },
                { title: "Andela Learning", desc: "Peer learning & potential tracks.", icon: "code", link: "https://andela.com/" }
            ];
            mentorResources = [
                { title: "ADPList", desc: "Global mentorship for designers & devs.", link: "https://adplist.org/" },
                { title: "She Code Africa", desc: "Mentorship & community for women in tech.", link: "https://shecodeafrica.org/" }
            ];
        }

        // Add National Mentorships
        const nationalMentorships = {
            'Kenya': [{ title: "KamiLimu", desc: "Structured mentorship for CS students.", link: "https://kamilimu.org/" }],
            'Rwanda': [{ title: "Girls in ICT Rwanda", desc: "Mentorship and networking.", link: "https://girlsinict.rw/" }],
            'Uganda': [{ title: "Women in Technology Uganda", desc: "Networking and mentorship.", link: "https://witug.org/" }],
            'Tanzania': [{ title: "Apps and Girls", desc: "Coding and mentorship for girls.", link: "https://www.girlscode.com/" }]
        };

        if (nationalMentorships[activeCountry]) {
            nationalMentorships[activeCountry].forEach(m => mentorResources.push(m));
        }

        // --- Inject Dynamic Resources from JSON ---
        if (dataManager.digitalResources) {
            const getDynamicResources = (list, keywords) => {
                return (list || []).filter(r => {
                    const text = ((r.title || "") + " " + (r.desc || "") + " " + (r.type || "")).toLowerCase();
                    return keywords.some(k => text.includes(k));
                });
            };

            const mentorKeywords = ['mentor', 'coaching', 'guidance', 'alumni'];
            const appKeywords = ['apprentice', 'placement', 'internship', 'vocational', 'tvet', 'attachment', 'workforce readiness'];

            let jsonMentors = [];
            let jsonApps = [];
            let resourceKey = normalizeDRC(activeCountry);

            const mergeFromSource = (sourceObj) => {
                if (!sourceObj) return;
                if (sourceObj.regional_multipliers) {
                    jsonMentors.push(...getDynamicResources(sourceObj.regional_multipliers, mentorKeywords));
                    jsonApps.push(...getDynamicResources(sourceObj.regional_multipliers, appKeywords));
                }
                if (activeCountry !== 'all' && sourceObj.country_resources && sourceObj.country_resources[resourceKey]) {
                    const cr = sourceObj.country_resources[resourceKey];
                    if (cr.communities) jsonMentors.push(...getDynamicResources(cr.communities, mentorKeywords));
                    if (cr.mentorship) jsonMentors.push(...cr.mentorship);
                    if (cr.hubs) jsonApps.push(...getDynamicResources(cr.hubs, appKeywords));
                    if (cr.education) jsonApps.push(...getDynamicResources(cr.education, appKeywords));
                }
            };

            mergeFromSource(dataManager.digitalResources);
            if (dataManager.digitalResources[sector]) mergeFromSource(dataManager.digitalResources[sector]);

            jsonMentors.forEach(m => { if (!mentorResources.some(ex => ex.title === m.title)) mentorResources.push({ title: m.title, desc: m.desc, link: m.link, icon: 'users' }); });
            jsonApps.forEach(a => { if (!appResources.some(ex => ex.title === a.title)) appResources.push({ title: a.title, desc: a.desc, link: a.link, icon: 'book-open' }); });
        }

        const standardsHtml = localStandards.map(s => `
            <a href="${s.url}" target="_blank" class="flex items-center gap-3 p-2.5 border border-amber-100 rounded-lg hover:bg-amber-50 group transition-colors bg-white">
                <div class="p-1.5 bg-amber-100 text-amber-700 rounded shrink-0"><i data-lucide="scroll-text" class="w-3.5 h-3.5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-700 group-hover:text-amber-800 truncate">${s.name}</div>
                    <div class="text-[10px] text-slate-500 truncate">${s.c} — National Regulatory Standards</div>
                </div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-amber-600 shrink-0"></i>
            </a>
        `).join('');

        appResources.sort((a, b) => a.title.localeCompare(b.title));
        mentorResources.sort((a, b) => a.title.localeCompare(b.title));

        const appHtml = appResources.map(r => `
            <a href="${r.link}" target="_blank" class="flex items-center gap-3 p-2.5 border border-blue-100 rounded-lg hover:bg-blue-50 group transition-colors bg-white">
                <div class="p-1.5 bg-blue-100 text-blue-600 rounded shrink-0"><i data-lucide="${r.icon || 'briefcase'}" class="w-3.5 h-3.5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-700 group-hover:text-blue-700 truncate">${r.title}</div>
                    <div class="text-[10px] text-slate-500 truncate">${r.desc}</div>
                </div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-blue-500 shrink-0"></i>
            </a>
        `).join('');

        const mentorHtml = mentorResources.map(r => `
            <a href="${r.link}" target="_blank" class="flex items-center gap-3 p-2.5 border border-indigo-100 rounded-lg hover:bg-indigo-50 group transition-colors bg-white">
                <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded shrink-0"><i data-lucide="users" class="w-3.5 h-3.5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700 truncate">${r.title}</div>
                    <div class="text-[10px] text-slate-500 truncate">${r.desc}</div>
                </div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
            </a>
        `).join('');

        blockBContent = `
            <div class="space-y-3">
                ${pathwayState.diagnosticTechGaps && pathwayState.diagnosticTechGaps.length > 0 ? `
                <div class="flex items-start gap-2.5 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <i data-lucide="target" class="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5"></i>
                    <div class="flex-1 min-w-0">
                        <div class="text-[10px] font-bold text-indigo-500 uppercase tracking-wide mb-1.5">Your priority gaps to address</div>
                        <div class="flex flex-wrap gap-1.5">${pathwayState.diagnosticTechGaps.slice(0,4).map(g => `<span class="px-2 py-0.5 bg-white border border-indigo-200 text-indigo-800 text-xs font-bold rounded-lg">${g}</span>`).join('')}</div>
                    </div>
                </div>` : ''}
                <!-- Framework at a Glance -->
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2.5">Framework at a Glance</div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div class="flex items-start gap-2">
                            <div class="p-1 bg-slate-200 text-slate-600 rounded shrink-0 mt-0.5"><i data-lucide="clock" class="w-3 h-3"></i></div>
                            <div>
                                <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Duration</div>
                                <div class="text-xs text-slate-700">${framework.duration}</div>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <div class="p-1 bg-slate-200 text-slate-600 rounded shrink-0 mt-0.5"><i data-lucide="target" class="w-3 h-3"></i></div>
                            <div>
                                <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Objective</div>
                                <div class="text-xs text-slate-700">${framework.objective}</div>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <div class="p-1 bg-indigo-100 text-indigo-600 rounded shrink-0 mt-0.5"><i data-lucide="user" class="w-3 h-3"></i></div>
                            <div>
                                <div class="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">Your Role</div>
                                <div class="text-xs text-slate-700">${framework.role}</div>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <div class="p-1 bg-blue-100 text-blue-600 rounded shrink-0 mt-0.5"><i data-lucide="building-2" class="w-3 h-3"></i></div>
                            <div>
                                <div class="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Employer Provides</div>
                                <div class="text-xs text-slate-700">${framework.employer}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Ready to Start? -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button onclick="renderApprenticeshipChecklist()" class="flex items-center gap-3 p-3 border border-blue-100 bg-blue-50 rounded-lg hover:bg-blue-100 group transition-colors text-left">
                        <div class="p-1.5 bg-white text-blue-600 rounded shadow-sm shrink-0"><i data-lucide="clipboard-list" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-blue-900 group-hover:text-blue-700">Prep Checklist</div>
                            <div class="text-[10px] text-blue-600 leading-snug">Step-by-step placement audit</div>
                        </div>
                    </button>
                    <button onclick="showCVResources('pp-practice', 'renderPathwayContent()')" class="flex items-center gap-3 p-3 border border-indigo-100 bg-indigo-50 rounded-lg hover:bg-indigo-100 group transition-colors text-left">
                        <div class="p-1.5 bg-white text-indigo-600 rounded shadow-sm shrink-0"><i data-lucide="file-text" class="w-4 h-4"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-indigo-900 group-hover:text-indigo-700">Logbook &amp; CV Templates</div>
                            <div class="text-[10px] text-indigo-600 leading-snug">Ready-to-use formats</div>
                        </div>
                    </button>
                </div>
                <!-- Accordion: National Standards -->
                <div class="border border-slate-200 rounded-xl overflow-hidden">
                    <button onclick="togglePlacementSection('placement-standards')" class="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors text-left">
                        <div class="flex items-center gap-2">
                            <div class="p-1.5 bg-amber-100 text-amber-700 rounded shrink-0"><i data-lucide="scroll-text" class="w-3.5 h-3.5"></i></div>
                            <span class="text-xs font-bold text-slate-700">National Standards &amp; Guidelines</span>
                            <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">${localStandards.length}</span>
                        </div>
                        <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 shrink-0" id="chevron-placement-standards"></i>
                    </button>
                    <div id="placement-standards" class="hidden border-t border-slate-100 p-3 space-y-1.5">${standardsHtml}</div>
                </div>
                <!-- Accordion: Placements & Opportunities -->
                <div class="border border-slate-200 rounded-xl overflow-hidden">
                    <button onclick="togglePlacementSection('placement-opps')" class="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors text-left">
                        <div class="flex items-center gap-2">
                            <div class="p-1.5 bg-blue-100 text-blue-600 rounded shrink-0"><i data-lucide="briefcase" class="w-3.5 h-3.5"></i></div>
                            <span class="text-xs font-bold text-slate-700">Placements &amp; Opportunities</span>
                            <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">${appResources.length}</span>
                        </div>
                        <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 shrink-0" id="chevron-placement-opps"></i>
                    </button>
                    <div id="placement-opps" class="hidden border-t border-slate-100 p-3 space-y-1.5">${appHtml}</div>
                </div>
                <!-- Accordion: Mentorship -->
                <div class="border border-slate-200 rounded-xl overflow-hidden">
                    <button onclick="togglePlacementSection('placement-mentors')" class="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors text-left">
                        <div class="flex items-center gap-2">
                            <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded shrink-0"><i data-lucide="users" class="w-3.5 h-3.5"></i></div>
                            <span class="text-xs font-bold text-slate-700">Mentorship</span>
                            <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">${mentorResources.length}</span>
                        </div>
                        <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 shrink-0" id="chevron-placement-mentors"></i>
                    </button>
                    <div id="placement-mentors" class="hidden border-t border-slate-100 p-3 space-y-1.5">${mentorHtml}</div>
                </div>
            </div>
        `;
    } else if (['Entry Level Job', 'Internship', 'Entry Level Job or Internship'].includes(goal)) {
        blockBTitle = "Job Seeker Toolkit";

        // Foundation Resources — dynamically pulled skills/education resources
        let foundationResources = [];
        if (dataManager.digitalResources) {
            const extractSkills = (list) => (list || []).filter(r => r.type === 'Skills' || r.type === 'Education' || (r.desc && r.desc.toLowerCase().includes('skills')));
            if (dataManager.digitalResources.regional_multipliers) foundationResources.push(...extractSkills(dataManager.digitalResources.regional_multipliers));
            if (dataManager.digitalResources.global_resources) foundationResources.push(...extractSkills(dataManager.digitalResources.global_resources));
            const resourceKey = normalizeDRC(activeCountry);
            if (activeCountry !== 'all' && dataManager.digitalResources.country_resources && dataManager.digitalResources.country_resources[resourceKey]) {
                const cr = dataManager.digitalResources.country_resources[resourceKey];
                if (cr.hubs) foundationResources.push(...extractSkills(cr.hubs));
                if (cr.communities) foundationResources.push(...extractSkills(cr.communities));
            }
        }
        foundationResources = foundationResources.filter(r => r.link && r.link.startsWith('http'));
        foundationResources = Array.from(new Set(foundationResources.map(r => JSON.stringify(r)))).map(s => JSON.parse(s)).slice(0, 4);
        foundationResources.sort((a, b) => a.title.localeCompare(b.title));

        const foundationHtml = foundationResources.map(r => `
            <a href="${r.link}" target="_blank" class="flex items-center gap-3 p-2.5 border border-indigo-100 rounded-lg hover:bg-indigo-50 group transition-colors bg-white">
                <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded shrink-0"><i data-lucide="book-open" class="w-3.5 h-3.5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700 truncate">${r.title}</div>
                    <div class="text-[10px] text-slate-500 truncate">${r.desc}</div>
                </div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
            </a>
        `).join('');

        blockBContent = `
            <div class="space-y-4">
                ${pathwayState.diagnosticTechGaps && pathwayState.diagnosticTechGaps.length > 0 ? `
                <div class="flex items-start gap-2.5 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <i data-lucide="target" class="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5"></i>
                    <div class="flex-1 min-w-0">
                        <div class="text-[10px] font-bold text-indigo-500 uppercase tracking-wide mb-1.5">Your priority gaps to address</div>
                        <div class="flex flex-wrap gap-1.5">${pathwayState.diagnosticTechGaps.slice(0,4).map(g => `<span class="px-2 py-0.5 bg-white border border-indigo-200 text-indigo-800 text-xs font-bold rounded-lg">${g}</span>`).join('')}</div>
                    </div>
                </div>` : ''}
                <!-- Core toolkit buttons -->
                <div class="space-y-2">
                    <button onclick="showCVResources('pp-practice', 'renderPathwayContent()')" class="w-full flex items-center gap-3 p-3 border border-indigo-100 bg-indigo-50 rounded-lg hover:bg-indigo-100 group transition-colors text-left">
                        <div class="p-1.5 bg-white text-indigo-600 rounded shadow-sm shrink-0"><i data-lucide="file-text" class="w-4 h-4"></i></div>
                        <div class="flex-1">
                            <div class="text-xs font-bold text-indigo-900 group-hover:text-indigo-700">CV Templates</div>
                            <div class="text-[10px] text-indigo-600">ATS-friendly formats for entry-level applications</div>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-indigo-300 group-hover:text-indigo-600 shrink-0"></i>
                    </button>
                    <button onclick="renderOutreachTemplates()" class="w-full flex items-center gap-3 p-3 border border-sky-100 bg-sky-50 rounded-lg hover:bg-sky-100 group transition-colors text-left">
                        <div class="p-1.5 bg-white text-sky-600 rounded shadow-sm shrink-0"><i data-lucide="mail" class="w-4 h-4"></i></div>
                        <div class="flex-1">
                            <div class="text-xs font-bold text-sky-900 group-hover:text-sky-700">Email &amp; Outreach Scripts</div>
                            <div class="text-[10px] text-sky-600">Networking and cold outreach templates</div>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-sky-300 group-hover:text-sky-600 shrink-0"></i>
                    </button>
                    <button onclick="renderReadinessScorecard()" class="w-full flex items-center gap-3 p-3 border border-blue-100 bg-blue-50 rounded-lg hover:bg-blue-100 group transition-colors text-left">
                        <div class="p-1.5 bg-white text-blue-600 rounded shadow-sm shrink-0"><i data-lucide="clipboard-check" class="w-4 h-4"></i></div>
                        <div class="flex-1">
                            <div class="text-xs font-bold text-blue-900 group-hover:text-blue-700">Job Readiness Scorecard</div>
                            <div class="text-[10px] text-blue-600">Check how prepared you are before applying</div>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-blue-300 group-hover:text-blue-600 shrink-0"></i>
                    </button>
                </div>
                ${foundationResources.length > 0 ? `
                <!-- Foundation Resources -->
                <div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Foundation Resources</div>
                    <div class="space-y-1.5">${foundationHtml}</div>
                </div>` : ''}
            </div>
        `;
    } else if (goal === 'Build My Foundation') {
        blockBTitle = "Your Skills Strengths &amp; Gaps";

        const techGaps = (pathwayState.diagnosticTechGaps || []).slice(0, 4);
        const score = pathwayState.diagnosticScore;
        const scoreBand = score !== undefined
            ? (score < 25 ? 'early' : score < 40 ? 'developing' : 'almost')
            : null;

        const gapChipsHtml = techGaps.length > 0
            ? techGaps.map(g => `<span class="px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold rounded-lg">${g}</span>`).join('')
            : `<span class="text-xs text-slate-500 italic">Complete the Skills Assessment to see your specific gaps.</span>`;

        const scoreHtml = score !== undefined ? `
            <div class="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-base font-extrabold shrink-0
                    ${score < 25 ? 'bg-slate-100 text-slate-600' : score < 40 ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}">
                    ${score}%
                </div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-800 mb-0.5">
                        ${scoreBand === 'early' ? 'Building from the ground up' : scoreBand === 'developing' ? 'Good progress — keep going' : 'Almost there — a few gaps to close'}
                    </div>
                    <div class="text-[10px] text-slate-500 leading-snug">
                        ${scoreBand === 'early' ? 'Focus on the core skills below before applying for roles.' : scoreBand === 'developing' ? 'Targeted courses and practice will get you job-ready.' : 'You\'re close to job-ready — a short push will get you there.'}
                    </div>
                </div>
            </div>` : '';

        blockBContent = `
            <div class="space-y-4">
                ${scoreHtml}
                <!-- Skills to focus on -->
                ${targetSkills.length > 0 ? `
                <div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Skills to Focus On</div>
                    <div class="flex flex-wrap gap-2">
                        ${targetSkills.map(s => `<button onclick="openSkillModal('${s.name.replace(/'/g, "\\'")}')" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 transition-all">${s.isHot ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>' : ''}${s.name}</button>`).join('')}
                    </div>
                </div>` : ''}
                <!-- 30-day plan -->
                <div class="border border-sky-100 rounded-xl overflow-hidden">
                    <div class="bg-sky-50 px-3 py-2.5 flex items-center gap-2">
                        <div class="p-1 bg-sky-600 text-white rounded shrink-0"><i data-lucide="calendar-check" class="w-3.5 h-3.5"></i></div>
                        <span class="text-xs font-bold text-sky-900">Your 30-Day Build Plan</span>
                    </div>
                    <div class="bg-white p-3 space-y-2.5">
                        <div class="flex items-start gap-2.5">
                            <span class="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">1</span>
                            <div><div class="text-xs font-bold text-slate-800">Week 1–2: Complete a priority course</div><div class="text-[10px] text-slate-500">Pick one course from the Training section below and work through it.</div></div>
                        </div>
                        <div class="flex items-start gap-2.5">
                            <span class="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">2</span>
                            <div><div class="text-xs font-bold text-slate-800">Week 3: Apply it with a small project</div><div class="text-[10px] text-slate-500">Practise what you learned — build something, volunteer, or shadow someone.</div></div>
                        </div>
                        <div class="flex items-start gap-2.5">
                            <span class="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">3</span>
                            <div><div class="text-xs font-bold text-slate-800">Week 4: Reassess and choose your next goal</div><div class="text-[10px] text-slate-500">Retake the Skills Assessment and pick a job-track goal when you are ready.</div></div>
                        </div>
                    </div>
                </div>
                <!-- Reassess CTA -->
                <button onclick="renderPathwayStep0()" class="w-full flex items-center justify-between p-3 border border-sky-200 bg-sky-50 rounded-xl hover:bg-sky-100 group transition-colors text-left">
                    <div class="flex items-center gap-3">
                        <div class="p-1.5 bg-white text-sky-600 rounded shadow-sm shrink-0"><i data-lucide="refresh-ccw" class="w-4 h-4"></i></div>
                        <div>
                            <div class="text-xs font-bold text-sky-900">Reassess when you are ready</div>
                            <div class="text-[10px] text-sky-600">Retake the Skills Assessment to track your progress</div>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-sky-300 group-hover:text-sky-600 shrink-0 transition-colors"></i>
                </button>
            </div>
        `;
    } else {
        blockBTitle = "Upskilling & Lifelong Learning";
        blockCAction = "Browse Courses";
        blockCOnclick = "openUnifiedHub('pp-courses')";

        const interest = pathwayState.interest;
        const upskillingGoal = pathwayState.upskillingGoal || null;
        const diagnosticGapSkill = pathwayState.diagnosticGapSkill || null;

        const toolsInterestMap = {
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
            }
        };

        if (interest && toolsInterestMap[sector] && toolsInterestMap[sector][interest]) {
            advancedTools = toolsInterestMap[sector][interest];
        } else {
            if (sector === 'digital') advancedTools = ['Amazon SageMaker', 'Amazon Bedrock', 'Kubernetes'];
            else if (sector === 'energy') advancedTools = ['PVsyst', 'AutoCAD Elec', 'Homer Pro'];
            else if (sector === 'agri') advancedTools = ['ArcGIS Pro', 'Python', 'Farm ERP'];
        }

        // --- Industry Certifications (sector-specific) ---
        const certifications = {
            digital: [
                { title: "Google Career Certificates", desc: "Data Analytics, UX Design, Project Management.", icon: "award", link: "https://grow.google/certificates/" },
                { title: "AWS Training & Certification", desc: "Cloud skills for the digital economy.", icon: "cloud", link: "https://aws.amazon.com/training/" },
                { title: "Microsoft Learn", desc: "Free paths for Azure, AI & developer skills.", icon: "monitor", link: "https://learn.microsoft.com/" }
            ],
            energy: [
                { title: "EPRA Licensing Guide", desc: "Solar & electrical licensing requirements.", icon: "zap", link: "https://www.epra.go.ke/" },
                { title: "IRENA Learning Platform", desc: "Renewable energy professional development.", icon: "sun", link: "https://www.irena.org/energytransition/capacity-building" },
                { title: "Solar Energy International", desc: "Technical solar training & certification.", icon: "award", link: "https://www.solarenergy.org/" }
            ],
            agri: [
                { title: "FAO e-Learning Centre", desc: "Agriculture, food security & rural development.", icon: "book-open", link: "https://elearning.fao.org/" },
                { title: "AGRA Resources", desc: "African agriculture transformation training.", icon: "award", link: "https://agra.org/" },
                { title: "CTA Knowledge Hub", desc: "Agri-business and value chain learning.", icon: "layers", link: "https://www.cgiar.org/" }
            ]
        };

        // --- Professional Networks (sector-specific) ---
        const networksBySector = {
            digital: [
                { title: "ADPList", desc: "Mentorship for designers, devs & data pros.", link: "https://adplist.org/" },
                { title: "iHub Community", desc: "East Africa's leading tech innovation hub.", link: "https://ihub.co.ke/" },
                { title: "Women in Tech Africa", desc: "Network for women advancing in technology.", link: "https://womenintechafrica.com/" }
            ],
            energy: [
                { title: "GWNET", desc: "Global Women's Network for Energy Transition.", link: "https://www.globalwomennet.org/" },
                { title: "GOGLA", desc: "Off-grid solar industry network & resources.", link: "https://www.gogla.org/" },
                { title: "Africa Energy Forum", desc: "Professional network for energy practitioners.", link: "https://www.africaenergyforum.com/" }
            ],
            agri: [
                { title: "AWARD Fellowship", desc: "Science leadership for African women in agri.", link: "https://awardfellowships.org/" },
                { title: "CGIAR Research Network", desc: "Agricultural research & innovation community.", link: "https://www.cgiar.org/" },
                { title: "GoGettaz", desc: "Agripreneurship community & mentorship.", link: "https://gogettaz.africa/" }
            ]
        };

        // Assign to hoisted vars (used by upskillingHtml builder after finalCourses)
        certList = certifications[sector] || certifications.digital;
        networkList = networksBySector[sector] || networksBySector.digital;

        gapHtml = diagnosticGapSkill
            ? `<div class="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-start gap-3">
                   <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg shrink-0 mt-0.5"><i data-lucide="target" class="w-4 h-4"></i></div>
                   <div class="flex-1 min-w-0">
                       <div class="text-[10px] font-bold text-indigo-500 uppercase tracking-wide mb-0.5">Your Priority Gap</div>
                       <div class="text-sm font-bold text-indigo-900">${diagnosticGapSkill}</div>
                       <div class="text-[10px] text-indigo-600 mt-0.5">Identified from your Skills Assessment</div>
                   </div>
                   <button onclick="openSkillsView('pp-courses')" class="text-[11px] font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-2.5 py-1.5 rounded-lg transition-colors shrink-0 whitespace-nowrap">Find courses →</button>
               </div>`
            : `<div class="bg-amber-50 border border-amber-100 rounded-xl p-3">
                   <div class="flex items-start gap-3">
                       <div class="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5"><i data-lucide="help-circle" class="w-4 h-4"></i></div>
                       <div class="flex-1 min-w-0">
                           <p class="text-xs font-bold text-amber-900 mb-0.5">Not sure where to focus?</p>
                           <p class="text-xs text-amber-700 leading-snug">Run the Skills Assessment to identify your priority gaps.</p>
                           <button onclick="renderPathwayStep0()" class="mt-2 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg transition-colors">Find my gaps →</button>
                       </div>
                   </div>
               </div>`;
    }

    // --- SECTION C: TRAINING (Bridge Skills and Knowledge Gaps) ---
    const catalogue = getMasterTrainingCatalogue(sector, activeCountry);
    let courses = [];
    
    if (['Build My Foundation', 'Internship', 'Entry Level Job', 'Entry Level Job or Internship', 'Apprenticeship', 'Apprenticeships and Job Placements', 'Placements & Apprenticeship', 'Placements and Apprenticeship', 'Placements and Apprenticeships'].includes(goal)) {
        courses = [...catalogue.short, ...catalogue.med];
    } else if (['Strengthen my current skills', 'Upskill', 'Upskilling & Lifelong Learning'].includes(goal)) {
        courses = [...catalogue.med, ...catalogue.long];
    } else if (goal === 'Upskilling & Lifelong Learning' || goal === 'Upskilling & Lifelong Learning') {
        courses = [...catalogue.short, ...catalogue.med]; // Prioritize Micro-learning
    } else {
        courses = [...catalogue.short, ...catalogue.med, ...catalogue.long];
    }
    
    courses = courses.filter(c => c.url && c.url.startsWith('http'));
    if (pathwayState.constraints.budget === 'Free') courses = courses.filter(c => c.cost && c.cost.toLowerCase().includes('free'));
    if (pathwayState.constraints.mode === 'Online') courses = courses.filter(c => c.mode === 'Online');
    
    // NEW: Prioritize courses based on Interest (User's "What sounds most like you" selection)
    if (pathwayState.interest) {
         const interestMap = {
            'tech': ['Python', 'IoT', 'Solar', 'Design', 'Coding', 'Technical', 'Digital', 'Technology'],
            'code': ['Python', 'Java', 'React', 'API', 'Code', 'Software', 'Web', 'Development'],
            'design': ['Design', 'UX', 'CAD', 'Drawing', 'Planning', 'Product', 'Creative'],
            'hands-on': ['Installation', 'Wiring', 'Maintenance', 'Repair', 'Field', 'Technician', 'Practical'],
            'field': ['Soil', 'Crop', 'Drone', 'Scouting', 'Farm', 'Agriculture', 'Field'],
            'biz': ['Sales', 'Management', 'Logistics', 'Finance', 'Business', 'Supply Chain', 'Entrepreneurship'],
            'mgmt': ['Management', 'Audit', 'Policy', 'Planning', 'Project', 'Leadership'],
            'data': ['Data', 'Analysis', 'Excel', 'Statistics', 'Logic', 'Science', 'Analytics'],
            'creative': ['Design', 'Marketing', 'Content', 'Strategy', 'UI', 'Creative']
        };
        const keywords = interestMap[pathwayState.interest] || [];
        
        if (keywords.length > 0) {
            courses.sort((a, b) => {
                const getMatchScore = (c) => {
                    const text = (c.name + " " + (c.description || "") + " " + (c.skills || []).join(" ")).toLowerCase();
                    return keywords.filter(k => text.includes(k.toLowerCase())).length;
                };
                return getMatchScore(b) - getMatchScore(a);
            });
        }
    }

    const finalCourses = courses.slice(0, 4); // Limit to 4 for cleaner UI
    const trainingHtml = finalCourses.map(c => `
        <a href="${c.url}" target="_blank" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-${theme}-300 transition-colors group shadow-sm">
            <span class="shrink-0 text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">${c.level === 'short' ? 'Short' : 'Cert'}</span>
            <div class="flex-1 min-w-0">
                <div class="font-bold text-xs text-slate-800 group-hover:text-${theme}-700 truncate">${c.name}</div>
                <div class="text-[10px] text-slate-500">${c.provider}</div>
            </div>
            <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-${theme}-500 shrink-0"></i>
        </a>
    `).join('');

    // --- SECTION D: ACTIVE JOB BOARDS ---
    const careerResources = getSectorCareerResources(sector);
    let blockDTitle = "Active Job Boards";
    let blockDAction = "View All";
    let blockDOnclick = "toggleCareerHub()";
    let blockDContentHtml = "";
    let blockDColor = "amber";

    if (true) { // Always show Job Boards for non-venture goals
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

    // --- UPSKILLING HTML (all vars in scope here: finalCourses, certList, networkList, gapHtml, advancedTools, targetSkills) ---
    let upskillingHtml = '';
    if (isUpskilling) {
        const skillArea = pathwayState.upskillingSkillArea || 'all';
        const upskillingTab = pathwayState.upskillingTab || 'all';
        const upskillingGoal = pathwayState.upskillingGoal || null;

        let coursePool = finalCourses;
        if (skillArea !== 'all') {
            const sa = skillArea.toLowerCase();
            const filtered = finalCourses.filter(c =>
                (c.name && c.name.toLowerCase().includes(sa)) ||
                (c.skills && c.skills.some(s => s.toLowerCase().includes(sa)))
            );
            if (filtered.length > 0) coursePool = filtered;
        }

        const allRes = [
            ...coursePool.map(c => ({ title: c.name, desc: c.provider, link: c.url, type: 'course', icon: 'book-open' })),
            ...certList.map(c => ({ title: c.title, desc: c.desc, link: c.link, type: 'cert', icon: c.icon || 'award' })),
            ...networkList.map(n => ({ title: n.title, desc: n.desc, link: n.link, type: 'network', icon: 'users' }))
        ];

        const typeOrderMap = {
            advance: { cert: 0, network: 1, course: 2 },
            gap:     { course: 0, cert: 1, network: 2 },
            cpd:     { network: 0, cert: 1, course: 2 }
        };
        if (upskillingGoal && typeOrderMap[upskillingGoal]) {
            const ord = typeOrderMap[upskillingGoal];
            allRes.sort((a, b) => (ord[a.type] || 0) - (ord[b.type] || 0));
        }

        const displayRes = upskillingTab === 'all' ? allRes : allRes.filter(r =>
            upskillingTab === 'courses' ? r.type === 'course' :
            upskillingTab === 'certs'   ? r.type === 'cert'   :
            upskillingTab === 'networks'? r.type === 'network': true
        );

        const typeMeta = {
            course:  { label: 'Course',  bg: 'bg-blue-100 text-blue-600',    badge: 'bg-blue-50 text-blue-700 border border-blue-100' },
            cert:    { label: 'Cert',    bg: 'bg-sky-100 text-sky-600',     badge: 'bg-sky-50 text-sky-700 border border-sky-100' },
            network: { label: 'Network', bg: 'bg-indigo-100 text-indigo-600', badge: 'bg-indigo-50 text-indigo-700 border border-indigo-100' }
        };

        const resourceRowsHtml = displayRes.length > 0 ? displayRes.map(r => {
            const m = typeMeta[r.type];
            return `<a href="${r.link}" target="_blank" class="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm group transition-all">
                <div class="p-1.5 ${m.bg} rounded shrink-0"><i data-lucide="${r.icon}" class="w-3.5 h-3.5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700 truncate">${r.title}</div>
                    <div class="text-[10px] text-slate-500 truncate">${r.desc}</div>
                </div>
                <span class="text-[9px] font-bold ${m.badge} px-1.5 py-0.5 rounded shrink-0 hidden sm:inline">${m.label}</span>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
            </a>`;
        }).join('') : `<div class="text-xs text-slate-500 italic text-center py-4">No resources found for this combination.</div>`;

        const tabsHtml = ['all','courses','certs','networks'].map(t => {
            const labels = { all:'All', courses:'Courses', certs:'Certifications', networks:'Networks' };
            const active = upskillingTab === t;
            return `<button onclick="selectUpskillingTab('${t}')" class="px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${active ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">${labels[t]}</button>`;
        }).join('');

        const focusOptions = [
            { value: 'all', label: 'All Priorities' },
            { value: 'advance', label: 'Advance in My Role' },
            { value: 'gap', label: 'Address Skills Gaps' },
            { value: 'cpd', label: 'Stay Current / CPD' }
        ].map(o => `<option value="${o.value}" ${(upskillingGoal || 'all') === o.value ? 'selected' : ''}>${o.label}</option>`).join('');

        const skillOptions = `<option value="all" ${skillArea === 'all' ? 'selected' : ''}>All Skills</option>` +
            allSkills.slice(0, 10).map(s => `<option value="${s.name}" ${skillArea === s.name ? 'selected' : ''}>${s.name}</option>`).join('');

        const toolsHtml = advancedTools.length > 0
            ? `<div class="flex flex-wrap items-center gap-2 pt-3 mt-1 border-t border-slate-100"><span class="text-[10px] font-bold text-slate-400 uppercase mr-1">Tools</span>${advancedTools.map(t => `<span class="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold">${t}</span>`).join('')}</div>` : '';

        const scoreBanner = (pathwayState.diagnosticScore !== undefined) ? `
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-3 text-xs">
                <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg shrink-0 mt-0.5"><i data-lucide="clipboard-check" class="w-4 h-4"></i></div>
                <div>
                    <span class="font-bold text-slate-800">Readiness score: ${pathwayState.diagnosticScore}% for ${pathwayState.diagnosticRole || 'your target role'}</span>
                    <span class="text-slate-500"> — you're job-ready. ${pathwayState.diagnosticTechGaps && pathwayState.diagnosticTechGaps.length > 0 ? 'This plan targets your remaining skill gaps and next-level development.' : 'This plan focuses on advancing your skills and staying ahead in your field.'}</span>
                </div>
            </div>` : '';

        upskillingHtml = `
            ${scoreBanner}
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">My Focus</label>
                        <div class="relative">
                            <select onchange="selectUpskillingFilter(this.value,null)" class="w-full text-xs font-semibold text-slate-700 border-slate-300 rounded-lg py-2 pl-2.5 pr-8 appearance-none bg-slate-50 hover:bg-white cursor-pointer">${focusOptions}</select>
                            <i data-lucide="chevron-down" class="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"></i>
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Skill Area</label>
                        <div class="relative">
                            <select onchange="selectUpskillingFilter(null,this.value)" class="w-full text-xs font-semibold text-slate-700 border-slate-300 rounded-lg py-2 pl-2.5 pr-8 appearance-none bg-slate-50 hover:bg-white cursor-pointer">${skillOptions}</select>
                            <i data-lucide="chevron-down" class="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"></i>
                        </div>
                    </div>
                </div>
            </div>
            ${gapHtml}
            <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div class="p-3 border-b border-slate-100 bg-slate-50">
                    <div class="flex flex-wrap gap-2">${tabsHtml}</div>
                    ${toolsHtml}
                </div>
                <div class="p-3 space-y-2">${resourceRowsHtml}</div>
            </div>
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                <div class="p-2 bg-slate-200 text-slate-600 rounded-lg shrink-0"><i data-lucide="building-2" class="w-4 h-4"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-700">Managing a team?</div>
                    <div class="text-[11px] text-slate-500 mt-0.5">Run a Skills Audit to map collective gaps and build a shared upskilling plan.</div>
                </div>
                <button onclick="openSkillsView('pp-employer')" class="shrink-0 text-[11px] font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap">Audit My Team <i data-lucide="chevron-right" class="w-3 h-3"></i></button>
            </div>
            <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span class="text-xs text-slate-600 flex items-center gap-1.5"><i data-lucide="briefcase" class="w-3.5 h-3.5 text-slate-400"></i> Looking for roles?</span>
                <button onclick="toggleCareerHub()" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">Browse Job Boards <i data-lucide="chevron-right" class="w-3 h-3"></i></button>
            </div>`;
    }

    // --- RENDER FINAL HTML ---
    const sectorLabel = sector === 'agri' ? 'Agritech' : sector === 'energy' ? 'Renewable Energy' : 'Digital Economy';

    const headerHtml = `
        <div class="pt-1">
            <h2 class="text-lg font-bold text-${theme}-700 leading-tight">${goal}</h2>
            ${profileHtml}
            <div class="flex items-center gap-4 mt-2">
                ${pathwayState.entryPoint !== 'cpd' ? `<button onclick="renderPathwayGoal()" class="text-xs text-slate-400 hover:text-${theme}-600 flex items-center gap-1 transition-colors"><i data-lucide="refresh-ccw" class="w-3 h-3"></i> Change Goal</button>` : ''}
                <button onclick="initPathwayWizard()" class="text-xs text-slate-400 hover:text-${theme}-600 flex items-center gap-1 transition-colors"><i data-lucide="rotate-ccw" class="w-3 h-3"></i> Restart</button>
            </div>
        </div>
    `;

    const skillsFocusHtml = `
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3"><i data-lucide="zap" class="w-4 h-4 text-blue-500"></i> Skills Focus</h3>
            <div class="flex flex-wrap gap-2">
                ${targetSkills.map(s => `
                    <button onclick="openSkillModal('${s.name.replace(/'/g, "\\'")}')" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-${theme}-300 hover:bg-${theme}-50 hover:text-${theme}-700 transition-all">
                        ${s.isHot ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>' : ''}
                        ${s.name}
                    </button>
                `).join('')}
            </div>
            ${advancedTools.length > 0 ? `
            <div class="mt-3 pt-3 border-t border-slate-100">
                <h4 class="text-[10px] font-bold text-slate-400 uppercase mb-2">Recommended Tools</h4>
                <div class="flex flex-wrap gap-2">
                    ${advancedTools.map(t => `<span class="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600">${t}</span>`).join('')}
                </div>
            </div>` : ''}
        </div>
    `;

    const jobBoardsHtml = `
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div class="flex justify-between items-center mb-3">
                <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2"><i data-lucide="briefcase" class="w-4 h-4 text-${blockDColor}-500"></i> ${blockDTitle}</h3>
                <button onclick="${blockDOnclick}" class="text-[10px] font-bold text-${blockDColor}-600 bg-${blockDColor}-50 px-2 py-1 rounded-lg hover:bg-${blockDColor}-100 border border-${blockDColor}-100">${blockDAction}</button>
            </div>
            <div class="space-y-2">
                ${blockDContentHtml || '<div class="text-xs text-slate-500 italic">No items found.</div>'}
            </div>
        </div>
    `;

    const sectionAHtml = `
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div class="flex justify-between items-center mb-3">
                <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2"><i data-lucide="target" class="w-4 h-4 text-indigo-500"></i> ${blockBTitle}</h3>
                ${blockBAction ? `<button onclick="${blockBOnclick}" class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg hover:bg-indigo-100 border border-indigo-100">${blockBAction}</button>` : ''}
            </div>
            ${blockBContent}
        </div>`;

    // --- INTERPERSONAL & SOFT SKILLS SECTION ---
    const cachedEmpGaps = (pathwayState.diagnosticEmpGaps || []).slice(0, 4);
    let interpersonalSectionHtml;
    if (cachedEmpGaps.length > 0) {
        const _sectorLabel = sector === 'agri' ? 'Agritech' : sector === 'energy' ? 'Renewable Energy' : 'Digital Economy';
        const skillChips = cachedEmpGaps.map(gap =>
            `<span class="px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold rounded-lg">${gap}</span>`
        ).join('');
        interpersonalSectionHtml = `
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2 mb-2"><i data-lucide="users" class="w-4 h-4 text-sky-500"></i> Interpersonal &amp; Soft Skills</h3>
                <p class="text-xs text-slate-500 mb-3">Based on your assessment, these are the interpersonal skills to prioritise for this type of work in ${_sectorLabel}.</p>
                <div class="flex flex-wrap gap-2">${skillChips}</div>
            </div>`;
    } else {
        interpersonalSectionHtml = `
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3"><i data-lucide="users" class="w-4 h-4 text-sky-500"></i> Interpersonal &amp; Soft Skills</h3>
                <div class="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                    <div class="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0"><i data-lucide="help-circle" class="w-4 h-4"></i></div>
                    <div>
                        <p class="text-xs font-bold text-amber-900 mb-0.5">Get personalised recommendations</p>
                        <p class="text-xs text-amber-700 leading-snug">Complete the Skills Assessment to see the interpersonal skills most relevant to your goal.</p>
                        <button onclick="renderPathwayStep0()" class="mt-2 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg transition-colors">Assess my skills →</button>
                    </div>
                </div>
            </div>`;
    }

    // --- GET JOB-READY / BUILD YOUR PROFILE SECTION ---
    const localTipStep3 = (typeof countryPathwayContext !== 'undefined' && (countryPathwayContext[activeCountry] || countryPathwayContext['all'])) || { hub: 'local hubs' };
    const jobReadyMap = {
        agri: [
            { icon: 'briefcase', title: 'Build your portfolio', desc: 'Document agri-tech projects on GitHub or LinkedIn.', link: 'https://www.linkedin.com/' },
            { icon: 'leaf', title: 'AgriFuse / VC4A', desc: 'Enter an African agri-tech competition to build real evidence.', link: 'https://vc4a.com/programs/' },
            { icon: 'database', title: 'Open Ag Data Alliance', desc: 'Explore open data standards and build farm-tech solutions.', link: 'https://www.openag.io/' },
            { icon: 'users', title: 'Agri Hackathon', desc: `Join a local agri-tech challenge via <strong>${localTipStep3.hub}</strong>.`, link: 'https://vc4a.com/events/' }
        ],
        energy: [
            { icon: 'briefcase', title: 'Build your portfolio', desc: 'Document renewable energy projects on GitHub or LinkedIn.', link: 'https://www.linkedin.com/' },
            { icon: 'sun', title: 'GOGLA / Open Solar', desc: 'Explore solar deployment tools and build a case study.', link: 'https://www.gogla.org/resources' },
            { icon: 'bar-chart-2', title: 'Energy Access Explorer', desc: 'Build energy access analyses using WRI data tools.', link: 'https://energyaccessexplorer.org/' },
            { icon: 'users', title: 'Energy Hackathon', desc: `Join a clean energy challenge via <strong>${localTipStep3.hub}</strong>.`, link: 'https://devpost.com/' }
        ],
        digital: [
            { icon: 'briefcase', title: 'Build your portfolio', desc: 'Compile "what I did + evidence" on Behance, Github or LinkedIn.', link: 'https://www.behance.net/blog/portfolio-that-gets-you-hired' },
            { icon: 'code-2', title: 'Zindi Challenges', desc: 'Compete in Africa-focused data science challenges.', link: 'https://zindi.africa/' },
            { icon: 'terminal', title: 'freeCodeCamp Projects', desc: 'Learn basics → Build projects → Earn certification.', link: 'https://www.freecodecamp.org/' },
            { icon: 'users', title: 'Hackathon', desc: `Join a team challenge via <strong>${localTipStep3.hub}</strong>.`, link: 'https://devpost.com/' }
        ]
    };
    const jobReadyItemsHtml = (jobReadyMap[sector] || jobReadyMap.digital).map(l => `
        <a href="${l.link}" target="_blank" class="flex items-center gap-3 p-2.5 border border-slate-100 rounded-lg bg-white hover:border-indigo-200 group transition-colors">
            <div class="p-1.5 bg-indigo-50 text-indigo-600 rounded shrink-0"><i data-lucide="${l.icon}" class="w-3.5 h-3.5"></i></div>
            <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-slate-700 group-hover:text-indigo-700 truncate">${l.title}</div>
                <div class="text-xs text-slate-500 leading-snug">${l.desc}</div>
            </div>
            <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-indigo-500 shrink-0"></i>
        </a>`).join('');
    const jobReadySectionHtml = `
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3"><i data-lucide="rocket" class="w-4 h-4 text-indigo-500"></i> Get Job-Ready: Build Your Profile</h3>
            <div class="space-y-1.5">${jobReadyItemsHtml}</div>
        </div>`;

    const nonUpskillingTail = !isUpskilling ? `
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div class="flex justify-between items-center mb-3">
                <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2"><i data-lucide="book-open" class="w-4 h-4 text-blue-500"></i> Technical Skills &amp; Training</h3>
                ${blockCAction ? `<button onclick="${blockCOnclick}" class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100 border border-blue-100">${blockCAction}</button>` : ''}
            </div>
            <div class="grid grid-cols-1 gap-3">${trainingHtml}</div>
            ${finalCourses.length === 0 ? '<div class="text-xs text-slate-500 italic mt-2">No specific courses found matching constraints.</div>' : ''}
        </div>
        ${interpersonalSectionHtml}
        ${jobReadySectionHtml}
        <button onclick="openSkillsView('pp-courses')" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-sm">
            <i data-lucide="search" class="w-4 h-4"></i> Browse all Courses
        </button>` : '';

    container.innerHTML = `
        <div class="animate-fade-in space-y-4 pb-8">
            ${headerHtml}
            ${isUpskilling ? upskillingHtml : sectionAHtml + (goal === 'Build My Foundation' ? '' : skillsFocusHtml)}
            ${nonUpskillingTail}
        </div>
    `;
    if (pathwayState.entryPoint === 'cpd') {
        updatePathwayBackNav('Back to Hub', 'renderSkillsHubDashboard()');
    } else {
        updatePathwayBackNav('Back to Goals', 'renderPathwayGoal()');
    }
    refreshIcons();
}

// --- NEW: Career Readiness Scorecard ---
window.renderReadinessScorecard = function(targetId = 'pp-practice-content', backAction = 'renderPathwayStep3()') {
    const container = document.getElementById(targetId);
    if(!container) return;

    const isPathwayContext = targetId === 'pp-practice-content';
    const optionsBtn = isPathwayContext ? `<button onclick="renderPathwayGoal()" class="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-4 h-4"></i> Options</button>` : '';

    const sections = [
        {
            title: "Digital Assets", icon: "file-text", color: "blue",
            items: ["CV is ATS-friendly (no graphics/columns)", "LinkedIn profile has a professional photo", "LinkedIn 'About' section tells a story", "Portfolio link is working and accessible"]
        },
        {
            title: "Search Strategy", icon: "target", color: "sky",
            items: ["Identified top 10 target companies", "Set up job alerts on 3+ platforms", "Connected with 5+ alumni/peers in sector", "Researched salary benchmarks for role"]
        },
        {
            title: "Interview Prep", icon: "mic", color: "indigo",
            items: ["Prepared 3 STAR stories for behavioral Qs", "Researched 'Why this company?' answer", "Practiced technical/case study questions", "Prepared questions to ask the interviewer"]
        }
    ];

    container.innerHTML = `
        <div class="max-w-3xl mx-auto py-4 animate-fade-in">
            <div class="mb-6 flex justify-between items-center">
                <div class="flex gap-3">
                    <button onclick="${backAction}" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>
                    ${optionsBtn}
                </div>
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wide">Readiness Audit</div>
            </div>
            
            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-slate-900 mb-2">Are you ready to apply?</h2>
                <p class="text-slate-500">Check off items to calculate your readiness score.</p>
            </div>

            <div class="space-y-6" id="scorecard-form">
                ${sections.map((s, idx) => `
                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <div class="p-1.5 bg-${s.color}-50 text-${s.color}-600 rounded-lg"><i data-lucide="${s.icon}" class="w-4 h-4"></i></div>
                            ${s.title}
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            ${s.items.map(item => `
                                <label class="flex items-start gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                    <input type="checkbox" class="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 scorecard-check">
                                    <span class="text-xs text-slate-700 font-medium leading-snug">${item}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="mt-8 p-6 bg-slate-900 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
                <div>
                    <h3 class="font-bold text-lg mb-1">Your Readiness Score</h3>
                    <p class="text-xs text-slate-400">Aim for 80%+ before major applications.</p>
                </div>
                <div class="flex items-center gap-4 w-full sm:w-auto">
                    <div class="flex-1 sm:w-48 bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div id="readiness-bar" class="bg-blue-500 h-full rounded-full transition-all duration-1000" style="width: 0%"></div>
                    </div>
                    <span id="readiness-text" class="font-bold text-2xl font-mono">0%</span>
                </div>
            </div>
        </div>
    `;
    
    // Add listeners
    setTimeout(() => {
        const checks = document.querySelectorAll('.scorecard-check');
        const updateScore = () => {
            const total = checks.length;
            const checked = document.querySelectorAll('.scorecard-check:checked').length;
            const pct = Math.round((checked / total) * 100);
            document.getElementById('readiness-bar').style.width = `${pct}%`;
            document.getElementById('readiness-text').innerText = `${pct}%`;
        };
        checks.forEach(c => c.addEventListener('change', updateScore));
    }, 100);

    refreshIcons();
}

// --- NEW: Apprenticeship Checklist ---
window.renderApprenticeshipChecklist = function(targetId = 'pp-practice-content', backAction = 'renderPathwayStep3()') {
    const container = document.getElementById(targetId);
    if(!container) return;

    const isPathwayContext = targetId === 'pp-practice-content';
    const optionsBtn = isPathwayContext ? `<button onclick="renderPathwayGoal()" class="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 hover:border-indigo-200 hover:bg-indigo-100 text-indigo-700 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"><i data-lucide="rotate-ccw" class="w-4 h-4"></i> Options</button>` : '';

    const backBtnClass = isPathwayContext 
        ? "px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 hover:border-indigo-200 hover:bg-indigo-100 text-indigo-700 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"
        : "px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm";

    const sections = [
        {
            title: "Pre-Placement", icon: "search", color: "blue",
            items: ["Identify target trade/skill (e.g. Solar, Welding)", "Research national requirements (e.g. NITA, VETA)", "Prepare a 'Learner's CV' focusing on attitude"]
        },
        {
            title: "Onboarding", icon: "file-signature", color: "indigo",
            items: ["Draft/Sign Apprenticeship Agreement", "Obtain necessary PPE (Safety Gear)", "Set up a Daily Logbook (Physical or Digital)"]
        },
        {
            title: "Daily Routine", icon: "calendar-check", color: "sky",
            items: ["Schedule weekly check-ins with supervisor", "Document 3 key learnings per week", "Collect photo evidence of work (Portfolio)"]
        }
    ];

    container.innerHTML = `
        <div class="max-w-3xl mx-auto py-4 animate-fade-in">
            <div class="mb-6 flex justify-between items-center">
                <div class="flex gap-4">
                    <button onclick="${backAction}" class="${backBtnClass}"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back</button>
                    ${optionsBtn}
                </div>
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wide">Placements & Apprenticeship Audit</div>
            </div>
            
            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-slate-900 mb-2">Apprentice Readiness Checklist</h2>
                <p class="text-slate-500">Ensure you are ready for a successful placement.</p>
            </div>

            <div class="space-y-6" id="app-checklist-form">
                ${sections.map((s, idx) => `
                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <div class="p-1.5 bg-${s.color}-50 text-${s.color}-600 rounded-lg"><i data-lucide="${s.icon}" class="w-4 h-4"></i></div>
                            ${s.title}
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            ${s.items.map(item => `
                                <label class="flex items-start gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                    <input type="checkbox" class="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 app-check">
                                    <span class="text-xs text-slate-700 font-medium leading-snug">${item}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="mt-8 p-6 bg-slate-900 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
                <div>
                    <h3 class="font-bold text-lg mb-1">Readiness Score</h3>
                    <p class="text-xs text-slate-400">Complete all items before your first day.</p>
                </div>
                <div class="flex items-center gap-4 w-full sm:w-auto">
                    <div class="flex-1 sm:w-48 bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div id="app-readiness-bar" class="bg-indigo-500 h-full rounded-full transition-all duration-1000" style="width: 0%"></div>
                    </div>
                    <span id="app-readiness-text" class="font-bold text-2xl font-mono">0%</span>
                </div>
            </div>
        </div>
    `;
    
    // Add listeners
    setTimeout(() => {
        const checks = document.querySelectorAll('.app-check');
        const updateScore = () => {
            const total = checks.length;
            const checked = document.querySelectorAll('.app-check:checked').length;
            const pct = Math.round((checked / total) * 100);
            document.getElementById('app-readiness-bar').style.width = `${pct}%`;
            document.getElementById('app-readiness-text').innerText = `${pct}%`;
        };
        checks.forEach(c => c.addEventListener('change', updateScore));
    }, 100);

    refreshIcons();
}

// --- NEW: Pivot Audit (Change Careers) ---
window.renderPivotAudit = function() {
    const container = document.getElementById('pp-practice-content');
    if(!container) return;

    const sections = [
        {
            title: "Skill Translation", icon: "languages", color: "sky",
            items: ["Mapped past skills to new sector jargon", "Identified transferable soft skills (e.g. Mgmt)", "Created a 'functional' CV format"]
        },
        {
            title: "Market Immersion", icon: "users", color: "blue",
            items: ["Joined 2+ sector-specific communities", "Followed 10 industry leaders on LinkedIn", "Subscribed to 3 industry newsletters"]
        },
        {
            title: "Validation", icon: "check-circle", color: "blue",
            items: ["Conducted 3 informational interviews", "Completed 1 relevant mini-project", "Updated LinkedIn headline to 'Aspiring [Role]'"]
        }
    ];

    container.innerHTML = `
        <div class="max-w-3xl mx-auto py-4 animate-fade-in">
            <div class="mb-6 flex justify-between items-center">
                <button onclick="renderPathwayStep3()" class="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 hover:border-indigo-200 hover:bg-indigo-100 text-indigo-700 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Pathway</button>
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wide">Pivot Audit</div>
            </div>
            
            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-slate-900 mb-2">Career Switch Checklist</h2>
                <p class="text-slate-500">Track your transition from "Outsider" to "Insider".</p>
            </div>

            <div class="space-y-6">
                ${sections.map((s) => `
                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <div class="p-1.5 bg-${s.color}-50 text-${s.color}-600 rounded-lg"><i data-lucide="${s.icon}" class="w-4 h-4"></i></div>
                            ${s.title}
                        </h3>
                        <div class="space-y-3">
                            ${s.items.map(item => `
                                <label class="flex items-start gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors">
                                    <input type="checkbox" class="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300">
                                    <span class="text-xs text-slate-700 font-medium leading-snug">${item}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    refreshIcons();
}

// --- NEW: Outreach Templates Resource ---
window.renderOutreachTemplates = function() {
    const container = document.getElementById('pp-practice-content');
    if(!container) return;

    const templates = [
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

    container.innerHTML = `
        <div class="max-w-3xl mx-auto py-4 animate-fade-in">
            <div class="mb-6 flex gap-4">
                <button onclick="renderPathwayStep3()" class="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 hover:border-indigo-200 hover:bg-indigo-100 text-indigo-700 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Pathway</button>
                <button onclick="renderPathwayGoal()" class="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 hover:border-indigo-200 hover:bg-indigo-100 text-indigo-700 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"><i data-lucide="rotate-ccw" class="w-4 h-4"></i> Options</button>
            </div>
            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-slate-900 mb-2">Cold Outreach Scripts</h2>
                <p class="text-slate-500">Don't know what to say? Copy, adapt, and send.</p>
            </div>
            <div class="grid grid-cols-1 gap-4">
                ${templates.map(t => `
                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm group hover:border-indigo-300 transition-colors">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="font-bold text-slate-800 text-sm">${t.title}</h3>
                            <button onclick="navigator.clipboard.writeText(this.getAttribute('data-copy')); alert('Copied to clipboard!');" data-copy="${t.body}" class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 flex items-center gap-1"><i data-lucide="copy" class="w-3 h-3"></i> Copy</button>
                        </div>
                        ${t.subject !== 'N/A' ? `<div class="text-xs text-slate-500 mb-2"><span class="font-bold">Subject:</span> ${t.subject}</div>` : ''}
                        <div class="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 font-mono whitespace-pre-wrap leading-relaxed border border-slate-100">${t.body}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    refreshIcons();
}

window.updatePathwayConstraint = function(key, value) {
    pathwayState.constraints[key] = value;
    renderPathwayStep3(); // Re-render to apply filters
}

function openOccupationModal(title) {
    closeAllModals('occupation-modal');
    const modal = document.getElementById('occupation-modal');
    const panel = document.getElementById('occupation-modal-panel');
    
    // Reset scroll position and ensure mobile layout
    const scrollContainer = panel.querySelector('.overflow-y-auto');
    if (scrollContainer) scrollContainer.scrollTop = 0;

    const sectorName = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energies' : 'Digital Economies / AI';
    
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
    
    if (isLite) {
        console.log("Lite mode enabled: Reducing visual load for performance.");
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

function closeAllModals(exceptId = null) {
    // 1. Close Drawers
    const drawers = [
        'unified-hub-modal', 
        'career-hub-drawer', 
        'training-hub-drawer', 
        'sector-hub-drawer',
        'community-hub-drawer'
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
    renderOccupationsView();
    
    // Update Dashboard Cards Context
    if (document.getElementById('skills-hub-home') && !document.getElementById('skills-hub-home').classList.contains('hidden')) {
         renderSkillsHubCards();
    }
    if (document.getElementById('pp-top-skills') && !document.getElementById('pp-top-skills').classList.contains('hidden')) {
         renderSkillsHubSkills();
    }
}

window.setGlobalSector = function(sector) {
    activeSectorId = sector;

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
    
    renderOccupationsView();
    
    // Update Dashboard Cards Context
    if (document.getElementById('skills-hub-home') && !document.getElementById('skills-hub-home').classList.contains('hidden')) {
         renderSkillsHubCards();
    }
    if (document.getElementById('pp-top-skills') && !document.getElementById('pp-top-skills').classList.contains('hidden')) {
         renderSkillsHubSkills();
    }
}

window.openUnifiedHub = function(startTab = 'pp-diagnostic', roleName = null, pathwayGoal = null) {
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
        openSkillsView(startTab, specificRequest, addToStack);
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
        headerTitle.innerHTML = `<i data-lucide="layers" class="w-6 h-6 text-indigo-600"></i> Skills & Employability Pathways`;
    }

    // Hide other views
    document.querySelectorAll('.pp-view-content').forEach(el => el.classList.add('hidden'));
    container.classList.remove('hidden');

    container.innerHTML = `
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
            <button onclick="openSkillsView('pp-top-skills')" class="p-4 bg-amber-50 border border-amber-100 rounded-xl hover:border-amber-300 hover:bg-white hover:shadow-md text-left transition-all group w-full flex items-start gap-4">
                <div class="p-3 bg-amber-100 text-amber-600 rounded-lg shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors"><i data-lucide="trending-up" class="w-6 h-6"></i></div>
                <div>
                    <h3 class="font-bold text-slate-800 text-lg mb-1">Skills in Demand</h3>
                    <p class="text-sm text-slate-600">Explore the top skills employers are seeking in <strong>${sectorName}</strong>. Browse skill definitions, proficiency levels, job roles, and cross-sector applications.</p>
                </div>
            </button>

            <button onclick="openSkillsView('pp-practice')" class="p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:border-indigo-300 hover:bg-white hover:shadow-md text-left transition-all group w-full flex items-start gap-4">
                <div class="p-3 bg-indigo-100 text-indigo-600 rounded-lg shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><i data-lucide="map" class="w-6 h-6"></i></div>
                <div>
                    <h3 class="font-bold text-slate-800 text-lg mb-1">Learning and Employability Pathways</h3>
                    <p class="text-sm text-slate-600">Build a step-by-step personalised learning roadmap tailored to your goals and skills strengths and gaps in <strong>${sectorName}</strong> — starting with a quick job readiness check.</p>
                </div>
            </button>
            
            <button onclick="openSkillsView('pp-courses')" class="p-4 bg-blue-50 border border-blue-100 rounded-xl hover:border-blue-300 hover:bg-white hover:shadow-md text-left transition-all group w-full flex items-start gap-4">
                <div class="p-3 bg-blue-100 text-blue-600 rounded-lg shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors"><i data-lucide="search" class="w-6 h-6"></i></div>
                <div>
                    <h3 class="font-bold text-slate-800 text-lg mb-1">Find Courses</h3>
                    <p class="text-sm text-slate-600">Search for training providers based on your skills needs and level, time, cost and location.</p>
                </div>
            </button>

    `;
    refreshIcons();
}

// --- NEW: Render Skills Grid in Skills Hub ---
window.renderSkillsHubSkills = function() {
    const container = document.getElementById('pp-top-skills');
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

    // Filter Logic
    if (showCrossSectorOnly) {
        displaySkills = displaySkills.filter(s => {
            const name = s.name || s.skill;
            return typeof crossSectorSkillMatrix !== 'undefined' && crossSectorSkillMatrix[name];
        });
    }

    const topSkills = displaySkills.slice(0, 6);
    const moreSkills = displaySkills.slice(6, 15);

    // Styling
    const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[activeSectorId] : { color: 'indigo' };
    const themeColor = themeConfig.color;
    const cardTitleColor = `text-${themeColor}-800`;
    const cardDescColor = `text-${themeColor}-700/80`;
    const cardBgColor = "bg-white";
    const cardBorderColor = `border-${themeColor}-200`;
    const cardHoverBg = `hover:bg-${themeColor}-100`;
    const cardHoverBorder = `hover:border-${themeColor}-300`;

    // Helper for Badge
    const getCrossSectorBadge = (name) => {
        const matrixEntry = (typeof crossSectorSkillMatrix !== 'undefined') ? crossSectorSkillMatrix[name] : null;
        if (matrixEntry) {
            return `<div class="flex items-center gap-1 mt-1.5"><span title="This skill applies to multiple sectors" class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-50 text-amber-700 border border-amber-200 transition-colors"><i data-lucide="layers" class="w-2.5 h-2.5 text-amber-600"></i> Cross-Sector</span></div>`;
        }
        return '';
    };

    const renderSkillCard = (skill) => {
        const skillName = skill.name || skill.skill;
        const skillDesc = skill.desc || skill.description || 'Key competency';
        return `
        <button onclick="openSkillModal('${skillName.replace(/'/g, "\\'")}')" class="px-3 py-2 ${cardBgColor} border ${cardBorderColor} rounded-lg text-left ${cardHoverBg} ${cardHoverBorder} transition-all group h-full flex flex-col justify-between">
            <div class="w-full">
                <div class="font-bold text-xs ${cardTitleColor} mb-0.5 flex items-center gap-1 min-w-0">
                    <i data-lucide="cpu" class="w-3 h-3 shrink-0 opacity-60"></i>
                    <span class="truncate">${skillName}</span>
                    ${skill.isHot ? '<span title="Critical Demand" class="ml-0.5 shrink-0">🔥</span>' : ''}
                </div>
                <div class="text-[10px] ${cardDescColor} leading-tight line-clamp-2">${skillDesc}</div>
            </div>
            ${getCrossSectorBadge(skillName)}
        </button>`;
    };

    container.innerHTML = `
        <div class="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
            <div class="mb-4 flex flex-wrap justify-between items-end gap-2">
                <div>
                    <h3 class="text-base font-bold text-slate-800 flex items-center gap-2"><i data-lucide="cpu" class="w-4 h-4 text-slate-500"></i> Top Skills sought by Employers</h3>
                    <p class="text-xs text-slate-500 mt-1">Click to see skills definitions and proficiency levels, common job roles, skills pairings and sector applications.</p>
                </div>
                <button onclick="toggleCrossSectorFilter()" class="text-[10px] font-bold px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${showCrossSectorOnly ? 'bg-amber-100 text-amber-800 border-amber-200 shadow-inner' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'}">
                    ${showCrossSectorOnly ? '<i data-lucide="check" class="w-3 h-3"></i> Cross-Sector Only' : '<i data-lucide="filter" class="w-3 h-3"></i> Filter: Cross-Sector'}
                </button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                ${topSkills.map(renderSkillCard).join('')}
                <div id="more-skills" class="col-span-full grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-hidden transition-all duration-500 ease-in-out max-h-0 opacity-0">
                    ${moreSkills.map(renderSkillCard).join('')}
                </div>
                ${moreSkills.length > 0 ? `
                <button onclick="toggleGrid('more-skills', this, 'Skills')" class="col-span-full text-left text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-2 flex items-center gap-1">
                    View All Skills <i data-lucide="chevron-down" class="w-3 h-3"></i>
                </button>` : ''}
            </div>
        </div>
    `;
    refreshIcons();
}

// --- NEW: Render Find Courses View (Optimized Layout) ---
window.renderFindCoursesView = function() {
    const container = document.getElementById('pp-courses');
    if (!container) return;

    const sectorLabel = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';
    const countryLabel = activeCountry === 'all' ? 'Regional' : activeCountry;

    container.innerHTML = `
        <div class="animate-fade-in space-y-4">
            <!-- Header -->
            <div class="flex flex-wrap gap-2 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p class="text-xs text-slate-500">Browse verified training providers in <strong>${sectorLabel}</strong>.</p>
                <div class="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    <span class="inline-flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded-full"><i data-lucide="map-pin" class="w-2.5 h-2.5"></i> ${countryLabel}</span>
                    <span class="inline-flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded-full"><i data-lucide="briefcase" class="w-2.5 h-2.5"></i> ${sectorLabel}</span>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <!-- Primary filters (always visible) -->
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
                <button type="button" onclick="toggleMoreFilters()" id="more-filters-toggle" class="mt-3 text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                    <i data-lucide="sliders" class="w-3 h-3"></i> More Filters <i data-lucide="chevron-down" class="w-3 h-3" id="more-filters-chevron"></i>
                </button>

                <!-- Secondary filters (collapsible) -->
                <div id="secondary-filters" class="hidden mt-3 pt-3 border-t border-slate-100">
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
                    </div>
                </div>
            </div>

            <!-- Results -->
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-600" id="provider-counter">Loading...</span>
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
        </div>
    `;
    
    // Initialize Filters
    populateSkillFilter();
    const countrySelect = document.getElementById('filter-country');
    if(countrySelect) countrySelect.value = activeCountry;
    
    renderProviderTable();
    refreshIcons();
}

window.openSkillsView = function(viewId, preserveState = false, addToStack = true) {
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
                headerTitle.innerHTML = `<i data-lucide="map" class="w-6 h-6 text-indigo-600"></i> Learning and Employability Pathways`;
            } else if (viewId === 'pp-courses') {
                headerTitle.innerHTML = `<i data-lucide="search" class="w-6 h-6 text-blue-600"></i> Find Courses`;
            } else if (viewId === 'pp-resources') {
                headerTitle.innerHTML = `<i data-lucide="library" class="w-6 h-6 text-slate-600"></i> Resource Library`;
            } else if (viewId === 'pp-employer') {
                headerTitle.innerHTML = `<i data-lucide="building-2" class="w-6 h-6 text-sky-600"></i> Upskilling for Businesses &amp; Teams`;
            } else if (viewId === 'pp-self-employment') {
                headerTitle.innerHTML = `<i data-lucide="store" class="w-6 h-6 text-sky-600"></i> Self-Employment &amp; Gig Work`;
            } else {
                headerTitle.innerHTML = `<i data-lucide="layers" class="w-6 h-6 text-indigo-600"></i> Skills &amp; Employability Pathways`;
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
        } else if (viewId === 'pp-employer') {
            renderHRView();
        } else if (viewId === 'pp-self-employment') {
            renderSelfEmploymentView();
        }

        // Inject Back Button (After render to ensure it persists)
        if (true) {
            let nav = target.querySelector('.pp-back-nav');
            if(!nav) {
                nav = document.createElement('div');
                nav.className = 'pp-back-nav mb-4';
                target.insertBefore(nav, target.firstChild);
            }
            const backLabel = (hubNavigationStack.length === 0) ? "Back to Hub" : "Back";
            nav.innerHTML = `<button onclick="navigateBackInHub()" class="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"><i data-lucide="arrow-left" class="w-4 h-4"></i> ${backLabel}</button>`;
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
    closeAllModals('certificate-modal');
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
// --- NEW: Render Financial Aid and Scholarships ---
window.renderFinancialAid = function() {
    const container = document.getElementById('financial-aid-list');
    if (!container) return;

    const countryFilter = document.getElementById('finance-filter-country') ? document.getElementById('finance-filter-country').value : activeCountry;
    const typeFilter = document.getElementById('finance-filter-type') ? document.getElementById('finance-filter-type').value : 'all';

    let items = [...(dataManager.scholarships || [])];

    // NEW: Merge Business Funding from Sector Data
    const sectorData = getSectorCareerResources(activeSectorId);
    if (sectorData && sectorData.entrepreneurship && sectorData.entrepreneurship.funding) {
        const bizFunds = sectorData.entrepreneurship.funding.map(f => ({
            name: f.name,
            provider: "Gov/Partner",
            type: "Business Fund",
            coverage: "Loans/Grants",
            country: activeCountry === 'all' ? 'Regional' : activeCountry,
            target: "Youth/SME",
            deadline: "Rolling",
            link: f.link,
            desc: f.desc
        }));
        items = [...items, ...bizFunds];
    }

    // Filter
    items = items.filter(item => {
        const matchCountry = countryFilter === 'all' || item.country === 'Regional' || item.country === countryFilter;
        const matchType = typeFilter === 'all' || item.type.includes(typeFilter);
        return matchCountry && matchType;
    });

    if (items.length === 0) {
        container.innerHTML = `<div class="text-xs text-slate-500 italic text-center py-4">No financial aid opportunities found for these filters.</div>`;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-all shadow-sm group">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <div class="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-0.5">${item.provider}</div>
                    <h4 class="font-bold text-sm text-slate-900 group-hover:text-indigo-700">${item.name}</h4>
                </div>
                <span class="px-2 py-1 rounded text-[10px] font-bold shrink-0 ${item.type === 'Loan' ? 'bg-amber-50 text-amber-700' : (item.type === 'Business Fund' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700')}">${item.type}</span>
            </div>
            <p class="text-xs text-slate-600 mb-3 leading-relaxed">${item.desc}</p>
            <div class="flex flex-wrap items-center justify-between gap-y-2 pt-3 border-t border-slate-50">
                <div class="text-[10px] text-slate-500 font-medium flex flex-wrap gap-3">
                    <span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i> ${item.country}</span>
                    <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> ${item.deadline}</span>
                </div>
                <a href="${item.link}" target="_blank" class="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">Apply <i data-lucide="external-link" class="w-3 h-3"></i></a>
            </div>
        </div>
    `).join('');
    refreshIcons();
}

// --- Render Financial Aid Tab ---
window.renderFinancialAidTab = function() {
    const container = document.getElementById('pp-finance-content');
    if (!container) return;

    const countryEl = document.getElementById('pp-finance-filter-country');
    const typeEl = document.getElementById('pp-finance-filter-type');
    const searchEl = document.getElementById('fin-search');

    let selectedCountry = countryEl ? countryEl.value : (activeCountry || 'all');
    let selectedType = typeEl ? typeEl.value : 'all';
    let searchQuery = searchEl ? searchEl.value.toLowerCase().trim() : '';

    let scholarships = [...(dataManager.scholarships || [])];
    const sectorData = getSectorCareerResources(activeSectorId);
    if (sectorData && sectorData.entrepreneurship && sectorData.entrepreneurship.funding) {
        const bizFunds = sectorData.entrepreneurship.funding.map(f => ({
            name: f.name, provider: 'Gov/Partner', type: 'Business Fund',
            coverage: 'Loans/Grants', country: activeCountry === 'all' ? 'Regional' : activeCountry,
            target: 'Youth/SME', deadline: 'Rolling', link: f.link, desc: f.desc
        }));
        scholarships = [...scholarships, ...bizFunds];
    }

    const filtered = scholarships.filter(s => {
        const matchCountry = selectedCountry === 'all' || s.country === 'Regional' || s.country === selectedCountry;
        const matchType = selectedType === 'all' || s.type === selectedType;
        const matchSearch = !searchQuery ||
            (s.name && s.name.toLowerCase().includes(searchQuery)) ||
            (s.provider && s.provider.toLowerCase().includes(searchQuery)) ||
            (s.desc && s.desc.toLowerCase().includes(searchQuery));
        return matchCountry && matchType && matchSearch;
    });

    // Active filter chips
    const chips = [];
    if (selectedCountry !== 'all') chips.push(`<span class="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-full">Location: ${selectedCountry} <button onclick="document.getElementById('pp-finance-filter-country').value='all';renderFinancialAidTab()" class="ml-0.5 hover:text-indigo-900 font-bold leading-none">&times;</button></span>`);
    if (selectedType !== 'all') chips.push(`<span class="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-full">Type: ${selectedType} <button onclick="document.getElementById('pp-finance-filter-type').value='all';renderFinancialAidTab()" class="ml-0.5 hover:text-indigo-900 font-bold leading-none">&times;</button></span>`);
    if (searchQuery) chips.push(`<span class="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-full">Search: &ldquo;${searchQuery}&rdquo; <button onclick="document.getElementById('fin-search').value='';renderFinancialAidTab()" class="ml-0.5 hover:text-indigo-900 font-bold leading-none">&times;</button></span>`);
    const chipsHtml = chips.length > 0 ? `<div class="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 mt-2">${chips.join('')}</div>` : '';

    // Desktop table rows
    const noResultsHtml = `<div class="flex flex-col items-center justify-center py-8 text-center"><div class="bg-slate-50 p-3 rounded-full mb-3"><i data-lucide="search-x" class="w-6 h-6 text-slate-400"></i></div><p class="text-sm text-slate-600 font-medium mb-2">No opportunities found matching your filters.</p><button onclick="clearFinancialAidFilters()" class="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors mx-auto"><i data-lucide="rotate-ccw" class="w-3 h-3"></i> Clear All Filters</button></div>`;

    const tableRows = filtered.length > 0 ? filtered.map(item => {
        const safeId = 'aid-' + item.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const isSaved = myPlan && myPlan.courses && myPlan.courses.has(item.name);
        const typeBadgeClass = item.type === 'Loan' ? 'bg-amber-50 text-amber-700 border-amber-200' : item.type === 'Business Fund' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200';
        const nameEsc = item.name.replace(/'/g, "\\'");
        return `<tr class="hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
            <td class="px-3 py-3">
                <div class="font-bold text-xs text-slate-900 leading-tight">${item.name}</div>
                <div class="text-[10px] text-slate-500 mt-0.5">${item.provider}</div>
                ${item.target ? `<span class="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded inline-block mt-1">${item.target}</span>` : ''}
            </td>
            <td class="px-3 py-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold border ${typeBadgeClass}">${item.type}</span>${item.coverage ? `<div class="text-[10px] text-slate-400 mt-0.5">${item.coverage}</div>` : ''}</td>
            <td class="px-3 py-3"><span class="text-[10px] text-slate-600 flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i> ${item.country}</span></td>
            <td class="px-3 py-3"><span class="text-[10px] text-slate-600 flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> ${item.deadline}</span></td>
            <td class="px-3 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                    <button data-aid-id="${safeId}" onclick="saveAidToMyPlan('${safeId}','${nameEsc}')" class="p-1 rounded hover:bg-slate-100 ${isSaved ? 'text-indigo-500' : 'text-slate-300 hover:text-indigo-500'} transition-colors" title="${isSaved ? 'Saved to Plan' : 'Save to Plan'}"><i data-lucide="${isSaved ? 'bookmark-check' : 'bookmark'}" class="w-3 h-3"></i></button>
                    ${item.link ? `<a href="${item.link}" target="_blank" class="text-slate-400 hover:text-blue-600 transition p-1"><i data-lucide="external-link" class="w-3 h-3"></i></a>` : `<span class="text-[10px] text-slate-300 px-1">N/A</span>`}
                </div>
            </td>
        </tr>`;
    }).join('') : `<tr><td colspan="5" class="p-0">${noResultsHtml}</td></tr>`;

    // Mobile cards (no type badge — type shown as plain meta text)
    const mobileCards = filtered.length > 0 ? filtered.map(item => {
        const safeId = 'aid-' + item.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const isSaved = myPlan && myPlan.courses && myPlan.courses.has(item.name);
        const nameEsc = item.name.replace(/'/g, "\\'");
        return `<div class="p-4 space-y-2">
            <div>
                <div class="font-bold text-sm text-slate-800 leading-tight">${item.name}</div>
                <div class="text-xs text-slate-500 mt-0.5">${item.provider}</div>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">${item.desc}</p>
            <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] border border-slate-100 flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i> ${item.country}</span>
                <span class="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] border border-slate-100 flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> ${item.deadline}</span>
                <span class="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] border border-slate-100">${item.type}</span>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-slate-50">
                <span class="text-[9px] text-slate-400">${item.coverage || ''}</span>
                <div class="flex items-center gap-2">
                    <button data-aid-id="${safeId}" onclick="saveAidToMyPlan('${safeId}','${nameEsc}')" class="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-100 ${isSaved ? 'text-indigo-500' : 'text-slate-300 hover:text-indigo-500'} transition-colors" title="${isSaved ? 'Saved to Plan' : 'Save to Plan'}"><i data-lucide="${isSaved ? 'bookmark-check' : 'bookmark'}" class="w-3.5 h-3.5"></i></button>
                    ${item.link ? `<a href="${item.link}" target="_blank" class="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors">Apply <i data-lucide="external-link" class="w-3 h-3"></i></a>` : `<span class="text-[10px] text-slate-300">N/A</span>`}
                </div>
            </div>
        </div>`;
    }).join('') : noResultsHtml;

    container.innerHTML = `
        <div class="animate-fade-in space-y-4">
            <!-- Header -->
            <div class="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-center gap-3">
                <div class="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl shrink-0"><i data-lucide="banknote" class="w-5 h-5"></i></div>
                <div>
                    <h3 class="font-bold text-indigo-900 text-sm">Financial Aid &amp; Scholarships</h3>
                    <p class="text-xs text-indigo-700 mt-0.5 leading-relaxed">Find scholarships and funding opportunities to support your education and career pathway.</p>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div class="mb-3">
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Search</label>
                    <input id="fin-search" type="text" oninput="renderFinancialAidTab()" placeholder="Search by name, provider or description..." class="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none" value="${searchQuery.replace(/"/g, '&quot;')}" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Location</label>
                        <div class="relative">
                            <select id="pp-finance-filter-country" onchange="renderFinancialAidTab()" class="w-full text-xs font-semibold text-slate-700 border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-2 pl-2.5 pr-8 appearance-none bg-slate-50 hover:bg-white transition-colors cursor-pointer">
                                <option value="all" ${selectedCountry === 'all' ? 'selected' : ''}>All Locations</option>
                                <option value="Kenya" ${selectedCountry === 'Kenya' ? 'selected' : ''}>Kenya</option>
                                <option value="Uganda" ${selectedCountry === 'Uganda' ? 'selected' : ''}>Uganda</option>
                                <option value="Tanzania" ${selectedCountry === 'Tanzania' ? 'selected' : ''}>Tanzania</option>
                                <option value="Rwanda" ${selectedCountry === 'Rwanda' ? 'selected' : ''}>Rwanda</option>
                                <option value="Burundi" ${selectedCountry === 'Burundi' ? 'selected' : ''}>Burundi</option>
                                <option value="South Sudan" ${selectedCountry === 'South Sudan' ? 'selected' : ''}>South Sudan</option>
                                <option value="DRC" ${selectedCountry === 'DRC' ? 'selected' : ''}>DR Congo</option>
                                <option value="Somalia" ${selectedCountry === 'Somalia' ? 'selected' : ''}>Somalia</option>
                            </select>
                            <i data-lucide="chevron-down" class="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"></i>
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Aid Type</label>
                        <div class="relative">
                            <select id="pp-finance-filter-type" onchange="renderFinancialAidTab()" class="w-full text-xs font-semibold text-slate-700 border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-2 pl-2.5 pr-8 appearance-none bg-slate-50 hover:bg-white transition-colors cursor-pointer">
                                <option value="all" ${selectedType === 'all' ? 'selected' : ''}>All Types</option>
                                <option value="Scholarship" ${selectedType === 'Scholarship' ? 'selected' : ''}>Scholarship</option>
                                <option value="Loan" ${selectedType === 'Loan' ? 'selected' : ''}>Loan</option>
                                <option value="Grant" ${selectedType === 'Grant' ? 'selected' : ''}>Grant</option>
                                <option value="Business Fund" ${selectedType === 'Business Fund' ? 'selected' : ''}>Business Fund</option>
                            </select>
                            <i data-lucide="chevron-down" class="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results -->
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-3 border-b border-slate-200 bg-slate-50">
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-xs font-bold text-slate-600">Showing ${filtered.length} opportunit${filtered.length === 1 ? 'y' : 'ies'}</span>
                        ${chips.length > 0 ? `<button onclick="clearFinancialAidFilters()" class="text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"><i data-lucide="rotate-ccw" class="w-3 h-3"></i> Clear filters</button>` : ''}
                    </div>
                    ${chipsHtml}
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse hidden md:table">
                        <thead>
                            <tr class="text-[10px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <th class="px-3 py-2 font-bold">Name / Provider</th>
                                <th class="px-3 py-2 font-bold">Type</th>
                                <th class="px-3 py-2 font-bold">Location</th>
                                <th class="px-3 py-2 font-bold">Deadline</th>
                                <th class="px-3 py-2 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                    <div class="md:hidden divide-y divide-slate-100">${mobileCards}</div>
                </div>
            </div>
        </div>
    `;

    refreshIcons();
}

window.clearFinancialAidFilters = function() {
    const country = document.getElementById('pp-finance-filter-country');
    const type = document.getElementById('pp-finance-filter-type');
    const search = document.getElementById('fin-search');
    if (country) country.value = 'all';
    if (type) type.value = 'all';
    if (search) search.value = '';
    renderFinancialAidTab();
}

window.saveAidToMyPlan = function(safeId, name) {
    const isSaved = myPlan.courses.has(name);
    if (isSaved) { myPlan.courses.delete(name); } else { myPlan.courses.add(name); }
    if (typeof saveMyPlan === 'function') saveMyPlan();
    if (typeof updatePlanBadge === 'function') updatePlanBadge();
    const nowSaved = myPlan.courses.has(name);
    document.querySelectorAll('[data-aid-id="' + safeId + '"]').forEach(function(btn) {
        btn.innerHTML = '<i data-lucide="' + (nowSaved ? 'bookmark-check' : 'bookmark') + '" class="w-3 h-3"></i>';
        btn.title = nowSaved ? 'Saved to Plan' : 'Save to Plan';
        btn.className = btn.className.replace(/\btext-(?:slate-300|indigo-500)\b/g, '') + (nowSaved ? ' text-indigo-500' : ' text-slate-300 hover:text-indigo-500');
    });
    refreshIcons();
}

window.showResourceLibraryInHub = function() {
    renderResourceLibrary('career-hub-content', 'resetCareerHub()');
}

window.renderResourceLibrary = function(containerId, backCallback) {
    containerId = containerId || 'pp-resources';
    const container = document.getElementById(containerId);
    if (!container) return;

    const sectorLabel = activeSectorId === 'agri' ? 'Agritech' : activeSectorId === 'energy' ? 'Renewable Energy' : 'Digital Economy';

    const universalResources = [
        { cat: 'Job Search', title: 'How to Write an ATS-Friendly CV', desc: 'Optimise your resume to pass automated screening systems used by employers.', icon: 'file-text', link: 'https://www.jobscan.co/blog/ats-resume/' },
        { cat: 'Job Search', title: 'Building Your Personal Brand on LinkedIn', desc: 'Optimise your profile and attract recruiters in your target sector.', icon: 'linkedin', link: 'https://www.linkedin.com/business/marketing/blog/linkedin-ads/how-to-build-your-personal-brand-on-linkedin' },
        { cat: 'Interviews', title: 'Mastering the STAR Method', desc: 'Structure answers to behavioural questions — used in most professional interviews.', icon: 'star', link: 'https://www.thebalancemoney.com/what-is-the-star-interview-response-technique-2061629' },
        { cat: 'Interviews', title: 'Salary Negotiation 101', desc: 'Tips and scripts for discussing compensation confidently.', icon: 'banknote', link: 'https://www.glassdoor.com/blog/guide/how-to-negotiate-your-salary/' },
        { cat: 'Networking', title: 'Networking for Introverts', desc: 'Build professional connections authentically without the awkwardness.', icon: 'users', link: 'https://hbr.org/2011/02/a-networking-guide-for-introverts' },
        { cat: 'Networking', title: 'A Guide to Informational Interviews', desc: 'Learn from professionals in your target field before applying for roles.', icon: 'message-square', link: 'https://career.berkeley.edu/start-exploring/informational-interviews/' }
    ];

    const sectorGuides = {
        agri: [
            { cat: 'Sector Guides', title: 'FAO Digital Agriculture Careers', desc: 'Explore roles in precision farming, food tech and agri-data across the region.', icon: 'leaf', link: 'https://www.fao.org/digital-agriculture/en/' },
            { cat: 'Sector Guides', title: 'TVET Pathways into Agritech', desc: 'How vocational qualifications support agriculture careers across the EAC region.', icon: 'graduation-cap', link: 'https://unevoc.unesco.org/home/UNEVOC+Network' }
        ],
        energy: [
            { cat: 'Sector Guides', title: 'IRENA: Jobs in Renewable Energy', desc: 'The growing range of roles in solar, wind and off-grid energy and the skills they require.', icon: 'zap', link: 'https://www.irena.org/Energy-Transition/Socio-economic-impact/Jobs' },
            { cat: 'Sector Guides', title: 'Solar Technician Career Path', desc: 'Skills, certifications and entry routes for solar PV installation and maintenance roles.', icon: 'sun', link: 'https://unevoc.unesco.org/home/UNEVOC+Network' }
        ],
        digital: [
            { cat: 'Sector Guides', title: 'GSMA Digital Skills Resources', desc: 'Reports and guidance on digital skills gaps and job opportunities across Africa.', icon: 'wifi', link: 'https://www.gsma.com/mobilefordevelopment/digital-skills/' },
            { cat: 'Sector Guides', title: 'Build a Developer Portfolio', desc: 'What to include, how to host it, and how to pitch it to employers in the tech sector.', icon: 'code-2', link: 'https://docs.github.com/en/get-started/start-your-journey/uploading-a-project-to-github' }
        ]
    };

    const allResources = [...universalResources, ...(sectorGuides[activeSectorId] || [])];
    const cats = [...new Set(allResources.map(r => r.cat))];

    const categorisedHtml = cats.map(cat => {
        const items = allResources.filter(r => r.cat === cat);
        const itemsHtml = items.map(r => `
            <a href="${r.link}" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-slate-300 bg-white group transition-all">
                <div class="p-2 bg-slate-100 text-slate-600 rounded shrink-0"><i data-lucide="${r.icon}" class="w-4 h-4"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="font-bold text-sm text-slate-800 group-hover:text-slate-900">${r.title}</div>
                    <div class="text-xs text-slate-500 leading-snug">${r.desc}</div>
                </div>
                <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-slate-500 shrink-0"></i>
            </a>`).join('');
        return '<div class="mb-4">' +
            '<h4 class="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><span class="inline-block w-1.5 h-1.5 rounded-full bg-slate-400"></span> ' + cat + '</h4>' +
            '<div class="space-y-2">' + itemsHtml + '</div>' +
            '</div>';
    }).join('');

    const backBtn = backCallback
        ? `<button onclick="${backCallback}" class="mb-4 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold flex items-center gap-2 shadow-sm w-fit"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Hub</button>`
        : '';

    container.innerHTML = backBtn + `
        <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start gap-3 mb-4">
            <div class="p-2 bg-slate-200 text-slate-600 rounded-lg shrink-0"><i data-lucide="library" class="w-5 h-5"></i></div>
            <div>
                <h3 class="font-bold text-slate-900 text-sm">Resource Library</h3>
                <p class="text-xs text-slate-600 mt-0.5">Career guides for <strong>${sectorLabel}</strong> &mdash; job search, interviews, networking and sector pathways.</p>
            </div>
        </div>
        <div>${categorisedHtml}</div>
        <div class="mt-2 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
            <button onclick="openUnifiedHub('pp-diagnostic')" class="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2"><i data-lucide="clipboard-check" class="w-3.5 h-3.5"></i> Check Your Skills Readiness</button>
            <button onclick="openUnifiedHub('pp-courses')" class="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"><i data-lucide="search" class="w-3.5 h-3.5"></i> Find Courses</button>
        </div>
    `;
    refreshIcons();
}

window.showResourceLibraryModal = function() {
    // Check if Unified Hub is open to allow stacking
    const hub = document.getElementById('unified-hub-modal');
    const isHubOpen = hub && !hub.classList.contains('translate-x-full');

    if (isHubOpen) {
        ['occupation-modal', 'venture-modal', 'skill-modal', 'certificate-modal'].forEach(id => closeModal(id));
    } else {
        closeAllModals('resource-modal');
    }

    const modal = document.getElementById('resource-modal');
    const panel = document.getElementById('resource-modal-panel');
    document.getElementById('resource-modal-title').innerText = "Career Guides";
    
    const resources = [
        { title: "How to Write an ATS-Friendly CV", desc: "Optimize your resume to pass through automated screening systems.", icon: "file-text", link: "https://www.jobscan.co/blog/ats-resume/" },
        { title: "Mastering the STAR Method for Interviews", desc: "Structure your answers to behavioral questions effectively.", icon: "star", link: "https://www.thebalancemoney.com/what-is-the-star-interview-response-technique-2061629" },
        { title: "Networking for Introverts", desc: "Strategies to build professional connections authentically.", icon: "users", link: "https://hbr.org/2011/02/a-networking-guide-for-introverts" },
        { title: "Salary Negotiation 101", desc: "Tips and scripts for discussing compensation.", icon: "banknote", link: "https://www.glassdoor.com/blog/guide/how-to-negotiate-your-salary/" },
        { title: "Building Your Personal Brand on LinkedIn", desc: "Optimize your profile to attract recruiters.", icon: "linkedin", link: "https://www.linkedin.com/business/marketing/blog/linkedin-ads/how-to-build-your-personal-brand-on-linkedin" },
        { title: "A Guide to Informational Interviews", desc: "Learn from professionals in your target field.", icon: "message-square", link: "https://career.berkeley.edu/start-exploring/informational-interviews/" }
    ];

    const resourcesHtml = resources.map(r => `
        <a href="${r.link}" target="_blank" class="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-slate-300 bg-white group transition-all">
            <div class="p-2 bg-slate-100 text-slate-600 rounded"><i data-lucide="${r.icon}" class="w-4 h-4"></i></div>
            <div>
                <div class="font-bold text-sm text-slate-800 group-hover:text-slate-900">${r.title}</div>
                <div class="text-xs text-slate-500">${r.desc}</div>
            </div>
            <i data-lucide="external-link" class="w-3 h-3 text-slate-300 group-hover:text-slate-500 ml-auto"></i>
        </a>
    `).join('');

    document.getElementById('resource-modal-content').innerHTML = `<div class="space-y-3">${resourcesHtml}</div>`;
    
    document.body.classList.add('overflow-hidden');
    modal.classList.remove('hidden');
    setTimeout(() => { panel.classList.remove('scale-95', 'opacity-0'); panel.classList.add('scale-100', 'opacity-100'); }, 10);
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
        const matchMode = modeFilter === 'all' || (c.mode && c.mode.toLowerCase() === modeFilter.toLowerCase()) || (modeFilter.toLowerCase() === 'hybrid' && (c.mode === 'Blended' || c.mode === 'Hybrid'));
        
        let matchType = true;
        if (typeFilter !== 'all') {
            const t = (c.type || '').toLowerCase();
            if (typeFilter === 'certificate') matchType = t.includes('certificate');
            else if (typeFilter === 'micro-credential') matchType = t.includes('micro');
            else if (typeFilter === 'tvet') matchType = t.includes('tvet') || t.includes('diploma');
            else if (typeFilter === 'university') matchType = t.includes('degree') || t.includes('bachelor') || t.includes('master');
            else if (typeFilter === 'bootcamp') matchType = t.includes('bootcamp');
            else if (typeFilter === 'hubs') matchType = t.includes('incubator') || t.includes('hub') || t.includes('lab') || (c.provider && (c.provider.toLowerCase().includes('hub') || c.provider.toLowerCase().includes('lab')));
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

window.toggleStudentpreneurMode = function() {
    isStudentpreneur = !isStudentpreneur;
    openSkillsView('pp-launchpad', false, false);
}

// --- Render Launchpad Resources (Grouped List) ---
window.setLaunchpadFilter = function(filter) {
    document.querySelectorAll('.launchpad-filter-btn').forEach(btn => {
        const active = btn.dataset.filter === filter;
        btn.className = active
            ? 'launchpad-filter-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white border border-indigo-700 transition-colors'
            : 'launchpad-filter-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors';
    });
    renderLaunchpadResources(filter);
}

window.renderLaunchpadResources = function(filter) {
    filter = filter || 'all';
    const container = document.getElementById('launchpad-resources-list');
    if(!container) return;

    const PREVIEW = 4;
    const sector = activeSectorId;
    const sectorData = getSectorCareerResources(sector);
    const data = sectorData.entrepreneurship || {};
    const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[sector] : { color: 'indigo' };
    const tc = themeConfig.color;
    const communities = sectorData.communities || [];

    const buildItem = (item, type, deadline) => ({
        ...item,
        type: item.type || type,
        deadline: item.deadline || deadline || 'Rolling'
    });

    let funding = [
        ...(data.incubators || []).map(i => buildItem(i, 'Incubator', 'Rolling')),
        ...(data.funding   || []).map(i => buildItem(i, 'Grant/Fund', 'Rolling')),
        ...(data.tools     || []).map(i => buildItem(i, 'Gov/Tool',   'Rolling')),
    ];
    let events = [
        ...(data.competitions || []).map(i => buildItem(i, 'Competition', 'Rolling')),
        ...communities.filter(c => c.type === 'Event').map(i => buildItem(i, 'Event', 'Open')),
    ];
    let networks = communities.filter(c => c.type !== 'Event').map(i => buildItem(i, i.type || 'Community', 'Open'));

    if (isStudentpreneur) {
        const kw = ['student', 'youth', 'campus', 'university', 'young', 'sprint up', 'dot', 'ceda', 'elisa', 'scenius', 'jhub', 'yaden', 'commonwealth alliance'];
        const match = o => kw.some(k => (o.name + ' ' + o.desc + ' ' + o.type).toLowerCase().includes(k));
        funding = funding.filter(match);
        events  = events.filter(match);
        networks = networks.filter(match);
    }

    const renderCard = op => {
        const reminderText = encodeURIComponent(`Reminder: Apply for ${op.name} by ${op.deadline}. Link: ${op.link}`);
        const waLink = `https://wa.me/?text=${reminderText}`;
        return `
        <div class="p-3 bg-white border border-slate-200 rounded-lg hover:border-${tc}-300 transition-all group shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div class="flex-1">
                <div class="font-bold text-sm text-slate-800 group-hover:text-${tc}-700 mb-0.5">
                    ${op.name}
                </div>
                <div class="text-xs text-slate-500 leading-tight mb-1">${op.desc}</div>
                <span class="flex items-center gap-1 text-[10px] font-medium text-slate-400"><i data-lucide="calendar" class="w-3 h-3"></i> Deadline: ${op.deadline}</span>
            </div>
            <div class="flex gap-2 shrink-0">
                <a href="${waLink}" target="_blank" class="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition-colors" title="Set WhatsApp Reminder"><i data-lucide="bell" class="w-4 h-4"></i></a>
                <a href="${op.link}" target="_blank" class="px-3 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg text-xs hover:bg-slate-50 hover:text-${tc}-600 transition-colors flex items-center gap-1">Visit <i data-lucide="external-link" class="w-3 h-3"></i></a>
            </div>
        </div>`;
    };

    const renderGroup = (icon, label, color, items, key) => {
        if (items.length === 0) return '';
        const visible = items.slice(0, PREVIEW);
        const remaining = items.length - PREVIEW;
        const seeAllBtn = remaining > 0
            ? `<button onclick="setLaunchpadFilter('${key}')" class="w-full mt-2 py-2 text-xs font-bold text-${color}-600 hover:text-${color}-800 bg-${color}-50 hover:bg-${color}-100 border border-${color}-100 rounded-lg transition-colors flex items-center justify-center gap-1">
                   See all ${items.length} <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
               </button>`
            : '';
        return `
        <div class="space-y-2">
            <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div class="p-1.5 bg-${color}-50 text-${color}-600 rounded-lg"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i></div>
                <span class="text-xs font-bold text-slate-700 uppercase tracking-wide flex-1">${label}</span>
                <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">${items.length}</span>
            </div>
            <div class="space-y-2">${visible.map(renderCard).join('')}</div>
            ${seeAllBtn}
        </div>`;
    };

    let html = '';
    const emptyMsg = `<div class="text-center py-8 text-slate-400 text-xs italic">${isStudentpreneur ? 'No studentpreneur resources found. Try turning off Studentpreneur Mode.' : 'No resources found for this sector.'}</div>`;

    if (filter === 'funding') {
        html = funding.length ? `<div class="space-y-2">${funding.map(renderCard).join('')}</div>` : emptyMsg;
    } else if (filter === 'events') {
        html = events.length ? `<div class="space-y-2">${events.map(renderCard).join('')}</div>` : emptyMsg;
    } else if (filter === 'networks') {
        html = networks.length ? `<div class="space-y-2">${networks.map(renderCard).join('')}</div>` : emptyMsg;
    } else {
        const grouped = [
            renderGroup('banknote', 'Funding &amp; Incubators', 'blue',   funding,  'funding'),
            renderGroup('trophy',   'Competitions &amp; Events', 'sky',    events,   'events'),
            renderGroup('users',    'Mentors &amp; Networks',    'indigo', networks, 'networks'),
        ].filter(Boolean).join('');
        html = grouped || emptyMsg;
    }

    container.innerHTML = `<div class="space-y-${filter === 'all' ? '6' : '2'}">${html}</div>`;
    refreshIcons();
}

// --- NEW: Render Launchpad Tab (Unified Hub) ---
window.renderLaunchpadTab = function() {
    const container = document.getElementById('pp-launchpad');
    if(!container) return;
    
    const sector = activeSectorId;
    const sectorData = getSectorCareerResources(sector);
    const data = sectorData.entrepreneurship || {};
    const themeConfig = (typeof sectorThemes !== 'undefined') ? sectorThemes[sector] : { color: 'indigo' };
    const tc = themeConfig.color;
    const title = sector === 'agri' ? 'Agritech' : sector === 'energy' ? 'Renewable Energy' : 'Digital Economy';

    // --- 1. Venture Playbook Data (Contextualized) ---
    const playbookData = {
        agri: {
            default: {
                reg: "National Seed/Chemical Agency, Local Business Permit",
                economics: "Yield/Acre vs Input Cost",
                pricing: "Commission on Produce (5-10%) or Input Margin",
                gtm: "Farmer Co-ops, Aggregators, USSD/SMS Blasts"
            },
            Kenya: { reg: "KEPHIS (Seeds), PCPB (Chemicals), County Business Permit" },
            Rwanda: { reg: "RICA (Inspection), RDB Business Registration" },
            Uganda: { reg: "MAAIF Certification, UNBS Standards" },
            Tanzania: { reg: "TOSCI (Seeds), TPRI (Pesticides), BRELA" },
            Burundi: { reg: "ISABU (Seeds), Minagrie Authorization" },
            'South Sudan': { reg: "Min. of Agriculture & Food Security Registration" },
            DRC: { reg: "ONAPAC (Export Crops), IPAPEL Inspection" },
            Somalia: { reg: "MoAI Certification, Local Municipality Permit" }
        },
        energy: {
            default: {
                reg: "Energy Regulator License, Standard Business Permit",
                economics: "Hardware Payback Period (PAYG)",
                pricing: "Deposit (15%) + Daily Rate",
                gtm: "Door-to-door Agents, SACCO Partnerships"
            },
            Kenya: { reg: "EPRA Solar License (T1/T2), NCA (Construction)" },
            Rwanda: { reg: "RURA License, RDB Registration" },
            Uganda: { reg: "ERA Installation Permit, UNBS" },
            Tanzania: { reg: "EWURA License, BRELA" },
            Burundi: { reg: "AREEN (Regulator), REGIDESO Grid Code" },
            'South Sudan': { reg: "Min. of Energy & Dams, SSEC Guidelines" },
            DRC: { reg: "ARE (Regulation), ANSER (Off-grid Agency)" },
            Somalia: { reg: "Min. of Energy & Water Resources, ESP Compliance" }
        },
        digital: {
            default: {
                reg: "Data Protection Authority, Copyright/IP Office",
                economics: "CAC < LTV (3:1 Ratio)",
                pricing: "Freemium, Tiered Subscription (SaaS)",
                gtm: "SEO/Content, LinkedIn B2B, App Stores"
            },
            Kenya: { reg: "ODPC (Data Protection), ICT Authority" },
            Rwanda: { reg: "RISA, Data Protection Office (NCSA)" },
            Uganda: { reg: "NITA-U, PDPO (Data Privacy)" },
            Tanzania: { reg: "TCRA, e-Government Authority" },
            Burundi: { reg: "ARCT (Regulation), SETIC" },
            'South Sudan': { reg: "NCA (National Communication Authority)" },
            DRC: { reg: "ARPTC (Regulation), ADN (Digital Agency)" },
            Somalia: { reg: "NCA (Communications), Min. of Comm. & Tech" }
        }
    };

    const sectorPlaybook = playbookData[sector] || playbookData.digital;
    const basePb = sectorPlaybook.default;
    const countryPb = sectorPlaybook[activeCountry] || {};
    const pb = { ...basePb, ...countryPb };

    const studentToggleClass = isStudentpreneur ? "bg-indigo-600 justify-end" : "bg-slate-300 justify-start";

    container.innerHTML = `
        <div class="animate-fade-in space-y-8">
            <!-- Header -->
            <div class="bg-${tc}-50 rounded-xl p-4 sm:p-6 border border-${tc}-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <div class="flex flex-wrap items-center gap-2 mb-2">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white text-${tc}-700 border border-${tc}-200 shadow-sm">${title} Sector</span>
                        <div class="flex items-center gap-2 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm ml-2">
                            <span class="text-[10px] font-bold text-slate-600">Studentpreneur Mode</span>
                            <button onclick="toggleStudentpreneurMode()" class="w-8 h-4 rounded-full p-0.5 flex items-center transition-colors ${studentToggleClass}">
                                <div class="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                            </button>
                        </div>
                        ${activeCountry !== 'all' ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white text-slate-600 border border-slate-200 shadow-sm"><i data-lucide="map-pin" class="w-3 h-3 inline mr-1"></i> ${activeCountry}</span>` : ''}
                    </div>
                    <p class="text-sm text-${tc}-800 mt-1 max-w-xl">From idea to investment: Your sector-specific venture building toolkit.</p>
                </div>
            </div>

            <!-- 0. Foundation Skills -->
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2"><i data-lucide="cpu" class="w-4 h-4 text-${tc}-600"></i> Foundation Skills for Self-Employment</h4>
                    <p class="text-xs text-slate-500 mt-0.5">Core skills every entrepreneur and self-employed worker needs before launching.</p>
                </div>
                <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    ${[
                        { name: 'Financial Literacy & Bookkeeping', desc: 'Track income, manage cash flow and understand basic financial statements.', icon: 'calculator' },
                        { name: 'Sales & Customer Service', desc: 'Attract and retain clients through effective communication and relationship management.', icon: 'handshake' },
                        { name: 'Digital Marketing & Social Media', desc: 'Promote your work online and reach customers through low-cost digital channels.', icon: 'megaphone' },
                        { name: 'Business Planning & Formalisation', desc: 'Write a simple business plan, register your business and access formal finance.', icon: 'file-text' },
                        { name: 'Mobile & Digital Tools', desc: 'Use smartphones, mobile money and basic productivity apps to run your business efficiently.', icon: 'smartphone' },
                    ].map(s => `
                    <div class="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div class="p-1.5 bg-slate-200 text-slate-600 rounded-md shrink-0"><i data-lucide="${s.icon}" class="w-3.5 h-3.5"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-xs font-bold text-slate-800 mb-0.5">${s.name}</div>
                            <div class="text-[11px] text-slate-600 leading-snug">${s.desc}</div>
                        </div>
                    </div>`).join('')}
                </div>
                <div class="px-4 pb-4">
                    <button onclick="openSkillsView('pp-courses')" class="w-full py-2.5 bg-${tc}-600 hover:bg-${tc}-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <i data-lucide="search" class="w-3.5 h-3.5"></i> Find Courses for These Skills
                    </button>
                </div>
            </div>

            <!-- 1. Venture Playbook (First 30 Days) -->
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                    <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2"><i data-lucide="clipboard-list" class="w-4 h-4 text-${tc}-600"></i> "First 30 Days" Game Plan</h4>
                    <span class="text-[10px] text-slate-500 font-medium">Sector-Specific Checklist</span>
                </div>
                <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="p-3 bg-${tc}-50/30 rounded-lg border border-${tc}-100">
                        <div class="text-[10px] font-bold text-${tc}-700 uppercase mb-1">Rules & Permits</div>
                        <div class="text-xs text-slate-700 font-medium">${pb.reg}</div>
                    </div>
                    <div class="p-3 bg-${tc}-50/30 rounded-lg border border-${tc}-100">
                        <div class="text-[10px] font-bold text-${tc}-700 uppercase mb-1">Profit Basics</div>
                        <div class="text-xs text-slate-700 font-medium">${pb.economics}</div>
                    </div>
                    <div class="p-3 bg-${tc}-50/30 rounded-lg border border-${tc}-100">
                        <div class="text-[10px] font-bold text-${tc}-700 uppercase mb-1">Setting Prices</div>
                        <div class="text-xs text-slate-700 font-medium">${pb.pricing}</div>
                    </div>
                    <div class="p-3 bg-${tc}-50/30 rounded-lg border border-${tc}-100">
                        <div class="text-[10px] font-bold text-${tc}-700 uppercase mb-1">Finding Customers</div>
                        <div class="text-xs text-slate-700 font-medium">${pb.gtm}</div>
                    </div>
                </div>
            </div>

            <!-- 2. Resource Directory -->
            <div>
                <div class="mb-3">
                    <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                        <i data-lucide="compass" class="w-4 h-4 text-slate-400"></i> Directory of Start-Up Resources
                    </h4>
                </div>
                <!-- Filter tabs -->
                <div class="flex flex-wrap gap-2 mb-4" id="launchpad-filter-tabs">
                    <button onclick="setLaunchpadFilter('all')" data-filter="all" class="launchpad-filter-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white border border-indigo-700 transition-colors">All</button>
                    <button onclick="setLaunchpadFilter('funding')" data-filter="funding" class="launchpad-filter-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors">Funding &amp; Incubators</button>
                    <button onclick="setLaunchpadFilter('events')" data-filter="events" class="launchpad-filter-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors">Competitions &amp; Events</button>
                    <button onclick="setLaunchpadFilter('networks')" data-filter="networks" class="launchpad-filter-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors">Mentors &amp; Networks</button>
                </div>
                <div id="launchpad-resources-list" class="space-y-3">
                    <!-- Injected via renderLaunchpadResources -->
                </div>
            </div>

            <!-- Tools Section -->
            <div>
                <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Must-Have Tools</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="https://www.canva.com/" target="_blank" class="p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all group bg-white">
                        <div class="font-bold text-xs text-slate-700 group-hover:text-indigo-700 mb-1">Canva</div>
                        <div class="text-[10px] text-slate-500">Pitch Decks & Design</div>
                    </a>
                    <a href="https://www.ycombinator.com/library" target="_blank" class="p-3 border border-slate-200 rounded-lg hover:border-amber-300 hover:shadow-sm transition-all group bg-white">
                        <div class="font-bold text-xs text-slate-700 group-hover:text-amber-700 mb-1">YC Library</div>
                        <div class="text-[10px] text-slate-500">Startup Advice</div>
                    </a>
                    <a href="https://stripe.com/atlas" target="_blank" class="p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all group bg-white">
                        <div class="font-bold text-xs text-slate-700 group-hover:text-blue-700 mb-1">Stripe Atlas</div>
                        <div class="text-[10px] text-slate-500">Incorporation</div>
                    </a>
                    <a href="https://www.notion.so/" target="_blank" class="p-3 border border-slate-200 rounded-lg hover:border-slate-400 hover:shadow-sm transition-all group bg-white">
                        <div class="font-bold text-xs text-slate-700 group-hover:text-slate-900 mb-1">Notion</div>
                        <div class="text-[10px] text-slate-500">Workspace & Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Initial render of resources
    renderLaunchpadResources('all');
    // Ensure filter tabs reflect default active state
    const allBtn = document.querySelector('.launchpad-filter-btn[data-filter="all"]');
    if (allBtn) allBtn.className = 'launchpad-filter-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white border border-indigo-700 transition-colors';
    
    refreshIcons();
}

// --- NEW: Impact Charts Initialization ---
window.initImpactCharts = function() {
    if (impactChartsInitialized) return;
    if (typeof Chart === 'undefined') return;
    if (document.body.classList.contains('low-bandwidth')) return;
    
    // 1. Salary Chart
    const ctxSalary = document.getElementById('drawer-salaryChart');
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
    const ctxTime = document.getElementById('drawer-timeChart');
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

