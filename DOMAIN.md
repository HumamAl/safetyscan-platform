# Domain Knowledge Brief — NFC-Enabled Physical Asset Safety Inspection & Compliance SaaS

## Sub-Domain Classification

**Multi-site EHS (Environment, Health & Safety) SaaS platform for physical asset inspection, compliance tracking, and audit management — targeting mid-market industrial, manufacturing, and facilities-heavy organizations (50–5,000 employees, 2–50 physical sites).**

This is not generic EHS software. The NFC-scan-to-inspect workflow is the distinguishing mechanism: physical assets carry NFC tags, inspectors tap to trigger the correct inspection form, and the platform creates an immutable audit trail tied to that exact asset-location-timestamp combination. The platform's stack (Keycloak OIDC, Postgres, Twilio, Resend, Mux) signals a mature, role-gated, multi-tenant enterprise product — not a simple checklist app.

Adjacent real-world products in this space: **Cority**, **Intelex**, **VelocityEHS**, **SafetyCulture (iAuditor)**, **Evotix**, **Vector EHS**. The client is building something that competes with or integrates into this ecosystem.

---

## Job Analyst Vocabulary — Confirmed and Extended

Based on research across EHS software vendors, OSHA documentation, ISO 45001 literature, and NFPA compliance requirements.

### Confirmed Primary Entity Names

These terms must appear verbatim in all UI labels — sidebar nav, table headers, KPI card titles, status badges, search placeholders, filter dropdowns.

- **Primary inspection record**: "Inspection" (not "audit" for routine checks; "audit" is reserved for formal compliance audits)
- **Physical equipment/equipment item**: "Asset" (universally used — "equipment" acceptable as secondary)
- **NFC scan event**: "Scan" or "Tag Scan" (proof-of-presence event)
- **Identified problem**: "Finding" (primary) or "Observation" (secondary — lower severity)
- **Structural violation**: "Deficiency" (higher severity than finding; implies regulatory non-compliance)
- **Non-conformance report**: "NCR" or "Non-Conformance" (formal regulatory term)
- **Remediation task**: "Corrective Action" or "CAR" (Corrective Action Request) or "CAPA" (Corrective and Preventive Action)
- **Inspection template/form**: "Checklist" or "Inspection Form" (both used; "checklist" more common in field)
- **Where assets live**: "Location" or "Site" (sites contain locations)
- **Physical area within a site**: "Zone" or "Area" (e.g., "Zone B — Electrical Room")
- **Who inspects**: "Inspector" (field role), "Safety Manager" (oversight role), "Site Admin" (configuration role)
- **Who reviews findings**: "Auditor" (formal compliance review), "EHS Manager" (operational review)
- **Scheduled inspection cycle**: "Inspection Schedule" or "Compliance Schedule"
- **Periodic formal review**: "Audit" (distinct from routine inspection — triggered by certification requirements)
- **Energy isolation procedure**: "LOTO" / "Lockout/Tagout" (OSHA-mandated; abbreviation used universally in the field)
- **Informal safety walkthrough**: "Safety Walk" or "Safety Tour" (ad-hoc, not template-bound)
- **Asset energy isolation document**: "LOTO Procedure" or "Energy Control Procedure"

### Expanded KPI Vocabulary

These are the exact metric names this industry tracks and reports. Use these verbatim as KPI card titles and chart labels.

| KPI Name | What It Measures | Typical Format |
|---|---|---|
| Inspection Completion Rate | % of scheduled inspections completed on time in a period | % (e.g., 94%) |
| Open Findings | Count of active, unresolved findings across all assets/sites | count (e.g., 47) |
| Overdue Corrective Actions | CARs past their due date | count (e.g., 12) |
| Mean Time to Close (MTTC) | Average days from finding creation to closure | days (e.g., 8.3 days) |
| Compliance Score | Weighted score across all inspection checklist items passing | % (e.g., 87.4%) |
| Critical Findings (Open) | High-severity findings that remain unresolved | count (e.g., 3) |
| Asset Coverage | % of tagged assets inspected within their required frequency | % (e.g., 78%) |
| TRIR | Total Recordable Incident Rate (per 200,000 work-hours) | decimal (e.g., 1.4) |
| Near-Miss Reports (30d) | Near-miss incidents logged in last 30 days | count (e.g., 19) |
| Audit Readiness Score | % of compliance requirements documented and current | % (e.g., 92%) |
| Scheduled Inspections This Week | Number of inspections due in current week | count (e.g., 34) |
| Tag Scan Activity (24h) | NFC scan events in the last 24 hours | count (e.g., 127) |
| Repeat Findings Rate | % of findings that recurred within 90 days | % (e.g., 11%) |
| Inspector Utilization | % of active inspectors who completed at least one inspection in the period | % (e.g., 83%) |

