#!/usr/bin/env python3
"""DealSense — HubSpot Developer Test Account Data Seeder.

Populates your HubSpot Developer Test Account with realistic enterprise CRM data
for live interview demonstrations. Creates:
- 15 enterprise deals across all pipeline stages
- 20 contacts with realistic C-suite titles
- 8 companies (enterprise names)
- Activity history (notes, tasks) associated with deals

Usage:
    # Set your HubSpot access token (from Developer Test Account)
    export HUBSPOT_ACCESS_TOKEN="pat-na1-..."

    # Run the seeder
    python scripts/demo/seed_hubspot_test_data.py

Requirements:
    pip install httpx
"""

import asyncio
import json
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

# Ensure UTF-8 output encoding on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

try:
    import httpx
except ImportError:
    print("ERROR: httpx is required. Install with: pip install httpx")
    sys.exit(1)

HUBSPOT_API_BASE = "https://api.hubapi.com"

# ── Enterprise Companies ──────────────────────────────────────────────────────

COMPANIES = [
    {"name": "Meridian Technologies", "domain": "meridiantech.com", "industry": "TECHNOLOGY", "numberofemployees": "2500", "city": "San Francisco", "state": "California"},
    {"name": "Atlas Digital Holdings", "domain": "atlasdigital.io", "industry": "TECHNOLOGY", "numberofemployees": "800", "city": "New York", "state": "New York"},
    {"name": "Pinnacle Financial Systems", "domain": "pinnaclefin.com", "industry": "FINANCE", "numberofemployees": "4200", "city": "Chicago", "state": "Illinois"},
    {"name": "Vertex Cloud Solutions", "domain": "vertexcloud.co", "industry": "TECHNOLOGY", "numberofemployees": "1200", "city": "Austin", "state": "Texas"},
    {"name": "Catalyst Pharmaceuticals", "domain": "catalystrx.com", "industry": "LIFE_SCIENCES", "numberofemployees": "6800", "city": "Boston", "state": "Massachusetts"},
    {"name": "Horizon Manufacturing Group", "domain": "horizonmfg.com", "industry": "MANUFACTURING", "numberofemployees": "3500", "city": "Detroit", "state": "Michigan"},
    {"name": "Nexus Analytics Corp", "domain": "nexusanalytics.ai", "industry": "TECHNOLOGY", "numberofemployees": "450", "city": "Seattle", "state": "Washington"},
    {"name": "Sterling Retail Partners", "domain": "sterlingretail.com", "industry": "RETAIL", "numberofemployees": "9200", "city": "Dallas", "state": "Texas"},
]

# ── Enterprise Contacts ───────────────────────────────────────────────────────

