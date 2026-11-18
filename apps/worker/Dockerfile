# DealSense Worker — Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

COPY apps/worker/pyproject.toml /app/
RUN pip install .

COPY apps/worker/src /app/src
COPY packages /app/packages

CMD ["python", "-m", "dealsense_worker.app"]