### Status Label Vocabulary

These are exact status strings — use verbatim in badges, filter dropdowns, and table cells.

**Inspection statuses:**
- `Scheduled` — upcoming, not yet due
- `Due Today` — inspection due date is today
- `In Progress` — inspector has scanned and started
- `Completed` — inspection submitted and closed
- `Overdue` — past due date, not completed
- `Skipped` — manually marked as not applicable

**Finding / Corrective Action statuses:**
- `Open` — finding created, no CAR assigned
- `Assigned` — corrective action assigned to a person
- `In Progress` — assignee working on remediation
- `Pending Verification` — work claimed complete, awaiting inspector re-check
- `Closed` — verified resolved
- `Escalated` — elevated to safety manager or site admin due to severity or age
- `Waived` — formally accepted with documented rationale (requires manager approval)

**Asset statuses:**
- `Active` — in service, NFC tag functional
- `Out of Service` — asset removed from rotation (maintenance or decommission)
- `Quarantined` — asset flagged for use restriction pending finding resolution
- `Untagged` — asset in system but NFC tag not yet attached
- `Overdue Inspection` — asset's last inspection exceeds required frequency

**Audit statuses:**
- `Planned` — formal audit scheduled
- `In Progress` — audit underway
- `Pending Review` — audit submitted, awaiting management sign-off
- `Issued` — audit report finalized
- `Closed` — all NCRs from audit resolved

### Workflow and Action Vocabulary

These become button labels, action menu items, confirmation dialogs, and empty state messages.

**Primary actions (buttons / CTAs):**
- "Scan Asset" (NFC-trigger action from mobile)
- "Start Inspection"
- "Log Finding"
- "Raise CAR" (create corrective action request)
- "Assign to Inspector"
- "Submit for Review"
- "Verify Resolution"
- "Escalate"
- "Waive Finding" (with documented justification)
- "Export Audit Report"

**Secondary actions:**
- "Add Photo Evidence"
- "Attach Document"
- "Re-open Finding"
- "Extend Due Date" (with override reason)
- "Trigger LOTO Procedure"
- "Bulk Assign"
- "Clone Schedule"
- "Archive Asset"

**Empty state messages (domain-appropriate):**
- "No open findings — all assets are in compliance."
- "No inspections scheduled for this period."
- "This asset has no scan history yet. Attach an NFC tag to begin tracking."
- "All corrective actions are closed."

### Sidebar Navigation Candidates

Use domain vocabulary — not generic labels. These are the 5-7 nav items for the demo.

1. **Inspection Dashboard** (overview — the home screen)
2. **Asset Register** (all tagged assets, NFC tag status, last-inspected date)
3. **Inspection Schedule** (calendar or list of scheduled inspections by site/asset)
4. **Findings & CARs** (open findings list, corrective action tracking)
5. **Audit Log** (immutable record of all scan events, submissions, closures)
6. **Reports & Compliance** (inspection completion rates, TRIR trends, exportable audit reports)
7. **Sites & Locations** (multi-site management: sites → zones → assets)

---

## Design Context — Visual Language of This Industry

### What "Premium" Looks Like in This Domain

EHS and compliance platforms sit firmly in the **Corporate Enterprise** visual space. Practitioners in this domain — Safety Managers, EHS Directors, Compliance Officers, Site Admins — spend their days inside tools like Cority, Intelex, and VelocityEHS. These platforms share a consistent visual language: structured table-heavy layouts, status badges with semantic color coding, hierarchical sidebar navigation, and dense-but-readable information density. There is no whitespace fetishism here — every pixel serves a compliance or operational purpose.

The "premium" signal in this space is **data legibility at a glance**. A compliance officer who opens the platform first thing in the morning needs to immediately know: how many findings are open, which sites are overdue, and whether any critical issues need immediate escalation. The visual hierarchy should make this scannable in 3-5 seconds without clicking anything. This is why the leading EHS platforms use sidebar navigation with badge counts, compact KPI stat bars, and color-coded status indicators as primary design patterns.

Color coding is load-bearing in this domain. Red is not decorative — it signals immediate action required. Amber means approaching risk threshold. Green means compliant. Inspectors and managers have been trained to respond to these signals across every tool they use, and the demo must speak the same visual language. Mixing or reversing these semantics would immediately read as "built by someone who doesn't know safety ops."

A subtle but important differentiator: the best EHS platforms are **print-friendly and export-aware**. Audit reports, inspection records, and corrective action logs are frequently exported to PDF for regulatory submission. The design pattern of "export" being a first-class action (visible in the header or table toolbar — not buried in a settings menu) is a practitioner trust signal.

