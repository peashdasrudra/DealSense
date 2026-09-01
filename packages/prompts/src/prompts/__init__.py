"""DealSense Prompts Package."""

from prompts.registry import get_prompt_version
from prompts.v1.meddicc import MEDDICC_EXTRACTION_SYSTEM_PROMPT, MEDDICC_EXTRACTION_USER_TEMPLATE
from prompts.v1.recommendations import RECOMMENDATION_SYSTEM_PROMPT, RECOMMENDATION_USER_TEMPLATE

__all__ = [
    "get_prompt_version",
    "MEDDICC_EXTRACTION_SYSTEM_PROMPT",
    "MEDDICC_EXTRACTION_USER_TEMPLATE",
    "RECOMMENDATION_SYSTEM_PROMPT",
    "RECOMMENDATION_USER_TEMPLATE",
]
