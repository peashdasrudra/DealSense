"""DealSense API — SQLAlchemy ORM Domain Models.

All 14 core tables with tenant isolation, event-sourcing support,
and pgvector embedding storage. Every model includes tenant_id for
mandatory tenant-scoped queries.
"""

import uuid
from datetime import datetime
from typing import Any

from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    """Base class for all ORM models."""

    type_annotation_map = {
        dict[str, Any]: JSONB,
    }


# ============================================================
# Tenant & Connection
# ============================================================


class Tenant(Base):
    """A DealSense tenant — maps 1:1 to a HubSpot portal/account."""

    __tablename__ = "tenants"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    hubspot_portal_id: Mapped[str] = mapped_column(
        String(64), unique=True, nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    status: Mapped[str] = mapped_column(
        String(32), nullable=False, default="pending_setup"
    )
    settings: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    white_label_config: Mapped[dict[str, Any]] = mapped_column(
        JSONB, nullable=False, default=dict
    )
    methodology: Mapped[str] = mapped_column(
        String(64), nullable=False, default="meddicc"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    connection: Mapped["HubSpotConnection"] = relationship(
        back_populates="tenant", uselist=False, cascade="all, delete-orphan"
    )
    deals: Mapped[list["Deal"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")
    audit_events: Mapped[list["AuditEvent"]] = relationship(
        back_populates="tenant", cascade="all, delete-orphan"
    )


class HubSpotConnection(Base):
    """Encrypted HubSpot OAuth connection for a tenant.

    Tokens are stored encrypted. Access tokens are cached in Redis for
    performance. Refresh tokens are only decrypted during refresh operations.
    """

    __tablename__ = "hubspot_connections"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False, unique=True
    )
    encrypted_access_token: Mapped[str] = mapped_column(Text, nullable=False)
    encrypted_refresh_token: Mapped[str] = mapped_column(Text, nullable=False)
    token_type: Mapped[str] = mapped_column(String(32), nullable=False, default="bearer")
    scopes: Mapped[str] = mapped_column(Text, nullable=False, default="")
    token_expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    last_refresh_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    refresh_failure_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="connection")


# ============================================================
# CRM Objects
# ============================================================


class Deal(Base):
    """Normalized HubSpot deal record with tenant scoping."""

    __tablename__ = "deals"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    hubspot_deal_id: Mapped[str] = mapped_column(String(64), nullable=False)
    name: Mapped[str] = mapped_column(String(512), nullable=False, default="")
    pipeline: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    stage: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    amount: Mapped[float | None] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String(8), nullable=False, default="USD")
    close_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    owner_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    owner_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    properties: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    is_closed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_won: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    hubspot_created_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    hubspot_updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    __table_args__ = (
        UniqueConstraint("tenant_id", "hubspot_deal_id", name="uq_deal_tenant_hubspot"),
        Index("ix_deal_tenant_stage", "tenant_id", "stage"),
        Index("ix_deal_tenant_pipeline", "tenant_id", "pipeline"),
    )

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="deals")
    stage_history: Mapped[list["DealStageHistory"]] = relationship(
        back_populates="deal", cascade="all, delete-orphan", order_by="DealStageHistory.changed_at"
    )
    activities: Mapped[list["Activity"]] = relationship(
        back_populates="deal", cascade="all, delete-orphan"
    )
    participants: Mapped[list["DealParticipant"]] = relationship(
        back_populates="deal", cascade="all, delete-orphan"
    )
    signals: Mapped[list["DealSignal"]] = relationship(
        back_populates="deal", cascade="all, delete-orphan"
    )
    snapshots: Mapped[list["DealSnapshot"]] = relationship(
        back_populates="deal", cascade="all, delete-orphan", order_by="DealSnapshot.created_at.desc()"
    )
    action_proposals: Mapped[list["ActionProposal"]] = relationship(
        back_populates="deal", cascade="all, delete-orphan"
    )