### Real-World Apps Clients Would Recognize as "Premium"

1. **Cority** — The enterprise gold standard. Clean tabular layouts, sidebar navigation with nested hierarchy, prominent KPI summary bar across the top, structured finding workflow with stage indicators. Color scheme is typically deep navy/blue-gray with amber and red for alerts. Dense but not overwhelming.

2. **SafetyCulture (iAuditor)** — The mobile-first inspection leader. Dashboard with completion percentage rings, list-based inspection queue, finding cards with photo thumbnails, inline status badges. More visual than Cority, slightly lower density. The benchmark for field inspector UX. Practitioners consider iAuditor "the Slack of safety apps" — something they actually want to use vs. tolerate.

3. **Intelex** — Mid-enterprise positioning. Real-time dashboards with configurable widgets, data table-heavy layouts, strong compliance tracking views. Known for configurable reporting. More visual flexibility than Cority, less polish than SafetyCulture on mobile. Strong audit trail UI.

### Aesthetic Validation

- **Recommended aesthetic**: **Corporate Enterprise** with Data-Dense secondary influences
- **Domain validation**: This platform manages compliance records that carry regulatory and legal weight. Practitioners in this space — EHS Directors, Compliance Officers, Safety Managers — use Cority, Intelex, and VelocityEHS daily. These tools share the Corporate Enterprise visual language: sharp corners (0.25rem radius), full-opacity borders, no decorative shadows, instant transitions, tabular data as the primary surface. Any "warm" or "rounded" aesthetic would signal "consumer wellness app" to these practitioners and immediately break credibility.
- **Color direction**: Deep navy primary (`oklch(0.28 0.08 245)`) with amber warning (`oklch(0.75 0.18 75)`) and red critical (`oklch(0.55 0.22 20)`). Avoid bright blues — practitioners associate that with dashboard-for-show, not operational-grade compliance tooling.
- **One adjustment**: Slightly increase density from standard Corporate Enterprise defaults. Safety inspection dashboards are viewed on desktop monitors by power users who want more data per scroll. Set `--content-padding: 1rem` and `--card-padding: 1rem` (compact).

### Format Validation

- **Recommended format**: `dashboard-app` (sidebar + feature pages)
- **Domain validation**: Confirmed. This is a multi-entity compliance management platform with inspection schedules, asset registers, findings queues, audit logs, and reports. All of these are natural sidebar nav items. A dashboard-app format with collapsible sidebar matches exactly how Cority, Intelex, and VelocityEHS are structured. No other format makes sense for this job.
- **Format-specific design notes**: The main dashboard screen should NOT be a generic stats + chart layout. It should feel like a compliance command center: open finding counts by severity (donut or gauge), inspection completion rate trend (area chart for last 30 days), an "Attention Required" queue (table or card list of overdue inspections and escalated findings), and an asset tag scan activity feed. This is what a Safety Manager opens every morning.

### Density and Layout Expectations

**Compact to Standard density.** EHS platforms are power-user tools, not occasional-use apps. Safety Managers and inspectors check them multiple times daily. Compact density is a professionalism signal — it communicates "this was built for someone who uses software all day."

Layout pattern is **list-heavy and table-heavy** with status badges as the primary visual element. Finding queues, inspection schedules, and asset registers are all table-based with sortable columns. Card-based layouts appear in dashboards (KPI stat cards) and individual asset/inspection detail views. The sidebar should use a nested hierarchy: Sites → Zones → Assets, or flat module navigation for top-level features.

---

## Entity Names (10+ realistic names)

### Companies / Organizations (Client Organizations Using the Platform)

These are the multi-site industrial organizations that would subscribe to this platform:

1. **Hartland Industrial Services** (heavy manufacturing, 4 sites)
2. **Cascade Fabrication Group** (metal fabrication, 3 sites)
3. **Thornbridge Chemical** (chemical processing, 6 sites)
4. **Ridgeline Facilities Management** (facilities management contractor, 12 sites)
5. **Blackwater Energy Solutions** (oil & gas support services, 5 sites)
6. **Meridian Cold Storage** (cold-chain warehousing, 8 sites)
7. **Apex Structural** (construction/structural, 3 active sites)
8. **NorthStar Utilities** (utility infrastructure, 7 sites)
9. **Keystone Pharma Manufacturing** (pharmaceutical, 2 sites — heavily regulated)
10. **Clearfield Logistics Hub** (distribution/warehousing, 5 sites)

### People Names (Role-Appropriate)

Inspector-level (field workers, often trade background):
- Marcus Delgado (Senior Inspector)
- Tanya Okonkwo (Safety Inspector)
- Derek Pham (Maintenance Tech / Inspector)
- Ruthanne Calloway (Field Inspector)
- Jorgen Mikkelsen (HSE Inspector)

