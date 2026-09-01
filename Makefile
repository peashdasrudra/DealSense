# ============================================================
# DealSense — Makefile
# ============================================================
# One-command development workflows
# ============================================================

.PHONY: help dev dev-build down test lint format migrate migrate-new logs clean

# Default target
help: ## Show this help message
	@echo "DealSense Development Commands"
	@echo "=============================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ---- Docker Development ----

dev: ## Start the full development stack
	docker compose -f infrastructure/docker/docker-compose.yml --env-file .env up -d
	@echo ""
	@echo "DealSense is running:"
	@echo "  API:      http://localhost:8000"
	@echo "  API Docs: http://localhost:8000/docs"
	@echo "  Postgres: localhost:5432"
	@echo "  Redis:    localhost:6379"
	@echo ""

dev-build: ## Rebuild and start the development stack
	docker compose -f infrastructure/docker/docker-compose.yml --env-file .env up -d --build

down: ## Stop all services
	docker compose -f infrastructure/docker/docker-compose.yml --env-file .env down

logs: ## Tail logs from all services
	docker compose -f infrastructure/docker/docker-compose.yml --env-file .env logs -f

logs-api: ## Tail API logs only
	docker compose -f infrastructure/docker/docker-compose.yml --env-file .env logs -f api

logs-worker: ## Tail worker logs only
	docker compose -f infrastructure/docker/docker-compose.yml --env-file .env logs -f worker

# ---- Database ----

migrate: ## Apply all pending database migrations
	cd apps/api && python -m alembic upgrade head

migrate-new: ## Create a new migration (usage: make migrate-new MSG="add_users_table")
	cd apps/api && python -m alembic revision --autogenerate -m "$(MSG)"

migrate-downgrade: ## Downgrade one migration
	cd apps/api && python -m alembic downgrade -1

migrate-history: ## Show migration history
	cd apps/api && python -m alembic history

# ---- Testing ----

test: ## Run the full test suite
	cd apps/api && python -m pytest src/tests/ -v --tb=short
	cd packages/scoring && python -m pytest tests/ -v --tb=short

test-unit: ## Run unit tests only
	cd apps/api && python -m pytest src/tests/ -v --tb=short -m unit
	cd packages/scoring && python -m pytest tests/ -v --tb=short -m unit

test-integration: ## Run integration tests (requires running services)
	cd apps/api && python -m pytest src/tests/ -v --tb=short -m integration

test-security: ## Run security tests
	cd apps/api && python -m pytest src/tests/ -v --tb=short -m security

test-cov: ## Run tests with coverage report
	cd apps/api && python -m pytest src/tests/ -v --tb=short --cov=src/dealsense --cov-report=html
	@echo "Coverage report: apps/api/htmlcov/index.html"

# ---- Code Quality ----

lint: ## Run linting and type checks
	python -m ruff check apps/api/src apps/worker/src packages/scoring/src
	python -m mypy apps/api/src/dealsense apps/worker/src/dealsense_worker packages/scoring/src

format: ## Auto-format code
	python -m ruff format apps/api/src apps/worker/src packages/scoring/src
	python -m ruff check --fix apps/api/src apps/worker/src packages/scoring/src

# ---- Utilities ----

clean: ## Remove build artifacts, caches, and temp files
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true

install: ## Install all Python dependencies for development
	cd apps/api && pip install -e ".[dev]"
	cd apps/worker && pip install -e ".[dev]"
	cd packages/scoring && pip install -e ".[dev]"

generate-key: ## Generate a Fernet encryption key for token storage
	python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
