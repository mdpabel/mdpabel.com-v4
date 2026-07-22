---
title: "Hostname-Keyed XOR JavaScript Loader Research"
h1: "Hostname-Keyed XOR JavaScript Loader with new Function"
slug: "hostname-keyed-xor-javascript-loader"
description: "Forensic analysis of JavaScript that reversed and XOR-decoded a hex-escaped blob with window.location.hostname before using new Function."
status: "published"
reportDate: "2026-01-20"
lastReviewed: "2026-07-22"
threatCategory: "Hostname-keyed JavaScript loader"
affectedComponents:
  - "Browser-executed JavaScript"
  - "Dynamic JavaScript compilation"
observedLocations:
  - "Supplied JavaScript sample; deployed WordPress path not retained"
confirmedBehaviors:
  - "Reverses an embedded string"
  - "XORs characters against window.location.hostname"
  - "Passes the decoded result to new Function"
  - "Suppresses exceptions around invocation"
confidence: "High"
severity: "High"
severityRationale: "The wrapper clearly decodes and dynamically compiles JavaScript. The decoded body was not retained as readable evidence, so credit-card theft and checkout targeting are not asserted."
evidenceSource: "Anonymized investigation with a supplied JavaScript wrapper and no retained screenshot"
schemaType: "TechArticle"
screenshots: []
indicators:
  - value: "window.location.hostname used as an XOR key"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Reversal followed by XOR decoding and new Function"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Hex-escaped embedded JavaScript blob"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "new Function()"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "window.location.hostname"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "XOR loop"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "Obfuscated JavaScript"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The decoded body is not published or characterized."
  - "No checkout page, payment field, exfiltration request, or affected commerce component was confirmed."
  - "The deployed storage location and initial compromise method were not identified."
relatedResearch:
  - "c-i-icu-click-redirect-script"
  - "repeated-0x3023-javascript-injection"
  - "wpinfo-pst1-database-redirect"
relatedGuides:
  - title: "JavaScript redirect malware detection guide"
    href: "/blog/the-complete-guide-to-javascript-redirect-malware-detection-decoding-and-removal/"
  - title: "WooCommerce fake payment form skimmer guide"
    href: "/blog/woocommerce-fake-payment-form-skimmer-fix/"
relatedCaseStudies: []
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "login-credential-risk"
    - "suspicious-files-code"
  searchDescription: "Found heavily obfuscated JavaScript that changes behavior by hostname? This evidence review explains what is visible and why theft is not proven."
  summary: "This entry is relevant when a checkout or site audit uncovers hostname-dependent, obfuscated JavaScript. The code structure warrants investigation, but the supplied fragment does not show collection or transmission of payment-card data."
  observed:
    - "The supplied JavaScript used obfuscated strings and hostname-dependent branching."
  possible:
    - "The script may behave differently across domains or environments."
    - "The page can appear normal while the obfuscated branch remains difficult to review."
  questions:
    - "Why does this obfuscated JavaScript check my website hostname?"
    - "Does suspicious checkout JavaScript prove that card details were stolen?"
  evidenceNote: "The evidence does not establish card-data collection, exfiltration, or a completed checkout skimmer workflow."
canonical: "https://www.mdpabel.com/malware-research/hostname-keyed-xor-javascript-loader/"
index: true
---

## Summary

This WordPress malware research entry documents hostname-keyed javascript loader evidence observed during one anonymized client investigation. The narrow topic is **Hostname-Keyed XOR JavaScript Loader with new Function**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The hostname key can make the decoded body site-specific and hinder casual analysis. The legacy credit-card-stealer label exceeded the evidence because no form selectors, payment fields, network destination, or captured data were retained.

## Investigation context

Anonymized investigation with a supplied JavaScript wrapper and no retained screenshot. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

The public entry does not use a screenshot because the retained images either exposed sensitive values, showed a complete encoded payload, or did not add reliable evidence beyond the supplied code.

## Confirmed findings

- The embedded blob is represented with hexadecimal escape sequences.
- The wrapper reverses the blob before XOR transformation.
- window.location.hostname supplies the repeating XOR key.
- The result is provided to new Function and invoked.

## Technical analysis

### How the hostname becomes the decode key

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```js
const reversed = embedded.split("").reverse().join("");
const decoded = xorCharacters(reversed, window.location.hostname);
new Function(decoded)();
// embedded blob and helper implementation redacted
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The hostname key can make the decoded body site-specific and hinder casual analysis. The legacy credit-card-stealer label exceeded the evidence because no form selectors, payment fields, network destination, or captured data were retained.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `window.location.hostname used as an XOR key`
- `Reversal followed by XOR decoding and new Function`
- `Hex-escaped embedded JavaScript blob`

### Contextual indicators

- `new Function()`
- `window.location.hostname`
- `XOR loop`
- `Obfuscated JavaScript`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The decoded body is not published or characterized.
- No checkout page, payment field, exfiltration request, or affected commerce component was confirmed.
- The deployed storage location and initial compromise method were not identified.

## Artifact-specific remediation

- Preserve the original script privately.
- Locate and remove the confirmed storage record or modified file.
- Search rendered HTML, files, and database content for the wrapper shape.
- Review browser and server logs for related external requests if retained.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Recheck rendered pages across the relevant hostnames.
- Use file and database integrity checks for the wrapper.
- Confirm no new dynamic-function loaders appear after checkout or login flows.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [c-i.icu Click-Triggered Redirect Script in index.php](/malware-research/c-i-icu-click-redirect-script/)
- [Repeated _0x3023 Obfuscated JavaScript Found Across 17 Files](/malware-research/repeated-0x3023-javascript-injection/)
- [wpinfo-pst1 Obfuscated Redirect Stored in post_content](/malware-research/wpinfo-pst1-database-redirect/)

## Related guides and case studies

- [JavaScript redirect malware detection guide](/blog/the-complete-guide-to-javascript-redirect-malware-detection-decoding-and-removal/)
- [WooCommerce fake payment form skimmer guide](/blog/woocommerce-fake-payment-form-skimmer-fix/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