Safety Manager / EHS roles (often professional/certification holders):
- Sandra Whitfield (EHS Manager, CSP)
- Lionel Bautista (Safety Director)
- Karen Holt (Compliance Manager)
- Priya Nair (Regional Safety Coordinator)

Site Admin / Executive:
- Carl Hennessy (Site Manager)
- Rachel Drummond (VP Operations)

### Assets (Physical Equipment That Gets NFC-Tagged)

Electrical & Mechanical:
- Siemens S7-1500 PLC Control Panel — Zone B
- Allen-Bradley 480V MCC Cabinet #3
- 50-Ton Overhead Bridge Crane (Section 4)
- Compressed Air System — Header A (150 PSI)
- Emergency Diesel Generator #2 (750kW)

Fire & Life Safety:
- Amerex 20lb CO2 Extinguisher — Bay 12 (NFPA 10)
- Viking Model F Sprinkler Control Valve — Building C
- Kidde Smoke/CO Detector Panel (Zone 3)
- Ansul R-102 Restaurant Hood Suppression System

HVAC / Utilities:
- Carrier 60-Ton Rooftop Air Handler (AHU-04)
- Trane Centrifugal Chiller #1
- Boiler Unit — High-Pressure Steam, 80 PSI
- Exhaust Fan — Paint Booth (hazardous location)

PPE / Safety Equipment:
- Fall Protection Anchor Point — Roof Access Zone
- Confined Space Entry Kit #7 (SCBA + Gas Monitor)
- Eye Wash Station — Chemical Storage Area

### Inspection Types

- Routine Equipment Inspection (scheduled, template-based)
- Pre-Operation Check (before equipment use, often daily)
- Post-Incident Inspection (triggered after a near-miss or incident)
- LOTO Verification Inspection (confirms energy isolation before maintenance)
- Fire Safety Walk (monthly NFPA-required)
- OSHA Compliance Audit (annual or triggered)
- ISO 45001 Internal Audit (annual management review)
- Safety Walk (informal, ad-hoc walkthrough by manager)
- PPE Condition Inspection (spot check on personal protective equipment)
- Pre-Startup Safety Review (PSSR — before new/modified equipment goes live)

---

## Realistic Metric Ranges

| Metric | Low | Typical | High | Notes |
|--------|-----|---------|------|-------|
| Inspection Completion Rate | 61% | 87% | 98% | Well-run programs target 90%+; <80% triggers management review |
| Open Findings (mid-size site, 30d) | 8 | 34 | 110 | Varies heavily by site complexity and inspection frequency |
| Mean Time to Close (MTTC) a finding | 3 days | 9 days | 45+ days | Critical findings: 24-72 hrs; minor: 14-30 days |
| Critical Findings (open) | 0 | 2–4 | 12 | Any open critical finding is a management escalation trigger |
| Assets per Site | 25 | 180 | 800+ | Electrical/mechanical heavy sites have 500-1,200 tagged assets |
| Inspections per Asset per Year | 4 | 14 | 52 | High-frequency assets (extinguishers, cranes) inspected weekly/monthly |
| Compliance Score (single site) | 62% | 84% | 99% | 90%+ is audit-ready; <75% typically triggers corrective program |
| TRIR (manufacturing) | 0.8 | 2.4 | 6.0 | OSHA average for manufacturing is ~2.5 per 200k work-hours |
| Corrective Actions overdue | 0 | 7% | 22% | % of total open CARs past due date |
| Tag Scans per Day (site) | 12 | 65 | 280 | Scales with inspector count and asset density |
| Near-Miss Reports per Month | 2 | 11 | 38 | Good safety cultures report more near-misses (leading indicator) |
| Inspector:Asset ratio | 1:40 | 1:90 | 1:200 | Determines inspection frequency achievability |
| Annual OSHA recordable incidents | 0 | 3–8 | 20+ | Per 100 workers; mid-market manufacturing target <3 |
| LOTO procedures per site | 8 | 45 | 200+ | Complex industrial sites have hundreds of energy control procedures |

---

## Industry Terminology Glossary

