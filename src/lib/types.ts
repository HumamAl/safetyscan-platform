import type { LucideIcon } from "lucide-react";

// ─── Sidebar & Navigation ────────────────────────────────────────────────────

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badgeCount?: number;
}

// ─── Challenge & Proposal (template-level) ───────────────────────────────────

export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

export interface DemoScreen {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
}

export type ConversionVariant = "sidebar" | "inline" | "floating" | "banner";

// ─── Domain Entity Types ─────────────────────────────────────────────────────

// User roles in the EHS platform
export type UserRole =
  | "inspector"
  | "safety_manager"
  | "site_admin"
  | "auditor"
  | "executive";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  /** Professional certification, e.g., "CSP", "CIH" */
  certification?: string;
  siteId: string;
  email: string;
  active: boolean;
}

// ─── Site / Location / Zone Hierarchy ────────────────────────────────────────

export interface Site {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  /** Total tagged assets at this site */
  assetCount: number;
  /** Weighted compliance score 0–100 */
  complianceScore: number;
  /** Inspection completion rate percentage 0–100 */
  inspectionCompletionRate: number;
  openFindings: number;
  overdueInspections: number;
  primaryContact: string;
  active: boolean;
}

export interface Zone {
  id: string;
  siteId: string;
  name: string;
  /** Physical area descriptor, e.g., "Electrical Room", "Loading Dock" */
  areaType: string;
  assetCount: number;
}

// ─── Asset ───────────────────────────────────────────────────────────────────

export type AssetStatus =
  | "active"
  | "out_of_service"
  | "quarantined"
  | "untagged"
  | "overdue_inspection";

export type InspectionFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "semi_annual"
  | "annual"
  | "pre_use";

export interface Asset {
  id: string;
  name: string;
  /** Asset category, e.g., "Fire & Life Safety", "Electrical & Mechanical" */
  category: string;
  /** Specific equipment type */
  equipmentType: string;
  /** NFC tag identifier, format: NFC-XXXX */
  tagId: string | null;
  status: AssetStatus;
  siteId: string;
  zoneId: string;
  serialNumber?: string;
  manufacturer?: string;
  /** Regulatory standard driving inspection frequency, e.g., "NFPA 10", "ASME B30.2" */
  regulatoryStandard?: string;
  inspectionFrequency: InspectionFrequency;
  /** ISO date string of last completed inspection */
  lastInspectedAt: string | null;
  /** Days since last inspection — computed for display */
  lastInspectedDaysAgo: number | null;
  nextInspectionDue: string;
  openFindingsCount: number;
  /** Flag: asset has open critical finding */
  hasCriticalFinding: boolean;
  createdAt: string;
}

// ─── Inspection ───────────────────────────────────────────────────────────────

export type InspectionStatus =
  | "scheduled"
  | "due_today"
  | "in_progress"
  | "completed"
  | "overdue"
  | "skipped";

export type InspectionType =
  | "Routine Equipment Inspection"
  | "Pre-Operation Check"
  | "Post-Incident Inspection"
  | "LOTO Verification Inspection"
  | "Fire Safety Walk"
  | "OSHA Compliance Audit"
  | "ISO 45001 Internal Audit"
  | "Safety Walk"
  | "PPE Condition Inspection"
  | "Pre-Startup Safety Review";

export interface ChecklistItem {
  id: string;
  question: string;
  response: "pass" | "fail" | "n_a" | null;
  notes?: string;
  photoAttached: boolean;
}

export interface Inspection {
  id: string;
  assetId: string;
  assetName: string;
  siteId: string;
  inspectorId: string;
  inspectorName: string;
  type: InspectionType;
  status: InspectionStatus;
  scheduledDate: string;
  /** ISO date-time string — set when inspector submits */
  completedAt: string | null;
  /** Total checklist items */
  checklistItemCount: number;
  /** Items marked pass */
  passCount: number;
  /** Items marked fail — findings raised from these */
  failCount: number;
  findingsRaised: number;
  /** Proof of presence: NFC scan verified at asset location */
  proofOfPresenceVerified: boolean;
  /** GPS coordinates captured at scan time */
  gpsCoordinates?: string;
  notes?: string;
  checklist?: ChecklistItem[];
  createdAt: string;
}

