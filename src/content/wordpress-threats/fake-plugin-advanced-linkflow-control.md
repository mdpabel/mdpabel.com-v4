---
title: "Advanced LinkFlow Control Hidden Plugin Research"
h1: "Advanced LinkFlow Control Plugin Concealment and Remote Fetching"
slug: "advanced-linkflow-control-hidden-plugin"
description: "Forensic analysis of Advanced LinkFlow Control code that hid its plugin entry and built visitor-context requests to a remote server."
status: "published"
reportDate: "2026-02-03"
lastReviewed: "2026-07-22"
threatCategory: "Fake plugin with conditional fetching"
affectedComponents:
  - "WordPress plugin list"
  - "Plugin initialization hooks"
  - "Outbound HTTP request logic"
observedLocations:
  - "wp-content/plugins/advanced-linkflow-control/advanced-linkflow-control.php"
confirmedBehaviors:
  - "Removes its own plugin entry through all_plugins"
  - "Restores visibility when a request parameter is present"
  - "Builds an outbound request with URI, IP, referrer, language, host, and user-agent values"
  - "Registers early content-insertion and fetch hooks"
confidence: "High"
severity: "High"
severityRationale: "The supplied source directly shows concealment and outbound visitor-context request construction. The returned content and server-side handling were not retained."
evidenceSource: "Anonymized investigation with a plugin-directory screenshot and retained source for advanced-linkflow-control.php"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/advanced-linkflow-control_evidence-1.png"
    alt: "File manager showing the advanced-linkflow-control plugin directory and PHP file"
    caption: "The file manager confirms the advanced-linkflow-control directory and its 13.92 KB PHP file. Directory presence alone does not prove execution; the supplied code establishes the behavior."
    supports: "The named fake-plugin artifact existed in wp-content/plugins"
    width: 1348
    height: 749
    privacyReviewed: true
indicators:
  - value: "Advanced LinkFlow Control"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "advanced-linkflow-control.php"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Advanced_LinkFlow_Control"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "all_plugins self-unset with sp visibility gate"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "all_plugins"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "plugin_basename()"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "wp_remote_get() or cURL"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "cache-flush calls"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The initial access path and affected software version were not identified."
  - "No retained response proves the content returned by the remote server."
  - "The evidence does not establish campaign size, data retention, or a specific visitor outcome."
relatedResearch:
  - "system-control-hidden-backup-restoration"
  - "wp-security-fake-plugin-eval-loader"
  - "wordpresscore-fake-plugin-remote-loader"
relatedGuides:
  - title: "Known fake and malicious WordPress plugins"
    href: "/blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/"
  - title: "Hidden WordPress backdoor investigation"
    href: "/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/"
relatedCaseStudies: []
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "unknown-plugins"
    - "redirects-popups"
  searchDescription: "Found an Advanced LinkFlow Control folder that is missing from WordPress Plugins? Review evidence of plugin-list concealment and remote code loading."
  summary: "This entry is relevant when hosting files contain an unfamiliar plugin directory that does not appear normally in wp-admin. The supplied code used plugin-list filters and a remote response path; the remote response itself was not retained."
  observed:
    - "The investigated filesystem contained an Advanced LinkFlow Control plugin directory with code that filtered plugin-list data."
  possible:
    - "The plugin folder can be visible in hosting tools while the plugin is absent from the normal Plugins screen."
    - "Visitor-facing behavior may change if the remote response path is active, although that response was not captured."
  questions:
    - "Why is a plugin folder present on the server but missing from WordPress?"
    - "Is Advanced LinkFlow Control a legitimate plugin on my site?"
  evidenceNote: "A missing plugin-list row is not proof by itself; compare the filesystem, active plugin data, and supplied code."
canonical: "https://www.mdpabel.com/malware-research/advanced-linkflow-control-hidden-plugin/"
index: true
---

## Summary

This WordPress malware research entry documents fake plugin with conditional fetching evidence observed during one anonymized client investigation. The narrow topic is **Advanced LinkFlow Control Plugin Concealment and Remote Fetching**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The combined self-concealment and visitor-context remote request is consistent with conditional content delivery or cloaking. The evidence does not show what the remote endpoint returned in this investigation.

## Investigation context

Anonymized investigation with a plugin-directory screenshot and retained source for advanced-linkflow-control.php. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

The named fake-plugin artifact existed in wp-content/plugins.

![File manager showing the advanced-linkflow-control plugin directory and PHP file](/wordpress-researches/advanced-linkflow-control_evidence-1.png "The file manager confirms the advanced-linkflow-control directory and its 13.92 KB PHP file. Directory presence alone does not prove execution; the supplied code establishes the behavior.")

## Confirmed findings

- The all_plugins filter unsets plugin_basename(**FILE**) unless a request parameter is present.
- The class stores a hex-escaped remote URL.
- The request builder includes current URI, bot flag, language, IP, referrer, host, and user agent.
- The constructor registers loop and fetch-related hooks.

## Technical analysis

### How the plugin hides from the normal Plugins screen

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```php
add_filter('all_plugins', function ($plugins) {
    if (isset($_GET['sp'])) return $plugins;
    unset($plugins[plugin_basename(__FILE__)]);
    return $plugins;
});
// remote URL and request details defanged elsewhere
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The combined self-concealment and visitor-context remote request is consistent with conditional content delivery or cloaking. The evidence does not show what the remote endpoint returned in this investigation.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `Advanced LinkFlow Control`
- `advanced-linkflow-control.php`
- `Advanced_LinkFlow_Control`
- `all_plugins self-unset with sp visibility gate`

### Contextual indicators

- `all_plugins`
- `plugin_basename()`
- `wp_remote_get() or cURL`
- `cache-flush calls`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The initial access path and affected software version were not identified.
- No retained response proves the content returned by the remote server.
- The evidence does not establish campaign size, data retention, or a specific visitor outcome.

## Artifact-specific remediation

- Preserve the full plugin directory and logs before removal.
- Remove the untrusted directory and compare the plugin inventory with a known-good baseline.
- Search for its class name, directory name, and self-unset filter.
- Review outbound-request logs for the defanged endpoint where available.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Confirm the filesystem and Plugins screen remain consistent.
- Monitor for recreation of the directory or class name.
- Review rendered pages for returned content after normal and crawler-like requests.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [system-control Plugin Restored from wp-content/.sc-backup](/malware-research/system-control-hidden-backup-restoration/)
- [WP-Security Fake Plugin with an eval Decode Wrapper](/malware-research/wp-security-fake-plugin-eval-loader/)
- [WordPressCore Fake Plugin with cURL-to-eval Loader Files](/malware-research/wordpresscore-fake-plugin-remote-loader/)

## Related guides and case studies

- [Known fake and malicious WordPress plugins](/blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/)
- [Hidden WordPress backdoor investigation](/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
