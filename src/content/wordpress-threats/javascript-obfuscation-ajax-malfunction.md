---
title: "c-i.icu Click-Triggered JavaScript Redirect Research"
h1: "c-i.icu Click-Triggered Redirect Script in index.php"
slug: "c-i-icu-click-redirect-script"
description: "Forensic review of an obfuscated script using c-i.icu URL arrays, click listeners, localStorage timing, and window.open behavior."
status: "published"
reportDate: "2026-02-01"
lastReviewed: "2026-07-22"
threatCategory: "Click-triggered JavaScript redirect"
affectedComponents:
  - "Theme index.php"
  - "Browser click events"
  - "Browser localStorage"
observedLocations:
  - "Observed index.php code editor view"
confirmedBehaviors:
  - "Stores multiple hex-escaped c-i.icu URLs"
  - "Registers click-event logic"
  - "Uses localStorage for timing state"
  - "References window.open and _blank"
confidence: "High"
severity: "High"
severityRationale: "The screenshot and code show redirect-oriented click handling. The former claim that this caused AJAX malfunction is not supported by the retained evidence."
evidenceSource: "Anonymized investigation with one code-editor screenshot and a retained obfuscated JavaScript sample"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/malware-in-themes-index.php_evidence-1.png"
    alt: "Code editor showing obfuscated JavaScript appended to an index.php file"
    caption: "The visible script contains _0x3023 decoding logic, hex-escaped c-i.icu strings, local-storage terms, click handling, and window opening identifiers."
    supports: "Obfuscated redirect-oriented JavaScript was appended to index.php"
    width: 1898
    height: 870
    privacyReviewed: true
indicators:
  - value: "c-i[.]icu URL array"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "_0x3023 and _0x10c8 decoder pair"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Click plus localStorage plus window.open structure"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "index.php"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "click event"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "localStorage"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "window.open()"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The screenshot does not prove a redirect occurred."
  - "No browser trace or destination response was retained."
  - "The evidence does not establish AJAX disruption, data theft, or the initial injection path."
  - "No affected theme version was confirmed."
relatedResearch:
  - "repeated-0x3023-javascript-injection"
  - "hexagoncontrail-external-script-injection"
  - "hostname-keyed-xor-javascript-loader"
relatedGuides:
  - title: "JavaScript redirect malware detection guide"
    href: "/blog/the-complete-guide-to-javascript-redirect-malware-detection-decoding-and-removal/"
  - title: "How to recognize obfuscated PHP malware"
    href: "/blog/wordpress-obfuscated-php-malware-detection/"
relatedCaseStudies:
  - title: "Mobile redirect access-log case study"
    href: "/case-studies/how-i-found-and-fixed-a-wordpress-mobile-redirect-hack-using-access-logs/"
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "redirects-popups"
    - "suspicious-files-code"
  searchDescription: "WordPress clicks open an unfamiliar tab or redirect unexpectedly? Review injected JavaScript that attached a click handler to page interactions."
  summary: "This research is useful when visitors report that clicking the site opens an unrelated page or new window. The supplied code attached a document-level click listener and constructed an external destination, although no browser trace was retained."
  observed:
    - "The supplied JavaScript registered a broad click listener and attempted to open an external destination."
  possible:
    - "A visitor click may open a new tab or unexpected page."
    - "The behavior may appear intermittent if browser controls block the new window or the destination changes."
  questions:
    - "Why does clicking anywhere on my WordPress site open another page?"
    - "Can injected JavaScript cause intermittent pop-ups without changing the page design?"
  evidenceNote: "The code is consistent with click-triggered navigation, but the investigation did not retain a browser execution trace."
canonical: "https://www.mdpabel.com/malware-research/c-i-icu-click-redirect-script/"
index: true
---

## Summary

This WordPress malware research entry documents click-triggered javascript redirect evidence observed during one anonymized client investigation. The narrow topic is **c-i.icu Click-Triggered Redirect Script in index.php**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The combined URL array, click listener, timing state, and window-opening functions are consistent with an interaction-gated redirect script. Which URL opened for a given visitor was not observed.

## Investigation context

Anonymized investigation with one code-editor screenshot and a retained obfuscated JavaScript sample. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

Obfuscated redirect-oriented JavaScript was appended to index.php.

![Code editor showing obfuscated JavaScript appended to an index.php file](/wordpress-researches/malware-in-themes-index.php_evidence-1.png "The visible script contains _0x3023 decoding logic, hex-escaped c-i.icu strings, local-storage terms, click handling, and window opening identifiers.")

## Confirmed findings

- The code is present after a PHP closing tag in index.php.
- The string table contains multiple hex-escaped c-i.icu URLs.
- The script references click, localStorage, open, and _blank.
- The draft's AJAX-causation claim is removed.

## Technical analysis

### How click state controls the redirect attempt

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```js
const destinations = ["hxxp://c-i[.]icu/[redacted-paths]"];
// localStorage timing and mobile checks shortened
document.addEventListener("click", handler);
// handler may call window.open(destination, '_blank')
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The combined URL array, click listener, timing state, and window-opening functions are consistent with an interaction-gated redirect script. Which URL opened for a given visitor was not observed.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `c-i[.]icu URL array`
- `_0x3023 and _0x10c8 decoder pair`
- `Click plus localStorage plus window.open structure`

### Contextual indicators

- `index.php`
- `click event`
- `localStorage`
- `window.open()`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The screenshot does not prove a redirect occurred.
- No browser trace or destination response was retained.
- The evidence does not establish AJAX disruption, data theft, or the initial injection path.
- No affected theme version was confirmed.

## Artifact-specific remediation

- Preserve the modified file and rendered source.
- Replace the affected theme component with a trusted copy.
- Search files and database records for the decoder pair and defanged domain.
- Review adjacent theme files only where evidence shows the same signature.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Confirm the script is absent from rendered HTML.
- Repeat the signature search after deployments and cache clears.
- Monitor theme-file integrity and unexpected browser navigation.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [Repeated _0x3023 Obfuscated JavaScript Found Across 17 Files](/malware-research/repeated-0x3023-javascript-injection/)
- [hexagoncontrail-js External Script Injection in WordPress HTML](/malware-research/hexagoncontrail-external-script-injection/)
- [Hostname-Keyed XOR JavaScript Loader with new Function](/malware-research/hostname-keyed-xor-javascript-loader/)

## Related guides and case studies

- [JavaScript redirect malware detection guide](/blog/the-complete-guide-to-javascript-redirect-malware-detection-decoding-and-removal/)
- [How to recognize obfuscated PHP malware](/blog/wordpress-obfuscated-php-malware-detection/)
- [Mobile redirect access-log case study](/case-studies/how-i-found-and-fixed-a-wordpress-mobile-redirect-hack-using-access-logs/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