| Term | Definition | Usage Context |
|------|-----------|---------------|
| LOTO / Lockout-Tagout | OSHA 29 CFR 1910.147 — procedure to isolate hazardous energy before maintenance. A lock physically prevents re-energization; a tag warns not to. | Asset detail view, LOTO procedure library, pre-maintenance inspection type |
| CAR / CAPA | Corrective Action Request / Corrective and Preventive Action. A formal task to fix a finding and prevent recurrence. | Finding-to-action workflow, status tracking, overdue queue |
| NCR | Non-Conformance Report. Formal record that a requirement (regulatory or internal) was not met. More severe than a finding. | Audit workflow, ISO 45001/OSHA contexts |
| TRIR | Total Recordable Incident Rate. (Recordable incidents × 200,000) / total hours worked. Industry-standard lagging indicator. | KPI dashboard, executive reporting |
| Leading Indicator | A proactive safety metric (inspection completion rate, near-miss reports) that predicts future incidents. Opposed to lagging indicators (TRIR, LTI). | KPI labeling, reporting context |
| Lagging Indicator | A reactive safety metric measured after an incident occurs. TRIR, LTIFR, fatality rate. | KPI context, executive dashboards |
| LTIFR | Lost Time Injury Frequency Rate. Injuries causing missed workdays, per 200,000 hours. | KPI cards, OSHA reporting section |
| AHJ | Authority Having Jurisdiction. The regulatory body (fire marshal, OSHA inspector, insurance auditor) with authority to enforce standards at a site. | Inspection type context, audit prep language |
| EHS | Environment, Health & Safety. The professional domain and department responsible for worker safety, environmental compliance, and regulatory adherence. | Platform positioning, role names |
| HSE | Health, Safety & Environment. British/international variant of EHS. Used interchangeably in global organizations. | Role titles (HSE Manager, HSE Inspector) |
| Pre-Startup Safety Review (PSSR) | OSHA-required inspection before new or significantly modified equipment is placed into service. | Inspection type list, triggered workflows |
| Proof of Presence | Verifiable evidence (via NFC scan, GPS stamp, or photo) that an inspector was physically at an asset location at a specific time. | NFC scan audit trail, compliance documentation |
| Safety Walk | Informal management-led walkthrough of a site or facility to observe conditions and behavior. Not template-bound but may generate observations. | Inspection type, quick-log workflow |
| Observation | A noted condition or behavior during a safety walk. Lower severity than a finding — may be positive (safe behavior noted) or opportunity for improvement. | Finding hierarchy, severity tiers |
| Deficiency | A condition that fails to meet a required standard — regulatory, operational, or organizational. More severe than an observation. Requires a corrective action. | Finding severity classification |
| Competent Person | OSHA term: a person with sufficient knowledge and authority to identify hazards and take corrective action. Not the same as "inspector." | Role designation in inspection types |
| NFPA 10 | Standard for Portable Fire Extinguishers — mandates monthly visual inspections and annual maintenance. | Asset category, inspection schedule generation |
| NFPA 25 | Standard for Inspection, Testing, and Maintenance of Water-Based Fire Protection Systems. Defines weekly/monthly/quarterly/annual checks. | Asset category, fire suppression inspection schedules |
| ISO 45001 | International standard for Occupational Health & Safety Management Systems. Replaced OHSAS 18001 in 2018. Requires documented audit programs, risk assessment, and corrective action management. | Audit type, compliance framework selector |
| OSHA 1910.147 | The OSHA regulation governing the Control of Hazardous Energy (Lockout/Tagout). Requires annual LOTO procedure inspections by a competent person. | LOTO inspection type, regulatory compliance tracking |

---

## Common Workflows

### Workflow 1: NFC Scan-to-Inspection (Field Inspector Flow)

The core loop of the platform — what happens when an inspector arrives at an asset.

1. Inspector arrives at physical asset (e.g., emergency generator, overhead crane, fire extinguisher)
2. Opens the mobile app and taps phone to NFC tag affixed to asset
3. Platform identifies the asset, loads its inspection history, and presents the correct inspection form (based on asset type and current schedule)
4. Inspector completes checklist items — photo-documented evidence for any flagged items
5. If a deficiency is found: inspector logs a "Finding" with severity rating (Low / Medium / High / Critical) and photo evidence
6. System prompts: "Raise Corrective Action?" — inspector assigns CAR with suggested due date based on severity
7. Inspector submits inspection — platform time-stamps, geotags, and links to their user profile
8. Notification sent to Safety Manager with inspection summary; Critical findings trigger immediate alert (SMS via Twilio + email via Resend)
9. Audit log entry created: immutable record of scan event, form completion, findings, and submitted evidence

### Workflow 2: Finding-to-Resolution (Corrective Action Lifecycle)

What happens after a finding is logged — the compliance management workflow.

