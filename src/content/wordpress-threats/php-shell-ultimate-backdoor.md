---
title: "PHP Shell Ultimate Artifact and Installer Claims Research"
h1: "PHP Shell Ultimate Artifact Found Among Upload-Like Folders"
slug: "php-shell-ultimate-artifact"
description: "Forensic review of a PHP Shell Ultimate sample containing named installer, command, file, and bypass-related functions."
status: "published"
reportDate: "2026-01-27"
lastReviewed: "2026-07-22"
threatCategory: "PHP web-shell artifact"
affectedComponents:
  - "Unexpected PHP files in writable directories"
  - "Browser-accessible PHP shell interface"
observedLocations:
  - "Observed nasa-custom-fonts directory tree"
  - "ai.php and asem.php shown in a subdirectory"
confirmedBehaviors:
  - "Declares PHP SHELL ULTIMATE in source"
  - "Defines bypass_disable_functions and bypass_open_basedir functions"
  - "Contains command and generated-shell branches in the private sample"
confidence: "High"
severity: "Critical"
severityRationale: "The source identity and dangerous function set are visible. Labels such as PHP-FPM Bypass do not prove the technique succeeded on the investigated server."
evidenceSource: "Anonymized investigation with five screenshots and retained truncated ai.php source; privacy-sensitive and redundant images are excluded"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/php-shell-ultimate-bypass-installer_evidence-3.png"
    alt: "PHP editor showing the PHP Shell Ultimate header and bypass-named functions"
    caption: "The source identifies itself as PHP SHELL ULTIMATE and lists LD_PRELOAD, PHP-FPM, and ImageMagick labels. The labels do not demonstrate a successful bypass."
    supports: "The observed file contained PHP Shell Ultimate identity and bypass-named functions"
    width: 1251
    height: 752
    privacyReviewed: true
  - src: "/wordpress-researches/php-shell-ultimate-bypass-installer_evidence-4.png"
    alt: "File manager showing ai.php and asem.php in a writable plugin-related folder"
    caption: "The directory contains ai.php, asem.php, index.php, and .htaccess. Presence confirms the artifacts, while contents and execution require separate verification."
    supports: "ai.php and related PHP files existed in the observed directory"
    width: 1349
    height: 804
    privacyReviewed: true
indicators:
  - value: "PHP SHELL ULTIMATE - Auto Install & Bypass Protection"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "bypass_disable_functions"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "bypass_open_basedir"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "generate_shell_code"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "ai.php and asem.php together"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "ai.php"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "system()"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "base64_decode()"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "uploads or custom-font directories"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "No request log proves the shell was accessed."
  - "No command execution, privilege level, or successful security bypass was observed."
  - "The initial upload path and any plugin vulnerability were not confirmed."
  - "The original account-path screenshot is excluded for privacy."
relatedResearch:
  - "savvywolf-manager-php-web-shell"
  - "xdiff-temporary-file-php-loader"
  - "privdayz-obfuscated-index-php"
relatedGuides:
  - title: "Hidden WordPress backdoor investigation"
    href: "/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/"
  - title: "WordPress malware removal guide"
    href: "/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/"
relatedCaseStudies:
  - title: "Tiny File Manager backdoor case study"
    href: "/case-studies/siteground-malware-detected-suspension-tiny-file-manager-backdoor/"
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "suspicious-files-code"
    - "login-credential-risk"
  searchDescription: "Found PHP Shell Ultimate files in an upload-like WordPress directory? This entry explains the web-shell indicators and evidence limitations."
  summary: "This research helps owners assess PHP files discovered where media or static uploads are expected. The retained names and shell-style structure are higher-confidence investigation leads, but the evidence does not show who accessed the files."
  observed:
    - "The investigation retained PHP Shell Ultimate artifacts from upload-like WordPress paths."
  possible:
    - "A scanner may flag executable PHP inside a directory normally associated with uploaded media."
    - "The public website may look unchanged even though a directly addressable shell file is present."
  questions:
    - "Why are PHP files present inside my WordPress uploads area?"
    - "What does PHP Shell Ultimate found by a malware scanner mean?"
  evidenceNote: "File presence is confirmed; successful access, commands issued, and the initial upload path were not retained."
