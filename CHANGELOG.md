# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Enterprise GitHub Dev Rigour configuration (Templates, contributing guidelines, code of conduct, security policy).
- Dual-mode authentication (Single-Server API Key vs. Demo Mock tenant).
- Complete DealSense Native HubSpot CRM UI extension with updated risk indicators.
- FastAPI multi-tenancy middleware (`TenantGuardMiddleware`).

### Changed
- Refactored `deals.py` to firmly separate Demo mock responses from live PostgreSQL queries.
- Cleaned up the root directory and archived old scratch scripts.
