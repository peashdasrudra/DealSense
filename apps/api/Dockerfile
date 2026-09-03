# ============================================================
# DealSense API — Multi-stage Dockerfile
# ============================================================

FROM python:3.12-slim AS base

# Prevent Python from writing bytecode and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq-dev \
        gcc \
    && rm -rf /var/lib/apt/lists/*

# ---- Dependencies stage ----
FROM base AS deps

COPY apps/api/pyproject.toml /app/
RUN pip install -e ".[dev]" 2>/dev/null || pip install .

# ---- Development stage ----
FROM deps AS development

COPY apps/api/src /app/src
COPY packages /app/packages

# Install packages in development mode
RUN cd /app/packages/scoring && pip install -e . 2>/dev/null || true

EXPOSE 8000

CMD ["uvicorn", "dealsense.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--reload-dir", "/app/src"]

# ---- Production stage ----
FROM base AS production

COPY apps/api/pyproject.toml /app/
RUN pip install .

COPY apps/api/src /app/src
COPY packages /app/packages

CMD ["sh", "-c", "uvicorn dealsense.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 2"]
