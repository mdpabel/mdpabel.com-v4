---
title: "Selective PHP Allowlist .htaccess Injection Research"
h1: "Selective PHP Allowlist Rules Found in a Malicious .htaccess"
slug: "htaccess-php-allowlist-injection"
description: "Forensic analysis of .htaccess rules that denied broad PHP access while allowing a distinctive list of suspicious PHP filenames."
status: "published"
reportDate: "2026-01-27"
lastReviewed: "2026-07-22"
threatCategory: "Selective .htaccess PHP allowlist"
affectedComponents:
  - "Apache access-control configuration"
  - "WordPress PHP paths"
observedLocations:
  - "Observed .htaccess artifact"
  - "A directory containing about.php"
confirmedBehaviors:
  - "Denies access to broad py, exe, and php filename matches"
  - "Allows a named list of PHP files"
  - "Includes standard-looking front-controller rewrite rules"
confidence: "High"
severity: "High"
severityRationale: "The screenshot and supplied configuration show a deny-by-extension rule followed by an allowlist of unusual PHP filenames. Generic error screenshots are excluded because they do not prove the mechanism."
evidenceSource: "Anonymized investigation with four screenshots and supplied .htaccess plus separate obfuscated index.php samples"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/index-php-obfuscated-dropper-htaccess-dos_evidence-1.png"
    alt: "Editor showing FilesMatch rules that deny PHP broadly and allow named PHP files"
    caption: "The configuration denies broad PHP access, then allows a distinctive filename list including about.php and lock360.php. This directly supports selective access-control tampering."
    supports: "The .htaccess artifact contained a selective PHP allowlist"
    width: 1748
    height: 766
    privacyReviewed: true
  - src: "/wordpress-researches/index-php-obfuscated-dropper-htaccess-dos_evidence-4.png"
    alt: "Directory listing showing about.php as the only visible PHP file"
    caption: "The directory view confirms an about.php artifact matching the allowlist. It does not show that the file executed or establish its contents."
    supports: "An allowlisted filename was present in the observed directory"
    width: 824
    height: 334
    privacyReviewed: true
indicators:
  - value: "lock360.php"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "wp-l0gin.php"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Broad PHP deny rule followed by a named PHP allowlist"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "about.php present beside the rule"
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
  - value: "500 response"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The exact directory scope and number of copies were not retained."
  - "No request log proves an allowlisted file was invoked."
  - "A direct relationship between the .htaccess rule and supplied index.php sample was not confirmed."
  - "The original write mechanism was not identified."
relatedResearch:
  - "mixed-case-php-htaccess-deny-rule"
  - "goto-obfuscated-index-php-loader"
  - "privdayz-obfuscated-index-php"
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
  searchDescription: "WordPress PHP pages return 403 errors after unfamiliar .htaccess changes? Review an allowlist rule paired with an unexpected about.php artifact."
  summary: "This entry is useful when most PHP files become inaccessible or return 403 responses while a small allowlist remains reachable. The investigation found restrictive .htaccess rules beside an unexpected about.php file, but no server log was retained."
  observed:
    - "The retained .htaccess rules denied general PHP access while allowing named files, and an unexpected about.php artifact was present nearby."
  possible:
    - "Visitors or administrators may encounter 403 errors on PHP endpoints not included in the allowlist."
    - "Selected PHP files may remain reachable while neighboring files are blocked."
  questions:
    - "Why did WordPress start returning 403 errors after an .htaccess change?"
    - "Why does .htaccess allow only a few unfamiliar PHP filenames?"
  evidenceNote: "The rules can produce access denial, but the investigation did not retain a request log tying a particular error page to this file."
canonical: "https://www.mdpabel.com/malware-research/htaccess-php-allowlist-injection/"
index: true
---

## Summary

This WordPress malware research entry documents selective .htaccess php allowlist evidence observed during one anonymized client investigation. The narrow topic is **Selective PHP Allowlist Rules Found in a Malicious .htaccess**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The rule set is consistent with restricting ordinary PHP files while preserving access to selected attacker-named files. The 403 and 500 screenshots were excluded because error pages alone do not attribute cause.

## Investigation context

Anonymized investigation with four screenshots and supplied .htaccess plus separate obfuscated index.php samples. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

The .htaccess artifact contained a selective PHP allowlist.

![Editor showing FilesMatch rules that deny PHP broadly and allow named PHP files](/wordpress-researches/index-php-obfuscated-dropper-htaccess-dos_evidence-1.png "The configuration denies broad PHP access, then allows a distinctive filename list including about.php and lock360.php. This directly supports selective access-control tampering.")

An allowlisted filename was present in the observed directory.

![Directory listing showing about.php as the only visible PHP file](/wordpress-researches/index-php-obfuscated-dropper-htaccess-dos_evidence-4.png "The directory view confirms an about.php artifact matching the allowlist. It does not show that the file executed or establish its contents.")

## Confirmed findings

- The .htaccess rule denies files matching broad executable extensions.
- A second FilesMatch rule allows a specific list including about.php, radio.php, lock360.php, and misspelled wp-l0gin.php.
- A directory screenshot shows about.php.
- The separately supplied index.php sample contains an encoded eval path, but the evidence does not prove it belonged to the same execution chain.

## Technical analysis

### Why the allowlisted filenames matter

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```apache
<FilesMatch ".(py|exe|php)$">
  Deny from all
</FilesMatch>
<FilesMatch "^(about.php|radio.php|lock360.php|[other names redacted])$">
  Allow from all
</FilesMatch>
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The rule set is consistent with restricting ordinary PHP files while preserving access to selected attacker-named files. The 403 and 500 screenshots were excluded because error pages alone do not attribute cause.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `lock360.php`
- `wp-l0gin.php`
- `Broad PHP deny rule followed by a named PHP allowlist`
- `about.php present beside the rule`

### Contextual indicators

- `.htaccess`
- `FilesMatch`
- `403 response`
- `500 response`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The exact directory scope and number of copies were not retained.
- No request log proves an allowlisted file was invoked.
- A direct relationship between the .htaccess rule and supplied index.php sample was not confirmed.
- The original write mechanism was not identified.

## Artifact-specific remediation

- Preserve representative rules and allowlisted files before cleanup.
- Replace malicious .htaccess copies with directory-appropriate trusted configuration.
- Inspect every allowlisted filename and remove confirmed malicious artifacts.
- Search recursively for the exact filename list and rule ordering.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Re-run the recursive rule search after normal traffic and cron tasks.
- Confirm expected PHP endpoints respond according to the clean configuration.
- Monitor for recreation of the allowlisted filenames.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [Mixed-Case PHP Deny Rule with an index.php Exception](/malware-research/mixed-case-php-htaccess-deny-rule/)
- [goto-Obfuscated Remote Loader Found in index.php](/malware-research/goto-obfuscated-index-php-loader/)
- [PrivDayz-Branded Obfuscated index.php in a Random Directory](/malware-research/privdayz-obfuscated-index-php/)

## Related guides and case studies

- [How to remove .htaccess malware](/blog/the-ultimate-guide-to-removing-htaccess-malware-from-wordpress/)
- [WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
