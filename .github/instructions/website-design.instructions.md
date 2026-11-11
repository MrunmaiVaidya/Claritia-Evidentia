---
description: "Use when creating or editing this website's HTML, CSS, layout, navigation, imagery, or visual components. Apply the project's premium forensic consultancy design system."
name: "Forensic Website Design System"
applyTo: "**/*.html"
---

# Website design requirements

- Read and follow the root `DESIGN-SYSTEM.md` before changing website markup or styles.
- Keep the primary identity as **Mrunmai S. Vaidya**, Forensic Document & Fingerprint Expert. Never substitute a laboratory or “MSV Forensics” brand.
- Match the reference direction: cinematic forensic imagery, charcoal and matte-black surfaces, white and silver type, fine rules, and restrained scientific details. Do not introduce bright blue or unrelated accent colors.
- Keep typography simple: Playfair Display for editorial headings and Inter for all interface/body text. Follow the five-step size scale in `DESIGN-SYSTEM.md`; do not add one-off sizes or introduce a third typeface.
- Preserve the full-bleed hero using the local `Forensic Fingerprint Analysis Bench.png` asset. Keep text left-aligned over a legible dark overlay and preserve the image's aspect ratio and forensic details.
- Keep the sticky, responsive navigation and preserve the Home, About Me, Services, Freelance Services, Online Consultation, Resources, and Contact destinations.
- Keep exactly four core service categories: Handwriting & Signature Examination; Fingerprint Examination & Comparison; Forensic Consultation; and PCC & International Fingerprint Card Assistance. Do not add a Personal & Legal Forensic Reports category. Keep two cards per row on desktop/tablet and one on mobile; provide working detail dialogs and enquiry actions.
- Keep the PCC detail's four independently clickable format dialogs: FBI FD-258, FBI FD-1164, SF-87, and RCMP C-216C. Do not treat forms as interchangeable or invent blanket fingerprint/document/submission requirements; direct visitors to the relevant authority's latest instructions.
- Keep the professional disclaimer visible: PCCs and official clearances are issued only by competent government authorities, and application assistance does not guarantee approval, acceptance, or issuance.
- Service and format actions must prefill the contact form. Do not claim successful submission unless the configured endpoint on `#enquiry-form` confirms success; the current static form has no endpoint configured.
- Keep all CTAs linked to real sections. Maintain semantic structure, keyboard focus, accessible labels, reduced-motion support, readable contrast, and mobile layouts without horizontal overflow.
- Reuse existing dependencies and assets. Do not add a framework or generate replacement forensic imagery for visual decoration.
- Verify anchor targets, local image loading, and desktop/mobile appearance after changes.
