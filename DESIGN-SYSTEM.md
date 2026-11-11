# Mrunmai S. Vaidya Website Design System

This is the visual source of truth for the independent forensic consultancy website. Read it before changing the homepage or introducing new site components. The reference direction is the supplied Figma screenshot: a premium forensic identity, dark cinematic imagery, fine silver rules, editorial serif typography, and restrained scientific detail.

## Brand

- **Primary identity:** MRUNMAI S. VAIDYA
- **Professional title:** Forensic Document & Fingerprint Expert
- **Professional identity:** Independent Forensic Freelancer | Online Advisor | Consultant
- Do not use “MSV Forensics” or a laboratory brand as the primary identity.
- Communicate independence, evidence-led work, clarity, integrity, and discretion. Do not invent credentials, accreditation, case history, or legal guarantees.

## Visual principles

- Premium, composed, editorial, and internationally professional.
- Use a dark forensic photographic hero with a readable charcoal overlay.
- Use subtle scientific grids, fingerprint motifs, geometric framing, and fine divider lines sparingly.
- Prefer generous negative space and deliberate alignment over decorative clutter.
- Keep interactions quiet: short transitions, subtle hover treatments, visible focus, and no autoplay or attention-seeking animation.
- Maintain the original forensic image asset and its detail. Do not regenerate, recolor, distort, or unnecessarily crop it.

## Color tokens

| Token | Value | Use |
|---|---|---|
| `--page` | `#101216` | Main page and darkest surfaces |
| `--surface` | `#17191E` | Alternating section backgrounds |
| `--surface-raised` | `#1D2026` | Cards, panels, and raised controls |
| `--text` | `#FFFFFF` | Main headings and primary text |
| `--muted` | `#BFC3CA` | Body text and secondary information |
| `--silver` | `#AEB4BD` | Icons, emphasis, borders, and highlights |
| Fine rule | `rgba(190, 196, 205, .18)` | Subtle panel and section separators |

Use the neutral palette as the interface foundation. Avoid bright blue, saturated accents, gold, and colorful gradients. A restrained silver gradient is acceptable for primary actions only.

## Typography

- Use only two font families: **Playfair Display** for the name and editorial headings, and **Inter** for navigation, body copy, buttons, labels, and controls.
- Keep a restrained five-step size scale: **60px** hero name (responsive), **32px** section heading, **20px** card heading, **16px** body text, and **13px** compact labels/navigation.
- Use 15px for dense card descriptions and 14px for compact footer content. Do not mix in extra one-off text sizes.
- Reserve italics and uppercase letter spacing for a few editorial moments, such as the professional title and section eyebrow.
- Keep line lengths comfortable and body contrast high. Never use tiny text for essential information.

## Layout and responsive behavior

- Keep the sticky navigation compact. On wide desktop, show the full horizontal navigation; on narrower viewports, show an accessible dropdown menu.
- The hero follows the reference: full-bleed forensic imagery, text aligned left, cinematic charcoal shading, and vertically centered content. On small screens, retain legible left-aligned text and a sufficiently dark image overlay.
- Preserve the section order and useful anchors: Home, About Me, Services, Freelance Services, Online Consultation, Resources, and Contact.
- Use a centered content width of approximately 1160px, generous vertical section spacing, and consistent horizontal gutters.
- Service and process cards use a restrained two-tone dark surface with fine silver borders, modest radii, and low-contrast shadows.
- Stack multi-column content at narrow widths. Prevent horizontal scrolling, clipped labels, or controls wider than the viewport.
- The values strip after the hero presents Accuracy, Integrity, Expertise, and Confidentiality.

## Components

### Navigation

- Brand lockup: framed fingerprint mark, full professional name, and professional title.
- Sticky matte-black header with a fine silver bottom rule.
- Use understated serif navigation links with clear hover and keyboard-focus states.
- Ensure every link targets a real, unique in-page ID; offset anchor scrolling for the sticky header.

### Hero actions

- Labels: **Explore My Services**, **Book a Consultation**, **Contact Me**.
- Connect to the Services, Online Consultation, and Contact sections respectively.
- Use pill-shaped silver primary action and charcoal/silver-outline secondary actions, with small functional icons.
- Use semantic anchors for navigation and provide accessible names for icon-only controls.

### Sections, cards, and forms

- Alternate `--page` and `--surface` backgrounds to create rhythm without light panels.
- Use `--surface-raised` for service cards and consult panels, with a thin silver border.
- The Services section contains exactly four core categories: Handwriting & Signature Examination; Fingerprint Examination & Comparison; Forensic Consultation; and PCC & International Fingerprint Card Assistance. Do not add a Personal & Legal Forensic Reports category.
- Keep the four service cards in a two-column grid on desktop/tablet and one column on mobile. Each card has a service number, restrained silver icon illustration, concise summary, 3–5 highlights, and a functional service-detail or enquiry action.
- The PCC service detail contains four distinct, clickable format cards: FBI FD-258, FBI FD-1164, SF-87, and RCMP C-216C. Keep their purposes and issuing/requesting workflows distinct. Explain that rolled/plain impression, identity-document, collector, and submission requirements depend on the exact current instructions from the receiving authority; link to official guidance and do not invent universal requirements.
- Keep the service disclaimer visible: services are independent and subject to material, competence, and applicable requirements; only competent government authorities issue PCCs/official clearances; assistance does not guarantee approval, acceptance, or issuance.
- The contact form includes full name, email, phone, country, selected service, optional applicable card format, and a short enquiry. Service and card actions prefill the form. Do not report a successful submission unless a configured endpoint returns success. The current static form has no endpoint; configure `data-endpoint` on `#enquiry-form` before representing it as live.
- Inputs should use dark surfaces, light text, visible focus rings, and explicitly associated labels. Do not invite visitors to upload sensitive evidence before a secure submission process is agreed.
- Keep existing content and functions unless a user explicitly requests a content or behavior change.

## Image handling

- The hero backdrop is `Forensic Fingerprint Analysis Bench.png`, served as a local, relative asset.
- Keep the forensic subject visible on the right and place a dark gradient behind left-aligned text.
- Use `background-size: cover` only for the cinematic hero backdrop. For standalone images, preserve aspect ratio and use `object-fit: contain` unless cropping is explicitly intended.
- Keep meaningful `alt` text for informative images. Use empty alt text or a CSS background for purely decorative imagery.
- Do not replace the artwork with a generated illustration or remote stock image.

## Accessibility and performance

- Preserve semantic heading order, landmarks, descriptive link text, and keyboard navigation.
- Maintain WCAG-friendly contrast, focus visibility, reduced-motion support, and touch targets around 44px.
- Keep the mobile menu keyboard-accessible and expose its expanded state through native disclosure behavior or an equivalent accessible control.
- Respect `prefers-reduced-motion`.
- Avoid adding dependencies or heavyweight scripts for decorative effects. Reuse the existing local image and established page assets.
- Verify image paths, navigation destinations, desktop/tablet/mobile layouts, and console errors after visual changes.

## Acceptance checklist

- [ ] Full name and professional title remain the primary brand.
- [ ] The page uses charcoal, black, white, and silver rather than bright blue.
- [ ] Header, hero, values strip, all current sections, forms, and footer share one coherent design language.
- [ ] Hero content is legible over the supplied image at desktop and mobile widths.
- [ ] The original hero asset loads without distortion or unintended cropping of key forensic details.
- [ ] All desktop/mobile navigation and CTA anchors resolve to unique targets.
- [ ] No horizontal overflow, broken images, inaccessible labels, or missing focus indicators.
