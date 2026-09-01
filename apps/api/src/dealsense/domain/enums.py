"""DealSense API — Domain Enumerations.

Centralized enum definitions used across the domain model, API schemas,
and scoring engine.
"""

from enum import StrEnum


class TenantStatus(StrEnum):
    """Tenant lifecycle status."""

    ACTIVE = "active"
    SUSPENDED = "suspended"
    DISCONNECTED = "disconnected"
    PENDING_SETUP = "pending_setup"


class RiskBand(StrEnum):
    """Risk classification bands for deal health scores."""

    CRITICAL = "critical"    # 0-20
    HIGH = "high"            # 21-40
    ELEVATED = "elevated"    # 41-60
    MODERATE = "moderate"    # 61-80
    HEALTHY = "healthy"      # 81-100


class SignalType(StrEnum):
    """Types of deterministic risk signals."""

    STAGE_AGING = "stage_aging"
    ENGAGEMENT_DECAY = "engagement_decay"
    STAKEHOLDER_GAP = "stakeholder_gap"
    COMMITMENT_QUALITY = "commitment_quality"
    DATE_SLIPPAGE = "date_slippage"
    CRM_HYGIENE = "crm_hygiene"
    HISTORICAL_SIMILARITY = "historical_similarity"
    NEXT_STEP_GAP = "next_step_gap"
    CHAMPION_WEAKNESS = "champion_weakness"
    ECONOMIC_BUYER_GAP = "economic_buyer_gap"
    DECISION_PROCESS_AMBIGUITY = "decision_process_ambiguity"


class SignalSeverity(StrEnum):
    """Severity level for individual risk signals."""

    INFO = "info"
    WARNING = "warning"
    HIGH = "high"
    CRITICAL = "critical"


class ActivityType(StrEnum):
    """Types of CRM activity events."""

    NOTE = "note"
    MEETING = "meeting"
    CALL = "call"
    EMAIL = "email"
    TASK = "task"
    STAGE_CHANGE = "stage_change"
    PROPERTY_CHANGE = "property_change"
    ASSOCIATION_CHANGE = "association_change"


class ActionTier(StrEnum):
    """Action execution tiers with increasing risk and approval requirements."""

    TIER_0_READ_ONLY = "tier_0_read_only"          # Automatic
    TIER_1_SUGGESTION = "tier_1_suggestion"         # User manually triggers
    TIER_2_DRAFT = "tier_2_draft"                   # User reviews and confirms
    TIER_3_CONTROLLED_WRITE = "tier_3_controlled"   # Explicit user approval
    TIER_4_HIGH_IMPACT = "tier_4_high_impact"       # Manager approval + user confirmation
    TIER_5_AUTONOMOUS = "tier_5_autonomous"         # Customer-specific policy only


class ActionStatus(StrEnum):
    """Lifecycle status of an action proposal."""

    PROPOSED = "proposed"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"
    ROLLED_BACK = "rolled_back"


class ActionCategory(StrEnum):
    """Categories of recommended next-best actions."""

    CREATE_FOLLOWUP_TASK = "create_followup_task"
    ASK_DISCOVERY_QUESTION = "ask_discovery_question"
    REQUEST_INTRODUCTION = "request_introduction"
    CONFIRM_DECISION_PROCESS = "confirm_decision_process"
    PREPARE_BUSINESS_CASE = "prepare_business_case"
    REENGAGE_STAKEHOLDER = "reengage_stakeholder"
    ESCALATE_MANAGER_REVIEW = "escalate_manager_review"
    UPDATE_FORECAST = "update_forecast"
    UPDATE_DEAL_PROPERTY = "update_deal_property"
    CREATE_NOTE = "create_note"


class WebhookEventStatus(StrEnum):
    """Processing status of incoming webhook events."""

    RECEIVED = "received"
    QUEUED = "queued"
    PROCESSING = "processing"
    PROCESSED = "processed"
    FAILED = "failed"
    DEAD_LETTERED = "dead_lettered"


class ParticipantRole(StrEnum):
    """Inferred role of a deal participant / stakeholder."""

    CHAMPION = "champion"
    ECONOMIC_BUYER = "economic_buyer"
    TECHNICAL_BUYER = "technical_buyer"
    INFLUENCER = "influencer"
    GATEKEEPER = "gatekeeper"
    END_USER = "end_user"
    COACH = "coach"
    UNKNOWN = "unknown"


class UserRole(StrEnum):
    """RBAC roles for DealSense users."""

    AGENCY_OWNER = "agency_owner"
    AGENCY_OPERATOR = "agency_operator"
    CLIENT_ADMIN = "client_admin"
    SALES_MANAGER = "sales_manager"
    SALES_REP = "sales_rep"
    AUDITOR = "auditor"


class ConfidenceLevel(StrEnum):
    """Confidence classification for AI outputs."""

    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    ABSTAIN = "abstain"
