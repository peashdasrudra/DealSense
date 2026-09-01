# DealSense — Versioned Prompt Templates

This package contains versioned prompt templates for LLM interactions.

## Structure

```
prompts/
├── v1/
│   ├── extraction.py       # MEDDICC field extraction
│   ├── recommendation.py   # Next-best-action generation
│   ├── explanation.py      # Risk explanation
│   └── methodology.py      # Sales methodology mapping
└── registry.py             # Prompt version registry
```

## Versioning Policy

- Every prompt template has a version identifier (e.g., `v1.0.0`).
- Prompt changes create new versions; old versions are preserved.
- The evaluation suite runs against both old and new versions before deployment.
- Production uses the version specified in tenant configuration.