1. Finding created during inspection with severity classification and photo evidence
2. Safety Manager reviews finding in "Findings & CARs" queue
3. CAR raised and assigned to responsible person (maintenance tech, department head) with due date
4. Status changes: `Open` → `Assigned` → `In Progress`
5. Assignee completes remediation and uploads evidence (photos, work order reference, sign-off)
6. Status changes to `Pending Verification`
7. Inspector or Safety Manager performs follow-up inspection (re-tap NFC tag at same asset) to verify resolution
8. If resolved: status → `Closed`. Closure notification sent to all stakeholders.
9. If not resolved: Safety Manager can extend due date (with documented reason) or escalate to Site Admin
10. Overdue CARs (past due date, not closed) appear in red badge count on "Findings & CARs" nav item

### Workflow 3: Compliance Audit Preparation

The formal process triggered before an external regulatory audit (OSHA, ISO 45001 certification body, insurance carrier).

1. Compliance Officer or Safety Director creates a formal "Audit" record in the platform
2. Audit is assigned to an internal Auditor role with access to all inspection records, findings, and corrective actions
3. Auditor reviews inspection completion rate, open findings, and CAPA closure rates for the audit period
4. System generates "Audit Readiness Report" — highlighting gaps: overdue inspections, open NCRs, expired certifications
5. Site Admin reviews report and triggers remediation assignments for any critical gaps
6. Evidence package compiled: exported inspection records, photo evidence, LOTO procedure logs, TRIR reports
7. Post-audit: external auditor issues findings as NCRs within the platform
8. NCR workflow begins: each NCR requires root cause analysis, corrective action plan, and closure evidence

---

## Common Edge Cases

These are the records that make mock data feel real. At least 2-3 of these should appear as specific rows in the mock data.

1. **Overdue high-severity finding**: A "High" severity finding on a compressed air system, originally due 18 days ago, still `Assigned` — escalation triggered, awaiting part delivery
2. **Waived finding**: A corrective action waived by Safety Director with documented rationale ("guard rail modification deferred to scheduled Q3 shutdown — accepted risk, compensating control in place")
3. **Asset with expired inspection**: A fire extinguisher that shows "Last Inspected: 47 days ago" when NFPA 10 requires monthly — status = `Overdue Inspection`
4. **Critical finding with zero CAR**: A critical finding (exposed wiring, electrical hazard) created 2 hours ago, not yet assigned — should appear at top of findings queue with pulsing alert
5. **Untagged asset**: An asset in the register ("Backup Hydraulic Press — Bay 4") with status = `Untagged` — no NFC scan history, inspection cannot be verified
6. **Repeat finding**: Same deficiency ("missing guard on conveyor belt, Section 7") logged three times in 90 days — "Repeat Finding" badge, root cause analysis flagged as required
7. **Inspector scan from wrong zone**: An NFC scan event where the inspector's GPS location doesn't match the asset's registered zone — system flags as "Location Mismatch," pending review
8. **Near-miss with no follow-up**: A near-miss incident logged 5 days ago with no corrective action assigned — appears as overdue in the near-miss queue
9. **Zero-finding inspection**: An inspection completed on a fully compliant asset — should appear as a green "Completed — No Findings" row (the happy path still needs representation)
10. **Empty inspection schedule gap**: A 2-week gap in the inspection calendar where an asset that requires weekly inspection was never scheduled — "Schedule Gap" warning

---

## What Would Impress a Domain Expert

These are the insider signals that separate domain-aware developers from generic builders:

1. **LOTO procedure count as a first-class metric**: Practitioners know that OSHA 29 CFR 1910.147 requires annual inspection of EVERY LOTO procedure by a competent person. A platform that tracks "LOTO Procedures: 47 active | 12 due for annual inspection" immediately signals compliance awareness that most EHS software developers miss.

2. **Inspection frequency is asset-type-driven, not calendar-driven**: Fire extinguishers are monthly (NFPA 10). Overhead crane inspections are pre-use + monthly + annual (ASME B30.2). Control valves (fire sprinkler) can be weekly (NFPA 25). A platform that shows "Frequency: Monthly (NFPA 10)" on an extinguisher asset detail, rather than just a generic "next inspection date," signals deep regulatory understanding.

3. **Leading vs. lagging indicator labeling on the dashboard**: Practitioners are trained to separate "leading" (proactive — inspection completion rate, near-miss reports) from "lagging" (reactive — TRIR, recordable incidents) metrics. Labeling KPI cards with "(Leading)" and "(Lagging)" tags is a subtle but immediately recognized practitioner trust signal.

4. **"Proof of Presence" audit trail**: Inspectors in high-stakes compliance environments are sometimes suspected of backdating or skipping inspections (paperwork fraud). An NFC scan that captures GPS coordinates, device fingerprint, and timestamp creates "proof of presence" — an immutable audit trail that prevents fraud. Using this term explicitly ("Proof of Presence: Verified via NFC scan at 09:14 AM — GPS: 37.774°N, 122.419°W") is an insider-level detail that resonates immediately with EHS Directors and compliance officers.

