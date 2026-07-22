---
title: "Mixed-Case PHP .htaccess Deny Rule Research"
h1: "Mixed-Case PHP Deny Rule with an index.php Exception"
slug: "mixed-case-php-htaccess-deny-rule"
description: "Forensic analysis of a FilesMatch rule covering mixed-case PHP extensions while allowing only index.php through a second rule."
status: "published"
reportDate: "2026-01-27"
lastReviewed: "2026-07-22"
threatCategory: "Restrictive .htaccess access control"
affectedComponents:
  - "Apache FilesMatch configuration"
  - "Direct PHP request handling"
observedLocations:
  - "Observed .htaccess file; exact directory scope not retained"
confirmedBehaviors:
  - "Denies a broad mixed-case extension list"
  - "Includes the suspected extension"
  - "Allows index.php through a second FilesMatch rule"
confidence: "High"
severity: "High"
severityRationale: "The screenshot directly shows the restrictive rule. Claims that it was recursively placed in every directory or caused specific errors are removed because that scope was not retained."
evidenceSource: "Anonymized investigation with one code screenshot and a supplied .htaccess excerpt"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/htaccess-php-lockout_evidence-1.png"
    alt: "Editor showing mixed-case PHP FilesMatch denial and an index.php allow rule"
    caption: "The rule denies many PHP capitalization variants and then allows index.php. The image confirms this file's contents, not recursive placement or the cause of a particular error page."
    supports: "The observed .htaccess contained a broad PHP deny rule and index.php exception"
    width: 1072
    height: 442
    privacyReviewed: true
indicators:
  - value: "Mixed-case PHP extension sequence"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "suspected extension in FilesMatch"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Broad deny followed by index.php-only allow"
    type: "distinctive artifact"
    confidence: "higher"
  - value: ".htaccess"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "FilesMatch"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "403 response"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "index.php"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The number and locations of copies were not retained."
  - "The evidence does not identify the process that wrote the rule."
  - "No server log ties a specific 403 or 500 response to this file."
  - "No associated dropper was confirmed."
relatedResearch:
  - "htaccess-php-allowlist-injection"
  - "cookie-indexed-php-loader-htaccess-file"
  - "goto-obfuscated-index-php-loader"
relatedGuides:
  - title: "How to remove .htaccess malware"
    href: "/blog/the-ultimate-guide-to-removing-htaccess-malware-from-wordpress/"
  - title: "WordPress malware removal guide"
    href: "/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/"
relatedCaseStudies: []
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "access-errors-warnings"
    - "suspicious-files-code"
  searchDescription: "WordPress PHP files suddenly return 403 errors in several folders? Review recursive .htaccess denial rules and their investigation context."
  summary: "This entry is useful when PHP endpoints fail across multiple nested directories after unexpected .htaccess files appear. The retained directives deny PHP access recursively, although no server request log linked them to a specific visitor report."
  observed:
    - "The investigation retained repeated .htaccess directives designed to deny access to PHP files across nested directories."
  possible:
    - "Visitors or administrators may receive 403 responses when requesting affected PHP endpoints."
    - "Legitimate scripts in child directories may stop working until the directives are reviewed."
  questions:
    - "Why are PHP files returning 403 errors across several WordPress folders?"
    - "Can one .htaccess rule affect nested directories recursively?"
  evidenceNote: "The access-control effect follows from the directives; a specific failed request was not retained in the evidence set."
canonical: "https://www.mdpabel.com/malware-research/mixed-case-php-htaccess-deny-rule/"
index: true
---

## Summary

This WordPress malware research entry documents restrictive .htaccess access control evidence observed during one anonymized client investigation. The narrow topic is **Mixed-Case PHP Deny Rule with an index.php Exception**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The combination can block direct access to many PHP files while leaving index.php reachable. This could be used for access control abuse, but the repository does not prove recursive distribution or the exact server effect.

## Investigation context

Anonymized investigation with one code screenshot and a supplied .htaccess excerpt. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

The observed .htaccess contained a broad PHP deny rule and index.php exception.

![Editor showing mixed-case PHP FilesMatch denial and an index.php allow rule](/wordpress-researches/htaccess-php-lockout_evidence-1.png "The rule denies many PHP capitalization variants and then allows index.php. The image confirms this file's contents, not recursive placement or the cause of a particular error page.")

## Confirmed findings

- The first FilesMatch pattern includes php, PHP, Php, PHp, pHp, pHP, phP, PhP, php5, php7, php8, and suspected.
- The first block uses Deny from all.
- A second FilesMatch block allows index.php.

## Technical analysis

### How the index.php exception changes the rule

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```apache
<FilesMatch '.(py|exe|phtml|php|PHP|Php|PHp|pHp|pHP|php7|php8|suspected)$'>
  Deny from all
</FilesMatch>
<FilesMatch '^(index.php)$'>
  Allow from all
</FilesMatch>
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The combination can block direct access to many PHP files while leaving index.php reachable. This could be used for access control abuse, but the repository does not prove recursive distribution or the exact server effect.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `Mixed-case PHP extension sequence`
- `suspected extension in FilesMatch`
- `Broad deny followed by index.php-only allow`

### Contextual indicators

- `.htaccess`
- `FilesMatch`
- `403 response`
- `index.php`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The number and locations of copies were not retained.
- The evidence does not identify the process that wrote the rule.
- No server log ties a specific 403 or 500 response to this file.
- No associated dropper was confirmed.

## Artifact-specific remediation

- Preserve representative configuration and record its path.
- Replace malicious rules with directory-appropriate trusted configuration.
- Search recursively for the exact mixed-case sequence.
- Investigate any files that the exception continued to expose.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Repeat the recursive rule search after scheduled tasks.
- Confirm expected PHP endpoints behave normally under clean configuration.
- Monitor .htaccess creation in writable directories.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [Selective PHP Allowlist Rules Found in a Malicious .htaccess](/malware-research/htaccess-php-allowlist-injection/)
- [Cookie-Indexed PHP Loader Found in an .htaccess-Named File](/malware-research/cookie-indexed-php-loader-htaccess-file/)
- [goto-Obfuscated Remote Loader Found in index.php](/malware-research/goto-obfuscated-index-php-loader/)

## Related guides and case studies

- [How to remove .htaccess malware](/blog/the-ultimate-guide-to-removing-htaccess-malware-from-wordpress/)
- [WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