class DealStageHistory(Base):
    """Immutable record of deal stage transitions."""

    __tablename__ = "deal_stage_history"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    deal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("deals.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )
    from_stage: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    to_stage: Mapped[str] = mapped_column(String(255), nullable=False)
    changed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    duration_in_previous_stage_hours: Mapped[float | None] = mapped_column(
        Float, nullable=True
    )

    # Relationships
    deal: Mapped["Deal"] = relationship(back_populates="stage_history")


class Person(Base):
    """Normalized contact/person from HubSpot CRM."""

    __tablename__ = "persons"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    hubspot_contact_id: Mapped[str] = mapped_column(String(64), nullable=False)
    name: Mapped[str] = mapped_column(String(512), nullable=False, default="")
    email: Mapped[str | None] = mapped_column(String(512), nullable=True)
    title: Mapped[str | None] = mapped_column(String(512), nullable=True)
    company: Mapped[str | None] = mapped_column(String(512), nullable=True)
    properties: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    __table_args__ = (
        UniqueConstraint("tenant_id", "hubspot_contact_id", name="uq_person_tenant_hubspot"),
    )

    # Relationships
    deal_participations: Mapped[list["DealParticipant"]] = relationship(
        back_populates="person", cascade="all, delete-orphan"
    )


class DealParticipant(Base):
    """Association between a deal and a person with inferred role."""

    __tablename__ = "deal_participants"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    deal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("deals.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    person_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("persons.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )
    role: Mapped[str] = mapped_column(String(64), nullable=False, default="unknown")
    role_confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    last_activity_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    engagement_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    __table_args__ = (
        UniqueConstraint("deal_id", "person_id", name="uq_participant_deal_person"),
    )

    # Relationships
    deal: Mapped["Deal"] = relationship(back_populates="participants")
    person: Mapped["Person"] = relationship(back_populates="deal_participations")


# ============================================================
# Activities
# ============================================================


class Activity(Base):
    """Normalized CRM activity (note, meeting, call, email metadata, task)."""

    __tablename__ = "activities"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    deal_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("deals.id", ondelete="SET NULL"),
        nullable=True, index=True
    )
    activity_type: Mapped[str] = mapped_column(String(64), nullable=False)
    hubspot_object_id: Mapped[str] = mapped_column(String(64), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False, default="")
    summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    occurred_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    metadata_json: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    source: Mapped[str] = mapped_column(String(64), nullable=False, default="hubspot")
    processing_version: Mapped[str] = mapped_column(
        String(32), nullable=False, default="v1.0.0"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )

    __table_args__ = (
        UniqueConstraint(
            "tenant_id", "hubspot_object_id", "activity_type",
            name="uq_activity_tenant_hubspot"
        ),
        Index("ix_activity_tenant_deal", "tenant_id", "deal_id"),
        Index("ix_activity_tenant_type", "tenant_id", "activity_type"),
        Index("ix_activity_occurred_at", "tenant_id", "occurred_at"),
    )

    # Relationships
    deal: Mapped["Deal | None"] = relationship(back_populates="activities")
    document_chunks: Mapped[list["DocumentChunk"]] = relationship(
        back_populates="activity", cascade="all, delete-orphan"
    )


# ============================================================
# Embeddings & Retrieval
# ============================================================


class DocumentChunk(Base):
    """Semantically chunked text from CRM activities for vector retrieval."""

    __tablename__ = "document_chunks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )
    activity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("activities.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    deal_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True, index=True
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    token_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    embedding: Mapped[Any] = mapped_column(Vector(1536), nullable=True)
    embedding_model: Mapped[str] = mapped_column(
        String(128), nullable=False, default="text-embedding-3-small"
    )
    embedding_version: Mapped[str] = mapped_column(
        String(32), nullable=False, default="v1.0.0"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )

    __table_args__ = (
        Index("ix_chunk_tenant_deal", "tenant_id", "deal_id"),
    )

    # Relationships
    activity: Mapped["Activity"] = relationship(back_populates="document_chunks")


# ============================================================
# Risk Assessment & Scoring
# ============================================================


class DealSignal(Base):
    """Individual deterministic risk signal for a deal."""

    __tablename__ = "deal_signals"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    deal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("deals.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )
    snapshot_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("deal_snapshots.id", ondelete="SET NULL"),
        nullable=True
    )
    signal_type: Mapped[str] = mapped_column(String(64), nullable=False)
    severity: Mapped[str] = mapped_column(String(32), nullable=False, default="info")
    impact_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    details: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    evidence_ids: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    scoring_version: Mapped[str] = mapped_column(
        String(32), nullable=False, default="v1.0.0"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )

    # Relationships
    deal: Mapped["Deal"] = relationship(back_populates="signals")
    snapshot: Mapped["DealSnapshot | None"] = relationship(back_populates="signals")


class DealSnapshot(Base):
    """Point-in-time deal health assessment — the core DealSense output.

    This is the precomputed result served to the HubSpot sidebar card.
    """

    __tablename__ = "deal_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    deal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("deals.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )
    health_score: Mapped[int] = mapped_column(Integer, nullable=False)
    risk_band: Mapped[str] = mapped_column(String(32), nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    previous_health_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    score_delta: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Structured analysis outputs
    top_signals: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB, nullable=False, default=list
    )
    methodology_extraction: Mapped[dict[str, Any]] = mapped_column(
        JSONB, nullable=False, default=dict
    )
    risk_explanation: Mapped[str] = mapped_column(Text, nullable=False, default="")
    what_changed: Mapped[str] = mapped_column(Text, nullable=False, default="")
    recommended_actions: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB, nullable=False, default=list
    )
    evidence_summary: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB, nullable=False, default=list
    )

    # Versioning & traceability
    scoring_version: Mapped[str] = mapped_column(
        String(32), nullable=False, default="v1.0.0"
    )
    prompt_version: Mapped[str] = mapped_column(
        String(32), nullable=False, default="v1.0.0"
    )
    model_version: Mapped[str] = mapped_column(
        String(64), nullable=False, default=""
    )
    trace_id: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    analysis_duration_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    token_usage: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)

    is_current: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )

    __table_args__ = (
        Index("ix_snapshot_tenant_deal_current", "tenant_id", "deal_id", "is_current"),
    )

    # Relationships
    deal: Mapped["Deal"] = relationship(back_populates="snapshots")
    signals: Mapped[list["DealSignal"]] = relationship(
        back_populates="snapshot", cascade="all, delete-orphan"
    )


