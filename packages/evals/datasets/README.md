# DealSense — Evaluation Datasets

This directory contains labeled evaluation datasets for measuring AI quality.

## Structure

```
datasets/
├── extraction/          # MEDDICC field extraction accuracy
├── groundedness/        # Claim-to-evidence validation
├── recommendation/      # Action quality and safety
└── security/            # Prompt injection and tenant boundary tests
```

## Format

Each dataset uses JSONL (JSON Lines) format. Each line contains:
- `input`: The source content
- `expected`: The expected output
- `metadata`: Context about the test case (difficulty, edge cases, notes)

## Usage

Datasets will be populated in Batch 4–5 with 50–100 initial examples,
growing to 300–500 over time.