CONTACTS = [
    {"firstname": "Victoria", "lastname": "Chen", "email": "v.chen@meridiantech.com", "jobtitle": "Chief Technology Officer", "company": "Meridian Technologies"},
    {"firstname": "Marcus", "lastname": "Rodriguez", "email": "m.rodriguez@meridiantech.com", "jobtitle": "VP of Engineering", "company": "Meridian Technologies"},
    {"firstname": "Sarah", "lastname": "Mitchell", "email": "s.mitchell@atlasdigital.io", "jobtitle": "Chief Financial Officer", "company": "Atlas Digital Holdings"},
    {"firstname": "James", "lastname": "Park", "email": "j.park@atlasdigital.io", "jobtitle": "Director of Operations", "company": "Atlas Digital Holdings"},
    {"firstname": "Elena", "lastname": "Vasquez", "email": "e.vasquez@pinnaclefin.com", "jobtitle": "SVP of Technology", "company": "Pinnacle Financial Systems"},
    {"firstname": "David", "lastname": "Okafor", "email": "d.okafor@pinnaclefin.com", "jobtitle": "Chief Information Security Officer", "company": "Pinnacle Financial Systems"},
    {"firstname": "Rachel", "lastname": "Kim", "email": "r.kim@vertexcloud.co", "jobtitle": "VP of Cloud Infrastructure", "company": "Vertex Cloud Solutions"},
    {"firstname": "Thomas", "lastname": "Weber", "email": "t.weber@vertexcloud.co", "jobtitle": "Director of Platform Engineering", "company": "Vertex Cloud Solutions"},
    {"firstname": "Amanda", "lastname": "Foster", "email": "a.foster@catalystrx.com", "jobtitle": "Chief Digital Officer", "company": "Catalyst Pharmaceuticals"},
    {"firstname": "Robert", "lastname": "Nakamura", "email": "r.nakamura@catalystrx.com", "jobtitle": "VP of Data Science", "company": "Catalyst Pharmaceuticals"},
    {"firstname": "Jennifer", "lastname": "Daniels", "email": "j.daniels@catalystrx.com", "jobtitle": "General Counsel", "company": "Catalyst Pharmaceuticals"},
    {"firstname": "Michael", "lastname": "Santos", "email": "m.santos@horizonmfg.com", "jobtitle": "Chief Operating Officer", "company": "Horizon Manufacturing Group"},
    {"firstname": "Lisa", "lastname": "Andersson", "email": "l.andersson@horizonmfg.com", "jobtitle": "VP of Digital Transformation", "company": "Horizon Manufacturing Group"},
    {"firstname": "Kevin", "lastname": "Patel", "email": "k.patel@nexusanalytics.ai", "jobtitle": "CEO & Co-Founder", "company": "Nexus Analytics Corp"},
    {"firstname": "Sophia", "lastname": "Torres", "email": "s.torres@nexusanalytics.ai", "jobtitle": "Head of Product", "company": "Nexus Analytics Corp"},
    {"firstname": "Daniel", "lastname": "Cho", "email": "d.cho@nexusanalytics.ai", "jobtitle": "VP of Engineering", "company": "Nexus Analytics Corp"},
    {"firstname": "Catherine", "lastname": "Wells", "email": "c.wells@sterlingretail.com", "jobtitle": "Chief Revenue Officer", "company": "Sterling Retail Partners"},
    {"firstname": "Andrew", "lastname": "Bennett", "email": "a.bennett@sterlingretail.com", "jobtitle": "SVP of E-Commerce", "company": "Sterling Retail Partners"},
    {"firstname": "Maria", "lastname": "Gonzalez", "email": "m.gonzalez@sterlingretail.com", "jobtitle": "Director of IT", "company": "Sterling Retail Partners"},
    {"firstname": "Chris", "lastname": "Thompson", "email": "c.thompson@sterlingretail.com", "jobtitle": "VP of Supply Chain", "company": "Sterling Retail Partners"},
]

# ── Enterprise Deals ──────────────────────────────────────────────────────────

DEALS = [
    {"dealname": "Meridian Cloud Migration Suite", "amount": "850000", "dealstage": "contractsent", "pipeline": "default", "closedate_offset_days": 14, "description": "Enterprise-wide cloud migration from on-prem to multi-cloud (AWS + GCP)."},
    {"dealname": "Atlas Digital Analytics Platform", "amount": "420000", "dealstage": "qualifiedtobuy", "pipeline": "default", "closedate_offset_days": 45, "description": "Real-time analytics dashboard and data warehouse modernization."},
    {"dealname": "Pinnacle Compliance Automation", "amount": "1200000", "dealstage": "presentationscheduled", "pipeline": "default", "closedate_offset_days": 60, "description": "SOX and PCI-DSS compliance automation for global financial operations."},
    {"dealname": "Vertex Multi-Cloud Orchestrator", "amount": "680000", "dealstage": "decisionmakerboughtin", "pipeline": "default", "closedate_offset_days": 21, "description": "Kubernetes orchestration across AWS, Azure, and GCP with unified control plane."},
    {"dealname": "Catalyst Clinical Data Lake", "amount": "1500000", "dealstage": "appointmentscheduled", "pipeline": "default", "closedate_offset_days": 90, "description": "HIPAA-compliant clinical trial data lake with real-time analytics."},
    {"dealname": "Horizon Industry 4.0 IoT Platform", "amount": "950000", "dealstage": "presentationscheduled", "pipeline": "default", "closedate_offset_days": 55, "description": "IoT sensor integration and predictive maintenance for manufacturing lines."},
    {"dealname": "Nexus ML Pipeline Accelerator", "amount": "320000", "dealstage": "contractsent", "pipeline": "default", "closedate_offset_days": 7, "description": "End-to-end ML pipeline with automated feature engineering and model serving."},
    {"dealname": "Sterling Omnichannel Personalization", "amount": "780000", "dealstage": "qualifiedtobuy", "pipeline": "default", "closedate_offset_days": 35, "description": "AI-powered personalization engine across web, mobile, and in-store."},
    {"dealname": "Meridian Security Operations Center", "amount": "1100000", "dealstage": "closedwon", "pipeline": "default", "closedate_offset_days": -30, "description": "24/7 managed SOC with SIEM integration and automated incident response."},
    {"dealname": "Atlas DevOps Transformation", "amount": "280000", "dealstage": "appointmentscheduled", "pipeline": "default", "closedate_offset_days": 75, "description": "CI/CD pipeline modernization with GitOps and progressive delivery."},
    {"dealname": "Pinnacle Fraud Detection AI", "amount": "2200000", "dealstage": "decisionmakerboughtin", "pipeline": "default", "closedate_offset_days": 28, "description": "Real-time fraud detection using ensemble ML models and graph analytics."},
    {"dealname": "Vertex Disaster Recovery Suite", "amount": "540000", "dealstage": "closedlost", "pipeline": "default", "closedate_offset_days": -15, "description": "Multi-region disaster recovery with sub-15min RPO/RTO guarantees."},
    {"dealname": "Catalyst Digital Twin Platform", "amount": "1800000", "dealstage": "presentationscheduled", "pipeline": "default", "closedate_offset_days": 50, "description": "Digital twin simulation for pharmaceutical manufacturing processes."},
    {"dealname": "Horizon Supply Chain Visibility", "amount": "620000", "dealstage": "qualifiedtobuy", "pipeline": "default", "closedate_offset_days": 40, "description": "End-to-end supply chain visibility with predictive disruption alerts."},
    {"dealname": "Sterling Customer 360 Integration", "amount": "890000", "dealstage": "contractsent", "pipeline": "default", "closedate_offset_days": 10, "description": "Unified customer profile across POS, e-commerce, loyalty, and CRM systems."},
]


