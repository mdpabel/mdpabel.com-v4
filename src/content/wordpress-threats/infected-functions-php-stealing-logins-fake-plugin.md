---
title: "functions.php wp-perf-analytics Plugin Deployer Research"
h1: "wp-perf-analytics Plugin Deployer Embedded in functions.php"
slug: "functions-php-wp-perf-analytics-deployer"
description: "Forensic analysis of a self-cleaning functions.php block that staged an encoded wp-perf-analytics plugin under wp-content."
status: "published"
reportDate: "2026-04-23"
lastReviewed: "2026-07-22"
threatCategory: "Theme-based fake-plugin deployer"
affectedComponents:
  - "Active theme functions.php"
  - "WordPress plugins directory"
  - "Deployer flag under wp-content"
observedLocations:
  - "Active theme functions.php"
  - "wp-content/plugins/wp-perf-analytics/"
  - "wp-content/.plugin_deployer_*"
confirmedBehaviors:
  - "Runs a marked deployer block on init"
  - "Creates the wp-perf-analytics plugin directory"
  - "Decodes an embedded plugin body"
  - "Uses a flag file to throttle deployment"
  - "Attempts to remove its own marked block"
confidence: "High"
severity: "Critical"
severityRationale: "The supplied code and screenshot show plugin creation, an embedded payload, a deployment flag, and self-cleaning logic. The full plugin payload is withheld."
evidenceSource: "Anonymized investigation with two code screenshots and a retained representative functions.php sample"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/functions.php-malware_evidence-2.png"
    alt: "PHP editor showing the plugin_deployer block and wp-perf-analytics slug in functions.php"
    caption: "The visible block identifies wp-perf-analytics, a .plugin_deployer flag, self-cleaning logic, and an encoded payload. Only the structural evidence is reproduced publicly."
    supports: "functions.php contained a self-cleaning wp-perf-analytics deployer"
    width: 1372
    height: 812
    privacyReviewed: true
indicators:
  - value: "__plugin_deployer__"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "wp-perf-analytics"
    type: "distinctive artifact"
    confidence: "higher"
  - value: ".plugin_deployer_"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Self-removal markers plus opcode invalidation"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "functions.php"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "init hook"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "base64_decode()"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "WP_CONTENT_DIR/plugins"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The complete dropped plugin body is not published."
  - "The evidence does not establish how functions.php was first modified."
  - "No vulnerable theme or plugin version was identified."
  - "The retained screenshots do not prove every deployment attempt succeeded."
relatedResearch:
  - "functions-php-credential-logger-fake-png"
  - "media-patcher-lab-mu-plugin"
  - "system-control-hidden-backup-restoration"
relatedGuides:
  - title: "Hidden WordPress backdoor investigation"
    href: "/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/"
  - title: "WordPress malware removal guide"
    href: "/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/"
relatedCaseStudies: []
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "unknown-plugins"
    - "recurring-malware"
    - "suspicious-files-code"
  searchDescription: "An unknown wp-perf-analytics plugin keeps appearing on WordPress? See functions.php code that deployed the plugin and removed its own installer block."
  summary: "This research is relevant when an unfamiliar wp-perf-analytics plugin appears and the obvious installer code is hard to find afterward. The supplied theme code wrote the plugin and then removed the marked deployment block from functions.php."
  observed:
    - "The supplied functions.php block decoded and wrote a wp-perf-analytics plugin before removing its marked installer section."
  possible:
    - "The unfamiliar plugin can appear even when no administrator remembers installing it."
    - "A later theme-file review may miss the original deployment block because the code attempted to remove itself."
  questions:
    - "Why did a wp-perf-analytics plugin appear without being installed?"
    - "Can infected functions.php code deploy a plugin and then erase its installer?"
  evidenceNote: "The deployment path is present in the supplied code; the initial source of the functions.php modification is unknown."
canonical: "https://www.mdpabel.com/malware-research/functions-php-wp-perf-analytics-deployer/"
index: true
---

## Summary

This WordPress malware research entry documents theme-based fake-plugin deployer evidence observed during one anonymized client investigation. The narrow topic is **wp-perf-analytics Plugin Deployer Embedded in functions.php**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The block operates as an installer intended to leave the wp-perf-analytics component behind after the visible theme injection removes itself. This page focuses on deployment; the related credential-logging behavior is documented separately.

## Investigation context

Anonymized investigation with two code screenshots and a retained representative functions.php sample. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

functions.php contained a self-cleaning wp-perf-analytics deployer.

![PHP editor showing the plugin_deployer block and wp-perf-analytics slug in functions.php](/wordpress-researches/functions.php-malware_evidence-2.png "The visible block identifies wp-perf-analytics, a .plugin_deployer flag, self-cleaning logic, and an encoded payload. Only the structural evidence is reproduced publicly.")

## Confirmed findings

- The block is marked **plugin_deployer** and runs on init.
- The slug is set to wp-perf-analytics and the target path is under WP_CONTENT_DIR/plugins.
- A .plugin_deployer_ flag is written under wp-content.
- The code contains regex-based removal of its own marked block and opcode invalidation.

## Technical analysis

### How the deployer stages and then hides its installer

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```php
/* __plugin_deployer__ */
$slug = 'wp-perf-analytics';
$dir = WP_CONTENT_DIR . '/plugins/' . $slug;
$flag = WP_CONTENT_DIR . '/.plugin_deployer_' . md5(__FILE__);
// encoded plugin body and self-rewrite details redacted
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The block operates as an installer intended to leave the wp-perf-analytics component behind after the visible theme injection removes itself. This page focuses on deployment; the related credential-logging behavior is documented separately.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `__plugin_deployer__`
- `wp-perf-analytics`
- `.plugin_deployer_`
- `Self-removal markers plus opcode invalidation`

### Contextual indicators

- `functions.php`
- `init hook`
- `base64_decode()`
- `WP_CONTENT_DIR/plugins`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The complete dropped plugin body is not published.
- The evidence does not establish how functions.php was first modified.
- No vulnerable theme or plugin version was identified.
- The retained screenshots do not prove every deployment attempt succeeded.

## Artifact-specific remediation

- Preserve the infected theme file, flag, and dropped directory.
- Replace the full theme with a trusted copy and remove the untrusted plugin directory.
- Search wp-content for deployer markers and flag files.
- Rotate credentials because the related investigation also retained credential-logging evidence.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Confirm the plugin directory and flag do not return.
- Monitor functions.php for the marked block after traffic and logins.
- Compare plugin state and filesystem inventory over time.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [functions php credential logger fake png](/malware-research/functions-php-credential-logger-fake-png/)
- [media-patcher-lab.php Found in WordPress mu-plugins](/malware-research/media-patcher-lab-mu-plugin/)
- [system-control Plugin Restored from wp-content/.sc-backup](/malware-research/system-control-hidden-backup-restoration/)

## Related guides and case studies

- [Hidden WordPress backdoor investigation](/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/)
- [WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