5. **Corrective action overdue rate as a separate metric from "open findings"**: Practitioners know the difference — you can have 50 open findings that are all within their due dates (acceptable) vs. 10 findings where 7 are past due (management crisis). Displaying overdue CARs as a distinct KPI with a separate color threshold (not just filtering the main findings list) shows process maturity.

---

## Common Systems & Tools Used

EHS and compliance teams in this space use or integrate with:

1. **SafetyCulture (iAuditor)** — Mobile-first inspection capture; many clients migrate from this to a purpose-built platform
2. **Cority** — Enterprise EHS platform; target for mid-market displacement
3. **Intelex** — Enterprise EHS/quality; strong in ISO 45001 compliance tracking
4. **VelocityEHS** — Cloud EHS platform; popular in mid-market manufacturing
5. **Procore** — Construction project management with safety module (construction-vertical clients)
6. **Maximo (IBM)** or **SAP PM** — Enterprise asset management; often the source-of-truth for asset master data that feeds into inspection platforms
7. **Salesforce** — Some EHS organizations use Salesforce-based workflows for CAR management (legacy)
8. **PowerBI / Tableau** — Executive EHS dashboards; inspection platforms often need export integration
9. **OSHA Recordkeeping (OSHA 300/301 logs)** — Manual or software-assisted OSHA incident recordkeeping that inspection platforms must feed into
10. **Keycloak** — Identity and access management (the client is already using this, per job posting — signals multi-tenant role management is a core requirement)

---

## Geographic / Cultural Considerations

