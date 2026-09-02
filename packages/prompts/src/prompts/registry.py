"""DealSense Prompts — Version Registry."""

PROMPT_VERSIONS: dict[str, str] = {
    "meddicc_extraction": "v1.0.0",
    "risk_explanation": "v1.0.0",
    "recommendations": "v1.0.0",
}


def get_prompt_version(prompt_name: str) -> str:
    """Get the active version string for a prompt template."""
    return PROMPT_VERSIONS.get(prompt_name, "v1.0.0")
