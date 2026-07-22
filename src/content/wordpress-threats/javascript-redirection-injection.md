---
title: "wpinfo-pst1 Database Redirect Script Research"
h1: "wpinfo-pst1 Obfuscated Redirect Stored in post_content"
slug: "wpinfo-pst1-database-redirect"
description: "Forensic analysis of a wpinfo-pst1 packed JavaScript block stored in WordPress post content and writing an external script element."
status: "published"
reportDate: "2026-01-18"
lastReviewed: "2026-07-22"
threatCategory: "Database-stored packed redirect script"
affectedComponents:
  - "WordPress posts table"
  - "Browser-executed packed JavaScript"
observedLocations:
  - "post_content database field"
  - "Script element ID wpinfo-pst1"
confirmedBehaviors:
  - "Stores a script element with ID wpinfo-pst1"
  - "Uses a packed eval wrapper"
  - "Calls document.write with an external JavaScript source"
confidence: "High"
severity: "High"
severityRationale: "The database screenshot and code directly show a packed script that writes an external script tag. A second screenshot shows a different options-table artifact and is excluded from this page."
evidenceSource: "Anonymized investigation with two database screenshots and a supplied packed JavaScript sample; one directly relevant image is published"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/db-malware_evidence-1.png"
    alt: "Database post_content cell containing the wpinfo-pst1 packed JavaScript block"
    caption: "The post_content field visibly contains wpinfo-pst1 and a packed eval wrapper. The image confirms storage in a post record, not the remote script's resulting behavior."
    supports: "The wpinfo-pst1 script was stored in post_content"
    width: 1313
    height: 683
    privacyReviewed: true
indicators:
  - value: "wpinfo-pst1"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Packed token list containing document|javascript|write|script"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "The identifier inside post_content"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "eval(function(p,a,c,k,e,d)"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "document.write()"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "post_content"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "External IP-based URL"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The remote script response was not retained."
  - "The evidence does not identify the database write path."
  - "The second screenshot belongs to a different widget_block artifact and is not treated as the same chain."
  - "No campaign size or affected version was established."
relatedResearch:
  - "ushort-company-post-content-redirect"
  - "database-fetch-spam-injection"
  - "c-i-icu-click-redirect-script"
relatedGuides:
  - title: "WordPress database malware guide"
    href: "/blog/wordpress-database-malware-complete-guide/"
  - title: "JavaScript redirect malware detection guide"
    href: "/blog/the-complete-guide-to-javascript-redirect-malware-detection-decoding-and-removal/"
relatedCaseStudies:
  - title: "Hidden redirect removal case study"
    href: "/case-studies/wpcode-plugin-malware-hidden-redirect-removal/"
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "redirects-popups"
    - "suspicious-files-code"
  searchDescription: "Found an unfamiliar external script in a WordPress database record? This entry examines a wpinfo-style injection linked to redirect concerns."
  summary: "This entry is relevant when owners see intermittent redirects or discover an external script stored in page or database content. The retained record confirms the injected script reference; it does not preserve what the external server returned."
  observed:
    - "The investigation retained a database-stored script reference to an unfamiliar external host."
  possible:
    - "Visitors may encounter redirects or other changing browser behavior if the external script supplies it."
    - "The page may look normal when the external host is unavailable or responds selectively."
  questions:
    - "Why is an unfamiliar script stored in my WordPress database?"
    - "Could a database-injected script explain redirects that do not happen every time?"
  evidenceNote: "The external script reference is confirmed; its response and resulting runtime behavior were not retained."
canonical: "https://www.mdpabel.com/malware-research/wpinfo-pst1-database-redirect/"
index: true
---

## Summary

This WordPress malware research entry documents database-stored packed redirect script evidence observed during one anonymized client investigation. The narrow topic is **wpinfo-pst1 Obfuscated Redirect Stored in post_content**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The artifact is consistent with a database-stored redirect or traffic-monetization loader. The incomplete destination string and absent browser trace prevent a stronger visitor-outcome claim.

## Investigation context

Anonymized investigation with two database screenshots and a supplied packed JavaScript sample; one directly relevant image is published. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

The wpinfo-pst1 script was stored in post_content.

![Database post_content cell containing the wpinfo-pst1 packed JavaScript block](/wordpress-researches/db-malware_evidence-1.png "The post_content field visibly contains wpinfo-pst1 and a packed eval wrapper. The image confirms storage in a post record, not the remote script's resulting behavior.")

## Confirmed findings

- The database screenshot shows wpinfo-pst1 in post_content.
- The script uses a packed eval(function(p,a,c,k,e,d)...) form.
- The decoded token list visibly includes document, write, script, src, navigator, and referrer.
- The supplied string constructs an external script source.

## Technical analysis

### Why wpinfo-pst1 is a useful database search key

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```html
<script id="wpinfo-pst1">
  eval(function (p, a, c, k, e, d) {
    /* packed body redacted */
  });
</script>
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The artifact is consistent with a database-stored redirect or traffic-monetization loader. The incomplete destination string and absent browser trace prevent a stronger visitor-outcome claim.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `wpinfo-pst1`
- `Packed token list containing document|javascript|write|script`
- `The identifier inside post_content`

### Contextual indicators

- `eval(function(p,a,c,k,e,d)`
- `document.write()`
- `post_content`
- `External IP-based URL`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The remote script response was not retained.
- The evidence does not identify the database write path.
- The second screenshot belongs to a different widget_block artifact and is not treated as the same chain.
- No campaign size or affected version was established.

## Artifact-specific remediation

- Export the affected row and table before editing.
- Remove the script from confirmed records and search revisions, widgets, and options separately.
- Search the database for wpinfo-pst1 and distinctive packed tokens.
- Investigate the write path through logs and administrator activity if available.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Repeat the database search after scheduled events and content edits.
- Confirm rendered pages no longer contain wpinfo-pst1.
- Monitor affected records for unexpected modification.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [ushort.company Meta-Refresh and JavaScript Redirect in post_content](/malware-research/ushort-company-post-content-redirect/)
- [Database-Stored fetch() Calls Injecting Remote Spam Content](/malware-research/database-fetch-spam-injection/)
- [c-i.icu Click-Triggered Redirect Script in index.php](/malware-research/c-i-icu-click-redirect-script/)

## Related guides and case studies

- [WordPress database malware guide](/blog/wordpress-database-malware-complete-guide/)
- [JavaScript redirect malware detection guide](/blog/the-complete-guide-to-javascript-redirect-malware-detection-decoding-and-removal/)
- [Hidden redirect removal case study](/case-studies/wpcode-plugin-malware-hidden-redirect-removal/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
