---
type: Note
status: active
_organized: true
tags:
  - qms
  - website
description: "Homepage of the QMS_controls site — controlled documents published from the vault"
---
# QMS_controls

This is the controlled-document half of the demo. It publishes every vault note that **QMS_demo does not** — policies, procedures, work instructions, records, audits, CAPAs, registers, ISO clause notes, templates and reference material.

> **Analogy:** QMS_demo is the training manual; this is the filing cabinet. Both are printed from the same kind of Markdown notes, but each site has its own repository, configuration and address.

## Where to start

| Area | Entry point |
|---|---|
| Quality policy | [[POL-QUAL-001]] |
| Procedures | [[SOP-QA-001]] |
| Work instructions | [[WI-PROD-003]] |
| Records | [[TRAIN-REC-2026-07]] |
| Audits and findings | [[AUDIT-2026-Q1]] |
| CAPA | [[CAPA-2026-001]] |
| Registers | [[document-master.sheet]] |
| ISO 9001 clause map | [[iso-9001-map]] |

## The other half

Looking for the step-by-step onboarding guides? [[00-start-here|Open QMS_demo →]] — that link leaves this site and opens the companion website.

Links that end in "↗" go to the other site. Links marked "(not published)" point to a note that exists in the vault but is outside this site's scope.

## What works here

Wikilinks resolve within this site and across to QMS_demo. Mermaid diagrams render as SVGs in both themes, and every diagram has an **Expand overview** button. Search is local to the browser and indexes only this site's pages.

## How to update this site

1. Edit a note in the `qms-controls` vault.
2. Commit and push to `main`.
3. GitHub Actions rebuilds and republishes in about two minutes.

The two sites are independent: a change here does not rebuild QMS_demo, and vice versa.