- **Primary regulatory framework**: OSHA (US-based assumed, given the client's tech stack and platform naming conventions)
- **Secondary frameworks that may apply by industry/client**: NFPA fire safety standards, ISO 45001 (if client serves international markets or ISO-certified manufacturers), EPA for environmental compliance (adjacent)
- **Date format**: MM/DD/YYYY (US standard for compliance documentation)
- **Time zones**: Multi-site platforms must handle inspections across time zones; schedule "due dates" should be site-local time
- **Units**: Imperial (PSI, Fahrenheit, feet) for equipment specs in US industrial context
- **Language**: All terminology should follow OSHA/NFPA standard language (not UK HSE equivalents)
- **Fiscal year**: Many manufacturing companies use calendar year for TRIR/safety metric reporting; some use fiscal year (July–June). Dashboard should clarify "YTD (Jan–Mar)" not just "YTD."

---

## Data Architect Notes

Instructions for writing `types.ts` and `mock-data.ts`:

**Entity names to use:**
- `Asset` (not "Equipment" or "Item")
- `Inspection` (not "Audit" for routine checks; create separate `Audit` type for formal compliance audits)
- `Finding` (not "Issue" or "Problem")
- `CorrectiveAction` (abbreviated `CAR` in UI labels, but full name in code)
- `InspectionSchedule` (not "Calendar" or "Event")
- `TagScan` (for NFC scan event records — proof of presence)
- `Site` → `Location` → `Zone` → `Asset` (hierarchical relationship)
- `User` with `role` field: `"inspector" | "safety_manager" | "site_admin" | "auditor" | "executive"`

**Status fields (exact TypeScript union strings):**
- Asset status: `"active" | "out_of_service" | "quarantined" | "untagged" | "overdue_inspection"`
- Inspection status: `"scheduled" | "due_today" | "in_progress" | "completed" | "overdue" | "skipped"`
- Finding status: `"open" | "assigned" | "in_progress" | "pending_verification" | "closed" | "escalated" | "waived"`
- Finding severity: `"low" | "medium" | "high" | "critical"`
- CAR status: `"open" | "assigned" | "in_progress" | "pending_verification" | "closed" | "overdue" | "escalated"`

**Metric field values:**
- Asset `lastInspectedDaysAgo`: use 1–45; assets at 30+ days for monthly-required assets signal overdue
- Inspection `completionRate`: 61%–98%; dashboard KPI target ~87%
- Finding `daysOpen`: 1–45 days for open findings; >14 days = concern, >30 = escalation trigger
- CAR `dueDate`: relative to today; include 3–4 records with past due dates (overdue state)
- Site `complianceScore`: 62%–99%; most sites 78%–94%
- Asset NFC `tagId`: format `NFC-{4-digit-alphanumeric}` (e.g., `NFC-A4F2`, `NFC-B91C`)
- TagScan `timestamp`: vary across last 30 days; higher frequency during business hours (06:00–18:00)

**Edge cases to include as specific records:**
- 1 asset with `status: "quarantined"` and an open `critical` finding
- 1 asset with `status: "untagged"` and no scan history
- 1 finding with `status: "waived"` with `waiverReason` field populated
- 3–4 CARs with `dueDate` in the past (overdue state)
- 1 finding flagged as `isRepeatFinding: true` with `repeatCount: 3`
- 1 inspection with `status: "overdue"` on a fire extinguisher (NFPA 10 monthly requirement)
- At least 2 `TagScan` records with `locationMismatch: true` (GPS coordinates don't match asset zone)

**Date patterns:**
- Inspections scheduled: distribute across next 14 days, with 2–3 "due today"
- Findings created: last 1–45 days (use relative dates)
- TRIR chart: 12 months of monthly data, 0.8–3.2 range
- Tag scan activity: last 7 days by day, 12–85 scans/day range

---

## Layout Builder Notes

**Density setting**: Compact. EHS power users work in this platform multiple times daily. Compact density signals professionalism and is the convention in tools like Cority and Intelex.

**Sidebar width**: Standard 16rem. Navigation items are moderately long ("Asset Register", "Findings & CARs", "Reports & Compliance") — 16rem fits without truncation.

**Sidebar background**: Use a slightly tinted sidebar (very dark navy tint on the sidebar vs. white body) — this is the Cority/Intelex convention. Not a full dark sidebar, but a subtle differentiation.

**Domain-specific visual patterns to implement:**
- **Status badges are color-coded semantically**: red = critical/overdue, amber = warning/due-soon, green = compliant/closed, gray = inactive. These must be consistent across ALL views.
- **Badge counts on nav items**: "Findings & CARs" should show a red badge with the count of open/overdue items. This is a practitioner trust pattern from enterprise EHS tools.
- **Table-heavy primary views**: Finding queues, asset registers, inspection schedules — all tables with sortable columns. Not cards.
- **Stat bar or compact KPI row at top of dashboard**: Not large hero cards. A compact row of 4–5 key metrics (completion rate, open findings, overdue CARs, compliance score) is the Cority/Intelex pattern.

**Color nuance for Corporate Enterprise in this sub-domain:**
- Primary: Deep navy (not corporate "process blue" — darker, more authoritative)
- Accent: A functional amber for warnings (not decorative orange)
- Success: Desaturated green (not bright lime — compliance green is always slightly muted)
- Avoid: Any purple, teal, or gradient treatments — these read as "startup SaaS," not "compliance platform"

**Sidebar width recommendation**: 16rem (standard). Do not go wider — EHS practitioners have limited screen real estate since they often have data tables open.

**Motion character**: Instant to Snappy (50–100ms). Corporate Enterprise convention. Compliance software should feel responsive and immediate, not animated.

---

## Demo Screen Builder Notes

**Single most important metric for the hero**: **Inspection Completion Rate** — displayed as a large percentage (e.g., 87.4%) with a trend arrow (vs. last period). Every Safety Manager's first question every morning is "did my team complete yesterday's inspections?"

**Chart type for trend data**: Area chart for compliance score over 12 months (smooth curve, filled area in primary color at 20% opacity). This shows directionality (improving/declining compliance) which is what management reports require.

**One domain-specific panel that would impress a practitioner**: An **"Attention Required" queue** — a compact table or card list showing: (1) Overdue inspections by site/asset, (2) Escalated findings, (3) Critical findings with no CAR assigned, sorted by urgency. This is the first thing a Safety Manager or EHS Director checks each morning. SafetyCulture calls this an "Actions" feed; Cority has a similar "My Worklist." Label it "Attention Required" or "Escalations & Overdue" — not "Notifications" or "Alerts."

**Second compelling panel**: A **Tag Scan Activity** spark chart — showing NFC scan events per day for the last 7 days. This is a uniquely domain-specific visual that no generic dashboard would have. It validates the platform's NFC-centric differentiation and gives the Safety Manager a sense of inspector activity without needing to check individual inspection records.

**Format-specific notes (dashboard-app)**:
- Main dashboard: Compact KPI stat bar (4–5 metrics in a row) + attention-required queue (table) + compliance trend chart (area chart, right column) + tag scan activity (mini sparkline, right column)
- Asset Register page: Searchable/filterable table with columns: Asset Name, Location/Zone, NFC Tag ID, Last Inspected, Status, Open Findings. Status badge is the most important column.
- Findings & CARs page: Tabbed view — "Open Findings" / "Corrective Actions" / "Closed (30d)". Table with severity badge, asset name, inspector, days open, assignee, due date.
- Inspection Schedule page: Either a weekly calendar view or a list grouped by date, with status indicators for each inspection.
- Reports & Compliance page: KPI trend charts (TRIR, completion rate, compliance score over 12 months) + compliance score breakdown by site.
