"""DealSense Tests — conftest.py"""

import os
import sys
from pathlib import Path

# Add monorepo paths to sys.path
root_dir = Path(__file__).resolve().parent.parent.parent.parent.parent
worker_src = root_dir / "apps" / "worker" / "src"
scoring_src = root_dir / "packages" / "scoring" / "src"

if str(worker_src) not in sys.path:
    sys.path.insert(0, str(worker_src))
if str(scoring_src) not in sys.path:
    sys.path.insert(0, str(scoring_src))

# Set test environment variables before any app imports
os.environ.setdefault("APP_ENV", "development")
os.environ.setdefault("SECRET_KEY", "test-secret-key-minimum-32-characters-long-for-testing")
os.environ.setdefault("ENCRYPTION_KEY", "")
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://test:test@localhost:5432/test")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")