// ─── Tag Scan (NFC Proof-of-Presence Event) ───────────────────────────────────

export interface TagScan {
  id: string;
  tagId: string;
  assetId: string;
  assetName: string;
  inspectorId: string;
  inspectorName: string;
  siteId: string;
  zoneId: string;
  /** ISO date-time string */
  timestamp: string;
  /** GPS coordinates captured at scan time */
  gpsCoordinates: string;
  /** True if GPS doesn't match registered zone — flags for review */
  locationMismatch: boolean;
  /** Triggered inspection ID, if scan initiated an inspection */
  triggeredInspectionId: string | null;
}

// ─── Finding ──────────────────────────────────────────────────────────────────

export type FindingStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "pending_verification"
  | "closed"
  | "escalated"
  | "waived";

export type FindingSeverity = "low" | "medium" | "high" | "critical";

export interface Finding {
  id: string;
  inspectionId: string;
  assetId: string;
  assetName: string;
  siteId: string;
  inspectorId: string;
  inspectorName: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  status: FindingStatus;
  /** Days elapsed since finding was created */
  daysOpen: number;
  /** Date finding was created */
  createdAt: string;
  /** Escalated to this person, if status is escalated */
  escalatedTo?: string;
  /** Documented rationale if status is waived */
  waiverReason?: string;
  /** Manager who approved the waiver */
  waivedBy?: string;
  photoAttached: boolean;
  /** True if same deficiency recurred within 90 days */
  isRepeatFinding: boolean;
  /** How many times this finding has recurred */
  repeatCount?: number;
  /** Whether a corrective action has been raised */
  carRaised: boolean;
  correctiveActionId?: string;
}

// ─── Corrective Action (CAR) ──────────────────────────────────────────────────

export type CorrectiveActionStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "pending_verification"
  | "closed"
  | "overdue"
  | "escalated";

export interface CorrectiveAction {
  id: string;
  findingId: string;
  findingTitle: string;
  assetId: string;
  assetName: string;
  siteId: string;
  /** Person responsible for completing the remediation */
  assigneeId: string;
  assigneeName: string;
  /** Manager who raised or owns the CAR */
  raisedById: string;
  raisedByName: string;
  status: CorrectiveActionStatus;
  priority: "low" | "medium" | "high" | "critical";
  description: string;
  /** ISO date string — required completion date */
  dueDate: string;
  /** ISO date string — set when closed */
  closedAt: string | null;
  /** Days until due date; negative = overdue */
  daysUntilDue: number;
  /** Evidence uploaded by assignee */
  evidenceAttached: boolean;
  notes?: string;
  createdAt: string;
}

// ─── Inspection Schedule ──────────────────────────────────────────────────────

export type ScheduleStatus = "scheduled" | "due_today" | "overdue" | "completed" | "skipped";

export interface InspectionSchedule {
  id: string;
  assetId: string;
  assetName: string;
  siteId: string;
  zoneId: string;
  inspectionType: InspectionType;
  frequency: InspectionFrequency;
  /** ISO date string */
  scheduledDate: string;
  /** Assigned inspector */
  assignedInspectorId: string;
  assignedInspectorName: string;
  status: ScheduleStatus;
  /** ISO date string — last time this asset was inspected */
  lastCompletedAt: string | null;
  regulatoryStandard?: string;
}

// ─── Audit (Formal Compliance Audit — distinct from routine Inspection) ───────

export type AuditStatus =
  | "planned"
  | "in_progress"
  | "pending_review"
  | "issued"
  | "closed";

export type AuditFramework =
  | "ISO 45001"
  | "OSHA VPP"
  | "NFPA Annual"
  | "Insurance Carrier"
  | "Internal";

