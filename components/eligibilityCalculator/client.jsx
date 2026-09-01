'use client';

import { useEffect, useRef, useState } from 'react';

export default function ToolClient() {
    const [assetsLoaded, setAssetsLoaded] = useState(false);
    const containerRef = useRef(null);

    // Hardcoded config dictionary intact in case the injected legacy JS reads it from context/props
    const content = {
        "hero": {
            "titleLine1": "ERC Eligibility Calculator",
            "titleLine2": "",
            "description": "This calculator is designed to help researchers estimate their ERC grant eligibility based on their PhD defense date and eligible career breaks."
        },
        "placeholders": {
            "topBlocks": [
                { "type": "paragraph", "text": "Welcome to Enspire Science's ERC eligibility window calculator." },
                { "type": "paragraph", "text": "**This calculator applies the expected eligibility rules and submission restrictions for ERC 2027 which have been published by the ERC, but have not yet been officially adopted.** Please take caution with any conclusion until the ERC 2027 is officially published." },
                { "type": "paragraph", "text": "This eligibility calculator was developed to assist researchers, research managers and funding advisors to determine:" },
                { "type": "list", "items": ["Which ERC frontier grants the PI would be eligible to apply to.", "The implications of possible eligibility extensions that the researcher may request.", "The implications of the results of previously submitted ERC applications.", "The implications of the outcomes of previously submitted ERC applications (both successful and not)", "A 5-year outlook for the PI, based on current data and ERC guidelines."] },
                { "type": "paragraph", "text": "In order to use the calculator, simply complete the requested data fields below. Based on your input, the calculator will generate the various ERC submission options for the upcoming 5 years." }
            ],
            "bottomBlocks": [
                { "type": "paragraph", "text": "__Disclaimers__" },
                { "type": "numbered", "items": ["This calculator is available for use for free.", "Enspire Science Ltd. is not liable for any decision or other act made based on any use of this calculator.", "This calculator is not an official calculator by the ERC and should not be regarded as such.", "The official references are the published ERC work programme and the ERC Information for Applicants.", "This calculator was developed and is owned by Enspire Science Ltd. As such – it is protected by copyright laws."] }
            ]
        },
        "welcome": { "phdDefenseDateLabel": "PhD Defense Date", "firstDegreeMdLabel": "Is MD your first eligible degree?" },
        "extensions": {
            "cards": {
                "maternity": { "label": "Maternity", "sub": "18 months per child born before or after the PhD award date", "hint": "Maternity: Please indicate the number of children. For leave durations longer than the 18 months, please see \"Additional Maternity Days\" field. This extension can be requested whether taken before or after the PhD defence.", "unit": "Children" },
                "additionalMaternity": { "label": "Additional Maternity Days", "sub": "Extra days added on top of the automatic 18 months per child born before or after the PhD award date", "hint": "Maternity: Please indicate the number of leave days *on top* of the ERC's 18-months flat rate for maternity leave. This extension can be requested wether taken before or after the PhD defence.", "unit": "Days" },
                "paternity": { "label": "Paternity (or parental)", "sub": "Paternity: documented amount of paternity (or parental) leave taken for each child taken before or after PhD", "hint": "Please indicate the documented amount of leave taken (in days) for each child born, whether before or after the PhD defence date.", "unit": "Days" },
                "illness": { "label": "Long-term Illness", "sub": "Long term illness: documented amount of leave taken after the PhD due to long term illness (over 90 days) of the PI or close relative ", "hint": "Long-term illness (of the PI or a family member): please indicate the documented amount of leave (in days) taken by the PI for each incident occurred after the PhD defence. Minimum of 90 days", "unit": "Days" },
                "majorDisaster": { "label": "Major Disaster", "sub": "Major disaster: documented time of a PI's inability to work for over 90 days due to major disasters occurring after PhD", "hint": "Major disaster: please indicate the documented amount of leave (in days) taken by the PI for each incident occurred after the PhD defence. Minimum of 90 days", "unit": "Days" },
                "clinical": { "label": "Clinical Training", "sub": "Clinical training: documented duration of clinical training (up to four years) after first eligible degree", "hint": "Clinical training:  Eligible career break due to clinical training of the PI. This includes a documented clinical training after the defence of the first eligible degree, and up to 4 years maximum.", "unit": "Days" },
                "otherReasons": { "label": "Other Eligible Reasons", "sub": "Other eligible extensions: Disability, National service, Seeking Asylum or Violence occurring after the PhD", "hint": "Please indicate total number of days due to (after PhD defence):\n\n- Disability:  reduced amount of working time (including leave taken).\n\n- Seeking Asylum: due to the Principal Investigator's inability to work due to seeking asylum.\n\n- Gender-based Violence or Any Other Form of Violence: documented duration of the Principal Investigator's inability to work due to being a victim of violence.\n\n- National service: documented amount of leave taken by the Principal Investigator for each occurrence.", "unit": "Days" }
            },
            "ongoingGrant": { "title": "Ongoing ERC Grant?", "description": "Do you currently hold an ERC grant?", "dateLabel": "Grant end date" },
            "pastApplications": {
                "sectionTitle": "Mark if relevant", "wonToggleTitle": "Awarded an ERC-StG/CoG/Plus in the past?", "wonToggleSubtitle": "Applicants may be awarded an StG, CoG, and Plus only once", "wonToggleLockedWarning": "This award cannot be unchecked while a recent application in the same category is marked as win.", "toggleTitle": "Applied to ERC in the past 4 years?", "toggleSubtitle": "Mark for most recent application only", "resultLabel": "Result", "yearLabel": "Year", "ongoingLabel": "Is it ongoing", "projectEndDateLabel": "Project end date", "selectResult": "Select result", "selectYear": "Select year", "infoSuffix": "information",
                "resultOptions": { "pendingResults": "Pending results", "win": "Win", "interview": "Interview invitation", "b": "B in step 1", "c": "C in step 1", "notRetainedStep2": "Was not retained for Step 2", "bStep2": "B in Step 2", "funded": "Funded" }
            }
        },
        "singleView": { "description": "Enter the PhD date, career breaks, and past applications.", "startOver": "Start Over", "calculatorVersionLabel": "Calculator Version", "calculatorVersionDescription": "The default \"Expected\" version considers the most [up to date](https://erc.europa.eu/news-events/news/erc-scientific-council-readjusts-rules-reapplication) rules on eligibility published by the ERC. The alternative reflects results according to [previously published](https://erc.europa.eu/news-events/news/applying-erc-grant-2027-competitions-what-you-need-know) guidelines which have since been readjusted.", "calculatorVersionStrictLabel": "What if the ERC didn't back down", "calculatorVersionDefaultLabel": "Expected 2027 eligibility", "phdDateTitle": "Reference Date (PhD or equivalent)", "phdDateDescription": "Typically the date of successful defense. For MD, enter the certified date of completion", "phdEffectiveDateLabel": "PhD Effective Date", "notAvailable": "Not available", "extensionDaysLabel": "Total Extension Days", "modificationsTitle": "Eligibility extension", "ongoingGrantDescription": "Project must end in less than 2 years from a given ERC deadline to be eligible" },
        "roadmap": { "title": "Eligibility Roadmap", "compactDescription": "Hover over symbol for more information", "notice": "This tool is designed for the expected 2027 work programme eligibility criteria. For the 2026 eligibility criteria, please use the [previous one](https://enspire.science/erc-eligibility-calculator-pre-2027).", "grantColumnFull": "Grant Category", "yearLabel": "Year", "verifyDocsTooltip": "Eligible, but the moved eligibility window is within 5 days of the cutoff. Double check the supporting documents.", "deadlineSoonTooltip": "Eligible, but the deadline is within 4 weeks. Prepare the application urgently.", "deadlineVerySoonTooltip": "Eligible, but the deadline is within 1 week. Immediate action is required.", "hoverNote": "Hover over the status marks for further explanation." },
        "legend": { "title": "Legend", "eligible": "Eligible", "eligibleVerifyDocs": "Eligible, verify docs", "deadlinePassed": "Deadline passed", "blockedOrAlreadyWon": "Blocked or already won", "notEligibleByTimingOrRule": "Not eligible by timing/rule", "notEligibleByFiveDays": "Not eligible by 5 days or less", "markers": "Markers", "markerDescriptions": { "h": "past-application block", "s": "same-year submission", "n": "next-year carryover block", "g": "ongoing grant block", "w": "already won", "asterisk": "close-call warning", "d": "eligible, deadline within 4 weeks", "r": "eligible, deadline within 1 week" } },
        "documents": {
            "title": "Eligibility documents checklist", "compactDescription": "Extension request supporting documents checklist", "fullDescription": "Documentation to prepare based on the extensions and history you entered.", "note": "The list of required supporting documentation is derived from the typical \"Information for Applicants\" published by the ERC", "none": "No extension-specific documents are currently required from the values entered.",
            "items": {
                "phdDiploma": { "label": "PhD diploma", "text": "PhD certificate stating the date of the successful defence. If not stated, add an official confirmation stating the date " },
                "maternity": { "label": "Maternity", "text": "Any official document that links the mother and the child(ren), i.e. birth certificate(s) or passport(s) of the child(ren) or family book." },
                "additionalMaternity": { "label": "Additional maternity days", "text": "An official signed document from the employer certifying start and end dates of the individual leave(s)" },
                "paternity": { "label": "Paternity", "text": "An official signed document from the employer certifying start and end dates of the individual leave(s)." },
                "illness": { "label": "Long-term illness", "text": ["__Required documents:__", ">(1) A signed document from the employer or a medical record certifying start and end dates of the illness period and impact on work capacity.", ">(2) An official document explaining the long-term nature of the illness or condition.", "__For taking care of close family members:__", ">(3) A document proving the family relationship."] },
                "majorDisaster": { "label": "Major disaster", "text": "Official documentation confirming the disaster event and institutional confirmation covering the qualifying leave period." },
                "clinical": { "label": "Clinical training", "text": "An official signed document from the employer certifying start and end dates of the individual leave(s). The document should mention the type of training" },
                "nationalService": { "label": "National service", "text": "Official service records showing the start and end dates." },
                "harassmentCrisis": { "label": "Other eligible reasons", "text": ["Documents required per case", "__Disability__", "(1) An official document confirming the disability.", "(2) Documentation certifying leave/part-time working/reduced working capacity with relevant start and end dates (if applicable).", "__Seaking Asylum__", "A document from the competent authorities confirming the Principal Investigator’s inability to work due to seeking asylum.", "__Gender-based Violence or any other form of violence__", "A document from a competent authority (e.g. hospital, Police, employer) confirming the Principal Investigator’s inability to work due to any form of violence", "__Military/national service__", "A document signed by official authority with start and end date of the service."] },
                "pastApplications": { "label": "Past ERC applications", "text": "Keep the call-year record and evaluation outcome for each prior application." },
                "eligibilityWindowCheck": { "label": "Eligibility window check", "text": "{grants} falls within 5 days of the moved eligibility window cutoff. Double check the supporting leave documentation and the official ERC determining date before submission." }
            }
        }
    };

    useEffect(() => {
        window.__ERC_CALCULATOR_DATA__ = content;

        const existingScript = document.querySelector(
            'script[src="/assets/index-CRWUuUuk.js"]'
        );

        if (existingScript) {
            // Already loaded (or loading) from a previous mount — don't re-inject.
            if (existingScript.dataset.loaded === 'true') {
                setAssetsLoaded(true);
            } else {
                existingScript.addEventListener('load', () => setAssetsLoaded(true), { once: true });
            }
        } else {
            const css1 = document.createElement('link');
            css1.rel = 'stylesheet';
            css1.className = 'erc-calc-asset';
            css1.href = '/assets/index-Cy-Bla21-BK.css';

            const css2 = document.createElement('link');
            css2.rel = 'stylesheet';
            css2.className = 'erc-calc-asset';
            css2.href = '/assets/index-Cy-Bla21.css';

            const script = document.createElement('script');
            script.className = 'erc-calc-asset';
            script.src = '/assets/index-CRWUuUuk.js';
            script.async = true;
            script.onload = () => {
                script.dataset.loaded = 'true';
                setAssetsLoaded(true);
            };

            document.head.appendChild(css1);
            document.head.appendChild(css2);
            document.body.appendChild(script);
        }

        // No cleanup that removes the script — it's a global singleton bundle,
        // not something safe to tear down and reload.
        return () => {
            delete window.__ERC_CALCULATOR_DATA__;
        };
    }, []);

    return (
        <div>
            {/* The legacy script targets this specific HTML block element */}
            {/* <link rel="stylesheet" href="/assets/index-Cy-Bla21-BK.css" />
            <link rel="stylesheet" href="/assets/index-Cy-Bla21.css" />
            <Script src="/assets/index-CRWUuUuk.js" strategy="afterInteractive"></Script> */}
            {!assetsLoaded && <p>Loading calculator…</p>}
            <div ref={containerRef} id="root" />
        </div >
    );
}