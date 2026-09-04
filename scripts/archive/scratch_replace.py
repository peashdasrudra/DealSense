import os

path = 'apps/web-dashboard/src/pages/HubSpotNativePipeline.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'var(--hs-background)': '#ffffff',
    'var(--hs-border-dark)': '#dfe3eb',
    'var(--hs-border)': '#dfe3eb',
    'var(--hs-text-muted)': '#516f90',
    'var(--hs-text)': '#33475b',
    'background: "#092124"': 'background: "#f5f8fa"',
    'background: "#0f172a"': 'background: "#f5f8fa"',
    'background: "#1e293b"': 'background: "#ffffff"',
    'color: "#ffffff"': 'color: "#33475b"',
    'color: "#f8fafc"': 'color: "#33475b"',
    'color: "#94a3b8"': 'color: "#516f90"',
    'border: "1px solid rgba(255,255,255,0.1)"': 'border: "1px solid #dfe3eb"',
    'border: "1px solid rgba(255,255,255,0.05)"': 'border: "1px solid #dfe3eb"',
    'var(--danger)': '#f2545b',
    'var(--warning)': '#f5c26b',
    'var(--success)': '#00bda5',
    'var(--hs-primary)': '#ff7a59',
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