export interface Audit {
  id: string;
  title: string;
  framework: AuditFramework;
  siteId: string;
  siteName: string;
  auditorId: string;
  auditorName: string;
  status: AuditStatus;
  /** ISO date string — planned start */
  scheduledDate: string;
  /** ISO date string — actual completion */
  completedAt: string | null;
  /** Count of NCRs raised from this audit */
  ncrCount: number;
  /** Count of NCRs closed */
  ncrClosed: number;
  /** Overall audit score 0–100 */
  score: number | null;
  createdAt: string;
}

// ─── Audit Log Entry (Immutable System Record) ───────────────────────────────

export type AuditLogAction =
  | "inspection_created"
  | "inspection_completed"
  | "inspection_overdue"
  | "finding_created"
  | "finding_escalated"
  | "finding_closed"
  | "finding_waived"
  | "car_created"
  | "car_closed"
  | "car_overdue"
  | "tag_scan"
  | "tag_scan_location_mismatch"
  | "user_login"
  | "user_role_changed"
  | "asset_status_changed"
  | "audit_report_exported";

export interface AuditLogEntry {
  id: string;
  /** ISO date-time string */
  timestamp: string;
  action: AuditLogAction;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  /** Reference to the object this action was performed on */
  entityType: "inspection" | "finding" | "car" | "asset" | "user" | "audit" | "tag_scan";
  entityId: string;
  entityLabel: string;
  siteId: string;
  /** Human-readable description for the log viewer */
  description: string;
  /** Whether this entry has been cryptographically verified */
  tamperVerified: boolean;
  metadata?: Record<string, string>;
}

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────

export interface DashboardStats {
  /** Percentage of scheduled inspections completed on time — leading indicator */
  inspectionCompletionRate: number;
  inspectionCompletionRateChange: number;
  /** Total active, unresolved findings across all sites */
  openFindings: number;
  openFindingsChange: number;
  /** CARs past their due date */
  overdueCorrectiveActions: number;
  overdueCorrectiveActionsChange: number;
  /** Weighted compliance score across all sites */
  complianceScore: number;
  complianceScoreChange: number;
  /** High + critical open findings requiring immediate attention */
  criticalOpenFindings: number;
  /** Assets inspected within their required frequency */
  assetCoverageRate: number;
  /** TRIR — Total Recordable Incident Rate per 200,000 work-hours — lagging indicator */
  trir: number;
  trirChange: number;
  /** NFC scan events in the last 24 hours */
  tagScanActivity24h: number;
  /** Near-miss reports submitted in last 30 days — leading indicator */
  nearMissReports30d: number;
  /** LOTO procedures active in system */
  lotoProceduresActive: number;
  /** LOTO procedures due for annual inspection */
  lotoProceduresDueForReview: number;
}

// ─── Chart Data ───────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  label: string;
  value: number;
  /** Optional comparison value, e.g., industry benchmark */
  benchmark?: number;
}

export interface MonthlyTRIRDataPoint {
  month: string;
  trir: number;
  /** OSHA industry average for manufacturing */
  industryAvg: number;
}

export interface DailyTagScanDataPoint {
  day: string;
  scans: number;
  inspectionsTriggered: number;
}

export interface SiteComplianceDataPoint {
  site: string;
  complianceScore: number;
  openFindings: number;
  overdueInspections: number;
}

export interface InspectionCompletionDataPoint {
  month: string;
  completed: number;
  scheduled: number;
  completionRate: number;
}

// ─── Notification Delivery Log ────────────────────────────────────────────────

export type NotificationChannel = "sms" | "email" | "in_app";
export type NotificationStatus = "delivered" | "failed" | "pending" | "retrying";

export interface NotificationLog {
  id: string;
  /** The event that triggered this notification */
  triggerEvent: string;
  channel: NotificationChannel;
  recipientId: string;
  recipientName: string;
  status: NotificationStatus;
  /** Number of delivery attempts */
  attemptCount: number;
  /** ISO date-time of last attempt */
  lastAttemptAt: string;
  /** ISO date-time of successful delivery, if delivered */
  deliveredAt: string | null;
  /** Error code if failed */
  errorCode?: string;
}
