# Contributing to DealSense

First off, thank you for considering contributing to DealSense! It's people like you that make this platform such a great tool. 

## 1. Local Development Setup

To run DealSense locally, you'll need Node.js (v18+), Python (3.11+), and PostgreSQL installed. 

### API Backend
1. Navigate to the `apps/api` directory.
2. Create a virtual environment: `python -m venv .venv`
3. Activate it: `source .venv/bin/activate` (or `.venv\Scripts\activate` on Windows).
4. Install dependencies: `pip install -e ".[dev]"`
5. Set up your `.env` file based on `.env.example`.
6. Run the server: `uvicorn dealsense.main:app --reload`

### Web Dashboard
1. Navigate to the `apps/web-dashboard` directory.
2. Install dependencies: `pnpm install`
3. Start the dev server: `pnpm dev`

## 2. Code Standards and Linting

We enforce strict linting to maintain a top 1% developer repository.

- **Python**: We use `ruff` for linting and formatting, and `mypy` for static type checking. Run `make lint` from the root directory to verify your changes.
- **TypeScript**: We use `eslint` and `prettier`. Run `pnpm lint` in the respective frontend directories.

## 3. Pull Request Process

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. Ensure the test suite passes.
4. Make sure your code lints correctly.
5. Issue that pull request! Please use the provided PR template to describe your changes.

## 4. Community

By participating in this project, you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).
