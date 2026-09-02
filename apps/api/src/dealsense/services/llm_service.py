"""DealSense API — LLM Intelligence & Structured Extraction Service.

Extracts MEDDICC qualification analysis, synthesizes deal risk explanations,
and enforces abstention policies when evidence is weak.
"""

import json
from typing import Literal

import structlog
from openai import AsyncOpenAI
from prompts import (
    MEDDICC_EXTRACTION_SYSTEM_PROMPT,
    MEDDICC_EXTRACTION_USER_TEMPLATE,
)
from pydantic import BaseModel, Field

from dealsense.config import get_settings
from dealsense.domain.exceptions import LLMExtractionError

logger = structlog.get_logger(__name__)


class MEDDICCComponent(BaseModel):
    """Single MEDDICC dimension status and evidence."""

    status: Literal["confirmed", "partial", "unidentified", "at_risk"] = "unidentified"
    summary: str = ""
    evidence_quotes: list[str] = Field(default_factory=list)
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class MEDDICCExtractionResult(BaseModel):
    """Complete MEDDICC qualification framework evaluation."""

    metrics: MEDDICCComponent = Field(default_factory=MEDDICCComponent)
    economic_buyer: MEDDICCComponent = Field(default_factory=MEDDICCComponent)
    decision_criteria: MEDDICCComponent = Field(default_factory=MEDDICCComponent)
    decision_process: MEDDICCComponent = Field(default_factory=MEDDICCComponent)
    identify_pain: MEDDICCComponent = Field(default_factory=MEDDICCComponent)
    champion: MEDDICCComponent = Field(default_factory=MEDDICCComponent)
    competition: MEDDICCComponent = Field(default_factory=MEDDICCComponent)
    overall_qualification_score: int = Field(default=0, ge=0, le=100)
    extraction_confidence: float = Field(default=0.0, ge=0.0, le=1.0)


async def extract_meddicc_analysis(
    deal_name: str,
    stage: str,
    amount: float | None,
    owner_name: str | None,
    evidence_texts: list[str],
) -> MEDDICCExtractionResult:
    """Extract structured MEDDICC qualification from deal evidence using LLM.

    Args:
        deal_name: Name of the deal
        stage: Pipeline stage
        amount: Deal amount
        owner_name: Rep / Owner name
        evidence_texts: List of relevant activity text snippets

    Returns:
        MEDDICCExtractionResult with validated structured fields
    """
    settings = get_settings()

    # Abstention policy: If no evidence exists at all, return unidentified directly
    if not evidence_texts:
        logger.info("meddicc_abstaining_no_evidence", deal_name=deal_name)
        return MEDDICCExtractionResult(
            overall_qualification_score=0,
            extraction_confidence=0.0,
        )

    formatted_evidence = "\n---\n".join(
        [f"[Evidence {i + 1}]: {t}" for i, t in enumerate(evidence_texts)]
    )

    user_prompt = MEDDICC_EXTRACTION_USER_TEMPLATE.format(
        deal_name=deal_name,
        stage=stage,
        amount=f"${amount:,.0f}" if amount else "Unset",
        owner_name=owner_name or "Unassigned",
        evidence_text=formatted_evidence,
    )

    if not settings.openai_api_key:
        logger.warning("openai_api_key_unset_returning_heuristic_meddicc")
        return MEDDICCExtractionResult(
            identify_pain=MEDDICCComponent(
                status="partial", summary="Extracted from initial notes", confidence=0.6
            ),
            champion=MEDDICCComponent(
                status="partial", summary="Main point of contact identified", confidence=0.5
            ),
            overall_qualification_score=35,
            extraction_confidence=0.5,
        )

    client = AsyncOpenAI(api_key=settings.openai_api_key)

    try:
        response = await client.chat.completions.create(
            model=settings.llm_model,
            messages=[
                {"role": "system", "content": MEDDICC_EXTRACTION_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=settings.llm_temperature,
            max_tokens=settings.llm_max_tokens,
        )

        content = response.choices[0].message.content or "{}"
        parsed_json = json.loads(content)
        return MEDDICCExtractionResult.model_validate(parsed_json)

    except Exception as e:
        logger.error("meddicc_extraction_failed", error=str(e))
        raise LLMExtractionError(f"MEDDICC extraction failed: {e}") from e