canonical: "https://www.mdpabel.com/malware-research/php-shell-ultimate-artifact/"
index: true
---

## Summary

This WordPress malware research entry documents php web-shell artifact evidence observed during one anonymized client investigation. The narrow topic is **PHP Shell Ultimate Artifact Found Among Upload-Like Folders**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The file is a web-shell artifact with installer and command-oriented code. The names of bypass methods are claims made by the code; success against server restrictions was not observed.

## Investigation context

Anonymized investigation with five screenshots and retained truncated ai.php source; privacy-sensitive and redundant images are excluded. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

The observed file contained PHP Shell Ultimate identity and bypass-named functions.

![PHP editor showing the PHP Shell Ultimate header and bypass-named functions](/wordpress-researches/php-shell-ultimate-bypass-installer_evidence-3.png "The source identifies itself as PHP SHELL ULTIMATE and lists LD_PRELOAD, PHP-FPM, and ImageMagick labels. The labels do not demonstrate a successful bypass.")

ai.php and related PHP files existed in the observed directory.

![File manager showing ai.php and asem.php in a writable plugin-related folder](/wordpress-researches/php-shell-ultimate-bypass-installer_evidence-4.png "The directory contains ai.php, asem.php, index.php, and .htaccess. Presence confirms the artifacts, while contents and execution require separate verification.")

## Confirmed findings

- The source header names PHP SHELL ULTIMATE.
- Functions include bypass_disable_functions, bypass_open_basedir, encode_output, decode_input, and generate_shell_code.
- A directory screenshot shows ai.php and asem.php beside index.php and .htaccess.
- The retained sample includes command-handling code but is not published in operational form.

## Technical analysis

### Why function labels are evidence but not proof of success

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```php
function bypass_disable_functions() {
    return ['LD_PRELOAD Method', 'PHP-FPM Bypass', 'ImageMagick Exploit'];
}
function generate_shell_code() {
    return '[REDACTED GENERATED SHELL]';
}
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The file is a web-shell artifact with installer and command-oriented code. The names of bypass methods are claims made by the code; success against server restrictions was not observed.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `PHP SHELL ULTIMATE - Auto Install & Bypass Protection`
- `bypass_disable_functions`
- `bypass_open_basedir`
- `generate_shell_code`
- `ai.php and asem.php together`

### Contextual indicators

- `ai.php`
- `system()`
- `base64_decode()`
- `uploads or custom-font directories`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- No request log proves the shell was accessed.
- No command execution, privilege level, or successful security bypass was observed.
- The initial upload path and any plugin vulnerability were not confirmed.
- The original account-path screenshot is excluded for privacy.

## Artifact-specific remediation

- Preserve the files and access logs privately.
- Remove all confirmed shell files and inspect the containing directory for related artifacts.
- Search for the distinctive title and function names across the account.
- Rotate credentials and review administrator accounts after containment.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Confirm ai.php, asem.php, and similarly named copies do not return.
- Monitor writable directories for new PHP files.
- Review access logs for direct requests to the observed filenames.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [savvywolf manager php web shell](/malware-research/savvywolf-manager-php-web-shell/)
- [xdiff.php XOR Loader Using Writable Temporary Directories](/malware-research/xdiff-temporary-file-php-loader/)
- [PrivDayz-Branded Obfuscated index.php in a Random Directory](/malware-research/privdayz-obfuscated-index-php/)

## Related guides and case studies

- [Hidden WordPress backdoor investigation](/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/)
- [WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/)
- [Tiny File Manager backdoor case study](/case-studies/siteground-malware-detected-suspension-tiny-file-manager-backdoor/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
