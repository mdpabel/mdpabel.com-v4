---
title: "hexagoncontrail-js External Script Injection Research"
h1: "hexagoncontrail-js External Script Injection in WordPress HTML"
slug: "hexagoncontrail-external-script-injection"
description: "Evidence-led analysis of a hexagoncontrail-js script tag that loaded a defanged external resource in a drive-by incident."
status: "published"
reportDate: "2026-01-23"
lastReviewed: "2026-07-22"
threatCategory: "External JavaScript injection"
affectedComponents:
  - "Rendered WordPress HTML"
  - "Browser-executed JavaScript"
observedLocations:
  - "Rendered page source"
  - "External script element with ID hexagoncontrail-js"
confirmedBehaviors:
  - "Adds a script element with the ID hexagoncontrail-js"
  - "Loads JavaScript from an external domain"
confidence: "High"
severity: "High"
severityRationale: "The retained notice and page-source evidence show the injected external script. The fetched script's runtime behavior was not retained and is not inferred."
evidenceSource: "Anonymized drive-by investigation with a third-party incident notice, rendered source evidence, and a supplied script tag"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/switch-domain-suspension-drive-by-malware_evidence-3.png"
    alt: "Incident notice identifying the hexagoncontrail-js external script element"
    caption: "The notice records the hexagoncontrail-js element and its external source. The affected client URL is irreversibly obscured; the image does not show the remote script's contents."
    supports: "The external script tag was identified during the incident"
    width: 1873
    height: 816
    privacyReviewed: true
indicators:
  - value: "hexagoncontrail-js"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "simplecopseholding[.]com"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "The script ID and domain appearing together"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "External script tag"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "dns-prefetch resource hint"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "Rendered page source"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The remote JavaScript response was not retained."
  - "The repository does not establish how the tag was injected."
  - "The separate obfuscated PHP sample was supplied in the same draft, but a direct operational relationship was not confirmed."
  - "The excluded screenshots contained identifiable client and contact information."
relatedResearch:
  - "c-i-icu-click-redirect-script"
  - "wpinfo-pst1-database-redirect"
  - "database-fetch-spam-injection"
relatedGuides:
  - title: "simplecopseholding.com malware removal guide"
    href: "/blog/simplecopseholding-com-wordpress-malware-removal/"
  - title: "JavaScript redirect malware detection guide"
    href: "/blog/the-complete-guide-to-javascript-redirect-malware-detection-decoding-and-removal/"
relatedCaseStudies:
  - title: "Drive-by domain-deactivation case study"
    href: "/case-studies/switch-domain-deactivation-drive-by-malware-fix/"
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "redirects-popups"
    - "access-errors-warnings"
  searchDescription: "WordPress visitors report redirects, pop-ups, or browser warnings? See evidence of an injected external script whose remote behavior was not retained."
  summary: "This research is useful when a page contains an unfamiliar third-party script and visitors report unexpected browser behavior. The retained evidence confirms the script reference, while the response served by that external host was not captured."
  observed:
    - "An analyst notice and retained markup identified an external JavaScript reference on the investigated site."
  possible:
    - "Visitors may report redirects, pop-ups, or security warnings if the remote script serves harmful behavior."
    - "The page may appear normal when the external host is inactive or responds differently."
  questions:
    - "Why does my WordPress site load JavaScript from an unfamiliar domain?"
    - "Could an injected script explain intermittent redirects or browser warnings?"
  evidenceNote: "The external response was not retained, so the exact visitor-side behavior cannot be confirmed from this evidence alone."
canonical: "https://www.mdpabel.com/malware-research/hexagoncontrail-external-script-injection/"
index: true
---

## Summary

This WordPress malware research entry documents external javascript injection evidence observed during one anonymized client investigation. The narrow topic is **hexagoncontrail-js External Script Injection in WordPress HTML**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

Loading untrusted third-party JavaScript gives that resource execution context in the visitor's browser. The retained evidence does not show whether it redirected visitors, collected data, or loaded another stage.

## Investigation context

Anonymized drive-by investigation with a third-party incident notice, rendered source evidence, and a supplied script tag. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

The external script tag was identified during the incident.

![Incident notice identifying the hexagoncontrail-js external script element](/wordpress-researches/switch-domain-suspension-drive-by-malware_evidence-3.png "The notice records the hexagoncontrail-js element and its external source. The affected client URL is irreversibly obscured; the image does not show the remote script's contents.")

## Confirmed findings

- The supplied HTML contains a script element with ID hexagoncontrail-js.
- Its src points to simplecopseholding[.]com using a unique path.
- An incident notice independently records the same element and source.

## Technical analysis

### Why the script ID is the best detection pivot

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```html
<script
  id="hexagoncontrail-js"
  src="hxxps://simplecopseholding[.]com/[redacted-path]"
></script>
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

Loading untrusted third-party JavaScript gives that resource execution context in the visitor's browser. The retained evidence does not show whether it redirected visitors, collected data, or loaded another stage.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `hexagoncontrail-js`
- `simplecopseholding[.]com`
- `The script ID and domain appearing together`

### Contextual indicators

- `External script tag`
- `dns-prefetch resource hint`
- `Rendered page source`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The remote JavaScript response was not retained.
- The repository does not establish how the tag was injected.
- The separate obfuscated PHP sample was supplied in the same draft, but a direct operational relationship was not confirmed.
- The excluded screenshots contained identifiable client and contact information.

## Artifact-specific remediation

- Preserve the rendered source and relevant database/file evidence.
- Remove the injection from its confirmed storage location once found.
- Search files and database records for the script ID and defanged domain.
- Review access and change history to identify the write path if logs permit.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Recheck rendered HTML for the script ID from clean browser sessions.
- Search the database and filesystem after scheduled tasks run.
- Confirm the external resource hint and script element do not return.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [c-i.icu Click-Triggered Redirect Script in index.php](/malware-research/c-i-icu-click-redirect-script/)
- [wpinfo-pst1 Obfuscated Redirect Stored in post_content](/malware-research/wpinfo-pst1-database-redirect/)
- [Database-Stored fetch() Calls Injecting Remote Spam Content](/malware-research/database-fetch-spam-injection/)

## Related guides and case studies

- [simplecopseholding.com malware removal guide](/blog/simplecopseholding-com-wordpress-malware-removal/)
- [JavaScript redirect malware detection guide](/blog/the-complete-guide-to-javascript-redirect-malware-detection-decoding-and-removal/)
- [Drive-by domain-deactivation case study](/case-studies/switch-domain-deactivation-drive-by-malware-fix/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