# ============================================================
# Actions & Approvals
# ============================================================


class ActionProposal(Base):
    """Proposed CRM action with approval workflow."""

    __tablename__ = "action_proposals"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    deal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("deals.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )
    snapshot_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True
    )
    category: Mapped[str] = mapped_column(String(64), nullable=False)
    tier: Mapped[str] = mapped_column(String(32), nullable=False)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    rationale: Mapped[str] = mapped_column(Text, nullable=False, default="")
    evidence_ids: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    payload: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="proposed")
    idempotency_key: Mapped[str] = mapped_column(
        String(128), nullable=False, unique=True
    )
    created_by: Mapped[str] = mapped_column(String(128), nullable=False, default="system")
    approved_by: Mapped[str | None] = mapped_column(String(128), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    rejected_by: Mapped[str | None] = mapped_column(String(128), nullable=True)
    rejected_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    deal: Mapped["Deal"] = relationship(back_populates="action_proposals")
    executions: Mapped[list["ActionExecution"]] = relationship(
        back_populates="proposal", cascade="all, delete-orphan"
    )


class ActionExecution(Base):
    """Record of an executed action against HubSpot CRM."""

    __tablename__ = "action_executions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    proposal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("action_proposals.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )
    pre_action_state: Mapped[dict[str, Any]] = mapped_column(
        JSONB, nullable=False, default=dict
    )
    post_action_state: Mapped[dict[str, Any]] = mapped_column(
        JSONB, nullable=False, default=dict
    )
    hubspot_response: Mapped[dict[str, Any]] = mapped_column(
        JSONB, nullable=False, default=dict
    )
    hubspot_object_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="executing")
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    executed_by: Mapped[str] = mapped_column(String(128), nullable=False, default="system")
    executed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )

    # Relationships
    proposal: Mapped["ActionProposal"] = relationship(back_populates="executions")


# ============================================================
# Webhook Events
# ============================================================


class WebhookEvent(Base):
    """Durable record of incoming HubSpot webhook events.

    Raw payload is preserved for replay and debugging. Processing is
    tracked through status transitions.
    """

    __tablename__ = "webhook_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )
    hubspot_event_id: Mapped[str] = mapped_column(String(128), nullable=False)
    event_type: Mapped[str] = mapped_column(String(128), nullable=False)
    subscription_type: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    object_type: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    object_id: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    raw_payload: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    idempotency_key: Mapped[str] = mapped_column(
        String(256), nullable=False, unique=True
    )
    status: Mapped[str] = mapped_column(
        String(32), nullable=False, default="received"
    )
    retry_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    received_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    processed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    __table_args__ = (
        Index("ix_webhook_tenant_status", "tenant_id", "status"),
        Index("ix_webhook_tenant_event_type", "tenant_id", "event_type"),
    )


# ============================================================
# Audit Trail
# ============================================================


class AuditEvent(Base):
    """Immutable audit log entry.

    Every significant action — installations, token operations, analyses,
    recommendations, approvals, CRM writes — is recorded here.
    """

    __tablename__ = "audit_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    actor: Mapped[str] = mapped_column(String(256), nullable=False)
    actor_type: Mapped[str] = mapped_column(
        String(32), nullable=False, default="system"
    )  # system, user, webhook
    action: Mapped[str] = mapped_column(String(128), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(64), nullable=False)
    resource_id: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    details: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)
    trace_id: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )

    __table_args__ = (
        Index("ix_audit_tenant_action", "tenant_id", "action"),
        Index("ix_audit_tenant_resource", "tenant_id", "resource_type", "resource_id"),
        Index("ix_audit_created_at", "tenant_id", "created_at"),
    )

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="audit_events")
