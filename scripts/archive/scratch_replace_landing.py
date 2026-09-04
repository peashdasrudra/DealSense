import re

path = 'apps/web-dashboard/src/pages/LandingPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Agency Button Texts
content = content.replace('Claim Agency Discount', 'Install Free in HubSpot')
content = content.replace('Agency Partner Fleet', 'Install Free in HubSpot')
content = content.replace('👑 Agency Fleet', 'Install Free in HubSpot')

# Route to /login instead of /agency for CTAs
content = content.replace('navigate("/agency")', 'navigate("/login")')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