class HubSpotSeeder:
    """Seeds a HubSpot Developer Test Account with realistic enterprise data."""

    def __init__(self, access_token: str) -> None:
        self.access_token = access_token
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
        self.client = httpx.AsyncClient(
            base_url=HUBSPOT_API_BASE,
            headers=self.headers,
            timeout=30.0,
        )
        self.created_companies: dict[str, str] = {}  # name -> id
        self.created_contacts: dict[str, str] = {}  # email -> id
        self.created_deals: dict[str, str] = {}  # name -> id

    async def close(self) -> None:
        await self.client.aclose()

    async def _create_object(self, object_type: str, properties: dict[str, Any]) -> str | None:
        """Create a single HubSpot CRM object."""
        try:
            response = await self.client.post(
                f"/crm/v3/objects/{object_type}",
                json={"properties": properties},
            )
            if response.status_code in (200, 201):
                obj_id = response.json()["id"]
                print(f"  ✅ Created {object_type}: {properties.get('dealname') or properties.get('name') or properties.get('email')} (ID: {obj_id})")
                return obj_id
            elif response.status_code == 409:
                print(f"  ⏭️  Already exists: {properties.get('dealname') or properties.get('name') or properties.get('email')}")
                return None
            else:
                print(f"  ❌ Failed ({response.status_code}): {response.text[:200]}")
                return None
        except Exception as e:
            print(f"  ❌ Error: {e}")
            return None

    async def _associate(self, from_type: str, from_id: str, to_type: str, to_id: str, assoc_type: str) -> None:
        """Create an association between two objects."""
        try:
            response = await self.client.put(
                f"/crm/v3/objects/{from_type}/{from_id}/associations/{to_type}/{to_id}/{assoc_type}",
            )
            if response.status_code in (200, 201, 204):
                print(f"    🔗 Associated {from_type}:{from_id} → {to_type}:{to_id}")
        except Exception:
            pass

    async def _create_note(self, deal_id: str, body: str) -> None:
        """Create a note associated with a deal."""
        try:
            response = await self.client.post(
                "/crm/v3/objects/notes",
                json={
                    "properties": {
                        "hs_timestamp": datetime.now(timezone.utc).isoformat(),
                        "hs_note_body": body,
                    },
                },
            )
            if response.status_code in (200, 201):
                note_id = response.json()["id"]
                await self._associate("notes", note_id, "deals", deal_id, "note_to_deal")
        except Exception:
            pass

    async def seed_companies(self) -> None:
        """Create all enterprise companies."""
        print("\n📦 Creating Companies...")
        for company in COMPANIES:
            obj_id = await self._create_object("companies", company)
            if obj_id:
                self.created_companies[company["name"]] = obj_id
            await asyncio.sleep(0.15)  # Rate limit courtesy

    async def seed_contacts(self) -> None:
        """Create all enterprise contacts."""
        print("\n👥 Creating Contacts...")
        for contact in CONTACTS:
            obj_id = await self._create_object("contacts", contact)
            if obj_id:
                self.created_contacts[contact["email"]] = obj_id

                # Associate contact with company
                company_name = contact.get("company", "")
                if company_name in self.created_companies:
                    await self._associate(
                        "contacts", obj_id,
                        "companies", self.created_companies[company_name],
                        "contact_to_company",
                    )
            await asyncio.sleep(0.15)

    async def seed_deals(self) -> None:
        """Create all enterprise deals with close dates and notes."""
        print("\n💼 Creating Deals...")
        now = datetime.now(timezone.utc)

        for deal in DEALS:
            close_date = now + timedelta(days=deal["closedate_offset_days"])
            properties = {
                "dealname": deal["dealname"],
                "amount": deal["amount"],
                "dealstage": deal["dealstage"],
                "pipeline": deal["pipeline"],
                "closedate": close_date.strftime("%Y-%m-%d"),
                "description": deal["description"],
            }
            obj_id = await self._create_object("deals", properties)
            if obj_id:
                self.created_deals[deal["dealname"]] = obj_id

                # Create engagement notes for each deal
                await self._create_note(obj_id, f"Initial discovery meeting completed. {deal['description']}")
                await self._create_note(obj_id, f"Follow-up: Technical requirements gathered. Preparing proposal for ${int(deal['amount']):,} engagement.")

            await asyncio.sleep(0.2)

    async def seed_associations(self) -> None:
        """Associate deals with contacts and companies."""
        print("\n🔗 Creating Deal Associations...")

        # Map deals to contacts/companies based on company names in deal names
        deal_company_map = {
            "Meridian": "Meridian Technologies",
            "Atlas": "Atlas Digital Holdings",
            "Pinnacle": "Pinnacle Financial Systems",
            "Vertex": "Vertex Cloud Solutions",
            "Catalyst": "Catalyst Pharmaceuticals",
            "Horizon": "Horizon Manufacturing Group",
            "Nexus": "Nexus Analytics Corp",
            "Sterling": "Sterling Retail Partners",
        }

        for deal_name, deal_id in self.created_deals.items():
            for prefix, company_name in deal_company_map.items():
                if prefix in deal_name:
                    # Associate deal with company
                    if company_name in self.created_companies:
                        await self._associate(
                            "deals", deal_id,
                            "companies", self.created_companies[company_name],
                            "deal_to_company",
                        )

                    # Associate deal with contacts from the same company
                    for contact in CONTACTS:
                        if contact.get("company") == company_name:
                            email = contact["email"]
                            if email in self.created_contacts:
                                await self._associate(
                                    "deals", deal_id,
                                    "contacts", self.created_contacts[email],
                                    "deal_to_contact",
                                )
                    break
            await asyncio.sleep(0.1)

    async def run(self) -> None:
        """Execute the full seeding pipeline."""
        print("=" * 60)
        print("🌱 DealSense — HubSpot Test Account Data Seeder")
        print("=" * 60)

        # Verify token
        print("\n🔑 Verifying HubSpot access token...")
        try:
            response = await self.client.get(f"/oauth/v1/access-tokens/{self.access_token}")
            if response.status_code == 200:
                info = response.json()
                print(f"  ✅ Authenticated — Portal ID: {info.get('hub_id')}")
                print(f"  📋 Scopes: {', '.join(info.get('scopes', []))}")
            else:
                print(f"  ⚠️  Token info check returned {response.status_code}, proceeding anyway...")
        except Exception as e:
            print(f"  ⚠️  Token verification skipped: {e}")

        await self.seed_companies()
        await self.seed_contacts()
        await self.seed_deals()
        await self.seed_associations()

        print("\n" + "=" * 60)
        print("✅ Seeding Complete!")
        print(f"  📦 Companies: {len(self.created_companies)}")
        print(f"  👥 Contacts:  {len(self.created_contacts)}")
        print(f"  💼 Deals:     {len(self.created_deals)}")
        print("=" * 60)


async def main() -> None:
    # Auto-load .env if present
    root_dir = Path(__file__).resolve().parent.parent.parent
    env_file = root_dir / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())

    token = os.environ.get("HUBSPOT_ACCESS_TOKEN")
    if not token:
        print("ERROR: Set HUBSPOT_ACCESS_TOKEN environment variable (or put in .env).")
        print("  Get it from: https://app.hubspot.com/developer → Your App → Auth")
        print("  Or use your Developer Test Account personal access key.")
        sys.exit(1)

    seeder = HubSpotSeeder(token)
    try:
        await seeder.run()
    finally:
        await seeder.close()


if __name__ == "__main__":
    asyncio.run(main())
