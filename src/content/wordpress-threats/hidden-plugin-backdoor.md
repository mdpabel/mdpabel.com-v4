---
title: "WP-Security Fake Plugin eval Loader Research"
h1: "WP-Security Fake Plugin with an eval Decode Wrapper"
slug: "wp-security-fake-plugin-eval-loader"
description: "Forensic review of a WP-Security plugin directory and a PHP wrapper using eval, gzinflate, and base64_decode around an encoded payload."
status: "published"
reportDate: "2026-01-21"
lastReviewed: "2026-07-22"
threatCategory: "Fake security plugin encoded loader"
affectedComponents:
  - "WordPress plugins directory"
  - "PHP decode-and-evaluate wrapper"
observedLocations:
  - "wp-content/plugins/WP-Security/"
confirmedBehaviors:
  - "Presents a security-themed plugin header"
  - "Passes an encoded blob through base64_decode and gzinflate"
  - "Passes the decoded result to eval"
confidence: "High"
severity: "High"
severityRationale: "The supplied source contains a direct decode-and-evaluate wrapper under a deceptive security-themed identity. The decoded payload is deliberately not published or characterized beyond retained evidence."
evidenceSource: "Anonymized investigation with one filesystem screenshot and retained PHP wrapper source"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-threats/wp-security-hidden-plugin_evidence-1.png"
    alt: "Filesystem listing showing an uppercase WP-Security directory among WordPress plugins"
    caption: "The screenshot confirms the WP-Security directory in the plugin path. The directory name alone is contextual; the supplied eval wrapper establishes the malicious behavior."
    supports: "The WP-Security directory existed among installed plugins"
    width: 804
    height: 573
    privacyReviewed: true
indicators:
  - value: "WP-Security directory with the supplied wrapper"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Security-themed plugin header plus eval(gzinflate(base64_decode(...)))"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Text Domain: wp-security in this artifact"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "WP-Security"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "base64_decode()"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "gzinflate()"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "eval()"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The decoded payload is not published and its capabilities are not asserted."
  - "The screenshot does not prove activation or execution."
  - "The initial access path and any affected legitimate component were not identified."
relatedResearch:
  - "advanced-linkflow-control-hidden-plugin"
  - "wordpresscore-fake-plugin-remote-loader"
  - "wp-compatibility-patch-hidden-admin"
relatedGuides:
  - title: "Known fake and malicious WordPress plugins"
    href: "/blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/"
  - title: "How to recognize obfuscated PHP malware"
    href: "/blog/wordpress-obfuscated-php-malware-detection/"
relatedCaseStudies: []
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "unknown-plugins"
    - "suspicious-files-code"
  searchDescription: "Found an unfamiliar plugin folder with encoded PHP but no matching wp-admin entry? Review the retained wrapper and safe investigation checks."
  summary: "This entry helps owners assess a plugin directory discovered through hosting or file-manager access when the code is encoded or absent from routine plugin review. The available wrapper is suspicious, but its decoded payload was not retained."
  observed:
    - "The investigation found an unfamiliar plugin directory containing an encoded PHP wrapper."
  possible:
    - "The folder may be visible on disk even when its purpose is unclear from the Plugins screen."
    - "A security scanner may flag the encoded file while the public website continues to load normally."
  questions:
    - "Why is there an unknown encoded plugin folder in wp-content/plugins?"
    - "How should I investigate an encoded PHP plugin without running it?"
  evidenceNote: "The wrapper and location are confirmed; behavior hidden inside the unavailable decoded payload is not."
canonical: "https://www.mdpabel.com/malware-research/wp-security-fake-plugin-eval-loader/"
index: true
---

## Summary

This WordPress malware research entry documents fake security plugin encoded loader evidence observed during one anonymized client investigation. The narrow topic is **WP-Security Fake Plugin with an eval Decode Wrapper**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The identity and decode-and-evaluate wrapper are consistent with a fake plugin loader. The encoded body may implement additional behavior, but it was not decoded for this public analysis.

## Investigation context

Anonymized investigation with one filesystem screenshot and retained PHP wrapper source. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

The WP-Security directory existed among installed plugins.

![Filesystem listing showing an uppercase WP-Security directory among WordPress plugins](/wordpress-threats/wp-security-hidden-plugin_evidence-1.png "The screenshot confirms the WP-Security directory in the plugin path. The directory name alone is contextual; the supplied eval wrapper establishes the malicious behavior.")

## Confirmed findings

- A directory named WP-Security was present in wp-content/plugins.
- The supplied file declares a security-themed plugin identity.
- The PHP wrapper nests base64_decode and gzinflate inside eval.

## Technical analysis

### Why the decode wrapper is stronger than the folder name

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```php
/** Plugin Name: WordPress Security */
// encoded body removed
eval(gzinflate(base64_decode('[REDACTED ENCODED PAYLOAD]')));
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The identity and decode-and-evaluate wrapper are consistent with a fake plugin loader. The encoded body may implement additional behavior, but it was not decoded for this public analysis.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `WP-Security directory with the supplied wrapper`
- `Security-themed plugin header plus eval(gzinflate(base64_decode(...)))`
- `Text Domain: wp-security in this artifact`

### Contextual indicators

- `WP-Security`
- `base64_decode()`
- `gzinflate()`
- `eval()`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The decoded payload is not published and its capabilities are not asserted.
- The screenshot does not prove activation or execution.
- The initial access path and any affected legitimate component were not identified.

## Artifact-specific remediation

- Preserve the directory and full encoded sample privately.
- Remove the untrusted plugin directory and compare the entire plugins tree with a known inventory.
- Search for the same header text and nested wrapper.
- Replace altered plugins with trusted copies.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Verify the WP-Security directory does not return.
- Monitor for new plugin directories with security-themed names.
- Repeat the structural wrapper search after scheduled tasks and logins.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [Advanced LinkFlow Control Plugin Concealment and Remote Fetching](/malware-research/advanced-linkflow-control-hidden-plugin/)
- [WordPressCore Fake Plugin with cURL-to-eval Loader Files](/malware-research/wordpresscore-fake-plugin-remote-loader/)
- [WP Compatibility Patch Plugin Creating and Hiding an Administrator](/malware-research/wp-compatibility-patch-hidden-admin/)

## Related guides and case studies

- [Known fake and malicious WordPress plugins](/blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/)
- [How to recognize obfuscated PHP malware](/blog/wordpress-obfuscated-php-malware-detection/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
